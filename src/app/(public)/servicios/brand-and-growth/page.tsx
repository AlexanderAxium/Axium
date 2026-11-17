import { JsonLd } from "~/components/StructuredData";
import { PaginaServicio } from "~/components/axium/pagina-servicio";
import { PAGINAS_SERVICIO } from "~/data/servicios-paginas";
import { metaPagina } from "~/lib/seo";
import { esquemaServicio } from "~/lib/structured-data";

const { meta, slug } = PAGINAS_SERVICIO.marca;

// el canonical propio (sin él heredaba el del inicio y Google la tomaba por un duplicado) y su
// pieza para redes
export const metadata = metaPagina({
  titulo: meta.titulo,
  descripcion: meta.descripcion,
  ruta: `/servicios/${slug}`,
  imagen: "/og/og-servicio-diseno.jpg",
});

// Marca y crecimiento (2026-11-17): reemplaza a «Diseño de producto y marca» (/servicios/design-branding,
// que redirige aquí). La pieza para redes sigue siendo la de diseño hasta que tenga la suya.
// el molde de las páginas de servicio (2026-10-22); la página anterior (?v=anterior) se borró el
// 2026-10-23
export default function Page() {
  return (
    <>
      <JsonLd datos={esquemaServicio("marca")} />
      <PaginaServicio id="marca" />
    </>
  );
}
