import { NextResponse } from "next/server";
import { z } from "zod";
import contactData from "~/data/contact-cta-data.json";
import {
  type CodigoErrorFormulario,
  ahoraEnLima,
  crearLimitador,
  enUnaLinea,
  escapeHtml,
  escapeHtmlMultilinea,
  ipDelVisitante,
  leerCuerpoConTope,
} from "~/lib/formularios-publicos";
import { MailerNoConfiguradoError, enviarCorreo } from "~/lib/mailer";

/**
 * El formulario de contacto del inicio, de las fichas de casos y de las páginas de servicio
 * (CaseContactCTA). Antes no mandaba nada: hacía un console.log en el navegador y se perdía el
 * mensaje. Ahora llega como correo al buzón que muestra esa misma sección, con responder-a al
 * visitante y el adjunto si lo hay.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** El correo que la sección de contacto publica («contacto directo con nuestro CEO»). */
const DESTINO = contactData.ceo.email;

const MAX_ARCHIVO = 5 * 1024 * 1024;
/** El archivo más los campos de texto y los separadores del multipart. */
const MAX_CUERPO = MAX_ARCHIVO + 256 * 1024;

const limitar = crearLimitador({ maximo: 5, ventanaMs: 10 * 60_000 });

const empiezaCon = (bytes: Uint8Array, firma: number[]) =>
  firma.every((b, i) => bytes[i] === b);

/**
 * Los adjuntos permitidos. Se decide por la extensión y se confirma con los primeros bytes del
 * archivo (el tipo que manda el navegador depende del sistema y no es confiable), así un .exe
 * renombrado a .pdf no llega al buzón.
 */
const ADJUNTOS: Record<
  string,
  { contentType: string; firma: (b: Uint8Array) => boolean }
> = {
  pdf: {
    contentType: "application/pdf",
    firma: (b) => empiezaCon(b, [0x25, 0x50, 0x44, 0x46]), // %PDF
  },
  doc: {
    contentType: "application/msword",
    firma: (b) =>
      empiezaCon(b, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]), // OLE
  },
  docx: {
    contentType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    firma: (b) => empiezaCon(b, [0x50, 0x4b, 0x03, 0x04]), // ZIP
  },
  png: {
    contentType: "image/png",
    firma: (b) =>
      empiezaCon(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  },
  jpg: {
    contentType: "image/jpeg",
    firma: (b) => empiezaCon(b, [0xff, 0xd8, 0xff]),
  },
  jpeg: {
    contentType: "image/jpeg",
    firma: (b) => empiezaCon(b, [0xff, 0xd8, 0xff]),
  },
};

const ORIGENES: Record<string, string> = {
  google: "Google",
  linkedin: "LinkedIn",
  referral: "Referido",
  social: "Redes sociales",
  other: "Otro",
};

const esquema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().max(254).email(),
  message: z.string().trim().min(1).max(5000),
  source: z
    .enum(["google", "linkedin", "referral", "social", "other"])
    .optional(),
  pagina: z.string().trim().max(300).optional(),
});

const error = (
  codigo: CodigoErrorFormulario,
  status: number,
  headers?: Record<string, string>
) => NextResponse.json({ ok: false, error: codigo }, { status, headers });

