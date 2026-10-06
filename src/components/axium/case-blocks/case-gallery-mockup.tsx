"use client";

import { motion } from "motion/react";
import Image from "next/image";

const smoothEase = [0.4, 0, 0.2, 1] as const;

interface CaseGalleryMockupProps {
  logo?: { src: string; alt: string };
  brandName?: string;
  brandDescription?: string;
  heroImage?: { src: string; alt: string };
  laptopImage?: { src: string; alt: string };
  mobileImage?: { src: string; alt: string };
}

export function CaseGalleryMockup({
  logo,
  brandName,
  brandDescription,
  heroImage,
  laptopImage,
  mobileImage,
}: CaseGalleryMockupProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#0a0f1f] py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#3b82f6]/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#22d3ee]/10 blur-[120px]" />
      </div>

      <div className="container-section">
        <div className="content-section flex flex-col gap-10">
          {(logo || brandName) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="relative z-10 flex flex-col items-center gap-5 text-center"
            >
              {logo && (
                <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/40 backdrop-blur">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent" />
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={72}
                    height={72}
                    className="relative z-10 h-16 w-16 object-contain"
                  />
                </div>
              )}
              {brandName && (
                <p className="max-w-2xl text-sm font-medium uppercase tracking-[0.3em] text-white/60">
                  {brandName}
                </p>
              )}
              {brandDescription && (
                <p className="max-w-2xl text-base leading-relaxed text-white/80">
                  {brandDescription}
                </p>
              )}
            </motion.div>
          )}

          <div className="relative z-10 flex flex-col gap-6">
            {heroImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: smoothEase }}
                className="[perspective:1200px]"
              >
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateX(2deg)_rotateY(-2deg)_translateY(-8px)]">
                  <Image
                    src={heroImage.src}
                    alt={heroImage.alt}
                    width={1400}
                    height={720}
                    quality={95}
                    className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </motion.div>
            )}

            {(laptopImage || mobileImage) && (
              <div
                className={`grid gap-6 ${
                  laptopImage && mobileImage ? "lg:grid-cols-3" : ""
                }`}
              >
                {laptopImage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1, ease: smoothEase }}
                    className={`[perspective:1200px] ${
                      mobileImage ? "lg:col-span-2" : ""
                    }`}
                  >
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_25px_60px_-30px_rgba(0,0,0,0.7)] transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateX(3deg)_rotateY(3deg)_translateY(-6px)]">
                      <Image
                        src={laptopImage.src}
                        alt={laptopImage.alt}
                        width={900}
                        height={620}
                        className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                      />
                    </div>
                  </motion.div>
                )}
                {mobileImage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
                    className="[perspective:1200px] lg:col-span-1"
                  >
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_25px_60px_-30px_rgba(0,0,0,0.7)] transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateX(3deg)_rotateY(-3deg)_translateY(-6px)]">
                      <Image
                        src={mobileImage.src}
                        alt={mobileImage.alt}
                        width={900}
                        height={620}
                        className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
