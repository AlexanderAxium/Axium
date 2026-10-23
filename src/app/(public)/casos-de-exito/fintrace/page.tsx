import data from "~/data/cases/fintrace.json";
import { metaPagina, resumen } from "~/lib/seo";
import FintraceContent from "./FintraceContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/fintrace",
  imagen: data.image,
});

export default function FintracePage() {
  return <FintraceContent />;
}
