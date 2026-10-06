import data from "~/data/cases/alyer.json";
import AlyerContent from "./AlyerContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function AlyerPage() {
  return <AlyerContent />;
}
