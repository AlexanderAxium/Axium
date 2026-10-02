"use client";

import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import {
  CaseStory,
  STORY_LABELS,
  type StoryBlock,
  type StoryLang,
} from "~/components/axium/case-story/case-story";
import { useTranslation } from "~/hooks/useTranslation";

/**
 * Ficha de Fenalsa. UN SOLO ENTREGABLE Y CUATRO PÁGINAS: la ficha más corta del
 * portafolio, y a propósito.
 *
 * ── POR QUÉ ES CORTA ────────────────────────────────────────────────────────────────
 * Aquí no hubo identidad, ni manual, ni aplicaciones: Fenalsa llegó con su logotipo,
 * su paleta y su fotografía. Se entregó la web, y la web tiene cuatro páginas —inicio,
 * nosotros, limpieza y cocina—. Inflarla a quince bloques sería mentir sobre el encargo.
 * Diez bloques, siete piezas, y cada pieza enseña algo que ninguna otra enseña.
 * La vara es lundgrenlindqvist.se: la ficha dura lo que duró el trabajo.
 *
 * ── EL STACK, MEDIDO CONTRA EL SITIO EN VIVO (2026-09-30) ───────────────────────────
 *   · `<meta name="generator" content="WordPress 7.1.2">`  → WordPress.
 *   · `<meta name="generator" content="Elementor 3.22.0; …">` y 1.175 referencias a
 *     `elementor` en el HTML → Elementor es quien monta las páginas.
 *   · Tema `hello-elementor` (cinco referencias en `wp-content/themes/`).
 *   · `Powered by Joinchat` al pie → el flotante de WhatsApp.
 *   · `wp-sitemap.xml` nativo de WordPress; cuatro páginas indexadas.
 * La ficha vieja decía «WordPress» a secas y se quedaba corta: Elementor es la mitad
 * del encargo, porque es lo que le deja al cliente editar sin llamarnos.
 *
 * ── LA PORTADA NO SE TOCA ───────────────────────────────────────────────────────────
 * `fenalsa-hero.jpg` (el portátil con la portada del sitio) se queda tal cual: a
 * Alexander le gusta. ⚠ AVISO PARA QUIEN VENGA DETRÁS: esa imagen es una recreación
 * —el texto del párrafo dentro de la pantalla dice «pero el control ec entral es la
 * satisfacción del cliente, hacemos alimentos de competitivos», y el sitio en vivo dice
 * «pero el concepto central es la satisfacción del cliente, hacemos alimentos de
 * calidad, variedad, competitivos»—. Se mantiene por decisión expresa, pero por eso la
 * portada del sitio NO vuelve a aparecer en ninguna pieza de la galería: todo lo demás
 * es captura real.
 * `fenalsa-desc-1.jpg` (los dos teléfonos) sí se retiró: su logotipo decía «Servicios
 * Generoles» y su texto «transformar tu hogar o negecio». Lo sustituye `fe-movil`, con
 * capturas móviles de verdad.
 *
 * Todas las piezas nuevas son capturas con Playwright del sitio en vivo, escritorio
 * 1440×900 @2x y móvil 390×844 @3x, con scroll completo antes de disparar.
 * Taller: .claude/skills/portafolio-axium/capturas-clientes/fenalsa/taller.html
 *
 * RITMO: diez bloques, cinco de imagen — TRES anchas y DOS pares de cuadradas, siete
 * piezas. Ninguna repite sujeto ni fotografía. Ningún tramo pasa de 700 px sin imagen
 * a 1440, y ningún párrafo pasa de 45 palabras en es/en/pt. `results` va vacío: no
 * tenemos su analítica y no se inventan cifras.
 */

const IMG = "/images/proyects/fenalsa";

/** Las siete piezas del relato: tres anchas y dos pares de cuadradas. */
type Pieza =
  | "servicios"
  | "gastro"
  | "limpieza"
  | "interior"
  | "equipo"
  | "formulario"
  | "movil";

