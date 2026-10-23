import data from "~/data/cases/jarumi.json";
import { metaPagina, resumen } from "~/lib/seo";
import JarumiContent from "./JarumiContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/jarumi",
  imagen: data.image,
});

export default function JarumiPage() {
  return <JarumiContent />;
}
