// Material real de Rematch para la ficha «modelo Pixelmatters» (2026-10-06).
// Capturas fijas (viewports móviles a 3x, componentes sueltos a 3x) y SECUENCIAS
// de fotogramas para los vídeos en bucle: el vídeo de una ficha sale de capturar la
// web en vivo cuadro a cuadro, no de grabar pantalla (Playwright graba en VP8 a
// poca tasa y se ve borroso; una captura por cuadro sale nítida y determinista).
//
// Uso: PWCORE=/ruta/playwright-core node capturar-rematch-pm.cjs <dirSalida> [tarea…]
// Tareas: moviles · componentes · agenda · web-scroll · live-scroll  (todas si no se dice)
//
// Reglas que esto respeta (ver ESTANDAR-FICHA.md y la memoria higgsfield-y-saas-propios):
//  · Solo superficies del PROPIO Rematch: rematch.pe y live.rematch.pe. El directorio de
//    clubes de live («Dónde jugar») lleva nombres de inquilinos: el scroll se para antes.
//  · Viewport real, no recorte de fullPage: la cabecera de rematch.pe es position:fixed y
//    el fullPage la pierde (CASO-REMATCH.md § 12).
//  · Solo lectura: no se envía ni un formulario.
const { chromium } = require(process.env.PWCORE);
const fs = require("fs");
const path = require("path");

const OUT = process.argv[2];
const TAREAS = process.argv.slice(3);
const hacer = (t) => TAREAS.length === 0 || TAREAS.includes(t);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const mk = (d) => fs.mkdirSync(d, { recursive: true });

const UA_MOB =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const UA_DESK =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36";

async function aceptarCookies(p) {
  for (const t of ["Aceptar", "Solo necesarias"]) {
    const b = p.getByRole("button", { name: t, exact: true });
    if (await b.count()) {
      try {
        await b.first().click({ timeout: 2000 });
        await wait(400);
        return;
      } catch {}
    }
  }
}

async function recorrer(p, paso = 450) {
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += paso) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await wait(130);
  }
  await p.evaluate(() => window.scrollTo(0, 0));
  await wait(1200);
}

async function esperarAgendaCompleta(p) {
  // La agenda del hero de rematch.pe se va llenando sola hasta «5 reservas».
  try {
    await p.waitForFunction(() => /5 reservas/.test(document.body.innerText), null, {
      timeout: 15000,
    });
  } catch {}
  await wait(900);
}

// Marca con data-pm el elemento más chico que contiene el texto y cumple el ancho.
async function marcar(p, marca, { texto, min = 120, max = 2000, tag = "*" }) {
  return p.evaluate(
    ({ marca, texto, min, max, tag }) => {
      const re = new RegExp(texto);
      const c = [...document.querySelectorAll(tag)].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width >= min && r.width <= max && r.height > 10 && re.test(e.innerText || "");
      });
      c.sort((a, b) => {
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        return ra.width * ra.height - rb.width * rb.height;
      });
      if (!c.length) return null;
      c[0].setAttribute("data-pm", marca);
      const r = c[0].getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    },
    { marca, texto, min, max, tag },
  );
}

// pad > 0: recorte con margen alrededor (las etiquetas que sobresalen del borde,
// como «El más elegido» en la tarjeta de precio, se cortaban con la captura justa)
async function elemento(p, marca, archivo, pad = 0) {
  const l = p.locator(`[data-pm="${marca}"]`).first();
  await l.scrollIntoViewIfNeeded();
  await wait(500);
  if (!pad) {
    await l.screenshot({ path: archivo, animations: "disabled" });
  } else {
    const r = await l.boundingBox();
    await p.screenshot({
      path: archivo,
      animations: "disabled",
      clip: { x: r.x - pad, y: r.y - pad, width: r.width + 2 * pad, height: r.height + 2 * pad },
    });
  }
  console.log("✓", path.basename(archivo));
}

