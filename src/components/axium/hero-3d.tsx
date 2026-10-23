"use client";

/*
 * El hero del inicio en 3D: las tres piezas del isotipo de Axium en vidrio grueso con el reel de
 * nuestros proyectos publicados dentro (idea de hypersolid.com), sobre un degradado sutil con grano.
 * three.js se carga con import() al montar, en su propio chunk: el resto de la web no lo descarga.
 * Sin WebGL, el hero se lee igual sin la escena; con movimiento reducido, queda quieto.
 * Lo que queda es lo que usa la portada (la 34f, dentro de la transición t2 de hero-transiciones):
 * centrada arriba, da la vuelta hacia un solo lado y se gira arrastrando, con inercia. Las variantes
 * 34j y 34k se borraron el 2026-10-23; las demás de la 34 y la 38 están respaldadas en el taller del
 * hero (.claude/skills/portafolio-axium/capturas-clientes/axium-hero/2026-10/descartadas-2026-10-15/).
 */

import { Pause, Play } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { type RefObject, useEffect, useRef, useState } from "react";
import type {
  Encuadre,
  OpcionesReel,
  PaletaFondo,
} from "~/components/axium/tres/escenas";
import type { Control } from "~/components/axium/tres/motor";
import { useTranslation } from "~/hooks/useTranslation";

const ease = [0.4, 0, 0.2, 1] as const;
const display = { fontFamily: "var(--font-family-heading)" };
const entra = (d = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: d, ease },
});

function Botones() {
  const { t } = useTranslation("landing");
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={() =>
          document
            .getElementById("contacto")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-[#0A1020] transition-colors hover:bg-[#7ECFC3]"
      >
        {t("home.hero.cta")}
      </button>
      <Link
        href="/portafolio"
        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-[15px] font-medium text-white transition-colors hover:border-white/60"
      >
        {t("home.hero.ctaSecondary")}
      </Link>
    </div>
  );
}

// El reel (hacer-reel-p33.py en el taller): Aurore, ANJ Sports, Bookit, Rematch, Feniz, Vendiq y
// scraping con IA, 2,2 s cada uno. Recodificado el 2026-10-23 a la medida en que se ve (el objeto
// mide ~300 px de alto en escritorio): 960 px (821 KB) y 640 px en el celular (387 KB); el original
// de 1280 px pesaba 2,3 MB y se bajaba igual en el teléfono.
const REEL = "/images/hero-propuestas/p33-reel-960.mp4";
const REEL_MOVIL = "/images/hero-propuestas/p33-reel-640.mp4";

/** Corre `fn` cuando la página ya cargó y el navegador está libre: three.js y el vídeo no compiten
 *  con la primera pintura ni con la hidratación. Devuelve con qué cancelarlo. */
function cuandoLibre(fn: () => void) {
  let id = 0;
  const pedir = () => {
    id = window.requestIdleCallback
      ? window.requestIdleCallback(fn, { timeout: 1200 })
      : window.setTimeout(fn, 200);
  };
  if (document.readyState === "complete") pedir();
  else window.addEventListener("load", pedir, { once: true });
  return () => {
    window.removeEventListener("load", pedir);
    if (window.cancelIdleCallback) window.cancelIdleCallback(id);
    window.clearTimeout(id);
  };
}

type ExtraReel = Pick<
  OpcionesReel,
  "giro" | "interaccion" | "transicion" | "alHueco" | "acercamiento" | "luzMax"
>;

function useReel(
  ref: RefObject<HTMLDivElement | null>,
  paleta: PaletaFondo,
  encuadre: (w: number, h: number) => Encuadre,
  extra: ExtraReel = {}
) {
  const control = useRef<Control | null>(null);
  // las opciones se leen al montar (el encuadre cambia de identidad en cada render)
  const opciones = useRef({ encuadre, ...extra });
  opciones.current = { encuadre, ...extra };
  const [pausado, setPausado] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      setPausado(true);
    let vivo = true;
    const cancelar = cuandoLibre(() =>
      import("~/components/axium/tres/escenas").then((m) => {
        if (!vivo) return;
        control.current = m.montar(
          el,
          m.escenaReel({
            video: window.innerWidth < 768 ? REEL_MOVIL : REEL,
            paleta,
            ...opciones.current,
          })
        );
        // el texto entra con un desplazamiento y las fuentes cambian el maquetado: reencuadrar
        document.fonts?.ready.then(() => control.current?.medir());
        setTimeout(() => control.current?.medir(), 900);
      })
    );
    return () => {
      vivo = false;
      cancelar();
      control.current?.liberar();
      control.current = null;
    };
  }, [ref, paleta]);
  const alternar = () => {
    const nuevo = !pausado;
    setPausado(nuevo);
    control.current?.pausar(nuevo);
  };
  // tapada por la sección siguiente (transiciones t1–t3): el motor no dibuja nada, aunque siga
  // «en pantalla» para el IntersectionObserver (pausar no basta: con el puntero vuelve a dibujar)
  const ocultar = (o: boolean) => control.current?.ocultar(o);
  // el progreso de una transición con el scroll (t1–t3) entra a la escena por accion()
  const accion = (v: number) => control.current?.accion(v);
  return { pausado, alternar, accion, ocultar };
}

