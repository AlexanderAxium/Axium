// El motor de las escenas 3D de los heroes (2026-10-11). Se importa solo con import() desde un
// efecto, así three.js viaja en su propio chunk y no pesa en el resto de la web.
//
// Reglas que aplica a todas las escenas (ver ~/.claude/skills/creator/TRES-D.md):
// - Una animación de entrada, de duración fija, y quieta en su estado final. Con movimiento
//   reducido se dibuja directamente el último cuadro.
// - Las escenas «continuas» (un objeto que gira despacio con un vídeo dentro, 33–35) siguen vivas
//   después de la entrada, pero solo mientras se ven y no están en pausa: el hero lleva un botón de
//   pausa (WCAG 2.2.2) y con movimiento reducido quedan quietas desde el principio.
// - Se dibuja a pedido: el bucle de requestAnimationFrame vive solo mientras algo se mueve (la
//   entrada, la inclinación con el puntero o un resaltado). Quieta, no gasta GPU.
// - Los shaders se compilan antes de arrancar el reloj (compileAsync) para que el primer segundo
//   de la animación no salte, y el lienzo aparece con un fundido cuando ya hay un cuadro.
// - Píxeles por punto con techo (2 en escritorio, 1,5 en pantallas táctiles).
// - Al desmontar se libera todo y se suelta el contexto (en desarrollo, StrictMode monta dos veces).
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type Escena = {
  escena: THREE.Scene;
  camara: THREE.Camera;
  /** segundos de la entrada; después la escena queda quieta */
  duracion: number;
  /** pone la escena en el instante t (0…duracion); tiene que ser determinista */
  cuadro: (t: number) => void;
  /** reencuadre al cambiar el tamaño del lienzo */
  medir: (ancho: number, alto: number) => void;
  /** cada cuadro, después de cuadro(t): recibe el puntero ya amortiguado (-1…1) y mueve sus propios
   *  amortiguadores; devuelve true mientras algo siga moviéndose */
  paso?: (x: number, y: number) => boolean;
  /** si la escena se inclina con el puntero */
  puntero?: boolean;
  /** acción opcional desde React (p. ej. resaltar una pieza) */
  accion?: (valor: number | null) => void;
  /** sigue moviéndose después de la entrada (mientras se vea y no esté en pausa) */
  continua?: boolean;
  /** la escena pausa o reanuda lo suyo (p. ej. un vídeo) */
  alPausar?: (pausada: boolean) => void;
  /** suelta lo propio de la escena (escuchas del puntero, estilos que tocó) */
  liberar?: () => void;
};

export type Contexto = {
  renderer: THREE.WebGLRenderer;
  /** mapa de entorno neutro (RoomEnvironment) para materiales físicos */
  entorno: () => THREE.Texture;
  tactil: boolean;
  /** pide un cuadro cuando la escena cambia sola (p. ej. al terminar de cargar una fuente) */
  pedirCuadro: () => void;
  /** el elemento que contiene el lienzo (su padre es la sección, para escuchar el puntero) */
  contenedor: HTMLElement;
};

export type Control = {
  accion: (valor: number | null) => void;
  pausar: (pausada: boolean) => void;
  /** vuelve a encuadrar (p. ej. cuando el objeto se coloca sobre un hueco del maquetado que se movió) */
  medir: () => void;
  /** tapada por otra capa (la sección siguiente encima): no dibuja nada, ni con el puntero, y el
   *  vídeo se detiene. Distinto de pausar(), que deja inclinar la escena quieta */
  ocultar: (oculta: boolean) => void;
  liberar: () => void;
};

