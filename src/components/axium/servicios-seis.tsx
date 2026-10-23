"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { rutaServicio } from "~/data/servicios-paginas";
import { useTranslation } from "~/hooks/useTranslation";

/**
 * Servicios del inicio en seis, al modo de cheesecakelabs.com/services («Modern systems. Trusted
 * data. AI agents in production.»), 2026-10-21. Alexander: «úsalo para expandir nuestros servicios
 * a 6, inspírate para la parte de los gráficos; trata de abarcar todo lo que usualmente abarcan
 * empresas de software».
 *
 * De Cheesecake se toma (medido en su web): lámina oscura, seis tarjetas en dos columnas con la
 * derecha un poco más abajo, el gráfico en su caja a la izquierda del texto, y cada gráfico como un
 * armazón de línea blanca fina que se dibuja y UNA pieza sólida con degradado iridiscente.
 * Lo propio: el navy de Axium, un iridiscente con sus colores (navy, azul, teal, lavanda), y un
 * objeto por servicio que cuenta qué es. Animación sutil: un gráfico a la vez, una sola vez; con
 * movimiento reducido, todos completos.
 *
 * 2026-10-23: versión clara con fondo gris claro (Alexander: «cámbialo a versión light con fondo
 * gris claro»): tarjetas blancas, los gráficos en `claro` sobre su caja gris, y debajo el CTA del
 * taller a ancho completo (CtaProceso).
 */

export type V3 = [number, number, number];
const C30 = Math.cos(Math.PI / 6);
const iso = ([x, y, z]: V3): [number, number] => [
  (x - y) * C30,
  (x + y) * 0.5 - z,
];
const pt = (p: V3) =>
  iso(p)
    .map((n) => n.toFixed(2))
    .join(" ");
export const poli = (pts: V3[], cerrado = true) =>
  `M${pts.map(pt).join(" L")}${cerrado ? " Z" : ""}`;

// ── Formas ──────────────────────────────────────────────────────────────────────────────────
/** Las 12 aristas de una caja, como un solo trazo (armazón transparente). */
export function aristas([x, y, z]: V3, [w, d, h]: V3) {
  const b: V3[] = [
    [x, y, z],
    [x + w, y, z],
    [x + w, y + d, z],
    [x, y + d, z],
  ];
  const t = b.map(([a, c]) => [a, c, z + h] as V3);
  return [
    poli(b),
    poli(t),
    ...b.map((p, i) => poli([p, t[i] as V3], false)),
  ].join(" ");
}
export const rectH = (
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  z: number
) =>
  poli([
    [x0, y0, z],
    [x1, y0, z],
    [x1, y1, z],
    [x0, y1, z],
  ]);
export const rectV = (
  x0: number,
  x1: number,
  y: number,
  z0: number,
  z1: number
) =>
  poli([
    [x0, y, z0],
    [x1, y, z0],
    [x1, y, z1],
    [x0, y, z1],
  ]);
export const seg = (a: V3, b: V3) => poli([a, b], false);
export const circulo = (cx: number, cy: number, r: number, z: number, n = 56) =>
  poli(
    Array.from({ length: n }, (_, i): V3 => {
      const a = (i / n) * Math.PI * 2;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a), z];
    })
  );

