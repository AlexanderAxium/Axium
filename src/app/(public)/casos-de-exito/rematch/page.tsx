import data from "~/data/cases/rematch.json";
import RematchContent from "./RematchContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function RematchPage() {
  return <RematchContent />;
}
