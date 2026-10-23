import data from "~/data/cases/firstautomation.json";
import { metaPagina, resumen } from "~/lib/seo";
import FirstautomationContent from "./FirstautomationContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/firstautomation",
  imagen: data.image,
});

export default function FirstautomationPage() {
  return <FirstautomationContent />;
}
