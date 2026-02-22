"use client";

import { Zap } from "lucide-react";
import { motion } from "motion/react";
import { useCallback } from "react";
import { useTranslation } from "~/hooks/useTranslation";

const smoothEase = [0.4, 0, 0.2, 1] as const;

export function HeroSection() {
  const { t } = useTranslation("landing");

  const scrollToContact = useCallback(() => {
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat min-h-screen flex items-center"
      style={{ backgroundImage: "url(/hero2.png)" }}
    >
      <div className="container-section w-full py-20">
        <div className="content-section relative">
          <div className="relative flex flex-col items-center justify-between min-h-[70vh]">
            <motion.div
              className="text-center space-y-6 lg:space-y-8 max-w-4xl pt-8 lg:pt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: smoothEase }}
            >
              <h1 className="text-heading-1 text-white leading-tight">
                {t("home.hero.titlePrefix")}
                <span className="bg-gradient-to-r from-[#0072CF] to-[#7ECFC3] bg-clip-text text-transparent">
                  {t("home.hero.titleHighlight")}
                </span>
                {t("home.hero.titleSuffix")}
              </h1>
            </motion.div>

            <motion.div
              className="flex justify-end w-full mt-auto pb-8 lg:pb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: smoothEase }}
            >
              <div className="max-w-xs lg:max-w-sm rounded-3xl p-5 lg:p-6 bg-transparent border border-white/20 backdrop-blur-xl">
                <p className="text-body text-white/90 mb-5 leading-relaxed">
                  {t("home.hero.description")}
                </p>

                <button
                  type="button"
                  onClick={scrollToContact}
                  className="relative w-full bg-gradient-to-r from-[#0072CF] to-[#7ECFC3] text-white rounded-lg py-3 px-5 text-sm font-medium flex items-center justify-center gap-2 overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-105 hover:shadow-[#0072CF]/50"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#7ECFC3] to-[#0072CF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {t("home.hero.cta")}
                    <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
