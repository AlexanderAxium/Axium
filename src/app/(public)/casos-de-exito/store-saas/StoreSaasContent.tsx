"use client";

import { Clock, Globe, Monitor } from "lucide-react";
import {
  CaseArticle,
  CaseArticleText,
  CaseArticleWide,
  CaseFeatureShowcase,
  CaseHeroFullImage,
  CaseImages,
  CaseNextProject,
} from "~/components/axium/case-blocks";
import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import { useTranslation } from "~/hooks/useTranslation";
import { useCaseContent } from "~/lib/case-translations";

export default function StoreSaasContent() {
  const data = useCaseContent("store-saas");
  const { t } = useTranslation("landing");

  if (!data) return null;

  return (
    <div className="min-h-screen">
      <CaseHeroFullImage
        title={data.title}
        description={data.description}
        image={data.image}
        services={data.services}
        technologies={data.technologyStack}
        liveUrl={data.liveUrl ?? undefined}
        fullHeight
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
          <div className="mb-12 lg:mb-16 w-full">
            <CaseImages
              images={[
                {
                  src: data.image,
                  alt: `${data.title} — dashboard e-commerce e inventario`,
                  aspect: "full",
                },
              ]}
              columns={1}
            />
          </div>
        </CaseArticleWide>

        <CaseFeatureShowcase
          background="light"
          subtitle={data.title}
          title={t("caseDetail.funcionalidadesClave")}
          features={[
            {
              icon: "Layers",
              title: "Gestión de productos y catálogo",
              description:
                "Catálogo completo con categorías, colecciones y variantes (talla, color). Precios, descripciones enriquecidas, media y estado activo/borrador. Búsqueda, filtros por marca y categoría, exportación y creación masiva.",
            },
            {
              icon: "Lock",
              title: "Control de inventario y Kardex",
              description:
                "Stock por variante, umbral de reabastecimiento y notificaciones cuando el inventario está bajo. Resumen de total variantes, en stock, sin stock y valor de inventario. Módulo Kardex para historial de movimientos.",
            },
            {
              icon: "CreditCard",
              title: "Pedidos y POS",
              description:
                "Gestión de pedidos online y punto de venta integrado. Seguimiento de órdenes completadas y totales. Múltiples métodos de pago (Yape, transferencia, Culqi, efectivo) con desglose por canal.",
            },
            {
              icon: "BarChart3",
              title: "Dashboard y analíticas",
              description:
                "Ingresos totales, órdenes, clientes y productos con filtros por fecha y moneda. Tendencia de ventas, rendimiento semanal, desglose financiero (impuestos, descuentos, reembolsos) y top productos más vendidos.",
            },
            {
              icon: "Ticket",
              title: "Cupones y contenido",
              description:
                "Creación y gestión de cupones y promociones. Editor de contenido y Page Builder para personalizar la tienda. Secciones destacadas para destacar productos o campañas en el front.",
            },
            {
              icon: "Layout",
              title: "Multi-tienda y equipo",
              description:
                "Soporte multi-tienda con opción de cambiar de tienda en un mismo panel. Gestión de equipo y usuarios. Integración de contacto por WhatsApp para soporte y comunicación.",
            },
          ]}
          columns={3}
        />
      </CaseArticle>

      <CaseNextProject excludeSlug="store-saas" />

      <CaseContactCTA />
    </div>
  );
}
