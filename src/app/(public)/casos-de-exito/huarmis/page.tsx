import data from "~/data/cases/huarmis.json";
import { metaPagina, resumen } from "~/lib/seo";
import HuarmisContent from "./HuarmisContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/huarmis",
  imagen: data.image,
});

export default function HuarmisPage() {
  return <HuarmisContent />;
}
