"use client";

// Estudios de realismo y de los cuatro medios (ver escena-realismo.ts y medios.ts). La página es casi
// toda escena: un pie de foto arriba, y en realismo el botón para compararla con la foto de
// referencia (la imagen objetivo, de OpenAI); el scroll lleva el foco a la ventana o cambia de medio.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { EstadoRealismo } from "~/components/laboratorio/escena-realismo";

// lo que dice el pie en cada medio (el estudio 2)
const MEDIOS = [
  {
    nombre: "La foto",
    texto:
      "La misma mesa del estudio de realismo. Desliza para verla en otros medios; la cortina se mueve con la brisa en todos.",
  },
  {
    nombre: "Impresa",
    texto:
      "En cuatro tintas: cada color es una trama de puntos girada en su ángulo, como en una imprenta, y las tintas se suman sobre el papel.",
  },
  {
    nombre: "Pintada",
    texto:
      "Cada punto toma el color del lado más parejo de su vecindad: los bordes se quedan y lo demás se vuelve pincelada.",
  },
  {
    nombre: "En pantalla",
    texto:
      "Un panel LED visto de cerca: tres luces por punto, en columnas escalonadas.",
  },
];

export function Realismo({
  variante = "realismo",
}: { variante?: "realismo" | "medios" }) {
  const medios = variante === "medios";
  const lienzo = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<EstadoRealismo | null>(null);
  const [referencia, setReferencia] = useState(false);

  useEffect(() => {
    history.scrollRestoration = "manual";
    scrollTo(0, 0);
    const el = lienzo.current;
    if (!el) return;
    let vivo = true;
    let control: { liberar: () => void } | null = null;
    import("~/components/laboratorio/escena-realismo").then((m) => {
      if (!vivo) return;
      control = m.crearRealismo(el, setEstado, { medios });
    });
    return () => {
      vivo = false;
      control?.liberar();
    };
  }, [medios]);
  const medio = MEDIOS[estado?.medio ?? 0] ?? MEDIOS[0];
  // el panel LED es oscuro: el texto pasa a blanco
  const oscuro = medios && estado?.medio === 3;

  const listo = !!estado?.listo;
  return (
    <main className="relative bg-[#DFE2E4] text-[#1C2024]">
      <div
        ref={lienzo}
        aria-hidden="true"
        className="fixed inset-0 h-[100lvh]"
      />
      {/* la foto de referencia, encima, para comparar (solo en realismo) */}
      {!medios && (
        <img
          src="/laboratorio/realismo/referencia.jpg"
          srcSet="/laboratorio/realismo/referencia-960.jpg 960w, /laboratorio/realismo/referencia.jpg 1920w"
          sizes="100vw"
          alt="Fotografía de referencia generada con OpenAI: la escultura de vidrio sobre la mesa"
          className={`pointer-events-none fixed inset-0 h-[100lvh] w-full object-cover transition-opacity duration-500 ${referencia ? "opacity-100" : "opacity-0"}`}
        />
      )}

      <header
        className={`fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 text-[14px] transition-colors duration-500 lg:px-10 ${oscuro ? "text-white" : ""}`}
      >
        <Link
          href="/laboratorio"
          className="-mx-2 inline-flex h-11 items-center px-2 font-medium hover:underline"
        >
          Laboratorio
        </Link>
        <span className="opacity-60">
          {estado?.listo
            ? `${estado.motor === "webgpu" ? "WebGPU" : "WebGL 2"}, ${estado.reposo ? "en reposo" : `${estado.fps} fps`}`
            : ""}
        </span>
      </header>

      {/* el pie de foto va arriba a la izquierda: la escultura ocupa el tercio de abajo, como en la foto */}
      <div
        className={`pointer-events-none fixed left-0 top-16 z-20 max-w-[30rem] px-5 transition-colors duration-500 lg:top-20 lg:px-10 ${oscuro ? "text-white" : ""}`}
      >
        {medios ? (
          <>
            <h1 className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[36px]">
              {medio?.nombre}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed opacity-75 sm:text-[16px]">
              {medio?.texto}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[36px]">
              Estudio de realismo
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed opacity-75 sm:text-[16px]">
              El isotipo como objeto real: vidrio óptico sobre terrazo, la luz
              de un día nublado en Lima y una lente de 85&nbsp;mm. Desliza para
              llevar el foco a la ventana.
            </p>
          </>
        )}
      </div>
      {!medios && (
        <button
          type="button"
          onClick={() => setReferencia((r) => !r)}
          aria-pressed={referencia}
          className="fixed bottom-6 right-5 z-20 h-11 rounded-full bg-[#1C2024] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#33383E] lg:bottom-10 lg:right-10"
        >
          {referencia ? "Volver a la escena" : "Comparar con la foto"}
        </button>
      )}

      <div
        className={`fixed inset-0 z-30 grid place-items-center bg-[#DFE2E4] transition-opacity duration-700 ${listo || estado?.error ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <p className="text-[14px] text-[#1C2024]/60">Montando la escena…</p>
      </div>
      {estado?.error && (
        <p className="fixed inset-x-0 top-16 z-40 mx-auto max-w-md rounded-xl bg-white px-4 py-3 text-[14px] shadow">
          No se pudo iniciar: {estado.error}
        </p>
      )}

      <div
        aria-hidden="true"
        className={medios ? "h-[420svh]" : "h-[260svh]"}
      />
    </main>
  );
}
