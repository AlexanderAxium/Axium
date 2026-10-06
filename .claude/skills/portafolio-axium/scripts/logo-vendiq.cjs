// Lockup de Vendiq sin la caja de fondo: se limpia el ancla, sus ancestros y
// sus descendientes HTML (el SVG solo usa trazos, no necesita fondo).
const { chromium } = require(process.env.PWCORE);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch(
    process.env.PWEXE ? { executablePath: process.env.PWEXE } : {}
  );
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 4 });
  const p = await ctx.newPage();
  await p.goto("https://vendiq.pe", { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
  await wait(2000);
  // el vidrio del header vive en pseudo-elementos, que no se limpian con estilos inline
  await p.addStyleTag({
    content:
      // el header flota sobre el hero: lo que se ve detrás es otra sección, así que se oculta todo menos el logo
      'header::before,header::after,header *::before,header *::after{content:none!important;display:none!important}html,body{background:transparent!important}body *{visibility:hidden!important}header a[href="/"],header a[href="/"] *{visibility:visible!important}',
  });
  const r = await p.evaluate(() => {
    const a = document.querySelector('header a[href="/"]');
    const clear = (n) => {
      n.style.setProperty("background", "transparent", "important");
      n.style.setProperty("box-shadow", "none", "important");
      n.style.setProperty("backdrop-filter", "none", "important");
      n.style.setProperty("border-color", "transparent", "important");
    };
    for (let n = a; n; n = n.parentElement) clear(n);
    for (const n of a.querySelectorAll("*")) if (!(n instanceof SVGElement)) clear(n);
    const b = a.getBoundingClientRect();
    return { x: b.left, y: b.top, w: b.width, h: b.height };
  });
  await wait(400);
  await p.screenshot({
    path: "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium/capturas-saas/vendiq/lockup-dark.png",
    omitBackground: true,
    clip: { x: r.x - 8, y: r.y - 8, width: r.w + 16, height: r.h + 16 },
  });
  console.log("✓ vendiq/lockup-dark.png", JSON.stringify(r));
  await browser.close();
})();
