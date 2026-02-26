import { ServicePageTemplate } from "~/components/axium/service-page-template";
import { SERVICES } from "~/data/services-data";

const data = SERVICES["software-a-medida"]!;

export const metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function SoftwareAMedidaPage() {
  return <ServicePageTemplate slug="software-a-medida" />;
}
