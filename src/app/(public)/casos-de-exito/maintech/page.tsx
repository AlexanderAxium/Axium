import data from "~/data/cases/maintech.json";
import { metaPagina, resumen } from "~/lib/seo";
import MaintechContent from "./MaintechContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/maintech",
  imagen: data.image,
});

export default function MaintechPage() {
  return <MaintechContent />;
}
