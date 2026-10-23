import data from "~/data/cases/aurore.json";
import { metaPagina, resumen } from "~/lib/seo";
import AuroreContent from "./AuroreContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/aurore",
  imagen: data.image,
});

export default function AurorePage() {
  return <AuroreContent />;
}
