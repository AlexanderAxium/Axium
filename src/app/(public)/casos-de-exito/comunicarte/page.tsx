import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/comunicarte.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import ComunicarteContent from "./ComunicarteContent";

export const metadata = metaCaso("comunicarte", data);

export default function ComunicartePage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("comunicarte", data)} />
      <ComunicarteContent />
    </>
  );
}
