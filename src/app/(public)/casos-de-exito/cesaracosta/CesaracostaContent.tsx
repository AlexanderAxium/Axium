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
 * Ficha de la Academia César Acosta: un solo acto (la tienda del club) más el
 * capítulo técnico de la integración con Rematch, siguiendo a Viget
 * (referencias/capturas/viget: «technical decisions» con su diagrama de
 * arquitectura dibujado, y el stack declarado al pie) y a Barrel
 * (referencias/capturas/barrel: una frase de lo construido encima de su
 * pantalla real, y pantallas que son estados de interfaz).
 *
 * ⚠️ SIN ENLACES. El sitio está construido pero **no publicado**: no se pasa
 * `liveUrl`, así que el hero no lleva «Sitio en vivo» ni el bloque de la frase
 * lleva «Visitar el sitio en vivo». En los mockups la barra del navegador
 * muestra el NOMBRE de la academia, nunca una URL ni `localhost`.
 *
 * La identidad del club ya existía y no la hicimos nosotros: acá no hay acto de
 * marca. Lo nuestro es el sistema de diseño de la web (Barlow, navy #012045 como
 * tinta y como velo, lima escaso, esquinas de 2–6 px — ver
 * ~/Documents/SAAS/RematchStorefront/DESIGN.md) y la integración.
 *
 * Imágenes: capturas reales del storefront servido en local contra la API de
 * producción de Rematch, compuestas en HTML/CSS (COMPOSITOR.md). El hero y el
 * fondo de la pieza móvil son escenas de Higgsfield con el velo navy que manda
 * su propio sistema de diseño. El diagrama está dibujado, no generado.
 */

const IMG = "/images/proyects/cesaracosta";

