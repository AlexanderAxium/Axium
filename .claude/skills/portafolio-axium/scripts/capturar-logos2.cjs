// Logos con transparencia real: se quita el fondo solo a los ANCESTROS del
// logo (no a sus hijos, así el cuadrado del ícono conserva su color) y se
// recorta con margen para no cortar trazos que desbordan la caja.
const { chromium } = require(process.env.PWCORE);

const BASE =
  "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium/capturas-saas/";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const JOBS = [
  { slug: "vendiq", url: "https://vendiq.pe", sel: 'header a[href="/"]', out: "lockup-dark.png" },
  { slug: "lumiolearn", url: "https://lumiolearn.com", sel: 'footer a[href="/"]', out: "lockup-dark.png" },
  { slug: "lumiolearn", url: "https://lumiolearn.com", sel: 'header a[href="/"], nav a[href="/"]', out: "lockup-light.png" },
  { slug: "bookit", url: "https://bookit.com.pe", sel: 'header a[href="/"]', out: "lockup-dark.png", dark: true },
  { slug: "bookit", url: "https://bookit.com.pe", sel: 'header a[href="/"]', out: "mark.png", dark: true, markOnly: true },
];

(async () => {
  const browser = await chromium.launch(
    process.env.PWEXE ? { executablePath: process.env.PWEXE } : {}
  );
  const log = [];
  for (const job of JOBS) {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 4,
    });
    const p = await ctx.newPage();
    try {
      await p.goto(job.url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
      await wait(2000);
      const cookie = p.locator("button").filter({ hasText: /solo esenciales|aceptar/i }).first();
      if (await cookie.isVisible().catch(() => false)) await cookie.click().catch(() => {});
      if (job.dark) {
        const t = p.getByRole("button", { name: /modo oscuro|dark/i }).first();
        if (await t.isVisible().catch(() => false)) {
          await t.click();
          await wait(900);
        }
      }
      const rect = await p.evaluate(({ sel, markOnly }) => {
        let el = null;
        for (const s of sel.split(",")) {
          el = document.querySelector(s.trim());
          if (el) break;
        }
        if (!el) return null;
        if (markOnly) {
          // primer descendiente con fondo propio (el cuadrado del ícono)
          const withBg = [...el.querySelectorAll("*")].find(
            (n) => getComputedStyle(n).backgroundColor !== "rgba(0, 0, 0, 0)"
          );
          if (withBg) el = withBg;
        }
        el.scrollIntoView({ block: "center" });
        let n = markOnly ? el.parentElement : el;
        // en modo marca también se limpian los hermanos/ancestros, no el ícono
        n = el.parentElement;
        while (n) {
          n.style.setProperty("background", "transparent", "important");
          n.style.setProperty("box-shadow", "none", "important");
          n.style.setProperty("backdrop-filter", "none", "important");
          n.style.setProperty("border-color", "transparent", "important");
          n = n.parentElement;
        }
        // en el lockup, el ancla misma tampoco debe tener fondo
        if (!markOnly) el.style.setProperty("background", "transparent", "important");
        const b = el.getBoundingClientRect();
        const text = el.querySelector("span span:last-child, span:last-child");
        const cs = text ? getComputedStyle(text) : null;
        return {
          x: b.left,
          y: b.top,
          w: b.width,
          h: b.height,
          font: cs?.fontFamily,
          weight: cs?.fontWeight,
          tracking: cs?.letterSpacing,
          color: cs?.color,
        };
      }, job);
      if (!rect) {
        log.push(`✗ ${job.slug}/${job.out}: sin elemento`);
      } else {
        await wait(500);
        const pad = job.markOnly ? 2 : 10;
        await p.screenshot({
          path: `${BASE}${job.slug}/${job.out}`,
          omitBackground: true,
          clip: {
            x: Math.max(0, rect.x - pad),
            y: Math.max(0, rect.y - pad),
            width: rect.w + pad * 2,
            height: rect.h + pad * 2,
          },
        });
        log.push(`✓ ${job.slug}/${job.out} ${JSON.stringify(rect)}`);
      }
    } catch (e) {
      log.push(`✗ ${job.slug}/${job.out}: ${String(e).slice(0, 120)}`);
    }
    await ctx.close();
  }

  // isotipo de Vendiq desde su propio SVG
  const ctx = await browser.newContext({ deviceScaleFactor: 8, viewport: { width: 200, height: 200 } });
  const p = await ctx.newPage();
  const fs = require("fs");
  const svg = fs.readFileSync(`${BASE}vendiq/logo-web.svg`, "utf8");
  await p.setContent(`<style>html,body{margin:0;background:transparent}</style>${svg}`);
  await p.locator("svg").screenshot({ path: `${BASE}vendiq/mark.png`, omitBackground: true });
  log.push("✓ vendiq/mark.png");
  await ctx.close();

  console.log(log.join("\n"));
  await browser.close();
})();
