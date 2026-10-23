import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/qintitec.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import QintitecContent from "./QintitecContent";

export const metadata = metaCaso("qintitec", data);

export default function QintitecPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("qintitec", data)} />
      <QintitecContent />
    </>
  );
}