type Copy = {
  tagline: string;
  meta: [string, string][];
  statement: string;
  context: string;
  gruposLead: string;
  gruposCaption: string;
  highlightsTitle: [string, string];
  highlights: { lead: string; text: string }[];
  challengeTitle: string;
  challenge: string;
  approachTitle: string;
  approach: string;
  actIndex: string;
  actTitle: [string, string];
  act: string;
  arqCaption: string;
  rigorTitle: string;
  rigor: string;
  movilLead: string;
  stateTitle: string;
  state: string;
  stateBullets: string[];
  tagsTitle: string;
  tags: string[];
  alt: {
    grupos: string;
    metodo: string;
    sedes: string;
    arquitectura: string;
    programa: string;
    reservar: string;
    movil: string;
  };
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    tagline:
      "La academia de tenis que muestra el cupo que de verdad le queda a cada grupo",
    meta: [
      ["Estado", "Construido, a la espera de publicarse"],
      ["Entregables", "Diseño y desarrollo web, integración con Rematch"],
      ["Industria", "Academia de tenis · Lima"],
      ["Plataforma", "Web, sobre la API de Rematch"],
    ],
    statement:
      "Construimos el sitio de la Academia César Acosta encima de la API de Rematch: los grupos, los cupos, los horarios y el catálogo que ve el visitante son exactamente los que la academia tiene en su panel.",
    context:
      "La academia enseña tenis en dos clubes de Lima, del baby tenis de tres años a los adultos que compiten. Rematch —producto propio de Axium— es donde administra sus sedes, sus grupos y su tienda. El sitio no duplica nada de eso: lo consume. Está terminado y a la espera de que la academia lo publique.",
    gruposLead:
      "Cada grupo abierto llega con el cupo que le queda. «Quedan 4» no es una frase escrita a mano: es el número que la academia tiene ahora mismo en su panel.",
    gruposCaption:
      "Grupos abiertos filtrados por sede. El sitio no guarda ni un solo grupo: los pide y los pinta.",
    highlightsTitle: ["Lo que", "construimos"],
    highlights: [
      {
        lead: "Grupos",
        text: "las clases abiertas con su cupo, su sede, sus días y su horario, filtradas por club y por edad.",
      },
      {
        lead: "Programa",
        text: "la ficha de cada grupo con el horario de la semana, el día de hoy marcado y los planes con su precio.",
      },
      {
        lead: "Inscripción",
        text: "el apoderado inscribe a su hijo —o se inscribe él— eligiendo plan y horario, sin crear ninguna cuenta.",
      },
      {
        lead: "Clases particulares",
        text: "las horas que de verdad están libres, cada una con su precio, y la reserva en el mismo paso.",
      },
      {
        lead: "Tienda",
        text: "el catálogo del club con categorías, precios y stock, carrito, cotización de envío y pedido.",
      },
      {
        lead: "Método y sedes",
        text: "los cuatro pilares con los que la academia enseña, y las canchas de cada club bajo un mismo velo navy.",
      },
      {
        lead: "Integración",
        text: "todo lo anterior sale de la API v1 de Rematch, con la llave viviendo solo del lado del servidor.",
      },
      {
        lead: "Móvil primero",
        text: "es donde el padre mira: la pantalla chica se diseñó antes que la grande, no después.",
      },
    ],
    challengeTitle: "Reto",
    challenge:
      "Las academias de tenis se presentan con un horario en PDF y un número de WhatsApp. El padre que quiere inscribir a su hijo no sabe si el grupo de su edad sigue abierto, en qué sede está ni a qué hora entrena, así que escribe para preguntar lo básico y la academia contesta lo mismo veinte veces. Y cuando un grupo se llena, la página sigue diciendo «inscríbete». La Academia César Acosta ya tenía su marca y ya administraba sus grupos, sus cupos y su tienda dentro de Rematch. Lo que no tenía era una cara pública que dijera la verdad de lo que hay dentro.",
    approachTitle: "Enfoque",
    approach:
      "El sitio se construyó sobre el dato, no sobre el texto: cada sección se definió por lo que la API puede responder, y lo que la API no responde no se inventa. Encima montamos el sistema de diseño de la web —una sola familia tipográfica, Barlow, con un contraste de escala brutal; el navy #012045 como tinta de todos los títulos y como velo sobre cada fotografía; un lima escaso reservado a la acción; esquinas de 2 a 6 px, ni una píldora—. El velo es lo que hace que fotos de origen distinto (un celular, un fotógrafo, el archivo del club) se vean de la misma marca. La identidad del club ya existía y no la tocamos: lo que pusimos es cómo se comporta en pantalla.",
    actIndex: "Decisiones técnicas",
    actTitle: ["La integración con", "Rematch"],
    act: "El sitio es un storefront de un solo inquilino en Next.js: no tiene base de datos propia ni panel propio. Todo lo que muestra —sedes, grupos, cupos, horarios, planes, productos, precios y stock— se lo pide a la API v1 de Rematch, la plataforma con la que la academia ya opera todos los días. La consecuencia es la que importa: la academia sigue trabajando donde siempre, y el sitio se actualiza solo.",
    arqCaption:
      "La academia administra en el panel de Rematch · la API v1 sirve el catálogo, los grupos y los cupos · el sitio los pinta con la marca del club.",
    rigorTitle: "Lo que esa decisión obliga a resolver",
    rigor:
      "Consumir una API ajena desde el servidor trae tres problemas, y los tres se resolvieron de una vez. El primero es la llave: el módulo que habla con Rematch está marcado como de servidor, así que si alguien lo importa desde un componente de cliente el build falla en lugar de mandar la llave al navegador, donde cualquiera la leería con el inspector. Lo que el navegador necesita pasa por rutas del propio sitio, que corren en el servidor y agregan la llave ahí; y las escrituras —una inscripción, un pedido— llevan clave de idempotencia, para que un doble clic no cree dos. El segundo es el tiempo: sin un corte, una API lenta no degrada el sitio, lo cuelga —medido contra un servidor que tardaba un minuto, la página seguía sin responder a los cuarenta y cinco segundos—, así que cada petición se abandona a los cinco. El tercero es la ausencia: si un dato opcional no llega, esa sección se muestra vacía y la página sigue de pie. El build también, que era justo lo que antes impedía desplegar el sitio cuando el otro lado se caía un momento.",
    movilLead:
      "El padre mira esto de pie en la puerta del club, con una mano. Por eso la pantalla chica se diseñó antes que la grande.",
    stateTitle: "Estado",
    state:
      "El sitio está construido y funcionando contra la API en producción de Rematch: todo lo que se ve en estas pantallas —los grupos, los cupos, los horarios de la semana, los planes, las raquetas y sus precios— es el club real, leído en vivo. Queda a la espera de que la academia lo publique, así que todavía no hay tráfico ni inscripciones que contar. La prueba de este caso es lo construido y la integración funcionando.",
    stateBullets: [
      "Ocho secciones públicas: inicio, programas, ficha de programa, sedes, entrenadores, galería, tienda y contacto",
      "Cinco lecturas y cuatro escrituras contra la API v1 de Rematch, todas desde el servidor",
      "Caché por tipo de dato: la marca cada 5 minutos, el catálogo cada minuto, los cupos y las horas libres sin caché",
      "Corte a los 5 segundos y degradación por sección: la API no puede tumbar la página ni el despliegue",
    ],
    tagsTitle: "Disciplinas y stack",
    tags: [
      "Diseño web",
      "Diseño UX/UI",
      "Sistema de diseño",
      "Desarrollo web",
      "Integración de API",
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "API v1 de Rematch",
      "Cloudflare R2",
    ],
    alt: {
      grupos:
        "Grupos abiertos de la academia, cada tarjeta con el cupo que le queda, y un detalle del chip «Quedan 4»",
      metodo:
        "Los cuatro pilares del método de la academia: biomecánica, técnica, táctica y patrones de juego",
      sedes:
        "La cancha del Club El Polo a vista de dron, con el nombre de la sede encima de la foto",
      arquitectura:
        "Diagrama de la integración: el panel de Rematch, la API v1 con sus rutas y tiempos de caché, y el sitio de la academia",
      programa:
        "La ficha de un programa: el horario de la semana con el día de hoy marcado y, delante, el panel de planes con el botón de inscripción",
      reservar:
        "Las horas libres de las clases particulares con su precio y, delante, dos raquetas de la tienda del club con el suyo",
      movil:
        "El sitio de la academia en tres celulares, sobre una banca junto a la cancha",
    },
    nextTagline:
      "Una sola plataforma para todo lo que pasa en un centro deportivo",
  },
  en: {
    tagline:
      "The tennis academy that shows the places each group actually has left",
    meta: [
      ["Status", "Built, waiting to be published"],
      ["Deliverables", "Web design and development, Rematch integration"],
      ["Industry", "Tennis academy · Lima"],
      ["Platform", "Web, on top of the Rematch API"],
    ],
    statement:
      "We built the Academia César Acosta website on top of the Rematch API: the groups, the places left, the timetables and the catalogue a visitor sees are exactly the ones the academy has in its dashboard.",
    context:
      "The academy teaches tennis at two clubs in Lima, from baby tennis at three years old to adults who compete. Rematch — Axium's own product — is where it runs its venues, its groups and its store. The site duplicates none of that: it consumes it. It is finished and waiting for the academy to publish it.",
    gruposLead:
      "Every open group arrives with the places it has left. “4 left” is not a hand-written phrase: it is the number the academy has in its dashboard right now.",
    gruposCaption:
      "Open groups filtered by venue. The site stores not a single group: it asks for them and paints them.",
    highlightsTitle: ["What we", "built"],
    highlights: [
      {
        lead: "Groups",
        text: "open classes with their places left, venue, days and times, filtered by club and by age.",
      },
      {
        lead: "Programme",
        text: "a page per group with the week's timetable, today marked, and the plans with their price.",
      },
      {
        lead: "Enrolment",
        text: "a parent enrols their child — or themselves — picking plan and time slot, without creating an account.",
      },
      {
        lead: "Private lessons",
        text: "the hours that are genuinely free, each with its price, and the booking in the same step.",
      },
      {
        lead: "Store",
        text: "the club's catalogue with categories, prices and stock, cart, shipping quote and order.",
      },
      {
        lead: "Method and venues",
        text: "the four pillars the academy teaches with, and each club's courts under the same navy veil.",
      },
      {
        lead: "Integration",
        text: "all of the above comes from the Rematch v1 API, with the key living only on the server side.",
      },
      {
        lead: "Mobile first",
        text: "that is where the parent looks: the small screen was designed before the large one, not after.",
      },
    ],
    challengeTitle: "Challenge",
    challenge:
      "Tennis academies introduce themselves with a PDF timetable and a WhatsApp number. A parent who wants to enrol a child cannot tell whether the group for that age is still open, which venue it runs at or at what time, so they write in to ask the basics and the academy answers the same thing twenty times over. And when a group fills up, the page still says “sign up”. Academia César Acosta already had its brand, and already ran its groups, its places and its store inside Rematch. What it did not have was a public face that told the truth about what was inside.",
    approachTitle: "Approach",
    approach:
      "The site was built on the data, not on the copy: every section was defined by what the API can answer, and what the API cannot answer is not invented. On top of that we built the web design system — a single typeface, Barlow, with a brutal contrast of scale; navy #012045 as the ink of every heading and as a veil over every photograph; a scarce lime reserved for action; corners of 2 to 6 px, not one pill. The veil is what makes photographs from different sources (a phone, a photographer, the club's archive) look like they belong to the same brand. The club's identity already existed and we did not touch it: what we added is how it behaves on screen.",
    actIndex: "Technical decisions",
    actTitle: ["The Rematch", "integration"],
    act: "The site is a single-tenant storefront in Next.js: it has no database and no dashboard of its own. Everything it shows — venues, groups, places left, timetables, plans, products, prices and stock — it asks the Rematch v1 API for, the platform the academy already works in every day. The consequence is the one that matters: the academy keeps working where it always did, and the site updates itself.",
    arqCaption:
      "The academy manages everything in the Rematch dashboard · the v1 API serves the catalogue, the groups and the places left · the site paints them in the club's brand.",
    rigorTitle: "What that decision forces you to solve",
    rigor:
      "Consuming somebody else's API from the server brings three problems, and all three were solved at once. The first is the key: the module that talks to Rematch is marked as server-only, so if anyone imports it from a client component the build fails instead of shipping the key to the browser, where anyone could read it with the inspector. Whatever the browser needs goes through the site's own routes, which run on the server and add the key there; and writes — an enrolment, an order — carry an idempotency key, so a double click never creates two. The second is time: without a cut-off, a slow API does not degrade the site, it hangs it — measured against a server that took a minute, the page was still unresponsive after forty-five seconds — so every request is abandoned at five. The third is absence: if an optional piece of data does not arrive, that section renders empty and the page stays standing. So does the build, which was exactly what used to stop the site from deploying when the other side went down for a moment.",
    movilLead:
      "The parent looks at this standing at the club gate, one-handed. That is why the small screen was designed before the large one.",
    stateTitle: "Status",
    state:
      "The site is built and running against Rematch's production API: everything in these screens — the groups, the places left, the weekly timetables, the plans, the rackets and their prices — is the real club, read live. It is waiting for the academy to publish it, so there is no traffic or enrolment figure to report yet. The proof in this case is what was built and the integration working.",
    stateBullets: [
      "Eight public sections: home, programmes, programme page, venues, coaches, gallery, store and contact",
      "Five reads and four writes against the Rematch v1 API, all from the server",
      "Cache per kind of data: the brand every 5 minutes, the catalogue every minute, places left and free hours with no cache",
      "A 5-second cut-off and per-section degradation: the API cannot take down the page or the deploy",
    ],
    tagsTitle: "Disciplines and stack",
    tags: [
      "Web design",
      "UX/UI design",
      "Design system",
      "Web development",
      "API integration",
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Rematch v1 API",
      "Cloudflare R2",
    ],
    alt: {
      grupos:
        "The academy's open groups, each card with the places it has left, and a close-up of the “4 left” chip",
      metodo:
        "The four pillars of the academy's method: biomechanics, technique, tactics and play patterns",
      sedes:
        "The Club El Polo court seen from a drone, with the venue name over the photograph",
      arquitectura:
        "Integration diagram: the Rematch dashboard, the v1 API with its routes and cache times, and the academy's site",
      programa:
        "A programme page: the weekly timetable with today marked and, in front of it, the plans panel with the enrolment button",
      reservar:
        "The free hours for private lessons with their price and, in front, two rackets from the club's store with theirs",
      movil: "The academy's site on three phones, on a bench beside the court",
    },
    nextTagline: "One platform for everything that happens at a sports center",
  },
  pt: {
    tagline:
      "A academia de tênis que mostra a vaga que de fato resta em cada grupo",
    meta: [
      ["Status", "Construído, à espera de publicação"],
      ["Entregas", "Design e desenvolvimento web, integração com o Rematch"],
      ["Setor", "Academia de tênis · Lima"],
      ["Plataforma", "Web, sobre a API do Rematch"],
    ],
    statement:
      "Construímos o site da Academia César Acosta sobre a API do Rematch: os grupos, as vagas, os horários e o catálogo que o visitante vê são exatamente os que a academia tem no seu painel.",
    context:
      "A academia ensina tênis em dois clubes de Lima, do baby tênis de três anos aos adultos que competem. O Rematch — produto próprio da Axium — é onde ela administra suas sedes, seus grupos e sua loja. O site não duplica nada disso: consome. Está pronto e à espera de que a academia o publique.",
    gruposLead:
      "Cada grupo aberto chega com a vaga que lhe resta. «Restam 4» não é uma frase escrita à mão: é o número que a academia tem agora mesmo no seu painel.",
    gruposCaption:
      "Grupos abertos filtrados por sede. O site não guarda um único grupo: ele os pede e os pinta.",
    highlightsTitle: ["O que", "construímos"],
    highlights: [
      {
        lead: "Grupos",
        text: "as aulas abertas com sua vaga, sua sede, seus dias e seu horário, filtradas por clube e por idade.",
      },
      {
        lead: "Programa",
        text: "a página de cada grupo com o horário da semana, o dia de hoje marcado e os planos com seu preço.",
      },
      {
        lead: "Matrícula",
        text: "o responsável matricula o filho — ou a si mesmo — escolhendo plano e horário, sem criar conta.",
      },
      {
        lead: "Aulas particulares",
        text: "as horas que de fato estão livres, cada uma com seu preço, e a reserva no mesmo passo.",
      },
      {
        lead: "Loja",
        text: "o catálogo do clube com categorias, preços e estoque, carrinho, cotação de frete e pedido.",
      },
      {
        lead: "Método e sedes",
        text: "os quatro pilares com que a academia ensina, e as quadras de cada clube sob o mesmo véu navy.",
      },
      {
        lead: "Integração",
        text: "tudo isso sai da API v1 do Rematch, com a chave vivendo só do lado do servidor.",
      },
      {
        lead: "Celular primeiro",
        text: "é onde o pai olha: a tela pequena foi desenhada antes da grande, não depois.",
      },
    ],
    challengeTitle: "Desafio",
    challenge:
      "As academias de tênis se apresentam com um horário em PDF e um número de WhatsApp. O pai que quer matricular o filho não sabe se o grupo da idade dele continua aberto, em que sede fica nem a que horas treina, então escreve para perguntar o básico e a academia responde a mesma coisa vinte vezes. E quando um grupo lota, a página continua dizendo “inscreva-se”. A Academia César Acosta já tinha sua marca e já administrava seus grupos, suas vagas e sua loja dentro do Rematch. O que não tinha era uma cara pública que dissesse a verdade do que há dentro.",
    approachTitle: "Abordagem",
    approach:
      "O site foi construído sobre o dado, não sobre o texto: cada seção foi definida pelo que a API consegue responder, e o que a API não responde não se inventa. Em cima disso montamos o sistema de design da web — uma única família tipográfica, Barlow, com um contraste de escala brutal; o navy #012045 como tinta de todos os títulos e como véu sobre cada fotografia; um lima escasso reservado à ação; cantos de 2 a 6 px, nenhuma pílula. O véu é o que faz fotos de origens diferentes (um celular, um fotógrafo, o arquivo do clube) parecerem da mesma marca. A identidade do clube já existia e não a tocamos: o que colocamos foi como ela se comporta na tela.",
    actIndex: "Decisões técnicas",
    actTitle: ["A integração com o", "Rematch"],
    act: "O site é um storefront de um único inquilino em Next.js: não tem banco de dados próprio nem painel próprio. Tudo o que mostra — sedes, grupos, vagas, horários, planos, produtos, preços e estoque — ele pede à API v1 do Rematch, a plataforma com a qual a academia já opera todos os dias. A consequência é a que importa: a academia continua trabalhando onde sempre, e o site se atualiza sozinho.",
    arqCaption:
      "A academia administra no painel do Rematch · a API v1 serve o catálogo, os grupos e as vagas · o site os pinta com a marca do clube.",
    rigorTitle: "O que essa decisão obriga a resolver",
    rigor:
      "Consumir uma API de terceiros a partir do servidor traz três problemas, e os três foram resolvidos de uma vez. O primeiro é a chave: o módulo que fala com o Rematch está marcado como de servidor, então se alguém o importa de um componente de cliente o build quebra em vez de mandar a chave ao navegador, onde qualquer um a leria com o inspetor. O que o navegador precisa passa por rotas do próprio site, que rodam no servidor e acrescentam a chave ali; e as escritas — uma matrícula, um pedido — levam chave de idempotência, para que um duplo clique não crie duas. O segundo é o tempo: sem um corte, uma API lenta não degrada o site, ela o pendura — medido contra um servidor que demorava um minuto, a página continuava sem responder aos quarenta e cinco segundos —, então cada requisição é abandonada aos cinco. O terceiro é a ausência: se um dado opcional não chega, aquela seção aparece vazia e a página segue de pé. O build também, que era justamente o que antes impedia publicar o site quando o outro lado caía por um momento.",
    movilLead:
      "O pai olha isto de pé na porta do clube, com uma mão só. Por isso a tela pequena foi desenhada antes da grande.",
    stateTitle: "Estado",
    state:
      "O site está construído e funcionando contra a API em produção do Rematch: tudo o que se vê nestas telas — os grupos, as vagas, os horários da semana, os planos, as raquetes e seus preços — é o clube real, lido ao vivo. Fica à espera de que a academia o publique, então ainda não há tráfego nem matrículas para contar. A prova deste caso é o construído e a integração funcionando.",
    stateBullets: [
      "Oito seções públicas: início, programas, página de programa, sedes, treinadores, galeria, loja e contato",
      "Cinco leituras e quatro escritas contra a API v1 do Rematch, todas a partir do servidor",
      "Cache por tipo de dado: a marca a cada 5 minutos, o catálogo a cada minuto, as vagas e as horas livres sem cache",
      "Corte aos 5 segundos e degradação por seção: a API não pode derrubar a página nem o deploy",
    ],
    tagsTitle: "Disciplinas e stack",
    tags: [
      "Design web",
      "Design UX/UI",
      "Sistema de design",
      "Desenvolvimento web",
      "Integração de API",
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "API v1 do Rematch",
      "Cloudflare R2",
    ],
    alt: {
      grupos:
        "Grupos abertos da academia, cada card com a vaga que lhe resta, e um detalhe do chip «Restam 4»",
      metodo:
        "Os quatro pilares do método da academia: biomecânica, técnica, tática e padrões de jogo",
      sedes:
        "A quadra do Club El Polo vista de drone, com o nome da sede sobre a foto",
      arquitectura:
        "Diagrama da integração: o painel do Rematch, a API v1 com suas rotas e tempos de cache, e o site da academia",
      programa:
        "A página de um programa: o horário da semana com o dia de hoje marcado e, à frente, o painel de planos com o botão de matrícula",
      reservar:
        "As horas livres das aulas particulares com seu preço e, à frente, duas raquetes da loja do clube com o seu",
      movil:
        "O site da academia em três celulares, sobre um banco ao lado da quadra",
    },
    nextTagline:
      "Uma só plataforma para tudo o que acontece em um centro esportivo",
  },
};

