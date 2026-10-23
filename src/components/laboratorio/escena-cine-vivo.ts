// Laboratorio 3D · cine en vivo (2026-10-16): la película de /laboratorio/cine (las tres piezas en el
// estudio azul noche, cinco capítulos) en TIEMPO REAL. Lo que el vídeo no puede y esto sí:
//   · interrumpible: el capítulo es un valor continuo `s` (0…4) que sigue a su destino con un muelle
//     crítico; un gesto nuevo cambia el destino a mitad de camino y la animación gira sin cortes
//     (en vídeo había que bloquear o encolar)
//   · responde al puntero: el grupo se inclina y la pieza bajo el cursor se acerca y se enciende
//   · cualquier proporción de pantalla (encuadre horizontal o vertical en vivo) y casi sin descarga
// Los cinco estados son los de cine.py pasados a los ejes de three (Blender Z arriba → three Y).
// El desenfoque de movimiento es un pase direccional que sigue la velocidad en pantalla de la pieza
// protagonista: en el medio del viaje estira las motas de polvo como el desenfoque de Cycles.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { toCreasedNormals } from "three/addons/utils/BufferGeometryUtils.js";
import { ISOTIPO } from "~/components/axium/tres/isotipo";
import { crearLab, liberarEscena } from "~/components/laboratorio/base";

export type EstadoCineVivo = {
  listo: boolean;
  /** capítulo en el que está quieta (−1 mientras viaja) */
  capitulo: number;
  enViaje: boolean;
  fps: number;
  llamadas: number;
};

type V3 = [number, number, number];
type Encuadre = {
  ancla: "centro" | "arriba" | "izquierda" | "abajo";
  desde: V3;
  lado: number;
  alto: number;
  /** lente en mm (sensor de 36 mm, como en Blender) */
  lente: number;
};
type Estado = {
  grupo: V3; // grados: x (cabeceo), y (giro vertical), z (alabeo)
  halo: number;
  piezas: Record<(typeof NOMBRES)[number], [V3, V3]>; // desplazamiento y giro propio
  h: Encuadre;
  v: Encuadre;
};
const NOMBRES = ["arriba", "izquierda", "abajo"] as const;
const Z: V3 = [0, 0, 0];
const ESTADOS: Estado[] = [
  {
    grupo: [6, -16, 0],
    halo: 1,
    piezas: { arriba: [Z, Z], izquierda: [Z, Z], abajo: [Z, Z] },
    h: {
      ancla: "centro",
      desde: [0.6, 0.45, 6.6],
      lado: -0.85,
      alto: 0,
      lente: 50,
    },
    v: {
      ancla: "centro",
      desde: [0.4, 0.3, 8.4],
      lado: 0,
      alto: -0.9,
      lente: 42,
    },
  },
  {
    grupo: [4, -34, 0],
    halo: 0,
    piezas: {
      arriba: [
        [0.55, 0.3, 1.5],
        [14, 12, 28],
      ],
      izquierda: [
        [-1.0, 0.45, -2.6],
        [0, 0, -8],
      ],
      abajo: [
        [-0.2, -0.7, -2.8],
        [0, 0, 6],
      ],
    },
    h: {
      ancla: "arriba",
      desde: [1.3, 0.7, 5.0],
      lado: -0.62,
      alto: 0.08,
      lente: 50,
    },
    v: {
      ancla: "arriba",
      desde: [0.8, 0.5, 6.2],
      lado: 0,
      alto: -0.7,
      lente: 45,
    },
  },
  {
    grupo: [-4, 22, 0],
    halo: 0,
    piezas: {
      arriba: [
        [0.4, 0.3, -2.3],
        [0, 0, -6],
      ],
      izquierda: [
        [-0.5, 0.15, 1.5],
        [-10, -14, -30],
      ],
      abajo: [
        [0.3, -0.3, -2.2],
        [0, 0, 4],
      ],
    },
    h: {
      ancla: "izquierda",
      desde: [-1.1, 0.85, 5.0],
      lado: -0.62,
      alto: 0.08,
      lente: 50,
    },
    v: {
      ancla: "izquierda",
      desde: [-0.7, 0.6, 6.2],
      lado: 0,
      alto: -0.7,
      lente: 45,
    },
  },
  {
    grupo: [8, -10, 0],
    halo: 0,
    piezas: {
      arriba: [
        [-0.4, 0.9, -2.8],
        [0, 0, 5],
      ],
      izquierda: [
        [-1.2, 0.2, -2.5],
        [0, 0, -6],
      ],
      abajo: [
        [0.3, -0.25, 1.6],
        [18, 20, 24],
      ],
    },
    h: {
      ancla: "abajo",
      desde: [0.9, -0.25, 4.9],
      lado: -0.62,
      alto: 0.08,
      lente: 50,
    },
    v: {
      ancla: "abajo",
      desde: [0.6, -0.15, 6.1],
      lado: 0,
      alto: -0.7,
      lente: 45,
    },
  },
  {
    // contacto: se arma de nuevo con una vuelta entera y la cámara se aleja
    grupo: [4, 352, 0],
    halo: 1,
    piezas: { arriba: [Z, Z], izquierda: [Z, Z], abajo: [Z, Z] },
    h: {
      ancla: "centro",
      desde: [0, 0.9, 8.2],
      lado: 0,
      alto: -0.55,
      lente: 45,
    },
    v: {
      ancla: "centro",
      desde: [0, 0.8, 10.5],
      lado: 0,
      alto: -1.1,
      lente: 38,
    },
  },
];
export const ULTIMO = ESTADOS.length - 1;

