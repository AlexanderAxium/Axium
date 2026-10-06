// marco-dispositivo.cjs — EL MARCO DEL DISPOSITIVO SE CONSTRUYE, NO SE GENERA.
//
// Dibuja un marco de dispositivo en SVG con geometría exacta y lo renderiza con
// Playwright a PNG RGBA con la PANTALLA TRANSPARENTE. Reutilizable: el mismo
// marco sirve para cualquier portada, a cualquier tamaño, sin volver a llamar a
// ningún modelo.
//
// La propiedad que un modelo de difusión nunca acierta y aquí es exacta por
// construcción: **el anillo del marco tiene ancho constante**, porque el radio
// del cuerpo se CALCULA como  Rcuerpo = Rpantalla + bisel + pared + chaflán.
// Dos rectángulos redondeados concéntricos con esa relación de radios distan lo
// mismo en TODO su perímetro, esquinas incluidas. Es la diferencia entre un
// dispositivo y un dibujo de un dispositivo.
//
// Uso:
//   PWCORE=/ruta/a/playwright node marco-dispositivo.cjs <preset> <anchoPantallaPx> <dirSalida> [cuerpo]
//   presets: tableta-v | tableta-h | movil-v | portatil-h
//   cuerpo:  grafito (por defecto) | aluminio | negro
//
// Produce en <dirSalida>/<preset>-<ancho>-<cuerpo>/:
//   marco.png    — pared + chaflán + bisel + cámara + altavoz, con el hueco TRANSPARENTE
//   vidrio.png   — solo el reflejo del cristal, recortado al hueco (va ENCIMA de la captura)
//   mascara.png  — el hueco en blanco sobre transparente (para redondear la captura)
//   geom.json    — rectángulo de la pantalla dentro del lienzo, radio y tamaño total
//
// Las medidas relativas salen de aparatos reales (iPad Pro 11", iPhone 15):
// el bisel de una tableta mide ~4,2 % del ancho de pantalla, la pared lateral
// ~1,3 %, el chaflán ~0,4 %, y la esquina de la pantalla ~5 %.

const { chromium } = require(process.env.PWCORE || "playwright");
const path = require("node:path");
const fs = require("node:fs");

const PRESETS = {
  "tableta-v": { aspecto: 4 / 3, vertical: true, bisel: 0.042, pared: 0.013, chaflan: 0.0042, radio: 0.050, camara: "arriba-centro", altavoz: false },
  "tableta-h": { aspecto: 3 / 4, vertical: false, bisel: 0.034, pared: 0.010, chaflan: 0.0034, radio: 0.040, camara: "izquierda-centro", altavoz: false },
  "movil-v":   { aspecto: 19.5 / 9, vertical: true, bisel: 0.030, pared: 0.016, chaflan: 0.0055, radio: 0.125, camara: "isla", altavoz: true },
  "portatil-h":{ aspecto: 10 / 16, vertical: false, bisel: 0.016, pared: 0.008, chaflan: 0.0030, radio: 0.013, camara: "arriba-centro", altavoz: false },
};

// Los cuerpos. Cada uno es (pared, chaflán claro, chaflán oscuro, bisel).
const CUERPOS = {
  grafito:  { p0: "#5A5F68", p1: "#24282E", p2: "#3A3E46", p3: "#131619", ch: "#E3E8F0", chb: "#3C4048", bisel: "#0A0C10", bisel2: "#14171D" },
  aluminio: { p0: "#F2F4F7", p1: "#A8AEB8", p2: "#D4D9E0", p3: "#878D97", ch: "#FFFFFF", chb: "#9BA1AB", bisel: "#0D0F13", bisel2: "#1A1D23" },
  negro:    { p0: "#3C4047", p1: "#131519", p2: "#24272C", p3: "#0B0D10", ch: "#A7ADB8", chb: "#2A2E34", bisel: "#07080B", bisel2: "#0F1116" },
};

