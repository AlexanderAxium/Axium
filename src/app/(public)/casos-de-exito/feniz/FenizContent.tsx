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
 * Ficha de Feniz, REHECHA (2026-10-07) al molde de producto (Pixelmatters) con la mezcla de
 * Paisanos. Alexander: «sigue con feniz, haz un rediseño total como las referencias de
 * paisanos» (Brubank: «me encanta que combine mockups con personas reales, con animaciones y
 * videos, elementos flotantes, degradados»). Antes era una ficha de Brand Vision (CaseStory)
 * con un escritorio vacío de héroe y aparatos planos.
 *
 * ── LAS CAPAS DE PAISANOS, UNA POR UNA ─────────────────────────────────────────────
 *  · Persona con el producto: el héroe es un trader al amanecer con el panel de Feniz en la
 *    laptop (escena de OpenAI con la pantalla apagada + la captura real compuesta con las
 *    esquinas de la tapa medidas a mano, componer-escena.py --quad --bisel).
 *  · Persona + UI flotante (R28): una mujer mirando el celular de noche y, a su lado, tres
 *    tarjetas REALES del panel en vidrio (P&L, la conexión FTMO → Tickmill, el win rate). La
 *    foto es de STOCK, no generada (Unsplash, Olena Kamenetska; licencia Unsplash): Alexander,
 *    «a veces es un poco notorio que una persona es hecha por IA… usar imágenes de stock».
 *  · El viaje de una operación, animado: el JSON que arma el EA (campos y mensajes del registro
 *    copiados de src/lib/mt5-ea-template.ts), el pulso del POST, el HTTP 200 de vuelta y la fila
 *    entrando en la tabla real del panel, cada cinco segundos. Sustituye al diagrama de
 *    arquitectura (Alexander: «innecesario, cámbialo por algo más genial»). taller/flujo/.
 *  · Degradado de la marca + elementos flotantes + vídeo: sistemafeniz.com en una ventana y el
 *    panel en un celular bajando a la vez sobre el azul y el oro de Feniz, con dos tarjetas
 *    reales flotando (scripts/video-flotantes.py, desde capturas de página completa).
 *  · El objeto de marca en 3D (R29): el isotipo construido en Three.js con su geometría exacta
 *    (medida sobre el PNG: radios, nodos y las tres velas), en oro, oscilando en bucle. No se
 *    le pidió a un modelo de imagen: habría cambiado el número de velas o la forma de la órbita.
 *  · Las tarjetas sueltas (conexión, planes) flotan sobre el mismo degradado, como la UI de
 *    Brubank sobre su morado.
 *  Taller: portafolio-axium/capturas-clientes/feniz/paisanos-2026-10/ (COMPOSITOR.md,
 *  decimoquinta generación).
 *
 * ── DE DÓNDE SALE CADA COSA ────────────────────────────────────────────────────────
 *  · Toda la interfaz es captura real. El sitio público, de sistemafeniz.com en vivo; el área
 *    privada, de la app del repo levantada en local (2026-09-30) contra un volcado ANONIMIZADO:
 *    nombres, correos, fechas, números de cuenta y saldos son de demostración. Ningún dato de
 *    un cliente de Feniz sale en la ficha.
 *  · Los precios de sistemafeniz.com siguen sin cargar en vivo («No se pudieron cargar los
 *    precios», medido el 2026-10-07): la ventana del vídeo frena antes de esa sección. Los
 *    planes que se enseñan son los del área del trader.
 *  · Se queda de la ficha anterior la lámina del código del EA (el archivo que genera
 *    src/lib/mt5-ea-template.ts). Las reglas de las propfirms y la tabla de símbolos se
 *    REHICIERON (las de crema con tablas: «también feas esas imágenes, busca un mejor diseño
 *    inspirado en las referencias»): tarjetas que flotan sobre la marca, con las MISMAS cifras
 *    medidas en la base. taller/laminas/.
 *  · El trader del héroe es una escena generada (de espaldas y de perfil); la mujer del
 *    celular, una foto de stock. Ninguna se presenta como cliente de Feniz.
 *
 * ── UNA PRECISIÓN HONRADA SOBRE EL EA ───────────────────────────────────────────────
 * El generador del Expert Advisor, las claves API y el webhook están construidos y el endpoint
 * responde en producción. La pantalla que entrega el archivo al trader (MT5ImportSection) vive
 * en el repo pero hoy no está montada en `main` (commit 9a89288). Por eso el EA se enseña por su
 * CÓDIGO y por su ARQUITECTURA, y no se inventa una pantalla que hoy no se puede capturar.
 *
 * `cita` no va: Feniz no nos ha dado un testimonio. Las cifras del resultado son del código, no
 * de uso: su analítica no es nuestra.
 */

