"use client";

import {
  type Cara,
  Grafico,
  L,
  P,
  type Pieza,
  S,
  aristas,
  poli,
  rectH,
  rectV,
  seg,
  solidoCaja,
  useToques,
} from "~/components/axium/servicios-seis";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselProgress,
} from "~/components/ui/carousel";
import { useTranslation } from "~/hooks/useTranslation";

/**
 * El proceso en cuatro fases (2026-10-23), al modo de la sección «Four weeks to working software»
 * que pasó Alexander: «intenta así, mismo estilo de los íconos de servicios».
 *
 * De la referencia se toma: el titular solo, cuatro tarjetas iguales en fila con un ícono arriba,
 * la etiqueta de la fase, el nombre, una línea y tres viñetas con raya. La etiqueta no va en
 * mayúsculas espaciadas ni en monoespaciada como en la referencia: las dos son rasgos de página
 * hecha por IA (la sonda de slop de la batería).
 * Lo propio: los íconos son del mismo sistema que los de Servicios (armazón de línea + un sólido
 * iridiscente de Axium, que se dibujan una vez al entrar). En vez de semanas, fases: las
 * duraciones dependen de cada proyecto. Es la sección por defecto del inicio desde el 2026-10-23.
 *
 * Segunda vuelta, el mismo día: «no está bien cuadrado, además quiero que sea versión light, y que
 * los íconos sean un poco más entendibles». Las cuatro tarjetas comparten filas (subgrid), así que
 * el nombre, la línea y las viñetas arrancan a la misma altura en todas; cada ícono ocupa una
 * caja del mismo tamaño, pegado a la izquierda como el texto (sin el recuadro blanco: «sin ese
 * fondo blanco»); y los íconos pasaron de abstractos a objetos: dos globos de conversación,
 * láminas con su maqueta, bloques que se apilan y una flecha que sube.
 *
 * Tercera vuelta: el CTA del taller (CtaProceso) va ENTRE Servicios y esta sección, a ancho
 * completo; el orden lo dio Alexander: Servicios en claro, el CTA y después el proceso.
 */

// ── Prismas: un polígono del plano vertical (x, z), extruido hacia el frente (de y a y + d) ────
type XZ = [number, number];

/** Las caras que se ven desde la cámara isométrica (que mira desde +x, +y, +z) y el frente. */
function prisma(pol: XZ[], y: number, d: number): Cara[] {
  const lados: (Cara & { prof: number })[] = [];
  pol.forEach(([x0, z0], i) => {
    const [x1, z1] = pol[(i + 1) % pol.length] as XZ;
    // la normal hacia afuera, con el polígono antihorario: (dz, −dx)
    const [nx, nz] = [z1 - z0, x0 - x1];
    if (nx + nz <= 0) return;
    lados.push({
      d: poli([
        [x0, y, z0],
        [x1, y, z1],
        [x1, y + d, z1],
        [x0, y + d, z0],
      ]),
      g: nz > nx ? 0 : 2,
      prof: x0 + x1 + z0 + z1,
    });
  });
  // los lados con la misma luz van en un solo trazo: cada faceta de una curva con su propio
  // degradado (que se ajusta a su caja) salía como una raya distinta
  lados.sort((a, b) => a.prof - b.prof);
  const juntar = (g: 0 | 2): Cara[] => {
    const d = lados.filter((l) => l.g === g).map((l) => l.d);
    return d.length ? [{ d: d.join(" "), g }] : [];
  };
  return [
    ...juntar(2),
    ...juntar(0),
    { d: poli(pol.map(([x, z]) => [x, y + d, z])), g: 1 },
  ];
}

/** El armazón del prisma: sus dos caras y la profundidad solo en las esquinas `en`. */
function prismaArista(pol: XZ[], y: number, d: number, en: number[]) {
  return [
    poli(pol.map(([x, z]) => [x, y, z])),
    poli(pol.map(([x, z]) => [x, y + d, z])),
    ...en.map((i) => {
      const [x, z] = pol[i] as XZ;
      return seg([x, y, z], [x, y + d, z]);
    }),
  ].join(" ");
}

