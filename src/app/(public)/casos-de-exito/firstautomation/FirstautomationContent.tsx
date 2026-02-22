"use client";

import { Clock, Globe, Monitor } from "lucide-react";
import {
  CaseArticle,
  CaseArticleText,
  CaseArticleWide,
  CaseHeroFullImage,
  CaseImages,
  CaseNextProject,
} from "~/components/axium/case-blocks";
import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import { useTranslation } from "~/hooks/useTranslation";
import { useCaseContent } from "~/lib/case-translations";

export default function FirstautomationContent() {
  const data = useCaseContent("firstautomation");
  const { t } = useTranslation("landing");

  if (!data) return null;

  return (
    <div className="min-h-screen">
      <CaseHeroFullImage
        title={data.title}
        description={data.description}
        image={data.image}
        industry={data.industry}
        location={data.location}
        overlayOpacity={0.7}
        services={data.services}
        technologies={data.technologyStack}
        fullHeight
        liveUrl={data.liveUrl}
      />

      <CaseArticle>
        <CaseArticleText>
          <p className="text-overline mb-4 text-[#0072CF]">
            {t("caseDetail.aboutProject")}
          </p>

          <p className="text-body-lg mb-6 leading-relaxed text-[#334155]">
            First Automation es partner certificado de AVEVA y acelera la
            transición de Latinoamérica hacia la Industria 4.0. Nos contactaron
            para crear una web informativa que presentara sus soluciones de
            control, gestión y optimización de operaciones industriales.
          </p>

          <p className="text-body mb-8 leading-relaxed text-[#334155]">
            Desarrollamos first-automation.com con WordPress: hero con propuesta
            de valor (digitalizamos operaciones industriales), soluciones AVEVA
            (InTouch HMI, System Platform, Historian, Reports, Insight, PI
            System), servicios (HMI/SCADA, plataforma IT/OT, transformación
            digital), industrias que atienden, testimonios de clientes como TASA
            y ONP, y blog de novedades.
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
                  src: "/images/proyects/firstautomation/firstautomation-home.jpg",
                  alt: "First Automation — vista principal / portada del sitio",
                },
                {
                  src: "/images/proyects/firstautomation/firstautomation-mockup.jpg",
                  alt: "First Automation — mockup del sitio",
                },
              ]}
              columns={2}
              equalHeight
            />
          </div>
        </CaseArticleWide>

        <CaseArticleText>
          <p className="text-body-lg leading-relaxed text-[#334155]">
            Hoy first-automation.com presenta las soluciones AVEVA, servicios de
            HMI/SCADA, plataforma IT/OT y transformación digital, con
            testimonios de ingenieros de TASA, ONP y otros clientes del sector
            industrial.
          </p>
        </CaseArticleText>
      </CaseArticle>

      <CaseNextProject excludeSlug="firstautomation" />

      <CaseContactCTA />
    </div>
  );
}
