// Laboratorio · estudio de realismo (2026-10-16). Alexander: «quiero que aprendas a hacer mejores
// animaciones, más reales, creativas, inmersivas, apoyándote de OpenAI si es necesario». Primer
// estudio: que una escena parezca una foto. El fotograma objetivo salió de OpenAI (el isotipo de
// vidrio en una mesa de terrazo junto a la ventana, con el cielo gris de Lima) y la escena se
// construye hasta parecerse, con lo que three r186 trae y el laboratorio no usaba:
//   · WebGPURenderer (cae a WebGL2 solo) con RenderPipeline: oclusión GTAO, antialias temporal
//     (TRAA), profundidad de campo y grano
//   · sombras que dejan pasar luz (shadowMap.transmitted) con cáusticas en el castShadowNode
//   · el entorno de reflejos se hornea de NUESTRA ventana (pmrem.fromScene de un cuarto con la vista
//     de la Costa Verde): el vidrio refleja la misma ventana que se ve detrás, como en la foto
// La vista, el cuaderno y el fotograma objetivo son de OpenAI; el terrazo, de ambientCG (CC0).
// Se dibuja solo cuando algo cambia: el TRAA necesita unos cuadros para asentarse y después se para.
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { dof } from "three/addons/tsl/display/DepthOfFieldNode.js";
import { film } from "three/addons/tsl/display/FilmNode.js";
import { ao } from "three/addons/tsl/display/GTAONode.js";
import { traa } from "three/addons/tsl/display/TRAANode.js";
import {
  Fn,
  builtinAOContext,
  div,
  float,
  mix,
  mrt,
  mx_worley_noise_vec2,
  normalView,
  packNormalToRGB,
  pass,
  positionLocal,
  positionViewDirection,
  refract,
  renderOutput,
  sample,
  screenUV,
  smoothstep,
  texture,
  uniform,
  unpackRGBToNormal,
  vec3,
  velocity,
} from "three/tsl";
import * as THREE from "three/webgpu";
import { ISOTIPO } from "~/components/axium/tres/isotipo";
import { cadenaMedios, crearCortina } from "~/components/laboratorio/medios";

export type EstadoRealismo = {
  listo: boolean;
  /** «webgpu» o «webgl2» (el renderer cae solo si el navegador no tiene WebGPU) */
  motor: string;
  fps: number;
  /** el TRAA ya se asentó y no hay nada que cambie: no se dibuja */
  reposo?: boolean;
  /** estudio de los cuatro medios: 0 foto · 1 impresa · 2 pintada · 3 en pantalla */
  medio?: number;
  error?: string;
};

const RUTA = "/laboratorio/realismo/";
const ALTO_ISO = 0.15; // m: una escultura de escritorio
const ESC = ALTO_ISO / ISOTIPO.alto;

/** las tres piezas del isotipo, en metros, de pie sobre su borde inferior */
function piezasIsotipo(fondo: number, bisel: number) {
  const cx = ISOTIPO.ancho / 2;
  return (["arriba", "izquierda", "abajo"] as const).map((n) => {
    const forma = new THREE.Shape(
      ISOTIPO.piezas[n].map(
        ([x, y]) => new THREE.Vector2((x - cx) * ESC, (ISOTIPO.alto - y) * ESC)
      )
    );
    const g = new THREE.ExtrudeGeometry(forma, {
      depth: fondo,
      bevelEnabled: true,
      bevelThickness: bisel,
      bevelSize: bisel,
      bevelOffset: -bisel,
      bevelSegments: 4,
      curveSegments: 1,
    });
    g.translate(0, 0, -fondo / 2);
    return g;
  });
}

