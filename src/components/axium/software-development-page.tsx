"use client";

import {
  CheckCircle2,
  Database,
  GitBranch,
  Globe,
  Layers,
  type LucideIcon,
  Monitor,
  Rocket,
  Shield,
  Smartphone,
} from "lucide-react";
import { motion } from "motion/react";
import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import { ServiceFaqSection } from "~/components/axium/service-faq-section";
import { ServiceHero } from "~/components/axium/service-hero";
import { smoothEase } from "~/components/axium/service-shared";
import { SERVICES, type ServicePageData } from "~/data/services-data";

const raw = SERVICES["software-development"];
if (!raw) throw new Error("Missing service data for software-development");
const data: ServicePageData = raw;
const ACCENT = "#0072CF";

// ── Section 3: service rows ──────────────────────────────────────────────────
const SERVICE_ROWS = [
  {
    tag: "Web",
    icon: Globe,
    title: "Aplicaciones web",
    description:
      "Desde landing pages hasta plataformas SaaS complejas. Rápidas, accesibles y optimizadas para SEO con Next.js y React.",
  },
  {
    tag: "Móvil",
    icon: Smartphone,
    title: "Apps iOS & Android",
    description:
      "React Native para las dos plataformas desde un solo codebase. Rendimiento nativo con menor tiempo al mercado.",
  },
  {
    tag: "Backend",
    icon: Database,
    title: "APIs y servicios",
    description:
      "Backends escalables en Node.js, APIs REST y GraphQL. Arquitecturas limpias que soportan crecimiento real.",
  },
  {
    tag: "Seguridad",
    icon: Shield,
    title: "Seguro desde el inicio",
    description:
      "Autenticación, autorización y cifrado integrados desde el sprint 1, no como afterthought.",
  },
  {
    tag: "Calidad",
    icon: CheckCircle2,
    title: "Testing y QA",
    description:
      "Pruebas automatizadas, QA manual y benchmarks de rendimiento antes de cada release.",
  },
  {
    tag: "Soporte",
    icon: Monitor,
    title: "Mantenimiento continuo",
    description:
      "No desaparecemos después del lanzamiento. Monitoreo, corrección de bugs y mejoras iterativas.",
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
    title: "Arquitectura",
    bullets: [
      "Selección del stack",
      "Diseño de arquitectura",
      "Roadmap técnico",
      "Definición de APIs",
    ],
    icon: Layers,
    color: ACCENT,
  },
  {
    num: "02",
    title: "Desarrollo ágil",
    bullets: [
      "Sprints de 2 semanas",
      "Demos quincenales",
      "Código revisado en PR",
      "Documentación continua",
    ],
    icon: GitBranch,
    color: "#7ECFC3",
  },
  {
    num: "03",
    title: "Testing y QA",
    bullets: [
      "Unit & integration tests",
      "QA manual",
      "Performance benchmarks",
      "Security review",
    ],
    icon: CheckCircle2,
    color: ACCENT,
  },
  {
    num: "04",
    title: "Deploy y monitoreo",
    bullets: [
      "CI/CD automatizado",
      "Despliegue en la nube",
      "Monitoreo en tiempo real",
      "Alertas y logs",
    ],
    icon: Rocket,
    color: "#7ECFC3",
  },
];

// ── Section 5: "¿Para quién es?" ─────────────────────────────────────────────
const FOR_WHO = [
  {
    title: "Startups",
    description:
      "Equipos que necesitan ir a producción rápido con una arquitectura que soporte el crecimiento.",
  },
  {
    title: "Scale-ups",
    description:
      "Empresas que necesitan escalar su producto sin comprometer la calidad del código.",
  },
  {
    title: "Empresas tradicionales",
    description:
      "Organizaciones que quieren digitalizar procesos o modernizar sistemas legacy.",
  },
  {
    title: "Equipos de producto",
    description:
      "Founders y PMs que necesitan un equipo técnico confiable para ejecutar su visión.",
  },
];

