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
 * Ficha de Sportt Perú: la tienda de tenis de mesa que además pega el jebe a la
 * madera. Rehecha entera el 2026-10-05 contra el SITIO REDISEÑADO; lo que había
 * era de febrero y enseñaba el diseño viejo (dos tabletas negras con la tienda
 * anterior y tres posts de Instagram sueltos).
 *
 * ── POR QUÉ NO SE PARECE A ANJ SPORTS ──────────────────────────────────────────
 * ANJ (puesto 7) es la otra tienda de tenis de mesa del índice y ya tenía ficha
 * rehecha. Si Sportt saliera igual, la rejilla tendría dos tarjetas gemelas del
 * mismo rubro. Lo que se midió abriendo los dos sitios:
 *   · ANJ ordena por MARCA —«POPULAR EN XIOM», «POPULAR EN BUTTERFLY»— y su
 *     argumento son los 34 deportistas que patrocina desde 2010.
 *     Sportt ordena por CRITERIO DE JUEGO: «Jebes Lisos» y «Jebes con Cocos»
 *     son dos categorías distintas, que es como piensa un jugador.
 *   · Sportt tiene lo que ANJ no tiene: un SERVICIO DE TALLER —pegar el jebe a
 *     la madera, gratis— demostrado con un vídeo de 1:03 dentro de la portada,
 *     recojo en mostrador, pregunta por WhatsApp en cada ficha y Yape/Plin
 *     declarados en la página de producto.
 *   · Paleta: ANJ es marino #00002F con el cian de XIOM y el magenta de
 *     Butterfly; Sportt es blanco, casi negro #0A0A0A y SU magenta #EC4899.
 *     Tipografía: Druk Wide + AdihausDIN contra Chakra Petch + Satoshi.
 *   · Por eso la portada de Sportt es CLARA. La de ANJ es oscura, y dos tarjetas
 *     oscuras del mismo rubro serían gemelas se mire como se mire.
 *
 * ── DE DÓNDE SALE CADA COSA ────────────────────────────────────────────────────
 * Ni un píxel de interfaz, marca o producto generado por IA.
 *   · Capturas      sporttperu.com en vivo con Playwright, viewport 1920×1080 a
 *                   dsf 2 (3 840 px) y 390×844 a dsf 3 y 4, con barrido completo
 *                   y espera al lazy-loading antes de disparar.
 *   · Fotografía    las ocho fichas de categoría (`cat-*.webp`) y la foto del
 *                   pegado (`sportt-cta2.webp`) son del propio sitio de Sportt.
 *   · Vídeo         `sportt-pegado.mp4`, 1:03, el que la tienda reproduce en su
 *                   modal «Nuestro servicio de pegado». Los tres fotogramas de
 *                   la pieza salen de ahí; no se retocó ninguno.
 *   · Campaña       los archivos originales de las piezas que hicimos para su
 *                   Instagram, a 1 466 px.
 *   · Portada       campo generado con gpt-image-2.5-flare (ciclorama vacío, sin
 *                   una letra ni un objeto) + marco de móvil CONSTRUIDO en SVG +
 *                   captura real de la ficha de producto + el logotipo real,
 *                   des-matado del icono de 512 px de su propio sitio.
 *                   Script: scripts/portada-sportt.py
 *   Taller: .claude/skills/portafolio-axium/capturas-clientes/sportt/
 *
 * ── EL STACK, MEDIDO ───────────────────────────────────────────────────────────
 * El JSON declaraba «Next.js / Tailwind / TypeScript» y se quedaba corto: el
 * sitio es un INQUILINO DE VENDIQ. Pruebas: `x-powered-by: Next.js`, cabecera
 * `vary: rsc, next-router-state-tree` (App Router), tipografías servidas desde
 * `vendiq.pe/fonts/custom/`, y los assets en el bucket R2 de Vendiq
 * (`pub-a15fad…r2.dev`, el mismo `NEXT_PUBLIC_IMAGE_DOMAIN` del repo). La
 * portada entera viene de su editor de bloques: diez secciones y ~90 bloques con
 * identificador propio (hero, categorías, destacados, jebes, pegado, promos,
 * marcas, beneficios, pie y barra legal), incluido un bloque de vídeo en modal.
 * Versiones del repo Vendiq: Next 15.5.9 · React 19 · TypeScript 5.8 ·
 * Tailwind 4 · tRPC 11 · Prisma 6.16 · better-auth 1.3.
 * `results` va VACÍO: no tenemos su analítica y no se inventan métricas.
 *
 * TRES ACTOS:
 *   01 · El catálogo por juego     ocho familias, 149 productos, filtros
 *   02 · El taller en la tienda    pegado gratis, el vídeo, recojo en mostrador
 *   03 · La campaña vuelve a casa  las piezas de redes, hoy sección del home
 *
 * RITMO: catorce bloques, ocho de imagen —SEIS anchas y DOS pares, DIEZ piezas—.
 * Ningún par lleva una página entera: a 648 px servidos la tipografía caería a
 * 5 px, así que las cuatro piezas de par son recortes de detalle o pantallas de
 * móvil (§4 bis de ESTANDAR-FICHA).
 */

