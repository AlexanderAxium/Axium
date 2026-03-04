"use client";

import {
  ArrowRight,
  Bot,
  Brain,
  Code2,
  Compass,
  Cpu,
  Database,
  Network,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "~/hooks/useTranslation";

const SERVICE_IDS = ["discovery", "software-dev", "ai-systems"] as const;

const SERVICE_ICONS = {
  discovery: Compass,
  "software-dev": Code2,
  "ai-systems": Brain,
} as const;

const SERVICE_HREFS: Record<string, string> = {
  discovery: "/servicios/product-discovery",
  "software-dev": "/servicios/software-development",
  "ai-systems": "/servicios/ai-agentic-systems",
};

const CARD_IMAGES: Record<string, string> = {
  discovery: "/images/services/card-discovery.png",
  "software-dev": "/images/services/card-software.png",
};

const CARD_DARK_LABEL: Record<string, string> = {
  "software-dev": "Desktop · Web · Mobile",
};

const AI_ORBIT_ICONS = [
  { Icon: Brain, label: "LLM" },
  { Icon: Bot, label: "Agent" },
  { Icon: Database, label: "RAG" },
  { Icon: Network, label: "Orchestration" },
  { Icon: Cpu, label: "Inference" },
];

const ORBIT_RADIUS = 200;
const ORBIT_DURATION = 60;

const smoothEase = [0.4, 0, 0.2, 1] as const;

export function ServicesSection() {
  const { t } = useTranslation("landing");

  return (
    <section id="servicios" className="py-20 md:py-28 bg-gray-100/60">
      <div className="container-section">
        <div className="content-section">
          {/* ── Section header ── */}
          <div className="mb-12 text-center">
            <motion.h2
              className="text-heading-1 text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: smoothEase }}
            >
              {t("home.services.eyebrow")}
            </motion.h2>
            <motion.p
              className="text-gray-500 text-base leading-relaxed max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
            >
              {t("home.services.sectionSubtitle")}
            </motion.p>
          </div>

          {/* ── Cards: unified group with dividers ── */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: smoothEase }}
          >
            {SERVICE_IDS.map((id) => {
              const Icon = SERVICE_ICONS[id];
              return (
                <div
                  key={id}
                  className="bg-white flex flex-col border border-gray-200 rounded-2xl overflow-hidden"
                >
                  {/* Top content */}
                  <div className="p-7 pt-8 flex flex-col gap-5 flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>

                    <h3
                      className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[25px] leading-[1.2] font-light text-gray-900"
                      style={{ fontFamily: "var(--font-family-heading)" }}
                    >
                      {t(`home.services.items.${id}.title`)}
                    </h3>

                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                      {t(`home.services.items.${id}.description`)}
                    </p>

                    <Link
                      href={SERVICE_HREFS[id] ?? "/"}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0072CF] hover:gap-3 transition-all duration-200 w-fit"
                    >
                      {t("home.services.viewService")}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Image area */}
                  {id === "ai-systems" ? (
                    /* ── AI card: orbit widget cut off at ~70% ── */
                    <div className="flex-1 min-h-[240px] overflow-hidden relative">
                      {/* Orbit center pushed down so icons visible, top not cut */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-[90%]">
                        {/* Concentric rings — 3 */}
                        <div
                          className="absolute rounded-full border border-gray-200"
                          style={{
                            width: 400,
                            height: 400,
                            left: -200,
                            top: -200,
                          }}
                        />
                        <div
                          className="absolute rounded-full border border-gray-200"
                          style={{
                            width: 280,
                            height: 280,
                            left: -140,
                            top: -140,
                          }}
                        />
                        <div
                          className="absolute rounded-full border border-gray-200"
                          style={{
                            width: 160,
                            height: 160,
                            left: -80,
                            top: -80,
                          }}
                        />

                        {/* Gradient glow — full orbit size, strong center, invisible edge */}
                        <div
                          className="absolute rounded-full pointer-events-none z-10"
                          style={{
                            width: 320,
                            height: 320,
                            left: -160,
                            top: -160,
                            background:
                              "radial-gradient(circle, rgba(0,114,207,0.20) 0%, rgba(0,114,207,0.08) 45%, transparent 75%)",
                          }}
                        />

                        {/* Center: dark circle + white logo */}
                        <div className="absolute w-16 h-16 bg-[#111] rounded-full flex items-center justify-center z-20 overflow-hidden -translate-x-1/2 -translate-y-1/2 left-0 top-0">
                          <Image
                            src="/logoblanco.png"
                            alt="Axium"
                            fill
                            className="object-contain p-2.5"
                            sizes="64px"
                          />
                        </div>

                        {/* Rotating orbit */}
                        <motion.div
                          className="absolute"
                          style={{
                            width: ORBIT_RADIUS * 2,
                            height: ORBIT_RADIUS * 2,
                            left: -ORBIT_RADIUS,
                            top: -ORBIT_RADIUS,
                          }}
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: ORBIT_DURATION,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        >
                          {AI_ORBIT_ICONS.map(
                            ({ Icon: OrbitIcon, label }, i) => {
                              const angle =
                                (i / AI_ORBIT_ICONS.length) * 2 * Math.PI;
                              const x = Math.cos(angle) * ORBIT_RADIUS;
                              const y = Math.sin(angle) * ORBIT_RADIUS;
                              return (
                                <motion.div
                                  key={label}
                                  className="absolute w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center shadow-sm"
                                  style={{
                                    left: `calc(50% + ${x}px - 16px)`,
                                    top: `calc(50% + ${y}px - 16px)`,
                                  }}
                                  animate={{ rotate: -360 }}
                                  transition={{
                                    duration: ORBIT_DURATION,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                  }}
                                >
                                  <OrbitIcon className="w-3.5 h-3.5 text-gray-900" />
                                </motion.div>
                              );
                            }
                          )}
                        </motion.div>
                      </div>
                    </div>
                  ) : id === "software-dev" ? (
                    /* ── Software card: dark bg with image ── */
                    <div className="bg-[#111] flex-1 flex flex-col w-[80%] md:max-w-[300px] justify-between items-center mx-auto p-3 rounded-2xl">
                      <Image
                        src={CARD_IMAGES[id] ?? ""}
                        alt={t(`home.services.items.${id}.title`)}
                        width={400}
                        height={260}
                        className="w-full object-contain rounded-md"
                      />
                      <p className="text-xs text-white font-medium tracking-widest uppercase pt-6 pb-4 px-3">
                        {CARD_DARK_LABEL[id]}
                      </p>
                    </div>
                  ) : (
                    /* ── Default card: image bleeding to bottom ── */
                    <div className="relative overflow-hidden min-h-[240px] flex-1">
                      <Image
                        src={
                          CARD_IMAGES[id] ??
                          "/images/services/card-discovery.png"
                        }
                        alt={t(`home.services.items.${id}.title`)}
                        fill
                        className="object-contain object-bottom"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
