import { ServicePageTemplate } from "~/components/axium/service-page-template";
import { SERVICES } from "~/data/services-data";

const data = SERVICES["ai-agentic-systems"]!;

export const metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function AiAgenticSystemsPage() {
  return <ServicePageTemplate slug="ai-agentic-systems" />;
}
