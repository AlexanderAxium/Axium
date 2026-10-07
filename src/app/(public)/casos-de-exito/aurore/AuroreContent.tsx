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
 * Ficha larga de Aurore (aurore.com.pe), perfumería de nicho, de diseñador y árabe.
 *
 * LA FORMA SALE DEL ALCANCE. Alexander, 2026-09-29: «no lo encasilles, cada proyecto que
 * sea un mundo con su propia narrativa, pero siguiendo ciertos patrones de diseño; también
 * depende de lo que hicimos por cada uno». Para Aurore hicimos tres cosas y por eso la ficha
 * tiene tres actos, y abre por la tienda porque es lo principal:
 *   01 · Identidad      logotipo, monograma, sistema tipográfico y paleta
 *   02 · Dirección de arte  las portadas del carrusel de la web y la campaña de decants
 *   03 · La tienda      aurore.com.pe, sobre Vendiq
 *
 * ── SEGUNDA VUELTA · LA PODA (2026-09-29) ───────────────────────────────────────────
 * Alexander: «no redunde, no explayes tanto, lo principal ahí es la web». La ficha medía
 * 17.206 px en 22 bloques. La referencia que él mismo pasó para refinar
 * —brandvm.com/case-studies/enterprise-ordering-platform, analizada en
 * referencias/brandvm-ordering.md— resuelve un caso entero en 5.514 px con UN párrafo de
 * 28–80 palabras por sección y tres imágenes. De ahí salieron las reglas de esta pasada:
 *
 *   · Un párrafo por sección, 40–60 palabras. Si una frase no añade un hecho, fuera.
 *   · Nada se cuenta dos veces. Que la marca no existía se decía en el contexto, en el
 *     enfoque y en el acto 01: ahora se dice una vez.
 *   · Ninguna pieza enseña lo que ya enseñó otra.
 *
 * QUÉ SE CAYÓ Y POR QUÉ (y su imagen se borró de public/images/proyects/aurore/):
 *   · `av-marca` — el héroe ya lleva el lockup de Aurore gigante y fantasma a todo el
 *     ancho. Un plano del logotipo sobre yeso justo debajo era el logotipo dos veces.
 *   · `av-mosaico` — enseñaba en pequeño las mismas seis pantallas que los bloques
 *     siguientes enseñan grandes, legibles y con su estado. Es el error que comete la
 *     referencia: a ese tamaño no se lee un botón.
 *   · `av-colecciones` + `av-catalogo` — las dos son /productos, que ya está en el panel
 *     de filtros y en el buscador.
 *   · `av-bolsa` + `av-caja` — las dos aplicaciones más flojas: escena plana, sin luz ni
 *     materia. Alexander: «menos piezas y mejores».
 *   · El bloque de texto «Vendiq» — repetía con más palabras lo que ya dice el acto 03.
 *   · El bloque «Enfoque» — era el contexto y los tres actos otra vez.
 *   · Las viñetas de «Resultados» — eran la lista de «Lo que hicimos» por segunda vez.
 *
 * DE DÓNDE SALE CADA IMAGEN (ver capturas-saas/brandvm-casos/taller-aurore.html):
 *   · La interfaz es SIEMPRE captura real de aurore.com.pe (2026-09-29), nunca generada.
 *   · El logotipo es el archivo real que sirve su propia web, partido en monograma y palabra.
 *   · Las escenas son de Higgsfield (nano_banana_pro): solo superficie, luz y materiales.
 *   · 2026-10-07 (Alexander: «los mockups que usa no están bonitos» y la mezcla de Paisanos):
 *     los aparatos planos pasan a escenas fotográficas de OpenAI con la web real dentro (la
 *     portada animada en un mostrador, el celular en una mano, la tableta en un sillón), y entran
 *     una persona probando un decant con piezas reales flotando encima y un paradero con la
 *     campaña de decants. Los pies dicen «Foto generada» y «Mockup» donde toca. Recetas:
 *     portafolio-axium/COMPOSITOR.md, decimocuarta generación.
 *
 * ⚠ HONESTIDAD, dos reglas que no se rompen:
 *   1. Lo que es mockup lo dice su pie («Mockup: un paradero…»). No se presenta como foto de
 *      una pieza impresa o instalada.
 *   2. Las PORTADAS del carrusel de aurore.com.pe las hizo Axium (Alexander, 2026-10-07:
 *      «los creativos de la web los hicimos nosotros»): la escena, la luz y el encuadre son
 *      nuestros, el frasco es de la casa, y el pie lo dice así. Pueden ir sueltas, como en el
 *      acto 02. La foto de producto de las fichas de la tienda (la de cada casa) sigue
 *      saliendo solo DENTRO de una captura. Ninguna escena GENERADA para esta ficha lleva
 *      frascos de marca.
 *
 * `results` sigue vacío a propósito: no hay analítica y no se inventan cifras. La prueba es
 * el inventario de lo construido, y cada dato del cierre se lee en una captura de arriba.
 *
 * ACTO 04 · INSTAGRAM — PREPARADO, NO PUBLICADO. Su web solo enlaza WhatsApp y no tenemos
 * el handle ni las capturas del feed. Los textos están escritos abajo (INSTAGRAM_PENDIENTE)
 * y el bloque se añade en cuanto lleguen las piezas. No se inventa un feed ni se usa el de
 * otra marca.
 */

