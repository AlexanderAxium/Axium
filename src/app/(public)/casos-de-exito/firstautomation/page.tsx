import data from "~/data/cases/firstautomation.json";
import FirstautomationContent from "./FirstautomationContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function FirstautomationPage() {
  return <FirstautomationContent />;
}
