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
 * Ficha larga de Inner Soul Bright. UN SOLO ENTREGABLE: la web — y por eso los tres actos
 * NO son tres entregables, sino las tres decisiones que tuvo ese encargo.
 *
 * ── EL ALCANCE ──────────────────────────────────────────────────────────────────────
 * TRES vistas construidas (`/`, `/servicios`, `/sobre-mi`, con enrutado de cliente) en
 * CINCO idiomas con la traducción completa, y el diseño es el entregable.
 *   01 · La atmósfera   el sistema de tipo y color que gobierna las tres páginas
 *   02 · El contenido   cuatro servicios con su color y su límite, seis pasos, siete días
 *
 * ── POR QUÉ NO HAY ACTO DE LOS IDIOMAS (2026-10-01) ─────────────────────────────────
 * Lo hubo, y Alexander lo quitó: «ese titulo e imagen estan demas». La pieza enseñaba el
 * selector abierto con sus cinco banderas y el titular repetido en cinco idiomas — un
 * hecho cierto, pero que no necesita una imagen para creerse. Vive donde se comprueba
 * sin cámara: en los destacados («Cinco idiomas») y en el stack («i18next · cinco
 * idiomas»). Misma regla que mató el acto del movimiento: un acto que no necesita
 * prueba visual no es un acto, es un dato.
 *
 * ── POR QUÉ NO HAY ACTO DEL MOVIMIENTO (2026-10-01) ─────────────────────────────────
 * Lo hubo, y se cayó. La pieza que lo sostenía era la rejilla de servicios fotografiada a
 * mitad de su animación de entrada; la cuarta tarjeta quedaba al 9 % de contraste y
 * Alexander la leyó como lo que parecía: «se ve borroso lo del último card». Y tenía
 * razón de fondo, no solo de forma: **un fotograma quieto no puede probar movimiento**,
 * y el pie tenía que avisar de que la pieza no estaba rota («es un disparo real, no un
 * montaje»). Una pieza que necesita ese aviso es una pieza cuya idea falló. El hecho —28
 * bloques que entran al asomar en pantalla— vive ahora donde se puede comprobar sin
 * cámara: en el listado de disciplinas y tecnología.
 *
 * ── LA PORTADA NO SE TOCA ───────────────────────────────────────────────────────────
 * `innersoulbright-home.png` se queda como está, por pedido expreso de Alexander
 * («no cambies la portada q me gusta»). Enseña el hero OSCURO y cósmico de /sobre-mi,
 * así que NINGUNA pieza de la galería repite esa vista: la apertura usa el hero CLARO
 * de la portada, y el hero de la ficha es la fotografía de bosque del propio cliente.
 *
 * ── EL STACK, MEDIDO CONTRA EL SITIO EN VIVO (no contra el JSON viejo) ───────────────
 *   · `innersoulbright.com` sirve 2 KB con `<div id="root">` y un módulo
 *     `/assets/index-<hash>.js` → SPA de React construida con VITE. NO hay Next.js
 *     (cero `/_next/`), y el servidor es `hcdn` (Hostinger).
 *   · React Router: las rutas declaradas son `/`, `/servicios`, `/sobre-mi` y `*`. Por
 *     eso el servidor devuelve 403/404 en las internas: el enrutado es solo de cliente,
 *     y para capturarlas hay que HACER CLIC en el enlace, no navegar por URL.
 *   · Tailwind CSS (951 apariciones de `--tw-`), Motion (28 `whileInView`, dos
 *     `useScroll`), Radix UI + sonner + Lucide → patrón shadcn/ui.
 *   · i18next con `localStorage.i18nextLng` y cinco idiomas.
 *   · Google Fonts: Cormorant Garamond (300–600 + itálicas) y Questrial.
 *   · `:root` declara nueve tonos y OCHO degradados; la escala es 60/48/20/16/12 px.
 *   · JSON-LD `Organization`, canonical, Open Graph y Twitter Card.
 * TypeScript NO se puede medir desde fuera, así que NO se declara.
 *
 * ── DE DÓNDE SALE CADA PÍXEL ────────────────────────────────────────────────────────
 * Toda la interfaz es captura real con Playwright contra innersoulbright.com en vivo.
 * CERO imagen generada con IA (Higgsfield estaba a 0,77 créditos y no se gastó ninguno).
 *   1 · ventana de navegador sobre campo noche .. `isb-portada`. El campo es el propio
 *       `--gradient-dark-gold` del sitio con una caída de luz dorada y otra celeste,
 *       grano fino y la sombra de la ventana en la dirección de esa luz.
 *   2 · sección a sangre en su ancho exacto .... `isb-llamada` (viewport 660, donde la
 *       sección es cuadrada), `isb-limites` (1440, donde mide 2:1 clavado) y
 *       `isb-proceso` (1000, recortada entre dos filas de tarjetas, sin cortar ninguna).
 *   3 · panel de UI sobre campo noche .......... `isb-lectura` e `isb-limpieza`: la
 *       mitad de texto de dos de los cuatro bloques de /servicios, 500×500 px clavados a
 *       viewport 1064, con sombra real. Cada uno trae su token de acento y su caja de
 *       ética, que es lo irrepetible de este encargo.
 *   4 · emblema aislado ........................ `isb-sello`: el único sello aplicado del
 *       sitio, recortado con `omitBackground` y ampliado sobre el campo noche.
 *   5 · lámina de sistema ...................... `isb-tipo` y `isb-color`, armadas en
 *       HTML/CSS con los valores LEÍDOS de las variables CSS del sitio en vivo. Llevan
 *       los nombres de los tokens y ninguna palabra traducible, así que hay un solo
 *       archivo para los tres idiomas.
 *   6 · celulares sobre campo noche ............ `isb-paginas`: las tres rutas, cada una
 *       en un idioma distinto, con rótulos en código de idioma y ruta (ES, FR, DE),
 *       que no necesitan traducción.
 * Taller: .claude/skills/portafolio-axium/capturas-clientes/innersoulbright/v3/
 *
 * ── SENSIBILIDAD ────────────────────────────────────────────────────────────────────
 * Es el sitio personal de una persona real. NO se publica su teléfono, su correo ni su
 * dirección, y por eso ninguna pieza incluye el pie de página ni la sección de contacto.
 * El copy habla de la consulta y del sitio, nunca de quién la lleva, y NO atribuye género
 * a nadie. `results` va vacío: las tres cifras que declaraba el JSON («150+ visitas»,
 * «85 %», «100 % de satisfacción») no están medidas por nadie y se borraron.
 *
 * RITMO: quince bloques, ocho de imagen. El tramo más largo sin imagen es el de
 * `highlights` (650 px a 1440); ningún bloque de texto ni de acto queda pegado a otro.
 */

