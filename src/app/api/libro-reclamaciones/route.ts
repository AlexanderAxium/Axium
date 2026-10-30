import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { CORREO_RECLAMOS, EMPRESA } from "~/data/empresa";
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
 * El Libro de Reclamaciones virtual (Ley 29571, DS 011-2011-PCM). Antes esperaba 2 s y decía
 * «Reclamo enviado» sin mandar nada. Ahora cada hoja llega al buzón de reclamos y el consumidor
 * recibe su copia, las dos con el mismo código.
 *
 * El código es fecha + identificador aleatorio, NO un correlativo: un número correlativo
 * necesita una tabla en la base, y eso queda para cuando se decida guardarlos.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_CUERPO = 64 * 1024;
/** El plazo legal de respuesta. Confirmar con Alexander antes de cambiarlo. */
const PLAZO_RESPUESTA = "15 días hábiles";

const limitar = crearLimitador({ maximo: 5, ventanaMs: 10 * 60_000 });

const TIPOS = {
  reclamo: {
    titulo: "Reclamo",
    definicion: "Disconformidad relacionada con los servicios contratados.",
  },
  queja: {
    titulo: "Queja",
    definicion:
      "Disconformidad no relacionada con los servicios, o malestar o descontento respecto a la atención al público.",
  },
} as const;

const MOTIVOS = {
  service: "Disconformidad con el servicio recibido",
  billing: "Problema de facturación o pago",
  delivery: "Incumplimiento de plazo de entrega",
  quality: "Calidad del entregable",
  support: "Atención al cliente",
  other: "Otro",
} as const;

const DOCUMENTOS = {
  dni: "DNI",
  passport: "Pasaporte",
  ce: "Carné de Extranjería",
} as const;

const claves = <T extends Record<string, unknown>>(o: T) =>
  Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];

const esquema = z.object({
  tipo: z.enum(claves(TIPOS)),
  name: z.string().trim().min(1).max(150),
  email: z.string().trim().max(254).email(),
  phone: z.string().trim().max(30).default(""),
  documentType: z
    .union([z.enum(claves(DOCUMENTOS)), z.literal("")])
    .default(""),
  documentNumber: z.string().trim().max(20).default(""),
  complaintType: z.enum(claves(MOTIVOS)),
  subject: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  expectedResolution: z.string().trim().max(2000).default(""),
  website: z.string().optional(),
});

/** Sin 0/O, 1/I/L ni U: se dicta por teléfono sin confundirse. */
const ALFABETO = "23456789ABCDEFGHJKMNPQRSTVWXYZ";
const codigoNuevo = (compacta: string) => {
  const azar = Array.from(
    randomBytes(6),
    (b) => ALFABETO[b % ALFABETO.length]
  ).join("");
  return `LR-${compacta}-${azar}`;
};

const error = (
  codigo: CodigoErrorFormulario,
  status: number,
  headers?: Record<string, string>
) => NextResponse.json({ ok: false, error: codigo }, { status, headers });

const AVISO_INDECOPI =
  "La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.";

