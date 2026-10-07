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
 * Ficha larga de ANJ Sports (anjsports.com), tienda de tenis de mesa hecha a medida
 * sobre Vendiq.
 *
 * LA FORMA SALE DEL ALCANCE. Aquí hicimos UNA cosa —la tienda— así que la ficha tiene un
 * solo acto largo, y detrás el capítulo que ninguna otra ficha del portafolio tiene: las
 * decisiones técnicas con su arquitectura dibujada. No se inventan actos que no existen:
 * la identidad de ANJ ya era suya (negro, Druk Wide, el cian de XIOM y el magenta de
 * Butterfly) y no la tocamos.
 *   01 · La tienda a medida      el storefront propio: portada, catálogo, ficha, móvil, compra
 *   02 · Decisiones técnicas     cómo encaja con Vendiq, y el diagrama de la integración
 *
 * ── EL DATO FALSO QUE SE CORRIGE (2026-09-30) ───────────────────────────────────────
 * El caso publicaba `technologyStack: ["WordPress","WooCommerce","PHP"]` y los tres locales
 * decían «Desarrollamos su e-commerce con WordPress y WooCommerce». Es falso, y ya se había
 * detectado el 2026-09-01, pero la corrección se revirtió el 2026-09-11. Medido otra vez
 * contra anjsports.com el 2026-09-30:
 *     x-powered-by: Next.js · x-nextjs-prerender: 1 · x-nextjs-stale-time: 300
 *     cero `wp-content` / `wp-includes` en el HTML
 *     rutas de App Router, imágenes en pub-a15fad…r2.dev vía /_next/image
 *     API propia en anjsports.com/api/z/{products,categories,collections,brands,currencies,
 *     payment-methods,orders}
 * El stack publicado ahora es el medido, en el JSON y en los tres idiomas.
 *
 * ── DE DÓNDE SALE CADA PIEZA ────────────────────────────────────────────────────────
 * · INTERFAZ — siempre captura real del 2026-09-30, nunca generada. Desktop 1440×900 @2x
 *   con `locale: es-PE`, móvil 390×844 @3x, el botón flotante de WhatsApp oculto por CSS.
 *   Las capturas viven en capturas-clientes/anjsports/2026-09-30/ y se componen en
 *   capturas-clientes/anjsports/taller/taller-anjsports.html (scripts/render-anjsports.cjs).
 * · ESCENA — Higgsfield (gpt_image_2_5, high, 2k): la arena vacía del héroe y la superficie
 *   de mesa de la portada. Solo mesa, luz y suelo: ni una pantalla, ni una persona, ni un
 *   objeto de marca. Foco profundo y cámara lejos, revisadas a 1:1 por zonas antes de usarlas.
 * · MARCA — el logotipo real que sirve su propia web (R2, 150×36), reescalado ×10 con LANCZOS
 *   y con el alfa re-umbralizado para recuperar el filo.
 * · DIAGRAMA — capturas-clientes/anjsports/taller/diagrama-anjsports.html, en es/en/pt y en
 *   dos formatos (2:1 y apilado 4:3), porque el texto vive dentro de la imagen y el i18n de la
 *   ficha no lo alcanza. Cada dato del diagrama está medido, ninguno es de memoria.
 *
 * ── PERMISOS Y HONESTIDAD ───────────────────────────────────────────────────────────
 * · Hay permiso para enseñar las marcas del catálogo (XIOM, Butterfly, VICTAS, SANWEI,
 *   Dr. Neubauer): el catálogo multimarca es medio argumento de la tienda. Sus logotipos y su
 *   fotografía de producto salen SOLO dentro de capturas de la tienda, que es el trabajo real.
 * · `results` sigue vacío a propósito: no tenemos su analítica y no se inventan cifras. La
 *   prueba es el inventario de lo construido, y cada número del cierre se lee en una captura.
 * · «251 productos» es lo que dice el contador de /productos, no una estimación; la API
 *   devuelve 252 y la tienda lista 251. Se publica el número que el visitante ve en pantalla.
 */

