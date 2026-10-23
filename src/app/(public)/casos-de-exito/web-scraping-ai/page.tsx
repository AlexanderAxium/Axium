import data from "~/data/cases/web-scraping-ai.json";
import { metaPagina, resumen } from "~/lib/seo";
import WebScrapingAiContent from "./WebScrapingAiContent";

export const metadata = metaPagina({
  titulo: `${data.title}: caso de éxito`,
  descripcion: resumen(data.description),
  ruta: "/casos-de-exito/web-scraping-ai",
  imagen: data.image,
});

export default function WebScrapingAiPage() {
  return <WebScrapingAiContent />;
}
