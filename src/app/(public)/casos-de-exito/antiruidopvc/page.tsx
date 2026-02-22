import data from "~/data/cases/antiruidopvc.json";
import AntiruidopvcContent from "./AntiruidopvcContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function AntiruidopvcPage() {
  return <AntiruidopvcContent />;
}
