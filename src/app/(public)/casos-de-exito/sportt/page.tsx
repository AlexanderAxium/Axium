import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/sportt.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import SporttContent from "./SporttContent";

export const metadata = metaCaso("sportt", data);

export default function SporttPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("sportt", data)} />
      <SporttContent />
    </>
  );
}
