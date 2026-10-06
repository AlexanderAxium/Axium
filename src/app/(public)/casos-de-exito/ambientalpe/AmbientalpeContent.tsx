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

export default function AmbientalpeContent() {
  const data = useCaseContent("ambientalpe");
  const { t } = useTranslation("landing");
  const systemMockup = (data as { systemMockupImage?: string })
    ?.systemMockupImage;
  const galleryImages = (data as { galleryImages?: string[] })?.galleryImages;

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
            <p className="text-overline mb-6 text-[#0072CF]">
              Mockup del sistema
            </p>
            <CaseImages
              images={[
                {
                  src: systemMockup ?? data.image,
                  alt: `${data.title} — Sistema de gestión ambiental`,
                  aspect: "full",
                },
              ]}
              columns={1}
            />
          </div>
        </CaseArticleWide>

        {galleryImages && galleryImages.length >= 2 && (
          <CaseArticleWide>
            <p className="text-overline mb-6 text-[#0072CF]">
              Publicaciones en redes sociales
            </p>
            <div className="space-y-6">
              <CaseImages
                images={galleryImages.slice(0, 2).map((src, i) => ({
                  src,
                  alt: `${data.title} — publicación ${i + 1}`,
                  aspect: "4/3" as const,
                }))}
                columns={2}
              />
              {/*
                Las tres publicaciones de catálogo eran tres archivos del mismo
                molde en fila: se leían como tres capturas. Hoy son UNA pieza
                compuesta, en dos encuadres: en fila para el escritorio y en
                cascada vertical para el móvil, porque a 360 px tres fichas en
                fila quedan a 100 px y no se lee ni el nombre del equipo.
              */}
              {galleryImages.length >= 3 && (
                <>
                  <div className="hidden md:block">
                    <CaseImages
                      images={galleryImages.slice(2).map((src, i) => ({
                        src,
                        alt: `${data.title} — publicación ${i + 3}`,
                        aspect: "4/3" as const,
                      }))}
                      columns={
                        galleryImages.length - 2 >= 3
                          ? 3
                          : galleryImages.length - 2 === 2
                            ? 2
                            : 1
                      }
                    />
                  </div>
                  <div className="md:hidden">
                    <CaseImages
                      images={[
                        {
                          src: "/images/proyects/ambientalpe/amb-catalogo-movil.jpg",
                          alt: `${data.title} — fichas de catálogo para redes: estación meteorológica, generador portátil y tren de muestreo de gases, con el mismo molde`,
                        },
                      ]}
                      columns={1}
                    />
                  </div>
                </>
              )}
            </div>
          </CaseArticleWide>
        )}
      </CaseArticle>

      <CaseNextProject excludeSlug="ambientalpe" />

      <CaseContactCTA />
    </div>
  );
}
