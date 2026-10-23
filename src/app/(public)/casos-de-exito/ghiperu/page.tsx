import data from "~/data/cases/ghiperu.json";
import { metaPagina, resumen } from "~/lib/seo";
import GhiperuContent from "./GhiperuContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/ghiperu",
  imagen: data.image,
});

export default function GhiperuPage() {
  return <GhiperuContent />;
}
