"use client";

import {
  Briefcase,
  Calendar,
  Globe,
  Layers,
  type LucideIcon,
  Monitor,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const smoothEase = [0.4, 0, 0.2, 1] as const;

const getFlagEmoji = (location: string) => {
  const flags: Record<string, string> = {
    Perú: "\u{1F1F5}\u{1F1EA}",
    Ukraine: "\u{1F1FA}\u{1F1E6}",
    "United Kingdom": "\u{1F1EC}\u{1F1E7}",
    México: "\u{1F1F2}\u{1F1FD}",
    Colombia: "\u{1F1E8}\u{1F1F4}",
    Chile: "\u{1F1E8}\u{1F1F1}",
    Internacional: "\u{1F30E}",
    "Callao, Perú": "\u{1F1F5}\u{1F1EA}",
  };
  return flags[location] || "";
};

interface MetaField {
  icon: LucideIcon;
  label: string;
  value: string;
  extra?: string;
}

interface CaseProjectMetaProps {
  industry?: string;
  platform?: string;
  duration?: string;
  client?: string;
  location?: string;
  secondaryIndustry?: string;
  forWhom?: string;
}

export function CaseProjectMeta({
  industry,
  platform,
  duration,
  client,
  location,
  secondaryIndustry,
  forWhom,
}: CaseProjectMetaProps) {
  const primaryMeta: MetaField[] = [
    industry ? { icon: Briefcase, label: "Industria", value: industry } : null,
    platform ? { icon: Monitor, label: "Plataforma", value: platform } : null,
    duration ? { icon: Calendar, label: "Duración", value: duration } : null,
    client || location
      ? {
          icon: Globe,
          label: "Cliente",
          value: client || location || "",
          extra: location ? getFlagEmoji(location) : undefined,
        }
      : null,
  ].filter(Boolean) as MetaField[];

  const secondaryMeta: MetaField[] = [
    secondaryIndustry
      ? {
          icon: Layers,
          label: "Industria Secundaria",
          value: secondaryIndustry,
        }
      : null,
    forWhom ? { icon: Users, label: "Para quién", value: forWhom } : null,
  ].filter(Boolean) as MetaField[];

  if (primaryMeta.length === 0 && secondaryMeta.length === 0) return null;

  return (
    <section className="bg-[#f8fafb] py-14 sm:py-18 lg:py-24">
      <div className="container-section">
        <div className="content-section">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: smoothEase }}
            className="text-overline mb-8 text-[#0072CF]"
          >
            Detalles del Proyecto
          </motion.p>

          {primaryMeta.length > 0 && (
            <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {primaryMeta.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.08,
                      ease: smoothEase,
                    }}
                    className="group flex items-start gap-3 rounded-xl border border-[#E5EAF3] bg-white p-4 transition-all duration-300 hover:border-[#0072CF]/20 hover:shadow-sm"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#0072CF]/8 text-[#0072CF] transition-colors duration-300 group-hover:bg-[#0072CF]/15">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-overline mb-0.5 text-[#8a919e]">
                        {item.label}
                      </p>
                      <div className="flex items-center gap-2">
                        {item.extra && (
                          <span className="text-body-sm">{item.extra}</span>
                        )}
                        <p className="text-body font-semibold text-[#060C20]">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {secondaryMeta.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {secondaryMeta.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.5,
                      delay: 0.3 + i * 0.08,
                      ease: smoothEase,
                    }}
                    className="group flex items-start gap-3 rounded-xl border border-[#E5EAF3] bg-white p-4 transition-all duration-300 hover:border-[#0072CF]/20 hover:shadow-sm"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#0072CF]/8 text-[#0072CF] transition-colors duration-300 group-hover:bg-[#0072CF]/15">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-overline mb-0.5 text-[#8a919e]">
                        {item.label}
                      </p>
                      <p className="text-body font-semibold text-[#060C20]">
                        {item.value}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
