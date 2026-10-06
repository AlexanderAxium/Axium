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
 * Ficha larga de Feniz: el producto entero de una plataforma para traders de fondeo.
 *
 * ── DE DÓNDE SALE CADA COSA (2026-09-30) ────────────────────────────────────────────
 * TODA la interfaz de esta ficha es captura real. Nada se generó con IA, ni se recompuso
 * de memoria. Las fuentes, una por una:
 *   · Sitio público   Playwright a 2x contra sistemafeniz.com en vivo (portada, alta,
 *                     acceso, términos y libro de reclamaciones).
 *   · Área privada    la app levantada EN LOCAL desde el repo real
 *                     (~/Documents/FENIZ/t3-starter) contra una copia del volcado de
 *                     producción restaurada en una base aparte. **Antes de capturar nada
 *                     se anonimizó el volcado**: los 21 usuarios reales quedaron con
 *                     nombres y correos de demostración, los números de cuenta se
 *                     reemplazaron y las operaciones son sembradas. En la ficha no hay un
 *                     solo dato personal de un cliente de Feniz, y los pies lo dicen.
 *   · Logotipo        el lockup real del header de sistemafeniz.com, aislado con alfa
 *                     (versión blanca del header oscuro de /legal/complaints).
 *   · Paleta          el token --color-primary del propio producto, hsl(42 91% 58%) =
 *                     #F5BB32, y el azul marino de su fondo oscuro.
 *   · Código del EA   el archivo que produce src/lib/mt5-ea-template.ts, generado de
 *                     verdad con el template del repo (519 líneas de MQL5).
 *   · Diagrama        cada caja está medida contra el código del EA y del webhook, no
 *                     escrita de memoria: el intervalo de 5 s, el límite de 30 peticiones
 *                     por minuto e IP, los 15 campos de trade_data y los códigos HTTP.
 * Lo ÚNICO generado con Higgsfield (gpt_image_2_5 high/2k) son dos escenas VACÍAS, sin una
 * letra: el escritorio del hero y el portátil de pantalla verde de la portada, sobre el que
 * se compuso la captura real del panel.
 * Taller: .claude/skills/portafolio-axium/capturas-clientes/feniz/
 *
 * ── LO QUE EL JSON VIEJO DECLARABA MAL ──────────────────────────────────────────────
 *   · Decía «Python» en el stack y «App de Escritorio» entre los servicios. Medido en el
 *     repo: no hay una línea de Python ni ninguna app de escritorio. Lo que hay es un
 *     Expert Advisor en MQL5 que la propia plataforma genera y que corre DENTRO de
 *     MetaTrader 5. Corregido.
 *   · Publicaba «15+ usuarios activos» y «15+ propfirms integradas». En la base hay 23
 *     usuarios y el catálogo de propfirms tiene cuatro filas, dos activas. `results` va
 *     vacío: no se publican cifras que no se pueden sostener.
 *   · El stack real, medido: Next.js 15 + TypeScript + tRPC 11 + Prisma 6 sobre
 *     PostgreSQL, Tailwind 4, Radix, better-auth, AWS SES, Paddle y MercadoPago.
 *
 * ── UNA PRECISIÓN HONRADA SOBRE EL EA ───────────────────────────────────────────────
 * El generador del Expert Advisor, las claves API y el webhook están construidos y el
 * endpoint responde en producción (POST sin cuerpo → 400 con el contrato). La pantalla
 * que entrega el archivo al trader (MT5ImportSection) vive en el repo pero hoy no está
 * montada en `main`: el commit 9a89288 quitó esa pestaña del modal de alta de operación.
 * Por eso la ficha enseña el EA por su CÓDIGO y por su ARQUITECTURA, que es lo que existe,
 * y no inventa una pantalla que hoy no se puede capturar.
 *
 * ── LA PODA DEL 2026-09-30, POR EL §0 DEL ESTÁNDAR ──────────────────────────────────
 * Alexander, viendo el par de alta y libro de reclamaciones: «el libro de reclamaciones,
 * estaba mandando caps de esto, que se ve feo» · «no hagas por hacer o por rellenar».
 * El fallo no era el encuadre: esas pantallas NUNCA debieron ser piezas. Se aplicó el
 * filtro del §0 a las once y cayeron CUATRO:
 *   · fz-alta y fz-legales   — un registro y un libro de reclamaciones los tiene TODO
 *                              producto del mundo. No prueban nada de lo que hicimos.
 *   · fz-catalogos           — inventario, no trabajo: tres tablas de pocas filas.
 *   · fz-roles               — pasaba los filtros 1, 2 y 4 pero no el 3: para entenderse
 *                              necesitaba las dos tablas enteras, o sea era un recorte de
 *                              detalle que no teníamos. El dato (48 permisos sobre once
 *                              recursos) se cuenta ahora donde se lee: en las viñetas.
 * Nacen DOS, las dos del nivel 1 del orden de material («lo que solo este producto hace»):
 *   · fz-reglas-{es,en,pt}   — el modelo que codifica el reglamento de cada propfirm.
 *   · fz-simbolos-{es,en,pt} — la tabla de equivalencias entre el lado propfirm y el lado
 *                              bróker, que es lo que hace posible copiar una operación.
 * Las dos son láminas CLARAS a propósito: el EA y la arquitectura ya son oscuras, y la
 * monotonía no vive en una pieza sino entre ellas. Cada cifra está medida contra la base.
 *
 * TRES ACTOS, porque con nueve piezas la ficha cuenta lo mismo con menos:
 *   01 · El producto entero   sitio, legales, alta con SES, área del trader y cobro
 *   02 · El puente con MT5    el Expert Advisor en MQL5 y el viaje de una operación
 *   03 · El dominio           las reglas de las propfirms, los símbolos y los permisos
 *
 * RITMO: catorce bloques, siete de imagen — CINCO anchas y DOS pares, NUEVE piezas.
 * Ningún tramo pasa de 700 px sin imagen (el mayor son los 650 de `highlights`) y ningún
 * párrafo pasa de 45 palabras en es/en/pt.
 */

