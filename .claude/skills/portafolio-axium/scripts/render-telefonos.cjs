// Renderiza teléfonos planos (PNG transparente a 3x) a partir de telefono.html.
const { chromium } = require(process.env.PWCORE);

const DIR =
  "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium/capturas-saas/";
const PHONES = [
  { out: "rematch/telefono-reserva.png", src: "../rematch/club/m-top.png", bg: "#FFFFFF" },
  { out: "rematch/telefono-listado.png", src: "../rematch/recorte-listado.jpg", bg: "#F3F5F8" },
];

(async () => {
  const browser = await chromium.launch(
    process.env.PWEXE ? { executablePath: process.env.PWEXE } : {}
  );
  const ctx = await browser.newContext({ viewport: { width: 600, height: 900 }, deviceScaleFactor: 3 });
  const p = await ctx.newPage();
  for (const ph of PHONES) {
    const url = `file://${DIR}portadas/telefono.html?src=${encodeURIComponent(ph.src)}&bg=${encodeURIComponent(ph.bg)}`;
    await p.goto(url);
    await p.waitForFunction(() => {
      const i = document.getElementById("shot");
      return i.complete && i.naturalWidth > 0;
    });
    await p.locator(".phone").screenshot({ path: DIR + ph.out, omitBackground: true });
    console.log(`✓ ${ph.out}`);
  }
  await browser.close();
})();
