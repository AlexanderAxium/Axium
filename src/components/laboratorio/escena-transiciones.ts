// Laboratorio 3D · transiciones (2026-10-15). Entre una escena y otra, Hubtown pixela, Active Theory
// distorsiona, Overworld revela con una mancha. Acá, un carrusel de proyectos con cuatro transiciones
// en un mismo shader (dos texturas y un progreso):
//   0 · disolver   umbral de un fbm con filo de luz
//   1 · líquido    las dos imágenes se desplazan por un campo de ruido en sentidos opuestos
//   2 · píxeles    la celda crece hasta la mitad y vuelve a bajar
//   3 · isotipo    la siguiente imagen aparece DENTRO del isotipo, que crece desde el centro
// Avanza con clic, rueda o flechas; la curva de cada transición es entrada y salida suaves.
import * as THREE from "three";
import { ISOTIPO } from "~/components/axium/tres/isotipo";
import { type Medidas, crearLab } from "~/components/laboratorio/base";

const IMAGENES = [
  "/images/proyects/rematch/rematch-portada-cancha.jpg",
  "/images/proyects/aurore/av-portada-mostrador.jpg",
  "/images/proyects/vendiq/vendiq-portada-cielo.jpg",
  "/images/proyects/bookit/bookit-portada-v2.jpg",
  "/images/proyects/anjsports/anj-portada.jpg",
  "/images/proyects/clefast/cf-portada-gama.jpg",
];
const EFECTOS = { disolver: 0, liquido: 1, pixeles: 2, isotipo: 3 } as const;

