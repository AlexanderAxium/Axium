import data from "~/data/cases/podologiemtk.json";
import PodologiemtkContent from "./PodologiemtkContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function PodologiemtkPage() {
  return <PodologiemtkContent />;
}
