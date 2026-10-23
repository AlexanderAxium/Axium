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
 * Ficha de Vendiq al molde de producto (Pixelmatters), 2026-10-06, como la de Rematch.
 * Alexander: «rematch, lumio, vendiq y bookit son productos propios… vendiq tiene algunos
 * buenos diseños pero puedes mejorarlo… Me gusta mucho que hagas animaciones de la web».
 *
 * ── DE DÓNDE SALE CADA COSA (rehecha el 2026-10-21, con la portada clara «cielo») ─────────
 *  Alexander: «vendiq sufrió una actualización, rehaz todo su use case en axium, sus portadas,
 *  imágenes, etc.». Taller: `capturas-saas/vendiq/cielo-2026-10/` (CASO-VENDIQ.md § 15).
 *  · Héroe, tarjeta y destacado: la MISMA imagen clave, el panel del hero de vendiq.pe sobre su
 *    cielo (scripts/clave-vendiq-cielo.py, las dos piezas reales; sin titular).
 *  · Animaciones: las REALES de vendiq.pe, grabadas con el screencast de Chrome
 *    (scripts/grabar-micro.cjs, con `fondoPagina` para la lámina noche): «Vendes una vez» (las
 *    cuatro pestañas, bucle de 20 s) y el asistente con IA (14 s). Los módulos, cada tarjeta
 *    aislada a 3x sobre su papel (capturar-vendiq-cielo.cjs).
 *  · «El reto»: foto de stock real (Unsplash, Rifki Kurniawan; crédito en el taller), para no
 *    repetir personas generadas. El abanico de tiendas de vendiq.pe NO entra: repetiría las
 *    mismas tiendas (y al jugador de ANJ) de los mockups.
 *  · Tiendas: las seis, recapturadas en vivo y montadas sobre el papel de la portada clara
 *    (mockups-tiendas-vendiq.py con MOCK_FONDO/VINETA/LUZ_OP/SOMBRA). Happy Art entra «como las
 *    demás» por decisión de Alexander (2026-10-06), aunque happyart.com.pe sigue en WordPress.
 *  · Panel: capturas del repo local con el inquilino demo (CASO-VENDIQ.md § 8); el panel no
 *    cambió con la web.
 *  · Marca: corta, porque Vendiq NO tiene manual (Alexander: «no exageres con la sección
 *    de branding»): logo, tipografía y paleta tal como están en el código (claro.ts, fuentes.ts).
 *  · Sin cita: no hay testimonio de un comercio que citar, y no se inventa.
 *  · Lo que depende del plan se dice con el plan (punto de venta, SUNAT, envíos e IA desde
 *    Business; varios almacenes en Business Pro).
 */

const IMG = "/images/proyects/vendiq";

