import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/3bprofactory.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import TresbprofactoryContent from "./TresbprofactoryContent";

export const metadata = metaCaso("3bprofactory", data);

export default function TresbprofactoryPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("3bprofactory", data)} />
      <TresbprofactoryContent />
    </>
  );
}
