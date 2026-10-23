"use client";

import { CtaProceso } from "~/components/axium/cta-proceso";
import { ProcesoFases } from "~/components/axium/proceso-fases";

/**
 * «Cómo trabajamos» en el inicio: el CTA del taller y las cuatro fases (desde el 2026-10-23,
 * Alexander: «usa el nuevo diseño con el CTA y el proceso de 4 pasos»). Las propuestas anteriores
 * (la sección de tres pasos, el ciclo, la pantalla, el tablero y la mesa de trabajo) se borraron
 * el mismo día: «los demás intentos y componentes que ya no usamos, límpialo».
 */
export function ProcessSection() {
  return (
    <>
      <CtaProceso />
      <ProcesoFases />
    </>
  );
}
