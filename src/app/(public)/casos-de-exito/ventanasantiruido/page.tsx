import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/ventanasantiruido.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import VentanasantiruidoContent from "./VentanasantiruidoContent";

export const metadata = metaCaso("ventanasantiruido", data);

export default function VentanasantiruidoPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("ventanasantiruido", data)} />
      <VentanasantiruidoContent />
    </>
  );
}
