import data from "~/data/cases/jcpingenieros.json";
import { metaPagina, resumen } from "~/lib/seo";
import JcpingenierosContent from "./JcpingenierosContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/jcpingenieros",
  imagen: data.image,
});

export default function JcpingenierosPage() {
  return <JcpingenierosContent />;
}
