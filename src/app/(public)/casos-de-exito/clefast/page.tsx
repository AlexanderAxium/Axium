import data from "~/data/cases/clefast.json";
import ClefastContent from "./ClefastContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function ClefastPage() {
  return <ClefastContent />;
}
