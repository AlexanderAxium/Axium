// Laboratorio 3D · tres mundos (2026-10-16). Cada pieza del isotipo es una VENTANA a un mundo con su
// propio aspecto: Diseño (taller pastel de día), Software (ciudad de noche con ventanas encendidas) e
// IA (una red neuronal con pulsos). La técnica (ANIMACION.md § 6, «portales»):
//   · cada mundo es su propia escena, dibujada con la MISMA cámara en un render target; la cara de la
//     pieza lo muestra en coordenadas de pantalla (gl_FragCoord / resolución) → la ventana tiene
//     paralaje real al mover el cursor
//   · al cruzar el plano de la ventana, la escena que se dibuja pasa a ser el mundo: sin corte, porque
//     la cámara y las coordenadas son las mismas
//   · entre un mundo y el siguiente, un corte de cine (fundido a negro corto): «entre espacios
//     distintos, corte; no un vuelo forzado» (Forged)
//   · solo se dibujan los mundos cuya ventana está en cuadro; dentro de un mundo, solo ese mundo
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
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

export type EstadoPortales = {
  listo: boolean;
  fps: number;
  llamadas: number;
  /** largo del recorrido en unidades (el DOM lo usa para el alto del scroll) */
  total: number;
  /** ventana bajo el cursor en la portada (−1 ninguna) */
  ventana: number;
};

// ── el isotipo en metros: 6 m de ancho, de pie sobre el suelo, ventanas en z = 0 ──
const ANCHO = 6;
const S = ANCHO / ISOTIPO.ancho;
const NOMBRES = ["arriba", "izquierda", "abajo"] as const;
type V2 = { x: number; y: number };
const POLIS: V2[][] = NOMBRES.map((n) =>
  ISOTIPO.piezas[n].map(([x, y]) => ({
    x: (x - ISOTIPO.ancho / 2) * S,
    y: (ISOTIPO.alto - y) * S,
  }))
);
const centro = (p: V2[]) => ({
  x: p.reduce((s, q) => s + q.x, 0) / p.length,
  y: p.reduce((s, q) => s + q.y, 0) / p.length,
});
// orden de los mundos: 0 Diseño (pieza de arriba), 1 Software (izquierda), 2 IA (abajo)
const C = POLIS.map(centro) as [V2, V2, V2];
const [C0, C1, C2] = C;

// cuatro actos; dentro de cada acto la cámara es continua, entre actos hay corte
const ACTOS: Plano[][] = [
  [
    { pos: [0.3, 3.2, 16], mira: [0.3, 2.9, 0], fov: 38, pausa: 0.8, texto: 0 },
    {
      pos: [C0.x, C0.y + 0.1, 5.5],
      mira: [C0.x, C0.y + 0.05, -2],
      fov: 42,
      dura: 1.1,
    },
    {
      pos: [C0.x, C0.y, -1.5],
      mira: [C0.x + 0.2, C0.y + 0.2, -10],
      fov: 50,
      dura: 0.6,
      curva: CURVAS.lineal,
    },
    {
      pos: [C0.x + 1.6, C0.y + 1.6, -13],
      mira: [C0.x + 4, C0.y + 2.9, -26],
      fov: 46,
      dura: 1.2,
      pausa: 0.9,
      texto: 1,
    },
  ],
  [
    { pos: [-4.6, 2.2, 7.6], mira: [C1.x, C1.y, 0], fov: 40, pausa: 0.25 },
    {
      pos: [C1.x, C1.y + 0.05, 3.0],
      mira: [C1.x, C1.y, -4],
      fov: 46,
      dura: 0.9,
    },
    {
      pos: [C1.x, C1.y + 0.1, -1.5],
      mira: [C1.x - 0.4, C1.y + 1.2, -12],
      fov: 54,
      dura: 0.6,
      curva: CURVAS.lineal,
    },
    {
      pos: [C1.x - 1.4, 6.5, -16],
      mira: [C1.x - 4.4, 4, -40],
      fov: 50,
      dura: 1.2,
      pausa: 0.9,
      texto: 2,
    },
  ],
  [
    { pos: [3.9, 1.2, 6.6], mira: [C2.x, C2.y, 0], fov: 40, pausa: 0.25 },
    {
      pos: [C2.x + 0.05, C2.y + 0.05, 2.6],
      mira: [C2.x, C2.y, -4],
      fov: 46,
      dura: 0.9,
    },
    {
      pos: [C2.x, C2.y + 0.05, -1.5],
      mira: [C2.x, C2.y + 0.7, -12],
      fov: 54,
      dura: 0.6,
      curva: CURVAS.lineal,
    },
    {
      pos: [C2.x - 0.8, 1.0, -9.5],
      mira: [C2.x + 0.4, 0.7, -22],
      fov: 50,
      dura: 1.2,
      pausa: 0.9,
      texto: 3,
    },
  ],
  [
    { pos: [-1.0, 5.5, 22], mira: [0.3, 3.0, 0], fov: 34, pausa: 0.1 },
    {
      pos: [0.3, 3.8, 19],
      mira: [0.3, 1.1, 0],
      fov: 36,
      dura: 1.0,
      pausa: 1.0,
      texto: 4,
    },
  ],
];

