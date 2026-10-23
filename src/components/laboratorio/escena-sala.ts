// Laboratorio 3D · la sala (2026-10-15): una escena modelada en Blender con la luz HORNEADA (como
// unseen.co) y, encima, lo que solo puede hacer el navegador en tiempo real.
//   · la sala: GLB con Draco + atlas de luz en KTX2; MeshBasicMaterial, sin una sola luz
//   · el muro del fondo lleva el isotipo recortado y el sol lo proyecta en el suelo
//   · agua: un Reflector semitransparente (deja ver la luz del suelo y refleja los huecos)
//   · rayos de luz en pantalla (dispersión radial desde los huecos, GPU Gems 3 cap. 13) + un prisma
//     tenue por pieza para que el haz tenga cuerpo de lado
//   · polvo simulado en la GPU (GPUComputationRenderer): ruido curl, el puntero lo aparta y solo
//     brilla donde le da el sol (se sigue el rayo hacia el sol hasta el muro y se mira si cae en un hueco)
//   · el isotipo de vidrio flota sobre la luz, con el reel de proyectos dentro
//   · la cámara va plano por plano (planos.ts): curvas de aceleración, pausas y el texto en la pausa
// Fuente de la escena: ~/.claude/skills/creator/herramientas/tres/sala3.py (Blender).
import * as THREE from "three";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";
import { Reflector } from "three/addons/objects/Reflector.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ISOTIPO, type Punto } from "~/components/axium/tres/isotipo";
import { CURVAS, crearRecorrido } from "~/components/laboratorio/planos";

export type ControlSala = {
  pausar: (p: boolean) => void;
  postproceso: (activo: boolean) => void;
  liberar: () => void;
};
export type EstadoSala = {
  cargado: number; // 0…1
  listo: boolean;
  fps: number;
  llamadas: number;
  capitulo: number;
};

const BASE = "/laboratorio/sala";
const REEL = "/images/hero-propuestas/p33-reel.mp4";

// ── el muro y el sol, con los mismos números que el script de Blender ──
// Blender (x, y, z) → three (x, z, −y)
const MURO_Z = -9; // cara interior del muro del fondo
const K = 8.4 / ISOTIPO.ancho;
const ZC = 5.4;
const SOL = new THREE.Vector3(-0.107, -0.643, 0.759).normalize(); // hacia dónde viaja la luz

function piezaEnMuro(pts: readonly Punto[]) {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return pts.map(
    ([x, y]) =>
      new THREE.Vector3(
        (cx + (x - cx) * 0.93 - ISOTIPO.ancho / 2) * K,
        ZC - (cy + (y - cy) * 0.93 - ISOTIPO.alto / 2) * K,
        MURO_Z
      )
  );
}
const PIEZAS_MURO = [
  ISOTIPO.piezas.arriba,
  ISOTIPO.piezas.izquierda,
  ISOTIPO.piezas.abajo,
].map(piezaEnMuro);

