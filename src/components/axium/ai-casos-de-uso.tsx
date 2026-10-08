"use client";

/*
 * «Lo que podemos construir» de AI & Agentic Systems (2026-10-07).
 * Alexander: «no te centres en nuestros proyectos, sino en lo que podemos hacer; analiza qué
 * hacen usualmente las empresas de software para esos servicios». El catálogo que repiten
 * (xyz.dev, Relevant Software, Netguru, South) son estos seis: flujos entre sistemas,
 * atención por chat/WhatsApp, lectura de documentos, asistente sobre el conocimiento de la
 * empresa (RAG), calificación de prospectos e IA dentro del producto. Casi todas lo cuentan
 * con texto e iconos; las de producto (n8n, Relevance, Lindy) enseñan al agente trabajando, y
 * eso es lo que hace cada viñeta: está escrita en código, con los textos traducidos, y mide
 * 40 em de ancho (1 em = 1/40 del contenedor), así que nunca se recorta. Donde ya lo tenemos
 * en producción, la tarjeta lo dice abajo, en chico: Feniz primero (pedido de Alexander).
 * Luego: «mucha animación en paralelo, dale más sutileza». Ya no hay bucles: las viñetas se
 * arman DE UNA EN UNA y una sola vez, en orden, cuando la tarjeta entra en pantalla; las demás
 * esperan quietas en su cuadro completo. Pasar el ratón por una la repite. Sin ruedas que giran,
 * transiciones más largas y un ritmo un poco más lento.
 */

import {
  ArrowUpRight,
  Bot,
  CalendarCheck,
  Check,
  ClipboardList,
  Database,
  FileText,
  MessageCircle,
  Package,
  ReceiptText,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { WhatsAppButton } from "~/components/axium/service-blocks";
import { smoothEase } from "~/components/axium/service-shared";

const TEAL = "#7ECFC3";
const SUPERFICIE = "rgba(255,255,255,0.05)";
const BORDE = "rgba(255,255,255,0.09)";

type T = (k: string) => string;

/** Ritmo del guion: cada «segundo» de las viñetas dura 1/RITMO segundos reales. */
const RITMO = 0.85;

/** El reloj de una viñeta: quieto en el cuadro completo (`fin`) hasta que le toca; entonces se
 * arma desde cero una vez y avisa al terminar. Antes de hidratar también se ve completo. */
function useReloj(activo: boolean, fin: number, alTerminar: () => void) {
  const [t, setT] = useState(fin);
  const aviso = useRef(alTerminar);
  aviso.current = alTerminar;
  useEffect(() => {
    if (!activo) {
      setT(fin);
      return;
    }
    const base = performance.now();
    setT(0);
    const id = window.setInterval(() => {
      const s = ((performance.now() - base) / 1000) * RITMO;
      if (s >= fin) {
        window.clearInterval(id);
        setT(fin);
        aviso.current();
      } else setT(Math.round(s * 10) / 10);
    }, 100);
    return () => window.clearInterval(id);
  }, [activo, fin]);
  return t;
}

/** Aparece abriendo su alto: lo de arriba se corre con suavidad, como en un chat. */
function Abre({
  on,
  children,
  arriba = 0.8,
}: {
  on: boolean;
  children: ReactNode;
  arriba?: number;
}) {
  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-700 ease-out ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
    >
      <div className="min-h-0 overflow-hidden">
        <div style={{ paddingTop: `${arriba}em` }}>{children}</div>
      </div>
    </div>
  );
}

function Hecho({ ok, size = 1.25 }: { ok: boolean; size?: number }) {
  const s = { width: `${size}em`, height: `${size}em` };
  // sin rueda que gira: un aro quieto que pasa a check
  return ok ? (
    <Check style={{ ...s, color: TEAL }} strokeWidth={2.6} />
  ) : (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{
        width: `${size * 0.8}em`,
        height: `${size * 0.8}em`,
        margin: `${size * 0.1}em`,
        border: "1.5px solid rgba(255,255,255,0.3)",
      }}
    />
  );
}

