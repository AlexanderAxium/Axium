// Vendiq al molde Pixelmatters (2026-10-06): capturas de vendiq.pe EN VIVO, solo lectura.
//
//   PWCORE=… PWEXE=… node capturar-vendiq-pm.cjs <dir-salida> [heroe] [modulos]
//
//  · heroe:   el flujo dibujado de la portada (tienda en el teléfono → inventario 18 → 17 →
//             boleta aceptada por SUNAT) CENTRADO y sin el titular: se ocultan la barra, el
//             anuncio y la columna de texto, y la rejilla pasa a una columna. La perspectiva
//             del flujo es la suya (rotateX 8°, rotateY −14°): no se toca. Salen
//             heroe-ancho.png (1,8:1) y heroe-cuadrado.png (1:1).
//  · modulos: las siete tarjetas del carrusel de módulos, cada una aislada a 3x
//             (position:fixed fuera del carrusel, que recorta las que no se ven).
//
//  · portada (2026-10-07, la portada de personas reales y la tienda Pulso): la PRIMERA PANTALLA
//             de vendiq.pe con movimiento reducido (la escena pinta su estado final, píldora de
//             la venta incluida), cabecera dentro y fuera lo fijo de abajo (WhatsApp, cookies):
//             portada-escritorio.png (1440×900 a 2x, la laptop) y portada-movil.png (390×873 a 3x
//             = 1170×2619, el hueco bajo la barra de estado de pantalla-celular-vendiq.html).
//             La tarea `heroe` es del flujo de la portada anterior y ya no encuentra nada.
//  · modulos, desde el carrusel angosto: las tarjetas son los hijos de la PRIMERA lista de la
//             sección (los dibujos también tienen `li`), la máscara del degradado se apaga y
//             cada una sale a 336 px de ancho con su alto (30 rem = 480 px).

const { chromium } = require(process.env.PWCORE);
const fs = require("fs");
const path = require("path");

const OUT = process.argv[2];
const TAREAS = process.argv.slice(3);
const hacer = (t) => TAREAS.length === 0 || TAREAS.includes(t);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });

async function abrir(b, vw, vh, dpr, extra = {}) {
  const ctx = await b.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: dpr, locale: "es-PE", ...extra });
  const p = await ctx.newPage();
  await p.goto("https://vendiq.pe", { waitUntil: "networkidle" });
  for (const t of ["Aceptar todas", "Solo esenciales", "Aceptar"]) {
    const x = p.getByRole("button", { name: t, exact: true });
    if (await x.count()) { try { await x.first().click({ timeout: 1500 }); await wait(300); } catch {} break; }
  }
  return { ctx, p };
}

