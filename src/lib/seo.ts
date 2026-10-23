import type { Metadata } from "next";

/**
 * SEO del sitio (rehecho el 2026-10-23, Alexander: «quiero que la gente me empiece a encontrar por
 * Google»). Lo que se corrigió, medido en producción:
 * - el canonical era «/» en TODAS las páginas (venía del layout raíz): Google tomaba los servicios,
 *   los casos y el blog por copias del inicio. Ahora cada página declara el suyo con metaPagina;
 * - las páginas sin openGraph propio heredaban el título y la descripción del inicio al compartirse;
 * - la imagen para redes era el logo (no es 1200×630); ahora cada página lleva su pieza;
 * - generateMetadata ponía «| AXIUM» y la plantilla otro más: «Portafolio | AXIUM | AXIUM».
 * Los títulos van en menos de 60 caracteres con lo que la gente busca («desarrollo de software
 * en Lima», «páginas web», «tienda online»…) y la marca al final.
 */

export const SITIO = process.env.SITE_URL || "https://axium.com.pe";
const MARCA = "Axium";
const IMAGEN_POR_DEFECTO = "/og/og-inicio.jpg";

const TITULO_INICIO = "Empresa de desarrollo de software en Lima, Perú | Axium";
const DESCRIPCION_INICIO =
  "Software a medida, páginas web, tiendas online, apps, IA e IoT para empresas en Perú. Un solo equipo en Lima, del diseño a producción. Cotiza tu proyecto.";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: {
    default: TITULO_INICIO,
    template: `%s | ${MARCA}`,
  },
  description: DESCRIPCION_INICIO,
  applicationName: MARCA,
  authors: [{ name: MARCA, url: SITIO }],
  creator: MARCA,
  publisher: MARCA,
  formatDetection: { email: false, address: false, telephone: false },
  // sin canonical acá: heredado, apuntaba todas las páginas al inicio
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: MARCA,
    url: "/",
    title: TITULO_INICIO,
    description: DESCRIPCION_INICIO,
    images: [
      {
        url: IMAGEN_POR_DEFECTO,
        width: 1200,
        height: 630,
        alt: "Axium, desarrollo de software en Lima",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO_INICIO,
    description: DESCRIPCION_INICIO,
    images: [IMAGEN_POR_DEFECTO],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
    other: process.env.BING_VERIFICATION
      ? { "msvalidate.01": process.env.BING_VERIFICATION }
      : undefined,
  },
};

/** Una descripción de buscador: hasta ~158 caracteres, cortada en una palabra. */
export function resumen(texto: string, max = 158) {
  const t = texto.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const corte = t.slice(0, max - 1);
  return `${corte.slice(0, corte.lastIndexOf(" ")).replace(/[,;:.]$/, "")}…`;
}

/** El título completo, con la marca una sola vez. */
function conMarca(titulo: string) {
  return /\|\s*axium\s*$/i.test(titulo) ? titulo : `${titulo} | ${MARCA}`;
}

/**
 * Los metadatos de una página: título, descripción, canonical, Open Graph y Twitter coherentes
 * entre sí. `ruta` es la ruta pública («/servicios/iot»); `imagen`, la pieza de 1200×630 (o una
 * portada del sitio), que si falta es la del inicio.
 */
export function metaPagina({
  titulo,
  descripcion,
  ruta,
  imagen,
  tipo = "website",
  indexar = true,
  publicado,
}: {
  titulo: string;
  descripcion: string;
  ruta: string;
  imagen?: string;
  tipo?: "website" | "article";
  indexar?: boolean;
  publicado?: string;
}): Metadata {
  const completo = conMarca(titulo);
  const img = imagen ?? IMAGEN_POR_DEFECTO;
  return {
    title: { absolute: completo },
    description: descripcion,
    alternates: { canonical: ruta },
    openGraph: {
      type: tipo,
      locale: "es_PE",
      siteName: MARCA,
      url: ruta,
      title: completo,
      description: descripcion,
      // las piezas de /og/ miden 1200×630; las portadas del sitio, lo suyo
      images: [
        img.startsWith("/og/")
          ? { url: img, width: 1200, height: 630, alt: titulo }
          : { url: img, alt: titulo },
      ],
      ...(tipo === "article" && publicado
        ? { publishedTime: publicado, authors: [MARCA] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: completo,
      description: descripcion,
      images: [img],
    },
    ...(indexar ? {} : { robots: { index: false, follow: true } }),
  };
}

/**
 * Los metadatos de un caso del portafolio: el nombre con su rubro («Alyer: transporte de carga
 * minera y fabricación»), que es lo que alguien busca, en vez del «Alyer: caso de éxito» que
 * llevaban los 45 (2026-10-23). Si no cabe en 60 caracteres con la marca, queda el de antes.
 */
export function metaCaso(
  slug: string,
  data: {
    title: string;
    description: string;
    image: string;
    secondaryIndustry?: string;
  }
) {
  const tema = data.secondaryIndustry?.trim() ?? "";
  // en minúscula las palabras que solo llevan la inicial en mayúscula («Productos Ecológicos» →
  // «productos ecológicos»); siglas y nombres como «PVC», «STEM» o «PropFirms» quedan igual
  const temaEnFrase = tema.replace(
    /[A-ZÁÉÍÓÚÑ][a-záéíóúñü]+(?!\p{L})/gu,
    (w, k: number) => (/\p{L}/u.test(tema.charAt(k - 1)) ? w : w.toLowerCase())
  );
  const conTema = `${data.title}: ${temaEnFrase}`;
  return metaPagina({
    titulo:
      tema && conTema.length <= 52 ? conTema : `${data.title}: caso de éxito`,
    descripcion: resumen(data.description),
    ruta: `/casos-de-exito/${slug}`,
    imagen: data.image,
  });
}

/** Compatibilidad con las páginas que ya la usaban (paneles y acceso). */
export function generateMetadata({
  title,
  description,
  ruta = "/",
  image,
  indexar = true,
}: {
  title: string;
  description: string;
  keywords?: string[];
  ruta?: string;
  image?: string;
  indexar?: boolean;
}): Metadata {
  return metaPagina({
    titulo: title,
    descripcion: description,
    ruta,
    imagen: image,
    indexar,
  });
}

export const homePageMetadata: Metadata = metaPagina({
  titulo: TITULO_INICIO,
  descripcion: DESCRIPCION_INICIO,
  ruta: "/",
});
