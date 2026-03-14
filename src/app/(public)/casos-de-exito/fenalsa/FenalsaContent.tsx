"use client";

import { Clock, Globe, Monitor } from "lucide-react";
import {
  CaseArticle,
  CaseHeroSplit,
  CaseImages,
  CaseNextProject,
} from "~/components/axium/case-blocks";
import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import { useTranslation } from "~/hooks/useTranslation";
import { useCaseContent } from "~/lib/case-translations";

export default function FenalsaContent() {
  const data = useCaseContent("fenalsa");
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
        services={data.services}
        technologies={data.technologyStack}
        liveUrl={data.liveUrl}
        gradient="linear-gradient(135deg, #061510 0%, #0a1c18 35%, #0f2a22 65%, #1a4035 100%)"
        blurOrbs={["rgba(26,99,78,0.12)", "rgba(34,139,87,0.18)"]}
      />

      <CaseArticle>
        <div className="container-section">
          <div className="content-section">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
              <div>
                <p className="text-overline mb-4 text-[#0072CF]">
                  {t("caseDetail.aboutProject")}
                </p>

                <p className="text-body-lg mb-6 leading-relaxed text-[#334155]">
                  {data.projectDescription}
                </p>

                <p className="text-body mb-8 leading-relaxed text-[#334155]">
                  {data.solution}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-[#f1f5f9] px-3.5 py-1.5">
                    <Monitor className="h-3.5 w-3.5 text-[#0072CF]" />
                    <span className="text-pill text-[#64748b]">
                      {t("caseDetail.platform")}:
                    </span>
                    <span className="text-pill font-semibold text-[#0f172a]">
                      {data.platform}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-[#f1f5f9] px-3.5 py-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#0072CF]" />
                    <span className="text-pill text-[#64748b]">
                      {t("caseDetail.duration")}:
                    </span>
                    <span className="text-pill font-semibold text-[#0f172a]">
                      {data.duration}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-[#f1f5f9] px-3.5 py-1.5">
                    <Globe className="h-3.5 w-3.5 text-[#0072CF]" />
                    <span className="text-pill text-[#64748b]">
                      {t("caseDetail.client")}:
                    </span>
                    <span className="text-pill font-semibold text-[#0f172a]">
                      {data.client}
                    </span>
                  </span>
                </div>
              </div>

              <div className="relative">
                <CaseImages
                  images={[
                    {
                      src: "/images/proyects/fenalsa/fenalsa-desc-1.jpg",
                      alt: `${data.title} — servicios de alimentación y limpieza en Arequipa`,
                    },
                  ]}
                  columns={1}
                />
              </div>
            </div>
          </div>
        </div>
      </CaseArticle>

      <CaseNextProject excludeSlug="fenalsa" />

      <CaseContactCTA />
    </div>
  );
}
