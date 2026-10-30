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
