"use client";

import { Clock, Globe, Monitor } from "lucide-react";
import {
  CaseArticle,
  CaseArticleText,
  CaseArticleWide,
  CaseFeatureShowcase,
  CaseHeroFullImage,
  CaseImages,
  CaseNextProject,
} from "~/components/axium/case-blocks";
import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import { useTranslation } from "~/hooks/useTranslation";
import { useCaseContent } from "~/lib/case-translations";

export default function SicloContent() {
  const data = useCaseContent("siclo");
  const { t } = useTranslation("landing");

  if (!data) return null;

  return (
    <div className="min-h-screen">
      <CaseHeroFullImage
        title={data.title}
        description={data.description}
        image={data.image}
        services={data.services}
        technologies={data.technologyStack}
        liveUrl={data.liveUrl}
        fullHeight
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
              images={[
                {
                  src: data.image,
                  alt: `${data.title} — documentación y centro de recursos`,
                  aspect: "full",
                },
              ]}
              columns={1}
            />
          </div>
        </CaseArticleWide>

        <CaseFeatureShowcase
          background="light"
          subtitle="Instructor Management System"
          title={t("caseDetail.funcionalidadesClave")}
          features={[
            {
              icon: "Layers",
              title: "Gestión de Instructores",
              description:
                "Administra instructores, sus disciplinas, categorías e información de contacto de forma centralizada. Controla el estado activo/inactivo de cada instructor.",
            },
            {
              icon: "BookOpen",
              title: "Registro de Clases",
              description:
                "Registra clases por semana, instructor y disciplina. Gestiona ocupación, covers, clases versus y seguimiento completo de cada sesión.",
            },
            {
              icon: "FileText",
              title: "Importación Masiva",
              description:
                "Importa clases desde Excel con validación automática. El sistema detecta instructores, disciplinas y crea clases en masa de forma eficiente.",
            },
            {
              icon: "CreditCard",
              title: "Cálculo Automático de Pagos",
              description:
                "Calcula pagos según ocupación, categoría del instructor y fórmulas personalizadas. Incluye bonos, penalizaciones y retención automática.",
            },
            {
              icon: "BarChart3",
              title: "Bonos y Penalizaciones",
              description:
                "Administra covers, brandings, theme rides, workshops, clases versus y penalizaciones con sistema de puntos configurable.",
            },
            {
              icon: "Lock",
              title: "Configuración Flexible",
              description:
                "Define períodos, disciplinas, fórmulas de pago y tarifas personalizadas. Ajusta parámetros del sistema según tus necesidades.",
            },
          ]}
          columns={3}
        />
      </CaseArticle>

      <CaseNextProject excludeSlug="siclo" />

      <CaseContactCTA />
    </div>
  );
}
