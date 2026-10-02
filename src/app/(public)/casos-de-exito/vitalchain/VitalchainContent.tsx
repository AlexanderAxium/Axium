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
 * Ficha larga de VitalChain Academy. UN SOLO ENTREGABLE: la web.
 *
 * ── QUÉ SE ENTREGÓ, Y QUÉ NO ────────────────────────────────────────────────────────
 * Aquí no hubo identidad, ni manual, ni aplicaciones de marca: VitalChain llegó con su
 * logotipo y su tipografía hechos. Se entregó el sitio. Por eso la ficha es corta y
 * densa —once bloques, nueve piezas— y no se inventa un acto de marca que no ocurrió.
 *
 * ── EL SISTEMA DE IMAGEN (rehecho el 2026-10-01) ────────────────────────────────────
 * La galería anterior tenía catorce archivos y ONCE eran el mismo recurso: una captura
 * rectangular flotando sobre un campo rosa pálido. Alexander lo rechazó —«se ve muy
 * apretado, no hay buen margen, diseña bien» · «diseño pobre»— y tenía razón: dos de
 * esas piezas (`vc-panel`, `vc-portal`) metían una pantalla densa entera en 648 px
 * servidos, con el texto a ~6 px, y el par ni compartía régimen de márgenes.
 *
 * Esta versión aplica el §0 de ESTANDAR-FICHA.md —qué merece ser una pieza— y usa
 * SIETE recursos distintos, ninguno repetido más de dos veces:
 *   1 · a sangre, sin campo ......... `vc-apertura`, `vc-retiro-v2`
 *   2 · objeto físico del cliente ... `vc-coleccion` (las portadas de los eBooks,
 *       enderezadas desde los renders del propio sitio y recompuestas)
 *   3 · lámina de material real ..... `vc-idiomas` (las diez primeras páginas de
 *       «¿Qué es un NFT?», descargadas de los diez PDF que el sitio sirve desde IPFS)
 *   4 · diagrama anotado ............ `vc-mecanica` (HTML/CSS, cero IA: cada caja sale
 *       literal de vitalchainacademy.com/sorteo)
 *   5 · recorte de detalle .......... `vc-ticket`, `vc-verificable` (el par del sorteo:
 *       el número que recibe el comprador y el QR con el que cualquiera lo comprueba)
 *   6 · fotografía del cliente ...... `vc-equipo` (su propia foto bajo el rótulo)
 *   7 · dispositivo en escena ....... `vc-mano`, `vc-hero-v3` (el héroe)
 *
 * ── EL HÉROE, REHECHO (2026-10-01) ──────────────────────────────────────────────────
 * `vc-hero-v2` era la costa dálmata de su página de retiros: de los catorce héroes del
 * portafolio, el ÚNICO sin persona, sin producto y sin una sola huella del negocio. Y
 * se colaba como TARJETA en el carrusel «Más proyectos» de la ficha de Inner Soul
 * Bright, al lado de su propia portada. Alexander, 2026-10-01: «estas dos portadas
 * están pésimas, no muestran nada de la marca, ni del trabajo que se hizo, solo son
 * imágenes de paisajes» · «en portafolio se ve diferente, ese sí estaba bonito,
 * deberían coincidir». `vc-hero-v3` hereda el campo y los resplandores de su propia
 * portada (`vc-portada.jpg`) y cambia la figura: el celular del sorteo y la ventana de
 * la home, las dos capturas reales. Cero IA y cero créditos.
 * Taller: capturas-clientes/vitalchain/heroe/
 *
 * Lo que SE CAYÓ al pasar el filtro, y por qué: el panel de artículos del blog y el
 * editor (los tiene todo gestor de contenido del mundo), la página de guías completa
 * (la lámina de los diez PDF lo dice mejor), las cuatro tarjetas de «cómo participar»
 * y las tres de tecnología (el diagrama las sustituye a las dos), y la portada del
 * blog público (no prueba nada que no diga el móvil de `vc-mano`).
 *
 * ── DE DÓNDE SALE CADA PÍXEL ────────────────────────────────────────────────────────
 * Toda la interfaz es captura real: Playwright contra vitalchainacademy.com en vivo
 * (escritorio 1440×720 y 1600×800 @2x, el QR @3x, móvil 390×844 @3x) y, para el área
 * privada, los recortes del ÚNICO volcado que tenemos de ella —no hay credenciales—.
 * Los eBooks y la fotografía del equipo y de la costa son assets del propio cliente
 * descargados de su CDN. Los diez PDF se bajaron de su pasarela IPFS y se rasterizaron.
 * Lo ÚNICO generado (Higgsfield, gpt_image_2_5) es la escena VACÍA de `vc-mano`: una
 * sobremesa de lino con la pantalla en verde liso, sin una letra ni un píxel de
 * interfaz; encima se compuso la captura real con `scripts/componer_pantalla.py`.
 * Taller: .claude/skills/portafolio-axium/capturas-clientes/vitalchain/v2/
 *
 * Las SEIS piezas que llevan rotulación nuestra se rinden en es/en/pt desde el mismo
 * taller (`taller.html?l=en`), como en Feniz: `vc-<pieza>-<idioma>.jpg`. Las que no
 * llevan una letra propia —apertura, retiro, equipo, mano, hero— son un solo archivo.
 *
 * ── EL STACK, MEDIDO CONTRA EL SITIO EN VIVO ────────────────────────────────────────
 *   · `x-powered-by: Next.js` y 31 referencias a `_next/static`  → Next.js (y React).
 *   · `server: railway-hikari`, `x-railway-edge: gru1`           → Railway.
 *   · Clases de utilidad y colores `oklab(...)` en el CSS        → Tailwind CSS v4.
 * Lo que NO se puede medir desde fuera NO se declara.
 *
 * RITMO: once bloques, seis de imagen — TRES anchas y TRES pares de cuadradas, nueve
 * piezas. Ningún tramo pasa de 700 px sin imagen a 1440 y ningún párrafo pasa de 45
 * palabras en es/en/pt. `results` va vacío: la analítica es del cliente.
 */

