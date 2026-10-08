"use client";

import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import {
  type BloqueProducto,
  CaseProducto,
  type CaseProductoProps,
  type Medio,
} from "~/components/axium/case-producto/case-producto";
import {
  CaseMasProyectos,
  STORY_LABELS,
  type StoryLang,
} from "~/components/axium/case-story/case-story";
import { useTranslation } from "~/hooks/useTranslation";

/**
 * Ficha de ANJ Sports (anjsports.com), REHECHA el 2026-10-07 al molde de producto con Rematch
 * como referencia. Alexander: «dale el mismo estilo a ANJ», y enseguida, «bueno no tan igual,
 * como rematch sería mejor referencia, es tu mejor trabajo hasta ahora». Antes era una ficha
 * de Brand Vision (CaseStory) con piezas compuestas y un diagrama de la integración.
 *
 * ── EL RITMO DE REMATCH, ADAPTADO A UNA TIENDA ──────────────────────────────────────
 *  · Foto de vida a sangre: el celular con anjsports.com sobre una mesa de tenis de mesa, como
 *    el de Rematch sobre la cancha.
 *  · La web real MOVIÉNDOSE: el carrusel del héroe pasando del cian de XIOM al magenta de
 *    Butterfly, en la ventana y en el celular a la vez, y el fondo con el color de la marca.
 *  · Trío de vida: la tienda en el mostrador de una tienda especializada, un jugador real con
 *    la tarjeta real de un producto al lado y la ficha en la mano, en el club.
 *  · El producto por partes: eligiendo variantes (el stock cambia en cada una), la tira de
 *    tarjetas con su estado de stock y los filtros, el celular y los deportistas en vídeo.
 *  · Cita textual de los testimonios de anjsports.com. Nada de diagramas: el de la integración
 *    se cayó (en Feniz, Alexander: «innecesario, cámbialo por algo más genial»).
 *
 * ── DE DÓNDE SALE CADA COSA ────────────────────────────────────────────────────────
 *  · Interfaz: TODA real, de anjsports.com en vivo el 2026-10-07 (capturas a 2x y 3x, tarjetas
 *    aisladas con alfa, grabaciones en tiempo real del carrusel y de los deportistas, los clics
 *    en las variantes). Las tarjetas llevan detrás el blanco de la propia página.
 *  · Escenas: tres de OpenAI (gpt-image-2.5-flare) con las pantallas APAGADAS y la captura
 *    compuesta encima con las esquinas medidas a mano. Sin logotipos de marcas en las escenas.
 *  · El jugador es una foto de STOCK (Unsplash, Nathanaël Desmeules, licencia Unsplash), elegida
 *    porque no enseña marcas de la competencia. Créditos en el taller, stock/CREDITOS.md.
 *  · Las marcas del catálogo (XIOM, Butterfly, VICTAS, SANWEI, Dr. Neubauer) salen solo dentro
 *    de capturas de la tienda: hay permiso para enseñarlas y son medio argumento de la tienda.
 *  · Cifras: «251 productos» es el contador de /productos el 2026-10-07; el stock de cada
 *    variante, el que mostraba la ficha ese día.
 *  Taller: portafolio-axium/capturas-clientes/anjsports/rematch-2026-10/ (COMPOSITOR.md,
 *  decimosexta generación).
 *
 * ── EL DATO FALSO QUE SE CORRIGIÓ (2026-09-30) ──────────────────────────────────────
 * El caso publicaba WordPress y WooCommerce. Medido contra anjsports.com: Next.js con App
 * Router, imágenes en R2 y la API propia en anjsports.com/api/z/*. El stack es el medido.
 */

const IMG = "/images/proyects/anjsports";

type PieTira = "ultimas" | "disponibles" | "sinstock" | "filtros";