export type Cara = { d: string; g: 0 | 1 | 2 };
/** Las tres caras visibles de una caja sólida: arriba, frente (y+d) y lado (x+w). */
export function solidoCaja([x, y, z]: V3, [w, d, h]: V3): Cara[] {
  return [
    {
      d: poli([
        [x, y + d, z],
        [x + w, y + d, z],
        [x + w, y + d, z + h],
        [x, y + d, z + h],
      ]),
      g: 1,
    },
    {
      d: poli([
        [x + w, y, z],
        [x + w, y + d, z],
        [x + w, y + d, z + h],
        [x + w, y, z + h],
      ]),
      g: 2,
    },
    {
      d: poli([
        [x, y, z + h],
        [x + w, y, z + h],
        [x + w, y + d, z + h],
        [x, y + d, z + h],
      ]),
      g: 0,
    },
  ];
}
/** Octaedro (el núcleo de la IA): sus ocho caras, de la más lejana a la más cercana. */
function octaedro([cx, cy, cz]: V3, r: number, h: number): Cara[] {
  const ec: V3[] = [
    [cx + r, cy, cz],
    [cx, cy + r, cz],
    [cx - r, cy, cz],
    [cx, cy - r, cz],
  ];
  const caras: { pts: V3[]; prof: number }[] = [];
  for (const polo of [[cx, cy, cz + h] as V3, [cx, cy, cz - h] as V3]) {
    for (let i = 0; i < 4; i++) {
      const pts = [ec[i] as V3, ec[(i + 1) % 4] as V3, polo];
      caras.push({
        pts,
        prof: pts.reduce((s, p) => s + p[0] + p[1] + p[2], 0),
      });
    }
  }
  return caras
    .sort((a, b) => a.prof - b.prof)
    .map((c, i) => ({ d: poli(c.pts), g: (i % 3) as 0 | 1 | 2 }));
}

// ── Escenas ─────────────────────────────────────────────────────────────────────────────────
export type Pieza =
  | { k: "linea"; d: string; t0: number; t1: number }
  | { k: "puntos"; d: string; t0: number; t1: number }
  | { k: "solido"; caras: Cara[]; t0: number; t1: number };

export const L = (d: string, t0: number, t1: number): Pieza => ({
  k: "linea",
  d,
  t0,
  t1,
});
export const P = (d: string, t0: number, t1: number): Pieza => ({
  k: "puntos",
  d,
  t0,
  t1,
});
export const S = (caras: Cara[], t0 = 0.85, t1 = 1.45): Pieza => ({
  k: "solido",
  caras,
  t0,
  t1,
});

const ESQUINAS = (x0: number, x1: number, y0: number, y1: number) =>
  [
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1],
  ] as [number, number][];

// Las seis fuentes de la escena de IA, en pares simétricos respecto del eje de la vista (45°–225°
// en el plano, la vertical en la pantalla) y ninguna sobre él: delante tapaba el eje y detrás
// quedaba escondida tras el núcleo
const FUENTES = [0, 1, 2, 3, 4, 5].map((i): [number, number] => {
  const a = ((15 + i * 60) * Math.PI) / 180;
  return [50 + 38 * Math.cos(a), 50 + 38 * Math.sin(a)];
});

// Los cuatro sensores de la escena de IoT
const SENSORES: [number, number][] = [
  [12, 12],
  [80, 12],
  [12, 80],
  [80, 80],
];

