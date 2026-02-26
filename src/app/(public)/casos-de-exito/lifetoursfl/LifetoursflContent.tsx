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

export default function LifetoursflContent() {
  const data = useCaseContent("lifetoursfl");
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
        gradient="linear-gradient(180deg, #050c18 0%, #071428 18%, #0a1c35 36%, #0d2442 54%, #113a5c 72%, #164d7a 88%, #1a5f8f 100%)"
        blurOrbs={["rgba(30, 107, 181, 0.28)", "rgba(0, 150, 255, 0.22)"]}
      />

      <CaseArticle>
        <CaseArticleText>
          <p className="text-overline mb-4 text-[#0072CF]">
            {t("caseDetail.aboutProject")}
          </p>

          <p className="text-body-lg mb-6 leading-relaxed text-[#334155]">
            {data.projectDescription}
          </p>

          <p className="text-body mb-6 leading-relaxed text-[#334155]">
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
                  src: "/images/proyects/lifetoursfl/lifetoursfl-1.jpg",
                  alt: `${data.title} — búsqueda de vuelos y promociones`,
                },
                {
                  src: "/images/proyects/lifetoursfl/lifetoursfl-2.jpg",
                  alt: `${data.title} — solicitud de cotización`,
                },
              ]}
              columns={2}
            />
          </div>
        </CaseArticleWide>

        <CaseFeatureShowcase
          background="light"
          subtitle="Travel Life"
          title={t("caseDetail.funcionalidadesClave")}
          features={[
            {
              icon: "Ticket",
              title: "Búsqueda y reserva de vuelos",
              description:
                "Catálogo de vuelos integrado para que los usuarios exploren destinos, fechas y opciones, con flujo orientado a la reserva.",
            },
            {
              icon: "Zap",
              title: "Promociones y ofertas",
              description:
                "Sección dedicada a promociones y ofertas para destacar precios especiales y paquetes que incentivan la conversión.",
            },
            {
              icon: "FileText",
              title: "Solicitud de cotización",
              description:
                "Formulario de cotización para que los clientes soliciten presupuestos a medida sin compromiso.",
            },
            {
              icon: "Lock",
              title: "Autenticación (login y registro)",
              description:
                "Sistema de registro e inicio de sesión para gestionar usuarios de forma segura con persistencia en PostgreSQL.",
            },
            {
              icon: "Monitor",
              title: "Dashboard de usuario",
              description:
                "Área privada donde el usuario accede a su información, reservas o cotizaciones una vez autenticado.",
            },
            {
              icon: "CreditCard",
              title: "Pasarela de pagos",
              description:
                "Integración con métodos de pago: Visa, Mastercard, Amex y PayPal para transacciones seguras.",
            },
            {
              icon: "Globe",
              title: "Experiencia multi-destino",
              description:
                "Plataforma pensada para descubrir y comparar destinos con una navegación clara y enlaces rápidos.",
            },
            {
              icon: "Smartphone",
              title: "Diseño responsive",
              description:
                "Interfaz adaptable a móvil y desktop para que los viajeros reserven o cotizen desde cualquier dispositivo.",
            },
          ]}
          columns={3}
        />
      </CaseArticle>

      <CaseNextProject excludeSlug="lifetoursfl" />

      <CaseContactCTA />
    </div>
  );
}
