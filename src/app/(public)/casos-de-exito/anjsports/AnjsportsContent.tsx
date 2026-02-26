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

export default function AnjsportsContent() {
  const data = useCaseContent("anjsports");
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
                  src: data.image,
                  alt: `${data.title} — tienda de tenis de mesa`,
                },
                {
                  src: "/images/proyects/anjsports/anjsports-desc.jpg",
                  alt: `${data.title} — catálogo y productos`,
                },
              ]}
              columns={2}
            />
          </div>
        </CaseArticleWide>

        <CaseFeatureShowcase
          background="light"
          subtitle="ANJ Sports"
          title={t("caseDetail.funcionalidadesClave")}
          features={[
            {
              icon: "ShoppingBag",
              title: "Tienda online",
              description:
                "E-commerce con catálogo de raquetas, gomas y accesorios de tenis de mesa, carrito y checkout para venta en Perú.",
            },
            {
              icon: "Zap",
              title: "Productos destacados y últimos",
              description:
                "Secciones en portada para productos destacados y últimos productos que impulsan la exploración y las ventas.",
            },
            {
              icon: "Layout",
              title: "Marcas líderes",
              description:
                "Presencia de marcas como Butterfly, VICTAS, XIOM, SANWEI y Dr. Neubauer para jugadores y aficionados.",
            },
            {
              icon: "Lock",
              title: "Registro y ofertas",
              description:
                "Registro de usuarios para acceder a ofertas y ahorros, con área Mi cuenta, historial de pedidos y ofertas.",
            },
            {
              icon: "FileText",
              title: "Servicio al cliente",
              description:
                "Preguntas frecuentes, formas de pago, política de cambios y devoluciones, y libro de reclamaciones integrado.",
            },
            {
              icon: "Smartphone",
              title: "Testimonios y noticias",
              description:
                "Sección de testimonios y noticias sobre tenis de mesa para generar confianza y contenido de valor.",
            },
          ]}
          columns={3}
        />
      </CaseArticle>

      <CaseNextProject excludeSlug="anjsports" />

      <CaseContactCTA />
    </div>
  );
}
