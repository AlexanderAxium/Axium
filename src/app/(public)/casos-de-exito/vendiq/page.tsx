import data from "~/data/cases/vendiq.json";
import VendiqContent from "./VendiqContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function VendiqPage() {
  return <VendiqContent />;
}
