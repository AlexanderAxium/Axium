"use client";

import {
  Activity,
  ArrowRight,
  BarChart2,
  Bell,
  BookOpen,
  Bot,
  Brain,
  CheckCircle2,
  CheckSquare,
  ClipboardList,
  Code2,
  Cog,
  Database,
  Eye,
  FileText,
  GitBranch,
  Globe,
  Headphones,
  Image,
  Layers,
  Layout,
  LayoutDashboard,
  MessageCircle,
  MessageSquare,
  Monitor,
  Palette,
  Plug,
  RefreshCw,
  Repeat,
  Search,
  Shield,
  Smartphone,
  Star,
  Tablet,
  TrendingUp,
  Users,
  WifiOff,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import NextImage from "next/image";
import Link from "next/link";
import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import { SERVICES, SERVICE_IMAGES } from "~/data/services-data";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity,
  BarChart2,
  Bell,
  BookOpen,
  Bot,
  Brain,
  CheckSquare,
  ClipboardList,
  Cog,
  Code2,
  Database,
  Eye,
  FileText,
  GitBranch,
  Globe,
  Headphones,
  Image,
  Layout,
  LayoutDashboard,
  Layers,
  MessageSquare,
  Monitor,
  Palette,
  Plug,
  RefreshCw,
  Repeat,
  Search,
  Shield,
  Smartphone,
  Star,
  Tablet,
  TrendingUp,
  Users,
  WifiOff,
  Zap,
};

function DynamicIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}

const smoothEase = [0.4, 0, 0.2, 1] as const;

// ─── Marquee tech rows (logo-only) ─────────────────────────────────────────
interface TechLogo {
  name: string;
  src: string;
}

const TECH_ROW_1: TechLogo[] = [
  { name: "React", src: "/images/tech-logos/react.png" },
  { name: "Next.js", src: "/images/tech-logos/nextjs.svg" },
  { name: "TypeScript", src: "/images/tech-logos/typescript.svg" },
  { name: "NestJS", src: "/images/tech-logos/nestjs.svg" },
  { name: "PostgreSQL", src: "/images/tech-logos/postgresql.svg" },
  { name: "Docker", src: "/images/tech-logos/docker.png" },
  { name: "Redis", src: "/images/tech-logos/redis.png" },
  { name: "Python", src: "/images/tech-logos/python.png" },
  { name: "MongoDB", src: "/images/tech-logos/mongodb.png" },
  { name: "MySQL", src: "/images/tech-logos/mysql.png" },
  { name: "Tailwind CSS", src: "/images/tech-logos/tailwind-css.svg" },
  { name: "JavaScript", src: "/images/tech-logos/javascript.png" },
];

const TECH_ROW_2: TechLogo[] = [
  { name: "Kubernetes", src: "/images/tech-logos/kubernetes.png" },
  { name: "Google Cloud", src: "/images/tech-logos/google-cloud.png" },
  { name: "Django", src: "/images/tech-logos/django.png" },
  { name: "Flask", src: "/images/tech-logos/flask.png" },
  { name: "Express.js", src: "/images/tech-logos/express-js.png" },
  { name: "GitHub Actions", src: "/images/tech-logos/github-actions.png" },
  { name: "Grafana", src: "/images/tech-logos/grafana.png" },
  { name: "PHP", src: "/images/tech-logos/php.png" },
  { name: ".NET", src: "/images/tech-logos/dot-net.png" },
  { name: "Angular", src: "/images/tech-logos/angular.png" },
  { name: "Vue.js", src: "/images/tech-logos/vue.png" },
  { name: "Svelte", src: "/images/tech-logos/svelte.png" },
];

