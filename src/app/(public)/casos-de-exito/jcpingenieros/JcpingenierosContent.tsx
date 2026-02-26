"use client";

import { Clock, Globe, Monitor } from "lucide-react";
import { useEffect, useMemo } from "react";
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
import { useCaseContent, useCasesWithLocale } from "~/lib/case-translations";

const SLUG_MAP: Record<string, string> = {
  Maintech: "maintech",
  "VitalChain Academy": "vitalchain",
  Feniz: "feniz",
  "Inner Soul Bright": "innersoulbright",
  Clefast: "clefast",
  "Happy Art": "happyart",
  "Redes VIP": "redesvip",
  "Sportt Peru": "sportt",
  "Vitivinícola Luján": "lujan",
  "Ventanas Antiruido": "ventanasantiruido",
  Decibeles: "antiruidopvc",
  "Transportes Rumi": "transportesrumi",
  Villacer: "villacer",
  "Daesur Motors": "daesurmotors",
  "First Automation": "firstautomation",
  "To Live Again": "toliveagain",
  "Podologie MTK": "podologiemtk",
  EnrafMedica: "enrafmedica",
  Huarmis: "huarmis",
  "Favor & Gracia Church": "favorygracia",
  "Hoteles Paraíso": "hotelesparaiso",
  "JCP Ingenieros": "jcpingenieros",
};

function getSlug(title: string, slug?: string) {
  return slug ?? SLUG_MAP[title] ?? title.toLowerCase().replace(/\s+/g, "-");
}

export default function JcpingenierosContent() {
  const data = useCaseContent("jcpingenieros");
  const allCases = useCasesWithLocale();
  const { t } = useTranslation("landing");

  const otherCases = useMemo(
    () => allCases.filter((c) => getSlug(c.title, c.slug) !== "jcpingenieros"),
    [allCases]
  );

  const slugsToPrefetch = useMemo(
    () => otherCases.slice(0, 6).map((c) => getSlug(c.title, c.slug)),
    [otherCases]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    slugsToPrefetch.forEach(
      (slug) => void fetch(`${window.location.origin}/casos-de-exito/${slug}`)
    );
  }, [slugsToPrefetch]);

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
        gradient="linear-gradient(180deg, #050810 0%, #070d18 15%, #0a1220 30%, #0d1828 50%, #122840 70%, #1a3a5c 85%, #1e4a6f 100%)"
      />

      <CaseArticle>
        <CaseArticleText>
          <p className="text-overline mb-4 text-[#0072CF]">
            {t("caseDetail.aboutProject")}
          </p>

          <p className="text-body-lg mb-6 leading-relaxed text-[#334155]">
            {data.projectDescription}
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-12 lg:mb-16">
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
        </CaseArticleText>

        <CaseArticleWide>
          <div className="mb-12 lg:mb-16">
            <CaseImages
              images={[
                {
                  src: data.image,
                  alt: `${data.title} — soluciones integrales para equipamiento hospitalario`,
                  caption: "Web institucional",
                },
              ]}
              columns={1}
            />
          </div>
        </CaseArticleWide>
      </CaseArticle>

      <CaseNextProject excludeSlug="jcpingenieros" />

      <CaseContactCTA />
    </div>
  );
}
