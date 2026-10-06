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
 *   02 · Aplicaciones   etiqueta de decant y papelería
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
 *
 * ⚠ HONESTIDAD, dos reglas que no se rompen:
 *   1. Las piezas del acto 02 son MOCKUPS: escena generada con el objeto en blanco + el
 *      logotipo real compuesto encima. La ficha lo dice con esas palabras en el propio acto
 *      y en el pie de cada pieza. No se presentan como fotos de piezas impresas.
 *   2. La fotografía de producto de la tienda es de las casas (Dior, YSL, Parfums de Marly).
 *      Sale solo DENTRO de una captura de la tienda —que es el trabajo real y es honesto—,
 *      nunca como imagen suelta del caso. Ninguna escena generada lleva frascos de marca.
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
  actos: Record<"identidad" | "aplicaciones" | "tienda", Acto>;
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
    macro: string;
    papeleria: string;
    explorar: string;
    movil: string;
    buscar: string;
    ficha: string;
    fragancia: string;
  };
  alt: {
    portada: string;
    tipografia: string;
    paleta: string;
    macro: string;
    papeleria: string;
    explorar: string;
    movil: string;
    buscar: string;
    ficha: string;
    fragancia: string;
  };
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    tagline:
      "Marca, aplicaciones y tienda de una perfumería que se recorre por casa, por nota y por ocasión",
    meta: [
      ["Estado", "En producción"],
      ["Entregables", "Identidad, aplicaciones de marca, tienda online"],
      ["Industria", "Perfumería de nicho, de diseñador y árabe"],
      ["Plataforma", "Web (tienda) sobre Vendiq"],
    ],
    statement:
      "Hicimos Aurore entera: la marca, sus aplicaciones y la tienda donde se recorren 278 fragancias.",
    context:
      "Perfumería peruana de casas de diseñador, nicho y árabe, que vende el frasco entero y el decant del mismo perfume. La marca se creó para este encargo: no había logotipo ni tipografía ni paleta.",
    highlightsTitle: ["Lo que", "hicimos"],
    highlights: [
      {
        lead: "Marca desde cero",
        text: "logotipo, monograma, dos tipografías y cinco colores, más cuatro colores editoriales, las cuatro puertas al catálogo.",
      },
      {
        lead: "Aplicaciones",
        text: "la etiqueta del decant y la papelería, sobre el mismo monograma.",
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
      aplicaciones: {
        index: "Acto 02",
        title: ["La marca", "aplicada"],
        body: "El decant es el negocio: el mismo perfume en un atomizador de pocos mililitros, para probarlo antes de comprar el frasco. El monograma bajó a las dos piezas con las que el cliente se queda, la etiqueta y la papelería. Las imágenes son mockups, no fotografías de piezas impresas: lo probado es el diseño, no la producción.",
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
        "«La fragancia» cuenta el perfume en el orden en que se percibe: salida, corazón y fondo.",
    },
    pies: {
      portada: "aurore.com.pe — la portada, en el escritorio y en el celular.",
      macro:
        "Mockup: el detalle de la etiqueta, donde la marca mide dos centímetros.",
      papeleria:
        "Mockup de papelería: hoja de algodón y tarjeta con el logotipo real.",
      explorar:
        "aurore.com.pe/productos — el panel de filtros abierto, con las casas y sus conteos.",
      movil: "El móvil es el diseño principal.",
      buscar:
        "aurore.com.pe/productos?search=oud — el resultado de buscar una nota.",
      ficha:
        "aurore.com.pe — la ficha de producto con sus cuatro presentaciones.",
      fragancia: "La pirámide olfativa dentro de la ficha de producto.",
    },
    alt: {
      portada: "La portada de aurore.com.pe en el escritorio y en el celular",
      tipografia:
        "Espécimen tipográfico de Aurore: Sainte Colombe para los titulares y Avenir para el texto",
      paleta:
        "Paleta de Aurore: tinta, salvia, arena, crema y hueso, más los cuatro colores editoriales del catálogo",
      macro:
        "Mockup en macro de un atomizador de decant con la etiqueta de Aurore",
      papeleria:
        "Mockup de la papelería de Aurore: hoja de algodón y tarjeta sobre yeso arena",
      explorar:
        "El panel de filtros de aurore.com.pe con las casas, sus conteos y la exploración por nota olfativa",
      movil:
        "aurore.com.pe en el celular: la portada, el catálogo y el panel de filtros",
      buscar:
        "Buscar «oud» en aurore.com.pe devuelve trece fragancias de casas distintas",
      ficha:
        "La ficha de producto de aurore.com.pe con las presentaciones de 1, 2, 5 y 10 ml",
      fragancia:
        "«La fragancia»: notas de salida, de corazón y de fondo en la ficha de producto",
    },
    nextTagline:
      "Tienda online, punto de venta, inventario y facturación SUNAT en un solo sistema",
  },
  en: {
    tagline:
      "Brand, applications and store for a perfumery browsed by house, by note and by occasion",
    meta: [
      ["Status", "In production"],
      ["Deliverables", "Identity, brand applications, online store"],
      ["Industry", "Niche, designer and Arabic perfumery"],
      ["Platform", "Web (store) on Vendiq"],
    ],
    statement:
      "We made the whole of Aurore: the brand, its applications and the store where 278 fragrances are browsed.",
    context:
      "A Peruvian perfumery of designer, niche and Arabic houses that sells both the full bottle and the decant of the same scent. The brand was created for this project: no logo, no typeface, no palette.",
    highlightsTitle: ["What we", "made"],
    highlights: [
      {
        lead: "A brand from scratch",
        text: "logo, monogram, two typefaces and five colours, plus four editorial colours, the four doors into the catalogue.",
      },
      {
        lead: "Applications",
        text: "the decant label and the stationery, on the same monogram.",
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
      aplicaciones: {
        index: "Act 02",
        title: ["The brand", "applied"],
        body: "The decant is the business: the same perfume in a few-millilitre atomiser, to wear before buying the bottle. The monogram came down onto the two pieces the customer keeps, the label and the stationery. The images are mockups, not photographs of printed pieces: what is proven is the design, not the production.",
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
        "“The fragrance” tells the perfume in the order it is perceived: top, heart and base.",
    },
    pies: {
      portada: "aurore.com.pe — the home page, on desktop and on a phone.",
      macro:
        "Mockup: the label close up, where the brand is two centimetres wide.",
      papeleria: "Stationery mockup: cotton sheet and card with the real logo.",
      explorar:
        "aurore.com.pe/productos — the filter panel open, with the houses and their counts.",
      movil: "Mobile is the primary layout.",
      buscar:
        "aurore.com.pe/productos?search=oud — the result of searching for a note.",
      ficha: "aurore.com.pe — the product page with its four sizes.",
      fragancia: "The olfactory pyramid inside the product page.",
    },
    alt: {
      portada: "The aurore.com.pe home page on desktop and on a phone",
      tipografia:
        "Aurore type specimen: Sainte Colombe for headlines and Avenir for text",
      paleta:
        "Aurore palette: ink, sage, sand, cream and bone, plus the four editorial colours of the catalogue",
      macro: "Macro mockup of a decant atomiser with the Aurore label",
      papeleria:
        "Mockup of Aurore's stationery: cotton sheet and card on sand plaster",
      explorar:
        "The aurore.com.pe filter panel with the houses, their counts and browsing by olfactory note",
      movil:
        "aurore.com.pe on mobile: the home page, the catalogue and the filter panel",
      buscar:
        "Searching “oud” on aurore.com.pe returns thirteen fragrances from different houses",
      ficha: "The aurore.com.pe product page with its 1, 2, 5 and 10 ml sizes",
      fragancia:
        "“The fragrance”: top, heart and base notes on the product page",
    },
    nextTagline:
      "Online store, point of sale, inventory and SUNAT invoicing in one system",
  },
  pt: {
    tagline:
      "Marca, aplicações e loja de uma perfumaria percorrida por casa, por nota e por ocasião",
    meta: [
      ["Status", "Em produção"],
      ["Entregas", "Identidade, aplicações de marca, loja online"],
      ["Setor", "Perfumaria de nicho, de designer e árabe"],
      ["Plataforma", "Web (loja) sobre o Vendiq"],
    ],
    statement:
      "Fizemos a Aurore inteira: a marca, suas aplicações e a loja onde se percorrem 278 fragrâncias.",
    context:
      "Perfumaria peruana de casas de designer, nicho e árabe, que vende o frasco inteiro e o decant do mesmo perfume. A marca foi criada para este projeto: não havia logotipo nem tipografia nem paleta.",
    highlightsTitle: ["O que", "fizemos"],
    highlights: [
      {
        lead: "Uma marca do zero",
        text: "logotipo, monograma, duas tipografias e cinco cores, mais quatro cores editoriais, as quatro portas do catálogo.",
      },
      {
        lead: "Aplicações",
        text: "o rótulo do decant e a papelaria, sobre o mesmo monograma.",
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
      aplicaciones: {
        index: "Ato 02",
        title: ["A marca", "aplicada"],
        body: "O decant é o negócio: o mesmo perfume num atomizador de poucos mililitros, para usar antes de comprar o frasco. O monograma desceu para as duas peças com as quais o cliente fica, o rótulo e a papelaria. As imagens são mockups, não fotografias de peças impressas: o provado é o design, não a produção.",
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
        "“A fragrância” conta o perfume na ordem em que é percebido: saída, coração e fundo.",
    },
    pies: {
      portada: "aurore.com.pe — a capa, no desktop e no celular.",
      macro: "Mockup: o detalhe do rótulo, onde a marca mede dois centímetros.",
      papeleria:
        "Mockup de papelaria: folha de algodão e cartão com o logotipo real.",
      explorar:
        "aurore.com.pe/productos — o painel de filtros aberto, com as casas e suas contagens.",
      movil: "O celular é o layout principal.",
      buscar:
        "aurore.com.pe/productos?search=oud — o resultado de buscar uma nota.",
      ficha:
        "aurore.com.pe — a página de produto com suas quatro apresentações.",
      fragancia: "A pirâmide olfativa dentro da página de produto.",
    },
    alt: {
      portada: "A capa de aurore.com.pe no desktop e no celular",
      tipografia:
        "Espécime tipográfico da Aurore: Sainte Colombe para os títulos e Avenir para o texto",
      paleta:
        "Paleta da Aurore: tinta, sálvia, areia, creme e osso, mais as quatro cores editoriais do catálogo",
      macro:
        "Mockup em macro de um atomizador de decant com o rótulo da Aurore",
      papeleria:
        "Mockup da papelaria da Aurore: folha de algodão e cartão sobre gesso areia",
      explorar:
        "O painel de filtros de aurore.com.pe com as casas, suas contagens e a exploração por nota olfativa",
      movil:
        "aurore.com.pe no celular: a capa, o catálogo e o painel de filtros",
      buscar:
        "Buscar “oud” em aurore.com.pe devolve treze fragrâncias de casas diferentes",
      ficha:
        "A página de produto de aurore.com.pe com as apresentações de 1, 2, 5 e 10 ml",
      fragancia:
        "“A fragrância”: notas de saída, de coração e de fundo na página de produto",
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
 */
function bloques(c: Copy): StoryBlock[] {
  return [
    // La tienda, antes que nada: es lo principal del encargo y lo primero que se ve.
    // (El héroe ya lleva el logotipo de Aurore gigante: repetirlo aquí sobraba.)
    {
      kind: "wide",
      lead: c.leads.portada,
      image: {
        src: `${IMG}/av-portada.jpg`,
        alt: c.alt.portada,
        caption: c.pies.portada,
        mobileSrc: `${IMG}/av-portada-movil.jpg`,
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
        { src: `${IMG}/av-movil.jpg`, alt: c.alt.movil, caption: c.pies.movil },
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

    // ── ACTO 02 · APLICACIONES (mockups, y la ficha lo dice) ──
    {
      kind: "act",
      index: c.actos.aplicaciones.index,
      title: c.actos.aplicaciones.title,
      body: c.actos.aplicaciones.body,
    },
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/av-decant-macro-v2.jpg`,
          alt: c.alt.macro,
          caption: c.pies.macro,
        },
        {
          src: `${IMG}/av-papeleria-v2.jpg`,
          alt: c.alt.papeleria,
          caption: c.pies.papeleria,
        },
      ],
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
        src: `${IMG}/av-buscar.jpg`,
        alt: c.alt.buscar,
        caption: c.pies.buscar,
        mobileSrc: `${IMG}/av-buscar-movil.jpg`,
      },
    },
    // Capítulo de decisión técnica (Viget): el modelo de datos que sostiene el decant
    { kind: "text", title: c.variantesTitle, body: c.variantes },
    {
      kind: "wide",
      lead: c.leads.ficha,
      image: {
        src: `${IMG}/av-decant-ficha.jpg`,
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
        src: `${IMG}/av-fragancia.jpg`,
        alt: c.alt.fragancia,
        caption: c.pies.fragancia,
        mobileSrc: `${IMG}/av-fragancia-movil.jpg`,
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
          image: "/images/proyects/vendiq/vendiq-portada-marca.jpg",
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
