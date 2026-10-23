// Laboratorio 3D · el folleto (2026-10-16), a partir de shader.se (#about-us). Allí: un «About Us»
// maquetado como folleto corporativo de los 80 que, al final («Had enough reading? Let's shred this
// thing»), pasa por una trituradora y deja ver la escena siguiente. Lo que se toma de su caso de
// estudio (Codrops, 2026-05):
//   · una configuración de tramos (cada uno con su largo) y un solo valor de scroll: cada cuadro solo
//     se dibuja la escena del tramo activo, las demás no gastan nada
//   · entrar al monitor con un «plano a la medida del encuadre»: la cámara avanza por la normal de la
//     pantalla hasta la distancia exacta en que la pantalla llena el cuadro, y ahí se cambia de escena
//     sin que se note (la pantalla mide lo mismo que la ventana)
//   · la página es UNA textura (el folleto maquetado en un canvas): la misma en la pantalla del
//     monitor, en la lectura y en las tiras de la trituradora
// La trituradora: la hoja se parte en tiras verticales (una malla cada una, muchos segmentos); al
// pasar la ranura cada tira se separa, se ondula y gira sobre su eje, así se ve el dorso del papel.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { ISOTIPO } from "~/components/axium/tres/isotipo";
import { crearLab, liberarEscena } from "~/components/laboratorio/base";
import { CURVAS } from "~/components/laboratorio/planos";

export type EstadoFolleto = {
  listo: boolean;
  /** tramo activo: 0 monitor · 1 lectura · 2 trituradora · 3 contacto */
  tramo: number;
  /** avance dentro del tramo (0…1) */
  avance: number;
  /** alto total del recorrido en px (el DOM fija con él el alto del scroll) */
  alto: number;
  fps: number;
};

// ── el folleto, maquetado en un canvas ──
const TINTA = "#0B1530";
const PAPEL = "#F2EEE4";
const AZUL = "#0092D1";
const FRANJAS = ["#0B1530", "#0057B8", "#0092D1", "#7ECFC3", "#FFCB40"];
const SERVICIOS: {
  n: string;
  titulo: string;
  texto: string;
  lista: string[];
}[] = [
  {
    n: "01",
    titulo: "Diseño y marca",
    texto:
      "Marcas que comunican y productos que enamoran: identidad visual, brochures, diseño web y diseño de producto.",
    lista: [
      "Identidad visual y logo",
      "UI/UX y diseño de producto",
      "Diseño web y landing pages",
    ],
  },
  {
    n: "02",
    titulo: "Desarrollo de software",
    texto:
      "Plataformas web y móviles a medida con TypeScript, Next.js, React Native y Node.js: rápidas, seguras y listas para crecer.",
    lista: [
      "Desarrollo web y móvil",
      "Paneles, reservas y pagos",
      "Integraciones a medida",
    ],
  },
  {
    n: "03",
    titulo: "IA y agentes",
    texto:
      "Agentes y automatizaciones conectados a tus datos y herramientas, con LLMs y RAG, para que tus procesos corran solos.",
    lista: [
      "Casos de uso con IA",
      "Automatización de procesos",
      "Prototipado y escalamiento",
    ],
  },
];
const EN_PRODUCCION = [
  "Rematch",
  "Aurore",
  "Feniz",
  "LumioLearn",
  "Vendiq",
  "Bookit",
  "ANJ Sports",
  "Clefast",
  "Sportt Perú",
  "Hoteles Paraíso",
  "MainTech",
  "To Live Again",
];

function partir(ctx: CanvasRenderingContext2D, texto: string, ancho: number) {
  const palabras = texto.split(" ");
  const lineas: string[] = [];
  let linea = "";
  for (const p of palabras) {
    const prueba = linea ? `${linea} ${p}` : p;
    if (ctx.measureText(prueba).width > ancho && linea) {
      lineas.push(linea);
      linea = p;
    } else linea = prueba;
  }
  if (linea) lineas.push(linea);
  return lineas;
}

/** maqueta el folleto para una ventana de W×H px: la portada mide justo una pantalla (es lo que se
 *  ve en el monitor) y la última pantalla termina con «¿Mucho texto?» */
