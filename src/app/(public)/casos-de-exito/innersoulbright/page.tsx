import data from "~/data/cases/innersoulbright.json";
import InnerSoulBrightContent from "./InnerSoulBrightContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function InnerSoulBrightPage() {
  return <InnerSoulBrightContent />;
}
