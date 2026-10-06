"use client";

import { Clock, Globe, Monitor } from "lucide-react";
import {
  CaseArticle,
  CaseArticleText,
  CaseFeatureShowcase,
  CaseHeroSplit,
  CaseNextProject,
} from "~/components/axium/case-blocks";
import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import { useTranslation } from "~/hooks/useTranslation";
import { useCaseContent } from "~/lib/case-translations";

export default function WebScrapingAiContent() {
  const data = useCaseContent("web-scraping-ai");
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
        gradient="linear-gradient(135deg, #061516 0%, #0a1c24 35%, #0d252e 65%, #14353a 100%)"
        blurOrbs={["rgba(34,139,87,0.12)", "rgba(100,149,237,0.15)"]}
      />

      <CaseArticle>
        <CaseArticleText>
          <p className="text-overline mb-4 text-[#0072CF]">
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

        <CaseFeatureShowcase
          background="light"
          subtitle="AI-Powered Web Scraping"
          title={t("caseDetail.funcionalidadesClave")}
          features={[
            {
              icon: "Globe",
              title: "¿Dónde buscar?",
              description:
                "Los sitemaps guían al pipeline: encuentra todas las páginas relevantes sin explorar a ciegas ni depender de enlaces manuales.",
            },
            {
              icon: "FileText",
              title: "¿Cómo extraer?",
              description:
                "HTML estático o páginas que cargan con JavaScript: el scraper elige la estrategia correcta para cada sitio.",
            },
            {
              icon: "Zap",
              title: "¿Y el ruido?",
              description:
                "La IA interpreta el contenido en bruto, extrae lo que importa y lo transforma en datos coherentes, sin reglas fijas por sitio.",
            },
            {
              icon: "Layers",
              title: "¿Dónde queda todo?",
              description:
                "Una base relacional lista para consultas, reportes o integraciones con otros sistemas de la empresa.",
            },
            {
              icon: "Monitor",
              title: "¿Cómo se ejecuta?",
              description:
                "En un contenedor que corre igual en tu máquina, un servidor o un cron job: despliegue predecible.",
            },
            {
              icon: "BarChart3",
              title: "¿Para qué sirve?",
              description:
                "Competidores, precios, contenido o inventarios: el mismo pipeline se adapta al dominio que necesites.",
            },
          ]}
          columns={3}
        />
      </CaseArticle>

      <CaseNextProject excludeSlug="web-scraping-ai" />

      <CaseContactCTA />
    </div>
  );
}
