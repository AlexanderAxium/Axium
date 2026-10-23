"use client";

// Laboratorio 3D · el folleto (2026-10-16), a partir de shader.se (ver escena-folleto.ts). El HTML: el
// titular sobre el monitor, la barra de la trituradora (en la ranura), el contacto real DETRÁS del
// lienzo (se ve cuando las tiras se van) y una copia accesible del folleto, que en el canvas no se lee.

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ControlLab } from "~/components/laboratorio/base";
import type { EstadoFolleto } from "~/components/laboratorio/escena-folleto";

export function Folleto() {
  const lienzo = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLDivElement>(null);
  const trituradora = useRef<HTMLDivElement>(null);
  const contacto = useRef<HTMLDivElement>(null);
  const control = useRef<ControlLab | null>(null);
  const [estado, setEstado] = useState<EstadoFolleto | null>(null);
  const [sinWebgl, setSinWebgl] = useState(false);

  useEffect(() => {
    history.scrollRestoration = "manual";
    scrollTo(0, 0);
    const el = lienzo.current;
    if (!el) return;
    let vivo = true;
    import("~/components/laboratorio/escena-folleto").then((m) => {
      if (!vivo) return;
      control.current = m.crearFolleto(el, setEstado, {
        titulo: titulo.current,
        trituradora: trituradora.current,
        contacto: contacto.current,
      });
      if (!control.current) setSinWebgl(true);
    });
    return () => {
      vivo = false;
      control.current?.liberar();
      control.current = null;
    };
  }, []);

  const listo = !!estado?.listo;
  return (
    <main className="relative bg-[#060B1E] text-white">
      {/* el contacto, detrás de todo: aparece cuando las tiras de papel se van */}
      <div
        ref={contacto}
        className="invisible fixed inset-0 z-0 grid place-items-center bg-[radial-gradient(ellipse_at_50%_35%,#14307A_0%,#0A1840_45%,#050A1C_100%)] px-6 text-center"
      >
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8EC8FF]">
            Fin del folleto
          </p>
          <h2 className="mx-auto mt-4 max-w-[16ch] text-[38px] font-medium leading-[1.04] tracking-[-0.03em] sm:text-[56px] lg:text-[72px]">
            ¿Todavía no te convencimos?
          </h2>
          <p className="mx-auto mt-5 max-w-[40ch] text-[16px] leading-relaxed text-white/75 sm:text-[18px]">
            Nos queda un último truco: hablar contigo de tu proyecto.
          </p>
          <Link
            href="/#contacto"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[14px] font-medium text-[#060B1E] transition-colors hover:bg-[#8EC8FF]"
          >
            Hablemos de tu proyecto <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div
        ref={lienzo}
        aria-hidden="true"
        className="fixed inset-0 z-10 h-[100lvh] w-full"
      />

      {/* titular sobre el monitor */}
      <div
        ref={titulo}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-20 px-5 pb-10 lg:px-10 lg:pb-14"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8EC8FF]">
          Axium · folleto corporativo
        </p>
        <h1 className="mt-3 max-w-[18ch] text-[34px] font-medium leading-[1.04] tracking-[-0.03em] sm:text-[48px] lg:text-[60px]">
          Como toda empresa seria, tenemos un folleto.
        </h1>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">
          Desliza para leerlo
        </p>
      </div>

      {/* la trituradora: la ranura por la que entra la hoja */}
      <div
        ref={trituradora}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-[62%] z-20 -translate-y-1/2 opacity-0"
      >
        <div className="h-[34px] w-full bg-[linear-gradient(180deg,#3A3F4C_0%,#1B1E26_45%,#0E1016_55%,#2A2E38_100%)] shadow-[0_14px_30px_rgba(0,0,0,0.45)]" />
        <div className="h-[6px] w-full bg-[repeating-linear-gradient(90deg,#0B0C10_0_6px,#3A3F4C_6px_12px)]" />
        <p className="absolute right-5 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 lg:right-10">
          Trituradora Axium 3000
        </p>
      </div>

      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 lg:px-10">
        <Link
          href="/laboratorio"
          className="rounded-full bg-[#060B1E]/70 px-3 py-1.5 text-[13px] backdrop-blur"
        >
          axium<span className="text-white/50"> · laboratorio</span>
        </Link>
        <span className="rounded-full bg-[#060B1E]/70 px-3 py-1.5 font-mono text-[11px] text-white/70 backdrop-blur">
          {estado?.listo ? `${estado.fps} fps` : ""}
        </span>
      </header>

      <div
        className={`fixed inset-0 z-40 grid place-items-center bg-[#060B1E] transition-opacity duration-700 ${listo || sinWebgl ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">
          {sinWebgl
            ? "Este navegador no tiene WebGL."
            : "Imprimiendo el folleto…"}
        </p>
      </div>

      {/* el folleto en texto (el canvas no lo lee un lector de pantalla) */}
      <section className="sr-only">
        <h2>
          Soluciones digitales para empresas que se toman en serio la
          tecnología.
        </h2>
        <p>
          Diseño, software e inteligencia artificial, con un solo equipo y sin
          pasar tu proyecto de mano en mano.
        </p>
        <h3>¿Quiénes somos?</h3>
        <p>
          Axium es una software house de Lima, Perú. Ofrecemos soluciones
          digitales y consultoría para impulsar el crecimiento de tu negocio:
          diseñamos marcas y productos, desarrollamos plataformas web y móviles
          a medida, y conectamos la inteligencia artificial a tus procesos.
        </p>
        <h3>Lo que hacemos</h3>
        <ul>
          <li>Diseño y marca</li>
          <li>Desarrollo de software</li>
          <li>IA y agentes</li>
        </ul>
      </section>

      <div
        aria-hidden="true"
        style={{
          height: estado?.alto ? `${Math.round(estado.alto)}px` : "800svh",
        }}
      />
    </main>
  );
}