// ── shaders ──
const PORTAL_VS = /* glsl */ `
  void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const PORTAL_FS = /* glsl */ `
  uniform sampler2D tMundo;
  uniform vec2 uRes;
  uniform float uBrillo;
  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    gl_FragColor = vec4(texture2D(tMundo, uv).rgb * uBrillo, 1.0);
  }
`;
const SUELO_VS = /* glsl */ `
  varying vec3 vMundo;
  void main() {
    vec4 m = modelMatrix * vec4(position, 1.0);
    vMundo = m.xyz;
    gl_Position = projectionMatrix * viewMatrix * m;
  }
`;
const SUELO_FS = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uLuz;
  uniform vec3 uFondo;
  uniform vec3 uLinea;
  uniform float uDensidad;
  varying vec3 vMundo;
  void main() {
    vec2 p = vMundo.xz;
    float r = length(p - vec2(0.0, -0.5));
    vec3 col = uColor + uLuz * exp(-r * r * 0.012);
    vec2 g = abs(fract(p * 0.5 - 0.5) - 0.5) / fwidth(p * 0.5);
    float l = 1.0 - min(min(g.x, g.y), 1.0);
    col += uLinea * l * exp(-r * 0.06);
    float d = length(vMundo - cameraPosition);
    col = mix(col, uFondo, 1.0 - exp(-pow(d * uDensidad, 2.0)));
    gl_FragColor = vec4(col, 1.0);
  }
`;
const CIUDAD_VS = /* glsl */ `
  attribute float aSemilla;
  varying vec3 vMundo;
  varying vec3 vNormal;
  varying float vSemilla;
  void main() {
    vec4 m = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vMundo = m.xyz;
    vNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);
    vSemilla = aSemilla;
    gl_Position = projectionMatrix * viewMatrix * m;
  }
`;
const CIUDAD_FS = /* glsl */ `
  uniform vec3 uCuerpo;
  uniform vec3 uCalida;
  uniform vec3 uFria;
  uniform vec3 uFondo;
  uniform float uDensidad;
  uniform float uTiempo;
  varying vec3 vMundo;
  varying vec3 vNormal;
  varying float vSemilla;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec3 n = normalize(vNormal);
    vec3 col = uCuerpo * (0.6 + 0.4 * max(n.y, 0.0));
    if (abs(n.y) < 0.5) {
      // fachada: rejilla de ventanas; algunas encendidas, cálidas o frías, y alguna que parpadea
      float u = abs(n.x) > 0.5 ? vMundo.z : vMundo.x;
      vec2 celda = floor(vec2(u * 1.3, vMundo.y * 1.7));
      vec2 f = fract(vec2(u * 1.3, vMundo.y * 1.7));
      float hueco = step(0.22, f.x) * step(f.x, 0.82) * step(0.25, f.y) * step(f.y, 0.8);
      float h = hash(celda + vSemilla * 37.0);
      float encendida = step(0.58, h) * (0.85 + 0.15 * sin(uTiempo * (1.0 + h * 3.0) + h * 40.0));
      vec3 luz = mix(uCalida, uFria, step(0.82, h));
      col += hueco * encendida * luz * 2.2;
      // a lo lejos, las ventanas se funden en un brillo (fwidth: sin parpadeo de submuestreo)
      float lejos = smoothstep(0.6, 1.6, fwidth(u * 1.3) + fwidth(vMundo.y * 1.7));
      col = mix(col, uCuerpo + luz * 0.35 * step(0.58, h), lejos);
    }
    float d = length(vMundo - cameraPosition);
    col = mix(col, uFondo, 1.0 - exp(-pow(d * uDensidad, 2.0)));
    gl_FragColor = vec4(col, 1.0);
  }
`;
const RED_VS = /* glsl */ `
  attribute float aT;
  attribute float aFase;
  varying float vT;
  varying float vFase;
  varying float vLejos;
  void main() {
    vT = aT;
    vFase = aFase;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vLejos = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const RED_FS = /* glsl */ `
  uniform float uTiempo;
  uniform vec3 uA;
  uniform vec3 uB;
  varying float vT;
  varying float vFase;
  varying float vLejos;
  void main() {
    // un pulso viaja por cada conexión, cada una a su ritmo
    float x = fract(uTiempo * (0.18 + vFase * 0.25) + vFase * 7.0);
    float pulso = smoothstep(0.09, 0.0, abs(x - vT));
    vec3 col = mix(uA, uB, vFase);
    float a = (0.16 + pulso * 1.6) * smoothstep(60.0, 4.0, vLejos);
    gl_FragColor = vec4(col * a * (1.0 + pulso * 2.0), a);
  }
