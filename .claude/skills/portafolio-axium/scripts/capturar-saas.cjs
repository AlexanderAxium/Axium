// Captura 2x (desktop) y 3x (móvil) de los SaaS + logo, og:image y tokens.
// Uso: PWCORE=/ruta/playwright-core node capturar-saas.cjs [slug=url,slug=url]
const { chromium } = require(process.env.PWCORE);
const fs = require("fs");

const BASE =
  "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium/capturas-saas/";
const SITES = (
  process.argv[2] ||
  "vendiq=https://vendiq.pe,rematch=https://rematch.pe,lumiolearn=https://lumiolearn.com,bookit=https://bookit.com.pe"
)
  .split(",")
  .map((s) => s.split("="));
const UA_DESK =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const UA_MOB =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function scrollThrough(p, step) {
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += step) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await wait(140);
  }
  await p.evaluate(() => window.scrollTo(0, 0));
  await wait(1400);
  return H;
}

async function save(ctx, src, file) {
  try {
    const res = await ctx.request.get(src, { timeout: 20000 });
    if (!res.ok()) return null;
    const type = res.headers()["content-type"] || "";
    if (type.includes("text/html")) return null;
    const ext = type.includes("svg")
      ? ".svg"
      : type.includes("png")
        ? ".png"
        : type.includes("webp")
          ? ".webp"
          : type.includes("jpeg") || type.includes("jpg")
            ? ".jpg"
            : type.includes("icon")
              ? ".ico"
              : "";
    fs.writeFileSync(file + ext, await res.body());
    return file + ext;
  } catch {
    return null;
  }
}

