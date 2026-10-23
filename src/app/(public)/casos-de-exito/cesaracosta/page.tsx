import data from "~/data/cases/cesaracosta.json";
import { metaPagina, resumen } from "~/lib/seo";
import CesaracostaContent from "./CesaracostaContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/cesaracosta",
  imagen: data.image,
});

export default function CesaracostaPage() {
  return <CesaracostaContent />;
}
