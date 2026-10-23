import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/ambientalpe.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import AmbientalpeContent from "./AmbientalpeContent";

export const metadata = metaCaso("ambientalpe", data);

export default function AmbientalpePage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("ambientalpe", data)} />
      <AmbientalpeContent />
    </>
  );
}
