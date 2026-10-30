import "server-only";

/**
 * Lo que comparten los formularios públicos del sitio (contacto y libro de reclamaciones):
 * escape de HTML para los correos, IP del visitante, límite de envíos por IP y lectura del
 * cuerpo con tope de bytes.
 */

/** Escapa texto del visitante antes de meterlo en el HTML de un correo. Una sola vez. */
export const escapeHtml = (valor: string): string =>
  valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Texto multilínea escapado, con los saltos de línea como <br>. */
export const escapeHtmlMultilinea = (valor: string): string =>
  escapeHtml(valor).replace(/\r?\n/g, "<br>");

/** Para un encabezado (asunto, nombre): sin saltos de línea ni tabulaciones. */
export const enUnaLinea = (valor: string): string =>
  valor.replace(/[\r\n\t]+/g, " ").trim();

/**
 * La IP del visitante. El sitio va detrás de Traefik (Dokploy) sin Cloudflare: Traefik agrega
 * la IP real al FINAL de x-forwarded-for, y lo que venga antes lo puede escribir el cliente.
 */
export const ipDelVisitante = (request: Request): string => {
  const reenviada = request.headers.get("x-forwarded-for");
  if (reenviada) {
    const ultima = reenviada.split(",").pop()?.trim();
    if (ultima) return ultima;
  }
  return request.headers.get("x-real-ip")?.trim() || "desconocida";
};

/**
 * Límite de envíos por clave en una ventana deslizante, EN MEMORIA del proceso. Vale porque
 * producción corre una sola réplica; con dos o más, cada una contaría por su lado y el límite
 * real se multiplicaría. Se reinicia con cada deploy.
 */
export const crearLimitador = ({
  maximo,
  ventanaMs,
}: {
  maximo: number;
  ventanaMs: number;
}) => {
  const intentos = new Map<string, number[]>();
  let ultimaLimpieza = Date.now();

  return (clave: string): { permitido: boolean; reintentarEnS: number } => {
    const ahora = Date.now();

    // Barrido ocasional para que el mapa no crezca sin fin con IPs que no vuelven
    if (ahora - ultimaLimpieza > ventanaMs) {
      for (const [k, marcas] of intentos) {
        if (marcas.every((t) => ahora - t >= ventanaMs)) intentos.delete(k);
      }
      ultimaLimpieza = ahora;
    }

    const recientes = (intentos.get(clave) ?? []).filter(
      (t) => ahora - t < ventanaMs
    );
    if (recientes.length >= maximo) {
      const masVieja = recientes[0] ?? ahora;
      intentos.set(clave, recientes);
      return {
        permitido: false,
        reintentarEnS: Math.max(
          1,
          Math.ceil((ventanaMs - (ahora - masVieja)) / 1000)
        ),
      };
    }
    recientes.push(ahora);
    intentos.set(clave, recientes);
    return { permitido: true, reintentarEnS: 0 };
  };
};

/**
 * Lee el cuerpo cortando apenas pasa de `maxBytes`, para que nadie nos haga cargar en memoria
 * un envío gigante (un Route Handler no tiene tope propio). null = se pasó del tope.
 */
export const leerCuerpoConTope = async (
  request: Request,
  maxBytes: number
): Promise<Uint8Array<ArrayBuffer> | null> => {
  const declarado = Number(request.headers.get("content-length"));
  if (Number.isFinite(declarado) && declarado > maxBytes) return null;
  if (!request.body) return new Uint8Array(0);

  const lector = request.body.getReader();
  const trozos: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await lector.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await lector.cancel();
      return null;
    }
    trozos.push(value);
  }
  const cuerpo = new Uint8Array(total);
  let desde = 0;
  for (const trozo of trozos) {
    cuerpo.set(trozo, desde);
    desde += trozo.byteLength;
  }
  return cuerpo;
};

/** Fecha y hora en Lima, para los correos y el código del reclamo. */
export const ahoraEnLima = (fecha = new Date()) => {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .formatToParts(fecha)
      .map((p) => [p.type, p.value])
  ) as Record<string, string>;
  const hora = partes.hour === "24" ? "00" : partes.hour;
  return {
    compacta: `${partes.year}${partes.month}${partes.day}`,
    legible: `${partes.day}/${partes.month}/${partes.year} ${hora}:${partes.minute} (hora de Lima)`,
  };
};

export type RespuestaFormulario =
  | { ok: true; [extra: string]: unknown }
  | { ok: false; error: CodigoErrorFormulario };

/** Los códigos que entiende la interfaz para mostrar el mensaje correcto. */
export type CodigoErrorFormulario =
  | "datos_invalidos"
  | "archivo_grande"
  | "archivo_tipo"
  | "demasiados_envios"
  | "correo_no_configurado"
  | "envio_fallido";