const FS = /* glsl */ `
  uniform sampler2D tA;
  uniform sampler2D tB;
  uniform sampler2D tMascara;
  uniform sampler2D tMascaraBlanda;
  uniform float uAspA;
  uniform float uAspB;
  uniform float uAsp;
  uniform float uP;
  uniform int uEfecto;
  uniform vec2 uRes;
  varying vec2 vUv;
  vec2 cubrir(vec2 uv, float aspImg) {
    vec2 c = uv - 0.5;
    if (aspImg > uAsp) c.x *= uAsp / aspImg; else c.y *= aspImg / uAsp;
    return c + 0.5;
  }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float ruido(vec2 p) {
    vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * ruido(p); p *= 2.03; a *= 0.5; } return v; }
  void main() {
    vec2 uv = vUv;
    vec3 col;
    if (uEfecto == 0) {
      float n = fbm(uv * vec2(uAsp, 1.0) * 3.0);
      float u = uP * 1.3 - 0.15;
      float m = smoothstep(u - 0.04, u, n);
      vec3 a = texture2D(tA, cubrir(uv, uAspA)).rgb;
      vec3 b = texture2D(tB, cubrir(uv, uAspB)).rgb;
      col = mix(b, a, m);
      float filo = smoothstep(0.06, 0.0, abs(n - u)) * step(0.001, uP) * step(uP, 0.999);
      col += vec3(0.6, 0.95, 1.0) * filo * 1.2;
    } else if (uEfecto == 1) {
      vec2 dir = vec2(fbm(uv * 4.0) - 0.5, fbm(uv * 4.0 + 9.0) - 0.5) * 2.0;
      vec3 a = texture2D(tA, cubrir(uv + dir * uP * 0.35, uAspA)).rgb;
      vec3 b = texture2D(tB, cubrir(uv - dir * (1.0 - uP) * 0.35, uAspB)).rgb;
      col = mix(a, b, smoothstep(0.25, 0.75, uP));
    } else if (uEfecto == 2) {
      float celda = max(1.0, 120.0 * sin(uP * 3.14159));
      vec2 q = (floor(uv * uRes / celda) + 0.5) * celda / uRes;
      vec3 a = texture2D(tA, cubrir(q, uAspA)).rgb;
      vec3 b = texture2D(tB, cubrir(q, uAspB)).rgb;
      col = mix(a, b, smoothstep(0.42, 0.58, uP));
    } else {
      // el isotipo crece desde el centro; dentro, la imagen siguiente (con un leve acercamiento)
      float esc = mix(0.02, 9.0, uP * uP * uP);
      vec2 m = (uv - 0.5) * vec2(uAsp, 1.0) / esc + 0.5;
      float dentro = 0.0, halo = 0.0;
      if (m.x > 0.0 && m.x < 1.0 && m.y > 0.0 && m.y < 1.0) {
        dentro = texture2D(tMascara, m).r;
        halo = texture2D(tMascaraBlanda, m).r;
      }
      vec3 a = texture2D(tA, cubrir(uv, uAspA)).rgb;
      vec3 b = texture2D(tB, cubrir((uv - 0.5) * (1.0 - 0.08 * (1.0 - uP)) + 0.5, uAspB)).rgb;
      // el hueco triangular del centro se llena al pasar la mitad (si no, dejaba ver la imagen vieja)
      col = mix(a, b, max(dentro, smoothstep(0.55, 0.85, uP)));
      col += vec3(0.55, 0.9, 1.0) * clamp(halo - dentro, 0.0, 1.0) * 1.4 * step(uP, 0.999);
      if (uP > 0.999) col = b;
    }
    // viñeta suave
    col *= 1.0 - pow(length(vUv - 0.5), 2.0) * 0.5;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

/** el isotipo en blanco sobre negro, centrado (y una versión desenfocada para el halo) */
function mascaras() {
  const lado = 1024;
  const hacer = (blur: number) => {
    const c = document.createElement("canvas");
    c.width = c.height = lado;
    const g = c.getContext("2d");
    if (g) {
      g.fillStyle = "#000";
      g.fillRect(0, 0, lado, lado);
      g.filter = blur ? `blur(${blur}px)` : "none";
      g.fillStyle = "#fff";
      const k = (lado * 0.8) / ISOTIPO.ancho;
      for (const pts of [
        ISOTIPO.piezas.arriba,
        ISOTIPO.piezas.izquierda,
        ISOTIPO.piezas.abajo,
      ]) {
        g.beginPath();
        pts.forEach(([x, y], i) => {
          const px = lado / 2 + (x - ISOTIPO.ancho / 2) * k;
          const py = lado / 2 + (y - ISOTIPO.alto / 2) * k;
          if (i === 0) g.moveTo(px, py);
          else g.lineTo(px, py);
        });
        g.closePath();
        g.fill();
      }
    }
    return new THREE.CanvasTexture(c);
  };
  return { nitida: hacer(0), blanda: hacer(18) };
}

export function crear(el: HTMLElement, alMedir: (m: Medidas) => void) {
  return crearLab(
    el,
    ({ renderer, dpr, lienzo }) => {
      const escena = new THREE.Scene();
      const cam = new THREE.Camera();
      const cargador = new THREE.TextureLoader();
      const tex: { t: THREE.Texture; asp: number }[] = IMAGENES.map((src) => {
        const item = { t: new THREE.Texture(), asp: 1.5 };
        item.t = cargador.load(src, (t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          const img = t.image as HTMLImageElement;
          item.asp = img.naturalWidth / img.naturalHeight;
        });
        item.t.colorSpace = THREE.SRGBColorSpace;
        return item;
      });
      const m = mascaras();
      const uniforms = {
        tA: { value: tex[0]?.t as THREE.Texture },
        tB: { value: tex[1]?.t as THREE.Texture },
        tMascara: { value: m.nitida },
        tMascaraBlanda: { value: m.blanda },
        uAspA: { value: 1.5 },
        uAspB: { value: 1.5 },
        uAsp: { value: 1.6 },
        uP: { value: 0 },
        uEfecto: { value: 3 },
        uRes: { value: new THREE.Vector2(1, 1) },
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

      let actual = 0;
      let siguiente = 1;
      let progreso = 1; // 1 = sin transición en curso
      const DURA = 1.5;
      const curva = (x: number) =>
        x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
      const avanzar = (paso: number) => {
        if (progreso < 1) return; // una transición a la vez
        siguiente = (actual + paso + tex.length) % tex.length;
        progreso = 0;
      };
      const clic = () => avanzar(1);
      let ruedaHasta = 0;
      const rueda = (ev: WheelEvent) => {
        ev.preventDefault();
        const ahora = performance.now();
        if (ahora < ruedaHasta || Math.abs(ev.deltaY) < 8) return;
        ruedaHasta = ahora + 900;
        avanzar(ev.deltaY > 0 ? 1 : -1);
      };
      const tecla = (ev: KeyboardEvent) => {
        if (ev.key === "ArrowRight" || ev.key === "ArrowDown") avanzar(1);
        if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") avanzar(-1);
      };
      lienzo.addEventListener("click", clic);
      lienzo.addEventListener("wheel", rueda, { passive: false });
      window.addEventListener("keydown", tecla);
      lienzo.style.cursor = "pointer";

      return {
        medir: (w, h) => {
          uniforms.uAsp.value = w / h;
          uniforms.uRes.value.set(w * dpr, h * dpr);
        },
        cuadro: (dt) => {
          if (progreso < 1) {
            progreso = Math.min(1, progreso + Math.max(dt, 1 / 60) / DURA);
            if (progreso >= 1) actual = siguiente;
          }
          const a = tex[actual] as { t: THREE.Texture; asp: number };
          const b = tex[siguiente] as { t: THREE.Texture; asp: number };
          uniforms.tA.value = a.t;
          uniforms.uAspA.value = a.asp;
          uniforms.tB.value = b.t;
          uniforms.uAspB.value = b.asp;
          uniforms.uP.value = progreso >= 1 ? 0 : curva(progreso);
          renderer.render(escena, cam);
        },
        accion: (v) => {
          uniforms.uEfecto.value = EFECTOS[v as keyof typeof EFECTOS] ?? 0;
          avanzar(1);
        },
        liberar: () => {
          lienzo.removeEventListener("click", clic);
          lienzo.removeEventListener("wheel", rueda);
          window.removeEventListener("keydown", tecla);
          for (const x of tex) x.t.dispose();
          m.nitida.dispose();
          m.blanda.dispose();
          quad.geometry.dispose();
          (quad.material as THREE.Material).dispose();
        },
      };
    },
    alMedir,
    { antialias: false }
  );
}
