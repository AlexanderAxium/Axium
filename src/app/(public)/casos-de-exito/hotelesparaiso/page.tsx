import data from "~/data/cases/hotelesparaiso.json";
import { metaPagina, resumen } from "~/lib/seo";
import HotelesparaisoContent from "./HotelesparaisoContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/hotelesparaiso",
  imagen: data.image,
});

export default function HotelesparaisoPage() {
  return <HotelesparaisoContent />;
}
