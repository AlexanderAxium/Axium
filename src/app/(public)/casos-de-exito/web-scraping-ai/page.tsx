import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/web-scraping-ai.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import WebScrapingAiContent from "./WebScrapingAiContent";

export const metadata = metaCaso("web-scraping-ai", data);

export default function WebScrapingAiPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("web-scraping-ai", data)} />
      <WebScrapingAiContent />
    </>
  );
}