type Copy = {
  /** El explicativo de 45 s de sus redes (SAAS/videos), con voz: suena sólo si se toca. */
  video: { texto: string; alt: string; reproducir: string };
  titulo: string;
  heroeAlt: string;
  meta: CaseProductoProps["meta"];
  contexto: [string, string];
  reto: [string, string];
  enfoque: [string, string];
  marca: [string, string];
  modulos: string;
  etiquetaModulos: string;
  pies: [string, string, string, string, string, string, string];
  ia: string;
  panel: [string, string];
  tiendas: [string, string];
  piesTiendas: string[];
  mandos: { anterior: string; siguiente: string };
  alt: Record<
    | "incluido"
    | "reto"
    | "como"
    | "tipografia"
    | "paleta"
    | "asistente"
    | "panel"
    | "celular"
    | "envios",
    string
  > & {
    modulos: [string, string, string, string, string, string, string];
    tiendas: string[];
  };
  cta: CaseProductoProps["cta"];
  resultado: CaseProductoProps["resultado"];
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    video: {
      texto:
        "Vendiq en 45 segundos, el video que hicimos para sus redes: la tienda demo Pulso vende unas zapatillas por la web y otras en la caja, y el stock, la boleta y el envío se resuelven solos.",
      alt: "Video de 45 segundos de Vendiq: la venta web y la de caja descuentan el mismo stock, la boleta sale sola y el envío se cobra por distrito",
      reproducir: "Ver el video (45 s)",
    },
    titulo:
      "Una plataforma para vender en la web y en el local, con un solo catálogo",
    heroeAlt:
      "El panel de Vendiq, «Resumen de hoy» con S/ 12.480 en ventas, sobre el cielo de la portada de vendiq.pe",
    meta: {
      tipologia: ["Tipología", ["Web app", "Tienda online", "Punto de venta"]],
      industria: ["Industria", "Comercio · SaaS propio"],
      anio: ["Año", "2026"],
      servicios: [
        "Servicios",
        [
          "Logotipo e identidad",
          "Diseño de producto",
          "Web pública",
          "Desarrollo web",
          "Plataforma SaaS",
        ],
      ],
      entregables: [
        "Entregables",
        [
          "vendiq.pe",
          "Panel del comercio",
          "Tiendas de los clientes",
          "Punto de venta",
          "Facturación SUNAT",
          "Editor visual con IA",
        ],
      ],
      vivo: ["En vivo", "vendiq.pe", "https://vendiq.pe"],
    },
    contexto: [
      "Contexto",
      "Vendiq es un producto propio de Axium para comercios del Perú que venden por internet y en mostrador: tienda online con su marca, punto de venta, inventario y facturación SUNAT sobre un mismo catálogo.",
    ],
    reto: [
      "El reto",
      "Un comercio pequeño vende con herramientas sueltas: una web, una caja, una hoja de cálculo para el stock, otro programa para las boletas y el chat para los pedidos. Cada venta se anota varias veces y el stock nunca coincide.",
    ],
    enfoque: [
      "Vendes una vez",
      "Da igual por dónde entre la venta, por la tienda online o por la caja: el stock baja en la web y en el local, y sale la boleta aceptada por SUNAT. vendiq.pe lo cuenta con un solo pedido, el #1482.",
    ],
    marca: [
      "Claro, con pausas de noche",
      "El logotipo es la V de dos cintas de luz. Desde octubre de 2026 la web es clara: láminas blancas y de papel con pausas oscuras, un solo azul como acento, Literata en los titulares con un tramo en itálica, Satoshi para el texto y Geist Mono para los datos.",
    ],
    modulos:
      "Siete módulos sobre el mismo catálogo. En vendiq.pe cada tarjeta trae su propio escenario: un trozo de su interfaz dibujado en HTML, con la tienda de ejemplo Pulso.",
    etiquetaModulos: "Los módulos de Vendiq",
    pies: [
      "La tienda online con tu marca, en todos los planes",
      "Punto de venta, desde el plan Business",
      "Varios almacenes y sedes, en Business Pro",
      "Boletas y facturas SUNAT, desde Business",
      "0 % de comisión de Vendiq, en todos los planes",
      "Zonas de envío por distrito, desde Business",
      "El asistente con IA del editor, desde Business",
    ],
    ia: "Desde el plan Business, el editor visual trae un asistente con Gemini, con la clave del propio comercio: describe su negocio y el asistente propone una sección o la página entera con sus productos y sus colores.",
    panel: [
      "Por dentro",
      "El panel lleva el catálogo, los pedidos con su envío y su pago, y las zonas de envío por distrito. También se usa desde el celular.",
    ],
    tiendas: [
      "Tiendas que ya venden con Vendiq",
      "Seis comercios de rubros muy distintos, cada uno con su marca, su dominio y su forma de vender: perfumes de nicho, tenis de mesa, aceites de motor, productos de lavandería, flores y regalos.",
    ],
    piesTiendas: [
      "Aurore · Perfumería de nicho · aurore.com.pe",
      "ANJ Sports · Tenis de mesa · anjsports.com",
      "Sportt · Tenis de mesa · sporttperu.com",
      "Daesur Motors · Aceites y taller · daesurmotors.com",
      "Clefast · Productos de lavandería · clefast.com.pe",
      "Happy Art · Flores y regalos · happyart.com.pe",
    ],
    mandos: { anterior: "Anterior", siguiente: "Siguiente" },
    alt: {
      incluido:
        "«Lo que ya viene incluido» en vendiq.pe: 0 % de comisión, 1893 distritos para las zonas de envío, 14 días de prueba y 5 idiomas, junto al mapa del Perú hecho de puntos",
      reto: "Una emprendedora revisa un pedido con el celular, entre la laptop y una pila de cajas por despachar",
      como: "«Vendes una vez» en vendiq.pe, animado: el pedido #1482 de Pulso pasa por la venta, el stock, la boleta y la etiqueta de envío",
      tipografia:
        "Tipografía de Vendiq: Literata en los titulares, Satoshi para el texto y Geist Mono para los datos",
      paleta:
        "Paleta de Vendiq: lienzo, papel, hielo, el azul de acento, noche y tinta",
      asistente:
        "El asistente con IA del editor, animado: escribe «Vendo zapatillas y ropa de running…», marca sus pasos y arma la vista previa de la tienda",
      panel:
        "El panel de Vendiq: el catálogo de productos y el detalle de un pedido con su envío y su pago",
      celular:
        "El panel de Vendiq en el celular: la lista de pedidos y el detalle de un pedido",
      envios:
        "Envíos en el panel: zonas de Lima y provincias con sus métodos y tarifas",
      tiendas: [
        "La tienda de Aurore en un monitor y en el celular: perfumería de casas de autor",
        "La tienda de ANJ Sports en un monitor y en el celular: tenis de mesa, con un jugador de XIOM",
        "La tienda de Sportt en un monitor y en el celular: la nueva colección de zapatillas Lezoline",
        "La tienda de Daesur Motors en un monitor y en el celular: el aceite exacto para tu motor",
        "La tienda de Clefast en un monitor y en el celular: soluciones de limpieza industrial",
        "La tienda de Happy Art en un monitor y en el celular: flores y regalos por el Día de las Flores Amarillas",
      ],
      modulos: [
        "Tarjeta del módulo Tienda online: la tienda de ejemplo en su subdominio con tres productos y el carrito",
        "Tarjeta del módulo Punto de venta: la caja 1 de Miraflores con dos productos y el botón Cobrar",
        "Tarjeta del módulo Inventario por sede: stock en Miraflores, Surco y el almacén, con el kardex",
        "Tarjeta del módulo Facturación SUNAT: una factura electrónica aceptada por SUNAT",
        "Tarjeta del módulo Pagos sin comisión: 0 % de comisión, con Mercado Pago, Culqi y PayPal conectadas",
        "Tarjeta del módulo Envíos: zonas de envío entre los 1893 distritos del Perú, con su tarifa",
        "Tarjeta del módulo Editor visual con IA: los bloques de la página y la portada con los colores de la marca",
      ],
    },
    cta: {
      titulo: "¿Tienes un producto en mente?",
      texto:
        "Lo diseñamos y lo construimos contigo, de la primera pantalla a producción, como hicimos con Vendiq.",
      boton: "Hablemos",
      href: "#contacto",
    },
    resultado: {
      titulo: "El resultado",
      texto:
        "Vendiq está en producción en vendiq.pe, con tres planes de precio fijo al mes y sin comisión por venta.",
      cifras: [
        {
          valor: "0%",
          texto: "de comisión de Vendiq por venta, en todos los planes",
        },
        {
          valor: "6",
          texto: "tiendas de clientes en producción, de rubros distintos",
        },
        {
          valor: "1",
          texto:
            "catálogo para la tienda online, la caja, el stock y las boletas",
        },
      ],
    },
    nextTagline:
      "Una sola plataforma para todo lo que pasa en un centro deportivo",
  },
  en: {
    video: {
      texto:
        "Vendiq in 45 seconds, the video we made for its social channels (in Spanish): the demo store Pulso sells a pair of sneakers online and another at the counter, and stock, receipts and shipping take care of themselves.",
      alt: "45-second Vendiq video: the online sale and the counter sale draw on the same stock, the receipt is issued on its own and shipping is charged by district",
      reproducir: "Watch the video (45 s)",
    },
    titulo: "A platform to sell online and in store, from a single catalog",
    heroeAlt:
      "The Vendiq dashboard, “Today's summary” with S/ 12,480 in sales, over the sky of the vendiq.pe homepage",
    meta: {
      tipologia: ["Typology", ["Web app", "Online store", "Point of sale"]],
      industria: ["Industry", "Retail · In-house SaaS"],
      anio: ["Year", "2026"],
      servicios: [
        "Services",
        [
          "Logo and identity",
          "Product design",
          "Public website",
          "Web development",
          "SaaS platform",
        ],
      ],
      entregables: [
        "Deliverables",
        [
          "vendiq.pe",
          "Merchant dashboard",
          "Client stores",
          "Point of sale",
          "SUNAT invoicing",
          "AI visual editor",
        ],
      ],
      vivo: ["Live", "vendiq.pe", "https://vendiq.pe"],
    },
    contexto: [
      "Background",
      "Vendiq is Axium's own product for Peruvian merchants who sell online and over the counter: an online store with their brand, point of sale, inventory and SUNAT invoicing on one shared catalog.",
    ],
    reto: [
      "Challenge",
      "A small merchant sells with scattered tools: a website, a till, a spreadsheet for stock, another program for receipts and chat for orders. Every sale is entered several times and the stock never matches.",
    ],
    enfoque: [
      "Sell once",
      "Whether the sale comes in through the online store or the till, stock falls online and in store, and the receipt comes out accepted by SUNAT. vendiq.pe tells it with a single order, #1482.",
    ],
    marca: [
      "Light, with pauses of night",
      "The logo is the V made of two ribbons of light. Since October 2026 the website is light: white and paper panels with dark pauses, a single blue as the accent, Literata for headlines with one stretch in italics, Satoshi for text and Geist Mono for data.",
    ],
    modulos:
      "Seven modules on the same catalog. On vendiq.pe each card brings its own scene: a piece of its interface drawn in HTML, with Pulso, the sample store.",
    etiquetaModulos: "Vendiq modules",
    pies: [
      "The online store with your brand, on every plan",
      "Point of sale, from the Business plan",
      "Multiple warehouses and locations, on Business Pro",
      "SUNAT receipts and invoices, from Business",
      "0% Vendiq commission, on every plan",
      "Shipping zones by district, from Business",
      "The editor's AI assistant, from Business",
    ],
    ia: "From the Business plan, the visual editor has a Gemini assistant, using the merchant's own key: they describe their business and the assistant proposes a section or the whole page with their products and colours.",
    panel: [
      "Inside",
      "The dashboard runs the catalog, orders with their shipping and payment, and shipping zones by district. It also works from the phone.",
    ],
    tiendas: [
      "Stores already selling with Vendiq",
      "Six merchants from very different trades, each with its own brand, domain and way of selling: niche perfume, table tennis, motor oil, laundry supplies, flowers and gifts.",
    ],
    piesTiendas: [
      "Aurore · Niche perfumery · aurore.com.pe",
      "ANJ Sports · Table tennis · anjsports.com",
      "Sportt · Table tennis · sporttperu.com",
      "Daesur Motors · Motor oil and workshop · daesurmotors.com",
      "Clefast · Laundry supplies · clefast.com.pe",
      "Happy Art · Flowers and gifts · happyart.com.pe",
    ],
    mandos: { anterior: "Previous", siguiente: "Next" },
    alt: {
      incluido:
        "“What's already included” on vendiq.pe: 0% commission, 1,893 districts for shipping zones, a 14-day trial and 5 languages, next to a map of Peru made of dots",
      reto: "A young entrepreneur checks an order on her phone, between her laptop and a stack of boxes to ship",
      como: "“Sell once” on vendiq.pe, animated: Pulso's order #1482 goes through the sale, the stock, the receipt and the shipping label",
      tipografia:
        "Vendiq typography: Literata for headlines, Satoshi for text and Geist Mono for data",
      paleta:
        "Vendiq palette: canvas, paper, ice, the accent blue, night and ink",
      asistente:
        "The editor's AI assistant, animated: it types “I sell running shoes and apparel…”, ticks its steps and builds the store preview",
      panel:
        "The Vendiq dashboard: the product catalog and an order's detail with its shipping and payment",
      celular:
        "The Vendiq dashboard on mobile: the order list and an order's detail",
      envios:
        "Shipping in the dashboard: Lima and province zones with their methods and rates",
      tiendas: [
        "Aurore's store on a monitor and a phone: perfume from independent houses",
        "ANJ Sports' store on a monitor and a phone: table tennis, with a XIOM player",
        "Sportt's store on a monitor and a phone: the new Lezoline shoe collection",
        "Daesur Motors' store on a monitor and a phone: the right oil for your engine",
        "Clefast's store on a monitor and a phone: industrial cleaning solutions",
        "Happy Art's store on a monitor and a phone: flowers and gifts for Yellow Flowers Day",
      ],
      modulos: [
        "Online store module card: the sample store on its subdomain with three products and the cart",
        "Point of sale module card: till 1 in Miraflores with two products and the Charge button",
        "Inventory by location module card: stock in Miraflores, Surco and the warehouse, with the stock ledger",
        "SUNAT invoicing module card: an electronic invoice accepted by SUNAT",
        "Commission-free payments module card: 0% commission, with Mercado Pago, Culqi and PayPal connected",
        "Shipping module card: shipping zones across Peru's 1,893 districts, with their rate",
        "AI visual editor module card: the page blocks and a homepage in the brand's colours",
      ],
    },
    cta: {
      titulo: "Have a product in mind?",
      texto:
        "We design and build it with you, from the first screen to production, just like we did with Vendiq.",
      boton: "Let's talk",
      href: "#contacto",
    },
    resultado: {
      titulo: "The result",
      texto:
        "Vendiq is in production at vendiq.pe, with three fixed monthly plans and no commission per sale.",
      cifras: [
        {
          valor: "0%",
          texto: "Vendiq commission per sale, on every plan",
        },
        {
          valor: "6",
          texto: "client stores in production, across different trades",
        },
        {
          valor: "1",
          texto:
            "catalog for the online store, the till, the stock and the receipts",
        },
      ],
    },
    nextTagline: "One platform for everything that happens at a sports center",
  },
  pt: {
    video: {
      texto:
        "O Vendiq em 45 segundos, o vídeo que fizemos para as suas redes (em espanhol): a loja de exemplo Pulso vende um par de tênis pela web e outro no caixa, e o estoque, a nota e a entrega se resolvem sozinhos.",
      alt: "Vídeo de 45 segundos do Vendiq: a venda online e a do caixa baixam o mesmo estoque, a nota sai sozinha e a entrega é cobrada por distrito",
      reproducir: "Ver o vídeo (45 s)",
    },
    titulo: "Uma plataforma para vender na web e na loja, com um só catálogo",
    heroeAlt:
      "O painel do Vendiq, «Resumo de hoje» com S/ 12.480 em vendas, sobre o céu da página inicial do vendiq.pe",
    meta: {
      tipologia: ["Tipologia", ["Web app", "Loja online", "Ponto de venda"]],
      industria: ["Setor", "Comércio · SaaS próprio"],
      anio: ["Ano", "2026"],
      servicios: [
        "Serviços",
        [
          "Logotipo e identidade",
          "Design de produto",
          "Site público",
          "Desenvolvimento web",
          "Plataforma SaaS",
        ],
      ],
      entregables: [
        "Entregáveis",
        [
          "vendiq.pe",
          "Painel do comerciante",
          "Lojas dos clientes",
          "Ponto de venda",
          "Faturamento SUNAT",
          "Editor visual com IA",
        ],
      ],
      vivo: ["Ao vivo", "vendiq.pe", "https://vendiq.pe"],
    },
    contexto: [
      "Contexto",
      "O Vendiq é um produto próprio da Axium para comerciantes do Peru que vendem pela internet e no balcão: loja online com a sua marca, ponto de venda, estoque e faturamento SUNAT sobre um mesmo catálogo.",
    ],
    reto: [
      "O desafio",
      "Um pequeno comércio vende com ferramentas soltas: um site, um caixa, uma planilha para o estoque, outro programa para as notas e o chat para os pedidos. Cada venda é anotada várias vezes e o estoque nunca bate.",
    ],
    enfoque: [
      "Você vende uma vez",
      "Não importa por onde entra a venda, pela loja online ou pelo caixa: o estoque baixa na web e na loja, e sai a nota aceita pela SUNAT. O vendiq.pe conta isso com um só pedido, o #1482.",
    ],
    marca: [
      "Claro, com pausas de noite",
      "O logotipo é o V de duas fitas de luz. Desde outubro de 2026 o site é claro: lâminas brancas e de papel com pausas escuras, um só azul como acento, Literata nos títulos com um trecho em itálico, Satoshi para o texto e Geist Mono para os dados.",
    ],
    modulos:
      "Sete módulos sobre o mesmo catálogo. No vendiq.pe cada cartão traz o seu próprio cenário: um pedaço da sua interface desenhado em HTML, com a loja de exemplo Pulso.",
    etiquetaModulos: "Os módulos do Vendiq",
    pies: [
      "A loja online com a sua marca, em todos os planos",
      "Ponto de venda, a partir do plano Business",
      "Vários armazéns e lojas, no Business Pro",
      "Boletas e faturas SUNAT, a partir do Business",
      "0% de comissão do Vendiq, em todos os planos",
      "Zonas de entrega por distrito, a partir do Business",
      "O assistente com IA do editor, a partir do Business",
    ],
    ia: "A partir do plano Business, o editor visual traz um assistente com Gemini, com a chave do próprio comerciante: ele descreve o negócio e o assistente propõe uma seção ou a página inteira com seus produtos e suas cores.",
    panel: [
      "Por dentro",
      "O painel cuida do catálogo, dos pedidos com sua entrega e seu pagamento, e das zonas de entrega por distrito. Também funciona no celular.",
    ],
    tiendas: [
      "Lojas que já vendem com o Vendiq",
      "Seis comércios de ramos muito diferentes, cada um com sua marca, seu domínio e seu jeito de vender: perfumes de nicho, tênis de mesa, óleos de motor, produtos para lavanderia, flores e presentes.",
    ],
    piesTiendas: [
      "Aurore · Perfumaria de nicho · aurore.com.pe",
      "ANJ Sports · Tênis de mesa · anjsports.com",
      "Sportt · Tênis de mesa · sporttperu.com",
      "Daesur Motors · Óleos e oficina · daesurmotors.com",
      "Clefast · Produtos para lavanderia · clefast.com.pe",
      "Happy Art · Flores e presentes · happyart.com.pe",
    ],
    mandos: { anterior: "Anterior", siguiente: "Próximo" },
    alt: {
      incluido:
        "«O que já vem incluído» no vendiq.pe: 0% de comissão, 1.893 distritos para as zonas de entrega, 14 dias de teste e 5 idiomas, ao lado do mapa do Peru feito de pontos",
      reto: "Uma empreendedora confere um pedido no celular, entre o notebook e uma pilha de caixas para enviar",
      como: "«Você vende uma vez» no vendiq.pe, animado: o pedido #1482 da Pulso passa pela venda, pelo estoque, pela nota e pela etiqueta de envio",
      tipografia:
        "Tipografia do Vendiq: Literata nos títulos, Satoshi para o texto e Geist Mono para os dados",
      paleta:
        "Paleta do Vendiq: tela, papel, gelo, o azul de acento, noite e tinta",
      asistente:
        "O assistente com IA do editor, animado: escreve «Vendo tênis e roupas de corrida…», marca seus passos e monta a prévia da loja",
      panel:
        "O painel do Vendiq: o catálogo de produtos e o detalhe de um pedido com sua entrega e seu pagamento",
      celular:
        "O painel do Vendiq no celular: a lista de pedidos e o detalhe de um pedido",
      envios:
        "Entregas no painel: zonas de Lima e das províncias com seus métodos e tarifas",
      tiendas: [
        "A loja da Aurore em um monitor e no celular: perfumaria de casas autorais",
        "A loja da ANJ Sports em um monitor e no celular: tênis de mesa, com um jogador da XIOM",
        "A loja da Sportt em um monitor e no celular: a nova coleção de tênis Lezoline",
        "A loja da Daesur Motors em um monitor e no celular: o óleo certo para o seu motor",
        "A loja da Clefast em um monitor e no celular: soluções de limpeza industrial",
        "A loja da Happy Art em um monitor e no celular: flores e presentes para o Dia das Flores Amarelas",
      ],
      modulos: [
        "Cartão do módulo Loja online: a loja de exemplo no seu subdomínio com três produtos e o carrinho",
        "Cartão do módulo Ponto de venda: o caixa 1 de Miraflores com dois produtos e o botão Cobrar",
        "Cartão do módulo Estoque por loja: estoque em Miraflores, Surco e no armazém, com o kardex",
        "Cartão do módulo Faturamento SUNAT: uma fatura eletrônica aceita pela SUNAT",
        "Cartão do módulo Pagamentos sem comissão: 0% de comissão, com Mercado Pago, Culqi e PayPal conectados",
        "Cartão do módulo Entregas: zonas de entrega entre os 1.893 distritos do Peru, com sua tarifa",
        "Cartão do módulo Editor visual com IA: os blocos da página e a capa com as cores da marca",
      ],
    },
    cta: {
      titulo: "Tem um produto em mente?",
      texto:
        "Nós o desenhamos e o construímos com você, da primeira tela à produção, como fizemos com o Vendiq.",
      boton: "Vamos conversar",
      href: "#contacto",
    },
    resultado: {
      titulo: "O resultado",
      texto:
        "O Vendiq está em produção em vendiq.pe, com três planos de preço fixo por mês e sem comissão por venda.",
      cifras: [
        {
          valor: "0%",
          texto: "de comissão do Vendiq por venda, em todos os planos",
        },
        {
          valor: "6",
          texto: "lojas de clientes em produção, de ramos diferentes",
        },
        {
          valor: "1",
          texto: "catálogo para a loja online, o caixa, o estoque e as notas",
        },
      ],
    },
    nextTagline:
      "Uma só plataforma para tudo o que acontece em um centro esportivo",
  },
};

