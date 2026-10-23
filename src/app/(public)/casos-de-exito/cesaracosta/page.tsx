import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/cesaracosta.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import CesaracostaContent from "./CesaracostaContent";

export const metadata = metaCaso("cesaracosta", data);

export default function CesaracostaPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("cesaracosta", data)} />
      <CesaracostaContent />
    </>
  );
}
