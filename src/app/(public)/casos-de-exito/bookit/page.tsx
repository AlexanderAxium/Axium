import data from "~/data/cases/bookit.json";
import { metaPagina, resumen } from "~/lib/seo";
import BookitContent from "./BookitContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/bookit",
  imagen: data.image,
});

export default function BookitPage() {
  return <BookitContent />;
}
