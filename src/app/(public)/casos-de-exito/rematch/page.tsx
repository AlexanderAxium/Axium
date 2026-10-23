import data from "~/data/cases/rematch.json";
import { metaPagina, resumen } from "~/lib/seo";
import RematchContent from "./RematchContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/rematch",
  imagen: data.image,
});

export default function RematchPage() {
  return <RematchContent />;
}
