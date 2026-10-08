"use client";

import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
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

/**
 * Ficha de producto al modelo Pixelmatters (pixelmatters.com/work/amigo), elegido por
 * Alexander el 2026-10-06 para Rematch: «intenta hacer uno así».
 *
 * Lo que la hace distinta de CaseStory (brandvm), medido en la referencia:
 *  · Lienzo OSCURO de punta a punta y texto blanco; el color de la marca vive solo
 *    dentro de las piezas (en Amigo, el morado jamás toca la tipografía).
 *  · El título va en una línea con el logotipo del cliente a la derecha, y debajo una
 *    FOTO A SANGRE con el producto en la mano. La misma foto es la portada del índice.
 *  · Fila de meta en cuatro columnas: tipología en píldoras, industria, año, servicios.
 *  · El texto ALTERNA de mitad izquierda a mitad derecha de una rejilla de 12, a veces
 *    en un tercio estrecho; nunca centrado. Párrafos de 22–48 palabras.
 *  · Piezas de cinco clases: ancha (16:9 o 1,39), par de cuadradas, cuadrada con el
 *    texto en la celda de al lado, carrusel de cuadradas ESCALONADAS que sangra a la
 *    derecha, y VÍDEOS en bucle de la interfaz haciendo algo (9 de 14 en Amigo).
 *  · Cierre: cita de un cliente + llamada a trabajar juntos, separadas por un filete
 *    vertical, y «El resultado» con cifras en filas.
 *
 * Los vídeos solo se reproducen en pantalla (IntersectionObserver) y respetan
 * prefers-reduced-motion: con movimiento reducido se queda el póster.
 *
 * Segunda vuelta (Alexander, 2026-10-06: «optimiza el espacio, el storytelling, apóyate de
 * scrolls horizontales para que el usuario no esté bajando y bajando… grids de 3, carruseles
 * en móvil»):
 *  · CAPÍTULO: el texto en un tercio y, al lado, una TIRA horizontal que sangra hasta el
 *    borde, con un pie corto por pieza; un capítulo entero cabe en una pantalla.
 *  · PAR y TRÍO: rejilla. Y al rato: «ya estás haciendo demasiados carruseles o scrolls, haz
 *    un intermedio… que respire todo entre sí» → como mucho DOS tiras por ficha, el resto
 *    rejilla con el aire de la primera vuelta.
 *  · Los vídeos siguen a todo el ancho: son lo que más luce.
 */

const HEADING = { fontFamily: "var(--font-family-heading)" } as const;

export type Medio =
  | { tipo: "imagen"; src: string; alt: string; srcMovil?: string }
  | {
      tipo: "video";
      src: string;
      poster: string;
      alt: string;
      /** Otro vídeo por debajo de md: un plano ancho con UI a 2:1 no se lee a 390 px (Feniz). */
      srcMovil?: string;
      posterMovil?: string;
    };

export type BloqueProducto =
  | {
      kind: "texto";
      title?: string;
      body: string;
      /** izq: mitad izquierda · der: mitad derecha · der-estrecho: el tercio derecho */
      lado: "izq" | "der" | "der-estrecho";
    }
  | {
      kind: "ancho";
      medio: Medio;
      ratio: number;
      ratioMovil?: number;
      inset?: boolean;
      /** Fuera en el celular: una lámina con texto menudo (una tabla) que a 390 px no se lee
       *  y cuyo contenido ya cuenta el párrafo de al lado. */
      soloEscritorio?: boolean;
    }
  /** `pies`: una línea bajo cada pieza (las tiendas de Vendiq: nombre · rubro · dominio). */
  | { kind: "par"; medios: [Medio, Medio]; pies?: string[] }
  | { kind: "trio"; medios: [Medio, Medio, Medio]; pies?: string[] }
  /** Texto en un tercio + tira horizontal con pie por pieza (`ratio` ancho/alto, 1 por defecto). */
  | {
      kind: "capitulo";
      title?: string;
      body: string;
      etiqueta: string;
      piezas: { medio: Medio; ratio?: number; pie?: string }[];
    }
  | { kind: "cuadrada-texto"; medio: Medio; body: string }
  | { kind: "carrusel"; medios: Medio[]; etiqueta: string }
  /** Valores de marca con su contrapeso (Significa Dia: «Knowledgeable. But not prescriptive»). */
  | { kind: "valores"; items: { titulo: string; texto: string }[] };

