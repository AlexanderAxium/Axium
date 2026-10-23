import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/vendiq.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import VendiqContent from "./VendiqContent";

export const metadata = metaCaso("vendiq", data);

export default function VendiqPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("vendiq", data)} />
      <VendiqContent />
    </>
  );
}
