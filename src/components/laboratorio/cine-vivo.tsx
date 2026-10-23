"use client";

// Laboratorio 3D · cine en vivo (2026-10-16): la misma película que /laboratorio/cine pero en tiempo
// real (escena-cine-vivo.ts). La interfaz es la del cine de vídeo; cambia la entrada:
//   · el gesto no espera ni se encola: cambia el destino del muelle y la escena gira a mitad de viaje
//   · detección de inercia del trackpad (ANIMACION.md § 2): un gesto = un paso, nunca dos
//   · el puntero inclina el grupo y enciende la pieza que tiene debajo

import { ArrowRight, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ControlLab } from "~/components/laboratorio/base";
import {
  CAPITULOS,
  ESTADOS,
  NOMBRES,
  Sonido,
} from "~/components/laboratorio/cine-comun";
import type { EstadoCineVivo } from "~/components/laboratorio/escena-cine-vivo";

export function CineVivo() {
  const lienzo = useRef<HTMLDivElement>(null);
  const control = useRef<ControlLab | null>(null);
  const sonido = useRef<Sonido | null>(null);
  const objetivo = useRef(0);
  const [estado, setEstado] = useState<EstadoCineVivo | null>(null);
  const [destino, setDestino] = useState(0);
  const [conSonido, setConSonido] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [vertical, setVertical] = useState(false);
  const [sinWebgl, setSinWebgl] = useState(false);
  const [ficha, setFicha] = useState(false);

  useEffect(() => {
    const el = lienzo.current;
    if (!el) return;
    const medir = () => setVertical(innerWidth / innerHeight < 0.9);
    medir();
    addEventListener("resize", medir);
    let vivo = true;
    import("~/components/laboratorio/escena-cine-vivo").then((m) => {
      if (!vivo) return;
      control.current = m.crearCineVivo(el, setEstado);
      if (!control.current) setSinWebgl(true);
    });
    return () => {
      vivo = false;
      removeEventListener("resize", medir);
      control.current?.liberar();
      control.current = null;
    };
  }, []);

  const ir = useCallback((n: number) => {
    const d = Math.min(ESTADOS - 1, Math.max(0, n));
    if (d === objetivo.current) return;
    if (sonido.current) sonido.current.rafaga(1.5);
    objetivo.current = d;
    setDestino(d);
    control.current?.accion?.(`ir:${d}`);
  }, []);

  // entrada: un gesto = un paso, con detección de la inercia de macOS (solo decrece)
  const listo = !!estado?.listo;
  useEffect(() => {
    if (!listo) return;
    let acumulado = 0;
    let disparado = false;
    let ultimoT = 0;
    let ultimoAbs = 0;
    let ultimoSigno = 0;
    let bajando = false;
    const rueda = (e: WheelEvent) => {
      const d =
        e.deltaY *
        (e.deltaMode === 1 ? 100 / 6 : e.deltaMode === 2 ? innerHeight : 1);
      const abs = Math.abs(d);
      if (abs < 0.5) return;
      const ahora = e.timeStamp; // la hora del evento, no la de atenderlo (con el hilo ocupado llegan en tanda)
      const signo = Math.sign(d);
      const pausa = ahora - ultimoT;
      // tras una pausa solo es gesto nuevo si la magnitud SUBE: la inercia que llega tarde sigue cayendo
      const nuevo =
        pausa > 800 ||
        (pausa > 220 && abs > ultimoAbs) ||
        signo !== ultimoSigno ||
        (bajando && abs > ultimoAbs * 1.6 && abs > 10);
      if (nuevo) {
        acumulado = 0;
        disparado = false;
        bajando = false;
      } else if (abs < ultimoAbs * 0.98) bajando = true;
      ultimoT = ahora;
      ultimoAbs = abs;
      ultimoSigno = signo;
      acumulado += d;
      if (!disparado && Math.abs(acumulado) > 40) {
        disparado = true;
        ir(objetivo.current + (acumulado > 0 ? 1 : -1));
      }
    };
    const tecla = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        ir(objetivo.current + 1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        ir(objetivo.current - 1);
      } else if (e.key === "Home") ir(0);
      else if (e.key === "End") ir(ESTADOS - 1);
    };
    let y0 = 0;
    const inicio = (e: TouchEvent) => {
      y0 = e.touches[0]?.clientY ?? 0;
    };
    const fin = (e: TouchEvent) => {
      const dy = y0 - (e.changedTouches[0]?.clientY ?? y0);
      if (Math.abs(dy) > 45) ir(objetivo.current + (dy > 0 ? 1 : -1));
    };
    addEventListener("wheel", rueda, { passive: true });
    addEventListener("keydown", tecla);
    addEventListener("touchstart", inicio, { passive: true });
    addEventListener("touchend", fin, { passive: true });
    return () => {
      removeEventListener("wheel", rueda);
      removeEventListener("keydown", tecla);
      removeEventListener("touchstart", inicio);
      removeEventListener("touchend", fin);
    };
  }, [listo, ir]);

  const alternarSonido = () => {
    if (!sonido.current) sonido.current = new Sonido();
    const si = !conSonido;
    sonido.current.activar(si);
    if (si) sonido.current.clic(1200);
    setConSonido(si);
  };
  const tic = () => conSonido && sonido.current?.clic(2200);

  const quieto = estado && !estado.enViaje ? estado.capitulo : -1;
  const cap = CAPITULOS[
    quieto >= 0 ? quieto : destino
  ] as (typeof CAPITULOS)[number];
  const ultimo = ESTADOS - 1;
  const centrado = (quieto >= 0 ? quieto : destino) === ultimo;

  return (
    <main className="relative h-[100svh] w-full touch-none select-none overflow-hidden bg-[#020717] text-white">
      <div ref={lienzo} className="absolute inset-0" aria-hidden="true" />
      <div
        className={`pointer-events-none absolute inset-0 ${vertical || centrado ? "bg-[linear-gradient(to_top,rgba(2,7,23,0.85)_0%,rgba(2,7,23,0.35)_38%,transparent_60%)]" : "bg-[linear-gradient(to_right,rgba(2,7,23,0.8)_0%,rgba(2,7,23,0.3)_42%,transparent_62%)]"}`}
      />

      {/* carga */}
      <div
        className={`absolute inset-0 z-30 grid place-items-center bg-[#020717] transition-opacity duration-700 ${listo || sinWebgl ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">
          Preparando el estudio…
        </p>
      </div>
      {sinWebgl && (
        <p className="absolute inset-0 z-30 grid place-items-center text-white/70">
          Este navegador no tiene WebGL.
        </p>
      )}

      {/* marcas de esquina */}
      <div
        className="pointer-events-none absolute inset-4 z-10 lg:inset-6"
        aria-hidden="true"
      >
        {[
          "left-0 top-0 border-l border-t",
          "right-0 top-0 border-r border-t",
          "bottom-0 left-0 border-b border-l",
          "bottom-0 right-0 border-b border-r",
        ].map((c) => (
          <span key={c} className={`absolute h-3 w-3 border-white/30 ${c}`} />
        ))}
      </div>

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-7 py-7 text-[13px] lg:px-10">
        <Link href="/laboratorio" className="font-medium tracking-tight">
          axium<span className="text-white/40"> · laboratorio</span>
        </Link>
        <button
          type="button"
          onClick={() => setFicha(!ficha)}
          aria-expanded={ficha}
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 hover:text-white"
        >
          {ficha ? "Cerrar" : "¿Cómo está hecho?"}
        </button>
      </header>

      {ficha && (
        <div className="absolute right-7 top-16 z-30 w-[min(calc(100vw-56px),380px)] rounded-xl border border-white/15 bg-[#020717]/85 p-5 text-[13px] leading-relaxed text-white/80 backdrop-blur lg:right-10">
          <p className="font-medium text-white">
            Tiempo real: la misma película, sin vídeo
          </p>
          <ul className="mt-3 space-y-1.5">
            <li>three.js · los 5 estados del render de Blender, en vivo</li>
            <li>
              El capítulo es un valor continuo con muelle crítico: el gesto
              cambia el destino a mitad de viaje
            </li>
            <li>Desenfoque de movimiento direccional en un solo pase final</li>
            <li>Laca, cerámica y vidrio con transmisión a media resolución</li>
            <li>
              {estado
                ? `${estado.fps} fps · ${estado.llamadas} llamadas`
                : "midiendo…"}
            </li>
          </ul>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/50">
            Rueda · flechas · deslizar · índice · cursor
          </p>
        </div>
      )}

      <nav
        aria-label="Capítulos"
        className="absolute right-7 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-3 sm:flex lg:right-10"
      >
        {NOMBRES.map((n, i) => (
          <button
            key={n}
            type="button"
            onClick={() => ir(i)}
            onMouseEnter={tic}
            aria-current={destino === i ? "step" : undefined}
            className="group flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em]"
          >
            <span
              className={`transition-opacity ${destino === i ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`}
            >
              {n}
            </span>
            <span className="tabular-nums text-white/50">0{i}</span>
            <span
              className={`h-px transition-all duration-500 ${destino === i ? "w-8 bg-white" : "w-4 bg-white/35"}`}
            />
          </button>
        ))}
      </nav>

      <section
        aria-live="polite"
        className={`pointer-events-none absolute z-20 px-7 transition-all lg:px-10 ${quieto < 0 || !listo ? "translate-y-3 opacity-0 duration-200" : "translate-y-0 opacity-100 duration-700"} ${vertical || centrado ? "inset-x-0 bottom-24 text-center sm:bottom-28" : "bottom-28 left-0 max-w-[620px]"}`}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6FC3FF]">
          {cap.marca}
        </p>
        <h1
          className={`mt-4 text-[34px] leading-[1.04] tracking-[-0.03em] sm:text-[48px] ${centrado && !vertical ? "mx-auto max-w-[26ch] lg:text-[44px]" : vertical ? "mx-auto max-w-[18ch] lg:text-[60px]" : "max-w-[16ch] lg:text-[60px]"}`}
        >
          {cap.titulo}
        </h1>
        {cap.texto && (
          <p
            className={`mt-5 text-[15px] leading-relaxed text-white/70 sm:text-[17px] ${vertical || centrado ? "mx-auto max-w-[36ch]" : "max-w-[40ch]"}`}
          >
            {cap.texto}
          </p>
        )}
        {centrado && (
          <Link
            href="/#contacto"
            onMouseEnter={tic}
            className="pointer-events-auto mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[14px] font-medium text-[#020717] transition-colors hover:bg-[#6FC3FF]"
          >
            Hablemos de tu proyecto <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </section>

      <footer className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-7 pb-7 font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 lg:px-10">
        <button
          type="button"
          onClick={alternarSonido}
          aria-pressed={conSonido}
          className="flex items-center gap-2 hover:text-white"
        >
          <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
            {[0.5, 1, 0.7].map((h) => (
              <span
                key={h}
                className="w-[2px] bg-current"
                style={{ height: conSonido ? `${h * 100}%` : "2px" }}
              />
            ))}
          </span>
          Sonido: {conSonido ? "sí" : "no"}
        </button>
        <span className="hidden sm:inline">
          {destino < ultimo ? "Desliza" : ""}
        </span>
        <button
          type="button"
          onClick={() => {
            setPausado(!pausado);
            control.current?.pausar(!pausado);
          }}
          aria-label={pausado ? "Reanudar la animación" : "Pausar la animación"}
          className="grid h-8 w-8 place-items-center rounded-full border border-white/25 text-white hover:border-white/60"
        >
          {pausado ? (
            <Play className="h-3 w-3" />
          ) : (
            <Pause className="h-3 w-3" />
          )}
        </button>
      </footer>
    </main>
  );
}
