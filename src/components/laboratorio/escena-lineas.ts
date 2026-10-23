// Laboratorio 3D · líneas de luz (2026-10-15). La técnica de Unseen («The Symphony Of Vines»,
// capítulo 2) y de las líneas de Hubtown: partículas que avanzan por un campo de flujo (rotacional de
// un ruido, sin divergencia) y que se pintan cada cuadro sobre el cuadro anterior apenas desvanecido.
// Lo que queda en pantalla no son puntos: es el rastro, y el rastro dibuja líneas.
//   · simulación en la GPU (GPUComputationRenderer): una textura de posiciones, edad y semilla
//   · búfer de rastro con realimentación (dos render targets que se alternan)
//   · el puntero hace un remolino; con el botón apretado, empuja hacia afuera
// Para que no haya huecos en las líneas, cada partícula avanza menos que su propio tamaño por cuadro
// (Unseen: «moving the particles too quickly will cause gaps in the lines»).
import * as THREE from "three";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";
import {
  GLSL_SIMPLEX,
  type Medidas,
  crearLab,
} from "~/components/laboratorio/base";

const SIM = /* glsl */ `
  uniform float uDt;
  uniform float uTiempo;
  uniform float uAspecto;
  uniform vec2 uPuntero;
  uniform float uDentro;
  uniform float uAbajo;
  ${GLSL_SIMPLEX}
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  vec2 campo(vec2 p) {
    // rotacional del ruido: (∂n/∂y, −∂n/∂x), en dos escalas
    float e = 0.01;
    vec3 q = vec3(p * 1.1, uTiempo * 0.04);
    float nx = snoise(q + vec3(e, 0.0, 0.0)) - snoise(q - vec3(e, 0.0, 0.0));
    float ny = snoise(q + vec3(0.0, e, 0.0)) - snoise(q - vec3(0.0, e, 0.0));
    vec2 v = vec2(ny, -nx) / (2.0 * e);
    vec3 q2 = vec3(p * 3.1 + 7.0, uTiempo * 0.07);
    float mx = snoise(q2 + vec3(e, 0.0, 0.0)) - snoise(q2 - vec3(e, 0.0, 0.0));
    float my = snoise(q2 + vec3(0.0, e, 0.0)) - snoise(q2 - vec3(0.0, e, 0.0));
    v += vec2(my, -mx) / (2.0 * e) * 0.35;
    return v;
  }
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 d = texture2D(tPos, uv);
    vec2 p = d.xy;
    vec2 v = campo(p) * 0.055;
    // remolino alrededor del puntero; con el botón, empuje hacia afuera
    vec2 r = p - uPuntero * vec2(uAspecto, 1.0);
    float k = exp(-dot(r, r) * 9.0) * uDentro;
    v += vec2(-r.y, r.x) * k * 1.6;
    v += normalize(r + 1e-5) * k * uAbajo * 1.4;
    p += v * uDt;
    float edad = d.z + uDt;
    float vida = 2.5 + d.w * 5.0;
    if (edad > vida || abs(p.x) > uAspecto * 1.05 || abs(p.y) > 1.05) {
      p = vec2((hash(uv + uTiempo) * 2.0 - 1.0) * uAspecto, hash(uv * 1.9 + uTiempo * 1.3) * 2.0 - 1.0);
      edad = 0.0;
    }
    gl_FragColor = vec4(p, edad, d.w);
  }
`;

const PUNTOS_VS = /* glsl */ `
  uniform sampler2D tPos;
  uniform float uDpr;
  attribute vec2 aRef;
  varying float vBrillo;
  varying float vTono;
  void main() {
    vec4 d = texture2D(tPos, aRef);
    float vida = 2.5 + d.w * 5.0;
    // nace y muere suave: así las líneas empiezan y terminan sin puntas duras
    vBrillo = smoothstep(0.0, 0.4, d.z) * smoothstep(vida, vida - 0.8, d.z);
    vTono = d.w;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(d.xy, 0.0, 1.0);
    gl_PointSize = 1.3 * uDpr;
  }
`;
const PUNTOS_FS = /* glsl */ `
  varying float vBrillo;
  varying float vTono;
  void main() {
    vec3 a = vec3(0.49, 0.81, 0.76);  // teal de la marca
    vec3 b = vec3(0.16, 0.48, 1.0);   // azul
    vec3 c = vec3(0.95, 0.97, 1.0);   // casi blanco, pocas
    vec3 col = vTono < 0.85 ? mix(a, b, vTono / 0.85) : c;
    gl_FragColor = vec4(col * vBrillo * 0.16, 1.0);
  }
`;

