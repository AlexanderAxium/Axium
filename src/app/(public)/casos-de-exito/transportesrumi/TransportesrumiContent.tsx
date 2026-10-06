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

export default function TransportesrumiContent() {
  const data = useCaseContent("transportesrumi");
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
          <div className="mb-12 lg:mb-16">
            <CaseImages
              images={[
                {
                  src: "/images/proyects/transportesrumi/transportesrumi-brochure.jpg",
                  alt: "Transportes Rumi — brochure digital",
                },
                {
                  src: "/images/proyects/transportesrumi/transportesrumi-web.jpg",
                  alt: "Transportes Rumi — vista principal del sitio web",
                },
              ]}
              columns={2}
            />
          </div>
        </CaseArticleWide>

        <CaseFeatureShowcase
          background="light"
          subtitle="Entregables"
          title={t("caseDetail.funcionalidadesClave")}
          features={[
            {
              icon: "BookOpen",
              title: "Brochure Digital",
              description:
                "Presentación corporativa descargable con misión, equipo, servicios por sector y protocolos de seguridad.",
            },
            {
              icon: "Globe",
              title: "Web Informativa",
              description:
                "Sitio web transportesrumi.com.pe con misión, equipo, servicios, testimonios y contacto.",
            },
            {
              icon: "Layers",
              title: "Servicios por Sector",
              description:
                "Sectores minero (concentrados), industrial (materias primas), construcción (equipos de obra) y comercio general.",
            },
            {
              icon: "Lock",
              title: "Seguridad y Monitoreo",
              description:
                "Protocolos de seguridad industrial y ambiental, monitoreo GPS en tiempo real en las unidades.",
            },
            {
              icon: "Smartphone",
              title: "Contacto WhatsApp",
              description:
                "Canal de contacto directo para cotizaciones, coordinación de operaciones y consultas.",
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

      <CaseNextProject excludeSlug="transportesrumi" />

      <CaseContactCTA />
    </div>
  );
}
