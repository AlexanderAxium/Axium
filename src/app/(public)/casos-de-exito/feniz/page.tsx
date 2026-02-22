import data from "~/data/cases/feniz.json";
import FenizContent from "./FenizContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function FenizPage() {
  return <FenizContent />;
}