function Lienzo({
  t,
  luz = "80% 0%",
  children,
}: {
  t: number;
  luz?: string;
  children: ReactNode;
}) {
  // al empezar su turno, lo completo se funde y la viñeta se arma desde vacía
  const vivo = t >= 0.5;
  return (
    <div
      className="absolute inset-0 overflow-hidden text-white"
      style={{
        fontSize: "2.5cqw",
        background: `radial-gradient(75% 70% at ${luz}, rgba(126,207,195,0.13), rgba(126,207,195,0) 70%), linear-gradient(180deg, #111A30 0%, #0C1426 100%)`,
      }}
    >
      <div
        className={`absolute inset-0 flex flex-col transition-opacity duration-700 ${vivo ? "opacity-100" : "opacity-0"}`}
        style={{ padding: "2.4em" }}
      >
        {children}
      </div>
    </div>
  );
}

const icono = { width: "1.6em", height: "1.6em" };

// ── 1 · Flujos entre sistemas ────────────────────────────────────────────────
function VFlujos({ d, t }: { d: T; t: number }) {
  const pasos = [
    { n: d("n1"), s: d("s1"), Ic: ShoppingBag, en: 0.8 },
    { n: d("n2"), s: d("s2"), Ic: Package, en: 2.0 },
    { n: d("n3"), s: d("s3"), Ic: ReceiptText, en: 3.2 },
    { n: d("n4"), s: d("s4"), Ic: MessageCircle, en: 4.4 },
  ];
  return (
    <Lienzo t={t} luz="0% 0%">
      <div className="flex flex-1 flex-col justify-center">
        {pasos.map((p, i) => {
          const activo = t >= p.en;
          const hecho = t >= p.en + 0.6;
          return (
            <div key={p.n}>
              {i > 0 && (
                <div
                  className="relative"
                  style={{ height: "1.3em", marginLeft: "2.55em", width: 2 }}
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: BORDE }}
                  />
                  <div
                    className="absolute inset-0 origin-top transition-transform duration-500 ease-out"
                    style={{
                      background: TEAL,
                      transform: `scaleY(${t >= p.en ? 1 : 0})`,
                    }}
                  />
                </div>
              )}
              <div
                className="flex items-center transition-all duration-700"
                style={{
                  gap: "1em",
                  padding: "0.8em 1em",
                  borderRadius: "0.9em",
                  background: activo ? "rgba(126,207,195,0.08)" : SUPERFICIE,
                  border: `1px solid ${activo ? "rgba(126,207,195,0.45)" : BORDE}`,
                  opacity: activo ? 1 : 0.45,
                }}
              >
                <div
                  className="grid shrink-0 place-items-center"
                  style={{
                    width: "3.1em",
                    height: "3.1em",
                    borderRadius: "0.75em",
                    background: activo
                      ? "rgba(126,207,195,0.16)"
                      : "rgba(255,255,255,0.06)",
                    color: activo ? TEAL : "rgba(255,255,255,0.6)",
                  }}
                >
                  <p.Ic style={icono} />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate font-semibold"
                    style={{ fontSize: "1.3em", lineHeight: 1.25 }}
                  >
                    {p.n}
                  </p>
                  <p
                    className="truncate text-white/50"
                    style={{ fontSize: "1.05em", marginTop: "0.15em" }}
                  >
                    {p.s}
                  </p>
                </div>
                {activo && <Hecho ok={hecho} size={1.4} />}
              </div>
            </div>
          );
        })}
      </div>
    </Lienzo>
  );
}

// ── 2 · Atención por WhatsApp ────────────────────────────────────────────────
function Burbuja({ yo, children }: { yo?: boolean; children: ReactNode }) {
  return (
    <div className={`flex ${yo ? "justify-end" : "justify-start"}`}>
      <p
        style={{
          maxWidth: "78%",
          fontSize: "1.25em",
          lineHeight: 1.4,
          padding: "0.55em 0.85em",
          borderRadius: yo ? "1em 1em 0.25em 1em" : "1em 1em 1em 0.25em",
          background: yo ? "rgba(255,255,255,0.10)" : "rgba(126,207,195,0.16)",
          border: `1px solid ${yo ? BORDE : "rgba(126,207,195,0.30)"}`,
        }}
      >
        {children}
      </p>
    </div>
  );
}

