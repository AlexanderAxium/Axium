import data from "~/data/cases/favorygracia.json";
import FavorygraciaContent from "./FavorygraciaContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function FavorygraciaPage() {
  return <FavorygraciaContent />;
}
