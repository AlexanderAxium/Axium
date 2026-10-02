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
 * Ficha larga de Clefast (clefast.com.pe), detergentes ecológicos para
 * lavanderías industriales. Rehecha el 2026-10-01 sobre la ficha corta anterior.
 *
 * EL ALCANCE DICTA LA FORMA (ESTANDAR-FICHA §1). Aquí no hicimos identidad ni
 * aplicaciones: hicimos LA TIENDA, y la tienda es una reconstrucción completa
 * del sitio que Clefast ya tenía, levantada sobre Vendiq —el producto de
 * comercio de Axium— con su propio checkout. Por eso la ficha es un acto largo
 * (la tienda) más el capítulo de decisiones técnicas con sus dos láminas, que
 * es la forma que ANJ Sports y César Acosta ya usan para «solo la tienda, sobre
 * plataforma propia».
 *
 * EL SUJETO ES CLEFAST, NO VENDIQ. Que la tienda corra sobre nuestra plataforma
 * es verdad y es lo más distintivo del encargo, así que se cuenta —una vez en el
 * contexto y una vez en el acto— y nada más. Ni una pieza es del panel de
 * Vendiq, y ninguna repite las de su ficha.
 *
 * DE DÓNDE SALE CADA IMAGEN (ver ../../../../.claude/skills/portafolio-axium/
 * capturas-clientes/clefast/taller/):
 *   · Toda la interfaz es captura real de clefast.com.pe del 2026-10-01. Cero IA.
 *   · El checkout se recorrió con DATOS DE DEMOSTRACIÓN («Demostración Clefast»,
 *     «Av. Demostración 100», demo@clefast.test). Ningún dato de un cliente real.
 *   · Las dos láminas son HTML/CSS renderizado con Playwright, cero créditos, y
 *     cada cifra está medida: las tarifas contra
 *     clefast.com.pe/api/z/shipping/methods el 1-10-2026, y el inventario contra
 *     la API pública de la tienda y el informe de baja del gestor anterior.
 *   · El héroe y la fotografía de producto son material publicado por Clefast.
 *
 * ⚠ `results` va VACÍO a propósito. Las cifras que traía la ficha vieja
 * («100 % presencia digital», «50 % más consultas», «24/7») no las midió nadie.
 * Igual que en Feniz e Inner Soul: la prueba es el inventario de lo construido.
 */

const IMG = "/images/proyects/clefast";

