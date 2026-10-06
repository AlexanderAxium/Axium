import data from "~/data/cases/ambientalpe.json";
import AmbientalpeContent from "./AmbientalpeContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function AmbientalpePage() {
  return <AmbientalpeContent />;
}
