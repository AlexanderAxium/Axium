"use client";

import { AboutSection } from "@/components/axium/about-section";
import { BlogSection } from "@/components/axium/blog-section";
import { CaseContactCTA } from "@/components/axium/case-contact-cta";
import { HeroSection } from "@/components/axium/hero-section";
import { HighlightsSection } from "@/components/axium/highlights-section";
import { ProcessSection } from "@/components/axium/process-section";
import { ServicesSection } from "@/components/axium/services-section";

export function HomePageContent() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />
      <HighlightsSection />
      <BlogSection />
      <CaseContactCTA />
    </div>
  );
}
