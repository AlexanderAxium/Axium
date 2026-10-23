import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/alyer.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import AlyerContent from "./AlyerContent";

export const metadata = metaCaso("alyer", data);

export default function AlyerPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("alyer", data)} />
      <AlyerContent />
    </>
  );
}
