import { PortfolioPageContent } from "@/components/axium/portfolio-page-content";
import { generateMetadata as genMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = genMeta({
  title: "Portafolio de Proyectos",
  description:
    "Conoce los proyectos que hemos desarrollado para empresas de múltiples industrias. Casos reales con resultados medibles.",
  keywords: [
    "portafolio",
    "proyectos",
    "casos de éxito",
    "desarrollo web",
    "aplicaciones",
    "software a medida",
  ],
});

export default function PortafolioPage() {
  return <PortfolioPageContent />;
}
