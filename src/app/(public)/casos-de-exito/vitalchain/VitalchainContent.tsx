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

export default function VitalchainContent() {
  const data = useCaseContent("vitalchain");
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
        gradient="linear-gradient(180deg, #0a1628 0%, #1e3a5f 50%, #2d1a5e 100%)"
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
            Desarrollamos vitalchainacademy.com con la web principal que
            presenta programas transformadores y próximas experiencias de
            crecimiento, una plataforma e-learning, un blog con contenido sobre
            blockchain y desarrollo personal, y el sistema de sorteo consciente
            con countdown integrado. Incluimos la integración con el partner de
            viajes Akshaya Travel y una newsletter para mantener a la comunidad
            informada. Todo con transparencia digital mediante tecnología
            blockchain.
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
          <div className="mb-8 lg:mb-8">
            <CaseImages
              images={[
                {
                  src: "/images/proyects/vitalchain/vitalchain-platform.jpg",
                  alt: "VitalChain Academy — plataforma e-learning y programas transformadores",
                  caption: "Plataforma y programas",
                },
                {
                  src: "/images/proyects/vitalchain/vitalchain-sorteo.jpg",
                  alt: "VitalChain Academy — sistema de sorteo de gratitud con cuenta regresiva",
                  caption: "Sistema de sorteo consciente",
                },
              ]}
              columns={1}
            />
          </div>
        </CaseArticleWide>

        <CaseFeatureShowcase
          background="light"
          subtitle="Plataforma integral"
          title={t("caseDetail.funcionalidadesClave")}
          features={[
            {
              icon: "BookOpen",
              title: "Cursos y formaciones",
              description:
                "Gestión de cursos, categorías y docentes para contenido formativo.",
            },
            {
              icon: "FileText",
              title: "Blog con CMS",
              description:
                "Artículos editables con SEO, destacados y fechas de publicación.",
            },
            {
              icon: "ShoppingBag",
              title: "Productos y pedidos",
              description:
                "Productos físicos y digitales, órdenes y facturación integrada.",
            },
            {
              icon: "Zap",
              title: "Inscripciones y pagos",
              description:
                "Inscripciones a programas e integración con proveedores de pago.",
            },
            {
              icon: "Ticket",
              title: "Tickets NFT",
              description:
                "Sistema de tickets on-chain con registro de wallet y estado de transferencia.",
            },
            {
              icon: "Globe",
              title: "Sorteo consciente",
              description:
                "Countdown para eventos y sorteos de gratitud integrados a la experiencia.",
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

      <CaseNextProject excludeSlug="vitalchain" />

      <CaseContactCTA />
    </div>
  );
}
