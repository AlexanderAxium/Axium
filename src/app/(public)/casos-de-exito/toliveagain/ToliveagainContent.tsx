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
 * Ficha larga de To Live Again: el rediseño completo del sitio de la casa matriz
 * en Miami de una fundación contra el abuso doméstico.
 *
 * ── DE DÓNDE SALE CADA COSA (2026-10-01) ────────────────────────────────────────
 * TODA la interfaz es captura real de toliveagain.org EN VIVO. Nada se generó con
 * IA —no se gastó un solo crédito— ni se recompuso de memoria.
 *   · Capturas    Playwright contra el sitio en vivo: escritorio 1440×900 @2x y
 *                 móvil 390×844 @3x, en es y en en, con el idioma forzado por
 *                 `Accept-Language`. La cabecera del sitio es `position: fixed`,
 *                 así que todo lo que lleva barra se capturó POR VIEWPORT y nunca
 *                 recortando un fullPage. El botón flotante de WhatsApp se ocultó
 *                 por CSS: es quitar un widget, no inventar interfaz.
 *   · Láminas     HTML/CSS renderizado con Playwright a 2x (cero créditos), igual
 *                 que `fz-ea` y `fz-reglas` de Feniz.
 *   · Campo       los tokens del propio sitio (src/app/globals.css del repo del
 *                 rediseño) y, en la portada, el yeso rosa de su propio hero.
 *   · Logotipo    /img/logo-tla.png del sitio, con su alfa.
 *   Taller: .claude/skills/portafolio-axium/capturas-clientes/toliveagain/
 *
 * ── EL STACK, MEDIDO CONTRA EL SITIO ────────────────────────────────────────────
 * El JSON declaraba «Next.js, React, TypeScript, Tailwind CSS». Comprobado uno por
 * uno y los cuatro son ciertos: `x-powered-by: Next.js` y `/_next/static/` en el
 * HTML servido; React y React DOM 19 en `dependencies`; el repo es 100 % .ts/.tsx
 * con `typescript` en devDependencies; y la hoja servida trae las variables
 * `--tw-*` de Tailwind 4 (`@tailwindcss/postcss`). Se añaden dos que también se
 * miden: `sharp`, la única otra dependencia de producción, y Cloudflare, que
 * responde las cabeceras (`server: cloudflare`, `cf-ray`).
 *
 * ── EL ALCANCE, VERIFICADO ──────────────────────────────────────────────────────
 * Cuatro páginas por idioma y nada más: `/es` · `/es/fundacion` ·
 * `/es/lo-que-haces-importa` · `/es/unete`, con sus gemelas `/en`, `/en/foundation`,
 * `/en/what-you-do-matters` y `/en/join`. `/es/donar`, `/es/contacto`, `/es/blog` y
 * `/es/eventos` dan 404: no existen y la ficha no los menciona.
 *
 * ── LAS OCHO PIEZAS, POR EL §0 DEL ESTÁNDAR ─────────────────────────────────────
 * Nivel 1 («lo que sólo este producto hace»): las dos puertas, el menú con el
 * teléfono, el certificado 501(c)(3), el mapa de rutas bilingüe y los tres caminos
 * de donación. Nivel 2 («material fotográfico del cliente»): la galería de
 * #LoQueHacesImporta y los cuatro reconocimientos. El nivel 3 (escenografía
 * generada) queda fuera: la cuenta de Higgsfield está agotada y no hacía falta.
 * NO entraron, por el filtro 1: el formulario de contacto, el pie, el bloque de
 * misión y visión y el contador de impacto — eso lo tiene toda fundación del
 * mundo, y además esas cifras están marcadas «por confirmar» en el propio repo.
 *
 * ── SENSIBILIDAD ────────────────────────────────────────────────────────────────
 * Es una fundación contra el abuso doméstico. Las fotos que salen son su
 * comunicación pública —un aniversario, dos encuentros de emprendedoras y cuatro
 * premios— y se muestran como lo que son: actos. No hay un solo recorte cerrado
 * sobre una cara, ningún pie insinúa que alguien sea víctima, no se publica un
 * teléfono ni un correo de una persona (el +1 786-770-6764 es el de la fundación y
 * sale en su propia barra) y no se inventa ni una cifra de impacto.
 *
 * RITMO: once bloques, seis de imagen — CUATRO anchas y DOS pares, OCHO piezas.
 * Ningún tramo pasa de 700 px sin imagen (el mayor son los 650 de `highlights`) y
 * ningún párrafo pasa de 45 palabras en es/en/pt.
 */

