"use client";

// Laboratorio 3D · galería: la rejilla de proyectos es HTML normal y cada imagen la dibuja un plano
// WebGL pegado a su caja (ver escena-galeria.ts). Sin WebGL se queda la rejilla de siempre.

import { Pause, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ControlGaleria } from "~/components/laboratorio/escena-galeria";

const P = "/images/proyects";
const PROYECTOS = [
  {
    nombre: "Aurore",
    tipo: "Web y marca",
    video: `${P}/aurore/av-portada-mostrador.mp4`,
    img: `${P}/aurore/av-portada-mostrador.jpg`,
  },
  {
    nombre: "Vendiq",
    tipo: "Plataforma de comercio",
    img: `${P}/vendiq/vendiq-portada-cielo.jpg`,
  },
  {
    nombre: "Rematch",
    tipo: "Plataforma de clubes",
    img: `${P}/rematch/rematch-portada-cancha.jpg`,
  },
  {
    nombre: "Bookit",
    tipo: "Reservas en línea",
    img: `${P}/bookit/bookit-portada-v2.jpg`,
  },
  {
    nombre: "Feniz",
    tipo: "Plataforma de trading",
    video: `${P}/feniz/fz-isotipo-3d.mp4`,
    img: `${P}/feniz/fz-portada-producto.jpg`,
  },
  {
    nombre: "ANJ Sports",
    tipo: "Tienda en línea",
    img: `${P}/anjsports/anj-portada.jpg`,
  },
  {
    nombre: "Clefast",
    tipo: "Web corporativa",
    img: `${P}/clefast/cf-portada-gama.jpg`,
  },
  {
    nombre: "Capptura",
    tipo: "Web de fotografía",
    img: `${P}/capptura/capptura-portada.jpg`,
  },
];

export function Galeria() {
  const lienzo = useRef<HTMLDivElement>(null);
  const rejilla = useRef<HTMLDivElement>(null);
  const control = useRef<ControlGaleria | null>(null);
  const [pausado, setPausado] = useState(false);
  const [post, setPost] = useState(true);

  useEffect(() => {
    const el = lienzo.current;
    const r = rejilla.current;
    if (!el || !r) return;
    let vivo = true;
    import("~/components/laboratorio/escena-galeria").then((m) => {
      if (!vivo) return;
      control.current = m.crearGaleria(el, [
        ...document.querySelectorAll<HTMLElement>(
          ".lab-galeria [data-tarjeta]"
        ),
      ]);
    });
    return () => {
      vivo = false;
      control.current?.liberar();
      control.current = null;
    };
  }, []);

  const boton =
    "inline-flex h-9 items-center gap-2 rounded-full border border-black/15 bg-white/60 px-4 text-[12px] text-[#111] backdrop-blur transition-colors hover:border-black/40";

  return (
    <main className="lab-galeria relative min-h-screen bg-[#E9E9EC] text-[#111]">
      {/* cuando el WebGL está listo, las imágenes del DOM se esconden (siguen ahí para lectores y sin WebGL) */}
      <style>{`.lab-galeria:has([data-gl="listo"]) [data-medio] > * { opacity: 0; }`}</style>
      <div
        ref={lienzo}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 h-[100lvh] w-full"
      />

      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/laboratorio"
            className="text-[13px] text-black/55 hover:text-black"
          >
            ← Laboratorio
          </Link>
          <span className="hidden font-mono sm:inline text-[12px] uppercase tracking-[0.12em]">
            Galería · técnica de Unseen
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={boton}
            aria-pressed={post}
            onClick={() => {
              setPost(!post);
              control.current?.postproceso(!post);
            }}
          >
            Lente: {post ? "sí" : "no"}
          </button>
          <button
            type="button"
            className={boton}
            aria-label={pausado ? "Reanudar los vídeos" : "Pausar los vídeos"}
            onClick={() => {
              setPausado(!pausado);
              control.current?.pausar(!pausado);
            }}
          >
            {pausado ? (
              <Play className="h-3.5 w-3.5" />
            ) : (
              <Pause className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-[1180px] px-5 pb-[40vh] pt-36 lg:px-8">
        <h1 className="text-center text-[44px] leading-none tracking-[-0.03em] sm:text-[64px] lg:text-[88px]">
          Proyectos
        </h1>
        <p className="mx-auto mt-5 max-w-[56ch] text-center text-[15px] leading-relaxed text-black/60">
          Las imágenes son planos WebGL pegados a esta rejilla HTML. Baja rápido
          para ver cómo se curvan y separan los colores, y mira el borde de
          arriba: ahí se enrollan hacia atrás.
        </p>
        <div
          ref={rejilla}
          className="mt-16 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2"
        >
          {PROYECTOS.map((p) => (
            <article
              key={p.nombre}
              data-tarjeta
              data-src={p.video ? undefined : p.img}
              data-video={p.video}
              className="group"
            >
              <div
                data-medio
                className="aspect-[16/10] w-full overflow-hidden rounded-[14px]"
              >
                {/* la imagen de respaldo del plano WebGL: el navegador la guarda en caché y la textura la reutiliza */}
                <img
                  src={p.img}
                  alt={`Portada de ${p.nombre}`}
                  className="h-full w-full object-cover transition-opacity duration-500"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4 border-b border-black/15 pb-3">
                <h2 className="text-[22px] tracking-[-0.01em]">{p.nombre}</h2>
                <span className="text-[13px] text-black/55">{p.tipo} ↘</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* la técnica de overworldaudio.com: el siguiente proyecto se revela con una mancha pintada */}
      <section
        data-oscuro
        className="relative z-10 min-h-[190vh] px-5 pt-[30vh] text-white lg:px-8"
      >
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.16em] text-white/60">
          Siguiente proyecto
        </p>
        <div className="mx-auto mt-10 max-w-[1180px]">
          <article
            data-tarjeta
            data-pintado
            data-src={`${P}/rematch/rematch-portada-cancha.jpg`}
          >
            <div data-medio className="aspect-[16/9] w-full">
              {/* la imagen de respaldo del plano WebGL */}
              <img
                src={`${P}/rematch/rematch-portada-cancha.jpg`}
                alt="Portada de Rematch"
                className="h-full w-full object-cover"
              />
            </div>
          </article>
          <h2 className="mt-10 text-center text-[44px] tracking-[-0.02em] lg:text-[72px]">
            Rematch
          </h2>
          <p className="mt-2 text-center text-[15px] text-white/60">
            Plataforma de clubes deportivos
          </p>
        </div>
      </section>
    </main>
  );
}
