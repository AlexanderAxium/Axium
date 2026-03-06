"use client";

import {
  Eye,
  FileText,
  Layers,
  Lightbulb,
  type LucideIcon,
  Monitor,
  Package,
  Palette,
  PenTool,
  Play,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import { ServiceFaqSection } from "~/components/axium/service-faq-section";
import { ServiceHero } from "~/components/axium/service-hero";
import { smoothEase } from "~/components/axium/service-shared";
import { SERVICES, type ServicePageData } from "~/data/services-data";

const raw = SERVICES["design-branding"];
if (!raw) throw new Error("Missing service data for design-branding");
const data: ServicePageData = raw;
const ACCENT = "#0072CF";

// ── Section 3: service rows ──────────────────────────────────────────────────
const SERVICE_ROWS = [
  {
    tag: "Identidad Visual",
    icon: Palette,
    title: "Logo & sistema de marca",
    description:
      "Diseñamos tu identidad desde cero: logo versátil, paleta de colores, tipografía y todos los elementos que forman tu marca.",
  },
  {
    tag: "Branding",
    icon: Layers,
    title: "Brand guidelines",
    description:
      "Manual de marca completo para que tu identidad sea consistente en cada canal, equipo y punto de contacto con el cliente.",
  },
  {
    tag: "Materiales",
    icon: FileText,
    title: "Brochures & marketing",
    description:
      "Brochures corporativos, flyers, social media kits, presentaciones y cualquier material impreso o digital que necesites.",
  },
  {
    tag: "UX/UI",
    icon: Eye,
    title: "Diseño de producto digital",
    description:
      "Wireframes, prototipos y diseños de alta fidelidad en Figma. Interfaces centradas en el usuario, listas para desarrollo.",
  },
  {
    tag: "Web Design",
    icon: Monitor,
    title: "Websites y landing pages",
    description:
      "Diseño editorial para páginas web y landing pages que equilibran estética y conversión.",
  },
  {
    tag: "Motion",
    icon: Play,
    title: "Animaciones & presentaciones",
    description:
      "Animaciones de marca, pitch decks y presentaciones ejecutivas que hacen que tu historia se cuente sola.",
  },
];

// ── Section 4: process steps ─────────────────────────────────────────────────
const PROCESS_STEPS: {
  num: string;
  title: string;
  bullets: string[];
  icon: LucideIcon;
  color: string;
}[] = [
  {
    num: "01",
    title: "Descubrimiento",
    bullets: [
      "Brief creativo",
      "Análisis de competidores",
      "Benchmark visual",
      "Definición de audiencia",
    ],
    icon: Search,
    color: ACCENT,
  },
  {
    num: "02",
    title: "Estrategia",
    bullets: [
      "Dirección creativa",
      "Moodboard",
      "Arquitectura visual",
      "Concepto de marca",
    ],
    icon: Lightbulb,
    color: "#7ECFC3",
  },
  {
    num: "03",
    title: "Diseño",
    bullets: [
      "Logotipo & variantes",
      "Sistema de marca",
      "Materiales digitales",
      "Revisiones iterativas",
    ],
    icon: PenTool,
    color: ACCENT,
  },
  {
    num: "04",
    title: "Entrega",
    bullets: [
      "Archivos editables",
      "Brand guidelines PDF",
      "Todos los formatos",
      "Soporte post-entrega",
    ],
    icon: Package,
    color: "#7ECFC3",
  },
];

// ── Section 5: "¿Para quién es?" cards ──────────────────────────────────────
const FOR_WHO = [
  {
    title: "Startups",
    description:
      "Empresas que necesitan construir una marca sólida desde cero para lanzar con confianza.",
  },
  {
    title: "Empresas en rebranding",
    description:
      "Organizaciones que evolucionaron y necesitan que su imagen refleje dónde están hoy.",
  },
  {
    title: "Founders con pitch deck",
    description:
      "Emprendedores que presentan a inversores y necesitan materiales de alto impacto.",
  },
  {
    title: "Equipos de producto",
    description:
      "Equipos tech que necesitan diseño de UI/UX profesional para sus aplicaciones.",
  },
];

// ── Section 7: FAQ ───────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "¿Cuánto demora un proyecto de branding?",
    a: "Depende del alcance. Una identidad visual completa (logo + brand guidelines) toma entre 2 y 4 semanas. Proyectos con materiales adicionales pueden extenderse a 6-8 semanas.",
  },
  {
    q: "¿Qué necesito para empezar?",
    a: "Solo una llamada de descubrimiento. Nos cuentas sobre tu empresa, audiencia y objetivos, y preparamos el brief creativo. No necesitas tener nada preparado de antemano.",
  },
  {
    q: "¿Entregan archivos editables?",
    a: "Sí, siempre. Entregamos todos los archivos en formatos editables: AI, EPS, SVG para el logo; Figma para el diseño de producto; PDF e InDesign para materiales impresos.",
  },
  {
    q: "¿Hacen rediseños de marca existente?",
    a: "Absolutamente. Trabajamos tanto con marcas desde cero como con rebrandings. Analizamos tu marca actual e identificamos qué mantener, qué evolucionar y qué transformar completamente.",
  },
  {
    q: "¿El diseño web está incluido en el servicio de branding?",
    a: "El diseño de landing pages y websites es un servicio adicional que puede complementar el branding. Podemos cotizarlos juntos o por separado según tus necesidades.",
  },
  {
    q: "¿Cuántas revisiones están incluidas?",
    a: "Incluimos hasta 3 rondas de revisiones en cada etapa del proyecto. Si necesitas ajustes adicionales fuera de ese alcance, los cotizamos por separado de forma transparente.",
  },
];

