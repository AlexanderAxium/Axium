import data from "~/data/cases/fintrace.json";
import FintraceContent from "./FintraceContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function FintracePage() {
  return <FintraceContent />;
}
