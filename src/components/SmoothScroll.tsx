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
  // 3. **El laboratorio 3D suaviza el scroll él mismo** (en el mismo cuadro que dibuja). Con Lenis
  //    encima eran dos suavizados en cadena y dos bucles de animación: se sentía «de goma».
  const sinLenis = pathname?.startsWith("/laboratorio") ?? false;

  useEffect(() => {
    if (sinLenis) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // 4. **En pantallas táctiles no hace nada** (el scroll con el dedo es el nativo) y su bucle de
    //    requestAnimationFrame corría igual en cada cuadro, por eso ahí no se monta (2026-10-23)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // 5. **El bucle corre solo mientras hay un desplazamiento suave** (2026-10-24). Antes pedía un
    //    cuadro en cada vsync para siempre, aunque la página estuviera quieta: junto con otros dos
    //    bucles, el navegador repintaba la página entera 120 veces por segundo y el inicio «se
    //    trababa». Ahora la rueda lo despierta y se duerme cuando Lenis termina de llegar.
    //    Al despertar se le da la hora actual ANTES de que Lenis atienda la rueda (por eso el
    //    listener va en captura): su reloj solo avanza en `raf`, y con el intervalo dormido entero
    //    de golpe la animación saltaba al final.
    let id = 0;
    const cuadro = (time: number) => {
      lenis.raf(time);
      id = lenis.isScrolling === "smooth" ? requestAnimationFrame(cuadro) : 0;
    };
    const despertar = () => {
      if (id) return;
      lenis.raf(performance.now());
      id = requestAnimationFrame(cuadro);
    };
    window.addEventListener("wheel", despertar, {
      capture: true,
      passive: true,
    });

    return () => {
      window.removeEventListener("wheel", despertar, { capture: true });
      cancelAnimationFrame(id);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [sinLenis]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname es el disparador, no se lee dentro
  useEffect(() => {
    if (window.location.hash) return;
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return <>{children}</>;
}
