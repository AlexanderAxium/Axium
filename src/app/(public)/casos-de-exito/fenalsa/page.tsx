import data from "~/data/cases/fenalsa.json";
import FenalsaContent from "./FenalsaContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function FenalsaPage() {
  return <FenalsaContent />;
}
