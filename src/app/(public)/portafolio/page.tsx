import { PortfolioPageContent } from "@/components/axium/portfolio-page-content";
import { metaPagina } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = metaPagina({
  titulo: "Portafolio: webs, tiendas online y software en Perú",
  descripcion:
    "Proyectos reales de Axium: páginas web, tiendas online, apps, sistemas a medida e IA para empresas de Lima y del Perú. Mira cómo los hicimos.",
  ruta: "/portafolio",
  imagen: "/og/og-portafolio.jpg",
});

export default function PortafolioPage() {
  return <PortfolioPageContent />;
}
