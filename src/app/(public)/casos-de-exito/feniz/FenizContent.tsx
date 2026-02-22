"use client";

import { Clock, Globe, Monitor } from "lucide-react";
import {
  CaseArticle,
  CaseArticleText,
  CaseArticleWide,
  CaseFeatureShowcase,
  CaseHeroSplit,
  CaseImages,
  CaseMetrics,
  CaseNextProject,
} from "~/components/axium/case-blocks";
import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import { useTranslation } from "~/hooks/useTranslation";
import { useCaseContent } from "~/lib/case-translations";

export default function FenizContent() {
  const data = useCaseContent("feniz");
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
        gradient="linear-gradient(180deg, #0f172a 0%, #10293b 50%, #00122a 100%)"
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
            Feniz es una plataforma SaaS para funded traders. Nos buscaron para
            construir el ecosistema completo: sitio web público, dashboard de
            gestión de cuentas y una aplicación de escritorio para operar en
            MetaTrader de forma automática.
          </p>

          <p className="text-body mb-8 leading-relaxed text-[#334155]">
            Desarrollamos sistemafeniz.com con el sitio de presentación, el
            dashboard con métricas en tiempo real (Balance, P&L, Win Rate,
            conexiones activas), la integración con múltiples propfirms como
            FTMO y planes de suscripción. Además creamos una app de escritorio
            en Python que permite a los usuarios suscritos ejecutar operaciones
            en MetaTrader automáticamente.
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
          <div className="mb-8 lg:mb-10">
            <CaseImages
              images={[
                {
                  src: "/images/proyects/feniz/feniz-dashboard.jpg",
                  alt: "Feniz — dashboard de trader con métricas en tiempo real",
                  caption: "Dashboard de trader",
                },
              ]}
              columns={1}
            />
          </div>
          <div className="mb-12 lg:mb-16">
            <CaseImages
              images={[
                {
                  src: "/images/proyects/feniz/feniz-desktop-app.jpg",
                  alt: "Feniz — aplicación de escritorio para operaciones en MetaTrader",
                  caption: "App de escritorio — automatización en MetaTrader",
                },
              ]}
              columns={1}
            />
          </div>
        </CaseArticleWide>

        <CaseFeatureShowcase
          background="light"
          subtitle="Plataforma SaaS"
          title={t("caseDetail.funcionalidadesClave")}
          features={[
            {
              icon: "BarChart3",
              title: "Métricas en Tiempo Real",
              description:
                "Balance Total, P&L, Win Rate y conexiones activas en un dashboard intuitivo.",
            },
            {
              icon: "Layers",
              title: "Multi-Propfirm",
              description:
                "Conexión con más de 15 propfirms como FTMO en una sola plataforma centralizada.",
            },
            {
              icon: "Zap",
              title: "Acciones Rápidas",
              description:
                "Operaciones frecuentes accesibles con un solo clic para máxima eficiencia.",
            },
            {
              icon: "Lock",
              title: "Suscripciones Flexibles",
              description:
                "Planes adaptados a distintos niveles de traders con asesoría personalizada.",
            },
            {
              icon: "Monitor",
              title: "App de Escritorio",
              description:
                "Aplicación en Python para ejecutar operaciones en MetaTrader automáticamente, disponible para usuarios suscritos.",
            },
          ]}
          columns={2}
        />

        <CaseArticleText>
          <p className="text-body-lg leading-relaxed text-[#334155]">
            Hoy sistemafeniz.com ofrece un ecosistema completo: sitio web,
            dashboard de métricas en tiempo real, conexión a múltiples propfirms
            y la app de escritorio para automatizar operaciones en MetaTrader.
          </p>
        </CaseArticleText>
      </CaseArticle>

      {data.results && data.results.length > 0 && (
        <CaseMetrics
          results={data.results}
          variant="banner"
          accentGradient="linear-gradient(135deg, #1a2332 0%, #2C3E50 55%, #FFA500 100%)"
        />
      )}

      <CaseNextProject excludeSlug="feniz" />

      <CaseContactCTA />
    </div>
  );
}
