import data from "~/data/cases/qintitec.json";
import QintitecContent from "./QintitecContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function QintitecPage() {
  return <QintitecContent />;
}
