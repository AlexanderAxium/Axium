import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/blendet.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import BlendetContent from "./BlendetContent";

export const metadata = metaCaso("blendet", data);

export default function BlendetPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("blendet", data)} />
      <BlendetContent />
    </>
  );
}
