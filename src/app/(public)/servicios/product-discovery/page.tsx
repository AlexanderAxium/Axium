import { ServicePageTemplate } from "~/components/axium/service-page-template";
import { SERVICES } from "~/data/services-data";

const data = SERVICES["product-discovery"]!;

export const metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function ProductDiscoveryPage() {
  return <ServicePageTemplate slug="product-discovery" />;
}
