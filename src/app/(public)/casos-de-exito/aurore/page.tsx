import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/aurore.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import AuroreContent from "./AuroreContent";

export const metadata = metaCaso("aurore", data);

export default function AurorePage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("aurore", data)} />
      <AuroreContent />
    </>
  );
}
