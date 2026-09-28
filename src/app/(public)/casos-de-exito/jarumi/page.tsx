import data from "~/data/cases/jarumi.json";
import JarumiContent from "./JarumiContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function JarumiPage() {
  return <JarumiContent />;
}