const IMG = "/images/proyects/feniz";

type Acto = { index: string; title: [string, string]; body: string };

/** Las nueve piezas del relato: cinco anchas y dos pares de cuadradas. */
type Pieza =
  | "sitio"
  | "planes"
  | "ea"
  | "arquitectura"
  | "conexion"
  | "movil"
  | "reglas"
  | "simbolos"
  | "panel";

type Copy = {
  tagline: string;
  meta: [string, string][];
  statement: string;
  context: string;
  highlightsTitle: [string, string];
  highlights: { lead: string; text: string }[];
  challengeTitle: string;
  challenge: string;
  actos: Record<"producto" | "puente" | "dominio", Acto>;
  outcomesTitle: string;
  outcomes: string;
  stackTitle: string;
  stack: string[];
  /** Solo las piezas anchas llevan frase: un bloque `pair` no admite `lead`. */
  leads: {
    sitio: string;
    planes: string;
    ea: string;
    arquitectura: string;
    panel: string;
  };
  pies: Record<Pieza, string>;
  alt: Record<Pieza, string>;
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    tagline:
      "El producto entero de una plataforma para traders de cuentas de fondeo",
    meta: [
      ["Estado", "En línea"],
      [
        "Entregables",
        "Sitio, autenticación, área del trader y panel de administración",
      ],
      ["Industria", "Trading de cuentas de fondeo"],
      ["Dominio", "23 modelos, 18 routers tRPC, dos pasarelas"],
    ],
    statement:
      "A Feniz le construimos el producto entero: el sitio, el alta con correo verificado, el área del trader y el panel que la sostiene. Y el puente que faltaba, un Expert Advisor de MetaTrader 5 escrito para cada usuario.",
    context:
      "Un trader de fondeo opera la cuenta de una propfirm y, en paralelo, la suya en un bróker. Llevaba las dos a mano, en planillas, sin una sola vista de su rendimiento. Feniz nació para unirlas.",
    highlightsTitle: ["Lo que", "construimos"],
    highlights: [
      {
        lead: "Sitio y legales",
        text: "portada, planes, preguntas y las cuatro páginas obligatorias, con sitemap y robots propios.",
      },
      {
        lead: "Autenticación completa",
        text: "alta, acceso, confirmación de correo y restablecimiento, con correo transaccional por AWS SES.",
      },
      {
        lead: "Área del trader",
        text: "planes, pago, cuentas de propfirm y de bróker, conexiones entre ellas y perfil.",
      },
      {
        lead: "Panel de administración",
        text: "usuarios, catálogos, símbolos y cinco roles con cuarenta y ocho permisos sobre once recursos.",
      },
      {
        lead: "Reglas de cada propfirm",
        text: "fases, objetivo, pérdida diaria y pérdida total, por tamaño de cuenta: quince configuraciones.",
      },
      {
        lead: "Puente con MetaTrader 5",
        text: "un Expert Advisor en MQL5 por trader y el webhook que recibe sus operaciones.",
      },
    ],
    challengeTitle: "Reto",
    challenge:
      "Lo difícil no era el panel: era traer las operaciones. MetaTrader 5 no expone una API hacia fuera y copiarlas a mano mata el producto. Había que escribir el programa que las exporta, y uno distinto por trader.",
    actos: {
      producto: {
        index: "Acto 01",
        title: ["El producto", "entero"],
        body: "sistemafeniz.com es un Next.js con su portada, sus planes y sus cuatro páginas legales. Detrás, el alta con contraseña verificada, el correo que la confirma por AWS SES y el área donde el trader enlaza sus dos cuentas.",
      },
      puente: {
        index: "Acto 02",
        title: ["El puente", "con MetaTrader 5"],
        body: "Feniz escribe un Expert Advisor para cada trader: 519 líneas de MQL5 con su webhook, su clave, su cuenta y su conexión dentro. Se instala en MetaTrader 5 y manda las operaciones cada cinco segundos.",
      },
      dominio: {
        index: "Acto 03",
        title: ["El dominio", "que había que codificar"],
        body: "Un panel de trading se escribe en una semana; lo que cuesta es el reglamento. Cada propfirm tiene fases, objetivos y límites de pérdida propios, y el mismo símbolo no cuesta igual en la propfirm que en el bróker.",
      },
    },
    outcomesTitle: "Lo entregado",
    outcomes:
      "Feniz quedó en línea con su sitio, su alta, su área de trader y su panel. No publicamos cifras de uso: su analítica no es nuestra.",
    stackTitle: "Disciplinas y tecnología",
    stack: [
      "Producto SaaS a medida",
      "Diseño de interfaz",
      "Next.js",
      "TypeScript",
      "tRPC",
      "Prisma",
      "PostgreSQL",
      "Tailwind CSS",
      "Radix UI",
      "better-auth",
      "MQL5 · MetaTrader 5",
      "AWS SES",
      "Paddle",
      "MercadoPago",
      "Roles y permisos",
      "SEO técnico",
    ],
    leads: {
      sitio: "La portada: conecta, gestiona y optimiza tus cuentas de trading.",
      planes:
        "Tres planes y un checkout con dos pasarelas: Paddle y MercadoPago.",
      ea: "El programa que Feniz escribe para ti y tú instalas en MetaTrader 5.",
      arquitectura:
        "Lo que pasa entre que cierras una operación y la ves dentro de Feniz.",
      panel:
        "El panel del trader: balance, resultado, conexiones y últimos movimientos.",
    },
    pies: {
      sitio: "sistemafeniz.com · captura del sitio en vivo",
      planes:
        "Planes y checkout del trader · precios reales, datos de demostración",
      ea: "FenizTradeExporter_EA.mq5 · el archivo que genera src/lib/mt5-ea-template.ts",
      arquitectura:
        "El viaje de una operación, medido contra el código del EA y del webhook",
      conexion:
        "Nueva conexión: cuenta propfirm (origen) y cuenta bróker (destino) · datos de demostración",
      movil: "El panel del trader a 390 px · datos de demostración",
      reglas:
        "PropfirmRulesConfiguration · las quince configuraciones medidas en la base",
      simbolos:
        "SymbolConfiguration · la equivalencia de EURUSD entre FTMO y Tickmill",
      panel: "Panel del trader · datos de demostración",
    },
    alt: {
      sitio: "Portada de sistemafeniz.com dentro de una ventana de navegador",
      planes: "Los tres planes de Feniz y la pantalla de pago con Paddle",
      ea: "Código MQL5 del Expert Advisor que Feniz genera para cada trader",
      arquitectura:
        "Diagrama del viaje de una operación entre MetaTrader 5 y Feniz",
      conexion:
        "Asistente de nueva conexión entre una cuenta propfirm y una de bróker",
      movil: "El panel del trader de Feniz en un teléfono",
      reglas:
        "Lámina con el reglamento de tres propfirms: objetivo y límites de pérdida",
      simbolos:
        "Lámina con el coste del mismo EURUSD en la propfirm y en el bróker",
      panel: "Panel del trader de Feniz con balance, resultado y movimientos",
    },
    nextTagline: "Reservas, agenda y cobros en la web de cada negocio",
  },

  en: {
    tagline: "The whole product of a platform for funded-account traders",
    meta: [
      ["Status", "Live"],
      ["Deliverables", "Website, authentication, trader area and admin panel"],
      ["Industry", "Funded-account trading"],
      ["Domain", "23 models, 18 tRPC routers, two payment gateways"],
    ],
    statement:
      "We built Feniz's whole product: the website, sign-up with a verified email, the trader area and the panel that holds it. Plus the missing bridge, a MetaTrader 5 Expert Advisor written for each user.",
    context:
      "A funded trader runs a propfirm account and, in parallel, their own at a broker. They kept both by hand, in spreadsheets, with no single view of how they were doing. Feniz was born to join them.",
    highlightsTitle: ["What we", "built"],
    highlights: [
      {
        lead: "Website and legals",
        text: "home, plans, questions and the four required pages, with their own sitemap and robots.",
      },
      {
        lead: "Full authentication",
        text: "sign-up, sign-in, email confirmation and password reset, with transactional mail over AWS SES.",
      },
      {
        lead: "Trader area",
        text: "plans, payment, propfirm and broker accounts, the links between them and the profile.",
      },
      {
        lead: "Admin panel",
        text: "users, catalogues, symbols and five roles with forty-eight permissions over eleven resources.",
      },
      {
        lead: "Each propfirm's rulebook",
        text: "phases, profit target, daily and total loss limits, per account size: fifteen rule sets.",
      },
      {
        lead: "MetaTrader 5 bridge",
        text: "one MQL5 Expert Advisor per trader and the webhook that takes in their trades.",
      },
    ],
    challengeTitle: "Challenge",
    challenge:
      "The hard part was not the panel: it was getting the trades in. MetaTrader 5 exposes no outbound API, and copying them by hand kills the product. Someone had to write the exporter, and a different one per trader.",
    actos: {
      producto: {
        index: "Act 01",
        title: ["The whole", "product"],
        body: "sistemafeniz.com is a Next.js with its home, its plans and its four legal pages. Behind it, sign-up with a checked password, the email that confirms it over AWS SES, and the area where a trader links both accounts.",
      },
      puente: {
        index: "Act 02",
        title: ["The bridge", "to MetaTrader 5"],
        body: "Feniz writes an Expert Advisor for each trader: 519 lines of MQL5 carrying their webhook, their key, their account and their link inside. It is installed in MetaTrader 5 and posts trades every five seconds.",
      },
      dominio: {
        index: "Act 03",
        title: ["The domain", "that had to be encoded"],
        body: "A trading panel takes a week; the rulebook is what costs. Every propfirm has its own phases, targets and loss limits, and the same symbol does not cost the same at the propfirm as at the broker.",
      },
    },
    outcomesTitle: "What was delivered",
    outcomes:
      "Feniz went live with its website, its sign-up, its trader area and its panel. We publish no usage figures: their analytics are not ours.",
    stackTitle: "Disciplines and technology",
    stack: [
      "Custom SaaS product",
      "Interface design",
      "Next.js",
      "TypeScript",
      "tRPC",
      "Prisma",
      "PostgreSQL",
      "Tailwind CSS",
      "Radix UI",
      "better-auth",
      "MQL5 · MetaTrader 5",
      "AWS SES",
      "Paddle",
      "MercadoPago",
      "Roles and permissions",
      "Technical SEO",
    ],
    leads: {
      sitio:
        "The home page: connect, manage and optimise your trading accounts.",
      planes:
        "Three plans and one checkout with two gateways: Paddle and MercadoPago.",
      ea: "The program Feniz writes for you and you install in MetaTrader 5.",
      arquitectura:
        "What happens between closing a trade and seeing it inside Feniz.",
      panel:
        "The trader's panel: balance, result, links and the latest movements.",
    },
    pies: {
      sitio: "sistemafeniz.com · captured from the live site",
      planes: "Trader plans and checkout · real prices, demo data",
      ea: "FenizTradeExporter_EA.mq5 · the file src/lib/mt5-ea-template.ts produces",
      arquitectura:
        "A trade's journey, measured against the EA and the webhook code",
      conexion:
        "New link: propfirm account (source) and broker account (target) · demo data",
      movil: "The trader's panel at 390 px · demo data",
      reglas:
        "PropfirmRulesConfiguration · the fifteen rule sets measured in the database",
      simbolos:
        "SymbolConfiguration · what EURUSD costs at FTMO and at Tickmill",
      panel: "Trader panel · demo data",
    },
    alt: {
      sitio: "sistemafeniz.com home page inside a browser window",
      planes: "Feniz's three plans and the Paddle checkout screen",
      ea: "MQL5 code of the Expert Advisor Feniz generates for each trader",
      arquitectura:
        "Diagram of a trade's journey between MetaTrader 5 and Feniz",
      conexion: "Wizard linking a propfirm account to a broker account",
      movil: "Feniz's trader panel on a phone",
      reglas:
        "Plate with three propfirms' rulebooks: profit target and loss limits",
      simbolos:
        "Plate with what the same EURUSD costs at the propfirm and at the broker",
      panel: "Feniz trader panel with balance, result and movements",
    },
    nextTagline:
      "Bookings, calendar and payments on each business's own website",
  },

  pt: {
    tagline:
      "O produto inteiro de uma plataforma para traders de contas de financiamento",
    meta: [
      ["Estado", "No ar"],
      [
        "Entregáveis",
        "Site, autenticação, área do trader e painel de administração",
      ],
      ["Indústria", "Trading de contas de financiamento"],
      ["Domínio", "23 modelos, 18 routers tRPC, duas gateways"],
    ],
    statement:
      "Para a Feniz construímos o produto inteiro: o site, o cadastro com e-mail verificado, a área do trader e o painel que a sustenta. E a ponte que faltava, um Expert Advisor do MetaTrader 5 escrito para cada usuário.",
    context:
      "Um trader financiado opera a conta de uma propfirm e, em paralelo, a sua em uma corretora. Levava as duas à mão, em planilhas, sem uma única visão do seu desempenho. A Feniz nasceu para uni-las.",
    highlightsTitle: ["O que", "construímos"],
    highlights: [
      {
        lead: "Site e páginas legais",
        text: "capa, planos, perguntas e as quatro páginas obrigatórias, com sitemap e robots próprios.",
      },
      {
        lead: "Autenticação completa",
        text: "cadastro, acesso, confirmação de e-mail e redefinição, com e-mail transacional por AWS SES.",
      },
      {
        lead: "Área do trader",
        text: "planos, pagamento, contas de propfirm e de corretora, conexões entre elas e perfil.",
      },
      {
        lead: "Painel de administração",
        text: "usuários, catálogos, símbolos e cinco papéis com quarenta e oito permissões sobre onze recursos.",
      },
      {
        lead: "O regulamento de cada propfirm",
        text: "fases, meta, perda diária e perda total, por tamanho de conta: quinze configurações.",
      },
      {
        lead: "Ponte com o MetaTrader 5",
        text: "um Expert Advisor em MQL5 por trader e o webhook que recebe as suas operações.",
      },
    ],
    challengeTitle: "Desafio",
    challenge:
      "O difícil não era o painel: era trazer as operações. O MetaTrader 5 não expõe uma API para fora e copiá-las à mão mata o produto. Era preciso escrever o programa que as exporta, e um diferente por trader.",
    actos: {
      producto: {
        index: "Ato 01",
        title: ["O produto", "inteiro"],
        body: "sistemafeniz.com é um Next.js com a sua capa, os seus planos e as suas quatro páginas legais. Atrás, o cadastro com senha verificada, o e-mail que o confirma por AWS SES e a área onde o trader conecta as suas duas contas.",
      },
      puente: {
        index: "Ato 02",
        title: ["A ponte", "com o MetaTrader 5"],
        body: "A Feniz escreve um Expert Advisor para cada trader: 519 linhas de MQL5 com o seu webhook, a sua chave, a sua conta e a sua conexão dentro. Instala-se no MetaTrader 5 e envia as operações a cada cinco segundos.",
      },
      dominio: {
        index: "Ato 03",
        title: ["O domínio", "que era preciso codificar"],
        body: "Um painel de trading se escreve numa semana; o que custa é o regulamento. Cada propfirm tem fases, metas e limites de perda próprios, e o mesmo símbolo não custa igual na propfirm e na corretora.",
      },
    },
    outcomesTitle: "O que foi entregue",
    outcomes:
      "A Feniz ficou no ar com o seu site, o seu cadastro, a sua área de trader e o seu painel. Não publicamos números de uso: a analítica deles não é nossa.",
    stackTitle: "Disciplinas e tecnologia",
    stack: [
      "Produto SaaS sob medida",
      "Design de interface",
      "Next.js",
      "TypeScript",
      "tRPC",
      "Prisma",
      "PostgreSQL",
      "Tailwind CSS",
      "Radix UI",
      "better-auth",
      "MQL5 · MetaTrader 5",
      "AWS SES",
      "Paddle",
      "MercadoPago",
      "Papéis e permissões",
      "SEO técnico",
    ],
    leads: {
      sitio: "A capa: conecte, gerencie e otimize as suas contas de trading.",
      planes:
        "Três planos e um checkout com duas gateways: Paddle e MercadoPago.",
      ea: "O programa que a Feniz escreve para você e você instala no MetaTrader 5.",
      arquitectura:
        "O que acontece entre fechar uma operação e vê-la dentro da Feniz.",
      panel:
        "O painel do trader: saldo, resultado, conexões e últimos movimentos.",
    },
    pies: {
      sitio: "sistemafeniz.com · captura do site no ar",
      planes:
        "Planos e checkout do trader · preços reais, dados de demonstração",
      ea: "FenizTradeExporter_EA.mq5 · o arquivo que src/lib/mt5-ea-template.ts gera",
      arquitectura:
        "A viagem de uma operação, medida contra o código do EA e do webhook",
      conexion:
        "Nova conexão: conta propfirm (origem) e conta corretora (destino) · dados de demonstração",
      movil: "O painel do trader a 390 px · dados de demonstração",
      reglas:
        "PropfirmRulesConfiguration · as quinze configurações medidas na base",
      simbolos:
        "SymbolConfiguration · o que o mesmo EURUSD custa na FTMO e na Tickmill",
      panel: "Painel do trader · dados de demonstração",
    },
    alt: {
      sitio: "Capa de sistemafeniz.com dentro de uma janela de navegador",
      planes: "Os três planos da Feniz e a tela de pagamento com Paddle",
      ea: "Código MQL5 do Expert Advisor que a Feniz gera para cada trader",
      arquitectura:
        "Diagrama da viagem de uma operação entre o MetaTrader 5 e a Feniz",
      conexion:
        "Assistente de nova conexão entre uma conta propfirm e uma de corretora",
      movil: "O painel do trader da Feniz em um telefone",
      reglas:
        "Lâmina com o regulamento de três propfirms: meta e limites de perda",
      simbolos:
        "Lâmina com o que o mesmo EURUSD custa na propfirm e na corretora",
      panel: "Painel do trader da Feniz com saldo, resultado e movimentos",
    },
    nextTagline: "Reservas, agenda e cobranças no site de cada negócio",
  },
};

