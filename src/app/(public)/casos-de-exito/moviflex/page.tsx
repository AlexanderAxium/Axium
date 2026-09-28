import data from "~/data/cases/moviflex.json";
import MoviflexContent from "./MoviflexContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function MoviflexPage() {
  return <MoviflexContent />;
}
