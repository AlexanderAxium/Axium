import data from "~/data/cases/ventanasantiruido.json";
import VentanasantiruidoContent from "./VentanasantiruidoContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function VentanasantiruidoPage() {
  return <VentanasantiruidoContent />;
}
