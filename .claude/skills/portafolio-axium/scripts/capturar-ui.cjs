// Segunda pasada: cierra cookies, oculta headers/flotantes y recorta a 2x cada
// pieza tipo mockup (caja con sombra y borde redondeado, o imagen grande).
// Uso: PWCORE=... PWEXE=... node capturar-ui.cjs "carpeta|https://url,carpeta|https://url"
const { chromium } = require(process.env.PWCORE);
const fs = require("fs");

const BASE =
  "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium/capturas-saas/";
const TARGETS = (
  process.argv[2] ||
  "vendiq|https://vendiq.pe,rematch|https://rematch.pe,lumiolearn|https://lumiolearn.com,bookit|https://bookit.com.pe"
)
  .split(",")
  .map((s) => s.split("|"));
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch(
    process.env.PWEXE ? { executablePath: process.env.PWEXE } : {}
  );
  const report = [];

  for (const [folder, url] of TARGETS) {
    const dir = `${BASE}${folder}/ui/`;
    fs.mkdirSync(dir, { recursive: true });
    const r = { folder, url, crops: [] };
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      locale: "es-PE",
      userAgent: UA,
    });
    try {
      const p = await ctx.newPage();
      await p
        .goto(url, { waitUntil: "networkidle", timeout: 45000 })
        .catch((e) => (r.gotoErr = String(e).slice(0, 160)));
      await wait(2500);
      r.finalUrl = p.url();

      // cookies
      const btn = p
        .locator("button, a")
        .filter({ hasText: /solo esenciales|aceptar todas|aceptar|accept/i })
        .first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click().catch(() => {});
        r.cookies = "cerrado";
        await wait(600);
      }

      // recorrer para disparar animaciones de entrada
      const H = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < H; y += 450) {
        await p.evaluate((v) => window.scrollTo(0, v), y);
        await wait(160);
      }
      await p.evaluate(() => window.scrollTo(0, 0));
      await wait(1500);

      // header arriba sin repetirse; flotantes fuera
      await p.evaluate(() => {
        for (const el of document.querySelectorAll("body *")) {
          const s = getComputedStyle(el);
          if (s.position !== "fixed" && s.position !== "sticky") continue;
          const b = el.getBoundingClientRect();
          if (b.top < 100 && b.width > window.innerWidth * 0.5) {
            el.style.setProperty("position", "absolute", "important");
          } else {
            el.style.setProperty("display", "none", "important");
          }
        }
      });
      await wait(500);

      r.H = await p.evaluate(() => document.documentElement.scrollHeight);
      await p.screenshot({
        path: `${dir}full.jpg`,
        type: "jpeg",
        quality: 80,
        fullPage: true,
      });

      const cands = await p.evaluate(() => {
        const vw = window.innerWidth;
        const found = [];
        for (const el of document.querySelectorAll("body *")) {
          const b = el.getBoundingClientRect();
          if (b.width < 200 || b.height < 120 || b.width > vw * 0.97) continue;
          const s = getComputedStyle(el);
          const shadow = s.boxShadow && s.boxShadow !== "none";
          const round = parseFloat(s.borderTopLeftRadius) >= 10;
          const media = ["IMG", "VIDEO", "CANVAS"].includes(el.tagName);
          if (!((shadow && round) || (media && b.width >= 280))) continue;
          found.push({
            el,
            x: b.left + window.scrollX,
            y: b.top + window.scrollY,
            w: b.width,
            h: b.height,
            tag: el.tagName,
            src: media ? el.currentSrc || el.src || "" : "",
            text: (el.innerText || el.alt || "")
              .trim()
              .replace(/\s+/g, " ")
              .slice(0, 80),
          });
        }
        // descarta cajas anidadas casi iguales a su contenedor
        const keep = found.filter(
          (o) =>
            !found.some(
              (q) =>
                q !== o &&
                q.el.contains(o.el) &&
                (o.w * o.h) / (q.w * q.h) > 0.6
            )
        );
        return keep.map(({ el, ...c }) => ({
          ...c,
          x: Math.round(c.x),
          y: Math.round(c.y),
          w: Math.round(c.w),
          h: Math.round(c.h),
        }));
      });

      let n = 0;
      for (const c of cands.slice(0, 40)) {
        const pad = 28;
        const x = Math.max(0, c.x - pad);
        const y = Math.max(0, c.y - pad);
        const name = `ui-${String(n).padStart(2, "0")}.png`;
        try {
          await p.screenshot({
            path: dir + name,
            fullPage: true,
            clip: {
              x,
              y,
              width: Math.min(1440 - x, c.w + pad * 2),
              height: c.h + pad * 2,
            },
          });
          r.crops.push({ name, ...c });
          n++;
        } catch (e) {
          r.crops.push({ name: "error", err: String(e).slice(0, 120), ...c });
        }
      }

      r.links = await p.evaluate(() => {
        const seen = new Set();
        const out = [];
        for (const a of document.querySelectorAll("a[href]")) {
          const key = a.href;
          if (seen.has(key)) continue;
          seen.add(key);
          out.push(`${(a.innerText || "").trim().replace(/\s+/g, " ").slice(0, 40)} → ${a.href}`);
        }
        return out.slice(0, 90);
      });
    } catch (e) {
      r.err = String(e).slice(0, 300);
    }
    await ctx.close();
    report.push(r);
    console.error(`listo: ${folder} (${r.crops.length} recortes)`);
  }

  const out = `${BASE}report-ui-${Date.now()}.json`;
  fs.writeFileSync(out, JSON.stringify(report, null, 2));
  console.error(out);
  await browser.close();
})();