export function ServicePageTemplate({ slug }: { slug: string }) {
  const data = SERVICES[slug];
  if (!data) return null;

  const serviceImage = SERVICE_IMAGES[slug] ?? "/service1.png";

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(data.whatsappMessage);
    window.open(`https://wa.me/51991285679?text=${encoded}`, "_blank");
  };

  return (
    <div className="min-h-screen">
      {/* ─── HERO ─── */}
      <section
        className="relative overflow-hidden"
        style={{ background: data.heroGradient }}
      >
        {/* Decorative orbs */}
        <div
          className="pointer-events-none absolute -top-20 right-0 h-[500px] w-[500px] opacity-20 blur-[100px]"
          style={{
            background: "radial-gradient(circle, #0072CF 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-[15%] h-80 w-80 opacity-10 blur-[80px]"
          style={{
            background: "radial-gradient(circle, #7ECFC3 0%, transparent 70%)",
          }}
        />

        <div className="container-section relative z-10 py-24 md:py-28 lg:py-32">
          <div className="content-section">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left: Text content */}
              <div>
                {/* Breadcrumb */}
                <motion.nav
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: smoothEase }}
                  className="mb-8 flex items-center gap-2 text-sm text-white/40"
                >
                  <Link
                    href="/"
                    className="transition-colors hover:text-white/70"
                  >
                    Inicio
                  </Link>
                  <span>/</span>
                  <span className="text-white/60">Servicios</span>
                  <span>/</span>
                  <span className="text-white/80">{data.shortTitle}</span>
                </motion.nav>

                {/* Icon + label */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: smoothEase }}
                  className="mb-6 flex items-center gap-3"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                    <DynamicIcon
                      name={data.heroIcon}
                      className="h-6 w-6 text-[#7ECFC3]"
                    />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#7ECFC3]">
                    Servicio
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.15, ease: smoothEase }}
                  className="mb-5 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
                >
                  {data.title}
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.25, ease: smoothEase }}
                  className="mb-10 max-w-xl text-lg leading-relaxed text-white/65"
                >
                  {data.description}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35, ease: smoothEase }}
                  className="flex flex-wrap gap-4"
                >
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0072CF] to-[#7ECFC3] px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#0072CF]/30"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Consultar ahora
                  </button>
                  <Link
                    href="/portafolio"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-white/15"
                  >
                    Ver proyectos
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </div>

              {/* Right: Service image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
                className="relative hidden lg:block"
              >
                <div className="relative h-[440px] w-full overflow-hidden rounded-2xl border border-white/10">
                  {/* Gradient overlay on image */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-br from-transparent via-transparent to-[#0072CF]/20" />
                  <NextImage
                    src={serviceImage}
                    alt={data.title}
                    fill
                    className="object-cover"
                    sizes="50vw"
                    priority
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 z-20 flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#0072CF] to-[#7ECFC3]">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      Entrega garantizada
                    </p>
                    <p className="text-xs text-white/50">
                      Sprints de 2 semanas
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BENEFITS STRIP ─── */}
      <section className="bg-white pt-6 pb-16">
        <div className="container-section">
          <div className="content-section">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {data.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-5 py-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0072CF]" />
                  <span className="text-sm font-medium text-gray-700">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section className="bg-gray-50 py-20">
        <div className="container-section">
          <div className="content-section">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="mb-14 text-center"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0072CF]">
                Lo que incluye
              </span>
              <h2 className="mt-3 mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                {data.featuresTitle}
              </h2>
              <p className="mx-auto max-w-xl text-gray-500">
                {data.featuresSubtitle}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.features.map((feature, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-[#0072CF]/20 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0072CF]/10 to-[#7ECFC3]/10 transition-all duration-300 group-hover:from-[#0072CF]/20 group-hover:to-[#7ECFC3]/20">
                    <DynamicIcon
                      name={feature.icon}
                      className="h-5 w-5 text-[#0072CF]"
                    />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="bg-white py-20">
        <div className="container-section">
          <div className="content-section">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="mb-14 text-center"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0072CF]">
                Proceso
              </span>
              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Cómo lo hacemos
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {data.process.map((step, i) => (
                <div key={i} className="relative">
                  {/* Connector */}
                  {i < data.process.length - 1 && (
                    <div className="absolute top-5 left-10 hidden h-px w-[calc(100%-2.5rem+2rem)] bg-gradient-to-r from-[#0072CF]/30 to-transparent lg:block" />
                  )}
                  <div className="flex flex-col">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#060C20] to-[#0072CF] text-sm font-bold text-white">
                      {String(step.step).padStart(2, "0")}
                    </div>
                    <h3 className="mb-2 font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TECHNOLOGIES ─── */}
      <section className="overflow-hidden bg-white py-20">
        {/* Header */}
        <div className="container-section mb-12">
          <div className="content-section text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: smoothEase }}
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0072CF]">
                Stack Tecnológico
              </span>
              <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                Herramientas que usamos
              </h2>
            </motion.div>
          </div>
        </div>

        {/* Marquee rows */}
        <div className="relative space-y-4">
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-56 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-56 bg-gradient-to-l from-white to-transparent" />

          {/* Row 1 — right → */}
          <div className="overflow-hidden py-1">
            <motion.div
              className="flex w-max gap-4"
              animate={{ x: ["-25%", "0%"] }}
              transition={{
                duration: 55,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              {[...TECH_ROW_1, ...TECH_ROW_1, ...TECH_ROW_1, ...TECH_ROW_1].map(
                (tech, i) => (
                  <div
                    key={i}
                    className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white p-3"
                    title={tech.name}
                  >
                    <NextImage
                      src={tech.src}
                      alt={tech.name}
                      width={36}
                      height={36}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )
              )}
            </motion.div>
          </div>

          {/* Row 2 — left ← */}
          <div className="overflow-hidden py-1">
            <motion.div
              className="flex w-max gap-4"
              animate={{ x: ["0%", "-25%"] }}
              transition={{
                duration: 45,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              {[...TECH_ROW_2, ...TECH_ROW_2, ...TECH_ROW_2, ...TECH_ROW_2].map(
                (tech, i) => (
                  <div
                    key={i}
                    className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-50 p-3"
                    title={tech.name}
                  >
                    <NextImage
                      src={tech.src}
                      alt={tech.name}
                      width={36}
                      height={36}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <CaseContactCTA />
    </div>
  );
}
