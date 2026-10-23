"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { ISOTIPO } from "~/components/axium/tres/isotipo";
import type { BlogSlug } from "~/data/blog-data";
import { useTranslation } from "~/hooks/useTranslation";

/**
 * Las portadas del blog (2026-10-21). Alexander pasó la grilla de noticias de Code and Theory y,
 * después de varias vueltas, dejó la regla: «no debe tener mucho texto, y del tema que trate el
 * artículo debe ser la imagen». Cada portada es una foto del tema mismo (OpenAI, taller-blog/
 * 2026-10, con un mismo bloque de estilo: sobrio, frío, con grano), y cuando sale una pantalla, la
 * interfaz es real y está montada encima (componer_pantalla.py). La única con algo encima es la de
 * facturación: su titular y una estela de piezas del isotipo. Todo se mide en cqw.
 */

const NOCHE = "#060C20";
const AZUL = "#0092D1";
const titular: CSSProperties = { fontFamily: "var(--font-family-heading)" };

/** Qué color de cursor le va a cada portada (el círculo «leer artículo»). */
export const TONO_PORTADA: Record<BlogSlug, "claro" | "oscuro"> = {
  "agentes-de-ia-en-produccion": "oscuro",
  "facturacion-electronica-tienda-online": "oscuro",
  "antes-de-publicar-tu-web": "oscuro",
  "transformacion-digital": "oscuro",
  "metodologias-agiles": "oscuro",
  "ia-en-el-negocio": "oscuro",
};

// ── Las piezas del sistema ───────────────────────────────────────────────────────────────────
function Caja({
  fondo,
  foto,
  filtro,
  children,
}: {
  fondo: string;
  foto?: string;
  filtro?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden [container-type:inline-size]"
      style={{ backgroundColor: fondo }}
    >
      {foto && (
        <Image
          src={foto}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, 84vw"
          className={`object-cover ${filtro ?? ""}`}
        />
      )}
      {children}
    </div>
  );
}

function Titular({
  children,
  className,
}: { children: ReactNode; className: string }) {
  return (
    <p
      className={`absolute text-white leading-[1.02] tracking-[-0.035em] ${className}`}
      style={titular}
    >
      {children}
    </p>
  );
}

/**
 * Una pieza del isotipo como acento (lo que en Code and Theory son los bloques rojos). Se coloca
 * en una vista de 100 de ancho por `alto` (75, la de las portadas 4:3); la usa también el CTA del
 * proceso del inicio, que es 2:1.
 */
export function PiezaIsotipo({
  nombre,
  x,
  y,
  lado,
  alto = 75,
}: {
  nombre: keyof typeof ISOTIPO.piezas;
  x: number;
  y: number;
  lado: number;
  alto?: number;
}) {
  const pts = ISOTIPO.piezas[nombre] as unknown as [number, number][];
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const [x0, y0] = [Math.min(...xs), Math.min(...ys)];
  const s = lado / Math.max(Math.max(...xs) - x0, Math.max(...ys) - y0);
  const d = `M${pts.map(([px, py]) => `${(x + (px - x0) * s).toFixed(2)} ${(y + (py - y0) * s).toFixed(2)}`).join(" L")} Z`;
  return (
    <svg
      viewBox={`0 0 100 ${alto}`}
      className="absolute inset-0 size-full"
      aria-hidden="true"
    >
      <path d={d} fill={AZUL} />
    </svg>
  );
}

// ── Las tres primeras: solo la foto, sin texto (Alexander: «no necesitas que la imagen tenga
//    texto explicativo, se debe entender por sí sola») ────────────────────────────────────────
/** Agentes en producción: la sala de operaciones de noche, alguien que pasa; el sistema trabaja. */
function Operaciones() {
  return (
    <Caja fondo="#060A16" foto="/blog/portada-operaciones.jpg">
      {null}
    </Caja>
  );
}

/**
 * Facturación: la venta en movimiento, con una estela de piezas del isotipo que sale de la bolsa
 * (lo que en las referencias de Code and Theory son los bloques rojos) y el titular.
 */
function Venta() {
  const { t } = useTranslation("blog");
  return (
    <Caja fondo="#071022" foto="/blog/portada-venta.jpg">
      <svg
        viewBox="0 0 100 75"
        className="absolute inset-0 size-full"
        aria-hidden="true"
      >
        <rect
          x="47.5"
          y="29"
          width="17"
          height="22.5"
          fill="none"
          stroke="rgba(255,255,255,.55)"
          strokeWidth="0.14"
          strokeDasharray="0.8 0.6"
        />
      </svg>
      <PiezaIsotipo nombre="abajo" x={65} y={24} lado={3} />
      <PiezaIsotipo nombre="izquierda" x={70.5} y={16.5} lado={4.6} />
      <PiezaIsotipo nombre="arriba" x={78} y={7} lado={6.6} />
      <PiezaIsotipo nombre="abajo" x={88} y={-1.5} lado={9} />
      <Titular className="top-[5.5cqw] left-[5cqw] max-w-[50cqw] text-[5.8cqw]">
        {t("posts.facturacion-electronica-tienda-online.portada")}
      </Titular>
    </Caja>
  );
}

// ── Antes de publicar, transformación digital y metodologías: la foto del tema, sin texto
//    (Alexander: «no debe tener mucho texto, y del tema que trate el artículo debe ser la imagen»)
/** Antes de publicar: alguien revisa la web (la de Vendiq, real, montada en el monitor) y marca
 *  la última casilla de la lista. */
function Revision() {
  return (
    <Caja fondo="#0A1020" foto="/blog/portada-revision.jpg">
      {null}
    </Caja>
  );
}

/** Transformación digital: la dueña lleva el inventario de su almacén en una tablet. */
function Inventario() {
  return (
    <Caja fondo="#1A2232" foto="/blog/portada-inventario.jpg">
      {null}
    </Caja>
  );
}

/** Metodologías ágiles: el equipo frente al tablero, moviendo una tarjeta de columna. */
function Tablero() {
  return (
    <Caja fondo="#1E2633" foto="/blog/portada-tablero.jpg">
      {null}
    </Caja>
  );
}

// ── IA en el negocio: la dueña le pide su tienda al asistente (el de Vendiq, real, en la laptop)
function Asistente() {
  return (
    <Caja fondo="#0B1222" foto="/blog/portada-asistente.jpg">
      {null}
    </Caja>
  );
}

const PORTADAS: Record<BlogSlug, () => ReactNode> = {
  "agentes-de-ia-en-produccion": Operaciones,
  "facturacion-electronica-tienda-online": Venta,
  "antes-de-publicar-tu-web": Revision,
  "transformacion-digital": Inventario,
  "metodologias-agiles": Tablero,
  "ia-en-el-negocio": Asistente,
};

export function PortadaBlog({ slug }: { slug: string }) {
  const Portada = PORTADAS[slug as BlogSlug];
  if (!Portada) return <Caja fondo={NOCHE}>{null}</Caja>;
  return <Portada />;
}
