import data from "~/data/cases/volveravivir.json";
import { metaPagina, resumen } from "~/lib/seo";
import VolveravivirContent from "./VolveravivirContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/volveravivir",
  imagen: data.image,
});

export default function VolveravivirPage() {
  return <VolveravivirContent />;
}
