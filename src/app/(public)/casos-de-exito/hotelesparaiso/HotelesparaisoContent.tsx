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

export default function HotelesparaisoContent() {
  const data = useCaseContent("hotelesparaiso");
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
        gradient="linear-gradient(180deg, #0d0a08 0%, #1f1510 35%, #3d2518 60%, #6b3a1f 85%, #8f4a26 100%)"
      />

      <CaseArticle>
        <CaseArticleText>
          <p className="text-overline mb-4 text-[#0072CF]">
            {t("caseDetail.aboutProject")}
          </p>

          <p className="text-body-lg mb-6 leading-relaxed text-[#334155]">
            {data.projectDescription}
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
                  src: "/images/proyects/hotelesparaiso/hotelesparaiso-desc-1.jpg",
                  alt: `${data.title} — instalaciones y experiencia en el norte del Perú`,
                  caption: "Instalaciones",
                },
                {
                  src: "/images/proyects/hotelesparaiso/hotelesparaiso-desc-2.jpg",
                  alt: `${data.title} — sedes Trujillo, Chiclayo y Piura`,
                  caption: "Sedes y ubicaciones",
                },
              ]}
              columns={2}
            />
          </div>
        </CaseArticleWide>

        <CaseFeatureShowcase
          background="light"
          subtitle="Hoteles Paraíso"
          title={t("caseDetail.funcionalidadesClave")}
          features={[
            {
              icon: "Globe",
              title: "Web informativa multi-sede",
              description:
                "Sitio con información de las tres sedes: Trujillo, Chiclayo y Piura, con datos de habitaciones, servicios y ubicación.",
            },
            {
              icon: "Globe",
              title: "Integración Instagram",
              description:
                "Conexión con Instagram para mostrar experiencias de huéspedes, instalaciones y promociones en tiempo real.",
            },
            {
              icon: "Smartphone",
              title: "Diseño responsive",
              description:
                "Experiencia optimizada en móvil y desktop para que los viajeros consulten desde cualquier dispositivo.",
            },
            {
              icon: "Layout",
              title: "Reservas y contacto",
              description:
                "Canales de contacto y reservas integrados para que los clientes puedan consultar disponibilidad fácilmente.",
            },
          ]}
          columns={2}
        />
      </CaseArticle>

      <CaseNextProject excludeSlug="hotelesparaiso" />

      <CaseContactCTA />
    </div>
  );
}
