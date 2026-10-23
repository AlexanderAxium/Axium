"use client";

// Laboratorio 3D: una página de pruebas, fuera del menú y sin indexar, para aprender lo que les falta
// a nuestras escenas (ver escena.ts). El lienzo queda fijo detrás y el scroll recorre cuatro capítulos.

import { Pause, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ControlLab, Medidas } from "~/components/laboratorio/escena";

const CAPITULOS = [
  {
    nombre: "Diseño",
    titulo: "Cromo, vidrio y un reflejo de verdad.",
    tecnica: [
      "Isotipo extruido con material físico metálico e iridiscente.",
      "Agua: un Reflector que vuelve a dibujar la escena desde abajo, a media resolución, con un shader propio que ondula el reflejo.",
      "Niebla exponencial del color del fondo: lo lejano se funde.",
    ],
  },
  {
    nombre: "Software",
    titulo: "Un río de 40 000 partículas.",
    tecnica: [
      "Un solo Points con ShaderMaterial: la posición de cada partícula se calcula en el vertex shader, la CPU no mueve nada.",
      "Tres hebras que serpentean; cada partícula nace, avanza y se apaga en su hebra.",
      "Mezcla aditiva y bloom: la luz se suma donde se juntan.",
    ],
  },
  {
    nombre: "IA",
    titulo: "Las partículas se ordenan.",
    tecnica: [
      "Cada partícula guarda dos sitios: su lugar en el río y un punto dentro del isotipo (muestreado de sus polígonos).",
      "El scroll mezcla uno con otro en la GPU, con un retraso propio por partícula y una espiral a mitad de camino.",
    ],
  },
  {
    nombre: "Trabajo",
    titulo: "Los proyectos, flotando en el espacio.",
    tecnica: [
      "Paneles con las portadas y el reel como textura; esquinas redondeadas y filo de luz en el shader.",
      "Se doblan y separan sus colores según la velocidad del scroll.",
      "Raycaster para saber qué panel está bajo el puntero.",
    ],
  },
];

export function Laboratorio() {
  const lienzo = useRef<HTMLDivElement>(null);
  const control = useRef<ControlLab | null>(null);
  const [medidas, setMedidas] = useState<Medidas | null>(null);
  const [pausado, setPausado] = useState(false);
  const [post, setPost] = useState(true);
  const [sinWebgl, setSinWebgl] = useState(false);

  useEffect(() => {
    const el = lienzo.current;
    if (!el) return;
    let vivo = true;
    import("~/components/laboratorio/escena").then((m) => {
      if (!vivo) return;
      control.current = m.crearLaboratorio(el, setMedidas);
      if (!control.current) setSinWebgl(true);
    });
    return () => {
      vivo = false;
      control.current?.liberar();
      control.current = null;
    };
  }, []);

  const cap = medidas?.capitulo ?? 0;
  const boton =
    "inline-flex h-9 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 text-[12px] text-white backdrop-blur transition-colors hover:border-white/50";

  return (
    <main className="relative bg-[#030818] text-white">
      <div
        ref={lienzo}
        aria-hidden="true"
        className="fixed inset-0 z-0 h-[100svh] w-full"
      />
      {sinWebgl && (
        <p className="fixed inset-0 z-10 grid place-items-center text-white/70">
          Este navegador no tiene WebGL: el laboratorio no puede dibujar.
        </p>
      )}

      {/* barra de arriba */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4 lg:px-8">
        <div className="pointer-events-auto flex items-center gap-4">
          <Link
            href="/laboratorio"
            className="text-[13px] text-white/60 hover:text-white"
          >
            ← Laboratorio
          </Link>
          <span className="hidden font-mono sm:inline text-[12px] uppercase tracking-[0.12em] text-white/80">
            Laboratorio 3D · Axium
          </span>
          <Link
            href="/laboratorio/galeria"
            className="text-[13px] text-[#7ECFC3] hover:text-white"
          >
            Galería →
          </Link>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
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

      {/* índice de capítulos */}
      <nav
        aria-label="Capítulos"
        className="fixed left-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 lg:left-8 lg:flex"
      >
        {CAPITULOS.map((c, i) => (
          <span
            key={c.nombre}
            className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${i === cap ? "text-white" : "text-white/35"}`}
          >
            <span
              className={`h-1.5 w-1.5 transition-colors ${i === cap ? "bg-[#7ECFC3]" : "bg-white/25"}`}
            />
            {String(i + 1).padStart(2, "0")} {c.nombre}
          </span>
        ))}
      </nav>

      {/* medidas: lo que la vista no ve */}
      <div className="fixed bottom-4 right-5 z-20 rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-[11px] text-white/70 backdrop-blur lg:right-8">
        {medidas
          ? `${medidas.fps} fps · ${medidas.llamadas} llamadas · ${Math.round(medidas.triangulos / 1000)}k triángulos · ${medidas.particulas.toLocaleString("es-PE")} partículas`
          : "cargando…"}
      </div>

      {/* capítulos */}
      <div className="relative z-10">
        {CAPITULOS.map((c, i) => (
          <section
            key={c.nombre}
            className="flex min-h-[125svh] items-end px-5 pb-[18svh] lg:items-center lg:px-8 lg:pb-0 lg:pl-48"
          >
            <div className="max-w-[460px] rounded-2xl border border-white/10 bg-[#030818]/55 p-6 backdrop-blur-md">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#7ECFC3]">
                {String(i + 1).padStart(2, "0")} · {c.nombre}
              </p>
              <h2 className="mt-3 text-[28px] leading-[1.05] tracking-[-0.02em] lg:text-[36px]">
                {c.titulo}
              </h2>
              <ul className="mt-4 space-y-2 text-[14px] leading-relaxed text-white/70">
                {c.tecnica.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-white/40" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
        <div className="h-[40svh]" />
      </div>
    </main>
  );
}
