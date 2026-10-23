// Laboratorio 3D · la terminal (2026-10-16). Propuesta de portada a partir de juncastudio.com: allí
// el protagonista es un PERSONAJE (un robot con cabeza de monitor) cuya pantalla escribe y te habla.
// Para Axium: una terminal retrofuturista sobre un pedestal hecho con las tres piezas del isotipo,
// delante de humo azul animado. La pantalla escribe quiénes somos y pregunta qué quieres construir;
// responde a las opciones (y a un clic) y gira la cabeza hacia el puntero.
//   · pantalla: canvas 2D con el texto (CanvasTexture) + shader de CRT (curvatura, líneas, parpadeo)
//   · humo: fbm con deformación de dominio (Quilez) en un pase de fondo, a pantalla completa
//   · cuerpo: RoundedBoxGeometry cerámica + el isotipo extruido en metal satinado
//   · postproceso: bloom (la pantalla y las luces), grano y viñeta
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ISOTIPO } from "~/components/axium/tres/isotipo";
import { type Medidas, crearLab } from "~/components/laboratorio/base";

export type ControlTerminal = {
  pausar: (p: boolean) => void;
  liberar: () => void;
  /** pone en cola mensajes para que la pantalla los escriba (borra lo anterior) */
  decir: (mensajes: string[]) => void;
};

const HUMO_FS = /* glsl */ `
  uniform float uTiempo;
  uniform vec2 uRes;
  uniform vec2 uPuntero;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float ruido(vec2 p) {
    vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * ruido(p); p = p * 2.02 + 3.7; a *= 0.5; } return v; }
  void main() {
    vec2 p = vUv * vec2(uRes.x / uRes.y, 1.0) * 1.05;
    float t = uTiempo * 0.035;
    // deformación de dominio: el ruido deforma al ruido, y eso se lee como humo
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(fbm(p + 3.6 * q + vec2(1.7, 9.2) + t * 1.3), fbm(p + 3.6 * q + vec2(8.3, 2.8) - t));
    float f = fbm(p + 3.6 * r);
    vec3 noche = vec3(0.004, 0.008, 0.025);
    vec3 azul = vec3(0.0, 0.18, 0.55);
    vec3 electrico = vec3(0.0, 0.42, 0.95);
    vec3 col = mix(noche, azul, smoothstep(0.38, 0.9, f));
    col = mix(col, electrico, smoothstep(0.55, 1.0, f * length(q)) * 0.8);
    // el puntero aclara el humo a su alrededor, apenas
    float d = distance(vUv * vec2(uRes.x / uRes.y, 1.0), (uPuntero * 0.5 + 0.5) * vec2(uRes.x / uRes.y, 1.0));
    col += electrico * exp(-d * d * 7.0) * 0.12;
    col *= 0.55 + 0.45 * smoothstep(1.25, 0.2, distance(vUv, vec2(0.62, 0.5)));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const PANTALLA_VS = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vMundo;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vec4 m = modelMatrix * vec4(position, 1.0);
    vMundo = m.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * m;
  }
`;
const PANTALLA_FS = /* glsl */ `
  uniform sampler2D tTexto;
  uniform float uTiempo;
  uniform float uGlitch;
  varying vec2 vUv;
  varying vec3 vMundo;
  varying vec3 vNormal;
  void main() {
    // curvatura de tubo: las esquinas se van hacia adentro
    vec2 c = vUv * 2.0 - 1.0;
    c *= 1.0 + dot(c, c) * 0.06;
    vec2 uv = c * 0.5 + 0.5;
    float fuera = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
    float g = uGlitch * (step(0.92, fract(uv.y * 9.0 + uTiempo * 7.0)) - 0.5) * 0.06;
    vec3 col = vec3(
      texture2D(tTexto, uv + vec2(0.0018 + g, 0.0)).r,
      texture2D(tTexto, uv + vec2(g, 0.0)).g,
      texture2D(tTexto, uv - vec2(0.0018 - g, 0.0)).b
    );
    col *= 0.86 + 0.14 * sin(uv.y * 900.0);                 // líneas de barrido
    col *= 0.97 + 0.03 * sin(uTiempo * 57.0);               // parpadeo
    col *= smoothstep(1.25, 0.55, length(c));                // viñeta del tubo
    col *= fuera;
    // el vidrio: un brillo del entorno en diagonal
    vec3 v = normalize(cameraPosition - vMundo);
    float fres = pow(1.0 - max(dot(normalize(vNormal), v), 0.0), 3.0);
    float banda = smoothstep(0.08, 0.0, abs(vUv.x - vUv.y * 0.6 - 0.62)) * 0.08;
    col += vec3(0.55, 0.7, 1.0) * (fres * 0.25 + banda);
    gl_FragColor = vec4(col * 1.7, 1.0);
  }
`;

