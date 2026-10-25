"use client";

/*
 * La portada del inicio, t2 · Profundidad (2026-10-16). Alexander: «quiero un efecto de hero section
 * que al bajar presente la siguiente sección de forma elegante». Parte del hero real (la 34f: vidrio
 * con el reel, copy en es/en/pt): el hero se aleja como una tarjeta que se inclina hacia atrás y se
 * apaga, y «Nosotros» sube por encima como una hoja de bordes redondeados.
 * El anclado es CSS (sticky): el compositor lo mueve con el scroll, sin el temblor de un anclado por
 * JS (ANIMACION.md § 1). El JS solo calcula el progreso y escribe transformaciones y recortes.
 * Sin animación (movimiento reducido): el hero y «Nosotros» de siempre, uno debajo del otro.
 * Las otras transiciones (t1 por el triángulo, t3 amanecer, t4 y t5) se borraron el 2026-10-23.
 */

import { motion } from "motion/react";
import Image from "next/image";
import { type RefObject, useEffect, useRef, useState } from "react";
import { AboutSection } from "~/components/axium/about-section";
import {
  Botones,
  FONDO_NOCHE,
  NOCHE,
  display,
  encuadrePortada,
  entra,
  useReel,
} from "~/components/axium/hero-3d";
import type { OpcionesReel } from "~/components/axium/tres/escenas";
import { useTranslation } from "~/hooks/useTranslation";

const suave = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

/** progreso (0…1) de un escenario anclado: cuánto se lleva desplazado sobre `largo()` px, contando
 *  desde `inicio()` px por debajo de su borde de arriba (un hero más alto que la pantalla primero se
 *  recorre entero y recién después empieza la transición) */
function useProgreso(
  ref: RefObject<HTMLElement | null>,
  largo: () => number,
  alCambiar: (p: number) => void,
  inicio: () => number = () => 0
) {
  const cb = useRef(alCambiar);
  cb.current = alCambiar;
  const lg = useRef(largo);
  lg.current = largo;
  const ini = useRef(inicio);
  ini.current = inicio;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let arriba = 0;
    let L = 1;
    let raf = 0;
    let ultimo = -1;
    const medir = () => {
      arriba = el.getBoundingClientRect().top + window.scrollY + ini.current();
      L = Math.max(1, lg.current());
    };
    const leer = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, (window.scrollY - arriba) / L));
      if (Math.abs(p - ultimo) > 0.0004) {
        ultimo = p;
        cb.current(p);
      }
    };
    const pedir = () => {
      if (!raf) raf = requestAnimationFrame(leer);
    };
    medir();
    leer();
    const ro = new ResizeObserver(() => {
      medir();
      pedir();
    });
    ro.observe(el);
    const redimensionar = () => {
      medir();
      pedir();
    };
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", redimensionar);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", redimensionar);
    };
  }, [ref]);
}

