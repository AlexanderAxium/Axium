import data from "~/data/cases/podologiemtk.json";
import { metaPagina, resumen } from "~/lib/seo";
import PodologiemtkContent from "./PodologiemtkContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/podologiemtk",
  imagen: data.image,
});

export default function PodologiemtkPage() {
  return <PodologiemtkContent />;
}
