// Graba la animación REAL de un componente de una web, grande y nítida (2026-10-06).
// Es la «micro-interacción en macro» de Significa Dia: un componente ocupando el cuadro
// mientras hace lo suyo. Generaliza lo que se hizo con la agenda de rematch.pe.
//
//   PWCORE=… PWEXE=… node grabar-micro.cjs '<json>'
//   json: { url, salida, texto (regex del contenedor), min, max (ancho css), zoom (2–3),
//           segundos, viewport:[w,h], ocultar? (regex de texto a ocultar dentro), cookies?,
//           margen? (px css hasta el borde, 20 por defecto: más si algo del componente se sale
//           por arriba o a la izquierda, como los anillos del hero de vendiq.pe),
//           subir? (niveles a subir desde lo encontrado: si el texto vive en una capa
//           `absolute inset-0`, se queda con ella, que al fijarla mide todo el alto y deja
//           fuera la foto de al lado; «Cómo funciona» de vendiq.pe pide 2) }
// caja.json lleva además `propia`: el rectángulo del contenedor solo. La unión de los hijos
// se infla con lo que gira (un cuadrado rotado mide hasta 1,41 veces su lado).
//
// ⚠️ El screencast del headless shell sale a 1x aunque el contexto sea 2x: por eso el
// componente se agranda con `zoom` (se pinta al doble de verdad) y lo demás se oculta.
// Salen f0000.jpg…, cuadros.json (marca de tiempo de cada cuadro) y caja.json (recorte).
const { chromium } = require(process.env.PWCORE);
const fs = require("fs");
const path = require("path");
const C = JSON.parse(process.argv[2]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(process.env.PWEXE ? { executablePath: process.env.PWEXE } : {});
  const [vw, vh] = C.viewport || [2000, 1400];
  const ctx = await b.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1, locale: "es-PE" });
  const p = await ctx.newPage();
  await p.goto(C.url, { waitUntil: "networkidle" });
  for (const t of ["Aceptar", "Solo necesarias", "Accept"]) {
    const x = p.getByRole("button", { name: t, exact: true });
    if (await x.count()) { try { await x.first().click({ timeout: 1500 }); await wait(300); } catch {} break; }
  }
  // Recorrer la página para que todo esté montado (las ilustraciones suelen entrar al verse)
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 500) { await p.evaluate((v) => window.scrollTo(0, v), y); await wait(100); }
  const ok = await p.evaluate(({ texto, min, max, zoom, ocultar, margen, subir }) => {
    const re = new RegExp(texto);
    let c = [...document.querySelectorAll("div,section,article,figure,ol,ul")]
      .filter((e) => { const r = e.getBoundingClientRect(); return r.width >= min && r.width <= max && re.test(e.innerText || ""); })
      .sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height)[0];
    if (!c) return false;
    for (let k = 0; k < subir && c.parentElement; k++) c = c.parentElement;
    c.scrollIntoView({ block: "center" });
    const w = c.getBoundingClientRect().width;
    for (const e of document.querySelectorAll("body *")) {
      if (e === c || e.contains(c) || c.contains(e)) continue;
      e.style.visibility = "hidden";
    }
    if (ocultar) for (const e of c.querySelectorAll("*")) if (new RegExp(ocultar).test(e.innerText || "") && e.children.length === 0) e.style.visibility = "hidden";
    for (let a = c.parentElement; a && a !== document.body; a = a.parentElement) { a.style.transform = "none"; a.style.filter = "none"; }
    c.setAttribute("data-micro", "1");
    c.style.cssText += `;position:fixed;left:${margen}px;top:${margen}px;width:${w}px;zoom:${zoom};z-index:2147483647;margin:0`;
    return true;
  }, { texto: C.texto, min: C.min || 200, max: C.max || 1400, zoom: C.zoom || 2, ocultar: C.ocultar || null, margen: C.margen || 20, subir: C.subir || 0 });
  if (!ok) { console.log("✗ no se encontró el contenedor"); await b.close(); process.exit(1); }
  await wait(400);
  fs.rmSync(C.salida, { recursive: true, force: true });
  fs.mkdirSync(C.salida, { recursive: true });
  const cdp = await ctx.newCDPSession(p);
  const cuadros = [];
  cdp.on("Page.screencastFrame", async (f) => {
    cuadros.push({ t: f.metadata.timestamp, data: f.data });
    try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch {}
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 95, everyNthFrame: 1, maxWidth: vw, maxHeight: vh });
  // `reiniciar`: una animación de ENTRADA (el hero de vendiq.pe) ya terminó cuando se aísla el
  // componente. Se vuelven a poner en cero todas las del contenedor, con sus retrasos.
  if (C.reiniciar) {
    await wait(600);
    await p.evaluate(() => {
      for (const a of document.querySelector('[data-micro="1"]').getAnimations({ subtree: true })) { a.cancel(); a.play(); }
    });
  }
  await wait((C.segundos || 10) * 1000);
  await cdp.send("Page.stopScreencast");
  const caja = await p.evaluate(() => {
    const c = document.querySelector('[data-micro="1"]');
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const e of [c, ...c.querySelectorAll("*")]) {
      const r = e.getBoundingClientRect();
      if (!r.width || !r.height || getComputedStyle(e).visibility === "hidden") continue;
      x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom);
    }
    const r = c.getBoundingClientRect();
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, fondo: getComputedStyle(document.body).backgroundColor, propia: { x: r.left, y: r.top, w: r.width, h: r.height } };
  });
  const lista = cuadros.map((c, i) => {
    const f = `f${String(i).padStart(4, "0")}.jpg`;
    fs.writeFileSync(path.join(C.salida, f), Buffer.from(c.data, "base64"));
    return { f, t: c.t };
  });
  fs.writeFileSync(path.join(C.salida, "cuadros.json"), JSON.stringify(lista));
  fs.writeFileSync(path.join(C.salida, "caja.json"), JSON.stringify({ ...caja, pad: 24 }, null, 1));
  console.log("✓", lista.length, "cuadros", JSON.stringify(caja));
  await b.close();
})();
