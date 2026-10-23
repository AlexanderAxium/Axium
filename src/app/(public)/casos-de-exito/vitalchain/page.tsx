import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/vitalchain.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import VitalchainContent from "./VitalchainContent";

export const metadata = metaCaso("vitalchain", data);

export default function VitalchainPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("vitalchain", data)} />
      <VitalchainContent />
    </>
  );
}
