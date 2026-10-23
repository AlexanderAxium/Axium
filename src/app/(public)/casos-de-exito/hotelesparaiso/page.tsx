import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/hotelesparaiso.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import HotelesparaisoContent from "./HotelesparaisoContent";

export const metadata = metaCaso("hotelesparaiso", data);

export default function HotelesparaisoPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("hotelesparaiso", data)} />
      <HotelesparaisoContent />
    </>
  );
}