const IMG = "/images/proyects/aurore";

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
  actos: Record<"identidad" | "arte" | "tienda", Acto>;
  variantesTitle: string;
  variantes: string;
  outcomesTitle: string;
  outcomes: string;
  stackTitle: string;
  stack: string[];
  leads: {
    portada: string;
    buscar: string;
    ficha: string;
    fragancia: string;
  };
  pies: {
    portada: string;
    argos: string;
    amouage: string;
    explorar: string;
    movil: string;
    buscar: string;
    ficha: string;
    fragancia: string;
    paradero: string;
  };
  alt: {
    portada: string;
    tipografia: string;
    paleta: string;
    argos: string;
    amouage: string;
    explorar: string;
    movil: string;
    buscar: string;
    ficha: string;
    fragancia: string;
    paradero: string;
  };
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    tagline:
      "Marca, dirección de arte y tienda de una perfumería que se recorre por casa, por nota y por ocasión",
    meta: [
      ["Estado", "En producción"],
      ["Entregables", "Identidad, dirección de arte, tienda online"],
      ["Industria", "Perfumería de nicho, de diseñador y árabe"],
      ["Plataforma", "Web (tienda) sobre Vendiq"],
    ],
    statement:
      "Hicimos Aurore entera: la marca, las portadas de su web y la tienda donde se recorren 278 fragancias.",
    context:
      "Perfumería peruana de casas de diseñador, nicho y árabe, que vende el frasco entero y el decant del mismo perfume. La marca se creó para este encargo: no había logotipo ni tipografía ni paleta.",
    highlightsTitle: ["Lo que", "hicimos"],
    highlights: [
      {
        lead: "Marca desde cero",
        text: "logotipo, monograma, dos tipografías y cinco colores, más cuatro colores editoriales, las cuatro puertas al catálogo.",
      },
      {
        lead: "Dirección de arte",
        text: "las portadas del carrusel, una escena hecha para cada casa.",
      },
      {
        lead: "278 fragancias",
        text: "cada una con su casa, su familia olfativa, su concentración y sus presentaciones.",
      },
      {
        lead: "Navegación de perfumería",
        text: "por casa, por nota, por colección y por ocasión, más la rejilla y el buscador.",
      },
      {
        lead: "Decants de 1 a 10 ml",
        text: "cuatro presentaciones de un solo producto, cada una con su precio.",
      },
      {
        lead: "Móvil primero",
        text: "el diseño se resolvió en el celular, donde se compra.",
      },
    ],
    challengeTitle: "Reto",
    challenge:
      "A un perfume se llega por una casa, una nota o una ocasión, casi nunca por su nombre, y una rejilla con filtros obliga a saberlo. Del mismo perfume se venden dos cosas, frasco y decant, que como productos distintos duplican el catálogo.",
    actos: {
      identidad: {
        index: "Acto 01",
        title: ["Una marca", "desde cero"],
        body: "La A capitular con su rasgo caligráfico se dibujó para aguantar los dos extremos del negocio: una etiqueta de dos centímetros y la cabecera de la tienda a todo el ancho.",
      },
      arte: {
        index: "Acto 02",
        title: ["La dirección", "de arte"],
        body: "Cada portada del carrusel es una escena hecha para su casa: Argos entre mármol y agua, Amouage sobre piedra blanca y bruma. El frasco es de la casa; la escena, la luz y el encuadre son nuestros. El paradero es un mockup.",
      },
      tienda: {
        index: "Acto 03",
        title: ["La tienda", "en línea"],
        body: "aurore.com.pe corre sobre Vendiq, el producto de comercio de Axium, en su propio dominio y sin comisión por venta: catálogo, stock, envíos por distrito y comprobantes en un mismo sitio, sin plugins. Todo lo que sigue es captura real.",
      },
    },
    variantesTitle: "Un producto, cuatro presentaciones",
    variantes:
      "1, 2, 5 y 10 ml son presentaciones del mismo perfume. La ficha lo cuenta una vez y el selector cambia el precio sin cambiar de página; el filtro recorre de 1 ml a 250 ml y la rejilla muestra el rango.",
    outcomesTitle: "Resultados",
    outcomes:
      "Aurore está en línea con 278 fragancias, cuatro presentaciones de decant por producto y envíos a todo el Perú. No publicamos cifras de venta: no tenemos su analítica.",
    stackTitle: "Disciplinas y tecnología",
    stack: [
      "Identidad de marca",
      "Sistema tipográfico",
      "Diseño UX/UI",
      "Diseño de producto",
      "Desarrollo web",
      "Comercio electrónico",
      "Vendiq",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
    ],
    leads: {
      portada:
        "La portada no es una rejilla de ofertas: cada bloque es una puerta a una colección.",
      buscar:
        "El buscador resuelve casas y notas, no solo nombres: «oud» devuelve trece fragancias de casas distintas.",
      ficha:
        "Las cuatro presentaciones conviven con la concentración, la familia olfativa y el público.",
      fragancia:
        "El decant existe para esto: probar el perfume en la piel antes de comprar el frasco.",
    },
    pies: {
      portada:
        "aurore.com.pe bajando por la portada, en la laptop y en el celular: colecciones, decants y las cuatro puertas del catálogo.",
      argos:
        "Portada de aurore.com.pe para Argos: «mitos que se llevan en la piel». La escena es nuestra; los frascos, de la casa.",
      amouage:
        "Portada de aurore.com.pe para Amouage, «la casa de Omán». La escena es nuestra; los frascos, de la casa.",
      explorar:
        "aurore.com.pe/productos — el panel de filtros abierto, con las casas y sus conteos.",
      movil:
        "El móvil es el diseño principal: «La fragancia» de Xerjoff Naxos, con sus notas de salida, corazón y fondo.",
      buscar:
        "aurore.com.pe/productos?search=oud en una tableta — el resultado de buscar una nota.",
      ficha:
        "aurore.com.pe — elegir 1, 2, 5 o 10 ml cambia el precio sin cambiar de página.",
      fragancia:
        "Foto generada; encima, la tarjeta de Xerjoff Naxos y su selector de presentaciones, capturados de aurore.com.pe.",
      paradero:
        "Mockup: un paradero con la campaña de decants, con la foto, las tipografías y el monograma reales.",
    },
    alt: {
      portada:
        "Una laptop y un celular sobre un mostrador de travertino recorren a la vez la portada de aurore.com.pe, animada",
      tipografia:
        "Espécimen tipográfico de Aurore: Sainte Colombe para los titulares y Avenir para el texto",
      paleta:
        "Paleta de Aurore: tinta, salvia, arena, crema y hueso, más los cuatro colores editoriales del catálogo",
      argos:
        "Tres frascos de Argos, Venus, Baco y Neptuno, sobre mármol con una concha y agua, a la luz de una ventana: portada de aurore.com.pe",
      amouage:
        "Dos frascos de Amouage, Existence y Decision, sobre una piedra blanca entre bruma y tela salvia: portada de aurore.com.pe",
      explorar:
        "El panel de filtros de aurore.com.pe con las casas, sus conteos y la exploración por nota olfativa",
      movil:
        "Una mano sostiene el celular con «La fragancia» de aurore.com.pe: las notas de salida, corazón y fondo de Xerjoff Naxos",
      buscar:
        "Una tableta sobre un sillón de lino muestra la búsqueda «oud» en aurore.com.pe: trece fragancias de casas distintas",
      ficha:
        "La ficha de Xerjoff Naxos en aurore.com.pe, animada: de 1 a 10 ml el precio pasa de S/ 25 a S/ 135",
      fragancia:
        "Una mujer se perfuma la muñeca con un decant; flotan encima la tarjeta de Xerjoff Naxos (S/ 25.00 – S/ 135.00) y el selector de 1 a 10 ml de aurore.com.pe",
      paradero:
        "Mockup de un paradero en una avenida arbolada con el afiche de Aurore: «Pruébalo antes de comprar el frasco»",
    },
    nextTagline:
      "Tienda online, punto de venta, inventario y facturación SUNAT en un solo sistema",
  },
  en: {
    tagline:
      "Brand, art direction and store for a perfumery browsed by house, by note and by occasion",
    meta: [
      ["Status", "In production"],
      ["Deliverables", "Identity, art direction, online store"],
      ["Industry", "Niche, designer and Arabic perfumery"],
      ["Platform", "Web (store) on Vendiq"],
    ],
    statement:
      "We made the whole of Aurore: the brand, the covers of its website and the store where 278 fragrances are browsed.",
    context:
      "A Peruvian perfumery of designer, niche and Arabic houses that sells both the full bottle and the decant of the same scent. The brand was created for this project: no logo, no typeface, no palette.",
    highlightsTitle: ["What we", "made"],
    highlights: [
      {
        lead: "A brand from scratch",
        text: "logo, monogram, two typefaces and five colours, plus four editorial colours, the four doors into the catalogue.",
      },
      {
        lead: "Art direction",
        text: "the carousel covers, a scene made for each house.",
      },
      {
        lead: "278 fragrances",
        text: "each with its house, olfactory family, concentration and sizes.",
      },
      {
        lead: "Perfumery navigation",
        text: "by house, by note, by collection and by occasion, plus the grid and the search.",
      },
      {
        lead: "Decants from 1 to 10 ml",
        text: "four sizes on a single product, each with its own price.",
      },
      {
        lead: "Mobile first",
        text: "the layout was solved on the phone, where people buy.",
      },
    ],
    challengeTitle: "Challenge",
    challenge:
      "You reach a perfume through a house, a note or an occasion, almost never by name, and a grid of filters makes you know it first. The same perfume sells as two things, bottle and decant, which as separate products double the catalogue.",
    actos: {
      identidad: {
        index: "Act 01",
        title: ["A brand", "from scratch"],
        body: "The capital A with its calligraphic flourish was drawn for both ends of the business: a two-centimetre label and a full-width store header.",
      },
      arte: {
        index: "Act 02",
        title: ["Art", "direction"],
        body: "Each cover in the carousel is a scene made for its house: Argos among marble and water, Amouage on white stone and mist. The bottle belongs to the house; the scene, the light and the framing are ours. The bus shelter is a mockup.",
      },
      tienda: {
        index: "Act 03",
        title: ["The store", "online"],
        body: "aurore.com.pe runs on Vendiq, Axium's commerce product, on its own domain and with no commission per sale: catalogue, stock, shipping by district and receipts in one place, no plugins. Everything that follows is a real screenshot.",
      },
    },
    variantesTitle: "One product, four sizes",
    variantes:
      "1, 2, 5 and 10 ml are sizes of the same perfume. The page tells it once and the selector changes the price without changing page; the filter runs from 1 ml to 250 ml and the grid shows the range.",
    outcomesTitle: "Outcomes",
    outcomes:
      "Aurore is live with 278 fragrances, four decant sizes per product and shipping across Peru. We publish no sales figures: we do not have their analytics.",
    stackTitle: "Disciplines and technology",
    stack: [
      "Brand identity",
      "Type system",
      "UX/UI design",
      "Product design",
      "Web development",
      "E-commerce",
      "Vendiq",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
    ],
    leads: {
      portada:
        "The home page is not a grid of offers: every block is a door into a collection.",
      buscar:
        "Search resolves houses and notes, not just names: “oud” returns thirteen fragrances from different houses.",
      ficha:
        "The four sizes sit alongside the concentration, the olfactory family and who it is for.",
      fragancia:
        "This is what the decant is for: trying the perfume on your skin before buying the bottle.",
    },
    pies: {
      portada:
        "aurore.com.pe scrolling down its home page, on a laptop and on a phone: collections, decants and the catalog's four doors.",
      argos:
        "aurore.com.pe cover for Argos: “myths you wear on your skin”. The scene is ours; the bottles, the house's.",
      amouage:
        "aurore.com.pe cover for Amouage, “the house of Oman”. The scene is ours; the bottles, the house's.",
      explorar:
        "aurore.com.pe/productos — the filter panel open, with the houses and their counts.",
      movil:
        "Mobile is the primary layout: Xerjoff Naxos' “The fragrance”, with its top, heart and base notes.",
      buscar:
        "aurore.com.pe/productos?search=oud on a tablet — the result of searching for a note.",
      ficha:
        "aurore.com.pe — picking 1, 2, 5 or 10 ml changes the price without leaving the page.",
      fragancia:
        "Generated photo; on top, the Xerjoff Naxos card and its size selector, captured from aurore.com.pe.",
      paradero:
        "Mockup: a bus shelter with the decants campaign, using the real photo, typefaces and monogram.",
    },
    alt: {
      portada:
        "A laptop and a phone on a travertine counter scroll through the aurore.com.pe home page at the same time, animated",
      tipografia:
        "Aurore type specimen: Sainte Colombe for headlines and Avenir for text",
      paleta:
        "Aurore palette: ink, sage, sand, cream and bone, plus the four editorial colours of the catalogue",
      argos:
        "Three Argos bottles, Venus, Bacchus and Neptune, on marble with a shell and water in window light: an aurore.com.pe cover",
      amouage:
        "Two Amouage bottles, Existence and Decision, on white stone among mist and sage fabric: an aurore.com.pe cover",
      explorar:
        "The aurore.com.pe filter panel with the houses, their counts and browsing by olfactory note",
      movil:
        "A hand holds a phone showing “The fragrance” on aurore.com.pe: Xerjoff Naxos' top, heart and base notes",
      buscar:
        "A tablet on a linen armchair shows the “oud” search on aurore.com.pe: thirteen fragrances from different houses",
      ficha:
        "The Xerjoff Naxos product page on aurore.com.pe, animated: from 1 to 10 ml the price goes from S/ 25 to S/ 135",
      fragancia:
        "A woman sprays perfume from a decant onto her wrist; floating above, the Xerjoff Naxos card (S/ 25.00 – S/ 135.00) and the 1 to 10 ml selector from aurore.com.pe",
      paradero:
        "Mockup of a bus shelter on a tree-lined avenue with the Aurore poster: “Try it before buying the bottle”",
    },
    nextTagline:
      "Online store, point of sale, inventory and SUNAT invoicing in one system",
  },
  pt: {
    tagline:
      "Marca, direção de arte e loja de uma perfumaria percorrida por casa, por nota e por ocasião",
    meta: [
      ["Status", "Em produção"],
      ["Entregas", "Identidade, direção de arte, loja online"],
      ["Setor", "Perfumaria de nicho, de designer e árabe"],
      ["Plataforma", "Web (loja) sobre o Vendiq"],
    ],
    statement:
      "Fizemos a Aurore inteira: a marca, as capas do seu site e a loja onde se percorrem 278 fragrâncias.",
    context:
      "Perfumaria peruana de casas de designer, nicho e árabe, que vende o frasco inteiro e o decant do mesmo perfume. A marca foi criada para este projeto: não havia logotipo nem tipografia nem paleta.",
    highlightsTitle: ["O que", "fizemos"],
    highlights: [
      {
        lead: "Uma marca do zero",
        text: "logotipo, monograma, duas tipografias e cinco cores, mais quatro cores editoriais, as quatro portas do catálogo.",
      },
      {
        lead: "Direção de arte",
        text: "as capas do carrossel, uma cena feita para cada casa.",
      },
      {
        lead: "278 fragrâncias",
        text: "cada uma com sua casa, sua família olfativa, sua concentração e suas apresentações.",
      },
      {
        lead: "Navegação de perfumaria",
        text: "por casa, por nota, por coleção e por ocasião, mais a grade e a busca.",
      },
      {
        lead: "Decants de 1 a 10 ml",
        text: "quatro apresentações de um único produto, cada uma com seu preço.",
      },
      {
        lead: "Celular primeiro",
        text: "o layout foi resolvido no celular, onde se compra.",
      },
    ],
    challengeTitle: "Desafio",
    challenge:
      "Chega-se a um perfume por uma casa, uma nota ou uma ocasião, quase nunca pelo nome, e uma grade de filtros obriga a saber antes. Do mesmo perfume vendem-se duas coisas, frasco e decant, que como produtos distintos dobram o catálogo.",
    actos: {
      identidad: {
        index: "Ato 01",
        title: ["Uma marca", "do zero"],
        body: "O A capitular com seu traço caligráfico foi desenhado para os dois extremos do negócio: um rótulo de dois centímetros e o cabeçalho da loja em toda a largura.",
      },
      arte: {
        index: "Ato 02",
        title: ["Direção", "de arte"],
        body: "Cada capa do carrossel é uma cena feita para a sua casa: Argos entre mármore e água, Amouage sobre pedra branca e névoa. O frasco é da casa; a cena, a luz e o enquadramento são nossos. O ponto de ônibus é um mockup.",
      },
      tienda: {
        index: "Ato 03",
        title: ["A loja", "online"],
        body: "aurore.com.pe roda sobre o Vendiq, o produto de comércio da Axium, em domínio próprio e sem comissão por venda: catálogo, estoque, entregas por distrito e comprovantes no mesmo lugar, sem plugins. Tudo o que segue é captura real.",
      },
    },
    variantesTitle: "Um produto, quatro apresentações",
    variantes:
      "1, 2, 5 e 10 ml são apresentações do mesmo perfume. A página o conta uma vez e o seletor muda o preço sem mudar de página; o filtro percorre de 1 ml a 250 ml e a grade mostra a faixa.",
    outcomesTitle: "Resultados",
    outcomes:
      "A Aurore está no ar com 278 fragrâncias, quatro apresentações de decant por produto e envios para todo o Peru. Não publicamos números de venda: não temos a analítica deles.",
    stackTitle: "Disciplinas e tecnologia",
    stack: [
      "Identidade de marca",
      "Sistema tipográfico",
      "Design UX/UI",
      "Design de produto",
      "Desenvolvimento web",
      "Comércio eletrônico",
      "Vendiq",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
    ],
    leads: {
      portada:
        "A capa não é uma grade de ofertas: cada bloco é uma porta para uma coleção.",
      buscar:
        "A busca resolve casas e notas, não só nomes: “oud” devolve treze fragrâncias de casas diferentes.",
      ficha:
        "As quatro apresentações convivem com a concentração, a família olfativa e o público.",
      fragancia:
        "O decant existe para isso: provar o perfume na pele antes de comprar o frasco.",
    },
    pies: {
      portada:
        "aurore.com.pe descendo pela capa, no laptop e no celular: coleções, decants e as quatro portas do catálogo.",
      argos:
        "Capa de aurore.com.pe para Argos: “mitos que se levam na pele”. A cena é nossa; os frascos, da casa.",
      amouage:
        "Capa de aurore.com.pe para Amouage, “a casa de Omã”. A cena é nossa; os frascos, da casa.",
      explorar:
        "aurore.com.pe/productos — o painel de filtros aberto, com as casas e suas contagens.",
      movil:
        "O celular é o layout principal: “A fragrância” do Xerjoff Naxos, com suas notas de saída, coração e fundo.",
      buscar:
        "aurore.com.pe/productos?search=oud em um tablet — o resultado de buscar uma nota.",
      ficha:
        "aurore.com.pe — escolher 1, 2, 5 ou 10 ml muda o preço sem trocar de página.",
      fragancia:
        "Foto gerada; por cima, o cartão do Xerjoff Naxos e seu seletor de apresentações, capturados de aurore.com.pe.",
      paradero:
        "Mockup: um ponto de ônibus com a campanha de decants, com a foto, as tipografias e o monograma reais.",
    },
    alt: {
      portada:
        "Um laptop e um celular sobre um balcão de travertino percorrem ao mesmo tempo a capa de aurore.com.pe, animada",
      tipografia:
        "Espécime tipográfico da Aurore: Sainte Colombe para os títulos e Avenir para o texto",
      paleta:
        "Paleta da Aurore: tinta, sálvia, areia, creme e osso, mais as quatro cores editoriais do catálogo",
      argos:
        "Três frascos de Argos, Vênus, Baco e Netuno, sobre mármore com uma concha e água, à luz de uma janela: capa de aurore.com.pe",
      amouage:
        "Dois frascos de Amouage, Existence e Decision, sobre uma pedra branca entre névoa e tecido sálvia: capa de aurore.com.pe",
      explorar:
        "O painel de filtros de aurore.com.pe com as casas, suas contagens e a exploração por nota olfativa",
      movil:
        "Uma mão segura o celular com “A fragrância” de aurore.com.pe: as notas de saída, coração e fundo do Xerjoff Naxos",
      buscar:
        "Um tablet sobre uma poltrona de linho mostra a busca “oud” em aurore.com.pe: treze fragrâncias de casas diferentes",
      ficha:
        "A página do Xerjoff Naxos em aurore.com.pe, animada: de 1 a 10 ml o preço vai de S/ 25 a S/ 135",
      fragancia:
        "Uma mulher borrifa perfume de um decant no pulso; flutuam por cima o cartão do Xerjoff Naxos (S/ 25.00 – S/ 135.00) e o seletor de 1 a 10 ml de aurore.com.pe",
      paradero:
        "Mockup de um ponto de ônibus em uma avenida arborizada com o cartaz da Aurore: “Prove antes de comprar o frasco”",
    },
    nextTagline:
      "Loja online, ponto de venda, estoque e faturamento SUNAT em um só sistema",
  },
};

