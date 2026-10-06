// Renderiza cada .lienzo de capturas-saas/brandvm-casos/fichas-simples.html a JPG a 2x
// y lo deja en public/images/proyects/<data-destino>/<data-salida>.
// Uso: PWCORE=... PWEXE=... [PRUEBA=/ruta] node render-fichas.cjs [parte-del-id]
const { chromium } = require(process.env.PWCORE);
const path = require("path");
const HTML = path.join(__dirname, "..", "capturas-saas", "brandvm-casos", "fichas-simples.html");
const PUBLIC = "/Users/alexander/Documents/AXIUM-WEB/public/images/proyects/";
const SOLO = process.argv[2] || "";
const fs = require("fs");

(async () => {
  const b = await chromium.launch({ executablePath: process.env.PWEXE });
  const p = await b.newPage({ viewport: { width: 900, height: 700 }, deviceScaleFactor: 2 });
  await p.goto(`file://${HTML}`, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  const rotas = await p.evaluate(() => [...document.images].filter(i => !i.naturalWidth).map(i => i.getAttribute("src")));
  if (rotas.length) { console.log("! imágenes rotas:", rotas.join(", ")); process.exitCode = 1; }
  const lienzos = await p.$$eval(".lienzo", els => els.map(e => ({ id: e.id, salida: e.dataset.salida, destino: e.dataset.destino })));
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