// ── Section 6: FAQ ───────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "¿Cuánto tarda en desarrollarse un proyecto?",
    a: "Depende del alcance. Un MVP funcional puede estar listo en 6-10 semanas. Plataformas más complejas requieren entre 3 y 6 meses. Siempre arrancamos con un sprint de arquitectura para definir el roadmap con precisión.",
  },
  {
    q: "¿Pueden integrarse con sistemas existentes?",
    a: "Sí, es una de nuestras especialidades. Integramos con ERPs, CRMs, bases de datos legadas, APIs de terceros y cualquier sistema que tenga una interfaz de conexión documentada.",
  },
  {
    q: "¿Qué pasa después del lanzamiento?",
    a: "Ofrecemos planes de mantenimiento y soporte continuo. Monitoreo 24/7, corrección de bugs, actualizaciones de dependencias y nuevas funcionalidades en ciclos regulares.",
  },
  {
    q: "¿Trabajan solo con startups?",
    a: "No. Trabajamos con startups en etapa temprana, scale-ups en crecimiento y empresas consolidadas que buscan modernizar sus sistemas o lanzar nuevos productos digitales.",
  },
  {
    q: "¿Entregan el código fuente?",
    a: "Siempre. El código es 100% tuyo desde el inicio. Trabajamos en tu repositorio desde el día 1, con historial completo y documentación de decisiones técnicas.",
  },
  {
    q: "¿Pueden trabajar con el equipo técnico interno?",
    a: "Sí, y es algo que nos gusta mucho. Podemos actuar como equipo extendido, aportando capacidad y experiencia mientras colaboramos con tus desarrolladores.",
  },
];

export function SoftwareDevelopmentPage() {
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
                    01 — Qué es Software Development
                  </span>
                </div>
                <h2 className="text-heading-1 text-gray-900 mb-6">
                  Código que escala desde el primer sprint
                </h2>
                <p className="text-body text-gray-500 mb-4">
                  No desarrollamos software que funciona solo en demos.
                  Construimos productos reales — web, móvil y backend — con
                  arquitectura sólida, stack moderno y entregas reales cada dos
                  semanas.
                </p>
                <p className="text-body text-gray-500 mb-4">
                  En Axium combinamos velocidad y calidad de ingeniería.
                  TypeScript de punta a punta, código revisado, tests
                  automatizados y pipelines CI/CD desde el día 1.
                </p>
                <p className="text-body text-gray-500">
                  Desde el MVP inicial hasta la plataforma que soporta miles de
                  usuarios — acompañamos cada etapa del crecimiento de tu
                  producto.
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
                    2<span className="text-secondary"> sem</span>
                  </p>
                  <p className="text-body text-gray-700">
                    ciclos de entrega ágiles — ves progreso real cada quincena,
                    no solo actualizaciones de estado.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-2xl p-8 bg-gray-50">
                  <p className="text-6xl sm:text-7xl font-light text-gray-900 leading-none mb-3">
                    0<span className="text-secondary"> rewrites</span>
                  </p>
                  <p className="text-body text-gray-700">
                    gracias a la arquitectura definida desde el inicio — no
                    pagamos deuda técnica a futuro.
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
                Todo lo que necesitas para construir tu producto
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
                De la arquitectura al despliegue en semanas
              </h2>
            </motion.div>

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
                    <div
                      className="w-36 h-36 rounded-full border-4 border-white shadow-md mb-5 flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}14` }}
                    >
                      <Icon className="w-10 h-10" style={{ color }} />
                    </div>

                    <p className="text-4xl sm:text-5xl font-light text-gray-200 leading-none mb-3 select-none">
                      {num}
                    </p>
                    <h3 className="text-heading-3 text-gray-900 mb-4">
                      {title}
                    </h3>
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
                  ¿Para quién es Software Development?
                </h2>
                <p className="text-body text-white/50">
                  Trabajamos con equipos que necesitan software de calidad,
                  entregado a tiempo y construido para durar.
                </p>
              </motion.div>

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
        ctaTitle="¿Listo para construir tu producto?"
        ctaSubtitle="Conversemos sobre tu proyecto. Sin compromiso, sin presión."
        whatsappMessage={data.whatsappMessage}
      />

      {/* ── S7: CTA ───────────────────────────────────────────────────────── */}
      <CaseContactCTA />
    </>
  );
}
