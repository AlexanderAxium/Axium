import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/capptura.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import CappturaContent from "./CappturaContent";

export const metadata = metaCaso("capptura", data);

export default function CappturaPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("capptura", data)} />
      <CappturaContent />
    </>
  );
}