const QUAD_VS = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
const DESVANECER_FS = /* glsl */ `
  uniform sampler2D tPrevio;
  uniform float uCaida;
  varying vec2 vUv;
  void main() { gl_FragColor = vec4(texture2D(tPrevio, vUv).rgb * uCaida, 1.0); }
`;
const MOSTRAR_FS = /* glsl */ `
  uniform sampler2D tRastro;
  uniform vec2 uRes;
  uniform float uTiempo;
  varying vec2 vUv;
  void main() {
    vec3 c = texture2D(tRastro, vUv).rgb;
    c = 1.0 - exp(-c * 1.8);                        // tono suave: la luz se acumula sin quemarse
    vec3 fondo = mix(vec3(0.012, 0.02, 0.05), vec3(0.02, 0.035, 0.08), vUv.y);
    vec3 col = fondo + c;
    float d = length(vUv - 0.5);
    col *= 1.0 - d * d * 0.8;
    float n = fract(sin(dot(vUv * uRes + fract(uTiempo) * 91.0, vec2(12.9898, 78.233))) * 43758.5453);
    col += (n - 0.5) * 0.02;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export function crear(el: HTMLElement, alMedir: (m: Medidas) => void) {
  return crearLab(
    el,
    ({ renderer, dpr, tactil, puntero }) => {
      const LADO = tactil ? 112 : 192; // menos y más brillantes: con 65 000 se volvía una textura gris
      const gpu = new GPUComputationRenderer(LADO, LADO, renderer);
      const t0 = gpu.createTexture();
      const datos = t0.image.data as Float32Array;
      for (let i = 0; i < LADO * LADO; i++) {
        datos[i * 4] = (Math.random() * 2 - 1) * 1.6;
        datos[i * 4 + 1] = Math.random() * 2 - 1;
        datos[i * 4 + 2] = Math.random() * 4;
        datos[i * 4 + 3] = Math.random();
      }
      const vPos = gpu.addVariable("tPos", SIM, t0);
      gpu.setVariableDependencies(vPos, [vPos]);
      const uSim = {
        uDt: { value: 0 },
        uTiempo: { value: 0 },
        uAspecto: { value: 1.6 },
        uPuntero: { value: new THREE.Vector2() },
        uDentro: { value: 0 },
        uAbajo: { value: 0 },
      };
      Object.assign(vPos.material.uniforms, uSim);
      const error = gpu.init();
      if (error) console.warn("GPGPU:", error);

      // las partículas, dibujadas en el espacio de la simulación (cámara ortográfica)
      const escenaPuntos = new THREE.Scene();
      const camOrto = new THREE.OrthographicCamera(-1.6, 1.6, 1, -1, -1, 1);
      const ref = new Float32Array(LADO * LADO * 2);
      for (let i = 0; i < LADO * LADO; i++) {
        ref[i * 2] = ((i % LADO) + 0.5) / LADO;
        ref[i * 2 + 1] = (Math.floor(i / LADO) + 0.5) / LADO;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(LADO * LADO * 3), 3)
      );
      g.setAttribute("aRef", new THREE.BufferAttribute(ref, 2));
      const uPuntos = {
        tPos: { value: null as THREE.Texture | null },
        uDpr: { value: dpr },
      };
      const puntos = new THREE.Points(
        g,
        new THREE.ShaderMaterial({
          vertexShader: PUNTOS_VS,
          fragmentShader: PUNTOS_FS,
          uniforms: uPuntos,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          depthWrite: false,
          transparent: true,
        })
      );
      puntos.frustumCulled = false;
      escenaPuntos.add(puntos);

      // el rastro: dos render targets que se alternan
      const opciones = { type: THREE.HalfFloatType, depthBuffer: false };
      let rtA = new THREE.WebGLRenderTarget(1, 1, opciones);
      let rtB = new THREE.WebGLRenderTarget(1, 1, opciones);
      const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
      const escenaQuad = new THREE.Scene();
      escenaQuad.add(quad);
      const camQuad = new THREE.Camera();
      const uDesv = {
        tPrevio: { value: rtA.texture as THREE.Texture },
        uCaida: { value: 0.94 },
      };
      const matDesv = new THREE.ShaderMaterial({
        vertexShader: QUAD_VS,
        fragmentShader: DESVANECER_FS,
        uniforms: uDesv,
        depthTest: false,
      });
      const uMostrar = {
        tRastro: { value: rtB.texture as THREE.Texture },
        uRes: { value: new THREE.Vector2(1, 1) },
        uTiempo: { value: 0 },
      };
      const matMostrar = new THREE.ShaderMaterial({
        vertexShader: QUAD_VS,
        fragmentShader: MOSTRAR_FS,
        uniforms: uMostrar,
        depthTest: false,
      });

      return {
        medir: (w, h) => {
          const asp = w / h;
          uSim.uAspecto.value = asp;
          camOrto.left = -asp;
          camOrto.right = asp;
          camOrto.updateProjectionMatrix();
          rtA.setSize(w * dpr, h * dpr);
          rtB.setSize(w * dpr, h * dpr);
          uMostrar.uRes.value.set(w * dpr, h * dpr);
        },
        cuadro: (dt, t) => {
          uSim.uDt.value = dt;
          uSim.uTiempo.value = t;
          uSim.uPuntero.value.set(puntero.x, puntero.y);
          uSim.uDentro.value +=
            ((puntero.dentro ? 1 : 0) - uSim.uDentro.value) * 0.1;
          uSim.uAbajo.value = puntero.abajo ? 1 : 0;
          if (dt > 0 && !error) gpu.compute();
          uPuntos.tPos.value = gpu.getCurrentRenderTarget(vPos).texture;
          // 1) el rastro anterior, un poco más apagado; 2) encima, las partículas de este cuadro
          if (dt > 0) {
            renderer.setRenderTarget(rtB);
            quad.material = matDesv;
            uDesv.tPrevio.value = rtA.texture;
            renderer.render(escenaQuad, camQuad);
            renderer.autoClear = false;
            renderer.render(escenaPuntos, camOrto);
            renderer.autoClear = true;
            const x = rtA;
            rtA = rtB;
            rtB = x;
          }
          // 3) a pantalla, con tono, viñeta y grano
          renderer.setRenderTarget(null);
          quad.material = matMostrar;
          uMostrar.tRastro.value = rtA.texture;
          uMostrar.uTiempo.value = t;
          renderer.render(escenaQuad, camQuad);
        },
        liberar: () => {
          gpu.dispose();
          rtA.dispose();
          rtB.dispose();
          g.dispose();
          (puntos.material as THREE.Material).dispose();
          quad.geometry.dispose();
          matDesv.dispose();
          matMostrar.dispose();
        },
      };
    },
    alMedir,
    { antialias: false, dprMax: 1.5 }
  );
}
