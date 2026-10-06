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

export default function LujanContent() {
  const data = useCaseContent("lujan");
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
        gradient="linear-gradient(180deg, #1a0f14 0%, #2d1519 40%, #4a1c2c 100%)"
        blurOrbs={["rgba(114,47,55,0.12)", "rgba(139,58,58,0.2)"]}
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
                  src: "/images/proyects/lujan/lujan-vista-home.jpg",
                  alt: "Vitivinícola Luján — vista principal de la tienda",
                },
                {
                  src: "/images/proyects/lujan/lujan-vista-tienda.jpg",
                  alt: "Vitivinícola Luján — catálogo de vinos y piscos",
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
                "Catálogo de vinos, piscos, cremas y macerados con carrito y checkout para venta B2C.",
            },
            {
              icon: "Layers",
              title: "Catálogo por Categorías",
              description:
                "Productos organizados: vinos, piscos, cremas y macerados.",
            },
            {
              icon: "Layout",
              title: "Integración CMS",
              description:
                "Gestión de contenido integrada con CMS para actualizar catálogo de forma ágil.",
            },
            {
              icon: "CreditCard",
              title: "Pasarela de pagos",
              description:
                "Integración con pasarela de pagos para procesar transacciones de forma segura.",
            },
            {
              icon: "FileText",
              title: "Libro de Reclamaciones",
              description:
                "Libro de reclamaciones digital integrado cumpliendo normativas peruanas.",
            },
            {
              icon: "Globe",
              title: "Contacto y Eventos",
              description:
                "Información de eventos, recorrido de viñedo, degustaciones y canal de contacto.",
            },
          ]}
          columns={3}
        />

        <CaseArticleText>
          <p className="text-body-lg mb-6 leading-relaxed text-[#334155]">
            Además de la tienda virtual, diseñamos anuncios publicitarios para
            las redes de Vitivinícola Luján que destacan sus vinos, piscos y
            productos, con una estética que refleja la tradición vitivinícola y
            conecta con el público.
          </p>
        </CaseArticleText>

        <CaseArticleWide>
          <div className="mb-12 lg:mb-16">
            <CaseImages
              images={[
                {
                  src: "/images/proyects/lujan/lujan-anuncio-1.jpg",
                  alt: "Vitivinícola Luján — anuncio publicitario",
                },
                {
                  src: "/images/proyects/lujan/lujan-anuncio-2.jpg",
                  alt: "Vitivinícola Luján — anuncio publicitario",
                },
                {
                  src: "/images/proyects/lujan/lujan-anuncio-3.jpg",
                  alt: "Vitivinícola Luján — anuncio publicitario",
                },
              ]}
              columns={3}
            />
          </div>
        </CaseArticleWide>

        <CaseArticleText>
          <p className="text-body-lg leading-relaxed text-[#334155]">
            {data.description}
          </p>
        </CaseArticleText>
      </CaseArticle>

      <CaseNextProject excludeSlug="lujan" />

      <CaseContactCTA />
    </div>
  );
}
