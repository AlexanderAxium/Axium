import data from "~/data/cases/blendet.json";
import { metaPagina, resumen } from "~/lib/seo";
import BlendetContent from "./BlendetContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/blendet",
  imagen: data.image,
});

export default function BlendetPage() {
  return <BlendetContent />;
}