const IMG = "/images/proyects/sportt";

type Acto = { index: string; title: [string, string]; body: string };

/** Las diez piezas del relato: seis anchas y dos pares. */
type Pieza =
  | "escaparate"
  | "familias"
  | "filtros"
  | "movilCatalogo"
  | "ficha"
  | "pegado"
  | "carrito"
  | "movilPegado"
  | "campana"
  | "confianza";

type Copy = {
  tagline: string;
  meta: [string, string][];
  statement: string;
  context: string;
  highlightsTitle: [string, string];
  highlights: { lead: string; text: string }[];
  actos: Record<"catalogo" | "taller" | "campana", Acto>;
  outcomesTitle: string;
  outcomes: string;
  stackTitle: string;
  stack: string[];
  /**
   * Solo las piezas anchas llevan frase, y ni siquiera todas: `sp-ficha` va
   * pegada al par para formar una tira, y `sp-confianza` cierra la galería
   * después del bloque de resultados, donde no va ni una palabra más.
   */
  leads: {
    escaparate: string;
    familias: string;
    pegado: string;
    campana: string;
  };
  pies: Record<Pieza, string>;
  alt: Record<Pieza, string>;
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    tagline: "La tienda de tenis de mesa que no dejó de ser un taller",
    meta: [
      ["Estado", "En línea"],
      ["Entregables", "Rediseño de la tienda, catálogo por familias y campaña"],
      ["Industria", "Tenis de mesa · venta especializada"],
      ["Catálogo", "149 productos en trece categorías"],
      ["Plataforma", "Web (Next.js) sobre Vendiq"],
    ],
    statement:
      "Rehicimos sporttperu.com entera: el catálogo cortado por criterio de juego, y el servicio de pegado del taller dentro de la propia tienda.",
    context:
      "Sportt Perú distribuye Butterfly, Victas, Sanwei, Yasaka, Nittaku y Dr. Neubauer. No es un catálogo general: es una tienda de especialistas con mostrador.",
    highlightsTitle: ["Lo que", "construimos"],
    highlights: [
      {
        lead: "Ocho familias",
        text: "maderas, jebes lisos, jebes con cocos, raquetas, zapatillas, pelotitas, estuches y accesorios.",
      },
      {
        lead: "149 productos",
        text: "trece categorías, con filtro por familia y por precio.",
      },
      {
        lead: "Pegado gratis",
        text: "el servicio de taller, en la portada y con su vídeo.",
      },
      {
        lead: "Yape y Plin",
        text: "declarados en la ficha de producto y en el carrito.",
      },
      {
        lead: "Recojo o entrega",
        text: "mostrador o entrega coordinada, en uno o dos días.",
      },
      {
        lead: "Campaña en la tienda",
        text: "sus piezas de redes son hoy una sección de la portada.",
      },
    ],
    actos: {
      catalogo: {
        index: "Acto 01",
        title: ["El catálogo", "por juego"],
        body: "Un jugador no busca una marca: busca un jebe liso o uno con cocos. El catálogo se cortó por esa frontera, y el filtro repite la misma lógica.",
      },
      taller: {
        index: "Acto 02",
        title: ["El taller", "en la tienda"],
        body: "Comprar la madera y el jebe por separado deja al jugador con dos piezas sueltas. Sportt las pega gratis, y lo demuestra en vídeo.",
      },
      campana: {
        index: "Acto 03",
        title: ["La campaña", "vuelve a casa"],
        body: "Las piezas que hicimos para su Instagram tenían plantilla propia. El rediseño la trajo a la portada: hoy son una sección de la tienda.",
      },
    },
    outcomesTitle: "Lo entregado",
    outcomes:
      "149 productos, trece categorías, seis marcas distribuidas y cobro con Yape, Plin, transferencia o tarjeta. No publicamos cifras de venta: su analítica no es nuestra.",
    stackTitle: "Disciplinas y tecnología",
    stack: [
      "Diseño UX/UI",
      "Rediseño web",
      "Comercio electrónico",
      "Diseño de campaña",
      "Next.js",
      "App Router",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Vendiq",
      "Cloudflare R2",
    ],
    leads: {
      escaparate: "Abre con una campaña de temporada a sangre.",
      familias: "Cada familia, con su propia fotografía de estudio.",
      pegado: "El pegado no se cuenta: se enseña.",
      campana: "Las piezas que hicimos para sus redes.",
    },
    pies: {
      escaparate: "sporttperu.com — portada y navegación por familias",
      familias: "Categorías principales — fichas de categoría del sitio",
      filtros: "/productos — filtro por categoría y por precio",
      movilCatalogo: "/productos en el teléfono",
      ficha: "/producto/tenergy-05-fx — página y cuadro de compra",
      pegado: "«Nuestro servicio de pegado» — vídeo de 1:03 del propio taller",
      carrito: "/carrito en el teléfono — envío y total",
      movilPegado: "La banda de pegado en el teléfono",
      campana: "Piezas de campaña para Instagram",
      confianza: "Marcas distribuidas, promesas de servicio y pie del sitio",
    },
    alt: {
      escaparate:
        "Portada de sporttperu.com con la campaña Lezoline y la barra de familias",
      familias:
        "Las ocho familias del catálogo de Sportt sobre fondo oscuro: maderas, jebes lisos, jebes con cocos, raquetas, zapatillas, pelotitas, estuches y accesorios",
      filtros:
        "Filtro de categorías abierto sobre el catálogo de 149 productos de Sportt",
      movilCatalogo: "El catálogo de Sportt en un teléfono",
      ficha:
        "Ficha del jebe Tenergy 05 FX en sporttperu.com, con el cuadro de compra ampliado",
      pegado:
        "La cabecera del modal «Nuestro servicio de pegado» y la secuencia del vídeo del taller: encolado, prensado y recorte del jebe sobre la madera",
      carrito:
        "Carrito de Sportt en el teléfono, con recojo en tienda y entrega coordinada",
      movilPegado: "La banda de Pegado Gratis de Sportt en un teléfono",
      campana: "Tres piezas de campaña de Sportt Perú para Instagram",
      confianza:
        "Marcas distribuidas por Sportt, sus tres promesas de servicio y el pie del sitio",
    },
    nextTagline: "La tienda de vinos, piscos y macerados de la vitivinícola",
  },

  en: {
    tagline: "The table tennis shop that never stopped being a workshop",
    meta: [
      ["Status", "Live"],
      ["Deliverables", "Store redesign, catalogue by family and campaign work"],
      ["Industry", "Table tennis · specialist retail"],
      ["Catalogue", "149 products across thirteen categories"],
      ["Platform", "Web (Next.js) on Vendiq"],
    ],
    statement:
      "We rebuilt sporttperu.com from scratch: the catalogue cut by how the game is played, and the workshop's gluing service inside the store itself.",
    context:
      "Sportt Perú distributes Butterfly, Victas, Sanwei, Yasaka, Nittaku and Dr. Neubauer. It is not a general catalogue: it is a specialist shop with a counter.",
    highlightsTitle: ["What we", "built"],
    highlights: [
      {
        lead: "Eight families",
        text: "blades, smooth rubbers, pimpled rubbers, bats, shoes, balls, cases and accessories.",
      },
      {
        lead: "149 products",
        text: "thirteen categories, with filters by family and by price.",
      },
      {
        lead: "Free gluing",
        text: "the workshop service, on the home page and on video.",
      },
      {
        lead: "Yape and Plin",
        text: "spelled out on the product page and in the cart.",
      },
      {
        lead: "Pickup or delivery",
        text: "counter pickup or arranged delivery, in one or two days.",
      },
      {
        lead: "Campaign on the store",
        text: "their social pieces are now a section of the home page.",
      },
    ],
    actos: {
      catalogo: {
        index: "Act 01",
        title: ["The catalogue", "by play"],
        body: "A player does not look for a brand: he looks for a smooth rubber or a pimpled one. The catalogue was cut along that line, and the filter repeats it.",
      },
      taller: {
        index: "Act 02",
        title: ["The workshop", "inside the store"],
        body: "Buying the blade and the rubber separately leaves the player with two loose parts. Sportt glues them for free, and proves it on video.",
      },
      campana: {
        index: "Act 03",
        title: ["The campaign", "comes home"],
        body: "The pieces we made for their Instagram had a template of their own. The redesign brought it onto the home page: today they are a section of the store.",
      },
    },
    outcomesTitle: "What was delivered",
    outcomes:
      "149 products, thirteen categories, six distributed brands and payment by Yape, Plin, transfer or card. We publish no sales figures: their analytics are not ours.",
    stackTitle: "Disciplines and technology",
    stack: [
      "UX/UI design",
      "Web redesign",
      "E-commerce",
      "Campaign design",
      "Next.js",
      "App Router",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Vendiq",
      "Cloudflare R2",
    ],
    leads: {
      escaparate: "It opens with a full-bleed seasonal campaign.",
      familias: "Every family, with its own studio photograph.",
      pegado: "The gluing is not told: it is shown.",
      campana: "The pieces we made for their social feed.",
    },
    pies: {
      escaparate: "sporttperu.com — home page and navigation by family",
      familias: "Main categories — the site's own category cards",
      filtros: "/productos — filter by category and by price",
      movilCatalogo: "/productos on a phone",
      ficha: "/producto/tenergy-05-fx — page and buy box",
      pegado: "«Nuestro servicio de pegado» — the workshop's own 1:03 video",
      carrito: "/carrito on a phone — shipping and total",
      movilPegado: "The gluing band on a phone",
      campana: "Campaign pieces for Instagram",
      confianza: "Distributed brands, service promises and the site footer",
    },
    alt: {
      escaparate:
        "sporttperu.com home page with the Lezoline campaign and the family navigation bar",
      familias:
        "The eight families of Sportt's catalogue on a dark field: blades, smooth rubbers, pimpled rubbers, bats, shoes, balls, cases and accessories",
      filtros: "Category filter open over Sportt's catalogue of 149 products",
      movilCatalogo: "Sportt's catalogue on a phone",
      ficha:
        "Tenergy 05 FX rubber page on sporttperu.com, with the buy box enlarged",
      pegado:
        "The header of the «Nuestro servicio de pegado» modal and the sequence from the workshop video: gluing, pressing and trimming the rubber onto the blade",
      carrito:
        "Sportt's cart on a phone, with store pickup and arranged delivery",
      movilPegado: "Sportt's free gluing band on a phone",
      campana: "Three Sportt Perú campaign pieces for Instagram",
      confianza:
        "Brands distributed by Sportt, its three service promises and the site footer",
    },
    nextTagline: "The winery's shop for wines, piscos and macerates",
  },

  pt: {
    tagline: "A loja de tênis de mesa que nunca deixou de ser uma oficina",
    meta: [
      ["Estado", "No ar"],
      ["Entregas", "Redesenho da loja, catálogo por famílias e campanha"],
      ["Indústria", "Tênis de mesa · venda especializada"],
      ["Catálogo", "149 produtos em treze categorias"],
      ["Plataforma", "Web (Next.js) sobre Vendiq"],
    ],
    statement:
      "Refizemos o sporttperu.com inteiro: o catálogo cortado pelo critério de jogo, e o serviço de colagem da oficina dentro da própria loja.",
    context:
      "A Sportt Perú distribui Butterfly, Victas, Sanwei, Yasaka, Nittaku e Dr. Neubauer. Não é um catálogo geral: é uma loja de especialistas com balcão.",
    highlightsTitle: ["O que", "construímos"],
    highlights: [
      {
        lead: "Oito famílias",
        text: "madeiras, borrachas lisas, borrachas com pinos, raquetes, tênis, bolas, capas e acessórios.",
      },
      {
        lead: "149 produtos",
        text: "treze categorias, com filtro por família e por preço.",
      },
      {
        lead: "Colagem grátis",
        text: "o serviço de oficina, na capa e em vídeo.",
      },
      {
        lead: "Yape e Plin",
        text: "declarados na página de produto e no carrinho.",
      },
      {
        lead: "Retirada ou entrega",
        text: "balcão ou entrega combinada, em um ou dois dias.",
      },
      {
        lead: "Campanha na loja",
        text: "as suas peças de redes são hoje uma seção da capa.",
      },
    ],
    actos: {
      catalogo: {
        index: "Ato 01",
        title: ["O catálogo", "por jogo"],
        body: "Um jogador não procura uma marca: procura uma borracha lisa ou uma com pinos. O catálogo foi cortado por essa fronteira, e o filtro repete a lógica.",
      },
      taller: {
        index: "Ato 02",
        title: ["A oficina", "dentro da loja"],
        body: "Comprar a madeira e a borracha separadas deixa o jogador com duas peças soltas. A Sportt cola de graça, e prova isso em vídeo.",
      },
      campana: {
        index: "Ato 03",
        title: ["A campanha", "volta para casa"],
        body: "As peças que fizemos para o Instagram tinham um modelo próprio. O redesenho o trouxe para a capa: hoje são uma seção da loja.",
      },
    },
    outcomesTitle: "O que foi entregue",
    outcomes:
      "149 produtos, treze categorias, seis marcas distribuídas e cobrança por Yape, Plin, transferência ou cartão. Não publicamos números de venda: a analítica não é nossa.",
    stackTitle: "Disciplinas e tecnologia",
    stack: [
      "Design UX/UI",
      "Redesenho web",
      "Comércio eletrônico",
      "Design de campanha",
      "Next.js",
      "App Router",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Vendiq",
      "Cloudflare R2",
    ],
    leads: {
      escaparate: "Abre com uma campanha de temporada em sangria.",
      familias: "Cada família, com a sua própria fotografia de estúdio.",
      pegado: "A colagem não se conta: mostra-se.",
      campana: "As peças que fizemos para as suas redes.",
    },
    pies: {
      escaparate: "sporttperu.com — capa e navegação por famílias",
      familias: "Categorias principais — fichas de categoria do site",
      filtros: "/productos — filtro por categoria e por preço",
      movilCatalogo: "/productos no telefone",
      ficha: "/producto/tenergy-05-fx — página e caixa de compra",
      pegado: "«Nuestro servicio de pegado» — vídeo de 1:03 da própria oficina",
      carrito: "/carrito no telefone — envio e total",
      movilPegado: "A faixa de colagem no telefone",
      campana: "Peças de campanha para Instagram",
      confianza: "Marcas distribuídas, promessas de serviço e rodapé do site",
    },
    alt: {
      escaparate:
        "Capa do sporttperu.com com a campanha Lezoline e a barra de famílias",
      familias:
        "As oito famílias do catálogo da Sportt sobre fundo escuro: madeiras, borrachas lisas, borrachas com pinos, raquetes, tênis, bolas, capas e acessórios",
      filtros:
        "Filtro de categorias aberto sobre o catálogo de 149 produtos da Sportt",
      movilCatalogo: "O catálogo da Sportt num telefone",
      ficha:
        "Página da borracha Tenergy 05 FX no sporttperu.com, com a caixa de compra ampliada",
      pegado:
        "O cabeçalho do modal «Nuestro servicio de pegado» e a sequência do vídeo da oficina: colagem, prensagem e recorte da borracha sobre a madeira",
      carrito:
        "Carrinho da Sportt no telefone, com retirada na loja e entrega combinada",
      movilPegado: "A faixa de colagem grátis da Sportt num telefone",
      campana: "Três peças de campanha da Sportt Perú para Instagram",
      confianza:
        "Marcas distribuídas pela Sportt, as suas três promessas de serviço e o rodapé do site",
    },
    nextTagline: "A loja de vinhos, piscos e macerados da vinícola",
  },
};