/**
 * Quince bloques.
 *
 * ── TERCERA VUELTA · EL RITMO (2026-09-30) ──────────────────────────────────────────
 * Alexander: «veo a veces mucho texto seguido, y mucha foto mockup de lo mismo». Medido a
 * 1440, la ficha tenía un tramo de 1.316 px sin una sola imagen —las viñetas, el reto y la
 * apertura del acto 01, todo seguido— y otro de 920 al cierre. No sobra texto (eso ya se
 * podó en la segunda vuelta): sobraba orden.
 *   · El par de la tienda (/productos y el móvil) sube detrás de las viñetas. Es el mismo
 *     criterio que ya traía la portada arriba: la tienda es lo principal y va delante.
 *     El acto 03 se queda con el buscador, la ficha de decant y la pirámide olfativa.
 *   · «Resultados» se mete delante de la última imagen, para que el cierre no sean dos
 *     textos pegados antes del carrusel.
 *
 * ── Y SE CAE UN MOCKUP MÁS ──────────────────────────────────────────────────────────
 * `av-decants` (cuatro atomizadores sobre travertino, plano ancho) y `av-decant-macro`
 * eran el MISMO objeto. El macro es el que tiene el argumento: ahí la etiqueta mide dos
 * centímetros y se ve que la marca aguanta el peor sitio posible; el plano ancho decía lo
 * mismo con las etiquetas pequeñas y medio desenfocadas. Fuera el ancho, y su archivo
 * borrado. La frase que traía («el decant es el negocio…») no se pierde: abre ahora el
 * párrafo del acto 02. No se generó nada para sustituirlo: la caja y la bolsa ya se
 * cayeron en la poda por escena floja, y una pieza nueva solo para rellenar es lo que
 * sobra en una ficha, no lo que le falta.
 *
 * (2026-10-07: el macro y la papelería también se fueron; en su sitio, dos portadas del
 * carrusel de la web, que sí son trabajo nuestro. Ver el acto 02.)
 */
