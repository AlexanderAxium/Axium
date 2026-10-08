// Graba EN TIEMPO REAL lo que se ve en pantalla (2026-10-07, ANJ Sports: el carrusel del
// héroe de anjsports.com, que cambia de marca y de color solo). Para animaciones que corren
// con el reloj y no con el scroll ni el ratón.
//
//   PWCORE=… PWEXE=… node grabar-pantalla.cjs '<json>'
//   json: { url, salida, viewport:[w,h] (css), zoom (2; 3 para móvil), segundos,
//           antes? (s de espera antes de grabar), ocultar? (regex de clases de elementos
//           FIJOS a quitar: el WhatsApp), almacen? ({clave: valor}), arriba? (px css a bajar),
//           clic? ({ js: cuerpo de función que devuelve el elemento o una lista, cada: s, veces, desde: s }):
//           pulsa ese elemento cada `cada` segundos mientras graba (la flecha de un carrusel que
//           no avanza solo, como «Deportistas» de anjsports.com),
//           fijarVh? (true: con zoom, lo que mide una pantalla —100vh, min-h-screen— mediría
//           `zoom` pantallas; se fija a la altura real. El héroe de anjsports.com salía cortado) }
//
// La página se pinta a `zoom` en una ventana `zoom` veces más grande (el screencast del
// headless shell sale a 1x). Sale f0000.jpg…, cuadros.json ({f, t}) y caja.json (la pantalla
// entera), el mismo formato que grabar-micro.cjs: se arma con video-micro.py o a mano.
const { chromium } = require(process.env.PWCORE);
const fs = require("fs");
const path = require("path");
const C = JSON.parse(process.argv[2]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(C.salida, { recursive: true });
  const b = await chromium.launch({ executablePath: process.env.PWEXE });
  const [w, h] = C.viewport || [1440, 810];
  const z = C.zoom || 2;
  const ctx = await b.newContext({ viewport: { width: w * z, height: h * z }, deviceScaleFactor: 1, locale: "es-PE" });
  await ctx.addInitScript(({ z, almacen }) => {
    try { for (const [k, v] of Object.entries(almacen || {})) localStorage.setItem(k, v); } catch {}
    const poner = () => { document.documentElement.style.zoom = String(z); };
    if (document.documentElement) poner();
    document.addEventListener("DOMContentLoaded", poner);
  }, { z, almacen: C.almacen || {} });
  const p = await ctx.newPage();
  await p.goto(C.url, { waitUntil: "load", timeout: 90000 });
  await wait((C.antes || 3) * 1000);
  if (C.ocultar) {
    await p.evaluate((re) => {
      const r = new RegExp(re);
      for (const e of document.querySelectorAll("*")) {
        const cs = getComputedStyle(e);
        if ((cs.position === "fixed" || cs.position === "sticky") && r.test(String(e.className))) e.style.visibility = "hidden";
      }
    }, C.ocultar);
  }
  if (C.fijarVh && z > 1) {
    await p.evaluate((z) => {
      const vh = innerHeight; // con zoom en <html>, en px css sin ampliar
      for (const e of document.querySelectorAll("body *")) {
        const cs = getComputedStyle(e);
        const h = parseFloat(cs.height), mh = parseFloat(cs.minHeight);
        if (Math.abs(h - vh) < 3) e.style.setProperty("height", vh / z + "px", "important");
        if (Math.abs(mh - vh) < 3) e.style.setProperty("min-height", vh / z + "px", "important");
      }
    }, z);
    await wait(800);
  }
  if (C.arriba) await p.evaluate((y) => window.scrollTo(0, y), C.arriba);
  const cdp = await ctx.newCDPSession(p);
  const cuadros = [];
  const t0 = Date.now();
  cdp.on("Page.screencastFrame", async (f) => {
    cuadros.push({ data: f.data, t: (Date.now() - t0) / 1000 });
    try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch {}
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, everyNthFrame: 1, maxWidth: w * z, maxHeight: h * z });
  if (C.clic) {
    // `js` puede devolver un elemento (se pulsa `veces` veces) o una lista (se pulsan en orden)
    const total = await p.evaluate((js) => {
      const r = new Function(js)();
      const lista = Array.isArray(r) ? r : r ? [r] : [];
      lista.forEach((e, i) => e.setAttribute("data-clic", String(i + 1)));
      return lista.length;
    }, C.clic.js);
    await wait((C.clic.desde || 1.5) * 1000);
    for (let i = 0; i < (C.clic.veces || 4); i++) {
      const n = (i % Math.max(1, total)) + 1;
      try { await p.locator(`[data-clic="${n}"]`).click({ timeout: 2000 }); } catch (e) { console.log("clic:", e.message.slice(0, 80)); }
      await wait((C.clic.cada || 2.5) * 1000);
    }
    const resto = (C.segundos || 12) - (C.clic.desde || 1.5) - (C.clic.veces || 4) * (C.clic.cada || 2.5);
    if (resto > 0) await wait(resto * 1000);
  } else await wait((C.segundos || 12) * 1000);
  await cdp.send("Page.stopScreencast");
  const lista = cuadros.map((c, i) => {
    const f = `f${String(i).padStart(4, "0")}.jpg`;
    fs.writeFileSync(path.join(C.salida, f), Buffer.from(c.data, "base64"));
    return { f, t: c.t };
  });
  fs.writeFileSync(path.join(C.salida, "cuadros.json"), JSON.stringify(lista));
  fs.writeFileSync(path.join(C.salida, "caja.json"), JSON.stringify({ x: 0, y: 0, w: w, h: h, pad: 0, propia: { x: 0, y: 0, w: w, h: h } }));
  await b.close();
  console.log("✓", lista.length, "cuadros en", (lista.at(-1)?.t || 0).toFixed(1), "s →", C.salida);
})();
