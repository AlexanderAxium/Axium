"use client";

import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselProgress,
  useCarousel,
} from "~/components/ui/carousel";
import { useCasesWithLocale } from "~/lib/case-translations";

/**
 * Ficha de caso con la narrativa de Brand Vision (brandvm.com/case-studies):
 * hero-tarjeta con el mundo del producto → la frase de lo que se logró → lo que
 * construimos → reto / enfoque / resultados (cortos y plegables) → galería de
 * piezas terminadas (2:1 y pares 1:1, mismo radio) → más proyectos en carrusel.
 *
 * El marco es de Axium y no cambia entre casos (blanco, acento azul, GuarujaTitle
 * + Gilroy); la personalidad de cada producto vive en la tarjeta hero y en las
 * imágenes. Ver .claude/skills/portafolio-axium/referencias/brandvm.md.
 *
 * Móvil: mismo gutter que el resto de la página (container-section), meta como
 * tabla de dos columnas, piezas anchas a 4:3 y pares apilados para que la UI se lea.
 */

const ACCENT = "#0072CF";
/** El azul de marca no llega a 4.5:1 sobre la tinta; en fondos oscuros va este. */
const ACCENT_DARK = "#4BA3F5";
const INK = "#060C20";
const HEADING = { fontFamily: "var(--font-family-heading)" } as const;
const ease = [0.4, 0, 0.2, 1] as const;
/** Líneas visibles de un texto plegado. */
const LINEAS = 6;
/** Viñetas visibles de una lista plegada. */
const VINETAS = 4;

export type StoryImage = {
  src: string;
  alt: string;
  /** Encuadre de la pieza ancha en móvil, donde pasa de 2:1 a 4:3 (object-position). */
  mobilePosition?: string;
  /** Pieza propia para móvil cuando recortar no alcanza (p. ej. una ventana de navegador). */
  mobileSrc?: string;
};

export type StoryBlock =
  | { kind: "wide"; image: StoryImage }
  | { kind: "pair"; images: [StoryImage, StoryImage] }
  | {
      kind: "highlights";
      title: [string, string];
      items: { lead: string; text: string }[];
    }
  | {
      kind: "text";
      id?: string;
      title: string;
      body: string;
      bullets?: string[];
    };

export type StoryLang = "es" | "en" | "pt";

export type StoryLabels = {
  home: string;
  cases: string;
  seeResult: string;
  live: string;
  discoverLive: string;
  readMore: string;
  readLess: string;
  seeAll: string;
  seeLess: string;
  upNext: string;
  nextBadge: string;
  moreProjects: [string, string];
  allCases: string;
  projects: string;
  viewCase: string;
  prevSlide: string;
  nextSlide: string;
};

export const STORY_LABELS: Record<StoryLang, StoryLabels> = {
  es: {
    home: "Inicio",
    cases: "Casos de éxito",
    seeResult: "Ver el resultado",
    live: "Sitio en vivo",
    discoverLive: "Visitar el sitio en vivo",
    readMore: "Leer más",
    readLess: "Leer menos",
    seeAll: "Ver todo",
    seeLess: "Ver menos",
    upNext: "A continuación",
    nextBadge: "Siguiente",
    moreProjects: ["Más", "proyectos"],
    allCases: "Todos los casos",
    projects: "proyectos",
    viewCase: "Ver caso",
    prevSlide: "Anterior",
    nextSlide: "Siguiente",
  },
  en: {
    home: "Home",
    cases: "Case studies",
    seeResult: "See the result",
    live: "Live site",
    discoverLive: "Visit the live site",
    readMore: "Read more",
    readLess: "Read less",
    seeAll: "See all",
    seeLess: "See less",
    upNext: "Up next",
    nextBadge: "Next",
    moreProjects: ["More", "projects"],
    allCases: "All case studies",
    projects: "projects",
    viewCase: "View case",
    prevSlide: "Previous",
    nextSlide: "Next",
  },
  pt: {
    home: "Início",
    cases: "Casos de sucesso",
    seeResult: "Ver o resultado",
    live: "Site ao vivo",
    discoverLive: "Visitar o site ao vivo",
    readMore: "Ler mais",
    readLess: "Ler menos",
    seeAll: "Ver tudo",
    seeLess: "Ver menos",
    upNext: "A seguir",
    nextBadge: "Próximo",
    moreProjects: ["Mais", "projetos"],
    allCases: "Todos os casos",
    projects: "projetos",
    viewCase: "Ver caso",
    prevSlide: "Anterior",
    nextSlide: "Próximo",
  },
};

