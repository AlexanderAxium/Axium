// La escena 3D del hero: el isotipo de Axium en tres piezas de vidrio con el reel de nuestros
// proyectos dentro (la 34, portada del inicio desde el 2026-10-15). Las demás escenas (29–32, la 38
// y las opciones de paneles, esquirlas y luz al puntero) están respaldadas en el taller del hero.
import * as THREE from "three";
import { ISOTIPO, type Punto } from "./isotipo";
import { type Contexto, type Escena, llegada, montar, tramo } from "./motor";

export { montar };

const ESCALA = 2 / ISOTIPO.ancho; // el isotipo mide 2 unidades de ancho y 1,77 de alto
const CX = ISOTIPO.ancho / 2;
const CY = ISOTIPO.alto / 2;
const aXY = ([x, y]: Punto) =>
  new THREE.Vector2((x - CX) * ESCALA, -(y - CY) * ESCALA);
const ALTO_ISO = ISOTIPO.alto * ESCALA;
// centro del triángulo: de ahí salen las tres piezas
const CENTRO = aXY([775, 720]);
// el triángulo vacío del centro: su baricentro y su radio interior (133 px del PNG)
const HUECO = aXY([775, 762]);
const RADIO_HUECO = 133 * ESCALA;

function forma(contorno: readonly Punto[]) {
  return new THREE.Shape(contorno.map(aXY));
}

/** Extruye centrado en z. El bisel se come hacia adentro (bevelOffset = −bisel) para que la silueta
 *  final mida lo mismo que el logo y las rendijas entre piezas no se cierren. */
function extruir(s: THREE.Shape, fondo: number, bisel: number) {
  const g = new THREE.ExtrudeGeometry(s, {
    depth: fondo,
    bevelEnabled: true,
    bevelThickness: bisel,
    bevelSize: bisel,
    bevelOffset: -bisel,
    bevelSegments: 5,
    curveSegments: 1,
  });
  g.translate(0, 0, -fondo / 2);
  return g;
}

// ── 34 · El trabajo dentro del vidrio ────────────────────────────────────────
// Alexander, 2026-10-12, sobre hypersolid.com: «dentro de su elemento tiene un vídeo con sus
// proyectos con un efecto muy genial de glass y va girando; el nuestro no hace mucha cosa… nos falta
// más creatividad pero sin dejar de ser sutil». Hypersolid lo hace con drei (MeshTransmissionMaterial
// y un plano de vídeo detrás). Acá con three a pelo: el plano del vídeo solo pinta color durante la
// pasada de transmisión (onBeforeRender mira si se está dibujando a un render target), así que en
// pantalla no se ve y a través del vidrio sí. El vídeo es un reel de proyectos reales publicados.
// «Está bueno el 34, púlelo, dale un mejor fondo, que no sea plano»: degradado abstracto y grano
// (dibujarFondoSutil).
export type Encuadre = { cx: number; cy: number; alto: number };
export type OpcionesReel = {
  video: string;
  /** colores del fondo, que va dentro de la escena (el vidrio lo refracta) */
  paleta: PaletaFondo;
  /** dónde va el objeto: fracciones del lienzo (centro) y alto en px */
  encuadre: (w: number, h: number) => Encuadre;
  /** «vuelta»: gira sobre su eje (una vuelta cada 30 s); «balanceo»: va y viene sin quedar de canto */
  giro?: "vuelta" | "balanceo";
  /** «arrastre» (34f, 34j, 34k): se gira arrastrando y, al soltar, pierde velocidad poco a poco
   *  (inercia) hasta volver a su giro propio. Las piezas magnéticas y las elásticas de la 34k se
   *  descartaron el 2026-10-15 («me gusta más el efecto del otro, de jalar y que dé vueltas»);
   *  respaldo en el taller del hero */
  interaccion?: "arrastre";
  /** transición con el scroll hacia la sección siguiente (propuestas t1–t3 del inicio, 2026-10-16).
   *  El progreso (0…1) entra por `accion`. «hueco»: se pone de frente y la cámara entra por el
   *  triángulo del centro. «apertura»: las piezas se abren hacia la cámara y el fondo amanece a blanco.
   *  «frente» (t4): solo se pone de frente y se acerca un poco: el vidrio no llega a cubrir la pantalla */
  transicion?: "hueco" | "apertura" | "frente";
  /** «hueco»: dónde queda en pantalla el triángulo del centro (px desde arriba a la izquierda del
   *  lienzo y radio interior en px), en cada cuadro: el DOM recorta la sección siguiente con él */
  alHueco?: (x: number, y: number, r: number) => void;
  /** «frente»: cuánto se acerca el isotipo (0,32 en t4; menos en la versión sutil) */
  acercamiento?: number;
  /** «frente»: intensidad de la luz del hueco (1 = blanco pleno de t4) */
  luzMax?: number;
};

