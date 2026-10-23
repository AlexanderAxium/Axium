import data from "~/data/cases/moviflex.json";
import { metaPagina, resumen } from "~/lib/seo";
import MoviflexContent from "./MoviflexContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/moviflex",
  imagen: data.image,
});

export default function MoviflexPage() {
  return <MoviflexContent />;
}
