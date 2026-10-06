import data from "~/data/cases/maintech.json";
import MaintechContent from "./MaintechContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function MaintechPage() {
  return <MaintechContent />;
}
