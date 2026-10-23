import data from "~/data/cases/antiruidopvc.json";
import { metaPagina, resumen } from "~/lib/seo";
import AntiruidopvcContent from "./AntiruidopvcContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/antiruidopvc",
  imagen: data.image,
});

export default function AntiruidopvcPage() {
  return <AntiruidopvcContent />;
}