const IMG = "/images/proyects/anjsports";

type Acto = { index: string; title: [string, string]; body: string };

/** Las once imágenes del relato: cinco anchas y tres pares de cuadradas. */
type Pieza =
  | "xiom"
  | "butterfly"
  | "catalogo"
  | "goma"
  | "matriz"
  | "coleccion"
  | "deportistas"
  | "celularTienda"
  | "celularFiltros"
  | "checkout"
  | "arquitectura";

type Copy = {
  tagline: string;
  meta: [string, string][];
  statement: string;
  context: string;
  highlightsTitle: [string, string];
  highlights: { lead: string; text: string }[];
  challengeTitle: string;
  challenge: string;
  actos: Record<"tienda" | "integracion", Acto>;
  outcomesTitle: string;
  outcomes: string;
  stackTitle: string;
  stack: string[];
  /** Solo las piezas anchas llevan frase: un bloque `pair` no admite `lead`. */
  leads: Record<
    "catalogo" | "coleccion" | "deportistas" | "checkout" | "arquitectura",
    string
  >;
  pies: Record<Pieza, string>;
  alt: Record<Pieza, string>;
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    tagline:
      "La tienda de tenis de mesa de ANJ, hecha a medida y montada sobre Vendiq",
    meta: [
      ["Estado", "En producción"],
      ["Entregables", "Tienda a medida, integración con Vendiq"],
      ["Industria", "Tenis de mesa · distribución y venta"],
      ["Plataforma", "Web (Next.js) sobre Vendiq"],
    ],
    statement:
      "Hicimos la tienda de ANJ a medida y la montamos sobre Vendiq: 251 productos, cinco marcas y el cobro, todo dentro de anjsports.com.",
    context:
      "ANJ Sports distribuye XIOM, Butterfly, VICTAS, SANWEI y Dr. Neubauer en el Perú desde 2010 y patrocina a los jugadores que compiten. Su marca ya existía: el encargo fue la tienda y el motor que la sostiene.",
    highlightsTitle: ["Lo que", "construimos"],
    highlights: [
      {
        lead: "Tienda a medida",
        text: "storefront propio en Next.js, con la cara de ANJ.",
      },
      {
        lead: "251 productos",
        text: "trece categorías y las cinco marcas que ANJ distribuye.",
      },
      {
        lead: "Variantes de verdad",
        text: "color por grosor en las gomas, talla en la ropa, SKU en cada casilla.",
      },
      {
        lead: "Stock en vivo",
        text: "el badge de cada tarjeta es el inventario del momento.",
      },
      {
        lead: "Compra completa",
        text: "carrito, checkout de cuatro pasos, tarjeta o transferencia.",
      },
      {
        lead: "La portada la maneja ANJ",
        text: "el carrusel cambia de marca —y de color— sin tocar código.",
      },
    ],
    challengeTitle: "Reto",
    challenge:
      "Una goma no es un producto: es una matriz de color por grosor, y cada casilla tiene su precio y su stock. Con 251 productos y cinco marcas, un tema de tienda comprado obliga a elegir entre el catálogo y la marca.",
    actos: {
      tienda: {
        index: "Acto 01",
        title: ["La tienda", "entera"],
        body: "La tienda no termina en el catálogo: la ropa se vende por talla, los jugadores patrocinados ocupan la portada y el celular tiene su propia navegación. Todo lo que sigue es captura real del sitio.",
      },
      integracion: {
        index: "Acto 02",
        title: ["Decisiones", "técnicas"],
        body: "La tienda pinta la marca; Vendiq guarda el catálogo, las variantes, el stock y los pedidos. Entre las dos no hay plugins: la propia web expone la API en su dominio, y el jugador nunca ve otro sitio.",
      },
    },
    outcomesTitle: "Resultados",
    outcomes:
      "La tienda está en línea con 251 productos, cinco marcas, dos monedas y cobro con tarjeta o transferencia. No publicamos cifras de venta: no tenemos su analítica.",
    stackTitle: "Disciplinas y tecnología",
    stack: [
      "Diseño UX/UI",
      "Desarrollo web",
      "Comercio electrónico",
      "Arquitectura de integración",
      "Vendiq",
      "Next.js",
      "App Router",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Cloudflare R2",
    ],
    leads: {
      catalogo:
        "Los filtros son los de una tienda de tenis de mesa: marca, categoría, colección, talla y precio, con el conteo bajando en vivo.",
      coleccion:
        "La colección de ropa se recorre por talla: filtrada a la M quedan 22 de los 251 productos.",
      deportistas:
        "ANJ patrocina a los jugadores que compiten, y eso vive en su portada, no en una página escondida.",
      checkout:
        "Y así se ve esa última línea: la compra termina donde empezó, en cuatro pasos y sin cambiar de dominio.",
      arquitectura:
        "Así encaja la tienda con el motor, qué viaja entre las dos y por qué el jugador no lo nota.",
    },
    pies: {
      xiom: "anjsports.com — el carrusel en su estado XIOM: la portada entera se vuelve cian.",
      butterfly: "El mismo carrusel un slide después: con Butterfly, magenta.",
      catalogo:
        "anjsports.com/productos — filtrado por XIOM: 164 de los 251 productos.",
      goma: "anjsports.com/producto/dr-neubauer-desperado-reloaded — la goma y sus cinco colores.",
      matriz:
        "Cuatro colores por tres grosores: doce casillas, cada una con su precio y su stock.",
      coleccion:
        "anjsports.com/productos — la colección Ropa Xiom 2026, en talla M.",
      deportistas:
        "La sección de deportistas y las cinco marcas que ANJ distribuye.",
      celularTienda:
        "anjsports.com en el celular: la portada, y el catálogo de dos en dos.",
      celularFiltros:
        "El cajón de filtros a 390 px: categorías, marcas, colecciones, tallas y precio.",
      checkout:
        "anjsports.com/checkout — carrito, información, envío y pago, confirmación.",
      arquitectura:
        "La tienda a medida y Vendiq, y lo que viaja entre las dos.",
    },
    alt: {
      xiom: "La portada de anjsports.com con el carrusel en su estado XIOM, en cian",
      butterfly:
        "La misma portada de anjsports.com con el carrusel en su estado Butterfly, en magenta",
      catalogo:
        "El catálogo de anjsports.com filtrado por la marca XIOM, con el panel de filtros y los badges de stock",
      goma: "La ficha de la goma Dr. Neubauer Desperado Reloaded con la foto del producto y sus cinco colores",
      matriz:
        "Las doce variantes de color y grosor de la goma, con el precio y el stock disponible",
      coleccion:
        "La colección de ropa Xiom 2026 en anjsports.com, filtrada por la talla M",
      deportistas:
        "La sección de deportistas patrocinados de anjsports.com y los logotipos de las cinco marcas que distribuye",
      celularTienda:
        "anjsports.com en el celular: la portada y el catálogo en dos columnas",
      celularFiltros:
        "El cajón de filtros de anjsports.com en el celular, con categorías, marcas y tallas",
      checkout:
        "El checkout de anjsports.com con sus cuatro pasos, las líneas del pedido y el total",
      arquitectura:
        "Diagrama de la integración: la tienda a medida en anjsports.com, Vendiq como motor de comercio y lo que viaja entre los dos",
    },
    nextTagline:
      "Tienda online, punto de venta, inventario y facturación SUNAT en un solo sistema",
  },
  en: {
    tagline: "ANJ's table tennis store, built to measure and running on Vendiq",
    meta: [
      ["Status", "In production"],
      ["Deliverables", "Custom storefront, Vendiq integration"],
      ["Industry", "Table tennis · distribution and retail"],
      ["Platform", "Web (Next.js) on Vendiq"],
    ],
    statement:
      "We built ANJ's store to measure and put it on Vendiq: 251 products, five brands and the payment, all inside anjsports.com.",
    context:
      "ANJ Sports has distributed XIOM, Butterfly, VICTAS, SANWEI and Dr. Neubauer in Peru since 2010, and sponsors the players who compete. Their brand already existed: the job was the store and the engine behind it.",
    highlightsTitle: ["What we", "built"],
    highlights: [
      {
        lead: "A custom storefront",
        text: "built in Next.js, wearing ANJ's face and not a template's.",
      },
      {
        lead: "251 products",
        text: "thirteen categories and the five brands ANJ distributes.",
      },
      {
        lead: "Real variants",
        text: "colour by thickness on rubbers, size on apparel, an SKU per cell.",
      },
      {
        lead: "Live stock",
        text: "the badge on each card is the inventory right now.",
      },
      {
        lead: "The whole purchase",
        text: "cart, four-step checkout, card or bank transfer.",
      },
      {
        lead: "ANJ runs the home page",
        text: "the carousel changes brand — and colour — with no code.",
      },
    ],
    challengeTitle: "Challenge",
    challenge:
      "A rubber is not one product: it is a matrix of colour by thickness, and every cell has its own price and stock. With 251 products and five brands, an off-the-shelf store theme makes you choose between the catalogue and the brand.",
    actos: {
      tienda: {
        index: "Act 01",
        title: ["The whole", "store"],
        body: "The store does not end at the catalogue: apparel sells by size, the sponsored players take over the home page and the phone has navigation of its own. Everything that follows is a real screenshot.",
      },
      integracion: {
        index: "Act 02",
        title: ["Technical", "decisions"],
        body: "The storefront paints the brand; Vendiq holds the catalogue, the variants, the stock and the orders. No plugins between them: the site exposes the API on its own domain, and the player never sees another site.",
      },
    },
    outcomesTitle: "Outcomes",
    outcomes:
      "The store is live with 251 products, five brands, two currencies and payment by card or bank transfer. We publish no sales figures: we do not have their analytics.",
    stackTitle: "Disciplines and technology",
    stack: [
      "UX/UI design",
      "Web development",
      "E-commerce",
      "Integration architecture",
      "Vendiq",
      "Next.js",
      "App Router",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Cloudflare R2",
    ],
    leads: {
      catalogo:
        "The filters are a table tennis shop's own: brand, category, collection, size and price, with the count dropping live.",
      coleccion:
        "The apparel collection is browsed by size: filtered to M, 22 of the 251 products are left.",
      deportistas:
        "ANJ sponsors the players who compete, and that lives on its home page, not on a page tucked away.",
      checkout:
        "And here is that last line in practice: the purchase ends where it started, in four steps and on the same domain.",
      arquitectura:
        "How the storefront fits the engine, what travels between them and why the player never notices.",
    },
    pies: {
      xiom: "anjsports.com — the carousel in its XIOM state: the whole home page turns cyan.",
      butterfly: "The same carousel one slide later: with Butterfly, magenta.",
      catalogo:
        "anjsports.com/productos — filtered by XIOM: 164 of the 251 products.",
      goma: "anjsports.com/producto/dr-neubauer-desperado-reloaded — the rubber and its five colours.",
      matriz:
        "Four colours by three thicknesses: twelve cells, each with its own price and stock.",
      coleccion:
        "anjsports.com/productos — the Ropa Xiom 2026 collection, in size M.",
      deportistas:
        "The sponsored players section and the five brands ANJ distributes.",
      celularTienda:
        "anjsports.com on a phone: the home page, and the catalogue two by two.",
      celularFiltros:
        "The filter drawer at 390 px: categories, brands, collections, sizes and price.",
      checkout:
        "anjsports.com/checkout — cart, details, shipping and payment, confirmation.",
      arquitectura:
        "The custom storefront and Vendiq, and what travels between them.",
    },
    alt: {
      xiom: "The anjsports.com home page with the carousel in its XIOM state, in cyan",
      butterfly:
        "The same anjsports.com home page with the carousel in its Butterfly state, in magenta",
      catalogo:
        "The anjsports.com catalogue filtered by the XIOM brand, with the filter panel and the stock badges",
      goma: "The Dr. Neubauer Desperado Reloaded rubber page with the product photo and its five colours",
      matriz:
        "The twelve colour and thickness variants of the rubber, with the price and the stock available",
      coleccion:
        "The Ropa Xiom 2026 apparel collection on anjsports.com, filtered by size M",
      deportistas:
        "The sponsored players section of anjsports.com and the logos of the five brands it distributes",
      celularTienda:
        "anjsports.com on a phone: the home page and the catalogue in two columns",
      celularFiltros:
        "The anjsports.com filter drawer on a phone, with categories, brands and sizes",
      checkout:
        "The anjsports.com checkout with its four steps, the order lines and the total",
      arquitectura:
        "Integration diagram: the custom storefront on anjsports.com, Vendiq as the commerce engine and what travels between them",
    },
    nextTagline:
      "Online store, point of sale, inventory and SUNAT invoicing in one system",
  },
  pt: {
    tagline:
      "A loja de tênis de mesa da ANJ, feita sob medida e montada sobre o Vendiq",
    meta: [
      ["Status", "Em produção"],
      ["Entregas", "Loja sob medida, integração com o Vendiq"],
      ["Setor", "Tênis de mesa · distribuição e venda"],
      ["Plataforma", "Web (Next.js) sobre o Vendiq"],
    ],
    statement:
      "Fizemos a loja da ANJ sob medida e a montamos sobre o Vendiq: 251 produtos, cinco marcas e a cobrança, tudo dentro de anjsports.com.",
    context:
      "A ANJ Sports distribui XIOM, Butterfly, VICTAS, SANWEI e Dr. Neubauer no Peru desde 2010 e patrocina os jogadores que competem. A marca deles já existia: o trabalho foi a loja e o motor que a sustenta.",
    highlightsTitle: ["O que", "construímos"],
    highlights: [
      {
        lead: "Loja sob medida",
        text: "storefront próprio em Next.js, com a cara da ANJ.",
      },
      {
        lead: "251 produtos",
        text: "treze categorias e as cinco marcas que a ANJ distribui.",
      },
      {
        lead: "Variantes de verdade",
        text: "cor por espessura nas borrachas, tamanho na roupa, SKU em cada casa.",
      },
      {
        lead: "Estoque ao vivo",
        text: "o selo de cada card é o inventário do momento.",
      },
      {
        lead: "A compra inteira",
        text: "carrinho, checkout de quatro passos, cartão ou transferência.",
      },
      {
        lead: "A capa é da ANJ",
        text: "o carrossel muda de marca — e de cor — sem tocar no código.",
      },
    ],
    challengeTitle: "Desafio",
    challenge:
      "Uma borracha não é um produto: é uma matriz de cor por espessura, e cada casa tem seu preço e seu estoque. Com 251 produtos e cinco marcas, um tema de loja pronto obriga a escolher entre o catálogo e a marca.",
    actos: {
      tienda: {
        index: "Ato 01",
        title: ["A loja", "inteira"],
        body: "A loja não termina no catálogo: a roupa se vende por tamanho, os jogadores patrocinados ocupam a capa e o celular tem navegação própria. Tudo o que segue é captura real do site.",
      },
      integracion: {
        index: "Ato 02",
        title: ["Decisões", "técnicas"],
        body: "A loja pinta a marca; o Vendiq guarda o catálogo, as variantes, o estoque e os pedidos. Entre as duas não há plugins: o próprio site expõe a API no seu domínio, e o jogador nunca vê outro site.",
      },
    },
    outcomesTitle: "Resultados",
    outcomes:
      "A loja está no ar com 251 produtos, cinco marcas, duas moedas e cobrança por cartão ou transferência. Não publicamos números de venda: não temos a analítica deles.",
    stackTitle: "Disciplinas e tecnologia",
    stack: [
      "Design UX/UI",
      "Desenvolvimento web",
      "Comércio eletrônico",
      "Arquitetura de integração",
      "Vendiq",
      "Next.js",
      "App Router",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Cloudflare R2",
    ],
    leads: {
      catalogo:
        "Os filtros são de uma loja de tênis de mesa: marca, categoria, coleção, tamanho e preço, com a contagem caindo ao vivo.",
      coleccion:
        "A coleção de roupa se percorre por tamanho: filtrada no M sobram 22 dos 251 produtos.",
      deportistas:
        "A ANJ patrocina os jogadores que competem, e isso vive na capa, não numa página escondida.",
      checkout:
        "E é assim que se vê essa última linha: a compra termina onde começou, em quatro passos e no mesmo domínio.",
      arquitectura:
        "Como a loja encaixa no motor, o que viaja entre as duas e por que o jogador não percebe.",
    },
    pies: {
      xiom: "anjsports.com — o carrossel no seu estado XIOM: a capa inteira fica ciano.",
      butterfly: "O mesmo carrossel um slide depois: com a Butterfly, magenta.",
      catalogo:
        "anjsports.com/productos — filtrado por XIOM: 164 dos 251 produtos.",
      goma: "anjsports.com/producto/dr-neubauer-desperado-reloaded — a borracha e suas cinco cores.",
      matriz:
        "Quatro cores por três espessuras: doze casas, cada uma com seu preço e seu estoque.",
      coleccion:
        "anjsports.com/productos — a coleção Ropa Xiom 2026, no tamanho M.",
      deportistas:
        "A seção de atletas patrocinados e as cinco marcas que a ANJ distribui.",
      celularTienda:
        "anjsports.com no celular: a capa, e o catálogo de dois em dois.",
      celularFiltros:
        "A gaveta de filtros a 390 px: categorias, marcas, coleções, tamanhos e preço.",
      checkout:
        "anjsports.com/checkout — carrinho, informação, envio e pagamento, confirmação.",
      arquitectura:
        "A loja sob medida e o Vendiq, e o que viaja entre as duas.",
    },
    alt: {
      xiom: "A capa de anjsports.com com o carrossel no seu estado XIOM, em ciano",
      butterfly:
        "A mesma capa de anjsports.com com o carrossel no seu estado Butterfly, em magenta",
      catalogo:
        "O catálogo de anjsports.com filtrado pela marca XIOM, com o painel de filtros e os selos de estoque",
      goma: "A página da borracha Dr. Neubauer Desperado Reloaded com a foto do produto e suas cinco cores",
      matriz:
        "As doze variantes de cor e espessura da borracha, com o preço e o estoque disponível",
      coleccion:
        "A coleção de roupa Ropa Xiom 2026 em anjsports.com, filtrada pelo tamanho M",
      deportistas:
        "A seção de atletas patrocinados de anjsports.com e os logotipos das cinco marcas que distribui",
      celularTienda:
        "anjsports.com no celular: a capa e o catálogo em duas colunas",
      celularFiltros:
        "A gaveta de filtros de anjsports.com no celular, com categorias, marcas e tamanhos",
      checkout:
        "O checkout de anjsports.com com seus quatro passos, as linhas do pedido e o total",
      arquitectura:
        "Diagrama da integração: a loja sob medida em anjsports.com, o Vendiq como motor de comércio e o que viaja entre os dois",
    },
    nextTagline:
      "Loja online, ponto de venda, estoque e faturamento SUNAT em um só sistema",
  },
};

