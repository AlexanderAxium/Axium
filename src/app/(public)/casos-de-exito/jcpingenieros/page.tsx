import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/jcpingenieros.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import JcpingenierosContent from "./JcpingenierosContent";

export const metadata = metaCaso("jcpingenieros", data);

export default function JcpingenierosPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("jcpingenieros", data)} />
      <JcpingenierosContent />
    </>
  );
}
