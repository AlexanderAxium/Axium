import { JsonLd } from "~/components/StructuredData";
import data from "~/data/cases/podologiemtk.json";
import { metaCaso } from "~/lib/seo";
import { esquemaCaso } from "~/lib/structured-data";
import PodologiemtkContent from "./PodologiemtkContent";

export const metadata = metaCaso("podologiemtk", data);

export default function PodologiemtkPage() {
  return (
    <>
      <JsonLd datos={esquemaCaso("podologiemtk", data)} />
      <PodologiemtkContent />
    </>
  );
}
