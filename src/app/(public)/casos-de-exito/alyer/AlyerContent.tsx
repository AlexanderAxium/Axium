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
 * Ficha larga de Alyer: identidad, manual de marca, merchandising y brochure.
 *
 * EL CASO SIN PANTALLAS. Es la única ficha del portafolio donde no hay una sola captura
 * de interfaz: el encargo fue de marca y de papel. Por eso no lleva `liveUrl` (no hicimos
 * su web) y por eso la portada es el logotipo sobre acero quemado y no una ventana de
 * navegador. Alexander, 2026-09-30: «a Alyer le hicimos manual de marca y branding,
 * entonces su portada debe ser distinta».
 *
 * ── NACE PODADA ──────────────────────────────────────────────────────────────────────
 * Aurore llegó a 16 bloques DESPUÉS de podar. Alyer arranca en 14, con la regla de la
 * referencia que pasó Alexander (brandvm.com/case-studies/enterprise-ordering-platform,
 * en referencias/brandvm-ordering.md: 5.514 px y ~380 palabras):
 *   · Un párrafo por sección, 40–60 palabras. Si una frase no añade un hecho, fuera.
 *   · Ninguna pieza enseña lo que ya enseñó otra.
 *
 * TRES ACTOS, porque tres cosas se entregaron:
 *   01 · El símbolo y su manual   la «A» fragmentada, la paleta, la pareja tipográfica
 *                                 y las 35 láminas que fijan las reglas. El pliego del
 *                                 manual y las dos láminas abren la ficha, delante del
 *                                 acto, para que no se lea de entrada media pantalla
 *                                 de texto (ver el comentario de `bloques`)
 *   02 · La marca sobre el acero  flota y ropa de trabajo, donde la marca se ve de verdad
 *   03 · Dos líneas, un sistema   Transportes y Producción, y el brochure de Producción
 *
 * QUÉ SE QUEDÓ FUERA (renderizado y descartado, no perdido):
 *   · `al-variantes` y `al-construccion` — las dos láminas ya asoman dentro del pliego
 *     de `al-manual`, que enseña quince a la vez. Dos piezas que enseñan lo mismo.
 *   · `al-gorra` y `al-polo` — mockups planos de merch que repiten lo que el par del
 *     chaleco ya cuenta mejor: el logotipo sobre ropa, y encima en su contexto de obra.
 *   · `al-chalecos` — la ancha que había era la MISMA fotografía dos veces (la espalda
 *     naranja, y esa misma foto recoloreada en rojo con otro lockup encima). La sustituye
 *     el par `al-chaleco-plano` / `al-chaleco-espalda`, que son los dos mockups reales de
 *     la lámina «Chaleco corporativo» del encargo. Ver la nota de `bloques`.
 *   · `al-fotografia` — la rejilla de usos del logo sobre foto repite a la misma persona
 *     en cuatro de sus ocho casillas, y esa regla ya se ve en el pliego del manual.
 *   · `al-brochure-mapa` y `al-brochure-productos` — las dos páginas están en el bodegón
 *     de `al-brochure`; sueltas solo repetían el mismo impreso más grande.
 *
 * DE DÓNDE SALE CADA IMAGEN (ver capturas-clientes/alyer/taller.html):
 *   · Las láminas del manual y las páginas del brochure son los archivos reales del
 *     encargo; el logotipo y el símbolo son los vectoriales del cliente.
 *   · Solo los fondos (acero, muro, mesa) son de Higgsfield, y nunca llevan marca
 *     encima salvo el logotipo real compuesto en la portada.
 *
 * ⚠ HONESTIDAD: la flota y las prendas son los MOCKUPS de presentación del proyecto
 * —vehículo y prenda de catálogo con el diseño real aplicado—, no fotografías de
 * unidades rotuladas ni de prendas producidas. La ficha lo dice con esas palabras en el
 * acto 02. `results` va vacío: fue un encargo de marca, no hay analítica que enseñar y
 * no se inventan cifras.
 */

