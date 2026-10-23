import data from "~/data/cases/ambientalpe.json";
import { metaPagina, resumen } from "~/lib/seo";
import AmbientalpeContent from "./AmbientalpeContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/ambientalpe",
  imagen: data.image,
});

export default function AmbientalpePage() {
  return <AmbientalpeContent />;
}
