// Cuadros de una web bajando por su portada, para un vídeo de navegador o de celular
// (2026-10-07, Aurore). Generaliza `web-scroll` y `web-movil-scroll` de capturar-rematch-pm.cjs:
// cada cuadro es una captura determinista en su posición de scroll (nada de screencast), con
// una curva suave entre paradas y una pausa en cada una.
//
//   PWCORE=… PWEXE=… node capturar-scroll-cuadros.cjs '<json>'
//   json: { url, salida, viewport:[w,h], dpr, movil? (true: isMobile + táctil),
//           paradas: [{ titular?: regex | y?: px, menos?: px por encima del titular,
//                       llegar: cuadros de viaje, quedarse: cuadros quieto }],
//           ocultar?: regex de clases de elementos FIJOS a quitar (el WhatsApp),
//           almacen?: {clave: valor} en localStorage }
//
// La primera parada no viaja (es el arranque). Sale f0000.jpg… en `salida`.
const { chromium } = require(process.env.PWCORE);
const fs = require("fs");
const path = require("path");
const C = JSON.parse(process.argv[2]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const suave = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
(async () => {
  const b = await chromium.launch(process.env.PWEXE ? { executablePath: process.env.PWEXE } : {});
  const [w, h] = C.viewport || [1440, 900];
  const ctx = await b.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: C.dpr || 1.5,
    isMobile: !!C.movil,
    hasTouch: !!C.movil,
    locale: "es-PE",
  });
  await ctx.addInitScript((almacen) => { try { for (const [k, v] of Object.entries(almacen || {})) localStorage.setItem(k, v); } catch {} }, C.almacen || {});
  const p = await ctx.newPage();
  await p.goto(C.url, { waitUntil: "networkidle" });
  await wait(1500);
  for (const t of ["Aceptar todas", "Aceptar", "Solo esenciales", "Entendido"]) {
    const x = p.getByRole("button", { name: t, exact: true });
    if (await x.count()) { try { await x.first().click({ timeout: 1200 }); await wait(300); } catch {} break; }
  }
  // montar lo que entra al verse, y volver arriba
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 450) { await p.evaluate((v) => window.scrollTo(0, v), y); await wait(110); }
  await p.evaluate(() => window.scrollTo(0, 0));
  await wait(1200);
  if (C.ocultar) {
    await p.evaluate((re) => {
      const r = new RegExp(re);
      for (const e of document.querySelectorAll("body *")) {
        if (getComputedStyle(e).position === "fixed" && r.test(String(e.className))) e.style.display = "none";
      }
    }, C.ocultar);
  }
  const ys = await p.evaluate((paradas) => paradas.map((s) => {
    if (typeof s.y === "number") return s.y;
    const r = new RegExp(s.titular);
    const t = [...document.querySelectorAll("h1,h2,h3")].find((x) => r.test(x.innerText) && x.getBoundingClientRect().height > 0);
    return t ? Math.max(0, Math.round(t.getBoundingClientRect().top + window.scrollY - (s.menos || 0))) : 0;
  }), C.paradas);
  console.log("paradas", ys.join(" "));
  fs.rmSync(C.salida, { recursive: true, force: true });
  fs.mkdirSync(C.salida, { recursive: true });
  let n = 0;
  const foto = async () => {
    await p.screenshot({ path: path.join(C.salida, `f${String(n).padStart(4, "0")}.jpg`), type: "jpeg", quality: 92 });
    n++;
  };
  let y0 = ys[0];
  for (let k = 0; k < C.paradas.length; k++) {
    const s = C.paradas[k];
    const y1 = ys[k];
    const viaje = k === 0 ? 0 : s.llegar || 50;
    for (let i = 1; i <= viaje; i++) {
      await p.evaluate((v) => window.scrollTo(0, v), Math.round(y0 + (y1 - y0) * suave(i / viaje)));
      await wait(60);
      await foto();
    }
    await p.evaluate((v) => window.scrollTo(0, v), y1);
    for (let i = 0; i < (s.quedarse || 30); i++) { await wait(60); await foto(); }
    y0 = y1;
  }
  console.log("✓", n, "cuadros en", C.salida);
  await b.close();
})();
