"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  Fragment,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import { Preguntas } from "~/components/axium/preguntas";
import { Grafico } from "~/components/axium/servicios-seis";
import { Portada } from "~/components/axium/trabajo-destacado";
import { LOGOS_STACK } from "~/data/logos-stack";
import {
  type IdServicio,
  type MedioServicio,
  PAGINAS_SERVICIO,
  rutaServicio,
} from "~/data/servicios-paginas";
import { useTranslation } from "~/hooks/useTranslation";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * El molde de las páginas de servicio (2026-10-22), al modo de cheesecakelabs.com/services/*:
 * Alexander, «mejora cada servicio, toma de referencia cheesecakelabs.com, es más ordenado que
 * nosotros». Segunda vuelta, con infinum.com (el diagrama de arquitectura y la tecnología por
 * capas), qubika.com (lo que incluyó cada trabajo) y ramotion.com (el mosaico de piezas):
 * «explayate un poco con algunos de nuestros proyectos, y si necesitas gráficas también».
 *
 * Tercera vuelta («a eso me refería con que mejores el copy… que no parezca una página hecha con
 * IA», con brandvm.com de referencia): fuera la franja de «prueba» (respondía algo que nadie
 * preguntó), los títulos de sección son de cada servicio, la tecnología va con sus logos y las
 * cifras van dentro de una frase (el número gigante con etiqueta chica es uno de los rasgos de
 * página generada).
 *
 * Quinta vuelta: «siento que debes ser más ordenado, un poco más visual, más interactivo y
 * dinámico, no poner texto por poner… microanimaciones», y «todo debe representar como si fuéramos
 * expertos en el tema sin exagerar» (sobre la tecnología de IoT, que parecía de proyecto casero).
 * «Qué hacemos» pasa a pestañas con una pieza real de cada cosa (o una foto del tema donde no hay
 * caso) que avanzan solas una vuelta; la tecnología va por capas, con las herramientas de un
 * equipo que hace esto de verdad, sobre un gráfico isométrico de placas; el reto y lo hecho caben
 * en dos frases; las tarjetas de más trabajo enseñan su vídeo al pasar el ratón; y las preguntas
 * se abren sin saltos. La coreografía con GSAP (creator/GSAP.md).
 *
 * El orden es siempre el mismo:
 *   1. hero oscuro con lo que hacemos, dos botones y el gráfico isométrico del servicio
 *   2. qué hacemos: seis cosas en pestañas, cada una con su imagen o su vídeo
 *   3. un proyecto en detalle: el reto, lo que hicimos y un mosaico o un diagrama del flujo real
 *      (sin proyecto, como en IoT y cloud: cómo se arma el sistema)
 *   4. con qué trabajamos: la tecnología por capas
 *   5. cómo trabajamos: cuatro pasos sobre una línea
 *   6. más trabajo: casos con sus cifras y lo que incluyeron (cada cosa sale de su ficha)
 *   7. el puente al servicio relacionado
 *   8. preguntas frecuentes y el formulario de contacto
 */

const NOCHE = "#060C20";
const AZUL = "#0072CF";
const AZUL_LOGO = "#0092D1";
const titular: CSSProperties = { fontFamily: "var(--font-family-heading)" };
const SUAVE = "cubic-bezier(.22,1,.36,1)";

