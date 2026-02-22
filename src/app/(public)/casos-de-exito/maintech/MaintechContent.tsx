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

export default function MaintechContent() {
  const data = useCaseContent("maintech");
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
            Diseñamos la identidad de marca completa: logo, iconotipo, manual de
            marca con paleta de colores, tipografía y guías de uso. A partir de
            esa base visual, desarrollamos tres productos web: el sitio
            principal maintech.com.pe, la plataforma e-learning Maintech Academy
            y la subweb corporativa Maintech Solutions.
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
                  src: "/images/proyects/maintech/maintech-solutions.jpg",
                  alt: "Maintech Solutions — subweb corporativa informativa",
                  caption: "Maintech Solutions",
                },
              ]}
              columns={1}
            />
          </div>
        </CaseArticleWide>

        <CaseArticleText>
          <p className="text-overline mb-4 text-[#0072CF]">Maintech Academy</p>

          <p className="text-body-lg mb-20 leading-relaxed text-[#334155] lg:mb-28">
            La pieza central del proyecto fue Maintech Academy, una plataforma
            de aprendizaje en línea. Construimos un sistema de gestión de cursos
            con inscripción, módulos organizados por capítulos, seguimiento de
            progreso en tiempo real, dashboards estudiantiles personalizados y
            generación automática de certificados de finalización con
            verificación digital.
          </p>
        </CaseArticleText>

        <CaseArticleWide>
          <div className="mb-12 lg:mb-16">
            <CaseImages
              images={[
                {
                  src: "/images/proyects/maintech/maintech-academy-lap.jpg",
                  alt: "Maintech Academy — dashboard de cursos y progreso en laptop",
                  caption: "Dashboard de cursos",
                },
                {
                  src: "/images/proyects/maintech/maintech-academy-mobile.jpg",
                  alt: "Maintech Academy — vista móvil de detalle de curso",
                  caption: "Vista móvil",
                },
              ]}
            />
          </div>
        </CaseArticleWide>

        <CaseFeatureShowcase
          background="light"
          subtitle="Maintech Academy"
          title={t("caseDetail.funcionalidadesClave")}
          features={[
            {
              icon: "BookOpen",
              title: "Gestión de cursos",
              description:
                "Cursos organizados en módulos y capítulos para un aprendizaje estructurado.",
            },
            {
              icon: "Layout",
              title: "Inscripciones",
              description:
                "Sistema de matrícula con seguimiento de alumnos inscritos.",
            },
            {
              icon: "BarChart3",
              title: "Progreso en tiempo real",
              description:
                "Dashboards estudiantiles con seguimiento de avance por curso.",
            },
            {
              icon: "Monitor",
              title: "Sitio principal y subweb",
              description:
                "maintech.com.pe con Maintech Solutions como subweb corporativa.",
            },
            {
              icon: "Zap",
              title: "Certificados digitales",
              description:
                "Generación automática de certificados con verificación digital.",
            },
          ]}
          columns={3}
        />

        <CaseArticleText>
          <p className="text-body-lg leading-relaxed text-[#334155]">
            {data.description}
          </p>
        </CaseArticleText>
      </CaseArticle>

      <CaseNextProject excludeSlug="maintech" />

      <CaseContactCTA />
    </div>
  );
}
