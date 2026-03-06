"use client";

import {
  Activity,
  Bot,
  Code2,
  Database,
  FileText,
  type LucideIcon,
  RefreshCw,
  Rocket,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import { ServiceFaqSection } from "~/components/axium/service-faq-section";
import { ServiceHero } from "~/components/axium/service-hero";
import { smoothEase } from "~/components/axium/service-shared";
import { SERVICES, type ServicePageData } from "~/data/services-data";

const raw = SERVICES["ai-agentic-systems"];
if (!raw) throw new Error("Missing service data for ai-agentic-systems");
const data: ServicePageData = raw;
const ACCENT = "#7ECFC3";
const BLUE = "#0072CF";

// ── Section 3: service rows ──────────────────────────────────────────────────
const SERVICE_ROWS = [
  {
    tag: "Documentos",
    icon: FileText,
    title: "Procesamiento de documentos",
    description:
      "Extrae, clasifica y estructura información de contratos, facturas y reportes sin intervención manual.",
  },
  {
    tag: "Atención",
    icon: Bot,
    title: "Agentes de atención al cliente",
    description:
      "Chatbots contextuales que resuelven consultas, escalan casos complejos y aprenden de cada interacción.",
  },
  {
    tag: "Búsqueda",
    icon: Search,
    title: "Búsqueda semántica (RAG)",
    description:
      "Recuperación aumentada sobre tus propios datos. Encuentra respuestas precisas en miles de documentos en segundos.",
  },
  {
    tag: "Flujos",
    icon: Activity,
    title: "Automatización de flujos",
    description:
      "Orquesta procesos de negocio completos: aprobaciones, notificaciones y decisiones sin fricción humana.",
  },
  {
    tag: "Datos",
    icon: Database,
    title: "Análisis en lenguaje natural",
    description:
      "Permite a tu equipo consultar bases de datos y dashboards usando lenguaje natural, sin SQL.",
  },
  {
    tag: "Pipelines",
    icon: RefreshCw,
    title: "Inteligencia continua",
    description:
      "Sistemas que monitorean, aprenden y actúan de forma autónoma sobre flujos de datos en tiempo real.",
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
    title: "Definición",
    bullets: [
      "Mapeo de oportunidades",
      "Análisis de viabilidad",
      "Definición de KPIs",
      "Casos priorizados",
    ],
    icon: Search,
    color: ACCENT,
  },
  {
    num: "02",
    title: "Arquitectura",
    bullets: [
      "Auditoría de datos",
      "Diseño de arquitectura",
      "Selección de modelos",
      "Infraestructura vectorial",
    ],
    icon: Database,
    color: BLUE,
  },
  {
    num: "03",
    title: "Construcción",
    bullets: [
      "Prototipado rápido",
      "Desarrollo de agentes",
      "Integración con sistemas",
      "Pipelines LLM",
    ],
    icon: Code2,
    color: ACCENT,
  },
  {
    num: "04",
    title: "Deploy",
    bullets: [
      "Deploy en producción",
      "Monitoreo de calidad",
      "Feedback loops",
      "Optimización continua",
    ],
    icon: Rocket,
    color: BLUE,
  },
];

// ── Section 5: "¿Para quién es?" ─────────────────────────────────────────────
const FOR_WHO = [
  {
    title: "Empresas con datos sin explotar",
    description:
      "Organizaciones con grandes volúmenes de documentos, emails o registros que no pueden procesar manualmente.",
  },
  {
    title: "Equipos con tareas repetitivas",
    description:
      "Equipos que pierden horas en procesos manuales que podrían automatizarse con IA.",
  },
  {
    title: "Startups que buscan diferenciarse",
    description:
      "Empresas que quieren integrar IA en su producto principal para ganar ventaja competitiva.",
  },
  {
    title: "Empresas en transformación digital",
    description:
      "Organizaciones que buscan modernizar sus operaciones con sistemas inteligentes y autónomos.",
  },
];

// ── Section 6: capacidades técnicas ──────────────────────────────────────────
const CAPABILITIES = [
  {
    title: "Ingeniería de LLMs",
    description:
      "Prompts, fine-tuning y evaluación de modelos para casos de uso específicos de negocio.",
  },
  {
    title: "Sistemas RAG",
    description:
      "Recuperación aumentada con tus propios datos. Respuestas precisas y auditables.",
  },
  {
    title: "Orquestación multi-agente",
    description:
      "Flujos de agentes autónomos que colaboran para completar tareas complejas.",
  },
  {
    title: "Integración con APIs externas",
    description:
      "Conexión con tus herramientas existentes: CRM, ERP, bases de datos y más.",
  },
  {
    title: "Evaluación y testing de IA",
    description:
      "Frameworks de evaluación para medir precisión, consistencia y seguridad del sistema.",
  },
  {
    title: "MLOps y monitoreo",
    description:
      "Infraestructura para operar modelos en producción con observabilidad completa.",
  },
];

// ── Section 7: FAQ ───────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "¿Cuánto tiempo tarda en implementarse un sistema de IA?",
    a: "Un prototipo funcional puede estar listo en 2-4 semanas. Un sistema en producción con integraciones completas toma entre 6 y 12 semanas. Siempre arrancamos con un sprint de definición para identificar el caso de uso de mayor impacto.",
  },
  {
    q: "¿Necesito tener datos propios para empezar?",
    a: "No necesariamente. Muchos proyectos usan modelos base (GPT-4, Claude, Gemini) sin necesidad de datos propios para entrenamiento. Si tienes datos, podemos usarlos para personalizar y mejorar la precisión del sistema.",
  },
  {
    q: "¿Qué modelos de IA utilizan?",
    a: "Trabajamos con los mejores modelos según el caso: GPT-4, Claude, Gemini para tareas de razonamiento complejo; modelos open-source como Llama para mayor privacidad; y modelos especializados para tareas específicas.",
  },
  {
    q: "¿Cómo garantizan la precisión del sistema?",
    a: "Implementamos frameworks de evaluación desde el inicio: métricas de precisión, recall y coherencia. Cada sistema tiene feedback loops para mejorar continuamente. Monitoreamos en producción y detectamos degradaciones automáticamente.",
  },
  {
    q: "¿Los datos de mi empresa están seguros?",
    a: "Sí. Podemos desplegar sistemas 100% en tu infraestructura o en nubes privadas. Nunca compartimos tus datos con terceros. Los contratos incluyen cláusulas de confidencialidad y protección de datos.",
  },
  {
    q: "¿Pueden integrarse con nuestros sistemas actuales?",
    a: "Sí, es nuestra especialidad. Integramos con cualquier sistema que tenga una API: CRMs, ERPs, bases de datos, Slack, email y sistemas propietarios. La IA se convierte en una capa inteligente sobre tus herramientas existentes.",
  },
];

