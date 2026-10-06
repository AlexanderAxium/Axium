import data from "~/data/cases/blendet.json";
import BlendetContent from "./BlendetContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function BlendetPage() {
  return <BlendetContent />;
}
