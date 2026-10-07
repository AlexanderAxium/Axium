// Graba una sección que cambia al pasar el ratón (2026-10-07): los rubros de bookit.com.pe
// («Bookit habla como tu negocio»: cada rubro cambia la foto y el vocabulario). El ratón
// recorre los elementos uno por uno mientras el screencast graba.
//
//   PWCORE=… PWEXE=… node grabar-hover.cjs '<json>'
//   json: { url, salida, viewport:[w,h] (css), zoom (2), seccion (regex del titular),
//           items (cuerpo de función JS que recibe la sección `s` y devuelve los elementos en
//           orden), espera (s en cada uno), antes (s), almacen? ({clave: valor}) }
//
// Página ampliada a `zoom` como grabar-scroll.cjs. caja.json = la sección entera (en cuadros);
// se ajusta a mano si hay que dejar fuera la cabecera de la web.
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
  await ctx.addInitScript(({ z, almacen }) => {
    try { for (const [k, v] of Object.entries(almacen || {})) localStorage.setItem(k, v); } catch {}
    const poner = () => { document.documentElement.style.zoom = String(z); };
    if (document.documentElement) poner();
    document.addEventListener("DOMContentLoaded", poner);
  }, { z, almacen: C.almacen || {} });
  const p = await ctx.newPage();
  await p.goto(C.url, { waitUntil: "networkidle" });
  await wait(1500);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 700) { await p.evaluate((v) => window.scrollTo(0, v), y); await wait(90); }
  const n = await p.evaluate(({ re, cuerpo }) => {
    const r = new RegExp(re);
    const t = [...document.querySelectorAll("h1,h2,h3")].find((x) => r.test(x.innerText));
    if (!t) return 0;
    const s = t.closest("section") || t.parentElement;
    s.scrollIntoView({ block: "start" });
    const lista = new Function("s", cuerpo)(s);
    lista.forEach((e, i) => e.setAttribute("data-hover", String(i + 1)));
    return lista.length;
  }, { re: C.seccion, cuerpo: C.items });
  if (!n) { console.log("✗ no encontré los elementos"); await b.close(); process.exit(1); }
  await p.mouse.move(5, 5);
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
  await wait((C.antes || 1.2) * 1000);
  const marcas = [];
  for (let i = 1; i <= n; i++) {
    await p.locator(`[data-hover="${i}"]`).hover();
    marcas.push(cuadros.length ? cuadros[cuadros.length - 1].t : 0);
    await wait((C.espera || 2) * 1000);
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
  console.log("✓", lista.length, "cuadros · cada elemento (s):", marcas.map((t) => (t - t0).toFixed(2)).join(" "));
  await b.close();
})();
