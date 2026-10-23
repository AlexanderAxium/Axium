import data from "~/data/cases/daesurmotors.json";
import { metaPagina, resumen } from "~/lib/seo";
import DaesurmotorsContent from "./DaesurmotorsContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/daesurmotors",
  imagen: data.image,
});

export default function DaesurmotorsPage() {
  return <DaesurmotorsContent />;
}
