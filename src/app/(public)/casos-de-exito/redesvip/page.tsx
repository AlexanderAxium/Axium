import data from "~/data/cases/redesvip.json";
import { metaPagina, resumen } from "~/lib/seo";
import RedesVipContent from "./RedesVipContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/redesvip",
  imagen: data.image,
});

export default function RedesVipPage() {
  return <RedesVipContent />;
}
