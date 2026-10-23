"use client";

import { Plus } from "lucide-react";
import { type CSSProperties, type ReactNode, useId, useState } from "react";

/**
 * Preguntas frecuentes: el acordeón de las páginas de servicio (2026-10-22), sacado a su archivo
 * el 2026-10-23 para usarlo también debajo del blog en el inicio (Alexander: «debajo de blog
 * agrégale un FAQ»).
 *
 * Lleva su FAQPage en JSON-LD: las respuestas están en el HTML aunque estén cerradas (Google lee
 * el contenido del acordeón) y el esquema le dice qué es pregunta y qué es respuesta.
 */

const titular: CSSProperties = { fontFamily: "var(--font-family-heading)" };
const SUAVE = "cubic-bezier(.22,1,.36,1)";

export type Pregunta = { q: string; a: string };

export function Preguntas({
  titulo,
  intro,
  faqs,
  pie,
  id,
}: {
  titulo: string;
  /** una línea bajo el titular */
  intro?: string;
  faqs: Pregunta[];
  /** lo que va debajo del titular en escritorio (p. ej. un enlace a contacto) */
  pie?: ReactNode;
  id?: string;
}) {
  const [abierta, setAbierta] = useState<number | null>(0);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const esquema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <section id={id} className="bg-white">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: los datos estructurados van así
        dangerouslySetInnerHTML={{ __html: JSON.stringify(esquema) }}
      />
      <div className="container-section">
        <div className="content-section grid gap-10 py-20 md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <div className="aparecer">
            <h2
              className="text-[36px] leading-[1.05] tracking-[-0.03em] text-[#060C20] md:text-[48px]"
              style={titular}
            >
              {titulo}
            </h2>
            {intro && (
              <p className="mt-5 max-w-[40ch] text-[16px] leading-[1.6] text-[#060C20]/65">
                {intro}
              </p>
            )}
            {pie && <div className="mt-7">{pie}</div>}
          </div>
          <ul className="border-t border-[#060C20]/10">
            {faqs.map((f, i) => {
              const si = abierta === i;
              return (
                <li
                  key={f.q}
                  className="aparecer border-b border-[#060C20]/10"
                  style={
                    { "--aparecer-retraso": `${i * 0.05}s` } as CSSProperties
                  }
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={si}
                      aria-controls={`${uid}-${i}`}
                      onClick={() => setAbierta(si ? null : i)}
                      className="group flex min-h-11 w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-medium text-[#060C20] md:text-[18px]"
                    >
                      {f.q}
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-full border border-[#060C20]/15 transition-[transform,background-color] duration-300 group-hover:bg-[#060C20]/[0.04] ${si ? "rotate-45" : ""}`}
                        aria-hidden="true"
                      >
                        <Plus className="size-4" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`${uid}-${i}`}
                    className={`grid transition-[grid-template-rows] duration-500 motion-reduce:transition-none ${
                      si ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                    style={{ transitionTimingFunction: SUAVE }}
                  >
                    <div className="overflow-hidden" inert={!si}>
                      <p
                        className={`max-w-[68ch] pb-6 text-[16px] leading-[1.65] text-gray-600 transition-opacity duration-500 ${si ? "opacity-100" : "opacity-0"}`}
                      >
                        {f.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
