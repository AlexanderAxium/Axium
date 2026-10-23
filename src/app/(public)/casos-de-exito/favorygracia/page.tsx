import data from "~/data/cases/favorygracia.json";
import { metaPagina, resumen } from "~/lib/seo";
import FavorygraciaContent from "./FavorygraciaContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/favorygracia",
  imagen: data.image,
});

export default function FavorygraciaPage() {
  return <FavorygraciaContent />;
}
