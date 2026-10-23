import data from "~/data/cases/vitalchain.json";
import { metaPagina, resumen } from "~/lib/seo";
import VitalchainContent from "./VitalchainContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/vitalchain",
  imagen: data.image,
});

export default function VitalchainPage() {
  return <VitalchainContent />;
}
