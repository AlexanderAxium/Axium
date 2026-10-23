import data from "~/data/cases/enrafmedica.json";
import { metaPagina, resumen } from "~/lib/seo";
import EnrafmedicaContent from "./EnrafmedicaContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/enrafmedica",
  imagen: data.image,
});

export default function EnrafmedicaPage() {
  return <EnrafmedicaContent />;
}
