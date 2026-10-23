import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/maintech.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import MaintechContent from "./MaintechContent";

export const metadata = metaCaso("maintech", data);

export default function MaintechPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("maintech", data)} />
      <MaintechContent />
    </>
  );
}
