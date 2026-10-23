import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/feedback-management.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import FeedbackManagementContent from "./FeedbackManagementContent";

export const metadata = metaCaso("feedback-management", data);

export default function FeedbackManagementPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("feedback-management", data)} />
      <FeedbackManagementContent />
    </>
  );
}
