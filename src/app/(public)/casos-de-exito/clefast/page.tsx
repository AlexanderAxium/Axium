import data from "~/data/cases/clefast.json";
import { metaPagina, resumen } from "~/lib/seo";
import ClefastContent from "./ClefastContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/clefast",
  imagen: data.image,
});

export default function ClefastPage() {
  return <ClefastContent />;
}
