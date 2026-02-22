"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "~/hooks/useTranslation";
import { getTechLogo } from "~/lib/tech-logos";

const smoothEase = [0.4, 0, 0.2, 1] as const;

interface CaseHeroSplitProps {
  title: string;
  description: string;
  image: string;
  industry?: string;
  location?: string;
  badges?: string[];
  gradient?: string;
  /** Colores (CSS) de los orbes blur decorativos [izq, der]. Ej: ["rgba(114,47,55,0.12)", "rgba(139,58,58,0.2)"]. */
  blurOrbs?: [string, string];
  services?: string[];
  technologies?: string[];
  /** URL del sitio en vivo; si se define, muestra el botón "Ver en vivo" */
  liveUrl?: string;
}

export function CaseHeroSplit({
  title,
  description,
  image,
  industry: _industry,
  location: _location,
  badges: _badges,
  gradient = "linear-gradient(180deg, #060C20 0%, #0072CF 100%)",
  blurOrbs,
  services,
  technologies,
  liveUrl,
}: CaseHeroSplitProps) {
  const { t } = useTranslation("landing");

  return (
    <header
      className="relative w-full overflow-hidden pb-12 pt-24 sm:pb-16 sm:pt-28 lg:pb-12 lg:pt-36"
      style={{ background: gradient }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-32 left-1/4 h-96 w-96 rounded-full blur-[140px]"
          style={{ backgroundColor: blurOrbs?.[0] ?? "rgb(126 207 195 / 0.1)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full blur-[120px]"
          style={{ backgroundColor: blurOrbs?.[1] ?? "rgb(0 114 207 / 0.2)" }}
        />
      </div>

      <div className="relative z-10 container-section">
        <div className="content-section">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: smoothEase }}
          >
            <Link
              href="/#casos"
              className="text-body-sm mb-8 inline-flex items-center gap-2 font-medium text-white/60 transition-colors duration-300 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("caseDetail.backLink")}
            </Link>
          </motion.div>

          <div className="flex flex-col gap-10 xl:flex-row xl:items-center xl:gap-12">
            <div className="xl:flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25, ease: smoothEase }}
                className="text-display mb-4 max-w-[600px] text-white"
              >
                {title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: smoothEase }}
                className="text-body-lg max-w-[520px] text-white/70"
              >
                {description}
              </motion.p>
              {liveUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45, ease: smoothEase }}
                  className="mt-6"
                >
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/20 hover:border-white/50"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t("caseDetail.viewLive")}
                  </a>
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: smoothEase }}
              className="relative w-full xl:w-[50%] xl:flex-shrink-0"
            >
              <Image
                src={image}
                alt={`${title} showcase`}
                width={700}
                height={480}
                priority
                className="relative w-full max-h-[280px] rounded-xl object-cover ring-1 ring-white/10 sm:max-h-[360px] lg:max-h-[440px] lg:rounded-2xl"
              />
            </motion.div>
          </div>

          {(services?.length || technologies?.length) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: smoothEase }}
              className="mt-10 border-t border-white/20 pt-6"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {services && services.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
                      {t("caseDetail.services")}
                    </span>
                    <div className="flex flex-wrap gap-2">
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
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
                      {t("caseDetail.techStack")}
                    </span>
                    <div className="flex flex-wrap gap-2">
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
