"use client";

import { CaseContactCTA } from "@/components/axium/case-contact-cta";
import { CasesSection } from "@/components/axium/cases-section";
import { HeroSection } from "@/components/axium/hero-section";
import { ProcessSection } from "@/components/axium/process-section";
import { ServicesSection } from "@/components/axium/services-section";

export function HomePageContent() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <CasesSection />
      <CaseContactCTA />
    </div>
  );
}