function Herramienta({
  ok,
  Ic,
  children,
}: {
  ok: boolean;
  Ic: typeof Search;
  children: ReactNode;
}) {
  return (
    <div className="flex justify-start">
      <span
        className="inline-flex items-center text-white/70"
        style={{
          gap: "0.5em",
          fontSize: "1.05em",
          padding: "0.35em 0.75em",
          borderRadius: 999,
          background: SUPERFICIE,
          border: `1px solid ${BORDE}`,
        }}
      >
        <Ic style={{ width: "1.15em", height: "1.15em" }} />
        {children}
        <Hecho ok={ok} size={1.1} />
      </span>
    </div>
  );
}

function VChat({ d, t }: { d: T; t: number }) {
  return (
    <Lienzo t={t} luz="100% 100%">
      <div
        className="flex items-center"
        style={{
          gap: "0.8em",
          paddingBottom: "1em",
          borderBottom: `1px solid ${BORDE}`,
        }}
      >
        <div
          className="grid place-items-center"
          style={{
            width: "2.8em",
            height: "2.8em",
            borderRadius: 999,
            background: "rgba(126,207,195,0.18)",
            color: TEAL,
          }}
        >
          <Bot style={{ width: "1.5em", height: "1.5em" }} />
        </div>
        <div>
          <p className="font-semibold" style={{ fontSize: "1.3em" }}>
            {d("head")}
          </p>
          <p
            className="flex items-center text-white/50"
            style={{ fontSize: "1.05em", gap: "0.4em" }}
          >
            <span
              className="inline-block rounded-full"
              style={{ width: "0.55em", height: "0.55em", background: TEAL }}
            />
            {d("status")}
          </p>
        </div>
      </div>
      <div
        className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden"
        style={{
          maskImage: "linear-gradient(180deg, transparent 0, #000 2.5em)",
          WebkitMaskImage: "linear-gradient(180deg, transparent 0, #000 2.5em)",
        }}
      >
        <Abre on={t >= 0.8}>
          <Burbuja yo>{d("m1")}</Burbuja>
        </Abre>
        <Abre on={t >= 1.7}>
          <Herramienta ok={t >= 2.6} Ic={Database}>
            {d("tool1")}
          </Herramienta>
        </Abre>
        <Abre on={t >= 2.9}>
          <Burbuja>{d("m2")}</Burbuja>
        </Abre>
        <Abre on={t >= 4.4}>
          <Burbuja yo>{d("m3")}</Burbuja>
        </Abre>
        <Abre on={t >= 5.3}>
          <Herramienta ok={t >= 6.0} Ic={ClipboardList}>
            {d("tool2")}
          </Herramienta>
        </Abre>
        <Abre on={t >= 6.4}>
          <Burbuja>{d("m4")}</Burbuja>
        </Abre>
      </div>
    </Lienzo>
  );
}

// ── 3 · Documentos que se leen solos ─────────────────────────────────────────
// el QR de la representación impresa de un comprobante electrónico, dibujado (no se lee)
const QR = [
  "111111101",
  "100000100",
  "101110111",
  "101110010",
  "100000101",
  "111111100",
  "000010111",
  "110101001",
  "101011011",
]
  .join("")
  .split("");
