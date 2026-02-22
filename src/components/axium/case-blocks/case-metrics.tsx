"use client";

import {
  CheckCircle2,
  Clock,
  type LucideIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const smoothEase = [0.4, 0, 0.2, 1] as const;

const iconMap: Record<string, LucideIcon> = {
  Users,
  Clock,
  TrendingUp,
  CheckCircle2,
};

export interface MetricItem {
  icon: string | LucideIcon;
  metric: string;
  label: string;
}

interface CaseMetricsProps {
  title?: string;
  subtitle?: string;
  results: MetricItem[];
  variant?: "grid" | "banner";
  accentGradient?: string;
}

function resolveIcon(icon: string | LucideIcon): LucideIcon {
  if (typeof icon === "string") {
    return iconMap[icon] ?? Clock;
  }
  return icon;
}

export function CaseMetrics({
  title = "Impacto Medible",
  subtitle = "Los Resultados",
  results,
  variant = "grid",
  accentGradient,
}: CaseMetricsProps) {
  if (variant === "banner") {
    return (
      <section className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              accentGradient ||
              "linear-gradient(135deg, #060C20 0%, #0072CF 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-40 w-40 rounded-full bg-[#7ECFC3]/15 blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-[#0072CF]/20 blur-[60px]" />
        </div>

        <div className="relative z-10 container-section py-12 lg:py-16">
          <div className="content-section">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {results.map((result, i) => {
                const Icon = resolveIcon(result.icon);
                return (
                  <motion.div
                    key={`${result.metric}-${result.label}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: i * 0.12,
                      duration: 0.4,
                      ease: smoothEase,
                    }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <Icon className="h-5 w-5 text-[#7ECFC3]" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">
                        {result.metric}
                      </p>
                      <p className="text-body-sm text-white/70">
                        {result.label}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-14 sm:py-18 lg:py-24">
      <div className="container-section">
        <div className="content-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: smoothEase }}
          >
            <div className="text-center">
              <p className="text-overline mb-3 text-[#0072CF]">{subtitle}</p>
              <h2 className="text-heading-1 mb-10 text-[#060C20]">{title}</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((result, i) => {
                const Icon = resolveIcon(result.icon);
                return (
                  <motion.div
                    key={`${result.metric}-${result.label}`}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.15,
                      ease: smoothEase,
                    }}
                    className="group relative flex flex-col items-center rounded-2xl border border-[#E5EAF3] bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0072CF]/30 hover:shadow-lg"
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#0072CF]/10 text-[#0072CF] transition-colors duration-300 group-hover:bg-[#0072CF] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-metric mb-1 text-[#060C20]">
                      {result.metric}
                    </span>
                    <span className="text-body-sm text-[#606776]">
                      {result.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
