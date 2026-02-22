"use client";

import { Clock, Globe, Monitor } from "lucide-react";
import {
  CaseArticle,
  CaseArticleText,
  CaseArticleWide,
  CaseHeroFullImage,
  CaseImages,
  CaseNextProject,
  CaseScopeList,
} from "~/components/axium/case-blocks";
import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import { useTranslation } from "~/hooks/useTranslation";
import { useCaseContent } from "~/lib/case-translations";

export default function RedesVipContent() {
  const data = useCaseContent("redesvip");
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
            Redes VIP es un proveedor de internet 100% fibra óptica en
            Ventanilla-Callao. Nos contactaron para crear una web informativa
            que transmitiera confianza, mostrara sus planes y facilitara el
            contacto con clientes residenciales y corporativos.
          </p>

          <p className="text-body mb-8 leading-relaxed text-[#334155]">
            Desarrollamos redesvip.com con diseño moderno y estética
            tecnológica: hero con propuesta de valor (velocidad simétrica,
            precio justo, soporte especializado), planes de internet (Hogar,
            Duos VIP, Gamer), servicios VIP TV con +80 canales Full HD,
            soluciones corporativas, testimonios y contacto por WhatsApp.
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
                  src: "/images/proyects/redesvip/redesvip-flyer.jpg",
                  alt: "Redes VIP — flyer publicitario",
                  aspect: "square",
                },
                {
                  src: "/images/proyects/redesvip/redesvip-mobile.jpg",
                  alt: "Redes VIP — vista móvil del sitio",
                  aspect: "square",
                },
              ]}
              columns={2}
            />
          </div>
        </CaseArticleWide>

        <CaseScopeList
          items={[
            "Hero con propuesta de valor (velocidad simétrica, precio justo, soporte especializado)",
            "Planes de internet: Hogar 200 Mbps, Duos VIP 400 Mbps, Gamer 300 Mbps",
            "Servicios VIP TV: +80 canales Full HD",
            "Sección de soluciones corporativas para empresas",
            "Testimonios de clientes",
            "Integración de contacto por WhatsApp",
            "Diseño responsive con estética tecnológica",
          ]}
        />

        <CaseArticleWide>
          <div className="mb-12 lg:mb-16">
            <CaseImages
              images={[
                {
                  src: "/images/proyects/redesvip/redesvip-web.jpg",
                  alt: "Redes VIP — vista web del sitio",
                  aspect: "full",
                },
              ]}
              columns={2}
            />
          </div>
        </CaseArticleWide>

        <CaseArticleText>
          <p className="text-body-lg leading-relaxed text-[#334155]">
            Hoy redesvip.com opera como web informativa para Redes VIP: planes
            claros, servicios VIP TV y corporativos, testimonios y contacto
            directo por WhatsApp.
          </p>
        </CaseArticleText>
      </CaseArticle>

      <CaseNextProject excludeSlug="redesvip" />

      <CaseContactCTA />
    </div>
  );
}
