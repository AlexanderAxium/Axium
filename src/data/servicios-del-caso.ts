import type { IdServicio } from "~/data/servicios-paginas";
import type { TextoPorIdioma } from "~/lib/alt";

/**
 * Qué servicios de Axium hizo cada caso de éxito, para el bloque «Servicios de este proyecto» de su
 * ficha (SEO-78, 2026-11-13): cada caso enlaza a la página del servicio, y el servicio recibe el
 * enlace desde el trabajo que lo demuestra. El primero es el principal. Sale de lo que dice la
 * ficha de cada caso (src/data/cases/<slug>.json: `services`, `platform`), no de lo que convendría
 * posicionar: un caso de marca sin web no enlaza a desarrollo web.
 *
 * Un caso nuevo se agrega aquí; `<ServiciosDelCaso caso="…" />` no compila con un slug que falte.
 */
export const SERVICIOS_DEL_CASO = {
  alyer: ["diseno"],
  ambientalpe: ["web", "software"],
  anjsports: ["web"],
  antiruidopvc: ["web"],
  aurore: ["diseno", "web"],
  blendet: ["web"],
  bookit: ["software", "web"],
  capptura: ["web"],
  cesaracosta: ["web"],
  clefast: ["web"],
  comunicarte: ["web"],
  daesurmotors: ["web"],
  enrafmedica: ["web"],
  favorygracia: ["web"],
  "feedback-management": ["software"],
  fenalsa: ["web"],
  feniz: ["software", "ia"],
  fintrace: ["software"],
  firstautomation: ["web"],
  ghiperu: ["web"],
  happyart: ["web", "diseno"],
  hotelesparaiso: ["web"],
  huarmis: ["web"],
  innersoulbright: ["web"],
  jarumi: ["web"],
  jcpingenieros: ["web"],
  lifetoursfl: ["web"],
  lumiolearn: ["software", "ia"],
  maintech: ["diseno", "web"],
  moviflex: ["web"],
  podologiemtk: ["web"],
  qintitec: ["web"],
  redesvip: ["web"],
  rematch: ["software", "web"],
  siclo: ["software"],
  sportt: ["web"],
  toliveagain: ["web"],
  transportesrumi: ["web", "diseno"],
  vendiq: ["software", "web"],
  ventanasantiruido: ["web"],
  villacer: ["web", "diseno"],
  vitalchain: ["web"],
  volveravivir: ["web"],
  "web-scraping-ai": ["ia", "software"],
} as const satisfies Record<string, readonly IdServicio[]>;

export type SlugCaso = keyof typeof SERVICIOS_DEL_CASO;

/** El texto del enlace: dice qué hay en la página del servicio, no «ver más». */
export const ANCLA_SERVICIO: Record<IdServicio, TextoPorIdioma> = {
  diseno: {
    es: "Diseño de marca, UX/UI y webs",
    en: "Brand, UX/UI and web design",
    pt: "Design de marca, UX/UI e sites",
  },
  web: {
    es: "Desarrollo de páginas web, tiendas online y apps",
    en: "Website, online store and app development",
    pt: "Desenvolvimento de sites, lojas online e apps",
  },
  software: {
    es: "Desarrollo de software a medida",
    en: "Custom software development",
    pt: "Desenvolvimento de software sob medida",
  },
  ia: {
    es: "Inteligencia artificial para empresas",
    en: "Artificial intelligence for businesses",
    pt: "Inteligência artificial para empresas",
  },
  iot: {
    es: "Soluciones IoT para empresas",
    en: "IoT solutions for businesses",
    pt: "Soluções IoT para empresas",
  },
  cloud: {
    es: "Cloud, seguridad y soporte técnico",
    en: "Cloud, security and technical support",
    pt: "Cloud, segurança e suporte técnico",
  },
};