function bloques(c: Copy): StoryBlock[] {
  return [
    // ── EL ESCAPARATE ──
    {
      kind: "wide",
      lead: c.leads.escaparate,
      image: {
        src: `${IMG}/sp-escaparate.jpg`,
        alt: c.alt.escaparate,
        caption: c.pies.escaparate,
        mobileSrc: `${IMG}/sp-escaparate-movil.jpg`,
      },
    },
    { kind: "highlights", title: c.highlightsTitle, items: c.highlights },
    {
      kind: "wide",
      lead: c.leads.familias,
      image: {
        src: `${IMG}/sp-familias.jpg`,
        alt: c.alt.familias,
        caption: c.pies.familias,
        mobileSrc: `${IMG}/sp-familias-movil.jpg`,
      },
    },

    // ── ACTO 01 · EL CATÁLOGO POR JUEGO ──
    {
      kind: "act",
      index: c.actos.catalogo.index,
      title: c.actos.catalogo.title,
      body: c.actos.catalogo.body,
    },
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/sp-filtros.jpg`,
          alt: c.alt.filtros,
          caption: c.pies.filtros,
        },
        {
          src: `${IMG}/sp-movil-catalogo.jpg`,
          alt: c.alt.movilCatalogo,
          caption: c.pies.movilCatalogo,
        },
      ],
    },
    // Sin `lead`: va pegada al par, y así las dos piezas forman una tira de 1.304 px
    {
      kind: "wide",
      image: {
        src: `${IMG}/sp-ficha.jpg`,
        alt: c.alt.ficha,
        caption: c.pies.ficha,
        mobileSrc: `${IMG}/sp-ficha-movil.jpg`,
      },
    },

    // ── ACTO 02 · EL TALLER EN LA TIENDA ──
    {
      kind: "act",
      index: c.actos.taller.index,
      title: c.actos.taller.title,
      body: c.actos.taller.body,
    },
    {
      kind: "wide",
      lead: c.leads.pegado,
      image: {
        src: `${IMG}/sp-pegado.jpg`,
        alt: c.alt.pegado,
        caption: c.pies.pegado,
        mobileSrc: `${IMG}/sp-pegado-movil.jpg`,
      },
    },
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/sp-carrito.jpg`,
          alt: c.alt.carrito,
          caption: c.pies.carrito,
        },
        {
          src: `${IMG}/sp-movil-pegado.jpg`,
          alt: c.alt.movilPegado,
          caption: c.pies.movilPegado,
        },
      ],
    },

    // ── ACTO 03 · LA CAMPAÑA VUELVE A CASA ──
    {
      kind: "act",
      index: c.actos.campana.index,
      title: c.actos.campana.title,
      body: c.actos.campana.body,
    },
    {
      kind: "wide",
      lead: c.leads.campana,
      image: {
        src: `${IMG}/sp-campana.jpg`,
        alt: c.alt.campana,
        caption: c.pies.campana,
        mobileSrc: `${IMG}/sp-campana-movil.jpg`,
      },
    },
    // Después del bloque de resultados no va más texto: la última pieza va seguida.
    { kind: "text", id: "resultado", title: c.outcomesTitle, body: c.outcomes },
    // Sin `lead`: después del bloque de resultados no va NI UNA palabra más (§3 bis)
    {
      kind: "wide",
      image: {
        src: `${IMG}/sp-confianza.jpg`,
        alt: c.alt.confianza,
        caption: c.pies.confianza,
        mobileSrc: `${IMG}/sp-confianza-movil.jpg`,
      },
    },
    { kind: "tags", title: c.stackTitle, items: c.stack },
  ];
}

export default function SporttContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseStory
        /*
         * El acento es de Sportt, no de Axium. `base` es el magenta de su propio
         * botón de compra (#BE185D, 6,04:1 sobre blanco). `dark` es el magenta
         * de su logotipo (#FD4391, 5,91:1 sobre la tinta #060C20), porque el
         * #BE185D sobre oscuro se queda en 3,22:1 y no pasa. `deep` es ese mismo
         * magenta llevado a sombra para el degradado del hero (15,7:1 contra el
         * blanco del texto que lleva encima).
         */
        accent={{ base: "#BE185D", dark: "#FD4391", deep: "#42102A" }}
        name="Sportt Perú"
        tagline={c.tagline}
        heroImage={`${IMG}/sp-hero.jpg`}
        heroPosition="38% 52%"
        logo={{ src: `${IMG}/sp-logo.png`, width: 780, height: 181 }}
        liveUrl="https://sporttperu.com"
        meta={c.meta}
        statement={c.statement}
        context={c.context}
        blocks={bloques(c)}
        next={{
          name: "Vitivinícola Luján",
          tagline: c.nextTagline,
          href: "/casos-de-exito/lujan",
          image: "/images/proyects/lujan/lujan-home.jpg",
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