const curva = (t: number) =>
  t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2; // quinta: todo el movimiento en el medio
const mezcla = (a: V3, b: V3, e: number): V3 => [
  a[0] + (b[0] - a[0]) * e,
  a[1] + (b[1] - a[1]) * e,
  a[2] + (b[2] - a[2]) * e,
];
const RAD = Math.PI / 180;

const FONDO_VS = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = p.xyww;
  }
`;
const FONDO_FS = /* glsl */ `
  uniform vec3 uAbajo;
  uniform vec3 uArriba;
  uniform vec3 uBrillo;
  varying vec3 vDir;
  void main() {
    vec3 d = normalize(vDir);
    vec3 col = mix(uAbajo, uArriba, smoothstep(-0.35, 0.55, d.y));
    // el resplandor azul detrás de las piezas (en Blender, un plano emisivo con degradado esférico)
    float g = max(dot(d, normalize(vec3(0.05, 0.02, -1.0))), 0.0);
    col += uBrillo * pow(g, 6.0);
    gl_FragColor = vec4(col, 1.0);
  }
`;
const POLVO_VS = /* glsl */ `
  attribute float aTam;
  uniform float uEscala;
  varying float vA;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aTam * uEscala / -mv.z;
    vA = smoothstep(40.0, 6.0, -mv.z);
  }
`;
const POLVO_FS = /* glsl */ `
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d) * vA;
    gl_FragColor = vec4(vec3(0.75, 0.89, 1.0) * 1.6 * a, a);
  }