const IMG = "/images/proyects/innersoulbright";

/** Las once piezas del relato: cinco anchas y tres pares de cuadradas. */
type Pieza =
  | "portada"
  | "llamada"
  | "sello"
  | "limites"
  | "tipo"
  | "color"
  | "lectura"
  | "limpieza"
  | "proceso"
  | "paginas";

type Acto = { index: string; title: [string, string]; body: string };

type Copy = {
  tagline: string;
  meta: [string, string][];
  statement: string;
  context: string;
  highlightsTitle: [string, string];
  highlights: { lead: string; text: string }[];
  challengeTitle: string;
  challenge: string;
  actos: Record<"atmosfera" | "contenido", Acto>;
  outcomesTitle: string;
  outcomes: string;
  stackTitle: string;
  stack: string[];
  /** Solo las piezas anchas llevan frase: un bloque `pair` no admite `lead`. */
  leads: {
    portada: string;
    limites: string;
    proceso: string;
    paginas: string;
  };
  pies: Record<Pieza, string>;
  alt: Record<Pieza, string>;
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    tagline:
      "El sitio de una consulta de acompañamiento espiritual, en cinco idiomas",
    meta: [
      ["Estado", "En línea"],
      ["Entregable", "Sitio web"],
      ["Industria", "Bienestar espiritual"],
      ["Idiomas", "Cinco"],
    ],
    statement:
      "Tres páginas en React publicadas en cinco idiomas, donde los cuatro servicios, el proceso y el código ético —lo que se hace y lo que no se hace— se leen con el mismo cuidado.",
    context:
      "Es una consulta de acompañamiento espiritual y sanación energética que atiende en línea y presencial, sin dirección fija, y que habla a un público repartido por varios países. De ahí los cinco idiomas.",
    highlightsTitle: ["Lo que", "hicimos"],
    highlights: [
      {
        lead: "Tres páginas",
        text: "inicio, servicios y sobre mí, con enrutado de cliente: se navega sin volver a cargar.",
      },
      {
        lead: "Cinco idiomas",
        text: "español, inglés, francés, alemán y portugués, con el selector en la cabecera y la elección recordada.",
      },
      {
        lead: "Cada servicio, su límite",
        text: "los cuatro bloques llevan su color, su rejilla de lo que incluye y una caja con lo que ese servicio no es.",
      },
      {
        lead: "Sistema tipográfico",
        text: "Cormorant Garamond para los titulares y Questrial para el texto, en una escala de cinco tamaños.",
      },
      {
        lead: "Color en variables",
        text: "nueve tonos y ocho degradados escritos en el CSS, de los tres oros a los tres celestes.",
      },
      {
        lead: "SEO y datos estructurados",
        text: "canonical, Open Graph, Twitter Card y una ficha Organization en JSON-LD.",
      },
    ],
    challengeTitle: "Reto",
    challenge:
      "Una web de servicios espirituales se juega la credibilidad en el tono: con demasiada promesa espanta, con demasiada frialdad no acompaña. Había que construir confianza sin prometer un solo resultado.",
    actos: {
      atmosfera: {
        index: "Acto 01",
        title: ["El tono", "se diseña"],
        body: "Las tres páginas corren sobre dos tipografías y nueve tonos escritos en variables, con ocho degradados que hacen el resto. La romana titula y la seca explica: no se mezclan nunca.",
      },
      contenido: {
        index: "Acto 02",
        title: ["Una consulta,", "contada entera"],
        body: "Cada uno de los cuatro servicios lleva su color de la paleta, su rejilla de lo que incluye y una caja donde se escribe lo que ese servicio no es. Y detrás, seis pasos y un plan de siete días.",
      },
    },
    outcomesTitle: "Lo entregado",
    outcomes:
      "Inner Soul Bright se quedó con tres páginas publicadas en innersoulbright.com, en cinco idiomas, con su color y su tipografía escritos en variables. No publicamos cifras: la analítica no es nuestra.",
    stackTitle: "Disciplinas y tecnología",
    stack: [
      "Diseño y desarrollo web",
      "Arquitectura de contenido",
      "Entrada animada · 28 bloques",
      "React",
      "Vite",
      "React Router",
      "Tailwind CSS",
      "Motion",
      "Radix UI",
      "Lucide",
      "i18next · cinco idiomas",
      "Cormorant Garamond y Questrial",
      "SEO técnico y datos estructurados",
      "Diseño responsive",
    ],
    leads: {
      portada:
        "La portada se parte en dos: a la izquierda el titular en romana y los dos botones; a la derecha, el bosque entero. Tipografía y fotografía se reparten la pantalla al cincuenta por ciento.",
      limites:
        "La página de servicios abre diciendo lo que la consulta no hace: adivinación, dependencia, promesas de resultado e intervención en decisiones médicas. Las dos columnas tienen el mismo peso tipográfico.",
      proceso:
        "Seis pasos, y cuatro llevan la etiqueta «Opcional». La entradilla lo dice antes que las tarjetas: cada proceso es único y no todos los pasos se hacen siempre.",
      paginas:
        "Las tres rutas en el celular, cada una en un idioma distinto del selector. El enrutado es de cliente: se pasa de una a otra sin volver a cargar la página.",
    },
    pies: {
      portada:
        "innersoulbright.com · la portada a 1440 px, con el bosque sangrando por la derecha",
      llamada:
        "innersoulbright.com · la llamada del cierre, con la fotografía del cliente a sangre",
      sello:
        "innersoulbright.com/servicios · el sello que corona el aviso de cierre, aislado del fondo",
      limites:
        "innersoulbright.com/servicios · lo que sí se hace y lo que no, enfrentados en dos columnas",
      tipo: "Cormorant Garamond y Questrial, con los pesos y la escala leídos del sitio en vivo",
      color:
        "Los nueve tonos y tres de los ocho degradados, leídos de las variables CSS",
      lectura:
        "innersoulbright.com/servicios · «Lectura Energética», con su acento celeste y su límite escrito",
      limpieza:
        "innersoulbright.com/servicios · «Limpieza Energética», con su acento salvia y su límite escrito",
      proceso:
        "innersoulbright.com/servicios · la entradilla y los cuatro primeros pasos, ampliados",
      paginas:
        "innersoulbright.com · inicio en español, servicios en francés y sobre mí en alemán",
    },
    alt: {
      portada:
        "La portada de innersoulbright.com dentro de una ventana de navegador, con el titular «Sanación Espiritual, Meditación y Autocuidado» y una fotografía de bosque con niebla",
      llamada:
        "La llamada final de innersoulbright.com: una fotografía de dos manos sobre velas encendidas y, debajo, un panel azul profundo con la pregunta y el botón",
      sello:
        "El sello circular de innersoulbright.com, con el logotipo del loto en el centro y las palabras «Luz · Alma · Espíritu · Energía · Sanación» alrededor",
      limites:
        "La página de servicios de innersoulbright.com con dos tarjetas enfrentadas: «Lo que SÍ hacemos» y «Lo que NO hacemos»",
      tipo: "Espécimen tipográfico de Inner Soul Bright sobre campo oscuro: Cormorant Garamond y Questrial con sus pesos y la escala de cinco tamaños",
      color:
        "Las nueve fichas de color de Inner Soul Bright con su nombre de variable, su hexadecimal y su valor HSL, y tres barras de degradado",
      lectura:
        "El bloque de «Lectura Energética» de innersoulbright.com/servicios, con su icono celeste, cuatro puntos de lo que incluye y una caja en cursiva que aclara que no es adivinación",
      limpieza:
        "El bloque de «Limpieza Energética» de innersoulbright.com/servicios, con su icono salvia, cuatro puntos de lo que incluye y una caja en cursiva sobre la higiene energética continua",
      proceso:
        "La sección «Paso a Paso» de innersoulbright.com/servicios: cuatro tarjetas numeradas, tres con la etiqueta «Opcional»",
      paginas:
        "Tres celulares sobre campo oscuro con las tres páginas de innersoulbright.com: el inicio en español, los servicios en francés y la página sobre mí en alemán",
    },
    nextTagline:
      "La otra web de bienestar del portafolio: un sitio, un sorteo verificable y un área privada",
  },
  en: {
    tagline:
      "The website of a spiritual accompaniment practice, in five languages",
    meta: [
      ["Status", "Live"],
      ["Deliverable", "Website"],
      ["Industry", "Spiritual wellbeing"],
      ["Languages", "Five"],
    ],
    statement:
      "Three pages in React published in five languages, where the four services, the process and the code of ethics —what the practice does and what it does not— all read with the same care.",
    context:
      "It is a spiritual accompaniment and energy healing practice that works online and in person, with no fixed address, speaking to an audience spread across several countries. Hence the five languages.",
    highlightsTitle: ["What we", "did"],
    highlights: [
      {
        lead: "Three pages",
        text: "home, services and about me, with client-side routing: you move between them without a reload.",
      },
      {
        lead: "Five languages",
        text: "Spanish, English, French, German and Portuguese, with the picker in the header and the choice remembered.",
      },
      {
        lead: "Every service, its limit",
        text: "the four blocks each carry their colour, a grid of what is included and a box stating what that service is not.",
      },
      {
        lead: "Type system",
        text: "Cormorant Garamond for headings and Questrial for body copy, on a scale of five sizes.",
      },
      {
        lead: "Colour in variables",
        text: "nine tones and eight gradients written into the CSS, from the three golds to the three blues.",
      },
      {
        lead: "SEO and structured data",
        text: "canonical, Open Graph, Twitter Card and an Organization record in JSON-LD.",
      },
    ],
    challengeTitle: "Challenge",
    challenge:
      "A spiritual services site stakes its credibility on tone: too much promise scares people off, too much coldness does not accompany them. Trust had to be built without promising a single result.",
    actos: {
      atmosfera: {
        index: "Act 01",
        title: ["Tone is", "a design decision"],
        body: "The three pages run on two typefaces and nine tones written into variables, with eight gradients doing the rest. The serif heads, the sans explains: they never swap roles.",
      },
      contenido: {
        index: "Act 02",
        title: ["One consultation,", "told in full"],
        body: "Each of the four services carries its own colour from the palette, a grid of what it includes and a box that states what that service is not. Behind them, six steps and a seven-day plan.",
      },
    },
    outcomesTitle: "What we handed over",
    outcomes:
      "Inner Soul Bright kept three pages published at innersoulbright.com, in five languages, with its colour and type written into variables. We publish no figures: the analytics are not ours.",
    stackTitle: "Disciplines and technology",
    stack: [
      "Web design and development",
      "Content architecture",
      "Animated entrance · 28 blocks",
      "React",
      "Vite",
      "React Router",
      "Tailwind CSS",
      "Motion",
      "Radix UI",
      "Lucide",
      "i18next · five languages",
      "Cormorant Garamond and Questrial",
      "Technical SEO and structured data",
      "Responsive design",
    ],
    leads: {
      portada:
        "The home page splits in two: the serif headline and the two buttons on the left, the whole forest on the right. Type and photography take half the screen each.",
      limites:
        "The services page opens by saying what the consultation does not do: fortune telling, dependency, promised results, intervention in medical decisions. Both columns carry the same typographic weight.",
      proceso:
        "Six steps, and four of them are labelled «Optional». The standfirst says it before the cards do: every process is its own, and not every step is always taken.",
      paginas:
        "The three routes on a phone, each one in a different language from the picker. Routing is client-side: you move between them without reloading the page.",
    },
    pies: {
      portada:
        "innersoulbright.com · the home page at 1440 px, with the forest bleeding off to the right",
      llamada:
        "innersoulbright.com · the closing call, with the client's own photograph full bleed",
      sello:
        "innersoulbright.com/servicios · the seal that crowns the closing notice, lifted off its background",
      limites:
        "innersoulbright.com/servicios · what is done and what is not, set against each other in two columns",
      tipo: "Cormorant Garamond and Questrial, with the weights and the scale read from the live site",
      color:
        "The nine tones and three of the eight gradients, read from the CSS variables",
      lectura:
        "innersoulbright.com/servicios · «Energy reading», with its blue accent and its written limit",
      limpieza:
        "innersoulbright.com/servicios · «Energy clearing», with its sage accent and its written limit",
      proceso:
        "innersoulbright.com/servicios · the standfirst and the first four steps, enlarged",
      paginas:
        "innersoulbright.com · home in Spanish, services in French and about me in German",
    },
    alt: {
      portada:
        "The innersoulbright.com home page inside a browser window, with the headline «Spiritual Healing, Meditation and Self-Care» and a photograph of a misty forest",
      llamada:
        "The closing call of innersoulbright.com: a photograph of two hands above lit candles and, below it, a deep blue panel with the question and the button",
      sello:
        "The circular seal of innersoulbright.com, with the lotus mark at its centre and the words «Luz · Alma · Espíritu · Energía · Sanación» running around it",
      limites:
        "The services page of innersoulbright.com with two facing cards: «What we DO» and «What we DO NOT do»",
      tipo: "Inner Soul Bright's type specimen on a dark field: Cormorant Garamond and Questrial with their weights and the five-size scale",
      color:
        "Inner Soul Bright's nine colour cards with their variable name, hexadecimal and HSL value, plus three gradient bars",
      lectura:
        "The «Energy reading» block of innersoulbright.com/servicios, with its blue icon, four bullet points of what it includes and an italic box clarifying that it is not fortune telling",
      limpieza:
        "The «Energy clearing» block of innersoulbright.com/servicios, with its sage icon, four bullet points of what it includes and an italic box about continuous energy hygiene",
      proceso:
        "The «Step by step» section of innersoulbright.com/servicios: four numbered cards, three of them labelled «Optional»",
      paginas:
        "Three phones on a dark field with the three pages of innersoulbright.com: home in Spanish, services in French and the about me page in German",
    },
    nextTagline:
      "The portfolio's other wellbeing site: one website, a verifiable raffle and a private area",
  },
  pt: {
    tagline:
      "O site de uma consulta de acompanhamento espiritual, em cinco idiomas",
    meta: [
      ["Estado", "No ar"],
      ["Entregável", "Site"],
      ["Indústria", "Bem-estar espiritual"],
      ["Idiomas", "Cinco"],
    ],
    statement:
      "Três páginas em React publicadas em cinco idiomas, onde os quatro serviços, o processo e o código ético —o que se faz e o que não se faz— se leem com o mesmo cuidado.",
    context:
      "É uma consulta de acompanhamento espiritual e cura energética que atende online e presencialmente, sem morada fixa, e que fala a um público espalhado por vários países. Daí os cinco idiomas.",
    highlightsTitle: ["O que", "fizemos"],
    highlights: [
      {
        lead: "Três páginas",
        text: "início, serviços e sobre mim, com encaminhamento de cliente: navega-se sem recarregar.",
      },
      {
        lead: "Cinco idiomas",
        text: "espanhol, inglês, francês, alemão e português, com o seletor no cabeçalho e a escolha memorizada.",
      },
      {
        lead: "Cada serviço, o seu limite",
        text: "os quatro blocos levam a sua cor, a sua grelha do que inclui e uma caixa com o que esse serviço não é.",
      },
      {
        lead: "Sistema tipográfico",
        text: "Cormorant Garamond para os títulos e Questrial para o texto, numa escala de cinco tamanhos.",
      },
      {
        lead: "Cor em variáveis",
        text: "nove tons e oito gradientes escritos no CSS, dos três ouros aos três azuis.",
      },
      {
        lead: "SEO e dados estruturados",
        text: "canonical, Open Graph, Twitter Card e uma ficha Organization em JSON-LD.",
      },
    ],
    challengeTitle: "Desafio",
    challenge:
      "Um site de serviços espirituais joga a credibilidade no tom: com promessa a mais afasta, com frieza a mais não acompanha. Era preciso construir confiança sem prometer um único resultado.",
    actos: {
      atmosfera: {
        index: "Ato 01",
        title: ["O tom", "também se desenha"],
        body: "As três páginas correm sobre duas tipografias e nove tons escritos em variáveis, com oito gradientes a fazer o resto. A romana titula e a seca explica: nunca trocam de papel.",
      },
      contenido: {
        index: "Ato 02",
        title: ["Uma consulta,", "contada inteira"],
        body: "Cada um dos quatro serviços leva a sua cor da paleta, a sua grelha do que inclui e uma caixa onde se escreve o que esse serviço não é. E atrás, seis passos e um plano de sete dias.",
      },
    },
    outcomesTitle: "O que entregámos",
    outcomes:
      "A Inner Soul Bright ficou com três páginas publicadas em innersoulbright.com, em cinco idiomas, com a sua cor e a sua tipografia escritas em variáveis. Não publicamos números: a analítica não é nossa.",
    stackTitle: "Disciplinas e tecnologia",
    stack: [
      "Design e desenvolvimento web",
      "Arquitetura de conteúdo",
      "Entrada animada · 28 blocos",
      "React",
      "Vite",
      "React Router",
      "Tailwind CSS",
      "Motion",
      "Radix UI",
      "Lucide",
      "i18next · cinco idiomas",
      "Cormorant Garamond e Questrial",
      "SEO técnico e dados estruturados",
      "Design responsivo",
    ],
    leads: {
      portada:
        "A capa parte-se em duas: à esquerda o título em romana e os dois botões; à direita, a floresta inteira. Tipografia e fotografia repartem o ecrã a cinquenta por cento.",
      limites:
        "A página de serviços abre a dizer o que a consulta não faz: adivinhação, dependência, promessas de resultado e intervenção em decisões médicas. As duas colunas têm o mesmo peso tipográfico.",
      proceso:
        "Seis passos, e quatro levam a etiqueta «Opcional». A entrada di-lo antes dos cartões: cada processo é único e nem todos os passos se fazem sempre.",
      paginas:
        "As três rotas no telemóvel, cada uma num idioma diferente do seletor. O encaminhamento é de cliente: passa-se de uma para outra sem recarregar a página.",
    },
    pies: {
      portada:
        "innersoulbright.com · a capa a 1440 px, com a floresta a sangrar pela direita",
      llamada:
        "innersoulbright.com · a chamada de fecho, com a fotografia do cliente a sangrar",
      sello:
        "innersoulbright.com/servicios · o selo que coroa o aviso de fecho, isolado do fundo",
      limites:
        "innersoulbright.com/servicios · o que se faz e o que não se faz, frente a frente em duas colunas",
      tipo: "Cormorant Garamond e Questrial, com os pesos e a escala lidos do site em direto",
      color: "Os nove tons e três dos oito gradientes, lidos das variáveis CSS",
      lectura:
        "innersoulbright.com/servicios · «Leitura Energética», com o seu acento azul e o seu limite escrito",
      limpieza:
        "innersoulbright.com/servicios · «Limpeza Energética», com o seu acento sálvia e o seu limite escrito",
      proceso:
        "innersoulbright.com/servicios · a entrada e os quatro primeiros passos, ampliados",
      paginas:
        "innersoulbright.com · início em espanhol, serviços em francês e sobre mim em alemão",
    },
    alt: {
      portada:
        "A capa de innersoulbright.com dentro de uma janela de navegador, com o título «Cura Espiritual, Meditação e Autocuidado» e uma fotografia de floresta com nevoeiro",
      llamada:
        "A chamada final de innersoulbright.com: uma fotografia de duas mãos sobre velas acesas e, por baixo, um painel azul profundo com a pergunta e o botão",
      sello:
        "O selo circular de innersoulbright.com, com o logótipo do lótus no centro e as palavras «Luz · Alma · Espírito · Energia · Cura» à volta",
      limites:
        "A página de serviços de innersoulbright.com com dois cartões frente a frente: «O que SIM fazemos» e «O que NÃO fazemos»",
      tipo: "Espécime tipográfico da Inner Soul Bright sobre campo escuro: Cormorant Garamond e Questrial com os seus pesos e a escala de cinco tamanhos",
      color:
        "Os nove cartões de cor da Inner Soul Bright com o nome da variável, o hexadecimal e o valor HSL, e três barras de gradiente",
      lectura:
        "O bloco de «Leitura Energética» de innersoulbright.com/servicios, com o seu ícone azul, quatro pontos do que inclui e uma caixa em itálico a esclarecer que não é adivinhação",
      limpieza:
        "O bloco de «Limpeza Energética» de innersoulbright.com/servicios, com o seu ícone sálvia, quatro pontos do que inclui e uma caixa em itálico sobre a higiene energética contínua",
      proceso:
        "A secção «Passo a Passo» de innersoulbright.com/servicios: quatro cartões numerados, três com a etiqueta «Opcional»",
      paginas:
        "Três telemóveis sobre campo escuro com as três páginas de innersoulbright.com: o início em espanhol, os serviços em francês e a página sobre mim em alemão",
    },
    nextTagline:
      "O outro site de bem-estar do portfólio: um site, um sorteio verificável e uma área privada",
  },
};

