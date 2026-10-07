// Piezas reales de vendiq.pe, con transparencia, para las propuestas de portada (2026-10-06).
// Alexander: «la portada de vendiq me gusta su estilo, pero quiero probar otras portadas,
// específicamente el gráfico derecho… unas 4».
//
//   PWCORE=… PWEXE=… node piezas-portada-vendiq.cjs <dir-salida>
//
//  · aviso-{venta,stock,boleta,envio}.png: la tarjeta «registrado» de cada paso de «Cómo
//    funciona» (se cambia de paso con el dock).
//  · flujo-{telefono,inventario,boleta}.png: las tres pantallas dibujadas de la portada, SIN su
//    perspectiva (se anula el transform del plano) para poder girarlas a gusto.
// Alfa: se oculta todo lo que no es el elemento ni sus ancestros, los ancestros pierden el
// fondo y la captura va con omitBackground.
const { chromium } = require(process.env.PWCORE);
const fs = require("fs");
const path = require("path");
const OUT = process.argv[2];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });

async function alfa(p, el, ruta) {
  await el.evaluate((e) => {
    for (const x of document.querySelectorAll("body *")) {
      if (x === e || x.contains(e) || e.contains(x)) continue;
      x.style.setProperty("visibility", "hidden", "important");
    }
    for (let a = e.parentElement; a; a = a.parentElement) {
      a.style.setProperty("background", "transparent", "important");
      a.style.setProperty("box-shadow", "none", "important");
    }
    document.documentElement.style.setProperty("background", "transparent", "important");
  });
  await wait(250);
  await el.screenshot({ path: ruta, omitBackground: true });
  await el.evaluate(() => {
    for (const x of document.querySelectorAll("[style*='visibility']")) x.style.removeProperty("visibility");
  });
}

(async () => {
  const b = await chromium.launch(process.env.PWEXE ? { executablePath: process.env.PWEXE } : {});
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 4, locale: "es-PE" });
  const p = await ctx.newPage();
  await p.goto("https://vendiq.pe", { waitUntil: "networkidle" });
  for (const t of ["Aceptar todas", "Solo esenciales"]) {
    const x = p.getByRole("button", { name: t, exact: true });
    if (await x.count()) { try { await x.first().click({ timeout: 1500 }); } catch {} break; }
  }
  await wait(2500);

  // ── Las tres pantallas del flujo, planas ──
  await p.evaluate(() => {
    const plano = document.querySelector("section [class*='perspective(170em)']");
    if (plano) plano.style.transform = "none";
  });
  await wait(400);
  const flujo = p.locator("section [class*='container-type:inline-size']").first();
  const piezas = await flujo.evaluate((f) => {
    const cajas = [...f.querySelectorAll("div")].filter((d) => {
      const r = d.getBoundingClientRect();
      return r.width > 120 && r.height > 120 && /Repuestos Lima|INVENTARIO|BOLETA/i.test(d.innerText);
    });
    // la más chica que contiene cada texto clave
    const elegir = (re) => cajas.filter((d) => re.test(d.innerText)).sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height)[0];
    const marcas = { telefono: elegir(/Comprar/), inventario: elegir(/INVENTARIO/i), boleta: elegir(/BOLETA DE VENTA/i) };
    for (const [k, e] of Object.entries(marcas)) if (e) e.setAttribute("data-pieza", k);
    return Object.keys(marcas).filter((k) => marcas[k]);
  });
  for (const k of piezas) {
    await alfa(p, p.locator(`[data-pieza="${k}"]`), path.join(OUT, `flujo-${k}.png`));
    console.log("✓ flujo", k);
  }

  // ── Los avisos de «Cómo funciona», paso por paso ──
  const sec = p.locator("section", { hasText: "Vendes una vez" }).first();
  await sec.scrollIntoViewIfNeeded();
  await wait(800);
  const pasos = [["venta", /VENTA/i], ["stock", /STOCK/i], ["boleta", /BOLETA/i], ["envio", /ENV[IÍ]O/i]];
  for (const [k, re] of pasos) {
    const boton = sec.getByRole("button", { name: re }).first();
    if (await boton.count()) await boton.click().catch(() => {});
    await wait(1100);
    const ok = await sec.evaluate((s) => {
      const c = [...s.querySelectorAll("div")].filter((d) => {
        const r = d.getBoundingClientRect();
        return r.width > 150 && r.width < 420 && r.height < 120 && /#1482|Pedido|registrad|actualizad|emitid|enviad|Boleta|Stock|Envío/i.test(d.innerText) && getComputedStyle(d).opacity !== "0";
      }).sort((a, b) => a.getBoundingClientRect().width - b.getBoundingClientRect().width);
      for (const x of s.querySelectorAll("[data-aviso]")) x.removeAttribute("data-aviso");
      const e = c.find((d) => d.getBoundingClientRect().top < s.querySelector(".vq-escena").getBoundingClientRect().top + 200);
      if (!e) return null;
      e.setAttribute("data-aviso", "1");
      return e.innerText.replace(/\s+/g, " ");
    });
    if (!ok) { console.log("✗ aviso", k); continue; }
    await alfa(p, sec.locator("[data-aviso='1']"), path.join(OUT, `aviso-${k}.png`));
    console.log("✓ aviso", k, ok);
  }
  await b.close();
})();
