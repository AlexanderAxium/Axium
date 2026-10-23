import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/rematch.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import RematchContent from "./RematchContent";

export const metadata = metaCaso("rematch", data);

export default function RematchPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("rematch", data)} />
      <RematchContent />
    </>
  );
}
