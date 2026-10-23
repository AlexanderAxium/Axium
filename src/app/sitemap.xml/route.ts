import { NextResponse } from "next/server";
import { BLOG_SLUGS, fechaIso } from "~/data/blog-data";
import { PAGINAS_SERVICIO } from "~/data/servicios-paginas";
import { casosPublicados } from "~/lib/casos-servidor";
import { SITIO } from "~/lib/seo";
import blog from "~/locales/es/blog.json";

/**
 * El mapa del sitio (rehecho el 2026-10-23). Antes traía anclas del inicio (/#servicios, que
 * Google no indexa como páginas), el acceso y el registro, y le faltaban los 45 casos, el
 * portafolio, el blog y sus artículos. Ahora va cada página pública real, con la fecha que se
 * conoce de cada una (la del artículo o la del caso) y, si no, la de la última revisión del sitio.
 *
 * Los casos salen de `casosPublicados` (las carpetas de rutas), leídos una vez al compilar.
 */
export const dynamic = "force-static";

const REVISION = "2026-10-23";
function casos() {
  return casosPublicados().map((c) => ({
    slug: c.slug,
    fecha: fechaCaso(c.publicado),
  }));
}

function fechaCaso(f?: string) {
  const d = f ? new Date(f) : null;
  return d && !Number.isNaN(d.getTime())
    ? d.toISOString().slice(0, 10)
    : REVISION;
}

export function GET() {
  const posts = blog.posts as Record<string, { date: string }>;
  const urls: { ruta: string; fecha: string; prioridad: number }[] = [
    { ruta: "/", fecha: REVISION, prioridad: 1 },
    ...Object.values(PAGINAS_SERVICIO).map((p) => ({
      ruta: `/servicios/${p.slug}`,
      fecha: REVISION,
      prioridad: 0.9,
    })),
    { ruta: "/portafolio", fecha: REVISION, prioridad: 0.8 },
    ...casos().map((c) => ({
      ruta: `/casos-de-exito/${c.slug}`,
      fecha: c.fecha,
      prioridad: 0.7,
    })),
    { ruta: "/blog", fecha: REVISION, prioridad: 0.7 },
    ...BLOG_SLUGS.map((s) => ({
      ruta: `/blog/${s}`,
      fecha: fechaIso(posts[s]?.date ?? "") ?? REVISION,
      prioridad: 0.6,
    })),
    ...["privacy", "terms", "cookies", "complaints"].map((l) => ({
      ruta: `/legal/${l}`,
      fecha: REVISION,
      prioridad: 0.2,
    })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITIO}${u.ruta === "/" ? "" : u.ruta}</loc>
    <lastmod>${u.fecha}</lastmod>
    <priority>${u.prioridad.toFixed(1)}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