export async function POST(request: Request) {
  const limite = limitar(ipDelVisitante(request));
  if (!limite.permitido) {
    return error("demasiados_envios", 429, {
      "Retry-After": String(limite.reintentarEnS),
    });
  }

  const cuerpo = await leerCuerpoConTope(request, MAX_CUERPO);
  if (!cuerpo) return error("datos_invalidos", 413);

  let json: unknown;
  try {
    json = JSON.parse(new TextDecoder().decode(cuerpo));
  } catch {
    return error("datos_invalidos", 400);
  }

  const fecha = ahoraEnLima();
  const codigo = codigoNuevo(fecha.compacta);

  // Honeypot: oculto para las personas; lleno = bot. Se le responde igual que a un envío bueno
  // (un bot no distingue) y no sale nada: sin esto, el formulario serviría para mandar correos
  // con texto ajeno a cualquier dirección. Queda en el log con su código por si alguna vez
  // fuera una persona.
  if (
    json &&
    typeof json === "object" &&
    typeof (json as { website?: unknown }).website === "string" &&
    (json as { website: string }).website.trim()
  ) {
    console.warn(
      `[libro-reclamaciones] honeypot lleno, envío descartado (código ${codigo})`
    );
    return NextResponse.json({ ok: true, codigo, copiaEnviada: true });
  }

  const datos = esquema.safeParse(json);
  if (!datos.success) return error("datos_invalidos", 400);
  const d = datos.data;
  const tipo = TIPOS[d.tipo];
  const nombre = enUnaLinea(d.name);
  const documento = d.documentType
    ? `${DOCUMENTOS[d.documentType]} ${d.documentNumber || "(sin número)"}`
    : d.documentNumber || "No indicado";

  const filas = (pares: [string, string][]) =>
    pares
      .map(
        ([etiqueta, valor]) =>
          `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;vertical-align:top;width:40%">${escapeHtml(etiqueta)}</td><td style="padding:6px 0">${valor}</td></tr>`
      )
      .join("");

  const tabla = (titulo: string, pares: [string, string][]) =>
    `<h2 style="font-size:15px;margin:24px 0 8px">${escapeHtml(titulo)}</h2><table style="border-collapse:collapse;width:100%;font-size:14px">${filas(pares)}</table>`;

  const bloque = (titulo: string, texto: string) =>
    `<h2 style="font-size:15px;margin:24px 0 8px">${escapeHtml(titulo)}</h2><div style="background:#f3f4f6;border-radius:8px;padding:14px;font-size:14px">${escapeHtmlMultilinea(texto)}</div>`;

  const hoja = [
    tabla("Hoja de reclamación", [
      ["Código", `<strong>${escapeHtml(codigo)}</strong>`],
      ["Fecha de registro", escapeHtml(fecha.legible)],
      [
        "Proveedor",
        escapeHtml(
          `${EMPRESA.razonSocial}, RUC ${EMPRESA.ruc}, ${EMPRESA.domicilio}`
        ),
      ],
    ]),
    tabla("Identificación del consumidor", [
      ["Nombre completo", escapeHtml(nombre)],
      ["Documento", escapeHtml(documento)],
      ["Correo electrónico", escapeHtml(d.email)],
      ["Teléfono", escapeHtml(d.phone || "No indicado")],
    ]),
    tabla("Detalle", [
      [
        "Tipo",
        `${escapeHtml(tipo.titulo)}<br><span style="color:#6b7280;font-size:12px">${escapeHtml(tipo.definicion)}</span>`,
      ],
      ["Motivo", escapeHtml(MOTIVOS[d.complaintType])],
      ["Asunto", escapeHtml(enUnaLinea(d.subject))],
    ]),
    bloque("Descripción", d.description),
    bloque("Pedido del consumidor", d.expectedResolution || "No indicado"),
  ].join("");

  const hojaTexto = [
    `Código: ${codigo}`,
    `Fecha de registro: ${fecha.legible}`,
    `Proveedor: ${EMPRESA.razonSocial}, RUC ${EMPRESA.ruc}, ${EMPRESA.domicilio}`,
    "",
    `Nombre completo: ${nombre}`,
    `Documento: ${documento}`,
    `Correo electrónico: ${d.email}`,
    `Teléfono: ${d.phone || "No indicado"}`,
    "",
    `Tipo: ${tipo.titulo} (${tipo.definicion})`,
    `Motivo: ${MOTIVOS[d.complaintType]}`,
    `Asunto: ${enUnaLinea(d.subject)}`,
    "",
    "Descripción:",
    d.description,
    "",
    "Pedido del consumidor:",
    d.expectedResolution || "No indicado",
  ].join("\n");

  const envoltorio = (titulo: string, intro: string, pie: string) =>
    `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>${escapeHtml(titulo)}</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1f2937;line-height:1.5;max-width:640px;margin:0 auto;padding:24px">
  <h1 style="font-size:20px;margin:0 0 12px">${escapeHtml(titulo)}</h1>
  ${intro}
  ${hoja}
  <p style="font-size:12px;color:#6b7280;margin-top:24px">${pie}</p>
</body></html>`;

  // 1) Al buzón de reclamos. Si esto falla no hay reclamo registrado y se le dice al consumidor.
  try {
    await enviarCorreo({
      to: CORREO_RECLAMOS,
      replyTo: { name: nombre, address: d.email },
      subject:
        `[${codigo}] ${tipo.titulo} en el Libro de Reclamaciones: ${enUnaLinea(d.subject)}`.slice(
          0,
          180
        ),
      html: envoltorio(
        `${tipo.titulo} ${codigo}`,
        `<p style="font-size:14px">Llegó una hoja nueva al Libro de Reclamaciones de axium.com.pe. Hay que responderla en un plazo máximo de <strong>${PLAZO_RESPUESTA}</strong>. Responder a este correo le escribe directamente al consumidor.</p>`,
        escapeHtml(AVISO_INDECOPI)
      ),
      text: [
        `${tipo.titulo} ${codigo} en el Libro de Reclamaciones de axium.com.pe.`,
        `Plazo máximo de respuesta: ${PLAZO_RESPUESTA}.`,
        "",
        hojaTexto,
      ].join("\n"),
    });
  } catch (e) {
    if (e instanceof MailerNoConfiguradoError) {
      console.error(
        `[libro-reclamaciones] El correo no está configurado; faltan: ${e.faltan.join(", ")}`
      );
      return error("correo_no_configurado", 503);
    }
    console.error(
      "[libro-reclamaciones] Falló el envío al buzón:",
      e instanceof Error ? e.message : String(e)
    );
    return error("envio_fallido", 502);
  }

  // 2) La copia al consumidor. El reclamo ya quedó registrado: si esto falla, se avisa en
  // pantalla para que guarde el código, pero no se presenta como error.
  let copiaEnviada = true;
  try {
    await enviarCorreo({
      to: { name: nombre, address: d.email },
      replyTo: CORREO_RECLAMOS,
      subject: `Constancia de su ${tipo.titulo.toLowerCase()} ${codigo} en el Libro de Reclamaciones de ${EMPRESA.razonSocial}`,
      html: envoltorio(
        `Registramos su ${tipo.titulo.toLowerCase()}`,
        `<p style="font-size:14px">Hola ${escapeHtml(nombre)}: esta es la constancia de la hoja que registró en nuestro Libro de Reclamaciones. Guarde el código <strong>${escapeHtml(codigo)}</strong>. Le responderemos a este correo en un plazo máximo de <strong>${PLAZO_RESPUESTA}</strong>. Si quiere agregar información, responda a este mensaje o escriba a ${escapeHtml(CORREO_RECLAMOS)} indicando el código.</p>`,
        `${escapeHtml(AVISO_INDECOPI)}<br><br>${escapeHtml(EMPRESA.razonSocial)} · RUC ${escapeHtml(EMPRESA.ruc)} · ${escapeHtml(EMPRESA.domicilio)}`
      ),
      text: [
        `Registramos su ${tipo.titulo.toLowerCase()} en el Libro de Reclamaciones de ${EMPRESA.razonSocial}.`,
        `Guarde el código ${codigo}. Le responderemos a este correo en un plazo máximo de ${PLAZO_RESPUESTA}.`,
        `Para agregar información, responda a este mensaje o escriba a ${CORREO_RECLAMOS} indicando el código.`,
        "",
        hojaTexto,
        "",
        AVISO_INDECOPI,
      ].join("\n"),
    });
  } catch (e) {
    copiaEnviada = false;
    console.error(
      `[libro-reclamaciones] ${codigo}: no salió la copia al consumidor:`,
      e instanceof Error ? e.message : String(e)
    );
  }

  return NextResponse.json({ ok: true, codigo, copiaEnviada });
}
