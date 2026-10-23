// Laboratorio 3D · la obra (2026-10-16): experiencia inmersiva a partir de igloo.inc. Medido allí:
// three r165, 164 shaders, 46 framebuffers, ~48 llamadas por cuadro, geometrías Draco, texturas KTX2,
// texto MSDF dentro de WebGL y 19 sonidos. Su recorrido: un plano de líneas → el iglú de bloques que
// saltan con el cursor → un vuelo entre la niebla → un anillo de fragmentos alrededor de un núcleo.
// La nuestra cuenta lo mismo con el isotipo, que ya es una obra de tres piezas:
//   · el plano: líneas que dibujan el isotipo en la niebla
//   · la obra: el isotipo levantado en ladrillos de cerámica (cada pieza con su propio aparejo a 60°),
//     sobre una explanada nevada. Los ladrillos saltan con el cursor y dejan ver la luz azul de dentro,
//     con etiquetas de oficio (UX, API, IA…)
//   · el paso: la cámara atraviesa el triángulo del centro (los ladrillos se abren como un iris) y
//     sube a través de un manto de nubes
//   · sobre el mar de nubes: cuatro bloques de hielo con proyectos reales congelados dentro
//   · el final: miles de fragmentos arman el isotipo alrededor de un núcleo de luz
// Postproceso: bloom contenido, aberración cromática que crece con la velocidad del scroll, grano y
// el «blanco» de nube al cruzar el manto. Todo procedural: no hay modelos que descargar.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { SimplexNoise } from "three/addons/math/SimplexNoise.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ISOTIPO } from "~/components/axium/tres/isotipo";
import { crearLab, liberarEscena } from "~/components/laboratorio/base";
import {
  CURVAS,
  type Plano,
  crearRecorrido,
} from "~/components/laboratorio/planos";

export type EstadoObra = {
  listo: boolean;
  cargado: number;
  fps: number;
  llamadas: number;
  /** texto activo (−1 si ninguno) */
  texto: number;
  plano: number;
};
export type ControlObra = {
  pausar: (p: boolean) => void;
  liberar: () => void;
};
/** lo que la escena le cuenta al sonido (sin pasar por React) */
export type OyenteObra = {
  velocidad: (v: number) => void;
  golpe: () => void;
  llegada: (texto: number) => void;
};
export type DomObra = {
  textos: HTMLElement[];
  etiquetas: HTMLElement[];
  barra: HTMLElement | null;
};

// ── el isotipo en metros ──
const ANCHO = 7; // el triángulo del centro queda con 0,6 m de radio interior: cabe la cámara
const S = ANCHO / ISOTIPO.ancho;
const BASE_Y = 0.55;
const Z_FRENTE = 0.3;
const PROF = 0.42; // grosor del ladrillo
const NOMBRES = ["arriba", "izquierda", "abajo"] as const;
type V2 = { x: number; y: number };
const aMundo = (p: readonly [number, number], centrado = false): V2 => ({
  x: (p[0] - ISOTIPO.ancho / 2) * S,
  y: centrado
    ? (ISOTIPO.alto / 2 - p[1]) * S
    : (ISOTIPO.alto - p[1]) * S + BASE_Y,
});
const poligonos = (centrado: boolean) =>
  NOMBRES.map((n) => ISOTIPO.piezas[n].map((p) => aMundo(p, centrado)));
// el triángulo vacío del centro (sus vértices en el PNG) y su centro
const TRIANGULO_PNG: [number, number][] = [
  [775, 486],
  [545, 900],
  [1005, 900],
];
const HUECO = aMundo([775, 762]);
const HUECO_C = aMundo([775, 762], true);

const PORTAL = new THREE.Vector3(0, 24, -112);
const MONOLITOS: {
  pos: [number, number, number];
  cam: [number, number, number];
  img: string;
}[] = [
  { pos: [-3.2, 21, -34], cam: [2.2, 21.6, -26.5], img: "rematch" },
  { pos: [3.6, 22.5, -50], cam: [-1.8, 22.6, -42.5], img: "aurore" },
  { pos: [-3.4, 21.5, -66], cam: [2, 21.9, -58.5], img: "feniz" },
  { pos: [3.4, 22.8, -82], cam: [-1.8, 22.9, -74.5], img: "lumiolearn" },
];
const OFICIOS = [
  "UX",
  "Interfaz",
  "Frontend",
  "Backend",
  "API",
  "Datos",
  "IA",
  "Pagos",
  "Nube",
  "Seguridad",
  "Marca",
  "Analítica",
];

// el recorrido: plano por plano (planos.ts); `texto` = índice del texto del DOM
const H: [number, number] = [HUECO.x, HUECO.y];
const PLANOS: Plano[] = [
  { pos: [0.6, 3.7, 19], mira: [0, 3.2, 0], fov: 34, pausa: 0.6, texto: 0 },
  {
    pos: [-3.0, 3.2, 8.8],
    mira: [-1.7, 3.3, 0],
    fov: 44,
    dura: 1.2,
    pausa: 0.9,
    texto: 1,
  },
  {
    pos: [H[0], H[1], 3.4],
    mira: [H[0], H[1], -6],
    fov: 50,
    dura: 0.9,
    curva: CURVAS.suave,
  },
  {
    pos: [H[0], H[1], 0.1],
    mira: [H[0], H[1] + 0.2, -8],
    fov: 54,
    dura: 0.35,
    curva: CURVAS.lineal,
  },
  {
    pos: [H[0], H[1] + 0.4, -3.6],
    mira: [0, 8, -16],
    fov: 56,
    dura: 0.6,
    curva: CURVAS.lineal,
  },
  { pos: [0, 13.9, -16], mira: [0, 17, -28], fov: 56, dura: 1.1 },
  ...MONOLITOS.map(
    (m, i): Plano => ({
      pos: m.cam,
      mira: [m.pos[0] * 0.8, m.pos[1] + 0.1, m.pos[2]],
      fov: 42,
      dura: i === 0 ? 1.2 : 1.1,
      pausa: 0.9,
      texto: 2 + i,
    })
  ),
  {
    pos: [0, 24.2, -96],
    mira: [0, 22.7, -112],
    fov: 40,
    dura: 1.6,
    pausa: 1.0,
    texto: 6,
  },
];

// ── utilidades ──
function azar(semilla: number) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const suave01 = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
function dentro(p: V2, poly: V2[]) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i] as V2;
    const b = poly[j] as V2;
    if (
      a.y > p.y !== b.y > p.y &&
      p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x
    )
      c = !c;
  }
  return c;
}
function centroide(poly: V2[]): V2 {
  let x = 0;
  let y = 0;
  for (const p of poly) {
    x += p.x;
    y += p.y;
  }
  return { x: x / poly.length, y: y / poly.length };
}

