"use client";

import Image from "next/image";
import type { CaseItem } from "~/data/cases-data";

interface CaseDetailGalleryProps {
  caseItem: CaseItem;
}

const maintechAssets = {
  logo: "/images/proyects/maintech/iconotipo.png",
  laptop: "/images/proyects/maintech/maintech-lap.jpg",
  mobile: "/images/proyects/maintech/maintech-cel.jpg",
  triple: "/images/proyects/maintech/maintech-3-cel.png",
};

const vitalchainAssets = {
  fullPage:
    "/images/proyects/vitalchain/screencapture-vitalchainacademy-2026-01-20-17_03_04.png",
};

function MaintechGallery() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0a0f1f] py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#3b82f6]/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#22d3ee]/10 blur-[120px]" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 md:px-6 lg:px-8">
        <div className="relative z-10 flex flex-col items-center gap-5 text-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent" />
            <Image
              src={maintechAssets.logo}
              alt="Maintech logo"
              width={72}
              height={72}
              className="relative z-10 h-16 w-16 object-contain"
            />
          </div>
          <p className="max-w-2xl text-sm font-medium uppercase tracking-[0.3em] text-white/60">
            Maintech
          </p>
          <p className="max-w-2xl text-base leading-relaxed text-white/80">
            Interfaces enfocadas en aprendizaje continuo, dashboards claros y
            pantallas responsivas que acompanan el progreso del estudiante.
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-6">
          <div className="[perspective:1200px]">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateX(2deg)_rotateY(-2deg)_translateY(-8px)]">
              <Image
                src={maintechAssets.triple}
                alt="Maintech mobile screens"
                width={1400}
                height={720}
                className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="[perspective:1200px] lg:col-span-2">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_25px_60px_-30px_rgba(0,0,0,0.7)] transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateX(3deg)_rotateY(3deg)_translateY(-6px)]">
                <Image
                  src={maintechAssets.laptop}
                  alt="Maintech laptop view"
                  width={900}
                  height={620}
                  className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                />
              </div>
            </div>
            <div className="[perspective:1200px] lg:col-span-1">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_25px_60px_-30px_rgba(0,0,0,0.7)] transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateX(3deg)_rotateY(-3deg)_translateY(-6px)]">
                <Image
                  src={maintechAssets.mobile}
                  alt="Maintech mobile dashboard"
                  width={900}
                  height={620}
                  className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VitalchainGallery() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f8fafb] py-16 sm:py-24 lg:py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Inner container - dark background with geometry */}
        <div
          className="relative overflow-hidden rounded-2xl p-6 shadow-2xl sm:p-10 md:p-14 lg:p-20"
          style={{
            background:
              "linear-gradient(135deg, #060C20 0%, #0a1628 40%, #0d1f35 70%, #060C20 100%)",
          }}
        >
          {/* Geometric decorations inside dark container */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
            {/* Top left - blue accent triangle */}
            <div
              className="absolute -left-16 -top-16 h-72 w-72 opacity-50"
              style={{
                background:
                  "linear-gradient(135deg, #0072CF 0%, transparent 60%)",
                clipPath: "polygon(0 0, 100% 0, 0 100%)",
              }}
            />
            {/* Top right - teal geometric shape */}
            <div
              className="absolute -right-12 top-8 h-64 w-64 opacity-35"
              style={{
                background:
                  "linear-gradient(225deg, #7ECFC3 0%, transparent 60%)",
                clipPath: "polygon(100% 0, 100% 100%, 0 50%)",
              }}
            />
            {/* Bottom left - subtle blue shape */}
            <div
              className="absolute -left-8 bottom-8 h-56 w-56 opacity-30"
              style={{
                background:
                  "linear-gradient(45deg, #0072CF 0%, transparent 50%)",
                clipPath: "polygon(0 30%, 100% 0, 80% 100%, 0 100%)",
              }}
            />
            {/* Bottom right - teal/turquoise triangle */}
            <div
              className="absolute -bottom-20 -right-20 h-[24rem] w-[24rem] opacity-45"
              style={{
                background:
                  "linear-gradient(315deg, #7ECFC3 0%, #0072CF 40%, transparent 70%)",
                clipPath: "polygon(100% 100%, 0 100%, 100% 0)",
              }}
            />
            {/* Subtle glow orbs */}
            <div className="absolute left-1/4 top-1/4 h-80 w-80 rounded-full bg-[#0072CF]/15 blur-[80px]" />
            <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-[#7ECFC3]/15 blur-[70px]" />
            {/* Diagonal accent lines */}
            <div className="absolute left-[5%] top-[15%] h-px w-32 rotate-[35deg] bg-gradient-to-r from-transparent via-[#0072CF]/40 to-transparent" />
            <div className="absolute right-[8%] top-[25%] h-px w-28 -rotate-[15deg] bg-gradient-to-r from-transparent via-[#7ECFC3]/35 to-transparent" />
            <div className="absolute bottom-[20%] left-[10%] h-px w-40 rotate-[25deg] bg-gradient-to-r from-transparent via-[#0072CF]/25 to-transparent" />
          </div>

          {/* Screenshot container */}
          <div className="relative z-10 mx-auto max-w-5xl">
            {/* Main image with shadow */}
            <div className="relative overflow-hidden rounded-lg shadow-[0_25px_80px_-20px_rgba(0,0,0,0.5)]">
              <Image
                src={vitalchainAssets.fullPage}
                alt="VitalChain Academy - Vista completa del sitio"
                width={1920}
                height={10000}
                className="w-full"
                priority
                quality={100}
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CaseDetailGallery({ caseItem }: CaseDetailGalleryProps) {
  const title = caseItem.title.toLowerCase();

  if (title === "maintech") {
    return <MaintechGallery />;
  }

  if (title === "vitalchain academy") {
    return <VitalchainGallery />;
  }

  return null;
}
