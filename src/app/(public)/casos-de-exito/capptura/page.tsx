import data from "~/data/cases/capptura.json";
import { metaPagina, resumen } from "~/lib/seo";
import CappturaContent from "./CappturaContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/capptura",
  imagen: data.image,
});

export default function CappturaPage() {
  return <CappturaContent />;
}
