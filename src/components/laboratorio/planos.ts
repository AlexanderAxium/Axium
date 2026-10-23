// Recorrido de cámara plano por plano (2026-10-15). Lo aprendido de Codrops («cinematic 3D scroll»)
// y de Unseen: una curva uniforme de 9 puntos se mueve a velocidad pareja y nunca se detiene; el
// cine va por PLANOS, cada uno con su duración, su curva de aceleración y una PAUSA al llegar, que es
// cuando se lee el texto. Las posiciones pasan por una Catmull-Rom centrípeta (no se pasa de largo
// ni hace bucles cuando los puntos están desparejos, como sí la uniforme).
import * as THREE from "three";

export type Plano = {
  pos: [number, number, number];
  mira: [number, number, number];
  /** campo de visión al llegar (grados) */
  fov?: number;
  /** cuánto scroll toma llegar a este plano desde el anterior (unidades relativas) */
  dura?: number;
  /** cuánto scroll se queda quieto al llegar */
  pausa?: number;
  /** curva de aceleración del tramo que llega a este plano */
  curva?: (t: number) => number;
  /** índice del texto que acompaña a este plano (se muestra durante la pausa) */
  texto?: number;
};

/** curva de Bézier cúbica como las de CSS (x1, y1, x2, y2) */
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const x = (t: number) => ((ax * t + bx) * t + cx) * t;
  const y = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (v: number) => {
    if (v <= 0) return 0;
    if (v >= 1) return 1;
    let t = v;
    for (let i = 0; i < 6; i++) {
      const d = dx(t);
      if (Math.abs(d) < 1e-5) break;
      t -= (x(t) - v) / d;
    }
    return y(Math.min(1, Math.max(0, t)));
  };
}

// las de Codrops: suaves para cine
export const CURVAS = {
  seda: bezier(0.45, 0.05, 0.55, 0.95),
  suave: bezier(0.25, 0.1, 0.25, 1),
  flujo: bezier(0.33, 0, 0.2, 1),
  lineal: (t: number) => t,
};

export function crearRecorrido(planos: Plano[]) {
  const n = planos.length;
  const cam = new THREE.CatmullRomCurve3(
    planos.map((p) => new THREE.Vector3(...p.pos)),
    false,
    "centripetal"
  );
  const mira = new THREE.CatmullRomCurve3(
    planos.map((p) => new THREE.Vector3(...p.mira)),
    false,
    "centripetal"
  );
  // la línea de tiempo: [llegada al plano i, fin de su pausa]
  const tramos: { ini: number; fin: number; pausaFin: number }[] = [];
  let t = 0;
  planos.forEach((p, i) => {
    const ini = t;
    t += i === 0 ? 0 : (p.dura ?? 1);
    const fin = t;
    t += p.pausa ?? 0;
    tramos.push({ ini, fin, pausaFin: t });
  });
  const total = t;

  /** p en 0…1 (el scroll) → posición, mira y fov; devuelve también el plano y los textos */
  const evaluar = (
    p01: number,
    pos: THREE.Vector3,
    objetivo: THREE.Vector3
  ) => {
    const tt = Math.min(1, Math.max(0, p01)) * total;
    let i = 0;
    while (i < n - 1 && tt > (tramos[i] as { pausaFin: number }).pausaFin) i++;
    // dentro del tramo i: o llegando (ini…fin) o en pausa (fin…pausaFin)
    const tr = tramos[i] as { ini: number; fin: number; pausaFin: number };
    let u = 1;
    if (i > 0 && tt < tr.fin) {
      const crudo = (tt - tr.ini) / Math.max(1e-6, tr.fin - tr.ini);
      u = (planos[i]?.curva ?? CURVAS.seda)(crudo);
    }
    const s = i === 0 ? 0 : (i - 1 + u) / (n - 1);
    cam.getPoint(s, pos);
    mira.getPoint(s, objetivo);
    const fovA = planos[Math.max(0, i - 1)]?.fov ?? 40;
    const fovB = planos[i]?.fov ?? fovA;
    const fov = i === 0 ? fovB : fovA + (fovB - fovA) * u;
    // texto: aparece al terminar de llegar y se va justo antes de salir del plano
    let texto = -1;
    let opacidad = 0;
    const tx = planos[i]?.texto;
    if (tx !== undefined && tt >= tr.fin - 0.15) {
      const entrar = THREE.MathUtils.smoothstep(
        tt,
        tr.fin - 0.15,
        tr.fin + 0.1
      );
      const salir =
        1 -
        THREE.MathUtils.smoothstep(tt, tr.pausaFin - 0.1, tr.pausaFin + 0.12);
      texto = tx;
      opacidad = Math.min(entrar, i === n - 1 ? 1 : salir);
    }
    return { fov, plano: i, texto, opacidad };
  };
  return { evaluar, total };
}
