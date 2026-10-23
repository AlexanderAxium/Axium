import data from "~/data/cases/siclo.json";
import { metaPagina, resumen } from "~/lib/seo";
import SicloContent from "./SicloContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/siclo",
  imagen: data.image,
});

export default function SicloPage() {
  return <SicloContent />;
}