`;
const NODOS_VS = /* glsl */ `
  attribute float aFase;
  uniform float uTiempo;
  uniform float uEscala;
  varying float vA;
  varying float vFase;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float latido = 0.7 + 0.3 * sin(uTiempo * 1.5 + aFase * 30.0);
    gl_PointSize = (1.6 + aFase * 2.4) * latido * uEscala / -mv.z;
    vA = smoothstep(60.0, 6.0, -mv.z);
    vFase = aFase;
  }
`;
const NODOS_FS = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  varying float vA;
  varying float vFase;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vA;
    gl_FragColor = vec4(mix(uA, uB, vFase) * 2.0 * a, a);
  }
`;
const CIELO_VS = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = p.xyww;
  }
`;
const CIELO_FS = /* glsl */ `
  uniform vec3 uAbajo;
  uniform vec3 uArriba;
  uniform vec3 uSol;
  uniform vec3 uSolDir;
  varying vec3 vDir;
  void main() {
    vec3 d = normalize(vDir);
    vec3 col = mix(uAbajo, uArriba, smoothstep(-0.1, 0.7, d.y));
    float s = max(dot(d, normalize(uSolDir)), 0.0);
    col += uSol * (pow(s, 30.0) * 0.9 + pow(s, 4.0) * 0.18);
    gl_FragColor = vec4(col, 1.0);
  }
`;
const QUAD_VS = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const FINAL_FS = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform float uTiempo;
  uniform float uNegro;
  uniform float uAberr;
  uniform vec2 uRes;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main() {
    vec2 c = vUv - 0.5;
    float d = dot(c, c);
    vec2 off = c * uAberr * (0.6 + d * 2.0);
    vec3 col = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
    col *= 1.0 - 0.45 * d * 1.4;
    col += (hash(vUv * uRes + fract(uTiempo) * 91.0) - 0.5) * 0.03;
    col *= 1.0 - uNegro;
    gl_FragColor = vec4(col, 1.0);
  }
`;

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

type Mundo = {
  escena: THREE.Scene;
  actualizar: (t: number) => void;
};

/** 0 · Diseño: un taller pastel de día, formas suaves que flotan detrás de la pieza de arriba */
function mundoDiseno(rnd: () => number): Mundo {
  const escena = new THREE.Scene();
  const ARRIBA = new THREE.Color("#B9C6EC");
  const ABAJO = new THREE.Color("#F6D9CC");
  escena.fog = new THREE.Fog(ABAJO, 18, 90);
  const cielo = new THREE.Mesh(
    new THREE.SphereGeometry(300, 32, 16),
    new THREE.ShaderMaterial({
      vertexShader: CIELO_VS,
      fragmentShader: CIELO_FS,
      uniforms: {
        uAbajo: { value: ABAJO },
        uArriba: { value: ARRIBA },
        uSol: { value: new THREE.Color("#FFF1DD") },
        uSolDir: { value: new THREE.Vector3(0.6, 0.35, -1) },
      },
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    })
  );
  cielo.frustumCulled = false;
  escena.add(cielo);
  escena.add(new THREE.HemisphereLight("#FFF4EA", "#C9B8D8", 1.6));
  const sol = new THREE.DirectionalLight("#FFFFFF", 1.8);
  sol.position.set(6, 10, 4);
  escena.add(sol);
  const paleta = [
    "#F2B8A2",
    "#F6E2BE",
    "#BFD7F2",
    "#D9C8EE",
    "#0092D1",
    "#FFFFFF",
    "#A9DCCF",
  ];
  const geos: THREE.BufferGeometry[] = [
    new THREE.SphereGeometry(1, 40, 24),
    new RoundedBoxGeometry(1.6, 1.6, 1.6, 5, 0.32),
    new THREE.TorusGeometry(1, 0.38, 24, 64),
    new THREE.CylinderGeometry(0.8, 0.8, 1.6, 40),
    new THREE.ConeGeometry(1, 1.8, 40),
  ];
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0 });
  const formas: {
    m: THREE.InstancedMesh;
    datos: {
      p: THREE.Vector3;
      r: THREE.Euler;
      w: THREE.Vector3;
      s: number;
      f: number;
    }[];
  }[] = [];
  for (const g of geos) {
    const n = 14;
    const m = new THREE.InstancedMesh(g, mat, n);
    const datos = [];
    for (let i = 0; i < n; i++) {
      // repartidas detrás de la ventana de arriba, sin tapar la entrada
      let p: THREE.Vector3;
      do
        p = new THREE.Vector3(
          C0.x + (rnd() - 0.5) * 40,
          C0.y + (rnd() - 0.35) * 22,
          -6 - rnd() * 55
        );
      while (
        Math.abs(p.x - C0.x - 1) < 5.5 &&
        Math.abs(p.y - C0.y - 1) < 4.5 &&
        p.z > -26
      );
      datos.push({
        p,
        r: new THREE.Euler(rnd() * 6, rnd() * 6, rnd() * 6),
        w: new THREE.Vector3(
          rnd() - 0.5,
          rnd() - 0.5,
          rnd() - 0.5
        ).multiplyScalar(0.3),
        s: 0.6 + rnd() * 1.6,
        f: rnd() * 6.28,
      });
      m.setColorAt(
        i,
        new THREE.Color(paleta[Math.floor(rnd() * paleta.length)] as string)
      );
    }
    formas.push({ m, datos });
    escena.add(m);
  }
  // un suelo lejano de papel
  const suelo = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    new THREE.MeshStandardMaterial({ color: "#EFD6CB", roughness: 1 })
  );
  suelo.rotation.x = -Math.PI / 2;
  suelo.position.y = C0.y - 14;
  escena.add(suelo);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const p = new THREE.Vector3();
  const sc = new THREE.Vector3();
  return {
    escena,
    actualizar: (t) => {
      for (const { m, datos } of formas) {
        datos.forEach((d, i) => {
          e.set(d.r.x + t * d.w.x, d.r.y + t * d.w.y, d.r.z + t * d.w.z);
          q.setFromEuler(e);
          p.copy(d.p);
          p.y += Math.sin(t * 0.5 + d.f) * 0.4;
          m4.compose(p, q, sc.setScalar(d.s));
          m.setMatrixAt(i, m4);
        });
        m.instanceMatrix.needsUpdate = true;
      }
    },
  };
}

