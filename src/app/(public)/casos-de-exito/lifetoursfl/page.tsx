import data from "~/data/cases/lifetoursfl.json";
import LifetoursflContent from "./LifetoursflContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function LifetoursflPage() {
  return <LifetoursflContent />;
}