const IMG = "/images/proyects/vitalchain";

/** Las nueve piezas del relato: tres anchas y tres pares de cuadradas. */
type Pieza =
  | "apertura"
  | "coleccion"
  | "idiomas"
  | "mecanica"
  | "ticket"
  | "verificable"
  | "retiro"
  | "equipo"
  | "mano";

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
  leads: { apertura: string; mecanica: string; retiro: string };
  pies: Record<Pieza, string>;
  alt: Record<Pieza, string>;
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    tagline:
      "El sitio, el embudo del sorteo y el área privada de una academia de bienestar",
    meta: [
      ["Estado", "En línea"],
      ["Entregable", "Sitio web"],
      ["Industria", "Bienestar y educación"],
      ["Idiomas", "Diez, en las guías"],
    ],
    statement:
      "La web entera de VitalChain: un sitio en Next.js que explica la academia, vende una colección de eBooks, sortea un apartamento con un número verificable en blockchain y deja que el comprador lo consulte.",
    context:
      "VitalChain Academy es una academia de bienestar que opera desde Europa mirando a Latinoamérica: formación, retiros, guías Web3 y un sorteo que financia sus misiones médicas. No hubo encargo de marca; llegaron con la suya hecha.",
    highlightsTitle: ["Lo que", "hicimos"],
    highlights: [
      {
        lead: "Sitio en Next.js",
        text: "siete páginas públicas, cuatro legales y el acceso con registro para quien compra.",
      },
      {
        lead: "Embudo del sorteo",
        text: "la colección de eBooks, el número único en blockchain y la página que explica los cuatro pasos.",
      },
      {
        lead: "Guías en diez idiomas",
        text: "ocho PDF educativos servidos desde IPFS, con el selector de idioma delante de la lista.",
      },
      {
        lead: "Blog con gestor propio",
        text: "diez artículos que el cliente escribe, destaca y publica desde su panel.",
      },
      {
        lead: "Portal del comprador",
        text: "entra con su correo y ve su ticket, el token y el estado on-chain.",
      },
      {
        lead: "Landing del retiro",
        text: "página aparte para los retiros de Croacia, con fechas, plazas y solicitud.",
      },
    ],
    challengeTitle: "Reto",
    challenge:
      "Un sorteo por internet parte con la sospecha encima: quien paga quiere saber que su número existe y que nadie lo movió. El sitio tenía que enseñar el mecanismo —no prometerlo— sin ahuyentar a un público que no usa criptomonedas.",
    approachTitle: "Enfoque",
    approach:
      "Separamos el sitio en tres velocidades: la portada resume, las landings de sorteo y retiro venden una cosa cada una, y el blog y las guías sostienen la confianza. El área privada aparece después de comprar, no antes.",
    outcomesTitle: "Lo entregado",
    outcomes:
      "VitalChain se quedó con el sitio publicado, el panel desde el que lo edita y el portal donde su comprador revisa el ticket. No publicamos cifras: la analítica es suya y no la hemos medido.",
    stackTitle: "Disciplinas y tecnología",
    stack: [
      "Diseño y desarrollo web",
      "Arquitectura de contenido",
      "Next.js",
      "React",
      "Tailwind CSS",
      "Gestor de contenido",
      "Área privada con registro",
      "Tickets NFT y guías en IPFS",
      "Despliegue en Railway",
      "SEO técnico",
      "Diseño responsive",
    ],
    leads: {
      apertura:
        "La portada dice a qué vino la academia y abre las dos puertas: empezar el camino o entrar al sorteo.",
      mecanica:
        "Cuatro pasos, dos redes y una fecha: el mecanismo entero del sorteo, dibujado tal como lo cuenta la página.",
      retiro:
        "Los retiros tienen landing propia: dos fechas en Croacia, doce plazas cada una y el cupo a la vista.",
    },
    pies: {
      apertura:
        "vitalchainacademy.com · la portada, con la colección de eBooks en marcha",
      coleccion:
        "Las portadas de la colección, fuera del carrusel que las pasa de largo",
      idiomas:
        "«¿Qué es un NFT?» en los diez idiomas que sirve el sitio desde IPFS",
      mecanica:
        "vitalchainacademy.com/sorteo · del eBook comprado al número que firma Chainlink",
      ticket: "Portal del cliente · el ticket, el token y el estado on-chain",
      verificable:
        "vitalchainacademy.com/sorteo · la tarjeta de verificación, ampliada",
      retiro:
        "vitalchainacademy.com/retreat · la landing del retiro, con las dos fechas",
      equipo:
        "vitalchainacademy.com · el equipo, bajo el rótulo de la academia",
      mano: "vitalchainacademy.com/blog · el blog como se lee en el móvil",
    },
    alt: {
      apertura:
        "La portada de vitalchainacademy.com con el titular «Bienestar integral con transparencia digital»",
      coleccion:
        "Las portadas de los eBooks de VitalChain, una impresa y otra en una tableta",
      idiomas:
        "Diez portadas de la guía «¿Qué es un NFT?» de VitalChain, una por idioma",
      mecanica:
        "Diagrama de los cuatro pasos del sorteo de VitalChain, con Polygon y Chainlink al pie",
      ticket:
        "El ticket NFT del portal de VitalChain ampliado, con su número de token y su estado",
      verificable:
        "La tarjeta de transparencia de VitalChain con el código QR de verificación del sorteo",
      retiro:
        "La portada del retiro de VitalChain sobre una selva, con las dos fechas de Croacia",
      equipo:
        "El equipo de VitalChain fotografiado bajo el rótulo de la academia",
      mano: "Un móvil con el blog de VitalChain sobre un mantel de lino, con té y eucalipto",
    },
    nextTagline:
      "La otra web sola del portafolio: cuatro páginas para una empresa que limpia y cocina",
  },
  en: {
    tagline:
      "The site, the raffle funnel and the private area of a wellbeing academy",
    meta: [
      ["Status", "Live"],
      ["Deliverable", "Website"],
      ["Industry", "Wellbeing and education"],
      ["Languages", "Ten, in the guides"],
    ],
    statement:
      "VitalChain's entire website: a Next.js site that explains the academy, sells an eBook collection, raffles an apartment with a number verifiable on chain, and lets the buyer look it up.",
    context:
      "VitalChain Academy is a wellbeing academy operating from Europe with its eyes on Latin America: training, retreats, Web3 guides and a raffle that funds its medical missions. There was no brand brief; they arrived with theirs made.",
    highlightsTitle: ["What we", "did"],
    highlights: [
      {
        lead: "Next.js site",
        text: "seven public pages, four legal ones and a sign-up area for whoever buys.",
      },
      {
        lead: "Raffle funnel",
        text: "the eBook collection, the unique number on chain and the page that explains the four steps.",
      },
      {
        lead: "Guides in ten languages",
        text: "eight educational PDFs served from IPFS, with the language picker ahead of the list.",
      },
      {
        lead: "Blog with its own editor",
        text: "ten articles the client writes, features and publishes from their panel.",
      },
      {
        lead: "Buyer portal",
        text: "they sign in with their email and see their ticket, the token and its on-chain state.",
      },
      {
        lead: "Retreat landing",
        text: "a separate page for the Croatia retreats, with dates, places and an application.",
      },
    ],
    challengeTitle: "Challenge",
    challenge:
      "An online raffle starts under suspicion: whoever pays wants to know their number exists and nobody moved it. The site had to show the mechanism — not promise it — without scaring off an audience that does not use crypto.",
    approachTitle: "Approach",
    approach:
      "We split the site into three speeds: the home page summarises, the raffle and retreat landings each sell one thing, and the blog and guides hold up the trust. The private area appears after buying, not before.",
    outcomesTitle: "What we handed over",
    outcomes:
      "VitalChain kept the published site, the panel they edit it from and the portal where their buyer checks the ticket. We publish no figures: the analytics are theirs and we have not measured them.",
    stackTitle: "Disciplines and technology",
    stack: [
      "Web design and development",
      "Content architecture",
      "Next.js",
      "React",
      "Tailwind CSS",
      "Content management",
      "Private area with sign-up",
      "NFT tickets and IPFS guides",
      "Deployed on Railway",
      "Technical SEO",
      "Responsive design",
    ],
    leads: {
      apertura:
        "The home page says what the academy came for and opens two doors: start the journey or enter the raffle.",
      mecanica:
        "Four steps, two networks and one date: the whole raffle mechanism, drawn exactly as the page tells it.",
      retiro:
        "The retreats get their own landing: two dates in Croatia, twelve places each and the count in plain sight.",
    },
    pies: {
      apertura:
        "vitalchainacademy.com · the home page, with the eBook collection running",
      coleccion:
        "The collection's covers, out of the carousel that slides them past",
      idiomas:
        "«What is an NFT?» in the ten languages the site serves from IPFS",
      mecanica:
        "vitalchainacademy.com/sorteo · from the eBook bought to the number Chainlink signs",
      ticket: "Client portal · the ticket, the token and the on-chain state",
      verificable:
        "vitalchainacademy.com/sorteo · the verification card, enlarged",
      retiro:
        "vitalchainacademy.com/retreat · the retreat landing, with both dates",
      equipo: "vitalchainacademy.com · the team, under the academy's sign",
      mano: "vitalchainacademy.com/blog · the blog as it reads on a phone",
    },
    alt: {
      apertura:
        "The vitalchainacademy.com home page with the headline «Holistic wellbeing with digital transparency»",
      coleccion:
        "The covers of VitalChain's eBooks, one printed and one on a tablet",
      idiomas:
        "Ten covers of VitalChain's «What is an NFT?» guide, one per language",
      mecanica:
        "Diagram of the four steps of VitalChain's raffle, with Polygon and Chainlink at the foot",
      ticket:
        "VitalChain's portal NFT ticket enlarged, with its token number and its state",
      verificable:
        "VitalChain's transparency card with the QR code that verifies the draw",
      retiro:
        "The VitalChain retreat home page over a jungle, with the two Croatia dates",
      equipo: "The VitalChain team photographed under the academy's sign",
      mano: "A phone showing VitalChain's blog on a linen cloth, with tea and eucalyptus",
    },
    nextTagline:
      "The portfolio's other website-only case: four pages for a company that cleans and cooks",
  },
  pt: {
    tagline:
      "O site, o funil do sorteio e a área privada de uma academia de bem-estar",
    meta: [
      ["Estado", "No ar"],
      ["Entregável", "Site"],
      ["Indústria", "Bem-estar e educação"],
      ["Idiomas", "Dez, nos guias"],
    ],
    statement:
      "O site inteiro da VitalChain: um site em Next.js que explica a academia, vende uma coleção de eBooks, sorteia um apartamento com um número verificável em blockchain e deixa o comprador consultá-lo.",
    context:
      "A VitalChain Academy é uma academia de bem-estar que opera da Europa olhando para a América Latina: formação, retiros, guias Web3 e um sorteio que financia suas missões médicas. Não houve encomenda de marca; chegaram com a deles pronta.",
    highlightsTitle: ["O que", "fizemos"],
    highlights: [
      {
        lead: "Site em Next.js",
        text: "sete páginas públicas, quatro legais e uma área com cadastro para quem compra.",
      },
      {
        lead: "Funil do sorteio",
        text: "a coleção de eBooks, o número único em blockchain e a página que explica os quatro passos.",
      },
      {
        lead: "Guias em dez idiomas",
        text: "oito PDF educativos servidos do IPFS, com o seletor de idioma antes da lista.",
      },
      {
        lead: "Blog com gestor próprio",
        text: "dez artigos que o cliente escreve, destaca e publica a partir do seu painel.",
      },
      {
        lead: "Portal do comprador",
        text: "entra com o seu e-mail e vê o bilhete, o token e o estado on-chain.",
      },
      {
        lead: "Landing do retiro",
        text: "página à parte para os retiros da Croácia, com datas, vagas e candidatura.",
      },
    ],
    challengeTitle: "Desafio",
    challenge:
      "Um sorteio pela internet começa sob suspeita: quem paga quer saber que o seu número existe e que ninguém o mexeu. O site tinha de mostrar o mecanismo — não prometê-lo — sem afastar um público que não usa criptomoedas.",
    approachTitle: "Abordagem",
    approach:
      "Separámos o site em três velocidades: a capa resume, as landings de sorteio e retiro vendem uma coisa cada uma, e o blog e os guias sustentam a confiança. A área privada aparece depois da compra, não antes.",
    outcomesTitle: "O que entregámos",
    outcomes:
      "A VitalChain ficou com o site publicado, o painel de onde o edita e o portal onde o comprador confere o bilhete. Não publicamos números: a analítica é deles e não a medimos.",
    stackTitle: "Disciplinas e tecnologia",
    stack: [
      "Design e desenvolvimento web",
      "Arquitetura de conteúdo",
      "Next.js",
      "React",
      "Tailwind CSS",
      "Gestor de conteúdo",
      "Área privada com cadastro",
      "Bilhetes NFT e guias em IPFS",
      "Implantação na Railway",
      "SEO técnico",
      "Design responsivo",
    ],
    leads: {
      apertura:
        "A capa diz a que veio a academia e abre duas portas: começar o caminho ou entrar no sorteio.",
      mecanica:
        "Quatro passos, duas redes e uma data: o mecanismo inteiro do sorteio, desenhado tal como a página o conta.",
      retiro:
        "Os retiros têm landing própria: duas datas na Croácia, doze vagas em cada uma e o limite à vista.",
    },
    pies: {
      apertura:
        "vitalchainacademy.com · a capa, com a coleção de eBooks a decorrer",
      coleccion: "As capas da coleção, fora do carrossel que as passa de largo",
      idiomas: "«O que é um NFT?» nos dez idiomas que o site serve do IPFS",
      mecanica:
        "vitalchainacademy.com/sorteo · do eBook comprado ao número que a Chainlink assina",
      ticket: "Portal do cliente · o bilhete, o token e o estado on-chain",
      verificable:
        "vitalchainacademy.com/sorteo · o cartão de verificação, ampliado",
      retiro:
        "vitalchainacademy.com/retreat · a landing do retiro, com as duas datas",
      equipo: "vitalchainacademy.com · a equipa, sob o letreiro da academia",
      mano: "vitalchainacademy.com/blog · o blog como se lê no telemóvel",
    },
    alt: {
      apertura:
        "A capa de vitalchainacademy.com com o título «Bem-estar integral com transparência digital»",
      coleccion:
        "As capas dos eBooks da VitalChain, uma impressa e outra num tablet",
      idiomas:
        "Dez capas do guia «O que é um NFT?» da VitalChain, uma por idioma",
      mecanica:
        "Diagrama dos quatro passos do sorteio da VitalChain, com Polygon e Chainlink no rodapé",
      ticket:
        "O bilhete NFT do portal da VitalChain ampliado, com o seu número de token e o seu estado",
      verificable:
        "O cartão de transparência da VitalChain com o código QR de verificação do sorteio",
      retiro:
        "A capa do retiro da VitalChain sobre uma selva, com as duas datas da Croácia",
      equipo: "A equipa da VitalChain fotografada sob o letreiro da academia",
      mano: "Um telemóvel com o blog da VitalChain sobre um pano de linho, com chá e eucalipto",
    },
    nextTagline:
      "O outro caso só de site do portfólio: quatro páginas para uma empresa que limpa e cozinha",
  },
};