const ACABADO = {
  uniforms: {
    tDiffuse: { value: null },
    uTiempo: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader:
    "varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTiempo;
    uniform vec2 uRes;
    varying vec2 vUv;
    void main() {
      vec3 col = texture2D(tDiffuse, vUv).rgb;
      float d = length(vUv - 0.5);
      col *= 1.0 - d * d * 0.7;
      float n = fract(sin(dot(vUv * uRes + fract(uTiempo) * 97.0, vec2(12.9898, 78.233))) * 43758.5453);
      col += (n - 0.5) * 0.045;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

/** la pantalla: un canvas con el texto, el cursor y la barra de estado */
function crearPantalla() {
  const ANCHO = 1024;
  const ALTO = 640;
  const c = document.createElement("canvas");
  c.width = ANCHO;
  c.height = ALTO;
  const g = c.getContext("2d") as CanvasRenderingContext2D;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const fuente =
    '500 42px "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace';
  const partir = (texto: string) => {
    g.font = fuente;
    const palabras = texto.split(" ");
    const lineas: string[] = [];
    let actual = "";
    for (const p of palabras) {
      const prueba = actual ? `${actual} ${p}` : p;
      if (g.measureText(prueba).width > ANCHO - 150 && actual) {
        lineas.push(actual);
        actual = p;
      } else actual = prueba;
    }
    lineas.push(actual);
    return lineas;
  };
  const dibujar = (bloques: string[], cursor: boolean, hora: string) => {
    g.fillStyle = "#03101a";
    g.fillRect(0, 0, ANCHO, ALTO);
    // barra de arriba
    g.font = '500 22px "JetBrains Mono", "SF Mono", Menlo, monospace';
    g.fillStyle = "rgba(126,207,195,0.55)";
    g.fillText("AXIUM OS · TERMINAL", 64, 64);
    g.textAlign = "right";
    g.fillText(hora, ANCHO - 64, 64);
    g.textAlign = "left";
    g.fillStyle = "rgba(126,207,195,0.18)";
    g.fillRect(64, 84, ANCHO - 128, 2);
    // el texto, con un resplandor teal
    g.font = fuente;
    g.shadowColor = "rgba(126,207,195,0.85)";
    g.shadowBlur = 16;
    g.fillStyle = "#cffaf2";
    const lineas = bloques
      .flatMap((b, i) => [...(i ? [""] : []), ...partir(b)])
      .slice(-7);
    let y = 160;
    let ultimaX = 64;
    lineas.forEach((l, i) => {
      const prefijo = l && (i === 0 || lineas[i - 1] === "") ? "> " : "  ";
      const txt = l ? prefijo + l : "";
      g.fillText(txt, 64, y);
      ultimaX = 64 + g.measureText(txt).width;
      y += 58;
    });
    if (cursor) g.fillRect(ultimaX + 6, y - 58 - 34, 24, 40);
    g.shadowBlur = 0;
    // barra de estado
    g.font = '500 22px "JetBrains Mono", "SF Mono", Menlo, monospace';
    g.fillStyle = "rgba(126,207,195,0.55)";
    g.fillText("● IA LISTA", 64, ALTO - 48);
    g.textAlign = "right";
    g.fillText("LIMA, PERÚ", ANCHO - 64, ALTO - 48);
    g.textAlign = "left";
    tex.needsUpdate = true;
  };
  return { tex, dibujar };
}

export function crearTerminal(
  el: HTMLElement,
  alMedir: (m: Medidas) => void,
  alEscribir: (escribiendo: boolean) => void
): ControlTerminal | null {
  let decirExterno: (m: string[]) => void = () => {};
  const control = crearLab(
    el,
    ({ renderer, dpr, quieto, puntero, lienzo }) => {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      const pmrem = new THREE.PMREMGenerator(renderer);
      const entorno = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

      // ── fondo: humo a pantalla completa ──
      const escenaFondo = new THREE.Scene();
      const uHumo = {
        uTiempo: { value: 0 },
        uRes: { value: new THREE.Vector2(1, 1) },
        uPuntero: { value: new THREE.Vector2() },
      };
      const quadHumo = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({
          vertexShader:
            "varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.999, 1.0); }",
          fragmentShader: HUMO_FS,
          uniforms: uHumo,
          depthWrite: false,
        })
      );
      escenaFondo.add(quadHumo);
      const camFondo = new THREE.Camera();

      // ── la terminal ──
      const escena = new THREE.Scene();
      escena.environment = entorno;
      escena.environmentIntensity = 0.28;
      const camara = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      const ceramica = new THREE.MeshPhysicalMaterial({
        color: "#c9cfd8",
        roughness: 0.32,
        clearcoat: 0.7,
        clearcoatRoughness: 0.25,
      });
      const oscuro = new THREE.MeshPhysicalMaterial({
        color: "#11151c",
        roughness: 0.55,
        metalness: 0.2,
      });
      const metal = new THREE.MeshPhysicalMaterial({
        color: "#c9d4e3",
        metalness: 1,
        roughness: 0.28,
      });
      const luzTeal = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#7ecfc3").multiplyScalar(3),
      });

      const terminal = new THREE.Group();
      escena.add(terminal);
      const cabeza = new THREE.Group();
      cabeza.position.y = 1.55;
      terminal.add(cabeza);
      const carcasa = new THREE.Mesh(
        new RoundedBoxGeometry(3.3, 2.3, 1.5, 6, 0.3),
        ceramica
      );
      cabeza.add(carcasa);
      const trasera = new THREE.Mesh(
        new RoundedBoxGeometry(2.5, 1.75, 1.3, 6, 0.4),
        ceramica
      );
      trasera.position.z = -0.95; // la «cola» del tubo de rayos catódicos
      cabeza.add(trasera);
      const marco = new THREE.Mesh(
        new RoundedBoxGeometry(2.95, 1.98, 0.2, 4, 0.12),
        oscuro
      );
      marco.position.z = 0.7;
      cabeza.add(marco);
      const pantalla = crearPantalla();
      const uPantalla = {
        tTexto: { value: pantalla.tex as THREE.Texture },
        uTiempo: { value: 0 },
        uGlitch: { value: 0 },
      };
      const vidrio = new THREE.Mesh(
        new THREE.PlaneGeometry(2.7, 1.69),
        new THREE.ShaderMaterial({
          vertexShader: PANTALLA_VS,
          fragmentShader: PANTALLA_FS,
          uniforms: uPantalla,
        })
      );
      vidrio.position.z = 0.81;
      cabeza.add(vidrio);
      // rejillas laterales
      for (let i = 0; i < 5; i++) {
        for (const lado of [-1, 1]) {
          const r = new THREE.Mesh(
            new RoundedBoxGeometry(0.04, 0.9, 0.12, 2, 0.02),
            oscuro
          );
          r.position.set(lado * 1.66, 0.05, -0.15 - i * 0.2);
          cabeza.add(r);
        }
      }
      // antena con la punta encendida, y un led en el marco
      const antena = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.7, 12),
        metal
      );
      antena.position.set(1.05, 1.5, -0.2);
      antena.rotation.z = -0.25;
      cabeza.add(antena);
      const punta = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 16, 12),
        luzTeal
      );
      punta.position.set(1.14, 1.84, -0.2);
      cabeza.add(punta);
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 12, 8),
        luzTeal
      );
      led.position.set(1.32, -0.92, 0.82);
      cabeza.add(led);
      // cuello y pedestal: el isotipo extruido en metal
      const cuello = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.32, 0.5, 24),
        metal
      );
      cuello.position.y = 0.2;
      terminal.add(cuello);
      const ESC = 1.5 / ISOTIPO.ancho;
      const pedestal = new THREE.Group();
      for (const pts of [
        ISOTIPO.piezas.arriba,
        ISOTIPO.piezas.izquierda,
        ISOTIPO.piezas.abajo,
      ]) {
        const forma = new THREE.Shape(
          pts.map(
            ([x, y]) =>
              new THREE.Vector2(
                (x - ISOTIPO.ancho / 2) * ESC,
                -(y - ISOTIPO.alto / 2) * ESC
              )
          )
        );
        const g = new THREE.ExtrudeGeometry(forma, {
          depth: 0.45,
          bevelEnabled: true,
          bevelThickness: 0.04,
          bevelSize: 0.035,
          bevelOffset: -0.035,
          bevelSegments: 4,
          curveSegments: 1,
        });
        g.translate(0, 0, -0.225);
        pedestal.add(new THREE.Mesh(g, metal));
      }
      pedestal.position.y = -0.75;
      terminal.add(pedestal);
      // luces de recorte: azul por detrás, teal desde un lado, cálida por delante
      const contra = new THREE.DirectionalLight("#3d8bff", 2.4);
      contra.position.set(-4, 3, -5);
      const lado = new THREE.PointLight("#7ecfc3", 5, 14, 1.4);
      lado.position.set(4, 1, 3);
      const frente = new THREE.DirectionalLight("#fff1e0", 0.55);
      frente.position.set(-2, 4, 6);
      escena.add(contra, lado, frente);

      // ── postproceso ──
      const composer = new EffectComposer(renderer);
      composer.setPixelRatio(dpr);
      composer.addPass(new RenderPass(escenaFondo, camFondo));
      const pasoTerminal = new RenderPass(escena, camara);
      pasoTerminal.clear = false;
      composer.addPass(pasoTerminal);
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(1, 1),
        0.42,
        0.45,
        0.95
      );
      composer.addPass(bloom);
      composer.addPass(new OutputPass());
      const acabado = new ShaderPass(ACABADO);
      composer.addPass(acabado);
      const uAcabado = acabado.uniforms as {
        uTiempo: THREE.IUniform<number>;
        uRes: THREE.IUniform<THREE.Vector2>;
      };

      // ── la escritura ──
      let cola: string[] = [];
      let escritos: string[] = [];
      let escribiendo = "";
      let reloj = 0;
      let espera = 0.6;
      let avisado = false;
      const decir = (m: string[]) => {
        cola = [...m];
        escritos = [];
        escribiendo = "";
        espera = 0.25;
        uPantalla.uGlitch.value = 1;
      };
      decirExterno = decir;
      decir([
        "Hola.",
        "Soy la terminal de Axium.",
        "Diseñamos, construimos y le sumamos IA a tu producto.",
        "¿Qué quieres construir?",
      ]);
      const hora = () =>
        new Intl.DateTimeFormat("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Lima",
        }).format(new Date());

      // un clic en la terminal: reacciona
      const rayo = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      const REACCIONES = [
        "¡Ey! Eso hace cosquillas.",
        "Sigo aquí. ¿Qué construimos?",
        "Clic recibido. Procesando ideas…",
      ];
      let salto = 0;
      const clic = () => {
        ndc.set(puntero.x, puntero.y);
        rayo.setFromCamera(ndc, camara);
        if (rayo.intersectObject(terminal, true).length) {
          salto = 1;
          decir([
            REACCIONES[Math.floor(Math.random() * REACCIONES.length)] as string,
          ]);
        }
      };
      lienzo.addEventListener("click", clic);

      const mira = { x: 0, y: 0 };
      let ancho = 1;
      return {
        accion: () => {},
        medir: (w, h) => {
          ancho = w / h;
          camara.aspect = ancho;
          const vertical = ancho < 0.8;
          camara.fov = vertical ? 46 : 30;
          camara.updateProjectionMatrix();
          // escritorio: la terminal a la derecha; móvil: arriba al centro
          terminal.position.set(
            vertical ? 0 : ancho > 1.5 ? 2.6 : 2.1,
            vertical ? 1.3 : 0.1,
            0
          );
          terminal.scale.setScalar(vertical ? 0.78 : 1);
          camara.position.set(0, 0.4, 13);
          camara.lookAt(0, 0.4, 0);
          composer.setSize(w, h);
          bloom.setSize(w * dpr, h * dpr);
          uHumo.uRes.value.set(w, h);
          uAcabado.uRes.value.set(w * dpr, h * dpr);
        },
        cuadro: (dt, t) => {
          uHumo.uTiempo.value = t;
          uHumo.uPuntero.value.set(puntero.x, puntero.y);
          uPantalla.uTiempo.value = t;
          uAcabado.uTiempo.value = t;
          // la cabeza mira al puntero (y, quieta, se pasea sola)
          const objX = puntero.dentro ? puntero.x : Math.sin(t * 0.4) * 0.4;
          const objY = puntero.dentro ? puntero.y : Math.sin(t * 0.3) * 0.2;
          mira.x += (objX - mira.x) * Math.min(1, dt * 4 + (quieto ? 1 : 0));
          mira.y += (objY - mira.y) * Math.min(1, dt * 4 + (quieto ? 1 : 0));
          cabeza.rotation.y = (mira.x - (terminal.position.x / 10) * 2) * 0.5;
          cabeza.rotation.x = -mira.y * 0.22;
          salto = Math.max(0, salto - dt * 2.5);
          cabeza.position.y =
            1.55 + Math.sin(t * 1.2) * 0.03 + Math.sin(salto * Math.PI) * 0.18;
          terminal.rotation.y = Math.sin(t * 0.25) * 0.04;
          led.visible = Math.sin(t * 3) > -0.3;
          uPantalla.uGlitch.value = Math.max(
            0,
            uPantalla.uGlitch.value - dt * 3
          );
          // escribir: una letra cada ~38 ms, pausas en la puntuación, pausa entre mensajes
          reloj += dt;
          const actual = cola[0];
          if (quieto && cola.length) {
            escritos = [...escritos, ...cola];
            cola = [];
          } else if (actual !== undefined) {
            if (espera > 0) espera -= dt;
            else if (reloj > 0.038) {
              reloj = 0;
              escribiendo = actual.slice(0, escribiendo.length + 1);
              const ultima = escribiendo.at(-1) ?? "";
              if (".,?¿!".includes(ultima))
                espera = ultima === "," ? 0.18 : 0.45;
              if (escribiendo.length >= actual.length) {
                escritos = [...escritos, actual];
                escribiendo = "";
                cola = cola.slice(1);
                espera = 0.7;
              }
            }
          }
          const enCurso = cola.length > 0;
          if (enCurso !== avisado) {
            avisado = enCurso;
            alEscribir(enCurso);
          }
          const cursor = Math.floor(t * 2.2) % 2 === 0 || enCurso;
          pantalla.dibujar(
            escribiendo ? [...escritos, escribiendo] : escritos,
            cursor,
            hora()
          );
          composer.render(dt);
        },
        liberar: () => {
          lienzo.removeEventListener("click", clic);
          escena.traverse((o) => {
            const m = o as THREE.Mesh;
            m.geometry?.dispose();
          });
          for (const m of [ceramica, oscuro, metal, luzTeal]) m.dispose();
          (vidrio.material as THREE.Material).dispose();
          (quadHumo.material as THREE.Material).dispose();
          quadHumo.geometry.dispose();
          pantalla.tex.dispose();
          entorno.dispose();
          pmrem.dispose();
          composer.dispose();
        },
      };
    },
    alMedir,
    { antialias: true, dprMax: tactilMax() }
  );
  if (!control) return null;
  return { ...control, decir: (m) => decirExterno(m) };
}

function tactilMax() {
  return typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
    ? 1.5
    : 1.75;
}