function VDocs({ d, t }: { d: T; t: number }) {
  const campos = [
    { k: d("k1"), v: d("v1"), en: 1.4 },
    { k: d("k2"), v: d("v2"), en: 2.2 },
    { k: d("k3"), v: d("v3"), en: 3.0 },
    { k: d("k4"), v: d("v4"), en: 3.8 },
  ];
  const leyendo = t >= 0.8 && t < 4.6;
  const marca = (en: number) => ({
    outline: `2px solid ${t >= en ? TEAL : "transparent"}`,
    outlineOffset: "0.15em",
    borderRadius: "0.2em",
    transition: "outline-color .4s",
  });
  const barra = (w: string) => (
    <div
      style={{
        width: w,
        height: "0.5em",
        borderRadius: 99,
        background: "#D9D4C8",
        marginTop: "0.55em",
      }}
    />
  );
  return (
    <Lienzo t={t} luz="100% 0%">
      <div className="flex flex-1" style={{ gap: "1.8em" }}>
        {/* el papel: ilustrativo, en gris; solo se leen los cuatro datos que se extraen */}
        <div
          className="relative flex shrink-0 flex-col overflow-hidden"
          style={{
            width: "15.5em",
            borderRadius: "0.7em",
            background: "#F3F0E8",
            color: "#2B2F38",
            padding: "1.3em 1.2em",
          }}
        >
          <div className="flex items-center" style={{ gap: "0.5em" }}>
            <FileText
              style={{ width: "1.3em", height: "1.3em", color: "#5B6170" }}
            />
            <p
              className="font-bold uppercase"
              style={{ fontSize: "1em", letterSpacing: "0.08em" }}
            >
              {d("doc")}
            </p>
          </div>
          <p style={{ fontSize: "0.95em", marginTop: "0.9em", ...marca(1.4) }}>
            {d("k1")} {d("v1")}
          </p>
          <p
            className="truncate"
            style={{ fontSize: "0.95em", marginTop: "0.5em", ...marca(2.2) }}
          >
            {d("v2")}
          </p>
          {barra("90%")}
          {barra("70%")}
          {barra("82%")}
          {barra("55%")}
          <div className="flex justify-between" style={{ marginTop: "1em" }}>
            <span style={{ fontSize: "0.95em" }}>{d("k3")}</span>
            <span
              className="font-bold"
              style={{ fontSize: "0.95em", ...marca(3.0) }}
            >
              {d("v3")}
            </span>
          </div>
          <p
            style={{
              fontSize: "0.9em",
              marginTop: "0.6em",
              color: "#5B6170",
              ...marca(3.8),
            }}
          >
            {d("k4")} {d("v4")}
          </p>
          <div className="mt-auto flex items-end" style={{ gap: "0.9em" }}>
            <div
              className="grid shrink-0"
              style={{
                width: "3.6em",
                height: "3.6em",
                gridTemplateColumns: "repeat(9, 1fr)",
              }}
            >
              {QR.map((c, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: celdas fijas del dibujo
                  key={i}
                  style={{ background: c === "1" ? "#2B2F38" : "transparent" }}
                />
              ))}
            </div>
            <div className="flex-1">
              {barra("100%")}
              {barra("75%")}
            </div>
          </div>
          <div
            className="pointer-events-none absolute inset-x-0"
            style={{
              height: "3em",
              top: leyendo ? "100%" : "-3em",
              opacity: leyendo ? 1 : 0,
              background:
                "linear-gradient(180deg, rgba(126,207,195,0) 0%, rgba(126,207,195,0.2) 100%)",
              borderBottom: "1.5px solid rgba(126,207,195,0.7)",
              transition: leyendo
                ? "top 3.8s linear, opacity .3s"
                : "opacity .3s",
            }}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <p
            className="uppercase text-white/45"
            style={{ fontSize: "0.95em", letterSpacing: "0.1em" }}
          >
            {d("title")}
          </p>
          {campos.map((c) => (
            <Abre key={c.k} on={t >= c.en} arriba={0.9}>
              <p className="text-white/50" style={{ fontSize: "1em" }}>
                {c.k}
              </p>
              <p
                className="truncate font-semibold"
                style={{ fontSize: "1.3em" }}
              >
                {c.v}
              </p>
            </Abre>
          ))}
          <div className="mt-auto">
            <Abre on={t >= 4.8}>
              <span
                className="inline-flex items-center font-semibold"
                style={{
                  gap: "0.45em",
                  fontSize: "1.05em",
                  padding: "0.45em 0.8em",
                  borderRadius: 999,
                  background: "rgba(126,207,195,0.14)",
                  color: TEAL,
                }}
              >
                <Check style={{ width: "1.1em", height: "1.1em" }} />
                {d("ok")}
              </span>
            </Abre>
          </div>
        </div>
      </div>
    </Lienzo>
  );
}

