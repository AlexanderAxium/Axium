// Laboratorio 3D · galería (2026-10-15): la técnica de unseen.co/projects. La rejilla es HTML normal
// (accesible, indexable, con sus <img>), y cada imagen se reemplaza por un plano WebGL colocado
// EXACTAMENTE donde está su caja en el DOM: la cámara se calcula para que 1 unidad = 1 px.
// Con eso, el shader puede hacer lo que el CSS no:
//   · al acercarse al borde de arriba, el plano se enrolla hacia atrás sobre un cilindro;
//   · con la velocidad del scroll se curva y separa los colores;
//   · un paso de lente al final: distorsión de barril, aberración en los bordes y grano.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

export type ControlGaleria = {
  pausar: (p: boolean) => void;
  postproceso: (activo: boolean) => void;
  liberar: () => void;
};

const VS = /* glsl */ `
  uniform vec2 uPantalla;   // ancho y alto de la ventana en px
  uniform float uZona;      // px desde arriba donde empieza a enrollarse
  uniform float uRadio;     // radio del cilindro en px
  uniform float uVel;
  varying vec2 vUv;
  varying float vSombra;
  void main() {
    vUv = uv;
    vec4 m = modelMatrix * vec4(position, 1.0);
    // el eje del cilindro, en coordenadas del mundo (el origen es el centro de la pantalla)
    float eje = uPantalla.y * 0.5 - uZona;
    float s = m.y - eje;          // cuánto pasó el vértice por encima del eje
    float ang = 0.0;
    if (s > 0.0) {
      ang = s / uRadio;
      float a = min(ang, 3.14159);
      m.y = eje + uRadio * sin(a);
      m.z = -uRadio * (1.0 - cos(a));
      // pasada media vuelta, sigue plano hacia abajo, por detrás
      if (ang > 3.14159) { m.y -= (s - 3.14159 * uRadio); }
    }
    // con velocidad, el plano entero se abomba
    m.z += sin(uv.x * 3.14159) * uVel * 70.0;
    vSombra = clamp(ang / 3.14159, 0.0, 1.0);
    gl_Position = projectionMatrix * viewMatrix * m;
  }
`;

