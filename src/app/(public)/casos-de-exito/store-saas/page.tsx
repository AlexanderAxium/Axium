import data from "~/data/cases/store-saas.json";
import StoreSaasContent from "./StoreSaasContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function StoreSaasPage() {
  return <StoreSaasContent />;
}