export type CaseStoryProps = {
  name: string;
  tagline: string;
  heroImage: string;
  /** object-position de la foto del hero; en móvil la tarjeta es vertical y recorta mucho. */
  heroPosition?: string;
  logo: { src: string; width: number; height: number };
  liveUrl: string;
  meta: [string, string][];
  statement: string;
  context: string;
  blocks: StoryBlock[];
  resultId?: string;
  next: { name: string; tagline: string; href: string; image: string };
  /** Slugs que no deben aparecer en el carrusel de más proyectos. */
  hideCases?: string[];
  labels: StoryLabels;
};

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Título de sección: palabra de arranque en Gilroy + palabra acentuada en GuarujaTitle azul. */
function Titulo({
  lead,
  accent,
  dark = false,
}: {
  lead?: string;
  accent: string;
  dark?: boolean;
}) {
  return (
    <h2
      className="text-[34px] leading-[1.05] tracking-tight sm:text-[56px] sm:leading-[1.02] lg:text-[68px]"
      style={{ color: dark ? "#FFFFFF" : INK }}
    >
      {lead ? <span className="font-medium">{lead} </span> : null}
      <span style={{ ...HEADING, color: dark ? ACCENT_DARK : ACCENT }}>
        {accent}
      </span>
    </h2>
  );
}

/**
 * Plegado exacto: un párrafo se corta en LINEAS líneas enteras y una lista en
 * VINETAS viñetas completas (nunca media línea). Solo aparece si de verdad sobra.
 */
function Plegable({
  children,
  labels,
  lista = 0,
}: {
  children: ReactNode;
  labels: StoryLabels;
  /** Total de viñetas si el contenido es una lista. */
  lista?: number;
}) {
  const [abierto, setAbierto] = useState(false);
  const [alturas, setAlturas] = useState<{
    cerrado: number;
    total: number;
  } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => {
      const total = el.scrollHeight;
      let cerrado = total;
      if (lista > VINETAS) {
        const li = el.querySelectorAll("li")[VINETAS - 1];
        if (li) cerrado = li.offsetTop + li.offsetHeight;
      } else if (!lista) {
        const p = el.querySelector("p");
        if (p) {
          const lh = Number.parseFloat(getComputedStyle(p).lineHeight);
          const tope = Math.round(lh * LINEAS);
          if (total > tope + lh / 2) cerrado = tope;
        }
      }
      setAlturas({ cerrado, total });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el.firstElementChild ?? el);
    return () => ro.disconnect();
  }, [lista]);

  const sobra = alturas !== null && alturas.total > alturas.cerrado + 2;
  const texto = abierto
    ? lista
      ? labels.seeLess
      : labels.readLess
    : lista
      ? `${labels.seeAll} (${lista})`
      : labels.readMore;

  return (
    <div>
      <div
        ref={ref}
        className="relative overflow-hidden transition-[max-height] duration-500 ease-out"
        style={
          sobra
            ? { maxHeight: abierto ? alturas.total : alturas.cerrado }
            : undefined
        }
      >
        {children}
        {sobra && !abierto && !lista ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent"
          />
        ) : null}
      </div>
      {sobra ? (
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          className="mt-2 inline-flex h-11 items-center gap-1.5 text-sm font-semibold"
          style={{ color: ACCENT }}
        >
          {texto}
          <ChevronDown
            className={`size-4 transition-transform ${abierto ? "rotate-180" : ""}`}
          />
        </button>
      ) : null}
    </div>
  );
}