function maquetar(W: number, H: number) {
  const ancho = W < 820;
  const m = Math.max(22, Math.min(W * 0.07, 110));
  const util = W - 2 * m;
  // dos pasadas: la primera mide (alto), la segunda dibuja en un canvas de ese alto
  const dibujar = (
    ctx: CanvasRenderingContext2D | null,
    medir: CanvasRenderingContext2D
  ) => {
    const c = ctx ?? medir;
    const pinta = !!ctx;
    let y = 0;
    const texto = (
      t: string,
      x: number,
      yy: number,
      fuente: string,
      color: string,
      alinear: CanvasTextAlign = "left"
    ) => {
      c.font = fuente;
      if (!pinta) return;
      c.fillStyle = color;
      c.textAlign = alinear;
      c.fillText(t, x, yy);
    };
    const parrafo = (
      t: string,
      x: number,
      yy: number,
      anchoP: number,
      tam: number,
      fuente: string,
      color: string,
      inter = 1.55
    ) => {
      c.font = fuente;
      const lineas = partir(c, t, anchoP);
      lineas.forEach((l, i) =>
        texto(l, x, yy + i * tam * inter, fuente, color)
      );
      return lineas.length * tam * inter;
    };
    // ── portada (una pantalla) ──
    if (pinta) {
      c.fillStyle = PAPEL;
      c.fillRect(0, 0, W, 99999);
    }
    const s = ancho ? 11 : 12;
    texto(
      "AXIUM · SOFTWARE HOUSE · LIMA, PERÚ",
      m,
      m * 0.7 + s,
      `600 ${s}px Gilroy`,
      TINTA
    );
    if (!ancho)
      texto(
        "FOLLETO CORPORATIVO · EDICIÓN 2026",
        W - m,
        m * 0.7 + s,
        `600 ${s}px Gilroy`,
        TINTA,
        "right"
      );
    if (pinta) {
      c.fillStyle = TINTA;
      c.fillRect(m, m * 0.7 + s * 2.2, util, 1.5);
    }
    // el isotipo, como ilustración impresa
    const isoAlto = ancho
      ? Math.min(H * 0.26, util * 0.62)
      : Math.min(H * 0.46, util * 0.3);
    const isoAncho = (isoAlto * ISOTIPO.ancho) / ISOTIPO.alto;
    const isoX = ancho ? m : W - m - isoAncho;
    const isoY = ancho ? m * 0.7 + s * 4 + 18 : H * 0.2;
    if (pinta) {
      const colores = [AZUL, TINTA, "#7ECFC3"];
      (["arriba", "izquierda", "abajo"] as const).forEach((n, i) => {
        c.beginPath();
        ISOTIPO.piezas[n].forEach(([px, py], k) => {
          const x = isoX + (px / ISOTIPO.ancho) * isoAncho;
          const yy = isoY + (py / ISOTIPO.alto) * isoAlto;
          if (k === 0) c.moveTo(x, yy);
          else c.lineTo(x, yy);
        });
        c.closePath();
        c.fillStyle = colores[i] as string;
        c.fill();
      });
    }
    const TITULO =
      "Soluciones digitales para empresas que se toman en serio la tecnología.";
    const SUB =
      "Diseño, software e inteligencia artificial, con un solo equipo y sin pasar tu proyecto de mano en mano.";
    const anchoTit = ancho ? util : util - isoAncho - m;
    const tamSub = ancho ? 17 : 21;
    const anchoSub = ancho ? util : anchoTit * 0.85;
    const yFr = H - (ancho ? 70 : 96);
    // el título se achica hasta que título y subtítulo entran sobre las franjas
    let tamTit = ancho ? Math.min(42, W * 0.105) : Math.min(84, W * 0.058);
    const yTitDe = (tam: number) =>
      ancho ? isoY + isoAlto + tam * 1.4 : H * 0.3;
    const pieDe = (tam: number) => {
      c.font = `${tam}px GuarujaTitle`;
      const lt = partir(c, TITULO, anchoTit).length;
      c.font = `italic ${tamSub}px Georgia`;
      const ls = partir(c, SUB, anchoSub).length;
      return yTitDe(tam) + lt * tam * 1.06 + tamSub * 0.6 + ls * tamSub * 1.45;
    };
    while (tamTit > 22 && pieDe(tamTit) > yFr - 28) tamTit -= 1;
    const yTit = yTitDe(tamTit);
    const altoTit = parrafo(
      TITULO,
      m,
      yTit,
      anchoTit,
      tamTit,
      `${tamTit}px GuarujaTitle`,
      TINTA,
      1.06
    );
    parrafo(
      SUB,
      m,
      yTit + altoTit + tamSub * 0.6,
      anchoSub,
      tamSub,
      `italic ${tamSub}px Georgia`,
      "#2B3550",
      1.45
    );
    // franjas de la marca al pie de la portada
    if (pinta)
      FRANJAS.forEach((col, i) => {
        c.fillStyle = col;
        c.fillRect(0, yFr + i * 9, W, 6);
      });
    y = H + (ancho ? 40 : 70);

    // ── ¿Quiénes somos? ──
    const tamH2 = ancho ? 30 : 46;
    texto("¿Quiénes somos?", m, y + tamH2, `${tamH2}px GuarujaTitle`, TINTA);
    y += tamH2 * 1.9;
    const tamP = ancho ? 16 : 18;
    const colAncho = ancho ? util : (util - m * 0.6) / 2;
    const p1 =
      "Axium es una software house de Lima, Perú. Ofrecemos soluciones digitales y consultoría para impulsar el crecimiento de tu negocio: diseñamos marcas y productos, desarrollamos plataformas web y móviles a medida, y conectamos la inteligencia artificial a tus procesos.";
    const p2 =
      "Trabajamos con un solo equipo de principio a fin: quien entiende tu negocio es quien lo diseña, lo programa y lo pone en producción. Sin intermediarios y sin teléfono malogrado.";
    const a1 = parrafo(p1, m, y, colAncho, tamP, `400 ${tamP}px Gilroy`, TINTA);
    const a2 = ancho
      ? parrafo(
          p2,
          m,
          y + a1 + tamP,
          colAncho,
          tamP,
          `400 ${tamP}px Gilroy`,
          TINTA
        )
      : parrafo(
          p2,
          m + colAncho + m * 0.6,
          y,
          colAncho,
          tamP,
          `400 ${tamP}px Gilroy`,
          TINTA
        );
    y += (ancho ? a1 + tamP + a2 : Math.max(a1, a2)) + tamP * 2.2;
    // cifras
    const tamN = ancho ? 54 : 78;
    [
      ["45", "proyectos entregados"],
      ["4", "productos propios en producción"],
    ].forEach(([n, et], i) => {
      const x = ancho ? m : m + i * (colAncho + m * 0.6);
      const yy = ancho ? y + i * (tamN * 1.5) : y;
      texto(n as string, x, yy + tamN * 0.8, `${tamN}px GuarujaTitle`, AZUL);
      c.font = `${tamN}px GuarujaTitle`;
      const wN = c.measureText(n as string).width;
      texto(
        et as string,
        x + wN + 14,
        yy + tamN * 0.8,
        `italic ${ancho ? 16 : 19}px Georgia`,
        TINTA
      );
    });
    y += ancho ? tamN * 3.1 : tamN * 1.6;

    // ── Lo que hacemos ──
    if (pinta) {
      c.fillStyle = TINTA;
      c.fillRect(m, y, util, 1.5);
    }
    y += tamH2 * 1.6;
    texto("Lo que hacemos", m, y, `${tamH2}px GuarujaTitle`, TINTA);
    y += tamH2 * 1.1;
    const cols = ancho ? 1 : 3;
    const anchoS = (util - (cols - 1) * m * 0.5) / cols;
    let altoFila = 0;
    SERVICIOS.forEach((sv, i) => {
      const x = m + (i % cols) * (anchoS + m * 0.5);
      let yy = y + (ancho ? altoFila : 0);
      texto(sv.n, x, yy + 22, `600 ${ancho ? 13 : 14}px Gilroy`, AZUL);
      yy += 34;
      const tamT = ancho ? 22 : 26;
      yy +=
        parrafo(
          sv.titulo,
          x,
          yy + tamT * 0.9,
          anchoS,
          tamT,
          `${tamT}px GuarujaTitle`,
          TINTA,
          1.1
        ) + 8;
      yy +=
        parrafo(
          sv.texto,
          x,
          yy + tamP,
          anchoS,
          tamP - 1,
          `400 ${tamP - 1}px Gilroy`,
          "#2B3550"
        ) + 10;
      for (const item of sv.lista) {
        texto(`— ${item}`, x, yy + tamP, `italic ${tamP - 1}px Georgia`, TINTA);
        yy += tamP * 1.6;
      }
      const alto = yy - (y + (ancho ? altoFila : 0));
      altoFila = ancho ? altoFila + alto + 30 : Math.max(altoFila, alto);
    });
    y += altoFila + tamH2;

    // ── en producción ──
    if (pinta) {
      c.fillStyle = TINTA;
      c.fillRect(m, y, util, 1.5);
    }
    y += tamH2 * 1.6;
    texto("Ya están en producción", m, y, `${tamH2}px GuarujaTitle`, TINTA);
    y += tamH2 * 0.9;
    const colN = ancho ? 2 : 4;
    const anchoN = util / colN;
    const tamC = ancho ? 19 : 26;
    EN_PRODUCCION.forEach((n, i) => {
      const x = m + (i % colN) * anchoN;
      const yy = y + Math.floor(i / colN) * tamC * 1.9;
      texto(
        n,
        x,
        yy + tamC,
        `${tamC}px GuarujaTitle`,
        i % 3 === 1 ? AZUL : TINTA
      );
    });
    y += Math.ceil(EN_PRODUCCION.length / colN) * tamC * 1.9 + tamH2;

    // ── el cupón ──
    const alCup = ancho ? 170 : 150;
    const anCup = ancho ? util : Math.min(util, 760);
    if (pinta) {
      c.save();
      c.setLineDash([10, 7]);
      c.lineWidth = 2;
      c.strokeStyle = TINTA;
      c.strokeRect(m, y, anCup, alCup);
      c.restore();
    }
    texto("✂", m - 6, y + 6, "22px Georgia", TINTA);
    texto(
      "¡ACTÚA YA!",
      m + 26,
      y + 44,
      `600 ${ancho ? 14 : 16}px Gilroy`,
      AZUL
    );
    parrafo(
      "Agenda una llamada y cuéntanos tu proyecto. Te respondemos con una propuesta clara, sin letra pequeña.",
      m + 26,
      y + 78,
      anCup - 52,
      ancho ? 17 : 20,
      `italic ${ancho ? 17 : 20}px Georgia`,
      TINTA,
      1.4
    );
    y += alCup + tamH2 * 1.2;

    // ── la última pantalla: «¿Mucho texto?», una hoja aparte (la que se tritura) ──
    const finInicio = Math.max(y, 0);
    if (pinta) {
      c.save();
      c.setLineDash([6, 6]);
      c.lineWidth = 1.5;
      c.strokeStyle = "rgba(11,21,48,0.5)";
      c.beginPath();
      c.moveTo(0, finInicio + 1);
      c.lineTo(W, finInicio + 1);
      c.stroke();
      c.restore();
    }
    texto(
      "✂  corta por aquí",
      W - m,
      finInicio + 26,
      `italic ${ancho ? 14 : 16}px Georgia`,
      "rgba(11,21,48,0.6)",
      "right"
    );
    const tamFin = ancho ? Math.min(46, W * 0.11) : Math.min(96, W * 0.066);
    const yFin = finInicio + H * 0.18;
    texto("¿Mucho texto?", m, yFin + tamFin, `${tamFin}px GuarujaTitle`, TINTA);
    // en móvil la segunda frase no entra en una línea: se parte
    const altoFin = parrafo(
      "Pasémoslo por la trituradora.",
      m,
      yFin + tamFin * 2.1,
      util,
      tamFin,
      `${tamFin}px GuarujaTitle`,
      AZUL,
      1.06
    );
    texto(
      "Sigue bajando ↓",
      m,
      yFin + tamFin * 1.1 + altoFin + 44,
      `italic ${ancho ? 17 : 20}px Georgia`,
      "#2B3550"
    );
    const alto = Math.ceil(finInicio + H);
    // marcas de corte y grano de papel
    if (pinta) {
      c.strokeStyle = "rgba(11,21,48,0.45)";
      c.lineWidth = 1;
      for (const [x, yy, dx, dy] of [
        [14, 14, 1, 1],
        [W - 14, 14, -1, 1],
      ] as const) {
        c.beginPath();
        c.moveTo(x, yy + dy * 18);
        c.lineTo(x, yy);
        c.lineTo(x + dx * 18, yy);
        c.stroke();
      }
    }
    return { alto, corte: finInicio };
  };
  const medir = document
    .createElement("canvas")
    .getContext("2d") as CanvasRenderingContext2D;
  const { alto, corte } = dibujar(null, medir);
  // escala: nítido en retina pero dentro del máximo de textura (8192 px de alto)
  const escala = Math.min(2, 8192 / alto, 4096 / W);
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.round(W * escala);
  lienzo.height = Math.round(alto * escala);
  const ctx = lienzo.getContext("2d") as CanvasRenderingContext2D;
  ctx.scale(escala, escala);
  ctx.textBaseline = "alphabetic";
  dibujar(ctx, medir);
  // grano: puntos muy suaves sobre todo el papel
  ctx.globalAlpha = 0.035;
  for (let i = 0; i < (W * alto) / 90; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? "#000" : "#fff";
    ctx.fillRect(Math.random() * W, Math.random() * alto, 1, 1);
  }
  ctx.globalAlpha = 1;
  return { lienzo, alto, corte };
}