const ESCENAS: Record<string, Pieza[]> = {
  // Diseño: capas apiladas; la de arriba es el diseño terminado
  diseno: [
    P(rectH(18, 82, 18, 82, 8), 0, 0.5),
    P(
      ESQUINAS(18, 82, 18, 82)
        .map(([x, y]) => seg([x, y, 8], [x, y, 60]))
        .join(" "),
      0.1,
      0.6
    ),
    L(
      [
        rectH(18, 82, 18, 82, 34),
        // el boceto: la misma maqueta que el diseño terminado de arriba
        rectH(28, 54, 28, 47, 34),
        seg([28, 58, 34], [72, 58, 34]),
        seg([28, 65, 34], [64, 65, 34]),
        seg([28, 72, 34], [68, 72, 34]),
      ].join(" "),
      0.15,
      0.85
    ),
    S(solidoCaja([18, 18, 60], [64, 64, 4])),
    L(
      [
        rectH(28, 54, 28, 47, 64.2),
        seg([28, 58, 64.2], [72, 58, 64.2]),
        seg([28, 65, 64.2], [64, 65, 64.2]),
        seg([28, 72, 64.2], [68, 72, 64.2]),
      ].join(" "),
      1.2,
      1.55
    ),
  ],
  // Webs y tiendas: la página y una tarjeta de producto que sale de ella
  web: [
    L(aristas([10, 24, 10], [80, 4, 70]), 0, 0.6),
    L(
      [
        seg([10, 28, 71], [90, 28, 71]),
        ...[15, 19, 23].map((x) => seg([x, 28, 75.5], [x + 1.5, 28, 75.5])),
        seg([16, 28, 66.5], [50, 28, 66.5]),
        rectV(16, 36, 28, 36, 62),
        rectV(64, 84, 28, 36, 62),
        ...[16, 40, 64].flatMap((x) => [
          seg([x, 28, 30], [x + 16, 28, 30]),
          seg([x, 28, 26], [x + 10, 28, 26]),
        ]),
      ].join(" "),
      0.4,
      0.9
    ),
    P(rectV(40, 60, 28, 36, 62), 0.5, 0.9),
    // el celular, junto al navegador: las apps van con las webs desde que entró IoT (2026-10-21)
    L(aristas([96, 25, 10], [10, 3, 30]), 0.75, 1.15),
    L(
      [
        rectV(97.3, 104.7, 28, 13, 36.5),
        seg([99.5, 28, 38.4], [102.5, 28, 38.4]),
      ].join(" "),
      1.0,
      1.35
    ),
    S(solidoCaja([40, 28, 36], [20, 14, 26])),
  ],
  // Software a medida: módulos en su base y uno que encaja en su sitio
  software: [
    ...[0, 1, 2]
      .flatMap((i) => [0, 1, 2].map((j) => [i, j] as const))
      .filter(([i, j]) => !(i === 2 && j === 2))
      .sort((a, b) => a[0] + a[1] - (b[0] + b[1]))
      .map(([i, j]) =>
        L(
          aristas([10 + 24 * i, 10 + 24 * j, 0], [16, 16, 16]),
          (i + j) * 0.1,
          (i + j) * 0.1 + 0.45
        )
      ),
    P(
      [
        rectH(58, 74, 58, 74, 0),
        ...ESQUINAS(58, 74, 58, 74).map(([x, y]) => seg([x, y, 0], [x, y, 24])),
      ].join(" "),
      0.45,
      0.85
    ),
    S(solidoCaja([58, 58, 24], [16, 16, 16])),
  ],
  // IA y datos: las fuentes en órbita, conectadas al núcleo
  ia: [
    P(
      // el eje llega justo a la punta de abajo del núcleo (48 − 20)
      [circulo(50, 50, 40, 0), seg([50, 50, 0], [50, 50, 28])].join(" "),
      0,
      0.5
    ),
    L(circulo(50, 50, 38, 32), 0, 0.6),
    ...FUENTES.map(([x, y], i) =>
      L(
        aristas([x - 3.5, y - 3.5, 28.5], [7, 7, 7]),
        0.3 + i * 0.07,
        0.7 + i * 0.07
      )
    ),
    P(
      FUENTES.map(([x, y]) => {
        // desde el borde del cubo, no desde su centro (cruzaba sus aristas)
        const [dx, dy, dz] = [50 - x, 50 - y, 16];
        const k = 5.2 / Math.hypot(dx, dy, dz);
        return seg([x + dx * k, y + dy * k, 32 + dz * k], [50, 50, 48]);
      }).join(" "),
      0.55,
      0.95
    ),
    S(octaedro([50, 50, 48], 15, 20)),
  ],
  // IoT: los sensores en el piso, conectados al equipo central, que emite su señal
  iot: [
    P(rectH(8, 92, 8, 92, 0), 0, 0.5),
    ...SENSORES.map(([x, y], i) =>
      L(aristas([x, y, 0], [8, 8, 8]), 0.15 + i * 0.08, 0.6 + i * 0.08)
    ),
    P(
      // de la esquina del sensor que mira al equipo a la esquina del equipo, a media altura
      SENSORES.map(([x, y]) =>
        seg(
          [x < 50 ? x + 8 : x, y < 50 ? y + 8 : y, 4],
          [x < 50 ? 39 : 61, y < 50 ? 39 : 61, 4]
        )
      ).join(" "),
      0.45,
      0.9
    ),
    S(solidoCaja([39, 39, 0], [22, 22, 12])),
    L(seg([50, 50, 12], [50, 50, 34]), 1.05, 1.3),
    L([5, 9.5, 14].map((r) => circulo(50, 50, r, 34)).join(" "), 1.15, 1.6),
  ],
  // Cloud, seguridad y soporte: los servidores, uno encendido
  cloud: [
    P(rectH(12, 88, 12, 88, 0), 0, 0.5),
    ...[4, 18].map((z, i) =>
      L(
        [
          aristas([20, 20, z], [60, 60, 9]),
          seg([66, 80, z + 4.5], [72, 80, z + 4.5]),
          seg([75, 80, z + 4.5], [76, 80, z + 4.5]),
        ].join(" "),
        i * 0.15,
        i * 0.15 + 0.5
      )
    ),
    S(solidoCaja([20, 20, 32], [60, 60, 9])),
    L(
      [
        seg([66, 80, 36.5], [72, 80, 36.5]),
        seg([75, 80, 36.5], [76, 80, 36.5]),
      ].join(" "),
      1.2,
      1.45
    ),
    L(
      [
        aristas([20, 20, 46], [60, 60, 9]),
        seg([66, 80, 50.5], [72, 80, 50.5]),
        seg([75, 80, 50.5], [76, 80, 50.5]),
      ].join(" "),
      0.3,
      0.8
    ),
  ],
};
const DESFASE = 380; // ms entre el arranque de un gráfico y el siguiente

