"use client";

import { motion } from "motion/react";
import Image from "next/image";

const smoothEase = [0.4, 0, 0.2, 1] as const;

interface CaseGalleryFullScrollProps {
  image: string;
  alt: string;
  background?: "light" | "dark";
}

export function CaseGalleryFullScroll({
  image,
  alt,
  background = "light",
}: CaseGalleryFullScrollProps) {
  const isLight = background === "light";

  return (
    <section
      className={`relative w-full overflow-hidden py-16 sm:py-24 lg:py-32 ${
        isLight ? "bg-[#f8fafb]" : "bg-[#0a0f1f]"
      }`}
    >
      <div className="relative z-10 container-section">
        <div className="content-section">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="relative overflow-hidden rounded-2xl p-6 shadow-2xl sm:p-10 md:p-14 lg:p-20"
            style={{
              background:
                "linear-gradient(135deg, #060C20 0%, #0a1628 40%, #0d1f35 70%, #060C20 100%)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              <div
                className="absolute -left-16 -top-16 h-72 w-72 opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, #0072CF 0%, transparent 60%)",
                  clipPath: "polygon(0 0, 100% 0, 0 100%)",
                }}
              />
              <div
                className="absolute -right-12 top-8 h-64 w-64 opacity-35"
                style={{
                  background:
                    "linear-gradient(225deg, #7ECFC3 0%, transparent 60%)",
                  clipPath: "polygon(100% 0, 100% 100%, 0 50%)",
                }}
              />
              <div
                className="absolute -bottom-20 -right-20 h-[24rem] w-[24rem] opacity-45"
                style={{
                  background:
                    "linear-gradient(315deg, #7ECFC3 0%, #0072CF 40%, transparent 70%)",
                  clipPath: "polygon(100% 100%, 0 100%, 100% 0)",
                }}
              />
              <div className="absolute left-1/4 top-1/4 h-80 w-80 rounded-full bg-[#0072CF]/15 blur-[80px]" />
              <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-[#7ECFC3]/15 blur-[70px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl">
              <div className="relative overflow-hidden rounded-lg shadow-[0_25px_80px_-20px_rgba(0,0,0,0.5)]">
                <Image
                  src={image}
                  alt={alt}
                  width={1920}
                  height={10000}
                  className="w-full"
                  priority
                  quality={100}
                  unoptimized
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