function bloques(c: Copy): StoryBlock[] {
  return [
    // La tienda, antes que nada: es lo principal del encargo y lo primero que se ve.
    // (El héroe ya lleva el logotipo de Aurore gigante: repetirlo aquí sobraba.)
    {
      kind: "wide",
      lead: c.leads.portada,
      image: {
        // Animada (2026-10-07) DENTRO de una escena: la laptop y el celular sobre un mostrador de
        // travertino bajan a la vez por aurore.com.pe (capturar-scroll-cuadros.cjs +
        // video-escena-dispositivos.py). Alexander: «los mockups que usa no están bonitos». La
        // primera versión se compuso sobre la edición en magenta, que había dibujado la tapa de
        // frente sobre una base en tres cuartos («qué fea laptop, está deformada»): esta va
        // sobre la escena ORIGINAL con las esquinas de cada tapa medidas a mano (--quads).
        // En el celular, el póster a resolución completa recortado a 4:3
        src: `${IMG}/av-portada-mostrador.jpg`,
        video: `${IMG}/av-portada-mostrador.mp4`,
        alt: c.alt.portada,
        caption: c.pies.portada,
        mobileSrc: `${IMG}/av-portada-mostrador-movil.jpg`,
      },
    },
    { kind: "highlights", title: c.highlightsTitle, items: c.highlights },
    // El catálogo y el móvil, partiendo la apertura: las viñetas acaban de nombrar los dos.
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/av-explorar.jpg`,
          alt: c.alt.explorar,
          caption: c.pies.explorar,
        },
        // La mano con el celular (escena generada + captura real de «La fragancia»)
        {
          src: `${IMG}/av-fragancia-celular.jpg`,
          alt: c.alt.movil,
          caption: c.pies.movil,
        },
      ],
    },
    { kind: "text", title: c.challengeTitle, body: c.challenge },

    // ── ACTO 01 · IDENTIDAD ──
    {
      kind: "act",
      index: c.actos.identidad.index,
      title: c.actos.identidad.title,
      body: c.actos.identidad.body,
    },
    {
      kind: "pair",
      images: [
        { src: `${IMG}/av-tipografia.jpg`, alt: c.alt.tipografia },
        { src: `${IMG}/av-paleta.jpg`, alt: c.alt.paleta },
      ],
    },

    // ── ACTO 02 · DIRECCIÓN DE ARTE (las portadas de la web, hechas por Axium) ──
    {
      kind: "act",
      index: c.actos.arte.index,
      title: c.actos.arte.title,
      body: c.actos.arte.body,
    },
    // Dos portadas del carrusel de aurore.com.pe, a su resolución (2880×1440 recortadas a
    // 1440 cuadrado sobre los frascos). Sustituyen a la etiqueta del decant y la papelería
    // (2026-10-07, Alexander: «reemplaza esas dos imágenes por alguna de nuestras portadas
    // web o algún perfume, porque también los creativos de la web los hicimos nosotros»).
    // Babycat y «Casas de autor» no: ya salen en la laptop y el celular de la portada.
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/av-portada-argos.jpg`,
          alt: c.alt.argos,
          caption: c.pies.argos,
        },
        {
          src: `${IMG}/av-portada-amouage.jpg`,
          alt: c.alt.amouage,
          caption: c.pies.amouage,
        },
      ],
    },
    // La marca en la calle (Paisanos, 2026-10-07): un paradero con la campaña de decants. El
    // afiche se armó dentro de aurore.com.pe con sus fuentes, su monograma y la foto de su banner
    {
      kind: "wide",
      image: {
        src: `${IMG}/av-paradero.jpg`,
        alt: c.alt.paradero,
        caption: c.pies.paradero,
        mobileSrc: `${IMG}/av-paradero-movil.jpg`,
      },
    },

    // ── ACTO 03 · LA TIENDA (todo captura real, y cada bloque su estado) ──
    {
      kind: "act",
      index: c.actos.tienda.index,
      title: c.actos.tienda.title,
      body: c.actos.tienda.body,
    },
    {
      kind: "wide",
      lead: c.leads.buscar,
      image: {
        // En una tableta sobre un sillón de lino (escena generada + captura real a 1180×820)
        src: `${IMG}/av-buscar-tableta.jpg`,
        alt: c.alt.buscar,
        caption: c.pies.buscar,
        mobileSrc: `${IMG}/av-buscar-tableta-movil.jpg`,
      },
    },
    // Capítulo de decisión técnica (Viget): el modelo de datos que sostiene el decant
    { kind: "text", title: c.variantesTitle, body: c.variantes },
    {
      kind: "wide",
      lead: c.leads.ficha,
      image: {
        // Animada (2026-10-07): el selector de presentaciones de Xerjoff Naxos, clic a clic
        // (grabar-hover.cjs con accion "click"). Un detalle ampliado, sin aparato
        src: `${IMG}/av-presentaciones.jpg`,
        video: `${IMG}/av-presentaciones.mp4`,
        alt: c.alt.ficha,
        caption: c.pies.ficha,
        mobileSrc: `${IMG}/av-decant-ficha-movil.jpg`,
      },
    },
    // «Resultados» delante de la última pieza: el cierre no son dos textos pegados.
    {
      kind: "text",
      id: "resultado",
      title: c.outcomesTitle,
      body: c.outcomes,
    },
    {
      kind: "wide",
      lead: c.leads.fragancia,
      image: {
        // Persona real + UI flotante (R28, Paisanos/Brubank): foto generada de alguien probando un
        // decant sin marca, y encima piezas REALES de aurore.com.pe en vidrio esmerilado
        // (componer-flotantes.py). La pirámide olfativa pasó al celular de arriba
        src: `${IMG}/av-probar.jpg`,
        alt: c.alt.fragancia,
        caption: c.pies.fragancia,
        mobileSrc: `${IMG}/av-probar-movil.jpg`,
      },
    },
    { kind: "tags", title: c.stackTitle, items: c.stack },
  ];
}