type Copy = {
  tagline: string;
  meta: [string, string][];
  statement: string;
  context: string;
  highlightsTitle: [string, string];
  highlights: { lead: string; text: string }[];
  challengeTitle: string;
  challenge: string;
  acto: { index: string; title: [string, string]; body: string };
  distritoTitle: string;
  distrito: string;
  outcomesTitle: string;
  outcomes: string;
  stackTitle: string;
  stack: string[];
  leads: { tienda: string; inventario: string; envio: string };
  pies: {
    tienda: string;
    catalogo: string;
    ficha: string;
    inventario: string;
    distrito: string;
    resumen: string;
    celular: string;
    chat: string;
    envio: string;
  };
  alt: {
    tienda: string;
    catalogo: string;
    ficha: string;
    inventario: string;
    distrito: string;
    resumen: string;
    celular: string;
    chat: string;
    envio: string;
  };
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    tagline:
      "Una tienda de detergentes para lavanderías industriales, rehecha entera sobre nuestra plataforma de comercio",
    meta: [
      ["Estado", "En producción"],
      ["Entregables", "Tienda online, checkout propio, chat de atención"],
      ["Industria", "Detergentes ecológicos para lavandería industrial"],
      ["Plataforma", "Web (tienda) sobre Vendiq"],
    ],
    statement:
      "La tienda de Clefast se rehízo entera sobre Vendiq, el producto de comercio de Axium, sin perder un registro del catálogo que ya tenía.",
    context:
      "Clefast fabrica detergentes ecológicos para lavanderías, hoteles y clínicas del Perú. Su tienda vivía en un gestor a medida que ya no se mantenía: se reconstruyó pieza por pieza sobre nuestra plataforma, en su mismo dominio y con su mismo catálogo.",
    highlightsTitle: ["Lo que", "hicimos"],
    highlights: [
      {
        lead: "El catálogo entero",
        text: "35 productos en once categorías y 205 presentaciones, de 100 ml a 200 kg.",
      },
      {
        lead: "Checkout propio",
        text: "carrito, datos, envío y pago en cuatro pasos, sin salir del dominio.",
      },
      {
        lead: "Envío por dirección",
        text: "la tarifa sale del distrito del comprador, no de una lista de ocho zonas.",
      },
      {
        lead: "Distritos homónimos",
        text: "el selector dice de qué provincia es cada distrito: en Lima hay dos Miraflores.",
      },
      {
        lead: "Chat de atención",
        text: "mensajes con listas y negritas reales, y un candado contra el doble envío.",
      },
      {
        lead: "Móvil medido",
        text: "las diecinueve rutas de la tienda, revisadas a 360 px y sin desborde.",
      },
    ],
    challengeTitle: "Reto",
    challenge:
      "El selector de distritos aplana en una sola lista los 172 distritos de las diez provincias del departamento de Lima. Ahí conviven dos Miraflores y dos San Luis, y «Surco» está a sesenta kilómetros de «Santiago de Surco»: elegir el equivocado cuesta plata.",
    acto: {
      index: "Acto 01",
      title: ["El checkout,", "de punta a punta"],
      body: "Carrito, información, envío y pago sin salir de clefast.com.pe. El ubigeo va encadenado, el país viene elegido porque solo hay uno, y la tarjeta se tokeniza en el navegador. Todo lo que sigue es captura real, con datos de demostración.",
    },
    distritoTitle: "Un distrito no es un nombre",
    distrito:
      "Los nombres repetidos se ofrecen calificados —«Miraflores (Lima)»— y ese texto es el que viaja al cotizar. La zona se empareja comparando la provincia solo cuando los dos lados la declaran, así que ninguna dirección ya guardada cambia de tarifa.",
    outcomesTitle: "Lo entregado",
    outcomes:
      "clefast.com.pe está en producción con 35 productos, 205 presentaciones, checkout propio, chat y envíos a todo el Perú. No publicamos cifras de venta: no tenemos su analítica.",
    stackTitle: "Disciplinas y tecnología",
    stack: [
      "Diseño UX/UI",
      "Desarrollo web",
      "Comercio electrónico",
      "Migración de contenido",
      "SEO técnico",
      "Accesibilidad",
      "Vendiq",
      "site-builder-core",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "TanStack Query",
      "Radix UI",
      "Framer Motion",
      "PostgreSQL",
    ],
    leads: {
      tienda:
        "La portada la arma Clefast desde su panel, y el catálogo llega al navegador ya renderizado.",
      inventario:
        "El gestor anterior se apagó solo cuando el inventario cuadró registro por registro.",
      envio:
        "La tarifa no sale de una lista: sale de la dirección, y se vuelve a cotizar en cuanto cambia el distrito.",
    },
    pies: {
      tienda: "clefast.com.pe — la portada, con el carrusel del catálogo.",
      catalogo:
        "clefast.com.pe/productos — once categorías, rango de precio y presentaciones.",
      ficha:
        "clefast.com.pe/producto/detergente-enzimatico-nueva-formula — una ficha, cinco presentaciones.",
      inventario:
        "El inventario, medido contra la API de la tienda; a la derecha, el envase de 200 kg.",
      distrito:
        "El paso de información del checkout, con datos de demostración.",
      resumen:
        "El paso de envío: la tarifa de la zona, ya sumada en el resumen del pedido.",
      celular:
        "La ficha de producto en el celular: la portada del producto y, debajo, la descripción con las cinco presentaciones.",
      chat: "El chat en vivo y WhatsApp en un solo panel, sin un segundo botón flotando.",
      envio:
        "Ocho direcciones medidas contra la tienda en producción el 1 de octubre de 2026.",
    },
    alt: {
      tienda:
        "La portada de clefast.com.pe con el carrusel de productos en una ventana de navegador",
      catalogo:
        "El catálogo de clefast.com.pe con su panel de filtros: categorías, rango de precio y presentaciones",
      ficha:
        "La ficha de producto de clefast.com.pe con sus cinco presentaciones, de 4 a 200 kg",
      inventario:
        "El inventario migrado —35 productos, 11 categorías, 205 presentaciones, cero pérdidas— junto al envase de 200 kg de Clefast",
      distrito:
        "El selector de distritos del checkout mostrando Miraflores (Lima) y Miraflores (Yauyos)",
      resumen:
        "El paso de envío del checkout con la tarifa de la zona sumada en el resumen del pedido",
      celular:
        "clefast.com.pe en el celular, en la ficha de producto, con sus cinco presentaciones",
      chat: "El chat en vivo de clefast.com.pe abierto en el celular, con el paso a WhatsApp",
      envio:
        "Lámina de tarifas: ocho direcciones y la zona de envío que devuelve la tienda para cada una",
    },
    nextTagline:
      "Marca, aplicaciones y tienda de una perfumería que se recorre por casa, por nota y por ocasión",
  },
  en: {
    tagline:
      "A detergent store for industrial laundries, rebuilt from scratch on our own commerce platform",
    meta: [
      ["Status", "In production"],
      ["Deliverables", "Online store, custom checkout, support chat"],
      ["Industry", "Eco-friendly detergents for industrial laundry"],
      ["Platform", "Web (store) on Vendiq"],
    ],
    statement:
      "Clefast's store was rebuilt in full on Vendiq, Axium's commerce product, without losing a single record of the catalogue it already had.",
    context:
      "Clefast makes eco-friendly detergents for laundries, hotels and clinics across Peru. Its store ran on a bespoke CMS that was no longer maintained: it was rebuilt piece by piece on our platform, on the same domain and with the same catalogue.",
    highlightsTitle: ["What we", "made"],
    highlights: [
      {
        lead: "The whole catalogue",
        text: "35 products in eleven categories and 205 sizes, from 100 ml to 200 kg.",
      },
      {
        lead: "Custom checkout",
        text: "cart, details, shipping and payment in four steps, without leaving the domain.",
      },
      {
        lead: "Shipping by address",
        text: "the rate comes from the buyer's district, not from a list of eight zones.",
      },
      {
        lead: "Districts that share a name",
        text: "the selector states each district's province: Lima has two Miraflores.",
      },
      {
        lead: "Support chat",
        text: "messages with real lists and bold, and a lock against double sending.",
      },
      {
        lead: "Mobile, measured",
        text: "the store's nineteen routes, checked at 360 px with no overflow.",
      },
    ],
    challengeTitle: "Challenge",
    challenge:
      "The district selector flattens the 172 districts of Lima's ten provinces into one list. Two Miraflores and two San Luis live in it, and «Surco» is sixty kilometres from «Santiago de Surco»: picking the wrong one costs money.",
    acto: {
      index: "Act 01",
      title: ["The checkout,", "end to end"],
      body: "Cart, details, shipping and payment without leaving clefast.com.pe. The geography is chained, the country comes preselected because there is only one, and the card is tokenised in the browser. Everything that follows is a real screenshot with demo data.",
    },
    distritoTitle: "A district is not a name",
    distrito:
      "Repeated names are offered qualified — «Miraflores (Lima)» — and that text is what travels when the rate is quoted. The zone matcher compares the province only when both sides declare it, so no saved address changes its rate.",
    outcomesTitle: "What was delivered",
    outcomes:
      "clefast.com.pe is live with 35 products, 205 sizes, its own checkout, chat and shipping across Peru. We publish no sales figures: we do not have their analytics.",
    stackTitle: "Disciplines and technology",
    stack: [
      "UX/UI design",
      "Web development",
      "E-commerce",
      "Content migration",
      "Technical SEO",
      "Accessibility",
      "Vendiq",
      "site-builder-core",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "TanStack Query",
      "Radix UI",
      "Framer Motion",
      "PostgreSQL",
    ],
    leads: {
      tienda:
        "Clefast builds the home page from its own panel, and the catalogue reaches the browser already rendered.",
      inventario:
        "The old CMS was switched off only once the inventory matched record by record.",
      envio:
        "The rate does not come from a list: it comes from the address, and it is quoted again the moment the district changes.",
    },
    pies: {
      tienda: "clefast.com.pe — the home page, with the catalogue carousel.",
      catalogo:
        "clefast.com.pe/productos — eleven categories, price range and sizes.",
      ficha:
        "clefast.com.pe/producto/detergente-enzimatico-nueva-formula — one page, five sizes.",
      inventario:
        "The inventory, measured against the store's API; on the right, the 200 kg drum.",
      distrito: "The checkout's details step, with demo data.",
      resumen:
        "The shipping step: the zone's rate, already added to the order summary.",
      celular:
        "The product page on the phone: the product header and, below it, the description with the five sizes.",
      chat: "Live chat and WhatsApp in a single panel, with no second floating button.",
      envio:
        "Eight addresses measured against the live store on 1 October 2026.",
    },
    alt: {
      tienda:
        "The clefast.com.pe home page with the product carousel in a browser window",
      catalogo:
        "The clefast.com.pe catalogue with its filter panel: categories, price range and sizes",
      ficha:
        "The clefast.com.pe product page with its five sizes, from 4 to 200 kg",
      inventario:
        "The migrated inventory —35 products, 11 categories, 205 sizes, zero losses— next to Clefast's 200 kg drum",
      distrito:
        "The checkout's district selector showing Miraflores (Lima) and Miraflores (Yauyos)",
      resumen:
        "The checkout's shipping step with the zone rate added to the order summary",
      celular:
        "clefast.com.pe on a phone, on the product page, with its five sizes",
      chat: "The clefast.com.pe live chat open on the phone, with the step to WhatsApp",
      envio:
        "Rate plate: eight addresses and the shipping zone the store returns for each one",
    },
    nextTagline:
      "Brand, applications and store for a perfumery browsed by house, by note and by occasion",
  },
  pt: {
    tagline:
      "Uma loja de detergentes para lavanderias industriais, refeita inteira sobre a nossa plataforma de comércio",
    meta: [
      ["Estado", "Em produção"],
      ["Entregas", "Loja online, checkout próprio, chat de atendimento"],
      ["Indústria", "Detergentes ecológicos para lavanderia industrial"],
      ["Plataforma", "Web (loja) sobre o Vendiq"],
    ],
    statement:
      "A loja da Clefast foi refeita inteira sobre o Vendiq, o produto de comércio da Axium, sem perder um registro do catálogo que já tinha.",
    context:
      "A Clefast fabrica detergentes ecológicos para lavanderias, hotéis e clínicas do Peru. A sua loja vivia num gestor sob medida que já não era mantido: foi reconstruída peça por peça sobre a nossa plataforma, no mesmo domínio e com o mesmo catálogo.",
    highlightsTitle: ["O que", "fizemos"],
    highlights: [
      {
        lead: "O catálogo inteiro",
        text: "35 produtos em onze categorias e 205 apresentações, de 100 ml a 200 kg.",
      },
      {
        lead: "Checkout próprio",
        text: "carrinho, dados, frete e pagamento em quatro passos, sem sair do domínio.",
      },
      {
        lead: "Frete pelo endereço",
        text: "a tarifa sai do distrito do comprador, não de uma lista de oito zonas.",
      },
      {
        lead: "Distritos homônimos",
        text: "o seletor diz de que província é cada distrito: em Lima há dois Miraflores.",
      },
      {
        lead: "Chat de atendimento",
        text: "mensagens com listas e negritos reais, e uma trava contra o envio duplo.",
      },
      {
        lead: "Celular medido",
        text: "as dezenove rotas da loja, revisadas a 360 px e sem transbordo.",
      },
    ],
    challengeTitle: "Desafio",
    challenge:
      "O seletor de distritos achata numa só lista os 172 distritos das dez províncias do departamento de Lima. Ali convivem dois Miraflores e dois San Luis, e «Surco» fica a sessenta quilômetros de «Santiago de Surco»: escolher errado custa dinheiro.",
    acto: {
      index: "Ato 01",
      title: ["O checkout,", "de ponta a ponta"],
      body: "Carrinho, informação, frete e pagamento sem sair de clefast.com.pe. A geografia vai encadeada, o país já vem escolhido porque só há um, e o cartão é tokenizado no navegador. Tudo o que segue é captura real, com dados de demonstração.",
    },
    distritoTitle: "Um distrito não é um nome",
    distrito:
      "Os nomes repetidos são oferecidos qualificados — «Miraflores (Lima)» — e é esse texto que viaja ao cotar. A zona é emparelhada comparando a província só quando os dois lados a declaram, assim nenhum endereço já salvo muda de tarifa.",
    outcomesTitle: "O que foi entregue",
    outcomes:
      "clefast.com.pe está em produção com 35 produtos, 205 apresentações, checkout próprio, chat e envios para todo o Peru. Não publicamos números de venda: não temos a analítica deles.",
    stackTitle: "Disciplinas e tecnologia",
    stack: [
      "Design UX/UI",
      "Desenvolvimento web",
      "Comércio eletrônico",
      "Migração de conteúdo",
      "SEO técnico",
      "Acessibilidade",
      "Vendiq",
      "site-builder-core",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "TanStack Query",
      "Radix UI",
      "Framer Motion",
      "PostgreSQL",
    ],
    leads: {
      tienda:
        "A Clefast monta a capa a partir do seu painel, e o catálogo chega ao navegador já renderizado.",
      inventario:
        "O gestor anterior só foi desligado quando o inventário bateu registro por registro.",
      envio:
        "A tarifa não sai de uma lista: sai do endereço, e é cotada de novo assim que o distrito muda.",
    },
    pies: {
      tienda: "clefast.com.pe — a capa, com o carrossel do catálogo.",
      catalogo:
        "clefast.com.pe/productos — onze categorias, faixa de preço e apresentações.",
      ficha:
        "clefast.com.pe/producto/detergente-enzimatico-nueva-formula — uma página, cinco apresentações.",
      inventario:
        "O inventário, medido contra a API da loja; à direita, a bombona de 200 kg.",
      distrito: "O passo de informação do checkout, com dados de demonstração.",
      resumen:
        "O passo de frete: a tarifa da zona, já somada no resumo do pedido.",
      celular:
        "A página de produto no celular: a capa do produto e, abaixo, a descrição com as cinco apresentações.",
      chat: "O chat ao vivo e o WhatsApp num só painel, sem um segundo botão flutuando.",
      envio:
        "Oito endereços medidos contra a loja em produção em 1 de outubro de 2026.",
    },
    alt: {
      tienda:
        "A capa de clefast.com.pe com o carrossel de produtos numa janela de navegador",
      catalogo:
        "O catálogo de clefast.com.pe com o seu painel de filtros: categorias, faixa de preço e apresentações",
      ficha:
        "A página de produto de clefast.com.pe com as suas cinco apresentações, de 4 a 200 kg",
      inventario:
        "O inventário migrado —35 produtos, 11 categorias, 205 apresentações, zero perdas— junto à bombona de 200 kg da Clefast",
      distrito:
        "O seletor de distritos do checkout mostrando Miraflores (Lima) e Miraflores (Yauyos)",
      resumen:
        "O passo de frete do checkout com a tarifa da zona somada no resumo do pedido",
      celular:
        "clefast.com.pe no celular, na página de produto, com as suas cinco apresentações",
      chat: "O chat ao vivo de clefast.com.pe aberto no celular, com a passagem para o WhatsApp",
      envio:
        "Lâmina de tarifas: oito endereços e a zona de frete que a loja devolve para cada um",
    },
    nextTagline:
      "Marca, aplicações e loja de uma perfumaria percorrida por casa, por nota e por ocasião",
  },
};

