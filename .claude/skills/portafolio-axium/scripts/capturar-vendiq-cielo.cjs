// Vendiq con la portada clara «cielo» (2026-10-21): capturas de vendiq.pe EN VIVO, solo lectura.
// La web pasó a láminas claras con secciones «noche», titulares en Literata y el panel en el hero
// (DESIGN.md de Vendiq, «Cielo, el hero elegido…», 2026-10-19).
//
//   PWCORE=… node capturar-vendiq-cielo.cjs <dir-salida> [heroe] [modulos] [incluido] [panel]
//
//  · heroe:    primera pantalla con cabecera (heroe-escritorio.png 1440×900 a 2x, para la laptop;
//              heroe-movil.png 390×844 a 3x, para el celular) y sin cabecera ni anuncio
//              (heroe-limpio.png), con las entradas ya terminadas.
//  · modulos:  las siete tarjetas de «Una sola cuenta…», cada `li` aislado a 3x sobre su papel.
//  · incluido: la lámina «Lo que ya viene incluido» (cifras y mapa del Perú) a 2x.
//  · panel:    la ventana del panel del hero, aislada a 3x con transparencia.
const { chromium } = require(process.env.PWCORE);
const fs = require("fs");
const path = require("path");
const OUT = process.argv[2];
const TAREAS = process.argv.slice(3);
const hacer = (t) => TAREAS.length === 0 || TAREAS.includes(t);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });

async function abrir(b, vw, vh, dpr) {
  const ctx = await b.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: dpr, locale: "es-PE", reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto("https://vendiq.pe", { waitUntil: "networkidle" });
  // el aviso de cookies aparece con retraso: se espera y se acepta
  try {
    const x = p.getByRole("button", { name: "Aceptar todas", exact: true });
    await x.first().waitFor({ state: "visible", timeout: 6000 });
    await x.first().click();
    await wait(500);
  } catch {}
  // fuera lo fijo de abajo (cookies, WhatsApp) y el indicador de Next
  await p.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  await p.evaluate(() => {
    for (const e of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(e);
      if (cs.position === "fixed" && !e.closest("header")) {
        const r = e.getBoundingClientRect();
        if (r.top > innerHeight * 0.5 || /cookies|WhatsApp/i.test(e.innerText || e.getAttribute("aria-label") || "")) e.style.display = "none";
      }
    }
  });
  // las entradas terminadas: todas las animaciones al final
  await p.evaluate(() => { for (const a of document.getAnimations()) { try { if (a.effect.getTiming().iterations !== Infinity) a.finish(); } catch {} } });
  await wait(600);
  return { ctx, p };
}

