// Captura fichas de caso de una referencia para desarmarlas con la REJILLA:
// tramos de pantalla (escritorio y móvil), página completa, esqueleto de textos
// con tamaños/pesos/posiciones, y las métricas de extraer.js.
// Uso: PWCORE=... PWEXE=... node capturar-casos-referencia.cjs <slug> <url> [url…]
const { chromium } = require(process.env.PWCORE);
const fs = require("fs");
const path = require("path");

const [, , slug, ...urls] = process.argv;
const OUT = `${path.join(__dirname, "..", "referencias", "capturas", slug)}/`;
fs.mkdirSync(OUT, { recursive: true });
const EXTRAER = fs.readFileSync(path.join(__dirname, "..", "extraer.js"), "utf8");
const FN = EXTRAER.slice(EXTRAER.indexOf("async () =>"));
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function recorrer(p) {
  let H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 400) {
    await p.evaluate((v) => scrollTo(0, v), y);
    await wait(160);
    H = await p.evaluate(() => document.documentElement.scrollHeight);
  }
  await wait(1200);
  return H;
}

(async () => {
  const b = await chromium.launch({ executablePath: process.env.PWEXE });
  for (const url of urls) {
    const name = url.split("/").filter(Boolean).pop();
    try {
      // Escritorio
      const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA, locale: "en-US" });
      const p = await ctx.newPage();
      await p.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
      await wait(3500);
      const H = await recorrer(p);
      const tramos = Math.min(26, Math.ceil(H / 900));
      for (let i = 0; i < tramos; i++) {
        await p.evaluate((v) => scrollTo(0, v), i * 900);
        await wait(450);
        await p.screenshot({ path: `${OUT}caso-${name}-d${String(i).padStart(2, "0")}.jpg`, type: "jpeg", quality: 72 });
      }
      const esqueleto = await p.evaluate(() => {
        const out = [];
        for (const e of document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,img,video")) {
          const r = e.getBoundingClientRect();
          if (r.width < 2 || r.height < 2) continue;
          const top = Math.round(r.top + scrollY);
          if (e.tagName === "IMG" || e.tagName === "VIDEO") {
            if (r.width > 200) out.push({ top, tag: e.tagName, x: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height), src: (e.currentSrc || e.src || "").slice(-70) });
            continue;
          }
          if (e.closest("nav,header,footer")) continue;
          const t = (e.innerText || "").trim().replace(/\s+/g, " ");
          if (!t) continue;
          const s = getComputedStyle(e);
          out.push({ top, tag: e.tagName, x: Math.round(r.left), w: Math.round(r.width), size: s.fontSize, weight: s.fontWeight, family: s.fontFamily.split(",")[0].replace(/["']/g, ""), color: s.color, bg: getComputedStyle(e.parentElement).backgroundColor, text: t.slice(0, 300) });
        }
        return out.sort((a, b) => a.top - b.top);
      });
      await p.evaluate(() => scrollTo(0, 0));
      const metricas = await p.evaluate(`(${FN})()`);
      fs.writeFileSync(`${OUT}caso-${name}.json`, JSON.stringify({ url, alto: H, metricas, esqueleto }, null, 1));
      await p.screenshot({ path: `${OUT}caso-${name}-full.jpg`, type: "jpeg", quality: 55, fullPage: true }).catch((e) => console.log(`  ! full ${name}: ${e.message.slice(0, 80)}`));
      await ctx.close();

      // Móvil
      const m = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: UA, locale: "en-US" });
      const pm = await m.newPage();
      await pm.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
      await wait(3000);
      const Hm = await recorrer(pm);
      const tramosM = Math.min(12, Math.ceil(Hm / 844));
      for (let i = 0; i < tramosM; i++) {
        await pm.evaluate((v) => scrollTo(0, v), i * 844);
        await wait(400);
        await pm.screenshot({ path: `${OUT}caso-${name}-m${String(i).padStart(2, "0")}.jpg`, type: "jpeg", quality: 70 });
      }
      await m.close();
      console.log(`✓ ${name} · escritorio ${H}px (${tramos} tramos) · móvil ${Hm}px · ${esqueleto.length} nodos`);
    } catch (e) {
      console.log(`✗ ${name}: ${String(e).slice(0, 140)}`);
    }
  }
  await b.close();
})();
