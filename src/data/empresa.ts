/**
 * Los datos legales de la empresa, tal como figuran en SUNAT (Alexander, 2026-10-23). Un solo
 * lugar para el pie, las páginas legales y los datos estructurados. El domicilio fiscal se
 * publica solo hasta la provincia: el que hay («Int. 3 Lote 41») no tiene calle todavía.
 */
export const EMPRESA = {
  razonSocial: "AXIUM S.A.C.",
  ruc: "20615157539",
  domicilio: "Callao, Perú",
  /** inicio de actividades en SUNAT */
  inicio: "2025-12-01",
} as const;

/**
 * El buzón del Libro de Reclamaciones: el que publica la página y el que recibe cada hoja que se
 * envía desde ella (también es el responder-a de la copia que recibe el consumidor).
 */
export const CORREO_RECLAMOS = "reclamos@axium.com.pe";

/**
 * Los perfiles de Axium en redes: alimentan el pie y el `sameAs` del Organization (SEO-76). Vacío
 * a propósito: el 2026-11-13 no había ningún perfil documentado (ni en el repo, ni en secretario,
 * ni en AXIUM-SAC), y el pie decía «no colocar redes sociales» por pedido de Alexander. Solo se
 * agrega el perfil que existe y que Alexander confirme, con su URL exacta; con uno basta para que
 * aparezcan el bloque del pie y el `sameAs`.
 */
export const REDES: readonly { red: string; url: string }[] = [];