/** Un globo de conversación: rectángulo de esquinas redondeadas con la cola abajo. */
function globo(
  x0: number,
  x1: number,
  z0: number,
  z1: number,
  cola: "izq" | "der"
) {
  const r = 5;
  const arco = (cx: number, cz: number, a0: number): XZ[] =>
    [0, 1, 2, 3].map((k) => {
      const a = ((a0 + k * 30) * Math.PI) / 180;
      return [cx + r * Math.cos(a), cz + r * Math.sin(a)];
    });
  const abajo: XZ[] =
    cola === "izq"
      ? [
          [x0 + 6, z0],
          [x0 + 4, z0 - 9],
          [x0 + 15, z0],
        ]
      : [
          [x1 - 15, z0],
          [x1 - 4, z0 - 9],
          [x1 - 6, z0],
        ];
  const pts: XZ[] = [
    ...abajo,
    ...arco(x1 - r, z0 + r, -90),
    ...arco(x1 - r, z1 - r, 0),
    ...arco(x0 + r, z1 - r, 90),
    ...arco(x0 + r, z0 + r, 180),
  ];
  // la profundidad, en la punta de la cola y a la mitad de cada esquina
  return { pts, esquinas: [1, 5, 9, 13, 17] };
}

// casi en el mismo plano y cruzados en diagonal: apilados uno sobre otro se veían chicos
const GLOBO_ATRAS = globo(6, 54, 30, 56, "izq");
const GLOBO_DELANTE = globo(30, 80, 8, 34, "der");

// La flecha que sube, en el plano (x, z), antihoraria
const FLECHA: XZ[] = [
  [42, 5],
  [58, 5],
  [58, 30],
  [70, 30],
  [50, 56],
  [30, 30],
  [42, 30],
];

// Los bloques de «Construir»: dos de base, separados, y el de encima, que llega a trabarlos (en
// pirámide de cinco, las aristas compartidas se cruzaban y no se leía nada)
const BLOQUE: [number, number, number] = [16, 16, 12];
const BASE = [8, 28];

const FASES: { id: string; escena: Pieza[] }[] = [
  {
    // Entender: la conversación con tu equipo; el globo de delante es el nuestro
    id: "entender",
    escena: [
      L(prismaArista(GLOBO_ATRAS.pts, 20, 5, GLOBO_ATRAS.esquinas), 0, 0.65),
      S(prisma(GLOBO_DELANTE.pts, 27, 6), 0.55, 1.15),
      // los tres puntos de «escribiendo», en la cara del frente
      L(
        [46, 54, 62].map((x) => rectV(x, x + 3, 33.2, 19, 22)).join(" "),
        1.0,
        1.4
      ),
    ],
  },
  {
    // Diseñar: tres láminas con la maqueta; la de delante es el diseño terminado
    id: "disenar",
    escena: [
      L(
        [
          aristas([20, 26, 4], [46, 2, 40]),
          rectV(26, 44, 28.2, 26, 38),
          seg([26, 28.2, 20], [60, 28.2, 20]),
        ].join(" "),
        0,
        0.55
      ),
      L(
        [
          aristas([20, 42, 4], [46, 2, 40]),
          rectV(26, 44, 44.2, 26, 38),
          seg([26, 44.2, 20], [60, 44.2, 20]),
        ].join(" "),
        0.15,
        0.7
      ),
      S(solidoCaja([20, 58, 4], [46, 2, 40]), 0.75, 1.35),
      L(
        [
          rectV(26, 44, 60.2, 26, 38),
          seg([26, 60.2, 20], [60, 60.2, 20]),
          seg([26, 60.2, 15], [54, 60.2, 15]),
          seg([26, 60.2, 10], [57, 60.2, 10]),
        ].join(" "),
        1.15,
        1.55
      ),
    ],
  },
  {
    // Construir: los bloques se apilan y el último llega a su lugar
    id: "construir",
    escena: [
      ...BASE.map((x, i) =>
        L(aristas([x, 40, 0], BLOQUE), i * 0.15, 0.55 + i * 0.15)
      ),
      P(
        [
          rectH(14, 38, 40, 56, 12),
          seg([14, 56, 12], [14, 56, 19]),
          seg([38, 56, 12], [38, 56, 19]),
          seg([38, 40, 12], [38, 40, 19]),
        ].join(" "),
        0.5,
        0.85
      ),
      S(solidoCaja([14, 40, 19], [24, 16, 12])),
    ],
  },
  {
    // Lanzar y crecer: la flecha sube desde la base, que es tu sistema en producción
    id: "lanzar",
    escena: [
      L(aristas([22, 22, 0], [56, 56, 5]), 0, 0.55),
      P(rectH(34, 66, 38, 62, 5), 0.25, 0.65),
      S(prisma(FLECHA, 44, 12)),
    ],
  },
];

