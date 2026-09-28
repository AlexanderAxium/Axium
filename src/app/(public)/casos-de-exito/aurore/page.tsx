import data from "~/data/cases/aurore.json";
import AuroreContent from "./AuroreContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function AurorePage() {
  return <AuroreContent />;
}