/**
 * Quince bloques, ocho de imagen: CINCO anchas y TRES pares de cuadradas, once piezas.
 *
 * ORDEN: ningún bloque de texto ni de acto queda pegado a otro, que es la única forma de
 * no pasar de 700 px sin imagen (`text` ≈ 300 px, `act` ≈ 600, `highlights` ≈ 650). El
 * tramo más largo de esta ficha es el de `highlights`, 650.
 *
 * LOS PARES, y por qué cada uno se lee como pareja y no como dos recortes:
 *   · par 1 · lo que el sitio pone donde otros ponen un formulario: la fotografía del
 *     cliente a sangre y el sello aislado. Las dos oscuras, las dos sin una línea de
 *     texto nuestro, valores opuestos (foto cálida contra disco blanco sobre tinta).
 *   · par 2 · las dos láminas de sistema: mismo campo noche, mismo rótulo, mismos
 *     márgenes. Es el díptico deliberado que permite el estándar.
 *   · par 3 · dos de los cuatro bloques de servicio, con el mismo recorte (500×500 px
 *     clavados), la misma sombra y el mismo campo. Lo que cambia es el token de acento
 *     —celeste contra salvia— y el límite que cada servicio escribe de sí mismo.
 *
 * `isb-limites` va DETRÁS del reto porque es su respuesta: el reto habla de tono y la
 * pieza enseña la página donde el tono se juega. Y «Lo entregado» va DELANTE de la última
 * ancha, que es justo la prueba de lo que dice: las tres páginas en el celular.
 */
