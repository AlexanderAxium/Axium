import { JsonLd } from "@/components/StructuredData";
import { PortfolioPageContent } from "@/components/axium/portfolio-page-content";
import { casosPublicados } from "@/lib/casos-servidor";
import { metaPagina } from "@/lib/seo";
import { esquemaPortafolio } from "@/lib/structured-data";
import type { Metadata } from "next";

export const metadata: Metadata = metaPagina({
  titulo: "Portafolio: webs, tiendas online y software en Perú",
  descripcion:
    "Proyectos reales de Axium: páginas web, tiendas online, apps, sistemas a medida e IA para empresas de Lima y del Perú. Mira cómo los hicimos.",
  ruta: "/portafolio",
  imagen: "/og/og-portafolio.jpg",
});

export default function PortafolioPage() {
  return (
    <>
      <JsonLd datos={esquemaPortafolio(casosPublicados())} />
      <PortfolioPageContent />
    </>
  );
}