/** grano fino (una vez): evita las bandas de los degradados oscuros */
let grano: HTMLCanvasElement | null = null;
function lienzoGrano() {
  if (grano) return grano;
  grano = document.createElement("canvas");
  grano.width = grano.height = 160;
  const g = grano.getContext("2d");
  if (g) {
    const img = g.createImageData(160, 160);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  }
  return grano;
}

/** El fondo: un degradado abstracto y sutil con textura de grano. Alexander, 2026-10-12, sobre la
 *  primera versión con retícula, charco de luz y luz derramada: «exageraste mucho; el fondo quería
 *  algo abstracto pero sutil, degradado y textura sutil». Se dibuja según dónde quede el objeto. */
export type PaletaFondo = {
  /** degradado diagonal, de arriba a la izquierda a abajo a la derecha */
  base: readonly [string, string, string];
  /** detrás del objeto, la veta diagonal y la esquina de arriba a la derecha */
  manchas: readonly [string, string, string];
  /** opacidad del grano (normal); en fondos claros conviene menos */
  grano?: number;
};

function dibujarFondoSutil(
  lienzo: HTMLCanvasElement,
  w: number,
  h: number,
  e: Encuadre,
  pal: PaletaFondo,
  /** píxeles por punto del lienzo: el fondo se dibuja a esa resolución */
  densidad = 1
) {
  // a la resolución real del lienzo (2026-10-24): se dibujaba al tamaño CSS y se estiraba, y en el
  // celular (390 px estirados al triple) el degradado y el grano se veían borrosos, «de mala calidad»
  const k = Math.min(densidad, 2048 / w);
  lienzo.width = Math.round(w * k);
  lienzo.height = Math.round(h * k);
  const g = lienzo.getContext("2d");
  if (!g) return;
  g.scale(k, k);
  const ox = e.cx * w;
  const oy = e.cy * h;
  const a = e.alto;
  // base en diagonal, del azul noche casi negro al azul de la marca muy apagado
  const base = g.createLinearGradient(0, 0, w, h);
  base.addColorStop(0, pal.base[0]);
  base.addColorStop(0.6, pal.base[1]);
  base.addColorStop(1, pal.base[2]);
  g.fillStyle = base;
  g.fillRect(0, 0, w, h);
  const mancha = (
    x: number,
    y: number,
    rx: number,
    ry: number,
    giro: number,
    c: string
  ) => {
    g.save();
    g.translate(x, y);
    g.rotate(giro);
    g.scale(1, ry / rx);
    const rg = g.createRadialGradient(0, 0, 0, 0, 0, rx);
    rg.addColorStop(0, c);
    rg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = rg;
    g.fillRect(-rx, -rx, rx * 2, rx * 2);
    g.restore();
  };
  // dos manchas muy abiertas: el azul detrás del objeto y una veta en diagonal que cruza el lienzo
  mancha(ox, oy, a * 1.5, a * 1.2, 0, pal.manchas[0]);
  mancha(
    ox - a * 0.2,
    oy + a * 0.3,
    Math.max(w, h) * 0.55,
    a * 0.5,
    -0.45,
    pal.manchas[1]
  );
  mancha(w * 0.92, h * 0.08, a * 0.9, a * 0.7, 0, pal.manchas[2]);
  // grano: textura fina, apenas perceptible, que además quita las bandas del degradado
  const patron = g.createPattern(lienzoGrano(), "repeat");
  if (patron) {
    g.setTransform(1, 0, 0, 1, 0, 0); // un grano por téxel, sin estirar
    g.globalAlpha = pal.grano ?? 0.05; // con «overlay» sobre un fondo tan oscuro no se notaba (desvío 1/255)
    g.fillStyle = patron;
    g.fillRect(0, 0, w, h);
    g.globalAlpha = 1;
  }
}

