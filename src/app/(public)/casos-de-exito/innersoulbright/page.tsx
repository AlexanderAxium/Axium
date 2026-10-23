import data from "~/data/cases/innersoulbright.json";
import { metaPagina, resumen } from "~/lib/seo";
import InnerSoulBrightContent from "./InnerSoulBrightContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/innersoulbright",
  imagen: data.image,
});

export default function InnerSoulBrightPage() {
  return <InnerSoulBrightContent />;
}
