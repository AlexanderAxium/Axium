import { ServicePageTemplate } from "~/components/axium/service-page-template";
import { SERVICES } from "~/data/services-data";

const data = SERVICES["software-development"]!;

export const metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function SoftwareDevelopmentPage() {
  return <ServicePageTemplate slug="software-development" />;
}
