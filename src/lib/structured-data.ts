import { PAGINAS_SERVICIO } from "~/data/servicios-paginas";
import { SITIO } from "~/lib/seo";

/**
 * Datos estructurados (schema.org), rehechos el 2026-10-23. Se quitó lo que no era cierto o no
 * existía: un SearchAction hacia /search (no hay buscador), un SoftwareApplication (Axium no es
 * una app) con una oferta sin precio que Search Console marca como error, y una geolocalización,
 * un horario y un año de fundación que no salen de ninguna parte. Solo va lo que dice la web:
 * Lima, el correo, el teléfono y los seis servicios con su página. Cuando existan la dirección y
 * las redes (LinkedIn, Instagram…), se suman en `address` y `sameAs`.
 */

const ID_ORG = `${SITIO}/#organizacion`;

export function esquemaOrganizacion() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ID_ORG,
    name: "Axium",
    url: SITIO,
    logo: `${SITIO}/icon-512.png`,
    image: `${SITIO}/og/og-inicio.jpg`,
    description:
      "Empresa de desarrollo de software en Lima: software a medida, páginas web, tiendas online, apps, inteligencia artificial e IoT para empresas en Perú.",
    email: "contacto@axium.com.pe",
    telephone: "+51991285679",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lima",
      addressCountry: "PE",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "contacto@axium.com.pe",
        telephone: "+51991285679",
        areaServed: "PE",
        availableLanguage: ["Spanish", "English", "Portuguese"],
      },
    ],
  };
}

export function esquemaSitio() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITIO}/#sitio`,
    name: "Axium",
    url: SITIO,
    inLanguage: "es-PE",
    publisher: { "@id": ID_ORG },
  };
}

/** La empresa como servicio profesional en Lima, con su catálogo: va en el inicio. */
export function esquemaNegocio() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITIO}/#negocio`,
    name: "Axium",
    url: SITIO,
    image: `${SITIO}/og/og-inicio.jpg`,
    logo: `${SITIO}/icon-512.png`,
    email: "contacto@axium.com.pe",
    telephone: "+51991285679",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lima",
      addressCountry: "PE",
    },
    areaServed: { "@type": "Country", name: "Perú" },
    parentOrganization: { "@id": ID_ORG },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de Axium",
      itemListElement: Object.values(PAGINAS_SERVICIO).map((p) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: p.meta.titulo.replace(/\s*\|\s*Axium$/i, ""),
          description: p.meta.descripcion,
          url: `${SITIO}/servicios/${p.slug}`,
        },
      })),
    },
  };
}

/** Un servicio, para su página. */
export function esquemaServicio(id: keyof typeof PAGINAS_SERVICIO) {
  const p = PAGINAS_SERVICIO[id];
  const nombre = p.meta.titulo.replace(/\s*\|\s*Axium$/i, "");
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: nombre,
      description: p.meta.descripcion,
      url: `${SITIO}/servicios/${p.slug}`,
      provider: { "@id": ID_ORG },
      areaServed: { "@type": "Country", name: "Perú" },
    },
    migas([
      ["Inicio", "/"],
      ["Servicios", "/#servicios"],
      [nombre, `/servicios/${p.slug}`],
    ]),
  ];
}

/** Un caso del portafolio: el trabajo hecho por Axium, con su rubro y lo que incluyó. */
export function esquemaCaso(
  slug: string,
  data: {
    title: string;
    description: string;
    image: string;
    industry?: string;
    services?: string[];
  }
) {
  const url = `${SITIO}/casos-de-exito/${slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `${url}#caso`,
      name: data.title,
      headline: `${data.title}: caso de éxito de Axium`,
      description: data.description,
      image: `${SITIO}${data.image}`,
      url,
      inLanguage: "es-PE",
      creator: { "@id": ID_ORG },
      ...(data.industry ? { genre: data.industry } : {}),
      ...(data.services?.length ? { keywords: data.services.join(", ") } : {}),
    },
    migas([
      ["Inicio", "/"],
      ["Portafolio", "/portafolio"],
      [data.title, `/casos-de-exito/${slug}`],
    ]),
  ];
}

/** El portafolio como colección: la lista de los casos, cada uno con su página. */
export function esquemaPortafolio(casos: { slug: string; titulo: string }[]) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${SITIO}/portafolio#coleccion`,
      name: "Portafolio de Axium",
      url: `${SITIO}/portafolio`,
      inLanguage: "es-PE",
      isPartOf: { "@id": `${SITIO}/#sitio` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: casos.length,
        itemListElement: casos.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.titulo,
          url: `${SITIO}/casos-de-exito/${c.slug}`,
        })),
      },
    },
    migas([
      ["Inicio", "/"],
      ["Portafolio", "/portafolio"],
    ]),
  ];
}

/** El blog, con sus artículos. */
export function esquemaBlog(
  posts: { slug: string; titulo: string; fecha?: string }[]
) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": `${SITIO}/blog#blog`,
      name: "Blog de Axium",
      url: `${SITIO}/blog`,
      inLanguage: "es-PE",
      publisher: { "@id": ID_ORG },
      blogPost: posts.map((p) => ({
        "@type": "BlogPosting",
        headline: p.titulo,
        url: `${SITIO}/blog/${p.slug}`,
        ...(p.fecha ? { datePublished: p.fecha } : {}),
      })),
    },
    migas([
      ["Inicio", "/"],
      ["Blog", "/blog"],
    ]),
  ];
}

/** Las migas de pan de una página: [nombre, ruta] desde el inicio. */
export function migas(pasos: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: pasos.map(([name, ruta], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${SITIO}${ruta === "/" ? "" : ruta}`,
    })),
  };
}
