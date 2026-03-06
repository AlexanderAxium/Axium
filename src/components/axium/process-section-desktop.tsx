"use client";

import { Code2, Lightbulb, Rocket } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import type { ComponentType } from "react";
import { useTranslation } from "~/hooks/useTranslation";

const STEP_IDS = ["definir", "construir", "lanzar"] as const;
const STEP_ICONS = [Lightbulb, Code2, Rocket] as const;
const CARD_COLORS = ["bg-accent", "bg-secondary", "bg-accent"] as const;
const smoothEase = [0.4, 0, 0.2, 1] as const;

export interface ProcessSectionDesktopProps {
  activeStep: number;
  onStepChange: (step: number) => void;
}

export function ProcessSectionDesktop({
  activeStep,
  onStepChange,
}: ProcessSectionDesktopProps) {
  const { t } = useTranslation("landing");

  return (
    <>
      <div className="min-h-0 h-[420px] lg:h-[380px] flex items-center justify-center">
        <motion.div
          className="relative w-[220px] h-[280px] lg:w-[260px] lg:h-[320px] rounded-2xl overflow-hidden flex-shrink-0"
          animate={{ scale: 1 + activeStep * 0.02 }}
          transition={{ duration: 0.6, ease: smoothEase }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ scale: 1 + activeStep * 0.05 }}
            transition={{ duration: 0.7, ease: smoothEase }}
          >
            <Image
              src="/process.png"
              alt="Proceso de trabajo"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 220px, 260px"
              priority
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-secondary/10 to-transparent"
            animate={{ opacity: activeStep * 0.15 }}
            transition={{ duration: 0.5, ease: smoothEase }}
          />
        </motion.div>

        <div className="flex items-center flex-shrink-0 ml-6 lg:ml-8">
          <motion.div
            className="w-3 h-3 rounded-full bg-secondary"
            animate={{ scale: activeStep === 0 ? 1.2 : 1 }}
            transition={{ duration: 0.3, ease: smoothEase }}
          />
          <div className="w-4 h-0.5 bg-secondary" />
          <motion.div
            className="bg-white rounded-full px-4 py-2.5 shadow-md border border-gray-200"
            animate={{
              scale: activeStep === 0 ? 1.02 : 1,
              boxShadow:
                activeStep === 0
                  ? "0 8px 25px -5px rgba(0, 0, 0, 0.15)"
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            transition={{ duration: 0.4, ease: smoothEase }}
          >
            <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
              {t("home.process.badges.primary")}
            </span>
          </motion.div>
          <motion.div
            initial={false}
            animate={{
              width: activeStep >= 1 ? 24 : 0,
              opacity: activeStep >= 1 ? 1 : 0,
            }}
            transition={{ duration: 0.35, ease: smoothEase }}
            className="h-0.5 bg-secondary origin-left"
          />
          <motion.div
            initial={false}
            animate={{
              width: activeStep >= 1 ? 12 : 0,
              opacity: activeStep >= 1 ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: smoothEase }}
            className="h-3 rounded-full bg-secondary flex-shrink-0"
          />
        </div>

        <motion.div
          initial={false}
          animate={{
            width: activeStep >= 1 ? "auto" : 0,
            opacity: activeStep >= 1 ? 1 : 0,
            marginLeft: activeStep >= 1 ? 24 : 0,
          }}
          transition={{ duration: 0.4, ease: smoothEase }}
          className="overflow-hidden flex-shrink-0"
        >
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  opacity: activeStep >= 1 ? 1 : 0,
                  x: activeStep >= 1 ? 0 : -20,
                }}
                transition={{
                  duration: 0.35,
                  delay: activeStep >= 1 ? 0.05 + index * 0.06 : 0,
                  ease: smoothEase,
                }}
                className="bg-white rounded-lg px-4 py-2.5 shadow-md border border-gray-200"
              >
                <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                  {t(`home.process.badges.secondary.${index}`)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={false}
          animate={{
            width: activeStep >= 2 ? "auto" : 0,
            opacity: activeStep >= 2 ? 1 : 0,
            marginLeft: activeStep >= 2 ? 24 : 0,
          }}
          transition={{ duration: 0.4, ease: smoothEase }}
          className="flex items-center overflow-hidden flex-shrink-0"
        >
          <div className="flex items-center flex-shrink-0 mr-6">
            <div className="w-6 h-0.5 bg-secondary" />
            <div className="w-3 h-3 rounded-full bg-secondary" />
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  opacity: activeStep >= 2 ? 1 : 0,
                  y: activeStep >= 2 ? 0 : 15,
                  scale: activeStep >= 2 ? 1 : 0.96,
                }}
                transition={{
                  duration: 0.4,
                  delay: activeStep >= 2 ? 0.05 + index * 0.07 : 0,
                  ease: smoothEase,
                }}
                className="bg-white rounded-xl p-3 shadow-md border border-gray-200 w-[180px]"
              >
                <h4 className="text-sm font-bold text-gray-900 mb-1.5">
                  {t(`home.process.cards.${index}.title`)}
                </h4>
                <span
                  className={`inline-block px-2 py-0.5 text-xs font-medium text-white rounded ${CARD_COLORS[index]}`}
                >
                  {t(`home.process.cards.${index}.tag`)}
                </span>
                <div className="mt-2 space-y-1.5">
                  <div className="h-1.5 bg-gray-200 rounded-full w-full" />
                  <div className="h-1.5 bg-gray-200 rounded-full w-4/5" />
                  <div className="flex gap-1.5">
                    <div className="h-1.5 bg-gray-100 rounded-full w-3/5" />
                    <div className="h-1.5 bg-gray-100 rounded-full w-2/5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="border-t border-gray-200 pt-10">
        <div className="grid grid-cols-3 gap-8">
          {STEP_IDS.map((id, index) => {
            const Icon = STEP_ICONS[index] as ComponentType<{
              className?: string;
            }>;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onStepChange(index)}
                className="text-left group relative"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                      activeStep === index
                        ? "bg-secondary text-white shadow-md shadow-secondary/25"
                        : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-base font-semibold mb-1 transition-colors duration-500 ${
                        activeStep === index
                          ? "text-gray-900"
                          : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    >
                      {t(`home.process.steps.${id}.fullTitle`)}
                    </h4>
                    <p
                      className={`text-sm line-clamp-3 transition-colors duration-500 ${
                        activeStep === index
                          ? "text-gray-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    >
                      {t(`home.process.steps.${id}.description`)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