type Copy = {
  titulo: string;
  heroeAlt: string;
  meta: CaseProductoProps["meta"];
  contexto: [string, string];
  reto: [string, string];
  variantes: [string, string];
  tira: string;
  etiquetaTira: string;
  pies: Record<PieTira, string>;
  movil: [string, string];
  deportistas: [string, string];
  mandos: { anterior: string; siguiente: string };
  alt: Record<
    | "web"
    | "tienda"
    | "jugador"
    | "mano"
    | "variantes"
    | PieTira
    | "moviles"
    | "deportistas",
    string
  >;
  cita: NonNullable<CaseProductoProps["cita"]>;
  cta: CaseProductoProps["cta"];
  resultado: CaseProductoProps["resultado"];
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    titulo:
      "La tienda de tenis de mesa de ANJ, hecha a medida y montada sobre Vendiq",
    heroeAlt:
      "Un celular sobre una mesa de tenis de mesa, junto a la pelota y la paleta, con la portada de anjsports.com",
    meta: {
      tipologia: ["Tipología", ["Tienda online", "A medida", "Vendiq"]],
      industria: ["Industria", "Tenis de mesa · distribución y venta"],
      anio: ["Año", "2026"],
      servicios: [
        "Servicios",
        [
          "Diseño UX/UI",
          "Desarrollo web",
          "Tienda online a medida",
          "Integración con Vendiq",
          "Catálogo y variantes",
          "Checkout y pagos",
        ],
      ],
      entregables: [
        "Entregables",
        [
          "anjsports.com",
          "Catálogo con filtros",
          "Fichas con variantes",
          "Carrito y checkout",
        ],
      ],
      vivo: ["En vivo", "anjsports.com", "https://anjsports.com"],
    },
    contexto: [
      "Contexto",
      "ANJ Sports distribuye XIOM, Butterfly, VICTAS, SANWEI y Dr. Neubauer en el Perú desde 2010 y patrocina a los jugadores que compiten. Su marca ya existía, negra y con la Druk Wide: el encargo fue la tienda y el motor que la sostiene.",
    ],
    reto: [
      "El reto",
      "Una goma de tenis de mesa no es un producto: es una matriz de color por grosor, y cada casilla tiene su precio y su stock. Con 251 productos y cinco marcas, una plantilla de tienda obliga a elegir entre el catálogo y la marca.",
    ],
    variantes: [
      "Cada combinación, su stock",
      "Vendiq guarda el catálogo, las variantes con su SKU, el stock y los pedidos; la tienda los lee de su propia API, en su dominio. Por eso cada combinación de color y grosor enseña su stock, y lo que no hay no se puede comprar.",
    ],
    tira: "El mismo dato llega a la tarjeta del catálogo sin que nadie lo toque: «Últimas 1 unidad», «16 unidades disponibles» o «Sin stock». Y los filtros son los de una tienda de tenis de mesa.",
    etiquetaTira: "El stock, en el catálogo",
    pies: {
      ultimas: "«Últimas 1 unidad», en naranja",
      disponibles: "«16 unidades disponibles», en verde",
      sinstock: "«Sin stock»: el producto sigue a la vista",
      filtros: "Categoría, marca, colección, talla y precio",
    },
    movil: [
      "En el celular",
      "El celular tiene su propia navegación: la colección de ropa que se compra por talla, el catálogo de dos en dos con su cajón de filtros y la ficha con las opciones a mano del pulgar.",
    ],
    deportistas: [
      "La portada también es de los jugadores",
      "ANJ patrocina a los jugadores que compiten, y eso vive en su portada, no en una página escondida: un carrusel de deportistas que se recorre con las flechas.",
    ],
    mandos: { anterior: "Anterior", siguiente: "Siguiente" },
    alt: {
      web: "La portada de anjsports.com en una ventana y en un celular, animada: el carrusel pasa del magenta de Butterfly al cian de XIOM y el fondo cambia de color con él",
      tienda:
        "Una laptop en el mostrador de una tienda de tenis de mesa, con el catálogo de anjsports.com y una pared de gomas y paletas detrás",
      jugador:
        "Un jugador de tenis de mesa a punto de golpear la pelota; flota a su lado la tarjeta real de la goma XIOM Jekyll & Hyde C52.5 en anjsports.com, con 25 unidades disponibles",
      mano: "Una mano sostiene un celular en un club de tenis de mesa, con la ficha de una goma en anjsports.com: las opciones Black / Max y Red / Max, el precio y el stock",
      variantes:
        "La ficha de la goma XIOM Omega VII Asia en anjsports.com, animada: al elegir Black / MAX, Black / 2.0, Red / MAX o Red / 2.0, el stock pasa de 9 unidades a sin stock y a 8 unidades",
      ultimas:
        "Tarjeta real de la goma Butterfly Dignics 09C en anjsports.com, con la etiqueta «Últimas 1 unidad»",
      disponibles:
        "Tarjeta real de la goma XIOM Jekyll & Hyde C55.0 en anjsports.com, con la etiqueta «16 unidades disponibles»",
      sinstock:
        "Tarjeta real de la paleta Butterfly Timo Boll Spirit en anjsports.com, con la etiqueta «Sin stock»",
      filtros:
        "El panel de filtros del catálogo de anjsports.com: categorías, marcas, colecciones, tallas y rango de precio",
      moviles:
        "Tres celulares con anjsports.com: la colección de ropa XIOM 2026, el catálogo con sus filtros y la ficha de una goma",
      deportistas:
        "La sección de deportistas de anjsports.com, animada: el carrusel de jugadores patrocinados avanza con las flechas",
    },
    cita: {
      texto:
        "«Respuesta inmediata a las consultas y pedidos, atención personalizada, productos variados y de calidad. ¡Lo recomiendo!»",
      nombre: "Silvana Aparicio",
      cargo: "Clienta de ANJ Sports · testimonio publicado en anjsports.com",
      iniciales: "SA",
    },
    cta: {
      titulo: "¿Tu tienda necesita algo más que una plantilla?",
      texto:
        "La diseñamos y la construimos a medida sobre Vendiq, como hicimos con ANJ Sports.",
      boton: "Hablemos",
      href: "#contacto",
    },
    resultado: {
      titulo: "El resultado",
      texto:
        "anjsports.com está en producción: la tienda a medida de ANJ, con su catálogo, sus variantes con stock en vivo y el cobro con tarjeta o transferencia dentro de su dominio. No publicamos cifras de venta: no tenemos su analítica.",
      cifras: [
        { valor: "251", texto: "productos en el catálogo, con sus variantes" },
        {
          valor: "5",
          texto: "marcas que ANJ distribuye, cada una con su color",
        },
        { valor: "4", texto: "pasos de checkout, sin salir de anjsports.com" },
      ],
    },
    nextTagline:
      "Tienda online, punto de venta, inventario y facturación SUNAT en un solo sistema",
  },

  en: {
    titulo: "ANJ's table tennis store, built to measure and running on Vendiq",
    heroeAlt:
      "A phone on a table tennis table, next to the ball and the paddle, showing the anjsports.com home page",
    meta: {
      tipologia: ["Typology", ["Online store", "Custom-built", "Vendiq"]],
      industria: ["Industry", "Table tennis · distribution and retail"],
      anio: ["Year", "2026"],
      servicios: [
        "Services",
        [
          "UX/UI design",
          "Web development",
          "Custom online store",
          "Vendiq integration",
          "Catalogue and variants",
          "Checkout and payments",
        ],
      ],
      entregables: [
        "Deliverables",
        [
          "anjsports.com",
          "Filterable catalogue",
          "Product pages with variants",
          "Cart and checkout",
        ],
      ],
      vivo: ["Live", "anjsports.com", "https://anjsports.com"],
    },
    contexto: [
      "Context",
      "ANJ Sports has distributed XIOM, Butterfly, VICTAS, SANWEI and Dr. Neubauer in Peru since 2010 and sponsors the players who compete. Their brand already existed, black and set in Druk Wide: the job was the store and the engine behind it.",
    ],
    reto: [
      "The challenge",
      "A table tennis rubber is not one product: it is a matrix of colour by thickness, and every cell has its own price and stock. With 251 products and five brands, an off-the-shelf store makes you choose between the catalogue and the brand.",
    ],
    variantes: [
      "Every combination, its own stock",
      "Vendiq holds the catalogue, the variants with their SKUs, the stock and the orders; the store reads them from its own API, on its own domain. So every colour and thickness shows its own stock, and what is not there cannot be bought.",
    ],
    tira: "The same figure reaches the catalogue card with nobody touching it: “Last 1 unit”, “16 units available” or “Out of stock”. And the filters are those of a table tennis shop.",
    etiquetaTira: "Stock, in the catalogue",
    pies: {
      ultimas: "“Last 1 unit”, in orange",
      disponibles: "“16 units available”, in green",
      sinstock: "“Out of stock”: the product stays in sight",
      filtros: "Category, brand, collection, size and price",
    },
    movil: [
      "On the phone",
      "The phone has navigation of its own: the apparel collection bought by size, the catalogue two by two with its filter drawer and the product page with the options within thumb's reach.",
    ],
    deportistas: [
      "The home page belongs to the players too",
      "ANJ sponsors the players who compete, and that lives on its home page, not on a hidden page: a carousel of athletes you move through with the arrows.",
    ],
    mandos: { anterior: "Previous", siguiente: "Next" },
    alt: {
      web: "The anjsports.com home page in a browser window and on a phone, animated: the carousel goes from Butterfly magenta to XIOM cyan and the background changes colour with it",
      tienda:
        "A laptop on the counter of a table tennis shop, showing the anjsports.com catalogue, with a wall of rubbers and blades behind",
      jugador:
        "A table tennis player about to hit the ball; floating beside him, the real anjsports.com card for the XIOM Jekyll & Hyde C52.5 rubber, with 25 units available",
      mano: "A hand holds a phone in a table tennis club, showing a rubber's page on anjsports.com: the Black / Max and Red / Max options, the price and the stock",
      variantes:
        "The XIOM Omega VII Asia rubber page on anjsports.com, animated: picking Black / MAX, Black / 2.0, Red / MAX or Red / 2.0 takes the stock from 9 units to out of stock and to 8 units",
      ultimas:
        "Real anjsports.com card for the Butterfly Dignics 09C rubber, labelled “Últimas 1 unidad” (last 1 unit)",
      disponibles:
        "Real anjsports.com card for the XIOM Jekyll & Hyde C55.0 rubber, labelled “16 unidades disponibles” (16 units available)",
      sinstock:
        "Real anjsports.com card for the Butterfly Timo Boll Spirit blade, labelled “Sin stock” (out of stock)",
      filtros:
        "The anjsports.com catalogue filter panel: categories, brands, collections, sizes and price range",
      moviles:
        "Three phones showing anjsports.com: the XIOM 2026 apparel collection, the catalogue with its filters and a rubber's product page",
      deportistas:
        "The athletes section of anjsports.com, animated: the carousel of sponsored players moves on with the arrows",
    },
    cita: {
      texto:
        "“Quick answers to questions and orders, personal service, a varied range of quality products. I recommend it!”",
      nombre: "Silvana Aparicio",
      cargo: "ANJ Sports customer · testimonial published on anjsports.com",
      iniciales: "SA",
    },
    cta: {
      titulo: "Does your store need more than a template?",
      texto:
        "We design it and build it to measure on Vendiq, as we did with ANJ Sports.",
      boton: "Let's talk",
      href: "#contacto",
    },
    resultado: {
      titulo: "The result",
      texto:
        "anjsports.com is in production: ANJ's custom store, with its catalogue, its variants with live stock and card or bank-transfer payment inside its own domain. We publish no sales figures: their analytics are not ours.",
      cifras: [
        {
          valor: "251",
          texto: "products in the catalogue, with their variants",
        },
        {
          valor: "5",
          texto: "brands ANJ distributes, each with its own colour",
        },
        { valor: "4", texto: "checkout steps, without leaving anjsports.com" },
      ],
    },
    nextTagline:
      "Online store, point of sale, inventory and SUNAT invoicing in one system",
  },

  pt: {
    titulo:
      "A loja de tênis de mesa da ANJ, feita sob medida e montada sobre o Vendiq",
    heroeAlt:
      "Um celular sobre uma mesa de tênis de mesa, ao lado da bola e da raquete, com a capa de anjsports.com",
    meta: {
      tipologia: ["Tipologia", ["Loja online", "Sob medida", "Vendiq"]],
      industria: ["Setor", "Tênis de mesa · distribuição e venda"],
      anio: ["Ano", "2026"],
      servicios: [
        "Serviços",
        [
          "Design UX/UI",
          "Desenvolvimento web",
          "Loja online sob medida",
          "Integração com o Vendiq",
          "Catálogo e variantes",
          "Checkout e pagamentos",
        ],
      ],
      entregables: [
        "Entregáveis",
        [
          "anjsports.com",
          "Catálogo com filtros",
          "Páginas com variantes",
          "Carrinho e checkout",
        ],
      ],
      vivo: ["No ar", "anjsports.com", "https://anjsports.com"],
    },
    contexto: [
      "Contexto",
      "A ANJ Sports distribui XIOM, Butterfly, VICTAS, SANWEI e Dr. Neubauer no Peru desde 2010 e patrocina os jogadores que competem. A marca já existia, preta e com a Druk Wide: o trabalho foi a loja e o motor que a sustenta.",
    ],
    reto: [
      "O desafio",
      "Uma borracha de tênis de mesa não é um produto: é uma matriz de cor por espessura, e cada casa tem seu preço e seu estoque. Com 251 produtos e cinco marcas, um modelo de loja pronto obriga a escolher entre o catálogo e a marca.",
    ],
    variantes: [
      "Cada combinação, seu estoque",
      "O Vendiq guarda o catálogo, as variantes com seu SKU, o estoque e os pedidos; a loja os lê da sua própria API, no seu domínio. Por isso cada combinação de cor e espessura mostra seu estoque, e o que não há não se pode comprar.",
    ],
    tira: "O mesmo dado chega ao cartão do catálogo sem ninguém mexer: «Últimas 1 unidad», «16 unidades disponibles» ou «Sin stock». E os filtros são os de uma loja de tênis de mesa.",
    etiquetaTira: "O estoque, no catálogo",
    pies: {
      ultimas: "«Últimas 1 unidad» (última unidade), em laranja",
      disponibles: "«16 unidades disponibles», em verde",
      sinstock: "«Sin stock»: o produto continua à vista",
      filtros: "Categoria, marca, coleção, tamanho e preço",
    },
    movil: [
      "No celular",
      "O celular tem sua própria navegação: a coleção de roupa comprada por tamanho, o catálogo de dois em dois com sua gaveta de filtros e a página do produto com as opções ao alcance do polegar.",
    ],
    deportistas: [
      "A capa também é dos jogadores",
      "A ANJ patrocina os jogadores que competem, e isso vive na sua capa, não numa página escondida: um carrossel de atletas que se percorre com as setas.",
    ],
    mandos: { anterior: "Anterior", siguiente: "Próximo" },
    alt: {
      web: "A capa de anjsports.com em uma janela e em um celular, animada: o carrossel passa do magenta da Butterfly ao ciano da XIOM e o fundo muda de cor com ele",
      tienda:
        "Um laptop no balcão de uma loja de tênis de mesa, com o catálogo de anjsports.com e uma parede de borrachas e raquetes atrás",
      jugador:
        "Um jogador de tênis de mesa prestes a golpear a bola; flutua ao seu lado o cartão real da borracha XIOM Jekyll & Hyde C52.5 em anjsports.com, com 25 unidades disponíveis",
      mano: "Uma mão segura um celular em um clube de tênis de mesa, com a página de uma borracha em anjsports.com: as opções Black / Max e Red / Max, o preço e o estoque",
      variantes:
        "A página da borracha XIOM Omega VII Asia em anjsports.com, animada: ao escolher Black / MAX, Black / 2.0, Red / MAX ou Red / 2.0, o estoque passa de 9 unidades a sem estoque e a 8 unidades",
      ultimas:
        "Cartão real da borracha Butterfly Dignics 09C em anjsports.com, com a etiqueta «Últimas 1 unidad»",
      disponibles:
        "Cartão real da borracha XIOM Jekyll & Hyde C55.0 em anjsports.com, com a etiqueta «16 unidades disponibles»",
      sinstock:
        "Cartão real da raquete Butterfly Timo Boll Spirit em anjsports.com, com a etiqueta «Sin stock»",
      filtros:
        "O painel de filtros do catálogo de anjsports.com: categorias, marcas, coleções, tamanhos e faixa de preço",
      moviles:
        "Três celulares com anjsports.com: a coleção de roupa XIOM 2026, o catálogo com seus filtros e a página de uma borracha",
      deportistas:
        "A seção de atletas de anjsports.com, animada: o carrossel de jogadores patrocinados avança com as setas",
    },
    cita: {
      texto:
        "«Resposta imediata às perguntas e aos pedidos, atendimento personalizado, produtos variados e de qualidade. Recomendo!»",
      nombre: "Silvana Aparicio",
      cargo: "Cliente da ANJ Sports · depoimento publicado em anjsports.com",
      iniciales: "SA",
    },
    cta: {
      titulo: "A sua loja precisa de mais do que um modelo pronto?",
      texto:
        "Nós a desenhamos e a construímos sob medida sobre o Vendiq, como fizemos com a ANJ Sports.",
      boton: "Vamos conversar",
      href: "#contacto",
    },
    resultado: {
      titulo: "O resultado",
      texto:
        "anjsports.com está em produção: a loja sob medida da ANJ, com seu catálogo, suas variantes com estoque ao vivo e o pagamento com cartão ou transferência dentro do seu domínio. Não publicamos números de venda: a analítica deles não é nossa.",
      cifras: [
        { valor: "251", texto: "produtos no catálogo, com suas variantes" },
        {
          valor: "5",
          texto: "marcas que a ANJ distribui, cada uma com sua cor",
        },
        { valor: "4", texto: "passos de checkout, sem sair de anjsports.com" },
      ],
    },
    nextTagline:
      "Loja online, ponto de venda, estoque e faturamento SUNAT em um só sistema",
  },
};

