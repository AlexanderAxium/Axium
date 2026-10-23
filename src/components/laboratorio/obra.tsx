"use client";

// Laboratorio 3D · la obra (2026-10-16): experiencia inmersiva a partir de igloo.inc (ver
// escena-obra.ts). Aquí va lo que es HTML: textos por plano (la escena les fija la opacidad), los
// nombres de proyecto que se «descifran» letra a letra, las etiquetas de oficio que siguen a los
// ladrillos, la barra de avance y el sonido sintetizado (viento con la velocidad, golpe de ladrillo,
// campana al llegar a cada proyecto), apagado de inicio.

import { ArrowRight, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type {
  ControlObra,
  EstadoObra,
  OyenteObra,
} from "~/components/laboratorio/escena-obra";

type Texto = {
  marca: string;
  titulo: string;
  texto?: string;
  etiqueta?: string;
  /** dónde va en escritorio (en móvil, todos abajo) */
  lado: "izq" | "der" | "centro" | "abajo";
};
const TEXTOS: Texto[] = [
  {
    marca: "La obra",
    titulo: "Software, diseño e IA, pieza por pieza.",
    lado: "abajo",
  },
  {
    marca: "01 — El equipo",
    titulo: "Cada pieza es un oficio.",
    texto:
      "Producto, interfaz, código, datos e IA en una misma obra, con un solo equipo.",
    lado: "izq",
  },
  {
    marca: "02 — Proyectos · 1/4",
    titulo: "Rematch",
    texto:
      "Plataforma propia para centros deportivos: reservas, academias, ligas y pagos en un solo sistema.",
    etiqueta: "SaaS · Deportes",
    lado: "der",
  },
  {
    marca: "02 — Proyectos · 2/4",
    titulo: "Aurore",
    texto:
      "Marca y tienda de perfumería desde cero: identidad, tipografía y 278 fragancias en línea.",
    etiqueta: "Marca · E-commerce",
    lado: "izq",
  },
  {
    marca: "02 — Proyectos · 3/4",
    titulo: "Feniz",
    texto:
      "El producto entero de una plataforma de trading: sitio, área del trader, panel y automatización.",
    etiqueta: "Fintech · Software a medida",
    lado: "der",
  },
  {
    marca: "02 — Proyectos · 4/4",
    titulo: "LumioLearn",
    texto:
      "Cursos con marca y dominio propios, con tutor de IA y certificados verificables.",
    etiqueta: "SaaS · Educación · IA",
    lado: "izq",
  },
  {
    marca: "03 — Contacto",
    titulo: "¿Construimos lo tuyo?",
    lado: "centro",
  },
];
const CIFRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#";

// ── sonido: todo sintetizado, sin archivos ──
class SonidoObra implements OyenteObra {
  ctx = new AudioContext();
  master = this.ctx.createGain();
  viento = this.ctx.createGain();
  filtro = this.ctx.createBiquadFilter();
  ruido: AudioBuffer;
  constructor() {
    const c = this.ctx;
    this.master.gain.value = 0;
    this.master.connect(c.destination);
    const n = c.sampleRate * 2;
    this.ruido = c.createBuffer(1, n, c.sampleRate);
    const d = this.ruido.getChannelData(0);
    let u = 0;
    for (let i = 0; i < n; i++) {
      u = (u + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      d[i] = u * 3.5;
    }
    // viento: ruido marrón con un pasa-bajos que se abre con la velocidad
    const r = c.createBufferSource();
    r.buffer = this.ruido;
    r.loop = true;
    this.filtro.type = "lowpass";
    this.filtro.frequency.value = 380;
    this.viento.gain.value = 0.25;
    r.connect(this.filtro).connect(this.viento).connect(this.master);
    r.start();
    // un acorde grave muy bajo, de fondo
    for (const [f, g] of [
      [65.4, 0.1],
      [98, 0.06],
      [130.8, 0.03],
    ] as const) {
      const o = c.createOscillator();
      o.frequency.value = f;
      const og = c.createGain();
      og.gain.value = g;
      o.connect(og).connect(this.master);
      o.start();
    }
  }
  activar(si: boolean) {
    const t = this.ctx.currentTime;
    if (si) this.ctx.resume();
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(si ? 0.55 : 0, t, 0.35);
  }
  velocidad(v: number) {
    const t = this.ctx.currentTime;
    this.viento.gain.setTargetAtTime(0.22 + v * 0.9, t, 0.25);
    this.filtro.frequency.setTargetAtTime(380 + v * 2200, t, 0.25);
  }
  golpe() {
    // un toc de cerámica: seno grave que cae + ráfaga corta filtrada
    const c = this.ctx;
    const t = c.currentTime;
    const o = c.createOscillator();
    o.frequency.setValueAtTime(240 + Math.random() * 60, t);
    o.frequency.exponentialRampToValueAtTime(110, t + 0.09);
    const g = c.createGain();
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.14);
    const r = c.createBufferSource();
    r.buffer = this.ruido;
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1400;
    bp.Q.value = 3;
    const rg = c.createGain();
    rg.gain.setValueAtTime(0.2, t);
    rg.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    r.connect(bp).connect(rg).connect(this.master);
    r.start(t, Math.random());
    r.stop(t + 0.06);
  }
  llegada(i: number) {
    const c = this.ctx;
    const t = c.currentTime;
    const base = i === 6 ? 392 : 523.3;
    for (const [k, f] of [base, base * 1.5].entries()) {
      const o = c.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t + k * 0.09);
      g.gain.exponentialRampToValueAtTime(0.07, t + k * 0.09 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + k * 0.09 + 1.6);
      o.connect(g).connect(this.master);
      o.start(t + k * 0.09);
      o.stop(t + k * 0.09 + 1.7);
    }
  }
}

