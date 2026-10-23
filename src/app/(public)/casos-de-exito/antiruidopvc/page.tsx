import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/antiruidopvc.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import AntiruidopvcContent from "./AntiruidopvcContent";

export const metadata = metaCaso("antiruidopvc", data);

export default function AntiruidopvcPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("antiruidopvc", data)} />
      <AntiruidopvcContent />
    </>
  );
}
