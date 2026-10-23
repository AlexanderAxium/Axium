// Compone las piezas Open Graph (1200×630) del sitio: la escena de OpenAI de este taller + el logo
// blanco, el titular en GuarujaTitle y el dominio, en HTML renderizado con Playwright. El texto va
// en código (la imagen se genera sin letras). Uso: node componer-og.mjs
import { chromium } from "/Users/alexander/Documents/SAAS/Bookit-web-publica/node_modules/playwright/index.mjs";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const AQUI = dirname(fileURLToPath(import.meta.url));
const WEB = join(AQUI, "../../../../../..");
const PUB = join(WEB, "public");
const b64 = (p) => readFileSync(p).toString("base64");
const PIEZAS = {
  inicio: ["Desarrollo de software, webs e IA en Lima", "Un solo equipo, del diseño a producción"],
  "servicio-diseno": ["Diseño de marca, UX/UI y webs", "Diseño de producto y marca"],
  "servicio-web": ["Páginas web, tiendas online y apps", "Webs, tiendas online y apps"],
  "servicio-software": ["Software a medida e integraciones", "Software a medida, ERP y CRM"],
  "servicio-ia": ["Inteligencia artificial para tu empresa", "Agentes, asistentes y automatizaciones"],
  "servicio-iot": ["Tus equipos, conectados a tu sistema", "Sensores, monitoreo y alertas"],
  "servicio-cloud": ["Cloud, seguridad y soporte", "Que tu sistema siga funcionando"],
  portafolio: ["Proyectos reales para empresas del Perú", "Portafolio de Axium"],
  blog: ["Guías de software, webs e IA para empresas", "Blog de Axium"],
};
const css = `
@font-face{font-family:G;src:url(data:font/woff2;base64,${b64(join(PUB, "gilroy/GuarujaTitle.woff2"))}) format("woff2")}
@font-face{font-family:R;font-weight:500;src:url(data:font/woff2;base64,${b64(join(PUB, "gilroy/Gilroy-Medium.woff2"))}) format("woff2")}
*{margin:0;box-sizing:border-box}html,body{width:1200px;height:630px;background:#060C20;overflow:hidden}
.p{position:relative;width:1200px;height:630px}
.f{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.v{position:absolute;inset:0;background:linear-gradient(90deg,#060C20 0%,rgba(6,12,32,.92) 30%,rgba(6,12,32,.55) 48%,rgba(6,12,32,0) 66%)}
.l{position:absolute;left:64px;top:56px;height:40px}
.t{position:absolute;left:64px;bottom:118px;width:560px;font-family:G;color:#fff;font-size:58px;line-height:1.02;letter-spacing:-.035em}
.s{position:absolute;left:64px;bottom:64px;font-family:R;font-weight:500;color:rgba(255,255,255,.72);font-size:21px;letter-spacing:-.005em}
.d{position:absolute;right:56px;bottom:60px;font-family:R;font-weight:500;color:rgba(255,255,255,.85);font-size:19px}
.a{position:absolute;left:64px;bottom:102px;width:44px;height:3px;background:#0092D1;border-radius:2px;display:none}`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const [k, [titulo, sub]] of Object.entries(PIEZAS)) {
  const html = `<!doctype html><meta charset=utf-8><style>${css}</style><div class=p>
  <img class=f src="data:image/png;base64,${b64(join(AQUI, k + ".png"))}">
  <div class=v></div>
  <img class=l src="data:image/png;base64,${b64(join(PUB, "logo3.png"))}">
  <div class=t>${titulo}</div><div class=s>${sub}</div><div class=d>axium.com.pe</div></div>`;
  await p.setContent(html, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const alto = await p.evaluate(() => document.querySelector(".t").getBoundingClientRect().height);
  await p.screenshot({ path: join(PUB, "og", `og-${k}.jpg`), type: "jpeg", quality: 86 });
  console.log("✓", `og-${k}.jpg`, `titular ${Math.round(alto)} px`);
}
await b.close();
