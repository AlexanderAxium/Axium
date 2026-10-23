import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/favorygracia.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import FavorygraciaContent from "./FavorygraciaContent";

export const metadata = metaCaso("favorygracia", data);

export default function FavorygraciaPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("favorygracia", data)} />
      <FavorygraciaContent />
    </>
  );
}
