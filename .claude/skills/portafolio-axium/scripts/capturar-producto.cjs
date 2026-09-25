// Tercera pasada: pantallas de producto real (no landing) + piezas dirigidas.
const { chromium } = require(process.env.PWCORE);
const fs = require("fs");

const BASE =
  "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium/capturas-saas/";
const UA_DESK =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const UA_MOB =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const log = [];

async function prep(p, { hideHeader = false } = {}) {
  const c = p
    .locator("button, a")
    .filter({ hasText: /solo esenciales|aceptar todas|aceptar/i })
    .first();
  if (await c.isVisible().catch(() => false)) {
    await c.click().catch(() => {});
    await wait(500);
  }
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 450) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await wait(150);
  }
  await p.evaluate(() => window.scrollTo(0, 0));
  await wait(1400);
  await p.evaluate((hide) => {
    for (const el of document.querySelectorAll("body *")) {
      const s = getComputedStyle(el);
      if (s.position !== "fixed" && s.position !== "sticky") continue;
      const b = el.getBoundingClientRect();
      const isHeader = b.top < 100 && b.width > window.innerWidth * 0.5;
      if (isHeader && !hide) el.style.setProperty("position", "absolute", "important");
      else el.style.setProperty("display", "none", "important");
    }
  }, hideHeader);
  await wait(400);
}

// marca el ancestro más cercano con ancho mínimo a partir de un texto o selector
async function tag(p, { text, selector, minW, minH = 0, name }) {
  return p.evaluate(
    ({ text, selector, minW, minH, name }) => {
      document.querySelectorAll(`[data-cap="${name}"]`).forEach((e) => e.removeAttribute("data-cap"));
      let start = null;
      if (selector) start = document.querySelector(selector);
      if (!start && text) {
        const re = new RegExp(text, "i");
        start = [...document.querySelectorAll("body *")].find(
          (e) => e.children.length === 0 && re.test(e.textContent || "")
        );
      }
      let n = start;
      while (n) {
        const b = n.getBoundingClientRect();
        if (b.width >= minW && b.height >= minH) break;
        n = n.parentElement;
      }
      if (!n) return null;
      n.setAttribute("data-cap", name);
      const b = n.getBoundingClientRect();
      return { w: Math.round(b.width), h: Math.round(b.height) };
    },
    { text, selector, minW, minH, name }
  );
}

async function shootTagged(p, name, file) {
  const loc = p.locator(`[data-cap="${name}"]`).first();
  if (!(await loc.count())) return log.push(`✗ ${file}`);
  await loc.scrollIntoViewIfNeeded().catch(() => {});
  await wait(900);
  await loc.screenshot({ path: file }).then(
    () => log.push(`✓ ${file.replace(BASE, "")}`),
    (e) => log.push(`✗ ${file}: ${String(e).slice(0, 80)}`)
  );
}

async function productPage(browser, folder, url) {
  const dir = `${BASE}${folder}/`;
  fs.mkdirSync(dir, { recursive: true });
  const d = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    locale: "es-PE",
    userAgent: UA_DESK,
  });
  try {
    const p = await d.newPage();
    await p.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
    await wait(2500);
    await prep(p);
    await p.screenshot({ path: `${dir}d-top.png` });
    await p.screenshot({ path: `${dir}d-full.jpg`, type: "jpeg", quality: 85, fullPage: true });
    log.push(`✓ ${folder} desktop (${p.url()})`);
  } catch (e) {
    log.push(`✗ ${folder} desktop ${String(e).slice(0, 100)}`);
  }
  await d.close();

  const m = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    locale: "es-PE",
    userAgent: UA_MOB,
  });
  try {
    const p = await m.newPage();
    await p.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
    await wait(2500);
    await prep(p);
    await p.screenshot({ path: `${dir}m-top.png` });
    await p.screenshot({ path: `${dir}m-full.jpg`, type: "jpeg", quality: 85, fullPage: true });
    log.push(`✓ ${folder} mobile`);
  } catch (e) {
    log.push(`✗ ${folder} mobile ${String(e).slice(0, 100)}`);
  }
  await m.close();
}

(async () => {
  const browser = await chromium.launch(
    process.env.PWEXE ? { executablePath: process.env.PWEXE } : {}
  );

  // ---- Vendiq: ventana del dashboard en sus 3 pestañas + grilla de pagos ----
  {
    const dir = `${BASE}vendiq/ui/`;
    fs.mkdirSync(dir, { recursive: true });
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      userAgent: UA_DESK,
    });
    const p = await ctx.newPage();
    await p.goto("https://vendiq.pe", { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
    await wait(2500);
    await prep(p, { hideHeader: true });
    const tabs = ["Ecommerce", "Constructor de webs", "Inventarios"];
    for (const [i, t] of tabs.entries()) {
      await p.getByText(t, { exact: true }).first().click().catch(() => {});
      await wait(1600);
      const r = await tag(p, { text: "vendiq\\.pe/", minW: 1000, minH: 300, name: "win" });
      log.push(`vendiq tab ${t}: ${JSON.stringify(r)}`);
      await shootTagged(p, "win", `${dir}dash-${i}.png`);
    }
    const g = await tag(p, { selector: 'img[alt="stripe"]', minW: 480, minH: 320, name: "pay" });
    log.push(`vendiq pagos: ${JSON.stringify(g)}`);
    await shootTagged(p, "pay", `${dir}pagos.png`);
    await ctx.close();
  }

  // ---- Rematch: widget de control en tiempo real + móvil original ----
  {
    const dir = `${BASE}rematch/ui/`;
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      userAgent: UA_DESK,
    });
    const p = await ctx.newPage();
    await p.goto("https://rematch.pe", { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
    await wait(2500);
    await prep(p, { hideHeader: true });
    const w = await tag(p, { text: "Control en tiempo real", minW: 260, minH: 260, name: "ctl" });
    log.push(`rematch control: ${JSON.stringify(w)}`);
    await shootTagged(p, "ctl", `${dir}control.png`);
    const res = await ctx.request.get("https://rematch.pe/celular.webp").catch(() => null);
    if (res?.ok()) {
      fs.writeFileSync(`${dir}celular.webp`, await res.body());
      log.push("✓ rematch/ui/celular.webp");
    }
    await ctx.close();
  }

  // ---- Producto real ----
  await productPage(browser, "rematch/canchas", "https://rematch.pe/canchas");
  await productPage(browser, "rematch/club", "https://rematch.pe/canchas/arena-sport-miraflores");
  await productPage(browser, "lumiolearn/maintech", "https://maintech.com.pe/");
  await productPage(browser, "vendiq/ia", "https://vendiq.pe/ia");

  console.log(log.join("\n"));
  await browser.close();
})();
