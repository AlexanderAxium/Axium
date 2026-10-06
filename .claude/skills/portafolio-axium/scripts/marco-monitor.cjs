// marco-monitor.cjs — EL MONITOR DE ESCRITORIO SE CONSTRUYE, COMO EL RESTO.
//
// Hermano de marco-dispositivo.cjs. Mismo principio: el anillo del marco tiene
// ancho CONSTANTE porque  Rcuerpo = Rpantalla + bisel + pared + chaflán.
// Lo que añade es lo que un monitor tiene y una tableta no: **cuello y peana**.
// Y eso resuelve el problema nº1 que la undécima generación dejó abierto —
// «las piezas flotan sobre nada»—: un monitor se APOYA.
//
// Medidas de un aparato real (Apple Studio Display 27"):
//   pantalla activa     596,7 × 335,7 mm   (16:9)
//   carcasa             622,8 × 378,2 mm
//   → bisel lateral     (622,8−596,7)/2 = 13,05 mm = 2,187 % del ancho de pantalla
//   profundidad         16,9 mm  → pared visible de frente ≈ 0,55 %
//   cuello              alto ≈ 95 mm = 15,9 %, ancho ≈ 110 mm = 18,4 %
//   peana               ancho ≈ 168 mm = 28,2 %, alto ≈ 25 mm = 4,2 %
//
// Uso:
//   PWCORE=/ruta/a/playwright-core node marco-monitor.cjs <anchoPantallaPx> <dirSalida> [cuerpo]
//   cuerpo: aluminio (por defecto) | grafito | negro
//
// Produce en <dirSalida>/monitor-<ancho>-<cuerpo>/:
//   marco.png    — cuerpo + cuello + peana, con el hueco de pantalla TRANSPARENTE
//   vidrio.png   — el reflejo del cristal, recortado al hueco (va ENCIMA de la captura)
//   mascara.png  — el hueco en blanco (para redondear la captura)
//   geom.json    — rectángulo exacto de la pantalla dentro del lienzo

const { chromium } = require(process.env.PWCORE || "playwright");
const path = require("node:path");
const fs = require("node:fs");

const M = {
  aspecto: 9 / 16,     // alto/ancho de la PANTALLA
  bisel: 0.02187,
  pared: 0.0055,
  chaflan: 0.0022,
  radio: 0.016,        // esquina de la pantalla
  cuelloAlto: 0.122,
  cuelloAncho: 0.112,
  peanaAncho: 0.350,
  peanaAlto: 0.030,
};

const CUERPOS = {
  aluminio: { p0: "#F4F6F9", p1: "#A9AFB9", p2: "#D7DCE3", p3: "#868C96", ch: "#FFFFFF", chb: "#9CA2AC", bisel: "#0C0E12", bisel2: "#191C22", cu0: "#D9DEE5", cu1: "#8F959F", cu2: "#B7BDC6", pe0: "#C9CFD7", pe1: "#7E848E" },
  grafito:  { p0: "#5B6069", p1: "#24282E", p2: "#3B3F47", p3: "#131619", ch: "#E3E8F0", chb: "#3C4048", bisel: "#0A0C10", bisel2: "#14171D", cu0: "#4A4F57", cu1: "#23272D", cu2: "#35393F", pe0: "#3E434A", pe1: "#1C1F24" },
  negro:    { p0: "#3C4047", p1: "#131519", p2: "#24272C", p3: "#0B0D10", ch: "#A7ADB8", chb: "#2A2E34", bisel: "#07080B", bisel2: "#0F1116", cu0: "#2C3036", cu1: "#111317", cu2: "#1E2126", pe0: "#24272C", pe1: "#0D0F12" },
};