export type CaseProductoProps = {
  fondo: string;
  /** Nombres accesibles de las flechas de las tiras, en el idioma de la ficha. */
  mandos?: { anterior: string; siguiente: string };
  titulo: string;
  logo: { src: string; width: number; height: number; alt: string };
  heroe: { src: string; srcMovil: string; alt: string };
  meta: {
    tipologia: [string, string[]];
    industria: [string, string];
    anio: [string, string];
    /** La lista larga dice «lo hicimos todo» sin una frase (Significa Dia, 12 servicios). */
    servicios: [string, string[]];
    entregables?: [string, string[]];
    vivo?: [string, string, string];
  };
  bloques: BloqueProducto[];
  /** Textual, de una fuente del cliente. Sin testimonio real no hay cita (Vendiq): queda la CTA sola. */
  cita?: { texto: string; nombre: string; cargo: string; iniciales: string };
  cta: { titulo: string; texto: string; boton: string; href: string };
  resultado: {
    titulo: string;
    texto: string;
    cifras: { valor: string; texto: string }[];
  };
};

function VideoBucle({
  src,
  poster,
  alt,
  media,
  className = "",
}: {
  src: string;
  poster: string;
  alt: string;
  /** Solo se carga si casa esta consulta: el vídeo del otro ancho no se descarga. */
  media?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [activo, setActivo] = useState(!media);
  useEffect(() => {
    if (!media) return;
    const mq = window.matchMedia(media);
    const cambia = () => setActivo(mq.matches);
    cambia();
    mq.addEventListener("change", cambia);
    return () => mq.removeEventListener("change", cambia);
  }, [media]);
  useEffect(() => {
    const v = ref.current;
    if (!v || !activo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.15 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [activo]);
  return (
    <video
      ref={ref}
      className={`absolute inset-0 size-full object-cover ${className}`}
      src={activo ? src : undefined}
      poster={poster}
      aria-label={alt}
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}

/** Una pieza dentro de su caja con el radio común (16 px, el de Amigo). */
function Pieza({
  medio,
  style,
  className = "",
  sizes,
}: {
  medio: Medio;
  style?: CSSProperties;
  className?: string;
  sizes: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white/[0.04] ${className}`}
      style={style}
    >
      {medio.tipo === "video" && medio.srcMovil ? (
        <>
          <VideoBucle
            src={medio.srcMovil}
            poster={medio.posterMovil ?? medio.poster}
            alt={medio.alt}
            media="(max-width: 767px)"
            className="md:hidden"
          />
          <VideoBucle
            src={medio.src}
            poster={medio.poster}
            alt={medio.alt}
            media="(min-width: 768px)"
            className="hidden md:block"
          />
        </>
      ) : medio.tipo === "video" ? (
        <VideoBucle src={medio.src} poster={medio.poster} alt={medio.alt} />
      ) : medio.srcMovil ? (
        <>
          <Image
            src={medio.srcMovil}
            alt={medio.alt}
            fill
            quality={90}
            sizes="100vw"
            className="object-cover md:hidden"
          />
          <Image
            src={medio.src}
            alt={medio.alt}
            fill
            quality={90}
            sizes={sizes}
            className="hidden object-cover md:block"
          />
        </>
      ) : (
        <Image
          src={medio.src}
          alt={medio.alt}
          fill
          quality={90}
          sizes={sizes}
          className="object-cover"
        />
      )}
    </div>
  );
}

/** La curva de vendiq.pe y de Rematch: sale rápido y se asienta largo. */
const CURVA = [0.22, 1, 0.36, 1] as const;

/**
 * Entrada de cada pieza (Alexander, 2026-10-06: «tampoco veo animaciones de entrada en nada»).
 * Lo aprendido en creator/LECCIONES.md:
 *  · «Entradas a medias»: entra TODO lo visible, cada pieza en su nodo y en su orden; lo que
 *    está bajo el pliegue entra al verse (whileInView), no al cargar.
 *  · «useReducedMotion() dentro de initial rompe la hidratación»: el estado inicial es el
 *    mismo en el servidor y en el navegador; «reducir movimiento» solo quita la duración.
 */
function Aparece({
  children,
  className,
  retraso = 0,
  desde = 28,
  alCargar = false,
  como = "div",
}: {
  children: ReactNode;
  className?: string;
  retraso?: number;
  desde?: number;
  alCargar?: boolean;
  como?: "div" | "li";
}) {
  const reducir = useReducedMotion();
  const M = como === "li" ? motion.li : motion.div;
  const fin = { opacity: 1, y: 0 };
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: desde }}
      {...(alCargar
        ? { animate: fin }
        : {
            whileInView: fin,
            viewport: { once: true, margin: "0px 0px -8% 0px" },
          })}
      transition={
        reducir
          ? { duration: 0 }
          : { duration: 0.85, delay: retraso, ease: CURVA }
      }
    >
      {children}
    </M>
  );
}

/** La foto del héroe se asienta (1,06 → 1) al cargar; sin fundido, para no retrasar el LCP. */
function Asentar({ children }: { children: ReactNode }) {
  const reducir = useReducedMotion();
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ scale: 1.06 }}
      animate={{ scale: 1 }}
      transition={reducir ? { duration: 0 } : { duration: 1.8, ease: CURVA }}
    >
      {children}
    </motion.div>
  );
}

const LADO = {
  izq: "col-span-12 md:col-span-7 lg:col-span-5",
  der: "col-span-12 md:col-start-6 md:col-span-7 lg:col-start-7 lg:col-span-5",
  "der-estrecho":
    "col-span-12 md:col-start-6 md:col-span-7 lg:col-start-9 lg:col-span-4",
} as const;

function Texto({ b }: { b: Extract<BloqueProducto, { kind: "texto" }> }) {
  return (
    <div className="grid grid-cols-12 gap-x-6">
      <div className={LADO[b.lado]}>
        {b.title ? (
          <Aparece>
            <h2
              className="mb-4 text-[28px] leading-[1.2] text-white md:text-[34px]"
              style={HEADING}
            >
              {b.title}
            </h2>
          </Aparece>
        ) : null}
        <Aparece retraso={b.title ? 0.08 : 0}>
          <p className="text-[17px] leading-[1.6] text-white/75 md:text-[19px]">
            {b.body}
          </p>
        </Aparece>
      </div>
    </div>
  );
}

function Escalonado({
  b,
}: { b: Extract<BloqueProducto, { kind: "carrusel" }> }) {
  const plugins = useMemo(() => [WheelGesturesPlugin()], []);
  return (
    <Carousel
      opts={{ align: "start", dragFree: true, containScroll: "trimSnaps" }}
      plugins={plugins}
      aria-label={b.etiqueta}
    >
      {/* Alineado al contenido por la izquierda y sangrando hasta el borde derecho */}
      <div style={{ marginRight: "calc((100% - 100vw) / 2)" }}>
        <CarouselContent className="-ml-4 cursor-grab touch-pan-y touch-pinch-zoom select-none pb-16 active:cursor-grabbing md:-ml-6 md:pb-[236px]">
          {b.medios.map((m, i) => (
            <CarouselItem
              key={m.src}
              className="basis-[64%] pl-4 sm:basis-[44%] md:basis-[40.5%] md:pl-6 lg:basis-[34%] xl:basis-[30%]"
            >
              {/* Los impares bajan: la escalera de Amigo (236 px en escritorio, 64 en el celular) */}
              <div
                className={
                  i % 2 === 1 ? "translate-y-16 md:translate-y-[236px]" : ""
                }
              >
                <Pieza
                  medio={m}
                  className="aspect-square"
                  sizes="(min-width: 1280px) 30vw, (min-width: 1024px) 34vw, (min-width: 768px) 41vw, 64vw"
                />
              </div>
            </CarouselItem>
          ))}
          <div
            aria-hidden="true"
            className="shrink-0 grow-0 basis-4 md:basis-16"
          />
        </CarouselContent>
      </div>
      <CarouselProgress
        className="h-0.5 max-w-[240px] overflow-hidden rounded-full bg-white/15"
        barClassName="rounded-full bg-white"
      />
    </Carousel>
  );
}

const MandosCtx = createContext({
  anterior: "Anterior",
  siguiente: "Siguiente",
});

/** Flechas y barra de «cuánto has visto» de una tira (la de Sportt / aurore.com.pe). */
function Mandos({ className = "" }: { className?: string }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel();
  const t = useContext(MandosCtx);
  const boton =
    "grid size-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30";
  return (
    <div className={`items-center gap-5 ${className}`}>
      <div className="flex gap-2">
        <button
          type="button"
          aria-label={t.anterior}
          className={boton}
          onClick={scrollPrev}
          disabled={!canScrollPrev}
        >
          <ArrowLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-label={t.siguiente}
          className={boton}
          onClick={scrollNext}
          disabled={!canScrollNext}
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
      <CarouselProgress
        className="h-0.5 w-full max-w-[200px] overflow-hidden rounded-full bg-white/15"
        barClassName="rounded-full bg-white"
      />
    </div>
  );
}

/**
 * Capítulo: texto a la izquierda y tira horizontal a la derecha que sangra hasta el borde
 * de la ventana (`--sangria`, ver la raíz). Todas las piezas tienen el MISMO alto
 * (`--alto`) y el ancho que pide su proporción; en el celular, el texto arriba y la tira
 * debajo, con el ancho topado al 84 % de la pantalla.
 */
function Capitulo({ b }: { b: Extract<BloqueProducto, { kind: "capitulo" }> }) {
  const plugins = useMemo(() => [WheelGesturesPlugin()], []);
  return (
    <Carousel
      opts={{ align: "start", dragFree: true, containScroll: "trimSnaps" }}
      plugins={plugins}
      aria-label={b.etiqueta}
      className="grid grid-cols-12 gap-x-6 gap-y-8 [--alto:62vw] sm:[--alto:40vw] lg:[--alto:min(29vw,470px)]"
    >
      <div className="col-span-12 flex flex-col md:col-span-8 lg:col-span-4 lg:pr-6">
        {b.title ? (
          <Aparece>
            <h2
              className="mb-4 text-[28px] leading-[1.2] text-white md:text-[34px]"
              style={HEADING}
            >
              {b.title}
            </h2>
          </Aparece>
        ) : null}
        <Aparece retraso={b.title ? 0.08 : 0}>
          <p className="text-[17px] leading-[1.6] text-white/75 md:text-[19px]">
            {b.body}
          </p>
        </Aparece>
        <Aparece retraso={0.2} className="hidden pt-10 lg:mt-auto lg:block">
          <Mandos className="flex" />
        </Aparece>
      </div>
      <div
        className="col-span-12 min-w-0 lg:col-span-8"
        style={{ marginRight: "calc(-1 * var(--sangria))" }}
      >
        <CarouselContent className="-ml-4 cursor-grab touch-pan-y touch-pinch-zoom select-none active:cursor-grabbing md:-ml-5">
          {b.piezas.map((p, i) => {
            const ar = p.ratio ?? 1;
            return (
              <CarouselItem
                key={p.medio.src}
                className="shrink-0 grow-0 basis-auto pl-4 md:pl-5"
              >
                <Aparece retraso={Math.min(i, 3) * 0.09} desde={36}>
                  <figure
                    className="w-[min(calc(var(--alto)*var(--ar)),84vw)]"
                    style={{ "--ar": ar } as CSSProperties}
                  >
                    <Pieza
                      medio={p.medio}
                      className="w-full [aspect-ratio:var(--ar)]"
                      sizes={`(min-width: 1024px) ${Math.round(30 * ar)}vw, ${Math.min(84, Math.round(62 * ar))}vw`}
                    />
                    {p.pie ? (
                      <figcaption className="mt-3 pr-2 text-[14px] leading-[1.45] text-white/60 md:text-[15px]">
                        {p.pie}
                      </figcaption>
                    ) : null}
                  </figure>
                </Aparece>
              </CarouselItem>
            );
          })}
          <div
            aria-hidden="true"
            className="shrink-0 grow-0 basis-[var(--sangria)]"
          />
        </CarouselContent>
        <Aparece className="mt-6 lg:hidden">
          <Mandos className="flex" />
        </Aparece>
      </div>
    </Carousel>
  );
}

/**
 * Par y trío, sin carrusel (Alexander, 2026-10-06: «ya estás haciendo demasiados carruseles o
 * scrolls, haz un intermedio… que respire todo entre sí»). El par se apila en el celular; el
 * trío pasa a una grande arriba y dos debajo, para no ocupar tres pantallas.
 */
function Rejilla({ medios, pies }: { medios: Medio[]; pies?: string[] }) {
  const trio = medios.length === 3;
  return (
    <div
      className={
        trio
          ? "grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6"
          : "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6"
      }
    >
      {medios.map((m, i) => (
        <Aparece
          key={m.src}
          retraso={i * 0.1}
          desde={36}
          className={trio && i === 0 ? "col-span-2 md:col-span-1" : ""}
        >
          <figure>
            <Pieza
              medio={m}
              className="aspect-square"
              sizes={
                trio
                  ? `(min-width: 1536px) 470px, (min-width: 768px) 31vw, ${i === 0 ? "100vw" : "50vw"}`
                  : "(min-width: 1536px) 700px, (min-width: 768px) 46vw, 100vw"
              }
            />
            {pies?.[i] ? (
              <figcaption className="mt-3 text-[14px] leading-[1.45] text-white/60 md:text-[15px]">
                {pies[i]}
              </figcaption>
            ) : null}
          </figure>
        </Aparece>
      ))}
    </div>
  );
}

function Bloque({ b }: { b: BloqueProducto }) {
  if (b.kind === "texto") return <Texto b={b} />;
  if (b.kind === "ancho")
    return (
      <Aparece
        desde={40}
        className={b.inset ? "mx-auto w-full md:w-[84%]" : ""}
      >
        <Pieza
          medio={b.medio}
          className="w-full [aspect-ratio:var(--r-movil)] md:[aspect-ratio:var(--r)]"
          style={
            {
              "--r": b.ratio,
              "--r-movil": b.ratioMovil ?? b.ratio,
            } as CSSProperties
          }
          sizes="(min-width: 1536px) 1400px, (min-width: 768px) 92vw, 100vw"
        />
      </Aparece>
    );
  if (b.kind === "par" || b.kind === "trio")
    return <Rejilla medios={b.medios} pies={b.pies} />;
  if (b.kind === "capitulo") return <Capitulo b={b} />;
  if (b.kind === "cuadrada-texto")
    return (
      <div className="grid grid-cols-12 gap-x-6 gap-y-8">
        <Aparece desde={36} className="col-span-12 md:col-span-6">
          <Pieza
            medio={b.medio}
            className="aspect-square"
            sizes="(min-width: 1536px) 700px, (min-width: 768px) 46vw, 100vw"
          />
        </Aparece>
        <Aparece
          retraso={0.1}
          className="col-span-12 md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-7"
        >
          <p className="text-[17px] leading-[1.6] text-white/75 md:text-[19px]">
            {b.body}
          </p>
        </Aparece>
      </div>
    );
  if (b.kind === "valores")
    return (
      <div className="grid gap-x-6 gap-y-10 md:grid-cols-3">
        {b.items.map((v, i) => (
          <Aparece
            key={v.titulo}
            retraso={i * 0.1}
            className="border-t border-white/15 pt-6"
          >
            <p
              className="text-[26px] leading-[1.15] text-white md:text-[30px]"
              style={HEADING}
            >
              {v.titulo}
            </p>
            <p className="mt-3 text-[16px] leading-[1.6] text-white/70 md:text-[17px]">
              {v.texto}
            </p>
          </Aparece>
        ))}
      </div>
    );
  return <Escalonado b={b} />;
}

/** El aire entre bloques: dos piezas seguidas van pegadas; el texto respira. */
function espacio(prev: BloqueProducto | undefined, b: BloqueProducto) {
  if (!prev) return "";
  const pieza = (x: BloqueProducto) =>
    x.kind === "ancho" || x.kind === "par" || x.kind === "trio";
  // con pies debajo, la fila siguiente se separa un poco más para que el pie no se pegue
  if (pieza(prev) && pieza(b))
    return "pies" in prev && prev.pies ? "mt-10 md:mt-12" : "mt-4 md:mt-6";
  // Dos textos seguidos se acercan: el tramo sin imagen no puede pasar de ~700 px
  // (ESTANDAR-FICHA § 3). El aire de la primera vuelta se mantiene: «que respire todo».
  if (prev.kind === "texto" && b.kind === "texto") return "mt-12 md:mt-20";
  // Un texto con título abre capítulo: más aire antes. Sustituye al «•••» de Significa Dia,
  // que Alexander leyó como «tres puntos que no sirven para nada» (2026-10-06).
  if ((b.kind === "texto" || b.kind === "capitulo") && b.title)
    return "mt-24 md:mt-40";
  if (prev.kind === "texto" || b.kind === "texto") return "mt-16 md:mt-28";
  return "mt-20 md:mt-32";
}

export function CaseProducto(p: CaseProductoProps) {
  const metaCelda = "flex flex-col gap-2";
  const etiqueta = "text-[17px] font-medium text-white md:text-[19px]";
  const valor = "text-[15px] leading-[1.5] text-white/75 md:text-[17px]";
  return (
    <div
      data-nav-theme="dark"
      style={{ backgroundColor: p.fondo }}
      // --sangria: de la orilla del contenido (max-w-screen-2xl dentro del relleno de
      // container-section) a la orilla de la ventana; con eso las tiras sangran a la derecha.
      className="overflow-x-clip text-white [--sangria:max(1rem,calc((100vw-1536px)/2))] sm:[--sangria:max(1.5rem,calc((100vw-1536px)/2))] lg:[--sangria:max(2rem,calc((100vw-1536px)/2))] xl:[--sangria:max(4rem,calc((100vw-1536px)/2))]"
    >
      <MandosCtx.Provider
        value={p.mandos ?? { anterior: "Anterior", siguiente: "Siguiente" }}
      >
        {/* ── Cabecera: título + logotipo, y la foto a sangre ── */}
        <section className="pt-28 md:pt-40">
          <div className="container-section">
            <div className="content-section flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
              <Aparece alCargar desde={24}>
                <h1
                  className="max-w-[18ch] text-[33px] leading-[1.08] text-white sm:text-[46px] lg:text-[58px]"
                  style={HEADING}
                >
                  {p.titulo}
                </h1>
              </Aparece>
              <Aparece alCargar retraso={0.15} desde={16} className="shrink-0">
                <Image
                  src={p.logo.src}
                  alt={p.logo.alt}
                  width={p.logo.width}
                  height={p.logo.height}
                  className="h-auto w-[180px] md:w-[240px]"
                  priority
                />
              </Aparece>
            </div>
          </div>
          <div className="relative mt-12 aspect-square w-full overflow-hidden sm:aspect-[16/10] md:mt-20 lg:aspect-[1.8/1]">
            {/* La foto se asienta sin fundido: la opacidad retrasaría el LCP */}
            <Asentar>
              <Image
                src={p.heroe.srcMovil}
                alt={p.heroe.alt}
                fill
                priority
                quality={90}
                sizes="100vw"
                className="object-cover sm:hidden"
              />
              <Image
                src={p.heroe.src}
                alt={p.heroe.alt}
                fill
                priority
                quality={90}
                sizes="100vw"
                className="hidden object-cover sm:block"
              />
            </Asentar>
          </div>
          <div className="container-section">
            <dl className="content-section grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-3 md:py-14 lg:grid-cols-6">
              <Aparece className={metaCelda}>
                <dt className={etiqueta}>{p.meta.tipologia[0]}</dt>
                <dd className="flex flex-wrap gap-2">
                  {p.meta.tipologia[1].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/25 px-3 py-1 text-[14px] leading-tight text-white md:text-[15px]"
                    >
                      {t}
                    </span>
                  ))}
                </dd>
              </Aparece>
              {[p.meta.industria, p.meta.anio].map(([k, v], i) => (
                <Aparece key={k} retraso={(i + 1) * 0.06} className={metaCelda}>
                  <dt className={etiqueta}>{k}</dt>
                  <dd className={valor}>{v}</dd>
                </Aparece>
              ))}
              {[p.meta.servicios, p.meta.entregables].map((par, i) =>
                par ? (
                  <Aparece
                    key={par[0]}
                    retraso={(i + 3) * 0.06}
                    className={metaCelda}
                  >
                    <dt className={etiqueta}>{par[0]}</dt>
                    <dd>
                      <ul className="space-y-1">
                        {par[1].map((x) => (
                          <li key={x} className={valor}>
                            {x}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </Aparece>
                ) : null
              )}
              {p.meta.vivo ? (
                <Aparece retraso={0.3} className={metaCelda}>
                  <dt className={etiqueta}>{p.meta.vivo[0]}</dt>
                  <dd>
                    <a
                      href={p.meta.vivo[2]}
                      target="_blank"
                      rel="noreferrer"
                      className={`${valor} inline-flex min-h-6 items-center gap-1 underline decoration-white/30 underline-offset-4 hover:text-white`}
                    >
                      {p.meta.vivo[1]}
                      <ArrowUpRight className="size-4" />
                    </a>
                  </dd>
                </Aparece>
              ) : null}
            </dl>
          </div>
        </section>

        {/* ── El cuerpo: texto que alterna de lado y piezas ── */}
        <section className="pt-10 pb-24 md:pt-16 md:pb-36">
          <div className="container-section">
            <div className="content-section">
              {p.bloques.map((b, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: el orden de los bloques es fijo
                  key={i}
                  className={`${espacio(p.bloques[i - 1], b)}${b.kind === "ancho" && b.soloEscritorio ? " max-md:hidden" : ""}`}
                >
                  <Bloque b={b} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cita del cliente y llamada a trabajar juntos ── */}
        <section className="border-y border-white/15">
          <div className="container-section">
            <div
              className={`content-section grid ${p.cita ? "md:grid-cols-2" : ""}`}
            >
              {p.cita ? (
                <figure className="py-12 md:border-r md:border-white/15 md:py-16 md:pr-14">
                  <Aparece>
                    <figcaption className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-full bg-white/10 text-[13px] font-semibold text-white">
                        {p.cita.iniciales}
                      </span>
                      <span>
                        <span className="block text-[16px] text-white">
                          {p.cita.nombre}
                        </span>
                        <span className="block text-[14px] text-white/65">
                          {p.cita.cargo}
                        </span>
                      </span>
                    </figcaption>
                    {/* En Gilroy, no en GuarujaTitle: la de títulos dibuja las comillas « » del revés */}
                    <blockquote className="mt-6 text-[22px] leading-[1.4] font-medium tracking-[-0.01em] text-white md:text-[28px]">
                      {p.cita.texto}
                    </blockquote>
                  </Aparece>
                </figure>
              ) : null}
              <div
                className={
                  p.cita
                    ? "border-t border-white/15 py-12 md:border-t-0 md:py-16 md:pl-14"
                    : "py-12 md:py-16"
                }
              >
                <Aparece retraso={p.cita ? 0.12 : 0}>
                  <p className="text-[18px] font-medium text-white md:text-[20px]">
                    {p.cta.titulo}
                  </p>
                  <p className="mt-3 max-w-[30rem] text-[16px] leading-[1.6] text-white/75 md:text-[18px]">
                    {p.cta.texto}
                  </p>
                  <Link
                    href={p.cta.href}
                    className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
                  >
                    {p.cta.boton}
                    <ArrowRight className="size-4" />
                  </Link>
                </Aparece>
              </div>
            </div>
          </div>
        </section>

        {/* ── El resultado, con cifras en filas ── */}
        <section className="py-20 md:py-32">
          <div className="container-section">
            <div className="content-section grid grid-cols-12 gap-x-6 gap-y-12">
              <div className="col-span-12 md:col-span-5 lg:col-span-4">
                <Aparece>
                  <h2
                    className="text-[44px] leading-[1.05] text-white md:text-[58px]"
                    style={HEADING}
                  >
                    {p.resultado.titulo}
                  </h2>
                </Aparece>
                <Aparece retraso={0.08}>
                  <p className="mt-6 text-[17px] leading-[1.6] text-white/75 md:text-[19px]">
                    {p.resultado.texto}
                  </p>
                </Aparece>
              </div>
              <ul className="col-span-12 md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">
                {p.resultado.cifras.map((c, i) => (
                  <Aparece
                    como="li"
                    retraso={i * 0.1}
                    key={c.valor + c.texto}
                    className={`grid grid-cols-[88px_1fr] items-baseline gap-6 py-6 md:grid-cols-[132px_1fr] md:py-8 ${
                      i > 0 ? "border-t border-white/15" : ""
                    }`}
                  >
                    <span
                      className="text-[52px] leading-none text-white md:text-[68px]"
                      style={HEADING}
                    >
                      {c.valor}
                    </span>
                    <span className="text-[16px] leading-[1.55] text-white/75 md:text-[19px]">
                      {c.texto}
                    </span>
                  </Aparece>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </MandosCtx.Provider>
    </div>
  );
}
