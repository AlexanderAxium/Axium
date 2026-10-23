// Laboratorio 3D · terreno que se talla (2026-10-15). La técnica del capítulo 1 de Unseen («The
// Symphony Of Vines»): un plano deformado por ruido en el vertex shader y un render target donde el
// puntero «pinta» con un pincel blando; el vertex shader lee esa textura y hunde el terreno.
//   · la altura es ruido fbm (crestas) − el trazo del puntero; la normal sale por diferencias finitas
//   · se dibuja como un mapa topográfico: curvas de nivel con fwidth (ancho constante en pantalla)
//   · el trazo se cura solo, despacio: cada cuadro se multiplica por algo menos que 1
// Unseen: el raycast contra un terreno deformado en la GPU no es exacto; usan un plano invisible a
// media altura. Acá igual: el puntero se proyecta sobre el plano y = 0.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import {
  GLSL_SIMPLEX,
  type Medidas,
  crearLab,
  liberarEscena,
} from "~/components/laboratorio/base";

const TAM = 34; // lado del terreno en unidades

const PINCEL_FS = /* glsl */ `
  uniform sampler2D tPrevio;
  uniform vec2 uPos;
  uniform float uActivo;
  uniform float uRadio;
  varying vec2 vUv;
  void main() {
    float previo = texture2D(tPrevio, vUv).r * 0.996;   // se cura despacio
    float d = distance(vUv, uPos);
    float pincel = smoothstep(uRadio, 0.0, d) * uActivo * 0.08;
    gl_FragColor = vec4(min(previo + pincel, 1.0), 0.0, 0.0, 1.0);
  }
`;
const QUAD_VS = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const ALTURA = /* glsl */ `
  uniform sampler2D tTrazo;
  uniform float uTiempo;
  ${GLSL_SIMPLEX}
  float crestas(vec2 p) {
    float v = 0.0, a = 0.55;
    for (int i = 0; i < 5; i++) {
      float n = 1.0 - abs(snoise(vec3(p, uTiempo * 0.015 + float(i) * 3.1)));
      v += n * n * a;
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }
  float altura(vec2 xz, vec2 uv) {
    float h = crestas(xz * 0.075) * 3.4 - 1.6;
    h -= texture2D(tTrazo, uv).r * 2.6;   // lo que talla el puntero
    return h;
  }
`;
const TERRENO_VS = /* glsl */ `
  ${ALTURA}
  varying float vAltura;
  varying vec3 vNormal;
  varying vec3 vMundo;
  varying float vTrazo;
  void main() {
    vec3 p = position;   // plano en XZ (la geometría ya está rotada)
    vec2 e = vec2(${(TAM / 256).toFixed(4)}, 0.0);
    vec2 euv = vec2(1.0 / 256.0, 0.0);
    float h = altura(p.xz, uv);
    float hx = altura(p.xz + e.xy, uv + euv.xy);
    float hz = altura(p.xz + e.yx, uv - euv.yx);
    vNormal = normalize(vec3(h - hx, e.x, h - hz));
    p.y = h;
    vAltura = h;
    vTrazo = texture2D(tTrazo, uv).r;
    vec4 m = modelMatrix * vec4(p, 1.0);
    vMundo = m.xyz;
    gl_Position = projectionMatrix * viewMatrix * m;
  }
`;
const TERRENO_FS = /* glsl */ `
  uniform vec3 uFondo;
  varying float vAltura;
  varying vec3 vNormal;
  varying vec3 vMundo;
  varying float vTrazo;
  void main() {
    vec3 n = normalize(vNormal);
    vec3 luz = normalize(vec3(-0.5, 0.8, 0.3));
    float dif = max(dot(n, luz), 0.0);
    vec3 base = mix(vec3(0.02, 0.035, 0.08), vec3(0.08, 0.14, 0.26), smoothstep(-2.0, 2.0, vAltura));
    vec3 col = base * (0.25 + 1.6 * dif);
    // curvas de nivel cada 0,25: ancho constante en pantalla gracias a fwidth
    float k = vAltura * 4.0;
    float f = abs(fract(k - 0.5) - 0.5) / fwidth(k);
    float linea = 1.0 - smoothstep(0.0, 1.3, f);
    float mayor = 1.0 - smoothstep(0.0, 1.6, abs(fract(vAltura - 0.5) - 0.5) / fwidth(vAltura));
    vec3 teal = vec3(0.49, 0.81, 0.76);
    col += teal * linea * 0.12 + vec3(0.75, 0.95, 1.0) * mayor * 0.3;
    // donde talló el puntero, el valle brilla cálido
    col += vec3(1.0, 0.55, 0.25) * smoothstep(0.05, 0.6, vTrazo) * (0.3 + linea * 1.2);
    float d = length(vMundo - cameraPosition);
    col = mix(col, uFondo, smoothstep(14.0, 40.0, d));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function crear(el: HTMLElement, alMedir: (m: Medidas) => void) {
  return crearLab(
    el,
    ({ renderer, dpr, tactil, puntero }) => {
      const fondo = new THREE.Color("#04070f");
      const escena = new THREE.Scene();
      escena.background = fondo;
      const camara = new THREE.PerspectiveCamera(38, 1, 0.1, 120);

      // el trazo del puntero, en dos render targets que se alternan
      const opciones = { type: THREE.HalfFloatType, depthBuffer: false };
      let rtA = new THREE.WebGLRenderTarget(512, 512, opciones);
      let rtB = new THREE.WebGLRenderTarget(512, 512, opciones);
      const uPincel = {
        tPrevio: { value: rtA.texture as THREE.Texture },
        uPos: { value: new THREE.Vector2(-1, -1) },
        uActivo: { value: 0 },
        uRadio: { value: 0.045 },
      };
      const escenaPincel = new THREE.Scene();
      const quad = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({
          vertexShader: QUAD_VS,
          fragmentShader: PINCEL_FS,
          uniforms: uPincel,
          depthTest: false,
        })
      );
      escenaPincel.add(quad);
      const camQuad = new THREE.Camera();

      const SEG = tactil ? 160 : 256;
      const geo = new THREE.PlaneGeometry(TAM, TAM, SEG, SEG);
      geo.rotateX(-Math.PI / 2);
      const uTerreno = {
        tTrazo: { value: rtA.texture as THREE.Texture },
        uTiempo: { value: 0 },
        uFondo: { value: fondo },
      };
      const terreno = new THREE.Mesh(
        geo,
        new THREE.ShaderMaterial({
          vertexShader: TERRENO_VS,
          fragmentShader: TERRENO_FS,
          uniforms: uTerreno,
        })
      );
      terreno.frustumCulled = false;
      escena.add(terreno);

      const composer = new EffectComposer(renderer);
      composer.setPixelRatio(dpr);
      composer.addPass(new RenderPass(escena, camara));
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(1, 1),
        0.45,
        0.4,
        0.42
      );
      composer.addPass(bloom);
      composer.addPass(new OutputPass());

      const rayo = new THREE.Raycaster();
      const plano = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const golpe = new THREE.Vector3();
      const ndc = new THREE.Vector2();
      const suave = { x: 0, y: 0 };

      return {
        medir: (w, h) => {
          camara.aspect = w / h;
          camara.fov = w / h < 0.8 ? 58 : 38;
          camara.updateProjectionMatrix();
          composer.setSize(w, h);
          bloom.setSize(w * dpr, h * dpr);
        },
        cuadro: (dt, t) => {
          suave.x += (puntero.x - suave.x) * 0.05;
          suave.y += (puntero.y - suave.y) * 0.05;
          const ang = t * 0.04 + suave.x * 0.25;
          camara.position.set(
            Math.sin(ang) * 17,
            10.5 + suave.y * 1.5,
            Math.cos(ang) * 17
          );
          camara.lookAt(0, -0.8, 0);
          uTerreno.uTiempo.value = t;
          // el puntero sobre el plano y = 0 → coordenadas de textura del terreno
          ndc.set(puntero.x, puntero.y);
          rayo.setFromCamera(ndc, camara);
          const hay = puntero.dentro && rayo.ray.intersectPlane(plano, golpe);
          if (hay)
            uPincel.uPos.value.set(golpe.x / TAM + 0.5, -golpe.z / TAM + 0.5);
          uPincel.uActivo.value = hay ? (puntero.abajo ? 3 : 1) : 0;
          renderer.setRenderTarget(rtB);
          uPincel.tPrevio.value = rtA.texture;
          renderer.render(escenaPincel, camQuad);
          renderer.setRenderTarget(null);
          const x = rtA;
          rtA = rtB;
          rtB = x;
          uTerreno.tTrazo.value = rtA.texture;
          composer.render(dt);
        },
        liberar: () => {
          liberarEscena(escena);
          quad.geometry.dispose();
          (quad.material as THREE.Material).dispose();
          rtA.dispose();
          rtB.dispose();
          composer.dispose();
        },
      };
    },
    alMedir,
    { antialias: true, dprMax: 1.75 }
  );
}
