import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/transportesrumi.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import TransportesrumiContent from "./TransportesrumiContent";

export const metadata = metaCaso("transportesrumi", data);

export default function TransportesrumiPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("transportesrumi", data)} />
      <TransportesrumiContent />
    </>
  );
}
