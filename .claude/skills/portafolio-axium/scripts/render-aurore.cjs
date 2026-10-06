// Renderiza cada .lienzo de capturas-saas/brandvm-casos/taller-aurore.html a JPG a 2x
// y lo deja en public/images/proyects/aurore/<id>.jpg (nombres nuevos: la caché de
// next/image serviría la versión vieja si se reutilizara un nombre)
// Uso: PWCORE=... PWEXE=... [PRUEBA=/ruta] node render-aurore.cjs [parte-del-id]
const { chromium } = require(process.env.PWCORE);
const path = require("path");
const fs = require("fs");

const TALLER = path.join(__dirname, "..", "capturas-saas", "brandvm-casos", "taller-aurore.html");
const DESTINO = process.env.PRUEBA || "/Users/alexander/Documents/AXIUM-WEB/public/images/proyects/aurore/";
const SOLO = process.argv[2] || "";

(async () => {
  const b = await chromium.launch({ executablePath: process.env.PWEXE });
  const p = await b.newPage({ viewport: { width: 1700, height: 1000 }, deviceScaleFactor: 2 });
  await p.goto(`file://${TALLER}`, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(900);

  const rotas = await p.evaluate(() =>
    [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute("src")),
  );
  if (rotas.length) {
    console.log("! imágenes rotas:", rotas.join(", "));
    process.exitCode = 1;
  }

  fs.mkdirSync(DESTINO, { recursive: true });
  const ids = await p.$$eval(".lienzo", (els) => els.map((e) => e.id));
  for (const id of ids) {
    if (SOLO && !id.includes(SOLO)) continue;
    const salida = path.join(DESTINO, `${id}.jpg`);
    await p.locator(`#${id}`).screenshot({ path: salida, type: "jpeg", quality: 90 });
    console.log(`✓ ${id} → ${salida}`);
  }
  await b.close();
})();
