"use client";

// Laboratorio 3D · tres mundos (2026-10-16): el isotipo como tres ventanas a tres mundos (ver
// escena-portales.ts). Aquí el HTML: textos por plano (la escena fija su opacidad), el nombre de la
// ventana bajo el cursor y el largo del scroll, que lo da la escena.

import { ArrowRight, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ControlLab } from "~/components/laboratorio/base";
import type { EstadoPortales } from "~/components/laboratorio/escena-portales";

const MUNDOS = ["Diseño", "Software", "IA"];
const TEXTOS: {
  marca: string;
  titulo: string;
  texto: string;
  lado: "abajo" | "izq" | "der" | "centro";
  /** el mundo de Diseño es claro: ahí el texto va en tinta oscura (blanco sobre pastel no se lee) */
  claro?: boolean;
}[] = [
  {
    marca: "Axium · tres oficios",
    titulo: "Cada pieza es una ventana.",
    texto: "Mueve el cursor y mira dentro. Desliza para entrar.",
    lado: "abajo",
  },
  {
    marca: "01 — Diseño",
    titulo: "Donde las ideas toman forma.",
    texto:
      "Marca, interfaz y producto con un mismo criterio visual, de la primera línea al último detalle.",
    lado: "izq",
    claro: true,
  },
  {
    marca: "02 — Software",
    titulo: "Sistemas que no duermen.",
    texto:
      "Plataformas, paneles e integraciones construidos para el día a día de tu operación.",
    lado: "der",
  },
  {
    marca: "03 — IA",
    titulo: "Inteligencia conectada a tu negocio.",
    texto: "Asistentes, automatizaciones y datos que trabajan contigo.",
    lado: "izq",
  },
  {
    marca: "04 — Hablemos",
    titulo: "Un solo equipo para los tres mundos.",
    texto: "Diseño, software e IA, de la primera idea a producción.",
    lado: "centro",
  },
];

export function Portales() {
  const lienzo = useRef<HTMLDivElement>(null);
  const textos = useRef<(HTMLDivElement | null)[]>([]);
  const control = useRef<ControlLab | null>(null);
  const [estado, setEstado] = useState<EstadoPortales | null>(null);
  const [pausado, setPausado] = useState(false);
  const [sinWebgl, setSinWebgl] = useState(false);

  useEffect(() => {
    history.scrollRestoration = "manual";
    scrollTo(0, 0);
    const el = lienzo.current;
    if (!el) return;
    let vivo = true;
    import("~/components/laboratorio/escena-portales").then((m) => {
      if (!vivo) return;
      control.current = m.crearPortales(
        el,
        setEstado,
        textos.current.filter((t): t is HTMLDivElement => !!t)
      );
      if (!control.current) setSinWebgl(true);
    });
    return () => {
      vivo = false;
      control.current?.liberar();
      control.current = null;
    };
  }, []);

  const listo = !!estado?.listo;
  const posicion = (lado: (typeof TEXTOS)[number]["lado"]) =>
    ({
      abajo:
        "bottom-24 left-5 right-5 lg:left-10 lg:bottom-28 lg:max-w-[600px]",
      izq: "bottom-24 left-5 right-5 lg:left-10 lg:right-auto lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2 lg:max-w-[440px]",
      der: "bottom-24 left-5 right-5 lg:left-auto lg:right-12 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2 lg:max-w-[440px]",
      centro:
        "bottom-24 left-5 right-5 text-center lg:bottom-auto lg:top-[66%] lg:left-1/2 lg:right-auto lg:w-[640px] lg:-translate-x-1/2",
    })[lado];

  return (
    <main className="relative bg-[#0A0C12] text-white">
      <div
        ref={lienzo}
        aria-hidden="true"
        className="fixed inset-0 z-0 h-[100lvh] w-full"
      />
      <div
        className={`fixed inset-0 z-40 grid place-items-center bg-[#0A0C12] transition-opacity duration-700 ${listo || sinWebgl ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">
          Abriendo las ventanas…
        </p>
      </div>
      {sinWebgl && (
        <p className="fixed inset-0 z-40 grid place-items-center text-white/70">
          Este navegador no tiene WebGL.
        </p>
      )}

      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between px-5 py-5 lg:px-10 lg:py-7">
        <Link
          href="/laboratorio"
          className="pointer-events-auto text-[13px] font-medium tracking-tight"
        >
          axium<span className="text-white/40"> · laboratorio</span>
        </Link>
        <p
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/60"
          aria-live="polite"
        >
          {estado && estado.ventana >= 0
            ? `Ventana · ${MUNDOS[estado.ventana]}`
            : "Tres mundos"}
        </p>
      </header>

      <div className="pointer-events-none fixed inset-0 z-10">
        {TEXTOS.map((t, i) => (
          <div key={t.titulo} className={`absolute ${posicion(t.lado)}`}>
            <div
              ref={(el) => {
                textos.current[i] = el;
              }}
              className={`opacity-0 ${t.claro ? "text-[#1B2240]" : "[text-shadow:0_1px_24px_rgba(5,6,10,0.55)]"}`}
            >
              <p
                className={`font-mono text-[11px] uppercase tracking-[0.16em] ${t.claro ? "text-[#0072A8]" : "text-[#8EC8FF]"}`}
              >
                {t.marca}
              </p>
              <h2
                className={`mt-3 text-[34px] font-medium leading-[1.03] tracking-[-0.03em] sm:text-[46px] lg:text-[56px] ${t.lado === "centro" ? "mx-auto max-w-[18ch]" : "max-w-[15ch]"}`}
              >
                {t.titulo}
              </h2>
              <p
                className={`mt-4 max-w-[40ch] text-[15px] leading-relaxed sm:text-[16px] ${t.claro ? "text-[#1B2240]/80" : "text-white/75"} ${t.lado === "centro" ? "mx-auto" : ""}`}
              >
                {t.texto}
              </p>
              {t.lado === "centro" && (
                <Link
                  href="/#contacto"
                  className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[14px] font-medium text-[#0A0C12] transition-colors hover:bg-[#8EC8FF]"
                >
                  Hablemos de tu proyecto <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between px-5 pb-5 font-mono text-[11px] text-white/55 lg:px-10 lg:pb-7">
        <span>{MUNDOS.join(" · ")}</span>
        <div className="flex items-center gap-3">
          <span className="hidden tabular-nums sm:inline">
            {estado?.listo
              ? `${estado.fps} fps · ${estado.llamadas} llamadas`
              : ""}
          </span>
          <button
            type="button"
            aria-label={
              pausado ? "Reanudar la animación" : "Pausar la animación"
            }
            onClick={() => {
              setPausado(!pausado);
              control.current?.pausar(!pausado);
            }}
            className="grid h-8 w-8 place-items-center rounded-full border border-white/25 hover:border-white/60"
          >
            {pausado ? (
              <Play className="h-3 w-3" />
            ) : (
              <Pause className="h-3 w-3" />
            )}
          </button>
        </div>
      </footer>

      {/* el largo del recorrido: ~70 svh por unidad (lo da la escena al cargar) */}
      <div
        aria-hidden="true"
        style={{ height: `${Math.round((estado?.total ?? 16) * 70)}svh` }}
      />
    </main>
  );
}
