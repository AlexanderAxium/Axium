"use client";

import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "~/hooks/useTranslation";
import { getTechLogo } from "~/lib/tech-logos";

const smoothEase = [0.4, 0, 0.2, 1] as const;

interface CaseHeroMinimalProps {
  title: string;
  description: string;
  industry?: string;
  location?: string;
  badges?: string[];
  gradient?: string;
  services?: string[];
  technologies?: string[];
}

export function CaseHeroMinimal({
  title,
  description,
  industry: _industry,
  location: _location,
  badges: _badges,
  gradient = "linear-gradient(135deg, #060C20 0%, #0a1628 50%, #0072CF 100%)",
  services,
  technologies,
}: CaseHeroMinimalProps) {
  const { t } = useTranslation("landing");

  return (
    <header
      className="relative w-full overflow-hidden pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-28 lg:pt-36"
      style={{ background: gradient }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[#7ECFC3]/8 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-[#0072CF]/15 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02] blur-[80px]" />
      </div>

      <div className="relative z-10 container-section">
        <div className="content-section max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: smoothEase }}
          >
            <Link
              href="/#casos"
              className="text-body-sm mb-10 inline-flex items-center gap-2 font-medium text-white/60 transition-colors duration-300 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("caseDetail.backLink")}
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: smoothEase }}
            className="text-display mb-5 text-white"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: smoothEase }}
            className="text-body-lg mx-auto max-w-[600px] text-white/70"
          >
            {description}
          </motion.p>

          {(services?.length || technologies?.length) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: smoothEase }}
              className="mx-auto mt-10 max-w-2xl border-t border-white/20 pt-5"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {services && services.length > 0 && (
                  <div className="flex flex-col items-center gap-2.5 text-center sm:items-start sm:text-left">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
                      Servicios
                    </span>
                    <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                      {services.map((s) => (
                        <span
                          key={s}
                          className="text-[12px] rounded-full border border-white/25 bg-white/12 px-3 py-1 text-white/85"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {technologies && technologies.length > 0 && (
                  <div className="flex flex-col items-center gap-2.5 text-center sm:items-start sm:text-left">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
                      Stack tecnológico
                    </span>
                    <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                      {technologies.map((tech) => {
                        const logo = getTechLogo(tech);
                        return (
                          <span
                            key={tech}
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/12 px-2.5 py-0.5 text-[12px] text-white/85"
                          >
                            {logo && (
                              <Image
                                src={logo}
                                alt=""
                                width={14}
                                height={14}
                                className="h-3.5 w-3.5 shrink-0"
                              />
                            )}
                            {tech}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