export default function AuroreContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseStory
        // El acento sale de la marca del cliente, no de Axium: tierra · arena · sombra.
        // base va sobre claro y dark sobre la tinta; los dos pasan 4.5:1.
        accent={{ base: "#7A5F44", dark: "#E6C8AC", deep: "#3A302A" }}
        name="Aurore"
        tagline={c.tagline}
        heroImage={`${IMG}/av-hero.jpg`}
        heroPosition="58% 62%"
        logo={{ src: `${IMG}/av-logo.png`, width: 1200, height: 857 }}
        liveUrl="https://aurore.com.pe"
        meta={c.meta}
        statement={c.statement}
        context={c.context}
        blocks={bloques(c)}
        next={{
          name: "Vendiq",
          tagline: c.nextTagline,
          href: "/casos-de-exito/vendiq",
          image: "/images/proyects/vendiq/vendiq-portada-pulso.jpg",
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

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * ACTO 04 · INSTAGRAM — PREPARADO, SIN PUBLICAR (2026-09-29)
 *
 * QUÉ FALTA PARA PUBLICARLO (nada de esto se puede inventar):
 *   1. El handle de Instagram de Aurore. Su web solo enlaza WhatsApp
 *      (wa.me/51991285679) y no hay icono de Instagram en el pie ni en la cabecera.
 *   2. Captura del perfil a 2x (cabecera con foto, nombre, bio y contadores).
 *   3. Captura de la rejilla del feed, al menos 9 publicaciones.
 *   4. 3–6 piezas sueltas a resolución original (post y story) para la galería.
 *   5. Confirmar con Alexander qué se hizo exactamente: ¿la identidad visual del feed,
 *      las piezas, el calendario, la redacción? El acto tiene que decir eso y no más.
 *
 * CÓMO SE PUBLICA CUANDO LLEGUE:
 *   · Añadir `redes` al array `Copy.actos` con el texto de abajo, en es/en/pt.
 *   · Componer las piezas en taller-aurore.html con la receta R13 (feed en dispositivo):
 *     un celular con el perfil real + 4–6 posts como tarjetas sueltas alrededor, sobre el
 *     campo arena de la marca. Salidas: av-instagram.jpg (2:1) y av-posts.jpg (1:1).
 *   · Insertar después del acto 03 y antes de «Resultados»:
 *       { kind: "act", index: c.actos.redes.index, title: c.actos.redes.title, body: c.actos.redes.body },
 *       { kind: "wide", lead: c.leads.instagram, image: { src: `${IMG}/av-instagram.jpg`, … } },
 *       { kind: "pair", images: [ … av-posts.jpg … ] },
 *   · Y sumar «Redes sociales» y «Dirección de arte» al bloque `tags`.
 *   · OJO CON LA PODA: el acto 04 añade tres bloques. Si entra, sale otra cosa —
 *     el candidato es el par «explorar + móvil», cuyo contenido ya asoma en la portada.
 *
 * TEXTOS YA ESCRITOS (es · en · pt):
 *
 *   ACTO 04 — «Instagram» / «La marca» + «en movimiento»
 *   es: «El mismo monograma, la misma pareja tipográfica y los mismos cinco colores bajan
 *        al formato donde la perfumería se descubre hoy: una rejilla de nueve piezas en la
 *        que la marca tiene que reconocerse antes de leerse.»
 *   en: «The same monogram, the same type pairing and the same five colours come down to
 *        the format where perfumery is discovered today: a grid of nine posts in which the
 *        brand has to be recognised before it is read.»
 *   pt: «O mesmo monograma, a mesma dupla tipográfica e as mesmas cinco cores descem para
 *        o formato onde a perfumaria é descoberta hoje: uma grade de nove peças em que a
 *        marca precisa ser reconhecida antes de ser lida.»
 *
 *   FRASE DE LA PIEZA (lead)
 *   es: «El feed se diseñó como una sola superficie: la rejilla se lee entera antes de que
 *        se abra una sola publicación.»
 *   en: «The feed was designed as a single surface: the grid reads as a whole before a
 *        single post is opened.»
 *   pt: «O feed foi desenhado como uma superfície única: a grade se lê inteira antes de
 *        qualquer publicação ser aberta.»
 * ─────────────────────────────────────────────────────────────────────────────
 */
