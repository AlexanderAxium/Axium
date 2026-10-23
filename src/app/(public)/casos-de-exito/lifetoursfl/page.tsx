import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/lifetoursfl.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import LifetoursflContent from "./LifetoursflContent";

export const metadata = metaCaso("lifetoursfl", data);

export default function LifetoursflPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("lifetoursfl", data)} />
      <LifetoursflContent />
    </>
  );
}
