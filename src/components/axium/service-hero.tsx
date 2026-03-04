"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { ServicePageData } from "~/data/services-data";

const smoothEase = [0.4, 0, 0.2, 1] as const;

interface ServiceHeroProps {
  data: ServicePageData;
}

export function ServiceHero({ data }: ServiceHeroProps) {
  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(data.whatsappMessage);
    window.open(`https://wa.me/51991285679?text=${encoded}`, "_blank");
  };

  return (
    <section
      id="page-hero"
      className="relative min-h-[70vh] overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/abs6.png')" }}
    >
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%)",
        }}
        aria-hidden
      />

      <div className="container-section relative z-10 flex min-h-[70vh] flex-col justify-end py-24 md:py-28 lg:py-32">
        <div className="content-section w-full">
          <div className="flex flex-col items-start">
            <motion.nav
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: smoothEase }}
              className="mb-4 flex items-center gap-2 text-sm text-white/40"
            >
              <Link href="/" className="transition-colors hover:text-white/70">
                Inicio
              </Link>
              <span>/</span>
              <span className="text-white/60">Servicios</span>
              <span>/</span>
              <span className="text-white/80">{data.shortTitle}</span>
            </motion.nav>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: smoothEase }}
              className="text-3xl leading-tight text-white sm:text-4xl md:text-5xl"
            >
              {data.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12, ease: smoothEase }}
              className="mt-2 max-w-xl text-base leading-relaxed text-white/70"
            >
              {data.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18, ease: smoothEase }}
              className="mt-6 flex flex-wrap gap-4"
            >
              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0072CF] to-[#7ECFC3] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#0072CF]/30"
              >
                <MessageCircle className="h-4 w-4" />
                Consultar ahora
              </button>
              <Link
                href="/portafolio"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/15"
              >
                Ver proyectos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
