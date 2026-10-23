"use client";

import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { MagneticCursorArrow } from "~/components/axium/magnetic-cursor-arrow";
import { PortadaBlog, TONO_PORTADA } from "~/components/axium/portada-blog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselProgress,
  useCarousel,
} from "~/components/ui/carousel";
import { BLOG_SLUGS } from "~/data/blog-data";
import { useTranslation } from "~/hooks/useTranslation";

/**
 * El blog en el inicio (2026-10-21). Las portadas, al modo de la grilla de noticias de Code and
 * Theory: cada una un afiche distinto (PortadaBlog), y debajo solo la categoría y el titular.
 * Alexander pidió después «que sea carrusel»: la tira es la de la ficha de producto (arrastre,
 * rueda, sangra hasta el borde derecho) con sus flechas y la barra de cuánto se ha visto. El cursor
 * es el círculo de siempre (MagneticCursorArrow), claro u oscuro según la portada.
 */

function Mandos({
  className = "",
  anterior,
  siguiente,
}: { className?: string; anterior: string; siguiente: string }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel();
  const boton =
    "grid size-11 place-items-center rounded-full border border-[#060C20]/20 text-[#060C20] transition-colors hover:bg-[#060C20]/[0.06] disabled:pointer-events-none disabled:opacity-30";
  return (
    <div className={`items-center gap-5 ${className}`}>
      <CarouselProgress
        className="h-0.5 w-full max-w-[160px] overflow-hidden rounded-full bg-[#060C20]/12"
        barClassName="rounded-full bg-[#060C20]"
      />
      <div className="flex gap-2">
        <button
          type="button"
          aria-label={anterior}
          className={boton}
          onClick={scrollPrev}
          disabled={!canScrollPrev}
        >
          <ArrowLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-label={siguiente}
          className={boton}
          onClick={scrollNext}
          disabled={!canScrollNext}
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function BlogSection() {
  const { t } = useTranslation("blog");
  const plugins = useMemo(() => [WheelGesturesPlugin()], []);

  const todos = (
    <Link
      href="/blog"
      className="group inline-flex items-center gap-2 text-[16px] text-[#060C20]/70 transition-colors hover:text-[#060C20]"
    >
      [ {t("meta.allPosts")} ]
      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );

  return (
    <section
      id="blog"
      data-nav-theme="light"
      className="overflow-hidden bg-white py-20 md:py-28"
    >
      <div className="container-section">
        <div className="content-section">
          <Carousel
            opts={{
              align: "start",
              dragFree: true,
              containScroll: "trimSnaps",
            }}
            plugins={plugins}
            aria-label={t("meta.title")}
          >
            <div className="aparecer mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="titulo-seccion text-[#060C20]">
                  {t("meta.title")}
                </h2>
                <p className="text-body mt-3 max-w-xl text-gray-500">
                  {t("meta.subtitle")}
                </p>
              </div>
              <div className="hidden shrink-0 flex-col items-end gap-5 md:flex">
                {todos}
                <Mandos
                  className="flex"
                  anterior={t("meta.anterior")}
                  siguiente={t("meta.siguiente")}
                />
              </div>
            </div>

            {/* Alineada al contenido por la izquierda y sangrando hasta el borde derecho */}
            <div
              className="aparecer"
              style={
                {
                  marginRight: "calc((100% - 100vw) / 2)",
                  "--aparecer-retraso": "0.1s",
                } as React.CSSProperties
              }
            >
              <CarouselContent className="-ml-3.5 cursor-grab touch-pan-y touch-pinch-zoom select-none active:cursor-grabbing">
                {BLOG_SLUGS.map((slug) => {
                  const oscuro = TONO_PORTADA[slug] === "oscuro";
                  return (
                    <CarouselItem
                      key={slug}
                      className="basis-[84%] pl-3.5 sm:basis-[60%] md:basis-[46%] lg:basis-[32%] xl:basis-[29%]"
                    >
                      <article>
                        <MagneticCursorArrow
                          label={t("meta.leerCursor")}
                          arrowColor={oscuro ? "text-white" : "text-[#060C20]"}
                          labelColor={
                            oscuro
                              ? "rgba(255,255,255,0.8)"
                              : "rgba(6,12,32,0.6)"
                          }
                        >
                          <Link
                            href={`/blog/${slug}`}
                            aria-label={t(`posts.${slug}.title`)}
                            draggable={false}
                            className="group block overflow-hidden"
                          >
                            <div className="transition-transform duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)] motion-safe:group-hover:scale-[1.025]">
                              <PortadaBlog slug={slug} />
                            </div>
                          </Link>
                        </MagneticCursorArrow>
                        <p className="mt-4 text-[13px] text-gray-500">
                          {t(`posts.${slug}.categoria`)}
                        </p>
                        <h3 className="mt-1.5 pr-4 text-[19px] leading-[1.3] text-[#060C20] md:text-[20px]">
                          <Link
                            href={`/blog/${slug}`}
                            draggable={false}
                            className="hover:underline"
                          >
                            {t(`posts.${slug}.title`)}
                          </Link>
                        </h3>
                      </article>
                    </CarouselItem>
                  );
                })}
                <div
                  aria-hidden="true"
                  className="shrink-0 grow-0 basis-4 md:basis-16"
                />
              </CarouselContent>
            </div>

            <div className="mt-10 flex flex-col gap-6 md:hidden">
              <Mandos
                className="flex justify-between"
                anterior={t("meta.anterior")}
                siguiente={t("meta.siguiente")}
              />
              {todos}
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
