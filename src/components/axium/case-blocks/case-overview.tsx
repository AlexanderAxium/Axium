"use client";

import { Calendar, Clock as ClockIcon, Globe, Monitor } from "lucide-react";
import { motion } from "motion/react";

const smoothEase = [0.4, 0, 0.2, 1] as const;

interface QuickFact {
  label: string;
  value: string;
}

interface MetadataChip {
  label: string;
  value: string;
}

interface CaseOverviewProps {
  description: string;
  publishedDate?: string;
  quickFacts?: QuickFact[];
  platform?: string;
  duration?: string;
  client?: string;
}

export function CaseOverview({
  description,
  publishedDate,
  quickFacts,
  platform,
  duration,
  client,
}: CaseOverviewProps) {
  const chips: MetadataChip[] = [
    platform ? { label: "Plataforma", value: platform } : null,
    duration ? { label: "Duración", value: duration } : null,
    client ? { label: "Cliente", value: client } : null,
  ].filter(Boolean) as MetadataChip[];

  const chipIcons = [Monitor, ClockIcon, Globe];

  return (
    <section className="bg-[#f8fafb] py-14 sm:py-18 lg:py-24">
      <div className="container-section">
        <div className="content-section">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className={quickFacts ? "lg:w-[60%]" : "w-full"}
            >
              <p className="text-overline mb-4 text-[#0072CF]">
                Sobre el proyecto
              </p>
              <p className="text-body-lg leading-relaxed text-[#4a5568]">
                {description}
              </p>

              {chips.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {chips.map((chip, i) => {
                    const Icon = chipIcons[i];
                    return (
                      <div
                        key={chip.label}
                        className="inline-flex items-center gap-2 rounded-full border border-[#E5EAF3] bg-white px-3.5 py-1.5"
                      >
                        {Icon && (
                          <Icon className="h-3.5 w-3.5 text-[#0072CF]" />
                        )}
                        <span className="text-pill text-[#8a919e]">
                          {chip.label}:
                        </span>
                        <span className="text-pill font-semibold text-[#060C20]">
                          {chip.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {publishedDate && (
                <div className="mt-5 inline-flex items-center gap-2 text-sm text-[#8a919e]">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{publishedDate}</span>
                </div>
              )}
            </motion.div>

            {quickFacts && quickFacts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.15, ease: smoothEase }}
                className="lg:w-[40%]"
              >
                <div className="rounded-2xl border border-[#E5EAF3] bg-white p-6">
                  <p className="text-overline mb-5 text-[#8a919e]">
                    Datos clave
                  </p>
                  <div className="flex flex-col gap-4">
                    {quickFacts.map((fact) => (
                      <div
                        key={fact.label}
                        className="flex items-center justify-between border-b border-[#E5EAF3] pb-3 last:border-0 last:pb-0"
                      >
                        <span className="text-body-sm text-[#8a919e]">
                          {fact.label}
                        </span>
                        <span className="text-body font-semibold text-[#060C20]">
                          {fact.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
