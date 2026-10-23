import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/volveravivir.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import VolveravivirContent from "./VolveravivirContent";

export const metadata = metaCaso("volveravivir", data);

export default function VolveravivirPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("volveravivir", data)} />
      <VolveravivirContent />
    </>
  );
}
