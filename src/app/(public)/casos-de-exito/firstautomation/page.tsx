import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/firstautomation.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import FirstautomationContent from "./FirstautomationContent";

export const metadata = metaCaso("firstautomation", data);

export default function FirstautomationPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("firstautomation", data)} />
      <FirstautomationContent />
    </>
  );
}
