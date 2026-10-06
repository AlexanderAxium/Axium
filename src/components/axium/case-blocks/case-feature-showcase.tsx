"use client";

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  CreditCard,
  FileText,
  Globe,
  Layers,
  Layout,
  Lock,
  Monitor,
  ShoppingBag,
  Smartphone,
  Ticket,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const smoothEase = [0.4, 0, 0.2, 1] as const;

const iconMap: Record<string, LucideIcon> = {
  BarChart3,
  BookOpen,
  CreditCard,
  FileText,
  Globe,
  Layout,
  Layers,
  Lock,
  Monitor,
  ShoppingBag,
  Smartphone,
  Ticket,
  Zap,
};

export interface FeatureItem {
  icon: string | LucideIcon;
  title: string;
  description: string;
}

interface CaseFeatureShowcaseProps {
  title?: string;
  subtitle?: string;
  features: FeatureItem[];
  columns?: 2 | 3;
  /** "dark" = fondo oscuro (default), "light" = fondo blanco para secciones editoriales */
  background?: "dark" | "light";
}

function resolveIcon(icon: string | LucideIcon): LucideIcon {
  if (typeof icon === "string") {
    return iconMap[icon] ?? Zap;
  }
  return icon;
}

export function CaseFeatureShowcase({
  title = "Funcionalidades Clave",
  subtitle = "Lo que construimos",
  features,
  columns = 3,
  background = "dark",
}: CaseFeatureShowcaseProps) {
  const isLight = background === "light";

  return (
    <section
      className={`relative w-full overflow-hidden py-10 sm:py-12 lg:py-16 ${
        isLight ? "bg-white" : "bg-[#060C20]"
      }`}
    >
      {!isLight && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-[#0072CF]/15 blur-[100px]" />
          <div className="absolute bottom-0 right-1/3 h-56 w-56 rounded-full bg-[#7ECFC3]/10 blur-[90px]" />
        </div>
      )}

      <div className="relative z-10 container-section">
        <div className="content-section">
          <div className="mb-8 text-center">
            <p
              className={`text-overline mb-2 ${isLight ? "text-[#0072CF]" : "text-[#7ECFC3]"}`}
            >
              {subtitle}
            </p>
            <h2
              className={`text-heading-1 ${isLight ? "text-[#0f172a]" : "text-white"}`}
            >
              {title}
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: smoothEase }}
            className={`grid gap-4 sm:grid-cols-2 ${
              columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
            }`}
          >
            {features.map((feature) => {
              const Icon = resolveIcon(feature.icon);
              return (
                <div
                  key={feature.title}
                  className={`group rounded-xl p-4 transition-all duration-300 ${
                    isLight
                      ? "border border-[#e2e8f0] bg-[#f8fafb] hover:border-[#0072CF]/40 hover:bg-[#f1f5f9]"
                      : "border border-white/10 bg-white/[0.03] backdrop-blur-sm hover:border-[#0072CF]/40 hover:bg-white/[0.06]"
                  }`}
                >
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300 ${
                      isLight
                        ? "bg-[#0072CF]/10 group-hover:bg-[#0072CF]/20"
                        : "bg-[#0072CF]/15 group-hover:bg-[#0072CF]/25"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${isLight ? "text-[#0072CF]" : "text-[#7ECFC3]"}`}
                    />
                  </div>
                  <h3
                    className={`text-heading-3 mb-1.5 ${
                      isLight ? "text-[#0f172a]" : "text-white"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`text-body-sm leading-relaxed ${
                      isLight ? "text-[#64748b]" : "text-white/60"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
