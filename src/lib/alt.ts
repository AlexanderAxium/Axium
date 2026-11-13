/**
 * Los textos alternativos de las fotos que no salen de un locale (el hero, el CTA, las portadas del
 * blog): uno por idioma, junto al componente que pinta la foto. SEO-75 (2026-11-13): con alt="" Google
 * y el lector de pantalla las toman por adorno; alt="" queda solo para lo decorativo de verdad.
 */
export type Idioma = "es" | "en" | "pt";

export type AltPorIdioma = Record<Idioma, string>;

/** El alt en el idioma activo; cualquier otro idioma cae al español, el principal del sitio. */
export function altEn(textos: AltPorIdioma, locale: string): string {
  return locale === "en" || locale === "pt" ? textos[locale] : textos.es;
}
