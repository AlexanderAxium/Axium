"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Scroll suave con Lenis.
 *
 * Dos cosas que hay que tener en cuenta y que antes no se tenían:
 *
 * 1. **Lenis se pelea con la navegación de Next.** Al cambiar de ruta, Next llama
 *    a `window.scrollTo(0, 0)`, pero Lenis guarda su propia posición y en el
 *    siguiente fotograma la vuelve a escribir, deshaciendo el salto: se entra a la
 *    página nueva a media altura. Por eso aquí se le ordena a Lenis ir al principio
 *    cuando cambia el `pathname` — salvo que la URL traiga un ancla, que entonces
 *    manda el ancla.
 * 2. **Quien pide menos movimiento no quiere scroll suave**, así que ahí no se
 *    monta Lenis y se deja el scroll nativo del navegador.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Se guarda SIEMPRE el último id: antes solo se guardaba el primero, así que
    // al desmontar se cancelaba un fotograma ya consumido y el bucle seguía vivo.
    let id = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      id = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname es el disparador, no se lee dentro
  useEffect(() => {
    if (window.location.hash) return;
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return <>{children}</>;
}