/**
 * Catorce bloques, ocho de ellos de imagen: CINCO anchas y TRES pares de cuadradas, once
 * piezas en total y ninguna que repita sujeto:
 *   par  las dos marcas (XIOM · Butterfly) · par  la goma y su matriz de doce casillas ·
 *   par  el celular (tienda · filtros) · anchas: el catálogo filtrado · la colección por
 *   talla · los deportistas · el diagrama · el checkout.
 *
 * ── POR QUÉ TRES PARES, Y NO OCHO ANCHAS (2026-09-30) ───────────────────────────────
 * Alexander: «veo que todo lo has puesto imagen columna entera, puedes usar 2 columnas
 * también para variar». La ficha era la única del portafolio con CERO pares. No se
 * retiquetó nada: las tres piezas se rehicieron en el taller, porque una ancha es 2:1
 * (1312×656 servidos) y una cuadrada de un par es 1:1 (648×648) — recortar la ancha
 * perdía la mitad. Se partió solo donde la pieza ya era dos cosas:
 *   · `anj-marcas` ERA dos portadas escalonadas dentro de un marco. Ahora cada estado
 *     tiene su cuadrada, su color de marca y su pie.
 *   · `anj-variantes` era la ficha entera con la foto cortada por arriba, la matriz
 *     diminuta y un tercio del marco en blanco muerto. Ahora: QUÉ se vende (la goma y sus
 *     cinco colores) y CÓMO se vende (las doce casillas con precio y stock, del 0,80 al
 *     1,15 del tamaño original: las etiquetas pasan de 10,4 px servidos a 14,9).
 *   · `anj-movil` era una tira de tres celulares a 194 px servidos. Un celular es 390×844:
 *     el cuadrado le sienta mejor que el 2:1. Ahora dos cuadradas, +25 % y +32 % de tamaño.
 * Lo que NO se partió, y por qué: el DIAGRAMA necesita el ancho y su móvil está calculado;
 * el CATÁLOGO y la COLECCIÓN son una ventana de navegador de 1200 px, que en 648 no se
 * leería; los DEPORTISTAS son un carrusel de cinco fichas y una tira de cinco marcas, las
 * dos cosas horizontales; el CHECKOUT es una pantalla de dos columnas de 1080 px de ancho.
 * Forzarlas habría sido peor que la monotonía.
 *
 * ── EL ORDEN LO DICTA EL RITMO, NO EL GUSTO ─────────────────────────────────────────
 * Regla: ningún tramo de más de ~700 px sin imagen, medido a 1440. Cada bloque cuesta:
 *     `text` ≈ 300 px · `act` ≈ 600 px · `highlights` ≈ 650 px · `tags` ≈ 640 px · la
 *     frase de una ancha (`lead`) ≈ 55 px
 * O sea que **dos bloques sin imagen seguidos siempre pasan de 700**. De ahí el orden de
 * abajo: cada bloque de texto va SOLO entre dos imágenes, y el único que queda al final es
 * `tags`, que cabe justo. Un `pair` mide 648 px de alto y una ancha 656: cambiar una por
 * otro no mueve el ritmo, pero SÍ quita su frase, así que los tres tramos afectados se
 * acortan en 55 px en vez de alargarse. Medido después del cambio: el tramo más largo del
 * relato son los 655 px del acto 02 + la frase del diagrama.
 *
 * Y de ahí también que la ficha **cierre con el checkout y no con el diagrama**: la última
 * línea del diagrama dice que el jugador no cambia de dominio ni una vez, y la pieza
 * siguiente es esa compra terminando en anjsports.com. El argumento y su prueba, seguidos.
 *
 * El diagrama se elige por idioma: su texto está DENTRO de la imagen y el i18n no lo alcanza.
 */
