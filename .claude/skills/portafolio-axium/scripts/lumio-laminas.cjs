// Capturas finales para las láminas de la ficha de LumioLearn.
// Lumio en local (base lumio_capturas, host lvh.me:3300, CMS_SCHEMA_MIGRATE_ONREAD=false),
// tenant propio LumioLearn Academy con los datos de demo de lumio-demo-*.ts.
// Uso: PWCORE=... PWEXE=... node lumio-laminas.cjs [solo-prefijo]
const { chromium } = require(process.env.PWCORE);
const fs = require("fs");

const OUT = `${__dirname}/../capturas-saas/lumiolearn/laminas/`;
const BASE = "http://lumio.lvh.me:3300";
const COURSE = "fea60666-2584-4290-b8bc-14d115977568";
const CHAPTER = "455dc8f2-9e69-4968-ac86-fee9f9289c2e";
const SOLO = process.argv[2] || "";
const HIDE =
  "nextjs-portal,[data-nextjs-toast],[data-next-badge-root]{display:none!important}html{scroll-behavior:auto!important}";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });

async function contexto(browser, movil = false) {
  const ctx = await browser.newContext(
    movil
      ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: "es-PE" }
      : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: "es-PE" }
  );
  await ctx.setExtraHTTPHeaders({ "Accept-Language": "es-PE,es;q=0.9" });
  await ctx.route(/youtube\.com|ytimg\.com|youtube-nocookie\.com|googlevideo\.com/, (r) => r.abort());
  return ctx;
}

async function entrar(ctx, email) {
  const p = await ctx.newPage();
  await p.goto(`${BASE}/signin`, { waitUntil: "load", timeout: 240000 });
  await p.waitForSelector("input[name=email]", { timeout: 120000 });
  await p.fill("input[name=email]", email);
  await p.fill("input[name=password]", "password");
  await p.click("button[type=submit]", { noWaitAfter: true, timeout: 120000 });
  await p.waitForURL((u) => !u.pathname.startsWith("/signin"), { timeout: 180000 }).catch(() => {});
  await wait(2500);
  return p;
}

async function ir(p, path, extra = 3500) {
  await p.goto(BASE + path, { waitUntil: "load", timeout: 240000 });
  await p.addStyleTag({ content: HIDE }).catch(() => {});
  await wait(extra);
}

async function foto(p, nombre, opciones = {}) {
  if (SOLO && !nombre.startsWith(SOLO)) return;
  await p.addStyleTag({ content: HIDE }).catch(() => {});
  await p.screenshot({ path: `${OUT}${nombre}.png`, ...opciones });
  console.log(`✓ ${nombre}`);
}

const quiere = (prefijo) => !SOLO || prefijo.startsWith(SOLO) || SOLO.startsWith(prefijo);

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.PWEXE,
    args: ["--host-resolver-rules=MAP lvh.me 127.0.0.1, MAP *.lvh.me 127.0.0.1", "--autoplay-policy=user-gesture-required"],
  });

  // Sitio público de la academia
  if (quiere("sitio")) {
    const d = await contexto(browser);
    const p = await d.newPage();
    await ir(p, "/", 5000);
    await foto(p, "sitio-home-d", { fullPage: true });
    await d.close();
    const m = await contexto(browser, true);
    const pm = await m.newPage();
    await ir(pm, "/", 5000);
    await foto(pm, "sitio-home-m", { fullPage: true });
    await m.close();
  }

  // Panel de la academia
  if (quiere("panel")) {
    const ctx = await contexto(browser);
    const p = await entrar(ctx, "admin@lumio.com");
    await ir(p, `/dashboard/courses/${COURSE}`);
    await foto(p, "panel-curso");
    await ir(p, `/dashboard/courses/${COURSE}/chapters/${CHAPTER}/edit`);
    await p.getByRole("tab", { name: "Quiz" }).click().catch((e) => console.log("  ! pestaña Quiz", String(e).slice(0, 80)));
    await wait(2000);
    await foto(p, "panel-capitulo-quiz");
    await ir(p, `/dashboard/courses/${COURSE}/certificate-template`, 5000);
    await foto(p, "panel-certificado");
    await ir(p, "/dashboard");
    await foto(p, "panel-inicio");
    await ctx.close();
  }

  // Portal del alumno
  if (quiere("alumno")) {
    const ctx = await contexto(browser);
    const p = await entrar(ctx, "user@lumio.com");
    await ir(p, "/user", 4000);
    await foto(p, "alumno-inicio", { fullPage: true });
    await ir(p, "/user/courses/transformacion-digital-360-001", 6000);
    await foto(p, "alumno-reproductor");
    for (const [pestana, nombre] of [["Notas", "alumno-notas"], ["Marcadores", "alumno-marcadores"]]) {
      await p.getByRole("button", { name: pestana, exact: true }).first().click().catch((e) => console.log(`  ! ${pestana}`, String(e).slice(0, 80)));
      await wait(2000);
      await foto(p, nombre);
    }
    await p.locator("button.fixed.bottom-6.right-6").first().click().catch((e) => console.log("  ! tutor", String(e).slice(0, 80)));
    await wait(2500);
    await foto(p, "alumno-lumen");
    await ctx.close();
  }

  await browser.close();
})();