/**
 * Once bloques, seis de imagen: TRES anchas y TRES pares de cuadradas, nueve piezas.
 *
 * El orden alterna ancha → par → ancha → par → ancha → par, y ningún tramo de texto se
 * queda solo. Cada par comparte régimen —mismo campo, mismos márgenes, mismo tamaño de
 * sujeto—, que es lo que hace que se lean como pareja y no como dos recortes sueltos:
 *   · par 1 · campo crema: el material publicado (los eBooks y los diez PDF).
 *   · par 2 · campo tinta: los dos recortes de detalle del sorteo (el número privado
 *     del comprador y la prueba pública con la que cualquiera lo comprueba).
 *   · par 3 · fotografía a sangre, sin campo: las personas y el sitio en la mano.
 * «Lo entregado» va DELANTE de la última ancha —si va detrás, el tramo final se va a
 * 920 px sin imagen, medido—. No hay actos porque solo hubo un entregable: una web.
 */
function bloques(c: Copy, lang: StoryLang): StoryBlock[] {
  return [
    {
      kind: "wide",
      lead: c.leads.apertura,
      image: {
        src: `${IMG}/vc-apertura.jpg`,
        alt: c.alt.apertura,
        caption: c.pies.apertura,
        mobileSrc: `${IMG}/vc-apertura-movil.jpg`,
      },
    },
    { kind: "highlights", title: c.highlightsTitle, items: c.highlights },
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/vc-coleccion-${lang}.jpg`,
          alt: c.alt.coleccion,
          caption: c.pies.coleccion,
        },
        {
          src: `${IMG}/vc-idiomas-${lang}.jpg`,
          alt: c.alt.idiomas,
          caption: c.pies.idiomas,
        },
      ],
    },
    { kind: "text", title: c.challengeTitle, body: c.challenge },
    {
      kind: "wide",
      lead: c.leads.mecanica,
      image: {
        src: `${IMG}/vc-mecanica-${lang}.jpg`,
        alt: c.alt.mecanica,
        caption: c.pies.mecanica,
        mobileSrc: `${IMG}/vc-mecanica-movil-${lang}.jpg`,
      },
    },
    { kind: "text", title: c.approachTitle, body: c.approach },
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/vc-ticket-${lang}.jpg`,
          alt: c.alt.ticket,
          caption: c.pies.ticket,
        },
        {
          src: `${IMG}/vc-verificable-${lang}.jpg`,
          alt: c.alt.verificable,
          caption: c.pies.verificable,
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
      lead: c.leads.retiro,
      image: {
        src: `${IMG}/vc-retiro-v2.jpg`,
        alt: c.alt.retiro,
        caption: c.pies.retiro,
        mobileSrc: `${IMG}/vc-retiro-v2-movil.jpg`,
      },
    },
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/vc-equipo.jpg`,
          alt: c.alt.equipo,
          caption: c.pies.equipo,
        },
        { src: `${IMG}/vc-mano.jpg`, alt: c.alt.mano, caption: c.pies.mano },
      ],
    },
    { kind: "tags", title: c.stackTitle, items: c.stack },
  ];
}

export default function VitalchainContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseStory
        /*
         * El acento es de VitalChain, no de Axium. Los colores salen medidos del CSS en
         * vivo: el rosa de marca es #C88BA7 y sobre blanco da 2,7:1, así que `base` es
         * ese mismo rosa oscurecido hasta 4,81:1 (#A55A7E); `dark` sí puede ser el rosa
         * de la marca, que sobre la tinta #060C20 da 7,1:1. `deep` es la ciruela con la
         * que cierra el degradado.
         */
        accent={{ base: "#A55A7E", dark: "#C88BA7", deep: "#5E2F46" }}
        name="VitalChain"
        tagline={c.tagline}
        heroImage={`${IMG}/vc-hero-v3.jpg`}
        heroPosition="50% 58%"
        logo={{ src: `${IMG}/vc-logo.png`, width: 984, height: 256 }}
        liveUrl="https://vitalchainacademy.com"
        meta={c.meta}
        statement={c.statement}
        context={c.context}
        blocks={bloques(c, lang)}
        next={{
          name: "Fenalsa",
          tagline: c.nextTagline,
          href: "/casos-de-exito/fenalsa",
          image: "/images/proyects/fenalsa/fenalsa-hero.jpg",
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
