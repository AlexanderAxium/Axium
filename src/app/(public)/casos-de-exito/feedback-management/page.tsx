import data from "~/data/cases/feedback-management.json";
import { metaPagina, resumen } from "~/lib/seo";
import FeedbackManagementContent from "./FeedbackManagementContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/feedback-management",
  imagen: data.image,
});

export default function FeedbackManagementPage() {
  return <FeedbackManagementContent />;
}