// ── 4 · Un asistente que conoce tu empresa (RAG) ─────────────────────────────
function VRag({ d, t }: { d: T; t: number }) {
  const fuentes = [
    { s: d("src1"), en: 2.0 },
    { s: d("src2"), en: 2.4 },
    { s: d("src3"), en: 2.8 },
  ];
  const escribe = t >= 3.6;
  return (
    <Lienzo t={t} luz="0% 100%">
      <Abre on={t >= 0.8} arriba={0}>
        <Burbuja yo>{d("q")}</Burbuja>
      </Abre>
      <Abre on={t >= 1.6} arriba={1.1}>
        <p
          className="flex items-center text-white/60"
          style={{ fontSize: "1.05em", gap: "0.5em" }}
        >
          <Search style={{ width: "1.15em", height: "1.15em" }} />
          {d("search")}
          <Hecho ok={t >= 3.1} size={1.1} />
        </p>
        <div
          className="flex flex-wrap"
          style={{ gap: "0.5em", marginTop: "0.7em" }}
        >
          {fuentes.map((f, i) => (
            <span
              key={f.s}
              className="inline-flex items-center transition-all duration-700"
              style={{
                gap: "0.45em",
                fontSize: "1em",
                padding: "0.3em 0.7em",
                borderRadius: "0.5em",
                background: SUPERFICIE,
                border: `1px solid ${t >= f.en ? "rgba(126,207,195,0.4)" : BORDE}`,
                opacity: t >= f.en ? 1 : 0,
                transform: `translateY(${t >= f.en ? 0 : 0.4}em)`,
              }}
            >
              <span style={{ color: TEAL }} className="font-semibold">
                {i + 1}
              </span>
              {f.s}
            </span>
          ))}
        </div>
      </Abre>
      <div className="mt-auto">
        <Abre on={t >= 3.4} arriba={1.2}>
          <div
            style={{
              padding: "1em 1.1em",
              borderRadius: "1em",
              background: "rgba(126,207,195,0.10)",
              border: "1px solid rgba(126,207,195,0.28)",
            }}
          >
            <p
              className="flex items-center font-semibold"
              style={{ fontSize: "1em", gap: "0.4em", color: TEAL }}
            >
              <Sparkles style={{ width: "1.1em", height: "1.1em" }} />
              AI
            </p>
            <p
              style={{
                fontSize: "1.4em",
                lineHeight: 1.4,
                marginTop: "0.35em",
                clipPath: escribe ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
                transition: escribe ? "clip-path 1.6s linear" : "none",
              }}
            >
              {d("a")} <sup style={{ color: TEAL, fontWeight: 600 }}>1 2 3</sup>
            </p>
          </div>
        </Abre>
      </div>
    </Lienzo>
  );
}