/** la taza: un perfil torneado (pared con grosor) */
function geometriaTaza() {
  const p = [
    [0, 0],
    [0.031, 0],
    [0.036, 0.003],
    [0.04, 0.012],
    [0.043, 0.07],
    [0.0425, 0.074],
    [0.04, 0.0745],
    [0.0385, 0.07],
    [0.036, 0.014],
    [0.03, 0.008],
    [0, 0.007],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(p, 64);
}

/** cerámica moteada: el blanco hueso con puntitos grises, como la taza de la foto */
function texturaMoteada() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const x = c.getContext("2d") as CanvasRenderingContext2D;
  x.fillStyle = "#E9E5DD";
  x.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 2600; i++) {
    const r = Math.random() ** 3 * 2.4 + 0.4;
    x.fillStyle = `rgba(${70 + Math.random() * 40},${66 + Math.random() * 30},60,${0.25 + Math.random() * 0.5})`;
    x.beginPath();
    x.arc(Math.random() * c.width, Math.random() * c.height, r, 0, 7);
    x.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** las hojas del cuaderno: un plano que baja hacia el lomo, con la imagen de los bocetos */
function geometriaHojas(ancho: number, fondo: number) {
  const g = new THREE.PlaneGeometry(ancho, fondo, 64, 2);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) / (ancho / 2);
    pos.setY(i, 0.0105 - 0.0075 * Math.exp(-Math.abs(x) * 9) - 0.0015 * x * x);
  }
  g.computeVertexNormals();
  return g;
}

