import { HomePageContent } from "@/app/(public)/home-page-content";
import { JsonLd } from "@/components/StructuredData";
import { homePageMetadata } from "@/lib/seo";
import { esquemaNegocio } from "@/lib/structured-data";
import type { Metadata } from "next";

export const metadata: Metadata = homePageMetadata;

export default function HomePage() {
  return (
    <>
      <JsonLd datos={esquemaNegocio()} />
      <HomePageContent />
    </>
  );
}
