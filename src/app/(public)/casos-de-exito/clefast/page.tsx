import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/clefast.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import ClefastContent from "./ClefastContent";

export const metadata = metaCaso("clefast", data);

export default function ClefastPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("clefast", data)} />
      <ClefastContent />
    </>
  );
}
