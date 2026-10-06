"use client";

import {
  ArrowUpRight,
  BarChart3,
  Code2,
  Globe,
  Smartphone,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useTranslation } from "~/hooks/useTranslation";

const ORBIT_ICONS = [
  { Icon: Smartphone, label: "Mobile" },
  { Icon: Globe, label: "Web" },
  { Icon: BarChart3, label: "Analytics" },
  { Icon: Code2, label: "Software" },
];

const ORBIT_RADIUS = 83;
const ORBIT_DURATION = 28;
const smoothEase = [0.4, 0, 0.2, 1] as const;

export function AboutSection() {
  const { t } = useTranslation("landing");

  return (
    <section id="nosotros" className="py-20 md:py-28 overflow-hidden bg-white">
      <div className="container-section">
        <div className="content-section">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
            {/* ── LEFT COLUMN ── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="flex flex-col gap-8 lg:gap-0 lg:justify-between"
            >
              {/* Eyebrow — hidden on mobile */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: smoothEase }}
                className="hidden lg:flex items-center gap-3"
              >
                <div className="w-7 h-0.5 bg-secondary rounded-full" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-[0.2em]">
                  {t("home.about.eyebrow")}
                </span>
              </motion.div>

              {/* Bottom block */}
              <div className="space-y-7">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: 0.1, ease: smoothEase }}
                  className="text-heading-1 text-gray-900 leading-tight max-w-[520px]"
                >
                  {t("home.about.title")}
                </motion.h2>

                <div
                  className="w-[20%] lg:w-48 h-[5px] bg-secondary rounded-full shrink-0"
                  aria-hidden
                />

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.3, ease: smoothEase }}
                >
                  <p className="text-heading-2 leading-tight text-gray-400">
                    {t("home.about.statNumber")} {t("home.about.statLabel")}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {t("home.about.statSub")}
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* ── RIGHT COLUMN ── */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              {/* ① ORBIT WIDGET — hidden on mobile */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.3, ease: smoothEase }}
                className="hidden lg:flex flex-shrink-0 w-full lg:w-[230px] h-[200px] lg:h-[230px] bg-[#f2f3f5] rounded-2xl items-center justify-center relative"
              >
                <div className="absolute w-[158px] h-[158px] lg:w-[182px] lg:h-[182px] rounded-full border border-gray-200 pointer-events-none" />
                <div className="absolute w-[86px] h-[86px] lg:w-[99px] lg:h-[99px] rounded-full border border-gray-200 pointer-events-none" />

                <div className="relative w-14 h-14 bg-accent rounded-full flex items-center justify-center z-20 overflow-hidden">
                  <Image
                    src="/logoblanco.png"
                    alt="Axium"
                    fill
                    className="object-contain p-2.5"
                    sizes="56px"
                  />
                </div>

                <motion.div
                  className="absolute"
                  style={{ width: 182, height: 182 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: ORBIT_DURATION,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  {ORBIT_ICONS.map(({ Icon, label }, i) => {
                    const angle = (i / ORBIT_ICONS.length) * 2 * Math.PI;
                    const x = Math.cos(angle) * ORBIT_RADIUS;
                    const y = Math.sin(angle) * ORBIT_RADIUS;
                    return (
                      <motion.div
                        key={label}
                        className="absolute w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow"
                        style={{
                          left: `calc(50% + ${x}px - 14px)`,
                          top: `calc(50% + ${y}px - 14px)`,
                        }}
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: ORBIT_DURATION,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      >
                        <Icon className="w-3 h-3 text-white" />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>

              {/* ② IMAGE CARD */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.15, ease: smoothEase }}
                className="flex-1 rounded-2xl overflow-hidden relative w-full"
                style={{ aspectRatio: "1 / 1.21" }}
              >
                <Image
                  src="/about1.jpg"
                  alt={t("home.about.cardEyebrow")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 35vw"
                  quality={90}
                  priority
                />

                <div className="absolute bottom-0 left-0 right-0 px-5 py-5">
                  <p className="text-[10px] font-semibold text-black/50 uppercase tracking-[0.22em] mb-2">
                    {t("home.about.cardEyebrow")}
                  </p>
                  <div className="flex items-end justify-between gap-3">
                    <h3 className="text-heading-2 text-black">
                      {t("home.about.cardTitle")}
                    </h3>
                    <a
                      href="#contacto"
                      aria-label="Contactar"
                      className="w-12 h-12 bg-[#060c20] rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-secondary transition-colors duration-200 group"
                    >
                      <ArrowUpRight className="w-5 h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
