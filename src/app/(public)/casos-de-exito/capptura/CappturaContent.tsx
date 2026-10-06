"use client";

import { Clock, Globe, Monitor } from "lucide-react";
import {
  CaseArticle,
  CaseArticleText,
  CaseArticleWide,
  CaseHeroSplit,
  CaseImages,
  CaseNextProject,
} from "~/components/axium/case-blocks";
import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import { useTranslation } from "~/hooks/useTranslation";
import { useCaseContent } from "~/lib/case-translations";

export default function CappturaContent() {
  const data = useCaseContent("capptura");
  const { t } = useTranslation("landing");

  if (!data) return null;

  return (
    <div className="min-h-screen">
      <CaseHeroSplit
        title={data.title}
        description={data.description}
        image={data.image}
        industry={data.industry}
        location={data.location}
        gradient="linear-gradient(180deg, #160D0A 0%, #3A251E 45%, #816054 100%)"
        blurOrbs={["rgba(236,197,120,0.18)", "rgba(239,197,205,0.12)"]}
        services={data.services}
        technologies={data.technologyStack}
        liveUrl={data.liveUrl}
      />

      <CaseArticle>
        <CaseArticleText>
          <p className="text-overline mb-4 text-[#8A6552]">
            {t("caseDetail.aboutProject")}
          </p>

          <p className="text-body-lg mb-6 leading-relaxed text-[#334155]">
            {data.projectDescription}
          </p>

          <p className="text-body mb-8 leading-relaxed text-[#334155]">
            {data.solution}
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-12 lg:mb-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-[#f1f5f9] px-3.5 py-1.5">
              <Monitor className="h-3.5 w-3.5 text-[#8A6552]" />
              <span className="text-pill text-[#64748b]">
                {t("caseDetail.platform")}:
              </span>
              <span className="text-pill font-semibold text-[#0f172a]">
                {data.platform}
              </span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-[#f1f5f9] px-3.5 py-1.5">
              <Clock className="h-3.5 w-3.5 text-[#8A6552]" />
              <span className="text-pill text-[#64748b]">
                {t("caseDetail.duration")}:
              </span>
              <span className="text-pill font-semibold text-[#0f172a]">
                {data.duration}
              </span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-[#f1f5f9] px-3.5 py-1.5">
              <Globe className="h-3.5 w-3.5 text-[#8A6552]" />
              <span className="text-pill text-[#64748b]">
                {t("caseDetail.client")}:
              </span>
              <span className="text-pill font-semibold text-[#0f172a]">
                {data.client}
              </span>
            </span>
          </div>
        </CaseArticleText>

        <CaseArticleWide>
          <div className="mb-12 lg:mb-16">
            <CaseImages
              images={[
                {
                  src: "/images/proyects/capptura/capptura-paquetes.jpg",
                  alt: "Capptura: los tipos de sesión, cada uno con su galería",
                },
                {
                  src: "/images/proyects/capptura/capptura-reserva.jpg",
                  alt: "Capptura: la reserva en tres pasos, en escritorio y en el celular",
                },
              ]}
              columns={2}
              equalHeight
            />
          </div>
        </CaseArticleWide>

        <CaseArticleText>
          <p className="text-body-lg leading-relaxed text-[#334155]">
            {data.description}
          </p>
        </CaseArticleText>
      </CaseArticle>

      <CaseNextProject excludeSlug="capptura" />

      <CaseContactCTA />
    </div>
  );
}