// La misma cámara para los seis, pero cada escena centrada en su caja y llenándola igual: el
// encuadre sale de sus propios trazos. `f` compensa el grosor para que la línea mida lo mismo
// en pantalla en las seis.
const ASPECTO = 185 / 202; // el de la caja del gráfico
function encuadrar(piezas: Pieza[], conPuntos: boolean, izquierda = false) {
  const nums = piezas
    .filter((pz) => conPuntos || pz.k !== "puntos")
    .flatMap((pz) => (pz.k === "solido" ? pz.caras.map((c) => c.d) : [pz.d]))
    .join(" ")
    .match(/-?\d+(\.\d+)?/g)
    ?.map(Number) ?? [0, 0];
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  const [x0, x1, y0, y1] = [
    Math.min(...xs),
    Math.max(...xs),
    Math.min(...ys),
    Math.max(...ys),
  ];
  const w = Math.max(x1 - x0, (y1 - y0) * ASPECTO) * (conPuntos ? 1.28 : 1.03);
  const h = w / ASPECTO;
  const [cx, cy] = [(x0 + x1) / 2, (y0 + y1) / 2];
  // a la izquierda, el dibujo arranca en el borde de su caja (para alinearlo con el texto)
  const xv = izquierda ? x0 - w * 0.015 : cx - w / 2;
  return {
    vb: [xv, cy - h / 2, w, h].map((n) => n.toFixed(1)).join(" "),
    f: w / 185,
  };
}
const ENCUADRE = Object.fromEntries(
  Object.entries(ESCENAS).map(([id, p]) => [id, encuadrar(p, true)])
);
const ENCUADRE_ICONO = Object.fromEntries(
  Object.entries(ESCENAS).map(([id, p]) => [id, encuadrar(p, false)])
);

// ── El movimiento (Web Animations API) ─────────────────────────────────────────────────────
// Alexander, 2026-10-21: «las animaciones están pésimas, necesita ser más smooth». Antes cada
// armazón era UN trazo que recorría sus aristas una tras otra (avanzaba a saltos) y los gráficos
// esperaban en fila. Ahora cada arista se dibuja por separado y todas a la vez, como una ola, con
// entrada y salida suaves; el sólido llega después, creciendo apenas mientras sube.
const ESCALA = 1.5; // los tiempos de ESCENAS, en segundos, se estiran a esto
const SUAVE = "cubic-bezier(.65,0,.35,1)";
const LLEGA = "cubic-bezier(.22,1,.36,1)";
const subtrazos = (d: string) => d.split(/(?=M)/).filter((x) => x.trim());

