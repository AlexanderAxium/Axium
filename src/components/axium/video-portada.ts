import { useEffect, useState } from "react";

/**
 * Las portadas de los vídeos de las fichas (2026-10-23). Como `poster` iba el JPG original y se
 * pedía al cargar la página aunque el vídeo estuviera diez pantallas más abajo: en Rematch eran
 * 850 KB antes de pintar nada en un 4G lento. Ahora pasan por el optimizador (AVIF o WebP a
 * 1200 px) y se piden recién cuando el vídeo se acerca.
 */
export function portadaOptimizada(src: string, ancho = 1200) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${ancho}&q=75`;
}

/** true cuando el elemento queda a menos de una pantalla; uno oculto (display: none) nunca llega. */
export function useCerca(ref: React.RefObject<Element | null>) {
  const [cerca, setCerca] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        setCerca(true);
        io.disconnect();
      },
      { rootMargin: "100% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return cerca;
}
