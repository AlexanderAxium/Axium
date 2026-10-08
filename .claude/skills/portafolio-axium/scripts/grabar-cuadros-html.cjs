/* Graba cuadro a cuadro una página HTML que expone window.cuadro(t) (t en segundos) y
   window.listo = true cuando terminó de cargar. Determinista: no depende del reloj, así que
   cada cuadro sale igual por lento que vaya el render (2026-10-07, Feniz: el isotipo en 3D y
   «el viaje de una operación»).

     node grabar-cuadros-html.cjs <pagina.html> <dir-salida> --seg 15 [--fps 30]
          [--ancho 1120] [--alto 560] [--dpr 2] [--query "m=1"] [--solo 0,3.2,7]

   --solo: solo esos instantes (para revisar), con nombre t<seg>.jpg.
   Necesita PWCORE y PWEXE en el entorno (ver COMPOSITOR.md). */
const { chromium } = require(process.env.PWCORE);
const path = require("path");
const fs = require("fs");

const [pagina, out, ...resto] = process.argv.slice(2);
const op = { seg: 10, fps: 30, ancho: 1120, alto: 560, dpr: 2, query: "", solo: "" };
for (let i = 0; i < resto.length; i += 2) op[resto[i].replace(/^--/, "")] = resto[i + 1];

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({
    executablePath: process.env.PWEXE,
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  const p = await (
    await b.newContext({ viewport: { width: +op.ancho, height: +op.alto }, deviceScaleFactor: +op.dpr })
  ).newPage();
  p.on("pageerror", (e) => console.log("error:", e.message));
  await p.goto("file://" + path.resolve(pagina) + (op.query ? "?" + op.query : ""));
  await p.waitForFunction(() => window.listo === true, null, { timeout: 60000 });
  const instantes = op.solo
    ? op.solo.split(",").map(Number)
    : Array.from({ length: Math.round(+op.seg * +op.fps) }, (_, i) => i / +op.fps);
  for (let i = 0; i < instantes.length; i++) {
    await p.evaluate((t) => window.cuadro(t), instantes[i]);
    const nombre = op.solo ? `t${instantes[i]}.jpg` : `f${String(i).padStart(5, "0")}.jpg`;
    await p.screenshot({ path: path.join(out, nombre), type: "jpeg", quality: 92 });
  }
  await b.close();
  console.log("✓", instantes.length, "cuadros en", out);
})();
