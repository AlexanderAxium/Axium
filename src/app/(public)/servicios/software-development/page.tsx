import { SoftwareDevelopmentPage } from "~/components/axium/software-development-page";
import { SERVICES } from "~/data/services-data";

const data = SERVICES["software-development"]!;

export const metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function Page() {
  return <SoftwareDevelopmentPage />;
}
