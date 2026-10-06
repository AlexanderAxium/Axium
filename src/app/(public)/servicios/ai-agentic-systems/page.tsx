import { AiAgenticSystemsPage } from "~/components/axium/ai-agentic-systems-page";
import { SERVICES } from "~/data/services-data";

const data = SERVICES["ai-agentic-systems"]!;

export const metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function Page() {
  return <AiAgenticSystemsPage />;
}
