"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MagneticCursorArrow } from "~/components/axium/magnetic-cursor-arrow";
import { useTranslation } from "~/hooks/useTranslation";

/**
 * «Nuestro trabajo» al modo de basement.studio, «Featured Projects» (2026-10-21). Alexander:
 * «hazlo similar a basement.studio Featured Projects: portada y al pasar el mouse un vídeo».
 *
 * Lo que se toma de basement (medido en su web): el titular grande solo; una fila por proyecto
 * con la portada 16:9 a la izquierda (7 de 12 columnas), el texto en medio y el nombre grande a
 * la derecha; las filas se apilan al bajar (sticky, la siguiente tapa a la anterior); al pasar el
 * ratón la portada se cambia por un vídeo mudo. En el celular, la portada quieta y el texto
 * debajo, sin vídeo.
 *
 * Lo propio: el lienzo navy de Axium, la proporción 16:10 de nuestras portadas, los vídeos de cada
 * ficha, la tipografía de la marca y el círculo «ver proyecto» que sigue al cursor
 * (MagneticCursorArrow: Alexander, «ya teníamos un componente tipo círculo para ver caso,
 * reutilízalo»). Sustituye a HighlightsSection en el inicio desde el 2026-10-21.
 */

type Proyecto = {
  key: "vendiq" | "rematch" | "lumiolearn" | "bookit";
  href: string;
  domain: string;
  cover: string;
  video: string;
  /** Dónde se ancla el vídeo si su proporción no es 16:10 */
  encuadre?: string;
};

export const PROYECTOS: Proyecto[] = [
  {
    key: "vendiq",
    href: "/casos-de-exito/vendiq",
    domain: "vendiq.pe",
    // el hero real de vendiq.pe tal cual (titular, botones y el panel que asoma), capturado a
    // 2880×1800 sin el aviso de cookies ni lo flotante. Alexander, 2026-10-22: «adapta esa portada
    // mejor a la web real» (antes era el panel solo sobre el cielo)
    cover: "/images/proyects/vendiq/vq-portada-web.jpg",
    // la venta de Pulso de punta a punta: stock, boleta y envío (el «cómo funciona» de vendiq.pe)
    video: "/images/proyects/vendiq/vq-como-v3.mp4",
  },
  {
    key: "rematch",
    href: "/casos-de-exito/rematch",
    domain: "rematch.pe",
    cover: "/images/highlights/rematch-v15.jpg",
    video: "/images/proyects/rematch/rm-movil-portada.mp4",
  },
  {
    key: "lumiolearn",
    href: "/casos-de-exito/lumiolearn",
    domain: "lumiolearn.com",
    cover: "/images/highlights/lumiolearn-v12.jpg",
    // 2:1: la interfaz está a la izquierda, la lista de funciones a la derecha
    video: "/images/proyects/lumiolearn/lu-experiencia.mp4",
    encuadre: "left center",
  },
  {
    key: "bookit",
    href: "/casos-de-exito/bookit",
    domain: "bookit.com.pe",
    cover: "/images/highlights/bookit-v10.jpg",
    video: "/images/proyects/bookit/bk-recorrido.mp4",
  },
];

const FUNDIDO_ENTRADA = 600; // ms, la portada y el vídeo son imágenes distintas: fundido largo
const FUNDIDO_SALIDA = 500;

const conRaton = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * La portada: imagen quieta y, al pasar el ratón, su vídeo desde el principio. También la usan
 * las tarjetas de «más trabajo» de las páginas de servicio (con su propia proporción).
 */