function Pieza({
  image,
  className,
  sizes,
}: {
  image: StoryImage;
  className: string;
  sizes: string;
}) {
  return (
    <figure
      className={`relative overflow-hidden rounded-[16px] bg-[#F3F4F6] md:rounded-[18px] ${className}`}
    >
      {image.mobileSrc ? (
        <>
          <Image
            src={image.mobileSrc}
            alt={image.alt}
            fill
            sizes="100vw"
            className="object-cover sm:hidden"
          />
          <Image
            src={image.src}
            alt=""
            aria-hidden
            fill
            sizes={sizes}
            className="hidden object-cover sm:block"
          />
        </>
      ) : (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className="object-cover"
          style={
            image.mobilePosition
              ? { objectPosition: image.mobilePosition }
              : undefined
          }
        />
      )}
    </figure>
  );
}

type Tarjeta = {
  href: string;
  image: string;
  name: string;
  kicker: string;
  text: string;
  next?: boolean;
};

/** Flechas de «Más proyectos», con el estado de Embla que expone el Carousel de shadcn. */
function FlechasCarrusel({
  labels,
  className,
}: {
  labels: StoryLabels;
  className: string;
}) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel();
  const boton =
    "grid size-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 disabled:opacity-35 disabled:hover:bg-transparent";
  return (
    <div className={`items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label={labels.prevSlide}
        className={boton}
      >
        <ArrowLeft className="size-4" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label={labels.nextSlide}
        className={boton}
      >
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}

/** Tarjetas que dejan asomar la siguiente en cada ancho; el hueco va en el padding, como pide shadcn. */
const ANCHO_TARJETA =
  "basis-[88%] pl-4 sm:basis-[62%] sm:pl-5 md:basis-[47%] lg:basis-[38%] lg:pl-7 xl:basis-[31.5%] xl:pl-8";

/**
 * Más proyectos: el Carousel de shadcn (Embla) con las opciones de los carruseles de
 * las tiendas de ANJ y Sportt. Alexander, 2026-09-14: «Más proyectos tiene pésima UX,
 * usa carrusel de shadcn… fíjate los carruseles que usamos en aurore o sportt o anj,
 * que son más smooth».
 * - dragFree + trimSnaps (ANJ): se desliza con inercia y se queda donde lo sueltas, sin
 *   saltar tarjeta por tarjeta.
 * - Barra de «cuánto has visto» (Sportt/Aurore) y flechas: en el encabezado desde sm,
 *   junto a la barra en el celular.
 * - Rueda y trackpad: el plugin solo toma el desplazamiento horizontal; la rueda vertical
 *   sigue moviendo la página. En táctil, pan-y deja el vertical al navegador.
 */
function MasProyectos({
  next,
  hide,
  labels,
}: {
  next: CaseStoryProps["next"];
  hide: string[];
  labels: StoryLabels;
}) {
  const casos = useCasesWithLocale();
  const pathname = usePathname();
  const plugins = useMemo(() => [WheelGesturesPlugin()], []);

  const actual = pathname?.split("/").filter(Boolean).pop() ?? "";
  const nextSlug = next.href.split("/").filter(Boolean).pop() ?? "";
  const ocultos = new Set([actual, nextSlug, ...hide]);
  const tarjetas: Tarjeta[] = [
    {
      href: next.href,
      image: next.image,
      name: next.name,
      kicker: casos.find((c) => c.slug === nextSlug)?.industry ?? "",
      text: next.tagline,
      next: true,
    },
    ...casos
      .filter((c) => c.slug && !ocultos.has(c.slug))
      .slice(0, 10)
      .map((c) => ({
        href: `/casos-de-exito/${c.slug}`,
        image: c.image,
        name: c.title,
        kicker: c.industry,
        text: c.description,
      })),
  ];

  return (
    <section
      data-nav-theme="dark"
      className="overflow-hidden bg-[#060C20] py-20 text-white md:py-28 lg:py-32"
    >
      <Carousel
        opts={{ align: "start", dragFree: true, containScroll: "trimSnaps" }}
        plugins={plugins}
      >
        <div className="container-section">
          <div className="content-section">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-5">
              <Reveal>
                <p className="text-overline" style={{ color: ACCENT_DARK }}>
                  {labels.upNext}
                </p>
                <div className="mt-3">
                  <Titulo
                    lead={labels.moreProjects[0]}
                    accent={labels.moreProjects[1]}
                    dark
                  />
                </div>
              </Reveal>
              <div className="flex items-center gap-3">
                <Link
                  href="/portafolio"
                  className="inline-flex h-11 items-center rounded-full border border-white/20 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  {labels.allCases}
                </Link>
                <FlechasCarrusel labels={labels} className="hidden sm:flex" />
              </div>
            </div>

            {/* Alineado al contenido por la izquierda y sangrando hasta el borde derecho de la pantalla */}
            <div
              className="mt-10 md:mt-14"
              style={{ marginRight: "calc((100% - 100vw) / 2)" }}
            >
              <CarouselContent className="-ml-4 cursor-grab touch-pan-y touch-pinch-zoom select-none active:cursor-grabbing sm:-ml-5 lg:-ml-7 xl:-ml-8">
                {tarjetas.map((t) => (
                  <CarouselItem key={t.href} className={ANCHO_TARJETA}>
                    <Link
                      href={t.href}
                      draggable={false}
                      className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-white/[0.04] ring-1 ring-white/10 transition-colors hover:bg-white/[0.07]"
                    >
                      {/* 16:10 = el formato de las portadas: sin recortar su logo */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
                        <Image
                          src={t.image}
                          alt={t.name}
                          fill
                          sizes="(min-width: 1280px) 34vw, (min-width: 1024px) 40vw, (min-width: 640px) 62vw, 92vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          draggable={false}
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-6 md:p-8">
                        {/* La etiqueta "Siguiente" va en el texto, nunca encima de la portada */}
                        <div className="flex min-h-7 items-center justify-between gap-3">
                          <p className="text-overline truncate text-white/50">
                            {t.kicker}
                          </p>
                          {t.next ? (
                            <span
                              className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-white"
                              style={{ backgroundColor: ACCENT }}
                            >
                              {labels.nextBadge}
                            </span>
                          ) : null}
                        </div>
                        <h3
                          className="mt-3 text-[28px] leading-[1.05] md:text-[30px]"
                          style={HEADING}
                        >
                          {t.name}
                        </h3>
                        <p className="text-body mt-3 line-clamp-2 text-white/65">
                          {t.text}
                        </p>
                        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-white md:pt-8">
                          {labels.viewCase}
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
                <CarouselItem className={ANCHO_TARJETA}>
                  <Link
                    href="/portafolio"
                    draggable={false}
                    className="group flex h-full min-h-[360px] flex-col justify-between rounded-[22px] p-7 text-white md:p-8"
                    style={{
                      background: `linear-gradient(150deg, ${ACCENT} 0%, #003A6E 100%)`,
                    }}
                  >
                    <p className="text-overline text-white/70">
                      {labels.cases}
                    </p>
                    <div>
                      <p
                        className="text-[36px] leading-[1.02] md:text-[42px]"
                        style={HEADING}
                      >
                        {labels.allCases}
                      </p>
                      <p className="text-body mt-2 text-white/75">
                        {casos.length} {labels.projects}
                      </p>
                      <span className="mt-6 grid size-12 place-items-center rounded-full bg-white text-[#060C20] transition-transform group-hover:translate-x-1">
                        <ArrowRight className="size-5" />
                      </span>
                    </div>
                  </Link>
                </CarouselItem>
                {/* Aire al final: la última tarjeta no queda pegada al borde de la pantalla */}
                <div
                  aria-hidden="true"
                  className="shrink-0 grow-0 basis-4 sm:basis-6 lg:basis-8 xl:basis-16"
                />
              </CarouselContent>
            </div>

            <div className="mt-8 flex items-center gap-4 md:mt-12">
              <CarouselProgress
                className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/15"
                barClassName="rounded-full bg-white"
              />
              <FlechasCarrusel labels={labels} className="flex sm:hidden" />
            </div>
          </div>
        </div>
      </Carousel>
    </section>
  );
}

