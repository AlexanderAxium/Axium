import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/ghiperu.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import GhiperuContent from "./GhiperuContent";

export const metadata = metaCaso("ghiperu", data);

export default function GhiperuPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("ghiperu", data)} />
      <GhiperuContent />
    </>
  );
}
