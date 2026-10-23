import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/moviflex.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import MoviflexContent from "./MoviflexContent";

export const metadata = metaCaso("moviflex", data);

export default function MoviflexPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("moviflex", data)} />
      <MoviflexContent />
    </>
  );
}