function useMovimientoReducido() {
  const [reducido, setReducido] = useState(false);
  useEffect(() => {
    setReducido(matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reducido;
}

/**
 * La entrada del texto del hero con CSS (`.entra-css` en globals.css) y no con motion: motion lo
 * renderiza en el servidor con opacity 0 y solo lo muestra al hidratar, y en un celular de gama
 * media eso eran ~6 s de pantalla sin titular (el LCP medido, 2026-10-23). La animación es la
 * misma (sube 24 px y aparece en 0,7 s con la misma curva), pero corre desde la primera pintura.
 */
const retraso = (d: number) =>
  ({ "--entra-retraso": `${d}s` }) as React.CSSProperties;

/** el cuerpo del hero real (34f): la escena, el titular, los botones, las cifras y la pausa */
function CuerpoHero({
  transicion,
  alHueco,
  acercamiento,
  luzMax,
  altoContenido = false,
  refAccion,
  refOcultar,
  refTexto,
  refPausa,
}: {
  transicion?: OpcionesReel["transicion"];
  alHueco?: OpcionesReel["alHueco"];
  acercamiento?: number;
  luzMax?: number;
  /** crece con su contenido (min-h) en vez de medir justo una pantalla: en un iPhone SE el hero
   *  no entra en 667 px y con alto fijo se cortaba el botón principal */
  altoContenido?: boolean;
  refAccion: { current: ((p: number) => void) | null };
  /** pausa la escena mientras la sección siguiente la tapa del todo */
  refOcultar?: { current: ((o: boolean) => void) | null };
  refTexto: RefObject<HTMLDivElement | null>;
  refPausa: RefObject<HTMLDivElement | null>;
}) {
  const { t } = useTranslation("landing");
  const lienzo = useRef<HTMLDivElement>(null);
  const reel = useReel(lienzo, NOCHE, encuadrePortada, {
    giro: "vuelta",
    interaccion: "arrastre",
    transicion,
    alHueco,
    acercamiento,
    luzMax,
  });
  refAccion.current = reel.accion;
  if (refOcultar) refOcultar.current = reel.ocultar;
  return (
    <section
      // en el celular mide justo una pantalla (svh: con las barras del navegador a la vista), y lo
      // que sobra lo toma la imagen del objeto; en escritorio crece con su contenido
      className={`relative isolate flex h-[100svh] w-full touch-pan-y select-none flex-col overflow-hidden ${altoContenido ? "lg:h-auto lg:min-h-[100svh]" : ""}`}
      style={{ background: FONDO_NOCHE }}
    >
      <span
        aria-hidden="true"
        className="grano-hero pointer-events-none absolute inset-0 -z-[5] lg:hidden"
      />
      {/* La escena: en escritorio cubre todo el hero, detrás del texto; en el celular es la franja
          que dejan el titular y los botones, así el hero nunca pasa de una pantalla. En el celular
          también gira desde el 2026-10-24 (antes ahí solo iba la imagen fija); lo que sigue
          apagado ahí es la transición entre secciones */}
      <div className="relative mx-auto mt-16 min-h-[88px] w-full max-w-[440px] flex-1 lg:absolute lg:inset-0 lg:-z-10 lg:mt-0 lg:max-w-none">
        {/* la imagen fija del objeto mientras three.js llega (y para siempre sin WebGL); se va
            cuando la escena dibujó su primer cuadro */}
        <Image
          src="/images/inicio/hero-movil.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 1px"
          className={`object-contain transition-opacity duration-500 lg:hidden ${reel.listo ? "opacity-0" : ""}`}
          style={{
            maskImage:
              "radial-gradient(closest-side, #000 70%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(closest-side, #000 70%, transparent 100%)",
          }}
        />
        <div
          ref={lienzo}
          aria-hidden="true"
          className="lienzo-franja absolute inset-0"
        />
      </div>
      <div
        ref={refPausa}
        className="absolute bottom-10 right-10 z-10 hidden lg:block"
      >
        {/* sin botón de pausa (2026-10-24, «que siempre gire»): queda el aviso de que se arrastra */}
        <div className="entra-css" style={retraso(0.5)}>
          <span className="text-[12px] text-white/45">
            {t("home.hero.dragHint")}
          </span>
        </div>
      </div>
      <div className="container-section flex w-full flex-col justify-end lg:flex-1">
        <div
          ref={refTexto}
          className="content-section pt-3 pb-8 lg:pt-[50svh] lg:pb-12"
        >
          <div className="mx-auto max-w-[760px] lg:text-center">
            <h1
              style={{ ...display, ...retraso(0.08) }}
              className="entra-css text-[clamp(34px,9.4vw,46px)] leading-[0.98] tracking-[-0.035em] text-white sm:text-[60px] xl:text-[68px]"
            >
              {t("home.hero.titleLine1")}{" "}
              <span className="block">{t("home.hero.titleLine2")}</span>
            </h1>
            <p
              style={retraso(0.16)}
              className="entra-css mt-4 max-w-[46ch] text-[16px] leading-[1.6] text-white/70 max-lg:[@media(max-height:700px)]:line-clamp-3 md:text-[17px] lg:mx-auto lg:mt-6 lg:leading-[1.65]"
            >
              {t("home.hero.description")}
            </p>
            <div
              style={retraso(0.24)}
              className="entra-css mt-6 lg:mt-8 lg:flex lg:justify-center"
            >
              <Botones />
            </div>
            <dl
              style={retraso(0.3)}
              className="entra-css mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-white/55 max-lg:[@media(max-height:700px)]:hidden lg:mt-9 lg:justify-center"
            >
              {[
                ["45", t("home.hero.statProjects")],
                ["4", t("home.hero.statProducts")],
              ].map(([n, texto]) => (
                <div key={n} className="flex items-baseline gap-2">
                  <dt className="sr-only">{texto}</dt>
                  <dd
                    style={display}
                    className="text-[22px] leading-none text-white"
                  >
                    {n}
                  </dd>
                  <dd aria-hidden="true">{texto}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/** el texto del hero se va primero (sube y se desvanece): la transición no lo arrastra */
function apagarTexto(
  texto: HTMLElement | null,
  pausa: HTMLElement | null,
  p: number
) {
  const e = suave(p);
  if (texto) {
    texto.style.opacity = String(1 - e);
    texto.style.transform = `translate3d(0, ${(-e * 48).toFixed(1)}px, 0)`;
    texto.style.pointerEvents = e > 0.5 ? "none" : "";
  }
  if (pausa) pausa.style.opacity = String(1 - e);
}

function SinAnimacion() {
  const refAccion = useRef<((p: number) => void) | null>(null);
  const t = useRef<HTMLDivElement>(null);
  const pa = useRef<HTMLDivElement>(null);
  return (
    <>
      <CuerpoHero refAccion={refAccion} refTexto={t} refPausa={pa} />
      <AboutSection />
    </>
  );
}

// ── t2 · Profundidad ─────────────────────────────────────────────────────────
// El hero queda anclado y se aleja: se inclina hacia atrás desde la base, se achica, se redondea y
// se apaga. «Nosotros» sube por encima como una hoja (bordes redondeados que se enderezan al llegar
// arriba y una sombra hacia el hero). Todo con transform y opacidad: lo mueve el compositor.
export function HeroProfundidad() {
  const reducido = useMovimientoReducido();
  const escenario = useRef<HTMLDivElement>(null);
  const tarjeta = useRef<HTMLDivElement>(null);
  const velo = useRef<HTMLDivElement>(null);
  const hoja = useRef<HTMLDivElement>(null);
  const texto = useRef<HTMLDivElement>(null);
  const pausa = useRef<HTMLDivElement>(null);
  const accion = useRef<((p: number) => void) | null>(null);
  const ocultar = useRef<((o: boolean) => void) | null>(null);
  // un hero más alto que la pantalla (teléfonos bajos) se ancla cuando su borde de ABAJO llega al de
  // la pantalla (top negativo): primero se ve entero, botones incluidos, y después sube la hoja
  const fijo = useRef<HTMLDivElement>(null);
  const [sobra, setSobra] = useState(0);
  useEffect(() => {
    const el = fijo.current;
    if (!el) return;
    const medir = () =>
      setSobra(Math.max(0, el.offsetHeight - window.innerHeight));
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    window.addEventListener("resize", medir);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", medir);
    };
  }, []);
  const sobraRef = useRef(0);
  sobraRef.current = sobra;

  useProgreso(
    escenario,
    () => window.innerHeight,
    (p) => {
      // en el celular no hay transición: el hero queda quieto y «Nosotros» va debajo
      if (window.innerWidth < 1024) {
        if (tarjeta.current) {
          tarjeta.current.style.transform = "";
          tarjeta.current.style.clipPath = "";
        }
        if (hoja.current) {
          hoja.current.style.borderTopLeftRadius = "";
          hoja.current.style.borderTopRightRadius = "";
        }
        if (velo.current) velo.current.style.opacity = "0";
        apagarTexto(texto.current, pausa.current, 0);
        return;
      }
      const e = suave(p);
      if (tarjeta.current) {
        tarjeta.current.style.transform = `perspective(1400px) translate3d(0, ${(-e * 5).toFixed(2)}vh, 0) rotateX(${(e * 9).toFixed(2)}deg) scale(${(1 - e * 0.14).toFixed(4)})`;
        tarjeta.current.style.clipPath = `inset(0 round ${(e * 34).toFixed(1)}px)`;
      }
      if (velo.current) velo.current.style.opacity = String(e * 0.6);
      if (hoja.current) {
        const radio = (1 - suave((p - 0.6) / 0.4)) * 44;
        hoja.current.style.borderTopLeftRadius = `${radio}px`;
        hoja.current.style.borderTopRightRadius = `${radio}px`;
      }
      // tapado del todo por la hoja: no se dibuja
      ocultar.current?.(p >= 0.995);
      apagarTexto(texto.current, pausa.current, p / 0.55);
    },
    () => sobraRef.current
  );

  if (reducido) return <SinAnimacion />;
  return (
    <div ref={escenario} className="relative bg-[#03081c]">
      <div
        ref={fijo}
        className="relative z-0 min-h-[100svh] overflow-hidden lg:sticky"
        style={{ top: -sobra }}
        data-nav-theme="dark"
        data-nav-bg="none"
      >
        <div
          ref={tarjeta}
          className="relative min-h-[100svh] w-full origin-[50%_100%] will-change-transform"
        >
          <CuerpoHero
            altoContenido
            refAccion={accion}
            refOcultar={ocultar}
            refTexto={texto}
            refPausa={pausa}
          />
          <div
            ref={velo}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[#01030b] opacity-0"
          />
        </div>
      </div>
      <div
        ref={hoja}
        // las esquinas y la sombra de la hoja que sube, solo en escritorio: en el celular no hay
        // transición y «Nosotros» va recto debajo del hero (2026-10-24, «que no tenga bordeado en
        // móvil»). El radio lo anima el scroll con estilos en línea, que en el celular se borran
        className="relative z-10 overflow-hidden bg-white lg:rounded-t-[44px] lg:shadow-[0_-40px_80px_-20px_rgba(1,4,16,0.55)]"
        data-nav-theme="light"
      >
        <AboutSection />
      </div>
    </div>
  );
}
