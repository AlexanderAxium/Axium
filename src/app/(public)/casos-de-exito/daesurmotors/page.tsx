import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/daesurmotors.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import DaesurmotorsContent from "./DaesurmotorsContent";

export const metadata = metaCaso("daesurmotors", data);

export default function DaesurmotorsPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("daesurmotors", data)} />
      <DaesurmotorsContent />
    </>
  );
}