const IMG = "/images/proyects/alyer";

type Acto = { index: string; title: [string, string]; body: string };

/** Las diez imágenes del relato: cuatro anchas y tres pares de cuadradas. */
type Pieza =
  | "manual"
  | "paleta"
  | "tipografia"
  | "simboloMarca"
  | "simboloOrigen"
  | "camion"
  | "chalecoPlano"
  | "chalecoEspalda"
  | "marcas"
  | "brochure";

type Copy = {
  tagline: string;
  meta: [string, string][];
  statement: string;
  context: string;
  highlightsTitle: [string, string];
  highlights: { lead: string; text: string }[];
  challengeTitle: string;
  challenge: string;
  actos: Record<"identidad" | "aplicaciones" | "lineas", Acto>;
  outcomesTitle: string;
  outcomes: string;
  stackTitle: string;
  stack: string[];
  /** Solo las piezas anchas llevan frase: un bloque `pair` no admite `lead`. */
  leads: {
    manual: string;
    camion: string;
    marcas: string;
    brochure: string;
  };
  pies: Record<Pieza, string>;
  alt: Record<Pieza, string>;
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    tagline:
      "La marca de una empresa que mueve carga minera y fabrica las unidades que la mueven",
    meta: [
      ["Estado", "Entregado"],
      ["Entregables", "Identidad, manual, merchandising, brochure"],
      ["Industria", "Transporte de carga y fabricación metálica"],
      ["Marcas", "Alyer Transportes y Alyer Producción"],
    ],
    statement:
      "Le hicimos a Alyer la marca entera: el símbolo, el sistema y un manual de 35 láminas que lo sostiene en el acero, en la ropa de trabajo y en el papel.",
    context:
      "Grupo industrial peruano con dos líneas: Transportes mueve concentrado de mineral, carga peligrosa y sobredimensionada por trece ciudades, y Producción —Industrias Metálicas Alyer— fabrica los semirremolques que esa flota arrastra. Una sola marca tenía que servir a las dos.",
    highlightsTitle: ["Lo que", "hicimos"],
    highlights: [
      {
        lead: "Símbolo y logotipo",
        text: "una «A» fragmentada que se lee como movimiento, en lockup con la palabra y el descriptor.",
      },
      {
        lead: "Manual de 35 láminas",
        text: "construcción, área de seguridad, tamaño mínimo, escala de grises, usos incorrectos y expresión textual.",
      },
      {
        lead: "Paleta y tipografía",
        text: "un negro, un rojo y cuatro grises, con Quadrat Serial y Acumin Variable Wide.",
      },
      {
        lead: "Dos líneas, un sistema",
        text: "comparten símbolo, palabra y color; solo cambia el descriptor de abajo.",
      },
      {
        lead: "Aplicaciones",
        text: "rotulación de flota, chalecos reflectivos, gorra y polo, más el ícono de app y las cabeceras de redes.",
      },
      {
        lead: "Brochure comercial",
        text: "el mapa de operaciones de Producción y el catálogo de semirremolques, remolques y cisternas.",
      },
    ],
    challengeTitle: "Reto",
    challenge:
      "Una marca de transporte pesado no se juega en una pantalla: se juega a treinta metros, sucia y en movimiento. Tiene que aguantar el vinilo de una carrocería y el bordado de una gorra, y firmar dos negocios sin partirse en dos logotipos.",
    actos: {
      identidad: {
        index: "Acto 01",
        title: ["Un símbolo", "y su manual"],
        body: "El símbolo parte de la «A» de Alyer, fragmentada y orientada a la derecha: dos bloques en punta que se leen a la vez como movimiento y como pieza mecánica.",
      },
      aplicaciones: {
        index: "Acto 02",
        title: ["La marca", "sobre el acero"],
        body: "La identidad baja a donde se ve de verdad: la unidad completa y la ropa de trabajo. Las imágenes son los mockups de presentación del encargo —vehículo y prenda de catálogo con el diseño real aplicado—, no fotografías de unidades rotuladas.",
      },
      lineas: {
        index: "Acto 03",
        title: ["Dos líneas,", "un sistema"],
        body: "Las dos líneas comparten símbolo, palabra y color, y se separan solo por el descriptor de abajo. Con el sistema cerrado se armó el brochure comercial de Producción.",
      },
    },
    outcomesTitle: "Lo entregado",
    outcomes:
      "Alyer se quedó con los archivos: símbolo, manual, paleta, tipografías, flota, ropa de trabajo y brochure. No publicamos cifras: fue un encargo de marca.",
    stackTitle: "Disciplinas y entregables",
    stack: [
      "Identidad de marca",
      "Diseño de logotipo",
      "Manual de marca",
      "Sistema tipográfico",
      "Paleta cromática",
      "Arquitectura de marca",
      "Aplicaciones de marca",
      "Rotulación de flota",
      "Merchandising",
      "Diseño editorial",
    ],
    leads: {
      manual:
        "Treinta y cinco láminas: qué se puede hacer con la marca y qué no.",
      camion:
        "La franja de la carrocería es el símbolo estirado, a escala de semirremolque.",
      marcas:
        "Un solo lockup con dos descriptores: se presenta una vez y se especializa después.",
      brochure:
        "El brochure de Producción: quién es la empresa, hasta dónde llega y qué fabrica.",
    },
    pies: {
      manual: "Manual de identidad corporativa Alyer Transportes · 35 láminas",
      paleta: "Paleta cromática: un negro, un rojo y cuatro grises",
      tipografia:
        "Quadrat Serial en el logotipo, Acumin Variable Wide en el resto",
      simboloMarca:
        "El símbolo: la misma forma sirve de letra, de flecha y de pieza de acero",
      simboloOrigen: "Justificación gráfica del símbolo, lámina del manual",
      camion: "Aplicación en flota, mockup · tractocamión y semirremolque",
      chalecoPlano:
        "Chaleco corporativo, mockup en plano · el logotipo al pecho y el símbolo al otro lado",
      chalecoEspalda:
        "El mismo chaleco puesto: la marca a escala de obra, y la dirección web debajo",
      marcas: "Alyer Transportes y Alyer Producción, el mismo lockup",
      brochure: "Brochure Alyer Producción · portada y páginas interiores",
    },
    alt: {
      manual: "Quince láminas del manual de marca de Alyer Transportes",
      paleta: "Lámina de paleta cromática del manual de marca de Alyer",
      tipografia: "Lámina de tipografías corporativas del manual de marca",
      simboloMarca:
        "El símbolo de Alyer en blanco y rojo: la «A» fragmentada y orientada a la derecha",
      simboloOrigen:
        "Lámina del manual con la secuencia que deriva el símbolo de la letra A",
      camion:
        "Tractocamión y semirremolque con la rotulación de Alyer Transportes",
      chalecoPlano:
        "Chaleco reflectivo naranja en plano, con el logotipo Alyer al pecho y el símbolo al otro lado",
      chalecoEspalda:
        "Un trabajador de espaldas con el chaleco reflectivo de Alyer y la dirección web bajo el logotipo",
      marcas:
        "Los lockups de Alyer Transportes y Alyer Producción, uno al lado del otro",
      brochure: "Páginas del brochure comercial de Alyer Producción",
    },
    nextTagline:
      "Marca, aplicaciones y tienda de una perfumería que se recorre por casa, por nota y por ocasión",
  },
  en: {
    tagline:
      "The brand of a company that hauls mining cargo and builds the units that haul it",
    meta: [
      ["Status", "Delivered"],
      ["Deliverables", "Identity, manual, merchandising, brochure"],
      ["Industry", "Freight transport and metal fabrication"],
      ["Brands", "Alyer Transportes and Alyer Producción"],
    ],
    statement:
      "We built Alyer's brand end to end: the symbol, the system and a 35-page manual that holds it on steel, on workwear and on paper.",
    context:
      "A Peruvian industrial group with two lines: Transportes hauls mineral concentrate, hazardous and oversize cargo across thirteen cities, and Producción —Industrias Metálicas Alyer— builds the semi-trailers that fleet pulls. One brand had to serve both.",
    highlightsTitle: ["What we", "did"],
    highlights: [
      {
        lead: "Symbol and logotype",
        text: "a fragmented «A» that reads as movement, locked up with the wordmark and the descriptor.",
      },
      {
        lead: "A 35-page manual",
        text: "construction, clear space, minimum size, greyscale, incorrect uses and textual expression.",
      },
      {
        lead: "Palette and type",
        text: "one black, one red and four greys, with Quadrat Serial and Acumin Variable Wide.",
      },
      {
        lead: "Two lines, one system",
        text: "they share symbol, wordmark and colour; only the descriptor underneath changes.",
      },
      {
        lead: "Applications",
        text: "fleet livery, hi-vis vests, cap and polo, plus the app icon and the social media headers.",
      },
      {
        lead: "Commercial brochure",
        text: "the map of Producción's operations and the catalogue of semi-trailers, trailers and tankers.",
      },
    ],
    challengeTitle: "Challenge",
    challenge:
      "A heavy-haulage brand is not decided on a screen: it is decided at thirty metres, dirty and moving. It has to survive the vinyl of a trailer body and the embroidery of a cap, and sign two businesses without splitting into two logos.",
    actos: {
      identidad: {
        index: "Act 01",
        title: ["A symbol", "and its manual"],
        body: "The symbol starts from Alyer's «A», fragmented and pointed to the right: two blocks that read at once as movement and as a machined part.",
      },
      aplicaciones: {
        index: "Act 02",
        title: ["The brand", "on steel"],
        body: "The identity comes down to where it is really seen: the full rig and the workwear. The images are the project's presentation mockups —a catalogue vehicle and garment with the real design applied—, not photographs of liveried units.",
      },
      lineas: {
        index: "Act 03",
        title: ["Two lines,", "one system"],
        body: "Both lines share symbol, wordmark and colour, and are told apart only by the descriptor underneath. With the system closed, we laid out Producción's commercial brochure.",
      },
    },
    outcomesTitle: "What was delivered",
    outcomes:
      "Alyer kept the files: symbol, manual, palette, type pairing, fleet, workwear and brochure. We publish no figures: this was a brand brief.",
    stackTitle: "Disciplines and deliverables",
    stack: [
      "Brand identity",
      "Logotype design",
      "Brand manual",
      "Type system",
      "Colour palette",
      "Brand architecture",
      "Brand applications",
      "Fleet livery",
      "Merchandising",
      "Editorial design",
    ],
    leads: {
      manual:
        "Thirty-five pages: what can be done with the brand, and what cannot.",
      camion:
        "The stripe on the trailer body is the symbol stretched out, at semi-trailer scale.",
      marcas:
        "One lockup with two descriptors: it introduces itself once and specialises afterwards.",
      brochure:
        "Producción's brochure: who the company is, how far it reaches and what it builds.",
    },
    pies: {
      manual: "Alyer Transportes corporate identity manual · 35 pages",
      paleta: "Colour palette: one black, one red and four greys",
      tipografia:
        "Quadrat Serial for the logotype, Acumin Variable Wide for the rest",
      simboloMarca:
        "The symbol: the same shape works as a letter, an arrow and a piece of steel",
      simboloOrigen: "Graphic rationale for the symbol, page from the manual",
      camion: "Fleet application, mockup · tractor unit and semi-trailer",
      chalecoPlano:
        "Corporate vest, flat mockup · the logotype on the chest and the symbol on the other side",
      chalecoEspalda:
        "The same vest worn: the brand at site scale, with the web address below",
      marcas: "Alyer Transportes and Alyer Producción, the same lockup",
      brochure: "Pages from the Alyer Producción commercial brochure",
    },
    alt: {
      manual: "Fifteen pages of the Alyer Transportes brand manual",
      paleta: "Colour palette page from Alyer's brand manual",
      tipografia: "Corporate typography page from the brand manual",
      simboloMarca:
        "Alyer's symbol in white and red: the fragmented A, facing right",
      simboloOrigen:
        "Manual page with the sequence deriving the symbol from the letter A",
      camion: "Tractor unit and semi-trailer with Alyer Transportes livery",
      chalecoPlano:
        "Orange hi-vis vest laid flat, with the Alyer logotype on the chest and the symbol on the other side",
      chalecoEspalda:
        "A worker seen from behind in the Alyer hi-vis vest, with the web address under the logotype",
      marcas:
        "The Alyer Transportes and Alyer Producción lockups, side by side",
      brochure: "Pages of the Alyer Producción commercial brochure",
    },
    nextTagline:
      "Brand, applications and store for a perfumery browsed by house, by note and by occasion",
  },
  pt: {
    tagline:
      "A marca de uma empresa que move carga mineira e fabrica as unidades que a movem",
    meta: [
      ["Estado", "Entregue"],
      ["Entregáveis", "Identidade, manual, merchandising, brochure"],
      ["Indústria", "Transporte de carga e fabricação metálica"],
      ["Marcas", "Alyer Transportes e Alyer Producción"],
    ],
    statement:
      "Fizemos a marca da Alyer inteira: o símbolo, o sistema e um manual de 35 lâminas que o sustenta no aço, na roupa de trabalho e no papel.",
    context:
      "Grupo industrial peruano com duas linhas: Transportes move concentrado de minério, carga perigosa e superdimensionada por treze cidades, e Producción —Industrias Metálicas Alyer— fabrica os semirreboques que essa frota puxa. Uma só marca tinha de servir às duas.",
    highlightsTitle: ["O que", "fizemos"],
    highlights: [
      {
        lead: "Símbolo e logotipo",
        text: "um «A» fragmentado que se lê como movimento, em lockup com a palavra e o descritor.",
      },
      {
        lead: "Manual de 35 lâminas",
        text: "construção, área de segurança, tamanho mínimo, escala de cinzas, usos incorretos e expressão textual.",
      },
      {
        lead: "Paleta e tipografia",
        text: "um preto, um vermelho e quatro cinzas, com Quadrat Serial e Acumin Variable Wide.",
      },
      {
        lead: "Duas linhas, um sistema",
        text: "compartilham símbolo, palavra e cor; só muda o descritor de baixo.",
      },
      {
        lead: "Aplicações",
        text: "plotagem de frota, coletes refletivos, boné e polo, além do ícone de app e das capas de redes.",
      },
      {
        lead: "Brochure comercial",
        text: "o mapa das operações da Producción e o catálogo de semirreboques, reboques e cisternas.",
      },
    ],
    challengeTitle: "Desafio",
    challenge:
      "Uma marca de transporte pesado não se decide numa tela: decide-se a trinta metros, suja e em movimento. Tem de aguentar o vinil de uma carroceria e o bordado de um boné, e assinar dois negócios sem se partir em dois logotipos.",
    actos: {
      identidad: {
        index: "Ato 01",
        title: ["Um símbolo", "e o seu manual"],
        body: "O símbolo parte do «A» de Alyer, fragmentado e orientado à direita: dois blocos em ponta que se leem ao mesmo tempo como movimento e como peça mecânica.",
      },
      aplicaciones: {
        index: "Ato 02",
        title: ["A marca", "sobre o aço"],
        body: "A identidade desce até onde de facto se vê: a unidade completa e a roupa de trabalho. As imagens são os mockups de apresentação do encargo —veículo e peça de catálogo com o desenho real aplicado—, não fotografias de unidades plotadas.",
      },
      lineas: {
        index: "Ato 03",
        title: ["Duas linhas,", "um sistema"],
        body: "As duas linhas compartilham símbolo, palavra e cor, e separam-se só pelo descritor de baixo. Com o sistema fechado armou-se o brochure comercial da Producción.",
      },
    },
    outcomesTitle: "O que foi entregue",
    outcomes:
      "A Alyer ficou com os arquivos: símbolo, manual, paleta, tipografias, frota, roupa de trabalho e brochure. Não publicamos números: foi um encargo de marca.",
    stackTitle: "Disciplinas e entregáveis",
    stack: [
      "Identidade de marca",
      "Design de logotipo",
      "Manual de marca",
      "Sistema tipográfico",
      "Paleta cromática",
      "Arquitetura de marca",
      "Aplicações de marca",
      "Plotagem de frota",
      "Merchandising",
      "Design editorial",
    ],
    leads: {
      manual:
        "Trinta e cinco lâminas: o que se pode fazer com a marca, e o que não.",
      camion:
        "A faixa da carroceria é o símbolo esticado, à escala de semirreboque.",
      marcas:
        "Um só lockup com dois descritores: apresenta-se uma vez e especializa-se depois.",
      brochure:
        "O brochure da Producción: quem é a empresa, até onde chega e o que fabrica.",
    },
    pies: {
      manual: "Manual de identidade corporativa Alyer Transportes · 35 lâminas",
      paleta: "Paleta cromática: um preto, um vermelho e quatro cinzas",
      tipografia:
        "Quadrat Serial no logotipo, Acumin Variable Wide no restante",
      simboloMarca:
        "O símbolo: a mesma forma serve de letra, de seta e de peça de aço",
      simboloOrigen: "Justificação gráfica do símbolo, lâmina do manual",
      camion: "Aplicação em frota, mockup · cavalo mecânico e semirreboque",
      chalecoPlano:
        "Colete corporativo, mockup em plano · o logotipo ao peito e o símbolo do outro lado",
      chalecoEspalda:
        "O mesmo colete vestido: a marca à escala de obra, e o endereço web por baixo",
      marcas: "Alyer Transportes e Alyer Producción, o mesmo lockup",
      brochure: "Brochure Alyer Producción · capa e páginas interiores",
    },
    alt: {
      manual: "Quinze lâminas do manual de marca da Alyer Transportes",
      paleta: "Lâmina de paleta cromática do manual de marca da Alyer",
      tipografia: "Lâmina de tipografias corporativas do manual de marca",
      simboloMarca:
        "O símbolo da Alyer em branco e vermelho: o «A» fragmentado e orientado à direita",
      simboloOrigen:
        "Lâmina do manual com a sequência que deriva o símbolo da letra A",
      camion:
        "Cavalo mecânico e semirreboque com a plotagem da Alyer Transportes",
      chalecoPlano:
        "Colete refletivo laranja em plano, com o logotipo Alyer ao peito e o símbolo do outro lado",
      chalecoEspalda:
        "Um trabalhador de costas com o colete refletivo da Alyer e o endereço web sob o logotipo",
      marcas:
        "Os lockups da Alyer Transportes e da Alyer Producción, lado a lado",
      brochure: "Páginas do brochure comercial da Alyer Producción",
    },
    nextTagline:
      "Marca, aplicações e loja de uma perfumaria percorrida por casa, por nota e por ocasião",
  },
};

