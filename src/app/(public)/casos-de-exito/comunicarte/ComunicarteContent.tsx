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

export default function ComunicarteContent() {
  const data = useCaseContent("comunicarte");
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
        liveUrl={data.liveUrl}
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
          <div className="mb-12 lg:mb-16">
            <CaseImages
              images={[
                {
                  src: data.image,
                  alt: `${data.title} — ecosistema editorial y tienda`,
                },
              ]}
              columns={1}
            />
          </div>
        </CaseArticleWide>

        <CaseFeatureShowcase
          background="light"
          subtitle="Comunicarte Editores"
          title={t("caseDetail.funcionalidadesClave")}
          features={[
            {
              icon: "BookOpen",
              title: "Publicación Física",
              description:
                "Landing del modelo para autores que buscan presencia en librerías nacionales: asesoría, corrección 360°, diseño de portada, ISBN, Depósito Legal, INDECOPI, distribución y presencia en FIL Lima.",
            },
            {
              icon: "Globe",
              title: "Autor Internacional",
              description:
                "Impresión bajo demanda y eBook: publicación en Amazon, librerías en 10 países, perfil de autor, contenido A+, distribución global y tirajes especiales sin stock.",
            },
            {
              icon: "FileText",
              title: "Servicios Editoriales",
              description:
                "Soluciones por etapa: autor/creador, corrección, diseño de portadas, maquetación, registro legal, lanzamientos, ferias y venta online con planes Máster, Integral y Estándar.",
            },
            {
              icon: "Layers",
              title: "Servicios de Imprenta",
              description:
                "Libros, revistas, papelería corporativa, publicidad en papel, packaging, acabados especiales y envíos a nivel nacional para proyectos editoriales y de empresa.",
            },
            {
              icon: "ShoppingBag",
              title: "Tienda online",
              description:
                "E-commerce con catálogo por categorías (narrativa, poesía, infantil, crecimiento personal), carrito, múltiples medios de pago y envíos a todo Perú.",
            },
            {
              icon: "Globe",
              title: "Distribución y obras sociales",
              description:
                "Sección de distribución global y programas de inclusión (Las Aventuras de Amadeo, FESTILEC, alfabetización); cada publicación financia fomento lector.",
            },
          ]}
          columns={3}
        />
      </CaseArticle>

      <CaseNextProject excludeSlug="comunicarte" />

      <CaseContactCTA />
    </div>
  );
}
