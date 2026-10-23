import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { BLOG_SLUGS, fechaIso } from "~/data/blog-data";
import { PAGINAS_SERVICIO } from "~/data/servicios-paginas";
import { SITIO } from "~/lib/seo";
import blog from "~/locales/es/blog.json";

/**
 * El mapa del sitio (rehecho el 2026-10-23). Antes traía anclas del inicio (/#servicios, que
 * Google no indexa como páginas), el acceso y el registro, y le faltaban los 45 casos, el
 * portafolio, el blog y sus artículos. Ahora va cada página pública real, con la fecha que se
 * conoce de cada una (la del artículo o la del caso) y, si no, la de la última revisión del sitio.
 *
 * Los casos salen de las carpetas de rutas (no de cases-data, que lista 32 y solo 14 con slug), y
 * como es estático eso se lee una vez, al compilar: un caso nuevo entra solo en el próximo build.
 */
export const dynamic = "force-static";

const REVISION = "2026-10-23";
const CASOS = join(process.cwd(), "src/app/(public)/casos-de-exito");

function casos() {
  return readdirSync(CASOS, { withFileTypes: true })
    .filter(
      (d) => d.isDirectory() && existsSync(join(CASOS, d.name, "page.tsx"))
    )
    .map((d) => {
      const json = join(process.cwd(), "src/data/cases", `${d.name}.json`);
      const datos = existsSync(json)
        ? (JSON.parse(readFileSync(json, "utf8")) as { publishedDate?: string })
        : {};
      return { slug: d.name, fecha: fechaCaso(datos.publishedDate) };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
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