/** 1 · Software: una ciudad de noche, con una avenida libre detrás de la pieza izquierda */
function mundoSoftware(rnd: () => number): Mundo {
  const escena = new THREE.Scene();
  const FONDO = new THREE.Color("#060B18");
  escena.background = FONDO;
  const N = 1400;
  const geo = new THREE.BoxGeometry(1, 1, 1);
  geo.translate(0, 0.5, 0);
  const semillas = new Float32Array(N);
  const u = {
    uCuerpo: { value: new THREE.Color("#0C1426") },
    uCalida: { value: new THREE.Color("#FFC98A") },
    uFria: { value: new THREE.Color("#7FE3FF") },
    uFondo: { value: FONDO },
    uDensidad: { value: 0.012 },
    uTiempo: { value: 0 },
  };
  const ciudad = new THREE.InstancedMesh(
    geo,
    new THREE.ShaderMaterial({
      vertexShader: CIUDAD_VS,
      fragmentShader: CIUDAD_FS,
      uniforms: u,
    }),
    N
  );
  const m4 = new THREE.Matrix4();
  let k = 0;
  for (let gx = -22; gx <= 14 && k < N; gx++) {
    for (let gz = 0; gz < 48 && k < N; gz++) {
      const x = C1.x + gx * 3.2;
      const z = -6 - gz * 3.2;
      if (Math.abs(x - C1.x) < 5) continue; // la avenida por la que entra la cámara
      if (rnd() < 0.18) continue;
      const lejos = Math.abs(x - C1.x) / 60;
      const h = (2 + rnd() ** 2.2 * 26) * (1.1 - lejos * 0.6);
      const w = 1.6 + rnd() * 1.2;
      m4.makeScale(w, h, w).setPosition(x + (rnd() - 0.5), C1.y - 6, z);
      ciudad.setMatrixAt(k, m4);
      semillas[k] = rnd();
      k++;
    }
  }
  ciudad.count = k;
  geo.setAttribute("aSemilla", new THREE.InstancedBufferAttribute(semillas, 1));
  escena.add(ciudad);
  const suelo = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.ShaderMaterial({
      vertexShader: SUELO_VS,
      fragmentShader: SUELO_FS,
      uniforms: {
        uColor: { value: new THREE.Color("#04070F") },
        uLuz: { value: new THREE.Color("#0B1A33") },
        uFondo: { value: FONDO },
        uLinea: { value: new THREE.Color("#1F6FB2") },
        uDensidad: { value: 0.012 },
      },
    })
  );
  suelo.rotation.x = -Math.PI / 2;
  suelo.position.y = C1.y - 6;
  escena.add(suelo);
  return {
    escena,
    actualizar: (t) => {
      u.uTiempo.value = t;
    },
  };
}

