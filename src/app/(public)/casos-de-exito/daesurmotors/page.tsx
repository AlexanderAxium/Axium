import data from "~/data/cases/daesurmotors.json";
import DaesurmotorsContent from "./DaesurmotorsContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function DaesurmotorsPage() {
  return <DaesurmotorsContent />;
}
