import data from "~/data/cases/capptura.json";
import CappturaContent from "./CappturaContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function CappturaPage() {
  return <CappturaContent />;
}
