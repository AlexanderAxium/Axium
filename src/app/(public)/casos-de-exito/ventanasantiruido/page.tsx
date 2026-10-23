import data from "~/data/cases/ventanasantiruido.json";
import { metaPagina, resumen } from "~/lib/seo";
import VentanasantiruidoContent from "./VentanasantiruidoContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/ventanasantiruido",
  imagen: data.image,
});

export default function VentanasantiruidoPage() {
  return <VentanasantiruidoContent />;
}
