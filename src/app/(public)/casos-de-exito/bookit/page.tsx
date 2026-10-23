import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/bookit.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import BookitContent from "./BookitContent";

export const metadata = metaCaso("bookit", data);

export default function BookitPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("bookit", data)} />
      <BookitContent />
    </>
  );
}