export function ProcesoFases() {
  const { t } = useTranslation("landing");
  const K = "home.procesoFases";
  // arrancan apenas asoma la tarjeta (es alta: al 35 % el ícono ya llevaba rato a la vista) y con
  // menos espera entre uno y otro (Alexander: «que empiecen ligeramente más rápido»)
  const { toques, tarjetas } = useToques(FASES.length, {
    umbral: 0.12,
    desfase: 260,
  });

  return (
    <section
      id="como-trabajamos"
      data-nav-theme="light"
      className="relative bg-white text-[#060C20]"
    >
      <div className="container-section">
        <div className="content-section pt-20 pb-20 md:pt-28 lg:pb-28">
          <h2
            className="aparecer titulo-seccion max-w-[22ch]"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            {t(`${K}.titulo`)}
          </h2>

          {/* En fila, las tarjetas comparten sus cinco filas (subgrid): todo arranca a la misma
              altura aunque una línea ocupe un renglón y otra dos */}
          {/* En el celular y la tableta, un carrusel que se arrastra con el dedo (y con el ratón),
              el mismo del blog (Alexander: «lo de las 4 fases hazlo un carrusel», y después «antes
              había un carrusel de 3 pasos que permitía arrastrar con el dedo, quiero que este también
              se arrastre»). La siguiente tarjeta asoma por el borde, que sangra hasta el canto. En
              escritorio el carrusel se apaga y quedan las cuatro en fila, con las filas alineadas */}
          <Carousel
            opts={{
              align: "start",
              containScroll: "trimSnaps",
              breakpoints: { "(min-width: 1024px)": { active: false } },
            }}
            aria-label={t(`${K}.titulo`)}
            className="aparecer mt-10 md:mt-16"
          >
            <div className="max-lg:mr-[calc((100%_-_100vw)/2)]">
              <CarouselContent className="-ml-3 lg:ml-0 lg:grid lg:grid-cols-4 lg:gap-x-5 lg:gap-y-0">
                {FASES.map((f, i) => (
                  <CarouselItem
                    key={f.id}
                    ref={(el) => {
                      tarjetas.current[i] = el;
                    }}
                    className="basis-[84%] cursor-grab touch-pan-y select-none pl-3 active:cursor-grabbing sm:basis-[58%] md:basis-[44%] lg:row-span-5 lg:grid lg:cursor-auto lg:select-auto lg:grid-rows-subgrid lg:pl-0"
                  >
                    <div className="flex h-full flex-col bg-[#F3F5F9] p-6 sm:p-8 lg:row-span-5 lg:grid lg:grid-rows-subgrid lg:gap-y-0">
                      <div className="aspect-square w-[96px] sm:w-[112px]">
                        <Grafico
                          id={f.id}
                          escena={f.escena}
                          icono
                          claro
                          grosor={2.8}
                          izquierda
                          // un 30 % más rápido que en Servicios (Alexander: «que las animaciones de
                          // entrada de los íconos sean ligeramente más rápidas»)
                          velocidad={1.3}
                          toque={toques[i] ?? 0}
                        />
                      </div>
                      <p className="mt-10 text-[14px] text-[#060C20]/60">
                        {t(`${K}.fase`)} {i + 1}
                      </p>
                      <h3
                        className="mt-2 text-[26px] leading-[1.1] tracking-[-0.02em] lg:text-[28px]"
                        style={{ fontFamily: "var(--font-family-heading)" }}
                      >
                        {t(`${K}.pasos.${i}.titulo`)}
                      </h3>
                      <p className="mt-3 text-[16px] leading-[1.55] text-[#060C20]/70">
                        {t(`${K}.pasos.${i}.texto`)}
                      </p>
                      <ul className="mt-6 space-y-3 border-t border-[#060C20]/10 pt-6 text-[15px] leading-[1.45] text-[#060C20]/70">
                        {[0, 1, 2].map((j) => (
                          <li key={j} className="flex gap-4">
                            <span
                              aria-hidden="true"
                              className="text-[#060C20]/30"
                            >
                              —
                            </span>
                            {t(`${K}.pasos.${i}.puntos.${j}`)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </div>
            {/* cuánto se ha visto, como la barra del carrusel del blog */}
            <CarouselProgress
              className="mt-6 h-0.5 w-full max-w-[160px] overflow-hidden rounded-full bg-[#060C20]/12 lg:hidden"
              barClassName="rounded-full bg-[#060C20]"
            />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
