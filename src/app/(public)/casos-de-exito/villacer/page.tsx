import data from "~/data/cases/villacer.json";
import VillacerContent from "./VillacerContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function VillacerPage() {
  return <VillacerContent />;
}
