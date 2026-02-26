import { ServicePageTemplate } from "~/components/axium/service-page-template";
import { SERVICES } from "~/data/services-data";

const data = SERVICES["branding-ui"]!;

export const metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function BrandingUIPage() {
  return <ServicePageTemplate slug="branding-ui" />;
}
