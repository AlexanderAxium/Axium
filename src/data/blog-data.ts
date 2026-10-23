/** Slugs y assets de entradas del blog. Contenido traducido en locales/{es,en,pt}/blog.json */
export const BLOG_SLUGS = [
  "agentes-de-ia-en-produccion",
  "facturacion-electronica-tienda-online",
  "antes-de-publicar-tu-web",
  "transformacion-digital",
  "metodologias-agiles",
  "ia-en-el-negocio",
] as const;

export type BlogSlug = (typeof BLOG_SLUGS)[number];

/** La foto de stock de cada entrada vieja. Desde el 2026-10-21 las portadas son PortadaBlog (en
 *  código); solo «ia-en-el-negocio» usa la suya, desenfocada. */
export const BLOG_IMAGES: Record<BlogSlug, string> = {
  "agentes-de-ia-en-produccion": "/blog/ai-business.jpg",
  "facturacion-electronica-tienda-online": "/blog/digital-transformation.jpg",
  "antes-de-publicar-tu-web": "/blog/digital-transformation.jpg",
  "transformacion-digital": "/blog/digital-transformation.jpg",
  "metodologias-agiles": "/blog/agile-software.jpg",
  "ia-en-el-negocio": "/blog/ai-business.jpg",
};

export function getBlogImage(slug: string): string {
  return BLOG_IMAGES[slug as BlogSlug] ?? "/blog/placeholder.jpg";
}

/** La foto de la portada de cada entrada (la de PortadaBlog, sin lo que se le monta encima): es la
 *  imagen que se ve al compartir el artículo y la de su BlogPosting (2026-10-23). */
export const BLOG_PORTADAS: Record<BlogSlug, string> = {
  "agentes-de-ia-en-produccion": "/blog/portada-operaciones.jpg",
  "facturacion-electronica-tienda-online": "/blog/portada-venta.jpg",
  "antes-de-publicar-tu-web": "/blog/portada-revision.jpg",
  "transformacion-digital": "/blog/portada-inventario.jpg",
  "metodologias-agiles": "/blog/portada-tablero.jpg",
  "ia-en-el-negocio": "/blog/portada-asistente.jpg",
};

const MESES: Record<string, string> = {
  ene: "01",
  feb: "02",
  mar: "03",
  abr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  ago: "08",
  sep: "09",
  set: "09",
  oct: "10",
  nov: "11",
  dic: "12",
};

/** «21 Oct 2026» → «2026-10-21» (las fechas del blog vienen escritas en español). */
export function fechaIso(fecha: string) {
  const [d, m, a] = fecha.trim().split(/\s+/);
  const mes = MESES[(m ?? "").slice(0, 3).toLowerCase()];
  return mes && d && a ? `${a}-${mes}-${d.padStart(2, "0")}` : undefined;
}
