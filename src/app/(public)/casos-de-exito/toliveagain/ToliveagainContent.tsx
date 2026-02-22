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

export default function ToliveagainContent() {
  const data = useCaseContent("toliveagain");
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
        gradient="linear-gradient(180deg, #1a0f14 0%, #2d1a28 40%, #5c3d52 70%, #9a7a8a 100%)"
        blurOrbs={["rgba(139,90,120,0.2)", "rgba(180,140,160,0.25)"]}
      />

      <CaseArticle>
        <CaseArticleText>
          <p className="text-overline mb-4 text-[#0072CF]">
            {t("caseDetail.aboutProject")}
          </p>

          <p className="text-body-lg mb-6 leading-relaxed text-[#334155]">
            To Live Again es una ONG creada en 2016, con sede principal en Miami
            (FL) y presencia en Perú. Dedicada única y exclusivamente a prevenir
            y crear conciencia sobre el abuso doméstico, inspirar a víctimas a
            buscar ayuda y empoderar a mujeres en situación de vulnerabilidad.
          </p>

          <p className="text-body mb-8 leading-relaxed text-[#334155]">
            Desarrollamos toliveagain.org con WordPress: conócenos, qué
            realizamos (inspirar, prevenir, crear conciencia), equipo
            multidisciplinario con presencia en Florida y Perú, fundadora,
            impacto en la comunidad, eventos y talleres, donaciones vía PayPal,
            contacto e integración con Instagram.
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
                  src: "/images/proyects/toliveagain/toliveagain-equipo.jpg",
                  alt: "To Live Again — sección equipo o eventos",
                },
                {
                  src: "/images/proyects/toliveagain/toliveagain-donacion.jpg",
                  alt: "To Live Again — donaciones o contacto",
                },
              ]}
              columns={2}
              equalHeight
              equalHeightAspect="1/1"
            />
          </div>
        </CaseArticleWide>

        <CaseArticleText>
          <p className="text-body-lg leading-relaxed text-[#334155]">
            Hoy toliveagain.org presenta la misión de To Live Again, su equipo,
            eventos y talleres de empoderamiento, impacto en la comunidad y el
            canal de donaciones para ayudar a mujeres en situación de abuso en
            Miami y Perú.
          </p>
        </CaseArticleText>
      </CaseArticle>

      <CaseNextProject excludeSlug="toliveagain" />

      <CaseContactCTA />
    </div>
  );
}
