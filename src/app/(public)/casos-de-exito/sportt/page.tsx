import data from "~/data/cases/sportt.json";
import SporttContent from "./SporttContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function SporttPage() {
  return <SporttContent />;
}
