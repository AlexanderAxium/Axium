import data from "~/data/cases/huarmis.json";
import HuarmisContent from "./HuarmisContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function HuarmisPage() {
  return <HuarmisContent />;
}