/**
 * Catorce bloques, siete de ellos de imagen: CUATRO anchas y TRES pares de cuadradas, diez
 * piezas en total.
 *
 * ── TERCERA VUELTA · EL RITMO (2026-09-30) ──────────────────────────────────────────
 * Alexander: «veo a veces mucho texto seguido». Medido a 1440, la ficha abría con 1.716 px
 * sin una sola imagen —el frase-contexto, las viñetas, el reto y la apertura del acto 01,
 * casi dos pantallas seguidas— y cerraba con otros 920. No sobra texto (eso ya se podó):
 * sobraba orden. No entró ni salió un bloque; se barajaron tres:
 *   · El pliego del manual sube a la apertura. Es la pieza que nombra la frase de arriba
 *     («un manual de 35 láminas») y enseña quince a la vez: la ficha ya no empieza leyendo.
 *   · La paleta y la tipografía suben detrás de las viñetas, que las nombran («un negro,
 *     un rojo y cuatro grises, con Quadrat Serial y Acumin Variable Wide»). Parten el
 *     bloque de apertura y el acto 01 se queda con lo suyo, el símbolo.
 *   · El reto baja al acto 02, entre el camión y los chalecos: habla del vinilo de una
 *     carrocería y del bordado de una prenda, y ahora tiene las dos imágenes al lado.
 *   · «Lo entregado» se mete delante del brochure, para que el cierre no sean dos textos
 *     pegados antes del carrusel.
 * Resultado: ningún tramo pasa de 700 px sin imagen.
 *
 * ── CUARTA VUELTA · DOS COLUMNAS TAMBIÉN (2026-09-30) ───────────────────────────────
 * Alexander: «veo que todo lo has puesto imagen columna entera, puedes usar 2 columnas
 * también para variar». La ficha tenía seis anchas y un solo par. Dos de las anchas ERAN
 * ya dos cosas metidas en un marco, y se rehicieron en el taller (no se retiquetaron: una
 * ancha es 2:1, 1312×656 servidos, y una cuadrada de un par es 1:1, 648×648):
 *   · `al-simbolo` era el símbolo apretado en un 47 % del marco y la justificación gráfica
 *     en el 53 % restante. Ahora una cuadrada cada uno: el símbolo crece de 328 a 381 px
 *     servidos, la secuencia de 459 a 502, y cada uno tiene su pie.
 *   · `al-chalecos` era una ancha con la MISMA fotografía dos veces: la espalda naranja y
 *     esa misma foto recoloreada en rojo con otro lockup encima. Una pieza no repite
 *     sujeto, y menos consigo misma. Se rehace con los dos mockups reales de la lámina
 *     «Chaleco corporativo» del encargo: el chaleco en plano y el chaleco puesto.
 * Lo que NO se partió: el PLIEGO del manual (quince láminas en rejilla de 5×3, que en 648
 * px serían sellos), el CAMIÓN (un tractocamión con semirremolque es horizontal por
 * definición), el BROCHURE (cinco páginas abiertas en abanico) y las DOS MARCAS (el corte
 * diagonal rojo que las separa ES el argumento del acto 03, y necesita el ancho).
 * Un `pair` mide 648 px de alto y una ancha 656, así que el ritmo no se movió; lo que sí
 * se pierde al convertir es la frase de la ancha (≈ 55 px), y los dos tramos afectados
 * —acto 01 + símbolo, y el reto + chalecos— se acortan, no se alargan.
 */
