// Las tiendas que venden con Vendiq, EN VIVO (2026-10-06), para sus mockups.
// Alexander: «me gusta vendiq pero siento que le faltan unos mockups y tal vez dar un poco más
// de prioridad a sus tiendas creadas, añade happyart.com.pe».
//
//   PWCORE=… PWEXE=… node capturar-tiendas-vendiq.cjs <dir-salida> [slug…]
//
// Por tienda salen <slug>-d.png (escritorio, 2400×1350 = la pantalla del monitor construido)
// y <slug>-m.png (celular, 1170×2382: la pantalla del movil-v-820 MENOS la barra de estado,
// que se dibuja aparte para no duplicar la isla del marco).
// Limpieza: aviso de cookies, popups y botones flotantes fuera (no son la tienda); la
// cabecera se queda. Solo lectura: no se toca carrito ni formulario.
const { chromium, devices } = require(process.env.PWCORE);
const fs = require("fs");
const path = require("path");

const OUT = process.argv[2];
const SOLO = process.argv.slice(3);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });

const TIENDAS = [
  ["aurore", "https://aurore.com.pe"],
  ["anj-sports", "https://anjsports.com"],
  ["sportt", "https://sporttperu.com"],
  ["daesur-motors", "https://daesurmotors.com"],
  // La primera diapositiva de Clefast es un VÍDEO; Alexander: «en clefast usa caps de la
  // imagen, o sea el segundo slide, no del video». Se salta a la 2 y se pausa el carrusel.
  ["clefast", "https://clefast.com.pe", async (p) => {
    await p.getByRole("button", { name: "Ir a la diapositiva 2" }).first().click({ timeout: 4000 });
    const pausa = p.getByRole("button", { name: "Pausar" });
    if (await pausa.count()) await pausa.first().click({ timeout: 2000 }).catch(() => {});
    await wait(2200);
  }],
  ["happy-art", "https://happyart.com.pe"],
];

async function limpiar(p) {
  for (const t of ["Aceptar todas", "Aceptar todo", "Aceptar", "Accept all", "Accept", "Entendido", "De acuerdo", "OK"]) {
    const b = p.getByRole("button", { name: t, exact: true });
    if (await b.count()) { try { await b.first().click({ timeout: 1200 }); await wait(300); } catch {} }
  }
  await p.keyboard.press("Escape").catch(() => {});
  await p.evaluate(() => {
    const vh = innerHeight;
    for (const e of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(e);
      if (cs.position !== "fixed" && cs.position !== "sticky") continue;
      // un contenedor fijo puede medir 0 y pintar a sus hijos (el WhatsApp de Happy Art):
      // se mide la unión de lo que pinta
      let r = e.getBoundingClientRect();
      if (!r.width || !r.height) {
        let t = 1e9, l = 1e9, bo = -1e9, ri = -1e9;
        for (const h of e.querySelectorAll("*")) {
          const q = h.getBoundingClientRect();
          if (!q.width || !q.height) continue;
          t = Math.min(t, q.top); l = Math.min(l, q.left); bo = Math.max(bo, q.bottom); ri = Math.max(ri, q.right);
        }
        if (bo < 0) continue;
        r = { top: t, left: l, width: ri - l, height: bo - t };
      }
      const esCabecera = r.top <= 4 && r.height < vh * 0.25 && /header|nav/i.test(e.tagName + " " + e.className + " " + (e.getAttribute("role") || ""));
      if (esCabecera) continue;
      // lo flotante abajo (cookies, WhatsApp, chat) y lo que tapa media pantalla (popups)
      if (r.top > vh * 0.45 || r.width * r.height > innerWidth * vh * 0.3 || r.height < 140) e.style.setProperty("display", "none", "important");
    }
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  });
}

async function recorrer(p) {
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < Math.min(H, 4000); y += 600) { await p.evaluate((v) => window.scrollTo(0, v), y); await wait(150); }
  await p.evaluate(() => window.scrollTo(0, 0));
  await wait(1800);
}

(async () => {
  const b = await chromium.launch(process.env.PWEXE ? { executablePath: process.env.PWEXE } : {});
  for (const [slug, url, antes] of TIENDAS) {
    if (SOLO.length && !SOLO.includes(slug)) continue;
    for (const modo of ["d", "m"]) {
      const ctx = modo === "d"
        ? await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.5, locale: "es-PE" })
        : await b.newContext({ ...devices["iPhone 13"], viewport: { width: 390, height: 794 }, deviceScaleFactor: 3, locale: "es-PE" });
      const p = await ctx.newPage();
      try {
        await p.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      } catch {
        await wait(3000);
      }
      await wait(1500);
      await limpiar(p);
      await recorrer(p);
      await limpiar(p);
      if (antes) await antes(p);
      const ruta = path.join(OUT, `${slug}-${modo}.png`);
      await p.screenshot({ path: ruta });
      const arriba = await p.evaluate(() => {
        // color de la franja superior, para la barra de estado del celular
        const e = document.elementFromPoint(innerWidth / 2, 2);
        let x = e;
        while (x && getComputedStyle(x).backgroundColor.match(/rgba\(0, 0, 0, 0\)|transparent/)) x = x.parentElement;
        return x ? getComputedStyle(x).backgroundColor : getComputedStyle(document.body).backgroundColor;
      });
      fs.writeFileSync(path.join(OUT, `${slug}-${modo}.json`), JSON.stringify({ url, arriba }));
      console.log("✓", slug, modo, arriba);
      await ctx.close();
    }
  }
  await b.close();
})();
