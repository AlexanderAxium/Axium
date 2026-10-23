import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/redesvip.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import RedesVipContent from "./RedesVipContent";

export const metadata = metaCaso("redesvip", data);

export default function RedesVipPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("redesvip", data)} />
      <RedesVipContent />
    </>
  );
}
