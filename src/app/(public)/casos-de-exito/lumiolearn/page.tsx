import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/lumiolearn.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import LumiolearnContent from "./LumiolearnContent";

export const metadata = metaCaso("lumiolearn", data);

export default function LumiolearnPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("lumiolearn", data)} />
      <LumiolearnContent />
    </>
  );
}
