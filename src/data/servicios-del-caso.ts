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
  alyer: ["marca"],
  ambientalpe: ["web", "software"],
  anjsports: ["web"],
  antiruidopvc: ["web"],
  aurore: ["marca", "web"],
  blendet: ["web"],
  bookit: ["software", "web", "apps"],
  capptura: ["web"],
  cesaracosta: ["web"],
  clefast: ["web"],
  comunicarte: ["web"],
  daesurmotors: ["web"],
  "3bprofactory": ["web"],
  enrafmedica: ["web"],
  favorygracia: ["web"],
  "feedback-management": ["software"],
  fenalsa: ["web"],
  feniz: ["software", "ia"],
  fintrace: ["software"],
  firstautomation: ["web"],
  ghiperu: ["web"],
  happyart: ["web", "marca"],
  hotelesparaiso: ["web"],
  huarmis: ["web"],
  innersoulbright: ["web"],
  jarumi: ["web"],
  jcpingenieros: ["web"],
  lifetoursfl: ["web"],
  lumiolearn: ["software", "ia", "apps"],
  maintech: ["marca", "web"],
  moviflex: ["web"],
  podologiemtk: ["web"],
  qintitec: ["web"],
  redesvip: ["web"],
  rematch: ["software", "web", "apps"],
  siclo: ["software"],
  sportt: ["web"],
  toliveagain: ["web"],
  transportesrumi: ["web", "marca"],
  vendiq: ["software", "web"],
  ventanasantiruido: ["web"],
  villacer: ["web", "marca"],
  vitalchain: ["web"],
  volveravivir: ["web"],
  "web-scraping-ai": ["ia", "software"],
} as const satisfies Record<string, readonly IdServicio[]>;

export type SlugCaso = keyof typeof SERVICIOS_DEL_CASO;

/** El texto del enlace: dice qué hay en la página del servicio, no «ver más». */
export const ANCLA_SERVICIO: Record<IdServicio, TextoPorIdioma> = {
  web: {
    es: "Desarrollo de páginas web y tiendas online",
    en: "Website and online store development",
    pt: "Desenvolvimento de sites e lojas online",
  },
  apps: {
    es: "Desarrollo de apps y diseño UX/UI",
    en: "App development and UX/UI design",
    pt: "Desenvolvimento de apps e design UX/UI",
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
  marca: {
    es: "Branding y marketing digital",
    en: "Branding and digital marketing",
    pt: "Branding e marketing digital",
  },
};
