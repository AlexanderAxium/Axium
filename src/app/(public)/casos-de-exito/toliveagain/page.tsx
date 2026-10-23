import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/toliveagain.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import ToliveagainContent from "./ToliveagainContent";

export const metadata = metaCaso("toliveagain", data);

export default function ToliveagainPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("toliveagain", data)} />
      <ToliveagainContent />
    </>
  );
}
