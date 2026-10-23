import data from "~/data/cases/sportt.json";
import { metaPagina, resumen } from "~/lib/seo";
import SporttContent from "./SporttContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/sportt",
  imagen: data.image,
});

export default function SporttPage() {
  return <SporttContent />;
}