/** 2 · IA: una red neuronal (nodos y conexiones con pulsos) detrás de la pieza de abajo */
function mundoIA(rnd: () => number, dpr: number): Mundo {
  const escena = new THREE.Scene();
  escena.background = new THREE.Color("#05030F");
  const N = 2200;
  const pos = new Float32Array(N * 3);
  const fase = new Float32Array(N);
  const centroRed = new THREE.Vector3(C2.x, 0.6, -17);
  for (let i = 0; i < N; i++) {
    // dos lóbulos y un puente: la forma de un cerebro sin dibujarlo literal
    const lobulo = rnd() < 0.5 ? -1 : 1;
    const v = new THREE.Vector3(
      rnd() - 0.5,
      rnd() - 0.5,
      rnd() - 0.5
    ).normalize();
    const r = Math.cbrt(rnd());
    pos.set(
      [
        centroRed.x + lobulo * 4.2 + v.x * 6 * r,
        centroRed.y + v.y * 5 * r,
        centroRed.z + v.z * 8 * r,
      ],
      i * 3
    );
    fase[i] = rnd();
  }
  // conexiones: cada nodo con sus dos vecinos más cercanos (rejilla espacial)
  const CEL = 2.2;
  const rejilla = new Map<string, number[]>();
  const clave = (x: number, y: number, z: number) =>
    `${Math.floor(x / CEL)},${Math.floor(y / CEL)},${Math.floor(z / CEL)}`;
  for (let i = 0; i < N; i++) {
    const k = clave(
      pos[i * 3] as number,
      pos[i * 3 + 1] as number,
      pos[i * 3 + 2] as number
    );
    const l = rejilla.get(k);
    if (l) l.push(i);
    else rejilla.set(k, [i]);
  }
  const lineas: number[] = [];
  const ts: number[] = [];
  const fases: number[] = [];
  for (let i = 0; i < N; i++) {
    const x = pos[i * 3] as number;
    const y = pos[i * 3 + 1] as number;
    const z = pos[i * 3 + 2] as number;
    const cx = Math.floor(x / CEL);
    const cy = Math.floor(y / CEL);
    const cz = Math.floor(z / CEL);
    const cand: [number, number][] = [];
    for (let a = -1; a <= 1; a++)
      for (let b = -1; b <= 1; b++)
        for (let c = -1; c <= 1; c++)
          for (const j of rejilla.get(`${cx + a},${cy + b},${cz + c}`) ?? []) {
            if (j <= i) continue;
            const d = Math.hypot(
              (pos[j * 3] as number) - x,
              (pos[j * 3 + 1] as number) - y,
              (pos[j * 3 + 2] as number) - z
            );
            if (d < CEL) cand.push([d, j]);
          }
    cand.sort((p, q) => p[0] - q[0]);
    for (const [, j] of cand.slice(0, 2)) {
      lineas.push(
        x,
        y,
        z,
        pos[j * 3] as number,
        pos[j * 3 + 1] as number,
        pos[j * 3 + 2] as number
      );
      ts.push(0, 1);
      const f = rnd();
      fases.push(f, f);
    }
  }
  const A = new THREE.Color("#6FC3FF");
  const B = new THREE.Color("#A68BFF");
  const uRed = { uTiempo: { value: 0 }, uA: { value: A }, uB: { value: B } };
  const geoL = new THREE.BufferGeometry();
  geoL.setAttribute("position", new THREE.Float32BufferAttribute(lineas, 3));
  geoL.setAttribute("aT", new THREE.Float32BufferAttribute(ts, 1));
  geoL.setAttribute("aFase", new THREE.Float32BufferAttribute(fases, 1));
  const red = new THREE.LineSegments(
    geoL,
    new THREE.ShaderMaterial({
      vertexShader: RED_VS,
      fragmentShader: RED_FS,
      uniforms: uRed,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  escena.add(red);
  const geoN = new THREE.BufferGeometry();
  geoN.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geoN.setAttribute("aFase", new THREE.BufferAttribute(fase, 1));
  const uNod = {
    uTiempo: { value: 0 },
    uEscala: { value: 26 * dpr },
    uA: { value: A },
    uB: { value: B },
  };
  const nodos = new THREE.Points(
    geoN,
    new THREE.ShaderMaterial({
      vertexShader: NODOS_VS,
      fragmentShader: NODOS_FS,
      uniforms: uNod,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  escena.add(nodos);
  const grupo = new THREE.Group();
  grupo.add(red, nodos);
  escena.add(grupo);
  return {
    escena,
    actualizar: (t) => {
      uRed.uTiempo.value = t;
      uNod.uTiempo.value = t;
      // la red gira despacio sobre su centro (un solo objeto que gira: «Animación sutil»)
      grupo.position.copy(centroRed);
      grupo.rotation.y = Math.sin(t * 0.05) * 0.25;
      grupo.position.sub(centroRed.clone().applyEuler(grupo.rotation));
    },
  };
}

export function crearPortales(
  el: HTMLElement,
  alEstado: (e: EstadoPortales) => void,
  textos: HTMLElement[]
) {
  const recorridos = ACTOS.map(crearRecorrido);
  const largos = recorridos.map((r) => r.total);
  const total = largos.reduce((s, x) => s + x, 0);
  const estado: EstadoPortales = {
    listo: false,
    fps: 0,
    llamadas: 0,
    total,
    ventana: -1,
  };
  const emitir = () => alEstado({ ...estado });

  return crearLab(
    el,
    ({ renderer, lienzo, dpr, quieto, puntero }) => {
      lienzo.style.touchAction = "pan-y";
      renderer.toneMapping = THREE.NeutralToneMapping;
      if (process.env.NODE_ENV !== "production")
        Object.assign(window, { __obra: { renderer } });
      const rnd = azar(9);
      const camara = new THREE.PerspectiveCamera(38, 1, 0.05, 600);

      // ── la portada: estudio oscuro, el isotipo de pie con tres ventanas ──
      const portada = new THREE.Scene();
      const FONDO = new THREE.Color("#0A0C12");
      portada.background = FONDO;
      portada.add(new THREE.HemisphereLight("#C9D6EA", "#1A1C22", 0.7));
      const clave = new THREE.DirectionalLight("#FFFFFF", 1.6);
      clave.position.set(-6, 9, 8);
      portada.add(clave);
      const contra = new THREE.DirectionalLight("#6FA8FF", 1.2);
      contra.position.set(5, 6, -6);
      portada.add(contra);
      const suelo = new THREE.Mesh(
        new THREE.PlaneGeometry(400, 400),
        new THREE.ShaderMaterial({
          vertexShader: SUELO_VS,
          fragmentShader: SUELO_FS,
          uniforms: {
            uColor: { value: new THREE.Color("#0C0E14") },
            uLuz: { value: new THREE.Color("#1C2230") },
            uFondo: { value: FONDO },
            uLinea: { value: new THREE.Color("#1A2236") },
            uDensidad: { value: 0.02 },
          },
        })
      );
      suelo.rotation.x = -Math.PI / 2;
      portada.add(suelo);
      const ceramica = new THREE.MeshStandardMaterial({
        color: "#D8DCE3",
        roughness: 0.7,
      });

      // render targets de los mundos (¾ de la resolución: la ventana es una fracción de la pantalla)
      const ESCALA_RT = 0.75;
      const rts = [0, 1, 2].map(
        () => new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType })
      );
      const BASE_BRILLO = [0.78, 1, 1];
      const brillos = BASE_BRILLO.map((v) => ({ value: v }));
      const resPortal = { value: new THREE.Vector2(1, 1) };
      const ventanas: THREE.Mesh[] = [];
      POLIS.forEach((poly, i) => {
        const forma = new THREE.Shape(
          poly.map((p) => new THREE.Vector2(p.x, p.y))
        );
        const solido = new THREE.Mesh(
          new THREE.ExtrudeGeometry(forma, {
            depth: 0.4,
            bevelEnabled: true,
            bevelThickness: 0.04,
            bevelSize: 0.04,
            bevelOffset: -0.04,
            bevelSegments: 3,
            curveSegments: 1,
          }),
          ceramica
        );
        solido.position.z = -0.44 - 0.002; // la cara de delante queda en z ≈ 0
        portada.add(solido);
        // la ventana: la silueta encogida un 9 % hacia su centro (el resto es el marco de cerámica)
        const c = C[i] as V2;
        const dentro = new THREE.Shape(
          poly.map(
            (p) =>
              new THREE.Vector2(
                c.x + (p.x - c.x) * 0.9,
                c.y + (p.y - c.y) * 0.9
              )
          )
        );
        const ventana = new THREE.Mesh(
          new THREE.ShapeGeometry(dentro),
          new THREE.ShaderMaterial({
            vertexShader: PORTAL_VS,
            fragmentShader: PORTAL_FS,
            uniforms: {
              tMundo: { value: (rts[i] as THREE.WebGLRenderTarget).texture },
              uRes: resPortal,
              uBrillo: brillos[i] as { value: number },
            },
          })
        );
        ventana.position.z = 0.004;
        ventana.userData.indice = i;
        ventanas.push(ventana);
        portada.add(ventana);
      });

      const mundos: Mundo[] = [
        mundoDiseno(rnd),
        mundoSoftware(rnd),
        mundoIA(rnd, dpr),
      ];

      // ── postproceso ──
      const composer = new EffectComposer(renderer);
      composer.setPixelRatio(dpr);
      const pase = new RenderPass(portada, camara);
      composer.addPass(pase);
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(2, 2),
        0.45,
        0.5,
        0.88
      );
      composer.addPass(bloom);
      composer.addPass(new OutputPass());
      const finalU = {
        tDiffuse: { value: null as THREE.Texture | null },
        uTiempo: { value: 0 },
        uNegro: { value: 0 },
        uAberr: { value: 0.0012 },
        uRes: { value: new THREE.Vector2(1, 1) },
      };
      const final = new ShaderPass({
        uniforms: finalU,
        vertexShader: QUAD_VS,
        fragmentShader: FINAL_FS,
      });
      composer.addPass(final);
      const uf = final.uniforms as unknown as typeof finalU;

      // ── estado ──
      const pos = new THREE.Vector3();
      const mira = new THREE.Vector3();
      const suave = { x: 0, y: 0 };
      const rayo = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      const frustum = new THREE.Frustum();
      const pm = new THREE.Matrix4();
      const esferas = POLIS.map((poly, i) => {
        const c = C[i] as V2;
        const r = Math.max(
          ...poly.map((p) => Math.hypot(p.x - c.x, p.y - c.y))
        );
        return new THREE.Sphere(new THREE.Vector3(c.x, c.y, 0), r);
      });
      let prog = 0;
      let vel = 0;
      let progPrevio = 0;
      let maxScroll = 1;
      const medirScroll = () => {
        maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      };
      medirScroll();
      const roDoc = new ResizeObserver(medirScroll);
      roDoc.observe(document.body);
      let ancho = 1;
      let alto = 1;
      let dprActual = dpr;
      let tReal = performance.now();
      let cuadros = 0;
      let ultimaEmision = performance.now();
      let acumT = 0;
      let acumN = 0;
      let ultimoAjuste = performance.now();

      const tamRT = () => {
        const w = Math.max(2, Math.round(ancho * dprActual * ESCALA_RT));
        const h = Math.max(2, Math.round(alto * dprActual * ESCALA_RT));
        for (const rt of rts) rt.setSize(w, h);
        resPortal.value.set(ancho * dprActual, alto * dprActual);
        uf.uRes.value.set(ancho * dprActual, alto * dprActual);
      };

      /** el acto y el progreso local a partir del progreso global (0…1) */
      const ubicar = (p: number) => {
        let u = p * total;
        for (let a = 0; a < largos.length; a++) {
          const l = largos[a] as number;
          if (u <= l || a === largos.length - 1)
            return { acto: a, local: Math.min(1, u / l), u };
          u -= l;
        }
        return { acto: 0, local: 0, u };
      };

      // calentar: compilar las cuatro escenas y dibujar una vez cada una
      Promise.all(
        [portada, ...mundos.map((m) => m.escena)].map((e) =>
          renderer.compileAsync(e, camara)
        )
      )
        .catch(() => {})
        .finally(() => {
          camara.position.set(0.3, 3.2, 16);
          camara.lookAt(0.3, 2.9, 0);
          mundos.forEach((m, i) => {
            m.actualizar(0);
            renderer.setRenderTarget(rts[i] as THREE.WebGLRenderTarget);
            renderer.render(m.escena, camara);
          });
          renderer.setRenderTarget(null);
          composer.render(0);
          estado.listo = true;
          emitir();
        });

      return {
        medir: (w, h) => {
          ancho = w;
          alto = h;
          camara.aspect = w / h;
          camara.updateProjectionMatrix();
          composer.setSize(w, h);
          bloom.setSize(w * dprActual * 0.5, h * dprActual * 0.5);
          tamRT();
        },
        cuadro: (dt, t) => {
          const ahora = performance.now();
          const dtReal = Math.min(0.05, (ahora - tReal) / 1000);
          tReal = ahora;
          const objetivo = maxScroll > 0 ? window.scrollY / maxScroll : 0;
          prog = quieto
            ? objetivo
            : prog + (objetivo - prog) * (1 - Math.exp(-dtReal * 5));
          vel +=
            (Math.abs(prog - progPrevio) / Math.max(dtReal, 1 / 240) - vel) *
            0.15;
          progPrevio = prog;

          // acto, cámara y textos
          const { acto, local, u } = ubicar(prog);
          const rec = recorridos[acto] as (typeof recorridos)[number];
          const r = rec.evaluar(local, pos, mira);
          // en vertical, lente según el ancho
          const aspecto = ancho / alto;
          const fov =
            aspecto < 1
              ? Math.min(
                  72,
                  (2 *
                    Math.atan(Math.tan((r.fov * Math.PI) / 360) / aspecto) *
                    180) /
                    Math.PI
                )
              : r.fov;
          // paralaje con el puntero, solo lejos de las ventanas (en la portada es donde se luce)
          suave.x +=
            ((puntero.dentro ? puntero.x : 0) - suave.x) *
            (1 - Math.exp(-dtReal * 3));
          suave.y +=
            ((puntero.dentro ? puntero.y : 0) - suave.y) *
            (1 - Math.exp(-dtReal * 3));
          const lejos = THREE.MathUtils.smoothstep(pos.z, 4, 9);
          pos.x += suave.x * 1.1 * lejos;
          pos.y += suave.y * 0.6 * lejos;
          camara.position.copy(pos);
          camara.lookAt(mira);
          if (Math.abs(camara.fov - fov) > 0.01) {
            camara.fov = fov;
            camara.updateProjectionMatrix();
          }
          textos.forEach((tx, i) => {
            const o = i === r.texto ? r.opacidad : 0;
            if (Math.abs(Number(tx.dataset.o ?? "0") - o) > 0.004) {
              tx.style.opacity = o.toFixed(3);
              tx.style.transform = `translateY(${((1 - o) * 14).toFixed(1)}px)`;
              tx.style.pointerEvents = o > 0.5 ? "auto" : "none";
              tx.dataset.o = o.toFixed(3);
            }
          });

          // corte de cine entre actos: fundido a negro de ida y vuelta alrededor del límite
          let negro = 0;
          let acum = 0;
          for (let a = 0; a < largos.length - 1; a++) {
            acum += largos[a] as number;
            negro = Math.max(
              negro,
              1 - THREE.MathUtils.smoothstep(Math.abs(u - acum), 0, 0.12)
            );
          }
          uf.uNegro.value = negro;
          uf.uAberr.value = 0.0012 + Math.min(1, vel * 9) * 0.004;
          uf.uTiempo.value = t;

          // ¿dentro de un mundo? (actos 0–2, al otro lado del plano de las ventanas)
          const dentroDe = acto < 3 && pos.z < 0 ? acto : -1;
          for (const m of mundos) m.actualizar(t);
          if (dentroDe >= 0) {
            pase.scene = (mundos[dentroDe] as Mundo).escena;
          } else {
            pase.scene = portada;
            // solo los mundos cuya ventana está en cuadro
            pm.multiplyMatrices(
              camara.projectionMatrix,
              camara.matrixWorldInverse
            );
            frustum.setFromProjectionMatrix(pm);
            mundos.forEach((m, i) => {
              if (!frustum.intersectsSphere(esferas[i] as THREE.Sphere)) return;
              renderer.setRenderTarget(rts[i] as THREE.WebGLRenderTarget);
              renderer.render(m.escena, camara);
            });
            renderer.setRenderTarget(null);
          }

          // la ventana bajo el cursor se aviva un poco (y el DOM lo sabe para su etiqueta)
          let ventana = -1;
          if (dentroDe < 0 && puntero.dentro && r.plano === 0 && acto === 0) {
            rayo.setFromCamera(ndc.set(puntero.x, puntero.y), camara);
            const hit = rayo.intersectObjects(ventanas, false)[0];
            if (hit) ventana = hit.object.userData.indice as number;
          }
          brillos.forEach((b, i) => {
            const base = BASE_BRILLO[i] as number;
            b.value +=
              ((i === ventana ? base * 1.1 : base) - b.value) *
              (1 - Math.exp(-dtReal * 6));
          });
          if (ventana !== estado.ventana) {
            estado.ventana = ventana;
            emitir();
          }

          // resolución adaptable
          if (estado.listo && dt > 0) {
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
                tamRT();
              }
              acumT = 0;
              acumN = 0;
              ultimoAjuste = ahora;
            }
          }

          composer.render(dt);
          cuadros++;
          if (ahora - ultimaEmision > 500) {
            estado.fps = Math.round((cuadros * 1000) / (ahora - ultimaEmision));
            estado.llamadas = renderer.info.render.calls;
            cuadros = 0;
            ultimaEmision = ahora;
            // el alto del scroll lo fija el DOM DESPUÉS de leer el total: un ResizeObserver sobre
            // body no se entera (el body no cambia de tamaño, desborda). Se vuelve a medir aquí
            medirScroll();
            emitir();
          }
        },
        liberar: () => {
          roDoc.disconnect();
          liberarEscena(portada);
          for (const m of mundos) liberarEscena(m.escena);
          for (const rt of rts) rt.dispose();
          composer.dispose();
        },
      };
    },
    undefined,
    {
      antialias: true,
      dprMax:
        typeof window !== "undefined" &&
        window.matchMedia("(pointer: coarse)").matches
          ? 1.25
          : 1.5,
    }
  );
}