/**
 * Doce bloques. Cada bloque de texto va SOLO entre dos imágenes (el tramo sin
 * imagen más largo es `highlights`, 650 px), hay tres `pair`, y «Lo entregado»
 * va delante de la última ancha, que es la lámina de tarifas: cierra probando
 * lo que el texto acaba de decir.
 */
function bloques(c: Copy, lang: StoryLang): StoryBlock[] {
  return [
    // La tienda, antes que nada: es lo principal del encargo.
    {
      kind: "wide",
      lead: c.leads.tienda,
      image: {
        src: `${IMG}/cf-tienda.jpg`,
        alt: c.alt.tienda,
        caption: c.pies.tienda,
        mobileSrc: `${IMG}/cf-tienda-movil.jpg`,
      },
    },
    { kind: "highlights", title: c.highlightsTitle, items: c.highlights },
    // Cómo se encuentra un producto y cómo se elige su formato.
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/cf-catalogo.jpg`,
          alt: c.alt.catalogo,
          caption: c.pies.catalogo,
        },
        { src: `${IMG}/cf-ficha.jpg`, alt: c.alt.ficha, caption: c.pies.ficha },
      ],
    },
    { kind: "text", title: c.challengeTitle, body: c.challenge },
    // Losa partida (R28): a la izquierda la mudanza contrastada, a la derecha
    // el producto grande sobre un suelo oscuro. Ver el taller para el porqué.
    {
      kind: "wide",
      lead: c.leads.inventario,
      image: {
        src: `${IMG}/cf-mudanza-${lang}.jpg`,
        alt: c.alt.inventario,
        caption: c.pies.inventario,
        mobileSrc: `${IMG}/cf-mudanza-movil-${lang}.jpg`,
      },
    },
    // ── ACTO 01 · EL CHECKOUT (capítulo oscuro: su par y su lámina van en tinta)
    {
      kind: "act",
      index: c.acto.index,
      title: c.acto.title,
      body: c.acto.body,
    },
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/cf-distrito.jpg`,
          alt: c.alt.distrito,
          caption: c.pies.distrito,
        },
        {
          src: `${IMG}/cf-resumen.jpg`,
          alt: c.alt.resumen,
          caption: c.pies.resumen,
        },
      ],
    },
    // El capítulo de decisión técnica, detrás de la pieza que lo enseña.
    { kind: "text", title: c.distritoTitle, body: c.distrito },
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/cf-celular.jpg`,
          alt: c.alt.celular,
          caption: c.pies.celular,
        },
        { src: `${IMG}/cf-chat.jpg`, alt: c.alt.chat, caption: c.pies.chat },
      ],
    },
    // «Lo entregado» delante de la última ancha: el cierre no son dos textos.
    { kind: "text", id: "resultado", title: c.outcomesTitle, body: c.outcomes },
    {
      kind: "wide",
      lead: c.leads.envio,
      image: {
        src: `${IMG}/cf-envio-${lang}.jpg`,
        alt: c.alt.envio,
        caption: c.pies.envio,
        mobileSrc: `${IMG}/cf-envio-movil-${lang}.jpg`,
      },
    },
    { kind: "tags", title: c.stackTitle, items: c.stack },
  ];
}

export default function ClefastContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseStory
        /*
         * El acento es de la marca del cliente, no de Axium. Los dos valores son
         * los tokens que sirve su propio tema (--gc-secondary y --gc-primary):
         * base 5,48:1 sobre blanco · dark 7,15:1 sobre la tinta #060C20.
         */
        accent={{ base: "#0B7A2C", dark: "#17B544", deep: "#06351A" }}
        name="Clefast"
        tagline={c.tagline}
        heroImage={`${IMG}/cf-hero.jpg`}
        heroPosition="58% 56%"
        logo={{ src: `${IMG}/cf-logo.png`, width: 648, height: 762 }}
        liveUrl="https://clefast.com.pe"
        meta={c.meta}
        statement={c.statement}
        context={c.context}
        blocks={bloques(c, lang)}
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