export function AiAgenticSystemsPage() {
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
                  <div
                    className="w-7 h-0.5 rounded-full"
                    style={{ background: ACCENT }}
                  />
                  <span className="text-overline text-gray-500">
                    01 — Qué son los AI & Agentic Systems
                  </span>
                </div>
                <h2 className="text-heading-1 text-gray-900 mb-6">
                  IA que trabaja para tu negocio, no solo que impresiona en
                  demos
                </h2>
                <p className="text-body text-gray-500 mb-4">
                  No construimos prototipos de IA que nunca llegan a producción.
                  Diseñamos e implementamos sistemas autónomos que resuelven
                  problemas reales — reducen costos, aceleran procesos y generan
                  valor medible.
                </p>
                <p className="text-body text-gray-500 mb-4">
                  En Axium combinamos LLMs, RAG y orquestación de agentes para
                  crear soluciones que se integran con tus sistemas existentes y
                  mejoran con el tiempo.
                </p>
                <p className="text-body text-gray-500">
                  Desde chatbots inteligentes hasta pipelines de procesamiento
                  autónomo — construimos la capa de inteligencia que transforma
                  cómo opera tu empresa.
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
                    10<span style={{ color: ACCENT }}>×</span>
                  </p>
                  <p className="text-body text-gray-700">
                    más rápido que los procesos manuales — sistemas de IA que
                    procesan en segundos lo que toma horas.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-2xl p-8 bg-gray-50">
                  <p className="text-6xl sm:text-7xl font-light text-gray-900 leading-none mb-3">
                    100<span style={{ color: ACCENT }}>%</span>
                  </p>
                  <p className="text-body text-gray-700">
                    anclado en resultados de negocio — ningún proyecto sin KPIs
                    claros definidos desde el inicio.
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
                <div
                  className="w-7 h-0.5 rounded-full"
                  style={{ background: ACCENT }}
                />
                <span className="text-overline text-gray-500">
                  02 — Qué automatizamos
                </span>
              </div>
              <h2 className="text-heading-1 text-gray-900 max-w-xl">
                Casos de uso de IA con impacto real
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
                    <span
                      className="inline-flex items-center gap-1.5 text-overline self-start"
                      style={{ color: ACCENT }}
                    >
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
                <div
                  className="w-7 h-0.5 rounded-full"
                  style={{ background: ACCENT }}
                />
                <span className="text-overline text-gray-500">
                  03 — Proceso
                </span>
              </div>
              <h2 className="text-heading-1 text-gray-900 max-w-xl">
                De la definición del problema al deploy en semanas
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
                  <div
                    className="w-7 h-0.5 rounded-full"
                    style={{ background: ACCENT }}
                  />
                  <span className="text-overline text-white/40">
                    04 — Ideal para
                  </span>
                </div>
                <h2 className="text-heading-1 text-white mb-6">
                  ¿Para quién son los AI & Agentic Systems?
                </h2>
                <p className="text-body text-white/50">
                  Trabajamos con organizaciones que tienen problemas reales que
                  resolver — no con quienes buscan IA por moda.
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

      {/* ── S6: Capacidades técnicas ───────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
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
                <div
                  className="w-7 h-0.5 rounded-full"
                  style={{ background: ACCENT }}
                />
                <span className="text-overline text-gray-500">
                  05 — Capacidades técnicas
                </span>
              </div>
              <h2 className="text-heading-1 text-gray-900 max-w-xl">
                Lo que podemos construir
              </h2>
            </motion.div>

            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {CAPABILITIES.map(({ title, description }, i) => (
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
                  className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-2 md:gap-8 py-5 md:py-6"
                >
                  <p className="text-body font-medium text-gray-900 self-start">
                    {title}
                  </p>
                  <p className="text-body-sm text-gray-500 leading-relaxed">
                    {description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── S7: FAQ ───────────────────────────────────────────────────────── */}
      <ServiceFaqSection
        faqs={FAQS}
        accentColor={ACCENT}
        sectionLabel={<>— 06 &nbsp; Preguntas frecuentes</>}
        ctaTitle="¿Listo para implementar IA?"
        ctaSubtitle="Conversemos sobre tu caso de uso. Sin compromiso, sin presión."
        whatsappMessage={data.whatsappMessage}
        bg="bg-gray-50"
      />

      {/* ── S8: CTA ───────────────────────────────────────────────────────── */}
      <CaseContactCTA />
    </>
  );
}
