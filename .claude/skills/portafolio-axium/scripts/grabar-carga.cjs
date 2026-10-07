// Graba la ENTRADA de una página desde que carga (2026-10-07): para las animaciones de
// entrada hechas con JavaScript (motion, framer), que `grabar-micro.cjs --reiniciar` no puede
// repetir porque no son animaciones CSS. Primera: el hero de bookit.com.pe.
//
//   PWCORE=… PWEXE=… node grabar-carga.cjs '<json>'
//   json: { url, salida, viewport:[w,h] (css), zoom (2), segundos, cookies? (nombres de
//           botones a pulsar ANTES, en una visita previa, para que el aviso no salga) }
//
// La página se pinta a `zoom` desde el primer cuadro (estilo inyectado al crear el documento)
// en una ventana `zoom` veces más grande, porque el screencast del headless shell sale a 1x.
// Salen f0000.jpg…, cuadros.json y caja.json (la ventana entera) para video-micro.py.
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
  // Una visita previa para aceptar cookies: la grabada entra limpia
  const p0 = await ctx.newPage();
  await p0.goto(C.url, { waitUntil: "networkidle" });
  for (const t of C.cookies || ["Aceptar todas", "Aceptar", "Solo esenciales"]) {
    const x = p0.getByRole("button", { name: t, exact: true });
    if (await x.count()) { try { await x.first().click({ timeout: 1500 }); await wait(400); } catch {} break; }
  }
  await p0.close();
  await ctx.addInitScript((z) => {
    const poner = () => { document.documentElement.style.zoom = String(z); };
    if (document.documentElement) poner();
    document.addEventListener("DOMContentLoaded", poner);
  }, z);
  const p = await ctx.newPage();
  fs.rmSync(C.salida, { recursive: true, force: true });
  fs.mkdirSync(C.salida, { recursive: true });
  const cdp = await ctx.newCDPSession(p);
  const cuadros = [];
  cdp.on("Page.screencastFrame", async (f) => {
    cuadros.push({ t: f.metadata.timestamp, data: f.data });
    try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch {}
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 95, everyNthFrame: 1, maxWidth: w * z, maxHeight: h * z });
  await p.goto(C.url, { waitUntil: "commit" });
  await wait((C.segundos || 8) * 1000);
  await cdp.send("Page.stopScreencast");
  const lista = cuadros.map((c, i) => {
    const f = `f${String(i).padStart(4, "0")}.jpg`;
    fs.writeFileSync(path.join(C.salida, f), Buffer.from(c.data, "base64"));
    return { f, t: c.t };
  });
  fs.writeFileSync(path.join(C.salida, "cuadros.json"), JSON.stringify(lista));
  fs.writeFileSync(path.join(C.salida, "caja.json"), JSON.stringify({ x: 0, y: 0, w: w * z, h: h * z, pad: 0 }, null, 1));
  console.log("✓", lista.length, "cuadros");
  await b.close();
})();
