import data from "~/data/cases/feniz.json";
import { metaPagina, resumen } from "~/lib/seo";
import FenizContent from "./FenizContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/feniz",
  imagen: data.image,
});

export default function FenizPage() {
  return <FenizContent />;
}
