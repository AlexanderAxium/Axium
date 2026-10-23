import data from "~/data/cases/anjsports.json";
import { metaPagina, resumen } from "~/lib/seo";
import AnjsportsContent from "./AnjsportsContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/anjsports",
  imagen: data.image,
});

export default function AnjsportsPage() {
  return <AnjsportsContent />;
}