export const escenaReel =
  (o: OpcionesReel) =>
  ({
    renderer,
    entorno,
    tactil,
    pedirCuadro,
    contenedor,
  }: Contexto): Escena => {
    // t1 («hueco»): al entrar por el triángulo el vidrio llega a cubrir la pantalla entera, y la
    // transmisión repinta toda la escena cada cuadro: a 0,6 de resolución pesa un tercio
    if (o.transicion === "hueco") renderer.transmissionResolutionScale = 0.6;
    const escena = new THREE.Scene();
    escena.environment = entorno();
    escena.environmentIntensity = 1.1;
    const camara = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
    camara.position.set(0, 0, 6);

    // el fondo va dentro de la escena: el vidrio lo refracta
    const lienzoFondo = document.createElement("canvas");
    const texFondo = new THREE.CanvasTexture(lienzoFondo);
    texFondo.colorSpace = THREE.SRGBColorSpace;
    // «apertura»: el fondo pasa a un cuadro de pantalla opaco que se puede fundir a blanco (también
    // en la pasada de transmisión, así el vidrio refracta el blanco y no el azul de antes)
    const fondoU = {
      tFondo: { value: texFondo },
      uBlanco: { value: 0 },
      uCentro: { value: new THREE.Vector2(0.5, 0.7) },
      uAspecto: { value: 1.6 },
    };
    if (o.transicion === "apertura") {
      const quad = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({
          vertexShader:
            "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }",
          fragmentShader:
            // amanecer radial: la luz sale del centro del isotipo, pasa por celeste y termina en blanco
            // (el fundido lineal de azul noche a blanco pasaba por un gris sucio)
            "uniform sampler2D tFondo; uniform float uBlanco; uniform vec2 uCentro; uniform float uAspecto; varying vec2 vUv; void main(){ vec3 c = texture2D(tFondo, vUv).rgb; vec2 d = (vUv - uCentro) * vec2(uAspecto, 1.0); float w = smoothstep(0.0, 1.0, uBlanco * 2.4 - length(d) * 1.1); vec3 celeste = vec3(0.62, 0.80, 0.98); vec3 luz = mix(celeste, vec3(1.0), smoothstep(0.35, 1.0, w)); gl_FragColor = vec4(mix(c, luz, w), 1.0); \n#include <colorspace_fragment>\n }",
          uniforms: fondoU,
          depthWrite: false,
          depthTest: false,
        })
      );
      quad.frustumCulled = false;
      quad.renderOrder = -10;
      escena.add(quad);
    } else escena.background = texFondo;

    // el reel
    const video = document.createElement("video");
    Object.assign(video, {
      src: o.video,
      muted: true,
      loop: true,
      playsInline: true,
      preload: "auto",
    });
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    const textura = new THREE.VideoTexture(video);
    textura.colorSpace = THREE.SRGBColorSpace;
    // quieta (movimiento reducido o en pausa) igual tiene que mostrar el primer cuadro del reel
    video.addEventListener("loadeddata", () => pedirCuadro(), { once: true });
    const pantalla = new THREE.Mesh(
      new THREE.PlaneGeometry(16 / 9, 1),
      new THREE.MeshBasicMaterial({
        map: textura,
        toneMapped: false,
        depthWrite: false,
      })
    );
    // solo se pinta dentro de la pasada de transmisión (render target), nunca en pantalla
    pantalla.onBeforeRender = (r) => {
      (pantalla.material as THREE.MeshBasicMaterial).colorWrite =
        r.getRenderTarget() !== null;
    };
    escena.add(pantalla);

    const vidrio = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      roughness: 0.03,
      transmission: 1,
      thickness: 0.9,
      ior: 1.45,
      dispersion: 5,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      specularIntensity: 1,
      side: THREE.DoubleSide,
    });
    const pivote = new THREE.Group();
    escena.add(pivote);
    const giro = new THREE.Group();
    pivote.add(giro);
    const NOMBRES = ["arriba", "izquierda", "abajo"] as const;
    const piezas = NOMBRES.map((n, i) => {
      const g = extruir(forma(ISOTIPO.piezas[n]), 0.36, 0.06);
      g.computeBoundingBox();
      const c = new THREE.Vector3();
      g.boundingBox?.getCenter(c);
      g.translate(-c.x, -c.y, 0);
      const m = new THREE.Mesh(g, vidrio);
      m.position.set(c.x, c.y, 0);
      giro.add(m);
      const fuera = new THREE.Vector3(
        c.x - CENTRO.x,
        c.y - CENTRO.y,
        0
      ).normalize();
      return {
        m,
        casa: new THREE.Vector3(c.x, c.y, 0),
        fuera,
        eje: new THREE.Vector3(-fuera.y, fuera.x, 0),
        giroZ: i === 1 ? 0.4 : -0.4,
        llegada: 0,
      };
    });

    // t4 («frente»): una luz con la forma del hueco DETRÁS del vidrio. Es opaca (entra en la pasada de
    // transmisión), así las tres piezas la refractan y se encienden por dentro cuando llega la hoja.
    // Un poco más grande que el hueco: también ilumina las rendijas y los cantos interiores.
    let luzHueco: THREE.Mesh | null = null;
    const NOCHE_HUECO = new THREE.Color("#071a4a");
    const BLANCO_LUZ = new THREE.Color(2.4, 2.6, 2.7);
    if (o.transicion === "frente") {
      const vertices = (
        [
          [775, 486],
          [545, 900],
          [1005, 900],
        ] as const
      ).map((v) => {
        const p = aXY(v);
        return new THREE.Vector2(
          HUECO.x + (p.x - HUECO.x) * 1.12,
          HUECO.y + (p.y - HUECO.y) * 1.12
        );
      });
      luzHueco = new THREE.Mesh(
        new THREE.ShapeGeometry(new THREE.Shape(vertices)),
        new THREE.MeshBasicMaterial({
          color: NOCHE_HUECO.clone(),
          toneMapped: false,
        })
      );
      luzHueco.position.z = -0.2;
      luzHueco.visible = false;
      giro.add(luzHueco);
    }

    const brillo = new THREE.DirectionalLight("#ffffff", 2.4);
    brillo.position.set(3, 4, 4);
    escena.add(brillo);
    const contraluz = new THREE.DirectionalLight("#7ECFC3", 1.3);
    contraluz.position.set(-4, 1.5, -3);
    escena.add(contraluz);

    // ——— interacción: arrastre con inercia ———
    const seccion = contenedor.parentElement;
    const limpiar: (() => void)[] = [];
    const escuchar = <K extends keyof WindowEventMap>(
      blanco: Window | HTMLElement,
      tipo: K,
      fn: (ev: WindowEventMap[K]) => void
    ) => {
      blanco.addEventListener(tipo, fn as EventListener, { passive: true });
      limpiar.push(() => blanco.removeEventListener(tipo, fn as EventListener));
    };
    const cursor = (c: string) => {
      if (seccion && seccion.style.cursor !== c) seccion.style.cursor = c;
    };
    if (o.interaccion && seccion) limpiar.push(() => cursor(""));

    // arrastre: girar con el puntero (o el dedo), con inercia
    let arrastrando = false;
    let ultimoX = 0;
    let vel = 0;
    let giroExtra = 0;
    if (o.interaccion === "arrastre" && seccion) {
      cursor("grab");
      escuchar(seccion, "pointerdown", (ev) => {
        if ((ev.target as HTMLElement).closest("a,button")) return;
        arrastrando = true;
        ultimoX = ev.clientX;
        cursor("grabbing");
        pedirCuadro();
      });
      escuchar(window, "pointermove", (ev) => {
        if (!arrastrando) return;
        vel = (ev.clientX - ultimoX) * 0.006;
        ultimoX = ev.clientX;
        giroExtra += vel;
        pedirCuadro();
      });
      const soltar = () => {
        if (!arrastrando) return;
        arrastrando = false;
        cursor("grab");
        pedirCuadro();
      };
      escuchar(window, "pointerup", soltar);
      escuchar(window, "pointercancel", soltar);
    }

    let base = { x: 0, y: 0, escala: 1 };
    // transición con el scroll (t1–t3): progreso 0…1 por accion(), y lo que hace falta para
    // proyectar el hueco a píxeles
    let prog = 0;
    let anchoPx = 1;
    let altoPx = 1;
    let escalaPantalla = 1;
    const vh = new THREE.Vector3();
    const vr = new THREE.Vector3();
    const suave = (x: number) => {
      const t = Math.min(1, Math.max(0, x));
      return t * t * (3 - 2 * t);
    };
    let angulo = 0;
    const q = new THREE.Quaternion();
    const Z = new THREE.Vector3(0, 0, 1);
    const cuadro = (t: number) => {
      // gira despacio sobre su eje (≈ una vuelta cada 30 s) y cabecea apenas
      angulo =
        o.giro === "balanceo"
          ? -0.35 + Math.sin(t * 0.32) * 0.75
          : -0.5 + t * 0.21;
      pivote.position.set(base.x, base.y, 0);
      pivote.scale.setScalar(base.escala);
      // las piezas llegan de una en una, de canto, y encajan
      piezas.forEach((p, i) => {
        p.llegada = 1 - llegada(tramo(t, 0.1 + i * 0.28, 1.5));
      });
    };
    return {
      escena,
      camara,
      duracion: 2.2,
      continua: true,
      cuadro,
      puntero: true,
      accion: (v) => {
        prog = Math.min(1, Math.max(0, v ?? 0));
      },
      liberar: () => {
        for (const f of limpiar) f();
      },
      alPausar: (p) => {
        if (p) video.pause();
        else video.play().catch(() => undefined);
      },
      paso: (x, y) => {
        let sigue = false;
        // arrastre con inercia (sin abrirse al pasar el ratón: 2026-10-15, «no hagas que se
        // expanda al pasar el mouse»)
        if (o.interaccion === "arrastre") {
          if (!arrastrando) {
            giroExtra += vel;
            vel *= 0.94;
          } else vel *= 0.8; // quieto antes de soltar, no sale disparado
          // al apagarse el impulso vuelve a mandar el giro propio, en su sentido de siempre
          if (Math.abs(vel) > 0.0002 || arrastrando) sigue = true;
        }
        giro.rotation.set(
          -0.12 + Math.sin(angulo * 0.7) * 0.08 + y * 0.12,
          angulo + giroExtra + x * 0.25,
          0.04
        );
        for (const p of piezas) {
          const r = p.llegada;
          p.m.position.copy(p.casa).addScaledVector(p.fuera, 0.05 + 0.32 * r);
          p.m.position.z = 0.35 * r;
          p.m.quaternion.setFromAxisAngle(p.eje, -0.75 * r);
          q.setFromAxisAngle(Z, p.giroZ * r);
          p.m.quaternion.multiply(q);
        }
        if (o.transicion && prog > 0) {
          // de frente: el giro va a la vuelta entera más cercana (sin desenrollarse) y sin cabeceo
          const f = suave(
            prog *
              (o.transicion === "apertura"
                ? 2
                : o.transicion === "frente"
                  ? 3
                  : 4)
          );
          const a = giro.rotation.y;
          const frente = Math.round(a / (Math.PI * 2)) * Math.PI * 2;
          giro.rotation.set(
            giro.rotation.x * (1 - f),
            a + (frente - a) * f,
            giro.rotation.z * (1 - f)
          );
          if (o.transicion === "hueco") {
            // la cámara «entra» por el triángulo: crece con el hueco quieto en pantalla
            const s = 1 + 5.5 * prog * prog;
            const k = base.escala * (s - 1);
            pivote.scale.setScalar(base.escala * s);
            pivote.position.set(base.x - HUECO.x * k, base.y - HUECO.y * k, 0);
          } else if (o.transicion === "frente") {
            // t4: de frente y un poco más cerca, con el hueco quieto en pantalla
            const s = 1 + (o.acercamiento ?? 0.32) * suave(prog / 0.7);
            const k = base.escala * (s - 1);
            pivote.scale.setScalar(base.escala * s);
            pivote.position.set(base.x - HUECO.x * k, base.y - HUECO.y * k, 0);
          } else {
            // las piezas se abren hacia la cámara y salen del cuadro; el fondo amanece a blanco
            const e = suave(prog / 0.42);
            for (const p of piezas) {
              p.m.position.addScaledVector(p.fuera, 3.4 * e);
              p.m.position.z += 2.8 * e;
              q.setFromAxisAngle(p.eje, -1.4 * e);
              p.m.quaternion.multiply(q);
            }
            fondoU.uBlanco.value = suave((prog - 0.02) / 0.33);
            pantalla.scale.setScalar(
              escalaPantalla * (1 - suave(prog * 3)) + 1e-4
            );
          }
        } else if (o.transicion === "apertura") {
          fondoU.uBlanco.value = 0;
          pantalla.scale.setScalar(escalaPantalla);
        }
        if (o.alHueco) {
          pivote.updateMatrixWorld(true);
          vh.set(HUECO.x, HUECO.y, 0);
          giro.localToWorld(vh).project(camara);
          vr.set(HUECO.x + RADIO_HUECO, HUECO.y, 0);
          giro.localToWorld(vr).project(camara);
          const x = (vh.x * 0.5 + 0.5) * anchoPx;
          const y = (-vh.y * 0.5 + 0.5) * altoPx;
          const xr = (vr.x * 0.5 + 0.5) * anchoPx;
          const yr = (-vr.y * 0.5 + 0.5) * altoPx;
          const rh = Math.hypot(xr - x, yr - y);
          o.alHueco(x, y, rh);
          if (luzHueco) {
            // la punta de la hoja está a altoPx·(1 − prog) del borde de arriba: el hueco se enciende
            // cuando se le acerca (la misma cuenta que hace el DOM para su halo)
            const punta = altoPx * (1 - prog);
            const llega = suave((y + rh * 7 - punta) / (rh * 6));
            luzHueco.visible = llega > 0.01;
            (luzHueco.material as THREE.MeshBasicMaterial).color
              .copy(NOCHE_HUECO)
              .lerp(BLANCO_LUZ, llega * (o.luzMax ?? 1));
          }
        }
        return sigue;
      },
      medir: (w, h) => {
        camara.aspect = w / h;
        camara.updateProjectionMatrix();
        const e = o.encuadre(w, h);
        const vh =
          2 *
          camara.position.z *
          Math.tan(THREE.MathUtils.degToRad(camara.fov / 2));
        const porPx = vh / h;
        base = {
          x: (e.cx - 0.5) * w * porPx,
          y: (0.5 - e.cy) * h * porPx,
          escala: (e.alto * porPx * (tactil ? 0.95 : 1)) / ALTO_ISO,
        };
        // la pantalla del vídeo, detrás del objeto y algo más grande que él
        const ancho = 2 * base.escala * 1.35;
        pantalla.scale.set(ancho / (16 / 9), ancho / (16 / 9), 1);
        escalaPantalla = ancho / (16 / 9);
        anchoPx = w;
        altoPx = h;
        fondoU.uCentro.value.set(e.cx, 1 - e.cy);
        fondoU.uAspecto.value = w / h;
        pantalla.position.set(base.x, base.y, -1.1);
        dibujarFondoSutil(
          lienzoFondo,
          w,
          h,
          e,
          o.paleta,
          renderer.getPixelRatio()
        );
        texFondo.needsUpdate = true;
      },
    };
  };
