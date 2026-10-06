import data from "~/data/cases/anjsports.json";
import AnjsportsContent from "./AnjsportsContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function AnjsportsPage() {
  return <AnjsportsContent />;
}
