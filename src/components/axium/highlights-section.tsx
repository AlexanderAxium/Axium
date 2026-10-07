"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MagneticCursorArrow } from "~/components/axium/magnetic-cursor-arrow";
import { useTranslation } from "~/hooks/useTranslation";

const smoothEase = [0.4, 0, 0.2, 1] as const;

/** Portada en vídeo: solo corre en pantalla y respeta «reducir movimiento» (queda el póster). */
function PortadaVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
    />
  );
}

// Logos en su versión para fondo oscuro, tal como cada marca los usa.
// Portadas sin mockups de dispositivos (esos quedan para el carrusel de proyectos)
// y sin collage: una sola idea por producto, cada una con un tratamiento distinto.
type Highlight = {
  key: "vendiq" | "rematch" | "lumiolearn" | "bookit";
  url: string;
  // Sin ficha propia, la portada abre el sitio en vivo
  caseHref: string | null;
  domain: string;
  cover: string;
  /** Prueba (Alexander, 2026-10-06: «probemos poniendo alguna de tus animaciones de rematch
   *  como la portada»): un vídeo en bucle en vez de la imagen; `cover` queda de póster. */
  video?: string;
  logo: { src: string; width: number; height: number };
};

const HIGHLIGHTS: readonly [Highlight, ...Highlight[]] = [
  {
    key: "vendiq",
    url: "https://vendiq.pe",
    caseHref: "/casos-de-exito/vendiq",
    domain: "vendiq.pe",
    // v6 (2026-10-07): la portada nueva de vendiq.pe (personas reales y la tienda de ejemplo
    // Pulso), animada como la de Rematch: la escena entra, la gorra cae y sale la venta del
    // #1482. Es el vídeo de la ficha (vq-escena, 16:10); `cover` es su póster, el estado final.
    // Sustituye a vendiq-v5, el flujo dibujado de la portada anterior (CASO-VENDIQ.md § 14).
    cover: "/images/proyects/vendiq/vq-escena.jpg",
    video: "/images/proyects/vendiq/vq-escena.mp4",
    logo: {
      src: "/images/highlights/logos/vendiq-v2.png",
      width: 694,
      height: 160,
    },
  },
  {
    key: "rematch",
    url: "https://rematch.pe",
    caseHref: "/casos-de-exito/rematch",
    domain: "rematch.pe",
    // v15 (2026-10-06): la portada elegida por Alexander («el A está bien»): el celular
    // CONSTRUIDO, apoyado en el césped azul de una pista, visto desde arriba, con la sombra
    // de la reja al atardecer y rematch.pe en claro. Compuesta a 16:10, no recortada de la
    // 4:3 (el celular girado no cabría). Sustituye a la mano con el celular generado (v12–v14),
    // cuyo bisel desparejo Alexander rechazó. Ver CASO-REMATCH.md § 17-18
    cover: "/images/highlights/rematch-v15.jpg",
    // A prueba: rematch.pe recorriéndose en el celular del jugador, en la banca de la pista.
    // Es el vídeo de la ficha recompuesto a 16:10 (videos-rematch-pm.py movil-portada): el de
    // la ficha es 1,39 y, recortado, el celular quedaba cortado abajo.
    video: "/images/proyects/rematch/rm-movil-portada.mp4",
    logo: {
      src: "/images/highlights/logos/rematch.png",
      width: 939,
      height: 160,
    },
  },
  {
    key: "lumiolearn",
    url: "https://lumiolearn.com",
    caseHref: "/casos-de-exito/lumiolearn",
    domain: "lumiolearn.com",
    // v13 (2026-10-07): «Más que cursos» de lumiolearn.com animado sobre su azul noche, como
    // los de Vendiq y Rematch; arranca en la pestaña de comunidad. Sustituye a la tableta
    // cenital (v12), cuya pantalla llevaba el aviso de prueba de InduTech Academy, un inquilino
    // (CASO-LUMIOLEARN.md § 12).
    cover: "/images/proyects/lumiolearn/lu-portada.jpg",
    video: "/images/proyects/lumiolearn/lu-portada.mp4",
    logo: {
      src: "/images/highlights/logos/lumiolearn.png",
      width: 757,
      height: 160,
    },
  },
  {
    key: "bookit",
    url: "https://bookit.com.pe",
    caseHref: "/casos-de-exito/bookit",
    domain: "bookit.com.pe",
    // v11 (2026-10-07): «De tu web a tu agenda» de bookit.com.pe bajando paso a paso, el
    // vídeo de la ficha, como los de Vendiq y Rematch. `cover` (la laptop sobre el mármol
    // verde) queda de respaldo; el póster es el del vídeo.
    cover: "/images/highlights/bookit-v10.jpg",
    video: "/images/proyects/bookit/bk-recorrido.mp4",
    logo: {
      src: "/images/highlights/logos/bookit-v2.png",
      width: 1600,
      height: 399,
    },
  },
];