(async () => {
  const b = await chromium.launch();
  if (hacer("heroe")) {
    for (const [nombre, vw, vh, dpr] of [["heroe-escritorio", 1440, 900, 2], ["heroe-movil", 390, 844, 3]]) {
      const { ctx, p } = await abrir(b, vw, vh, dpr);
      await p.screenshot({ path: path.join(OUT, `${nombre}.png`) });
      if (nombre === "heroe-escritorio") {
        await p.evaluate(() => { for (const e of document.querySelectorAll("header")) e.style.visibility = "hidden"; const a = document.querySelector("section a.portada-entrada, section .portada-entrada"); if (a && /Asistente/.test(a.textContent)) a.style.visibility = "hidden"; });
        await p.screenshot({ path: path.join(OUT, "heroe-limpio.png") });
      }
      await ctx.close();
      console.log("✓", nombre);
    }
  }
  if (hacer("modulos") || hacer("incluido")) {
    const { ctx, p } = await abrir(b, 1440, 900, 3);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 600) { await p.evaluate((v) => scrollTo(0, v), y); await wait(120); }
    await p.evaluate(() => { for (const e of document.querySelectorAll("header")) e.style.visibility = "hidden"; });
    if (hacer("modulos")) {
      const n = await p.evaluate(() => {
        const sec = [...document.querySelectorAll("h2")].find((h) => /Una sola cuenta/.test(h.textContent)).closest("section");
        const lista = [...sec.querySelectorAll("ul,ol")].find((l) => l.querySelectorAll(":scope > li").length >= 7);
        // sin la máscara del carrusel ni el recorte, y cada tarjeta numerada
        for (let a = lista; a && a !== sec; a = a.parentElement) { a.style.maskImage = "none"; a.style.webkitMaskImage = "none"; a.style.overflow = "visible"; }
        [...lista.children].forEach((li, i) => li.setAttribute("data-modulo", String(i + 1)));
        return lista.children.length;
      });
      for (let i = 1; i <= n; i++) {
        // la tarjeta sola, fija en pantalla (las del final del carrusel quedan fuera del cuadro)
        // y sobre el papel de su lámina
        await p.evaluate((i) => {
          for (const e of document.querySelectorAll("[data-modulo]")) { e.removeAttribute("style"); e.style.visibility = ""; }
          const li = document.querySelector(`[data-modulo="${i}"]`);
          li.closest("section").scrollIntoView({ block: "start" });
          const r = li.getBoundingClientRect();
          // las láminas apiladas llevan transform: un `fixed` adentro queda atado a la lámina
          for (const e of document.querySelectorAll("body *")) e.style.visibility = e === li || e.contains(li) || li.contains(e) ? "" : "hidden";
          for (let a = li.parentElement; a && a !== document.body; a = a.parentElement) { a.style.transform = "none"; a.style.filter = "none"; a.style.contain = "none"; }
          li.style.cssText = `position:fixed;left:40px;top:120px;width:${r.width}px;height:${r.height}px;z-index:2147483647;background:#F4F6F9;padding:4px;box-sizing:content-box;visibility:visible`;
        }, i);
        await wait(300);
        await p.locator(`[data-modulo="${i}"]`).screenshot({ path: path.join(OUT, `modulo-${i}.png`) });
        console.log("✓ módulo", i);
      }
    }
    if (hacer("incluido")) {
      const sec = p.locator("section", { has: p.locator("h2", { hasText: "Lo que ya viene incluido" }) }).first();
      await sec.scrollIntoViewIfNeeded();
      await wait(400);
      await sec.screenshot({ path: path.join(OUT, "incluido.png") });
      console.log("✓ incluido");
    }
    await ctx.close();
  }
  if (hacer("panel")) {
    const { ctx, p } = await abrir(b, 1440, 900, 3);
    const ok = await p.evaluate(() => {
      const ventana = [...document.querySelectorAll("div")].filter((d) => /tunegocio\.vendiq\.pe\/dashboard/.test(d.textContent) && /Resumen de hoy/.test(d.textContent))
        .sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height)[0];
      if (!ventana) return false;
      ventana.setAttribute("data-panel", "1");
      return true;
    });
    if (ok) {
      // ventana completa: fuera del recorte del hero, sobre transparente
      await p.evaluate(() => {
        const v = document.querySelector("[data-panel]");
        for (const e of document.querySelectorAll("body *")) if (!(e === v || e.contains(v) || v.contains(e))) e.style.visibility = "hidden";
        for (let a = v.parentElement; a; a = a.parentElement) { a.style.overflow = "visible"; a.style.background = "transparent"; a.style.maskImage = "none"; }
        document.documentElement.style.background = "transparent"; document.body.style.background = "transparent";
        const w = v.getBoundingClientRect().width;
        v.style.cssText += `;position:fixed;left:40px;top:40px;width:${w}px;z-index:2147483647;transform:none`;
      });
      await wait(400);
      await p.locator("[data-panel]").screenshot({ path: path.join(OUT, "panel-hero.png"), omitBackground: true });
      console.log("✓ panel");
    } else console.log("✗ panel no encontrado");
    await ctx.close();
  }
  await b.close();
})();