(async () => {
  const browser = await chromium.launch(
    process.env.PWEXE ? { executablePath: process.env.PWEXE } : {}
  );
  const report = [];

  for (const [slug, url] of SITES) {
    const dir = `${BASE}${slug}/`;
    fs.mkdirSync(dir, { recursive: true });
    const r = { slug, url, shots: [], saved: [] };

    // ---------- desktop 1440x900 @2x ----------
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      locale: "es-PE",
      userAgent: UA_DESK,
    });
    try {
      const p = await ctx.newPage();
      await p
        .goto(url, { waitUntil: "networkidle", timeout: 45000 })
        .catch((e) => (r.gotoErr = String(e).slice(0, 160)));
      await wait(2500);
      r.finalUrl = p.url();
      r.title = await p.title();
      r.H = await scrollThrough(p, 500);

      r.meta = await p.evaluate(() => {
        const q = (s) => document.querySelector(s);
        const cs = (el) => (el ? getComputedStyle(el) : null);
        const header = q("header") || q("nav");
        const logoA =
          header?.querySelector('a[href="/"]') || header?.querySelector("a");
        const logoImg = logoA?.querySelector("img");
        const logoSvg = logoA?.querySelector("svg");
        const firstSec = q("main section") || q("section");
        const cta = [...document.querySelectorAll("a,button")].find((b) => {
          const s = getComputedStyle(b);
          return (
            s.backgroundColor !== "rgba(0, 0, 0, 0)" &&
            b.innerText.trim().length > 3 &&
            b.getBoundingClientRect().top < 900
          );
        });
        const icons = [
          ...document.querySelectorAll(
            'link[rel="apple-touch-icon"], link[rel="icon"]'
          ),
        ].map((l) => ({ href: l.href, sizes: l.getAttribute("sizes") }));
        return {
          description: q('meta[name="description"]')?.content,
          themeColor: q('meta[name="theme-color"]')?.content,
          ogImage: q('meta[property="og:image"]')?.content,
          font: cs(document.body).fontFamily,
          htmlBg: cs(document.documentElement).backgroundColor,
          bodyBg: cs(document.body).backgroundColor,
          heroBg: cs(firstSec)?.backgroundColor,
          heroBgImg: cs(firstSec)?.backgroundImage?.slice(0, 240),
          cta: cta
            ? {
                t: cta.innerText.trim().slice(0, 40),
                bg: cs(cta).backgroundColor,
                c: cs(cta).color,
                radius: cs(cta).borderRadius,
              }
            : null,
          logoImg: logoImg ? logoImg.currentSrc || logoImg.src : null,
          logoSvg: logoSvg ? logoSvg.outerHTML : null,
          logoAnchor: logoA ? logoA.outerHTML.slice(0, 1500) : null,
          icons,
          headings: [...document.querySelectorAll("h1,h2")]
            .map((h) => h.innerText.trim().replace(/\s+/g, " "))
            .filter(Boolean)
            .slice(0, 16),
          navLinks: [...(header?.querySelectorAll("a") || [])]
            .map((a) => `${a.innerText.trim()} → ${a.getAttribute("href")}`)
            .slice(0, 16),
          appLinks: [
            ...new Set(
              [...document.querySelectorAll("a")]
                .map((a) => a.href)
                .filter((h) =>
                  /app\.|demo|login|ingres|registr|signup|dashboard|admin|panel|tienda|store|reserv/i.test(
                    h
                  )
                )
            ),
          ].slice(0, 12),
        };
      });

      // logo / og / iconos
      if (r.meta.logoSvg) {
        fs.writeFileSync(`${dir}logo-web.svg`, r.meta.logoSvg);
        r.saved.push("logo-web.svg");
      }
      if (r.meta.logoImg) {
        const f = await save(ctx, r.meta.logoImg, `${dir}logo-web`);
        if (f) r.saved.push(f.split("/").pop());
      }
      if (r.meta.ogImage) {
        const f = await save(ctx, r.meta.ogImage, `${dir}og`);
        if (f) r.saved.push(f.split("/").pop());
      }
      const touch =
        r.meta.icons.find((i) => /apple/.test(i.href)) ||
        r.meta.icons.find((i) => /png|svg/.test(i.href));
      if (touch) {
        const f = await save(ctx, touch.href, `${dir}icon`);
        if (f) r.saved.push(f.split("/").pop());
      }

      // hero
      await p.screenshot({ path: `${dir}d-00-hero.jpg`, type: "jpeg", quality: 88 });
      r.shots.push("d-00-hero.jpg");

      // una captura por sección de primer nivel
      const secs = await p.evaluate(() => {
        const all = [...document.querySelectorAll("section, footer")].filter(
          (s) => {
            const b = s.getBoundingClientRect();
            return b.height > 280 && b.width > 1000;
          }
        );
        const top = all.filter((s) => !all.some((o) => o !== s && o.contains(s)));
        return top.map((s) => {
          const b = s.getBoundingClientRect();
          return {
            y: Math.round(b.top + window.scrollY),
            h: Math.round(b.height),
            t: (s.querySelector("h1,h2,h3")?.innerText || "")
              .trim()
              .replace(/\s+/g, " ")
              .slice(0, 60),
          };
        });
      });
      r.sections = secs;
      let i = 1;
      for (const s of secs) {
        if (s.y < 450) continue;
        await p.evaluate((v) => window.scrollTo(0, v), Math.max(0, s.y - 30));
        await wait(1000);
        const name = `d-${String(i).padStart(2, "0")}.jpg`;
        await p.screenshot({ path: dir + name, type: "jpeg", quality: 86 });
        r.shots.push(`${name} | ${s.t} | h${s.h}`);
        i++;
        if (i > 10) break;
      }
    } catch (e) {
      r.err = String(e).slice(0, 300);
    }
    await ctx.close();

    // ---------- móvil 390x844 @3x ----------
    const m = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      locale: "es-PE",
      userAgent: UA_MOB,
    });
    try {
      const mp = await m.newPage();
      await mp.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
      await wait(2500);
      await scrollThrough(mp, 420);
      for (let k = 0; k < 4; k++) {
        await mp.evaluate((v) => window.scrollTo(0, v), k * 844);
        await wait(800);
        await mp.screenshot({ path: `${dir}m-0${k}.jpg`, type: "jpeg", quality: 86 });
        r.shots.push(`m-0${k}.jpg`);
      }
    } catch (e) {
      r.mErr = String(e).slice(0, 300);
    }
    await m.close();

    report.push(r);
    console.error(`listo: ${slug} (${r.shots.length} capturas)`);
  }

  fs.writeFileSync(`${BASE}report.json`, JSON.stringify(report, null, 2));
  await browser.close();
})();
