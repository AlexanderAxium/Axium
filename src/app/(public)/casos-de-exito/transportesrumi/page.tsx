import data from "~/data/cases/transportesrumi.json";
import { metaPagina, resumen } from "~/lib/seo";
import TransportesrumiContent from "./TransportesrumiContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/transportesrumi",
  imagen: data.image,
});

export default function TransportesrumiPage() {
  return <TransportesrumiContent />;
}
