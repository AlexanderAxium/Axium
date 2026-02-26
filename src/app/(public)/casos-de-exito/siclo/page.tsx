import data from "~/data/cases/siclo.json";
import SicloContent from "./SicloContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function SicloPage() {
  return <SicloContent />;
}
