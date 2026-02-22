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

export default function SporttContent() {
  const data = useCaseContent("sportt");
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
            Sportt Peru es la tienda virtual de tenis de mesa y ping pong en
            Perú. Nos contactaron para desarrollar una plataforma e-commerce que
            permitiera vender equipamiento deportivo online, con catálogo
            organizado por categorías, integración con CMS y pasarela de pagos.
          </p>

          <p className="text-body mb-8 leading-relaxed text-[#334155]">
            Desarrollamos sporttperu.com como tienda virtual completa: catálogo
            por categorías (equipamiento, raquetas, maderas, jebes, accesorios,
            zapatillas, pelotitas, estuches), integración con CMS, pasarela de
            pagos, carrito y checkout, libro de reclamaciones digital y canal de
            contacto.
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
                  src: "/images/proyects/sportt/sportt-vista-home.jpg",
                  alt: "Sportt Peru — vista principal de la tienda",
                },
                {
                  src: "/images/proyects/sportt/sportt-vista-tienda.jpg",
                  alt: "Sportt Peru — catálogo de productos de tenis de mesa",
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
                "Catálogo de productos con carrito de compras y proceso de checkout para venta B2C.",
            },
            {
              icon: "Layers",
              title: "Catálogo por Categorías",
              description:
                "Productos organizados: equipamiento, raquetas, maderas, jebes, accesorios, zapatillas, pelotitas y estuches.",
            },
            {
              icon: "Layout",
              title: "Integración CMS",
              description:
                "Gestión de contenido integrada con CMS para actualizar catálogo y productos de forma ágil.",
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
              title: "Contacto",
              description:
                "Canal de contacto para consultas sobre productos y pedidos.",
            },
          ]}
          columns={3}
        />

        <CaseArticleText>
          <p className="text-body-lg mb-6 leading-relaxed text-[#334155]">
            Además de la tienda virtual, desarrollamos contenido visual para las
            redes de Sportt: diseñamos anuncios para su Instagram que destacan
            diversos productos de su catálogo, con una estética oscura y
            dinámica que conecta con jugadores de tenis de mesa.
          </p>
        </CaseArticleText>

        <CaseArticleWide>
          <div className="mb-12 lg:mb-16">
            <CaseImages
              images={[
                {
                  src: "/images/proyects/sportt/sportt-instagram-rucksack.jpg",
                  alt: "Sportt Peru — anuncio Instagram Rucksack Butterfly",
                },
                {
                  src: "/images/proyects/sportt/sportt-instagram-dignics05.jpg",
                  alt: "Sportt Peru — anuncio Instagram Dignics 05",
                },
                {
                  src: "/images/proyects/sportt/sportt-instagram-lezoline.jpg",
                  alt: "Sportt Peru — anuncio Instagram Lezoline Unizes",
                },
              ]}
              columns={3}
            />
          </div>
        </CaseArticleWide>

        <CaseArticleText>
          <p className="text-body-lg leading-relaxed text-[#334155]">
            Hoy sporttperu.com opera como tienda virtual de tenis de mesa:
            catálogo por categorías, integración CMS, pasarela de pagos, carrito
            y checkout, y canal de contacto para jugadores y aficionados en
            Perú.
          </p>
        </CaseArticleText>
      </CaseArticle>

      <CaseNextProject excludeSlug="sportt" />

      <CaseContactCTA />
    </div>
  );
}
