import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/huarmis.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import HuarmisContent from "./HuarmisContent";

export const metadata = metaCaso("huarmis", data);

export default function HuarmisPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("huarmis", data)} />
      <HuarmisContent />
    </>
  );
}
