import { ServicePageTemplate } from "~/components/axium/service-page-template";
import { SERVICES } from "~/data/services-data";

const data = SERVICES["automatizacion-de-procesos"]!;

export const metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function AutomatizacionDeProcesosPage() {
  return <ServicePageTemplate slug="automatizacion-de-procesos" />;
}
