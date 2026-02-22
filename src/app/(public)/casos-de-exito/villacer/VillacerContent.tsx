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

export default function VillacerContent() {
  const data = useCaseContent("villacer");
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
        gradient="linear-gradient(180deg, #0a0a0a 0%, #141414 50%, #1a1a1a 100%)"
        blurOrbs={["rgba(255,255,255,0.03)", "rgba(255,255,255,0.05)"]}
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
                  src: "/images/proyects/villacer/villacer-home.jpg",
                  alt: "Villacer — homepage en tablet",
                },
                {
                  src: "/images/proyects/villacer/villacer-equipos.jpg",
                  alt: "Villacer — página de flota de equipos en tablet",
                },
              ]}
              columns={2}
            />
          </div>
        </CaseArticleWide>

        <CaseArticleText>
          <p className="text-body-lg mb-8 leading-relaxed text-[#334155]">
            La identidad de marca se aplicó en la web y en los uniformes del
            equipo, reforzando la presencia de Villacer en obra. La web es
            responsive y permite solicitar cotizaciones y explorar la flota de
            equipos desde cualquier dispositivo.
          </p>
        </CaseArticleText>

        <CaseFeatureShowcase
          background="light"
          subtitle="Entregables"
          title={t("caseDetail.funcionalidadesClave")}
          features={[
            {
              icon: "Layout",
              title: "Branding Completo",
              description:
                "Identidad de marca: logo, paleta de colores (azul, amarillo) y aplicación en web, uniformes y papelería.",
            },
            {
              icon: "Globe",
              title: "Web Informativa",
              description:
                "villacer.com.pe con quiénes somos, historia, servicios (alquiler de equipos, desarrollo de obras), flota, proyectos y contacto.",
            },
            {
              icon: "Smartphone",
              title: "Solicitar Cotización",
              description:
                "Formulario de contacto, ver equipos y cotizaciones adaptado a desktop y móvil para facilitar consultas.",
            },
          ]}
          columns={3}
        />

        <CaseArticleWide>
          <div className="mb-12 lg:mb-16">
            <CaseImages
              images={[
                {
                  src: "/images/proyects/villacer/villacer-branding.jpg",
                  alt: "Villacer — branding aplicado en uniformes",
                },
                {
                  src: "/images/proyects/villacer/villacer-mobile.jpg",
                  alt: "Villacer — página de servicios en móvil",
                },
              ]}
              columns={2}
            />
          </div>
        </CaseArticleWide>

        <CaseArticleText>
          <p className="text-body-lg leading-relaxed text-[#334155]">
            {data.description}
          </p>
        </CaseArticleText>
      </CaseArticle>

      <CaseNextProject excludeSlug="villacer" />

      <CaseContactCTA />
    </div>
  );
}