export function Portada({
  p,
  nombre,
  etiqueta,
  circulo,
  className = "aspect-[16/10]",
  marco = "",
  sizes = "(min-width: 1024px) 56vw, 100vw",
}: {
  p: Pick<Proyecto, "href" | "cover" | "encuadre"> & { video?: string };
  nombre: string;
  etiqueta: string;
  circulo: string;
  className?: string;
  /** clases del envoltorio del cursor, que es el que queda como hijo de la rejilla (p. ej. `order-first`) */
  marco?: string;
  sizes?: string;
}) {
  const caja = useRef<HTMLAnchorElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const encima = useRef(false);
  const apagar = useRef<number | undefined>(undefined);
  const [corriendo, setCorriendo] = useState(false);

  // Con ratón, el vídeo se va cargando cuando la fila se acerca, para que arranque al instante
  useEffect(() => {
    const el = caja.current;
    const v = video.current;
    if (!el || !v || !conRaton()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        v.preload = "auto";
        io.disconnect();
      },
      { rootMargin: "50% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(apagar.current), []);

  // Al entrar: si el vídeo todavía se está apagando, sigue desde donde va (volver a 0 con él a
  // medio fundido se veía como un corte); si ya estaba apagado, arranca desde el principio
  const entrar = () => {
    encima.current = true;
    const v = video.current;
    if (!v || !conRaton()) return;
    const apagandose = apagar.current !== undefined;
    window.clearTimeout(apagar.current);
    apagar.current = undefined;
    if (!apagandose) v.currentTime = 0;
    v.play().catch(() => {});
    if (apagandose) setCorriendo(true);
  };

  // Al salir: se apaga corriendo y, ya invisible, se pausa y vuelve a 0
  const salir = () => {
    encima.current = false;
    setCorriendo(false);
    const v = video.current;
    if (!v) return;
    window.clearTimeout(apagar.current);
    apagar.current = window.setTimeout(() => {
      apagar.current = undefined;
      v.pause();
      v.currentTime = 0;
    }, FUNDIDO_SALIDA + 50);
  };

  return (
    <MagneticCursorArrow
      label={circulo}
      arrowColor="text-white"
      labelColor="rgba(255,255,255,0.75)"
      className={marco}
    >
      <Link
        ref={caja}
        href={p.href}
        aria-label={`${etiqueta}: ${nombre}`}
        // con ratón nada más: en el celular el toque va directo al enlace
        onPointerEnter={(e) => e.pointerType === "mouse" && entrar()}
        onPointerLeave={(e) => e.pointerType === "mouse" && salir()}
        className={`group relative block overflow-hidden bg-white/5 after:pointer-events-none after:absolute after:inset-0 after:border after:border-white/10 ${className}`}
      >
        {/* La imagen y el vídeo se acercan juntos, despacio, al entrar el ratón */}
        <div className="absolute inset-0 transition-transform duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)] motion-safe:group-hover:scale-[1.03]">
          <Image
            src={p.cover}
            alt=""
            fill
            sizes={sizes}
            quality={90}
            className="object-cover"
          />
          {p.video && (
            <video
              ref={video}
              src={p.video}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
              onPlaying={() => encima.current && setCorriendo(true)}
              className="absolute inset-0 size-full object-cover"
              style={{
                opacity: corriendo ? 1 : 0,
                objectPosition: p.encuadre,
                transition: `opacity ${corriendo ? FUNDIDO_ENTRADA : FUNDIDO_SALIDA}ms cubic-bezier(.4,0,.2,1)`,
              }}
            />
          )}
        </div>
      </Link>
    </MagneticCursorArrow>
  );
}

export function TrabajoDestacado() {
  const { t } = useTranslation("landing");

  return (
    <section
      id="casos"
      data-nav-theme="dark"
      className="relative bg-[#060C20] text-white"
    >
      <div className="container-section">
        <div className="content-section pt-20 pb-16 md:pt-28 lg:pb-24">
          <div className="aparecer flex flex-col gap-5 pb-8 md:flex-row md:items-end md:justify-between lg:pb-10">
            <h2
              className="titulo-seccion text-white/85"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              {t("highlights.title")}
            </h2>
            <p className="max-w-[34ch] text-[16px] leading-[1.55] text-white/55 md:text-right">
              {t("highlights.intro")}
            </p>
          </div>

          <div>
            {PROYECTOS.map((p) => {
              const nombre = t(`highlights.items.${p.key}.name`);
              return (
                <article
                  key={p.key}
                  className="border-t border-white/15 bg-[#060C20] py-6 lg:sticky lg:top-16 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:py-4"
                >
                  <div className="aparecer lg:col-span-7">
                    <Portada
                      p={p}
                      nombre={nombre}
                      etiqueta={t("highlights.verCaso")}
                      circulo={t("portfolio.verProyecto")}
                    />
                  </div>
                  {/* el texto también lleva al caso: en el celular se toca el nombre, no solo la
                      portada (el enlace accesible es el de la portada; este no suma una parada) */}
                  <Link
                    href={p.href}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="aparecer group/texto mt-5 flex flex-col justify-between gap-6 lg:col-span-5 lg:mt-0"
                    style={
                      { "--aparecer-retraso": "0.1s" } as React.CSSProperties
                    }
                  >
                    <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-6">
                      <h3
                        className="text-[30px] leading-none tracking-[-0.03em] text-white/90 lg:order-2 lg:text-right lg:text-[38px]"
                        style={{ fontFamily: "var(--font-family-heading)" }}
                      >
                        {nombre}
                      </h3>
                      <p className="max-w-[46ch] text-[16px] leading-[1.5] text-white/65 lg:order-1 lg:text-[17px] lg:leading-[1.45]">
                        {t(`highlights.items.${p.key}.description`)}
                      </p>
                    </div>
                    <p className="text-[15px] leading-[1.5] text-white/85 lg:text-[17px]">
                      {t(`highlights.items.${p.key}.category`)}
                      <br />
                      <span className="text-white/50">{p.domain}</span>
                    </p>
                  </Link>
                </article>
              );
            })}

            <Link
              href="/portafolio"
              className="group relative flex items-center justify-between border-t border-white/15 bg-[#060C20] py-7 text-[17px] text-white/70 transition-colors hover:text-white"
            >
              <span>[ {t("portfolio.verTodos")} ]</span>
              <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
