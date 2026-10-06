"use client";

import type { LucideIcon } from "lucide-react";
import { Code2, Lightbulb, Palette, Rocket, Search } from "lucide-react";
import { motion } from "motion/react";

const smoothEase = [0.4, 0, 0.2, 1] as const;

const iconMap: Record<string, LucideIcon> = {
  Search,
  Lightbulb,
  Palette,
  Code2,
  Rocket,
};

export interface TimelineStep {
  icon: string | LucideIcon;
  title: string;
  description: string;
}

interface CaseProcessTimelineProps {
  title?: string;
  subtitle?: string;
  steps: TimelineStep[];
}

function resolveIcon(icon: string | LucideIcon): LucideIcon {
  if (typeof icon === "string") {
    return iconMap[icon] ?? Lightbulb;
  }
  return icon;
}

export function CaseProcessTimeline({
  title = "Proceso de Desarrollo",
  subtitle = "Cómo lo hicimos",
  steps,
}: CaseProcessTimelineProps) {
  return (
    <section className="bg-white py-14 sm:py-18 lg:py-24">
      <div className="container-section">
        <div className="content-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: smoothEase }}
            className="mb-12 text-center"
          >
            <p className="text-overline mb-3 text-[#0072CF]">{subtitle}</p>
            <h2 className="text-heading-1 text-[#060C20]">{title}</h2>
          </motion.div>

          {/* Desktop: horizontal */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute left-0 right-0 top-8 h-px bg-gradient-to-r from-transparent via-[#0072CF]/30 to-transparent" />
              <div className="grid grid-cols-4 gap-6">
                {steps.slice(0, 4).map((step, i) => {
                  const Icon = resolveIcon(step.icon);
                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.15,
                        ease: smoothEase,
                      }}
                      className="relative flex flex-col items-center text-center"
                    >
                      <div className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#0072CF]/20 bg-white shadow-sm transition-all duration-300 hover:border-[#0072CF]/50 hover:shadow-md">
                        <Icon className="h-6 w-6 text-[#0072CF]" />
                      </div>
                      <span className="text-overline mb-2 text-[#0072CF]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-heading-3 mb-2 text-[#060C20]">
                        {step.title}
                      </h3>
                      <p className="text-body-sm text-[#4a5568]">
                        {step.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile: vertical */}
          <div className="lg:hidden">
            <div className="relative pl-8">
              <div className="absolute bottom-0 left-3 top-0 w-px bg-gradient-to-b from-[#0072CF]/30 via-[#0072CF]/20 to-transparent" />
              <div className="flex flex-col gap-10">
                {steps.map((step, i) => {
                  const Icon = resolveIcon(step.icon);
                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.1,
                        ease: smoothEase,
                      }}
                      className="relative"
                    >
                      <div className="absolute -left-8 top-0 flex h-7 w-7 items-center justify-center rounded-full border border-[#0072CF]/30 bg-white">
                        <div className="h-2 w-2 rounded-full bg-[#0072CF]" />
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#0072CF]/8">
                          <Icon className="h-4 w-4 text-[#0072CF]" />
                        </div>
                        <div>
                          <h3 className="text-heading-3 mb-1 text-[#060C20]">
                            {step.title}
                          </h3>
                          <p className="text-body-sm text-[#4a5568]">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
