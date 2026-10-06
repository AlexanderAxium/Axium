#!/usr/bin/env node
/**
 * Inventario de assets del portafolio de Axium.
 *
 * Cruza src/data/cases/*.json con public/images/proyects/<slug>/ y reporta, por
 * proyecto: la portada, sus dimensiones reales, el ratio, el peso, cuántos
 * assets tiene y si la portada aguanta un rediseño o hay que rehacerla.
 *
 * Existe porque antes de escribir 33 prompts hay que saber cuáles de las 33
 * portadas son recuperables y cuáles no. Sin este dato, el trabajo de imagen se
 * dimensiona a ojo.
 *
 *   node .claude/skills/portafolio-axium/inventario.mjs
 *   node .claude/skills/portafolio-axium/inventario.mjs --json
 *   node .claude/skills/portafolio-axium/inventario.mjs --rehacer   (solo los problemáticos)
 *
 * Las dimensiones se leen con `sips` (macOS). En otro SO, esa columna sale "?".
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../../../..");
const CASES_DIR = path.join(ROOT, "src/data/cases");
const IMG_DIR = path.join(ROOT, "public/images/proyects");

// Umbrales: por debajo de esto, la portada no aguanta una grilla moderna en
// pantallas retina ni deja margen para recortar a otro ratio.
const MIN_WIDTH = 1400;
const MIN_HEIGHT = 900;
const RATIO_OBJETIVO = 4 / 3;
const TOLERANCIA_RATIO = 0.35; // más lejos que esto y object-cover recorta feo
const PESO_MAX = 400 * 1024;   // 33 portadas en una grilla: por encima de esto duele

const args = new Set(process.argv.slice(2));
const asJson = args.has("--json");
const soloRehacer = args.has("--rehacer");

function dimensiones(file) {
  try {
    const out = execFileSync(
      "sips",
      ["-g", "pixelWidth", "-g", "pixelHeight", file],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    );
    const w = Number(out.match(/pixelWidth:\s*(\d+)/)?.[1]);
    const h = Number(out.match(/pixelHeight:\s*(\d+)/)?.[1]);
    return Number.isFinite(w) && Number.isFinite(h) ? { w, h } : null;
  } catch {
    return null;
  }
}

const kb = (n) => `${Math.round(n / 1024)}kb`;

const proyectos = fs
  .readdirSync(CASES_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort()
  .map((f) => {
    const slug = f.replace(/\.json$/, "");
    const data = JSON.parse(fs.readFileSync(path.join(CASES_DIR, f), "utf8"));
    const carpeta = path.join(IMG_DIR, slug);
    const assets = fs.existsSync(carpeta)
      ? fs.readdirSync(carpeta).filter((x) => !x.startsWith("."))
      : [];

    // `image` en el JSON es una ruta pública: /images/proyects/<slug>/<archivo>
    const portadaRel = data.image ?? "";
    const portadaAbs = portadaRel
      ? path.join(ROOT, "public", portadaRel.replace(/^\//, ""))
      : "";
    const existe = portadaAbs && fs.existsSync(portadaAbs);
    const dim = existe ? dimensiones(portadaAbs) : null;
    const peso = existe ? fs.statSync(portadaAbs).size : 0;
    const ratio = dim ? dim.w / dim.h : null;

    // Crítico = la portada no sirve como está y hay que producirla de nuevo.
    const criticos = [];
    if (!portadaRel) criticos.push("sin campo image");
    else if (!existe) criticos.push("portada no existe en disco");
    if (dim && (dim.w < MIN_WIDTH || dim.h < MIN_HEIGHT))
      criticos.push(`baja resolución (${dim.w}×${dim.h})`);
    if (ratio && Math.abs(ratio - RATIO_OBJETIVO) > TOLERANCIA_RATIO)
      criticos.push(`ratio ${ratio.toFixed(2)} → recorte agresivo a 4:3`);
    if (!data.liveUrl) criticos.push("sin liveUrl — no se puede recapturar");

    // Optimizable = la imagen sirve, pero el archivo hay que tratarlo.
    const menores = [];
    if (peso > PESO_MAX) menores.push(`pesa ${kb(peso)}`);
    if (assets.length <= 1) menores.push("1 solo asset");

    const problemas = [...criticos, ...menores];

    return {
      slug,
      titulo: data.title ?? slug,
      industria: data.industry ?? "",
      plataforma: data.platform ?? "",
      liveUrl: data.liveUrl ?? "",
      portada: portadaRel ? path.basename(portadaRel) : "—",
      dim: dim ? `${dim.w}×${dim.h}` : "?",
      ratio: ratio ? ratio.toFixed(2) : "?",
      peso: existe ? kb(peso) : "—",
      assets: assets.length,
      criticos,
      menores,
      problemas,
    };
  });

if (asJson) {
  console.log(JSON.stringify(proyectos, null, 2));
  process.exit(0);
}

const lista = soloRehacer
  ? proyectos.filter((p) => p.criticos.length > 0)
  : proyectos;

const col = (s, n) => String(s).padEnd(n).slice(0, n);
console.log(
  col("SLUG", 22) + col("PORTADA", 30) + col("DIM", 12) + col("RATIO", 7) +
    col("PESO", 8) + col("N", 4) + "PROBLEMAS",
);
console.log("─".repeat(120));
for (const p of lista) {
  console.log(
    col(p.slug, 22) + col(p.portada, 30) + col(p.dim, 12) + col(p.ratio, 7) +
      col(p.peso, 8) + col(p.assets, 4) +
      (p.criticos.length ? `⛔ ${p.criticos.join("; ")}  ` : "") +
      (p.menores.length ? `· ${p.menores.join("; ")}` : "") ||
      "ok",
  );
}

const criticos = proyectos.filter((p) => p.criticos.length > 0);
const pesadas = proyectos.filter((p) => p.menores.some((m) => m.startsWith("pesa")));
const sinLive = proyectos.filter((p) => !p.liveUrl);

// Distribución de ratios: si están todas en el mismo ratio y la tarjeta usa otro,
// la grilla entera está recortando lo mismo en las 33 y nadie se dio cuenta.
const porRatio = {};
for (const p of proyectos) porRatio[p.ratio] = (porRatio[p.ratio] ?? 0) + 1;

console.log("─".repeat(120));
console.log(`${proyectos.length} proyectos · ⛔ ${criticos.length} con portada a producir de nuevo · ${proyectos.length - criticos.length} recuperables`);
console.log(`Ratios de las portadas: ${Object.entries(porRatio).sort((a, b) => b[1] - a[1]).map(([r, n]) => `${r} (${n})`).join(", ")}  ← la tarjeta usa ${RATIO_OBJETIVO.toFixed(2)}`);
console.log(`${pesadas.length} portadas por encima de ${kb(PESO_MAX)} · ${sinLive.length} sin liveUrl: ${sinLive.map((p) => p.slug).join(", ") || "—"}`);