function ocultar(svg: SVGSVGElement) {
  for (const n of svg.querySelectorAll<SVGElement>("[data-k]")) {
    for (const a of n.getAnimations()) a.cancel();
    if (n.dataset.k === "linea") n.style.strokeDashoffset = "1";
    else n.style.opacity = "0";
  }
}
function mostrar(svg: SVGSVGElement) {
  for (const n of svg.querySelectorAll<SVGElement>("[data-k]")) {
    n.style.strokeDashoffset = "0";
    n.style.opacity = "1";
  }
}

/** `v`: la velocidad (1 = la de Servicios; 1,3 = un 30 % más rápido, la de las fases del proceso) */
function animar(svg: SVGSVGElement, piezas: Pieza[], f: number, v = 1) {
  ocultar(svg);
  const ms = (x: number) => x / v;
  for (const n of svg.querySelectorAll<SVGElement>("[data-k]")) {
    const pz = piezas[Number(n.dataset.p)];
    if (!pz) continue;
    const [t0, t1] = [ms(pz.t0 * ESCALA * 1000), ms(pz.t1 * ESCALA * 1000)];
    if (pz.k === "linea") {
      // la ola: cada subtrazo dura casi toda la ventana y arranca un poco después que el anterior
      const [j, total] = [Number(n.dataset.s), Number(n.dataset.n)];
      const dur = Math.max(ms(500), (t1 - t0) * 0.8);
      const hueco = Math.max(0, t1 - t0 - dur);
      const delay = t0 + (total > 1 ? (j / (total - 1)) * hueco : 0);
      n.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
        duration: dur,
        delay,
        easing: SUAVE,
        fill: "both",
      });
    } else if (pz.k === "puntos") {
      n.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: Math.max(ms(500), t1 - t0),
        delay: t0,
        easing: "ease-out",
        fill: "both",
      });
    } else {
      n.animate(
        [
          {
            opacity: 0,
            transform: `translateY(${(7 * f).toFixed(2)}px) scale(.96)`,
          },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ],
        { duration: ms(1000), delay: t0, easing: LLEGA, fill: "both" }
      );
    }
  }
}

