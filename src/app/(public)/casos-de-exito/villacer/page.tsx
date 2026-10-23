import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/villacer.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import VillacerContent from "./VillacerContent";

export const metadata = metaCaso("villacer", data);

export default function VillacerPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("villacer", data)} />
      <VillacerContent />
    </>
  );
}
