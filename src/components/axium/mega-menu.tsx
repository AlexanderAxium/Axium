"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { PortadaBlog } from "~/components/axium/portada-blog";
import { Grafico, SERVICIOS } from "~/components/axium/servicios-seis";
import { PROYECTOS } from "~/components/axium/trabajo-destacado";
import { BLOG_SLUGS } from "~/data/blog-data";
import { useTranslation } from "~/hooks/useTranslation";

/**
 * Los paneles del mega menú (2026-10-21). Alexander pasó el de qubika.com: «quiero implementar
 * mega menú también, algo como esto, evita el AI slop, sé creativo y profesional, usa todos tus
 * recursos y implementaciones similares».
 *
 * De Qubika se toma la estructura: tres columnas a lo ancho, una presentación a la izquierda, lo
 * principal en el medio y una columna gris con contenido a la derecha. Lo propio, reutilizado de
 * la web: los gráficos isométricos de los seis servicios como íconos (en vez de íconos genéricos
 * en cuadros de color), las portadas del blog y las de «Nuestro trabajo». Sin rótulos en
 * mayúsculas, sin flechas en los botones.
 */

const titular: CSSProperties = { fontFamily: "var(--font-family-heading)" };

const CLIENTES = [
  { id: "anjsports", nombre: "ANJ Sports" },
  { id: "aurore", nombre: "Aurore" },
  { id: "alyer", nombre: "Alyer" },
  { id: "feniz", nombre: "Feniz" },
  { id: "maintech", nombre: "MainTech" },
  { id: "clefast", nombre: "Clefast" },
] as const;

function Rejilla({
  presentacion,
  centro,
  lateral,
}: {
  presentacion: ReactNode;
  centro: ReactNode;
  lateral: ReactNode;
}) {
  return (
    // Entre 1024 y 1280 no caben tres columnas: la presentación se va y quedan las otras dos
    <div className="grid w-full grid-cols-[minmax(0,6.4fr)_minmax(0,3.6fr)] xl:grid-cols-[minmax(0,3.6fr)_minmax(0,6.4fr)_minmax(0,4fr)]">
      <div className="hidden py-10 pr-12 xl:block">{presentacion}</div>
      <div className="py-10 pr-8 xl:border-l xl:border-gray-100 xl:pl-10">
        {centro}
      </div>
      <div className="bg-[#F4F6F9] px-7 py-10">{lateral}</div>
    </div>
  );
}

function Presentacion({
  titulo,
  texto,
  children,
}: {
  titulo: string;
  texto: string;
  children: ReactNode;
}) {
  return (
    <>
      <p
        className="max-w-[18ch] text-[26px] leading-[1.12] tracking-[-0.02em] text-[#060C20]"
        style={titular}
      >
        {titulo}
      </p>
      <p className="mt-4 max-w-[34ch] text-[15px] leading-[1.6] text-gray-600">
        {texto}
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
        {children}
      </div>
    </>
  );
}

const etiquetaCls = "mb-5 text-[13px] text-gray-500";