/** El gráfico de un servicio. `quieto`: completo y sin animar (los íconos del mega menú). */
export function Grafico({
  id,
  escena,
  toque = 0,
  quieto = false,
  claro = false,
  icono = false,
  grosor,
  izquierda = false,
  velocidad = 1,
}: {
  id: string;
  /** Una escena de fuera, con las mismas piezas (los íconos de las fases del proceso). Tiene que
   *  ser estable: definida fuera del componente */
  escena?: Pieza[];
  toque?: number;
  quieto?: boolean;
  /** A tamaño de ícono (~40 px): trazo más grueso y los punteados como líneas finas, que en
   *  chico se leían como ruido */
  icono?: boolean;
  /** Cuánto engorda el trazo, si no basta el del ícono (los íconos más grandes del proceso) */
  grosor?: number;
  /** El dibujo pegado al borde izquierdo de su caja, en vez de centrado */
  izquierda?: boolean;
  /** Cuánto más rápido se dibuja (1 = el ritmo de Servicios) */
  velocidad?: number;
  /** Sobre fondo claro: las líneas en navy (los íconos del mega menú, «pásalo a versión light») */
  claro?: boolean;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const piezas = escena ?? ESCENAS[id] ?? [];
  const { vb, f } = useMemo(
    () =>
      (escena
        ? encuadrar(escena, !icono, izquierda)
        : (icono ? ENCUADRE_ICONO : ENCUADRE)[id]) ?? {
        vb: "0 0 185 202",
        f: 1,
      },
    [escena, icono, id, izquierda]
  );
  const g = grosor ?? (icono ? 2.4 : 1); // cuánto engorda el trazo

  // Antes de pintar: en blanco hasta que le toque; con movimiento reducido, completo
  useLayoutEffect(() => {
    const el = svg.current;
    if (!el) return;
    if (quieto || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      mostrar(el);
    else ocultar(el);
  }, [quieto]);

  useEffect(() => {
    const el = svg.current;
    if (!el || toque === 0) return;
    animar(el, piezas, f, velocidad);
  }, [toque, piezas, f, velocidad]);

  // El iridiscente de Axium, en tres direcciones para que cada cara se lea distinta
  const DIRS = [
    { x1: 0, y1: 0, x2: 1, y2: 1 },
    { x1: 0, y1: 1, x2: 1, y2: 0 },
    { x1: 0.2, y1: 0, x2: 0.8, y2: 1 },
  ];
  const trazo = {
    fill: "none",
    stroke: claro ? "rgba(6,12,32,.62)" : "rgba(255,255,255,.82)",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg
      ref={svg}
      viewBox={vb}
      preserveAspectRatio={izquierda ? "xMinYMid meet" : undefined}
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        {DIRS.map((d, i) => (
          <linearGradient
            key={`${d.x1}-${d.y1}-${d.x2}-${d.y2}`}
            id={`${uid}g${i}`}
            {...d}
          >
            <stop offset="0.02" stopColor="#060C20" />
            <stop offset="0.3" stopColor="#005BEA" />
            <stop offset="0.52" stopColor="#7ECFC3" />
            <stop offset="0.74" stopColor="#CDD6F4" />
            <stop offset="0.94" stopColor="#EEF1F7" />
          </linearGradient>
        ))}
      </defs>
      {piezas.map((pz, i) => {
        const clave = `${id}-${i}`;
        if (pz.k === "solido")
          return (
            <g
              key={clave}
              data-p={i}
              data-k="solido"
              style={{ transformBox: "fill-box", transformOrigin: "50% 60%" }}
            >
              {pz.caras.map((c) => (
                <path
                  key={c.d}
                  d={c.d}
                  fill={`url(#${uid}g${c.g})`}
                  stroke={claro ? "rgba(6,12,32,.3)" : "rgba(255,255,255,.55)"}
                  strokeWidth={0.4 * f * (icono ? 1.8 : 1)}
                  strokeLinejoin="round"
                />
              ))}
            </g>
          );
        if (pz.k === "puntos")
          return (
            <path
              key={clave}
              data-p={i}
              data-k="puntos"
              d={pz.d}
              {...trazo}
              strokeWidth={(icono ? 0.6 * g : 0.9) * f}
              strokeOpacity={icono ? 0.45 : 1}
              strokeDasharray={icono ? undefined : `${0.1 * f} ${2.2 * f}`}
            />
          );
        const subs = subtrazos(pz.d);
        return (
          <g key={clave}>
            {subs.map((d, j) => (
              <path
                key={`${clave}-${d}`}
                data-p={i}
                data-k="linea"
                data-s={j}
                data-n={subs.length}
                d={d}
                {...trazo}
                strokeWidth={0.7 * f * g}
                pathLength={1}
                strokeDasharray="1"
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export const SERVICIOS = (
  ["diseno", "web", "software", "ia", "iot", "cloud"] as const
).map((id) => ({ id, href: rutaServicio(id) }));

/**
 * Cada gráfico se dibuja una sola vez, al entrar en pantalla; si entran varios juntos, arrancan
 * uno tras otro con un desfase corto (sin hacer esperar a los de abajo). Devuelve el contador de
 * cada gráfico y las referencias que hay que poner en sus tarjetas. `umbral`: qué parte de la
 * tarjeta tiene que verse para arrancar; `desfase`: los ms entre un gráfico y el siguiente.
 */
export function useToques(
  n: number,
  {
    umbral = 0.35,
    desfase = DESFASE,
  }: { umbral?: number; desfase?: number } = {}
) {
  const [toques, setToques] = useState<number[]>(() => Array(n).fill(0));
  const tarjetas = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const vistos = new Set<number>();
    let proximo = 0;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      (entradas) => {
        const nuevas = entradas
          .filter((e) => e.isIntersecting)
          .map((e) => tarjetas.current.indexOf(e.target as HTMLElement))
          .filter((i) => i >= 0 && !vistos.has(i))
          .sort((a, b) => a - b);
        for (const i of nuevas) {
          vistos.add(i);
          const ahora = performance.now();
          const espera = Math.max(0, proximo - ahora);
          proximo = ahora + espera + desfase;
          timers.push(
            window.setTimeout(
              () => setToques((v) => v.map((n, k) => (k === i ? n + 1 : n))),
              espera
            )
          );
        }
      },
      { threshold: umbral }
    );
    for (const el of tarjetas.current) if (el) io.observe(el);
    return () => {
      io.disconnect();
      for (const t of timers) window.clearTimeout(t);
    };
  }, [umbral, desfase]);

  return { toques, tarjetas };
}

export function ServiciosSeis() {
  const { t } = useTranslation("landing");
  const K = "home.serviciosSeis";
  // arrancan con un quinto de la tarjeta a la vista: con el 35 %, en el celular (tarjetas altas) se
  // alcanzaba a ver la caja vacía (2026-10-23)
  const { toques, tarjetas } = useToques(SERVICIOS.length, { umbral: 0.2 });

  return (
    <section
      id="servicios"
      data-nav-theme="light"
      className="relative bg-[#F2F4F8] text-[#060C20]"
    >
      <div className="container-section">
        <div className="content-section pt-20 pb-20 md:pt-28 lg:pb-32">
          <div className="aparecer max-w-[1040px]">
            <h2
              className="titulo-seccion"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              {t(`${K}.titulo`)}
            </h2>
            <p className="mt-5 max-w-[52ch] text-[16px] leading-[1.6] text-[#060C20]/65 md:text-[17px]">
              {t(`${K}.bajada`)}
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:mt-16 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-8">
            {SERVICIOS.map((s, i) => (
              // la entrada va en el envoltorio: en la tarjeta pisaría la transición de la sombra
              <div
                key={s.id}
                className="aparecer lg:[&:nth-child(even)]:translate-y-10"
                style={
                  {
                    "--aparecer-retraso": `${(i % 2) * 0.08}s`,
                  } as React.CSSProperties
                }
              >
                <Link
                  href={s.href}
                  ref={(el) => {
                    tarjetas.current[i] = el;
                  }}
                  className="group flex h-full flex-col gap-6 bg-white p-5 transition-shadow duration-300 hover:shadow-[0_18px_40px_-22px_rgba(6,12,32,0.28)] sm:flex-row sm:items-center sm:gap-8 sm:p-7"
                >
                  <div className="aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#F3F5F9] p-3 sm:aspect-[185/202] sm:w-[200px] lg:w-[210px]">
                    <Grafico id={s.id} claro toque={toques[i] ?? 0} />
                  </div>
                  <div>
                    <h3
                      className="text-[24px] leading-[1.15] tracking-[-0.02em] md:text-[27px]"
                      style={{ fontFamily: "var(--font-family-heading)" }}
                    >
                      {t(`${K}.items.${s.id}.titulo`)}
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.6] text-[#060C20]/65 md:text-[16px]">
                      {t(`${K}.items.${s.id}.texto`)}
                    </p>
                    <span className="mt-5 inline-block text-[14px] font-medium text-[#060C20]/80 underline decoration-[#060C20]/25 underline-offset-4 transition-colors group-hover:text-[#060C20] group-hover:decoration-[#060C20]/60">
                      {t(`${K}.verServicio`)}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
