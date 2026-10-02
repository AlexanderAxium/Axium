// Renderiza cada .lienzo de capturas-clientes/<slug>/taller.html a JPG a 2x y lo deja
// en public/images/proyects/<data-destino>/<data-salida>.
// Uso: node render-web.cjs <slug> [parte-del-id]
const { chromium } = require("/Users/alexander/Documents/SAAS/Vendiq/node_modules/playwright-core");
const path = require("node:path");
const fs = require("node:fs");

const SLUG = process.argv[2];
const SOLO = process.argv[3] || "";
const HTML = path.join(__dirname, "..", "capturas-clientes", SLUG, "taller.html");
const PUBLIC = "/Users/alexander/Documents/AXIUM-WEB/public/images/proyects/";

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 });
  await p.goto(`file://${HTML}`, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(700);

  const rotas = await p.evaluate(() =>
    [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute("src"))
  );
  if (rotas.length) { console.log("! imágenes rotas:", rotas.join(", ")); process.exitCode = 1; }

  const lienzos = await p.$$eval(".lienzo", (els) =>
    els.map((e) => ({ id: e.id, salida: e.dataset.salida, destino: e.dataset.destino }))
  );
  for (const { id, salida, destino } of lienzos) {
    if (SOLO && !id.includes(SOLO)) continue;
    const dir = process.env.PRUEBA || path.join(PUBLIC, destino);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, salida);
    await p.locator(`#${id}`).screenshot({ path: out, type: "jpeg", quality: 88 });
    console.log(`✓ ${id} → ${out}`);
  }
  await b.close();
})();