// ── 5 · Prospectos que se califican solos ────────────────────────────────────
function VLeads({ d, t }: { d: T; t: number }) {
  const datos = [
    { s: d("e1"), en: 1.8 },
    { s: d("e2"), en: 2.5 },
  ];
  const acciones = [
    { s: d("a1"), Ic: CalendarCheck, en: 5.0 },
    { s: d("a2"), Ic: Database, en: 5.6 },
  ];
  const puntua = t >= 3.3;
  return (
    <Lienzo t={t} luz="100% 0%">
      <Abre on={t >= 0.8} arriba={0}>
        <div
          className="flex items-center"
          style={{
            gap: "0.9em",
            padding: "0.9em 1em",
            borderRadius: "1em",
            background: SUPERFICIE,
            border: `1px solid ${BORDE}`,
          }}
        >
          <div
            className="grid shrink-0 place-items-center font-semibold"
            style={{
              width: "2.9em",
              height: "2.9em",
              borderRadius: 999,
              background: "#2A3654",
              fontSize: "1.05em",
            }}
          >
            MT
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold" style={{ fontSize: "1.3em" }}>
              {d("name")}
            </p>
            <p className="truncate text-white/50" style={{ fontSize: "1em" }}>
              {d("role")}
            </p>
          </div>
          <span
            className="shrink-0 text-white/65"
            style={{
              fontSize: "0.95em",
              padding: "0.3em 0.6em",
              borderRadius: 999,
              border: `1px solid ${BORDE}`,
            }}
          >
            {d("origin")}
          </span>
        </div>
      </Abre>
      {datos.map((x) => (
        <Abre key={x.s} on={t >= x.en} arriba={0.75}>
          <p
            className="flex items-center text-white/75"
            style={{ fontSize: "1.2em", gap: "0.55em" }}
          >
            <Hecho ok={t >= x.en + 0.5} size={1.1} />
            {x.s}
          </p>
        </Abre>
      ))}
      <div className="mt-auto">
        <Abre on={t >= 3.1} arriba={1}>
          <div className="flex items-center" style={{ gap: "0.9em" }}>
            <span className="text-white/55" style={{ fontSize: "1.05em" }}>
              {d("score")}
            </span>
            <div
              className="relative flex-1 overflow-hidden"
              style={{
                height: "0.7em",
                borderRadius: 99,
                background: "rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="absolute inset-y-0 left-0"
                style={{
                  width: puntua ? "86%" : "0%",
                  borderRadius: 99,
                  background: `linear-gradient(90deg, #4C8DFF, ${TEAL})`,
                  transition: puntua ? "width 1.2s ease-out" : "none",
                }}
              />
            </div>
            <span
              className="font-semibold transition-opacity duration-500"
              style={{ fontSize: "1.2em", opacity: t >= 4.4 ? 1 : 0 }}
            >
              86 · <span style={{ color: TEAL }}>{d("high")}</span>
            </span>
          </div>
        </Abre>
        {acciones.map((a) => (
          <Abre key={a.s} on={t >= a.en} arriba={0.75}>
            <span
              className="inline-flex items-center"
              style={{
                gap: "0.5em",
                fontSize: "1.05em",
                padding: "0.4em 0.8em",
                borderRadius: 999,
                background: "rgba(126,207,195,0.12)",
                color: TEAL,
              }}
            >
              <a.Ic style={{ width: "1.15em", height: "1.15em" }} />
              {a.s}
            </span>
          </Abre>
        ))}
      </div>
    </Lienzo>
  );
}

// ── 6 · IA dentro de tu producto ─────────────────────────────────────────────
function VProducto({ d, t }: { d: T; t: number }) {
  const escribe = t >= 0.8;
  const bloque = (en: number) => ({
    opacity: t >= en ? 1 : 0,
    transform: `translateY(${t >= en ? 0 : 0.6}em)`,
    transition: "opacity .7s ease-out, transform .7s ease-out",
  });
  const etiqueta = (s: string) => (
    <span
      className="absolute font-semibold"
      style={{
        top: "0.5em",
        left: "0.5em",
        fontSize: "0.85em",
        padding: "0.15em 0.5em",
        borderRadius: 99,
        background: "rgba(10,16,32,0.75)",
        color: TEAL,
      }}
    >
      {s}
    </span>
  );
  return (
    <Lienzo t={t} luz="50% 0%">
      <div
        className="flex items-center"
        style={{
          gap: "0.7em",
          padding: "0.5em 0.5em 0.5em 0.9em",
          borderRadius: "0.9em",
          background: SUPERFICIE,
          border: `1px solid ${t >= 0.8 && t < 3 ? "rgba(126,207,195,0.45)" : BORDE}`,
        }}
      >
        <Sparkles
          className="shrink-0"
          style={{ width: "1.3em", height: "1.3em", color: TEAL }}
        />
        <p
          className="min-w-0 flex-1 truncate"
          style={{
            fontSize: "1.2em",
            clipPath: escribe ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
            transition: escribe ? "clip-path 1.6s steps(24)" : "none",
          }}
        >
          {d("prompt")}
        </p>
        <span
          className="shrink-0 font-semibold"
          style={{
            fontSize: "1.05em",
            padding: "0.45em 0.9em",
            borderRadius: "0.6em",
            background: TEAL,
            color: "#0A1020",
          }}
        >
          {d("btn")}
        </span>
      </div>
      <div
        className="relative flex min-h-0 flex-1 flex-col"
        style={{
          marginTop: "1em",
          borderRadius: "0.9em",
          border: `1px solid ${BORDE}`,
          background: "rgba(255,255,255,0.025)",
          padding: "0.8em",
          gap: "0.6em",
        }}
      >
        <div
          className="relative flex"
          style={{
            ...bloque(3.2),
            flex: "1.3 1 0",
            gap: "0.8em",
            borderRadius: "0.6em",
            background: "#E9ECEF",
            padding: "1em",
            overflow: "hidden",
          }}
        >
          <div className="flex flex-1 flex-col justify-center">
            <div
              style={{
                width: "85%",
                height: "0.9em",
                borderRadius: 99,
                background: "#1B2333",
              }}
            />
            <div
              style={{
                width: "60%",
                height: "0.9em",
                borderRadius: 99,
                background: "#1B2333",
                marginTop: "0.4em",
              }}
            />
            <div
              style={{
                width: "4.5em",
                height: "1.4em",
                borderRadius: 99,
                background: "#1B2333",
                marginTop: "0.8em",
              }}
            />
          </div>
          <div
            style={{
              width: "38%",
              borderRadius: "0.5em",
              background: "linear-gradient(140deg, #9FB4C7 0%, #4E6378 100%)",
            }}
          />
          {etiqueta(d("b1"))}
        </div>
        <div
          className="relative grid grid-cols-3"
          style={{ ...bloque(4.0), flex: "1 1 0", gap: "0.5em" }}
        >
          {["#C9D3DC", "#D9CFC2", "#BFD0CB"].map((c) => (
            <div
              key={c}
              style={{ borderRadius: "0.5em", background: c, opacity: 0.9 }}
            />
          ))}
          {etiqueta(d("b2"))}
        </div>
        <div
          className="relative"
          style={{
            ...bloque(4.8),
            flex: "0.55 1 0",
            borderRadius: "0.5em",
            background: "rgba(255,255,255,0.10)",
          }}
        >
          {etiqueta(d("b3"))}
        </div>
        <span
          className="absolute inline-flex items-center font-semibold"
          style={{
            ...bloque(5.6),
            right: "0.8em",
            bottom: "0.8em",
            gap: "0.4em",
            fontSize: "1em",
            padding: "0.35em 0.75em",
            borderRadius: 99,
            background: "#0F1A2E",
            border: "1px solid rgba(126,207,195,0.4)",
            color: TEAL,
          }}
        >
          <Check style={{ width: "1.05em", height: "1.05em" }} />
          {d("done")}
        </span>
      </div>
    </Lienzo>
  );
}

// ── La sección ───────────────────────────────────────────────────────────────
const CASOS = [
  {
    clave: "flujos",
    V: VFlujos,
    fin: 5.8,
    prueba: { nombre: "Feniz", slug: "feniz" },
  },
  { clave: "chat", V: VChat, fin: 7.4 },
  {
    clave: "docs",
    V: VDocs,
    fin: 5.8,
    prueba: { nombre: "Fintrace", slug: "fintrace" },
  },
  {
    clave: "rag",
    V: VRag,
    fin: 5.8,
    prueba: { nombre: "LumioLearn", slug: "lumiolearn" },
  },
  { clave: "leads", V: VLeads, fin: 6.6 },
  {
    clave: "producto",
    V: VProducto,
    fin: 6.6,
    prueba: { nombre: "Vendiq", slug: "vendiq" },
  },
] as const;

function Tarjeta({
  caso,
  i,
  t,
  base,
  accent,
  activo,
  alVer,
  alPasar,
  alTerminar,
}: {
  caso: (typeof CASOS)[number];
  i: number;
  t: (k: string) => string;
  base: string;
  accent: string;
  activo: boolean;
  alVer: (i: number, visible: boolean) => void;
  alPasar: (i: number) => void;
  alTerminar: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reloj = useReloj(activo, caso.fin, alTerminar);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => alVer(i, Boolean(e?.isIntersecting)),
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [i, alVer]);
  const d: T = (k) => t(`${base}.demo.${caso.clave}.${k}`);
  const { V } = caso;
  const prueba = "prueba" in caso ? caso.prueba : undefined;
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (i % 3) * 0.07, ease: smoothEase }}
      onMouseEnter={() => alPasar(i)}
      className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]"
    >
      <div
        ref={ref}
        className="relative aspect-[4/3] border-b border-white/[0.06]"
        style={{ containerType: "inline-size" }}
        aria-hidden
      >
        <V d={d} t={reloj} />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span
          className="text-overline mb-2 tabular-nums"
          style={{ color: accent }}
        >
          {String(i + 1).padStart(2, "0")}
        </span>
        <h3 className="text-heading-3 mb-2 text-white">
          {t(`${base}.buildItems.${i}.title`)}
        </h3>
        <p className="text-body-sm text-white/55">
          {t(`${base}.buildItems.${i}.text`)}
        </p>
        {prueba && (
          <Link
            href={`/casos-de-exito/${prueba.slug}`}
            className="text-body-sm mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-white/45 transition-colors hover:text-white"
          >
            {t(`${base}.build.proof`)}{" "}
            <span className="font-medium text-white/80">{prueba.nombre}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </motion.article>
  );
}

