import data from "~/data/cases/ghiperu.json";
import GhiperuContent from "./GhiperuContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function GhiperuPage() {
  return <GhiperuContent />;
}