(async () => {
  const b = await chromium.launch(
    process.env.PWEXE ? { executablePath: process.env.PWEXE } : {},
  );

  // ── 1 · Viewports móviles a 3x (390×794: el alto de pantalla bajo la barra de estado)
  if (hacer("moviles")) {
    const d = path.join(OUT, "moviles");
    mk(d);
    const ctx = await b.newContext({
      viewport: { width: 390, height: 794 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      userAgent: UA_MOB,
      locale: "es-PE",
    });
    const p = await ctx.newPage();

    await p.goto("https://live.rematch.pe", { waitUntil: "networkidle" });
    await aceptarCookies(p);
    await recorrer(p);
    await p.screenshot({ path: path.join(d, "live-inicio.png") });
    console.log("✓ live-inicio.png");
    await p.evaluate(() => {
      const s = [...document.querySelectorAll("section")].find((e) =>
        /^Cómo quieres jugar/.test(e.innerText.trim()),
      );
      if (s) window.scrollTo(0, s.getBoundingClientRect().top + scrollY - 72);
    });
    await wait(900);
    await p.screenshot({ path: path.join(d, "live-como.png") });
    console.log("✓ live-como.png");

    await p.goto("https://live.rematch.pe/torneos", { waitUntil: "networkidle" });
    await recorrer(p);
    await p.screenshot({ path: path.join(d, "live-torneos.png") });
    console.log("✓ live-torneos.png");

    await p.goto("https://rematch.pe", { waitUntil: "networkidle" });
    await aceptarCookies(p);
    await recorrer(p);
    await esperarAgendaCompleta(p);
    await p.screenshot({ path: path.join(d, "web-inicio.png") });
    console.log("✓ web-inicio.png");

    await p.goto("https://rematch.pe/precios", { waitUntil: "networkidle" });
    await recorrer(p);
    await p.screenshot({ path: path.join(d, "web-precios.png") });
    console.log("✓ web-precios.png");
    await ctx.close();
  }

  // ── 2 · Componentes sueltos a 3x, para la hoja de sistema y las tarjetas flotantes
  if (hacer("componentes")) {
    const d = path.join(OUT, "componentes");
    mk(d);
    const ctx = await b.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 3,
      userAgent: UA_DESK,
      locale: "es-PE",
    });
    const p = await ctx.newPage();
    await p.goto("https://rematch.pe", { waitUntil: "networkidle" });
    await aceptarCookies(p);
    await recorrer(p);
    await esperarAgendaCompleta(p);
    const piezas = [
      ["pildora", { texto: "^Nuevo: ligas", min: 120, max: 520 }],
      ["cta-demo", { texto: "^Quiero una demo$", min: 100, max: 320, tag: "a,button" }],
      ["cta-ventas", { texto: "^Hablar con ventas$", min: 100, max: 320, tag: "a,button" }],
    ];
    for (const [m, o] of piezas) {
      const r = await marcar(p, m, o);
      if (r) await elemento(p, m, path.join(d, `${m}.png`));
      else console.log("✗ no encontrado:", m);
    }

    await p.goto("https://rematch.pe/precios", { waitUntil: "networkidle" });
    await recorrer(p);
    for (const [m, o] of [
      ["precio-profesional", { texto: "^El más elegido[\\s\\S]*Profesional", min: 220, max: 420 }],
      ["precio-basico", { texto: "^Básico", min: 220, max: 420 }],
      ["conmutador", { texto: "^Mensual[\\s\\S]*Anual", min: 160, max: 520 }],
    ]) {
      const r = await marcar(p, m, o);
      if (r) await elemento(p, m, path.join(d, `${m}.png`), m.startsWith("precio") ? 22 : 0);
      else console.log("✗ no encontrado:", m);
    }

    await p.goto("https://live.rematch.pe", { waitUntil: "networkidle" });
    await aceptarCookies(p);
    await recorrer(p);
    for (const [m, o] of [
      ["buscador", { texto: "Buscar", min: 380, max: 900, tag: "form,div" }],
      ["torneo-tarjeta", { texto: "Selectivo Nacional", min: 240, max: 460, tag: "a,article,div" }],
      ["deportes", { texto: "^Tenis de mesa[\\s\\S]*Pádel", min: 400, max: 1400, tag: "div,ul" }],
    ]) {
      const r = await marcar(p, m, o);
      if (r) await elemento(p, m, path.join(d, `${m}.png`));
      else console.log("✗ no encontrado:", m);
    }
    await ctx.close();
  }

  // ── 3 · La agenda llenándose sola (rematch.pe, hero)
  // Va con el SCREENCAST de Chrome (CDP), no con una captura por cuadro: la agenda la
  // mueven timers de JS y motion/react en tiempo real, y una captura tarda 150–250 ms,
  // así que saldrían 5 cuadros por segundo a saltos. El screencast entrega cada cuadro
  // pintado con su marca de tiempo; el vídeo se arma con esas duraciones reales.
  if (hacer("agenda")) {
    const d = path.join(OUT, "agenda-anim");
    fs.rmSync(d, { recursive: true, force: true });
    mk(d);
    const ctx = await b.newContext({
      viewport: { width: 2000, height: 1400 },
      deviceScaleFactor: 1,
      userAgent: UA_DESK,
      locale: "es-PE",
    });
    const p = await ctx.newPage();
    // Consentimiento dado antes, para que el banner no tape nada durante la toma
    await p.goto("https://rematch.pe", { waitUntil: "networkidle" });
    await aceptarCookies(p);
    const cdp = await ctx.newCDPSession(p);
    const cuadros = [];
    cdp.on("Page.screencastFrame", async (f) => {
      cuadros.push({ t: f.metadata.timestamp, data: f.data });
      try {
        await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId });
      } catch {}
    });
    await p.reload({ waitUntil: "domcontentloaded" });
    // La ilustración entera del hero (agenda del club + celular del jugador) con
    // zoom: 2 SOLO en ella. El screencast del headless shell entrega a 1x aunque el
    // contexto sea 2x (y maxWidth no lo cambia); con zoom el texto se pinta al doble de
    // verdad, no se reescala, y la animación sigue igual. El resto de la página se oculta.
    let caja = null;
    for (let i = 0; i < 60 && !caja; i++) {
      caja = await p.evaluate(() => {
        const c = [...document.querySelectorAll("div")]
          .filter((e) => {
            const r = e.getBoundingClientRect();
            const t = (e.innerText || "").trim();
            return r.width > 400 && r.width < 800 && /^Agenda de hoy/.test(t) && /17:00/.test(t);
          })
          .sort((a, b) => a.getBoundingClientRect().height - b.getBoundingClientRect().height)[0];
        if (!c) return null;
        const w = c.getBoundingClientRect().width;
        for (const e of document.querySelectorAll("body *")) {
          if (e === c || e.contains(c) || c.contains(e)) continue;
          e.style.visibility = "hidden";
        }
        for (let a = c.parentElement; a && a !== document.body; a = a.parentElement) {
          a.style.transform = "none";
          a.style.filter = "none";
        }
        c.style.cssText += `;position:fixed;left:20px;top:20px;width:${w}px;zoom:3;z-index:2147483647;margin:0`;
        return { ok: true };
      });
      if (!caja) await wait(50);
    }
    await wait(150);
    await cdp.send("Page.startScreencast", {
      format: "jpeg",
      quality: 95,
      everyNthFrame: 1,
      maxWidth: 2000,
      maxHeight: 1400,
    });
    await wait(9500);
    await cdp.send("Page.stopScreencast");
    caja = await p.evaluate(() => {
      const c = [...document.querySelectorAll("div")].find((e) => e.style.zoom === "3");
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (const e of [c, ...c.querySelectorAll("*")]) {
        const r = e.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top);
        x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom);
      }
      return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    });
    const pad = 24;
    fs.writeFileSync(
      path.join(d, "caja.json"),
      JSON.stringify({ ...caja, pad, escala: 1, nota: "zoom 3 en el elemento; cuadros a 1x" }, null, 1),
    );
    const lista = [];
    cuadros.forEach((c, i) => {
      const f = `f${String(i).padStart(4, "0")}.jpg`;
      fs.writeFileSync(path.join(d, f), Buffer.from(c.data, "base64"));
      lista.push({ f, t: c.t });
    });
    fs.writeFileSync(path.join(d, "cuadros.json"), JSON.stringify(lista));
    console.log("✓ agenda-anim", lista.length, "cuadros", JSON.stringify(caja));
    await ctx.close();
  }

  // ── 4 · rematch.pe en escritorio, bajando por la portada y el panel (vídeo de navegador)
  if (hacer("web-scroll")) {
    const d = path.join(OUT, "web-scroll");
    mk(d);
    const ctx = await b.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1.5,
      userAgent: UA_DESK,
      locale: "es-PE",
    });
    const p = await ctx.newPage();
    await p.goto("https://rematch.pe", { waitUntil: "networkidle" });
    await aceptarCookies(p);
    await recorrer(p);
    await esperarAgendaCompleta(p);
    const marcas = await p.evaluate(() => {
      const s = [...document.querySelectorAll("section")];
      const top = (re) => {
        const e = s.find((x) => re.test(x.innerText.trim()));
        return e ? Math.round(e.getBoundingClientRect().top + scrollY) : null;
      };
      return { panel: top(/^Todo tu club/), pasos: top(/^Cómo empezar/) };
    });
    // Ruta: portada → panel → tres pasos, con aceleración suave y paradas
    const tramos = [
      [0, 0, 36],
      [0, marcas.panel ?? 886, 66],
      [marcas.panel ?? 886, marcas.panel ?? 886, 42],
      [marcas.panel ?? 886, marcas.pasos ?? 1851, 66],
      [marcas.pasos ?? 1851, marcas.pasos ?? 1851, 36],
    ];
    const suave = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
    let n = 0;
    for (const [a, z, cuadros] of tramos) {
      for (let i = 0; i < cuadros; i++) {
        const y = Math.round(a + (z - a) * suave(cuadros === 1 ? 1 : i / (cuadros - 1)));
        await p.evaluate((v) => window.scrollTo(0, v), y);
        await wait(70);
        await p.screenshot({
          path: path.join(d, `f${String(n).padStart(4, "0")}.jpg`),
          type: "jpeg",
          quality: 92,
        });
        n++;
      }
    }
    console.log("✓ web-scroll", n, "cuadros", JSON.stringify(marcas));
    await ctx.close();
  }

  // ── 5 · live.rematch.pe en el celular, bajando hasta antes del directorio de clubes
  if (hacer("live-scroll")) {
    const d = path.join(OUT, "live-scroll");
    mk(d);
    const ctx = await b.newContext({
      viewport: { width: 390, height: 794 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent: UA_MOB,
      locale: "es-PE",
    });
    const p = await ctx.newPage();
    await p.goto("https://live.rematch.pe", { waitUntil: "networkidle" });
    await aceptarCookies(p);
    await recorrer(p);
    const lim = await p.evaluate(() => {
      const s = [...document.querySelectorAll("section")].find((e) =>
        /^Dónde jugar/.test(e.innerText.trim()),
      );
      const deportes = [...document.querySelectorAll("section")].find((e) =>
        /^Encuentra tu deporte/.test(e.innerText.trim()),
      );
      return {
        donde: s ? Math.round(s.getBoundingClientRect().top + scrollY) : 2894,
        deportes: deportes ? Math.round(deportes.getBoundingClientRect().top + scrollY) : 1356,
      };
    });
    // El borde inferior del viewport nunca pasa del inicio de «Dónde jugar»
    const fin = lim.donde - 794 - 8;
    const medio = Math.min(lim.deportes - 64, fin);
    const tramos = [
      [0, 0, 30],
      [0, medio, 60],
      [medio, medio, 36],
      [medio, fin, 60],
      [fin, fin, 36],
    ];
    const suave = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
    let n = 0;
    for (const [a, z, cuadros] of tramos) {
      for (let i = 0; i < cuadros; i++) {
        const y = Math.round(a + (z - a) * suave(cuadros === 1 ? 1 : i / (cuadros - 1)));
        await p.evaluate((v) => window.scrollTo(0, v), y);
        await wait(70);
        await p.screenshot({
          path: path.join(d, `f${String(n).padStart(4, "0")}.jpg`),
          type: "jpeg",
          quality: 92,
        });
        n++;
      }
    }
    console.log("✓ live-scroll", n, "cuadros", JSON.stringify(lim));
    await ctx.close();
  }

  // ── 6 · rematch.pe en el celular: portada → panel → tres pasos (vídeo sobre foto)
  if (hacer("web-movil-scroll")) {
    const d = path.join(OUT, "web-movil-scroll");
    fs.rmSync(d, { recursive: true, force: true });
    mk(d);
    const ctx = await b.newContext({
      viewport: { width: 390, height: 794 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent: UA_MOB,
      locale: "es-PE",
    });
    const p = await ctx.newPage();
    await p.goto("https://rematch.pe", { waitUntil: "networkidle" });
    await aceptarCookies(p);
    await recorrer(p);
    await esperarAgendaCompleta(p);
    const m = await p.evaluate(() => {
      const s = [...document.querySelectorAll("section")];
      const top = (re) => {
        const e = s.find((x) => re.test(x.innerText.trim()));
        return e ? Math.round(e.getBoundingClientRect().top + scrollY) : null;
      };
      return { panel: top(/^Todo tu club/), pasos: top(/^Cómo empezar/) };
    });
    const agenda = 300; // la agenda de la portada a la vista
    const tramos = [
      [0, 0, 30],
      [0, agenda, 45],
      [agenda, agenda, 36],
      [agenda, m.panel, 60],
      [m.panel, m.panel, 42],
      [m.panel, m.pasos, 60],
      [m.pasos, m.pasos, 36],
    ];
    const suave = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
    let n = 0;
    for (const [a, z, cuadros] of tramos) {
      for (let i = 0; i < cuadros; i++) {
        const y = Math.round(a + (z - a) * suave(cuadros === 1 ? 1 : i / (cuadros - 1)));
        await p.evaluate((v) => window.scrollTo(0, v), y);
        await wait(70);
        await p.screenshot({
          path: path.join(d, `f${String(n).padStart(4, "0")}.jpg`),
          type: "jpeg",
          quality: 92,
        });
        n++;
      }
    }
    console.log("✓ web-movil-scroll", n, "cuadros", JSON.stringify(m));
    await ctx.close();
  }

  // ── 7 · Otras pantallas móviles y el menú «Producto» con sus iconos de vidrio
  if (hacer("extras")) {
    const d = path.join(OUT, "moviles");
    mk(d);
    const ctx = await b.newContext({
      viewport: { width: 390, height: 794 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      userAgent: UA_MOB,
      locale: "es-PE",
    });
    const p = await ctx.newPage();
    await p.goto("https://rematch.pe/producto/competicion", { waitUntil: "networkidle" });
    await aceptarCookies(p);
    await recorrer(p);
    await p.screenshot({ path: path.join(d, "web-competicion.png") });
    console.log("✓ web-competicion.png");
    await ctx.close();

    const dc = path.join(OUT, "componentes");
    const c2 = await b.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 3,
      userAgent: UA_DESK,
      locale: "es-PE",
    });
    const q = await c2.newPage();
    await q.goto("https://rematch.pe", { waitUntil: "networkidle" });
    await aceptarCookies(q);
    const boton = q.getByRole("button", { name: /^Producto/ }).first();
    try {
      await boton.hover();
      await wait(300);
      await boton.click();
    } catch {}
    await wait(900);
    const r = await q.evaluate(() => {
      // El panel desplegable más grande que aparece bajo la cabecera
      const c = [...document.querySelectorAll("div, nav, ul")]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.top > 40 && r.top < 140 && r.width > 300 && r.height > 120 && r.height < 700;
        })
        .sort((a, b) => b.getBoundingClientRect().width * b.getBoundingClientRect().height - a.getBoundingClientRect().width * a.getBoundingClientRect().height)[0];
      if (!c) return null;
      c.setAttribute("data-pm", "menu");
      const r = c.getBoundingClientRect();
      return { w: r.width, h: r.height };
    });
    if (r) await elemento(q, "menu", path.join(dc, "menu-producto.png"), 12);
    else console.log("✗ no se abrió el menú Producto");
    await c2.close();
  }

  // ── 8 · Componentes AISLADOS, con fondo transparente
  // La captura de un elemento suelto se lleva lo que hay detrás de sus esquinas
  // redondeadas (el negro del hero, el gris de la página): en la hoja de componentes
  // se veían esquinas sucias (Alexander, 2026-10-06: «parece más problema de recortes
  // tuyos que de la web»). Aquí se oculta todo lo que no es el elemento, sus ancestros
  // y sus hijos; los ancestros quedan transparentes y se captura con omitBackground.
  // El recorte es la unión de los rectángulos del elemento y sus hijos (la etiqueta
  // «El más elegido» sobresale de la tarjeta) más un margen para su sombra.
  if (hacer("componentes-alfa")) {
    const d = path.join(OUT, "componentes-alfa");
    mk(d);
    const ctx = await b.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 3,
      userAgent: UA_DESK,
      locale: "es-PE",
    });
    const p = await ctx.newPage();
    const aislar = async (marca, archivo, margen = 24) => {
      const caja = await p.evaluate(
        ({ marca, margen }) => {
          const c = document.querySelector(`[data-pm="${marca}"]`);
          if (!c) return null;
          c.scrollIntoView({ block: "center" });
          for (const e of document.querySelectorAll("body *")) {
            if (e === c || c.contains(e)) continue;
            if (e.contains(c)) {
              e.style.background = "transparent";
              e.style.boxShadow = "none";
              e.style.backdropFilter = "none";
              continue;
            }
            e.style.visibility = "hidden";
          }
          document.documentElement.style.background = "transparent";
          document.body.style.background = "transparent";
          let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
          for (const e of [c, ...c.querySelectorAll("*")]) {
            const r = e.getBoundingClientRect();
            if (!r.width || !r.height) continue;
            x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top);
            x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom);
          }
          return { x: x0 - margen, y: y0 - margen, width: x1 - x0 + 2 * margen, height: y1 - y0 + 2 * margen };
        },
        { marca, margen },
      );
      if (!caja) return console.log("✗ no encontrado:", marca);
      await wait(400);
      await p.screenshot({ path: archivo, clip: caja, omitBackground: true, animations: "disabled" });
      console.log("✓", path.basename(archivo));
    };
    const pieza = async (url, marca, opciones, margen) => {
      await p.goto(url, { waitUntil: "networkidle" });
      await aceptarCookies(p);
      await recorrer(p);
      if (url === "https://rematch.pe") await esperarAgendaCompleta(p);
      const r = await marcar(p, marca, opciones);
      if (r) await aislar(marca, path.join(d, `${marca}.png`), margen);
      else console.log("✗ no encontrado:", marca);
    };
    await pieza("https://rematch.pe", "pildora", { texto: "^Nuevo: ligas", min: 120, max: 520 });
    await pieza("https://rematch.pe", "cta-demo", { texto: "^Quiero una demo$", min: 100, max: 320, tag: "a,button" });
    await pieza("https://rematch.pe", "cta-ventas", { texto: "^Hablar con ventas$", min: 100, max: 320, tag: "a,button" });
    await pieza("https://rematch.pe", "reserva-nueva", { texto: "^Diego S\\.\\s*Nueva", min: 60, max: 260 });
    await pieza("https://rematch.pe", "reserva-pagada", { texto: "^Rodrigo M\\.\\s*Pagada", min: 60, max: 260 });
    await pieza("https://rematch.pe", "horarios", { texto: "^17:00\\s*18:00\\s*19:00\\s*20:00\\s*21:00\\s*22:00$", min: 120, max: 400 });
    await pieza("https://rematch.pe/precios", "conmutador", { texto: "^Mensual[\\s\\S]*Anual", min: 160, max: 520 });
    await pieza("https://rematch.pe/precios", "precio-profesional", { texto: "^El más elegido[\\s\\S]*Profesional", min: 220, max: 420 }, 40);
    await pieza("https://live.rematch.pe", "buscador", { texto: "Buscar", min: 380, max: 900, tag: "form,div" });
    await pieza("https://live.rematch.pe", "torneo-tarjeta", { texto: "Selectivo Nacional", min: 240, max: 460, tag: "a,article,div" }, 40);
    await ctx.close();
  }

  await b.close();
})();
