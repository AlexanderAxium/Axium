"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import { CaseDetailGallery } from "~/components/axium/case-detail-gallery";
import { CaseDetailHero } from "~/components/axium/case-detail-hero";
import { CaseDetailInfo } from "~/components/axium/case-detail-info";
import { Button } from "~/components/ui/button";
import { findCaseBySlug } from "~/lib/utils/cases";

export default function CaseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const caseItem = findCaseBySlug(slug);

  if (!caseItem) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-white mb-4">
            Caso no encontrado
          </h1>
          <p className="text-gray-300 mb-6">El caso que buscas no existe.</p>
          <Link href="/#casos">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a casos de éxito
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <CaseDetailHero caseItem={caseItem} />
      <CaseDetailGallery caseItem={caseItem} />
      <CaseDetailInfo caseItem={caseItem} />
      <CaseContactCTA />
    </div>
  );
}
