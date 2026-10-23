import data from "~/data/cases/happyart.json";
import { metaPagina, resumen } from "~/lib/seo";
import HappyArtContent from "./HappyArtContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/happyart",
  imagen: data.image,
});

export default function HappyArtPage() {
  return <HappyArtContent />;
}