export function Obra() {
  const lienzo = useRef<HTMLDivElement>(null);
  const textos = useRef<(HTMLDivElement | null)[]>([]);
  const etiquetas = useRef<(HTMLDivElement | null)[]>([]);
  const barra = useRef<HTMLDivElement>(null);
  const control = useRef<ControlObra | null>(null);
  const sonido = useRef<SonidoObra | null>(null);
  const oyente = useRef<{ actual: OyenteObra | null }>({ actual: null });
  const [estado, setEstado] = useState<EstadoObra | null>(null);
  const [pausado, setPausado] = useState(false);
  const [conSonido, setConSonido] = useState(false);
  const [sinWebgl, setSinWebgl] = useState(false);
  const [tactil, setTactil] = useState(false);

  useEffect(() => {
    setTactil(matchMedia("(pointer: coarse)").matches);
    // cada visita empieza arriba: el recorrido se lee desde la obra
    history.scrollRestoration = "manual";
    scrollTo(0, 0);
    const el = lienzo.current;
    if (!el) return;
    let vivo = true;
    import("~/components/laboratorio/escena-obra").then((m) => {
      if (!vivo) return;
      control.current = m.crearObra(
        el,
        setEstado,
        {
          textos: textos.current.filter((t): t is HTMLDivElement => !!t),
          etiquetas: etiquetas.current.filter((t): t is HTMLDivElement => !!t),
          barra: barra.current,
        },
        oyente.current
      );
      if (!control.current) setSinWebgl(true);
    });
    return () => {
      vivo = false;
      control.current?.liberar();
      control.current = null;
    };
  }, []);

  // el título del texto que entra se descifra letra a letra (como los nombres de igloo.inc)
  const texto = estado?.texto ?? -1;
  useEffect(() => {
    if (texto < 0) return;
    const h =
      textos.current[texto]?.querySelector<HTMLElement>("[data-titulo]");
    if (!h) return;
    const final = h.dataset.final ?? "";
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      h.textContent = final;
      return;
    }
    const inicio = performance.now();
    const dura = 700;
    let raf = 0;
    const paso = (ahora: number) => {
      const k = Math.min(1, (ahora - inicio) / dura);
      const n = Math.floor(k * final.length);
      let s = final.slice(0, n);
      for (let i = n; i < final.length; i++)
        s +=
          final[i] === " "
            ? " "
            : CIFRAS[Math.floor(Math.random() * CIFRAS.length)];
      h.textContent = s;
      if (k < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => {
      cancelAnimationFrame(raf);
      h.textContent = final;
    };
  }, [texto]);

  const alternarSonido = () => {
    if (!sonido.current) sonido.current = new SonidoObra();
    const si = !conSonido;
    sonido.current.activar(si);
    oyente.current.actual = si ? sonido.current : null;
    setConSonido(si);
  };

  const listo = !!estado?.listo;
  const enPortada = (estado?.plano ?? 0) === 0;
  const posicion = (lado: Texto["lado"]) =>
    ({
      abajo:
        "bottom-24 left-5 right-5 lg:left-10 lg:bottom-28 lg:max-w-[640px]",
      izq: "bottom-24 left-5 right-5 lg:left-10 lg:right-auto lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2 lg:max-w-[460px]",
      der: "bottom-24 left-5 right-5 lg:left-auto lg:right-16 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2 lg:max-w-[460px]",
      centro:
        "bottom-24 left-5 right-5 text-center lg:bottom-auto lg:top-[69%] lg:left-1/2 lg:right-auto lg:w-[640px] lg:-translate-x-1/2",
    })[lado];

  return (
    <main className="relative bg-[#B7C0CC] text-[#0B1530]">
      <div
        ref={lienzo}
        aria-hidden="true"
        className="fixed inset-0 z-0 h-[100lvh] w-full"
      />

      {/* carga */}
      <div
        className={`fixed inset-0 z-40 grid place-items-center bg-[#B7C0CC] transition-opacity duration-700 ${listo || sinWebgl ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <div className="w-[220px]">
          <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-[#0B1530]/60">
            <span>Levantando la obra</span>
            <span className="tabular-nums">
              {Math.round((estado?.cargado ?? 0) * 100)} %
            </span>
          </div>
          <div className="mt-3 h-px w-full bg-[#0B1530]/15">
            <div
              className="h-px bg-[#0B1530] transition-[width] duration-300"
              style={{ width: `${(estado?.cargado ?? 0) * 100}%` }}
            />
          </div>
        </div>
      </div>
      {sinWebgl && (
        <p className="fixed inset-0 z-40 grid place-items-center">
          Este navegador no tiene WebGL.
        </p>
      )}

      {/* cabecera: marca a la izquierda, manifiesto a la derecha (solo en la portada) */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between px-5 py-5 lg:px-10 lg:py-7">
        <div className="pointer-events-auto">
          <Link
            href="/laboratorio"
            className="text-[22px] font-semibold tracking-[-0.03em]"
          >
            axium
          </Link>
          <p className="mt-1 font-mono text-[11px] leading-5 text-[#0B1530]/60">
            {"// Laboratorio · La obra"}
            <br />
            Lima, Perú
          </p>
        </div>
        <div
          className={`hidden max-w-[260px] text-right font-mono text-[11px] leading-5 text-[#0B1530]/70 transition-opacity duration-500 sm:block ${enPortada && listo ? "opacity-100" : "opacity-0"}`}
        >
          <p className="text-[#0B1530]/45">{"////// Manifiesto"}</p>
          <p className="mt-2">
            Construimos productos digitales como se levanta una obra: con
            planos, oficio y piezas que encajan. Diseño, software e IA, con un
            solo equipo.
          </p>
        </div>
      </header>

      {/* etiquetas de oficio: la escena las coloca sobre los ladrillos que saltan */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-10"
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            ref={(el) => {
              etiquetas.current[i] = el;
            }}
            className="absolute left-0 top-0 -ml-1 -mt-1 whitespace-nowrap pl-4 font-mono text-[11px] text-[#0B1530] opacity-0 before:absolute before:left-0 before:top-1/2 before:h-2 before:w-2 before:-translate-y-1/2 before:rounded-full before:border before:border-[#0B1530] before:bg-white/70"
          />
        ))}
      </div>

      {/* textos por plano: la escena fija su opacidad durante la pausa de cada plano */}
      <div className="pointer-events-none fixed inset-0 z-10">
        {TEXTOS.map((t, i) => (
          <div key={t.titulo} className={`absolute ${posicion(t.lado)}`}>
            <div
              ref={(el) => {
                textos.current[i] = el;
              }}
              className="opacity-0"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#0B1530]/60">
                {t.marca}
              </p>
              <h2
                data-titulo
                data-final={t.titulo}
                className={`mt-3 text-[34px] font-medium leading-[1.02] tracking-[-0.03em] sm:text-[46px] lg:text-[58px] ${t.lado === "centro" ? "mx-auto max-w-[16ch]" : "max-w-[16ch]"}`}
              >
                {t.titulo}
              </h2>
              {t.texto && (
                <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-[#0B1530]/75 sm:text-[16px]">
                  {t.texto}
                </p>
              )}
              {i === 0 && (
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#0B1530]/60">
                  {tactil ? "Toca las piezas" : "Pasa el cursor por las piezas"}{" "}
                  · desliza para entrar
                </p>
              )}
              {t.etiqueta && (
                <p className="mt-4 inline-block rounded-full border border-[#0B1530]/20 px-3 py-1 font-mono text-[11px] text-[#0B1530]/70">
                  {t.etiqueta}
                </p>
              )}
              {t.lado === "centro" && (
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/#contacto"
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-[#0B1530] px-6 text-[14px] font-medium text-white transition-colors hover:bg-[#0092D1]"
                  >
                    Hablemos de tu proyecto <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/portafolio"
                    className="inline-flex h-12 items-center rounded-full border border-[#0B1530]/25 px-6 text-[14px] transition-colors hover:border-[#0B1530]/60"
                  >
                    Ver todos los proyectos
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* avance del recorrido */}
      <div
        aria-hidden="true"
        className="fixed right-5 top-1/2 z-20 hidden h-40 w-px -translate-y-1/2 bg-[#0B1530]/15 lg:right-8 lg:block"
      >
        <div
          ref={barra}
          className="h-full w-px origin-top scale-y-0 bg-[#0B1530]"
        />
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between px-5 pb-5 font-mono text-[11px] text-[#0B1530]/70 lg:px-10 lg:pb-7">
        <button
          type="button"
          onClick={alternarSonido}
          aria-pressed={conSonido}
          className="flex h-8 items-center gap-2 hover:text-[#0B1530]"
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
            className="grid h-8 w-8 place-items-center rounded-full border border-[#0B1530]/25 hover:border-[#0B1530]/60"
          >
            {pausado ? (
              <Play className="h-3 w-3" />
            ) : (
              <Pause className="h-3 w-3" />
            )}
          </button>
        </div>
      </footer>

      {/* el largo del recorrido: ~70 svh por unidad de la línea de tiempo (16,35 unidades) */}
      <div aria-hidden="true" className="h-[1150svh]" />
    </main>
  );
}