/** Nombre de archivo sin rutas ni caracteres de control, y corto. */
const nombreSeguro = (nombre: string) =>
  nombre
    .split(/[\\/]/)
    .pop()
    // biome-ignore lint/suspicious/noControlCharactersInRegex: se quitan a propósito
    ?.replace(/[\u0000-\u001f\u007f"]/g, "")
    .trim()
    .slice(-120) || "adjunto";

export async function POST(request: Request) {
  const ip = ipDelVisitante(request);
  const limite = limitar(ip);
  if (!limite.permitido) {
    return error("demasiados_envios", 429, {
      "Retry-After": String(limite.reintentarEnS),
    });
  }

  const tipoContenido = request.headers.get("content-type") ?? "";
  if (!tipoContenido.toLowerCase().startsWith("multipart/form-data")) {
    return error("datos_invalidos", 415);
  }

  const cuerpo = await leerCuerpoConTope(request, MAX_CUERPO);
  if (!cuerpo) return error("archivo_grande", 413);

  let form: FormData;
  try {
    form = await new Response(cuerpo, {
      headers: { "content-type": tipoContenido },
    }).formData();
  } catch {
    return error("datos_invalidos", 400);
  }

  const texto = (clave: string) => {
    const valor = form.get(clave);
    return typeof valor === "string" ? valor : undefined;
  };

  // Honeypot: el campo «website» está oculto para las personas. Si viene lleno es un bot: se le
  // responde como si hubiera salido bien y no se manda nada.
  if (texto("website")?.trim()) {
    console.warn("[contacto] honeypot lleno, envío descartado");
    return NextResponse.json({ ok: true });
  }

  const datos = esquema.safeParse({
    name: texto("name"),
    email: texto("email"),
    message: texto("message"),
    source: texto("source") || undefined,
    pagina: texto("pagina") || undefined,
  });
  if (!datos.success) return error("datos_invalidos", 400);
  const { name, email, message, source, pagina } = datos.data;

  // El adjunto es opcional
  let adjunto: {
    filename: string;
    content: Buffer;
    contentType: string;
  } | null = null;
  const archivo = form.get("file");
  if (archivo && typeof archivo !== "string" && archivo.size > 0) {
    if (archivo.size > MAX_ARCHIVO) return error("archivo_grande", 413);
    const filename = nombreSeguro(archivo.name);
    const extension = filename.split(".").pop()?.toLowerCase() ?? "";
    const tipo = ADJUNTOS[extension];
    const bytes = new Uint8Array(await archivo.arrayBuffer());
    if (!tipo || !tipo.firma(bytes)) return error("archivo_tipo", 415);
    adjunto = {
      filename,
      content: Buffer.from(bytes),
      contentType: tipo.contentType,
    };
  }

  const nombre = enUnaLinea(name);
  const fecha = ahoraEnLima().legible;
  const origen = source ? ORIGENES[source] : undefined;

  const filas: [string, string][] = [
    ["Nombre", escapeHtml(nombre)],
    [
      "Correo",
      `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`,
    ],
    ["Cómo nos conoció", escapeHtml(origen ?? "No lo indicó")],
    ["Página", escapeHtml(pagina ?? "No disponible")],
    ["Fecha", escapeHtml(fecha)],
    ["Adjunto", escapeHtml(adjunto ? adjunto.filename : "Ninguno")],
  ];

  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Nuevo contacto</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1f2937;line-height:1.5;max-width:640px;margin:0 auto;padding:24px">
  <h1 style="font-size:20px;margin:0 0 16px">Nuevo mensaje desde el formulario de axium.com.pe</h1>
  <table style="border-collapse:collapse;width:100%;font-size:14px">
    ${filas
      .map(
        ([etiqueta, valor]) =>
          `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap;vertical-align:top">${etiqueta}</td><td style="padding:6px 0">${valor}</td></tr>`
      )
      .join("\n    ")}
  </table>
  <h2 style="font-size:16px;margin:24px 0 8px">Mensaje</h2>
  <div style="background:#f3f4f6;border-radius:8px;padding:16px;font-size:14px">${escapeHtmlMultilinea(message)}</div>
  <p style="font-size:12px;color:#6b7280;margin-top:24px">Responde a este correo para contestarle directamente a ${escapeHtml(nombre)}.</p>
</body></html>`;

  const text = [
    "Nuevo mensaje desde el formulario de axium.com.pe",
    "",
    `Nombre: ${nombre}`,
    `Correo: ${email}`,
    `Cómo nos conoció: ${origen ?? "No lo indicó"}`,
    `Página: ${pagina ?? "No disponible"}`,
    `Fecha: ${fecha}`,
    `Adjunto: ${adjunto ? adjunto.filename : "Ninguno"}`,
    "",
    "Mensaje:",
    message,
  ].join("\n");

  try {
    await enviarCorreo({
      to: DESTINO,
      replyTo: { name: nombre, address: email },
      subject: `Nuevo contacto desde la web: ${nombre}`.slice(0, 160),
      html,
      text,
      attachments: adjunto ? [adjunto] : undefined,
    });
  } catch (e) {
    if (e instanceof MailerNoConfiguradoError) {
      console.error(
        `[contacto] El correo no está configurado; faltan: ${e.faltan.join(", ")}`
      );
      return error("correo_no_configurado", 503);
    }
    console.error(
      "[contacto] Falló el envío:",
      e instanceof Error ? e.message : String(e)
    );
    return error("envio_fallido", 502);
  }

  return NextResponse.json({ ok: true });
}
