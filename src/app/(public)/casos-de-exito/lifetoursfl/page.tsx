import data from "~/data/cases/lifetoursfl.json";
import { metaPagina, resumen } from "~/lib/seo";
import LifetoursflContent from "./LifetoursflContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/lifetoursfl",
  imagen: data.image,
});

export default function LifetoursflPage() {
  return <LifetoursflContent />;
}
