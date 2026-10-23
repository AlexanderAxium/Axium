import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/fenalsa.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import FenalsaContent from "./FenalsaContent";

export const metadata = metaCaso("fenalsa", data);

export default function FenalsaPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("fenalsa", data)} />
      <FenalsaContent />
    </>
  );
}