const IMG = "/images/proyects/toliveagain";

/** Las ocho piezas del relato: cuatro anchas y dos pares de cuadradas. */
type Pieza =
  | "puertas"
  | "menu"
  | "certificado"
  | "rutas"
  | "premios"
  | "peru"
  | "galeria"
  | "donar";

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
  /** Sólo las piezas anchas llevan frase: un bloque `pair` no admite `lead`. */
  leads: { puertas: string; rutas: string; galeria: string; donar: string };
  pies: Record<Pieza, string>;
  alt: Record<Pieza, string>;
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    tagline:
      "El sitio de una fundación que tiene que hablarle a dos personas opuestas",
    meta: [
      ["Estado", "En línea"],
      ["Entregables", "Cuatro páginas, en español y en inglés"],
      ["Industria", "Fundación 501(c)(3) contra el abuso doméstico"],
      ["Alcance", "Rediseño completo, de WordPress a Next.js"],
    ],
    statement:
      "To Live Again recauda en Miami y trabaja en dos países. Rehicimos su sitio entero —cuatro páginas, en español y en inglés— alrededor de una sola decisión: la portada abre con dos puertas, «quiero ayudar» y «necesito ayuda».",
    context:
      "Venía de un folleto de WordPress con dos páginas, sólo en español y con la donación resuelta por un botón de PayPal. Diez años de talleres, reconocimientos y encuentros no cabían ahí.",
    highlightsTitle: ["Lo que", "construimos"],
    highlights: [
      {
        lead: "Cuatro páginas, dos idiomas",
        text: "portada, la fundación, #LoQueHacesImporta y únete, con el prefijo y el slug traducidos.",
      },
      {
        lead: "Las dos puertas",
        text: "quien puede ayudar va a donar; quien necesita ayuda, al WhatsApp de la fundación.",
      },
      {
        lead: "Donación con página propia",
        text: "tres caminos: tarjeta sin necesidad de cuenta, PayPal y Zelle desde Estados Unidos.",
      },
      {
        lead: "El 501(c)(3) a un toque",
        text: "el certificado se abre en grande desde el menú, en escritorio y en el celular.",
      },
      {
        lead: "La galería de los encuentros",
        text: "cuadrícula de cuatro columnas con una forma por foto, para que cada fila cierre entera.",
      },
      {
        lead: "Barra móvil con teléfono",
        text: "el número de la fundación a la vista, sin abrir el menú, en todas las páginas.",
      },
    ],
    challengeTitle: "Reto",
    challenge:
      "La misma pantalla tiene que convencer a quien puede donar desde Miami y no asustar a quien la abre desde una relación de la que todavía no sabe cómo salir. El tono que sirve a uno espanta al otro.",
    approachTitle: "Enfoque",
    approach:
      "Lo resolvió el orden: primero las dos puertas, después la trata de personas con el dato que más incomoda y recién entonces quiénes son. El idioma lo decide el país o el navegador, y se cambia en cualquier página.",
    outcomesTitle: "Lo entregado",
    outcomes:
      "toliveagain.org quedó en línea con sus cuatro páginas en dos idiomas, su galería de encuentros y su página de donación. No publicamos cifras de impacto: las cuenta la fundación en su propia web.",
    stackTitle: "Disciplinas y tecnología",
    stack: [
      "Rediseño de sitio",
      "Diseño UX/UI",
      "Arquitectura de contenido",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "sharp",
      "Enrutado bilingüe ES/EN",
      "SEO técnico",
      "Cloudflare",
    ],
    leads: {
      puertas:
        "La portada abre con dos puertas: una lleva a donar y la otra, al WhatsApp de la fundación.",
      rutas:
        "No se traduce sólo el texto: el prefijo y el slug de cada página cambian con el idioma.",
      galeria:
        "#LoQueHacesImporta: la fotografía de sus encuentros, con una forma de cuadrícula por foto.",
      donar:
        "Donar dejó de ser un botón suelto: tres caminos, cada uno con su razón de existir.",
    },
    pies: {
      puertas:
        "toliveagain.org/es · los dos botones del hero, ampliados, con su destino real",
      menu: "El menú en el celular: el teléfono de la fundación en la barra y el certificado en la lista",
      certificado:
        "El 501(c)(3) abierto desde el menú · el documento que la fundación publica en su sitio",
      rutas:
        "SLUGS en src/lib/idioma.ts · el hashtag de la campaña es lo único que no cambia de lado",
      premios:
        "toliveagain.org/es/fundacion · los cuatro reconocimientos, con su lugar y su año",
      peru: "La misma fundación en el Perú, con otro nombre · se cruza desde la página de la fundación",
      galeria:
        "toliveagain.org/es/lo-que-haces-importa · diez años en Miami, fotografías de la fundación",
      donar: "toliveagain.org/es/unete · tarjeta, PayPal y Zelle",
    },
    alt: {
      puertas:
        "Portada de toliveagain.org con los botones «quiero ayudar» y «necesito ayuda» ampliados",
      menu: "Menú de toliveagain.org en un teléfono, con el número de la fundación en la barra",
      certificado:
        "El certificado 501(c)(3) de To Live Again abierto en un teléfono",
      rutas:
        "Lámina con las barras de navegación en español y en inglés y las rutas equivalentes",
      premios:
        "Los reconocimientos de la fundación en la página de toliveagain.org",
      peru: "La sección que enlaza con Volver a Vivir, el anexo peruano de la fundación",
      galeria:
        "Cuadrícula de fotografías del aniversario de la fundación en Miami",
      donar:
        "Página de donación de toliveagain.org con tarjeta, PayPal y Zelle",
    },
    nextTagline: "El brazo peruano de la misma fundación, con casa propia",
  },

  en: {
    tagline: "The site of a foundation that must speak to two opposite people",
    meta: [
      ["Status", "Live"],
      ["Deliverables", "Four pages, in Spanish and in English"],
      ["Industry", "501(c)(3) foundation against domestic abuse"],
      ["Scope", "Full redesign, from WordPress to Next.js"],
    ],
    statement:
      "To Live Again raises funds in Miami and works across two countries. We rebuilt its whole site —four pages, in Spanish and in English— around a single decision: the home page opens with two doors, «I want to help» and «I need help».",
    context:
      "It came from a two-page WordPress brochure, Spanish only, with donating settled by a PayPal button. Ten years of workshops, awards and gatherings did not fit in there.",
    highlightsTitle: ["What we", "built"],
    highlights: [
      {
        lead: "Four pages, two languages",
        text: "home, the foundation, #LoQueHacesImporta and join us, with prefix and slug both translated.",
      },
      {
        lead: "The two doors",
        text: "whoever can help goes to donate; whoever needs help, to the foundation's WhatsApp.",
      },
      {
        lead: "Donating gets its own page",
        text: "three routes: card with no account needed, PayPal, and Zelle from the United States.",
      },
      {
        lead: "The 501(c)(3) one tap away",
        text: "the certificate opens full size from the menu, on desktop and on the phone.",
      },
      {
        lead: "The gallery of the gatherings",
        text: "a four-column grid with one shape per photo, so that every row closes whole.",
      },
      {
        lead: "Phone number in the mobile bar",
        text: "the foundation's number in plain sight, without opening the menu, on every page.",
      },
    ],
    challengeTitle: "Challenge",
    challenge:
      "The same screen has to convince someone who can donate from Miami and not frighten someone opening it from inside a relationship she does not yet know how to leave. The tone that serves one scares the other.",
    approachTitle: "Approach",
    approach:
      "The order solved it: first the two doors, then human trafficking with the figure that hurts most, and only then who they are. Language is decided by country or browser, and can be switched on any page.",
    outcomesTitle: "What was delivered",
    outcomes:
      "toliveagain.org went live with its four pages in two languages, its gallery of gatherings and its donation page. We publish no impact figures: the foundation tells those on its own site.",
    stackTitle: "Disciplines and technology",
    stack: [
      "Website redesign",
      "UX/UI design",
      "Content architecture",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "sharp",
      "Bilingual ES/EN routing",
      "Technical SEO",
      "Cloudflare",
    ],
    leads: {
      puertas:
        "The home page opens with two doors: one goes to donate, the other to the foundation's WhatsApp.",
      rutas:
        "It is not only the text that is translated: each page's prefix and slug change with the language.",
      galeria:
        "#LoQueHacesImporta: the photography of their gatherings, one grid shape per picture.",
      donar:
        "Donating is no longer a stray button: three routes, each with its own reason to exist.",
    },
    pies: {
      puertas:
        "toliveagain.org/es · both hero buttons, enlarged, with the destination each one carries",
      menu: "The menu on a phone: the foundation's number in the bar and the certificate in the list",
      certificado:
        "The 501(c)(3) opened from the menu · the document the foundation publishes on its own site",
      rutas:
        "SLUGS in src/lib/idioma.ts · the campaign hashtag is the only thing that does not change side",
      premios:
        "toliveagain.org/es/fundacion · the four awards, each with its place and its year",
      peru: "The same foundation in Peru, under another name · reached from the foundation page",
      galeria:
        "toliveagain.org/es/lo-que-haces-importa · ten years in Miami, the foundation's own photographs",
      donar: "toliveagain.org/es/unete · card, PayPal and Zelle",
    },
    alt: {
      puertas:
        "toliveagain.org home page with the «I want to help» and «I need help» buttons enlarged",
      menu: "toliveagain.org menu on a phone, with the foundation's number in the bar",
      certificado: "To Live Again's 501(c)(3) certificate opened on a phone",
      rutas:
        "Plate with the Spanish and English navigation bars and the matching routes",
      premios: "The foundation's awards on the toliveagain.org page",
      peru: "The section linking to Volver a Vivir, the foundation's Peruvian arm",
      galeria: "Grid of photographs from the foundation's anniversary in Miami",
      donar: "toliveagain.org donation page with card, PayPal and Zelle",
    },
    nextTagline:
      "The Peruvian arm of the same foundation, with a home of its own",
  },

  pt: {
    tagline:
      "O site de uma fundação que precisa falar com duas pessoas opostas",
    meta: [
      ["Estado", "No ar"],
      ["Entregáveis", "Quatro páginas, em espanhol e em inglês"],
      ["Indústria", "Fundação 501(c)(3) contra o abuso doméstico"],
      ["Escopo", "Redesenho completo, de WordPress a Next.js"],
    ],
    statement:
      "A To Live Again arrecada em Miami e trabalha em dois países. Refizemos o site inteiro —quatro páginas, em espanhol e em inglês— em torno de uma só decisão: a capa abre com duas portas, «quero ajudar» e «preciso de ajuda».",
    context:
      "Vinha de um folheto de WordPress com duas páginas, só em espanhol e com a doação resolvida por um botão de PayPal. Dez anos de oficinas, reconhecimentos e encontros não cabiam ali.",
    highlightsTitle: ["O que", "construímos"],
    highlights: [
      {
        lead: "Quatro páginas, dois idiomas",
        text: "capa, a fundação, #LoQueHacesImporta e junte-se, com o prefixo e o slug traduzidos.",
      },
      {
        lead: "As duas portas",
        text: "quem pode ajudar vai doar; quem precisa de ajuda, ao WhatsApp da fundação.",
      },
      {
        lead: "Doação com página própria",
        text: "três caminhos: cartão sem precisar de conta, PayPal e Zelle dos Estados Unidos.",
      },
      {
        lead: "O 501(c)(3) a um toque",
        text: "o certificado abre em tamanho grande pelo menu, no computador e no celular.",
      },
      {
        lead: "A galeria dos encontros",
        text: "grade de quatro colunas com uma forma por foto, para que cada linha feche inteira.",
      },
      {
        lead: "Barra móvel com telefone",
        text: "o número da fundação à vista, sem abrir o menu, em todas as páginas.",
      },
    ],
    challengeTitle: "Desafio",
    challenge:
      "A mesma tela precisa convencer quem pode doar de Miami e não assustar quem a abre de dentro de uma relação da qual ainda não sabe como sair. O tom que serve a um espanta o outro.",
    approachTitle: "Abordagem",
    approach:
      "Quem resolveu foi a ordem: primeiro as duas portas, depois o tráfico de pessoas com o dado que mais incomoda e só então quem são. O idioma é decidido pelo país ou pelo navegador, e muda em qualquer página.",
    outcomesTitle: "O que foi entregue",
    outcomes:
      "O toliveagain.org ficou no ar com suas quatro páginas em dois idiomas, sua galeria de encontros e sua página de doação. Não publicamos números de impacto: quem os conta é a fundação, no site dela.",
    stackTitle: "Disciplinas e tecnologia",
    stack: [
      "Redesenho de site",
      "Design UX/UI",
      "Arquitetura de conteúdo",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "sharp",
      "Roteamento bilíngue ES/EN",
      "SEO técnico",
      "Cloudflare",
    ],
    leads: {
      puertas:
        "A capa abre com duas portas: uma leva a doar e a outra ao WhatsApp da fundação.",
      rutas:
        "Não se traduz só o texto: o prefixo e o slug de cada página mudam com o idioma.",
      galeria:
        "#LoQueHacesImporta: a fotografia dos encontros, com uma forma de grade por foto.",
      donar:
        "Doar deixou de ser um botão solto: três caminhos, cada um com sua razão de existir.",
    },
    pies: {
      puertas:
        "toliveagain.org/es · os dois botões do hero, ampliados, com o destino real de cada um",
      menu: "O menu no celular: o telefone da fundação na barra e o certificado na lista",
      certificado:
        "O 501(c)(3) aberto pelo menu · o documento que a fundação publica no próprio site",
      rutas:
        "SLUGS em src/lib/idioma.ts · a hashtag da campanha é a única coisa que não muda de lado",
      premios:
        "toliveagain.org/es/fundacion · os quatro reconhecimentos, com seu lugar e seu ano",
      peru: "A mesma fundação no Peru, com outro nome · acessada pela página da fundação",
      galeria:
        "toliveagain.org/es/lo-que-haces-importa · dez anos em Miami, fotos da própria fundação",
      donar: "toliveagain.org/es/unete · cartão, PayPal e Zelle",
    },
    alt: {
      puertas:
        "Capa do toliveagain.org com os botões «quero ajudar» e «preciso de ajuda» ampliados",
      menu: "Menu do toliveagain.org num celular, com o número da fundação na barra",
      certificado:
        "O certificado 501(c)(3) da To Live Again aberto num celular",
      rutas:
        "Lâmina com as barras de navegação em espanhol e em inglês e as rotas equivalentes",
      premios: "Os reconhecimentos da fundação na página do toliveagain.org",
      peru: "A seção que leva ao Volver a Vivir, o anexo peruano da fundação",
      galeria: "Grade de fotografias do aniversário da fundação em Miami",
      donar: "Página de doação do toliveagain.org com cartão, PayPal e Zelle",
    },
    nextTagline: "O braço peruano da mesma fundação, com casa própria",
  },
};

