import data from "~/data/cases/redesvip.json";
import RedesVipContent from "./RedesVipContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function RedesVipPage() {
  return <RedesVipContent />;
}
