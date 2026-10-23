import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/enrafmedica.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import EnrafmedicaContent from "./EnrafmedicaContent";

export const metadata = metaCaso("enrafmedica", data);

export default function EnrafmedicaPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("enrafmedica", data)} />
      <EnrafmedicaContent />
    </>
  );
}
