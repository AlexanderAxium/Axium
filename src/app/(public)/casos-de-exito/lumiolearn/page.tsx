import data from "~/data/cases/lumiolearn.json";
import { metaPagina, resumen } from "~/lib/seo";
import LumiolearnContent from "./LumiolearnContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/lumiolearn",
  imagen: data.image,
});

export default function LumiolearnPage() {
  return <LumiolearnContent />;
}
