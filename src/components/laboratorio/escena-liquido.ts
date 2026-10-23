// Laboratorio 3D · el isotipo líquido (2026-10-15). Raymarching de campos de distancia (SDF) en un
// solo fragment shader: no hay mallas. Las tres piezas son paralelogramos redondeados extruidos y se
// funden con un mínimo suave (smin): cuando se acercan, se unen como mercurio.
//   · ciclo de 14 s: armado → separadas → fundidas en una gota → armado otra vez
//   · el puntero es otra gota que se pega a las piezas al pasar
//   · cromo con película iridiscente; el entorno es procedural (tiras de luz sobre azul noche)
// Se dibuja a ~0,7 de resolución y se escala: el raymarching paga por píxel.
import * as THREE from "three";
import { type Medidas, crearLab } from "~/components/laboratorio/base";

const FS = /* glsl */ `
  uniform vec2 uRes;
  uniform float uTiempo;
  uniform vec3 uGota;
  uniform float uGotaR;
  varying vec2 vUv;

  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }
  mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
  // paralelogramo (Inigo Quilez): ancho, alto y cuánto se inclina
  float sdParalelogramo(vec2 p, float wi, float he, float sk) {
    vec2 e = vec2(sk, he);
    p = (p.y < 0.0) ? -p : p;
    vec2 w = p - e; w.x -= clamp(w.x, -wi, wi);
    vec2 d = vec2(dot(w, w), -w.y);
    float s = p.x * e.y - p.y * e.x;
    p = (s < 0.0) ? -p : p;
    vec2 v = p - vec2(wi, 0.0); v -= e * clamp(dot(v, e) / dot(e, e), -1.0, 1.0);
    d = min(d, vec2(dot(v, v), wi * he - abs(s)));
    return sqrt(d.x) * sign(-d.y);
  }
  float pieza(vec3 p, float ang, float abre, float t) {
    // tres piezas iguales a 120°: un triángulo de paralelogramos, como el isotipo
    p.xy = rot(ang) * p.xy;
    p.y -= 0.42 + abre;
    p.xz = rot(sin(t * 0.7 + ang) * 0.35 * abre) * p.xz;
    float d2 = sdParalelogramo(p.xy, 0.36, 0.17, 0.12) - 0.05;
    vec2 w = vec2(d2, abs(p.z) - 0.11);
    return min(max(w.x, w.y), 0.0) + length(max(w, 0.0)) - 0.06;
  }
  float escena(vec3 p) {
    float t = uTiempo;
    float c = mod(t, 14.0);
    // abrir 0 = armado; 0,9 = separadas; la gota central crece cuando se funden
    float abre = smoothstep(2.0, 4.0, c) * (1.0 - smoothstep(6.0, 8.0, c)) * 0.9;
    float funde = smoothstep(7.0, 8.5, c) * (1.0 - smoothstep(11.0, 13.0, c));
    vec3 q = p;
    q.xy = rot(t * 0.12) * q.xy;
    q.yz = rot(sin(t * 0.3) * 0.25) * q.yz;
    float k = mix(0.08, 0.6, funde);
    float d = pieza(q, 0.0, abre, t);
    d = smin(d, pieza(q, 2.0944, abre, t), k);
    d = smin(d, pieza(q, 4.1888, abre, t), k);
    // al fundirse, el centro se llena y todo se redondea
    d = smin(d, length(q) - funde * 0.55, 0.35 + funde * 0.3);
    d = smin(d, length(p - uGota) - uGotaR, 0.45);
    return d;
  }
  vec3 normal(vec3 p) {
    const vec2 e = vec2(0.0015, -0.0015);
    return normalize(e.xyy * escena(p + e.xyy) + e.yyx * escena(p + e.yyx) + e.yxy * escena(p + e.yxy) + e.xxx * escena(p + e.xxx));
  }
  vec3 entorno(vec3 d) {
    vec3 c = mix(vec3(0.02, 0.03, 0.07), vec3(0.22, 0.32, 0.55), smoothstep(-0.6, 0.9, d.y));
    // un suelo claro abajo y un horizonte: el cromo necesita qué reflejar
    c += vec3(0.35, 0.38, 0.45) * smoothstep(-0.1, -0.6, d.y);
    // tiras de luz de estudio: lo que hace que el cromo parezca cromo
    c += vec3(0.9, 0.95, 1.0) * smoothstep(0.05, 0.0, abs(d.y - 0.55)) * 4.0;
    c += vec3(1.0, 0.92, 0.85) * smoothstep(0.04, 0.0, abs(d.y - 0.2)) * smoothstep(0.6, 0.0, abs(d.x)) * 3.0;
    c += vec3(0.49, 0.81, 0.76) * smoothstep(0.08, 0.0, abs(d.x + 0.7)) * smoothstep(-0.2, 0.4, d.y) * 1.6;
    c += vec3(0.25, 0.5, 1.0) * smoothstep(0.1, 0.0, abs(d.x - 0.8)) * 1.2;
    return c;
  }
  void main() {
    vec2 uv = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    vec3 ro = vec3(0.0, 0.0, 4.4);
    vec3 rd = normalize(vec3(uv, -1.6));
    float t = 0.0;
    float d = 1.0;
    int pasos = 0;
    for (int i = 0; i < 90; i++) {
      d = escena(ro + rd * t);
      if (d < 0.001 || t > 8.0) break;
      t += d * 0.9;
      pasos = i;
    }
    vec3 fondo = mix(vec3(0.012, 0.018, 0.04), vec3(0.03, 0.05, 0.1), vUv.y) * (1.0 - length(vUv - 0.5) * 0.6);
    vec3 col = fondo;
    if (d < 0.001) {
      vec3 p = ro + rd * t;
      vec3 n = normal(p);
      vec3 r = reflect(rd, n);
      float fres = pow(1.0 - max(dot(-rd, n), 0.0), 3.0);
      // película fina: el color cambia con el ángulo (iridiscencia barata)
      vec3 pelicula = 0.5 + 0.5 * cos(6.2832 * (fres * 1.3 + vec3(0.0, 0.33, 0.67)) + 1.5);
      vec3 cromo = entorno(r) * mix(vec3(0.95, 0.97, 1.0), pelicula, 0.3 + fres * 0.5) * 1.25;
      float oclusion = 1.0 - float(pasos) / 90.0 * 0.6;
      col = cromo * oclusion + fres * 0.15;
    }
    col = 1.0 - exp(-col * 1.4);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export function crear(el: HTMLElement, alMedir: (m: Medidas) => void) {
  return crearLab(
    el,
    ({ renderer, puntero }) => {
      const escena = new THREE.Scene();
      const cam = new THREE.Camera();
      const uniforms = {
        uRes: { value: new THREE.Vector2(1, 1) },
        uTiempo: { value: 0 },
        uGota: { value: new THREE.Vector3(9, 9, 0) },
        uGotaR: { value: 0 },
      };
      const quad = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({
          vertexShader:
            "varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
          fragmentShader: FS,
          uniforms,
          depthTest: false,
        })
      );
      escena.add(quad);
      const gota = new THREE.Vector3(9, 9, 0);
      let aspecto = 1;
      return {
        medir: (w, h) => {
          aspecto = w / h;
          // a 0,7 de resolución: el raymarching paga por píxel
          renderer.setPixelRatio(
            Math.min(window.devicePixelRatio || 1, 2) * 0.7
          );
          renderer.setSize(w, h, false);
          uniforms.uRes.value.set(w, h);
        },
        cuadro: (_dt, t) => {
          uniforms.uTiempo.value = t;
          // el puntero → un punto en el plano z = 0,4 frente a las piezas (misma cámara del shader)
          const objetivo = puntero.dentro
            ? new THREE.Vector3(
                puntero.x * aspecto * 0.5 * (4.0 / 1.6),
                puntero.y * 0.5 * (4.0 / 1.6),
                0.4
              )
            : new THREE.Vector3(puntero.x * 3, 3.5, 0.4);
          gota.lerp(objetivo, 0.12);
          uniforms.uGota.value.copy(gota);
          uniforms.uGotaR.value +=
            ((puntero.dentro ? 0.2 : 0) - uniforms.uGotaR.value) * 0.08;
          renderer.render(escena, cam);
        },
        liberar: () => {
          quad.geometry.dispose();
          (quad.material as THREE.Material).dispose();
        },
      };
    },
    alMedir,
    { antialias: false }
  );
}
