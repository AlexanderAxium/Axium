import { ServicePageTemplate } from "~/components/axium/service-page-template";
import { SERVICES } from "~/data/services-data";

const data = SERVICES["aplicaciones-moviles"]!;

export const metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function AplicacionesMovilesPage() {
  return <ServicePageTemplate slug="aplicaciones-moviles" />;
}
