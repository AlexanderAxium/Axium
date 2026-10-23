"use client";

// Laboratorio 3D · la sala: escena horneada en Blender + agua, vidrio, haces y polvo en tiempo real
// (ver escena-sala.ts). El scroll lleva la cámara por cuatro capítulos y la saca por el isotipo.

import { Pause, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type {
  ControlSala,
  EstadoSala,
} from "~/components/laboratorio/escena-sala";

const CAPITULOS = [
  {
    nombre: "Luz",
    titulo: "La luz entra con forma.",
    texto: "El sol atraviesa el isotipo del muro y lo dibuja en el agua.",
    tecnica:
      "Luz horneada en Blender (Cycles) · un atlas KTX2 · cero luces en tiempo real",
  },
  {
    nombre: "Equipo",
    titulo: "Diseño, software e IA. Un solo equipo.",
    texto: "Las tres piezas, en vidrio, flotando sobre la luz.",
    tecnica:
      "Transmisión física · entorno del cielo horneado · haces aditivos con polvo",
  },
  {
    nombre: "Trabajo",
    titulo: "Lo que ves dentro ya está publicado.",
    texto: "El reel de nuestros proyectos, refractado por el vidrio.",
    tecnica:
      "Vídeo pintado solo en la pasada de transmisión · agua con Reflector semitransparente",
  },
  {
    nombre: "Afuera",
    titulo: "Atravesar el muro.",
    texto: "La cámara sale por una de las piezas hacia las dunas.",
    tecnica: "Recorrido CatmullRom atado al scroll · terreno horneado aparte",
  },
];

export function Sala() {
  const lienzo = useRef<HTMLDivElement>(null);
  const textos = useRef<(HTMLDivElement | null)[]>([]);
  const control = useRef<ControlSala | null>(null);
  const [estado, setEstado] = useState<EstadoSala | null>(null);
  const [pausado, setPausado] = useState(false);
  const [post, setPost] = useState(true);
  const [sinWebgl, setSinWebgl] = useState(false);

  useEffect(() => {
    const el = lienzo.current;
    if (!el) return;
    let vivo = true;
    import("~/components/laboratorio/escena-sala").then((m) => {
      if (!vivo) return;
      control.current = m.crearSala(
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

  const cap = estado?.capitulo ?? 0;
  const listo = !!estado?.listo;
  const boton =
    "inline-flex h-9 items-center gap-2 rounded-full border border-white/25 bg-black/25 px-4 text-[12px] text-white backdrop-blur transition-colors hover:border-white/60";

  return (
    <main className="relative bg-[#1b2233] text-white">
      <div
        ref={lienzo}
        aria-hidden="true"
        className="fixed inset-0 z-0 h-[100lvh] w-full"
      />

      {/* carga */}
      <div
        className={`fixed inset-0 z-30 grid place-items-center bg-[#1b2233] transition-opacity duration-700 ${listo || sinWebgl ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <div className="w-[220px] text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/60">
            Cargando la sala
          </p>
          <div className="mt-3 h-px w-full bg-white/15">
            <div
              className="h-px bg-white transition-[width] duration-300"
              style={{ width: `${Math.round((estado?.cargado ?? 0) * 100)}%` }}
            />
          </div>
        </div>
      </div>
      {sinWebgl && (
        <p className="fixed inset-0 z-30 grid place-items-center text-white/70">
          Este navegador no tiene WebGL.
        </p>
      )}

      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/laboratorio"
            className="text-[13px] text-white/70 hover:text-white"
          >
            ← Laboratorio
          </Link>
          <span className="hidden font-mono text-[12px] uppercase tracking-[0.12em] sm:inline">
            La sala · luz horneada
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={boton}
            aria-pressed={post}
            onClick={() => {
              setPost(!post);
              control.current?.postproceso(!post);
            }}
          >
            Postproceso: {post ? "sí" : "no"}
          </button>
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

      <nav
        aria-label="Capítulos"
        className="fixed left-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 lg:left-8 lg:flex"
      >
        {CAPITULOS.map((c, i) => (
          <span
            key={c.nombre}
            className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${i === cap ? "text-white" : "text-white/40"}`}
          >
            <span
              className={`h-1.5 w-1.5 ${i === cap ? "bg-white" : "bg-white/30"}`}
            />
            {c.nombre}
          </span>
        ))}
      </nav>

      <div className="fixed bottom-4 right-5 z-20 rounded-lg border border-white/15 bg-black/30 px-3 py-2 font-mono text-[11px] text-white/75 backdrop-blur lg:right-8">
        {estado?.listo
          ? `${estado.fps} fps · ${estado.llamadas} llamadas`
          : "…"}
      </div>

      {/* textos: los muestra la escena en la pausa de cada plano (planos.ts), no el scroll del DOM */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[12svh] z-10 px-5">
        {CAPITULOS.map((c, i) => (
          <div
            key={c.nombre}
            ref={(el) => {
              textos.current[i] = el;
            }}
            className="absolute inset-x-0 bottom-0 mx-auto max-w-[680px] text-center opacity-0 [text-shadow:0_1px_24px_rgba(10,16,32,0.45)]"
          >
            <h2 className="text-[34px] leading-[1.02] tracking-[-0.025em] sm:text-[48px] lg:text-[60px]">
              {c.titulo}
            </h2>
            <p className="mx-auto mt-4 max-w-[44ch] text-[16px] leading-relaxed text-white/85">
              {c.texto}
            </p>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
              {c.tecnica}
            </p>
          </div>
        ))}
      </div>
      {/* el largo del recorrido: ~1 pantalla por unidad de la línea de tiempo */}
      <div aria-hidden="true" className="h-[900svh]" />
    </main>
  );
}
