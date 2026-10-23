// Núcleo común de los ejemplos del laboratorio 3D (2026-10-15): crear el renderer con techo de
// píxeles por punto, medir, bucle con pausa, contador de cuadros y liberar todo al salir.
// Las reglas son las de TRES-D.md § 2: sin WebGL se devuelve null; con movimiento reducido el reloj
// no avanza (la escena se dibuja quieta); al desmontar se suelta el contexto.
import * as THREE from "three";

export type Medidas = { fps: number; llamadas: number };
export type ControlLab = {
  pausar: (p: boolean) => void;
  liberar: () => void;
  /** acción propia del ejemplo (p. ej. cambiar de efecto) */
  accion?: (valor: string) => void;
};
export type Contexto = {
  renderer: THREE.WebGLRenderer;
  lienzo: HTMLCanvasElement;
  contenedor: HTMLElement;
  dpr: number;
  tactil: boolean;
  quieto: boolean;
  /** puntero en coordenadas normalizadas (−1…1, y hacia arriba) y si está sobre la página */
  puntero: { x: number; y: number; dentro: boolean; abajo: boolean };
};
export type Ciclo = {
  medir: (ancho: number, alto: number) => void;
  /** dt en segundos (0 en pausa), t = reloj acumulado */
  cuadro: (dt: number, t: number) => void;
  liberar?: () => void;
  accion?: (valor: string) => void;
};

export function crearLab(
  contenedor: HTMLElement,
  crear: (ctx: Contexto) => Ciclo,
  alMedir?: (m: Medidas) => void,
  opciones: { antialias?: boolean; dprMax?: number; alpha?: boolean } = {}
): ControlLab | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: opciones.antialias ?? true,
      // transparente: deja ver HTML debajo del lienzo (el folleto se tritura sobre el contacto real)
      alpha: opciones.alpha ?? false,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }
  const tactil = window.matchMedia("(pointer: coarse)").matches;
  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(
    window.devicePixelRatio || 1,
    opciones.dprMax ?? (tactil ? 1.5 : 2)
  );
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.info.autoReset = false;
  const lienzo = renderer.domElement;
  lienzo.style.cssText =
    "display:block;width:100%;height:100%;touch-action:none;opacity:0;transition:opacity .8s ease";
  contenedor.appendChild(lienzo);

  const puntero = { x: 0, y: 0, dentro: false, abajo: false };
  const mover = (ev: PointerEvent) => {
    const r = lienzo.getBoundingClientRect();
    puntero.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
    puntero.y = -(((ev.clientY - r.top) / r.height) * 2 - 1);
    puntero.dentro = true;
  };
  const bajar = (ev: PointerEvent) => {
    mover(ev);
    puntero.abajo = true;
  };
  const subir = () => {
    puntero.abajo = false;
  };
  const salir = () => {
    puntero.dentro = false;
    puntero.abajo = false;
  };
  lienzo.addEventListener("pointermove", mover);
  lienzo.addEventListener("pointerdown", bajar);
  window.addEventListener("pointerup", subir);
  lienzo.addEventListener("pointerleave", salir);

  const ciclo = crear({
    renderer,
    lienzo,
    contenedor,
    dpr,
    tactil,
    quieto,
    puntero,
  });

  const medir = () => {
    const w = contenedor.clientWidth;
    const h = contenedor.clientHeight;
    if (w < 2 || h < 2) return;
    renderer.setSize(w, h, false);
    ciclo.medir(w, h);
  };
  const ro = new ResizeObserver(medir);
  ro.observe(contenedor);
  medir();

  let vivo = true;
  let pausado = false;
  let raf = 0;
  let previo = performance.now();
  let t = 0;
  let cuadros = 0;
  let ultima = previo;
  const paso = (ahora: number) => {
    raf = 0;
    if (!vivo) return;
    const real = Math.min(0.05, (ahora - previo) / 1000);
    previo = ahora;
    const dt = pausado || quieto ? 0 : real;
    t += dt;
    renderer.info.reset();
    ciclo.cuadro(dt, t);
    if (lienzo.style.opacity !== "1") lienzo.style.opacity = "1";
    cuadros++;
    if (alMedir && ahora - ultima > 500) {
      alMedir({
        fps: Math.round((cuadros * 1000) / (ahora - ultima)),
        llamadas: renderer.info.render.calls,
      });
      cuadros = 0;
      ultima = ahora;
    }
    // en pausa se sigue dibujando solo si el puntero interactúa (el ejemplo puede responder a él)
    if (!pausado || puntero.abajo) raf = requestAnimationFrame(paso);
  };
  const despertar = () => {
    if (!raf && vivo) raf = requestAnimationFrame(paso);
  };
  lienzo.addEventListener("pointermove", despertar);
  despertar();

  return {
    pausar: (p) => {
      pausado = p;
      despertar();
    },
    accion: (v) => {
      ciclo.accion?.(v);
      despertar();
    },
    liberar: () => {
      vivo = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      lienzo.removeEventListener("pointermove", mover);
      lienzo.removeEventListener("pointermove", despertar);
      lienzo.removeEventListener("pointerdown", bajar);
      window.removeEventListener("pointerup", subir);
      lienzo.removeEventListener("pointerleave", salir);
      ciclo.liberar?.();
      renderer.dispose();
      renderer.forceContextLoss();
      lienzo.remove();
    },
  };
}

/** suelta geometrías, materiales y texturas de una escena */
export function liberarEscena(escena: THREE.Object3D) {
  escena.traverse((o) => {
    const m = o as THREE.Mesh;
    m.geometry?.dispose();
    const mats = Array.isArray(m.material)
      ? m.material
      : m.material
        ? [m.material]
        : [];
    for (const mat of mats) {
      for (const v of Object.values(mat))
        if (v instanceof THREE.Texture) v.dispose();
      const u = (mat as THREE.ShaderMaterial).uniforms;
      if (u)
        for (const x of Object.values(u))
          if (x?.value instanceof THREE.Texture) x.value.dispose();
      mat.dispose();
    }
  });
}

/** simplex 3D (Ashima Arts, MIT) para los shaders de los ejemplos */
export const GLSL_SIMPLEX = /* glsl */ `
  vec4 permutar(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  vec4 invRaiz(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permutar(permutar(permutar(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = invRaiz(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;
