import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/happyart.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import HappyArtContent from "./HappyArtContent";

export const metadata = metaCaso("happyart", data);

export default function HappyArtPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("happyart", data)} />
      <HappyArtContent />
    </>
  );
}