// ── shaders ──
const PANTALLA_VS = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
// la portada del folleto en un tubo de rayos catódicos: curvatura, líneas, separación de color y
// brillo; uCrt baja a 0 al final de la entrada y la pantalla queda igual que la hoja
const PANTALLA_FS = /* glsl */ `
  uniform sampler2D tPagina;
  uniform float uSpan;
  uniform float uCrt;
  uniform float uTiempo;
  uniform float uLineas;
  varying vec2 vUv;
  void main() {
    vec2 c = vUv - 0.5;
    vec2 uv = vUv + c * dot(c, c) * 0.28 * uCrt;
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
    vec2 p = vec2(uv.x, 1.0 - (1.0 - uv.y) * uSpan);
    float sep = 0.0025 * uCrt;
    vec3 col = vec3(texture2D(tPagina, p + vec2(sep, 0.0)).r, texture2D(tPagina, p).g, texture2D(tPagina, p - vec2(sep, 0.0)).b);
    float lineas = 0.86 + 0.14 * sin(uv.y * uLineas * 3.14159);
    col *= mix(1.0, lineas, uCrt);
    col = mix(col, col * vec3(0.86, 0.97, 1.08) + 0.04, uCrt * 0.8);
    float vin = smoothstep(0.85, 0.35, length(c * vec2(1.0, 1.15)));
    col *= mix(1.0, 0.55 + 0.45 * vin, uCrt);
    col *= 1.0 - uCrt * 0.04 * sin(uTiempo * 50.0);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;
// las tiras: arriba de la ranura la hoja va plana; debajo, cada tira se aparta y se ondula, más cuanto
// más lejos de la ranura. La forma va pegada al papel (fase por px de la hoja): las ondas bajan con él
const TIRA_VS = /* glsl */ `
  attribute float aTira;
  attribute float aRand;
  uniform float uN;
  uniform float uW;
  uniform float uH;
  uniform float uAncho;
  uniform float uBaja;
  uniform float uRanura;
  uniform float uActiva;
  uniform float uPagTop;
  uniform float uPagAlto;
  varying vec2 vUv;
  varying float vSombra;
  varying float vFuera;
  varying float vPx;
  void main() {
    vec3 p = position; // x local a la tira, y de la hoja (arriba +1,5H, abajo −0,5H)
    float cx = (aTira + 0.5) * uAncho - uW * 0.5;
    float y = p.y - uBaja;
    float d = uRanura - y; // > 0: ya pasó la ranura
    float px = uPagTop + (uH * 1.5 - p.y); // px de la hoja
    float s = smoothstep(0.0, 26.0, d) * uActiva;
    float k = s * smoothstep(0.0, uH * 0.34, d);
    float fase = px * 0.0045 + aRand * 6.28;
    float ang = k * sin(fase) * (0.25 + 1.15 * aRand);
    float x = cx + p.x * cos(ang)
      + (aTira - uN * 0.5 + 0.5) * (1.5 * s + 3.5 * k)
      + sin(fase * 0.7 + 1.3) * 18.0 * k;
    float z = p.x * sin(ang) + sin(fase * 0.55 + 2.1) * 55.0 * k;
    y -= k * aRand * 46.0; // no caen todas igual
    vSombra = cos(ang);
    vFuera = d;
    vPx = px;
    vUv = vec2((aTira + p.x / uAncho + 0.5) / uN, 1.0 - px / uPagAlto);
    gl_Position = projectionMatrix * viewMatrix * vec4(x, y, z, 1.0);
  }
