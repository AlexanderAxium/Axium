// Junta los íconos SVG de un sitio tal como los pinta (inline), sin duplicados.
// Uso: PWCORE=… PWEXE=… node recoger-iconos-svg.cjs <salida.json> <viewBox> url1 url2 …
// Rematch: viewBox "0 0 48 48" = el motor de vidrio plano (components/iconos).
const { chromium } = require(process.env.PWCORE);
const fs = require("fs");
const [salida, viewBox, ...urls] = process.argv.slice(2);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(process.env.PWEXE ? { executablePath: process.env.PWEXE } : {});
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const vistos = new Map();
  for (const u of urls) {
    await p.goto(u, { waitUntil: "networkidle" });
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 500) { await p.evaluate((v) => window.scrollTo(0, v), y); await wait(120); }
    // abrir los menús desplegables de la cabecera (los íconos del menú solo existen abiertos)
    for (const n of ["Producto", "Soluciones"]) {
      try { await p.getByRole("button", { name: new RegExp(`^${n}`) }).first().click({ timeout: 1500 }); await wait(500); } catch {}
      const svgs = await p.evaluate((vb) => [...document.querySelectorAll(`svg[viewBox="${vb}"]`)].map((s) => {
        const r = s.getBoundingClientRect();
        const etiqueta = (s.closest("a,button,li,div")?.innerText || "").trim().split("\n")[0].slice(0, 40);
        // id estable: quitar los ids de useId para comparar dibujos
        const norm = s.outerHTML.replace(/id="[^"]*"/g, "").replace(/url\(#[^)]*\)/g, "url()").replace(/style="[^"]*"/g, "");
        return { svg: s.outerHTML, norm, etiqueta, w: r.width, color: getComputedStyle(s).color };
      }), viewBox);
      for (const s of svgs) if (!vistos.has(s.norm)) vistos.set(s.norm, { svg: s.svg, etiqueta: s.etiqueta, de: u, color: s.color });
      try { await p.keyboard.press("Escape"); } catch {}
    }
  }
  fs.writeFileSync(salida, JSON.stringify([...vistos.values()], null, 1));
  console.log("✓", vistos.size, "íconos distintos");
  await b.close();
})();