type Copy = {
  tagline: string;
  meta: [string, string][];
  statement: string;
  context: string;
  highlightsTitle: [string, string];
  highlights: { lead: string; text: string }[];
  challengeTitle: string;
  challenge: string;
  approachTitle: string;
  approach: string;
  outcomesTitle: string;
  outcomes: string;
  stackTitle: string;
  stack: string[];
  /** Solo las piezas anchas llevan frase: un bloque `pair` no admite `lead`. */
  leads: { servicios: string; interior: string; movil: string };
  pies: Record<Pieza, string>;
  alt: Record<Pieza, string>;
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    tagline:
      "La web de una empresa arequipeña que limpia y cocina para otras empresas",
    meta: [
      ["Estado", "En línea"],
      ["Entregable", "Sitio web"],
      ["Industria", "Alimentación colectiva y limpieza"],
      ["Alcance", "Cuatro páginas"],
    ],
    statement:
      "A Fenalsa le hicimos solo la web, y la web tenía un problema concreto: una misma empresa vende dos cosas que no se parecen —limpieza industrial y alta cocina— y el visitante llega buscando una sola.",
    context:
      "Fenalsa Servicios Generales SAC opera desde Tiabaya, Arequipa: da de comer en comedores de mina y universidades, y limpia oficinas, hoteles y hospitales. En su muro de clientes están Perumin, Tecnomina y Detroit Power System.",
    highlightsTitle: ["Lo que", "hicimos"],
    highlights: [
      {
        lead: "Dos puertas desde la portada",
        text: "una banda clara para la cocina y una azul para la limpieza, con el mismo peso.",
      },
      {
        lead: "Cuatro páginas",
        text: "inicio, nosotros y una por cada línea, sin menús que se ramifiquen.",
      },
      {
        lead: "Catálogo cruzado",
        text: "seis servicios en tarjetas etiquetadas por familia, azul limpieza y verde cocina.",
      },
      {
        lead: "Dos brochures",
        text: "un PDF por línea, cada uno con su propio descriptor bajo el mismo logotipo.",
      },
      {
        lead: "Cotización en un formulario",
        text: "nombre, empresa, servicio de interés y detalle, más dos WhatsApp en la cabecera.",
      },
      {
        lead: "WordPress con Elementor",
        text: "el cliente cambia textos y fotos sin llamarnos ni esperar un despliegue.",
      },
    ],
    challengeTitle: "Reto",
    challenge:
      "Un proveedor que limpia y cocina a la vez suena a poco serio si no se explica bien. Había que separar las dos líneas para que cada una se leyera especializada, sin partir la empresa en dos webs distintas.",
    approachTitle: "Enfoque",
    approach:
      "Cada línea tiene su color, su página y su brochure; la marca es la misma y solo cambia el descriptor bajo el logotipo. Las tarjetas de servicio llevan una etiqueta de familia para que nadie se pierda.",
    outcomesTitle: "Lo entregado",
    outcomes:
      "Fenalsa se quedó con fenalsa.com en WordPress, editable desde Elementor, con su formulario de cotización y los dos WhatsApp en la cabecera. No hicimos su marca ni su fotografía: las trajeron hechas.",
    stackTitle: "Disciplinas y tecnología",
    stack: [
      "Diseño y desarrollo web",
      "Arquitectura de contenido",
      "WordPress",
      "Elementor",
      "Tema hello-elementor",
      "Formulario de cotización",
      "Integración WhatsApp",
      "Diseño responsive",
      "SEO básico",
    ],
    leads: {
      servicios:
        "Una sola frase para las dos líneas: múltiples servicios, un solo proveedor, con el sello de homologación al lado.",
      interior:
        "Dentro de cada línea, lo que incluye el servicio y los cuatro pilares con los que lo defienden.",
      movil:
        "En el teléfono las dos líneas se apilan y el catálogo conserva su etiqueta de color.",
    },
    pies: {
      servicios:
        "fenalsa.com · los cuatro servicios de limpieza y el sello SGS de homologación",
      gastro: "fenalsa.com · la puerta de cocina, en claro",
      limpieza: "fenalsa.com · la puerta de limpieza, en el azul de la marca",
      interior:
        "fenalsa.com/limpieza · lo que incluye el servicio y sus cuatro pilares",
      equipo: "fenalsa.com/nosotros · el equipo, fotografiado en su cocina",
      formulario:
        "fenalsa.com/nosotros · el formulario de cotización, con el servicio de interés",
      movil: "fenalsa.com/cocina y /nosotros · el sitio en el teléfono",
    },
    alt: {
      servicios:
        "La sección «Multiples Servicios, Un Solo Proveedor» de fenalsa.com con cuatro tarjetas de limpieza",
      gastro:
        "La banda de servicio de alta gastronomía de fenalsa.com, con un cocinero sobre fondo claro",
      limpieza:
        "La banda de servicio de limpieza profesional de fenalsa.com, en azul",
      interior:
        "La página de limpieza de fenalsa.com con la lista de servicios y el collage de cuatro pilares",
      equipo:
        "La página Nosotros de fenalsa.com con la fotografía del equipo de Fenalsa",
      formulario:
        "El formulario de cotización de fenalsa.com con el desplegable de servicio de interés",
      movil:
        "Dos teléfonos con las páginas de cocina y de servicios de fenalsa.com",
    },
    nextTagline:
      "La otra web sola del portafolio: sitio, sorteo en blockchain y área privada",
  },
  en: {
    tagline:
      "The website of an Arequipa company that cleans and cooks for other companies",
    meta: [
      ["Status", "Live"],
      ["Deliverable", "Website"],
      ["Industry", "Collective catering and cleaning"],
      ["Scope", "Four pages"],
    ],
    statement:
      "For Fenalsa we built only the website, and the website had one concrete problem: a single company sells two things that look nothing alike — industrial cleaning and fine cooking — and visitors arrive looking for one.",
    context:
      "Fenalsa Servicios Generales SAC works out of Tiabaya, Arequipa: it feeds mine canteens and universities, and cleans offices, hotels and hospitals. On its client wall are Perumin, Tecnomina and Detroit Power System.",
    highlightsTitle: ["What we", "did"],
    highlights: [
      {
        lead: "Two doors from the home page",
        text: "a light band for the kitchen and a blue one for cleaning, given the same weight.",
      },
      {
        lead: "Four pages",
        text: "home, about, and one per line of business, with no menus that branch out.",
      },
      {
        lead: "Cross catalogue",
        text: "six services on cards tagged by family, blue for cleaning and green for kitchen.",
      },
      {
        lead: "Two brochures",
        text: "one PDF per line, each with its own descriptor under the same logotype.",
      },
      {
        lead: "Quote request form",
        text: "name, company, service of interest and detail, plus two WhatsApp numbers in the header.",
      },
      {
        lead: "WordPress with Elementor",
        text: "the client changes copy and photos without calling us or waiting for a deploy.",
      },
    ],
    challengeTitle: "Challenge",
    challenge:
      "A supplier that cleans and cooks at once sounds unserious unless it is explained well. We had to separate the two lines so each reads as specialised, without splitting the company into two different websites.",
    approachTitle: "Approach",
    approach:
      "Each line gets its colour, its page and its brochure; the brand stays the same and only the descriptor under the logotype changes. Service cards carry a family tag so nobody loses their way.",
    outcomesTitle: "What we handed over",
    outcomes:
      "Fenalsa kept fenalsa.com on WordPress, editable from Elementor, with its quote request form and the two WhatsApp numbers in the header. We did not make their brand or their photography: those arrived done.",
    stackTitle: "Disciplines and technology",
    stack: [
      "Web design and development",
      "Content architecture",
      "WordPress",
      "Elementor",
      "hello-elementor theme",
      "Quote request form",
      "WhatsApp integration",
      "Responsive design",
      "Basic SEO",
    ],
    leads: {
      servicios:
        "One sentence for both lines: multiple services, a single supplier, with the certification seal beside it.",
      interior:
        "Inside each line, what the service includes and the four pillars they defend it with.",
      movil:
        "On the phone the two lines stack up and the catalogue keeps its colour tag.",
    },
    pies: {
      servicios:
        "fenalsa.com · the four cleaning services and the SGS certification seal",
      gastro: "fenalsa.com · the kitchen door, in light",
      limpieza: "fenalsa.com · the cleaning door, in the brand's blue",
      interior:
        "fenalsa.com/limpieza · what the service includes and its four pillars",
      equipo: "fenalsa.com/nosotros · the team, photographed in their kitchen",
      formulario:
        "fenalsa.com/nosotros · the quote request form, with the service of interest",
      movil: "fenalsa.com/cocina and /nosotros · the site on a phone",
    },
    alt: {
      servicios:
        "The «Multiples Servicios, Un Solo Proveedor» section of fenalsa.com with four cleaning cards",
      gastro:
        "The fine cooking service band of fenalsa.com, with a chef on a light background",
      limpieza:
        "The professional cleaning service band of fenalsa.com, in blue",
      interior:
        "The cleaning page of fenalsa.com with the service list and the four-pillar collage",
      equipo: "The About page of fenalsa.com with a photograph of the team",
      formulario:
        "The fenalsa.com quote request form with the service-of-interest dropdown",
      movil: "Two phones showing the kitchen and services pages of fenalsa.com",
    },
    nextTagline:
      "The portfolio's other website-only case: site, blockchain raffle and private area",
  },
  pt: {
    tagline:
      "O site de uma empresa arequipenha que limpa e cozinha para outras empresas",
    meta: [
      ["Estado", "No ar"],
      ["Entregável", "Site"],
      ["Indústria", "Alimentação coletiva e limpeza"],
      ["Âmbito", "Quatro páginas"],
    ],
    statement:
      "Para a Fenalsa fizemos só o site, e o site tinha um problema concreto: a mesma empresa vende duas coisas que não se parecem — limpeza industrial e alta cozinha — e o visitante chega à procura de uma só.",
    context:
      "A Fenalsa Servicios Generales SAC opera de Tiabaya, Arequipa: dá de comer em cantinas de mina e universidades, e limpa escritórios, hotéis e hospitais. No seu mural de clientes estão Perumin, Tecnomina e Detroit Power System.",
    highlightsTitle: ["O que", "fizemos"],
    highlights: [
      {
        lead: "Duas portas a partir da capa",
        text: "uma faixa clara para a cozinha e uma azul para a limpeza, com o mesmo peso.",
      },
      {
        lead: "Quatro páginas",
        text: "início, sobre nós e uma por cada linha, sem menus que se ramifiquem.",
      },
      {
        lead: "Catálogo cruzado",
        text: "seis serviços em cartões etiquetados por família, azul limpeza e verde cozinha.",
      },
      {
        lead: "Dois brochures",
        text: "um PDF por linha, cada um com o seu descritor sob o mesmo logótipo.",
      },
      {
        lead: "Orçamento num formulário",
        text: "nome, empresa, serviço de interesse e detalhe, mais dois WhatsApp no cabeçalho.",
      },
      {
        lead: "WordPress com Elementor",
        text: "o cliente muda textos e fotos sem nos ligar nem esperar por uma publicação.",
      },
    ],
    challengeTitle: "Desafio",
    challenge:
      "Um fornecedor que limpa e cozinha ao mesmo tempo soa a pouco sério se não for bem explicado. Era preciso separar as duas linhas para que cada uma se lesse especializada, sem partir a empresa em dois sites.",
    approachTitle: "Abordagem",
    approach:
      "Cada linha tem a sua cor, a sua página e o seu brochure; a marca é a mesma e só muda o descritor sob o logótipo. Os cartões de serviço levam uma etiqueta de família para ninguém se perder.",
    outcomesTitle: "O que entregámos",
    outcomes:
      "A Fenalsa ficou com fenalsa.com em WordPress, editável a partir do Elementor, com o seu formulário de orçamento e os dois WhatsApp no cabeçalho. Não fizemos a marca nem a fotografia: trouxeram-nas prontas.",
    stackTitle: "Disciplinas e tecnologia",
    stack: [
      "Design e desenvolvimento web",
      "Arquitetura de conteúdo",
      "WordPress",
      "Elementor",
      "Tema hello-elementor",
      "Formulário de orçamento",
      "Integração WhatsApp",
      "Design responsivo",
      "SEO básico",
    ],
    leads: {
      servicios:
        "Uma só frase para as duas linhas: múltiplos serviços, um só fornecedor, com o selo de homologação ao lado.",
      interior:
        "Dentro de cada linha, o que o serviço inclui e os quatro pilares com que o defendem.",
      movil:
        "No telemóvel as duas linhas empilham-se e o catálogo mantém a sua etiqueta de cor.",
    },
    pies: {
      servicios:
        "fenalsa.com · os quatro serviços de limpeza e o selo SGS de homologação",
      gastro: "fenalsa.com · a porta da cozinha, em claro",
      limpieza: "fenalsa.com · a porta da limpeza, no azul da marca",
      interior:
        "fenalsa.com/limpieza · o que o serviço inclui e os seus quatro pilares",
      equipo: "fenalsa.com/nosotros · a equipa, fotografada na sua cozinha",
      formulario:
        "fenalsa.com/nosotros · o formulário de orçamento, com o serviço de interesse",
      movil: "fenalsa.com/cocina e /nosotros · o site no telemóvel",
    },
    alt: {
      servicios:
        "A secção «Multiples Servicios, Un Solo Proveedor» de fenalsa.com com quatro cartões de limpeza",
      gastro:
        "A faixa de serviço de alta gastronomia de fenalsa.com, com um cozinheiro sobre fundo claro",
      limpieza:
        "A faixa de serviço de limpeza profissional de fenalsa.com, em azul",
      interior:
        "A página de limpeza de fenalsa.com com a lista de serviços e a colagem de quatro pilares",
      equipo:
        "A página Sobre nós de fenalsa.com com a fotografia da equipa da Fenalsa",
      formulario:
        "O formulário de orçamento de fenalsa.com com a lista de serviço de interesse",
      movil:
        "Dois telemóveis com as páginas de cozinha e de serviços de fenalsa.com",
    },
    nextTagline:
      "O outro caso só de site do portfólio: site, sorteio em blockchain e área privada",
  },
};