/**
 * Dieciséis bloques. El orden está puesto para el ritmo, no por capítulos: cada bloque de
 * texto cae entre dos imágenes y el único que queda al final es `tags`. «Lo entregado» va
 * DELANTE de la última ancha, que es la prueba de lo que acaba de decir.
 * Tramos sin imagen a 1440: el mayor son los 650 px de `highlights`.
 */
function bloques(c: Copy, lang: StoryLang): StoryBlock[] {
  return [
    // El sitio público abre: la cara que cualquiera puede comprobar.
    {
      kind: "wide",
      lead: c.leads.sitio,
      image: {
        src: `${IMG}/fz-sitio.jpg`,
        alt: c.alt.sitio,
        caption: c.pies.sitio,
        mobileSrc: `${IMG}/fz-sitio-movil.jpg`,
      },
    },
    { kind: "highlights", title: c.highlightsTitle, items: c.highlights },
    // Lo que el trader hace y desde dónde, partiendo el texto de apertura.
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/fz-conexion.jpg`,
          alt: c.alt.conexion,
          caption: c.pies.conexion,
        },
        { src: `${IMG}/fz-movil.jpg`, alt: c.alt.movil, caption: c.pies.movil },
      ],
    },

    // ── ACTO 01 · EL PRODUCTO ENTERO ──
    {
      kind: "act",
      index: c.actos.producto.index,
      title: c.actos.producto.title,
      body: c.actos.producto.body,
    },
    {
      kind: "wide",
      lead: c.leads.planes,
      image: {
        src: `${IMG}/fz-planes.jpg`,
        alt: c.alt.planes,
        caption: c.pies.planes,
        mobileSrc: `${IMG}/fz-planes-movil.jpg`,
      },
    },

    // ── ACTO 02 · EL PUENTE CON METATRADER 5 ──
    {
      kind: "act",
      index: c.actos.puente.index,
      title: c.actos.puente.title,
      body: c.actos.puente.body,
    },
    {
      kind: "wide",
      lead: c.leads.ea,
      image: {
        src: `${IMG}/fz-ea-${lang}.jpg`,
        alt: c.alt.ea,
        caption: c.pies.ea,
        mobileSrc: `${IMG}/fz-ea-movil-${lang}.jpg`,
      },
    },
    // El reto, entre el código que lo plantea y el diagrama que lo resuelve.
    { kind: "text", title: c.challengeTitle, body: c.challenge },
    {
      kind: "wide",
      lead: c.leads.arquitectura,
      image: {
        src: `${IMG}/fz-arquitectura-${lang}.jpg`,
        alt: c.alt.arquitectura,
        caption: c.pies.arquitectura,
        mobileSrc: `${IMG}/fz-arquitectura-movil-${lang}.jpg`,
      },
    },

    // ── ACTO 03 · EL DOMINIO ──
    // Las dos láminas que sustituyen al par de alta/reclamaciones y al de roles/catálogos:
    // son lo único irrepetible que queda por contar, y son claras para no sumar una
    // tercera y una cuarta lámina oscura detrás del EA y del diagrama.
    {
      kind: "act",
      index: c.actos.dominio.index,
      title: c.actos.dominio.title,
      body: c.actos.dominio.body,
    },
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/fz-reglas-${lang}.jpg`,
          alt: c.alt.reglas,
          caption: c.pies.reglas,
          mobileSrc: `${IMG}/fz-reglas-movil-${lang}.jpg`,
        },
        {
          src: `${IMG}/fz-simbolos-${lang}.jpg`,
          alt: c.alt.simbolos,
          caption: c.pies.simbolos,
          mobileSrc: `${IMG}/fz-simbolos-movil-${lang}.jpg`,
        },
      ],
    },
    // «Lo entregado» delante de la última pieza: el cierre no son dos textos pegados.
    { kind: "text", id: "resultado", title: c.outcomesTitle, body: c.outcomes },
    {
      kind: "wide",
      lead: c.leads.panel,
      image: {
        src: `${IMG}/fz-panel.jpg`,
        alt: c.alt.panel,
        caption: c.pies.panel,
        mobileSrc: `${IMG}/fz-panel-movil.jpg`,
      },
    },
    { kind: "tags", title: c.stackTitle, items: c.stack },
  ];
}

export default function FenizContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseStory
        /*
         * El acento es de Feniz, no de Axium. El oro sale de su propio token de producto,
         * --color-primary: hsl(42 91% 58%) = #F5BB32. Ese oro sobre blanco da 1,74:1, así
         * que `base` es el mismo tono bajado a 31 % de luminosidad (#976C07, 4,70:1 sobre
         * blanco); `dark` sí puede ser el oro real, que sobre la tinta #060C20 da 11,13:1.
         * `deep` es el azul marino de su fondo oscuro (#0F141F de dark-gradient-background),
         * subido un punto para que el degradado del hero no se apague (#14192B, 14,6:1
         * contra el blanco del texto que lleva encima).
         */
        accent={{ base: "#976C07", dark: "#F5BB32", deep: "#14192B" }}
        name="Feniz"
        tagline={c.tagline}
        heroImage={`${IMG}/fz-hero.jpg`}
        heroPosition="58% 56%"
        logo={{ src: `${IMG}/fz-logo.png`, width: 1008, height: 421 }}
        liveUrl="https://sistemafeniz.com"
        meta={c.meta}
        statement={c.statement}
        context={c.context}
        blocks={bloques(c, lang)}
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
