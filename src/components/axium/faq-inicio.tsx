"use client";

import Link from "next/link";
import { Preguntas } from "~/components/axium/preguntas";
import { useTranslation } from "~/hooks/useTranslation";

/**
 * Preguntas frecuentes del inicio, debajo del blog (2026-10-23, Alexander: «debajo de blog
 * agrégale un FAQ»). Lo que se pregunta antes de contratar (costo, plazo, código, SUNAT, soporte,
 * fuera de Lima, tecnología y cómo empezar), con respuestas que no prometen más que las páginas
 * de servicio: los plazos y el código a tu nombre salen de ahí. Lleva su FAQPage en JSON-LD.
 */
export function FaqInicio() {
  const { t } = useTranslation("landing");
  const K = "home.faq";
  const faqs = Array.from({ length: 12 }, (_, i) => i)
    .filter((i) => t(`${K}.items.${i}.q`) !== `${K}.items.${i}.q`)
    .map((i) => ({ q: t(`${K}.items.${i}.q`), a: t(`${K}.items.${i}.a`) }));
  return (
    <Preguntas
      id="preguntas"
      titulo={t(`${K}.titulo`)}
      intro={t(`${K}.intro`)}
      faqs={faqs}
      pie={
        <Link
          href="#contacto"
          className="inline-flex h-12 items-center rounded-full border border-[#060C20]/20 px-6 text-[15px] font-medium text-[#060C20] transition-colors hover:bg-[#060C20]/[0.04]"
        >
          {t(`${K}.otra`)}
        </Link>
      }
    />
  );
}
