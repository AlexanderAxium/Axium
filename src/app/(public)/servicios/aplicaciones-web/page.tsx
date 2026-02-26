import { ServicePageTemplate } from "~/components/axium/service-page-template";
import { SERVICES } from "~/data/services-data";

const data = SERVICES["aplicaciones-web"]!;

export const metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function AplicacionesWebPage() {
  return <ServicePageTemplate slug="aplicaciones-web" />;
}
