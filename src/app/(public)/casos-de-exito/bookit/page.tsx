import data from "~/data/cases/bookit.json";
import BookitContent from "./BookitContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function BookitPage() {
  return <BookitContent />;
}
