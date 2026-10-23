import data from "~/data/cases/fenalsa.json";
import { metaPagina, resumen } from "~/lib/seo";
import FenalsaContent from "./FenalsaContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/fenalsa",
  imagen: data.image,
});

export default function FenalsaPage() {
  return <FenalsaContent />;
}