function BotonPausa({
  pausado,
  alternar,
}: {
  pausado: boolean;
  alternar: () => void;
}) {
  const { t } = useTranslation("landing");
  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={t(pausado ? "home.hero.play" : "home.hero.pause")}
      className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-white/5 text-white backdrop-blur-sm transition-colors hover:border-white/60"
    >
      {pausado ? (
        <Play className="h-3.5 w-3.5" />
      ) : (
        <Pause className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

// ── 34f · Tres piezas, un solo equipo ────────────────────────────────────────
// «Está bueno el 34»; pulida («exageraste mucho… el fondo, algo abstracto pero sutil; los servicios
// tampoco en la portada»), sin «En el vidrio:» (solo reproducir y pausar) y sin el eyebrow
// «SOFTWARE HOUSE · LIMA, PERÚ». La 34f es la centrada. Como portada (2026-10-15): «¿por qué no puedo
// arrastrar con el mouse? … que todo gire hacia un mismo lado, excepto al arrastrar, pero al final
// volverá al sentido inicial»: da la vuelta siempre hacia el mismo lado y se arrastra con inercia;
// al soltar, el impulso se apaga y sigue girando como antes. La 34j se balancea y lleva otro titular.
const NOCHE: PaletaFondo = {
  base: ["#020820", "#041034", "#071a4a"],
  manchas: [
    "rgba(0,114,207,0.22)",
    "rgba(60,140,220,0.07)",
    "rgba(126,207,195,0.05)",
  ],
};
const FONDO_NOCHE = `linear-gradient(135deg, ${NOCHE.base[0]} 0%, ${NOCHE.base[1]} 60%, ${NOCHE.base[2]} 100%)`;

// en escritorio, centrado arriba; en móvil, en la franja de arriba (la pausa va justo debajo:
// top-[calc(60px+min(42svh,380px))], la misma cuenta que acá)
function encuadrePortada(w: number, h: number) {
  if (w >= 1024 && w / h > 1.05)
    return { cx: 0.5, cy: 0.29, alto: Math.min(h * 0.33, w * 0.22) };
  const banda = Math.min(window.innerHeight * 0.42, 380);
  return {
    cx: 0.5,
    cy: (60 + banda / 2) / h,
    alto: Math.min(banda * 0.8, w * 0.62),
  };
}

// lo que usa la portada del inicio (hero-transiciones.tsx)
export {
  BotonPausa,
  Botones,
  FONDO_NOCHE,
  NOCHE,
  display,
  encuadrePortada,
  entra,
  useReel,
};
