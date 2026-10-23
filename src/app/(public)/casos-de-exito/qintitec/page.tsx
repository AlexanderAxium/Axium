import data from "~/data/cases/qintitec.json";
import { metaPagina, resumen } from "~/lib/seo";
import QintitecContent from "./QintitecContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/qintitec",
  imagen: data.image,
});

export default function QintitecPage() {
  return <QintitecContent />;
}
