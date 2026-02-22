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

export default function HappyArtContent() {
  const data = useCaseContent("happyart");
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
        gradient="linear-gradient(180deg, #59422E 0%, #A68051 100%)"
      />

      <CaseArticle>
        <CaseArticleText>
          <p className="text-overline mb-4 text-[#0072CF]">
            {t("caseDetail.aboutProject")}
          </p>

          <p className="text-body-lg mb-6 leading-relaxed text-[#334155]">
            Happy Art es una empresa arequipeña de regalos personalizados desde
            2022. Les desarrollamos toda su identidad de marca: logo, manual de
            marca, papelería; y la tienda virtual para vender online, mostrar su
            catálogo por ocasiones y ofrecer asesoría a clientes.
          </p>

          <p className="text-body mb-8 leading-relaxed text-[#334155]">
            Creamos el logo, manual de marca y elementos de identidad, además de
            happyart.com.pe con tienda online, categorías (Día del Padre, Madre,
            Niño, Maestro, Trabajador, para ellas/ellos, aniversarios,
            corporativos), carrito y checkout, mi cuenta, delivery,
            personalización, blog de consejos y asesoría por WhatsApp.
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
                  src: "/images/proyects/happyart/happyart-desktop.jpg",
                  alt: "Happy Art — vista desktop de la tienda",
                },
                {
                  src: "/images/proyects/happyart/happyart-chica-producto.jpg",
                  alt: "Happy Art — persona sosteniendo producto personalizado",
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
                "Catálogo de regalos personalizados con carrito y checkout para venta B2C.",
            },
            {
              icon: "Layers",
              title: "Catálogo por Ocasiones",
              description:
                "Categorías: Día del Padre, Madre, Niño, Maestro, Trabajador, para ellas/ellos, aniversarios y corporativos.",
            },
            {
              icon: "Zap",
              title: "Delivery y Personalización",
              description:
                "Servicio de envío y personalización de regalos para cada ocasión.",
            },
            {
              icon: "BookOpen",
              title: "Blog y Consejos",
              description:
                "Consejos, noticias y tendencias en regalos personalizados.",
            },
            {
              icon: "Globe",
              title: "Asesoría por WhatsApp",
              description:
                "Canal de contacto para asesoría personalizada en la elección de regalos.",
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
            Hoy happyart.com.pe opera como tienda virtual de regalos
            personalizados: catálogo por ocasiones, carrito y checkout,
            delivery, personalización, blog de consejos y asesoría por WhatsApp.
          </p>
        </CaseArticleText>
      </CaseArticle>

      <CaseNextProject excludeSlug="happyart" />

      <CaseContactCTA />
    </div>
  );
}