export function AiCasosDeUso({
  base,
  t,
  accent,
  cta,
  waLabel,
  waMessage,
}: {
  base: string;
  t: (k: string) => string;
  accent: string;
  cta: string;
  waLabel: string;
  waMessage: string;
}) {
  // El director: una sola viñeta se mueve a la vez. Arma, en orden, las que están a la vista
  // y todavía no se armaron; al terminar una espera un respiro y sigue. Pasar el ratón por
  // una tarjeta la repite (si no es la que ya se está armando).
  const [activo, setActivo] = useState<number | null>(null);
  const visibles = useRef(new Set<number>());
  const armadas = useRef(new Set<number>());
  const jugando = useRef<number | null>(null);
  const espera = useRef<number | undefined>(undefined);
  const quieto = useRef(true);
  useEffect(() => {
    quieto.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    return () => window.clearTimeout(espera.current);
  }, []);
  const siguiente = useCallback(() => {
    if (quieto.current || jugando.current !== null) return;
    const i = [...visibles.current]
      .filter((n) => !armadas.current.has(n))
      .sort((a, b) => a - b)[0];
    if (i === undefined) return;
    armadas.current.add(i);
    jugando.current = i;
    setActivo(i);
  }, []);
  const programar = useCallback(
    (ms: number) => {
      window.clearTimeout(espera.current);
      espera.current = window.setTimeout(siguiente, ms);
    },
    [siguiente]
  );
  const alVer = useCallback(
    (i: number, visible: boolean) => {
      if (visible) visibles.current.add(i);
      else visibles.current.delete(i);
      if (visible && jugando.current === null) programar(500);
    },
    [programar]
  );
  const alPasar = useCallback((i: number) => {
    if (quieto.current || jugando.current === i) return;
    window.clearTimeout(espera.current);
    armadas.current.add(i);
    jugando.current = i;
    setActivo(i);
  }, []);
  const alTerminar = useCallback(() => {
    jugando.current = null;
    setActivo(null);
    programar(1600);
  }, [programar]);

  return (
    <section className="bg-[#0A1020] py-16 md:py-24">
      <div className="container-section">
        <div className="content-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, ease: smoothEase }}
            className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="h-0.5 w-7 rounded-full"
                  style={{ background: accent }}
                />
                <span className="text-overline text-white/45">
                  {t(`${base}.build.overline`)}
                </span>
              </div>
              <h2 className="text-heading-1 max-w-xl text-white">
                {t(`${base}.build.title`)}
              </h2>
            </div>
            <p className="text-body-sm max-w-sm text-white/55">
              {t(`${base}.build.lead`)}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {CASOS.map((c, i) => (
              <Tarjeta
                key={c.clave}
                caso={c}
                i={i}
                t={t}
                base={base}
                accent={accent}
                activo={activo === i}
                alVer={alVer}
                alPasar={alPasar}
                alTerminar={alTerminar}
              />
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-3 pt-10 sm:flex-row md:pt-14">
            <WhatsAppButton
              label={waLabel}
              message={waMessage}
              tone="oscuro"
              className="w-full justify-center sm:w-auto"
            />
            <Link
              href="/portafolio"
              className="text-body-sm inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              {cta}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