const img = (src: string, alt: string, srcMovil?: string): Medio => ({
  tipo: "imagen",
  src: `${IMG}/${src}`,
  alt,
  srcMovil: srcMovil ? `${IMG}/${srcMovil}` : undefined,
});
const vid = (nombre: string, alt: string): Medio => ({
  tipo: "video",
  src: `${IMG}/${nombre}.mp4`,
  poster: `${IMG}/${nombre}.jpg`,
  alt,
});

const TIENDAS = [
  "aurore",
  "anj-sports",
  "sportt",
  "daesur-motors",
  // la segunda diapositiva de su portada; la primera es un vídeo (Alexander, 2026-10-06)
  "clefast",
  "happy-art",
] as const;
const tienda = (c: Copy, i: number) =>
  img(`vq-tienda-${TIENDAS[i]}-v3.jpg`, c.alt.tiendas[i] ?? TIENDAS[i] ?? "");

function bloques(c: Copy): BloqueProducto[] {
  return [
    { kind: "texto", lado: "izq", title: c.contexto[0], body: c.contexto[1] },
    // Lo que trae, en la lámina clara de vendiq.pe: cifras y el mapa del Perú
    {
      kind: "ancho",
      medio: img("bv-incluido.jpg", c.alt.incluido),
      ratio: 2400 / 1472,
    },
    { kind: "texto", lado: "der", title: c.reto[0], body: c.reto[1] },
    // stock real para no repetir caras generadas (Alexander: «usa imágenes de stock para variar»)
    {
      kind: "ancho",
      medio: img("bv-reto.jpg", c.alt.reto),
      ratio: 2400 / 1357,
    },
    // El explicativo de 45 s de sus redes, con voz y subtítulos: suena sólo si se toca (2026-10-23)
    {
      kind: "cuadrada-texto",
      medio: {
        tipo: "video",
        src: `${IMG}/vq-video-45s.mp4`,
        poster: `${IMG}/vq-video-45s.jpg`,
        alt: c.video.alt,
        conSonido: {
          reproducir: c.video.reproducir,
          subtitulos: `${IMG}/vq-video-45s.vtt`,
        },
      },
      body: c.video.texto,
    },
    { kind: "texto", lado: "izq", title: c.enfoque[0], body: c.enfoque[1] },
    // «Vendes una vez»: las cuatro pestañas de la lámina noche, 20 s en bucle
    { kind: "ancho", medio: vid("vq-como-v3", c.alt.como), ratio: 2240 / 1400 },
    // ── Las tiendas, con prioridad (Alexander: «dar un poco más de prioridad a sus tiendas
    // creadas»): dos tríos de mockups, monitor + celular, con nombre · rubro · dominio ──
    { kind: "texto", lado: "izq", title: c.tiendas[0], body: c.tiendas[1] },
    {
      kind: "trio",
      medios: [tienda(c, 0), tienda(c, 1), tienda(c, 2)],
      pies: c.piesTiendas.slice(0, 3),
    },
    {
      kind: "trio",
      medios: [tienda(c, 3), tienda(c, 4), tienda(c, 5)],
      pies: c.piesTiendas.slice(3, 6),
    },
    // ── La marca, corta: Vendiq no tiene manual ──
    { kind: "texto", lado: "izq", title: c.marca[0], body: c.marca[1] },
    {
      kind: "par",
      medios: [
        img("bv-tipografia-v3.jpg", c.alt.tipografia),
        img("bv-paleta-v3.jpg", c.alt.paleta),
      ],
    },
    // ── El producto: la única tira de la ficha («haz un intermedio») ──
    {
      kind: "capitulo",
      body: c.modulos,
      etiqueta: c.etiquetaModulos,
      piezas: c.pies.map((pie, i) => ({
        medio: img(`vq-modulo-${i + 1}-v3.jpg`, c.alt.modulos[i] ?? pie),
        // escenario y texto de cada tarjeta de vendiq.pe, sobre su papel (2026-10-21)
        ratio: 960 / 1257,
        pie,
      })),
    },
    { kind: "texto", lado: "der", body: c.ia },
    {
      kind: "ancho",
      medio: vid("vq-asistente-v3", c.alt.asistente),
      ratio: 2240 / 1500,
    },
    { kind: "texto", lado: "izq", title: c.panel[0], body: c.panel[1] },
    {
      kind: "ancho",
      medio: img("bv-panel.jpg", c.alt.panel, "bv-panel-movil.jpg"),
      ratio: 2,
      ratioMovil: 4 / 3,
    },
    {
      kind: "par",
      medios: [
        img("bv-celular.jpg", c.alt.celular),
        img("bv-envios.jpg", c.alt.envios),
      ],
    },
  ];
}