/** el prisma de luz de una pieza: del hueco hasta el suelo, a lo largo del sol */
function haz(pol: THREE.Vector3[]) {
  const n = pol.length;
  const pos: number[] = [];
  const largo: number[] = [];
  const fin = pol.map((p) => p.clone().addScaledVector(SOL, p.y / -SOL.y));
  for (let i = 0; i < n; i++) {
    const a = pol[i] as THREE.Vector3;
    const b = pol[(i + 1) % n] as THREE.Vector3;
    const c = fin[(i + 1) % n] as THREE.Vector3;
    const d = fin[i] as THREE.Vector3;
    pos.push(...a.toArray(), ...b.toArray(), ...c.toArray());
    pos.push(...a.toArray(), ...c.toArray(), ...d.toArray());
    largo.push(0, 0, 1, 0, 1, 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("aLargo", new THREE.Float32BufferAttribute(largo, 1));
  g.computeVertexNormals();
  return g;
}

/** máscara de los huecos en el plano del muro: x −5…5, y 0…10 → textura 512² (blanco = pasa el sol) */
function mascaraVentana() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d");
  if (g) {
    g.fillStyle = "#000";
    g.fillRect(0, 0, 512, 512);
    g.filter = "blur(3px)"; // el sol no es un punto: el borde del haz es blando
    g.fillStyle = "#fff";
    for (const pol of PIEZAS_MURO) {
      g.beginPath();
      pol.forEach((p, i) => {
        const x = ((p.x + 5) / 10) * 512;
        const y = (1 - p.y / 10) * 512;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      });
      g.closePath();
      g.fill();
    }
  }
  return new THREE.CanvasTexture(c);
}

const HAZ_VS = /* glsl */ `
  attribute float aLargo;
  varying float vLargo;
  varying vec3 vMundo;
  varying vec3 vNormal;
  void main() {
    vLargo = aLargo;
    vec4 m = modelMatrix * vec4(position, 1.0);
    vMundo = m.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * m;
  }
`;
const HAZ_FS = /* glsl */ `
  uniform float uTiempo;
  uniform float uFuerza;
  varying float vLargo;
  varying vec3 vMundo;
  varying vec3 vNormal;
  void main() {
    vec3 v = normalize(cameraPosition - vMundo);
    float frente = pow(abs(dot(normalize(vNormal), v)), 1.4);
    float a = uFuerza * frente * mix(1.0, 0.25, vLargo);
    gl_FragColor = vec4(vec3(1.0, 0.84, 0.62) * a, a);
  }
`;

// ── polvo en la GPU ──
const RUIDO = /* glsl */ `
  // simplex 3D (Ashima Arts, licencia MIT) y su rotacional: un campo sin divergencia, el polvo no se amontona
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
  vec3 curl(vec3 p) {
    const float e = 0.1;
    vec3 dx = vec3(e, 0.0, 0.0), dy = vec3(0.0, e, 0.0), dz = vec3(0.0, 0.0, e);
    float a = snoise(p + dy) - snoise(p - dy), b = snoise(p + dz) - snoise(p - dz);
    float c = snoise(p + dz + 31.4) - snoise(p - dz + 31.4), d = snoise(p + dx + 31.4) - snoise(p - dx + 31.4);
    float f = snoise(p + dx + 71.7) - snoise(p - dx + 71.7), g = snoise(p + dy + 71.7) - snoise(p - dy + 71.7);
    return vec3(a - b, c - d, f - g) / (2.0 * e);
  }
`;
const VEL_FS = /* glsl */ `
  uniform float uTiempo;
  uniform float uDt;
  uniform vec3 uRayoO;
  uniform vec3 uRayoD;
  uniform float uRayo;
  ${RUIDO}
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 p = texture2D(tPos, uv).xyz;
    vec3 v = texture2D(tVel, uv).xyz;
    vec3 objetivo = curl(p * 0.22 + vec3(0.0, uTiempo * 0.035, 0.0)) * 0.1 + vec3(0.0, -0.008, 0.0);
    v += (objetivo - v) * min(1.0, uDt * 1.2);
    // el puntero aparta el polvo: distancia de la mota al rayo de la cámara que pasa por el ratón
    vec3 w = p - uRayoO;
    vec3 cerca = uRayoO + uRayoD * max(dot(w, uRayoD), 0.0);
    vec3 d = p - cerca;
    float dist = length(d);
    if (uRayo > 0.5 && dist < 0.8 && dist > 0.0001) v += normalize(d) * (0.8 - dist) * 3.0 * uDt;
    gl_FragColor = vec4(v * 0.995, 1.0);
  }
`;
const POS_FS = /* glsl */ `
  uniform float uDt;
  uniform float uTiempo;
  uniform vec3 uMin;
  uniform vec3 uMax;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 p = texture2D(tPos, uv);
    p.xyz += texture2D(tVel, uv).xyz * uDt;
    // fuera de la caja: renace en otro punto al azar
    if (any(lessThan(p.xyz, uMin)) || any(greaterThan(p.xyz, uMax))) {
      vec3 r = vec3(hash(uv + uTiempo), hash(uv * 1.7 + uTiempo * 1.3), hash(uv * 2.3 + uTiempo * 0.7));
      p.xyz = uMin + r * (uMax - uMin);
    }
    gl_FragColor = p;
  }
`;
const POLVO_VS = /* glsl */ `
  uniform sampler2D tPos;
  uniform sampler2D tVentana;
  uniform vec3 uSol;
  uniform float uDpr;
  attribute vec2 aRef;
  varying float vBrillo;
  void main() {
    vec4 d = texture2D(tPos, aRef);
    vec3 p = d.xyz;
    // ¿le da el sol? se sigue el rayo hacia el sol hasta el plano del muro y se mira la máscara
    float s = (p.z + 9.0) / uSol.z;
    vec3 q = p - uSol * s;
    vec2 m = vec2((q.x + 5.0) / 10.0, q.y / 10.0);
    float dentro = step(0.0, s) * step(0.0, m.x) * step(m.x, 1.0) * step(0.0, m.y) * step(m.y, 1.0);
    float luz = dentro * texture2D(tVentana, m).r;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float semilla = fract(d.w * 13.7);
    gl_PointSize = (1.4 + semilla * 2.6) * uDpr * (6.0 / -mv.z) * (0.55 + 0.6 * luz);
    vBrillo = mix(0.025, 0.95, luz) * (0.45 + semilla * 0.55);
  }
`;
const POLVO_FS = /* glsl */ `
  varying float vBrillo;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vBrillo;
    gl_FragColor = vec4(vec3(1.0, 0.9, 0.74) * a, a);
  }
`;

const AGUA = {
  name: "AguaSala",
  uniforms: {
    color: { value: null },
    tDiffuse: { value: null },
    textureMatrix: { value: null },
    uTiempo: { value: 0 },
  },
  vertexShader: /* glsl */ `
    uniform mat4 textureMatrix;
    varying vec4 vUvP;
    varying vec3 vMundo;
    void main() {
      vUvP = textureMatrix * vec4(position, 1.0);
      vMundo = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * viewMatrix * vec4(vMundo, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTiempo;
    varying vec4 vUvP;
    varying vec3 vMundo;
    void main() {
      vec2 o = vec2(
        sin(vMundo.z * 3.1 + uTiempo * 0.9) + sin(vMundo.x * 2.3 - uTiempo * 0.7),
        cos(vMundo.x * 2.7 + uTiempo * 0.8) + sin(vMundo.z * 1.9 + uTiempo * 0.6)
      ) * 0.006;
      vec4 uvp = vUvP;
      uvp.xy += o * uvp.w;
      vec3 reflejo = texture2DProj(tDiffuse, uvp).rgb;
      vec3 v = normalize(cameraPosition - vMundo);
      // fresnel: mirando hacia abajo se ve el suelo (y la luz del isotipo); rasante, el reflejo
      float f = 0.18 + 0.82 * pow(1.0 - clamp(v.y, 0.0, 1.0), 4.0);
      gl_FragColor = vec4(reflejo * vec3(0.92, 0.96, 1.0), f);
      #include <colorspace_fragment>
    }
  `,
};

// dispersión radial de la luz (GPU Gems 3, cap. 13): desde cada píxel se camina hacia la fuente y
// se suma lo brillante que hay en el camino; con caída, eso dibuja rayos que salen de los huecos
const RAYOS = {
  uniforms: {
    tDiffuse: { value: null },
    uLuz: { value: new THREE.Vector2(0.5, 0.6) },
    uFuerza: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uLuz;
    uniform float uFuerza;
    varying vec2 vUv;
    void main() {
      vec3 base = texture2D(tDiffuse, vUv).rgb;
      if (uFuerza < 0.001) { gl_FragColor = vec4(base, 1.0); return; }
      vec2 paso = (vUv - uLuz) * (0.9 / 40.0);
      vec2 uv = vUv;
      float caida = 1.0;
      vec3 suma = vec3(0.0);
      for (int i = 0; i < 40; i++) {
        uv -= paso;
        vec3 s = texture2D(tDiffuse, uv).rgb;
        float l = dot(s, vec3(0.2126, 0.7152, 0.0722));
        suma += s * smoothstep(0.5, 0.9, l) * caida;
        caida *= 0.968;
      }
      gl_FragColor = vec4(base + suma * (uFuerza / 40.0) * vec3(1.0, 0.88, 0.74), 1.0);
    }
  `,
};

const ACABADO = {
  uniforms: {
    tDiffuse: { value: null },
    uTiempo: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTiempo;
    uniform vec2 uRes;
    varying vec2 vUv;
    void main() {
      vec2 c = vUv - 0.5;
      float d = length(c);
      vec2 dir = c * 0.0025 * d;
      vec3 col = vec3(texture2D(tDiffuse, vUv + dir).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - dir).b);
      col *= mix(1.0, smoothstep(0.95, 0.25, d), 0.35);
      float n = fract(sin(dot(vUv * uRes + fract(uTiempo) * 97.0, vec2(12.9898, 78.233))) * 43758.5453);
      col += (n - 0.5) * 0.028;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

export function crearSala(
  contenedor: HTMLElement,
  alEstado: (e: EstadoSala) => void,
  textos: HTMLElement[]
): ControlSala | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }
  const tactil = window.matchMedia("(pointer: coarse)").matches;
  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, tactil ? 1.5 : 1.75);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Neutral deja casi intactos los colores horneados (ya vienen tonificados de Blender)
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.info.autoReset = false;
  const lienzo = renderer.domElement;
  lienzo.style.cssText =
    "display:block;width:100%;height:100%;opacity:0;transition:opacity 1s ease";
  contenedor.appendChild(lienzo);

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(42, 1, 0.05, 400);
  camara.layers.enable(1); // la capa 1 (vidrio, haces, polvo) no entra en el reflejo del agua
  const estado: EstadoSala = {
    cargado: 0,
    listo: false,
    fps: 0,
    llamadas: 0,
    capitulo: 0,
  };

  // ── carga ──
  const gestor = new THREE.LoadingManager();
  gestor.onProgress = (_u, hechos, total) => {
    estado.cargado = hechos / total;
    alEstado({ ...estado });
  };
  const draco = new DRACOLoader(gestor).setDecoderPath("/laboratorio/draco/");
  const ktx2 = new KTX2Loader(gestor)
    .setTranscoderPath("/laboratorio/basis/")
    .detectSupport(renderer);
  const gltf = new GLTFLoader(gestor).setDRACOLoader(draco);
  const texturas = new THREE.TextureLoader(gestor);
  const pmrem = new THREE.PMREMGenerator(renderer);
  let entorno: THREE.Texture | null = null;

  texturas.load(`${BASE}/cielo.jpg`, (t) => {
    t.mapping = THREE.EquirectangularReflectionMapping;
    t.colorSpace = THREE.SRGBColorSpace;
    escena.background = t;
    entorno = pmrem.fromEquirectangular(t).texture;
    escena.environment = entorno;
  });
  const conLuz = (nombre: string, archivo: string) =>
    ktx2.load(`${BASE}/${archivo}`, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.flipY = false; // las UV del glTF van con la textura sin voltear
      t.anisotropy = 8;
      const m = escena.getObjectByName(nombre) as THREE.Mesh | undefined;
      if (m) m.material = new THREE.MeshBasicMaterial({ map: t });
    });
  gltf.load(`${BASE}/sala.glb`, (g) => {
    escena.add(g.scene);
    conLuz("sala", "sala-luz.ktx2");
    conLuz("terreno", "terreno-luz.ktx2");
  });

  // ── agua ──
  const agua = new Reflector(new THREE.PlaneGeometry(24, 15.2), {
    textureWidth: Math.round(window.innerWidth * dpr * (tactil ? 0.35 : 0.6)),
    textureHeight: Math.round(window.innerHeight * dpr * (tactil ? 0.35 : 0.6)),
    clipBias: 0.002,
    shader: AGUA,
  });
  agua.rotation.x = -Math.PI / 2;
  // el agua acaba antes de las gradas: si las corta, la ondulación muestrea fuera del reflejo y salen
  // medias lunas oscuras junto al muro
  agua.position.set(0, 0.035, 0.4);
  const matAgua = agua.material as THREE.ShaderMaterial;
  matAgua.transparent = true;
  const uAgua = matAgua.uniforms as { uTiempo: THREE.IUniform<number> };
  escena.add(agua);

  // ── haces tenues (cuerpo de lado; los rayos fuertes los pone el paso de pantalla) ──
  const uHaz = { uTiempo: { value: 0 }, uFuerza: { value: 0.07 } };
  const matHaz = new THREE.ShaderMaterial({
    vertexShader: HAZ_VS,
    fragmentShader: HAZ_FS,
    uniforms: uHaz,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  for (const pol of PIEZAS_MURO) {
    const h = new THREE.Mesh(haz(pol), matHaz);
    h.layers.set(1);
    escena.add(h);
  }

  // ── polvo en la GPU ──
  const LADO = tactil ? 40 : 72;
  const gpu = new GPUComputationRenderer(LADO, LADO, renderer);
  const MIN = new THREE.Vector3(-7, 0.1, -8.8);
  const MAX = new THREE.Vector3(7, 9.5, 2.5);
  const p0 = gpu.createTexture();
  const v0 = gpu.createTexture();
  const datosP = p0.image.data as Float32Array;
  for (let i = 0; i < LADO * LADO; i++) {
    datosP[i * 4] = MIN.x + Math.random() * (MAX.x - MIN.x);
    datosP[i * 4 + 1] = MIN.y + Math.random() * (MAX.y - MIN.y);
    datosP[i * 4 + 2] = MIN.z + Math.random() * (MAX.z - MIN.z);
    datosP[i * 4 + 3] = Math.random();
  }
  const vPos = gpu.addVariable("tPos", POS_FS, p0);
  const vVel = gpu.addVariable("tVel", VEL_FS, v0);
  gpu.setVariableDependencies(vPos, [vPos, vVel]);
  gpu.setVariableDependencies(vVel, [vPos, vVel]);
  // uniforms propios y tipados (con noUncheckedIndexedAccess, material.uniforms.x puede ser undefined)
  const uSimP = {
    uDt: { value: 0 },
    uTiempo: { value: 0 },
    uMin: { value: MIN },
    uMax: { value: MAX },
  };
  Object.assign(vPos.material.uniforms, uSimP);
  const uSimV = {
    uDt: { value: 0 },
    uTiempo: { value: 0 },
    uRayoO: { value: new THREE.Vector3() },
    uRayoD: { value: new THREE.Vector3(0, 0, -1) },
    uRayo: { value: 0 },
  };
  Object.assign(vVel.material.uniforms, uSimV);
  const errorGpu = gpu.init();
  const ventana = mascaraVentana();
  const gPolvo = new THREE.BufferGeometry();
  const ref = new Float32Array(LADO * LADO * 2);
  for (let i = 0; i < LADO * LADO; i++) {
    ref[i * 2] = ((i % LADO) + 0.5) / LADO;
    ref[i * 2 + 1] = (Math.floor(i / LADO) + 0.5) / LADO;
  }
  gPolvo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(LADO * LADO * 3), 3)
  );
  gPolvo.setAttribute("aRef", new THREE.BufferAttribute(ref, 2));
  const uPolvo = {
    tPos: { value: null as THREE.Texture | null },
    tVentana: { value: ventana },
    uSol: { value: SOL },
    uDpr: { value: dpr },
  };
  const polvo = new THREE.Points(
    gPolvo,
    new THREE.ShaderMaterial({
      vertexShader: POLVO_VS,
      fragmentShader: POLVO_FS,
      uniforms: uPolvo,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  polvo.frustumCulled = false;
  polvo.layers.set(1);
  polvo.visible = !errorGpu;
  escena.add(polvo);

  // ── el isotipo de vidrio con el reel dentro (la idea de la 34) ──
  const video = document.createElement("video");
  Object.assign(video, {
    src: REEL,
    muted: true,
    loop: true,
    playsInline: true,
    preload: "auto",
  });
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  const texVideo = new THREE.VideoTexture(video);
  texVideo.colorSpace = THREE.SRGBColorSpace;
  const vidrio = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    roughness: 0.04,
    transmission: 1,
    thickness: 0.8,
    ior: 1.45,
    dispersion: 4,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    side: THREE.DoubleSide,
  });
  const iso = new THREE.Group();
  const ESC_ISO = 2 / ISOTIPO.ancho;
  for (const pts of [
    ISOTIPO.piezas.arriba,
    ISOTIPO.piezas.izquierda,
    ISOTIPO.piezas.abajo,
  ]) {
    const forma = new THREE.Shape(
      pts.map(
        ([x, y]) =>
          new THREE.Vector2(
            (x - ISOTIPO.ancho / 2) * ESC_ISO,
            -(y - ISOTIPO.alto / 2) * ESC_ISO
          )
      )
    );
    const g = new THREE.ExtrudeGeometry(forma, {
      depth: 0.34,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelOffset: -0.05,
      bevelSegments: 5,
      curveSegments: 1,
    });
    g.translate(0, 0, -0.17);
    const m = new THREE.Mesh(g, vidrio);
    m.layers.set(1);
    iso.add(m);
  }
  const pantalla = new THREE.Mesh(
    new THREE.PlaneGeometry(16 / 9, 1),
    new THREE.MeshBasicMaterial({ map: texVideo, toneMapped: false })
  );
  pantalla.layers.set(1);
  // abajo, dentro del charco de luz: de frente queda bajo la ventana (antes se encimaban los dos isotipos)
  iso.position.set(0, 1.35, 0.6);
  iso.scale.setScalar(0.85);
  escena.add(iso);
  pantalla.scale.setScalar(2.0);
  escena.add(pantalla);

  // ── postproceso ──
  const objetivo = new THREE.WebGLRenderTarget(1, 1, {
    type: THREE.HalfFloatType,
    samples: tactil ? 0 : 4,
  });
  const composer = new EffectComposer(renderer, objetivo);
  composer.setPixelRatio(dpr);
  composer.addPass(new RenderPass(escena, camara));
  const rayos = new ShaderPass(RAYOS);
  composer.addPass(rayos);
  const uRayos = rayos.uniforms as {
    uLuz: THREE.IUniform<THREE.Vector2>;
    uFuerza: THREE.IUniform<number>;
  };
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.3, 0.6, 0.86);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const acabado = new ShaderPass(ACABADO);
  composer.addPass(acabado);
  const uAcabado = acabado.uniforms as {
    uTiempo: THREE.IUniform<number>;
    uRes: THREE.IUniform<THREE.Vector2>;
  };
  let conPost = true;

  // el reel solo se ve DENTRO del vidrio: se pinta únicamente en la pasada de transmisión
  pantalla.onBeforeRender = (r) => {
    const rt = r.getRenderTarget();
    const ver =
      rt !== null &&
      rt !== composer.readBuffer &&
      rt !== composer.writeBuffer &&
      rt !== objetivo &&
      rt !== agua.getRenderTarget();
    const m = pantalla.material as THREE.MeshBasicMaterial;
    m.colorWrite = ver;
    // también la profundidad: sin ella, el muro (que se dibuja después) tapaba el vídeo
    m.depthWrite = ver;
  };

  // ── la cámara, plano por plano ──
  const arriba = PIEZAS_MURO[0] as THREE.Vector3[];
  const cA = arriba
    .reduce((s, p) => s.add(p), new THREE.Vector3())
    .divideScalar(arriba.length);
  const recorrido = crearRecorrido([
    { pos: [0, 8.0, 8.8], mira: [0, 0, -1.5], fov: 46, pausa: 0.7, texto: 0 },
    {
      pos: [0, 1.75, 6.9],
      mira: [0, 3.0, -6],
      fov: 40,
      dura: 1.3,
      pausa: 0.7,
      curva: CURVAS.seda,
      texto: 1,
    },
    {
      pos: [2.4, 1.35, 3.6],
      mira: [0, 1.4, 0.6],
      fov: 34,
      dura: 1.0,
      pausa: 0.6,
      curva: CURVAS.suave,
      texto: 2,
    },
    {
      pos: [-1.6, 1.6, 2.4],
      mira: [0, 1.5, 0.6],
      fov: 36,
      dura: 0.9,
      pausa: 0.2,
      curva: CURVAS.seda,
    },
    {
      pos: [cA.x - 0.2, cA.y - 0.4, -3.6],
      mira: [cA.x, cA.y, -9],
      fov: 44,
      dura: 1.0,
      curva: CURVAS.flujo,
    },
    {
      pos: [cA.x, cA.y, -8.4],
      mira: [cA.x, cA.y, -14],
      fov: 52,
      dura: 0.6,
      curva: CURVAS.lineal,
    },
    {
      pos: [cA.x, cA.y + 0.2, -10.5],
      mira: [cA.x, cA.y, -20],
      fov: 46,
      dura: 0.5,
      curva: CURVAS.suave,
    },
    {
      pos: [cA.x, cA.y + 1.4, -16],
      mira: [cA.x, cA.y - 1.5, -40],
      fov: 42,
      dura: 0.9,
      pausa: 0.6,
      curva: CURVAS.suave,
      texto: 3,
    },
  ]);
  // el centro de los huecos, de donde salen los rayos de pantalla
  const centroVentana = new THREE.Vector3(0, ZC, MURO_Z - 0.3);

  const puntero = { x: 0, y: 0, ax: 0, ay: 0, sobre: false };
  const ndc = new THREE.Vector2();
  const rayoCam = new THREE.Raycaster();
  const alMover = (ev: PointerEvent) => {
    puntero.x = (ev.clientX / window.innerWidth) * 2 - 1;
    puntero.y = (ev.clientY / window.innerHeight) * 2 - 1;
    puntero.sobre = true;
  };
  const alSalir = () => {
    puntero.sobre = false;
  };
  window.addEventListener("pointermove", alMover, { passive: true });
  document.addEventListener("pointerleave", alSalir);

  const medir = () => {
    const w = contenedor.clientWidth;
    const h = contenedor.clientHeight;
    if (w < 2 || h < 2) return;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.setSize(w * dpr, h * dpr);
    uAcabado.uRes.value.set(w * dpr, h * dpr);
    camara.aspect = w / h;
    camara.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(medir);
  ro.observe(contenedor);
  medir();
  const vertical = () => camara.aspect < 0.8;

  let pausado = false;
  let vivo = true;
  let raf = 0;
  let previo = performance.now();
  let tiempo = 0;
  let p = 0;
  let cuadros = 0;
  let ultima = previo;
  const posCam = new THREE.Vector3();
  const miraCam = new THREE.Vector3();
  const proyectado = new THREE.Vector3();
  const progreso = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  };
  p = progreso();
  let textoVisible = -2;

  const cuadro = (ahora: number) => {
    raf = 0;
    if (!vivo) return;
    const dt = Math.min(0.05, (ahora - previo) / 1000);
    previo = ahora;
    const corre = !pausado && !quieto;
    if (corre) tiempo += dt;
    const objetivoP = progreso();
    p += (objetivoP - p) * (1 - Math.exp(-dt * 4));
    puntero.ax += (puntero.x - puntero.ax) * (1 - Math.exp(-dt * 2.5));
    puntero.ay += (puntero.y - puntero.ay) * (1 - Math.exp(-dt * 2.5));
    const r = recorrido.evaluar(p, posCam, miraCam);
    const lejos = r.plano >= 5 ? 0 : 1; // al cruzar el muro, sin parallax
    posCam.x += puntero.ax * 0.3 * lejos;
    posCam.y -= puntero.ay * 0.18 * lejos;
    camara.position.copy(posCam);
    camara.lookAt(miraCam);
    const fov = vertical() ? r.fov * 1.45 : r.fov;
    if (Math.abs(camara.fov - fov) > 0.01) {
      camara.fov = fov;
      camara.updateProjectionMatrix();
    }
    // textos: su opacidad la decide el plano (aparecen en la pausa), sin pasar por React
    textos.forEach((el, i) => {
      const o = i === r.texto ? r.opacidad : 0;
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translateY(${((1 - o) * 14).toFixed(1)}px)`;
    });
    if (r.texto !== textoVisible) textoVisible = r.texto;

    iso.rotation.y = -0.5 + Math.sin(tiempo * 0.3) * 0.6 + puntero.ax * 0.25;
    iso.rotation.x = Math.sin(tiempo * 0.4) * 0.05;
    iso.position.y = 1.35 + Math.sin(tiempo * 0.6) * 0.05;
    pantalla.position
      .copy(iso.position)
      .addScaledVector(camara.getWorldDirection(proyectado).normalize(), 1.0);
    pantalla.quaternion.copy(camara.quaternion);
    uAgua.uTiempo.value = tiempo;
    uHaz.uTiempo.value = tiempo;

    // polvo: el rayo del puntero y un paso de simulación
    if (!errorGpu) {
      ndc.set(puntero.x, -puntero.y);
      rayoCam.setFromCamera(ndc, camara);
      uSimV.uRayoO.value.copy(rayoCam.ray.origin);
      uSimV.uRayoD.value.copy(rayoCam.ray.direction);
      uSimV.uRayo.value = puntero.sobre && !tactil ? 1 : 0;
      const pasoDt = corre ? dt : 0;
      uSimP.uDt.value = pasoDt;
      uSimV.uDt.value = pasoDt;
      uSimP.uTiempo.value = tiempo;
      uSimV.uTiempo.value = tiempo;
      if (corre) gpu.compute();
      uPolvo.tPos.value = gpu.getCurrentRenderTarget(vPos).texture;
    }

    // rayos de pantalla: desde el centro de los huecos, si está delante de la cámara
    proyectado.copy(centroVentana).project(camara);
    const delante = proyectado.z < 1 && r.plano < 5;
    const fuera = Math.max(Math.abs(proyectado.x), Math.abs(proyectado.y)) - 1;
    uRayos.uLuz.value.set(proyectado.x * 0.5 + 0.5, proyectado.y * 0.5 + 0.5);
    uRayos.uFuerza.value = delante
      ? 1.7 * (1 - THREE.MathUtils.smoothstep(fuera, 0, 0.8))
      : 0;

    if (estado.listo && video.paused && corre) video.play().catch(() => {});

    renderer.info.reset();
    if (conPost) {
      uAcabado.uTiempo.value = tiempo;
      composer.render(dt);
    } else renderer.render(escena, camara);

    cuadros++;
    if (ahora - ultima > 500) {
      estado.fps = Math.round((cuadros * 1000) / (ahora - ultima));
      estado.llamadas = renderer.info.render.calls;
      estado.capitulo = r.plano < 1 ? 0 : r.plano < 2 ? 1 : r.plano < 4 ? 2 : 3;
      alEstado({ ...estado });
      cuadros = 0;
      ultima = ahora;
    }
    if (!pausado || Math.abs(objetivoP - p) > 0.0004) despertar();
  };
  const despertar = () => {
    if (!raf && vivo && estado.listo) raf = requestAnimationFrame(cuadro);
  };
  const alScroll = () => despertar();
  window.addEventListener("scroll", alScroll, { passive: true });

  // depuración (el laboratorio solo existe en desarrollo)
  (window as unknown as { __sala?: object }).__sala = {
    escena,
    video,
    pantalla,
    renderer,
    composer,
    errorGpu,
  };
  gestor.onLoad = () => {
    renderer
      .compileAsync(escena, camara)
      .catch(() => undefined)
      .then(() => {
        if (!vivo) return;
        estado.listo = true;
        estado.cargado = 1;
        alEstado({ ...estado });
        lienzo.style.opacity = "1";
        despertar();
      });
  };

  return {
    pausar: (x) => {
      pausado = x;
      if (x) video.pause();
      despertar();
    },
    postproceso: (a) => {
      conPost = a;
      despertar();
    },
    liberar: () => {
      vivo = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", alMover);
      document.removeEventListener("pointerleave", alSalir);
      window.removeEventListener("scroll", alScroll);
      video.pause();
      video.removeAttribute("src");
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
          mat.dispose();
        }
      });
      (escena.background as THREE.Texture | null)?.dispose?.();
      entorno?.dispose();
      ventana.dispose();
      gpu.dispose();
      pmrem.dispose();
      agua.dispose();
      objetivo.dispose();
      composer.dispose();
      draco.dispose();
      ktx2.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      lienzo.remove();
    },
  };
}