function bloques(c: Copy): StoryBlock[] {
  return [
    {
      kind: "wide",
      lead: c.gruposLead,
      image: {
        src: `${IMG}/ca-grupos.jpg`,
        alt: c.alt.grupos,
        mobileSrc: `${IMG}/ca-grupos-movil.jpg`,
        caption: c.gruposCaption,
      },
    },
    { kind: "highlights", title: c.highlightsTitle, items: c.highlights },
    { kind: "text", title: c.challengeTitle, body: c.challenge },
    { kind: "text", title: c.approachTitle, body: c.approach },
    {
      kind: "pair",
      images: [
        { src: `${IMG}/ca-metodo.jpg`, alt: c.alt.metodo },
        { src: `${IMG}/ca-sedes.jpg`, alt: c.alt.sedes },
      ],
    },
    {
      kind: "act",
      id: "integracion",
      index: c.actIndex,
      title: c.actTitle,
      body: c.act,
    },
    {
      kind: "wide",
      image: {
        src: `${IMG}/ca-arquitectura.jpg`,
        alt: c.alt.arquitectura,
        mobileSrc: `${IMG}/ca-arquitectura-movil.jpg`,
        caption: c.arqCaption,
      },
    },
    { kind: "text", title: c.rigorTitle, body: c.rigor },
    // Una sola pieza por idea en vez de cuatro cuadrados del mismo molde
    // (Alexander, 2026-09-30: «muchas caps redundantes, o que podrían estar
    // en una sola imagen»). El horario y la reserva son la MISMA pantalla real.
    {
      kind: "wide",
      image: {
        src: `${IMG}/ca-programa.jpg`,
        alt: c.alt.programa,
        mobileSrc: `${IMG}/ca-programa-movil.jpg`,
      },
    },
    {
      kind: "wide",
      image: {
        src: `${IMG}/ca-reservar.jpg`,
        alt: c.alt.reservar,
        mobileSrc: `${IMG}/ca-reservar-movil.jpg`,
      },
    },
    {
      kind: "wide",
      lead: c.movilLead,
      image: {
        src: `${IMG}/ca-movil.jpg`,
        alt: c.alt.movil,
        mobileSrc: `${IMG}/ca-movil-movil.jpg`,
      },
    },
    {
      kind: "text",
      id: "resultado",
      title: c.stateTitle,
      body: c.state,
      bullets: c.stateBullets,
    },
    { kind: "tags", title: c.tagsTitle, items: c.tags },
  ];
}

export default function CesaracostaContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseStory
        name="Academia César Acosta"
        tagline={c.tagline}
        heroImage={`${IMG}/ca-hero.jpg`}
        heroPosition="68% 50%"
        logo={{ src: `${IMG}/ca-logo.png`, width: 1200, height: 468 }}
        // Sin liveUrl a propósito: el sitio está construido y aún no publicado.
        meta={c.meta}
        statement={c.statement}
        context={c.context}
        blocks={bloques(c)}
        next={{
          name: "Rematch",
          tagline: c.nextTagline,
          href: "/casos-de-exito/rematch",
          image: "/images/proyects/rematch/rematch-portada-agenda.jpg",
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