function bloques(c: Copy): StoryBlock[] {
  return [
    {
      kind: "wide",
      lead: c.leads.portada,
      image: {
        src: `${IMG}/isb-portada.jpg`,
        alt: c.alt.portada,
        caption: c.pies.portada,
        mobileSrc: `${IMG}/isb-portada-movil.jpg`,
      },
    },
    { kind: "highlights", title: c.highlightsTitle, items: c.highlights },
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/isb-llamada.jpg`,
          alt: c.alt.llamada,
          caption: c.pies.llamada,
        },
        {
          src: `${IMG}/isb-sello.jpg`,
          alt: c.alt.sello,
          caption: c.pies.sello,
        },
      ],
    },
    { kind: "text", title: c.challengeTitle, body: c.challenge },
    {
      kind: "wide",
      lead: c.leads.limites,
      image: {
        src: `${IMG}/isb-limites-v3.jpg`,
        alt: c.alt.limites,
        caption: c.pies.limites,
        mobileSrc: `${IMG}/isb-limites-movil.jpg`,
      },
    },

    // ── ACTO 01 · LA ATMÓSFERA ──
    {
      kind: "act",
      index: c.actos.atmosfera.index,
      title: c.actos.atmosfera.title,
      body: c.actos.atmosfera.body,
    },
    {
      kind: "pair",
      images: [
        { src: `${IMG}/isb-tipo.jpg`, alt: c.alt.tipo, caption: c.pies.tipo },
        {
          src: `${IMG}/isb-color.jpg`,
          alt: c.alt.color,
          caption: c.pies.color,
        },
      ],
    },

    // ── ACTO 02 · EL CONTENIDO ──
    {
      kind: "act",
      index: c.actos.contenido.index,
      title: c.actos.contenido.title,
      body: c.actos.contenido.body,
    },
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/isb-lectura.jpg`,
          alt: c.alt.lectura,
          caption: c.pies.lectura,
        },
        {
          src: `${IMG}/isb-limpieza.jpg`,
          alt: c.alt.limpieza,
          caption: c.pies.limpieza,
        },
      ],
    },
    {
      kind: "wide",
      lead: c.leads.proceso,
      image: {
        src: `${IMG}/isb-proceso-v2.jpg`,
        alt: c.alt.proceso,
        caption: c.pies.proceso,
        mobileSrc: `${IMG}/isb-proceso-movil.jpg`,
      },
    },

    // «Lo entregado» delante de la última ancha, que es la prueba de lo que dice.
    {
      kind: "text",
      id: "resultado",
      title: c.outcomesTitle,
      body: c.outcomes,
    },
    {
      kind: "wide",
      lead: c.leads.paginas,
      image: {
        src: `${IMG}/isb-paginas.jpg`,
        alt: c.alt.paginas,
        caption: c.pies.paginas,
        mobileSrc: `${IMG}/isb-paginas-movil.jpg`,
      },
    },
    { kind: "tags", title: c.stackTitle, items: c.stack },
  ];
}

export default function InnerSoulBrightContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseStory
        /*
         * El acento es de Inner Soul Bright, no de Axium. Los tres valores salen medidos
         * del CSS en vivo: el oro de marca es `--gold` #D19F47 y sobre blanco da 2,40:1,
         * así que `base` es ese mismo oro llevado a hsl(35 55% 39%) = #9A6D2D, que da
         * 4,57:1 sobre blanco; `dark` sí puede ser el oro real, que sobre la tinta
         * #060C20 da 8,10:1. `deep` es el bronce con el que cierra el degradado.
         */
        accent={{ base: "#9A6D2D", dark: "#D19F47", deep: "#4F3817" }}
        name="Inner Soul Bright"
        tagline={c.tagline}
        heroImage={`${IMG}/isb-hero.jpg`}
        heroPosition="50% 52%"
        logo={{ src: `${IMG}/isb-logo.png`, width: 1600, height: 390 }}
        liveUrl="https://innersoulbright.com"
        meta={c.meta}
        statement={c.statement}
        context={c.context}
        blocks={bloques(c)}
        next={{
          name: "VitalChain Academy",
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