/** ruido fbm periódico (sin costuras al repetirse): 4D sobre un toro */
function ruidoPeriodico(lado: number, rnd: () => number) {
  const sx = new SimplexNoise({ random: rnd });
  const alto = new Float32Array(lado * lado);
  const R = 1.1;
  for (let j = 0; j < lado; j++) {
    for (let i = 0; i < lado; i++) {
      const u = (i / lado) * Math.PI * 2;
      const v = (j / lado) * Math.PI * 2;
      let s = 0;
      let a = 0.5;
      let f = 1;
      for (let o = 0; o < 4; o++) {
        s +=
          a *
          sx.noise4d(
            Math.cos(u) * R * f,
            Math.sin(u) * R * f,
            Math.cos(v) * R * f,
            Math.sin(v) * R * f
          );
        f *= 2;
        a *= 0.5;
      }
      alto[j * lado + i] = s * 0.5 + 0.5;
    }
  }
  const gris = new Uint8Array(lado * lado * 4);
  const normal = new Uint8Array(lado * lado * 4);
  for (let j = 0; j < lado; j++) {
    for (let i = 0; i < lado; i++) {
      const k = j * lado + i;
      const h = alto[k] as number;
      const hx =
        (alto[j * lado + ((i + 1) % lado)] as number) -
        (alto[j * lado + ((i - 1 + lado) % lado)] as number);
      const hy =
        (alto[((j + 1) % lado) * lado + i] as number) -
        (alto[((j - 1 + lado) % lado) * lado + i] as number);
      const n = new THREE.Vector3(-hx * 6, -hy * 6, 1).normalize();
      gris.set([h * 255, h * 255, h * 255, 255], k * 4);
      normal.set(
        [
          (n.x * 0.5 + 0.5) * 255,
          (n.y * 0.5 + 0.5) * 255,
          (n.z * 0.5 + 0.5) * 255,
          255,
        ],
        k * 4
      );
    }
  }
  const tex = (datos: Uint8Array) => {
    const t = new THREE.DataTexture(datos, lado, lado, THREE.RGBAFormat);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.generateMipmaps = true;
    t.anisotropy = 4;
    t.needsUpdate = true;
    return t;
  };
  return { alto: tex(gris), normal: tex(normal) };
}

// ── los ladrillos: cada pieza con su aparejo, alineado a sus dos direcciones dominantes ──
type Ladrillo = {
  c: V2;
  medio: boolean;
  u: V2;
  v: V2;
};
function aparejar(poly: V2[]) {
  // el isotipo solo tiene bordes a 0°, 60° y 120°: las dos direcciones con más largo mandan
  const peso = [0, 0, 0];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i] as V2;
    const b = poly[(i + 1) % poly.length] as V2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    let ang = Math.atan2(dy, dx);
    if (ang < 0) ang += Math.PI;
    const k = Math.round(ang / (Math.PI / 3)) % 3;
    peso[k] = (peso[k] as number) + Math.hypot(dx, dy);
  }
  const orden = [0, 1, 2].sort(
    (p, q) => (peso[q] as number) - (peso[p] as number)
  );
  const au = ((orden[0] as number) * Math.PI) / 3;
  const av = ((orden[1] as number) * Math.PI) / 3;
  const u = { x: Math.cos(au), y: Math.sin(au) };
  const v = { x: Math.cos(av), y: Math.sin(av) };
  const det = u.x * v.y - u.y * v.x;
  const O = centroide(poly);
  const aST = (p: V2) => ({
    s: ((p.x - O.x) * v.y - (p.y - O.y) * v.x) / det,
    t: (u.x * (p.y - O.y) - u.y * (p.x - O.x)) / det,
  });
  const aXY = (s: number, t: number): V2 => ({
    x: O.x + s * u.x + t * v.x,
    y: O.y + s * u.y + t * v.y,
  });
  let smin = Number.POSITIVE_INFINITY;
  let smax = Number.NEGATIVE_INFINITY;
  let tmin = Number.POSITIVE_INFINITY;
  let tmax = Number.NEGATIVE_INFINITY;
  for (const p of poly) {
    const q = aST(p);
    smin = Math.min(smin, q.s);
    smax = Math.max(smax, q.s);
    tmin = Math.min(tmin, q.t);
    tmax = Math.max(tmax, q.t);
  }
  const LU = 0.62;
  const LV = 0.36;
  const cabe = (s0: number, s1: number, t0: number, t1: number) => {
    const cs = (s0 + s1) / 2;
    const ct = (t0 + t1) / 2;
    if (!dentro(aXY(cs, ct), poly)) return false;
    for (const [ss, tt] of [
      [s0, t0],
      [s1, t0],
      [s1, t1],
      [s0, t1],
    ] as const) {
      if (!dentro(aXY(cs + (ss - cs) * 0.72, ct + (tt - ct) * 0.72), poly))
        return false;
    }
    return true;
  };
  const lista: Ladrillo[] = [];
  for (let j = Math.floor(tmin / LV) - 1; j <= Math.ceil(tmax / LV); j++) {
    const t0 = j * LV;
    const off = (((j % 2) + 2) % 2) * 0.5 * LU; // aparejo a soga: media pieza de desfase
    const fila: number[] = [];
    for (
      let i = Math.floor((smin - off) / LU) - 1;
      i <= Math.ceil((smax - off) / LU) + 1;
      i++
    ) {
      const s0 = i * LU + off;
      if (cabe(s0, s0 + LU, t0, t0 + LV)) {
        fila.push(s0);
        lista.push({ c: aXY(s0 + LU / 2, t0 + LV / 2), medio: false, u, v });
      }
    }
    if (!fila.length) continue;
    // medios ladrillos en las puntas de la fila
    const a = Math.min(...fila);
    const b = Math.max(...fila) + LU;
    if (cabe(a - LU / 2, a, t0, t0 + LV))
      lista.push({ c: aXY(a - LU / 4, t0 + LV / 2), medio: true, u, v });
    if (cabe(b, b + LU / 2, t0, t0 + LV))
      lista.push({ c: aXY(b + LU / 4, t0 + LV / 2), medio: true, u, v });
  }
  return { lista, u, v, LU, LV };
}
function geoLadrillo(u: V2, v: V2, lu: number, lv: number) {
  const g = 0.05; // junta: por ahí se escapa la luz de dentro
  const a = lu / 2 - g / 2;
  const b = lv / 2 - g / 2;
  const pts = (
    [
      [-a, -b],
      [a, -b],
      [a, b],
      [-a, b],
    ] as const
  ).map(([s, t]) => new THREE.Vector2(s * u.x + t * v.x, s * u.y + t * v.y));
  const fondo = PROF - 0.06;
  const geo = new THREE.ExtrudeGeometry(new THREE.Shape(pts), {
    depth: fondo,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelOffset: -0.03,
    bevelSegments: 2,
    curveSegments: 1,
  });
  geo.translate(0, 0, -fondo / 2);
  return geo;
}

// ── shaders ──
const CIELO_VS = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = p.xyww;
  }
