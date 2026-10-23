import data from "~/data/cases/alyer.json";
import { metaPagina, resumen } from "~/lib/seo";
import AlyerContent from "./AlyerContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/alyer",
  imagen: data.image,
});

export default function AlyerPage() {
  return <AlyerContent />;
}
