"use client";

// Laboratorio · cine pre-renderizado (2026-10-16), la técnica de labs.sigma.software: la página no
// tiene WebGL. Son clips de vídeo renderizados en Blender (cine.py en creator/herramientas/tres) que
// se encadenan con el scroll:
//   · cinco estados; cada uno con su bucle de reposo y, entre cada par, una transición de ida y su
//     versión al revés para volver. El último cuadro de una transición ES el primero del bucle
//     siguiente, así que el cambio de vídeo no se ve
//   · todo se descarga antes de empezar y se reproduce desde blobs: cero esperas en el gesto
//   · dos vídeos apilados: el bucle abajo y la transición encima; la transición entra con un
//     fundido corto (tapa el corte desde una fase cualquiera del bucle) y se quita al terminar
//   · scroll, teclas, deslizar y el índice de la derecha; con movimiento reducido, solo fundidos
//   · sonido sintetizado con WebAudio (ambiente, ráfaga en cada transición, clics), apagado de inicio

import { ArrowRight, ChevronDown, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CAPITULOS,
  ESTADOS,
  NOMBRES,
  Sonido,
} from "~/components/laboratorio/cine-comun";

const BASE = "/laboratorio/cine";
function clips() {
  const n: string[] = [];
  for (let k = 0; k < ESTADOS; k++) {
    n.push(`bucle-${k}`);
    if (k < ESTADOS - 1) n.push(`ida-${k}`, `vuelta-${k}`);
  }
  return n;
}

const esperar = (v: HTMLVideoElement, ev: string) =>
  new Promise<void>((r) => v.addEventListener(ev, () => r(), { once: true }));

/** espera a que el navegador PINTE un cuadro de ese vídeo (no basta con que tenga datos) */
const cuadroPintado = (v: HTMLVideoElement) =>
  new Promise<void>((r) => {
    if ("requestVideoFrameCallback" in v)
      v.requestVideoFrameCallback(() => r());
    else requestAnimationFrame(() => requestAnimationFrame(() => r()));
  });

