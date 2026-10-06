import data from "~/data/cases/toliveagain.json";
import ToliveagainContent from "./ToliveagainContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function ToliveagainPage() {
  return <ToliveagainContent />;
}
