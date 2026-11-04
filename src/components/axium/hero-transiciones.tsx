"use client";

/*
 * La portada del inicio (t2, 2026-10-16; simplificada el 2026-11-03). El hero real (la 34f: vidrio con
 * el reel, copy en es/en/pt) queda anclado y «Nosotros» sube por encima como una hoja; el hero se
 * oscurece a medida que la hoja lo tapa. Alexander, 2026-11-03: «simplifica el efecto de scroll del
 * hero». Antes el hero además se inclinaba hacia atrás, se achicaba y se redondeaba como una tarjeta,
 * y las esquinas de la hoja se enderezaban al llegar: eran un transform 3D, un clip-path y un
 * border-radius escritos en cada cuadro. Ahora con el scroll solo cambia la opacidad de un velo.
 * El anclado es CSS (sticky): el compositor lo mueve con el scroll, sin el temblor de un anclado por
 * JS (ANIMACION.md § 1). En el celular no hay transición. Sin animación (movimiento reducido): el hero
 * y «Nosotros» de siempre, uno debajo del otro.
 */

import Image from "next/image";
import { type RefObject, useEffect, useRef, useState } from "react";
import { AboutSection } from "~/components/axium/about-section";
import {
  Botones,
  NOCHE,
  display,
  encuadrePortada,
  marcoCaja,
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

/** el cuerpo del hero real (34f): la escena, el titular, los botones y las cifras */
function CuerpoHero({
  transicion,
  alHueco,
  acercamiento,
  luzMax,
  altoContenido = false,
  refOcultar,
}: {
  transicion?: OpcionesReel["transicion"];
  alHueco?: OpcionesReel["alHueco"];
  acercamiento?: number;
  luzMax?: number;
  /** crece con su contenido (min-h) en vez de medir justo una pantalla: en un iPhone SE el hero
   *  no entra en 667 px y con alto fijo se cortaba el botón principal */
  altoContenido?: boolean;
  /** pausa la escena mientras la sección siguiente la tapa del todo */
  refOcultar?: { current: ((o: boolean) => void) | null };
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
    marco: () => marcoCaja(lienzo.current),
  });
  if (refOcultar) refOcultar.current = reel.ocultar;
  return (
    <section
      // en el celular mide justo una pantalla (svh: con las barras del navegador a la vista), y lo
      // que sobra lo toma la imagen del objeto; en escritorio crece con su contenido
      // en escritorio el fondo (degradado y las tres manchas que antes pintaba la escena) va en CSS,
      // .fondo-noche, y el lienzo es solo la caja del objeto
      className={`fondo-noche relative isolate flex h-[100svh] w-full touch-pan-y select-none flex-col overflow-hidden ${altoContenido ? "lg:h-auto lg:min-h-[100svh]" : ""}`}
    >
      <span
        aria-hidden="true"
        className="fondo-noche-veta pointer-events-none absolute -z-[6] hidden lg:block"
      />
      <span
        aria-hidden="true"
        className="grano-hero pointer-events-none absolute inset-0 -z-[5]"
      />
      {/* La escena: en escritorio cubre todo el hero, detrás del texto; en el celular es la franja
          que dejan el titular y los botones, así el hero nunca pasa de una pantalla. En el celular
          también gira desde el 2026-10-24 (antes ahí solo iba la imagen fija); lo que sigue
          apagado ahí es la transición entre secciones */}
      <div className="hero-caja relative mx-auto mt-16 min-h-[88px] w-full max-w-[440px] flex-1 lg:absolute lg:-z-10 lg:mx-0 lg:mt-0 lg:min-h-0 lg:max-w-none lg:flex-none">
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
      {/* Sin botón de pausa (2026-10-24, «que siempre gire») ni el aviso «Arrastra para girarlo»
          (2026-11-03, «quita el texto»). En escritorio el bloque del texto cubre la escena (su relleno
          de arriba es media pantalla) y se quedaba con el clic: el arrastre nunca llegaba al lienzo.
          No toma el puntero salvo en sus enlaces y botones */}
      <div className="container-section flex w-full flex-col justify-end lg:pointer-events-none lg:flex-1 lg:[&_a]:pointer-events-auto lg:[&_button]:pointer-events-auto">
        <div className="content-section pt-3 pb-8 lg:pt-[50svh] lg:pb-12">
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

function SinAnimacion() {
  return (
    <>
      <CuerpoHero />
      <AboutSection />
    </>
  );
}

export function HeroProfundidad() {
  const reducido = useMovimientoReducido();
  const escenario = useRef<HTMLDivElement>(null);
  const velo = useRef<HTMLDivElement>(null);
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
      const escritorio = window.innerWidth >= 1024;
      if (velo.current)
        velo.current.style.opacity = escritorio ? String(suave(p) * 0.6) : "0";
      // tapado del todo por la hoja: no se dibuja (mientras se ve, sigue girando también al bajar)
      ocultar.current?.(escritorio && p >= 0.995);
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
        <CuerpoHero altoContenido refOcultar={ocultar} />
        <div
          ref={velo}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[#01030b] opacity-0"
        />
      </div>
      <div
        // la hoja que sube, con las esquinas redondeadas y la sombra fijas, solo en escritorio: en el
        // celular «Nosotros» va recto debajo del hero (2026-10-24, «que no tenga bordeado en móvil»)
        className="relative z-10 overflow-hidden bg-white lg:rounded-t-[36px] lg:shadow-[0_-40px_80px_-20px_rgba(1,4,16,0.55)]"
        data-nav-theme="light"
      >
        <AboutSection />
      </div>
    </div>
  );
}
