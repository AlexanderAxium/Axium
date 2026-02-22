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

export default function ClefastContent() {
  const data = useCaseContent("clefast");
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
            Clefast es una empresa peruana especializada en detergentes
            ecológicos para lavanderías industriales. Nos contactaron para
            desarrollar una tienda virtual completa que permitiera vender
            online, gestionar promociones y generar confianza con clientes B2B.
          </p>

          <p className="text-body mb-8 leading-relaxed text-[#334155]">
            Desarrollamos clefast.com.pe como plataforma e-commerce: tienda
            online con carrito y checkout, catálogo organizado por categorías
            (Línea Clásica, Especializada y Premium), sistema de promociones y
            bonificaciones, blog con guías y noticias para lavanderías
            industriales, catálogo descargable, formulario de contacto
            empresarial y libro de reclamaciones digital cumpliendo normativas
            peruanas.
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
                  src: "/images/proyects/clefast/clefast-home-section.jpg",
                  alt: "Clefast — página principal con productos y blog",
                  caption: "Página principal",
                },
                {
                  src: "/images/proyects/clefast/clefast-productos1.jpg",
                  alt: "Clefast — catálogo de productos para lavanderías industriales",
                  caption: "Productos",
                },
              ]}
              columns={2}
            />
          </div>
        </CaseArticleWide>

        <CaseFeatureShowcase
          background="light"
          subtitle={t("caseDetail.storeVirtual")}
          title={t("caseDetail.funcionalidadesClave")}
          features={[
            {
              icon: "ShoppingBag",
              title: "Tienda Online",
              description:
                "Catálogo de productos con carrito de compras y proceso de checkout completo para venta B2B.",
            },
            {
              icon: "Layers",
              title: "Catálogo por Categorías",
              description:
                "Productos organizados en Línea Clásica, Especializada y Premium para facilitar la navegación.",
            },
            {
              icon: "Ticket",
              title: "Promociones y Bonificaciones",
              description:
                "Sistema de promociones para lavanderías industriales con bonificaciones por volumen.",
            },
            {
              icon: "BookOpen",
              title: "Blog Corporativo",
              description:
                "Guías y noticias para lavanderías industriales: contenido de valor y SEO.",
            },
            {
              icon: "FileText",
              title: "Catálogo Descargable",
              description:
                "Catálogo en PDF disponible para descarga directa desde el sitio.",
            },
            {
              icon: "FileText",
              title: "Libro de Reclamaciones",
              description:
                "Libro de reclamaciones digital integrado cumpliendo normativas peruanas.",
            },
          ]}
          columns={3}
        />

        <CaseArticleText>
          <p className="text-body-lg leading-relaxed text-[#334155]">
            Hoy clefast.com.pe opera como tienda virtual completa para
            lavanderías industriales: venta online con carrito y checkout,
            catálogo por líneas, promociones, blog de guías y noticias, y canal
            de contacto empresarial.
          </p>
        </CaseArticleText>
      </CaseArticle>

      <CaseNextProject excludeSlug="clefast" />

      <CaseContactCTA />
    </div>
  );
}
