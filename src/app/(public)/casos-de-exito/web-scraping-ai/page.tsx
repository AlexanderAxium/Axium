import data from "~/data/cases/web-scraping-ai.json";
import WebScrapingAiContent from "./WebScrapingAiContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function WebScrapingAiPage() {
  return <WebScrapingAiContent />;
}
