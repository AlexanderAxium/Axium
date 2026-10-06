// Renderiza cada .lienzo de capturas-saas/brandvm-casos/highlights.html a JPG
// 2400×1500 (1200×750 @2x) con el nombre de su data-salida.
// Destino: public/images/highlights/, o la carpeta de PRUEBA si se define (para revisar antes).
// Uso: PWCORE=... PWEXE=... [PRUEBA=/ruta] node render-highlights.cjs [parte-del-id]
const { chromium } = require(process.env.PWCORE);
const path = require("path");

const HTML = path.join(__dirname, "..", "capturas-saas", "brandvm-casos", "highlights.html");
const PUBLIC = "/Users/alexander/Documents/AXIUM-WEB/public/images/highlights/";
const SOLO = process.argv[2] || "";

(async () => {
  const b = await chromium.launch({ executablePath: process.env.PWEXE });
  const p = await b.newPage({ viewport: { width: 1300, height: 900 }, deviceScaleFactor: 2 });
  await p.goto(`file://${HTML}`, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(600);
  const rotas = await p.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute("src")));
  if (rotas.length) console.log("! imágenes rotas:", rotas.join(", "));
  const lienzos = await p.$$eval(".lienzo", (els) => els.map((e) => ({ id: e.id, salida: e.dataset.salida })));
  for (const { id, salida } of lienzos) {
    if (SOLO && !id.includes(SOLO)) continue;
    const destino = path.join(process.env.PRUEBA || PUBLIC, salida);
    await p.locator(`#${id}`).screenshot({ path: destino, type: "jpeg", quality: 90 });
    console.log(`✓ ${id} → ${destino}`);
  }
  await b.close();
})();
