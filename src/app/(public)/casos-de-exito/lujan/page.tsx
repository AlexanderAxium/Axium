import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/lujan.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import LujanContent from "./LujanContent";

export const metadata = metaCaso("lujan", data);

export default function LujanPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("lujan", data)} />
      <LujanContent />
    </>
  );
}
