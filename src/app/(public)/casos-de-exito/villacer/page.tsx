import data from "~/data/cases/villacer.json";
import { metaPagina, resumen } from "~/lib/seo";
import VillacerContent from "./VillacerContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/villacer",
  imagen: data.image,
});

export default function VillacerPage() {
  return <VillacerContent />;
}