export function CaseStory({
  name,
  tagline,
  heroImage,
  heroPosition,
  logo,
  liveUrl,
  meta,
  statement,
  context,
  blocks,
  resultId = "resultado",
  next,
  hideCases = [],
  labels,
}: CaseStoryProps) {
  const esPieza = (b?: StoryBlock) => b?.kind === "wide" || b?.kind === "pair";
  /** Ritmo vertical: piezas pegadas entre sí (12/16px), todo lo demás respira igual. */
  const espacio = (i: number) => {
    if (i === 0) return "";
    return esPieza(blocks[i - 1]) && esPieza(blocks[i])
      ? "mt-3 md:mt-4"
      : "mt-14 md:mt-24";
  };

  return (
    <div data-nav-theme="light" className="bg-white" style={{ color: INK }}>
      {/*
        Hero a sangre (ancho completo y oscuro, pedido de Alexander): el mundo del
        producto con velo, su logo enorme y la meta abajo. Empieza detrás del navbar,
        que toma el tono oscuro de la sección; el texto se alinea al contenido.
      */}
      <section
        data-nav-theme="dark"
        className="relative isolate overflow-hidden bg-[#0B1020] text-white"
      >
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: heroPosition ?? "center" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[#060C20]/35 sm:bg-[#060C20]/55"
        />
        {/* Móvil: oscuro arriba (navbar y texto) y abajo (meta); la foto respira en el medio */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[#060C20]/85 via-[#060C20]/10 to-[#060C20]/90 sm:hidden"
        />
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-gradient-to-r from-[#060C20]/85 via-[#060C20]/35 to-transparent sm:block"
        />
        {/* Desktop: sombra bajo el navbar y bajo la meta */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 hidden h-40 bg-gradient-to-b from-[#060C20]/70 to-transparent sm:block"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 hidden h-72 bg-gradient-to-t from-[#060C20]/85 to-transparent sm:block"
        />
        <Image
          src={logo.src}
          alt=""
          aria-hidden
          width={logo.width}
          height={logo.height}
          className="pointer-events-none absolute top-1/2 left-1/2 hidden w-[56%] max-w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-[0.1] brightness-0 invert sm:block"
        />

        <div className="container-section relative">
          <div className="content-section flex flex-col pt-28 pb-6 sm:min-h-[760px] sm:justify-between sm:pt-36 sm:pb-12 md:min-h-[860px] lg:pb-16">
            <Reveal>
              <nav
                aria-label="breadcrumb"
                className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/80"
              >
                <Link href="/" className="hover:text-white">
                  {labels.home}
                </Link>
                <ChevronRight className="size-3.5 opacity-60" />
                <Link href="/portafolio" className="hover:text-white">
                  {labels.cases}
                </Link>
                <ChevronRight className="size-3.5 opacity-60" />
                <span className="text-white/55">{name}</span>
              </nav>
              <h1
                className="mt-5 text-[length:clamp(2.75rem,15vw,4rem)] leading-[0.95] sm:mt-6 sm:text-[96px] lg:text-[120px]"
                style={HEADING}
              >
                {name}
              </h1>
              <p className="text-body-lg mt-3 max-w-md text-white/85 sm:mt-4">
                {tagline}
              </p>
              <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
                <a
                  href={`#${resultId}`}
                  className="inline-flex h-12 flex-auto items-center justify-center rounded-full px-5 text-sm font-semibold whitespace-nowrap text-white transition-transform hover:scale-[1.02] sm:flex-none sm:px-6"
                  style={{ backgroundColor: ACCENT }}
                >
                  {labels.seeResult}
                </a>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 flex-auto items-center justify-center gap-1.5 rounded-full border border-white/30 px-5 text-sm font-semibold whitespace-nowrap text-white hover:bg-white/10 sm:flex-none sm:px-6"
                >
                  {labels.live} <ArrowUpRight className="size-4" />
                </a>
              </div>
            </Reveal>

            <dl className="mt-28 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6 sm:border-t sm:border-white/15 sm:pt-8 lg:grid-cols-4">
              {meta.map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[7rem_1fr] items-baseline gap-4 border-t border-white/15 py-3.5 sm:block sm:border-0 sm:py-0"
                >
                  <dt className="text-overline text-white/55">{k}</dt>
                  <dd className="text-body text-white sm:mt-1">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* La frase: qué logró el proyecto, y el contexto */}
      <section className="container-section pt-16 pb-14 md:pt-28 md:pb-24">
        <Reveal className="content-section max-w-4xl sm:text-center">
          <p className="text-[24px] leading-[1.3] tracking-tight sm:text-[34px] sm:leading-[1.25]">
            {statement}
          </p>
          <p className="text-body mt-5 max-w-2xl text-[#4A5263] sm:mx-auto sm:mt-6">
            {context}
          </p>
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex h-11 items-center gap-1.5 rounded-full border border-[#D9DDE3] px-5 text-sm font-medium hover:bg-[#F3F4F6] sm:mt-8"
          >
            {labels.discoverLive} <ArrowUpRight className="size-4" />
          </a>
        </Reveal>
      </section>

      {/* Relato + galería */}
      <div className="container-section pb-16 md:pb-24">
        <div className="content-section">
          {blocks.map((block, i) => {
            const key = `${block.kind}-${i}`;
            if (block.kind === "wide") {
              return (
                <Reveal key={key} className={espacio(i)}>
                  <Pieza
                    image={block.image}
                    className="aspect-[4/3] sm:aspect-[2/1]"
                    sizes="(min-width: 1536px) 1536px, 100vw"
                  />
                </Reveal>
              );
            }
            if (block.kind === "pair") {
              return (
                <div
                  key={key}
                  className={`grid gap-3 sm:grid-cols-2 md:gap-4 ${espacio(i)}`}
                >
                  {block.images.map((image, j) => (
                    <Reveal key={image.src} delay={j * 0.08}>
                      <Pieza
                        image={image}
                        className="aspect-square"
                        sizes="(min-width: 1536px) 768px, (min-width: 640px) 50vw, 100vw"
                      />
                    </Reveal>
                  ))}
                </div>
              );
            }
            if (block.kind === "highlights") {
              return (
                <section key={key} className={espacio(i)}>
                  <Reveal>
                    <Titulo lead={block.title[0]} accent={block.title[1]} />
                  </Reveal>
                  <div className="mt-6 max-w-3xl md:mt-8">
                    <Plegable labels={labels} lista={block.items.length}>
                      <ul className="space-y-4 md:space-y-3">
                        {block.items.map((item) => (
                          <li key={item.lead} className="text-body flex gap-3">
                            <span
                              aria-hidden
                              className="mt-[0.65em] size-1.5 shrink-0 rounded-full"
                              style={{ backgroundColor: INK }}
                            />
                            <span className="text-[#4A5263]">
                              <strong className="font-semibold text-[#060C20]">
                                {item.lead}:
                              </strong>{" "}
                              {item.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </Plegable>
                  </div>
                </section>
              );
            }
            return (
              <section
                key={key}
                id={block.id}
                className={`scroll-mt-24 md:scroll-mt-28 ${espacio(i)}`}
              >
                <Reveal>
                  <Titulo accent={block.title} />
                </Reveal>
                <div className="mt-5 max-w-3xl md:mt-8">
                  <Plegable labels={labels}>
                    <p className="text-body text-[#4A5263]">{block.body}</p>
                  </Plegable>
                  {block.bullets ? (
                    <ul className="mt-6 space-y-3">
                      {block.bullets.map((b) => (
                        <li key={b} className="text-body flex gap-3">
                          <span
                            aria-hidden
                            className="mt-[0.65em] size-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: ACCENT }}
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <MasProyectos next={next} hide={hideCases} labels={labels} />
    </div>
  );
}
