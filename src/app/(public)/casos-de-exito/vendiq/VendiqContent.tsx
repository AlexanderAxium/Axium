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
 * Ficha de Vendiq con la narrativa de Brand Vision (ver case-story), con la marca
 * nueva de la web pública (la «línea técnica» del 2026-09-14, ya en vendiq.pe). Todo lo que se
 * ve de la web es captura real de vendiq.pe y de las tiendas de sus clientes
 * (Aurore, ANJ Sports, Sportt, Daesur Motors). El panel y la tienda de demostración
 * salen del repo local con el inquilino demo y la base local, como pidió Alexander
 * («vendiq no es solo la landing page»); el panel conserva su paleta anterior. La foto del
 * hero y las escenas de los dispositivos son de Higgsfield (solo ambiente), con las
 * capturas compuestas sobre la pantalla en verde.
 * Lo que depende del plan se dice con el plan (punto de venta, SUNAT, envíos e IA
 * desde Business; varios almacenes, dominio propio, idiomas y API en Business Pro).
 * Happy Art no aparece: la muestra la web de Vendiq, pero su tienda no está hecha con Vendiq.
 */

const IMG = "/images/proyects/vendiq";

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
  outcomeBullets: string[];
  alt: {
    mosaico: string;
    tipografia: string;
    paleta: string;
    landing: string;
    modulos: string;
    moviles: string;
    clientes: string;
    funciones: string;
    planes: string;
    panel: string;
    envios: string;
    celular: string;
  };
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    tagline:
      "Tienda online, punto de venta, inventario y facturación SUNAT en un solo sistema",
    meta: [
      ["Estado", "En producción"],
      ["Entregables", "Diseño de producto, web pública, plataforma SaaS"],
      ["Industria", "Comercio minorista y mayorista"],
      ["Plataforma", "Web (SaaS) multi-tenant"],
    ],
    statement:
      "Construimos la plataforma con la que un comercio del Perú vende en su web y en su local con el mismo catálogo, el mismo stock y sus comprobantes SUNAT.",
    context:
      "Vendiq es un producto propio de Axium para comercios que venden por internet y en mostrador. Cada tienda publica su web con su marca, cobra con las pasarelas que ya usan sus clientes y lleva inventario y facturación en el mismo panel, con un precio fijo al mes y sin comisión por venta.",
    highlightsTitle: ["Lo que", "construimos"],
    highlights: [
      {
        lead: "Tienda online",
        text: "catálogo con variantes y colecciones, carrito, checkout y cuenta de cliente, con el logo y los colores de cada marca.",
      },
      {
        lead: "Punto de venta",
        text: "cobro en el local con lector de códigos o la cámara del celular, descontando del mismo stock, desde el plan Business.",
      },
      {
        lead: "Inventario",
        text: "stock con kardex y órdenes de compra, y varios almacenes en Business Pro.",
      },
      {
        lead: "Facturación SUNAT",
        text: "boletas, facturas y notas de crédito emitidas desde el pedido con el certificado de cada comercio, desde el plan Business.",
      },
      {
        lead: "Cobros sin comisión",
        text: "Mercado Pago, Culqi, PayPal, transferencia y contra entrega; Vendiq no cobra por venta.",
      },
      {
        lead: "Envíos por distrito",
        text: "zonas con los distritos del Perú y tarifa plana, por peso, por monto o gratis, desde el plan Business.",
      },
      {
        lead: "Editor visual con IA",
        text: "la web se arma con bloques; desde Business, un asistente con Gemini propone una sección o una página con los productos y los colores de la tienda.",
      },
      {
        lead: "Fidelidad y API",
        text: "cupones, puntos, gift cards y aviso de carrito abandonado; dominio propio, cinco idiomas y API en Business Pro.",
      },
    ],
    challengeTitle: "Reto",
    challenge:
      "Un comercio pequeño suele vender con herramientas sueltas: una web para la tienda, un sistema para la caja, una hoja de cálculo para el stock, otro programa para las boletas y el chat para los pedidos. Cada venta se anota varias veces y el stock nunca coincide; las plataformas grandes, además, cobran comisión por cada venta.",
    approachTitle: "Enfoque",
    approach:
      "Diseñamos Vendiq alrededor de un solo catálogo: la tienda online, el punto de venta, el inventario y los comprobantes leen y descuentan de los mismos productos. La web pública lo cuenta con la interfaz dibujada sobre una rejilla técnica y un solo pedido: el cliente compra en la tienda, Vendiq descuenta el stock en web y local, y sale la boleta aceptada por SUNAT.",
    outcomesTitle: "Resultados",
    outcomes:
      "Vendiq está en producción en vendiq.pe: una perfumería de nicho, dos tiendas de tenis de mesa, un taller de aceites y una marca de productos de lavandería venden con él.",
    outcomeBullets: [
      "Tienda online, punto de venta, inventario y facturación SUNAT sobre un mismo catálogo",
      "Tres planes con precio fijo al mes y 0 % de comisión por venta",
      "Cobros con Mercado Pago, Culqi, PayPal, transferencia o contra entrega",
      "Tiendas en su propio dominio, como aurore.com.pe, anjsports.com y daesurmotors.com",
    ],
    alt: {
      mosaico:
        "Pantallas de vendiq.pe: portada, módulos, funciones, soluciones, precios y el asistente con IA",
      tipografia: "Tipografía de Vendiq: Satoshi con Geist Mono en los rótulos",
      paleta: "Paleta de Vendiq: grafito, azul de acción y la señal cian",
      landing:
        "vendiq.pe en una laptop y en el celular, sobre el mostrador de concreto de una tienda",
      modulos:
        "Los módulos de Vendiq con su interfaz dibujada: tienda online, punto de venta, inventario y facturación SUNAT",
      moviles: "vendiq.pe en el celular: módulos, cómo funciona y precios",
      clientes:
        "Tiendas hechas con Vendiq: Aurore, ANJ Sports, Sportt y Daesur Motors",
      funciones:
        "Cómo funciona Vendiq: la venta, el stock, la boleta y el envío salen del mismo pedido",
      planes: "Planes de Vendiq: Starter, Business y Business Pro",
      panel:
        "El panel de Vendiq: el catálogo de productos y el detalle de un pedido con su envío y su pago",
      envios:
        "Envíos en el panel: zonas de Lima y provincias con sus métodos y tarifas",
      celular:
        "El panel de Vendiq en el celular: la lista de pedidos y el detalle de un pedido",
    },
    nextTagline:
      "Una sola plataforma para todo lo que pasa en un centro deportivo",
  },
  en: {
    tagline:
      "Online store, point of sale, inventory and SUNAT invoicing in one system",
    meta: [
      ["Status", "In production"],
      ["Deliverables", "Product design, public website, SaaS platform"],
      ["Industry", "Retail and wholesale"],
      ["Platform", "Multi-tenant web (SaaS)"],
    ],
    statement:
      "We built the platform a Peruvian business uses to sell on its website and in its store with the same catalog, the same stock and its SUNAT receipts.",
    context:
      "Vendiq is Axium's own product for businesses that sell online and over the counter. Each store publishes its website under its own brand, takes payments through the gateways its customers already use, and keeps inventory and invoicing in the same dashboard, for a fixed monthly price and with no commission per sale.",
    highlightsTitle: ["What we", "built"],
    highlights: [
      {
        lead: "Online store",
        text: "a catalog with variants and collections, cart, checkout and customer accounts, with each brand's logo and colors.",
      },
      {
        lead: "Point of sale",
        text: "in-store checkout with a barcode scanner or the phone's camera, drawing from the same stock, from the Business plan.",
      },
      {
        lead: "Inventory",
        text: "stock with a kardex and purchase orders, plus multiple warehouses on Business Pro.",
      },
      {
        lead: "SUNAT invoicing",
        text: "receipts, invoices and credit notes issued from the order with each business's own certificate, from the Business plan.",
      },
      {
        lead: "No-commission payments",
        text: "Mercado Pago, Culqi, PayPal, bank transfer and cash on delivery; Vendiq takes nothing per sale.",
      },
      {
        lead: "Shipping by district",
        text: "zones built from Peru's districts with flat, weight-based, order-based or free rates, from the Business plan.",
      },
      {
        lead: "Visual editor with AI",
        text: "the website is built with blocks; from Business, an assistant powered by Gemini drafts a section or a page with the store's products and colors.",
      },
      {
        lead: "Loyalty and API",
        text: "coupons, points, gift cards and abandoned-cart emails; custom domain, five languages and an API on Business Pro.",
      },
    ],
    challengeTitle: "Challenge",
    challenge:
      "A small business usually sells with scattered tools: a website for the store, a system for the register, a spreadsheet for stock, another program for receipts and chat for orders. Every sale gets recorded several times and the stock never matches; on top of that, the big platforms take a commission on every sale.",
    approachTitle: "Approach",
    approach:
      "We designed Vendiq around a single catalog: the online store, the point of sale, inventory and receipts all read from and draw down the same products. The public website tells that story with the interface drawn over a technical grid and a single order: the customer buys in the store, Vendiq draws down stock online and in store, and the receipt comes out accepted by SUNAT.",
    outcomesTitle: "Outcomes",
    outcomes:
      "Vendiq is in production at vendiq.pe: a niche perfumery, two table tennis shops, a motor oil workshop and a laundry products brand sell with it.",
    outcomeBullets: [
      "Online store, point of sale, inventory and SUNAT invoicing on one shared catalog",
      "Three plans with a fixed monthly price and 0% commission per sale",
      "Payments with Mercado Pago, Culqi, PayPal, bank transfer or cash on delivery",
      "Stores on their own domains, such as aurore.com.pe, anjsports.com and daesurmotors.com",
    ],
    alt: {
      mosaico:
        "vendiq.pe screens: home, modules, features, solutions, pricing and the AI assistant",
      tipografia: "Vendiq typography: Satoshi with Geist Mono for labels",
      paleta: "Vendiq palette: graphite, action blue and the cyan signal",
      landing:
        "vendiq.pe on a laptop and a phone, on a store's concrete counter",
      modulos:
        "Vendiq modules with their drawn interface: online store, point of sale, inventory and SUNAT invoicing",
      moviles: "vendiq.pe on mobile: modules, how it works and pricing",
      clientes:
        "Stores built with Vendiq: Aurore, ANJ Sports, Sportt and Daesur Motors",
      funciones:
        "How Vendiq works: the sale, the stock, the receipt and the shipment come from the same order",
      planes: "Vendiq plans: Starter, Business and Business Pro",
      panel:
        "The Vendiq dashboard: the product catalog and an order's detail with its shipping and payment",
      envios:
        "Shipping in the dashboard: Lima and province zones with their methods and rates",
      celular:
        "The Vendiq dashboard on mobile: the order list and an order's detail",
    },
    nextTagline: "One platform for everything that happens at a sports center",
  },
  pt: {
    tagline:
      "Loja online, ponto de venda, estoque e faturamento SUNAT em um só sistema",
    meta: [
      ["Status", "Em produção"],
      ["Entregas", "Design de produto, site público, plataforma SaaS"],
      ["Setor", "Varejo e atacado"],
      ["Plataforma", "Web (SaaS) multi-tenant"],
    ],
    statement:
      "Construímos a plataforma com a qual um comércio do Peru vende no seu site e na sua loja com o mesmo catálogo, o mesmo estoque e os seus comprovantes SUNAT.",
    context:
      "O Vendiq é um produto próprio da Axium para comércios que vendem pela internet e no balcão. Cada loja publica seu site com sua marca, cobra com os meios de pagamento que seus clientes já usam e controla estoque e faturamento no mesmo painel, com um preço fixo por mês e sem comissão por venda.",
    highlightsTitle: ["O que", "construímos"],
    highlights: [
      {
        lead: "Loja online",
        text: "catálogo com variações e coleções, carrinho, checkout e conta de cliente, com o logo e as cores de cada marca.",
      },
      {
        lead: "Ponto de venda",
        text: "cobrança na loja com leitor de códigos ou a câmera do celular, descontando do mesmo estoque, a partir do plano Business.",
      },
      {
        lead: "Estoque",
        text: "estoque com kardex e ordens de compra, e vários armazéns no Business Pro.",
      },
      {
        lead: "Faturamento SUNAT",
        text: "boletas, faturas e notas de crédito emitidas a partir do pedido com o certificado de cada comércio, a partir do plano Business.",
      },
      {
        lead: "Cobranças sem comissão",
        text: "Mercado Pago, Culqi, PayPal, transferência e pagamento na entrega; o Vendiq não cobra por venda.",
      },
      {
        lead: "Entregas por distrito",
        text: "zonas com os distritos do Peru e tarifa fixa, por peso, por valor ou grátis, a partir do plano Business.",
      },
      {
        lead: "Editor visual com IA",
        text: "o site é montado com blocos; a partir do Business, um assistente com Gemini propõe uma seção ou uma página com os produtos e as cores da loja.",
      },
      {
        lead: "Fidelidade e API",
        text: "cupons, pontos, gift cards e aviso de carrinho abandonado; domínio próprio, cinco idiomas e API no Business Pro.",
      },
    ],
    challengeTitle: "Desafio",
    challenge:
      "Um comércio pequeno costuma vender com ferramentas soltas: um site para a loja, um sistema para o caixa, uma planilha para o estoque, outro programa para os comprovantes e o chat para os pedidos. Cada venda é anotada várias vezes e o estoque nunca bate; além disso, as grandes plataformas cobram comissão por cada venda.",
    approachTitle: "Abordagem",
    approach:
      "Desenhamos o Vendiq em torno de um único catálogo: a loja online, o ponto de venda, o estoque e os comprovantes leem e descontam dos mesmos produtos. O site público conta isso com a interface desenhada sobre uma grade técnica e um único pedido: o cliente compra na loja, o Vendiq desconta o estoque na web e na loja física, e sai a boleta aceita pela SUNAT.",
    outcomesTitle: "Resultados",
    outcomes:
      "O Vendiq está em produção em vendiq.pe: uma perfumaria de nicho, duas lojas de tênis de mesa, uma oficina de óleos e uma marca de produtos de lavanderia vendem com ele.",
    outcomeBullets: [
      "Loja online, ponto de venda, estoque e faturamento SUNAT sobre um mesmo catálogo",
      "Três planos com preço fixo por mês e 0 % de comissão por venda",
      "Cobranças com Mercado Pago, Culqi, PayPal, transferência ou pagamento na entrega",
      "Lojas no seu próprio domínio, como aurore.com.pe, anjsports.com e daesurmotors.com",
    ],
    alt: {
      mosaico:
        "Telas de vendiq.pe: início, módulos, recursos, soluções, preços e o assistente com IA",
      tipografia: "Tipografia do Vendiq: Satoshi com Geist Mono nos rótulos",
      paleta: "Paleta do Vendiq: grafite, azul de ação e o sinal ciano",
      landing:
        "vendiq.pe em um notebook e no celular, sobre o balcão de concreto de uma loja",
      modulos:
        "Os módulos do Vendiq com sua interface desenhada: loja online, ponto de venda, estoque e faturamento SUNAT",
      moviles: "vendiq.pe no celular: módulos, como funciona e preços",
      clientes:
        "Lojas feitas com o Vendiq: Aurore, ANJ Sports, Sportt e Daesur Motors",
      funciones:
        "Como o Vendiq funciona: a venda, o estoque, a boleta e o envio saem do mesmo pedido",
      planes: "Planos do Vendiq: Starter, Business e Business Pro",
      panel:
        "O painel do Vendiq: o catálogo de produtos e o detalhe de um pedido com seu envio e pagamento",
      envios:
        "Entregas no painel: zonas de Lima e das províncias com seus métodos e tarifas",
      celular:
        "O painel do Vendiq no celular: a lista de pedidos e o detalhe de um pedido",
    },
    nextTagline:
      "Uma só plataforma para tudo o que acontece em um centro esportivo",
  },
};