export function HighlightsSection() {
  const { t } = useTranslation("landing");
  const [active, setActive] = useState(0);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const current = HIGHLIGHTS[active] ?? HIGHLIGHTS[0];

  // La portada que cruza el centro del viewport define el proyecto activo
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -55% 0px" }
    );
    for (const el of cardRefs.current) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const scrollToCard = (index: number) => {
    cardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <section
      id="casos"
      data-nav-theme="dark"
      className="relative bg-[#060C20] text-white"
    >
      <div className="container-section">
        <div className="content-section">
          {/* Móvil y tablet: encabezado arriba */}
          <div className="pt-16 md:pt-24 lg:hidden">
            <p className="text-overline mb-3 text-[#7ECFC3]">
              {t("highlights.overline")}
            </p>
            <h2 className="text-display">{t("highlights.title")}</h2>
            <p className="text-body mt-3 max-w-xl text-white/60">
              {t("highlights.intro")}
            </p>
          </div>

          <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 xl:gap-24">
            {/* Desktop: panel fijo que cambia con la portada activa */}
            <div className="hidden lg:block">
              <div className="sticky top-0 flex h-screen flex-col justify-between pt-28 pb-14">
                <div>
                  <p className="text-overline mb-5 text-[#7ECFC3]">
                    {t("highlights.overline")}
                  </p>
                  {/* Sin el nombre del proyecto acá: el logo de abajo ya lo dice */}
                  <h2 className="text-display">{t("highlights.title")}</h2>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={current.key}
                    className="text-body-lg max-w-md text-white/65"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: smoothEase }}
                  >
                    {t(`highlights.items.${current.key}.description`)}
                  </motion.p>
                </AnimatePresence>

                <div className="space-y-7">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={current.key}
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: smoothEase }}
                    >
                      <Image
                        src={current.logo.src}
                        alt={t(`highlights.items.${current.key}.name`)}
                        width={current.logo.width}
                        height={current.logo.height}
                        className="h-7 w-auto"
                      />
                      <div>
                        <p className="text-body font-medium">
                          {t(`highlights.items.${current.key}.summary`)}
                        </p>
                        <p className="text-overline text-white/45">
                          {current.domain} ·{" "}
                          {t(`highlights.items.${current.key}.category`)}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex max-w-md gap-1.5">
                    {HIGHLIGHTS.map((item, index) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => scrollToCard(index)}
                        aria-label={t(`highlights.items.${item.key}.name`)}
                        aria-current={index === active}
                        className="group flex h-6 flex-1 items-center"
                      >
                        <span
                          className={`h-0.5 w-full rounded-full transition-colors duration-500 ${
                            index === active
                              ? "bg-[#7ECFC3]"
                              : "bg-white/15 group-hover:bg-white/35"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Portadas */}
            <div className="flex flex-col gap-14 py-10 md:py-14 lg:gap-3 lg:py-28">
              {HIGHLIGHTS.map((item, index) => {
                const name = t(`highlights.items.${item.key}.name`);
                return (
                  <article
                    key={item.key}
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    data-index={index}
                  >
                    {/* Con ficha propia la portada abre el caso; sin ficha, el sitio en vivo */}
                    <MagneticCursorArrow
                      label={
                        item.caseHref
                          ? t("portfolio.verProyecto")
                          : t("highlights.cursor")
                      }
                      arrowColor="text-white"
                      labelColor="rgba(255,255,255,0.75)"
                    >
                      {(() => {
                        const cover = (
                          <>
                            {item.video ? (
                              <PortadaVideo
                                src={item.video}
                                poster={item.video.replace(/\.mp4$/, ".jpg")}
                              />
                            ) : (
                              <Image
                                src={item.cover}
                                alt={`${name} — ${t(`highlights.items.${item.key}.summary`)}`}
                                fill
                                sizes="(min-width: 1024px) 58vw, 100vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                quality={90}
                              />
                            )}
                            <div
                              aria-hidden
                              className={`absolute inset-0 hidden bg-[#060C20] transition-opacity duration-500 lg:block ${
                                index === active ? "opacity-0" : "opacity-50"
                              }`}
                            />
                            <span className="sr-only">
                              {item.caseHref
                                ? name
                                : `${t("highlights.visit")} ${name}`}
                            </span>
                          </>
                        );
                        const cardClass =
                          "group relative block aspect-[16/10] overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10";
                        return item.caseHref ? (
                          <Link href={item.caseHref} className={cardClass}>
                            {cover}
                          </Link>
                        ) : (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cardClass}
                          >
                            {cover}
                          </a>
                        );
                      })()}
                    </MagneticCursorArrow>

                    {/* Móvil y tablet: el texto va bajo cada portada */}
                    <div className="mt-5 lg:hidden">
                      <h3 className="text-heading-2">{name}</h3>
                      <p className="text-overline mt-1 mb-3 text-white/45">
                        {item.domain} ·{" "}
                        {t(`highlights.items.${item.key}.category`)}
                      </p>
                      <p className="text-body text-white/65">
                        {t(`highlights.items.${item.key}.description`)}
                      </p>
                    </div>
                  </article>
                );
              })}

              <Link
                href="/portafolio"
                className="group flex h-28 items-end justify-between rounded-xl bg-white/[0.04] p-6 ring-1 ring-white/10 transition-colors duration-300 hover:bg-white/[0.08] lg:h-40"
              >
                <span className="text-overline text-white/60 transition-colors group-hover:text-white">
                  [ {t("portfolio.verTodos")} ]
                </span>
                <ArrowUpRight className="size-5 text-white/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
