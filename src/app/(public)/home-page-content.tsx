"use client";

import { BlogSection } from "@/components/axium/blog-section";
import { CaseContactCTA } from "@/components/axium/case-contact-cta";
import { FaqInicio } from "@/components/axium/faq-inicio";
import { HeroSection } from "@/components/axium/hero-section";
import { ProcessSection } from "@/components/axium/process-section";
import { ServiciosSeis } from "@/components/axium/servicios-seis";
import { TrabajoDestacado } from "@/components/axium/trabajo-destacado";

// Sin un Suspense por sección (probado el 2026-10-23): en el build estático cada límite sale en el HTML
// dentro de un <div hidden> que un script recoloca, y lo que no ejecuta JavaScript lo ve oculto
export function HomePageContent() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ServiciosSeis />
      <ProcessSection />
      <TrabajoDestacado />
      <BlogSection />
      <FaqInicio />
      <CaseContactCTA />
    </div>
  );
}
