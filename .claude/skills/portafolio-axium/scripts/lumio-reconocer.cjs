// Reconocimiento de LumioLearn en local (base lumio_capturas, host lvh.me:3300):
// entra como admin y como alumno del tenant propio (LumioLearn Academy) y
// toma una captura de viewport a 2x de cada pantalla candidata a lámina.
// Nunca contra producción: ver scratchpad lumio-env.sh.
// Uso: PWCORE=... PWEXE=... node lumio-reconocer.cjs [solo-prefijo]
const { chromium } = require(process.env.PWCORE);
const fs = require("fs");

const OUT = `${__dirname}/../capturas-saas/lumiolearn/app-local/`;
const BASE = "http://lumio.lvh.me:3300";
const COURSE = "fea60666-2584-4290-b8bc-14d115977568"; // Transformación Digital 360°
const CHAPTER = "455dc8f2-9e69-4968-ac86-fee9f9289c2e"; // Bienvenida y diagnóstico
const SOLO = process.argv[2] || "";
const HIDE =
  "nextjs-portal,[data-nextjs-toast],[data-next-badge-root]{display:none!important}html{scroll-behavior:auto!important}";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });

const ADMIN = [
  ["a-00-dashboard", "/dashboard"],
  ["a-01-cursos", "/dashboard/courses"],
  ["a-02-curso", `/dashboard/courses/${COURSE}`],
  ["a-03-capitulo-editor", `/dashboard/courses/${COURSE}/chapters/${CHAPTER}/edit`],
  ["a-04-cert-plantilla", `/dashboard/courses/${COURSE}/certificate-template`],
  ["a-05-certificados", "/dashboard/certificates"],
  ["a-06-builder", "/builder", 8000],
  ["a-07-sitio-paginas", "/dashboard/site/pages"],
  ["a-08-dominio", "/dashboard/settings/domain"],
  ["a-09-curso-ia", "/dashboard/courses/new/ai"],
  ["a-10-ajustes", "/dashboard/settings"],
];
const ALUMNO = [
  ["u-00-inicio", "/user"],
  ["u-01-cursos", "/user/courses"],
  ["u-02-reproductor", "/user/courses/transformacion-digital-360-001", 5000],
  ["u-03-certificados", "/user/certificates"],
];
const PUBLICO = [
  ["p-00-home", "/"],
  ["p-01-cursos", "/courses"],
];

async function newContext(browser) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    locale: "es-PE",
  });
  // Los videos del seed son de YouTube: no deben aparecer en ninguna captura.
  await ctx.route(/youtube\.com|ytimg\.com|youtube-nocookie\.com|googlevideo\.com/, (r) => r.abort());
  return ctx;
}

async function login(ctx, email) {
  const p = await ctx.newPage();
  await p.goto(`${BASE}/signin`, { waitUntil: "load", timeout: 240000 });
  await p.waitForSelector("input[type=email], input[name=email]", { timeout: 120000 });
  await p.fill("input[type=email], input[name=email]", email);
  await p.fill("input[name=password]", "password");
  // noWaitAfter: con el servidor ocupado el clic no debe quedarse esperando la navegación
  await p.click("button[type=submit]", { noWaitAfter: true, timeout: 120000 });
  await p.waitForURL((u) => !u.pathname.startsWith("/signin"), { timeout: 180000 }).catch(() => {});
  await wait(3000);
  console.log(`login ${email} → ${p.url().replace(BASE, "")}`);
  return p;
}

async function shoot(p, [name, path, extra]) {
  if (SOLO && !name.startsWith(SOLO)) return;
  const t0 = Date.now();
  await p.goto(BASE + path, { waitUntil: "load", timeout: 240000 }).catch((e) => console.log(`  ! ${name}: ${String(e).slice(0, 90)}`));
  await p.addStyleTag({ content: HIDE }).catch(() => {});
  await wait(extra ?? 3500);
  await p.screenshot({ path: `${OUT}${name}.png` });
  console.log(`${name} ${path} → ${p.url().replace(BASE, "")} (${Math.round((Date.now() - t0) / 1000)}s)`);
}

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.PWEXE,
    args: ["--host-resolver-rules=MAP lvh.me 127.0.0.1, MAP *.lvh.me 127.0.0.1"],
  });
  const pub = await newContext(browser);
  const pp = await pub.newPage();
  for (const s of PUBLICO) await shoot(pp, s);
  await pub.close();

  const adm = await newContext(browser);
  const pa = await login(adm, "admin@lumio.com");
  for (const s of ADMIN) await shoot(pa, s);
  await adm.close();

  const alu = await newContext(browser);
  const pu = await login(alu, "user@lumio.com");
  for (const s of ALUMNO) await shoot(pu, s);
  await alu.close();

  await browser.close();
})();
