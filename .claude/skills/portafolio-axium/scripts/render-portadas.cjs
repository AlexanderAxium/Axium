// Renderiza portadas/*.html a 2880x1800 (1440x900 @2x).
// Uso: node render-portadas.cjs [prefijo]
const { chromium } = require(process.env.PWCORE);
const fs = require("fs");

const DIR =
  "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium/capturas-saas/portadas/";

(async () => {
  const browser = await chromium.launch(
    process.env.PWEXE ? { executablePath: process.env.PWEXE } : {}
  );
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const p = await ctx.newPage();
  const only = process.argv[2];
  const files = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".html") && (!only || f.startsWith(only)));
  for (const f of files) {
    await p.goto(`file://${DIR}${f}`, { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready);
    const broken = await p.evaluate(() =>
      [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute("src"))
    );
    await p.waitForTimeout(400);
    await p.screenshot({ path: DIR + f.replace(".html", ".png") });
    console.log(`✓ ${f}${broken.length ? ` · imágenes rotas: ${broken.join(", ")}` : ""}`);
  }
  await browser.close();
})();