function svg(Ws, cuerpoNombre, capa) {
  const C = CUERPOS[cuerpoNombre];
  if (!C) throw new Error(`cuerpo desconocido: ${cuerpoNombre}`);

  const Hs = Math.round(Ws * M.aspecto);
  const b = Math.round(Ws * M.bisel);
  const w = Math.max(2, Math.round(Ws * M.pared));
  const c = Math.max(1.2, Ws * M.chaflan);
  const Rs = Ws * M.radio;
  const marco = b + w + c;              // anillo TOTAL y constante
  const Rb = Rs + marco;                // radio del cuerpo — calculado

  const Wc = Math.round(Ws + 2 * marco);  // ancho del cuerpo
  const Hc = Math.round(Hs + 2 * marco);  // alto del cuerpo

  const cuelloH = Math.round(Ws * M.cuelloAlto);
  const cuelloW = Math.round(Ws * M.cuelloAncho);
  const peanaW = Math.round(Ws * M.peanaAncho);
  const peanaH = Math.round(Ws * M.peanaAlto);

  const W = Math.max(Wc, peanaW);
  const H = Hc + cuelloH + peanaH;
  const ox = (W - Wc) / 2;                 // el cuerpo centrado en el lienzo
  const sx = ox + marco, sy = marco;       // origen de la PANTALLA

  const R = (o, extra = "") =>
    `<rect x="${o.x.toFixed(2)}" y="${o.y.toFixed(2)}" width="${o.w.toFixed(2)}" height="${o.h.toFixed(2)}" rx="${o.r.toFixed(2)}" ry="${o.r.toFixed(2)}" ${extra}/>`;

  const rCuerpo = { x: ox, y: 0, w: Wc, h: Hc, r: Rb };
  const rPared = { x: ox + c, y: c, w: Wc - 2 * c, h: Hc - 2 * c, r: Rb - c };
  const rBisel = { x: ox + c + w, y: c + w, w: Wc - 2 * (c + w), h: Hc - 2 * (c + w), r: Rb - c - w };
  const rPant = { x: sx, y: sy, w: Ws, h: Hs, r: Rs };

  // cuello: un prisma estrecho que sale de la espalda del cuerpo y baja a la peana.
  const cx = W / 2;
  const rCuello = { x: cx - cuelloW / 2, y: Hc - 2, w: cuelloW, h: cuelloH + peanaH * 0.5, r: cuelloW * 0.10 };
  // peana: un disco visto casi de canto → rectángulo muy redondeado
  const rPeana = { x: cx - peanaW / 2, y: Hc + cuelloH, w: peanaW, h: peanaH, r: peanaH * 0.50 };

  const defs = `
  <defs>
    <linearGradient id="pared" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0"    stop-color="${C.p0}"/>
      <stop offset="0.22" stop-color="${C.p1}"/>
      <stop offset="0.48" stop-color="${C.p2}"/>
      <stop offset="0.74" stop-color="${C.p1}"/>
      <stop offset="1"    stop-color="${C.p3}"/>
    </linearGradient>
    <linearGradient id="chaflan" x1="0.1" y1="0" x2="0.9" y2="1">
      <stop offset="0"    stop-color="${C.ch}"/>
      <stop offset="0.18" stop-color="${C.chb}"/>
      <stop offset="0.40" stop-color="${C.ch}"/>
      <stop offset="0.62" stop-color="${C.chb}"/>
      <stop offset="0.85" stop-color="${C.ch}"/>
      <stop offset="1"    stop-color="${C.chb}"/>
    </linearGradient>
    <linearGradient id="bisel" x1="0.15" y1="0" x2="0.85" y2="1">
      <stop offset="0" stop-color="${C.bisel2}"/>
      <stop offset="0.55" stop-color="${C.bisel}"/>
      <stop offset="1" stop-color="${C.bisel2}"/>
    </linearGradient>
    <!-- el cuello es un cilindro aplastado: claro en el centro, oscuro en los cantos -->
    <linearGradient id="cuello" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0"    stop-color="${C.cu1}"/>
      <stop offset="0.16" stop-color="${C.cu2}"/>
      <stop offset="0.42" stop-color="${C.cu0}"/>
      <stop offset="0.68" stop-color="${C.cu2}"/>
      <stop offset="1"    stop-color="${C.cu1}"/>
    </linearGradient>
    <linearGradient id="peana" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0"    stop-color="${C.pe0}"/>
      <stop offset="0.45" stop-color="${C.pe1}"/>
      <stop offset="1"    stop-color="${C.pe1}"/>
    </linearGradient>
    <linearGradient id="vidrio" x1="0" y1="0" x2="0.75" y2="1">
      <stop offset="0"    stop-color="#FFFFFF" stop-opacity="0.17"/>
      <stop offset="0.17" stop-color="#FFFFFF" stop-opacity="0.05"/>
      <stop offset="0.34" stop-color="#FFFFFF" stop-opacity="0.0"/>
      <stop offset="0.72" stop-color="#FFFFFF" stop-opacity="0.0"/>
      <stop offset="0.93" stop-color="#FFFFFF" stop-opacity="0.04"/>
      <stop offset="1"    stop-color="#FFFFFF" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="labio" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.30"/>
      <stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0.16"/>
    </linearGradient>
    <mask id="hueco">
      <rect x="0" y="0" width="${W}" height="${H}" fill="#000"/>
      ${R(rCuerpo, 'fill="#fff"')}
      ${R(rPant, 'fill="#000"')}
    </mask>
    <mask id="soloPantalla">
      <rect x="0" y="0" width="${W}" height="${H}" fill="#000"/>
      ${R(rPant, 'fill="#fff"')}
    </mask>
  </defs>`;

  if (capa === "mascara")
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${R(rPant, 'fill="#ffffff"')}</svg>`;

  if (capa === "vidrio")
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}
      <g mask="url(#soloPantalla)"><rect x="0" y="0" width="${W}" height="${H}" fill="url(#vidrio)"/></g>
    </svg>`;

  const dCam = Math.max(3, b * 0.30);
  const cyc = c + w + b / 2;

  // capa "marco": peana y cuello van DEBAJO del cuerpo
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}
    <ellipse cx="${cx}" cy="${(rPeana.y + peanaH * 0.5).toFixed(2)}" rx="${(peanaW / 2).toFixed(2)}" ry="${(peanaH * 0.62).toFixed(2)}" fill="url(#peana)"/>
    <ellipse cx="${cx}" cy="${(rPeana.y + peanaH * 0.30).toFixed(2)}" rx="${(peanaW * 0.455).toFixed(2)}" ry="${(peanaH * 0.34).toFixed(2)}" fill="${C.pe0}" opacity="0.85"/>
    <ellipse cx="${cx}" cy="${(rPeana.y + peanaH * 0.22).toFixed(2)}" rx="${(peanaW * 0.40).toFixed(2)}" ry="${(peanaH * 0.20).toFixed(2)}" fill="#FFFFFF" opacity="0.13"/>
    ${R(rCuello, 'fill="url(#cuello)"')}
    <g mask="url(#hueco)">
      ${R(rCuerpo, 'fill="url(#chaflan)"')}
      ${R(rPared, 'fill="url(#pared)"')}
      ${R(rBisel, 'fill="url(#bisel)"')}
      ${R({ ...rPant, x: rPant.x - 1.1, y: rPant.y - 1.1, w: rPant.w + 2.2, h: rPant.h + 2.2, r: rPant.r + 1.1 },
          `fill="none" stroke="url(#labio)" stroke-width="${Math.max(1.1, Ws * 0.0014).toFixed(2)}"`)}
    </g>
    <circle cx="${cx}" cy="${cyc.toFixed(2)}" r="${(dCam / 2).toFixed(2)}" fill="#05060A"/>
    <circle cx="${(cx - dCam * 0.17).toFixed(2)}" cy="${(cyc - dCam * 0.17).toFixed(2)}" r="${(dCam * 0.13).toFixed(2)}" fill="#8FA4C4" opacity="0.5"/>
  </svg>`;
}

(async () => {
  const [anchoArg, dirArg, cuerpoArg] = process.argv.slice(2);
  const Ws = parseInt(anchoArg, 10);
  const cuerpo = cuerpoArg || "aluminio";
  if (!Ws || !dirArg) {
    console.error("uso: node marco-monitor.cjs <anchoPantallaPx> <dirSalida> [aluminio|grafito|negro]");
    process.exit(2);
  }
  const Hs = Math.round(Ws * M.aspecto);
  const marco = Math.round(Ws * M.bisel) + Math.max(2, Math.round(Ws * M.pared)) + Math.max(1.2, Ws * M.chaflan);
  const Wc = Math.round(Ws + 2 * marco), Hc = Math.round(Hs + 2 * marco);
  const cuelloH = Math.round(Ws * M.cuelloAlto), peanaW = Math.round(Ws * M.peanaAncho), peanaH = Math.round(Ws * M.peanaAlto);
  const W = Math.max(Wc, peanaW), H = Hc + cuelloH + peanaH;
  const ox = (W - Wc) / 2;

  const dir = path.join(dirArg, `monitor-${Ws}-${cuerpo}`);
  fs.mkdirSync(dir, { recursive: true });

  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const capa of ["marco", "vidrio", "mascara"]) {
    await page.setContent(
      `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent}svg{display:block}</style>${svg(Ws, cuerpo, capa)}`,
      { waitUntil: "load" }
    );
    await page.screenshot({ path: path.join(dir, `${capa}.png`), omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } });
  }
  await b.close();

  const geom = {
    preset: "monitor", cuerpo, lienzo: { w: W, h: H },
    cuerpoRect: { x: Math.round(ox), y: 0, w: Wc, h: Hc },
    pantalla: { x: Math.round(ox + marco), y: Math.round(marco), w: Ws, h: Hs, radio: +(Ws * M.radio).toFixed(2) },
    anillo: { total: +marco.toFixed(2), bisel: Math.round(Ws * M.bisel), pared: Math.max(2, Math.round(Ws * M.pared)), chaflan: +Math.max(1.2, Ws * M.chaflan).toFixed(2) },
    cuello: { alto: cuelloH }, peana: { ancho: peanaW, alto: peanaH },
    radioCuerpo: +(Ws * M.radio + marco).toFixed(2),
  };
  fs.writeFileSync(path.join(dir, "geom.json"), JSON.stringify(geom, null, 2));
  console.log(`✓ ${dir}  lienzo ${W}×${H}  pantalla ${Ws}×${Hs}  anillo ${marco.toFixed(2)}px constante  peana ${peanaW}×${peanaH}`);
})();
