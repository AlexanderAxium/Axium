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

export default function BlendetContent() {
  const data = useCaseContent("blendet");
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
        gradient="linear-gradient(180deg, #2B171B 0%, #5C343B 45%, #9B6D74 100%)"
        blurOrbs={["rgba(222,187,185,0.22)", "rgba(245,218,223,0.12)"]}
        services={data.services}
        technologies={data.technologyStack}
        liveUrl={data.liveUrl}
      />

      <CaseArticle>
        <CaseArticleText>
          <p className="text-overline mb-4 text-[#8A5A61]">
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
              <Monitor className="h-3.5 w-3.5 text-[#8A5A61]" />
              <span className="text-pill text-[#64748b]">
                {t("caseDetail.platform")}:
              </span>
              <span className="text-pill font-semibold text-[#0f172a]">
                {data.platform}
              </span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-[#f1f5f9] px-3.5 py-1.5">
              <Clock className="h-3.5 w-3.5 text-[#8A5A61]" />
              <span className="text-pill text-[#64748b]">
                {t("caseDetail.duration")}:
              </span>
              <span className="text-pill font-semibold text-[#0f172a]">
                {data.duration}
              </span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-[#f1f5f9] px-3.5 py-1.5">
              <Globe className="h-3.5 w-3.5 text-[#8A5A61]" />
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
                  src: "/images/proyects/blendet/blendet-servicios.jpg",
                  alt: "Blendet: la carta de servicios, con la duración y el precio de cada técnica",
                },
                {
                  src: "/images/proyects/blendet/blendet-reserva.jpg",
                  alt: "Blendet: la reserva en tres pasos, en escritorio y en el celular",
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

      <CaseNextProject excludeSlug="blendet" />

      <CaseContactCTA />
    </div>
  );
}
