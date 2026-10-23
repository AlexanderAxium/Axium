"use client";

import { HeroProfundidad } from "~/components/axium/hero-transiciones";

// La portada del inicio es la t2 (2026-10-16: «me quedo con t2, déjalo en el inicio»): el hero de
// vidrio con el reel se aleja como una tarjeta y «Nosotros» sube por encima como una hoja (ver
// hero-transiciones.tsx). Trae «Nosotros» adentro, así que el inicio no lo vuelve a pintar. Las
// demás propuestas (18b, 20, 34f, 34j, 34k y las transiciones t1, t3, t4 y t5) se borraron el
// 2026-10-23: «los demás intentos y componentes que ya no usamos, límpialo». Lo descartado antes
// sigue respaldado en el taller del hero (.claude/skills/portafolio-axium/capturas-clientes/
// axium-hero/2026-10/descartadas-2026-10-15/).
export function HeroSection() {
  return <HeroProfundidad />;
}
