// La portada cuadrada de la tarjeta de Vendiq en el portafolio (vendiq-portada-marca), rehecha
// el 2026-10-07 con la tienda de ejemplo de la portada nueva de vendiq.pe (Pulso). La anterior
// llevaba los dibujos de los módulos de cuando la tienda era Repuestos Lima (casco, guantes,
// kit de cadena), y Alexander pidió «actualiza el portafolio» al publicar la portada nueva.
//
//   PWCORE=… PWEXE=… node portada-marca-vendiq.cjs <dir-taller> <salida.jpg>
//
//  1. Piezas REALES de vendiq.pe en vivo, con transparencia, a 5x: el logotipo de la cabecera
//     (el texto pasado a tinta: en la web es blanco) y tres dibujos de las tarjetas de módulos
//     (caja, factura y stock por sede). Se oculta todo lo que no es la pieza ni sus ancestros,
//     los ancestros pierden fondo, sombra y la máscara del carrusel, y se captura con
//     omitBackground.
//  2. La composición: el mismo arreglo de la portada anterior (fondo azul claro con una V
//     tenue, logotipo arriba a la izquierda, la factura arriba a la derecha, la caja a la
//     izquierda y el stock abajo) en HTML a 1536×1024, renderizado a 2x = 3072×2048 (3:2).
const { chromium } = require(process.env.PWCORE);
const fs = require("fs");
const path = require("path");

const [TALLER, SALIDA] = process.argv.slice(2);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(TALLER, { recursive: true });

// Tarjeta (posición en el carrusel, desde 0) → nombre de la pieza
const DIBUJOS = [
  [1, "caja"],
  [3, "factura"],
  [2, "stock"],
];

async function piezas(b) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 5, locale: "es-PE", reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto("https://vendiq.pe", { waitUntil: "networkidle" });
  for (const t of ["Aceptar todas", "Solo esenciales", "Aceptar"]) {
    const x = p.getByRole("button", { name: t, exact: true });
    if (await x.count()) { try { await x.first().click({ timeout: 1500 }); await wait(300); } catch {} break; }
  }
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 600) { await p.evaluate((v) => window.scrollTo(0, v), y); await wait(80); }
  await p.evaluate(() => window.scrollTo(0, 0));
  await wait(600);

  // Aísla la pieza marcada con data-pieza: fuera lo demás, ancestros sin fondo
  const capturar = async (marcar, nombre) => {
    const ok = await p.evaluate(marcar);
    if (!ok) throw new Error(`no encontré ${nombre}`);
    await p.evaluate(() => {
      const el = document.querySelector("[data-pieza]");
      for (const e of document.querySelectorAll("body *")) {
        if (e === el || e.contains(el) || el.contains(e)) continue;
        e.style.visibility = "hidden";
      }
      for (let a = el.parentElement; a; a = a.parentElement) {
        a.style.background = "transparent";
        a.style.boxShadow = "none";
        a.style.maskImage = "none";
        a.style.webkitMaskImage = "none";
      }
      document.documentElement.style.background = "transparent";
      document.body.style.background = "transparent";
    });
    await wait(300);
    await p.locator("[data-pieza]").screenshot({ path: path.join(TALLER, `${nombre}.png`), omitBackground: true });
    // devolver la página a su estado
    await p.evaluate(() => {
      for (const e of document.querySelectorAll("body *")) { e.style.visibility = ""; }
      document.querySelector("[data-pieza]").removeAttribute("data-pieza");
    });
    console.log("✓ pieza", nombre);
  };

  // El logotipo de la cabecera, con el texto en tinta
  await capturar(() => {
    const a = document.querySelector("header a[href='/']") || document.querySelector("header a");
    if (!a) return false;
    a.setAttribute("data-pieza", "1");
    for (const e of [a, ...a.querySelectorAll("*")]) e.style.color = "#0C1020";
    // sin el relleno ni el alto mínimo del enlace: la pieza mide lo que el logotipo
    Object.assign(a.style, { padding: "0", minHeight: "0", height: "auto", lineHeight: "1", display: "inline-flex" });
    return true;
  }, "logo");

  for (const [i, nombre] of DIBUJOS) {
    await capturar(new Function(`
      const sec = [...document.querySelectorAll("section")].find((s) => /Una sola cuenta para vender/.test(s.innerText));
      const li = sec && sec.querySelector("ul").children[${i}];
      const dibujo = li && li.querySelector("a > div[aria-hidden] > div > *");
      if (!dibujo) return false;
      dibujo.setAttribute("data-pieza", "1");
      dibujo.style.boxShadow = "none";
      return true;
    `), nombre);
  }
  await ctx.close();
}

async function componer(b) {
  const img = (n) => "file://" + path.resolve(TALLER, `${n}.png`);
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1536px;height:1024px;overflow:hidden}
.lienzo{position:relative;width:1536px;height:1024px;overflow:hidden;
  background:radial-gradient(70% 80% at 12% 6%,#E4ECFF 0%,rgba(228,236,255,0) 60%),
             linear-gradient(140deg,#D3DEFF 0%,#B2C3FA 42%,#8EA5F2 78%,#7C94EC 100%)}
/* la V tenue del logotipo, abajo, como en la portada anterior */
.v{position:absolute;left:250px;top:610px;width:270px;height:340px;background:rgba(255,255,255,.22);
  clip-path:polygon(0 0,100% 0,50% 100%)}
.banda{position:absolute;right:-180px;bottom:-260px;width:900px;height:620px;transform:rotate(-24deg);
  background:linear-gradient(90deg,rgba(90,115,225,0),rgba(90,115,225,.28))}
.logo{position:absolute;left:128px;top:150px;width:330px}
.p{position:absolute;filter:drop-shadow(0 34px 44px rgba(22,34,92,.36)) drop-shadow(0 6px 10px rgba(22,34,92,.18))}
.caja{left:132px;top:420px;width:560px;z-index:1}
.factura{left:706px;top:150px;width:600px;z-index:2}
.stock{left:846px;top:594px;width:440px;z-index:3}
</style></head><body><div class="lienzo">
<div class="banda"></div><div class="v"></div>
<img class="logo" src="${img("logo")}">
<img class="p caja" src="${img("caja")}">
<img class="p factura" src="${img("factura")}">
<img class="p stock" src="${img("stock")}">
</div></body></html>`;
  const f = path.join(TALLER, "portada-marca.html");
  fs.writeFileSync(f, html);
  const ctx = await b.newContext({ viewport: { width: 1536, height: 1024 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto("file://" + path.resolve(f), { waitUntil: "load" });
  await wait(400);
  const medidas = await p.evaluate(() => [...document.querySelectorAll("img")].map((i) => `${i.className}: ${Math.round(i.getBoundingClientRect().left)},${Math.round(i.getBoundingClientRect().top)} ${Math.round(i.getBoundingClientRect().width)}×${Math.round(i.getBoundingClientRect().height)} (fin y ${Math.round(i.getBoundingClientRect().bottom)})`));
  console.log(medidas.join("\n"));
  await p.screenshot({ path: SALIDA.replace(/\.jpg$/, ".png") });
  await ctx.close();
}

(async () => {
  const b = await chromium.launch(process.env.PWEXE ? { executablePath: process.env.PWEXE } : {});
  if (!process.env.SOLO_COMPONER) await piezas(b);
  await componer(b);
  await b.close();
})();
