import data from "~/data/cases/comunicarte.json";
import ComunicarteContent from "./ComunicarteContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function ComunicartePage() {
  return <ComunicarteContent />;
}
