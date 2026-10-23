import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/anjsports.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import AnjsportsContent from "./AnjsportsContent";

export const metadata = metaCaso("anjsports", data);

export default function AnjsportsPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("anjsports", data)} />
      <AnjsportsContent />
    </>
  );
}