function svg(preset, Ws, cuerpoNombre, capa) {
  const P = PRESETS[preset];
  const C = CUERPOS[cuerpoNombre];
  if (!P) throw new Error(`preset desconocido: ${preset}`);
  if (!C) throw new Error(`cuerpo desconocido: ${cuerpoNombre}`);

  const Hs = Math.round(Ws * P.aspecto);           // alto de la PANTALLA
  const b  = Math.round(Ws * P.bisel);             // bisel (constante en los 4 lados)
  const w  = Math.max(2, Math.round(Ws * P.pared));// pared lateral
  const c  = Math.max(1.5, Ws * P.chaflan);        // chaflán de arista
  const Rs = Ws * P.radio;                         // radio de la PANTALLA
  const marco = b + w + c;                         // ancho TOTAL y CONSTANTE del anillo
  const Rb = Rs + marco;                           // radio del CUERPO — calculado, no inventado

  const W = Math.round(Ws + 2 * marco);
  const H = Math.round(Hs + 2 * marco);
  const sx = marco, sy = marco;                    // origen de la pantalla dentro del lienzo

  // Rectángulos concéntricos, de fuera a dentro.
  const rCuerpo = { x: 0, y: 0, w: W, h: H, r: Rb };
  const rPared  = { x: c, y: c, w: W - 2 * c, h: H - 2 * c, r: Rb - c };
  const rBisel  = { x: c + w, y: c + w, w: W - 2 * (c + w), h: H - 2 * (c + w), r: Rb - c - w };
  const rPant   = { x: sx, y: sy, w: Ws, h: Hs, r: Rs };

  const R = (o, extra = "") =>
    `<rect x="${o.x.toFixed(2)}" y="${o.y.toFixed(2)}" width="${o.w.toFixed(2)}" height="${o.h.toFixed(2)}" rx="${o.r.toFixed(2)}" ry="${o.r.toFixed(2)}" ${extra}/>`;

  // ── cámara y altavoz, dentro del bisel ───────────────────────────────────
  let optica = "";
  const dCam = Math.max(3, b * 0.26);
  if (P.camara === "arriba-centro") {
    const cxc = W / 2, cyc = c + w + b / 2;
    optica = `
      <circle cx="${cxc}" cy="${cyc}" r="${(dCam / 2).toFixed(2)}" fill="#05060A"/>
      <circle cx="${cxc}" cy="${cyc}" r="${(dCam / 2).toFixed(2)}" fill="none" stroke="#3A4049" stroke-width="${(dCam * 0.09).toFixed(2)}" opacity="0.8"/>
      <circle cx="${(cxc - dCam * 0.17).toFixed(2)}" cy="${(cyc - dCam * 0.17).toFixed(2)}" r="${(dCam * 0.13).toFixed(2)}" fill="#8FA4C4" opacity="0.55"/>`;
  } else if (P.camara === "izquierda-centro") {
    const cxc = c + w + b / 2, cyc = H / 2;
    optica = `
      <circle cx="${cxc}" cy="${cyc}" r="${(dCam / 2).toFixed(2)}" fill="#05060A"/>
      <circle cx="${cxc}" cy="${cyc}" r="${(dCam / 2).toFixed(2)}" fill="none" stroke="#3A4049" stroke-width="${(dCam * 0.09).toFixed(2)}" opacity="0.8"/>
      <circle cx="${(cxc - dCam * 0.17).toFixed(2)}" cy="${(cyc - dCam * 0.17).toFixed(2)}" r="${(dCam * 0.13).toFixed(2)}" fill="#8FA4C4" opacity="0.55"/>`;
  }
  // La isla del móvil se dibuja SOBRE la pantalla, en su propia capa.
  const isla = P.camara === "isla"
    ? (() => {
        const iw = Ws * 0.30, ih = Ws * 0.088, ix = sx + (Ws - iw) / 2, iy = sy + Ws * 0.030;
        const dx = ix + iw - ih * 0.62, dy = iy + ih / 2;
        return `
      <rect x="${ix.toFixed(2)}" y="${iy.toFixed(2)}" width="${iw.toFixed(2)}" height="${ih.toFixed(2)}" rx="${(ih / 2).toFixed(2)}" fill="#04050 8"/>
      <rect x="${ix.toFixed(2)}" y="${iy.toFixed(2)}" width="${iw.toFixed(2)}" height="${ih.toFixed(2)}" rx="${(ih / 2).toFixed(2)}" fill="#050608"/>
      <circle cx="${dx.toFixed(2)}" cy="${dy.toFixed(2)}" r="${(ih * 0.26).toFixed(2)}" fill="#0B1018"/>
      <circle cx="${(dx - ih * 0.07).toFixed(2)}" cy="${(dy - ih * 0.07).toFixed(2)}" r="${(ih * 0.10).toFixed(2)}" fill="#6E86AC" opacity="0.5"/>`;
      })()
    : "";
  const altavoz = P.altavoz
    ? `<rect x="${(W / 2 - Ws * 0.075).toFixed(2)}" y="${(sy + Ws * 0.0145).toFixed(2)}" width="${(Ws * 0.15).toFixed(2)}" height="${Math.max(2, Ws * 0.007).toFixed(2)}" rx="${Math.max(1, Ws * 0.0035).toFixed(2)}" fill="#0A0C11" opacity="0.9"/>`
    : "";

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
    <linearGradient id="vidrio" x1="0" y1="0" x2="0.75" y2="1">
      <stop offset="0"    stop-color="#FFFFFF" stop-opacity="0.19"/>
      <stop offset="0.17" stop-color="#FFFFFF" stop-opacity="0.055"/>
      <stop offset="0.34" stop-color="#FFFFFF" stop-opacity="0.0"/>
      <stop offset="0.72" stop-color="#FFFFFF" stop-opacity="0.0"/>
      <stop offset="0.93" stop-color="#FFFFFF" stop-opacity="0.045"/>
      <stop offset="1"    stop-color="#FFFFFF" stop-opacity="0.085"/>
    </linearGradient>
    <linearGradient id="labio" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.30"/>
      <stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0.16"/>
    </linearGradient>
    <!-- el anillo del marco: cuerpo MENOS pantalla. Así el hueco queda transparente de verdad. -->
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

  if (capa === "mascara") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${R(rPant, 'fill="#ffffff"')}</svg>`;
  }

  if (capa === "vidrio") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}
      <g mask="url(#soloPantalla)">
        <rect x="0" y="0" width="${W}" height="${H}" fill="url(#vidrio)"/>
      </g>
      ${isla}
    </svg>`;
  }

  // capa "marco"
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}
    <g mask="url(#hueco)">
      ${R(rCuerpo, 'fill="url(#chaflan)"')}
      ${R(rPared, 'fill="url(#pared)"')}
      ${R(rBisel, 'fill="url(#bisel)"')}
      <!-- labio del cristal: la luz que entra por el canto interior del bisel -->
      ${R({ ...rPant, x: rPant.x - 1.2, y: rPant.y - 1.2, w: rPant.w + 2.4, h: rPant.h + 2.4, r: rPant.r + 1.2 },
          `fill="none" stroke="url(#labio)" stroke-width="${Math.max(1.2, Ws * 0.0018).toFixed(2)}"`)}
    </g>
    ${optica}
    ${altavoz}
  </svg>`;
}

(async () => {
  const [preset, anchoArg, dirArg, cuerpoArg] = process.argv.slice(2);
  const Ws = parseInt(anchoArg, 10);
  const cuerpo = cuerpoArg || "grafito";
  if (!PRESETS[preset] || !Ws || !dirArg) {
    console.error("uso: node marco-dispositivo.cjs <preset> <anchoPantallaPx> <dirSalida> [cuerpo]");
    console.error("presets:", Object.keys(PRESETS).join(" | "), " cuerpos:", Object.keys(CUERPOS).join(" | "));
    process.exit(2);
  }
  const P = PRESETS[preset];
  const Hs = Math.round(Ws * P.aspecto);
  const marco = Math.round(Ws * P.bisel) + Math.max(2, Math.round(Ws * P.pared)) + Math.max(1.5, Ws * P.chaflan);
  const W = Math.round(Ws + 2 * marco), H = Math.round(Hs + 2 * marco);

  const dir = path.join(dirArg, `${preset}-${Ws}-${cuerpo}`);
  fs.mkdirSync(dir, { recursive: true });

  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const capa of ["marco", "vidrio", "mascara"]) {
    const s = svg(preset, Ws, cuerpo, capa);
    await page.setContent(
      `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent}svg{display:block}</style>${s}`,
      { waitUntil: "load" }
    );
    await page.screenshot({ path: path.join(dir, `${capa}.png`), omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } });
  }
  await b.close();

  const geom = {
    preset, cuerpo, lienzo: { w: W, h: H },
    pantalla: { x: Math.round(marco), y: Math.round(marco), w: Ws, h: Hs, radio: +(Ws * P.radio).toFixed(2) },
    anillo: { total: +marco.toFixed(2), bisel: Math.round(Ws * P.bisel), pared: Math.max(2, Math.round(Ws * P.pared)), chaflan: +Math.max(1.5, Ws * P.chaflan).toFixed(2) },
    radioCuerpo: +(Ws * P.radio + marco).toFixed(2),
  };
  fs.writeFileSync(path.join(dir, "geom.json"), JSON.stringify(geom, null, 2));
  console.log(`✓ ${dir}  lienzo ${W}×${H}  pantalla ${Ws}×${Hs} @ (${geom.pantalla.x},${geom.pantalla.y})  anillo ${geom.anillo.total}px constante`);
})();