const FS = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uAspectoTex;
  uniform vec2 uTam;        // tamaño del plano en px
  uniform float uVel;
  uniform float uHover;
  uniform float uListo;
  uniform float uPintado;   // 1 = se revela con una mancha pintada (overworldaudio.com)
  uniform float uRevelado;  // 0…1, sale del scroll
  uniform float uTiempo;
  varying vec2 vUv;
  varying float vSombra;
  float cajaRedonda(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float ruido(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * ruido(p); p = p * 2.03 + 17.1; a *= 0.5; }
    return v;
  }
  void main() {
    float aspecto = uTam.x / uTam.y;
    vec2 uv = vUv - 0.5;
    if (uAspectoTex > aspecto) uv.x *= aspecto / uAspectoTex;
    else uv.y *= uAspectoTex / aspecto;
    uv *= 1.0 - uHover * 0.06;   // al pasar el ratón, la imagen se acerca dentro de su caja
    uv += 0.5;
    float d = uVel * 0.014;
    vec3 col = vec3(
      texture2D(uTex, uv + vec2(0.0, d)).r,
      texture2D(uTex, uv).g,
      texture2D(uTex, uv - vec2(0.0, d)).b
    );
    col = mix(vec3(0.86, 0.86, 0.88), col, uListo);
    col *= 1.0 - vSombra * 0.55;        // al enrollarse se oscurece
    vec2 p = (vUv - 0.5) * uTam;
    float alfa = smoothstep(0.75, -0.75, cajaRedonda(p, uTam * 0.5, 14.0));
    if (uPintado > 0.5) {
      // la mancha crece desde el centro; su borde lo rompen dos ruidos: uno de manchas y otro
      // estirado, de trazos de pincel. Junto al borde, un filo de luz fría
      vec2 q = (vUv - 0.5) * vec2(aspecto, 1.0);
      float r = length(q) / (0.5 * sqrt(aspecto * aspecto + 1.0));
      float n = fbm(vUv * vec2(aspecto, 1.0) * 4.0 + uTiempo * 0.015);
      float trazo = fbm(vec2(vUv.x * 2.5, vUv.y * 24.0) + 7.0);
      float borde = r + (n - 0.5) * 0.55 + (trazo - 0.5) * 0.3;
      float u = uRevelado * 1.45;
      float m = smoothstep(u, u - 0.04, borde);
      float filo = smoothstep(u - 0.14, u - 0.02, borde) * m;
      col += vec3(0.7, 0.95, 1.0) * filo * 0.7;
      alfa *= m;
    }
    gl_FragColor = vec4(col, alfa);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const LENTE = {
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
      float r2 = dot(c, c);
      // barril: los bordes se curvan un poco, como mirar por un objetivo
      vec2 uv = 0.5 + c * (1.0 - 0.07 * r2);
      vec2 dir = c * (0.004 + uVel * 0.01) * r2 * 4.0;
      vec3 col = vec3(
        texture2D(tDiffuse, uv + dir).r,
        texture2D(tDiffuse, uv).g,
        texture2D(tDiffuse, uv - dir).b
      );
      col *= 1.0 - r2 * 0.35;
      float n = fract(sin(dot(vUv * uRes + fract(uTiempo) * 91.0, vec2(12.9898, 78.233))) * 43758.5453);
      col += (n - 0.5) * 0.03;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

export function crearGaleria(
  contenedor: HTMLElement,
  tarjetas: HTMLElement[]
): ControlGaleria | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true });
  } catch {
    return null;
  }
  const tactil = window.matchMedia("(pointer: coarse)").matches;
  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, tactil ? 1.5 : 2);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const lienzo = renderer.domElement;
  lienzo.style.cssText = "display:block;width:100%;height:100%";
  contenedor.appendChild(lienzo);

  const escena = new THREE.Scene();
  const CLARO = new THREE.Color("#E9E9EC");
  const OSCURO = new THREE.Color("#0D1220");
  const fondo = CLARO.clone();
  escena.background = fondo;
  const oscuro = document.querySelector<HTMLElement>("[data-oscuro]");
  // a 800 px de distancia, el campo de visión se ajusta para que 1 unidad = 1 px en z = 0
  const DIST = 800;
  const camara = new THREE.PerspectiveCamera(50, 1, 10, 4000);
  camara.position.z = DIST;

  const W = { ancho: 1, alto: 1 };
  const comunes = {
    uPantalla: { value: new THREE.Vector2(1, 1) },
    uZona: { value: 160 },
    uRadio: { value: 150 },
    uVel: { value: 0 },
  };
  const geo = new THREE.PlaneGeometry(1, 1, 24, 48);
  const cargador = new THREE.TextureLoader();
  const videos: HTMLVideoElement[] = [];

  const planos = tarjetas.map((el) => {
    const caja = el.querySelector<HTMLElement>("[data-medio]") ?? el;
    const u = {
      ...comunes,
      uTex: { value: null as THREE.Texture | null },
      uAspectoTex: { value: 1.5 },
      uTam: { value: new THREE.Vector2(1, 1) },
      uHover: { value: 0 },
      uListo: { value: 0 },
      uPintado: { value: el.dataset.pintado !== undefined ? 1 : 0 },
      uRevelado: { value: 0 },
      uTiempo: { value: 0 },
    };
    const mat = new THREE.ShaderMaterial({
      vertexShader: VS,
      fragmentShader: FS,
      uniforms: u,
      transparent: true,
    });
    const malla = new THREE.Mesh(geo, mat);
    malla.frustumCulled = false; // el shader lo dobla fuera de su caja
    escena.add(malla);
    const listo = (tex: THREE.Texture, w: number, h: number) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      u.uTex.value = tex;
      u.uAspectoTex.value = w / h;
    };
    const video = el.dataset.video;
    if (video) {
      const v = document.createElement("video");
      Object.assign(v, {
        src: video,
        muted: true,
        loop: true,
        playsInline: true,
        preload: "auto",
      });
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
      const vt = new THREE.VideoTexture(v);
      v.addEventListener(
        "loadeddata",
        () => listo(vt, v.videoWidth, v.videoHeight),
        { once: true }
      );
      if (!quieto) v.play().catch(() => {});
      videos.push(v);
    } else if (el.dataset.src) {
      cargador.load(el.dataset.src, (tex) => {
        const img = tex.image as HTMLImageElement;
        listo(tex, img.naturalWidth, img.naturalHeight);
      });
    }
    const estado = { hover: 0, destino: 0 };
    const entrar = () => {
      estado.destino = 1;
      despertar();
    };
    const salir = () => {
      estado.destino = 0;
      despertar();
    };
    el.addEventListener("pointerenter", entrar);
    el.addEventListener("pointerleave", salir);
    return { el, caja, malla, u, estado, entrar, salir };
  });

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(dpr);
  composer.addPass(new RenderPass(escena, camara));
  const lente = new ShaderPass(LENTE);
  composer.addPass(lente);
  composer.addPass(new OutputPass());
  const uLente = lente.uniforms as {
    uVel: THREE.IUniform<number>;
    uTiempo: THREE.IUniform<number>;
    uRes: THREE.IUniform<THREE.Vector2>;
  };
  let conPost = true;

  const medir = () => {
    W.ancho = window.innerWidth;
    W.alto = window.innerHeight;
    renderer.setSize(W.ancho, W.alto, false);
    composer.setSize(W.ancho, W.alto);
    uLente.uRes.value.set(W.ancho * dpr, W.alto * dpr);
    camara.aspect = W.ancho / W.alto;
    camara.fov = THREE.MathUtils.radToDeg(2 * Math.atan(W.alto / 2 / DIST));
    camara.updateProjectionMatrix();
    comunes.uPantalla.value.set(W.ancho, W.alto);
    comunes.uZona.value = Math.min(200, W.alto * 0.2);
    comunes.uRadio.value = Math.min(170, W.alto * 0.17);
    despertar();
  };
  window.addEventListener("resize", medir);

  // ── bucle: cada cuadro copia la caja del DOM al plano ──
  let pausado = false;
  let vivo = true;
  let raf = 0;
  let previo = performance.now();
  let tiempo = 0;
  let scrollPrevio = window.scrollY;
  let vel = 0;
  const cuadro = (ahora: number) => {
    raf = 0;
    if (!vivo) return;
    const dt = Math.min(0.05, (ahora - previo) / 1000);
    previo = ahora;
    if (!pausado) tiempo += dt;
    const y = window.scrollY;
    const v = dt > 0 ? (y - scrollPrevio) / dt : 0;
    scrollPrevio = y;
    vel +=
      (Math.max(-1, Math.min(1, v / 2500)) - vel) * (1 - Math.exp(-dt * 8));
    comunes.uVel.value = Math.abs(vel);
    // al llegar a la sección oscura, el fondo del lienzo se apaga (el DOM no puede taparlo: va detrás)
    if (oscuro) {
      const t = oscuro.getBoundingClientRect().top;
      fondo.lerpColors(
        CLARO,
        OSCURO,
        THREE.MathUtils.smoothstep(1 - t / W.alto, 0.1, 0.7)
      );
    }
    let sigue = Math.abs(vel) > 0.002;
    for (const p of planos) {
      const r = p.caja.getBoundingClientRect();
      p.malla.scale.set(r.width, r.height, 1);
      p.malla.position.set(
        r.left + r.width / 2 - W.ancho / 2,
        W.alto / 2 - (r.top + r.height / 2),
        0
      );
      p.u.uTam.value.set(r.width, r.height);
      p.estado.hover +=
        (p.estado.destino - p.estado.hover) * (1 - Math.exp(-dt * 9));
      if (Math.abs(p.estado.destino - p.estado.hover) > 0.002) sigue = true;
      p.u.uHover.value = p.estado.hover;
      if (p.u.uPintado.value > 0.5) {
        // de cuando su centro asoma por abajo hasta que llega al tercio de arriba
        const centro = r.top + r.height / 2;
        p.u.uRevelado.value = THREE.MathUtils.smoothstep(
          1 - (centro - W.alto * 0.35) / (W.alto * 0.8),
          0,
          1
        );
        p.u.uTiempo.value = tiempo;
      }
      if (p.u.uTex.value && p.u.uListo.value < 1) {
        p.u.uListo.value = Math.min(1, p.u.uListo.value + dt * 2);
        sigue = true;
      }
    }
    if (conPost) {
      uLente.uVel.value = Math.abs(vel);
      uLente.uTiempo.value = tiempo;
      composer.render(dt);
    } else renderer.render(escena, camara);
    // con vídeos andando hay que seguir dibujando; si no, solo mientras algo se mueva
    if (sigue || (!pausado && !quieto && videos.length)) despertar();
  };
  const despertar = () => {
    if (!raf && vivo) raf = requestAnimationFrame(cuadro);
  };
  const alScroll = () => despertar();
  window.addEventListener("scroll", alScroll, { passive: true });
  medir();
  renderer
    .compileAsync(escena, camara)
    .catch(() => undefined)
    .then(() => {
      contenedor.dataset.gl = "listo";
      despertar();
    });

  return {
    pausar: (p) => {
      pausado = p;
      for (const v of videos) {
        if (p) v.pause();
        else v.play().catch(() => {});
      }
      despertar();
    },
    postproceso: (a) => {
      conPost = a;
      despertar();
    },
    liberar: () => {
      vivo = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", medir);
      window.removeEventListener("scroll", alScroll);
      for (const p of planos) {
        p.el.removeEventListener("pointerenter", p.entrar);
        p.el.removeEventListener("pointerleave", p.salir);
        p.u.uTex.value?.dispose();
        (p.malla.material as THREE.Material).dispose();
      }
      for (const v of videos) {
        v.pause();
        v.removeAttribute("src");
      }
      geo.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      lienzo.remove();
      delete contenedor.dataset.gl;
    },
  };
}
