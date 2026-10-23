import data from "~/data/cases/toliveagain.json";
import { metaPagina, resumen } from "~/lib/seo";
import ToliveagainContent from "./ToliveagainContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/toliveagain",
  imagen: data.image,
});

export default function ToliveagainPage() {
  return <ToliveagainContent />;
}
