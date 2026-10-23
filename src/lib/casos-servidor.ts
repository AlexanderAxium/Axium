import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Los casos publicados, leídos de las carpetas de rutas (no de cases-data, que lista 32 y solo 14
 * con slug), con su ficha de `src/data/cases`. Solo para el servidor y en páginas estáticas: se
 * lee una vez al compilar, y un caso nuevo entra solo en el próximo build. Lo usan el sitemap y
 * los datos estructurados del portafolio (2026-10-23).
 */
const CASOS = join(process.cwd(), "src/app/(public)/casos-de-exito");

export type CasoPublicado = {
  slug: string;
  titulo: string;
  imagen?: string;
  publicado?: string;
};

export function casosPublicados(): CasoPublicado[] {
  return readdirSync(CASOS, { withFileTypes: true })
    .filter(
      (d) => d.isDirectory() && existsSync(join(CASOS, d.name, "page.tsx"))
    )
    .map((d) => {
      const json = join(process.cwd(), "src/data/cases", `${d.name}.json`);
      const datos = existsSync(json)
        ? (JSON.parse(readFileSync(json, "utf8")) as {
            title?: string;
            image?: string;
            publishedDate?: string;
          })
        : {};
      return {
        slug: d.name,
        titulo: datos.title ?? d.name,
        imagen: datos.image,
        publicado: datos.publishedDate,
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}
