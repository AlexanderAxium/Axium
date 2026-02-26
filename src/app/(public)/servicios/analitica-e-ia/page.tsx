import { ServicePageTemplate } from "~/components/axium/service-page-template";
import { SERVICES } from "~/data/services-data";

const data = SERVICES["analitica-e-ia"]!;

export const metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function AnaliticaEIAPage() {
  return <ServicePageTemplate slug="analitica-e-ia" />;
}