export default function VendiqContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseProducto
        // La lámina «noche» de la portada clara de vendiq.pe (claro.ts): el mismo grafito
        fondo="#0B0D12"
        mandos={c.mandos}
        titulo={c.titulo}
        logo={{
          src: "/images/highlights/logos/vendiq-v2.png",
          width: 694,
          height: 160,
          alt: "Vendiq",
        }}
        heroe={{
          src: `${IMG}/vq-cielo-heroe.jpg`,
          srcMovil: `${IMG}/vq-cielo-cuadrada.jpg`,
          alt: c.heroeAlt,
        }}
        meta={c.meta}
        bloques={bloques(c)}
        cta={c.cta}
        resultado={c.resultado}
      />
      <CaseMasProyectos
        // el azul de acento · su versión sobre oscuro · noche (claro.ts)
        accent={{ base: "#1F5BFF", dark: "#8FB4FF", deep: "#0B0D12" }}
        next={{
          name: "Rematch",
          tagline: c.nextTagline,
          href: "/casos-de-exito/rematch",
          image: "/images/proyects/rematch/rematch-portada-noche-v2.jpg",
        }}
        // El caso anónimo «E-commerce & Inventory SaaS» describe el mismo producto
        hide={["store-saas"]}
        labels={STORY_LABELS[lang]}
      />
      {/* Sección clara para que el navbar se lea sobre la tarjeta oscura del formulario */}
      <div data-nav-theme="light" className="bg-white">
        <CaseContactCTA />
      </div>
    </>
  );
}