export function crearRealismo(
  el: HTMLElement,
  alEstado: (e: EstadoRealismo) => void,
  opciones: { medios?: boolean } = {}
) {
  const medios = !!opciones.medios;
  const estado: EstadoRealismo = { listo: false, motor: "", fps: 0 };
  const emitir = () => alEstado({ ...estado });
  let vivo = true;
  let liberar = () => {};

  const iniciar = async () => {
    const renderer = new THREE.WebGPURenderer({ antialias: false });
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.03;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.transmitted = true;
    renderer.setClearColor(0xdfe2e4, 1);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText =
      "display:block;width:100%;height:100%;touch-action:pan-y";
    await renderer.init();
    if (!vivo) {
      renderer.dispose();
      return;
    }
    // biome-ignore lint/suspicious/noExplicitAny: el backend no está tipado en la API pública
    const backend = (renderer as any).backend;
    estado.motor = backend?.isWebGPUBackend ? "webgpu" : "webgl2";

    const escena = new THREE.Scene();
    // el cielo gris de Lima por encima de la vista (los pases de post-proceso no usan el clearColor:
    // sin fondo, lo que queda fuera de la foto sale negro)
    escena.background = new THREE.Color("#E4E7E9");
    const camara = new THREE.PerspectiveCamera(19, 1, 0.02, 80);
    const cargador = new THREE.TextureLoader();
    const cargar = (f: string, color = true) =>
      cargador.loadAsync(RUTA + f).then((t) => {
        if (color) t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        return t;
      });
    const [vista, cuaderno, terrazo, terrazoN, terrazoR] = await Promise.all([
      cargar("vista-lima.jpg"),
      cargar("cuaderno.jpg"),
      cargar("terrazo-color.jpg"),
      cargar("terrazo-normal.jpg", false),
      cargar("terrazo-rugosidad.jpg", false),
    ]);
    if (!vivo) return;

    // ── el cuarto: la ventana con la Costa Verde detrás, un muro blanco a la derecha ──
    const BRILLO_VISTA = uniform(1.55);
    const matVista = new THREE.MeshBasicNodeMaterial();
    matVista.colorNode = texture(vista).rgb.mul(BRILLO_VISTA);
    const fondo = new THREE.Mesh(new THREE.PlaneGeometry(9.4, 5.3), matVista);
    fondo.position.set(-0.84, -0.07, -20);
    escena.add(fondo);
    const muro = new THREE.MeshStandardMaterial({
      color: "#E6E6E3",
      roughness: 0.95,
    });
    const muroDer = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), muro);
    muroDer.position.set(3.05, 1.2, -1.66);
    escena.add(muroDer);
    const aluminio = new THREE.MeshStandardMaterial({
      color: "#3B3F44",
      roughness: 0.45,
      metalness: 0.6,
    });
    for (const x of [-1.5, 0.25, 1.25]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.05, 4, 0.07), aluminio);
      m.position.set(x, 1.2, -1.62);
      escena.add(m);
    }
    const repisa = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.05, 0.12),
      aluminio
    );
    repisa.position.set(-0.6, -0.03, -1.62);
    escena.add(repisa);

    // ── la mesa de terrazo ──
    for (const t of [terrazo, terrazoN, terrazoR]) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(15, 11); // un tile de ~23 cm: granos de 3 a 8 mm, como en la foto
    }
    const mesa = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 2.5),
      new THREE.MeshStandardMaterial({
        map: terrazo,
        normalMap: terrazoN,
        normalScale: new THREE.Vector2(0.6, 0.6),
        roughnessMap: terrazoR,
        roughness: 0.42,
        color: "#F4F4F2",
      })
    );
    mesa.rotation.x = -Math.PI / 2;
    mesa.position.set(-0.2, 0, -0.4);
    mesa.receiveShadow = true;
    escena.add(mesa);

    // ── la escultura: tres piezas de vidrio óptico ──
    const vidrio = new THREE.MeshPhysicalNodeMaterial({
      color: "#FFFFFF",
      transmission: 1,
      roughness: 0.035,
      ior: 1.52,
      thickness: 0.022,
      dispersion: 0.18,
      attenuationColor: new THREE.Color("#CFE6FA"),
      attenuationDistance: 0.32,
      specularIntensity: 1,
      envMapIntensity: 2.2,
      side: THREE.DoubleSide,
      transparent: true,
    });
    // los cantos: mirando el vidrio de canto la luz recorre más vidrio y sale azul y oscura (en la
    // foto los costados de las placas son líneas azules). La transmisión usa un grosor uniforme, así
    // que el recorrido largo se imita con el ángulo: color de transmisión según qué tan de canto
    const canto = float(1)
      .sub(normalView.dot(positionViewDirection).abs())
      .pow(2.2);
    vidrio.colorNode = mix(vec3(1), vec3(0.28, 0.5, 0.72), canto);
    // la sombra del vidrio deja pasar luz y la concentra en cáusticas (celdas de Worley que siguen
    // la refracción): el parche claro sobre el terrazo de la foto
    const intensidadCaustica = uniform(1.8);
    vidrio.castShadowPositionNode = Fn(() => positionLocal)();
    vidrio.castShadowNode = Fn(() => {
      const r = refract(
        positionViewDirection.negate(),
        normalView,
        div(1.0, 1.52)
      ).normalize();
      const frente = normalView.z.abs().pow(6);
      const uv = r.xy.mul(1.4).add(positionLocal.xy.mul(18));
      const f = mx_worley_noise_vec2(vec3(uv, 0.5));
      const filo = smoothstep(0.22, 0.0, f.y.sub(f.x));
      const tinte = vec3(0.92, 0.97, 1.0);
      return tinte.mul(frente.mul(0.55).add(filo.mul(intensidadCaustica)));
    })();
    const escultura = new THREE.Group();
    for (const g of piezasIsotipo(0.022, 0.0026)) {
      const m = new THREE.Mesh(g, vidrio);
      m.castShadow = true;
      escultura.add(m);
    }
    escultura.position.set(-0.12, 0.0005, 0.02);
    escultura.rotation.y = 0.42;
    escena.add(escultura);

    // ── el cuaderno abierto ──
    const cuadernoG = new THREE.Group();
    const tapa = new THREE.Mesh(
      new RoundedBoxGeometry(0.43, 0.006, 0.305, 2, 0.002),
      new THREE.MeshStandardMaterial({ color: "#3A3E44", roughness: 0.92 })
    );
    tapa.position.y = 0.003;
    tapa.castShadow = tapa.receiveShadow = true;
    const hojas = new THREE.Mesh(
      geometriaHojas(0.415, 0.29),
      new THREE.MeshStandardMaterial({ map: cuaderno, roughness: 0.96 })
    );
    hojas.castShadow = hojas.receiveShadow = true;
    cuadernoG.add(tapa, hojas);
    cuadernoG.position.set(0.24, 0, -0.26);
    cuadernoG.rotation.y = -0.16;
    escena.add(cuadernoG);

    // ── el lápiz de grafito ──
    const lapiz = new THREE.Group();
    const cuerpo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0036, 0.0036, 0.16, 6),
      new THREE.MeshStandardMaterial({ color: "#3C4046", roughness: 0.42 })
    );
    const madera = new THREE.Mesh(
      new THREE.ConeGeometry(0.0036, 0.017, 6),
      new THREE.MeshStandardMaterial({ color: "#D8B98F", roughness: 0.8 })
    );
    madera.position.y = 0.0885;
    const mina = new THREE.Mesh(
      new THREE.ConeGeometry(0.0011, 0.0052, 12),
      new THREE.MeshStandardMaterial({
        color: "#2A2B2E",
        roughness: 0.3,
        metalness: 0.4,
      })
    );
    mina.position.y = 0.0946;
    lapiz.add(cuerpo, madera, mina);
    for (const m of lapiz.children) m.castShadow = true;
    lapiz.rotation.set(0, 0, Math.PI / 2);
    const lapizBase = new THREE.Group();
    lapizBase.add(lapiz);
    lapizBase.position.set(0.27, 0.0036, 0.02);
    lapizBase.rotation.y = -0.32;
    escena.add(lapizBase);

    // ── la taza de cerámica ──
    const taza = new THREE.Mesh(
      geometriaTaza(),
      new THREE.MeshStandardMaterial({
        map: texturaMoteada(),
        roughness: 0.55,
        side: THREE.DoubleSide,
      })
    );
    taza.position.set(0.43, 0, -0.62);
    taza.castShadow = taza.receiveShadow = true;
    escena.add(taza);

    // ── la luz: el día nublado entra por la ventana ──
    // el entorno se hornea de un cuarto con NUESTRA ventana: lo que el vidrio refleja es lo mismo
    // que se ve detrás
    const cuarto = new THREE.Scene();
    const paredes = new THREE.Mesh(
      new THREE.BoxGeometry(7, 4, 7),
      new THREE.MeshBasicMaterial({ color: "#C4C5C6", side: THREE.BackSide })
    );
    paredes.position.set(0, 1.4, 1.6);
    const ventana = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 2.6),
      new THREE.MeshBasicNodeMaterial({
        colorNode: texture(vista).rgb.mul(3.2),
      })
    );
    ventana.position.set(-0.6, 1.25, -1.85);
    const techo = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 7),
      new THREE.MeshBasicMaterial({ color: "#DADADA" })
    );
    techo.rotation.x = Math.PI / 2;
    techo.position.set(0, 3.35, 1.6);
    cuarto.add(paredes, ventana, techo);
    const pmrem = new THREE.PMREMGenerator(renderer);
    escena.environment = pmrem.fromScene(cuarto, 0.02).texture;
    escena.environmentIntensity = 0.85;
    pmrem.dispose();

    const sol = new THREE.DirectionalLight("#EEF2F7", 1.6);
    sol.position.set(-1.7, 1.15, -0.9);
    sol.target.position.set(0.05, 0, 0);
    sol.castShadow = true;
    sol.shadow.mapSize.set(2048, 2048);
    sol.shadow.mapType = THREE.HalfFloatType;
    sol.shadow.radius = 9;
    sol.shadow.bias = -0.0004;
    sol.shadow.normalBias = 0.01;
    const sc = sol.shadow.camera;
    sc.left = -0.9;
    sc.right = 0.9;
    sc.top = 0.9;
    sc.bottom = -0.9;
    sc.near = 0.3;
    sc.far = 4;
    escena.add(sol, sol.target);

    // ── la cadena: pre-pase (normales y velocidad) → escena con oclusión → TRAA → foco → grano ──
    const pipeline = new THREE.RenderPipeline(renderer);
    const prePase = pass(escena, camara);
    prePase.setMRT(
      mrt({ output: packNormalToRGB(normalView), velocity: velocity })
    );
    const normalPre = sample((uv) =>
      unpackRGBToNormal(prePase.getTextureNode().sample(uv))
    );
    const profundidad = prePase.getTextureNode("depth");
    const velocidad = prePase.getTextureNode("velocity");
    const texNormal = prePase.getTexture("output");
    texNormal.type = THREE.UnsignedByteType;
    const pase = pass(escena, camara);
    const oclusion = ao(profundidad, normalPre, camara);
    oclusion.resolutionScale = 0.5;
    oclusion.radius.value = 0.06;
    oclusion.thickness.value = 0.4;
    oclusion.scale.value = 1.2;
    pase.contextNode = builtinAOContext(
      oclusion.getTextureNode().sample(screenUV).r
    );
    const temporal = traa(pase, profundidad, velocidad, camara);
    temporal.useSubpixelCorrection = false;
    const FOCO = uniform(1.52); // m: la distancia a la escultura
    const RANGO = uniform(0.8);
    const BOKEH = uniform(13);
    const foco = dof(temporal, prePase.getViewZNode(), FOCO, RANGO, BOKEH);
    const GRANO = uniform(0.045);
    const foto = film(foco, GRANO);
    // estudio de los cuatro medios: los efectos trabajan sobre la foto ya en colores de pantalla
    // (tono y sRGB aplicados antes), así el papel, las tintas y el LED se escriben en valores reales
    const cadena = medios
      ? cadenaMedios(
          renderOutput(foto),
          Math.min(window.devicePixelRatio || 1, 1.5)
        )
      : null;
    if (cadena) {
      pipeline.outputColorTransform = false;
      pipeline.outputNode = cadena.salida;
    } else pipeline.outputNode = foto;
    // la cortina: voile colgado delante del vidrio, a la izquierda; la brisa la mueve (la «cosa viva»
    // del estudio, en los cuatro medios). Llega hasta el suelo: se ve el tramo sobre la mesa
    const cortina = medios
      ? crearCortina(renderer, escena, {
          x0: -0.78,
          ancho: 0.46,
          arriba: 2.3,
          alto: 3.0,
          z: -1.5,
        })
      : null;

    // ── encuadre, puntero y scroll ──
    // la escultura va donde la pone la foto (tercio izquierdo, un poco bajo el centro): la cámara
    // apunta a un punto corrido según el campo de visión. El TRAA usa setViewOffset para su jitter,
    // así que no se puede descentrar la lente: se descentra la mirada
    const centroEsc = new THREE.Vector3(-0.12, 0.075, 0.02);
    const desdeEsc = new THREE.Vector3(0.2, 0.125, 1.5);
    const enPantalla = { x: -0.42, y: -0.12 }; // −1…1 desde el centro del cuadro
    const mirar = new THREE.Vector3();
    const puntero = { x: 0, y: 0, sx: 0, sy: 0 };
    let quietos = 0; // cuadros seguidos sin cambios: el TRAA se asienta en ~24 y ahí se para
    let progreso = 0; // 0: foco en el vidrio · 1: foco en la ventana
    let suave = 0;
    let w = 1;
    let h = 1;
    const medir = () => {
      w = el.clientWidth || window.innerWidth;
      h = el.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(dpr);
      if (cadena) cadena.px.value = dpr;
      renderer.setSize(w, h, false);
      camara.aspect = w / h;
      // en vertical la lente se abre para que entre la escultura y algo de la mesa
      camara.fov = w / h < 0.8 ? 19 : 10.5;
      camara.updateProjectionMatrix();
      quietos = 0;
    };
    const alMover = (e: PointerEvent) => {
      puntero.x = (e.clientX / w) * 2 - 1;
      puntero.y = (e.clientY / h) * 2 - 1;
      quietos = 0;
    };
    const alScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progreso = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      quietos = 0;
    };
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    window.addEventListener("pointermove", alMover, { passive: true });
    window.addEventListener("scroll", alScroll, { passive: true });
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      quietos = 0;
    });
    io.observe(el);
    const alVisibilidad = () => {
      quietos = 0;
    };
    document.addEventListener("visibilitychange", alVisibilidad);
    medir();
    alScroll();

    // calentamiento: compilar todo antes de mostrar (los tirones de compilación se ven)
    await renderer.compileAsync(escena, camara);
    if (!vivo) return;

    let ultimo = performance.now();
    let cuadros = 0;
    let marca = performance.now();
    const cuadro = () => {
      if (!visible || document.hidden) return;
      const ahora = performance.now();
      const dt = Math.min(0.05, (ahora - ultimo) / 1000);
      ultimo = ahora;
      const k = 1 - Math.exp(-dt * 3.2);
      puntero.sx += (puntero.x - puntero.sx) * k;
      puntero.sy += (puntero.y - puntero.sy) * k;
      suave += (progreso - suave) * (1 - Math.exp(-dt * 4));
      const moviendo =
        Math.abs(puntero.x - puntero.sx) > 0.0005 ||
        Math.abs(puntero.y - puntero.sy) > 0.0005 ||
        Math.abs(progreso - suave) > 0.0005;
      if (moviendo || cortina) quietos = 0; // con la cortina siempre hay algo que cambia
      if (quietos > 28) {
        if (!estado.reposo) {
          estado.reposo = true;
          emitir();
        }
        return;
      }
      if (estado.reposo) {
        estado.reposo = false;
        emitir();
      }
      quietos++;
      // el foco viaja de la escultura (1,5 m) a la ventana (~20 m) y la cámara se acerca un poco;
      // en el estudio de medios el foco se queda en la escultura y el scroll cambia de medio
      const e = medios ? 0 : suave * suave * (3 - 2 * suave);
      if (cadena) {
        const p = suave * 3;
        const a = Math.min(3, Math.floor(p));
        const t = a < 3 ? THREE.MathUtils.smoothstep(p - a, 0.3, 0.7) : 0;
        cadena.medioA.value = a;
        cadena.medioB.value = Math.min(3, a + 1);
        cadena.mezcla.value = t;
        const medio = t > 0.5 ? a + 1 : a;
        if (medio !== estado.medio) {
          estado.medio = medio;
          emitir();
        }
      }
      cortina?.paso(dt);
      FOCO.value = THREE.MathUtils.lerp(1.52, 19, e ** 1.6);
      RANGO.value = THREE.MathUtils.lerp(0.8, 12, e);
      camara.position.set(
        centroEsc.x + desdeEsc.x + puntero.sx * 0.035,
        centroEsc.y + desdeEsc.y - puntero.sy * 0.02 + e * 0.05,
        centroEsc.z + desdeEsc.z - e * 0.1
      );
      const d = camara.position.distanceTo(centroEsc);
      const tv = Math.tan(THREE.MathUtils.degToRad(camara.fov / 2));
      const vertical = camara.aspect < 0.8;
      const sx = vertical ? 0 : enPantalla.x;
      const sy = vertical ? -0.32 : enPantalla.y; // en vertical, abajo: el texto va arriba
      mirar.set(
        centroEsc.x - sx * d * tv * camara.aspect,
        centroEsc.y - sy * d * tv + e * 0.07,
        centroEsc.z
      );
      camara.lookAt(mirar);
      pipeline.render();
      cuadros++;
      if (ahora - marca > 500) {
        estado.fps = Math.round((cuadros * 1000) / (ahora - marca));
        cuadros = 0;
        marca = ahora;
        emitir();
      }
    };
    renderer.setAnimationLoop(cuadro);
    estado.listo = true;
    emitir();

    liberar = () => {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", alMover);
      window.removeEventListener("scroll", alScroll);
      document.removeEventListener("visibilitychange", alVisibilidad);
      escena.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
      });
      for (const t of [vista, cuaderno, terrazo, terrazoN, terrazoR])
        t.dispose();
      escena.environment?.dispose();
      cortina?.liberar();
      pipeline.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  };

  iniciar().catch((e: unknown) => {
    estado.error = e instanceof Error ? e.message : String(e);
    emitir();
  });

  return {
    liberar: () => {
      vivo = false;
      liberar();
    },
  };
}
