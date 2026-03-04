import data from "~/data/cases/feedback-management.json";
import FeedbackManagementContent from "./FeedbackManagementContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function FeedbackManagementPage() {
  return <FeedbackManagementContent />;
}
