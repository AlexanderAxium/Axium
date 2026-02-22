import data from "~/data/cases/transportesrumi.json";
import TransportesrumiContent from "./TransportesrumiContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function TransportesrumiPage() {
  return <TransportesrumiContent />;
}