/** Servicios: los seis, con su gráfico de la sección del inicio como ícono, y lo último del blog. */
export function MegaServicios({ alElegir }: { alElegir: () => void }) {
  const { t } = useTranslation("common");
  const { t: tb } = useTranslation("blog");
  const K = "navbar.mega";
  return (
    <Rejilla
      presentacion={
        <Presentacion
          titulo={t(`${K}.servicios.titulo`)}
          texto={t(`${K}.servicios.texto`)}
        >
          <Link
            href="/#contacto"
            onClick={alElegir}
            className="inline-flex h-11 items-center rounded-full bg-[#060C20] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#0B1838]"
          >
            {t(`${K}.servicios.cta`)}
          </Link>
          <Link
            href="/#como-trabajamos"
            onClick={alElegir}
            className="text-[14px] text-[#060C20]/75 underline decoration-[#060C20]/25 underline-offset-4 hover:text-[#060C20]"
          >
            {t(`${K}.servicios.secundario`)}
          </Link>
        </Presentacion>
      }
      centro={
        <>
          <p className={etiquetaCls}>{t(`${K}.servicios.etiqueta`)}</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
            {SERVICIOS.map((s) => (
              <li key={s.id}>
                <Link
                  href={s.href}
                  onClick={alElegir}
                  className="group flex items-start gap-4 rounded-lg p-2.5 transition-colors hover:bg-gray-50"
                >
                  <span className="grid h-[58px] w-[54px] shrink-0 place-items-center rounded-md bg-[#EEF2F7] p-1.5 ring-1 ring-[#060C20]/[0.05] transition-colors group-hover:bg-[#E4EAF3]">
                    <Grafico id={s.id} quieto claro icono />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-medium leading-[1.3] text-[#060C20] transition-colors group-hover:text-[#0072CF]">
                      {t(`${K}.servicios.items.${s.id}.titulo`)}
                    </span>
                    <span className="mt-0.5 block text-[13.5px] leading-[1.45] text-gray-600">
                      {t(`${K}.servicios.items.${s.id}.resumen`)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      }
      lateral={
        <>
          <div className="flex items-baseline justify-between">
            <p className={etiquetaCls}>{t(`${K}.blog.etiqueta`)}</p>
            <Link
              href="/blog"
              onClick={alElegir}
              className="text-[13px] text-[#060C20]/70 underline decoration-[#060C20]/20 underline-offset-4 hover:text-[#060C20]"
            >
              {t(`${K}.blog.todos`)}
            </Link>
          </div>
          <ul className="flex flex-col gap-2.5">
            {BLOG_SLUGS.slice(0, 3).map((slug) => (
              <li key={slug}>
                <Link
                  href={`/blog/${slug}`}
                  onClick={alElegir}
                  className="group flex gap-4 rounded-lg bg-white p-2.5 shadow-[0_1px_2px_rgba(6,12,32,.04)] ring-1 ring-[#060C20]/[0.05] transition-shadow hover:shadow-[0_6px_18px_rgba(6,12,32,.08)]"
                >
                  <span className="block w-[96px] shrink-0 overflow-hidden rounded-[5px]">
                    <PortadaBlog slug={slug} />
                  </span>
                  <span className="min-w-0 py-0.5">
                    <span className="block text-[12.5px] text-gray-500">
                      {tb(`posts.${slug}.categoria`)}
                    </span>
                    <span className="mt-1 line-clamp-3 block text-[14px] font-medium leading-[1.35] text-[#060C20] group-hover:underline">
                      {tb(`posts.${slug}.title`)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      }
    />
  );
}

/** Casos de éxito: los cuatro productos propios con su portada y la lista de casos de clientes. */
export function MegaCasos({ alElegir }: { alElegir: () => void }) {
  const { t } = useTranslation("common");
  const { t: tl } = useTranslation("landing");
  const K = "navbar.mega.casos";
  return (
    <Rejilla
      presentacion={
        <Presentacion titulo={t(`${K}.titulo`)} texto={t(`${K}.texto`)}>
          <Link
            href="/portafolio"
            onClick={alElegir}
            className="inline-flex h-11 items-center rounded-full bg-[#060C20] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#0B1838]"
          >
            {t(`${K}.todos`)}
          </Link>
        </Presentacion>
      }
      centro={
        <>
          <p className={etiquetaCls}>{t(`${K}.propios`)}</p>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-5">
            {PROYECTOS.map((p) => (
              <li key={p.key}>
                <Link href={p.href} onClick={alElegir} className="group block">
                  {/* alto fijo, no proporción: así el panel mide lo mismo que el de servicios en
                      todos los anchos (con 16:10 medía 558 px contra 470, Alexander 2026-10-22) */}
                  <span className="relative block h-[128px] overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={p.cover}
                      alt=""
                      fill
                      sizes="260px"
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                    />
                  </span>
                  <span className="mt-2.5 flex items-baseline justify-between gap-3">
                    <span className="text-[15px] font-medium text-[#060C20] group-hover:text-[#0072CF]">
                      {tl(`highlights.items.${p.key}.name`)}
                    </span>
                    <span className="text-[13px] text-gray-500">
                      {tl(`highlights.items.${p.key}.category`)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      }
      lateral={
        <>
          <div className="flex items-baseline justify-between">
            <p className={etiquetaCls}>{t(`${K}.clientes`)}</p>
            <Link
              href="/portafolio"
              onClick={alElegir}
              className="text-[13px] text-[#060C20]/70 underline decoration-[#060C20]/20 underline-offset-4 hover:text-[#060C20]"
            >
              {t(`${K}.todos`)}
            </Link>
          </div>
          <ul className="-mt-2 flex flex-col">
            {CLIENTES.map((c) => (
              <li
                key={c.id}
                className="border-b border-[#060C20]/[0.07] last:border-b-0"
              >
                <Link
                  href={`/casos-de-exito/${c.id}`}
                  onClick={alElegir}
                  className="group flex flex-col py-2"
                >
                  <span className="text-[15px] font-medium text-[#060C20] group-hover:text-[#0072CF]">
                    {c.nombre}
                  </span>
                  <span className="text-[13px] text-gray-500">
                    {t(`${K}.lista.${c.id}`)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      }
    />
  );
}
