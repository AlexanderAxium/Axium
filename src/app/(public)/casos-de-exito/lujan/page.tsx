import data from "~/data/cases/lujan.json";
import { metaPagina, resumen } from "~/lib/seo";
import LujanContent from "./LujanContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/lujan",
  imagen: data.image,
});

export default function LujanPage() {
  return <LujanContent />;
}