// El grano, apenas visible (memoria «fondos sutiles»: degradado + grano)
const GRANO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`;

function Grano({ opacidad = 0.07 }: { opacidad?: number }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 mix-blend-overlay"
      style={{ backgroundImage: GRANO, opacity: opacidad }}
    />
  );
}

// la misma escala que los títulos del inicio (.titulo-seccion en globals.css)
const h2Cls = "titulo-seccion text-[#060C20]";

const sinMovimiento = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** true la primera vez que el elemento entra en pantalla */
function useVisto<T extends Element>() {
  const ref = useRef<T>(null);
  const [visto, setVisto] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        setVisto(true);
        io.disconnect();
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visto] as const;
}

type ItemHacemos = {
  titulo: string;
  texto: string;
  ejemplo?: { texto: string; slug?: string };
};

/** Cuánto se queda cada pestaña antes de pasar sola a la siguiente */
const POR_PESTANA = 7;

/**
 * Qué hacemos, en pestañas: a la izquierda las seis cosas (la elegida se abre con su texto y su
 * ejemplo), a la derecha la pieza de esa cosa, que entra con un fundido y un acercamiento leve.
 * En escritorio avanzan solas UNA vuelta, con la barra de la pestaña como reloj: arrancan cuando
 * la sección entra en pantalla, se pausan con el ratón o el foco encima y se apagan para siempre
 * en cuanto la persona elige una (WCAG 2.2.2). En el celular no avanzan solas y la pieza va dentro
 * de la pestaña abierta, sin vídeo. Con movimiento reducido, todo quieto.
 */
function QueHacemos({
  titulo,
  items,
  medios,
  locale,
}: {
  titulo: string;
  items: ItemHacemos[];
  medios: MedioServicio[];
  locale: string;
}) {
  const raiz = useRef<HTMLElement>(null);
  const [activo, setActivo] = useState(0);
  // las piezas se piden al elegirlas, y la siguiente de antemano
  const [cargadas, setCargadas] = useState(() => new Set([0, 1]));
  const solo = useRef(true);
  const reloj = useRef<gsap.core.Tween | null>(null);
  const enPantalla = useRef(false);
  const encima = useRef(false);
  const previo = useRef(0);
  const N = items.length;
  const ruta = (s: string) => s.replace("{l}", locale);

  const elegir = (i: number, porPersona: boolean) => {
    if (porPersona) solo.current = false;
    setActivo(i);
    setCargadas((c) => new Set(c).add(i).add((i + 1) % N));
  };

  const ajustarReloj = () => {
    const r = reloj.current;
    if (!r) return;
    if (enPantalla.current && !encima.current) r.resume();
    else r.pause();
  };

  // Cuándo corre el reloj: con la sección en pantalla
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: raiz.current,
        start: "top 70%",
        end: "bottom 30%",
        onToggle: (st) => {
          enPantalla.current = st.isActive;
          ajustarReloj();
        },
      });
    },
    { scope: raiz }
  );

  // Cada cambio de pestaña: el fundido de la pieza, su vídeo y el reloj de la barra
  useGSAP(
    () => {
      const el = raiz.current;
      if (!el) return;
      const capas = [...el.querySelectorAll<HTMLElement>(".qh-medio")];
      const barras = [...el.querySelectorAll<HTMLElement>(".qh-barra")];
      const quieto = sinMovimiento();
      const nueva = capas[activo];

      // (comparar con la anterior y no con «la primera vez»: en desarrollo, StrictMode corre esto
      // dos veces al montar y la pieza inicial se fundía sola)
      if (previo.current !== activo && nueva) {
        previo.current = activo;
        gsap.to(
          capas.filter((c) => c !== nueva),
          {
            autoAlpha: 0,
            duration: quieto ? 0 : 0.5,
            ease: "power1.out",
            overwrite: true,
          }
        );
        gsap.fromTo(
          nueva,
          { autoAlpha: 0, scale: quieto ? 1 : 1.035 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: quieto ? 0 : 0.9,
            ease: "power2.out",
            overwrite: true,
          }
        );
      }

      for (const v of el.querySelectorAll<HTMLVideoElement>("video[data-i]")) {
        if (Number(v.dataset.i) === activo && !quieto) {
          v.currentTime = 0;
          v.play().catch(() => {});
        } else v.pause();
      }

      reloj.current?.kill();
      reloj.current = null;
      gsap.set(barras, { scaleX: 0 });
      const barra = barras[activo];
      if (!barra) return;
      const puede =
        solo.current &&
        !quieto &&
        window.matchMedia("(min-width: 1024px)").matches;
      if (!puede) {
        solo.current = false;
        gsap.set(barra, { scaleX: 1 });
        return;
      }
      reloj.current = gsap.fromTo(
        barra,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: POR_PESTANA,
          ease: "none",
          paused: true,
          onComplete: () => {
            // una sola vuelta: después de la última vuelve a la primera y se queda
            if (activo === N - 1) {
              solo.current = false;
              elegir(0, false);
            } else elegir(activo + 1, false);
          },
        }
      );
      ajustarReloj();
    },
    { scope: raiz, dependencies: [activo] }
  );

  const pieza = (m: MedioServicio, i: number, conVideo: boolean) => (
    <>
      <Image
        src={ruta(m.src)}
        alt=""
        fill
        sizes={conVideo ? "(min-width: 1024px) 55vw, 1px" : "100vw"}
        className="object-cover"
        style={{ objectPosition: m.encuadre }}
      />
      {conVideo && m.video && (
        <video
          data-i={i}
          src={ruta(m.video)}
          muted
          playsInline
          preload="none"
          onPlaying={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500"
          style={{ objectPosition: m.encuadre }}
        />
      )}
    </>
  );

  return (
    <section ref={raiz} className="bg-white">
      <div className="container-section">
        <div className="content-section py-20 md:py-28">
          <h2 className={`${h2Cls} max-w-[20ch]`} style={titular}>
            {titulo}
          </h2>
          <div
            className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start lg:gap-16"
            onMouseEnter={() => {
              encima.current = true;
              ajustarReloj();
            }}
            onMouseLeave={() => {
              encima.current = false;
              ajustarReloj();
            }}
            onFocus={() => {
              encima.current = true;
              ajustarReloj();
            }}
            onBlur={() => {
              encima.current = false;
              ajustarReloj();
            }}
          >
            {/* la pieza, en escritorio: todas apiladas, solo una visible */}
            <div
              aria-hidden="true"
              className="relative hidden aspect-[4/3] overflow-hidden rounded-[20px] bg-[#0A1128] lg:order-2 lg:block"
            >
              {medios.map((m, i) => (
                <div
                  key={m.src}
                  className={`qh-medio absolute inset-0 ${i === 0 ? "" : "invisible opacity-0"}`}
                >
                  {cargadas.has(i) && pieza(m, i, true)}
                </div>
              ))}
            </div>

            <ul className="border-b border-[#060C20]/10 lg:order-1">
              {items.map((it, i) => {
                const abierto = i === activo;
                const m = medios[i];
                return (
                  // la clave no depende del idioma: al cambiar de idioma tras hidratar, React
                  // rehacía los nodos y el reloj de GSAP seguía animando la barra vieja
                  <li
                    key={m?.src ?? it.titulo}
                    className="relative border-t border-[#060C20]/10"
                  >
                    {/* sin `scale-x-0`: en Tailwind v4 es la propiedad `scale`, que se multiplica
                        con el transform de GSAP y la barra no se veía nunca (creator/GSAP.md) */}
                    <span
                      aria-hidden="true"
                      className="qh-barra absolute -top-px left-0 h-0.5 w-full origin-left"
                      style={{ backgroundColor: AZUL, transform: "scaleX(0)" }}
                    />
                    <h3>
                      <button
                        type="button"
                        aria-expanded={abierto}
                        aria-controls={`qh-${i}`}
                        onClick={() => elegir(i, true)}
                        className={`w-full py-5 text-left text-[21px] leading-[1.2] tracking-[-0.015em] transition-colors duration-300 md:text-[23px] ${
                          abierto
                            ? "text-[#060C20]"
                            : "text-[#060C20]/60 hover:text-[#060C20]/85"
                        }`}
                        style={titular}
                      >
                        {it.titulo}
                      </button>
                    </h3>
                    <div
                      id={`qh-${i}`}
                      className={`grid transition-[grid-template-rows] duration-500 motion-reduce:transition-none ${
                        abierto ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                      style={{ transitionTimingFunction: SUAVE }}
                    >
                      <div className="overflow-hidden" inert={!abierto}>
                        {m && (
                          <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[14px] bg-[#0A1128] lg:hidden">
                            {cargadas.has(i) && pieza(m, i, false)}
                          </div>
                        )}
                        <p className="max-w-[48ch] text-[16px] leading-[1.65] text-gray-600">
                          {it.texto}
                        </p>
                        {it.ejemplo &&
                          (it.ejemplo.slug ? (
                            <Link
                              href={`/casos-de-exito/${it.ejemplo.slug}`}
                              className="mt-3 inline-block text-[14.5px] text-[#0072CF] underline decoration-[#0072CF]/30 underline-offset-4 hover:decoration-[#0072CF]"
                            >
                              {it.ejemplo.texto}
                            </Link>
                          ) : (
                            <p className="mt-3 text-[14.5px] text-[#0072CF]">
                              {it.ejemplo.texto}
                            </p>
                          ))}
                        <div className="h-6" />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

type Capa = { nombre: string; items: { slug?: string; nombre: string }[] };

// Las placas isométricas: la proporción de los rombos del proceso (200 × 116)
const PLACA = { ancho: 300, cx: 128, w: 112, h: 65, grosor: 10 };

/**
 * Con qué trabajamos, por capas (al modo de infinum.com): cada capa en una fila con sus
 * herramientas, y a su izquierda una pila de placas isométricas, una por capa y a la altura de su
 * fila (se miden las filas: si una se parte en dos líneas, su placa la sigue), unidas por un hilo.
 * Las placas caen de a una, de abajo arriba, la primera vez que se ve; con el ratón sobre una
 * fila, su placa se levanta y se pinta de azul. En el celular, solo las filas.
 */
function Capas({
  titulo,
  tambien,
  capas,
}: {
  titulo: string;
  tambien: string;
  capas: Capa[];
}) {
  const raiz = useRef<HTMLDivElement>(null);
  const filas = useRef<HTMLUListElement>(null);
  const [foco, setFoco] = useState<number | null>(null);
  const [medida, setMedida] = useState<{ centros: number[]; alto: number }>({
    centros: [],
    alto: 0,
  });
  const { ancho, cx, w, h, grosor } = PLACA;

  useEffect(() => {
    const ul = filas.current;
    if (!ul) return;
    const medir = () =>
      setMedida({
        centros: [...ul.children].map((li) => {
          const el = li as HTMLElement;
          return el.offsetTop + el.offsetHeight / 2;
        }),
        alto: ul.offsetHeight,
      });
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(ul);
    return () => ro.disconnect();
  }, []);

  const listas = medida.centros.length === capas.length;

  useGSAP(
    () => {
      if (!listas) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // la de abajo primero, como una pila que se arma
        gsap.from(".capa-placa", {
          y: -34,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: raiz.current,
            start: "top 72%",
            once: true,
          },
        });
      });
    },
    { scope: raiz, dependencies: [listas] }
  );

  return (
    <section className="bg-white">
      <div className="container-section">
        <div className="content-section py-20 md:py-28">
          <div
            ref={raiz}
            className="relative overflow-hidden rounded-[24px] px-5 py-10 md:px-12 md:py-14"
            style={{
              background:
                "linear-gradient(140deg, #EEF3FA 0%, #DDE7F5 48%, #C8D7EE 100%)",
            }}
          >
            <Grano opacidad={0.18} />
            <div className="relative grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-16">
              <h2 className={h2Cls} style={titular}>
                {titulo}
              </h2>
              <p className="max-w-[46ch] text-[16px] leading-[1.6] text-[#060C20]/75 lg:justify-self-end">
                {tambien}
              </p>
            </div>
            <div className="relative mt-8 md:mt-10 lg:mt-20 lg:grid lg:grid-cols-[300px_minmax(0,1fr)]">
              <svg
                width={ancho}
                height={medida.alto || 1}
                viewBox={`0 0 ${ancho} ${medida.alto || 1}`}
                aria-hidden="true"
                className="hidden overflow-visible lg:block"
              >
                {listas &&
                  // de abajo hacia arriba, para que cada placa tape a la de debajo
                  capas.map((_, k) => {
                    const fila = capas.length - 1 - k;
                    const cy = (medida.centros[fila] ?? 0) - grosor / 2;
                    const viva = foco === fila;
                    const trazo = "rgba(6,12,32,.28)";
                    const color = {
                      transition: "fill .4s ease, stroke .4s ease",
                    };
                    return (
                      <g key={`placa-${fila}`} className="capa-placa">
                        {/* el hilo hasta la fila */}
                        <line
                          x1={cx + w}
                          y1={cy + grosor / 2}
                          x2={ancho - 6}
                          y2={cy + grosor / 2}
                          stroke={viva ? AZUL : "rgba(6,12,32,.18)"}
                          strokeWidth="1"
                          style={color}
                        />
                        <circle
                          cx={ancho - 6}
                          cy={cy + grosor / 2}
                          r="2.5"
                          fill={viva ? AZUL : "rgba(6,12,32,.35)"}
                          style={color}
                        />
                        <g
                          style={{
                            transform: `translateY(${viva ? -12 : 0}px)`,
                            transition: `transform .55s ${SUAVE}`,
                          }}
                        >
                          <polygon
                            points={`${cx - w},${cy} ${cx},${cy + h} ${cx},${cy + h + grosor} ${cx - w},${cy + grosor}`}
                            fill={viva ? AZUL : "#D3DDED"}
                            stroke={trazo}
                            strokeWidth="0.8"
                            style={color}
                          />
                          <polygon
                            points={`${cx},${cy + h} ${cx + w},${cy} ${cx + w},${cy + grosor} ${cx},${cy + h + grosor}`}
                            fill={viva ? "#005A9E" : "#BFCDE4"}
                            stroke={trazo}
                            strokeWidth="0.8"
                            style={color}
                          />
                          <polygon
                            points={`${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`}
                            fill={viva ? AZUL_LOGO : "rgba(255,255,255,.82)"}
                            stroke={trazo}
                            strokeWidth="0.8"
                            style={color}
                          />
                        </g>
                      </g>
                    );
                  })}
              </svg>

              <ul ref={filas} className="relative">
                {capas.map((c, i) => (
                  <li
                    key={c.nombre}
                    onMouseEnter={() => setFoco(i)}
                    onMouseLeave={() => setFoco(null)}
                    className="grid gap-2.5 border-t border-white/80 py-4 md:grid-cols-[150px_minmax(0,1fr)] md:items-center md:gap-6 md:py-5 lg:pl-6"
                  >
                    <p
                      className="text-[15px] font-medium transition-colors duration-300"
                      style={{ color: foco === i ? AZUL : NOCHE }}
                    >
                      {c.nombre}
                    </p>
                    <ul className="flex flex-wrap gap-1.5 md:gap-2">
                      {c.items.map((it) => {
                        const marca = it.slug
                          ? LOGOS_STACK[it.slug]
                          : undefined;
                        return (
                          <li
                            key={it.nombre}
                            className={`inline-flex h-8 items-center gap-2 rounded-full bg-white/75 text-[13.5px] text-[#060C20] md:h-9 md:text-[14px] ring-1 ring-[#060C20]/[0.06] ${
                              marca ? "pr-3.5 pl-1.5" : "px-3.5"
                            }`}
                          >
                            {marca && it.slug && (
                              <span
                                className="grid size-6 shrink-0 place-items-center rounded-full"
                                style={{ backgroundColor: marca.hex }}
                              >
                                {it.slug === "vendiq" ? (
                                  // solo la «V» del logotipo (los primeros 201 de 694 px), en blanco
                                  <span className="block h-3 w-[15px] overflow-hidden">
                                    <Image
                                      src="/images/highlights/logos/vendiq-v2.png"
                                      alt=""
                                      width={694}
                                      height={160}
                                      className="aspect-[694/160] h-3 w-auto max-w-none [filter:brightness(0)_invert(1)]"
                                    />
                                  </span>
                                ) : (
                                  <img
                                    src={`/images/logos-stack/${marca.claro ? "" : "blanco/"}${it.slug}.svg`}
                                    alt=""
                                    width={14}
                                    height={14}
                                    loading="lazy"
                                    decoding="async"
                                    className="size-3.5"
                                  />
                                )}
                              </span>
                            )}
                            {it.nombre}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * El diagrama del flujo: columnas unidas por una línea fina por la que pasa un punto, una sola vez
 * y de a una, cuando el diagrama entra en pantalla (en el celular las columnas se apilan y la
 * línea es vertical). Con movimiento reducido, las líneas sin punto.
 */
function Flujo({
  columnas,
}: {
  columnas: { titulo: string; items: string[] }[];
}) {
  const [ref, visto] = useVisto<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-visto={visto}
      className="flex flex-col lg:flex-row lg:items-stretch"
    >
      {columnas.map((c, i) => (
        <Fragment key={c.titulo}>
          {i > 0 && (
            <div
              aria-hidden="true"
              className="relative mx-auto h-6 w-px shrink-0 bg-white/20 sm:h-10 lg:mx-0 lg:h-px lg:w-12 lg:self-center"
            >
              <span
                className="flujo-punto absolute top-0 left-1/2 size-1.5 -translate-x-1/2 rounded-full lg:top-1/2 lg:left-0 lg:-translate-y-1/2"
                style={
                  {
                    backgroundColor: AZUL_LOGO,
                    "--retraso": `${(i - 1) * 0.55}s`,
                  } as CSSProperties
                }
              />
            </div>
          )}
          <div className="min-w-0 flex-1 rounded-[14px] bg-white/[0.05] p-4 ring-1 ring-white/10 sm:p-5 md:p-6">
            <p className="text-[17px] leading-[1.25] font-medium text-white">
              {c.titulo}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {c.items.map((it) => (
                <li
                  key={it}
                  className="flex gap-2.5 text-[14.5px] leading-[1.45] text-white/70"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.5em] size-1.5 shrink-0"
                    style={{ backgroundColor: AZUL_LOGO }}
                  />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </Fragment>
      ))}
      <style>{`
        .flujo-punto { opacity: 0; }
        [data-visto="true"] .flujo-punto {
          animation: flujo-baja 1s cubic-bezier(.65,0,.35,1) var(--retraso) 1 both;
        }
        @media (min-width: 1024px) {
          [data-visto="true"] .flujo-punto { animation-name: flujo-cruza; }
        }
        @keyframes flujo-baja {
          0% { opacity: 0; top: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; top: 100%; }
        }
        @keyframes flujo-cruza {
          0% { opacity: 0; left: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; left: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-visto="true"] .flujo-punto { animation: none; }
        }
      `}</style>
    </div>
  );
}

/**
 * El reto y lo que hicimos: dos tarjetas de vidrio lado a lado en escritorio; en el celular, una
 * sola con un selector de dos pestañas encima (el acordeón numerado de elsewhen.com, 2026-10-23),
 * para que la sección no sean dos bloques de texto seguidos.
 */
function RetoHecho({
  partes,
}: { partes: { titulo: string; texto: string }[] }) {
  const [activa, setActiva] = useState(0);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <div className="mt-8 lg:mt-28 lg:max-w-[760px]">
      <div
        role="tablist"
        className="grid grid-cols-2 gap-1 rounded-full bg-white/[0.07] p-1 ring-1 ring-white/12 lg:hidden"
      >
        {partes.map((p, i) => (
          <button
            key={p.titulo}
            type="button"
            role="tab"
            id={`${uid}-t${i}`}
            aria-selected={activa === i}
            aria-controls={`${uid}-p${i}`}
            onClick={() => setActiva(i)}
            className={`h-10 rounded-full text-[14px] font-medium transition-colors duration-300 ${
              activa === i
                ? "bg-white text-[#060C20]"
                : "text-white/75 hover:text-white"
            }`}
          >
            {p.titulo}
          </button>
        ))}
      </div>
      <div className="mt-3 grid gap-4 lg:mt-0 lg:grid-cols-2">
        {partes.map((p, i) => (
          <div
            key={p.titulo}
            id={`${uid}-p${i}`}
            role="tabpanel"
            aria-labelledby={`${uid}-t${i}`}
            className={`rounded-[18px] bg-white/[0.07] p-5 ring-1 ring-white/12 backdrop-blur-md md:p-7 lg:block ${
              activa === i ? "" : "hidden"
            }`}
          >
            <h3 className="text-[15px] font-medium text-white max-lg:sr-only">
              {p.titulo}
            </h3>
            <p className="text-[15.5px] leading-[1.65] text-white/80 lg:mt-3">
              {p.texto}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Cómo trabajamos, sobre un plano isométrico: cada paso queda enmarcado por un rombo de la misma
 * geometría que los gráficos del hero, y una línea azul avanza de izquierda a derecha una sola vez
 * encendiendo el nodo de cada paso al pasar (BrandVM lo hace con círculos; esto es lo nuestro).
 * En el celular, los pasos se apilan sobre una línea vertical. Con movimiento reducido, todo
 * encendido y quieto.
 */
function Proceso({
  titulo,
  pasos,
  tellevas,
}: {
  titulo: string;
  pasos: { titulo: string; texto: string; entrega?: string }[];
  tellevas: string;
}) {
  const [ref, visto] = useVisto<HTMLOListElement>();
  const N = pasos.length;
  return (
    // en claro desde el 2026-10-23 (la refinada con elsewhen.com de referencia): una sola sección
    // oscura además del hero, el proyecto en detalle; antes se alternaban cinco
    <section
      data-nav-theme="light"
      className="relative overflow-hidden bg-[#F6F7FA] text-[#060C20]"
    >
      <div className="container-section relative">
        <div className="content-section py-20 md:py-28">
          <h2
            className="titulo-seccion max-w-[20ch] md:mx-auto md:text-center"
            style={titular}
          >
            {titulo}
          </h2>
          <ol
            ref={ref}
            data-visto={visto}
            className="proc relative mt-14 grid gap-12 pl-8 md:mt-20 md:grid-cols-4 md:gap-6 md:pl-0"
          >
            {/* la línea: base tenue y la que avanza (vertical en el celular) */}
            <span
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[6px] w-px bg-[#060C20]/12 md:top-[87px] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-auto"
            />
            <span
              aria-hidden="true"
              className="proc-avance absolute top-2 bottom-2 left-[6px] w-px md:top-[87px] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-auto"
              style={{ backgroundColor: AZUL_LOGO }}
            />
            {pasos.map((p, i) => (
              <li
                key={p.titulo}
                className="relative flex flex-col md:items-center md:text-center"
                style={{ "--i": i, "--n": N } as CSSProperties}
              >
                {/* el rombo isométrico que enmarca el paso */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 116"
                  className="pointer-events-none absolute top-[87px] left-1/2 hidden w-[118%] -translate-x-1/2 -translate-y-1/2 md:block"
                >
                  <polygon
                    points="100,1 199,58 100,115 1,58"
                    fill="none"
                    stroke="rgba(6,12,32,.12)"
                    strokeWidth="0.6"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <div className="relative md:flex md:h-[60px] md:flex-col md:justify-end">
                  <p className="text-[13px] text-[#060C20]/65">{i + 1}</p>
                  <h3 className="mt-1 text-[20px] leading-[1.25] font-medium">
                    {p.titulo}
                  </h3>
                </div>
                {/* el nodo: un rombo que se enciende cuando la línea llega */}
                <span
                  aria-hidden="true"
                  className="proc-nodo absolute top-1.5 -left-8 grid h-3.5 w-6 place-items-center md:relative md:top-auto md:left-auto md:mt-5"
                >
                  <svg
                    viewBox="0 0 24 14"
                    className="h-3.5 w-6"
                    aria-hidden="true"
                  >
                    <polygon points="12,0.5 23.5,7 12,13.5 0.5,7" />
                  </svg>
                </span>
                <p className="relative mt-3 text-[15.5px] leading-[1.6] text-[#060C20]/70 md:mt-6 md:max-w-[30ch]">
                  {p.texto}
                </p>
                {p.entrega && (
                  <p className="relative mt-4 text-[14px] leading-[1.5] text-[#060C20] md:max-w-[30ch]">
                    <span className="text-[#060C20]/65">{tellevas}</span>{" "}
                    {p.entrega}
                  </p>
                )}
              </li>
            ))}
          </ol>
          <style>{`
            .proc-avance { transform-origin: top; transform: scaleY(0); }
            .proc-nodo polygon { fill: rgba(6,12,32,.16); transition: fill .5s ease, filter .5s ease; }
            @media (min-width: 768px) { .proc-avance { transform-origin: left; transform: scaleX(0); } }
            .proc[data-visto="true"] .proc-avance { animation: proc-y 2.4s cubic-bezier(.65,0,.35,1) .2s forwards; }
            @media (min-width: 768px) { .proc[data-visto="true"] .proc-avance { animation-name: proc-x; } }
            .proc[data-visto="true"] .proc-nodo polygon {
              fill: ${AZUL_LOGO}; filter: drop-shadow(0 0 6px rgba(0,146,209,.55));
              transition-delay: calc(.2s + 2.4s * (var(--i) + .5) / var(--n));
            }
            @keyframes proc-x { to { transform: scaleX(1); } }
            @keyframes proc-y { to { transform: scaleY(1); } }
            @media (prefers-reduced-motion: reduce) {
              .proc-avance { transform: none !important; animation: none !important; }
              .proc-nodo polygon { fill: ${AZUL_LOGO} !important; transition: none !important; }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}

/**
 * Las preguntas frecuentes: se abren y se cierran sin salto (la fila crece de 0fr a 1fr), una a la
 * vez, con la primera abierta.
 */

export function PaginaServicio({ id }: { id: IdServicio }) {
  const { t, locale } = useTranslation("services");
  const { t: tl } = useTranslation("landing");
  const datos = PAGINAS_SERVICIO[id];
  const K = `paginas.${id}`;
  const C = "paginasComun";

  // `t` devuelve texto: las listas se leen por índice hasta que se acaban
  const lista = (clave: string, max = 10) => {
    const out: number[] = [];
    for (let i = 0; i < max; i++) {
      const v = t(`${clave}.${i}`);
      if (v === `${clave}.${i}`) break;
      out.push(i);
    }
    return out;
  };
  const textos = (clave: string) => lista(clave).map((i) => t(`${clave}.${i}`));
  const existe = (clave: string) => t(clave) !== clave;

  // El gráfico del hero se dibuja una vez al llegar
  const [toque, setToque] = useState(0);
  useEffect(() => {
    const id = window.setTimeout(() => setToque(1), 250);
    return () => window.clearTimeout(id);
  }, []);

  const { detalle, casos, relacionado, medios } = datos;
  const KD = `${K}.detalle`;
  const conProyecto = detalle.caso !== null;
  const columnas = lista(`${KD}.flujo`).map((i) => ({
    titulo: t(`${KD}.flujo.${i}.titulo`),
    items: textos(`${KD}.flujo.${i}.items`),
  }));
  const hacemos = lista(`${K}.hacemos`).map((i) => {
    const kh = `${K}.hacemos.${i}`;
    return {
      titulo: t(`${kh}.titulo`),
      texto: t(`${kh}.texto`),
      ejemplo: existe(`${kh}.ejemplo.texto`)
        ? {
            texto: t(`${kh}.ejemplo.texto`),
            slug: existe(`${kh}.ejemplo.slug`)
              ? t(`${kh}.ejemplo.slug`)
              : undefined,
          }
        : undefined,
    };
  });
  const capas = lista(`${K}.stack.capas`).map((i) => {
    const kc = `${K}.stack.capas.${i}`;
    return {
      nombre: t(`${kc}.nombre`),
      items: lista(`${kc}.items`).map((j) => ({
        nombre: t(`${kc}.items.${j}.nombre`),
        slug: existe(`${kc}.items.${j}.slug`)
          ? t(`${kc}.items.${j}.slug`)
          : undefined,
      })),
    };
  });

  const chip =
    "rounded-full border px-3 py-1 text-[13.5px] leading-[1.4] whitespace-nowrap";

  return (
    <div className="selection:bg-[#0092D1]/25 selection:text-[#060C20]">
      {/* 1 · Hero */}
      <section
        data-nav-theme="dark"
        className="relative overflow-hidden text-white"
        style={{ backgroundColor: NOCHE }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-[-12%] size-[min(90vw,900px)] -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(0,114,207,.32), rgba(0,146,209,.08) 55%, transparent)",
          }}
        />
        <Grano />
        <div className="container-section relative">
          <div className="content-section grid items-center gap-12 pt-32 pb-20 md:pt-40 md:pb-24 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
            <div>
              <nav
                aria-label="Breadcrumb"
                className="mb-8 flex flex-wrap gap-2 text-[13px] text-white/55"
              >
                <Link href="/" className="-my-1.5 py-1.5 hover:text-white">
                  {t(`${C}.inicio`)}
                </Link>
                <span aria-hidden="true">/</span>
                <Link
                  href="/#servicios"
                  className="-my-1.5 py-1.5 hover:text-white"
                >
                  {t(`${C}.servicios`)}
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-white/80">{t(`${K}.nombre`)}</span>
              </nav>
              <h1
                className="max-w-[17ch] text-[clamp(38px,6vw,70px)] leading-[1.03] tracking-[-0.035em]"
                style={titular}
              >
                {t(`${K}.titulo`)}
              </h1>
              <p className="mt-6 max-w-[54ch] text-[17px] leading-[1.6] text-white/70 md:text-[18px]">
                {t(`${K}.bajada`)}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="#contacto"
                  className="inline-flex h-12 items-center rounded-full bg-white px-6 text-[15px] font-medium text-[#060C20] transition-colors hover:bg-white/90"
                >
                  {t(`${C}.cta`)}
                </Link>
                <Link
                  href={conProyecto ? "#proyecto" : "/portafolio"}
                  className="inline-flex h-12 items-center rounded-full border border-white/25 px-6 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
                >
                  {conProyecto ? t(`${C}.verCasos`) : t(`${C}.verProyectos`)}
                </Link>
              </div>
            </div>
            <div className="mx-auto aspect-[185/202] w-full max-w-[200px] sm:max-w-[300px] lg:max-w-[400px]">
              <Grafico id={id} toque={toque} />
            </div>
          </div>
        </div>
      </section>

      {/* 2 · Qué hacemos, en pestañas con su pieza */}
      <QueHacemos
        titulo={t(`${K}.secciones.hacemos`)}
        items={hacemos}
        medios={medios}
        locale={locale}
      />

      {/* 3 · Un proyecto en detalle: su foto fundida en el navy y el reto y lo hecho en tarjetas de
          vidrio encima (sin proyecto, como en IoT y cloud: cómo se arma el sistema) */}
      <section
        id="proyecto"
        data-nav-theme="dark"
        className="relative scroll-mt-16 overflow-hidden text-white"
        style={{ backgroundColor: NOCHE }}
      >
        <Grano opacidad={0.05} />
        <div className="container-section relative">
          <div className="content-section py-20 md:py-28">
            {conProyecto && detalle.foto ? (
              <div className="relative overflow-hidden rounded-[24px] bg-[#0A1128] ring-1 ring-white/10">
                <div className="relative aspect-[16/10] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[64%]">
                  <Image
                    src={detalle.foto.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: detalle.foto.encuadre }}
                  />
                  {/* el fundido: hacia abajo en el celular, hacia la izquierda en escritorio */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 lg:hidden"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 45%, #0A1128 100%)",
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 hidden lg:block"
                    style={{
                      background:
                        "linear-gradient(90deg, #0A1128 0%, rgba(10,17,40,.82) 22%, rgba(10,17,40,.25) 55%, rgba(10,17,40,.05) 100%)",
                    }}
                  />
                </div>
                <div className="relative px-6 pt-2 pb-8 md:px-10 md:pb-10 lg:px-12 lg:pt-14 lg:pb-12">
                  <p className="text-[14px] text-white/60">
                    {t(`${C}.detalle`)} · {detalle.cliente}
                  </p>
                  <h2
                    className="titulo-seccion mt-3 max-w-[18ch]"
                    style={titular}
                  >
                    {t(`${KD}.titulo`)}
                  </h2>
                  <RetoHecho
                    partes={(["reto", "hicimos"] as const).map((k) => ({
                      titulo: t(`${C}.${k}`),
                      texto: t(`${KD}.${k}`),
                    }))}
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="titulo-seccion max-w-[22ch]" style={titular}>
                  {t(`${KD}.titulo`)}
                </h2>
                <p className="mt-5 max-w-[60ch] text-[16px] leading-[1.7] text-white/70 md:text-[17px]">
                  {t(`${KD}.texto`)}
                </p>
              </>
            )}

            <div className="mt-12">
              {detalle.tipo === "mosaico" && detalle.imagenes ? (
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {detalle.imagenes.map((img) => (
                    <div
                      key={img.src}
                      className={`relative overflow-hidden rounded-md bg-white/5 ${
                        img.ancho === 2
                          ? `col-span-2 aspect-[2/1] ${img.estira ? "lg:aspect-auto" : ""}`
                          : "aspect-square"
                      }`}
                    >
                      <Image
                        src={img.src}
                        alt=""
                        fill
                        sizes={
                          img.ancho === 2
                            ? "(min-width: 1024px) 50vw, 100vw"
                            : "(min-width: 1024px) 25vw, 50vw"
                        }
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Flujo columnas={columnas} />
              )}
            </div>

            {conProyecto && (
              <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
                <div className="-mx-4 flex snap-x scroll-px-4 items-center gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
                  <span className="mr-1 shrink-0 snap-start text-[14px] text-white/60">
                    {t(`${C}.incluyo`)}
                  </span>
                  {textos(`${KD}.incluyo`).map((s) => (
                    <span
                      key={s}
                      className={`${chip} shrink-0 snap-start border-white/20 text-white/85`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/casos-de-exito/${detalle.caso}`}
                  className="inline-flex h-11 w-fit shrink-0 items-center rounded-full bg-white px-5 text-[14px] font-medium text-[#060C20] transition-colors hover:bg-white/90"
                >
                  {t(`${C}.verCaso`)}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4 · Con qué trabajamos, por capas */}
      {capas.length > 0 && (
        <Capas
          titulo={t(`${K}.secciones.stack`)}
          tambien={t(`${K}.stack.tambien`)}
          capas={capas}
        />
      )}

      {/* 5 · Cómo trabajamos */}
      <Proceso
        titulo={t(`${K}.secciones.proceso`)}
        tellevas={t(`${C}.tellevas`)}
        pasos={lista(`${K}.pasos`).map((i) => ({
          titulo: t(`${K}.pasos.${i}.titulo`),
          texto: t(`${K}.pasos.${i}.texto`),
          entrega: existe(`${K}.pasos.${i}.entrega`)
            ? t(`${K}.pasos.${i}.entrega`)
            : undefined,
        }))}
      />

      {/* 6 · Más trabajo: la portada enseña su vídeo al pasar el ratón (la de «Nuestro trabajo») */}
      {casos.length > 0 && (
        <section className="bg-white">
          <div className="container-section">
            <div className="content-section py-20 md:py-28">
              <h2 className={h2Cls} style={titular}>
                {t(`${K}.secciones.mas`)}
              </h2>
              <div className="mt-10 flex flex-col gap-5">
                {casos.map((caso, i) => {
                  const kc = `${K}.casos.${i}`;
                  const metricas = lista(`${kc}.metricas`, 3);
                  return (
                    <article
                      key={caso.slug}
                      className="grid overflow-hidden rounded-[20px] bg-[#F6F7FA] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
                    >
                      <div className="flex flex-col p-6 md:p-10">
                        <p className="text-[15px] font-medium text-[#060C20]">
                          {caso.cliente}
                        </p>
                        <p className="mt-5 text-[13px]" style={{ color: AZUL }}>
                          {t(`${kc}.categoria`)}
                        </p>
                        <h3 className="mt-2 max-w-[30ch] text-[22px] leading-[1.25] font-medium text-[#060C20] md:text-[24px]">
                          {t(`${kc}.titulo`)}
                        </h3>
                        {metricas.length > 0 && (
                          <ul className="mt-6 flex flex-col gap-1.5">
                            {metricas.map((m) => (
                              <li
                                key={m}
                                className="text-[16px] leading-[1.5] text-gray-600"
                              >
                                <strong className="font-semibold text-[#060C20] tabular-nums">
                                  {t(`${kc}.metricas.${m}.valor`)}
                                </strong>{" "}
                                {t(`${kc}.metricas.${m}.texto`)}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="mt-7 hidden flex-wrap gap-2 sm:flex">
                          {textos(`${kc}.incluyo`).map((s) => (
                            <span
                              key={s}
                              className={`${chip} border-[#060C20]/12 text-gray-700`}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={`/casos-de-exito/${caso.slug}`}
                          className="mt-7 inline-flex h-11 w-fit items-center rounded-full bg-[#060C20] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#0B1838] sm:mt-9 lg:mt-auto"
                        >
                          {t(`${C}.verCaso`)}
                        </Link>
                      </div>
                      <Portada
                        p={{
                          href: `/casos-de-exito/${caso.slug}`,
                          cover: caso.portada,
                          video: caso.video,
                          encuadre: caso.encuadre,
                        }}
                        nombre={caso.cliente}
                        etiqueta={t(`${C}.verCaso`)}
                        circulo={tl("portfolio.verProyecto")}
                        className="aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[400px]"
                        marco="order-first lg:order-none"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                      />
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7 · El puente al servicio relacionado */}
      <section data-nav-theme="light" className="bg-[#F6F7FA]">
        <div className="container-section">
          <div className="content-section grid items-center gap-10 py-20 md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <div>
              <h2
                className="titulo-seccion max-w-[20ch] text-[#060C20]"
                style={titular}
              >
                {t(`${K}.puente.titulo`)}
              </h2>
              <p className="mt-5 max-w-[46ch] text-[16px] leading-[1.6] text-[#060C20]/70 md:text-[17px]">
                {t(`${K}.puente.texto`)}
              </p>
            </div>
            <Link
              href={rutaServicio(relacionado)}
              className="group flex items-center gap-6 rounded-[20px] p-5 text-white transition-transform duration-500 hover:-translate-y-0.5 md:p-6"
              style={{ backgroundColor: NOCHE }}
            >
              <span className="block aspect-[185/202] w-[96px] shrink-0 md:w-[116px]">
                <Grafico id={relacionado} quieto />
              </span>
              <span>
                <span className="block text-[20px] leading-[1.25] font-medium md:text-[22px]">
                  {tl(`home.serviciosSeis.items.${relacionado}.titulo`)}
                </span>
                <span className="mt-3 inline-block text-[14px] text-white/75 underline decoration-white/30 underline-offset-4 group-hover:text-white group-hover:decoration-white/70">
                  {t(`${C}.verServicio`)}
                </span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8 · Preguntas frecuentes */}
      {existe(`${K}.faqs.0.q`) && (
        <Preguntas
          titulo={t(`${C}.faq`)}
          faqs={lista(`${K}.faqs`).map((i) => ({
            q: t(`${K}.faqs.${i}.q`),
            a: t(`${K}.faqs.${i}.a`),
          }))}
        />
      )}

      <CaseContactCTA />
    </div>
  );
}
