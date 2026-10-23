import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/fintrace.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import FintraceContent from "./FintraceContent";

export const metadata = metaCaso("fintrace", data);

export default function FintracePage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("fintrace", data)} />
      <FintraceContent />
    </>
  );
}
