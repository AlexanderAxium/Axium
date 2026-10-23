import data from "~/data/cases/vendiq.json";
import { metaPagina, resumen } from "~/lib/seo";
import VendiqContent from "./VendiqContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/vendiq",
  imagen: data.image,
});

export default function VendiqPage() {
  return <VendiqContent />;
}
