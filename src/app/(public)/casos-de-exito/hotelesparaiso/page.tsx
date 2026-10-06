import data from "~/data/cases/hotelesparaiso.json";
import HotelesparaisoContent from "./HotelesparaisoContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function HotelesparaisoPage() {
  return <HotelesparaisoContent />;
}
