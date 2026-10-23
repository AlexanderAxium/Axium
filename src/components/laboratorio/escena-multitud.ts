// Laboratorio 3D · multitud (2026-10-15). Miles de objetos en UNA llamada de dibujo: un
// InstancedMesh de 40 000 piezas (paralelogramos a 60°, en las tres orientaciones del isotipo).
// Nada se mueve en la CPU: cada instancia lleva su posición, fase y giro en atributos, y el vertex
// shader calcula la altura (ola + ruido + onda del puntero), la escala y la rotación.
//   · la normal se rota con la misma matriz para iluminar bien
//   · color por altura: azul noche → azul → teal → casi blanco en las crestas
//   · el puntero, proyectado sobre el plano, deja una onda que se apaga sola
import * as THREE from "three";
import {
  GLSL_SIMPLEX,
  type Medidas,
  crearLab,
  liberarEscena,
} from "~/components/laboratorio/base";

const VS = /* glsl */ `
  attribute vec2 aSitio;
  attribute float aFase;
  attribute float aGiro;
  uniform float uTiempo;
  uniform vec2 uOnda;
  uniform float uOndaT;
  uniform float uOndaF;
  varying vec3 vNormal;
  varying float vAlto;
  varying float vNiebla;
  ${GLSL_SIMPLEX}
  mat3 giroY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
  void main() {
    float t = uTiempo;
    float h = snoise(vec3(aSitio * 0.07, t * 0.12)) * 0.9;
    h += sin(length(aSitio) * 0.35 - t * 0.9) * 0.35;
    // la onda del puntero: un anillo que se expande desde donde pasó y se apaga
    float r = distance(aSitio, uOnda);
    float frente = uOndaT * 7.0;
    h += exp(-pow(r - frente, 2.0) * 0.6) * uOndaF * 1.4;
    float alto = 0.15 + max(h + 0.9, 0.0) * 0.9;
    mat3 R = giroY(aGiro + h * 0.25 + aFase * 0.2);
    vec3 p = position;
    p.y *= alto;
    p = R * p;
    p += vec3(aSitio.x, 0.0, aSitio.y);
    vNormal = normalize(R * normal);
    vAlto = h;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNiebla = smoothstep(18.0, 48.0, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const FS = /* glsl */ `
  uniform vec3 uFondo;
  varying vec3 vNormal;
  varying float vAlto;
  varying float vNiebla;
  void main() {
    vec3 n = normalize(vNormal);
    float dif = max(dot(n, normalize(vec3(-0.4, 0.9, 0.35))), 0.0);
    float borde = pow(1.0 - abs(n.y), 2.0);
    float u = smoothstep(-0.9, 1.2, vAlto);
    vec3 col = mix(vec3(0.03, 0.06, 0.16), vec3(0.0, 0.32, 0.72), smoothstep(0.0, 0.5, u));
    col = mix(col, vec3(0.49, 0.81, 0.76), smoothstep(0.5, 0.85, u));
    col = mix(col, vec3(0.93, 0.97, 1.0), smoothstep(0.88, 1.0, u));
    col *= 0.35 + 0.85 * dif;
    col += vec3(0.3, 0.55, 1.0) * borde * 0.25;
    col = mix(col, uFondo, vNiebla);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export function crear(el: HTMLElement, alMedir: (m: Medidas) => void) {
  return crearLab(
    el,
    ({ renderer, tactil, puntero }) => {
      const fondo = new THREE.Color("#03060f");
      const escena = new THREE.Scene();
      escena.background = fondo;
      const camara = new THREE.PerspectiveCamera(36, 1, 0.1, 120);

      // una pieza: paralelogramo a 60° extruido, sin bisel (12 triángulos)
      const d = 0.16 / Math.tan(Math.PI / 3);
      const forma = new THREE.Shape([
        new THREE.Vector2(-0.12, -0.08),
        new THREE.Vector2(0.12, -0.08),
        new THREE.Vector2(0.12 + d, 0.08),
        new THREE.Vector2(-0.12 + d, 0.08),
      ]);
      const geo = new THREE.ExtrudeGeometry(forma, {
        depth: 1,
        bevelEnabled: false,
      });
      geo.rotateX(-Math.PI / 2); // la extrusión pasa a ser la altura (Y)
      const LADO = tactil ? 120 : 200;
      const N = LADO * LADO;
      const sitio = new Float32Array(N * 2);
      const fase = new Float32Array(N);
      const giro = new Float32Array(N);
      const PASO = 0.26;
      for (let i = 0; i < N; i++) {
        const x = (i % LADO) - LADO / 2;
        const z = Math.floor(i / LADO) - LADO / 2;
        sitio[i * 2] = (x + (z % 2) * 0.5) * PASO;
        sitio[i * 2 + 1] = z * PASO * 0.87;
        fase[i] = Math.random();
        giro[i] = (Math.floor(Math.random() * 3) * Math.PI * 2) / 3;
      }
      geo.setAttribute("aSitio", new THREE.InstancedBufferAttribute(sitio, 2));
      geo.setAttribute("aFase", new THREE.InstancedBufferAttribute(fase, 1));
      geo.setAttribute("aGiro", new THREE.InstancedBufferAttribute(giro, 1));
      const uniforms = {
        uTiempo: { value: 0 },
        uOnda: { value: new THREE.Vector2(999, 999) },
        uOndaT: { value: 0 },
        uOndaF: { value: 0 },
        uFondo: { value: fondo },
      };
      const malla = new THREE.InstancedMesh(
        geo,
        new THREE.ShaderMaterial({
          vertexShader: VS,
          fragmentShader: FS,
          uniforms,
        }),
        N
      );
      malla.frustumCulled = false; // la posición la decide el shader
      escena.add(malla);

      const rayo = new THREE.Raycaster();
      const plano = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const golpe = new THREE.Vector3();
      const ndc = new THREE.Vector2();
      const ultimo = new THREE.Vector2(999, 999);
      const suave = { x: 0, y: 0 };

      return {
        medir: (w, h) => {
          camara.aspect = w / h;
          camara.fov = w / h < 0.8 ? 58 : 36;
          camara.updateProjectionMatrix();
        },
        cuadro: (dt, t) => {
          suave.x += (puntero.x - suave.x) * 0.04;
          suave.y += (puntero.y - suave.y) * 0.04;
          const a = t * 0.03 + suave.x * 0.2;
          camara.position.set(
            Math.sin(a) * 19,
            11 + suave.y * 2,
            Math.cos(a) * 19
          );
          camara.lookAt(0, 0, 0);
          uniforms.uTiempo.value = t;
          // una onda nueva cada vez que el puntero se mueve un trecho sobre el plano
          ndc.set(puntero.x, puntero.y);
          rayo.setFromCamera(ndc, camara);
          if (puntero.dentro && rayo.ray.intersectPlane(plano, golpe)) {
            const aqui = new THREE.Vector2(golpe.x, golpe.z);
            if (aqui.distanceTo(ultimo) > 2.2 || puntero.abajo) {
              ultimo.copy(aqui);
              uniforms.uOnda.value.copy(aqui);
              uniforms.uOndaT.value = 0;
              uniforms.uOndaF.value = puntero.abajo ? 1.6 : 1;
            }
          }
          uniforms.uOndaT.value += dt;
          uniforms.uOndaF.value *= 1 - Math.min(1, dt * 0.6);
          renderer.render(escena, camara);
        },
        liberar: () => liberarEscena(escena),
      };
    },
    alMedir,
    { antialias: true, dprMax: 1.75 }
  );
}
