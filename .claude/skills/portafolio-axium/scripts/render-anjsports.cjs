// Renderiza cada .lienzo de capturas-clientes/anjsports/taller/*.html a JPG a 2x y lo deja
// en public/images/proyects/anjsports/<id>.jpg
//
// Uso:
//   PWCORE=<ruta/playwright-core> PWEXE=<chromium> [PRUEBA=/ruta] \
//     node render-anjsports.cjs [parte-del-id]
//
// PRUEBA manda la salida a otra carpeta: se itera ahí y solo al final se escribe en public/,
// porque la caché de /_next/image sirve la versión vieja del mismo path (COMPOSITOR.md).
const { chromium } = require(process.env.PWCORE);
const path = require("node:path");
const fs = require("node:fs");

const TALLER = path.join(__dirname, "..", "capturas-clientes", "anjsports", "taller");
const HTMLS = ["taller-anjsports.html", "diagrama-anjsports.html"];
const DESTINO =
  process.env.PRUEBA ||
  "/Users/alexander/Documents/AXIUM-WEB/public/images/proyects/anjsports/";
const SOLO = process.argv[2] || "";

(async () => {
  const b = await chromium.launch({ executablePath: process.env.PWEXE });
  const p = await b.newPage({
    viewport: { width: 1700, height: 1000 },
    deviceScaleFactor: 2,
  });
  fs.mkdirSync(DESTINO, { recursive: true });

  for (const html of HTMLS) {
    await p.goto(`file://${path.join(TALLER, html)}`, { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(900);

    const rotas = await p.evaluate(() =>
      [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute("src")),
    );
    if (rotas.length) {
      console.log(`! ${html} — imágenes rotas:`, rotas.join(", "));
      process.exitCode = 1;
    }

    const ids = await p.$$eval(".lienzo", (els) => els.map((e) => e.id));
    for (const id of ids) {
      if (SOLO && !id.includes(SOLO)) continue;
      const salida = path.join(DESTINO, `${id}.jpg`);
      await p.locator(`#${id}`).screenshot({ path: salida, type: "jpeg", quality: 90 });
      console.log(`✓ ${id} → ${salida}`);
    }
  }
  await b.close();
})();
