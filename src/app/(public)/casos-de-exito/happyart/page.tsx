import data from "~/data/cases/happyart.json";
import HappyArtContent from "./HappyArtContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function HappyArtPage() {
  return <HappyArtContent />;
}
