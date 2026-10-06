import data from "~/data/cases/enrafmedica.json";
import EnrafmedicaContent from "./EnrafmedicaContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function EnrafmedicaPage() {
  return <EnrafmedicaContent />;
}