`;
const CIELO_FS = /* glsl */ `
  uniform vec3 uCenit;
  uniform vec3 uHorizonte;
  uniform vec3 uSol;
  uniform vec3 uSolDir;
  varying vec3 vDir;
  void main() {
    vec3 d = normalize(vDir);
    vec3 col = mix(uHorizonte, uCenit, smoothstep(-0.02, 0.6, d.y));
    float s = max(dot(d, uSolDir), 0.0);
    col += uSol * (pow(s, 48.0) * 0.5 + pow(s, 5.0) * 0.1);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const NUBES_VS = /* glsl */ `
  varying vec3 vMundo;
  void main() {
    vec4 m = modelMatrix * vec4(position, 1.0);
    vMundo = m.xyz;
    gl_Position = projectionMatrix * viewMatrix * m;
  }
`;
// barato: el ruido sale de la textura periódica (4 lecturas), no de simplex por píxel
const NUBES_FS = /* glsl */ `
  uniform sampler2D tRuido;
  uniform float uTiempo;
  uniform float uSemilla;
  uniform float uY;
  uniform vec3 uLuz;
  uniform vec3 uSombra;
  uniform vec3 uHorizonte;
  varying vec3 vMundo;
  void main() {
    vec2 q = vMundo.xz * 0.006 + vec2(uTiempo * 0.0012, uTiempo * 0.0006) + uSemilla;
    vec2 w = vec2(texture2D(tRuido, q * 0.7).r, texture2D(tRuido, q * 0.7 + 0.37).r) - 0.5;
    float d = texture2D(tRuido, q + w * 0.35).r * 0.62
            + texture2D(tRuido, q * 2.3 + w * 0.2).r * 0.28
            + texture2D(tRuido, q * 5.1).r * 0.1;
    float a = smoothstep(0.34, 0.6, d);
    vec3 col = mix(uSombra, uLuz, smoothstep(0.4, 0.75, d));
    float dist = length(vMundo - cameraPosition);
    float horiz = 1.0 - exp(-pow(dist * 0.0042, 2.0));
    col = mix(col, uHorizonte, horiz * 0.85);
    // el borde cercano del manto (sobre la obra) se desvanece; al cruzarlo manda el blanco del postproceso
    a *= smoothstep(-10.0, -42.0, vMundo.z);
    a *= smoothstep(2.0, -4.0, cameraPosition.z); // desde la obra no se ve: aparece al cruzar el muro
    a *= smoothstep(0.25, 2.2, abs(cameraPosition.y - uY));
    gl_FragColor = vec4(col, a * 0.94);
  }
`;

const LUZ_VS = /* glsl */ `
  varying vec2 vXY;
  void main() {
    vXY = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const LUZ_FS = /* glsl */ `
  uniform vec2 uGolpe;
  uniform float uFuerza;
  uniform vec2 uCam;
  uniform float uCerca;
  uniform float uBase;
  uniform vec3 uColor;
  varying vec2 vXY;
  void main() {
    float d = distance(vXY, uGolpe);
    float dc = distance(vXY, uCam);
    float e = uBase + uFuerza * exp(-d * d * 0.9) * 3.2 + uCerca * exp(-dc * dc * 0.35) * 2.6;
    gl_FragColor = vec4(uColor * e, 1.0);
  }
`;

const LINEAS_VS = /* glsl */ `
  attribute float aT;
  attribute float aOrden;
  varying float vT;
  varying float vOrden;
    varying vec2 vXY;
  void main() {
    vT = aT;
    vOrden = aOrden;
    vXY = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const LINEAS_FS = /* glsl */ `
  uniform float uDibujo;
  uniform float uOpac;
    uniform vec3 uColor;
  uniform vec2 uCentro;
  varying float vT;
  varying float vOrden;
  varying vec2 vXY;
  void main() {
    float frente = uDibujo * 1.5 - vOrden * 0.5;
    if (vT > frente) discard;
    // por píxel: en una guía de 32 m los dos extremos están lejos y el medio no
    float a = uOpac * (1.0 - smoothstep(4.0, 15.0, distance(vXY, uCentro)));
    gl_FragColor = vec4(uColor, a);
  }
`;

const NUCLEO_VS = /* glsl */ `
  attribute vec4 aRand;
  uniform float uTiempo;
  uniform float uArmado;
  uniform float uEscala;
  varying float vBrillo;
  void main() {
    float r = aRand.x * 0.75;
    float a = aRand.y * 6.2832 + uTiempo * (0.25 + aRand.z * 0.6) / (r + 0.35);
    float z = (aRand.w - 0.5) * 0.5;
    vec3 p = vec3(cos(a) * r, sin(a) * r, z);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.2 + aRand.z * 2.6) * uEscala * uArmado / -mv.z;
    vBrillo = (1.0 - aRand.x * 0.6) * uArmado;
  }
`;
const NUCLEO_FS = /* glsl */ `
  varying float vBrillo;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vec3(0.55, 0.85, 1.0) * 1.5 * vBrillo * a, a * vBrillo);
  }
`;
const HALO_FS = /* glsl */ `
  uniform float uArmado;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = pow(max(1.0 - d, 0.0), 2.5) * uArmado;
    gl_FragColor = vec4(vec3(0.5, 0.82, 1.0) * a * 0.9, a);
  }
`;
const UV_VS = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const COPOS_VS = /* glsl */ `
  attribute vec3 aRand;
  uniform float uTiempo;
  uniform float uEscala;
  varying float vA;
  void main() {
    vec3 p = position;
    p.x = mod(p.x + uTiempo * (0.4 + aRand.x * 0.5) + 30.0, 60.0) - 30.0;
    p.y += sin(uTiempo * 0.5 + aRand.y * 6.28) * 0.3;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.0 + aRand.z * 2.0) * uEscala / -mv.z;
    vA = 0.55 * smoothstep(60.0, 8.0, -mv.z);
  }
`;
const COPOS_FS = /* glsl */ `
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    gl_FragColor = vec4(1.0, 1.0, 1.0, smoothstep(0.5, 0.1, d) * vA);
  }
`;

const FINAL_FS = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform sampler2D tRuido;
  uniform float uTiempo;
  uniform float uGrano;
  uniform float uAberr;
  uniform float uBlanco;
  uniform float uVineta;
  uniform vec2 uRes;
  uniform vec3 uNube;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main() {
    vec2 c = vUv - 0.5;
    float d = dot(c, c);
    vec2 off = c * uAberr * (0.6 + d * 2.0);
    vec3 col = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
    // atravesar el manto de nubes: velos que pasan (ruido periódico desplazándose)
    float w = texture2D(tRuido, vUv * vec2(1.6, 0.9) + vec2(uTiempo * 0.02, -uTiempo * 0.12)).r;
    col = mix(col, uNube, clamp(uBlanco * (0.35 + w * 0.9), 0.0, 1.0));
    col *= 1.0 - uVineta * d * 1.4;
    col += (hash(vUv * uRes + fract(uTiempo) * 91.0) - 0.5) * uGrano;
    gl_FragColor = vec4(col, 1.0);
  }
`;
const QUAD_VS = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

export function crearObra(
  el: HTMLElement,
  alEstado: (e: EstadoObra) => void,
  dom: DomObra,
  oyente: { actual: OyenteObra | null }
): ControlObra | null {
  const estado: EstadoObra = {
    listo: false,
    cargado: 0,
    fps: 0,
    llamadas: 0,
    texto: -1,
    plano: 0,
  };
  const emitir = () => alEstado({ ...estado });

  return crearLab(
    el,
    ({ renderer, lienzo, dpr, tactil, quieto, puntero }) => {
      lienzo.style.touchAction = "pan-y"; // el lienzo cubre la página: el dedo tiene que poder desplazar
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.toneMappingExposure = 0.92;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      // la transmisión repinta TODOS los opacos cada cuadro a resolución completa: a la mitad (¼ de
      // píxeles) el hielo se ve igual de esmerilado
      renderer.transmissionResolutionScale = 0.5;

      const rnd = azar(7);
      const escena = new THREE.Scene();
      const camara = new THREE.PerspectiveCamera(34, 1, 0.05, 900);
      const HORIZONTE = new THREE.Color("#B7C0CC");
      const CENIT = new THREE.Color("#8A99AD");
      const SOL_DIR = new THREE.Vector3(-0.55, 0.42, 0.72).normalize();
      const AZUL = new THREE.Color().setRGB(0.18, 0.62, 1.0); // #0092D1 hacia el cian, en lineal
      escena.fog = new THREE.FogExp2(HORIZONTE, 0.06);

      // texturas de ruido periódico: relieve de la cerámica, detalle de la roca, nubes, velos
      const { alto: texAlto, normal: texNormal } = ruidoPeriodico(256, azar(3));

      // ── cielo y entorno (el vidrio y la cerámica reflejan este mismo cielo) ──
      const cieloU = {
        uCenit: { value: CENIT },
        uHorizonte: { value: HORIZONTE },
        uSol: { value: new THREE.Color("#FFF4E6") },
        uSolDir: { value: SOL_DIR },
      };
      const cielo = new THREE.Mesh(
        new THREE.SphereGeometry(800, 48, 24),
        new THREE.ShaderMaterial({
          vertexShader: CIELO_VS,
          fragmentShader: CIELO_FS,
          uniforms: cieloU,
          side: THREE.BackSide,
          depthWrite: false,
        })
      );
      cielo.frustumCulled = false;
      escena.add(cielo);
      const pmrem = new THREE.PMREMGenerator(renderer);
      const escenaCielo = new THREE.Scene();
      escenaCielo.add(cielo.clone());
      const entorno = pmrem.fromScene(escenaCielo, 0.02).texture;
      escena.environment = entorno;
      escena.environmentIntensity = 0.4;

      // ── luz ──
      const hemi = new THREE.HemisphereLight("#DDE5EE", "#7A8492", 0.55);
      escena.add(hemi);
      const sol = new THREE.DirectionalLight("#FFF6EC", 2.9);
      sol.position
        .copy(SOL_DIR)
        .multiplyScalar(30)
        .add(new THREE.Vector3(0, 3, 0));
      sol.target.position.set(0, 3, 0);
      sol.castShadow = true;
      sol.shadow.mapSize.set(tactil ? 1024 : 2048, tactil ? 1024 : 2048);
      const sc = sol.shadow.camera;
      sc.left = -7;
      sc.right = 7;
      sc.top = 7;
      sc.bottom = -7;
      sc.near = 10;
      sc.far = 60;
      sol.shadow.bias = -0.0004;
      sol.shadow.normalBias = 0.02;
      sol.shadow.radius = 3;
      escena.add(sol, sol.target);

      // ── el terreno: explanada nevada, montañas a los lados y un corredor libre para el vuelo ──
      const sx = new SimplexNoise({ random: azar(11) });
      const fbm = (x: number, z: number, oct: number) => {
        let s = 0;
        let a = 0.5;
        let f = 1;
        for (let i = 0; i < oct; i++) {
          s += a * sx.noise(x * f, z * f);
          f *= 2.03;
          a *= 0.5;
        }
        return s;
      };
      const crestas = (x: number, z: number) => {
        let s = 0;
        let a = 0.6;
        let f = 1;
        for (let i = 0; i < 4; i++) {
          const n = 1 - Math.abs(sx.noise(x * f, z * f));
          s += n * n * a;
          f *= 2.1;
          a *= 0.48;
        }
        return s;
      };
      const altura = (x: number, z: number) => {
        const r = Math.hypot(x, z);
        let h =
          fbm(x * 0.02, z * 0.02, 3) * 2.2 + fbm(x * 0.11, z * 0.11, 3) * 0.5;
        const corredor = suave01(2, -8, z) * suave01(-150, -128, z);
        const lados = 1 - corredor + corredor * suave01(30, 105, Math.abs(x));
        h += crestas(x * 0.0075, z * 0.0075) * 46 * suave01(24, 150, r) * lados;
        const explanada = 1 - suave01(4.4, 9.5, r);
        return (
          h * (1 - explanada) +
          (BASE_Y + fbm(x * 0.7, z * 0.7, 2) * 0.05) * explanada
        );
      };
      const TAM = 560;
      const SEG = tactil ? 220 : 320;
      const geoT = new THREE.PlaneGeometry(TAM, TAM, SEG, SEG);
      geoT.rotateX(-Math.PI / 2);
      geoT.translate(0, 0, -70);
      const pT = geoT.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pT.count; i++)
        pT.setY(i, altura(pT.getX(i), pT.getZ(i)));
      geoT.computeVertexNormals();
      const nT = geoT.attributes.normal as THREE.BufferAttribute;
      const colT = new Float32Array(pT.count * 3);
      const roca = new THREE.Color("#6C7583");
      const rocaOsc = new THREE.Color("#4A525E");
      const nieve = new THREE.Color("#D3D9E1");
      const tmp = new THREE.Color();
      for (let i = 0; i < pT.count; i++) {
        const y = pT.getY(i);
        const ny = nT.getY(i);
        const x = pT.getX(i);
        const z = pT.getZ(i);
        const var1 = fbm(x * 0.09, z * 0.09, 2) * 0.5 + 0.5;
        tmp.copy(rocaOsc).lerp(roca, var1);
        // nieve donde es plano, y más arriba aunque sea empinado
        // manchas de roca que asoman entre la nieve (sin oscuros la imagen quedaba plana: contraste 0,09)
        const manchas = suave01(
          0.15,
          0.45,
          fbm(x * 0.045 + 7, z * 0.045, 3) + 0.1
        );
        const n =
          suave01(0.7, 0.92, ny + y * 0.003 + (var1 - 0.5) * 0.3) *
          (1 - manchas * 0.85);
        tmp.lerp(nieve, n);
        colT.set([tmp.r, tmp.g, tmp.b], i * 3);
      }
      geoT.setAttribute("color", new THREE.BufferAttribute(colT, 3));
      const texRoca = texNormal.clone();
      texRoca.repeat.set(90, 90);
      texRoca.needsUpdate = true;
      const terreno = new THREE.Mesh(
        geoT,
        new THREE.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.96,
          normalMap: texRoca,
          normalScale: new THREE.Vector2(0.9, 0.9),
        })
      );
      terreno.receiveShadow = true;
      escena.add(terreno);

      // ── la obra: ladrillos, la luz de dentro y el respaldo ──
      const polys = poligonos(false);
      const texCeramica = texAlto.clone();
      texCeramica.repeat.set(1.3, 1.3);
      texCeramica.needsUpdate = true;
      const matLadrillo = new THREE.MeshStandardMaterial({
        color: "#D3D9E1",
        roughness: 0.84,
        bumpMap: texCeramica,
        bumpScale: 2.2,
        roughnessMap: texCeramica,
      });
      const matRespaldo = new THREE.MeshStandardMaterial({
        color: "#7F8996",
        roughness: 0.9,
      });
      type Estado = {
        casa: THREE.Vector3;
        z: number;
        vz: number;
        dx: number;
        dy: number;
        vdx: number;
        vdy: number;
        malla: THREE.InstancedMesh;
        idx: number;
        retraso: number;
        oficio: string;
        arriba: boolean;
      };
      const ladrillos: Estado[] = [];
      const mallas: THREE.InstancedMesh[] = [];
      const luzU = {
        uGolpe: { value: new THREE.Vector2(99, 99) },
        uFuerza: { value: 0 },
        uCam: { value: new THREE.Vector2(99, 99) },
        uCerca: { value: 0 },
        uBase: { value: 0.3 },
        uColor: { value: AZUL },
      };
      const matLuz = new THREE.ShaderMaterial({
        vertexShader: LUZ_VS,
        fragmentShader: LUZ_FS,
        uniforms: luzU,
        side: THREE.DoubleSide,
      });
      const zMedio = Z_FRENTE - PROF / 2;
      const zLuz = Z_FRENTE - PROF - 0.015; // entre el dorso de los ladrillos y el respaldo
      const luzPos: number[] = [];
      const respaldos: THREE.Mesh[] = [];
      let contador = 0;
      polys.forEach((poly) => {
        const { lista, u, v, LU, LV } = aparejar(poly);
        const enteros = lista.filter((l) => !l.medio);
        const medios = lista.filter((l) => l.medio);
        for (const [grupo, largo] of [
          [enteros, LU],
          [medios, LU / 2],
        ] as const) {
          if (!grupo.length) continue;
          const m = new THREE.InstancedMesh(
            geoLadrillo(u, v, largo, LV),
            matLadrillo,
            grupo.length
          );
          m.castShadow = true;
          m.receiveShadow = true;
          m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
          grupo.forEach((l, i) => {
            const k = 0.94 + rnd() * 0.1;
            m.setColorAt(i, new THREE.Color(k, k, k * (1 + rnd() * 0.02)));
            ladrillos.push({
              casa: new THREE.Vector3(l.c.x, l.c.y, zMedio),
              z: 0,
              vz: 0,
              dx: 0,
              dy: 0,
              vdx: 0,
              vdy: 0,
              malla: m,
              idx: i,
              retraso: 0,
              oficio: OFICIOS[contador % OFICIOS.length] as string,
              arriba: false,
            });
            contador++;
          });
          mallas.push(m);
          escena.add(m);
        }
        // la luz de dentro: solo bajo cada ladrillo (se ve por las juntas y al saltar). Con la
        // silueta entera de la pieza, los bordes sin ladrillo quedaban como un relleno azul plano
        for (const l of lista) {
          const a = ((l.medio ? LU / 2 : LU) / 2) * 0.9;
          const b = (LV / 2) * 0.9;
          const P = (s: number, t: number) => [
            l.c.x + s * u.x + t * v.x,
            l.c.y + s * u.y + t * v.y,
            zLuz,
          ];
          luzPos.push(
            ...P(-a, -b),
            ...P(a, -b),
            ...P(a, b),
            ...P(-a, -b),
            ...P(a, b),
            ...P(-a, b)
          );
        }
        // el respaldo: la silueta de la pieza en cerámica, justo detrás de los ladrillos
        const forma = new THREE.Shape(
          poly.map((p) => new THREE.Vector2(p.x, p.y))
        );
        const resp = new THREE.Mesh(
          new THREE.ExtrudeGeometry(forma, {
            depth: 0.5,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.03,
            bevelOffset: -0.03,
            bevelSegments: 2,
          }),
          matRespaldo
        );
        // la extrusión va de −0,03 a 0,53: su cara de delante queda a 3 cm de los ladrillos
        resp.position.z = Z_FRENTE - PROF - 0.03 - 0.53;
        resp.castShadow = true;
        resp.receiveShadow = true;
        respaldos.push(resp);
        escena.add(resp);
      });
      const geoLuz = new THREE.BufferGeometry();
      geoLuz.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(luzPos, 3)
      );
      const luz = new THREE.Mesh(geoLuz, matLuz);
      escena.add(luz);
      // la obra se levanta de abajo hacia arriba
      const yMin = Math.min(...ladrillos.map((l) => l.casa.y));
      const yMax = Math.max(...ladrillos.map((l) => l.casa.y));
      for (const l of ladrillos)
        l.retraso = ((l.casa.y - yMin) / (yMax - yMin)) * 1.0 + rnd() * 0.25;

      // ── el plano: líneas de construcción ──
      const lineas: number[] = [];
      const ts: number[] = [];
      const ordenes: number[] = [];
      const seg = (a: V2, b: V2, z: number, orden: number) => {
        lineas.push(a.x, a.y, z, b.x, b.y, z);
        ts.push(0, 1);
        ordenes.push(orden, orden);
      };
      polys.forEach((poly, k) => {
        let largo = 0;
        const total = poly.reduce(
          (s, p, i) =>
            s +
            Math.hypot(
              (poly[(i + 1) % poly.length] as V2).x - p.x,
              (poly[(i + 1) % poly.length] as V2).y - p.y
            ),
          0
        );
        poly.forEach((p, i) => {
          const q = poly[(i + 1) % poly.length] as V2;
          const l = Math.hypot(q.x - p.x, q.y - p.y);
          // cada borde se dibuja en su turno a lo largo del perímetro
          lineas.push(p.x, p.y, Z_FRENTE + 0.01, q.x, q.y, Z_FRENTE + 0.01);
          ts.push(largo / total, (largo + l) / total);
          ordenes.push(k * 0.15, k * 0.15);
          largo += l;
        });
      });
      // guías: las tres direcciones del isotipo por los vértices del triángulo, y el suelo
      for (const [i, v] of TRIANGULO_PNG.entries()) {
        const p = aMundo(v);
        for (const ang of [0, Math.PI / 3, (2 * Math.PI) / 3]) {
          const d = { x: Math.cos(ang) * 16, y: Math.sin(ang) * 16 };
          seg(
            { x: p.x - d.x, y: p.y - d.y },
            { x: p.x + d.x, y: p.y + d.y },
            Z_FRENTE + 0.02,
            0.35 + i * 0.12
          );
        }
      }
      seg({ x: -18, y: BASE_Y }, { x: 18, y: BASE_Y }, Z_FRENTE + 0.02, 0.2);
      const geoL = new THREE.BufferGeometry();
      geoL.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(lineas, 3)
      );
      geoL.setAttribute("aT", new THREE.Float32BufferAttribute(ts, 1));
      geoL.setAttribute("aOrden", new THREE.Float32BufferAttribute(ordenes, 1));
      const lineasU = {
        uDibujo: { value: 0 },
        uOpac: { value: 0.7 },
        uColor: { value: new THREE.Color("#1B2A4A") },
        uCentro: {
          value: new THREE.Vector2(0, BASE_Y + ISOTIPO.alto * S * 0.5),
        },
      };
      const plano = new THREE.LineSegments(
        geoL,
        new THREE.ShaderMaterial({
          vertexShader: LINEAS_VS,
          fragmentShader: LINEAS_FS,
          uniforms: lineasU,
          transparent: true,
          depthWrite: false,
        })
      );
      plano.renderOrder = 5;
      escena.add(plano);

      // ── el manto de nubes: tres capas finas, cruzadas por la cámara ──
      const capas: { tiempo: { value: number }; m: THREE.Mesh }[] = [];
      for (const [i, y] of [12.6, 13.4, 14.2, 15].entries()) {
        if (tactil && i % 2 === 1) continue;
        const u = {
          tRuido: { value: texAlto },
          uTiempo: { value: 0 },
          uSemilla: { value: i * 0.31 },
          uY: { value: y },
          uLuz: { value: new THREE.Color("#F3F5F8") },
          uSombra: { value: new THREE.Color("#B4BECB") },
          uHorizonte: { value: HORIZONTE },
        };
        const m = new THREE.Mesh(
          new THREE.PlaneGeometry(900, 700),
          new THREE.ShaderMaterial({
            vertexShader: NUBES_VS,
            fragmentShader: NUBES_FS,
            uniforms: u,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
          })
        );
        m.rotation.x = -Math.PI / 2;
        m.position.set(0, y, -360);
        m.renderOrder = 2;
        capas.push({ tiempo: u.uTiempo, m });
        escena.add(m);
      }

      // ── copos: polvo de nieve con viento alrededor de la obra ──
      const NC = tactil ? 500 : 1200;
      const pc = new Float32Array(NC * 3);
      const rc = new Float32Array(NC * 3);
      for (let i = 0; i < NC; i++) {
        pc.set([rnd() * 60 - 30, rnd() * 14, rnd() * 34 - 14], i * 3);
        rc.set([rnd(), rnd(), rnd()], i * 3);
      }
      const geoC = new THREE.BufferGeometry();
      geoC.setAttribute("position", new THREE.BufferAttribute(pc, 3));
      geoC.setAttribute("aRand", new THREE.BufferAttribute(rc, 3));
      const coposU = { uTiempo: { value: 0 }, uEscala: { value: 18 * dpr } };
      const copos = new THREE.Points(
        geoC,
        new THREE.ShaderMaterial({
          vertexShader: COPOS_VS,
          fragmentShader: COPOS_FS,
          uniforms: coposU,
          transparent: true,
          depthWrite: false,
        })
      );
      copos.frustumCulled = false;
      escena.add(copos);

      // ── bloques de hielo con proyectos congelados ──
      const cargador = new THREE.TextureLoader();
      let cargadas = 0;
      const texRugoso = texAlto.clone();
      texRugoso.repeat.set(1.6, 1.6);
      texRugoso.needsUpdate = true;
      const matHielo = new THREE.MeshPhysicalMaterial({
        color: "#F4F8FC",
        roughness: 0.16,
        roughnessMap: texRugoso,
        transmission: 1,
        thickness: 0.7,
        ior: 1.31,
        attenuationColor: new THREE.Color("#B5DDF3"),
        attenuationDistance: 3.2,
        specularIntensity: 1,
      });
      const geoHielo = new RoundedBoxGeometry(3.4, 2.4, 0.6, 4, 0.14);
      const geoFoto = new THREE.PlaneGeometry(3.0, 2.0);
      // se asigna más abajo, cuando existe el composer (las fotos llegan después: siempre asíncrono)
      let calentar = () => {};
      const texturas: THREE.Texture[] = [];
      const monolitos = MONOLITOS.map((m, i) => {
        const g = new THREE.Group();
        g.position.set(...m.pos);
        g.lookAt(new THREE.Vector3(...m.cam));
        const contar = () => {
          cargadas++;
          estado.cargado = cargadas / MONOLITOS.length;
          if (cargadas === MONOLITOS.length) calentar();
          emitir();
        };
        // si una foto falla, la obra arranca igual (el bloque queda vacío)
        const tex = cargador.load(
          `/laboratorio/obra/${m.img}.jpg`,
          contar,
          undefined,
          contar
        );
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        texturas.push(tex);
        const foto = new THREE.Mesh(
          geoFoto,
          new THREE.MeshBasicMaterial({ map: tex })
        );
        const hielo = new THREE.Mesh(geoHielo, matHielo);
        g.add(foto, hielo);
        escena.add(g);
        return {
          g,
          base: g.position.clone(),
          fase: i * 1.7,
          rot: g.rotation.clone(),
        };
      });

      // ── el final: el isotipo se vuelve a armar, ahora en ladrillos de hielo, alrededor de un
      // núcleo de luz. (Primera versión: 1 600 esquirlas diminutas → se leía como espuma, no como el
      // isotipo, y flotaban delante de los últimos proyectos como bolas de nieve.)
      const polysC = poligonos(true);
      const matHieloL = new THREE.MeshPhysicalMaterial({
        color: "#EEF5FB",
        roughness: 0.22,
        roughnessMap: texRugoso,
        transmission: 1,
        thickness: 0.42,
        ior: 1.31,
        attenuationColor: new THREE.Color("#9FD3F0"),
        attenuationDistance: 1.4,
        specularIntensity: 1,
      });
      type Bloque = {
        casa: THREE.Vector3;
        lejos: THREE.Vector3;
        eje: THREE.Vector3;
        giro: number;
        retraso: number;
        malla: THREE.InstancedMesh;
        idx: number;
      };
      const bloques: Bloque[] = [];
      const mallasP: THREE.InstancedMesh[] = [];
      for (const poly of polysC) {
        const { lista, u, v, LU, LV } = aparejar(poly);
        for (const [grupo, largo] of [
          [lista.filter((l) => !l.medio), LU],
          [lista.filter((l) => l.medio), LU / 2],
        ] as const) {
          if (!grupo.length) continue;
          const m = new THREE.InstancedMesh(
            geoLadrillo(u, v, largo, LV),
            matHieloL,
            grupo.length
          );
          m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
          m.frustumCulled = false;
          grupo.forEach((l, i) => {
            const casa = new THREE.Vector3(
              PORTAL.x + l.c.x,
              PORTAL.y + l.c.y,
              PORTAL.z
            );
            const dir = new THREE.Vector3(
              rnd() - 0.5,
              rnd() - 0.5,
              rnd() * 0.6
            ).normalize();
            bloques.push({
              casa,
              lejos: casa.clone().addScaledVector(dir, 4 + rnd() * 9),
              eje: new THREE.Vector3(
                rnd() - 0.5,
                rnd() - 0.5,
                rnd() - 0.5
              ).normalize(),
              giro: (rnd() - 0.5) * 7,
              retraso: rnd() * 0.4,
              malla: m,
              idx: i,
            });
          });
          mallasP.push(m);
          escena.add(m);
        }
      }
      const nucleoPos = new THREE.Vector3(
        PORTAL.x + HUECO_C.x,
        PORTAL.y + HUECO_C.y,
        PORTAL.z
      );
      const NN = tactil ? 2000 : 4500;
      const rn = new Float32Array(NN * 4);
      for (let i = 0; i < NN; i++)
        rn.set([Math.sqrt(rnd()), rnd(), rnd(), rnd()], i * 4);
      const geoN = new THREE.BufferGeometry();
      geoN.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(NN * 3), 3)
      );
      geoN.setAttribute("aRand", new THREE.BufferAttribute(rn, 4));
      const nucU = {
        uTiempo: { value: 0 },
        uArmado: { value: 0 },
        uEscala: { value: 22 * dpr },
      };
      const nucleo = new THREE.Points(
        geoN,
        new THREE.ShaderMaterial({
          vertexShader: NUCLEO_VS,
          fragmentShader: NUCLEO_FS,
          uniforms: nucU,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      nucleo.position.copy(nucleoPos);
      nucleo.frustumCulled = false;
      escena.add(nucleo);
      const haloU = { uArmado: { value: 0 } };
      const halo = new THREE.Mesh(
        new THREE.PlaneGeometry(7, 7),
        new THREE.ShaderMaterial({
          vertexShader: UV_VS,
          fragmentShader: HALO_FS,
          uniforms: haloU,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      halo.position.copy(nucleoPos).add(new THREE.Vector3(0, 0, -0.4));
      escena.add(halo);

      // ── postproceso ──
      const rt = new THREE.WebGLRenderTarget(2, 2, {
        type: THREE.HalfFloatType,
        samples: tactil || dpr >= 1.5 ? 0 : 4,
      });
      const composer = new EffectComposer(renderer, rt);
      composer.setPixelRatio(dpr);
      composer.addPass(new RenderPass(escena, camara));
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(2, 2),
        0.42,
        0.55,
        0.9
      );
      composer.addPass(bloom);
      composer.addPass(new OutputPass());
      const finalU = {
        tDiffuse: { value: null as THREE.Texture | null },
        tRuido: { value: texAlto },
        uTiempo: { value: 0 },
        uGrano: { value: 0.035 },
        uAberr: { value: 0.001 },
        uBlanco: { value: 0 },
        uVineta: { value: 0.42 },
        uRes: { value: new THREE.Vector2(1, 1) },
        uNube: { value: new THREE.Vector3(0.93, 0.945, 0.96) },
      };
      const final = new ShaderPass({
        uniforms: finalU,
        vertexShader: QUAD_VS,
        fragmentShader: FINAL_FS,
      });
      composer.addPass(final);
      // ShaderPass clona los uniforms: se escriben los del pase, no los del objeto de arriba
      const uf = final.uniforms as unknown as typeof finalU;

      // ── calentar: compilar todo y subir las texturas detrás de la pantalla de carga ──
      // Medido (2026-10-16, DPR 2): sin esto el primer bloque de hielo congelaba 583 ms y el cruce de
      // nubes 183 ms, porque el navegador compilaba el vidrio y subía las portadas en ese instante.
      calentar = () => {
        const ocultos: THREE.Object3D[] = [];
        escena.traverse((o) => {
          if (!o.visible) {
            ocultos.push(o);
            o.visible = true;
          }
        });
        for (const t of texturas) renderer.initTexture(t);
        renderer
          .compileAsync(escena, camara)
          .catch(() => {})
          .finally(() => {
            // un cuadro desde cada vista con algo nuevo: crea el destino de la transmisión, el de
            // las sombras y los mipmaps del bloom antes de que el usuario llegue ahí
            const p0 = camara.position.clone();
            const q0 = camara.quaternion.clone();
            const m0 = MONOLITOS[0] as (typeof MONOLITOS)[number];
            const vistas: [number, number, number][][] = [
              [m0.cam, m0.pos],
              [
                [0, 13.9, -16],
                [0, 17, -28],
              ],
              [
                [0, 24.2, -96],
                [0, 22.7, -112],
              ],
            ];
            for (const [pv, mv] of vistas) {
              camara.position.set(...(pv as [number, number, number]));
              camara.lookAt(...(mv as [number, number, number]));
              composer.render(0);
            }
            camara.position.copy(p0);
            camara.quaternion.copy(q0);
            for (const o of ocultos) o.visible = false;
            estado.listo = true;
            emitir();
          });
      };

      // el largo del scroll se mide al cambiar de tamaño, no en cada cuadro (leer scrollHeight justo
      // después de escribir estilos obliga al navegador a recalcular el layout)
      let maxScroll = 1;
      const medirScroll = () => {
        maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      };
      medirScroll();
      const roDoc = new ResizeObserver(medirScroll);
      roDoc.observe(document.body);
      // en desarrollo, la sonda de fluidez lee programas y texturas para atribuir cada tirón
      if (process.env.NODE_ENV !== "production")
        Object.assign(window, { __obra: { renderer } });
      // las sombras solo se recalculan cerca de la obra (lo único que proyecta)
      renderer.shadowMap.autoUpdate = false;
      // resolución adaptable: si los cuadros pasan de ~21 ms, se baja el DPR de a 0,25 (techo: el inicial)
      let dprActual = dpr;
      let acumT = 0;
      let acumN = 0;
      let ultimoAjuste = performance.now();

      // ── estado por cuadro ──
      const recorrido = crearRecorrido(PLANOS);
      const pos = new THREE.Vector3();
      const mira = new THREE.Vector3();
      const rayo = new THREE.Raycaster();
      const planoFrente = new THREE.Plane(
        new THREE.Vector3(0, 0, 1),
        -Z_FRENTE
      );
      const golpe = new THREE.Vector3();
      const ndc = new THREE.Vector2();
      const m4 = new THREE.Matrix4();
      const q = new THREE.Quaternion();
      const ejeG = new THREE.Vector3();
      const unos = new THREE.Vector3(1, 1, 1);
      const p3 = new THREE.Vector3();
      const proy = new THREE.Vector3();
      const suave = { x: 0, y: 0 };
      let prog = 0;
      let progPrevio = 0;
      let vel = 0;
      let tIntro = 0;
      let ultimoGolpe = 0;
      let ultimaEmision = 0;
      let cuadros = 0;
      let ancho = 1;
      let alto = 1;
      let ultimoTexto = -1;
      let tReal = performance.now();

      return {
        medir: (w, h) => {
          ancho = w;
          alto = h;
          camara.aspect = w / h;
          camara.updateProjectionMatrix();
          composer.setSize(w, h);
          bloom.setSize(w * dprActual * 0.5, h * dprActual * 0.5); // bloom a media resolución
          uf.uRes.value.set(w * dprActual, h * dprActual);
        },
        cuadro: (dt, t) => {
          const ahora = performance.now();
          const dtReal = Math.min(0.05, (ahora - tReal) / 1000);
          tReal = ahora;
          if (estado.listo) tIntro += quieto ? 10 : dt;

          // scroll → progreso suavizado (sin librería: un amortiguador exponencial)
          if (estado.listo && tIntro > 3 && dt > 0) {
            acumT += dtReal;
            acumN++;
            if (ahora - ultimoAjuste > 1500 && acumN > 30) {
              const media = (acumT / acumN) * 1000;
              let nuevo = dprActual;
              if (media > 21 && dprActual > 1)
                nuevo = Math.max(1, dprActual - 0.25);
              else if (media < 12.5 && dprActual < dpr)
                nuevo = Math.min(dpr, dprActual + 0.25);
              if (nuevo !== dprActual) {
                dprActual = nuevo;
                renderer.setPixelRatio(nuevo);
                renderer.setSize(ancho, alto, false);
                composer.setPixelRatio(nuevo);
                composer.setSize(ancho, alto);
                bloom.setSize(ancho * nuevo * 0.5, alto * nuevo * 0.5);
                uf.uRes.value.set(ancho * nuevo, alto * nuevo);
              }
              acumT = 0;
              acumN = 0;
              ultimoAjuste = ahora;
            }
          }
          const objetivo = maxScroll > 0 ? window.scrollY / maxScroll : 0;
          prog = quieto
            ? objetivo
            : prog + (objetivo - prog) * (1 - Math.exp(-dtReal * 5));
          vel +=
            (Math.abs(prog - progPrevio) / Math.max(dtReal, 1 / 240) - vel) *
            0.15;
          progPrevio = prog;
          const velN = Math.min(1, vel * 9);
          if (dom.barra) dom.barra.style.transform = `scaleY(${prog})`;

          const r = recorrido.evaluar(prog, pos, mira);
          // en la obra, un poco de paralaje con el puntero
          suave.x += (puntero.x - suave.x) * 0.04;
          suave.y += (puntero.y - suave.y) * 0.04;
          const enObra = r.plano <= 1 ? 1 : 0;
          pos.x += suave.x * 0.35 * enObra;
          pos.y += suave.y * 0.2 * enObra;
          // en vertical: lente más abierta (el ancho manda) y la obra un poco más arriba (el texto va abajo)
          const aspecto = ancho / alto;
          const vertical = aspecto < 1;
          if (vertical) {
            mira.y -= 1.3 * (r.plano <= 1 ? 1 : 0.4);
            // el encuadre de lado (texto a un costado) en vertical saca la obra del cuadro: al centro
            if (r.plano <= 1) mira.x *= 0.15;
          }
          camara.position.copy(pos);
          camara.lookAt(mira);
          const fov = vertical
            ? Math.min(
                72,
                THREE.MathUtils.radToDeg(
                  2 *
                    Math.atan(
                      Math.tan(THREE.MathUtils.degToRad(r.fov / 2)) / aspecto
                    )
                )
              )
            : r.fov;
          if (Math.abs(camara.fov - fov) > 0.01) {
            camara.fov = fov;
            camara.updateProjectionMatrix();
          }

          // textos: la escena fija opacidad y desplazamiento (sin React por cuadro)
          dom.textos.forEach((tx, i) => {
            const o = i === r.texto ? r.opacidad : 0;
            const actual = Number(tx.dataset.o ?? "0");
            if (Math.abs(actual - o) > 0.004) {
              tx.style.opacity = o.toFixed(3);
              tx.style.transform = `translateY(${((1 - o) * 14).toFixed(1)}px)`;
              tx.style.pointerEvents = o > 0.5 ? "auto" : "none";
              tx.dataset.o = o.toFixed(3);
            }
          });
          const textoVisible = r.opacidad > 0.5 ? r.texto : -1;
          if (textoVisible !== ultimoTexto) {
            ultimoTexto = textoVisible;
            estado.texto = textoVisible;
            estado.plano = r.plano;
            emitir();
            if (textoVisible >= 0) oyente.actual?.llegada(textoVisible);
          }

          // el plano y la niebla de la entrada
          const dib = suave01(0, 1.5, tIntro);
          lineasU.uDibujo.value = dib;
          lineasU.uOpac.value = 0.7 * (1 - suave01(2.4, 3.8, tIntro));
          plano.visible = lineasU.uOpac.value > 0.005;
          const nieblaIntro = 1 - suave01(1.6, 4.2, tIntro);
          const nieblaAltura = suave01(12, 20, pos.y);
          (escena.fog as THREE.FogExp2).density =
            THREE.MathUtils.lerp(0.0105, 0.02, nieblaAltura) +
            nieblaIntro * 0.05;

          // ── los ladrillos ──
          rayo.setFromCamera(ndc.set(puntero.x, puntero.y), camara);
          const hayGolpe =
            enObra === 1 &&
            puntero.dentro &&
            estado.listo &&
            tIntro > 2.6 &&
            !!rayo.ray.intersectPlane(planoFrente, golpe);
          luzU.uGolpe.value.set(
            hayGolpe ? golpe.x : 99,
            hayGolpe ? golpe.y : 99
          );
          // la cámara cerca del muro abre los ladrillos alrededor de su paso
          const cerca = 1 - suave01(0.6, 5.5, Math.abs(pos.z - zMedio));
          luzU.uCam.value.set(pos.x, pos.y);
          luzU.uCerca.value = cerca;
          let fuerza = 0;
          const k = 140;
          const amort = 15;
          const h = Math.min(dtReal, 1 / 30);
          const arriba: Estado[] = [];
          for (const l of ladrillos) {
            const ki = suave01(0.9 + l.retraso, 1.75 + l.retraso, tIntro);
            let tz = 0;
            let tdx = 0;
            let tdy = 0;
            if (hayGolpe) {
              const d = Math.hypot(l.casa.x - golpe.x, l.casa.y - golpe.y);
              tz = suave01(1.7, 0.2, d) * (puntero.abajo ? 0.85 : 0.6);
            }
            if (cerca > 0) {
              const ddx = l.casa.x - pos.x;
              const ddy = l.casa.y - pos.y;
              const d = Math.hypot(ddx, ddy) || 1;
              const e = cerca * suave01(2.8, 0.55, d);
              tdx = (ddx / d) * e * 1.1;
              tdy = (ddy / d) * e * 1.1;
              tz += e * 0.5;
            }
            l.vz += ((tz - l.z) * k - l.vz * amort) * h;
            l.z += l.vz * h;
            l.vdx += ((tdx - l.dx) * k - l.vdx * amort) * h;
            l.dx += l.vdx * h;
            l.vdy += ((tdy - l.dy) * k - l.vdy * amort) * h;
            l.dy += l.vdy * h;
            fuerza = Math.max(fuerza, l.z);
            const subio = l.z > 0.26;
            if (subio && !l.arriba && ahora - ultimoGolpe > 70) {
              ultimoGolpe = ahora;
              oyente.actual?.golpe();
            }
            l.arriba = subio;
            if (subio) arriba.push(l);
            // entrada: desde delante y arriba, girando hacia su sitio
            const ent = 1 - (1 - ki) ** 3;
            p3.set(
              l.casa.x + l.dx,
              l.casa.y + l.dy + (1 - ent) * 1.4,
              l.casa.z + l.z + (1 - ent) * 3.2
            );
            const giro =
              l.z * 0.55 + Math.hypot(l.dx, l.dy) * 0.6 + (1 - ent) * 1.2;
            if (hayGolpe)
              ejeG.set(-(l.casa.y - golpe.y), l.casa.x - golpe.x, 0);
            else ejeG.set(-(l.casa.y - pos.y), l.casa.x - pos.x, 0.3);
            if (ejeG.lengthSq() < 1e-6) ejeG.set(1, 0, 0);
            q.setFromAxisAngle(ejeG.normalize(), giro);
            const esc = ki <= 0 ? 0.0001 : 0.75 + 0.25 * ent;
            m4.compose(p3, q, unos.set(esc, esc, esc));
            l.malla.setMatrixAt(l.idx, m4);
          }
          for (const m of mallas) m.instanceMatrix.needsUpdate = true;
          luzU.uFuerza.value = hayGolpe ? Math.min(1, fuerza * 1.6) : 0;
          luzU.uBase.value = 0.22;
          const crece = Math.max(0.001, suave01(0.6, 1.3, tIntro));
          for (const r of respaldos) r.scale.z = crece;

          // etiquetas de oficio en los tres ladrillos que más salieron
          arriba.sort((a, b) => b.z - a.z);
          const elegidos: { l: Estado; x: number; y: number }[] = [];
          for (const l of arriba) {
            if (elegidos.length === dom.etiquetas.length) break;
            proy
              .set(l.casa.x + l.dx, l.casa.y + l.dy, l.casa.z + l.z + PROF / 2)
              .project(camara);
            const x = (proy.x * 0.5 + 0.5) * ancho;
            const y = (-proy.y * 0.5 + 0.5) * alto;
            if (elegidos.every((e) => Math.hypot(e.x - x, e.y - y) > 70))
              elegidos.push({ l, x, y });
          }
          dom.etiquetas.forEach((et, i) => {
            const e = elegidos[i];
            if (!e) {
              if (et.style.opacity !== "0") et.style.opacity = "0";
              return;
            }
            const { l, x, y } = e;
            et.style.transform = `translate(${x.toFixed(0)}px, ${y.toFixed(0)}px)`;
            et.style.opacity = String(Math.min(1, (l.z - 0.26) * 6));
            const txt = `${String(l.idx + 1).padStart(2, "0")} · ${l.oficio}`;
            if (et.textContent !== txt) et.textContent = txt;
          });

          // ── lo demás ──
          for (const c of capas) {
            c.tiempo.value = t;
            c.m.visible = pos.z < 4; // desde la obra no se ven: no se dibujan
          }
          renderer.shadowMap.needsUpdate = pos.z > -6;
          coposU.uTiempo.value = t;
          for (const m of monolitos) {
            const delante = pos.z - m.base.z;
            const e = suave01(20, 12, delante) * suave01(-9, -3, delante);
            m.g.visible = e > 0.001;
            m.g.scale.setScalar(0.6 + 0.4 * e);
            m.g.position.y =
              m.base.y + Math.sin(t * 0.5 + m.fase) * 0.12 - (1 - e) * 1.5;
            m.g.rotation.z = m.rot.z + Math.sin(t * 0.3 + m.fase) * 0.03;
          }
          // el final: los bloques de hielo vuelan a su sitio con el scroll
          const armado = suave01(-80, -95, pos.z);
          const verPortal = pos.z < -80; // después de la pausa de LumioLearn (cámara en −74,5)
          for (const m of mallasP) m.visible = verPortal;
          if (verPortal) {
            for (const b of bloques) {
              const kb = Math.min(1, Math.max(0, (armado - b.retraso) / 0.6));
              const e = 1 - (1 - kb) ** 3;
              p3.copy(b.lejos).lerp(b.casa, e);
              p3.y += Math.sin(t * 0.4 + b.giro) * 0.25 * (1 - e);
              q.setFromAxisAngle(b.eje, (b.giro + t * 0.15) * (1 - e));
              m4.compose(p3, q, unos.set(1, 1, 1));
              b.malla.setMatrixAt(b.idx, m4);
            }
            for (const m of mallasP) m.instanceMatrix.needsUpdate = true;
          }
          nucU.uArmado.value = suave01(0.55, 1, armado);
          nucU.uTiempo.value = t;
          haloU.uArmado.value = suave01(0.7, 1, armado) * 0.6;
          nucleo.visible = halo.visible = armado > 0.3;

          // postproceso: nube al cruzar, aberración con la velocidad
          uf.uTiempo.value = t;
          uf.uBlanco.value = 1 - suave01(0.4, 2.8, Math.abs(pos.y - 13.8));
          uf.uAberr.value = 0.0008 + velN * 0.0065;
          oyente.actual?.velocidad(velN);

          composer.render(dt);

          cuadros++;
          if (ahora - ultimaEmision > 500) {
            estado.fps = Math.round((cuadros * 1000) / (ahora - ultimaEmision));
            estado.llamadas = renderer.info.render.calls;
            cuadros = 0;
            ultimaEmision = ahora;
            emitir();
          }
        },
        liberar: () => {
          liberarEscena(escena);
          roDoc.disconnect();
          entorno.dispose();
          pmrem.dispose();
          rt.dispose();
          composer.dispose();
          texAlto.dispose();
          texNormal.dispose();
        },
      };
    },
    undefined,
    { antialias: false, dprMax: tactilDpr() }
  );
}

function tactilDpr() {
  return typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
    ? 1.25
    : 1.5;
}
