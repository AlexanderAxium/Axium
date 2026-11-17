import { JsonLd } from "~/components/StructuredData";
import { PaginaServicio } from "~/components/axium/pagina-servicio";
import { PAGINAS_SERVICIO } from "~/data/servicios-paginas";
import { metaPagina } from "~/lib/seo";
import { esquemaServicio } from "~/lib/structured-data";

const { meta, slug } = PAGINAS_SERVICIO.apps;

// el canonical propio (sin él heredaba el del inicio y Google la tomaba por un duplicado) y su
// pieza para redes
export const metadata = metaPagina({
  titulo: meta.titulo,
  descripcion: meta.descripcion,
  ruta: `/servicios/${slug}`,
  imagen: "/og/og-servicio-web.jpg",
});

// Apps y diseño de producto (2026-11-17): las apps salieron de Webs y el UX/UI de Diseño. Usa la pieza para
// redes de Webs hasta que tenga la suya.
// el molde de las páginas de servicio (2026-10-22); la página anterior (?v=anterior) se borró el
// 2026-10-23
export default function Page() {
  return (
    <>
      <JsonLd datos={esquemaServicio("apps")} />
      <PaginaServicio id="apps" />
    </>
  );
}
