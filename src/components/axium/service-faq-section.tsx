"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useState } from "react";
import { ServiceCtaCard } from "~/components/axium/service-cta-card";

export interface FaqItem {
  q: string;
  a: string;
}

interface ServiceFaqSectionProps {
  faqs: FaqItem[];
  accentColor?: string;
  sectionLabel?: ReactNode;
  ctaTitle?: string;
  ctaSubtitle?: string;
  whatsappMessage: string;
  bg?: string;
}

const smoothEase = [0.4, 0, 0.2, 1] as const;

export function ServiceFaqSection({
  faqs,
  accentColor = "#0072CF",
  sectionLabel = "Preguntas frecuentes",
  ctaTitle = "¿Listo para empezar?",
  ctaSubtitle = "Conversemos sobre tu proyecto. Sin compromiso, sin presión.",
  whatsappMessage,
  bg = "bg-white",
}: ServiceFaqSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className={`py-20 md:py-28 ${bg}`}>
      <div className="container-section">
        <div className="content-section">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
            {/* Left: headline + CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="flex flex-col gap-8"
            >
              <div>
                <p
                  className="text-xs font-medium uppercase tracking-widest mb-4"
                  style={{ color: accentColor }}
                >
                  {sectionLabel}
                </p>
                <h2 className="text-3xl sm:text-4xl leading-tight text-gray-900">
                  Todo lo que necesitas saber
                </h2>
              </div>

              {/* CTA card — hidden on mobile */}
              <div className="hidden lg:block">
                <ServiceCtaCard
                  title={ctaTitle}
                  subtitle={ctaSubtitle}
                  whatsappMessage={whatsappMessage}
                />
              </div>
            </motion.div>

            {/* Right: accordion */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
            >
              <div className="divide-y divide-gray-200 border-y border-gray-200">
                {faqs.map(({ q, a }, i) => (
                  <div key={q} className="py-5">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq((prev) => (prev === i ? null : i))
                      }
                      className="flex w-full items-start justify-between gap-4 text-left"
                    >
                      <span className="text-gray-900 font-medium">{q}</span>
                      <ChevronDown
                        className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                          openFaq === i ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: smoothEase }}
                          className="overflow-hidden"
                        >
                          <p className="pt-3 text-sm text-gray-500 leading-relaxed">
                            {a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA card — mobile only */}
            <div className="lg:hidden">
              <ServiceCtaCard
                title={ctaTitle}
                subtitle={ctaSubtitle}
                whatsappMessage={whatsappMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
