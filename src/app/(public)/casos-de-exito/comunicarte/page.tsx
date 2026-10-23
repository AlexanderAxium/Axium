import data from "~/data/cases/comunicarte.json";
import { metaPagina, resumen } from "~/lib/seo";
import ComunicarteContent from "./ComunicarteContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/comunicarte",
  imagen: data.image,
});

export default function ComunicartePage() {
  return <ComunicarteContent />;
}