/**
 * Once bloques. Cada bloque de texto va SOLO entre dos de imagen, y «lo entregado»
 * va delante de la última ancha: el cierre no son dos textos pegados.
 */
function bloques(c: Copy): StoryBlock[] {
  return [
    // La decisión de la que cuelga todo el encargo, primero.
    {
      kind: "wide",
      lead: c.leads.puertas,
      image: {
        src: `${IMG}/tla-puertas.jpg`,
        alt: c.alt.puertas,
        caption: c.pies.puertas,
        mobileSrc: `${IMG}/tla-puertas-movil.jpg`,
      },
    },
    { kind: "highlights", title: c.highlightsTitle, items: c.highlights },
    // Las dos formas de entrar al sitio desde un teléfono: el número y el certificado.
    {
      kind: "pair",
      images: [
        { src: `${IMG}/tla-menu.jpg`, alt: c.alt.menu, caption: c.pies.menu },
        {
          src: `${IMG}/tla-certificado.jpg`,
          alt: c.alt.certificado,
          caption: c.pies.certificado,
        },
      ],
    },
    { kind: "text", title: c.challengeTitle, body: c.challenge },
    {
      kind: "wide",
      lead: c.leads.rutas,
      image: {
        src: `${IMG}/tla-rutas.jpg`,
        alt: c.alt.rutas,
        caption: c.pies.rutas,
        mobileSrc: `${IMG}/tla-rutas-movil.jpg`,
      },
    },
    { kind: "text", title: c.approachTitle, body: c.approach },
    // La página de la fundación, en sus dos mitades: lo reconocido y el otro país.
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/tla-premios.jpg`,
          alt: c.alt.premios,
          caption: c.pies.premios,
        },
        { src: `${IMG}/tla-peru.jpg`, alt: c.alt.peru, caption: c.pies.peru },
      ],
    },
    {
      kind: "wide",
      lead: c.leads.galeria,
      image: {
        src: `${IMG}/tla-galeria.jpg`,
        alt: c.alt.galeria,
        caption: c.pies.galeria,
        mobileSrc: `${IMG}/tla-galeria-movil.jpg`,
      },
    },
    { kind: "text", id: "resultado", title: c.outcomesTitle, body: c.outcomes },
    {
      kind: "wide",
      lead: c.leads.donar,
      image: {
        src: `${IMG}/tla-donar.jpg`,
        alt: c.alt.donar,
        caption: c.pies.donar,
        mobileSrc: `${IMG}/tla-donar-movil.jpg`,
      },
    },
    { kind: "tags", title: c.stackTitle, items: c.stack },
  ];
}

export default function ToliveagainContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseStory
        /*
         * El acento es de To Live Again, no de Axium. Los tres salen de los tokens
         * del propio sitio (src/app/globals.css del repo del rediseño):
         *   base  #994556 «vino», el color de sus títulos sobre fondo claro —
         *         6,29:1 sobre blanco.
         *   dark  #E98996 «rosa medio», su acento — 7,85:1 sobre la tinta #060C20.
         *         El vino no sirve ahí: da 3,09:1.
         *   deep  #4C1529, el guinda #822C4C llevado a su tono más hondo para que
         *         el degradado de la tarjeta tenga recorrido — 14,52:1 contra el
         *         blanco del texto que lleva encima.
         */
        accent={{ base: "#994556", dark: "#E98996", deep: "#4C1529" }}
        name="To Live Again"
        tagline={c.tagline}
        heroImage={`${IMG}/tla-hero.jpg`}
        heroPosition="64% 42%"
        logo={{ src: `${IMG}/tla-logo.png`, width: 609, height: 251 }}
        liveUrl="https://toliveagain.org"
        meta={c.meta}
        statement={c.statement}
        context={c.context}
        blocks={bloques(c)}
        next={{
          name: "Volver a Vivir",
          tagline: c.nextTagline,
          href: "/casos-de-exito/volveravivir",
          image: "/images/proyects/volveravivir/volveravivir-portada.jpg",
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