(async () => {
  const b = await chromium.launch(process.env.PWEXE ? { executablePath: process.env.PWEXE } : {});

  if (hacer("heroe")) {
    for (const [nombre, vw, vh] of [["heroe-ancho", 1350, 750], ["heroe-cuadrado", 820, 820]]) {
      const { ctx, p } = await abrir(b, vw, vh, nombre === "heroe-ancho" ? 2.2 : 2);
      await p.evaluate(() => {
        for (const e of document.querySelectorAll("header, [role=dialog], nextjs-portal")) e.style.display = "none";
        // el aviso de cookies a veces no se cierra con el clic: se oculta el fijo que lo contiene
        for (const e of document.querySelectorAll("body *"))
          if (/^Usamos cookies/.test((e.innerText || "").trim()) && getComputedStyle(e).position === "fixed") e.style.display = "none";
        const s = document.querySelector("section");
        const anuncio = s.querySelector("a.portada-entrada");
        if (anuncio) anuncio.style.display = "none";
        const flujo = s.querySelector("[class*='container-type:inline-size']");
        const rejilla = flujo.closest(".grid");
        rejilla.style.gridTemplateColumns = "1fr";
        rejilla.style.marginTop = "0";
        rejilla.firstElementChild.style.display = "none";
        const caja = rejilla.parentElement;
        caja.style.paddingTop = "0";
        caja.style.paddingBottom = "0";
        s.style.minHeight = "100vh";
        s.style.display = "flex";
        s.style.alignItems = "center";
        caja.style.width = "100%";
      });
      await wait(2600); // la entrada (portada-entrada) dura ~1,7 s
      // El aviso de cookies y el botón de WhatsApp se montan tarde: fuera todo lo FIJO que no
      // sea parte de la portada
      await p.evaluate(() => {
        const s = document.querySelector("section");
        for (const e of document.querySelectorAll("body *"))
          if (!s.contains(e) && getComputedStyle(e).position === "fixed") e.style.display = "none";
      });
      await wait(200);
      const flujo = p.locator("section [class*='container-type:inline-size']").first();
      const r = await flujo.boundingBox();
      const cx = r.x + r.width / 2;
      const cy = r.y + r.height / 2;
      const clip = { x: Math.max(0, cx - vw / 2), y: Math.max(0, cy - vh / 2), width: vw, height: vh };
      await p.screenshot({ path: path.join(OUT, `${nombre}.png`), clip });
      console.log("✓", nombre, JSON.stringify({ flujo: r, clip }));
      await ctx.close();
    }
  }

  if (hacer("portada")) {
    for (const [nombre, vw, vh, dpr, movil] of [["portada-escritorio", 1440, 900, 2, false], ["portada-movil", 390, 873, 3, true]]) {
      const { ctx, p } = await abrir(b, vw, vh, dpr, { reducedMotion: "reduce", isMobile: movil, hasTouch: movil });
      await wait(2500);
      await p.evaluate(() => window.scrollTo(0, 0));
      // Lo fijo que no es la cabecera (WhatsApp, aviso de cookies) se monta tarde: fuera
      await p.evaluate(() => {
        for (const e of document.querySelectorAll("body *")) {
          if (getComputedStyle(e).position !== "fixed") continue;
          if (e.closest("header") || e.querySelector("header")) continue;
          e.style.display = "none";
        }
        for (const e of document.querySelectorAll("nextjs-portal")) e.style.display = "none";
      });
      await wait(400);
      await p.screenshot({ path: path.join(OUT, `${nombre}.png`) });
      console.log("✓", nombre);
      await ctx.close();
    }
  }

  if (hacer("modulos")) {
    const { ctx, p } = await abrir(b, 1440, 900, 3);
    const s = p.locator("section", { hasText: "Una sola cuenta para vender" }).first();
    await s.scrollIntoViewIfNeeded();
    await wait(800);
    const n = await s.evaluate((sec) => {
      const fila = sec.querySelector("ul");
      // la cabecera es fija y tapaba el borde de arriba de la tarjeta (a 40 px del borde)
      for (const h of document.querySelectorAll("header")) h.style.display = "none";
      fila.style.maskImage = "none";
      fila.style.webkitMaskImage = "none";
      const tarjetas = [...fila.children];
      tarjetas.forEach((e, i) => e.setAttribute("data-modulo", String(i + 1)));
      return tarjetas.length;
    });
    for (let i = 1; i <= n; i++) {
      const sel = `[data-modulo="${i}"]`;
      await p.evaluate((sel) => {
        for (const e of document.querySelectorAll("[data-modulo]")) e.style.cssText = "";
        const e = document.querySelector(sel);
        for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) a.style.transform = "none";
        e.style.cssText = "position:fixed;left:40px;top:40px;width:336px;z-index:2147483647";
      }, sel);
      await wait(350);
      await p.locator(sel).screenshot({ path: path.join(OUT, `modulo-${i}.png`) });
      const t = await p.locator(sel).innerText();
      console.log("✓ modulo", i, t.replace(/\s+/g, " ").slice(0, 50));
    }
    await ctx.close();
  }
  await b.close();
})();