const img = (src: string, alt: string, srcMovil?: string): Medio => ({
  tipo: "imagen",
  src: `${IMG}/${src}`,
  alt,
  ...(srcMovil ? { srcMovil: `${IMG}/${srcMovil}` } : {}),
});
const vid = (nombre: string, alt: string): Medio => ({
  tipo: "video",
  src: `${IMG}/${nombre}.mp4`,
  poster: `${IMG}/${nombre}.jpg`,
  alt,
});

/** El ritmo de Rematch: texto, pieza; vídeos a todo el ancho; una sola tira. */
function bloques(c: Copy): BloqueProducto[] {
  const pieza = (k: PieTira, archivo: string) => ({
    medio: img(archivo, c.alt[k]),
    pie: c.pies[k],
  });
  return [
    { kind: "texto", lado: "izq", title: c.contexto[0], body: c.contexto[1] },
    // La web real moviéndose: el carrusel cambia de marca y el fondo toma su color
    {
      kind: "ancho",
      // en el celular, solo el teléfono: la ventana a 390 px no se lee
      medio: {
        ...vid("anj-web", c.alt.web),
        srcMovil: `${IMG}/anj-web-movil.mp4`,
        posterMovil: `${IMG}/anj-web-movil.jpg`,
      } as Medio,
      ratio: 16 / 9,
      ratioMovil: 4 / 5,
      inset: true,
    },
    { kind: "texto", lado: "der", title: c.reto[0], body: c.reto[1] },
    // Trío de vida: la tienda física, un jugador real (stock) y la ficha en la mano
    {
      kind: "trio",
      medios: [
        img("anj-tienda.jpg", c.alt.tienda),
        img("anj-jugador.jpg", c.alt.jugador),
        img("anj-mano.jpg", c.alt.mano),
      ],
    },
    {
      kind: "texto",
      lado: "izq",
      title: c.variantes[0],
      body: c.variantes[1],
    },
    {
      kind: "ancho",
      medio: {
        ...vid("anj-variantes", c.alt.variantes),
        srcMovil: `${IMG}/anj-variantes-movil.mp4`,
        posterMovil: `${IMG}/anj-variantes-movil.jpg`,
      } as Medio,
      ratio: 2240 / 1400,
      ratioMovil: 4 / 5,
    },
    // La única tira: el stock de Vendiq en las tarjetas del catálogo, y los filtros
    {
      kind: "capitulo",
      body: c.tira,
      etiqueta: c.etiquetaTira,
      piezas: [
        pieza("ultimas", "anj-c-ultimas.jpg"),
        pieza("disponibles", "anj-c-disponibles.jpg"),
        pieza("sinstock", "anj-c-sinstock.jpg"),
        pieza("filtros", "anj-c-filtros.jpg"),
      ],
    },
    { kind: "texto", lado: "der", title: c.movil[0], body: c.movil[1] },
    {
      kind: "ancho",
      medio: img("anj-moviles.jpg", c.alt.moviles, "anj-moviles-movil.jpg"),
      ratio: 2688 / 1934,
      ratioMovil: 4 / 5,
    },
    {
      kind: "texto",
      lado: "izq",
      title: c.deportistas[0],
      body: c.deportistas[1],
    },
    {
      kind: "ancho",
      medio: vid("anj-deportistas", c.alt.deportistas),
      ratio: 1440 / 734,
    },
  ];
}

export default function AnjsportsContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseProducto
        // El negro de anjsports.com: la tienda es negra y deja el color a cada marca
        fondo="#08080B"
        mandos={c.mandos}
        titulo={c.titulo}
        logo={{
          src: `${IMG}/anj-logo-blanco.png`,
          width: 1500,
          height: 360,
          alt: "ANJ Sports",
        }}
        heroe={{
          src: `${IMG}/anj-heroe-mesa.jpg`,
          srcMovil: `${IMG}/anj-heroe-mesa-movil.jpg`,
          alt: c.heroeAlt,
        }}
        meta={c.meta}
        bloques={bloques(c)}
        cita={c.cita}
        cta={c.cta}
        resultado={c.resultado}
      />
      <CaseMasProyectos
        // El cian de XIOM, su neón: llevado a la sombra sobre blanco (5,24:1) y exacto sobre tinta
        accent={{ base: "#0B7A6A", dark: "#2BE8C8", deep: "#04211D" }}
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