export function montar(
  contenedor: HTMLElement,
  crear: (ctx: Contexto) => Escena,
  alListo?: () => void
): Control | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch {
    return null; // sin WebGL: el hero se lee igual sin la escena
  }
  const tactil = window.matchMedia("(pointer: coarse)").matches;
  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, tactil ? 1.5 : 2)
  );
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Neutral (Khronos PBR Neutral) respeta los colores de marca; ACES los lava y les corre el tono.
  renderer.toneMapping = THREE.NeutralToneMapping;
  const lienzo = renderer.domElement;
  lienzo.style.cssText =
    "display:block;width:100%;height:100%;opacity:0;transition:opacity .6s ease";
  contenedor.appendChild(lienzo);

  let pmrem: THREE.PMREMGenerator | null = null;
  let mapaEntorno: THREE.Texture | null = null;
  const entorno = () => {
    if (!mapaEntorno) {
      pmrem = new THREE.PMREMGenerator(renderer);
      mapaEntorno = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    }
    return mapaEntorno;
  };

  const e = crear({
    renderer,
    entorno,
    tactil,
    pedirCuadro: () => despertar(),
    contenedor,
  });

  // El reloj avanza solo mientras corre (no en pausa, no fuera de pantalla), con pasos de como
  // mucho 0,1 s para que volver a la pestaña no dé un salto.
  let reloj = 0;
  let arrancado = false; // ya compiló y empezó la entrada
  let previo = -1;
  let raf = 0;
  let vivo = true;
  let pausada = quieto;
  let visible = true;
  let oculta = false;
  const puntero = { x: 0, y: 0, ax: 0, ay: 0 }; // destino y valor amortiguado

  const t = () =>
    quieto || !arrancado
      ? e.duracion
      : e.continua
        ? reloj
        : Math.min(reloj, e.duracion);
  const corriendo = () => arrancado && !pausada && visible && !oculta;
  const dibujar = () => {
    e.cuadro(t());
    const sigue = e.paso?.(puntero.ax, puntero.ay) ?? false;
    renderer.render(e.escena, e.camara);
    return sigue;
  };
  const paso = (ahora: number) => {
    raf = 0;
    if (!vivo) return;
    // fuera de pantalla no se dibuja: el puntero (que se escucha en toda la ventana) y accion()
    // despertaban el bucle y el hero se pintaba aunque estuviera muy arriba. Medido 2026-10-16:
    // ~800 llamadas WebGL por segundo leyendo otra sección con el ratón en movimiento. Al volver a
    // verse, el IntersectionObserver lo despierta y dibuja el estado actual.
    if ((!visible || oculta) && arrancado) {
      previo = -1;
      return;
    }
    if (corriendo() && previo >= 0)
      reloj += Math.min(0.1, (ahora - previo) / 1000);
    previo = corriendo() ? ahora : -1;
    puntero.ax += (puntero.x - puntero.ax) * 0.07;
    puntero.ay += (puntero.y - puntero.ay) * 0.07;
    const propio = dibujar();
    const animando = corriendo() && (e.continua || reloj < e.duracion);
    const inclinando =
      Math.abs(puntero.x - puntero.ax) + Math.abs(puntero.y - puntero.ay) >
      0.0005;
    if (animando || inclinando || propio) despertar();
  };
  const despertar = () => {
    if (!raf && vivo) raf = requestAnimationFrame(paso);
  };
  const avisarPausa = () => e.alPausar?.(!corriendo());

  // Fuera de pantalla no se dibuja ni corre el vídeo
  const io = new IntersectionObserver(([entrada]) => {
    visible = !!entrada?.isIntersecting;
    avisarPausa();
    despertar();
  });
  io.observe(contenedor);

  const medir = () => {
    const { width, height } = contenedor.getBoundingClientRect();
    if (width < 2 || height < 2) return;
    renderer.setSize(width, height, false);
    e.medir(width, height);
    despertar();
  };
  const ro = new ResizeObserver(medir);
  ro.observe(contenedor);
  medir();

  // Inclinación con el puntero: solo con ratón y solo si no se pidió menos movimiento.
  const alMover = (ev: PointerEvent) => {
    puntero.x = (ev.clientX / window.innerWidth) * 2 - 1;
    puntero.y = (ev.clientY / window.innerHeight) * 2 - 1;
    despertar();
  };
  const conPuntero = !!e.puntero && !tactil && !quieto;
  if (conPuntero)
    window.addEventListener("pointermove", alMover, { passive: true });

  // Compilar antes de arrancar el reloj: el primer cuadro con shaders nuevos tarda cientos de ms.
  e.cuadro(0);
  renderer
    .compileAsync(e.escena, e.camara)
    .catch(() => undefined)
    .then(() => {
      if (!vivo) return;
      arrancado = true;
      dibujar();
      lienzo.style.opacity = "1";
      alListo?.();
      avisarPausa();
      despertar();
    });

  return {
    accion: (valor) => {
      e.accion?.(valor);
      despertar();
    },
    medir: () => medir(),
    ocultar: (o) => {
      if (oculta === o) return;
      oculta = o;
      avisarPausa();
      despertar();
    },
    pausar: (p) => {
      pausada = p || quieto;
      avisarPausa();
      despertar();
    },
    liberar: () => {
      vivo = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      e.alPausar?.(true);
      e.liberar?.();
      if (conPuntero) window.removeEventListener("pointermove", alMover);
      e.escena.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mats = Array.isArray(m.material)
          ? m.material
          : m.material
            ? [m.material]
            : [];
        for (const mat of mats) {
          for (const v of Object.values(mat))
            if (v instanceof THREE.Texture) v.dispose();
          mat.dispose();
        }
      });
      mapaEntorno?.dispose();
      (pmrem as THREE.PMREMGenerator | null)?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      lienzo.remove();
    },
  };
}

// ——— utilidades compartidas por las escenas ———

export const suave = (x: number) => {
  const k = Math.min(1, Math.max(0, x));
  return k * k * (3 - 2 * k);
};
/** salida rápida y llegada larga, sin rebote */
export const llegada = (x: number) =>
  1 - (1 - Math.min(1, Math.max(0, x))) ** 4;
/** progreso de un tramo [desde, desde+dura] dentro de t */
export const tramo = (t: number, desde: number, dura: number) =>
  Math.min(1, Math.max(0, (t - desde) / dura));
