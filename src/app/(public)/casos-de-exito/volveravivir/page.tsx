import data from "~/data/cases/volveravivir.json";
import VolveravivirContent from "./VolveravivirContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function VolveravivirPage() {
  return <VolveravivirContent />;
}
