// Aísla piezas reales de UI con fondo transparente (se oculta todo lo demás
// con visibility, así la pieza conserva su sombra y sus esquinas).
const { chromium } = require(process.env.PWCORE);

const BASE =
  "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium/capturas-saas/";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const SITES = [
  {
    slug: "vendiq",
    url: "https://vendiq.pe",
    dsf: 2,
    pieces: [
      { name: "dashboard", text: "vendiq\\.pe/dashboard", minW: 900, maxW: 1300, minH: 300 },
    ],
  },
  {
    slug: "lumiolearn",
    url: "https://lumiolearn.com",
    dsf: 4,
    pieces: [
      { name: "lumen", text: "^Entrenado con tu contenido$", minW: 230, maxW: 420, minH: 240, shadow: true },
      { name: "ingresos", text: "vs mes anterior", minW: 190, maxW: 340, minH: 220, shadow: true },
      { name: "quizzes", text: "^Notas de quizzes$", minW: 360, maxW: 620, minH: 260, shadow: true },
      { name: "quiz", text: "^Pon a prueba lo que sabes$", minW: 290, maxW: 520, minH: 360, shadow: true },
      { name: "editor", text: "Introducción al Mantenimiento Industrial", minW: 1000, maxW: 1400, minH: 480 },
    ],
  },
  {
    slug: "bookit",
    url: "https://bookit.com.pe",
    dsf: 4,
    pieces: [
      { name: "reserva", text: "^Confirmar reserva", contains: "Cita confirmada", minW: 300, maxW: 800, minH: 250 },
    ],
  },
];

(async () => {
  const browser = await chromium.launch(
    process.env.PWEXE ? { executablePath: process.env.PWEXE } : {}
  );
  const log = [];
  for (const site of SITES) {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: site.dsf,
      locale: "es-PE",
      extraHTTPHeaders: { "Accept-Language": "es-PE,es;q=0.9" },
    });
    const p = await ctx.newPage();
    try {
      await p.goto(site.url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
      await wait(2500);
      const cookie = p.locator("button").filter({ hasText: /solo esenciales|aceptar/i }).first();
      if (await cookie.isVisible().catch(() => false)) await cookie.click().catch(() => {});
      const H = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < H; y += 450) {
        await p.evaluate((v) => window.scrollTo(0, v), y);
        await wait(150);
      }
      await p.evaluate(() => window.scrollTo(0, 0));
      await wait(1200);
      await p.addStyleTag({
        content:
          'html,body{background:transparent!important} body *{visibility:hidden!important} [data-cap="1"],[data-cap="1"] *{visibility:visible!important}',
      });

      for (const piece of site.pieces) {
        const rect = await p.evaluate((q) => {
          document.querySelectorAll("[data-cap]").forEach((e) => e.removeAttribute("data-cap"));
          const re = new RegExp(q.text, "i");
          const leaves = [...document.querySelectorAll("body *")].filter((e) =>
            [...e.childNodes].some((n) => n.nodeType === 3 && re.test(n.textContent.trim()))
          );
          for (const leaf of leaves) {
            let n = leaf;
            while (n && n !== document.body) {
              const b = n.getBoundingClientRect();
              const s = getComputedStyle(n);
              const ok =
                b.width >= q.minW &&
                b.width <= q.maxW &&
                b.height >= q.minH &&
                (!q.shadow || s.boxShadow !== "none") &&
                (!q.contains || (n.textContent || "").includes(q.contains));
              if (ok) {
                n.setAttribute("data-cap", "1");
                n.scrollIntoView({ block: "center" });
                const r = n.getBoundingClientRect();
                return { x: r.left, y: r.top, w: r.width, h: r.height, radius: s.borderRadius };
              }
              n = n.parentElement;
            }
          }
          return null;
        }, piece);
        if (!rect) {
          log.push(`✗ ${site.slug}/${piece.name}: no encontrado`);
          continue;
        }
        await wait(1000);
        // recalcular tras el scroll
        const r = await p.evaluate(() => {
          const b = document.querySelector('[data-cap="1"]').getBoundingClientRect();
          return { x: b.left, y: b.top, w: b.width, h: b.height };
        });
        const pad = 70;
        const x = Math.max(0, r.x - pad);
        const y = Math.max(0, r.y - pad);
        await p.screenshot({
          path: `${BASE}${site.slug}/pieza-${piece.name}.png`,
          omitBackground: true,
          clip: {
            x,
            y,
            width: Math.min(1440 - x, r.w + pad * 2),
            height: Math.min(900 - y, r.h + pad * 2),
          },
        });
        log.push(`✓ ${site.slug}/pieza-${piece.name}.png ${JSON.stringify({ ...rect, ...r })}`);
      }
    } catch (e) {
      log.push(`✗ ${site.slug}: ${String(e).slice(0, 160)}`);
    }
    await ctx.close();
  }
  console.log(log.join("\n"));
  await browser.close();
})();
