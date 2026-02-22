"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "~/hooks/useTranslation";
import { getTechLogo } from "~/lib/tech-logos";

const smoothEase = [0.4, 0, 0.2, 1] as const;

interface CaseHeroFullImageProps {
  title: string;
  description: string;
  image: string;
  industry?: string;
  location?: string;
  badges?: string[];
  overlayOpacity?: number;
  services?: string[];
  technologies?: string[];
  /** Si true, el hero ocupa 100vh (imagen completa). Default: 70vh */
  fullHeight?: boolean;
  /** URL del sitio en vivo; si se define, muestra el botón "Ver en vivo" */
  liveUrl?: string;
}

export function CaseHeroFullImage({
  title,
  description,
  image,
  industry: _industry,
  location: _location,
  badges: _badges,
  overlayOpacity = 0.65,
  services,
  technologies,
  fullHeight = false,
  liveUrl,
}: CaseHeroFullImageProps) {
  const { t } = useTranslation("landing");

  return (
    <header
      className={`relative w-full overflow-hidden ${fullHeight ? "min-h-[100vh]" : "min-h-[70vh]"}`}
    >
      <Image
        src={image}
        alt={`${title} hero`}
        fill
        priority
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#060C20] via-[#060C20]/80 to-[#060C20]/40"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#060C20]/60 to-transparent" />

      <div
        className={`relative z-10 flex flex-col justify-end pb-14 pt-24 sm:pb-18 sm:pt-28 lg:pb-24 lg:pt-36 ${fullHeight ? "min-h-[100vh]" : "min-h-[70vh]"}`}
      >
        <div className="container-section w-full">
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

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: smoothEase }}
              className="text-display mb-4 max-w-[700px] text-white"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: smoothEase }}
              className="text-body-lg max-w-[560px] text-white/80"
            >
              {description}
            </motion.p>

            {liveUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45, ease: smoothEase }}
                className="mt-6"
              >
                <Link
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-body font-medium text-white transition-colors duration-300 hover:bg-white/20"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t("caseDetail.viewLive")}
                </Link>
              </motion.div>
            )}

            {(services?.length || technologies?.length) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55, ease: smoothEase }}
                className="mt-8 border-t border-white/20 pt-5"
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
      </div>
    </header>
  );
}
