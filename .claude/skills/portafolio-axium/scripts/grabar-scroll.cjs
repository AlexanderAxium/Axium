// Graba una sección que avanza CON EL SCROLL (2026-10-07): las que el tiempo no mueve, como
// «De tu web a tu agenda» de bookit.com.pe (panel fijo y cinco pasos). El script baja la
// página paso a paso, con una pausa en cada uno, mientras el screencast graba.
//
//   PWCORE=… PWEXE=… node grabar-scroll.cjs '<json>'
//   json: { url, salida, viewport:[w,h] (css), zoom (2), seccion (regex del titular de la
//           sección), pasos, mover (s por tramo), pausa (s en cada paso), antes (s quieto al
//           llegar), tramo? (px de scroll por paso, en las unidades de la página ampliada; si
//           no, el alto de la sección menos una pantalla entre los pasos: en bookit.com.pe eso
//           avanzaba paso y medio, y los pasos reales iban cada ~657), paradas? ([0, …] px desde
//           el inicio de la sección, una por paso: gana sobre `tramo`; en bookit.com.pe los
//           pasos se activan en 0 · 350–1000 · 1200–1900 · 2050–2700 · 2850+), almacen? ({clave: valor}
//           en localStorage antes de cargar: el
//           consentimiento de cookies, el idioma), galletas? ([{name, value}]) }
//
// Como en grabar-carga.cjs, la página se pinta a `zoom` desde el primer cuadro en una ventana
// `zoom` veces más grande. Los tramos reparten el alto de la sección menos una pantalla.
//
// ⚠️ Con la página ampliada, lo que mide `100vh` mide DOS pantallas: la columna fija de
// bookit.com.pe dejaba de estar fija a la mitad del recorrido y su pie (párrafo y avance) no
// se veía. Por eso cada elemento `sticky` de la sección que mida una pantalla o más se fija al
// alto de una pantalla real.
const { chromium } = require(process.env.PWCORE);
const fs = require("fs");
const path = require("path");
const C = JSON.parse(process.argv[2]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(process.env.PWEXE ? { executablePath: process.env.PWEXE } : {});
  const [w, h] = C.viewport || [1440, 900];
  const z = C.zoom || 2;
  const ctx = await b.newContext({ viewport: { width: w * z, height: h * z }, deviceScaleFactor: 1, locale: "es-PE" });
  if (C.galletas) await ctx.addCookies(C.galletas.map((g) => ({ ...g, url: C.url })));
  await ctx.addInitScript(({ z, almacen }) => {
    try { for (const [k, v] of Object.entries(almacen || {})) localStorage.setItem(k, v); } catch {}
    const poner = () => { document.documentElement.style.zoom = String(z); };
    if (document.documentElement) poner();
    document.addEventListener("DOMContentLoaded", poner);
  }, { z, almacen: C.almacen || {} });
  const p = await ctx.newPage();
  await p.goto(C.url, { waitUntil: "networkidle" });
  await wait(1500);
  // montar todo lo que entra al verse
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 700) { await p.evaluate((v) => window.scrollTo(0, v), y); await wait(90); }
  const m = await p.evaluate((re) => {
    const r = new RegExp(re);
    const t = [...document.querySelectorAll("h1,h2,h3")].find((x) => r.test(x.innerText));
    if (!t) return null;
    let s = t.closest("section") || t.parentElement;
    const caja = s.getBoundingClientRect();
    return { top: caja.top + window.scrollY, alto: caja.height, vista: window.innerHeight };
  }, C.seccion);
  if (!m) { console.log("✗ no encontré la sección"); await b.close(); process.exit(1); }
  const fijos = await p.evaluate(({ re, z }) => {
    const r = new RegExp(re);
    const t = [...document.querySelectorAll("h1,h2,h3")].find((x) => r.test(x.innerText));
    const s = t.closest("section") || t.parentElement;
    let n = 0;
    for (const e of s.querySelectorAll("*")) {
      if (getComputedStyle(e).position !== "sticky") continue;
      if (e.getBoundingClientRect().height < window.innerHeight * 0.95) continue;
      e.style.height = `${window.innerHeight / z}px`;
      e.style.minHeight = "0";
      n++;
    }
    return n;
  }, { re: C.seccion, z });
  console.log("sticky corregidos:", fijos);
  const n = C.pasos || 5;
  const tramo = C.tramo || (m.alto - m.vista) / (n - 1);
  console.log("sección", JSON.stringify(m), "tramo", Math.round(tramo));
  await p.evaluate((y) => window.scrollTo(0, y), m.top);
  await wait(1200);
  fs.rmSync(C.salida, { recursive: true, force: true });
  fs.mkdirSync(C.salida, { recursive: true });
  const cdp = await ctx.newCDPSession(p);
  const cuadros = [];
  cdp.on("Page.screencastFrame", async (f) => {
    cuadros.push({ t: f.metadata.timestamp, data: f.data });
    try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch {}
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 95, everyNthFrame: 1, maxWidth: w * z, maxHeight: h * z });
  await wait((C.antes || 1.5) * 1000);
  const marcas = [];
  const paradas = C.paradas || Array.from({ length: n }, (_, k) => tramo * k);
  for (let k = 1; k < paradas.length; k++) {
    const desde = m.top + paradas[k - 1], hasta = m.top + paradas[k];
    await p.evaluate(({ desde, hasta, ms }) => new Promise((ok) => {
      const t0 = performance.now();
      const paso = (t) => {
        const x = Math.min(1, (t - t0) / ms);
        const e = x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
        window.scrollTo(0, desde + (hasta - desde) * e);
        if (x < 1) requestAnimationFrame(paso); else ok();
      };
      requestAnimationFrame(paso);
    }), { desde, hasta, ms: (C.mover || 0.9) * 1000 });
    marcas.push(cuadros.length ? cuadros[cuadros.length - 1].t : 0);
    await wait((C.pausa || 1.8) * 1000);
  }
  await cdp.send("Page.stopScreencast");
  const lista = cuadros.map((c, i) => {
    const f = `f${String(i).padStart(4, "0")}.jpg`;
    fs.writeFileSync(path.join(C.salida, f), Buffer.from(c.data, "base64"));
    return { f, t: c.t };
  });
  fs.writeFileSync(path.join(C.salida, "cuadros.json"), JSON.stringify(lista));
  fs.writeFileSync(path.join(C.salida, "caja.json"), JSON.stringify({ x: 0, y: 0, w: w * z, h: h * z, pad: 0 }, null, 1));
  const t0 = lista.length ? lista[0].t : 0;
  console.log("✓", lista.length, "cuadros · llegadas a cada paso (s):", marcas.map((t) => (t - t0).toFixed(2)).join(" "));
  await b.close();
})();
