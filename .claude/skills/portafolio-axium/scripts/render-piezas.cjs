// Renderiza cada .lienzo de un taller HTML cualquiera a JPG a 2x y lo deja en
// public/images/proyects/<data-destino>/<data-salida>.
//
// Es la versión genérica de render-fichas.cjs / render-taller.cjs: el taller se
// pasa por argumento, así que sirve para recomponer piezas de cualquier ficha sin
// tocar los talleres grandes.
//
// Uso: PWCORE=... PWEXE=... node render-piezas.cjs <taller.html> [parte-del-id]
const { chromium } = require(process.env.PWCORE);
const path = require("node:path");
const fs = require("node:fs");

const HTML = path.resolve(process.argv[2]);
const SOLO = process.argv[3] || "";
const PUBLIC = "/Users/alexander/Documents/AXIUM-WEB/public/images/proyects/";

(async () => {
  const b = await chromium.launch({ executablePath: process.env.PWEXE });
  const p = await b.newPage({
    viewport: { width: 1400, height: 900 },
    deviceScaleFactor: 2,
  });
  await p.goto(`file://${HTML}`, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(600);
  const rotas = await p.evaluate(() =>
    [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute("src")),
  );
  if (rotas.length) {
    console.log("! imágenes rotas:", rotas.join(", "));
    process.exitCode = 1;
  }
  const lienzos = await p.$$eval(".lienzo", (els) =>
    els.map((e) => ({ id: e.id, salida: e.dataset.salida, destino: e.dataset.destino })),
  );
  for (const { id, salida, destino } of lienzos) {
    if (SOLO && !id.includes(SOLO)) continue;
    const dir = process.env.PRUEBA || path.join(PUBLIC, destino);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, salida);
    await p.locator(`#${id}`).screenshot({ path: out, type: "jpeg", quality: 92 });
    console.log(`✓ ${id} → ${out}`);
  }
  await b.close();
})();
