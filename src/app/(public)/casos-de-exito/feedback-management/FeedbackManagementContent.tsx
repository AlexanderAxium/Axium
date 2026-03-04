"use client";

import { Clock, Globe, Monitor } from "lucide-react";
import {
  CaseArticle,
  CaseArticleText,
  CaseArticleWide,
  CaseFeatureShowcase,
  CaseHeroSplit,
  CaseImages,
  CaseNextProject,
} from "~/components/axium/case-blocks";
import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import { useTranslation } from "~/hooks/useTranslation";
import { useCaseContent } from "~/lib/case-translations";

export default function FeedbackManagementContent() {
  const data = useCaseContent("feedback-management");
  const { t } = useTranslation("landing");
  const secondaryImage = (data as { secondaryImage?: string })?.secondaryImage;

  if (!data) return null;

  return (
    <div className="min-h-screen">
      <CaseHeroSplit
        title={data.title}
        description={data.description}
        image={data.image}
        services={data.services}
        technologies={data.technologyStack}
        liveUrl={data.liveUrl ?? undefined}
        gradient="linear-gradient(140deg, #1a1f36 0%, #252d4a 25%, #2d3a5c 50%, #1e2642 100%)"
        blurOrbs={["rgba(100,150,220,0.18)", "rgba(140,100,180,0.12)"]}
      />

      <CaseArticle>
        <CaseArticleText>
          <p className="text-overline mb-4 text-[#0072CF]">
            {t("caseDetail.aboutProject")}
          </p>

          <p className="text-body-lg mb-6 leading-relaxed text-[#334155]">
            {data.projectDescription}
          </p>

          <p className="text-body mb-6 leading-relaxed text-[#334155]">
            {data.solution}
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
          <div className="mb-12 lg:mb-16 w-full">
            <CaseImages
              images={
                secondaryImage
                  ? [
                      {
                        src: secondaryImage,
                        alt: `${data.title} — portal de sugerencias y calificaciones`,
                        aspect: "full" as const,
                      },
                    ]
                  : []
              }
              columns={1}
            />
          </div>
        </CaseArticleWide>

        <CaseFeatureShowcase
          background="light"
          subtitle={data.title}
          title={t("caseDetail.funcionalidadesClave")}
          features={[
            {
              icon: "FileText",
              title: "Sugerencias y priorización",
              description:
                "Gestión de sugerencias con filtros por estado (pendiente, en proceso, resuelta), prioridad (alta, media, baja) y sucursal. KPIs: total, pendientes, resueltas y tasa de resolución.",
            },
            {
              icon: "BarChart3",
              title: "Calificaciones y NPS",
              description:
                "Calificaciones por instructor y sucursal con promedio general, NPS y desglose por categorías: limpieza, audio, atención, comodidades y puntualidad. Filtros por instructor, sucursal y fechas.",
            },
            {
              icon: "Layers",
              title: "Personal y multi-sucursal",
              description:
                "Gestión de managers y supervisores con roles, contacto y sucursales asignadas. Administración de instructores y locales para feedback segmentado por branch.",
            },
            {
              icon: "Globe",
              title: "Analíticas y dashboards",
              description:
                "Estadísticas detalladas, ranking de sucursales e instructores por NPS, desglose de calificaciones y dashboards interactivos con filtros por sucursal, instructor y rango de fechas.",
            },
          ]}
          columns={2}
        />
      </CaseArticle>

      <CaseNextProject excludeSlug="feedback-management" />

      <CaseContactCTA />
    </div>
  );
}
