"use client";

// Marco común de las páginas del laboratorio 3D: lienzo a pantalla completa, cabecera con vuelta al
// índice, pausa, medidas (fps y llamadas) y una ficha con qué técnica se prueba y cómo interactuar.

import { Pause, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ControlLab, Medidas } from "~/components/laboratorio/base";

export type Crear = (
  el: HTMLElement,
  alMedir: (m: Medidas) => void
) => ControlLab | null;

export function PaginaLab({
  titulo,
  tecnica,
  interaccion,
  cargar,
  acciones,
  oscuro = true,
}: {
  titulo: string;
  tecnica: string[];
  interaccion: string;
  /** import() del módulo de la escena (three viaja en su propio chunk) */
  cargar: () => Promise<Crear>;
  /** botones propios del ejemplo: [etiqueta, valor] */
  acciones?: [string, string][];
  oscuro?: boolean;
}) {
  const lienzo = useRef<HTMLDivElement>(null);
  const control = useRef<ControlLab | null>(null);
  const [medidas, setMedidas] = useState<Medidas | null>(null);
  const [pausado, setPausado] = useState(false);
  const [sinWebgl, setSinWebgl] = useState(false);
  const [accion, setAccion] = useState(acciones?.[0]?.[1]);
  const [ficha, setFicha] = useState(true);

  useEffect(() => {
    const el = lienzo.current;
    if (!el) return;
    let vivo = true;
    cargar().then((crear) => {
      if (!vivo) return;
      control.current = crear(el, setMedidas);
      if (!control.current) setSinWebgl(true);
    });
    return () => {
      vivo = false;
      control.current?.liberar();
      control.current = null;
    };
  }, [cargar]);

  const tinta = oscuro ? "text-white" : "text-[#111]";
  const borde = oscuro
    ? "border-white/20 bg-black/30"
    : "border-black/15 bg-white/60";
  const boton = `inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[12px] backdrop-blur transition-colors ${borde} ${tinta}`;

  return (
    <main
      className={`relative h-[100svh] w-full overflow-hidden ${oscuro ? "bg-[#05070d]" : "bg-[#ececef]"} ${tinta}`}
    >
      <div ref={lienzo} className="absolute inset-0" aria-hidden="true" />
      {sinWebgl && (
        <p className="absolute inset-0 grid place-items-center opacity-70">
          Este navegador no tiene WebGL.
        </p>
      )}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4 lg:px-8">
        <div className="pointer-events-auto flex items-center gap-4">
          <Link
            href="/laboratorio"
            className="text-[13px] opacity-70 hover:opacity-100"
          >
            ← Laboratorio
          </Link>
          <span className="hidden font-mono text-[12px] uppercase tracking-[0.12em] sm:inline">
            {titulo}
          </span>
        </div>
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
          {acciones?.map(([etiqueta, valor]) => (
            <button
              key={valor}
              type="button"
              aria-pressed={accion === valor}
              className={`${boton} ${accion === valor ? (oscuro ? "!bg-white !text-black" : "!bg-black !text-white") : ""}`}
              onClick={() => {
                setAccion(valor);
                control.current?.accion?.(valor);
              }}
            >
              {etiqueta}
            </button>
          ))}
          <button
            type="button"
            className={boton}
            aria-label={
              pausado ? "Reanudar la animación" : "Pausar la animación"
            }
            onClick={() => {
              setPausado(!pausado);
              control.current?.pausar(!pausado);
            }}
          >
            {pausado ? (
              <Play className="h-3.5 w-3.5" />
            ) : (
              <Pause className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </header>

      {/* ficha: técnica e interacción */}
      <div className="pointer-events-none absolute bottom-4 left-5 z-10 max-w-[420px] lg:left-8">
        <div
          className={`pointer-events-auto rounded-xl border p-4 backdrop-blur ${borde}`}
        >
          <button
            type="button"
            onClick={() => setFicha(!ficha)}
            className="flex w-full items-center justify-between gap-4 text-left"
            aria-expanded={ficha}
          >
            <span className="text-[15px] font-medium">{titulo}</span>
            <span className="font-mono text-[11px] opacity-60">
              {ficha ? "ocultar" : "ver"}
            </span>
          </button>
          {ficha && (
            <>
              <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed opacity-80">
                {tecnica.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] opacity-60">
                {interaccion}
              </p>
            </>
          )}
        </div>
      </div>
      <div
        className={`absolute bottom-4 right-5 z-10 rounded-lg border px-3 py-2 font-mono text-[11px] backdrop-blur lg:right-8 ${borde}`}
      >
        {medidas ? `${medidas.fps} fps · ${medidas.llamadas} llamadas` : "…"}
      </div>
    </main>
  );
}
