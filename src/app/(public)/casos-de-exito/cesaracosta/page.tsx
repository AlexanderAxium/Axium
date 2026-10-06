import data from "~/data/cases/cesaracosta.json";
import CesaracostaContent from "./CesaracostaContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function CesaracostaPage() {
  return <CesaracostaContent />;
}
