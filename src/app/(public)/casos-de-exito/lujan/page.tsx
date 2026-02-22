import data from "~/data/cases/lujan.json";
import LujanContent from "./LujanContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function LujanPage() {
  return <LujanContent />;
}