`;
const TIRA_FS = /* glsl */ `
  uniform sampler2D tPagina;
  uniform float uCorte;
  varying vec2 vUv;
  varying float vSombra;
  varying float vFuera;
  varying float vPx;
  void main() {
    // fuera de la hoja, o arriba de la línea de corte de la última hoja: no hay papel
    if (vUv.y > 1.0 || vUv.y < 0.0 || vPx < uCorte) discard;
    vec3 frente = texture2D(tPagina, vUv).rgb;
    vec3 dorso = vec3(0.80, 0.78, 0.73);
    vec3 col = gl_FrontFacing ? frente : dorso;
    // los pliegues: más oscuro cuanto más de canto queda la tira; y la sombra de la máquina
    col *= 0.72 + 0.28 * abs(vSombra);
    col *= vFuera > 0.0 ? 0.62 + 0.38 * smoothstep(0.0, 70.0, vFuera) : 1.0;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export function crearFolleto(
  el: HTMLElement,
  alEstado: (e: EstadoFolleto) => void,
  dom: {
    titulo: HTMLElement | null;
    trituradora: HTMLElement | null;
    contacto: HTMLElement | null;
  }
) {
  const estado: EstadoFolleto = {
    listo: false,
    tramo: 0,
    avance: 0,
    alto: 0,
    fps: 0,
  };
  const emitir = () => alEstado({ ...estado });

  return crearLab(
    el,
    ({ renderer, tactil, quieto, puntero }) => {
      renderer.setClearColor(0x000000, 0);
      let W = 1;
      let H = 1;

      // ── el monitor ──
      const monitor = new THREE.Scene();
      monitor.background = new THREE.Color("#060B1E");
      const camMonitor = new THREE.PerspectiveCamera(32, 1, 0.01, 60);
      monitor.add(new THREE.HemisphereLight("#C9D8FF", "#1A1D2B", 1.1));
      const clave = new THREE.DirectionalLight("#FFF4E6", 2.2);
      clave.position.set(-3, 4, 5);
      monitor.add(clave);
      const contra = new THREE.DirectionalLight("#4F8BFF", 1.6);
      contra.position.set(3, 2, -4);
      monitor.add(contra);
      const plastico = new THREE.MeshStandardMaterial({
        color: "#D9D3C5",
        roughness: 0.62,
      });
      const oscuro = new THREE.MeshStandardMaterial({
        color: "#16181F",
        roughness: 0.4,
      });
      const grupoM = new THREE.Group();
      monitor.add(grupoM);
      const SH = 1.6; // alto de la pantalla (unidades); el ancho sigue la proporción de la ventana
      const pantU = {
        tPagina: { value: null as THREE.Texture | null },
        uSpan: { value: 0.3 },
        uCrt: { value: 1 },
        uTiempo: { value: 0 },
        uLineas: { value: 320 },
      };
      const pantalla = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.ShaderMaterial({
          vertexShader: PANTALLA_VS,
          fragmentShader: PANTALLA_FS,
          uniforms: pantU,
        })
      );
      let cuerpo: THREE.Mesh | null = null;
      let marco: THREE.Mesh | null = null;
      const pie = new THREE.Mesh(
        new RoundedBoxGeometry(1.1, 0.16, 0.9, 3, 0.05),
        plastico
      );
      const cuello = new THREE.Mesh(
        new RoundedBoxGeometry(0.5, 0.5, 0.5, 3, 0.05),
        plastico
      );
      const led = new THREE.Mesh(
        new THREE.CircleGeometry(0.025, 16),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(0.4, 2.2, 1.6),
          toneMapped: false,
        })
      );
      grupoM.add(pantalla, pie, cuello, led);
      const armarMonitor = () => {
        const SW = SH * (W / H);
        if (cuerpo) {
          grupoM.remove(cuerpo);
          cuerpo.geometry.dispose();
        }
        if (marco) {
          grupoM.remove(marco);
          marco.geometry.dispose();
        }
        cuerpo = new THREE.Mesh(
          new RoundedBoxGeometry(SW + 0.55, SH + 0.75, 1.1, 6, 0.14),
          plastico
        );
        cuerpo.position.set(0, -0.08, -0.55);
        marco = new THREE.Mesh(
          new THREE.PlaneGeometry(SW + 0.12, SH + 0.12),
          oscuro
        );
        marco.position.set(0, 0, 0.003);
        grupoM.add(cuerpo, marco);
        pantalla.scale.set(SW, SH, 1);
        pantalla.position.set(0, 0, 0.006);
        cuello.position.set(0, -SH / 2 - 0.55, -0.6);
        pie.position.set(0, -SH / 2 - 0.85, -0.5);
        led.position.set(SW / 2 - 0.05, -SH / 2 - 0.25, 0.006);
      };
      // la distancia a la que la pantalla llena el cuadro (el plano «a la medida del encuadre»)
      const distanciaJusta = () =>
        SH / 2 / Math.tan(THREE.MathUtils.degToRad(camMonitor.fov / 2));

      // ── las tiras ──
      const tiras = new THREE.Scene();
      const camTiras = new THREE.PerspectiveCamera(30, 1, 1, 6000);
      const DIST = 1400;
      const tirasU = {
        tPagina: { value: null as THREE.Texture | null },
        uN: { value: 1 },
        uW: { value: 1 },
        uH: { value: 1 },
        uAncho: { value: 1 },
        uBaja: { value: 0 },
        uRanura: { value: -1e6 },
        uActiva: { value: 0 },
        uPagTop: { value: 0 },
        uPagAlto: { value: 1 },
        uCorte: { value: -1 },
      };
      const matTiras = new THREE.ShaderMaterial({
        vertexShader: TIRA_VS,
        fragmentShader: TIRA_FS,
        uniforms: tirasU,
        side: THREE.DoubleSide,
      });
      let mallaTiras: THREE.Mesh | null = null;
      const armarTiras = () => {
        if (mallaTiras) {
          tiras.remove(mallaTiras);
          mallaTiras.geometry.dispose();
        }
        const N = Math.max(10, Math.round(W / (tactil ? 26 : 42)));
        const ancho = W / N;
        const segs = Math.round((2 * H) / 10);
        const pos: number[] = [];
        const uv: number[] = [];
        const ti: number[] = [];
        const ra: number[] = [];
        const idx: number[] = [];
        let base = 0;
        for (let i = 0; i < N; i++) {
          const r = Math.random();
          for (let j = 0; j <= segs; j++) {
            const y = H * 1.5 - (j / segs) * 2 * H;
            for (const lx of [-ancho / 2, ancho / 2]) {
              pos.push(lx, y, 0);
              uv.push(0, 0);
              ti.push(i);
              ra.push(r);
            }
            if (j < segs) {
              const a = base + j * 2;
              idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
            }
          }
          base += (segs + 1) * 2;
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
        g.setAttribute("aTira", new THREE.Float32BufferAttribute(ti, 1));
        g.setAttribute("aRand", new THREE.Float32BufferAttribute(ra, 1));
        g.setIndex(idx);
        mallaTiras = new THREE.Mesh(g, matTiras);
        mallaTiras.frustumCulled = false;
        tiras.add(mallaTiras);
        tirasU.uN.value = N;
        tirasU.uW.value = W;
        tirasU.uH.value = H;
        tirasU.uAncho.value = ancho;
      };

      // ── el folleto (se vuelve a maquetar al cambiar el tamaño) ──
      let textura: THREE.CanvasTexture | null = null;
      let altoPagina = 1;
      let corte = 0;
      const maquetarFolleto = () => {
        const { lienzo, alto, corte: c } = maquetar(W, H);
        corte = c;
        textura?.dispose();
        textura = new THREE.CanvasTexture(lienzo);
        textura.colorSpace = THREE.SRGBColorSpace;
        textura.anisotropy = 8;
        textura.minFilter = THREE.LinearMipmapLinearFilter;
        altoPagina = alto;
        pantU.tPagina.value = textura;
        pantU.uSpan.value = H / alto;
        pantU.uLineas.value = H * 0.5;
        tirasU.tPagina.value = textura;
        tirasU.uPagAlto.value = alto;
      };

      // ── los tramos: un solo valor de scroll y el largo de cada uno ──
      const tramos = () => [
        H * 1.3,
        Math.max(0, altoPagina - H),
        H * 1.8,
        H * 0.7,
      ];
      const publicarAlto = () => {
        estado.alto = tramos().reduce((s, x) => s + x, 0) + H;
        emitir();
      };

      let prog = 0; // scroll suavizado en px
      let maxScroll = 1;
      const medirScroll = () => {
        maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      };
      const ro = new ResizeObserver(medirScroll);
      ro.observe(document.body);
      let tReal = performance.now();
      let cuadros = 0;
      let ultima = performance.now();
      let ultimoTramo = -1;
      let vacio = false;
      let ultimaClave = "";
      const inclin = { x: 0, y: 0 };

      // las fuentes de la web tienen que estar listas antes de maquetar el canvas
      Promise.all([
        document.fonts.load("48px GuarujaTitle"),
        document.fonts.load("400 18px Gilroy"),
        document.fonts.load("600 14px Gilroy"),
      ])
        .catch(() => undefined)
        .finally(() => {
          maquetarFolleto();
          publicarAlto();
          estado.listo = true;
          emitir();
        });

      return {
        medir: (w, h) => {
          W = w;
          H = h;
          camMonitor.aspect = w / h;
          camMonitor.updateProjectionMatrix();
          camTiras.aspect = w / h;
          camTiras.fov = THREE.MathUtils.radToDeg(2 * Math.atan(h / 2 / DIST));
          camTiras.position.set(0, 0, DIST);
          camTiras.lookAt(0, 0, 0);
          camTiras.updateProjectionMatrix();
          armarMonitor();
          armarTiras();
          ultimaClave = "";
          if (estado.listo) {
            maquetarFolleto();
            publicarAlto();
          }
          medirScroll();
        },
        cuadro: (_dt, t) => {
          const ahora = performance.now();
          const dtReal = Math.min(0.05, (ahora - tReal) / 1000);
          tReal = ahora;
          if (!textura) return;
          const objetivo = maxScroll > 0 ? window.scrollY : 0;
          prog = quieto
            ? objetivo
            : prog + (objetivo - prog) * (1 - Math.exp(-dtReal * 7));
          // ¿en qué tramo estamos?
          const L = tramos();
          let resto = prog;
          let tramo = 0;
          while (tramo < L.length - 1 && resto > (L[tramo] as number)) {
            resto -= L[tramo] as number;
            tramo++;
          }
          const avance = Math.min(
            1,
            Math.max(0, resto / Math.max(1, L[tramo] as number))
          );
          if (tramo !== ultimoTramo) {
            ultimoTramo = tramo;
            estado.tramo = tramo;
            emitir();
          }
          estado.avance = avance;
          // DOM: el titular del monitor, la trituradora y el contacto
          if (dom.titulo)
            dom.titulo.style.opacity = String(
              tramo === 0 ? 1 - Math.min(1, avance / 0.3) : 0
            );
          if (dom.trituradora) {
            const o =
              tramo === 2
                ? Math.min(1, avance / 0.06) *
                  (1 - THREE.MathUtils.smoothstep(avance, 0.62, 0.76))
                : 0;
            dom.trituradora.style.opacity = o.toFixed(3);
          }
          if (dom.contacto) {
            dom.contacto.style.visibility = tramo >= 2 ? "visible" : "hidden";
            dom.contacto.style.pointerEvents =
              tramo === 3 || (tramo === 2 && avance > 0.7) ? "auto" : "none";
          }
          el.style.pointerEvents =
            tramo === 3 || (tramo === 2 && avance > 0.7) ? "none" : "";

          // solo se dibuja la escena del tramo activo (las demás no gastan nada)
          if (tramo === 0) {
            const e = CURVAS.seda(avance);
            const kp = 1 - Math.exp(-dtReal * 3);
            inclin.x += ((puntero.dentro ? puntero.x : 0) - inclin.x) * kp;
            inclin.y += ((puntero.dentro ? puntero.y : 0) - inclin.y) * kp;
            grupoM.rotation.set(
              -inclin.y * 0.08 * (1 - e) - 0.04 * (1 - e),
              (inclin.x * 0.14 - 0.22) * (1 - e),
              0
            );
            const fin = distanciaJusta();
            // en vertical el monitor va más lejos y arriba: el titular queda abajo, sobre el fondo
            const vertical = W / H < 0.8;
            const desde = vertical
              ? new THREE.Vector3(0.5, 0.2, 8.4)
              : new THREE.Vector3(1.1, 0.45, 6.2);
            const hasta = new THREE.Vector3(0, 0, 0.006 + fin);
            camMonitor.position.copy(desde).lerp(hasta, e);
            camMonitor.lookAt(0, (vertical ? -0.95 : 0.05) * (1 - e), 0);
            pantU.uCrt.value =
              1 - THREE.MathUtils.smoothstep(avance, 0.62, 0.98);
            pantU.uTiempo.value = t;
            renderer.setClearColor(0x060b1e, 1);
            renderer.render(monitor, camMonitor);
          } else if (tramo === 1 || tramo === 2) {
            renderer.setClearColor(0x000000, 0);
            // lectura: la hoja sube 1:1 con el scroll; trituradora: baja hacia la ranura
            const leido = tramo === 1 ? resto : (L[1] as number);
            tirasU.uPagTop.value = leido - H;
            if (tramo === 1) {
              tirasU.uBaja.value = 0;
              tirasU.uActiva.value = 0;
              tirasU.uRanura.value = -1e6;
              tirasU.uCorte.value = -1;
            } else {
              // solo la última hoja (de la línea de corte para abajo) entra a la ranura; cuando
              // su borde de arriba la pasa, las tiras terminan de caer fuera del cuadro
              tirasU.uRanura.value = H * 0.5 - H * 0.62;
              tirasU.uCorte.value = corte;
              tirasU.uActiva.value = THREE.MathUtils.smoothstep(avance, 0, 0.1);
              tirasU.uBaja.value =
                THREE.MathUtils.smoothstep(avance, 0.03, 0.86) * H * 1.42;
            }
            // la hoja quieta no se vuelve a dibujar (el lienzo conserva el último cuadro)
            const clave = `${tramo}|${tirasU.uPagTop.value.toFixed(2)}|${tirasU.uBaja.value.toFixed(2)}|${tirasU.uActiva.value.toFixed(3)}`;
            if (clave !== ultimaClave) {
              ultimaClave = clave;
              renderer.render(tiras, camTiras);
            }
          } else if (!vacio) {
            // en el contacto el lienzo queda transparente: se limpia una vez y no se dibuja más
            renderer.setClearColor(0x000000, 0);
            renderer.clear();
          }
          vacio = tramo === 3;
          if (tramo === 0 || tramo === 3) ultimaClave = "";

          cuadros++;
          if (ahora - ultima > 500) {
            estado.fps = Math.round((cuadros * 1000) / (ahora - ultima));
            cuadros = 0;
            ultima = ahora;
            emitir();
          }
        },
        liberar: () => {
          ro.disconnect();
          liberarEscena(monitor);
          liberarEscena(tiras);
          textura?.dispose();
        },
      };
    },
    undefined,
    {
      antialias: true,
      alpha: true,
      dprMax:
        typeof window !== "undefined" &&
        window.matchMedia("(pointer: coarse)").matches
          ? 1.5
          : 2,
    }
  );
}
