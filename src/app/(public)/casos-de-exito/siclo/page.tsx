import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/siclo.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import SicloContent from "./SicloContent";

export const metadata = metaCaso("siclo", data);

export default function SicloPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("siclo", data)} />
      <SicloContent />
    </>
  );
}