function bloques(c: Copy): StoryBlock[] {
  return [
    {
      kind: "wide",
      image: { src: `${IMG}/bv-mosaico.jpg`, alt: c.alt.mosaico },
    },
    { kind: "highlights", title: c.highlightsTitle, items: c.highlights },
    {
      kind: "pair",
      images: [
        { src: `${IMG}/bv-tipografia.jpg`, alt: c.alt.tipografia },
        { src: `${IMG}/bv-paleta.jpg`, alt: c.alt.paleta },
      ],
    },
    { kind: "text", title: c.challengeTitle, body: c.challenge },
    { kind: "text", title: c.approachTitle, body: c.approach },
    {
      kind: "wide",
      image: {
        src: `${IMG}/bv-landing-v2.jpg`,
        alt: c.alt.landing,
        mobileSrc: `${IMG}/bv-landing-v2-movil.jpg`,
      },
    },
    {
      kind: "pair",
      images: [
        { src: `${IMG}/bv-modulos.jpg`, alt: c.alt.modulos },
        { src: `${IMG}/bv-moviles.jpg`, alt: c.alt.moviles },
      ],
    },
    {
      kind: "text",
      id: "resultado",
      title: c.outcomesTitle,
      body: c.outcomes,
      bullets: c.outcomeBullets,
    },
    {
      kind: "wide",
      image: {
        src: `${IMG}/bv-panel.jpg`,
        alt: c.alt.panel,
        mobileSrc: `${IMG}/bv-panel-movil.jpg`,
      },
    },
    {
      kind: "pair",
      images: [
        { src: `${IMG}/bv-envios.jpg`, alt: c.alt.envios },
        { src: `${IMG}/bv-celular.jpg`, alt: c.alt.celular },
      ],
    },
    {
      kind: "wide",
      image: {
        src: `${IMG}/bv-clientes.jpg`,
        alt: c.alt.clientes,
        mobileSrc: `${IMG}/bv-clientes-movil.jpg`,
      },
    },
    {
      kind: "pair",
      images: [
        { src: `${IMG}/bv-funciones.jpg`, alt: c.alt.funciones },
        { src: `${IMG}/bv-planes.jpg`, alt: c.alt.planes },
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
      <CaseStory
        name="Vendiq"
        tagline={c.tagline}
        heroImage={`${IMG}/bv-hero.jpg`}
        heroPosition="70% 50%"
        logo={{
          src: "/images/highlights/logos/vendiq-v2.png",
          width: 694,
          height: 160,
        }}
        liveUrl="https://vendiq.pe"
        meta={c.meta}
        statement={c.statement}
        context={c.context}
        blocks={bloques(c)}
        // El caso anónimo «E-commerce & Inventory SaaS» describe el mismo producto
        hideCases={["store-saas"]}
        next={{
          name: "Rematch",
          tagline: c.nextTagline,
          href: "/casos-de-exito/rematch",
          image: "/images/proyects/rematch/rematch-portada-v3.jpg",
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
