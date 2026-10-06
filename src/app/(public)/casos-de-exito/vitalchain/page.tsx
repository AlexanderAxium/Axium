import data from "~/data/cases/vitalchain.json";
import VitalchainContent from "./VitalchainContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function VitalchainPage() {
  return <VitalchainContent />;
}
