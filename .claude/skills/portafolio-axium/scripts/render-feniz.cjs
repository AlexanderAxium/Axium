// Renderiza cada .lienzo de capturas-clientes/feniz/taller/taller.html a JPG a 2x.
// Uso: PWCORE=... [PRUEBA=/ruta] node render-feniz.cjs [parte-del-id]
const { chromium } = require(process.env.PWCORE);
const path = require("node:path");
const fs = require("node:fs");

const HTML = path.join(__dirname, "..", "capturas-clientes", "feniz", "taller", "taller.html");
const PUBLIC = "/Users/alexander/Documents/AXIUM-WEB/public/images/proyects/";
const SOLO = process.argv[2] || "";

(async () => {
  const b = await chromium.launch({ channel: "chromium-headless-shell" });
  const p = await b.newPage({ viewport: { width: 1320, height: 900 }, deviceScaleFactor: 2 });
  await p.goto(`file://${HTML}`, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(900);

  const rotas = await p.evaluate(() =>
    [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute("src")));
  if (rotas.length) { console.log("! imágenes rotas:", [...new Set(rotas)].join(", ")); process.exitCode = 1; }

  const lienzos = await p.$$eval(".lienzo", (els) =>
    els.map((e) => ({ id: e.id, salida: e.dataset.salida, destino: e.dataset.destino })));
  for (const { id, salida, destino } of lienzos) {
    if (SOLO && !id.includes(SOLO)) continue;
    const dir = process.env.PRUEBA || path.join(PUBLIC, destino);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, salida);
    await p.locator(`#${id}`).screenshot({ path: out, type: "jpeg", quality: 90 });
    console.log(`✓ ${id} → ${out}`);
  }
  await b.close();
})();
