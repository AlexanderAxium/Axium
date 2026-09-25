import data from "~/data/cases/lumiolearn.json";
import LumiolearnContent from "./LumiolearnContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function LumiolearnPage() {
  return <LumiolearnContent />;
}
