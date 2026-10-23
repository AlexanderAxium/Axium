import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/jarumi.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import JarumiContent from "./JarumiContent";

export const metadata = metaCaso("jarumi", data);

export default function JarumiPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("jarumi", data)} />
      <JarumiContent />
    </>
  );
}
