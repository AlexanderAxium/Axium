// Aísla piezas de una sección de una web EN VIVO, con transparencia (2026-10-07): las
// tarjetas de funciones de bookit.com.pe, las de lumiolearn.com. Generaliza lo que se hizo
// con los módulos de Vendiq (capturar-vendiq-pm.cjs) y la portada (portada-marca-vendiq.cjs).
//
//   PWCORE=… PWEXE=… node aislar-piezas.cjs '<json>'
//   json: { url, salida (carpeta), prefijo, dpr (3), viewport:[w,h], seccion (regex de un
//           titular), piezas (cuerpo de función JS que recibe la sección `s` y devuelve la
//           lista de elementos, en orden), almacen? ({clave: valor} en localStorage),
//           movimientoReducido? (true: el estado final de las entradas) }
//
// Se oculta todo lo que no es la pieza ni sus ancestros, los ancestros pierden fondo, sombra
// y máscara, y la captura va con omitBackground: las esquinas redondeadas salen limpias
// (si no, «parece más problema de recortes tuyos que de la web», Alexander, 2026-10-06).
const { chromium } = require(process.env.PWCORE);
const fs = require("fs");
const path = require("path");
const C = JSON.parse(process.argv[2]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(process.env.PWEXE ? { executablePath: process.env.PWEXE } : {});
  const [w, h] = C.viewport || [1440, 900];
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: C.dpr || 3, locale: "es-PE", reducedMotion: C.movimientoReducido ? "reduce" : "no-preference" });
  await ctx.addInitScript((almacen) => { try { for (const [k, v] of Object.entries(almacen || {})) localStorage.setItem(k, v); } catch {} }, C.almacen || {});
  const p = await ctx.newPage();
  await p.goto(C.url, { waitUntil: "networkidle" });
  await wait(1500);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 500) { await p.evaluate((v) => window.scrollTo(0, v), y); await wait(110); }
  const n = await p.evaluate(({ re, cuerpo }) => {
    const r = new RegExp(re);
    const t = [...document.querySelectorAll("h1,h2,h3")].find((x) => r.test(x.innerText));
    if (!t) return 0;
    const s = t.closest("section") || t.parentElement;
    s.scrollIntoView({ block: "center" });
    const lista = new Function("s", cuerpo)(s);
    lista.forEach((e, i) => e.setAttribute("data-pieza", String(i + 1)));
    return lista.length;
  }, { re: C.seccion, cuerpo: C.piezas });
  if (!n) { console.log("✗ no encontré piezas"); await b.close(); process.exit(1); }
  await wait(1500);
  fs.mkdirSync(C.salida, { recursive: true });
  for (let i = 1; i <= n; i++) {
    await p.evaluate((i) => {
      const el = document.querySelector(`[data-pieza="${i}"]`);
      el.scrollIntoView({ block: "center" });
      for (const e of document.querySelectorAll("body *")) {
        e.style.visibility = "";
        if (e === el || e.contains(el) || el.contains(e)) continue;
        e.style.visibility = "hidden";
      }
      for (let a = el.parentElement; a; a = a.parentElement) {
        a.style.background = "transparent";
        a.style.boxShadow = "none";
        a.style.maskImage = "none";
        a.style.webkitMaskImage = "none";
      }
      document.documentElement.style.background = "transparent";
      document.body.style.background = "transparent";
    }, i);
    await wait(700);
    const f = path.join(C.salida, `${C.prefijo || "pieza"}-${i}.png`);
    await p.locator(`[data-pieza="${i}"]`).screenshot({ path: f, omitBackground: true });
    const t = await p.locator(`[data-pieza="${i}"]`).innerText();
    console.log("✓", path.basename(f), t.replace(/\s+/g, " ").slice(0, 60));
  }
  await b.close();
})();