function bloques(c: Copy): StoryBlock[] {
  return [
    // El pliego del manual abre la ficha: quince láminas de golpe, sin un párrafo delante.
    {
      kind: "wide",
      lead: c.leads.manual,
      image: {
        src: `${IMG}/al-manual.jpg`,
        alt: c.alt.manual,
        caption: c.pies.manual,
        mobileSrc: `${IMG}/al-manual-movil.jpg`,
      },
    },
    {
      kind: "highlights",
      title: c.highlightsTitle,
      items: c.highlights,
    },
    // Las dos láminas que las viñetas acaban de nombrar, partiendo la lista del acto 01.
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/al-paleta.jpg`,
          alt: c.alt.paleta,
          caption: c.pies.paleta,
        },
        {
          src: `${IMG}/al-tipografia.jpg`,
          alt: c.alt.tipografia,
          caption: c.pies.tipografia,
        },
      ],
    },

    // ── ACTO 01 · EL SÍMBOLO ──
    {
      kind: "act",
      index: c.actos.identidad.index,
      title: c.actos.identidad.title,
      body: c.actos.identidad.body,
    },
    // La marca y de dónde sale: eran las dos mitades apretadas de una sola ancha.
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/al-simbolo-marca.jpg`,
          alt: c.alt.simboloMarca,
          caption: c.pies.simboloMarca,
        },
        {
          src: `${IMG}/al-simbolo-origen.jpg`,
          alt: c.alt.simboloOrigen,
          caption: c.pies.simboloOrigen,
        },
      ],
    },

    // ── ACTO 02 · LA MARCA SOBRE EL ACERO (mockups, y la ficha lo dice) ──
    {
      kind: "act",
      index: c.actos.aplicaciones.index,
      title: c.actos.aplicaciones.title,
      body: c.actos.aplicaciones.body,
    },
    {
      kind: "wide",
      lead: c.leads.camion,
      image: {
        src: `${IMG}/al-camion.jpg`,
        alt: c.alt.camion,
        caption: c.pies.camion,
        mobileSrc: `${IMG}/al-camion-movil.jpg`,
      },
    },
    // El reto, entre las dos piezas de las que habla: la carrocería y la prenda.
    { kind: "text", title: c.challengeTitle, body: c.challenge },
    // El chaleco en plano y puesto: detalle y contexto, una cuadrada cada uno.
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/al-chaleco-plano.jpg`,
          alt: c.alt.chalecoPlano,
          caption: c.pies.chalecoPlano,
        },
        {
          src: `${IMG}/al-chaleco-espalda.jpg`,
          alt: c.alt.chalecoEspalda,
          caption: c.pies.chalecoEspalda,
        },
      ],
    },

    // ── ACTO 03 · DOS LÍNEAS, UN SISTEMA ──
    {
      kind: "act",
      index: c.actos.lineas.index,
      title: c.actos.lineas.title,
      body: c.actos.lineas.body,
    },
    {
      kind: "wide",
      lead: c.leads.marcas,
      image: {
        src: `${IMG}/al-marcas.jpg`,
        alt: c.alt.marcas,
        caption: c.pies.marcas,
        mobileSrc: `${IMG}/al-marcas-movil.jpg`,
      },
    },
    // «Lo entregado» delante del brochure: el cierre no son dos textos pegados.
    { kind: "text", id: "resultado", title: c.outcomesTitle, body: c.outcomes },
    {
      kind: "wide",
      lead: c.leads.brochure,
      image: {
        src: `${IMG}/al-brochure.jpg`,
        alt: c.alt.brochure,
        caption: c.pies.brochure,
        mobileSrc: `${IMG}/al-brochure-movil.jpg`,
      },
    },
    { kind: "tags", title: c.stackTitle, items: c.stack },
  ];
}

export default function AlyerContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseStory
        // El acento es de Alyer, no de Axium: su rojo (#E52729) y su negro (#1D1D1B).
        // `base` va sobre blanco (5,4:1) y `dark` sobre la tinta #060C20 (5,3:1); el rojo
        // del manual tal cual se queda en 4,5:1 y 4,3:1, así que se oscurece un punto
        // para el claro y se aclara otro para el oscuro. A ojo es el mismo rojo.
        accent={{ base: "#CE2027", dark: "#FA3A3D", deep: "#1D1D1B" }}
        name="Alyer"
        tagline={c.tagline}
        heroImage={`${IMG}/al-hero.jpg`}
        heroPosition="74% 62%"
        logo={{ src: `${IMG}/al-logo.png`, width: 693, height: 157 }}
        meta={c.meta}
        statement={c.statement}
        context={c.context}
        blocks={bloques(c)}
        next={{
          name: "Aurore",
          tagline: c.nextTagline,
          href: "/casos-de-exito/aurore",
          image: "/images/proyects/aurore/aurore-portada-yeso.jpg",
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
