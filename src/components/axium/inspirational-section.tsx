"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "~/hooks/useTranslation";

const smoothEase = [0.4, 0, 0.2, 1] as const;

export function InspirationalSection() {
  const { t } = useTranslation("landing");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden">
      <div className="container-section">
        <div className="content-section relative">
          <motion.div
            className="relative rounded-2xl p-8 md:p-12 bg-[url('/gradient1.png')] bg-cover bg-center border border-gray-800 shadow-2xl cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: smoothEase }}
          >
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div
                className="relative w-20 h-20 md:w-24 md:h-24 transition-all duration-500"
                style={{
                  filter: isHovered
                    ? "drop-shadow(0 0 6px rgba(173, 216, 230, 0.2))"
                    : "none",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className={`object-contain transition-all duration-500 ${
                    isHovered
                      ? "brightness-100 invert-0"
                      : "brightness-0 invert"
                  }`}
                />
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-1 max-w-full sm:max-w-3xl md:max-w-5xl mx-auto">
              <p
                className="text-white text-lg sm:text-xl md:text-2xl leading-tight"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                {t("home.inspirational.line1")}
              </p>
              <p
                className="text-white text-lg sm:text-xl md:text-2xl leading-tight font-semibold"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                {t("home.inspirational.line2")}
              </p>
              <p
                className="text-white text-lg sm:text-xl md:text-2xl leading-tight"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                {t("home.inspirational.line3")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