function bloques(c: Copy, lang: StoryLang): StoryBlock[] {
  return [
    // El hallazgo del sitio, de entrada: la misma portada con dos identidades, una cuadrada
    // cada una. Sin frase: un `pair` no la admite, y los dos pies la dicen entera.
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/anj-xiom.jpg`,
          alt: c.alt.xiom,
          caption: c.pies.xiom,
        },
        {
          src: `${IMG}/anj-butterfly.jpg`,
          alt: c.alt.butterfly,
          caption: c.pies.butterfly,
        },
      ],
    },
    { kind: "highlights", title: c.highlightsTitle, items: c.highlights },
    {
      kind: "wide",
      lead: c.leads.catalogo,
      image: {
        src: `${IMG}/anj-catalogo.jpg`,
        alt: c.alt.catalogo,
        caption: c.pies.catalogo,
        mobileSrc: `${IMG}/anj-catalogo-movil.jpg`,
      },
    },
    // El reto, y justo debajo las dos pantallas que lo resuelven: la goma y su matriz.
    { kind: "text", title: c.challengeTitle, body: c.challenge },
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/anj-goma.jpg`,
          alt: c.alt.goma,
          caption: c.pies.goma,
        },
        {
          src: `${IMG}/anj-matriz.jpg`,
          alt: c.alt.matriz,
          caption: c.pies.matriz,
        },
      ],
    },

    // ── ACTO 01 · LA TIENDA ENTERA (todo captura real, y cada bloque su estado) ──
    {
      kind: "act",
      index: c.actos.tienda.index,
      title: c.actos.tienda.title,
      body: c.actos.tienda.body,
    },
    {
      kind: "wide",
      lead: c.leads.coleccion,
      image: {
        src: `${IMG}/anj-coleccion.jpg`,
        alt: c.alt.coleccion,
        caption: c.pies.coleccion,
        mobileSrc: `${IMG}/anj-coleccion-movil.jpg`,
      },
    },
    {
      kind: "wide",
      lead: c.leads.deportistas,
      image: {
        src: `${IMG}/anj-deportistas.jpg`,
        alt: c.alt.deportistas,
        caption: c.pies.deportistas,
        mobileSrc: `${IMG}/anj-deportistas-movil.jpg`,
      },
    },
    // El celular, en cuadradas: un 390×844 cabe mejor en 1:1 que en 2:1.
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/anj-celular-tienda.jpg`,
          alt: c.alt.celularTienda,
          caption: c.pies.celularTienda,
        },
        {
          src: `${IMG}/anj-celular-filtros.jpg`,
          alt: c.alt.celularFiltros,
          caption: c.pies.celularFiltros,
        },
      ],
    },

    // ── ACTO 02 · DECISIONES TÉCNICAS ──
    // El capítulo que ninguna otra ficha del portafolio tiene: la decisión, y debajo su
    // arquitectura dibujada a todo el ancho (Viget, viget.com/work/goodbids). Esta se queda
    // ancha: catorce cajas no caben en 648 px, y su variante de celular ya está calculada.
    {
      kind: "act",
      index: c.actos.integracion.index,
      title: c.actos.integracion.title,
      body: c.actos.integracion.body,
    },
    {
      kind: "wide",
      lead: c.leads.arquitectura,
      image: {
        src: `${IMG}/anj-arquitectura-${lang}.jpg`,
        alt: c.alt.arquitectura,
        caption: c.pies.arquitectura,
        mobileSrc: `${IMG}/anj-arquitectura-${lang}-movil.jpg`,
      },
    },
    { kind: "text", id: "resultado", title: c.outcomesTitle, body: c.outcomes },
    // El cierre: la compra terminando en su propio dominio, que es la última línea del
    // diagrama puesta en pantalla.
    {
      kind: "wide",
      lead: c.leads.checkout,
      image: {
        src: `${IMG}/anj-checkout.jpg`,
        alt: c.alt.checkout,
        caption: c.pies.checkout,
        mobileSrc: `${IMG}/anj-checkout-movil.jpg`,
      },
    },
    { kind: "tags", title: c.stackTitle, items: c.stack },
  ];
}

export default function AnjsportsContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseStory
        // El acento sale de la marca del cliente: el cian de XIOM es su neón, pero sobre
        // blanco da 1,56:1. `base` es ese cian llevado a la sombra (5,24:1 sobre blanco) y
        // `dark` es el neón exacto de su web (12,47:1 sobre la tinta).
        accent={{ base: "#0B7A6A", dark: "#2BE8C8", deep: "#04211D" }}
        name="ANJ Sports"
        tagline={c.tagline}
        heroImage={`${IMG}/anj-hero.jpg`}
        heroPosition="34% 62%"
        logo={{ src: `${IMG}/anj-logo.png`, width: 1500, height: 360 }}
        liveUrl="https://anjsports.com"
        meta={c.meta}
        statement={c.statement}
        context={c.context}
        blocks={bloques(c, lang)}
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
