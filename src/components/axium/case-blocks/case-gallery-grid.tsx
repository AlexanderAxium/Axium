"use client";

import { motion } from "motion/react";
import Image from "next/image";

const smoothEase = [0.4, 0, 0.2, 1] as const;

export interface GalleryImage {
  src: string;
  alt: string;
  span?: 1 | 2;
}

interface CaseGalleryGridProps {
  images: GalleryImage[];
  columns?: 2 | 3;
  sectionTitle?: string;
  background?: "dark" | "light";
  aspect?: "wide" | "tall" | "auto";
}

export function CaseGalleryGrid({
  images,
  columns = 3,
  sectionTitle,
  background = "dark",
  aspect = "auto",
}: CaseGalleryGridProps) {
  const isDark = background === "dark";
  const isSingle = images.length === 1;

  const aspectClass =
    aspect === "wide"
      ? "aspect-[21/9]"
      : aspect === "tall"
        ? "aspect-[3/4]"
        : "";

  if (isSingle) {
    const img = images[0];
    if (!img) return null;
    return (
      <section
        className={`relative w-full overflow-hidden py-16 sm:py-20 lg:py-28 ${
          isDark ? "bg-[#0a0f1f]" : "bg-[#f8fafb]"
        }`}
      >
        {isDark && (
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#0072CF]/20 blur-[120px]" />
            <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#7ECFC3]/10 blur-[120px]" />
          </div>
        )}

        <div className="relative z-10 container-section">
          <div className="content-section">
            {sectionTitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: smoothEase }}
                className={`mb-8 text-center text-xs font-semibold uppercase tracking-[0.3em] ${
                  isDark ? "text-white/60" : "text-[#8a919e]"
                }`}
              >
                {sectionTitle}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: smoothEase }}
              className="[perspective:1200px]"
            >
              <div
                className={`relative overflow-hidden rounded-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateX(2deg)_rotateY(-1deg)_translateY(-8px)] lg:rounded-3xl ${
                  isDark
                    ? "border border-white/10 bg-white/5"
                    : "border border-[#E5EAF3] bg-white"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={1400}
                  height={720}
                  className={`w-full object-cover transition duration-500 hover:scale-[1.02] ${aspectClass}`}
                />
                {isDark && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative w-full overflow-hidden py-16 sm:py-20 lg:py-28 ${
        isDark ? "bg-[#0a0f1f]" : "bg-[#f8fafb]"
      }`}
    >
      {isDark && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#0072CF]/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#7ECFC3]/10 blur-[120px]" />
        </div>
      )}

      <div className="relative z-10 container-section">
        <div className="content-section">
          {sectionTitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: smoothEase }}
              className={`mb-8 text-center text-xs font-semibold uppercase tracking-[0.3em] ${
                isDark ? "text-white/60" : "text-[#8a919e]"
              }`}
            >
              {sectionTitle}
            </motion.p>
          )}

          <div
            className={`grid gap-6 ${
              columns === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"
            }`}
          >
            {images.map((img, i) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: smoothEase,
                }}
                className={`[perspective:1200px] ${
                  img.span === 2 ? "lg:col-span-2" : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden rounded-2xl shadow-[0_25px_60px_-30px_rgba(0,0,0,0.7)] transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateX(2deg)_rotateY(-2deg)_translateY(-6px)] lg:rounded-3xl ${
                    isDark
                      ? "border border-white/10 bg-white/5"
                      : "border border-[#E5EAF3] bg-white"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.span === 2 ? 1200 : 600}
                    height={400}
                    className={`h-full w-full object-cover transition duration-500 hover:scale-[1.03] ${aspectClass}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