export function BrandDesignPage() {
  return (
    <>
      {/* ── S1: Hero ──────────────────────────────────────────────────────── */}
      <ServiceHero data={data} />

      {/* ── S2: Split stats ───────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-section">
          <div className="content-section">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: text */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: smoothEase }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-0.5 bg-secondary rounded-full" />
                  <span className="text-overline text-gray-500">
                    01 — Qué es Design & Branding
                  </span>
                </div>
                <h2 className="text-heading-1 text-gray-900 mb-6">
                  Tu marca es la primera impresión que no puedes repetir
                </h2>
                <p className="text-body text-gray-500 mb-4">
                  El diseño no es solo cómo se ve algo — es cómo funciona, cómo
                  se siente y qué comunica sin decir una palabra. Una identidad
                  visual sólida genera reconocimiento, confianza y
                  diferenciación en mercados saturados.
                </p>
                <p className="text-body text-gray-500 mb-4">
                  En Axium combinamos estrategia y creatividad para construir
                  marcas que no solo se ven bien, sino que conectan con las
                  personas correctas en el momento correcto.
                </p>
                <p className="text-body text-gray-500">
                  Desde el logo hasta el manual de marca completo, los
                  materiales de marketing y el diseño de producto — cubrimos
                  todo el espectro visual de tu empresa.
                </p>
              </motion.div>

              {/* Right: stacked stats */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.12, ease: smoothEase }}
                className="flex flex-col gap-6"
              >
                <div className="border border-gray-200 rounded-2xl p-8 bg-gray-50">
                  <p className="text-6xl sm:text-7xl font-light text-gray-900 leading-none mb-3">
                    3<span className="text-secondary">×</span>
                  </p>
                  <p className="text-body text-gray-700">
                    más reconocimiento de marca con una identidad visual
                    consistente aplicada en todos los canales.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-2xl p-8 bg-gray-50">
                  <p className="text-6xl sm:text-7xl font-light text-gray-900 leading-none mb-3">
                    100<span className="text-secondary">%</span>
                  </p>
                  <p className="text-body text-gray-700">
                    de la estrategia al activo visual final — entregamos todo,
                    desde el concepto hasta los archivos listos para usar.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── S3: Service rows ──────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-section">
          <div className="content-section">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease: smoothEase }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-0.5 bg-secondary rounded-full" />
                <span className="text-overline text-gray-500">
                  02 — Servicios incluidos
                </span>
              </div>
              <h2 className="text-heading-1 text-gray-900 max-w-xl">
                Todo lo que necesitas para construir una marca poderosa
              </h2>
            </motion.div>

            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {SERVICE_ROWS.map(
                ({ tag, icon: Icon, title, description }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.06,
                      ease: smoothEase,
                    }}
                    className="grid grid-cols-1 md:grid-cols-[160px_1fr_2fr] gap-2 md:gap-4 py-5 md:py-6"
                  >
                    <span className="inline-flex items-center gap-1.5 text-overline text-secondary self-start">
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      {tag}
                    </span>
                    <p className="text-body font-medium text-gray-900 self-start">
                      {title}
                    </p>
                    <p className="text-body-sm text-gray-500 leading-relaxed">
                      {description}
                    </p>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── S4: Process — circular icons + dashed connector ───────────────── */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="container-section">
          <div className="content-section">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease: smoothEase }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-0.5 bg-secondary rounded-full" />
                <span className="text-overline text-gray-500">
                  03 — Proceso
                </span>
              </div>
              <h2 className="text-heading-1 text-gray-900 max-w-xl">
                De la estrategia a los activos finales en semanas
              </h2>
            </motion.div>

            {/* 4 columns with dashed connector */}
            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {/* Dashed horizontal connector — desktop only */}
              <div
                className="hidden lg:block absolute top-[72px] left-[12.5%] right-[12.5%] border-t-2 border-dashed border-gray-200 z-0"
                aria-hidden
              />

              {PROCESS_STEPS.map(
                ({ num, title, bullets, icon: Icon, color }, i) => (
                  <motion.div
                    key={num}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.45,
                      delay: i * 0.1,
                      ease: smoothEase,
                    }}
                    className="relative z-10 flex flex-col items-center text-center"
                  >
                    {/* Circular icon */}
                    <div
                      className="w-36 h-36 rounded-full border-4 border-white shadow-md mb-5 flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}14` }}
                    >
                      <Icon className="w-10 h-10" style={{ color }} />
                    </div>

                    {/* Step number */}
                    <p className="text-4xl sm:text-5xl font-light text-gray-200 leading-none mb-3 select-none">
                      {num}
                    </p>

                    {/* Title */}
                    <h3 className="text-heading-3 text-gray-900 mb-4">
                      {title}
                    </h3>

                    {/* Bullets */}
                    <ul className="space-y-1.5 text-left w-full max-w-[160px]">
                      {bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2 text-body-sm text-gray-500"
                        >
                          <span
                            className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: color }}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── S5: ¿Para quién es? — dark bg + cards ────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#060C20]">
        <div className="container-section">
          <div className="content-section">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left: headline */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: smoothEase }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-0.5 bg-accent rounded-full" />
                  <span className="text-overline text-white/40">
                    04 — Ideal para
                  </span>
                </div>
                <h2 className="text-heading-1 text-white mb-6">
                  ¿Para quién es Design & Branding?
                </h2>
                <p className="text-body text-white/50">
                  Trabajamos con todo tipo de organizaciones que necesitan
                  comunicar su valor de forma clara, coherente y memorable.
                </p>
              </motion.div>

              {/* Right: 2×2 grid of cards */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {FOR_WHO.map(({ title, description }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1 + i * 0.07,
                      ease: smoothEase,
                    }}
                    className="border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
                  >
                    <h3 className="text-heading-3 text-white mb-2">{title}</h3>
                    <p className="text-body-sm text-white/50">{description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── S6: FAQ ───────────────────────────────────────────────────────── */}
      <ServiceFaqSection
        faqs={FAQS}
        accentColor={ACCENT}
        sectionLabel={<>— 05 &nbsp; Preguntas frecuentes</>}
        ctaTitle="¿Listo para construir tu marca?"
        ctaSubtitle="Conversemos sobre tu proyecto. Sin compromiso, sin presión."
        whatsappMessage={data.whatsappMessage}
      />

      {/* ── S7: CTA ───────────────────────────────────────────────────────── */}
      <CaseContactCTA />
    </>
  );
}