`;
const QUAD_VS = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
// un solo pase final: desenfoque direccional (movimiento), aberración, viñeta y grano
const FINAL_FS = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform vec2 uMov;
  uniform float uTiempo;
  uniform vec2 uRes;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main() {
    vec3 col;
    float m = length(uMov);
    if (m < 0.0006) {
      col = texture2D(tDiffuse, vUv).rgb;
    } else {
      col = vec3(0.0);
      float j = hash(vUv * uRes + uTiempo) - 0.5; // reparte las 12 muestras sin bandas
      for (int i = 0; i < 12; i++) {
        float k = (float(i) + j) / 11.0 - 0.5;
        col += texture2D(tDiffuse, vUv + uMov * k).rgb;
      }
      col /= 12.0;
    }
    vec2 c = vUv - 0.5;
    float d = dot(c, c);
    vec2 off = c * (0.0012 + m * 0.25) * (0.6 + d * 2.0);
    col.r = mix(col.r, texture2D(tDiffuse, vUv + off).r, 0.6);
    col.b = mix(col.b, texture2D(tDiffuse, vUv - off).b, 0.6);
    col *= 1.0 - 0.5 * d * 1.4;
    col += (hash(vUv * uRes + fract(uTiempo) * 91.0) - 0.5) * 0.028;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function crearCineVivo(
  el: HTMLElement,
  alEstado: (e: EstadoCineVivo) => void
) {
  const estado: EstadoCineVivo = {
    listo: false,
    capitulo: 0,
    enViaje: false,
    fps: 0,
    llamadas: 0,
  };
  const emitir = () => alEstado({ ...estado });

  return crearLab(
    el,
    ({ renderer, dpr, tactil, quieto, puntero }) => {
      // Neutral y no AgX: medido, AgX dejaba la laca en #296B90 contra el #0092D1 de la marca
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.transmissionResolutionScale = 0.5;
      const escena = new THREE.Scene();
      const camara = new THREE.PerspectiveCamera(30, 1, 0.1, 200);

      // ── estudio: fondo, entorno con tiras de luz (los brillos de la laca) y tres luces ──
      const fondo = new THREE.Mesh(
        new THREE.SphereGeometry(80, 32, 16),
        new THREE.ShaderMaterial({
          vertexShader: FONDO_VS,
          fragmentShader: FONDO_FS,
          uniforms: {
            uAbajo: { value: new THREE.Color("#06143D") },
            uArriba: { value: new THREE.Color("#010309") },
            uBrillo: { value: new THREE.Color("#1A4FC0").multiplyScalar(0.4) },
          },
          side: THREE.BackSide,
          depthWrite: false,
        })
      );
      fondo.renderOrder = -1;
      escena.add(fondo);
      const estudio = new THREE.Scene();
      estudio.background = new THREE.Color("#030A22");
      const tira = new THREE.MeshBasicMaterial({
        color: new THREE.Color(9, 9, 9),
        side: THREE.DoubleSide,
      });
      for (const [p, t] of [
        [
          [-2.5, 4.5, 3.0],
          [5.0, 0.35],
        ],
        [
          [4.0, 0.5, 3.5],
          [0.3, 4.5],
        ],
        [
          [-4.5, -1.0, -1.5],
          [0.25, 3.5],
        ],
      ] as [V3, [number, number]][]) {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(...t), tira);
        m.position.set(...p);
        m.lookAt(0, 0, 0);
        estudio.add(m);
      }
      const pmrem = new THREE.PMREMGenerator(renderer);
      const entorno = pmrem.fromScene(estudio, 0.03).texture;
      escena.environment = entorno;
      escena.environmentIntensity = 0.7;
      const luz = (color: string, i: number, p: V3) => {
        const l = new THREE.DirectionalLight(color, i);
        l.position.set(...p);
        escena.add(l);
      };
      luz("#F4F7FF", 2.4, [-3.5, 3.2, 4]); // clave
      luz("#3FA8FF", 1.6, [2.5, 2.5, -4.5]); // contra, azul
      luz("#7ECFC3", 0.3, [5, -1.5, 1]); // lado, teal (más y la laca se vuelve verde agua)
      escena.add(new THREE.AmbientLight("#203a80", 0.12));

      // ── las piezas (2 m de ancho, 0,34 m de grosor, biseladas) ──
      const K = 2 / ISOTIPO.ancho;
      const laca = new THREE.MeshPhysicalMaterial({
        color: "#0092D1",
        roughness: 0.32,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        emissive: new THREE.Color("#0092D1"),
        emissiveIntensity: 0,
      });
      const perla = new THREE.MeshPhysicalMaterial({
        color: "#E9EDF2",
        roughness: 0.38,
        clearcoat: 0.6,
        clearcoatRoughness: 0.12,
        emissive: new THREE.Color("#9FD6F0"),
        emissiveIntensity: 0,
      });
      const vidrio = new THREE.MeshPhysicalMaterial({
        color: "#E6F4FC",
        roughness: 0.22,
        transmission: 1,
        thickness: 0.6,
        ior: 1.5,
        attenuationColor: new THREE.Color("#8CCBEE"),
        attenuationDistance: 1.6,
        envMapIntensity: 1.6,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        specularIntensity: 1,
        emissive: new THREE.Color("#6FC3FF"),
        emissiveIntensity: 0,
      });
      const grupo = new THREE.Group();
      escena.add(grupo);
      const piezas = {} as Record<(typeof NOMBRES)[number], THREE.Mesh>;
      const centros = {} as Record<(typeof NOMBRES)[number], THREE.Vector3>;
      for (const [nombre, mat] of [
        ["arriba", laca],
        ["izquierda", perla],
        ["abajo", vidrio],
      ] as const) {
        const pts = ISOTIPO.piezas[nombre].map(
          ([x, y]) => new THREE.Vector2((x - 769.5) * K, -(y - 679.5) * K)
        );
        const c = pts
          .reduce((a, p) => a.add(p), new THREE.Vector2())
          .divideScalar(pts.length);
        const forma = new THREE.Shape(pts.map((p) => p.clone().sub(c)));
        const fondoP = 0.28;
        let geo: THREE.BufferGeometry = new THREE.ExtrudeGeometry(forma, {
          depth: fondoP,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.03,
          bevelOffset: -0.03,
          bevelSegments: 4,
          curveSegments: 1,
        });
        geo.translate(0, 0, -fondoP / 2);
        // normales suaves en el bisel y duras entre caras: el brillo corre por el canto
        geo = toCreasedNormals(geo, 35 * RAD);
        const m = new THREE.Mesh(geo, mat);
        grupo.add(m);
        piezas[nombre] = m;
        centros[nombre] = new THREE.Vector3(c.x, c.y, 0);
      }

      // el halo: un anillo emisivo detrás (portada y contacto)
      const matHalo = new THREE.MeshBasicMaterial({
        color: new THREE.Color(1.1, 2.4, 4.0),
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const halo = new THREE.Mesh(
        new THREE.TorusGeometry(3.4, 0.02, 12, 256),
        matHalo
      );
      halo.position.set(0, 0.2, -9);
      escena.add(halo);

      // polvo: fijo en el mundo; con la cámara en viaje, el desenfoque lo estira en estelas
      const rnd = (() => {
        let a = 4;
        return () => {
          a = (a * 16807) % 2147483647;
          return a / 2147483647;
        };
      })();
      const NP = tactil ? 600 : 1300;
      const pp = new Float32Array(NP * 3);
      const tp = new Float32Array(NP);
      for (let i = 0; i < NP; i++) {
        let v: THREE.Vector3;
        do v = new THREE.Vector3(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
        while (v.length() > 1 || v.length() < 0.2);
        v.normalize().multiplyScalar(4.5 + rnd() * 18);
        if (v.z > 2) v.z = -v.z; // delante del grupo pasa la cámara
        pp.set([v.x, v.y, v.z], i * 3);
        tp[i] = 0.8 + rnd() * 2.2;
      }
      const geoP = new THREE.BufferGeometry();
      geoP.setAttribute("position", new THREE.BufferAttribute(pp, 3));
      geoP.setAttribute("aTam", new THREE.BufferAttribute(tp, 1));
      const polvo = new THREE.Points(
        geoP,
        new THREE.ShaderMaterial({
          vertexShader: POLVO_VS,
          fragmentShader: POLVO_FS,
          uniforms: { uEscala: { value: 14 * dpr } },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      polvo.frustumCulled = false;
      escena.add(polvo);

      // ── postproceso: bloom a media resolución y un pase final ──
      const composer = new EffectComposer(renderer);
      composer.setPixelRatio(dpr);
      composer.addPass(new RenderPass(escena, camara));
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(2, 2),
        0.5,
        0.45,
        0.85
      );
      composer.addPass(bloom);
      composer.addPass(new OutputPass());
      const finalU = {
        tDiffuse: { value: null as THREE.Texture | null },
        uMov: { value: new THREE.Vector2() },
        uTiempo: { value: 0 },
        uRes: { value: new THREE.Vector2(1, 1) },
      };
      const final = new ShaderPass({
        uniforms: finalU,
        vertexShader: QUAD_VS,
        fragmentShader: FINAL_FS,
      });
      composer.addPass(final);
      const uf = final.uniforms as unknown as typeof finalU; // ShaderPass clona los uniforms

      // ── la pose a partir de s (continuo) ──
      const mg = new THREE.Matrix4();
      const eu = new THREE.Euler(0, 0, 0, "YXZ");
      const mundo = {
        centro: new THREE.Vector3(),
        arriba: new THREE.Vector3(),
        izquierda: new THREE.Vector3(),
        abajo: new THREE.Vector3(),
      };
      const ancla = new THREE.Vector3();
      const anclaB = new THREE.Vector3();
      const desde = new THREE.Vector3();
      const pos = new THREE.Vector3();
      const mira = new THREE.Vector3();
      const adelante = new THREE.Vector3();
      const derecha = new THREE.Vector3();
      const arribaV = new THREE.Vector3();
      const ARRIBA = new THREE.Vector3(0, 1, 0);
      const inclin = { x: 0, y: 0 };
      let hover: THREE.Mesh | null = null;
      const acercar = new Map<THREE.Mesh, number>(); // pieza → cuánto se acerca (0…1, suavizado)

      /** aplica la pose de s ∈ [0, 4] (y el reposo) a grupo, piezas y cámara; devuelve el fov */
      const posar = (
        s: number,
        t: number,
        vertical: boolean,
        aspecto: number
      ) => {
        const k = Math.min(ULTIMO - 1, Math.floor(s));
        const f = Math.min(1, Math.max(0, s - k));
        const ea = ESTADOS[k] as Estado;
        const eb = ESTADOS[k + 1] as Estado;
        const eg = curva(f);
        const g = mezcla(ea.grupo, eb.grupo, eg);
        // reposo: flotar suave, siempre (en el viaje no se nota; en la pausa da vida)
        const fl = Math.sin(t * 0.42);
        g[0] += fl * 1.2 + inclin.y * -5;
        g[1] += fl * 2.2 + inclin.x * 7;
        eu.set(g[0] * RAD, g[1] * RAD, g[2] * RAD, "YXZ");
        grupo.rotation.copy(eu);
        grupo.updateMatrixWorld(true);
        mg.copy(grupo.matrixWorld);
        NOMBRES.forEach((n, i) => {
          const desf = (i - 1) * 0.07;
          const ep =
            f <= 0
              ? 0
              : f >= 1
                ? 1
                : curva(Math.min(1, Math.max(0, (f - 0.07 - desf) / 0.86)));
          const [da, ra] = ea.piezas[n];
          const [db, rb] = eb.piezas[n];
          const d = mezcla(da, db, ep);
          const r = mezcla(ra, rb, ep);
          const fase = t * 0.42 * 2 + i * 2.1;
          const cerca = acercar.get(piezas[n]) ?? 0;
          const c = centros[n];
          piezas[n].position.set(
            c.x + d[0],
            c.y + d[1] + Math.sin(fase) * 0.025,
            c.z + d[2] - Math.sin(fase) * 0.015 + cerca * 0.12
          );
          piezas[n].rotation.set(
            (r[0] + Math.sin(fase) * 1.5) * RAD,
            r[1] * RAD,
            r[2] * RAD
          );
          mundo[n].set(c.x + d[0], c.y + d[1], c.z + d[2]).applyMatrix4(mg);
        });
        mundo.centro.set(0, 0, 0);
        const ca = vertical ? ea.v : ea.h;
        const cb = vertical ? eb.v : eb.h;
        ancla.copy(mundo[ca.ancla]).lerp(anclaB.copy(mundo[cb.ancla]), eg);
        desde.set(...mezcla(ca.desde, cb.desde, eg));
        desde.multiplyScalar(1 + 0.18 * Math.sin(Math.PI * eg)); // la cámara se abre en el viaje
        pos.copy(ancla).add(desde);
        adelante.copy(ancla).sub(pos).normalize();
        derecha.crossVectors(adelante, ARRIBA).normalize();
        arribaV.crossVectors(derecha, adelante);
        const lado = ca.lado + (cb.lado - ca.lado) * eg;
        const alto = ca.alto + (cb.alto - ca.alto) * eg;
        mira
          .copy(ancla)
          .addScaledVector(derecha, lado)
          .addScaledVector(arribaV, alto);
        camara.position.copy(pos);
        camara.lookAt(mira);
        // halo: se apaga pronto al salir y se enciende tarde al llegar
        const ha = ea.halo;
        const hb = eb.halo;
        matHalo.opacity =
          ha +
          (hb - ha) *
            (hb < ha
              ? curva(Math.min(f * 2.5, 1))
              : curva(Math.max(f * 2.5 - 1.5, 0)));
        halo.visible = matHalo.opacity > 0.003;
        // lente: en horizontal manda el ancho (como en Blender), en vertical el alto
        const lente = ca.lente + (cb.lente - ca.lente) * eg;
        const tanMedio = 18 / lente;
        return vertical
          ? (2 * Math.atan(tanMedio)) / RAD
          : (2 * Math.atan(tanMedio / aspecto)) / RAD;
      };

      // ── el muelle de s (crítico: conserva la velocidad al cambiar de destino) ──
      let s = 0;
      let v = 0;
      let objetivo = 0;
      const MEDIA_VIDA = 0.5;
      const muelle = (dt: number) => {
        const y = (4 * Math.LN2) / MEDIA_VIDA / 2;
        const j0 = s - objetivo;
        const j1 = v + j0 * y;
        const e = Math.exp(-y * dt);
        s = e * (j0 + j1 * dt) + objetivo;
        v = e * (v - j1 * y * dt);
      };

      const rayo = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      const proy = new THREE.Vector3();
      const previo = new THREE.Vector2(0, 0);
      const mov = new THREE.Vector2();
      let hayPrevio = false;
      let ancho = 1;
      let alto = 1;
      let tReal = performance.now();
      let cuadros = 0;
      let ultimaEmision = performance.now();
      let dprActual = dpr;
      let acumT = 0;
      let acumN = 0;
      let ultimoAjuste = performance.now();

      // calentar: compilar y dibujar un cuadro antes de mostrar (sin tirones al primer viaje)
      renderer
        .compileAsync(escena, camara)
        .catch(() => {})
        .finally(() => {
          posar(0, 0, ancho / alto < 0.9, ancho / alto);
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
          uf.uRes.value.set(w * dprActual, h * dprActual);
        },
        accion: (valor) => {
          // «ir:N»: nuevo destino; el muelle lo persigue desde donde esté (también a mitad de viaje)
          const n = Number(valor.split(":")[1]);
          if (Number.isFinite(n))
            objetivo = Math.min(ULTIMO, Math.max(0, Math.round(n)));
        },
        cuadro: (dt, t) => {
          const ahora = performance.now();
          const dtReal = Math.min(0.05, (ahora - tReal) / 1000);
          tReal = ahora;
          if (quieto) {
            s = objetivo; // sin movimiento: corte directo al capítulo
            v = 0;
          } else muelle(dtReal);
          if (Math.abs(s - objetivo) < 0.0005 && Math.abs(v) < 0.001) {
            s = objetivo;
            v = 0;
          }

          // puntero: inclinación del grupo y la pieza bajo el cursor
          const kp = 1 - Math.exp(-dtReal * 3);
          inclin.x += ((puntero.dentro ? puntero.x : 0) - inclin.x) * kp;
          inclin.y += ((puntero.dentro ? puntero.y : 0) - inclin.y) * kp;
          const aspecto = ancho / alto;
          const vertical = aspecto < 0.9;
          const fov = posar(s, t, vertical, aspecto);
          if (Math.abs(camara.fov - fov) > 0.01) {
            camara.fov = fov;
            camara.updateProjectionMatrix();
          }
          hover = null;
          if (puntero.dentro) {
            rayo.setFromCamera(ndc.set(puntero.x, puntero.y), camara);
            const hit = rayo.intersectObjects(Object.values(piezas), false)[0];
            if (hit) hover = hit.object as THREE.Mesh;
          }
          for (const m of Object.values(piezas)) {
            const a = acercar.get(m) ?? 0;
            const meta = m === hover ? 1 : 0;
            const n = a + (meta - a) * (1 - Math.exp(-dtReal * 8));
            acercar.set(m, n);
            (m.material as THREE.MeshPhysicalMaterial).emissiveIntensity =
              n * 0.22;
          }
          el.style.cursor = hover ? "pointer" : "";

          // desenfoque de movimiento: cuánto se movió en pantalla la pieza protagonista
          const k = Math.min(ULTIMO - 1, Math.floor(s));
          const enc = vertical
            ? (ESTADOS[k] as Estado).v
            : (ESTADOS[k] as Estado).h;
          proy
            .copy(mundo[enc.ancla === "centro" ? "arriba" : enc.ancla])
            .project(camara);
          if (hayPrevio && dtReal > 0) {
            const dx = (proy.x - previo.x) * 0.5;
            const dy = (proy.y - previo.y) * 0.5;
            // obturador de medio cuadro a 60 Hz, normalizado por dt (igual a 120 Hz que a 60)
            const esc = 0.5 * (1 / 60 / dtReal);
            mov.lerp(new THREE.Vector2(dx * esc, dy * esc), 0.5);
          }
          if (mov.length() > 0.05) mov.setLength(0.05);
          previo.set(proy.x, proy.y);
          hayPrevio = true;
          uf.uMov.value.copy(quieto ? new THREE.Vector2() : mov);
          uf.uTiempo.value = t;

          // estado para el DOM (solo al cambiar)
          const viajando = Math.abs(s - objetivo) > 0.02;
          const cap = viajando ? -1 : Math.round(s);
          if (
            viajando !== estado.enViaje ||
            (!viajando && cap !== estado.capitulo)
          ) {
            estado.enViaje = viajando;
            if (!viajando) estado.capitulo = cap;
            emitir();
          }

          // resolución adaptable con histéresis (techo: el inicial)
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
                uf.uRes.value.set(ancho * nuevo, alto * nuevo);
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
            emitir();
          }
        },
        liberar: () => {
          liberarEscena(escena);
          liberarEscena(estudio);
          entorno.dispose();
          pmrem.dispose();
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
