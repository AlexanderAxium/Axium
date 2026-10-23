import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/innersoulbright.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import InnerSoulBrightContent from "./InnerSoulBrightContent";

export const metadata = metaCaso("innersoulbright", data);

export default function InnerSoulBrightPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("innersoulbright", data)} />
      <InnerSoulBrightContent />
    </>
  );
}