export function Cine() {
  const bucle = useRef<HTMLVideoElement>(null);
  const trans = useRef<HTMLVideoElement>(null);
  const urls = useRef<Record<string, string>>({});
  const sonido = useRef<Sonido | null>(null);
  const actual = useRef(0);
  const ocupado = useRef(false);
  const cola = useRef<0 | 1 | -1>(0);
  const reducido = useRef(false);
  const pausadoRef = useRef(false);
  const [formato, setFormato] = useState<"h" | "v" | null>(null);
  const [carga, setCarga] = useState(0);
  const [peso, setPeso] = useState(0);
  const [listo, setListo] = useState(false);
  const [capitulo, setCapitulo] = useState(0);
  const [enViaje, setEnViaje] = useState(false);
  const [conSonido, setConSonido] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [ficha, setFicha] = useState(false);

  // formato según la pantalla al entrar: horizontal (pieza a la derecha) o vertical (pieza arriba)
  useEffect(() => {
    setFormato(innerWidth / innerHeight > 0.9 ? "h" : "v");
    reducido.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // descarga todo a blobs con progreso real (bytes), y arranca con el bucle de la portada
  useEffect(() => {
    if (!formato) return;
    let vivo = true;
    const nombres = clips();
    const creados: string[] = [];
    (async () => {
      const resp = await Promise.all(
        nombres.map((n) => fetch(`${BASE}/${formato}/${n}.mp4`))
      );
      const total = resp.reduce(
        (s, r) => s + Number(r.headers.get("content-length") || 0),
        0
      );
      setPeso(total);
      let leido = 0;
      await Promise.all(
        resp.map(async (r, i) => {
          const lector = r.body?.getReader();
          const partes: Uint8Array[] = [];
          if (lector) {
            for (;;) {
              const { done, value } = await lector.read();
              if (done) break;
              partes.push(value);
              leido += value.length;
              if (vivo && total) setCarga(leido / total);
            }
          }
          const url = URL.createObjectURL(
            new Blob(partes as BlobPart[], { type: "video/mp4" })
          );
          creados.push(url);
          urls.current[nombres[i] as string] = url;
        })
      );
      if (!vivo) return;
      const b = bucle.current;
      if (!b) return;
      b.src = urls.current["bucle-0"] as string;
      await esperar(b, "loadeddata");
      if (!reducido.current) b.play().catch(() => {});
      setListo(true);
    })();
    return () => {
      vivo = false;
      for (const u of creados) URL.revokeObjectURL(u);
    };
  }, [formato]);

  /** un paso: de actual a actual ± 1 con su clip. Devuelve cuando el bucle nuevo ya se ve */
  const paso = useCallback(async (dir: 1 | -1, rapidez: number) => {
    const b = bucle.current;
    const v = trans.current;
    const desde = actual.current;
    const hacia = desde + dir;
    if (!b || !v || hacia < 0 || hacia >= ESTADOS) return;
    setEnViaje(true);
    const clip = dir > 0 ? `ida-${desde}` : `vuelta-${hacia}`;
    const destino = urls.current[`bucle-${hacia}`] as string;

    if (reducido.current) {
      // sin movimiento: fundido al póster del estado nuevo
      b.style.transition = "opacity 400ms";
      b.style.opacity = "0";
      await new Promise((r) => setTimeout(r, 400));
      b.src = destino;
      await esperar(b, "loadeddata");
      b.style.opacity = "1";
    } else {
      v.src = urls.current[clip] as string;
      v.playbackRate = rapidez;
      await esperar(v, "loadeddata");
      sonido.current?.rafaga(v.duration / rapidez);
      await v.play().catch(() => {});
      await cuadroPintado(v);
      v.style.opacity = "1"; // fundido de 160 ms por CSS: tapa el corte desde cualquier fase del bucle
      // mientras la transición corre encima, el bucle de abajo ya carga el estado siguiente
      await new Promise((r) => setTimeout(r, 180));
      b.pause();
      b.src = destino;
      await esperar(b, "loadeddata");
      if (!v.ended) await esperar(v, "ended");
      if (!pausadoRef.current) await b.play().catch(() => {});
      await cuadroPintado(b);
      v.style.transition = "none";
      v.style.opacity = "0"; // mismo cuadro debajo: quitarla no se ve
      v.getBoundingClientRect();
      v.style.transition = "";
    }
    actual.current = hacia;
    setCapitulo(hacia);
  }, []);

  const ir = useCallback(
    async (destino: number) => {
      if (ocupado.current || destino === actual.current) return;
      if (destino < 0 || destino >= ESTADOS) return;
      ocupado.current = true;
      const saltos = Math.abs(destino - actual.current);
      // saltar varios capítulos: los clips en cadena, más rápidos
      while (actual.current !== destino)
        await paso(destino > actual.current ? 1 : -1, saltos > 1 ? 1.8 : 1);
      setEnViaje(false);
      ocupado.current = false;
      // lo que el usuario pidió durante el viaje se hace ahora (antes se perdía: «no responde»)
      const c = cola.current;
      cola.current = 0;
      if (c) irRef.current(actual.current + c);
    },
    [paso]
  );
  const irRef = useRef(ir);
  irRef.current = ir;
  /** una intención (un gesto, una tecla, un deslizón): si hay viaje en curso, queda en cola (solo una) */
  const intencion = useCallback((dir: 1 | -1) => {
    if (ocupado.current) cola.current = dir;
    else irRef.current(actual.current + dir);
  }, []);

  // entrada: rueda, teclas y deslizar
  useEffect(() => {
    if (!listo) return;
    // un gesto = un capítulo. La inercia de macOS solo DECRECE: es gesto nuevo tras una pausa, al
    // cambiar de sentido, o cuando la magnitud vuelve a crecer después de haber caído.
    // (Antes: bloqueo fijo de 650 ms tras cada viaje → se tragaba el gesto hecho durante el viaje.)
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
        intencion(acumulado > 0 ? 1 : -1);
      }
    };
    const tecla = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        intencion(1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        intencion(-1);
      } else if (e.key === "Home") irRef.current(0);
      else if (e.key === "End") irRef.current(ESTADOS - 1);
    };
    let y0 = 0;
    const inicio = (e: TouchEvent) => {
      y0 = e.touches[0]?.clientY ?? 0;
    };
    const fin = (e: TouchEvent) => {
      const dy = y0 - (e.changedTouches[0]?.clientY ?? y0);
      if (Math.abs(dy) > 45) intencion(dy > 0 ? 1 : -1);
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
  }, [listo, intencion]);

  const alternarSonido = () => {
    if (!sonido.current) sonido.current = new Sonido();
    const si = !conSonido;
    sonido.current.activar(si);
    if (si) sonido.current.clic(1200);
    setConSonido(si);
  };
  const tic = () => conSonido && sonido.current?.clic(2200);

  const alternarPausa = () => {
    const p = !pausado;
    pausadoRef.current = p;
    setPausado(p);
    if (p) bucle.current?.pause();
    else bucle.current?.play().catch(() => {});
  };

  const cap = CAPITULOS[capitulo] as (typeof CAPITULOS)[number];
  const vertical = formato === "v";
  const centrado = capitulo === ESTADOS - 1;
  const mb = (peso / 1048576).toFixed(1).replace(".", ",");

  return (
    <main className="relative h-[100svh] w-full touch-none select-none overflow-hidden bg-[#020717] text-white">
      {/* los dos vídeos apilados: bucle abajo, transición encima (decorativos) */}
      <div aria-hidden="true">
        <video
          ref={bucle}
          className="absolute inset-0 h-full w-full object-cover"
          poster={formato ? `${BASE}/${formato}/bucle-0.jpg` : undefined}
          muted
          playsInline
          loop
          preload="auto"
        />
        <video
          ref={trans}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[160ms]"
          muted
          playsInline
          preload="auto"
        />
      </div>
      {/* viñeta: el texto siempre tiene contraste, venga el cuadro que venga */}
      <div
        className={`pointer-events-none absolute inset-0 ${vertical || centrado ? "bg-[linear-gradient(to_top,rgba(2,7,23,0.85)_0%,rgba(2,7,23,0.35)_38%,transparent_60%)]" : "bg-[linear-gradient(to_right,rgba(2,7,23,0.8)_0%,rgba(2,7,23,0.3)_42%,transparent_62%)]"}`}
      />

      {/* carga */}
      <div
        className={`absolute inset-0 z-30 grid place-items-center bg-[#020717] transition-opacity duration-700 ${listo ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <div className="w-[min(80vw,320px)] font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">
          <div className="flex justify-between">
            <span>Cargando la película</span>
            <span className="tabular-nums">{Math.round(carga * 100)} %</span>
          </div>
          <div className="mt-3 h-px w-full bg-white/15">
            <div
              className="h-px bg-[#6FC3FF] transition-[width] duration-200"
              style={{ width: `${carga * 100}%` }}
            />
          </div>
        </div>
      </div>

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
          <p className="font-medium text-white">Sin WebGL: vídeo renderizado</p>
          <ul className="mt-3 space-y-1.5">
            <li>
              Blender (Cycles) · 5 estados, 4 transiciones con desenfoque de
              movimiento
            </li>
            <li>
              El último cuadro de cada transición es el primero del bucle
              siguiente
            </li>
            <li>13 clips H.264 · {mb} MB · todo precargado como blob</li>
            <li>Vuelta atrás = la misma transición invertida</li>
            <li>Sonido sintetizado con WebAudio (sin archivos)</li>
          </ul>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/50">
            Rueda · flechas · deslizar · índice
          </p>
        </div>
      )}

      {/* índice de capítulos */}
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
            aria-current={capitulo === i ? "step" : undefined}
            className="group flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em]"
          >
            <span
              className={`transition-opacity ${capitulo === i ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`}
            >
              {n}
            </span>
            <span className="tabular-nums text-white/50">0{i}</span>
            <span
              className={`h-px transition-all duration-500 ${capitulo === i ? "w-8 bg-white" : "w-4 bg-white/35"}`}
            />
          </button>
        ))}
      </nav>

      {/* el texto del capítulo: se va al empezar el viaje y entra al llegar */}
      <section
        aria-live="polite"
        className={`absolute z-20 px-7 transition-all lg:px-10 ${enViaje || !listo ? "translate-y-3 opacity-0 duration-200" : "translate-y-0 opacity-100 duration-700"} ${vertical || centrado ? "inset-x-0 bottom-24 text-center sm:bottom-28" : "bottom-28 left-0 max-w-[620px]"}`}
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
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[14px] font-medium text-[#020717] transition-colors hover:bg-[#6FC3FF]"
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
        <button
          type="button"
          onClick={() => ir(actual.current + 1)}
          disabled={capitulo === ESTADOS - 1}
          aria-label="Siguiente capítulo"
          className={`flex items-center gap-2 transition-opacity hover:text-white ${capitulo === ESTADOS - 1 ? "opacity-0" : "opacity-100"}`}
        >
          <span className="hidden sm:inline">Desliza</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={alternarPausa}
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
