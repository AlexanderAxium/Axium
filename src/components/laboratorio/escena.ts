// Laboratorio 3D (2026-10-15): lo que les falta a nuestras escenas para acercarse a hubtown.co.in y
// activetheory.net, probado en una sola página. Se importa con import() desde el cliente.
//
// Lo que se prueba, por capítulo (el scroll mueve la cámara por un recorrido con fotogramas clave):
//   1 · Diseño    isotipo cromado e iridiscente con reflejo real sobre agua (Reflector con shader propio)
//   2 · Software  un río de partículas calculado entero en el vertex shader (Points + ShaderMaterial)
//   3 · IA        las mismas partículas se ordenan en el isotipo (morph en GPU con retraso por partícula)
//   4 · Trabajo   paneles con imágenes y el reel que se doblan con la velocidad del scroll
// Encima, una cadena de postproceso: bloom, aberración cromática que crece con la velocidad, viñeta
// y grano (que además quita las bandas del degradado oscuro).
import * as THREE from "three";
import { Reflector } from "three/addons/objects/Reflector.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ISOTIPO, type Punto } from "~/components/axium/tres/isotipo";

export type Medidas = {
  fps: number;
  llamadas: number;
  triangulos: number;
  particulas: number;
  capitulo: number;
};

export type ControlLab = {
  pausar: (p: boolean) => void;
  postproceso: (activo: boolean) => void;
  liberar: () => void;
};

const PANELES = [
  "/images/highlights/rematch-v15.jpg",
  "/images/proyects/aurore/aurore-portada-yeso.jpg",
  "REEL",
  "/images/highlights/bookit-v10.jpg",
  "/images/proyects/vendiq/bv-reto.jpg",
  "/images/highlights/lumiolearn-v12.jpg",
  "/images/proyects/rematch/rematch-portada-cancha.jpg",
];
const REEL = "/images/hero-propuestas/p33-reel.mp4";

// ── el isotipo: en coordenadas centradas, 2 unidades de ancho ──
const ESCALA = 2 / ISOTIPO.ancho;
const aXY = ([x, y]: Punto) =>
  new THREE.Vector2(
    (x - ISOTIPO.ancho / 2) * ESCALA,
    -(y - ISOTIPO.alto / 2) * ESCALA
  );
const PIEZAS = [
  ISOTIPO.piezas.arriba,
  ISOTIPO.piezas.izquierda,
  ISOTIPO.piezas.abajo,
].map((p) => p.map(aXY));

function dentro(p: THREE.Vector2, pol: THREE.Vector2[]) {
  let c = false;
  for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) {
    const a = pol[i] as THREE.Vector2;
    const b = pol[j] as THREE.Vector2;
    if (
      a.y > p.y !== b.y > p.y &&
      p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x
    )
      c = !c;
  }
  return c;
}

/** n puntos al azar dentro de las tres piezas (muestreo por rechazo) */
function puntosDelIsotipo(n: number) {
  const out = new Float32Array(n * 3);
  const p = new THREE.Vector2();
  let k = 0;
  while (k < n) {
    p.set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 1.8);
    if (!PIEZAS.some((pol) => dentro(p, pol))) continue;
    out[k * 3] = p.x;
    out[k * 3 + 1] = p.y;
    out[k * 3 + 2] = (Math.random() - 0.5) * 0.18;
    k++;
  }
  return out;
}

