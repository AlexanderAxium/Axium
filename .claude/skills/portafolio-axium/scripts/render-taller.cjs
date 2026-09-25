// Renderiza cada .lienzo de capturas-saas/brandvm-casos/taller.html a JPG a 2x
// y lo deja en public/images/proyects/<rematch|lumiolearn>/ según el prefijo.
// Uso: PWCORE=... PWEXE=... node render-taller.cjs [solo-id]
const { chromium } = require(process.env.PWCORE);
const path = require("path");

const TALLER = path.join(__dirname, "..", "capturas-saas", "brandvm-casos", "taller.html");
const PUBLIC = "/Users/alexander/Documents/AXIUM-WEB/public/images/proyects/";
const SOLO = process.argv[2] || "";

(async () => {
  const b = await chromium.launch({ executablePath: process.env.PWEXE });
  const p = await b.newPage({ viewport: { width: 1700, height: 1000 }, deviceScaleFactor: 2 });
  await p.goto(`file://${TALLER}`, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(800);
  const rotas = await p.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute("src")));
  if (rotas.length) console.log("! imágenes rotas:", rotas.join(", "));
  const ids = await p.$$eval(".lienzo", (els) => els.map((e) => e.id));
  for (const id of ids) {
    if (SOLO && !id.startsWith(SOLO)) continue;
    const carpeta = id.startsWith("rematch") ? "rematch" : id.startsWith("bookit") ? "bookit" : id.startsWith("vendiq") ? "vendiq" : "lumiolearn";
    const salida = `${PUBLIC}${carpeta}/${id.replace(/^(rematch|lumio|bookit|vendiq)-/, "")}.jpg`;
    await p.locator(`#${id}`).screenshot({ path: salida, type: "jpeg", quality: 88 });
    console.log(`✓ ${id} → ${path.relative(PUBLIC, salida)}`);
  }
  await b.close();
})();