/**
 * Diez bloques, cinco de imagen: TRES anchas y DOS pares de cuadradas, siete piezas.
 *
 * Alterna ancha → par → ancha → par → ancha, y ningún texto se queda huérfano: el reto
 * va entre el par de las dos puertas y la página de limpieza, el enfoque entre esa
 * página y el par del equipo, y «lo entregado» DELANTE de la última ancha —detrás, el
 * tramo final se iba a 920 px sin imagen, medido—. No hay actos porque solo hubo un
 * entregable.
 */
function bloques(c: Copy): StoryBlock[] {
  return [
    {
      kind: "wide",
      lead: c.leads.servicios,
      image: {
        src: `${IMG}/fe-catalogo.jpg`,
        alt: c.alt.servicios,
        caption: c.pies.servicios,
        mobileSrc: `${IMG}/fe-catalogo-movil.jpg`,
      },
    },
    { kind: "highlights", title: c.highlightsTitle, items: c.highlights },
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/fe-puerta-cocina.jpg`,
          alt: c.alt.gastro,
          caption: c.pies.gastro,
        },
        {
          src: `${IMG}/fe-puerta-limpieza.jpg`,
          alt: c.alt.limpieza,
          caption: c.pies.limpieza,
        },
      ],
    },
    { kind: "text", title: c.challengeTitle, body: c.challenge },
    {
      kind: "wide",
      lead: c.leads.interior,
      image: {
        src: `${IMG}/fe-interior.jpg`,
        alt: c.alt.interior,
        caption: c.pies.interior,
        mobileSrc: `${IMG}/fe-interior-movil.jpg`,
      },
    },
    { kind: "text", title: c.approachTitle, body: c.approach },
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/fe-equipo-nosotros.jpg`,
          alt: c.alt.equipo,
          caption: c.pies.equipo,
        },
        {
          src: `${IMG}/fe-cotizacion.jpg`,
          alt: c.alt.formulario,
          caption: c.pies.formulario,
        },
      ],
    },
    {
      kind: "text",
      id: "resultado",
      title: c.outcomesTitle,
      body: c.outcomes,
    },
    {
      kind: "wide",
      lead: c.leads.movil,
      image: {
        src: `${IMG}/fe-movil.jpg`,
        alt: c.alt.movil,
        caption: c.pies.movil,
        mobileSrc: `${IMG}/fe-movil-movil.jpg`,
      },
    },
    { kind: "tags", title: c.stackTitle, items: c.stack },
  ];
}

