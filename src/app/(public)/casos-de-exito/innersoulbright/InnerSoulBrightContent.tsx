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

export default function InnerSoulBrightContent() {
  const data = useCaseContent("innersoulbright");
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
            Inner Soul Bright es un espacio de sanación espiritual y meditación.
            Nos contactaron para crear un sitio web informativo que transmitiera
            paz, claridad y conexión espiritual.
          </p>

          <p className="text-body mb-8 leading-relaxed text-[#334155]">
            Desarrollamos innersoulbright.com con diseño inmersivo: fondos
            cósmicos, hero impactante, sección de servicios (lectura energética,
            limpieza energética, protección espiritual, alineación y propósito),
            página «Sobre Mí» para conectar con visitantes.
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
                  src: "/images/proyects/innersoulbright/innersoulbright-mobile.jpg",
                  alt: "Inner Soul Bright — vista móvil del sitio",
                  caption: "Vista móvil",
                },
                {
                  src: "/images/proyects/innersoulbright/innersoulbright-desktop.jpg",
                  alt: "Inner Soul Bright — vista desktop del sitio",
                  caption: "Vista desktop",
                },
              ]}
              columns={2}
            />
          </div>
        </CaseArticleWide>

        <CaseArticleText>
          <p className="text-body-lg leading-relaxed text-[#334155]">
            Hoy innersoulbright.com opera como web informativa para crecimiento
            espiritual, con diseño que transmite paz y servicios bien
            presentados.
          </p>
        </CaseArticleText>
      </CaseArticle>

      <CaseNextProject excludeSlug="innersoulbright" />

      <CaseContactCTA />
    </div>
  );
}