// ── shaders ──
const RIO_VS = /* glsl */ `
  attribute float aHebra;
  attribute float aT;
  attribute float aSemilla;
  attribute vec3 aDesvio;
  attribute vec3 aLogo;
  uniform float uTiempo;
  uniform float uMorph;
  uniform float uTam;
  uniform float uDpr;
  uniform vec3 uLogoPos;
  uniform float uLogoEscala;
  varying vec3 vColor;
  varying float vAlfa;
  void main() {
    // el río: tres hebras que serpentean hacia el fondo; cada partícula avanza por su hebra
    float t = fract(aT + uTiempo * (0.010 + aSemilla * 0.012));
    float z = -1.5 - t * 34.0;
    float fase = aHebra * 2.1;
    vec3 rio = vec3(
      sin(z * 0.17 + fase) * 2.3 + (aHebra - 1.0) * 0.9,
      -0.72 + sin(z * 0.11 + fase) * 0.22,
      z
    );
    rio += aDesvio * (0.06 + 0.32 * aSemilla * aSemilla);
    // el isotipo: cada partícula tiene su sitio y llega con un retraso propio
    float m = smoothstep(aSemilla * 0.45, aSemilla * 0.45 + 0.55, uMorph);
    vec3 turb = vec3(
      sin(uTiempo * 0.9 + aSemilla * 31.0),
      cos(uTiempo * 0.7 + aSemilla * 17.0),
      sin(uTiempo * 0.5 + aSemilla * 11.0)
    ) * 0.035;
    vec3 logo = uLogoPos + aLogo * uLogoEscala + turb;
    // a mitad de camino se abren en espiral (una curva, no una recta)
    vec3 pos = mix(rio, logo, m);
    pos.xy += vec2(cos(aSemilla * 40.0), sin(aSemilla * 40.0)) * sin(m * 3.14159) * 1.4;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uTam * uDpr * (0.55 + aSemilla) / -mv.z;
    vColor = mix(vec3(0.49, 0.81, 0.76), vec3(0.18, 0.47, 1.0), t);
    vColor = mix(vColor, vec3(0.75, 0.92, 1.0), m * 0.6);
    // se apagan al nacer y al morir en la hebra (no aparecen de golpe)
    vAlfa = smoothstep(0.0, 0.06, t) * smoothstep(1.0, 0.8, t);
    // juntas en el isotipo se apilan miles: cada una pone menos luz
    vAlfa = mix(vAlfa, 0.5, m);
  }
`;
const RIO_FS = /* glsl */ `
  varying vec3 vColor;
  varying float vAlfa;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlfa;
    gl_FragColor = vec4(vColor * a * 0.6, a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const PANEL_VS = /* glsl */ `
  uniform float uVel;
  uniform float uTiempo;
  uniform float uHover;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    // se doblan con la velocidad del scroll y respiran apenas
    p.z += sin(uv.x * 3.14159) * uVel * 0.55;
    p.z += sin(uv.y * 4.0 + uTiempo * 1.3) * 0.015;
    p *= 1.0 + uHover * 0.04;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const PANEL_FS = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uAspectoTex;
  uniform float uAspectoPanel;
  uniform float uVel;
  uniform float uHover;
  uniform float uListo;
  uniform float uVisible;
  varying vec2 vUv;
  float cajaRedonda(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }
  void main() {
    // la imagen cubre el panel sin deformarse (como object-fit: cover)
    vec2 uv = vUv - 0.5;
    if (uAspectoTex > uAspectoPanel) uv.x *= uAspectoPanel / uAspectoTex;
    else uv.y *= uAspectoTex / uAspectoPanel;
    uv += 0.5;
    float s = uVel * 0.012;
    vec3 col = vec3(
      texture2D(uTex, uv + vec2(s, 0.0)).r,
      texture2D(uTex, uv).g,
      texture2D(uTex, uv - vec2(s, 0.0)).b
    );
    col = mix(vec3(0.02, 0.05, 0.12), col, uListo);
    col *= 0.78 + uHover * 0.3;
    // esquinas redondeadas y un filo de luz
    vec2 p = (vUv - 0.5) * vec2(uAspectoPanel, 1.0);
    float d = cajaRedonda(p, vec2(uAspectoPanel, 1.0) * 0.5, 0.06);
    float alfa = smoothstep(0.004, -0.004, d);
    float filo = smoothstep(0.012, 0.0, abs(d + 0.006));
    col += vec3(0.55, 0.85, 1.0) * filo * (0.35 + uHover * 0.6);
    gl_FragColor = vec4(col, alfa * uVisible);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const AGUA = {
  name: "AguaLab",
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
    #include <common>
    #include <fog_pars_vertex>
    void main() {
      vUvP = textureMatrix * vec4(position, 1.0);
      vMundo = (modelMatrix * vec4(position, 1.0)).xyz;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      #include <fog_vertex>
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTiempo;
    varying vec4 vUvP;
    varying vec3 vMundo;
    #include <common>
    #include <fog_pars_fragment>
    void main() {
      // el reflejo se ondula con dos senos cruzados (sin textura de normales)
      vec2 o = vec2(
        sin(vMundo.z * 2.2 + uTiempo * 1.1) + sin(vMundo.x * 1.7 - uTiempo * 0.8),
        cos(vMundo.x * 2.0 + uTiempo * 0.9)
      ) * 0.012;
      vec4 uvp = vUvP;
      uvp.xy += o * uvp.w;
      vec3 reflejo = texture2DProj(tDiffuse, uvp).rgb;
      vec3 agua = vec3(0.006, 0.016, 0.045);
      gl_FragColor = vec4(agua + reflejo * 0.55, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      #include <fog_fragment>
    }
  `,
};

const ACABADO = {
  uniforms: {
    tDiffuse: { value: null },
    uVel: { value: 0 },
    uTiempo: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uVel;
    uniform float uTiempo;
    uniform vec2 uRes;
    varying vec2 vUv;
    void main() {
      vec2 c = vUv - 0.5;
      float d = length(c);
      // aberración cromática: apenas en reposo, más fuerte cuanto más rápido se baja
      vec2 dir = c * (0.0012 + uVel * 0.014) * (0.4 + d);
      vec3 col = vec3(
        texture2D(tDiffuse, vUv + dir).r,
        texture2D(tDiffuse, vUv).g,
        texture2D(tDiffuse, vUv - dir).b
      );
      col *= mix(1.0, smoothstep(0.9, 0.2, d), 0.5);
      float n = fract(sin(dot(vUv * uRes + fract(uTiempo) * 97.0, vec2(12.9898, 78.233))) * 43758.5453);
      col += (n - 0.5) * 0.04;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

// recorrido de la cámara: 9 fotogramas clave repartidos en el scroll (p = i / 8)
const CAMARA: [number, number, number][] = [
  [0, 0.25, 6.4],
  [1.9, 0.55, 5.0],
  [2.7, 0.9, -1.6],
  [1.2, 0.35, -7.5],
  [-0.9, 1.3, -11.5],
  [0, 2.2, -13.2],
  [1.6, 1.3, -22.5],
  [0, 1.0, -26.6],
  [0, 6.9, -27.2],
];
const MIRA: [number, number, number][] = [
  [0, 0.05, 0],
  [0, 0, 0],
  [0, -0.6, -8],
  [0, -0.7, -15],
  [0, 1.6, -22],
  [0, 2.2, -22],
  [0, 1.0, -34],
  [0, 1.0, -34],
  [0, 6.9, -34],
];

export function crearLaboratorio(
  contenedor: HTMLElement,
  alMedir: (m: Medidas) => void
): ControlLab | null {
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
  const dpr = Math.min(window.devicePixelRatio || 1, tactil ? 1.25 : 1.5);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.info.autoReset = false;
  const lienzo = renderer.domElement;
  lienzo.style.cssText =
    "display:block;width:100%;height:100%;opacity:0;transition:opacity .8s ease";
  contenedor.appendChild(lienzo);

  const escena = new THREE.Scene();
  const fondo = new THREE.Color("#030818");
  escena.background = fondo;
  escena.fog = new THREE.FogExp2(fondo, 0.045);
  const pmrem = new THREE.PMREMGenerator(renderer);
  // entorno oscuro con tiras de luz de color: el cromo refleja esas tiras sobre negro (con el
  // RoomEnvironment, una sala blanca, el cromo se veía blanco entero)
  const salaLuces = new THREE.Scene();
  salaLuces.background = new THREE.Color("#020409");
  for (const [color, x, y, z, w, h, k] of [
    ["#5aa9ff", -4, 1.5, 2, 0.6, 5, 6],
    ["#7ecfc3", 4, 0.5, 1, 0.4, 4, 5],
    ["#b58cff", 0, 4, -3, 6, 0.4, 4],
    ["#ffffff", 2, -3, 3, 3, 0.25, 3],
  ] as const) {
    const tira = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(k),
        side: THREE.DoubleSide,
      })
    );
    tira.position.set(x, y, z);
    tira.lookAt(0, 0, 0);
    salaLuces.add(tira);
  }
  const entorno = pmrem.fromScene(salaLuces, 0.02).texture;
  salaLuces.traverse((o) => {
    const m = o as THREE.Mesh;
    m.geometry?.dispose();
    (m.material as THREE.Material | undefined)?.dispose();
  });
  escena.environment = entorno;
  escena.environmentIntensity = 1;

  const camara = new THREE.PerspectiveCamera(36, 1, 0.1, 120);
  const curvaCam = new THREE.CatmullRomCurve3(
    CAMARA.map((v) => new THREE.Vector3(...v))
  );
  const curvaMira = new THREE.CatmullRomCurve3(
    MIRA.map((v) => new THREE.Vector3(...v))
  );

  // ── 1 · el isotipo cromado ──
  const cromo = new THREE.MeshPhysicalMaterial({
    color: "#c9d6f5",
    metalness: 1,
    roughness: 0.2,
    iridescence: 1,
    iridescenceIOR: 1.6,
    iridescenceThicknessRange: [120, 720],
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  });
  const iso = new THREE.Group();
  for (const pol of PIEZAS) {
    const g = new THREE.ExtrudeGeometry(new THREE.Shape(pol), {
      depth: 0.34,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelOffset: -0.05,
      bevelSegments: 6,
      curveSegments: 1,
    });
    g.translate(0, 0, -0.17);
    iso.add(new THREE.Mesh(g, cromo));
  }
  iso.position.set(0, 0.15, 0);
  escena.add(iso);
  const luzA = new THREE.PointLight("#5aa9ff", 6, 12, 1.6);
  luzA.position.set(-2.5, 1.5, 2);
  const luzB = new THREE.PointLight("#7ecfc3", 4, 10, 1.6);
  luzB.position.set(2.5, -0.5, 1.5);
  escena.add(luzA, luzB);

  // el agua: un espejo que vuelve a dibujar la escena desde abajo, a media resolución
  const agua = new Reflector(new THREE.PlaneGeometry(80, 80), {
    textureWidth: Math.round(window.innerWidth * dpr * (tactil ? 0.3 : 0.5)),
    textureHeight: Math.round(window.innerHeight * dpr * (tactil ? 0.3 : 0.5)),
    clipBias: 0.003,
    shader: AGUA,
  });
  agua.rotation.x = -Math.PI / 2;
  agua.position.set(0, -1.05, -20);
  const matAgua = agua.material as THREE.ShaderMaterial;
  matAgua.fog = true;
  // se añaden los de la niebla sin clonar los suyos: mergeUniforms no copia la textura del render
  // target y el reflejo quedaba negro (three avisa: «Textures of render targets cannot be cloned»)
  Object.assign(
    matAgua.uniforms,
    THREE.UniformsUtils.clone(THREE.UniformsLib.fog)
  );
  const uAgua = matAgua.uniforms as { uTiempo: THREE.IUniform<number> };
  escena.add(agua);

  // ── 2 y 3 · el río de partículas que se vuelve isotipo ──
  const N = tactil ? 16000 : 40000;
  const gRio = new THREE.BufferGeometry();
  const hebra = new Float32Array(N);
  const tt = new Float32Array(N);
  const semilla = new Float32Array(N);
  const desvio = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    hebra[i] = i % 3;
    tt[i] = Math.random();
    semilla[i] = Math.random();
    const v = new THREE.Vector3().randomDirection();
    desvio.set([v.x, v.y * 0.45, v.z], i * 3);
  }
  gRio.setAttribute("position", new THREE.BufferAttribute(desvio.slice(), 3));
  gRio.setAttribute("aHebra", new THREE.BufferAttribute(hebra, 1));
  gRio.setAttribute("aT", new THREE.BufferAttribute(tt, 1));
  gRio.setAttribute("aSemilla", new THREE.BufferAttribute(semilla, 1));
  gRio.setAttribute("aDesvio", new THREE.BufferAttribute(desvio, 3));
  gRio.setAttribute("aLogo", new THREE.BufferAttribute(puntosDelIsotipo(N), 3));
  const uRio = {
    uTiempo: { value: 0 },
    uMorph: { value: 0 },
    uTam: { value: tactil ? 30 : 24 },
    uDpr: { value: dpr },
    uLogoPos: { value: new THREE.Vector3(0, 2.2, -22) },
    uLogoEscala: { value: 2.6 },
  };
  const matRio = new THREE.ShaderMaterial({
    vertexShader: RIO_VS,
    fragmentShader: RIO_FS,
    uniforms: uRio,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const rio = new THREE.Points(gRio, matRio);
  rio.frustumCulled = false; // las posiciones las calcula el shader
  escena.add(rio);

  // ── 4 · los paneles en hélice ──
  const helice = new THREE.Group();
  helice.position.set(0, 0, -34);
  escena.add(helice);
  const cargador = new THREE.TextureLoader();
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
  const paneles = PANELES.map((src, i) => {
    const ancho = 2.3;
    const aspecto = 1.6;
    const u = {
      uTex: { value: null as THREE.Texture | null },
      uAspectoTex: { value: 1.6 },
      uAspectoPanel: { value: aspecto },
      uVel: { value: 0 },
      uTiempo: { value: 0 },
      uHover: { value: 0 },
      uListo: { value: 0 },
      uVisible: { value: 0 },
    };
    const mat = new THREE.ShaderMaterial({
      vertexShader: PANEL_VS,
      fragmentShader: PANEL_FS,
      uniforms: u,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(ancho, ancho / aspecto, 28, 14),
      mat
    );
    const a = i * 0.95;
    m.position.set(Math.sin(a) * 3.3, -0.1 + i * 1.18, Math.cos(a) * 3.3);
    m.rotation.y = a;
    helice.add(m);
    const listo = (tex: THREE.Texture, w: number, h: number) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      u.uTex.value = tex;
      u.uAspectoTex.value = w / h;
    };
    if (src === "REEL") {
      const vt = new THREE.VideoTexture(video);
      video.addEventListener(
        "loadeddata",
        () => listo(vt, video.videoWidth, video.videoHeight),
        { once: true }
      );
    } else {
      cargador.load(src, (tex) => {
        const img = tex.image as HTMLImageElement;
        listo(tex, img.naturalWidth, img.naturalHeight);
      });
    }
    return { m, u, hover: 0 };
  });

  // ── postproceso ──
  const objetivo = new THREE.WebGLRenderTarget(1, 1, {
    type: THREE.HalfFloatType,
    samples: tactil ? 0 : 4,
  });
  const composer = new EffectComposer(renderer, objetivo);
  composer.setPixelRatio(dpr);
  composer.addPass(new RenderPass(escena, camara));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.42, 0.45, 0.62);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const acabado = new ShaderPass(ACABADO);
  composer.addPass(acabado);
  const uAcabado = acabado.uniforms as {
    uVel: THREE.IUniform<number>;
    uTiempo: THREE.IUniform<number>;
    uRes: THREE.IUniform<THREE.Vector2>;
  };
  let conPost = true;

  // ── entrada del usuario ──
  const puntero = { x: 0, y: 0, ax: 0, ay: 0 };
  const rayo = new THREE.Raycaster();
  const ndc = new THREE.Vector2(9, 9);
  const alMover = (ev: PointerEvent) => {
    puntero.x = (ev.clientX / window.innerWidth) * 2 - 1;
    puntero.y = (ev.clientY / window.innerHeight) * 2 - 1;
    ndc.set(puntero.x, -puntero.y);
  };
  window.addEventListener("pointermove", alMover, { passive: true });

  const medir = () => {
    const w = contenedor.clientWidth;
    const h = contenedor.clientHeight;
    if (w < 2 || h < 2) return;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.setSize(w * dpr, h * dpr);
    uAcabado.uRes.value.set(w * dpr, h * dpr);
    camara.aspect = w / h;
    // en vertical se abre el campo para que el isotipo y los paneles quepan
    camara.fov = w / h < 0.8 ? 52 : 36;
    camara.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(medir);
  ro.observe(contenedor);
  medir();

  // ── bucle ──
  let pausado = false;
  let vivo = true;
  let raf = 0;
  let previo = performance.now();
  let tiempo = 0;
  let pSuave = 0;
  let pPrevio = 0;
  let vel = 0;
  let cuadros = 0;
  let ultimaMedida = previo;
  const posCam = new THREE.Vector3();
  const miraCam = new THREE.Vector3();
  const progreso = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  };
  pSuave = progreso();

  const cuadro = (ahora: number) => {
    raf = 0;
    if (!vivo) return;
    const dt = Math.min(0.05, (ahora - previo) / 1000);
    previo = ahora;
    if (!pausado && !quieto) tiempo += dt;
    // el scroll ya viene suavizado por Lenis; aquí se amortigua un poco más para la cámara
    const p = progreso();
    pSuave += (p - pSuave) * (1 - Math.exp(-dt * 7));
    const v = dt > 0 ? Math.abs(pSuave - pPrevio) / dt : 0;
    pPrevio = pSuave;
    vel += (Math.min(1, v * 6) - vel) * (1 - Math.exp(-dt * 8));
    puntero.ax += (puntero.x - puntero.ax) * (1 - Math.exp(-dt * 3));
    puntero.ay += (puntero.y - puntero.ay) * (1 - Math.exp(-dt * 3));

    curvaCam.getPoint(pSuave, posCam);
    curvaMira.getPoint(pSuave, miraCam);
    posCam.x += puntero.ax * 0.35;
    posCam.y -= puntero.ay * 0.2;
    camara.position.copy(posCam);
    camara.lookAt(miraCam);

    iso.rotation.y = -0.4 + tiempo * 0.25 + puntero.ax * 0.3;
    iso.rotation.x = Math.sin(tiempo * 0.5) * 0.06;
    uRio.uTiempo.value = tiempo;
    uRio.uMorph.value = THREE.MathUtils.smoothstep(pSuave, 0.42, 0.64);
    uAgua.uTiempo.value = tiempo;
    helice.rotation.y = pSuave * 2.4 + tiempo * 0.03;

    // panel bajo el puntero
    let bajo = -1;
    if (pSuave > 0.68) {
      rayo.setFromCamera(ndc, camara);
      const g = rayo.intersectObjects(
        paneles.map((x) => x.m),
        false
      )[0];
      if (g) bajo = paneles.findIndex((x) => x.m === g.object);
    }
    contenedor.style.cursor = bajo >= 0 ? "pointer" : "";
    paneles.forEach((x, i) => {
      x.hover += ((i === bajo ? 1 : 0) - x.hover) * (1 - Math.exp(-dt * 10));
      x.u.uHover.value = x.hover;
      x.u.uVel.value = vel;
      x.u.uTiempo.value = tiempo;
      // aparecen al llegar a su capítulo; antes ensuciaban el fondo de los otros
      x.u.uVisible.value = THREE.MathUtils.smoothstep(pSuave, 0.7, 0.8);
      if (x.u.uTex.value)
        x.u.uListo.value = Math.min(1, x.u.uListo.value + dt * 1.5);
    });
    // el agua solo se dibuja cuando se ve (el espejo duplica el coste de la escena)
    agua.visible = camara.position.y > -0.9;
    if (pSuave > 0.6 && video.paused && !pausado) video.play().catch(() => {});

    renderer.info.reset();
    if (conPost) {
      uAcabado.uVel.value = vel;
      uAcabado.uTiempo.value = tiempo;
      composer.render(dt);
    } else renderer.render(escena, camara);

    cuadros++;
    if (ahora - ultimaMedida > 500) {
      alMedir({
        fps: Math.round((cuadros * 1000) / (ahora - ultimaMedida)),
        llamadas: renderer.info.render.calls,
        triangulos: renderer.info.render.triangles,
        particulas: N,
        capitulo: pSuave < 0.22 ? 0 : pSuave < 0.47 ? 1 : pSuave < 0.72 ? 2 : 3,
      });
      cuadros = 0;
      ultimaMedida = ahora;
    }
    if (lienzo.style.opacity !== "1") lienzo.style.opacity = "1";
    if (!pausado || Math.abs(p - pSuave) > 0.0005) despertar();
  };
  const despertar = () => {
    if (!raf && vivo) raf = requestAnimationFrame(cuadro);
  };
  // en pausa el reloj se detiene, pero el scroll sigue moviendo la cámara
  const alScroll = () => despertar();
  window.addEventListener("scroll", alScroll, { passive: true });
  renderer
    .compileAsync(escena, camara)
    .catch(() => undefined)
    .then(() => despertar());

  return {
    pausar: (p) => {
      pausado = p;
      if (p) video.pause();
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
          for (const val of Object.values(mat))
            if (val instanceof THREE.Texture) val.dispose();
          const u = (mat as THREE.ShaderMaterial).uniforms;
          if (u)
            for (const x of Object.values(u))
              if (x.value instanceof THREE.Texture) x.value.dispose();
          mat.dispose();
        }
      });
      agua.dispose();
      objetivo.dispose();
      composer.dispose();
      entorno.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      lienzo.remove();
    },
  };
}
