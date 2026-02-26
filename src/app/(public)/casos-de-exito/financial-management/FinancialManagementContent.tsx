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

export default function FinancialManagementContent() {
  const data = useCaseContent("financial-management");
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
                  alt: `${data.title} — gestión de documentos y cuentas por pagar`,
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
              icon: "FileText",
              title: "Gestión de documentos",
              description:
                "Centralización de comprobantes (recibos, series, números), fechas de emisión y vencimiento, proveedor, RUC, subtotal, IGV, total, detracción y pendiente. Estados aprobado/pendiente y filtros por monto y período.",
            },
            {
              icon: "Lock",
              title: "Validación SUNAT y cumplimiento tributario",
              description:
                "Sincronización con registros electrónicos SUNAT y módulo de validación. Gestión de detracciones y cumplimiento regulatorio para mantener estándares contables y fiscales en Perú.",
            },
            {
              icon: "CreditCard",
              title: "Cuentas bancarias y conciliación",
              description:
                "Administración de cuentas bancarias (total, activas, inactivas), número, tipo, alias, cuenta contable y moneda (PEN/USD). Conciliación automática e importación de movimientos desde extractos (Excel/CSV).",
            },
            {
              icon: "Layers",
              title: "Proveedores y base de datos",
              description:
                "Base de datos de proveedores vinculada a documentos y transacciones. Búsqueda por RUC, serie y proveedor para agilizar la gestión de cuentas por pagar.",
            },
            {
              icon: "BookOpen",
              title: "Contabilidad y plan de cuentas",
              description:
                "Seguimiento detallado del plan de cuentas. Plantillas de asientos contables e integración con contabilidad. Vinculación de cuentas bancarias a cuentas contables para trazabilidad completa.",
            },
            {
              icon: "BarChart3",
              title: "Reportes, auditoría y analíticas",
              description:
                "Reportes financieros, integración CONCAR, audit logs y analytics para decisiones informadas y gestión del cumplimiento tributario. Exportación y análisis de transacciones.",
            },
          ]}
          columns={3}
        />
      </CaseArticle>

      <CaseNextProject excludeSlug="financial-management" />

      <CaseContactCTA />
    </div>
  );
}