export default function FenalsaContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseStory
        /*
         * El acento es de Fenalsa, no de Axium. El azul del logotipo (#2A3E78) da 10,2:1
         * sobre blanco, así que sirve tal cual de `base`; sobre la tinta #060C20 daría
         * 1,9:1, y por eso `dark` es el verde del isotipo (#8CC63F), que ahí da 9,5:1.
         * `deep` es el azul profundo con el que cierra el degradado del hero.
         */
        accent={{ base: "#2A3E78", dark: "#8CC63F", deep: "#132247" }}
        name="Fenalsa"
        tagline={c.tagline}
        heroImage={`${IMG}/fe-hero.jpg`}
        heroPosition="62% 50%"
        logo={{ src: `${IMG}/fe-logo.png`, width: 1018, height: 461 }}
        liveUrl="https://www.fenalsa.com"
        meta={c.meta}
        statement={c.statement}
        context={c.context}
        blocks={bloques(c)}
        next={{
          name: "VitalChain",
          tagline: c.nextTagline,
          href: "/casos-de-exito/vitalchain",
          image: "/images/proyects/vitalchain/vc-portada.jpg",
        }}
        labels={STORY_LABELS[lang]}
      />
      {/* Sección clara para que el navbar se lea sobre la tarjeta oscura del formulario */}
      <div data-nav-theme="light" className="bg-white">
        <CaseContactCTA />
      </div>
    </>
  );
}
