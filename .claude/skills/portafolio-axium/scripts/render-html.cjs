// Renderiza un HTML local a PNG con su tamaño exacto (el taller de piezas sin IA).
// Uso: PWCORE=… PWEXE=… node render-html.cjs <archivo.html> <salida.png> <ancho> <alto> [dpr=1]
const { chromium } = require(process.env.PWCORE);
const path = require("path");
(async () => {
  const [html, png, w, h, dpr = "1"] = process.argv.slice(2);
  const b = await chromium.launch(process.env.PWEXE ? { executablePath: process.env.PWEXE } : {});
  const p = await b.newPage({
    viewport: { width: Number(w), height: Number(h) },
    deviceScaleFactor: Number(dpr),
  });
  await p.goto("file://" + path.resolve(html));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(900);
  await p.screenshot({ path: png, omitBackground: true });
  await b.close();
  console.log("✓", png);
})();
