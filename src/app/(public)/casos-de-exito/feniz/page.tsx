import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/feniz.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import FenizContent from "./FenizContent";

export const metadata = metaCaso("feniz", data);

export default function FenizPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("feniz", data)} />
      <FenizContent />
    </>
  );
}