const IMG = "/images/proyects/feniz";

type Copy = {
  titulo: string;
  heroeAlt: string;
  meta: CaseProductoProps["meta"];
  contexto: [string, string];
  reto: [string, string];
  puente: [string, string];
  trader: [string, string];
  dominio: [string, string];
  oro: string;
  piesPar: [string, string];
  piesDominio: [string, string];
  mandos: { anterior: string; siguiente: string };
  alt: Record<
    | "sitioPanel"
    | "ea"
    | "viaje"
    | "r28"
    | "conexion"
    | "planes"
    | "reglas"
    | "simbolos"
    | "isotipo",
    string
  >;
  cta: CaseProductoProps["cta"];
  resultado: CaseProductoProps["resultado"];
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    titulo:
      "El producto entero de una plataforma para traders de cuentas de fondeo",
    heroeAlt:
      "Al amanecer, un trader revisa en su laptop el panel de Feniz: balance, resultado, conexiones y últimos movimientos",
    meta: {
      tipologia: ["Tipología", ["Web app", "Fintech", "MetaTrader 5"]],
      industria: ["Industria", "Trading de cuentas de fondeo"],
      anio: ["Año", "2025–2026"],
      servicios: [
        "Servicios",
        [
          "Diseño de producto",
          "Desarrollo web",
          "Autenticación y correo",
          "Integración con MetaTrader 5",
          "Cobros con Paddle y MercadoPago",
        ],
      ],
      entregables: [
        "Entregables",
        [
          "sistemafeniz.com",
          "Área del trader",
          "Panel de administración",
          "Expert Advisor en MQL5",
        ],
      ],
      vivo: ["En vivo", "sistemafeniz.com", "https://sistemafeniz.com"],
    },
    contexto: [
      "Contexto",
      "Un trader de fondeo opera la cuenta de una propfirm y, en paralelo, la suya en un bróker. Llevaba las dos a mano, en planillas. A Feniz le construimos el producto entero para unirlas: sitio, alta, área del trader y panel.",
    ],
    reto: [
      "El reto",
      "Lo difícil no era el panel: era traer las operaciones. MetaTrader 5 no expone una API hacia fuera y copiarlas a mano mata el producto. Había que escribir el programa que las exporta, y uno distinto por trader.",
    ],
    puente: [
      "El puente con MetaTrader 5",
      "Feniz escribe un Expert Advisor para cada trader: 519 líneas de MQL5 con su webhook, su clave, su cuenta y su conexión dentro. Se instala en MetaTrader 5 y manda las operaciones cada cinco segundos.",
    ],
    trader: [
      "Lo que ve el trader",
      "Del otro lado, el trader ve balance, resultado y aciertos sin abrir una planilla, y enlaza en dos pasos su cuenta de propfirm con la de su bróker. Tres planes, con cobro por Paddle o MercadoPago.",
    ],
    dominio: [
      "El dominio que había que codificar",
      "Un panel de trading se escribe en una semana; lo que cuesta es el reglamento. Cada propfirm tiene fases, objetivos y límites de pérdida propios, y el mismo símbolo no cuesta igual en la propfirm que en el bróker.",
    ],
    oro: "Un solo oro, del isotipo al último botón: el producto lo guarda en un token, --color-primary (#F5BB32), y de ahí salen acentos, botones y estados del sitio y del panel. Aquí, el isotipo en volumen, con su geometría exacta.",
    piesPar: [
      "Nueva conexión: cuenta propfirm (origen) y cuenta bróker (destino) · datos de demostración",
      "Los tres planes del área del trader · precios reales",
    ],
    piesDominio: [
      "Las reglas de tres propfirms, medidas en la base",
      "El mismo EURUSD en FTMO y en Tickmill",
    ],
    mandos: { anterior: "Anterior", siguiente: "Siguiente" },
    alt: {
      sitioPanel:
        "sistemafeniz.com en una ventana y el panel del trader en un celular, bajando a la vez sobre el azul y el oro de Feniz, con dos tarjetas reales flotando: balance total y rendimiento de hoy",
      ea: "Código MQL5 del Expert Advisor que Feniz genera para cada trader",
      viaje:
        "Animación del viaje de una operación: el Expert Advisor arma en MetaTrader 5 el JSON de la operación cerrada, lo envía por POST a Feniz, recibe HTTP 200 y la fila entra en «Últimos movimientos» del área del trader, cada cinco segundos · datos de demostración",
      r28: "Una mujer con chaqueta azul mira su celular de noche en la ciudad; flotan a su lado tres tarjetas reales del panel de Feniz: P&L total +$1,240, la conexión FTMO → Tickmill activa y un win rate de 75 %",
      conexion:
        "El asistente de nueva conexión de Feniz: FTMO Challenge 25K como origen y Tickmill Raw como destino, y debajo la conexión ya activa",
      planes:
        "Los tres planes del área del trader de Feniz: mensual a $99, anual a $699 y Enterprise a $1499",
      reglas:
        "Tres tarjetas en abanico con el reglamento de MyForexFunds, FTMO y The Funded Trader: objetivo, pérdida diaria y pérdida total, y debajo las fases Challenge, Verification y Funded",
      simbolos:
        "El mismo EURUSD a los dos lados: 3,00 USD de comisión por lote en FTMO y 5,70 USD en Tickmill, con el valor del pip, los ticks y el spread debajo",
      isotipo:
        "El isotipo de Feniz, una órbita con tres velas, en oro y en volumen, oscilando sobre azul marino",
    },
    cta: {
      titulo: "¿Tienes un producto en mente?",
      texto:
        "Lo diseñamos y lo construimos contigo, de la primera pantalla a producción, como hicimos con Feniz.",
      boton: "Hablemos",
      href: "#contacto",
    },
    resultado: {
      titulo: "Lo entregado",
      texto:
        "Feniz está en línea en sistemafeniz.com con su sitio, su alta, su área de trader y su panel. No publicamos cifras de uso: su analítica no es nuestra.",
      cifras: [
        {
          valor: "519",
          texto: "líneas de MQL5 en el Expert Advisor que se genera por trader",
        },
        {
          valor: "5 s",
          texto: "entre envío y envío de operaciones desde MetaTrader 5",
        },
        {
          valor: "48",
          texto: "permisos sobre once recursos, repartidos en cinco roles",
        },
      ],
    },
    nextTagline: "Reservas, agenda y cobros en la web de cada negocio",
  },

  en: {
    titulo: "The whole product of a platform for funded-account traders",
    heroeAlt:
      "At dawn, a trader checks the Feniz panel on a laptop: balance, result, links and latest movements",
    meta: {
      tipologia: ["Typology", ["Web app", "Fintech", "MetaTrader 5"]],
      industria: ["Industry", "Funded-account trading"],
      anio: ["Year", "2025–2026"],
      servicios: [
        "Services",
        [
          "Product design",
          "Web development",
          "Authentication and email",
          "MetaTrader 5 integration",
          "Payments with Paddle and MercadoPago",
        ],
      ],
      entregables: [
        "Deliverables",
        [
          "sistemafeniz.com",
          "Trader area",
          "Admin panel",
          "MQL5 Expert Advisor",
        ],
      ],
      vivo: ["Live", "sistemafeniz.com", "https://sistemafeniz.com"],
    },
    contexto: [
      "Context",
      "A funded trader runs a propfirm account and, in parallel, their own at a broker. They kept both by hand, in spreadsheets. We built Feniz's whole product to join them: website, sign-up, trader area and panel.",
    ],
    reto: [
      "The challenge",
      "The hard part was not the panel: it was getting the trades in. MetaTrader 5 exposes no outbound API, and copying them by hand kills the product. Someone had to write the exporter, and a different one per trader.",
    ],
    puente: [
      "The bridge to MetaTrader 5",
      "Feniz writes an Expert Advisor for each trader: 519 lines of MQL5 carrying their webhook, their key, their account and their link inside. It is installed in MetaTrader 5 and posts trades every five seconds.",
    ],
    trader: [
      "What the trader sees",
      "On the other side, the trader sees balance, result and hit rate without opening a spreadsheet, and links their propfirm account to their broker account in two steps. Three plans, paid through Paddle or MercadoPago.",
    ],
    dominio: [
      "The domain that had to be encoded",
      "A trading panel takes a week; the rulebook is what costs. Every propfirm has its own phases, targets and loss limits, and the same symbol does not cost the same at the propfirm as at the broker.",
    ],
    oro: "One gold, from the logo to the last button: the product keeps it in a single token, --color-primary (#F5BB32), and every accent, button and state on the site and the panel comes from it. Here, the logo in volume, with its exact geometry.",
    piesPar: [
      "New link: propfirm account (source) and broker account (target) · demo data",
      "The three plans in the trader area · real prices",
    ],
    piesDominio: [
      "Three propfirms' rules, measured in the database",
      "The same EURUSD at FTMO and at Tickmill",
    ],
    mandos: { anterior: "Previous", siguiente: "Next" },
    alt: {
      sitioPanel:
        "sistemafeniz.com in a browser window and the trader panel on a phone, scrolling together over Feniz's navy and gold, with two real cards floating: total balance and today's performance",
      ea: "MQL5 code of the Expert Advisor Feniz generates for each trader",
      viaje:
        "Animation of a trade's journey: the Expert Advisor builds the closed trade's JSON in MetaTrader 5, POSTs it to Feniz, gets HTTP 200 back and the row lands in the trader area's latest movements, every five seconds · demo data",
      r28: "A woman in a blue jacket checks her phone at night in the city; three real cards from the Feniz panel float beside her: total P&L +$1,240, the active FTMO → Tickmill link and a 75% win rate",
      conexion:
        "Feniz's new-link wizard: FTMO Challenge 25K as source and Tickmill Raw as target, with the active link below",
      planes:
        "The three plans in Feniz's trader area: monthly at $99, annual at $699 and Enterprise at $1499",
      reglas:
        "Three fanned cards with the rulebooks of MyForexFunds, FTMO and The Funded Trader: profit target, daily loss and total loss, with the Challenge, Verification and Funded phases below",
      simbolos:
        "The same EURUSD on both sides: 3.00 USD commission per lot at FTMO and 5.70 USD at Tickmill, with pip value, ticks and spread below",
      isotipo:
        "The Feniz logo, an orbit with three candles, in gold and in volume, swaying over navy",
    },
    cta: {
      titulo: "Have a product in mind?",
      texto:
        "We design it and build it with you, from the first screen to production, as we did with Feniz.",
      boton: "Let's talk",
      href: "#contacto",
    },
    resultado: {
      titulo: "What was delivered",
      texto:
        "Feniz is live at sistemafeniz.com with its website, its sign-up, its trader area and its panel. We publish no usage figures: their analytics are not ours.",
      cifras: [
        {
          valor: "519",
          texto:
            "lines of MQL5 in the Expert Advisor generated for each trader",
        },
        {
          valor: "5 s",
          texto: "between one batch of trades and the next from MetaTrader 5",
        },
        {
          valor: "48",
          texto: "permissions over eleven resources, across five roles",
        },
      ],
    },
    nextTagline:
      "Bookings, calendar and payments on each business's own website",
  },

  pt: {
    titulo:
      "O produto inteiro de uma plataforma para traders de contas de financiamento",
    heroeAlt:
      "Ao amanhecer, um trader confere no laptop o painel da Feniz: saldo, resultado, conexões e últimos movimentos",
    meta: {
      tipologia: ["Tipologia", ["Web app", "Fintech", "MetaTrader 5"]],
      industria: ["Setor", "Trading de contas de financiamento"],
      anio: ["Ano", "2025–2026"],
      servicios: [
        "Serviços",
        [
          "Design de produto",
          "Desenvolvimento web",
          "Autenticação e e-mail",
          "Integração com o MetaTrader 5",
          "Cobranças com Paddle e MercadoPago",
        ],
      ],
      entregables: [
        "Entregáveis",
        [
          "sistemafeniz.com",
          "Área do trader",
          "Painel de administração",
          "Expert Advisor em MQL5",
        ],
      ],
      vivo: ["No ar", "sistemafeniz.com", "https://sistemafeniz.com"],
    },
    contexto: [
      "Contexto",
      "Um trader financiado opera a conta de uma propfirm e, em paralelo, a sua em uma corretora. Levava as duas à mão, em planilhas. Para a Feniz construímos o produto inteiro para uni-las: site, cadastro, área do trader e painel.",
    ],
    reto: [
      "O desafio",
      "O difícil não era o painel: era trazer as operações. O MetaTrader 5 não expõe uma API para fora e copiá-las à mão mata o produto. Era preciso escrever o programa que as exporta, e um diferente por trader.",
    ],
    puente: [
      "A ponte com o MetaTrader 5",
      "A Feniz escreve um Expert Advisor para cada trader: 519 linhas de MQL5 com o seu webhook, a sua chave, a sua conta e a sua conexão dentro. Instala-se no MetaTrader 5 e envia as operações a cada cinco segundos.",
    ],
    trader: [
      "O que o trader vê",
      "Do outro lado, o trader vê saldo, resultado e acertos sem abrir uma planilha, e conecta em dois passos a sua conta de propfirm com a da sua corretora. Três planos, com cobrança por Paddle ou MercadoPago.",
    ],
    dominio: [
      "O domínio que era preciso codificar",
      "Um painel de trading se escreve numa semana; o que custa é o regulamento. Cada propfirm tem fases, metas e limites de perda próprios, e o mesmo símbolo não custa igual na propfirm e na corretora.",
    ],
    oro: "Um só ouro, do isotipo ao último botão: o produto o guarda em um token, --color-primary (#F5BB32), e dele saem acentos, botões e estados do site e do painel. Aqui, o isotipo em volume, com a sua geometria exata.",
    piesPar: [
      "Nova conexão: conta propfirm (origem) e conta corretora (destino) · dados de demonstração",
      "Os três planos da área do trader · preços reais",
    ],
    piesDominio: [
      "As regras de três propfirms, medidas na base",
      "O mesmo EURUSD na FTMO e na Tickmill",
    ],
    mandos: { anterior: "Anterior", siguiente: "Próximo" },
    alt: {
      sitioPanel:
        "sistemafeniz.com em uma janela e o painel do trader em um celular, descendo juntos sobre o azul e o ouro da Feniz, com dois cartões reais flutuando: saldo total e desempenho de hoje",
      ea: "Código MQL5 do Expert Advisor que a Feniz gera para cada trader",
      viaje:
        "Animação da viagem de uma operação: o Expert Advisor monta no MetaTrader 5 o JSON da operação fechada, envia por POST à Feniz, recebe HTTP 200 e a linha entra nos últimos movimentos da área do trader, a cada cinco segundos · dados de demonstração",
      r28: "Uma mulher de jaqueta azul olha o celular à noite na cidade; flutuam ao seu lado três cartões reais do painel da Feniz: P&L total +$1,240, a conexão FTMO → Tickmill ativa e um win rate de 75 %",
      conexion:
        "O assistente de nova conexão da Feniz: FTMO Challenge 25K como origem e Tickmill Raw como destino, e embaixo a conexão já ativa",
      planes:
        "Os três planos da área do trader da Feniz: mensal a $99, anual a $699 e Enterprise a $1499",
      reglas:
        "Três cartões em leque com o regulamento da MyForexFunds, da FTMO e da The Funded Trader: meta, perda diária e perda total, e embaixo as fases Challenge, Verification e Funded",
      simbolos:
        "O mesmo EURUSD dos dois lados: 3,00 USD de comissão por lote na FTMO e 5,70 USD na Tickmill, com o valor do pip, os ticks e o spread embaixo",
      isotipo:
        "O isotipo da Feniz, uma órbita com três velas, em ouro e em volume, oscilando sobre azul-marinho",
    },
    cta: {
      titulo: "Tem um produto em mente?",
      texto:
        "Nós o desenhamos e o construímos com você, da primeira tela à produção, como fizemos com a Feniz.",
      boton: "Vamos conversar",
      href: "#contacto",
    },
    resultado: {
      titulo: "O que foi entregue",
      texto:
        "A Feniz está no ar em sistemafeniz.com com o seu site, o seu cadastro, a sua área de trader e o seu painel. Não publicamos números de uso: a analítica deles não é nossa.",
      cifras: [
        {
          valor: "519",
          texto: "linhas de MQL5 no Expert Advisor gerado para cada trader",
        },
        {
          valor: "5 s",
          texto:
            "entre um envio de operações e o seguinte desde o MetaTrader 5",
        },
        {
          valor: "48",
          texto: "permissões sobre onze recursos, divididas em cinco papéis",
        },
      ],
    },
    nextTagline: "Reservas, agenda e cobranças no site de cada negócio",
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

/**
 * Doce bloques: el texto alterna de lado y cada uno cae entre dos piezas. Sin tiras
 * horizontales (ESTANDAR-FICHA § 1 bis: como mucho dos, y aquí no hacen falta).
 */
function bloques(c: Copy, lang: StoryLang): BloqueProducto[] {
  return [
    { kind: "texto", lado: "izq", title: c.contexto[0], body: c.contexto[1] },
    // La mezcla de Paisanos en un plano: la web real moviéndose sobre el degradado de la marca
    // y la UI flotando encima
    {
      kind: "ancho",
      medio: {
        ...vid("fz-sitio-panel", c.alt.sitioPanel),
        // en el celular, solo el panel en el teléfono: el plano ancho a 390 px no se lee
        srcMovil: `${IMG}/fz-sitio-panel-movil.mp4`,
        posterMovil: `${IMG}/fz-sitio-panel-movil.jpg`,
      } as Medio,
      ratio: 2,
      ratioMovil: 1,
    },
    { kind: "texto", lado: "der", title: c.reto[0], body: c.reto[1] },
    {
      kind: "ancho",
      medio: img(`fz-ea-${lang}.jpg`, c.alt.ea, `fz-ea-movil-${lang}.jpg`),
      ratio: 2,
      ratioMovil: 4 / 3,
    },
    { kind: "texto", lado: "izq", title: c.puente[0], body: c.puente[1] },
    // El viaje de una operación, animado (sustituye al diagrama: «innecesario, cámbialo por algo
    // más genial»): el JSON real del EA, el POST, el 200 y la fila entrando en la tabla real
    {
      kind: "ancho",
      medio: {
        ...vid("fz-viaje", c.alt.viaje),
        srcMovil: `${IMG}/fz-viaje-movil.mp4`,
        posterMovil: `${IMG}/fz-viaje-movil.jpg`,
      } as Medio,
      ratio: 2,
      ratioMovil: 400 / 680,
    },
    // ── Lo que ve el trader: la persona con la UI real flotando (R28) ──
    { kind: "texto", lado: "der", title: c.trader[0], body: c.trader[1] },
    {
      kind: "ancho",
      // foto real de Unsplash (Olena Kamenetska), no generada: «a veces es un poco notorio que
      // una persona es hecha por IA». Crédito y licencia en el taller, stock/CREDITOS.md
      medio: img("fz-r28-v2.jpg", c.alt.r28, "fz-r28-v2-movil.jpg"),
      ratio: 2,
      ratioMovil: 1,
    },
    {
      kind: "par",
      medios: [
        img("fz-conexion-v2.jpg", c.alt.conexion),
        img("fz-planes-v2.jpg", c.alt.planes),
      ],
      pies: c.piesPar,
    },
    // ── El dominio ──
    { kind: "texto", lado: "izq", title: c.dominio[0], body: c.dominio[1] },
    {
      kind: "par",
      // Rehechas en el lenguaje de Paisanos (las de crema con tablas eran «feas»): tarjetas que
      // flotan sobre el azul y el oro, la cifra como pieza tipográfica. Un solo cuadrado sirve
      // también en el celular: la letra se pensó para leerse a 358 px
      medios: [
        vid(`fz-reglas-v2-${lang}`, c.alt.reglas),
        vid(`fz-simbolos-v2-${lang}`, c.alt.simbolos),
      ],
      pies: c.piesDominio,
    },
    // ── El objeto de marca en 3D (R29), con el dato del token al lado ──
    {
      kind: "cuadrada-texto",
      medio: vid("fz-isotipo-3d", c.alt.isotipo),
      body: c.oro,
    },
  ];
}

export default function FenizContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseProducto
        // El azul de la noche del panel de Feniz, el mismo del borde de sus vídeos
        fondo="#0A0E18"
        mandos={c.mandos}
        titulo={c.titulo}
        logo={{
          src: `${IMG}/fz-logo.png`,
          width: 1008,
          height: 421,
          alt: "Feniz",
        }}
        heroe={{
          src: `${IMG}/fz-heroe-trader.jpg`,
          srcMovil: `${IMG}/fz-heroe-trader-movil.jpg`,
          alt: c.heroeAlt,
        }}
        meta={c.meta}
        bloques={bloques(c, lang)}
        cta={c.cta}
        resultado={c.resultado}
      />
      <CaseMasProyectos
        /*
         * El oro de su token --color-primary: hsl(42 91% 58%) = #F5BB32. Sobre blanco da 1,74:1,
         * así que `base` es el mismo tono bajado a 31 % (#976C07, 4,70:1); `dark` sí es el oro
         * real (11,13:1 sobre la tinta). `deep`, el azul de su fondo oscuro.
         */
        accent={{ base: "#976C07", dark: "#F5BB32", deep: "#14192B" }}
        next={{
          name: "Bookit",
          tagline: c.nextTagline,
          href: "/casos-de-exito/bookit",
          image: "/images/proyects/bookit/bookit-portada-v2.jpg",
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
