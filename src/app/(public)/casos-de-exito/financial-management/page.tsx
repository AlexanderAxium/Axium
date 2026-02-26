import data from "~/data/cases/financial-management.json";
import FinancialManagementContent from "./FinancialManagementContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function FinancialManagementPage() {
  return <FinancialManagementContent />;
}
