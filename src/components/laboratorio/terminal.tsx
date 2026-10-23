"use client";

// Laboratorio 3D · propuesta de portada «la terminal» (2026-10-16), a partir del hero de
// juncastudio.com: arranque escrito, un personaje 3D cuya pantalla te habla, humo animado de fondo,
// titular abajo a la izquierda y la hora del estudio. Aquí la terminal pregunta qué quieres construir
// y responde a cada opción: el hero ya vende los servicios (y la IA) y termina en «Hablemos».

import { ArrowRight, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Medidas } from "~/components/laboratorio/base";
import type { ControlTerminal } from "~/components/laboratorio/escena-terminal";

const ARRANQUE = [
  "Axium — diseño, software e IA",
  "Lima, Perú · trabajamos para todo el mundo",
  "Iniciando la terminal…",
];
const OPCIONES: [string, string[]][] = [
  [
    "Una web",
    [
      "Una web que venda: rápida, en tu idioma y fácil de administrar.",
      "La diseñamos y la construimos nosotros. ¿Lo conversamos?",
    ],
  ],
  [
    "Un software a medida",
    [
      "Paneles, reservas, pagos e integraciones a tu medida.",
      "Un solo equipo, de la primera idea a producción.",
    ],
  ],
  [
    "Algo con IA",
    [
      "Asistentes, automatizaciones y extracción de datos con IA dentro de tu operación.",
      "Como esta terminal, pero para tu negocio.",
    ],
  ],
];

export function Terminal() {
  const lienzo = useRef<HTMLDivElement>(null);
  const control = useRef<ControlTerminal | null>(null);
  const [medidas, setMedidas] = useState<Medidas | null>(null);
  const [escribiendo, setEscribiendo] = useState(true);
  const [elegido, setElegido] = useState<number | null>(null);
  const [pausado, setPausado] = useState(false);
  const [arranque, setArranque] = useState(0); // líneas del arranque ya escritas
  const [listo, setListo] = useState(false);
  const [hora, setHora] = useState("");

  useEffect(() => {
    const el = lienzo.current;
    if (!el) return;
    let vivo = true;
    import("~/components/laboratorio/escena-terminal").then((m) => {
      if (!vivo) return;
      control.current = m.crearTerminal(el, setMedidas, setEscribiendo);
    });
    return () => {
      vivo = false;
      control.current?.liberar();
      control.current = null;
    };
  }, []);

  // el arranque: tres líneas y se abre (mínimo ~2 s, aunque la escena esté antes)
  useEffect(() => {
    const ids = ARRANQUE.map((_, i) =>
      setTimeout(() => setArranque(i + 1), 350 + i * 550)
    );
    const fin = setTimeout(() => setListo(true), 2300);
    return () => {
      for (const id of ids) clearTimeout(id);
      clearTimeout(fin);
    };
  }, []);

  useEffect(() => {
    const f = new Intl.DateTimeFormat("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/Lima",
    });
    const tic = () => setHora(f.format(new Date()));
    tic();
    const id = setInterval(tic, 1000);
    return () => clearInterval(id);
  }, []);

  const elegir = (i: number) => {
    setElegido(i);
    control.current?.decir((OPCIONES[i] as [string, string[]])[1]);
  };

  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-[#02040b] text-white">
      <div ref={lienzo} className="absolute inset-0" aria-hidden="true" />

      {/* arranque */}
      <div
        className={`absolute inset-0 z-30 flex items-center justify-center bg-[#02040b] transition-opacity duration-700 ${listo ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <div className="w-[min(92vw,460px)] font-mono text-[13px] leading-7 text-[#7ECFC3]">
          {ARRANQUE.slice(0, arranque).map((l) => (
            <p key={l}>
              <span className="text-white/40">›</span> {l}
            </p>
          ))}
          <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-[#7ECFC3]" />
        </div>
      </div>

      {/* navegación */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-5 py-5 text-[13px] lg:px-8">
        <Link href="/laboratorio" className="font-medium tracking-tight">
          axium<span className="text-white/40"> · laboratorio</span>
        </Link>
        <nav className="hidden gap-10 text-white/70 md:flex">
          <div className="flex flex-col">
            <Link href="/portafolio" className="hover:text-white">
              Proyectos
            </Link>
            <Link href="/servicios" className="hover:text-white">
              Servicios
            </Link>
          </div>
          <div className="flex flex-col">
            <Link href="/blog" className="hover:text-white">
              Blog
            </Link>
            <Link href="/#contacto" className="hover:text-white">
              Contacto
            </Link>
          </div>
        </nav>
        <span className="font-mono text-[11px] text-white/45">
          propuesta · la terminal
        </span>
      </header>

      {/* titular y conversación */}
      <div className="absolute inset-x-0 bottom-16 z-20 px-5 lg:bottom-20 lg:px-8">
        <h1 className="max-w-[15ch] text-[38px] leading-[1.02] tracking-[-0.03em] sm:text-[52px] lg:text-[68px]">
          Diseño, software e IA para empresas que quieren crecer.
        </h1>
        <div
          className={`mt-7 flex flex-wrap items-center gap-2 transition-opacity duration-500 ${escribiendo && elegido === null ? "opacity-0" : "opacity-100"}`}
        >
          {OPCIONES.map(([etiqueta], i) => (
            <button
              key={etiqueta}
              type="button"
              onClick={() => elegir(i)}
              aria-pressed={elegido === i}
              className={`h-10 rounded-full border px-4 text-[13px] backdrop-blur transition-colors ${elegido === i ? "border-[#7ECFC3] bg-[#7ECFC3] text-[#02040b]" : "border-white/25 bg-white/5 hover:border-white/60"}`}
            >
              {etiqueta}
            </button>
          ))}
          {elegido !== null && !escribiendo && (
            <Link
              href="/#contacto"
              className="ml-1 inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-[13px] font-medium text-[#02040b] transition-colors hover:bg-[#7ECFC3]"
            >
              Hablemos de tu proyecto <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {/* pie: la hora del estudio, pausa y medidas */}
      <footer className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-5 pb-5 font-mono text-[11px] text-white/55 lg:px-8">
        <div className="flex gap-6">
          <span>© 2026</span>
          <span>Lima (UTC−5)</span>
          <span className="tabular-nums">{hora}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">
            {medidas ? `${medidas.fps} fps · ${medidas.llamadas} llamadas` : ""}
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
            className="grid h-8 w-8 place-items-center rounded-full border border-white/25 text-white hover:border-white/60"
          >
            {pausado ? (
              <Play className="h-3 w-3" />
            ) : (
              <Pause className="h-3 w-3" />
            )}
          </button>
        </div>
      </footer>
    </main>
  );
}
