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
 * Ficha de Rematch al modelo Pixelmatters (pixelmatters.com/work/amigo), 2026-10-06.
 * Alexander: «intenta hacer uno así para rematch… actualiza las portadas larga y
 * cuadrada y todo el use case».
 *
 * ── DE DÓNDE SALE CADA COSA ────────────────────────────────────────────────────────
 *  · Interfaz: TODA real. rematch.pe y live.rematch.pe capturados en vivo con
 *    Playwright el 2026-10-06 (viewports reales, componentes a 3x); el panel, de las
 *    capturas del repo en local con el inquilino de demostración «Equipo Axium»
 *    (el panel no cambió con el rediseño de las webs). Ni un píxel de UI generado.
 *  · Vídeos: fotogramas reales de las webs en vivo; la agenda, con el screencast de
 *    Chrome (la anima motion/react en tiempo real).
 *  · Fotos: escenas de OpenAI (gpt-image-2.5-flare) con las pantallas APAGADAS; la
 *    captura real se compone encima por homografía. Personas, todas distintas.
 *  · Marca: el brief (nombre y personalidad) de docs/MARKETING_AND_BRAND_GUIDE.md del repo y,
 *    todo lo demás, del MANUAL DE MARCA entregado (Descargas/ENTREGA FINAL-REMATCH-ABRIL-2026):
 *    páginas recortadas, la paleta y los mockups tal cual (scripts/manual-rematch.py). Alexander,
 *    2026-10-06: «usa eso para el manual de marca, no inventes taaanto».
 *  · Cita: textual, de la sección de testimonios de rematch.pe.
 *  · Cifras: medidas en el código (prisma/schema.prisma): 8 formatos en
 *    `TournamentFormat`, 5 modelos de marcador por deporte, y `FieldOccupancy` como
 *    única fuente de verdad del calendario.
 * Taller y receta: .claude/skills/portafolio-axium/CASO-REMATCH.md § 14.
 */

const IMG = "/images/proyects/rematch";

type PieClave =
  | "manualLogo"
  | "manualColor"
  | "manualTipografia"
  | "manualPaleta"
  | "glosario"
  | "iconos"
  | "torneo"
  | "asistente"
  | "precio"
  | "liga";

type Copy = {
  titulo: string;
  heroeAlt: string;
  meta: CaseProductoProps["meta"];
  contexto: [string, string];
  reto: [string, string];
  enfoque: string;
  marca: [string, string];
  valores: { titulo: string; texto: string }[];
  identidadTexto: string;
  lineaTexto: string;
  /** Pie de cada pieza de las tiras (segunda vuelta: el relato va pegado a la pieza). */
  pies: Record<PieClave, string>;
  etiquetaManual: string;
  mandos: { anterior: string; siguiente: string };
  pasosTexto: string;
  celular: string;
  puertas: [string, string];
  sistemas: string;
  codigo: [string, string];
  carrusel: string;
  alt: Record<
    | "web"
    | "recepcion"
    | "banca"
    | "entrenadora"
    | "movil"
    | "torneo"
    | "asistente"
    | "precio"
    | "liga"
    | "moviles"
    | "duenio"
    | "componentes"
    | "agenda"
    | "fachada"
    | "manualLogo"
    | "manualColor"
    | "manualTipografia"
    | "manualPaleta"
    | "glosario"
    | "redes"
    | "taza"
    | "credencial"
    | "papeleria"
    | "iconos"
    | "jugadores"
    | "pasos",
    string
  >;
  cita: CaseProductoProps["cita"];
  cta: CaseProductoProps["cta"];
  resultado: CaseProductoProps["resultado"];
  nextTagline: string;
};

const CITA = {
  nombre: "César Acosta",
  iniciales: "CA",
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    titulo: "Una plataforma para clubes deportivos, construida desde cero",
    heroeAlt:
      "Un celular con rematch.pe apoyado en el césped azul de una pista de pádel, con la sombra de la reja al atardecer",
    meta: {
      tipologia: ["Tipología", ["Web app", "Panel de gestión", "Sitio web"]],
      industria: ["Industria", "Deporte · SaaS propio"],
      anio: ["Año", "2026"],
      servicios: [
        "Servicios",
        [
          "Naming",
          "Identidad de marca",
          "Sistema de íconos",
          "Diseño de producto",
          "Desarrollo web",
          "Plataforma SaaS",
        ],
      ],
      entregables: [
        "Entregables",
        [
          "Manual de marca",
          "Línea gráfica",
          "29 íconos",
          "rematch.pe",
          "live.rematch.pe",
          "Panel del club",
        ],
      ],
      vivo: ["En vivo", "rematch.pe", "https://rematch.pe"],
    },
    contexto: [
      "Contexto",
      "Los clubes llevaban las reservas por WhatsApp, las clases en hojas de cálculo y los torneos en papel. Rematch nació en Axium para ordenar todo eso en un solo sistema, con pagos en línea y resultados en vivo.",
    ],
    reto: [
      "El reto",
      "Que el dueño de un club lo maneje sin capacitación y que el jugador reserve y pague desde el celular, con el mismo calendario detrás para los dos.",
    ],
    enfoque:
      "Lo construimos por módulos sobre una sola base de canchas, clientes y cobros. Reservas, academias, ligas, torneos y tienda salieron a producción uno por uno, y cada uno se ajustó con los clubes que ya lo usaban.",
    marca: [
      "Una marca que habla del juego",
      "Se llamaba Reservo, que nombraba el trámite. Lo rebautizamos Rematch —la revancha, el partido que se juega otra vez— y escribimos el brief de su personalidad: eficiente, accesible y activa.",
    ],
    valores: [
      {
        titulo: "Eficiente.",
        texto:
          "Una herramienta que te ahorra tiempo, no una que te lo complica.",
      },
      {
        titulo: "Accesible.",
        texto:
          "El dueño de un complejo familiar no debe sentir que usa software de empresa.",
      },
      {
        titulo: "Activa.",
        texto: "Le habla a quien ama el deporte, no solo a quien administra.",
      },
    ],
    identidadTexto:
      "Con ese brief diseñamos la identidad y su manual de marca: logotipo principal, secundario e ícono, sus versiones de color, el área de respeto y los usos incorrectos.",
    lineaTexto:
      "La línea gráfica lleva la marca a las redes, a la publicidad y al propio club: posts, credenciales, papelería, señalética y merchandising.",
    pies: {
      manualLogo: "Logotipo principal, secundario e ícono",
      manualColor: "Versiones de color, sobre fondos claros y oscuros",
      manualTipografia:
        "Loos Condensed para los titulares y Halyard Display para el texto",
      manualPaleta: "Cinco colores, con su código para pantalla e imprenta",
      glosario:
        "La voz: «Match confirmado. Cancha 4, 20:00 hrs.» Y un glosario: jugador, no cliente; aliado, no dueño; slot, no hueco",
      iconos: "29 íconos propios para el producto, en SVG",
      torneo: "La tarjeta de un torneo publicado en live.rematch.pe",
      asistente: "El asistente que arma un torneo paso a paso",
      precio: "El plan Profesional, en soles",
      liga: "La tabla de una liga: resultados cruzados, quién sube y quién baja",
    },
    etiquetaManual: "Piezas del manual de marca",
    mandos: { anterior: "Anterior", siguiente: "Siguiente" },
    pasosTexto:
      "Empezar no pide instalar nada: el club elige lo que usa, carga sus canchas y comparte su enlace. Las ilustraciones de rematch.pe repiten en bucle exactamente eso.",
    celular:
      "Todo funciona desde el navegador del celular: el jugador no instala nada para reservar, inscribirse en un torneo o pagar su mensualidad.",
    puertas: [
      "Dos puertas, un mismo sistema",
      "rematch.pe es la puerta del club: agenda, cobros, academia, torneos y tienda. live.rematch.pe es la del jugador: busca canchas, entra a una academia, se inscribe en torneos y sigue cada marcador en vivo.",
    ],
    sistemas:
      "El panel tiene su propio sistema de diseño, pensado para quien pasa el día operando el club; las webs públicas usan el de la marca. Los dos comparten el mismo código y los mismos componentes de base.",
    codigo: [
      "Diseño y código en el mismo equipo",
      "Axium diseñó el producto y lo programó con Next.js, tRPC, Prisma y PostgreSQL, con pagos de Mercado Pago y marcadores en tiempo real. Quien dibuja una pantalla es quien la lleva a producción y la mantiene.",
    ],
    carrusel: "Piezas de Rematch: torneo, asistente, precios y liga",
    alt: {
      fachada:
        "Maqueta del logotipo de Rematch en relieve sobre la fachada de vidrio de un edificio",
      manualLogo:
        "Página del manual de marca: el logotipo principal, el secundario y el ícono sobre lima",
      manualColor:
        "Versiones de color del logotipo: sobre lima, azul prusia, azul marino, blanco, lima oscuro y negro",
      manualTipografia:
        "Las tipografías de marca en el manual: Loos Condensed para titulares y Halyard Display para textos",
      manualPaleta:
        "La paleta de Rematch: lima limón, azul prusia, azul marino, blanco y lima oscuro, con sus códigos HEX, RGB y CMYK",
      glosario:
        "El glosario del manual de marca: qué palabras usa Rematch, cuáles evita y por qué",
      redes:
        "Tres posts de Instagram de la línea gráfica de Rematch, con deportistas y la marca en lima",
      taza: "Maqueta de una taza con el logotipo secundario de Rematch",
      credencial:
        "Maqueta de la credencial de un gestor de reservas con la cinta lima de Rematch",
      papeleria:
        "Maqueta de la papelería de Rematch: hoja membretada, tarjetas, carpeta y una tableta con la web",
      iconos:
        "Los 29 íconos propios de Rematch, sobre fondo claro y sobre la tinta",
      jugadores:
        "En live.rematch.pe el marcador de una mesa se carga set por set, con la llave, el grupo y la liga alrededor",
      pasos:
        "Los tres pasos de rematch.pe, animados: elegir los módulos, cargar las canchas y recibir la primera reserva pagada",
      web: "rematch.pe en un navegador: la portada y el panel con sus pestañas de agenda, cobros, academia, torneos y tienda",
      recepcion:
        "Un portátil en la recepción de un club de pádel con el calendario de reservas del panel de Rematch",
      banca:
        "Un celular de pie sobre una mesa del café del club con la página de academias de rematch.pe",
      entrenadora:
        "Una entrenadora revisa su celular; al lado, la lista de alumnos de la academia con su plan al día",
      movil:
        "rematch.pe en el celular, recorriendo la agenda del día, el panel y los tres pasos para empezar",
      torneo: "La tarjeta de un torneo publicado en live.rematch.pe",
      asistente: "El asistente del panel: ¿qué tipo de torneo vas a organizar?",
      precio: "El plan Profesional de rematch.pe: S/ 58 al mes",
      liga: "La tabla de la División 1 de una liga, con los resultados cruzados y quién sube y quién baja",
      moviles:
        "Tres pantallas móviles: torneos y ligas en rematch.pe, cómo quieres jugar en live.rematch.pe y los precios en soles",
      duenio:
        "El dueño de un club al teléfono; al lado, la cobranza de la academia: catorce alumnos al día y la deuda pendiente",
      componentes:
        "Componentes reales de Rematch: buscador, píldora de novedades, botones, reservas pagadas y nuevas, horarios y deportes",
      agenda:
        "El jugador elige un horario y paga en el celular, y la reserva aparece en la agenda del club como nueva",
    },
    cita: {
      ...CITA,
      texto:
        "«Llevábamos horarios, asistencias y pagos entre cuadernos y chats. Ahora cada profesor ve sus clases, los alumnos pagan en línea y la tienda de la academia está en el mismo lugar.»",
      cargo: "Director · Academia César Acosta",
    },
    cta: {
      titulo: "¿Tienes un producto en mente?",
      texto:
        "Lo diseñamos y lo construimos contigo, de la primera pantalla a producción, como hicimos con Rematch.",
      boton: "Hablemos",
      href: "#contacto",
    },
    resultado: {
      titulo: "El resultado",
      texto:
        "Rematch está en producción en rematch.pe y live.rematch.pe. Clubes, academias y organizadores reservan, cobran y llevan sus torneos en un solo panel, y los jugadores siguen cada partido desde el celular.",
      cifras: [
        {
          valor: "8",
          texto: "formatos de torneo, de la fase de grupos al sistema suizo",
        },
        {
          valor: "5",
          texto:
            "deportes con marcador propio: tenis de mesa, tenis, fútbol, vóley y básquet",
        },
        {
          valor: "1",
          texto: "calendario para reservas, clases, partidos de liga y torneos",
        },
      ],
    },
    nextTagline: "La plataforma de cursos para academias e instituciones",
  },
  en: {
    titulo: "A platform for sports clubs, built from the ground up",
    heroeAlt:
      "A phone showing rematch.pe resting on the blue turf of a padel court, with the fence shadow at sunset",
    meta: {
      tipologia: ["Typology", ["Web app", "Admin panel", "Website"]],
      industria: ["Industry", "Sports · In-house SaaS"],
      anio: ["Year", "2026"],
      servicios: [
        "Services",
        [
          "Naming",
          "Brand identity",
          "Icon system",
          "Product design",
          "Web development",
          "SaaS platform",
        ],
      ],
      entregables: [
        "Deliverables",
        [
          "Brand manual",
          "Graphic line",
          "29 icons",
          "rematch.pe",
          "live.rematch.pe",
          "Club panel",
        ],
      ],
      vivo: ["Live", "rematch.pe", "https://rematch.pe"],
    },
    contexto: [
      "Background",
      "Clubs ran bookings over WhatsApp, classes in spreadsheets and tournaments on paper. Rematch was born at Axium to bring all of it into one system, with online payments and live results.",
    ],
    reto: [
      "Challenge",
      "A club owner should run it without training, and a player should book and pay from their phone, with the same calendar behind both.",
    ],
    enfoque:
      "We built it in modules on a single base of courts, customers and payments. Bookings, academies, leagues, tournaments and the shop shipped one at a time, each one refined with the clubs already using it.",
    marca: [
      "A brand that speaks about the game",
      "It was called Reservo, which named the chore. We renamed it Rematch —the second match, the game played again— and wrote the brief for its personality: efficient, approachable and active.",
    ],
    valores: [
      {
        titulo: "Efficient.",
        texto: "A tool that saves you time, not one that makes it harder.",
      },
      {
        titulo: "Approachable.",
        texto:
          "The owner of a family-run complex shouldn't feel they're using enterprise software.",
      },
      {
        titulo: "Active.",
        texto:
          "It speaks to people who love sport, not only to the ones who manage it.",
      },
    ],
    identidadTexto:
      "From that brief we designed the identity and its brand manual: primary logo, secondary logo and symbol, their colour versions, clear space and misuse.",
    lineaTexto:
      "The graphic line takes the brand to social media, advertising and the club itself: posts, badges, stationery, signage and merchandise.",
    pies: {
      manualLogo: "Primary logo, secondary logo and symbol",
      manualColor: "Colour versions, on light and dark backgrounds",
      manualTipografia:
        "Loos Condensed for headlines and Halyard Display for text",
      manualPaleta: "Five colours, with their codes for screen and print",
      glosario:
        "The voice: “Match confirmed. Court 4, 8 pm.” And a glossary: player, not customer; partner, not owner; slot, not gap",
      iconos: "29 custom icons for the product, in SVG",
      torneo: "A tournament card published on live.rematch.pe",
      asistente: "The wizard that sets up a tournament step by step",
      precio: "The Professional plan, in soles",
      liga: "A league table: head-to-head results, who goes up and who goes down",
    },
    etiquetaManual: "Brand manual pieces",
    mandos: { anterior: "Previous", siguiente: "Next" },
    pasosTexto:
      "Getting started takes no install: the club picks what it uses, loads its courts and shares its link. The illustrations on rematch.pe loop exactly that.",
    celular:
      "Everything runs in the phone's browser: players install nothing to book a court, enter a tournament or pay their monthly fee.",
    puertas: [
      "Two doors, one system",
      "rematch.pe is the club's door: schedule, payments, academy, tournaments and shop. live.rematch.pe is the player's: find courts, join an academy, enter tournaments and follow every score live.",
    ],
    sistemas:
      "The panel has its own design system, made for people who run the club all day; the public sites use the brand's. Both share the same codebase and the same base components.",
    codigo: [
      "Design and code in one team",
      "Axium designed the product and built it with Next.js, tRPC, Prisma and PostgreSQL, with Mercado Pago payments and real-time scores. Whoever draws a screen ships it to production and maintains it.",
    ],
    carrusel: "Rematch pieces: tournament, wizard, pricing and league",
    alt: {
      fachada:
        "Mockup of the Rematch logo in relief on a building's glass façade",
      manualLogo:
        "Brand manual page: the primary logo, the secondary logo and the symbol on lime",
      manualColor:
        "Colour versions of the logo: on lime, Prussian blue, navy, white, dark lime and black",
      manualTipografia:
        "The brand typefaces in the manual: Loos Condensed for headlines and Halyard Display for text",
      manualPaleta:
        "The Rematch palette: lime, Prussian blue, navy, white and dark lime, with their HEX, RGB and CMYK codes",
      glosario:
        "The brand manual glossary: which words Rematch uses, which it avoids and why",
      redes:
        "Three Instagram posts from Rematch's graphic line, with athletes and the brand in lime",
      taza: "Mockup of a mug with Rematch's secondary logo",
      credencial:
        "Mockup of a booking manager's ID badge on Rematch's lime lanyard",
      papeleria:
        "Mockup of Rematch stationery: letterhead, cards, folder and a tablet showing the website",
      iconos: "Rematch's 29 custom icons, on a light background and on ink",
      jugadores:
        "On live.rematch.pe a table's score loads set by set, with the bracket, the group and the league around it",
      pasos:
        "The three steps on rematch.pe, animated: picking modules, loading courts and receiving the first paid booking",
      web: "rematch.pe in a browser: the homepage and the panel with its schedule, payments, academy, tournaments and shop tabs",
      recepcion:
        "A laptop at the front desk of a padel club showing the booking calendar of the Rematch panel",
      banca:
        "A phone standing on a table in the club lounge showing the academies page of rematch.pe",
      entrenadora:
        "A coach checks her phone; beside her, the academy's student list with their plans up to date",
      movil:
        "rematch.pe on a phone, scrolling through today's schedule, the panel and the three steps to get started",
      torneo: "The card of a tournament published on live.rematch.pe",
      asistente:
        "The panel wizard: what kind of tournament are you organising?",
      precio: "The Professional plan on rematch.pe: S/ 58 a month",
      liga: "A league's Division 1 table, with head-to-head results and who moves up and down",
      moviles:
        "Three mobile screens: tournaments and leagues on rematch.pe, how you want to play on live.rematch.pe and pricing in soles",
      duenio:
        "A club owner on the phone; beside him, the academy's collections: fourteen students up to date and the pending balance",
      componentes:
        "Real Rematch components: search, news pill, buttons, paid and new bookings, time slots and sports",
      agenda:
        "The player picks a time and pays on their phone, and the booking appears in the club's schedule as new",
    },
    cita: {
      ...CITA,
      texto:
        "“We kept schedules, attendance and payments across notebooks and chats. Now every coach sees their classes, students pay online and the academy shop is in the same place.”",
      cargo: "Director · César Acosta Academy",
    },
    cta: {
      titulo: "Have a product in mind?",
      texto:
        "We design and build it with you, from the first screen to production, just like we did with Rematch.",
      boton: "Let's talk",
      href: "#contacto",
    },
    resultado: {
      titulo: "The result",
      texto:
        "Rematch is live at rematch.pe and live.rematch.pe. Clubs, academies and organisers book, collect and run their tournaments from one panel, and players follow every match from their phones.",
      cifras: [
        {
          valor: "8",
          texto: "tournament formats, from group stages to the Swiss system",
        },
        {
          valor: "5",
          texto:
            "sports with their own scoreboard: table tennis, tennis, football, volleyball and basketball",
        },
        {
          valor: "1",
          texto:
            "calendar for bookings, classes, league matches and tournaments",
        },
      ],
    },
    nextTagline: "The course platform for academies and institutions",
  },
  pt: {
    titulo: "Uma plataforma para clubes esportivos, construída do zero",
    heroeAlt:
      "Um celular com o rematch.pe apoiado na grama azul de uma quadra de padel, com a sombra da grade ao entardecer",
    meta: {
      tipologia: ["Tipologia", ["Web app", "Painel de gestão", "Site"]],
      industria: ["Setor", "Esporte · SaaS próprio"],
      anio: ["Ano", "2026"],
      servicios: [
        "Serviços",
        [
          "Naming",
          "Identidade de marca",
          "Sistema de ícones",
          "Design de produto",
          "Desenvolvimento web",
          "Plataforma SaaS",
        ],
      ],
      entregables: [
        "Entregáveis",
        [
          "Manual de marca",
          "Linha gráfica",
          "29 ícones",
          "rematch.pe",
          "live.rematch.pe",
          "Painel do clube",
        ],
      ],
      vivo: ["Ao vivo", "rematch.pe", "https://rematch.pe"],
    },
    contexto: [
      "Contexto",
      "Os clubes faziam as reservas pelo WhatsApp, as aulas em planilhas e os torneios no papel. O Rematch nasceu na Axium para organizar tudo isso em um só sistema, com pagamentos online e resultados ao vivo.",
    ],
    reto: [
      "O desafio",
      "Que o dono de um clube o use sem treinamento e que o jogador reserve e pague pelo celular, com o mesmo calendário por trás para os dois.",
    ],
    enfoque:
      "Construímos por módulos sobre uma só base de quadras, clientes e cobranças. Reservas, academias, ligas, torneios e loja entraram em produção um a um, e cada um foi ajustado com os clubes que já o usavam.",
    marca: [
      "Uma marca que fala do jogo",
      "Chamava-se Reservo, que nomeava o trâmite. Rebatizamos como Rematch —a revanche, a partida que se joga outra vez— e escrevemos o briefing da sua personalidade: eficiente, acessível e ativa.",
    ],
    valores: [
      {
        titulo: "Eficiente.",
        texto: "Uma ferramenta que economiza seu tempo, não uma que complica.",
      },
      {
        titulo: "Acessível.",
        texto:
          "O dono de um complexo familiar não deve sentir que usa software de empresa.",
      },
      {
        titulo: "Ativa.",
        texto: "Fala com quem ama o esporte, não só com quem administra.",
      },
    ],
    identidadTexto:
      "Com esse briefing desenhamos a identidade e o seu manual de marca: logotipo principal, secundário e ícone, as versões de cor, a área de proteção e os usos incorretos.",
    lineaTexto:
      "A linha gráfica leva a marca às redes, à publicidade e ao próprio clube: posts, crachás, papelaria, sinalização e brindes.",
    pies: {
      manualLogo: "Logotipo principal, secundário e ícone",
      manualColor: "Versões de cor, sobre fundos claros e escuros",
      manualTipografia:
        "Loos Condensed para os títulos e Halyard Display para o texto",
      manualPaleta: "Cinco cores, com seus códigos para tela e impressão",
      glosario:
        "A voz: «Match confirmado. Quadra 4, 20h.» E um glossário: jogador, não cliente; parceiro, não dono; slot, não brecha",
      iconos: "29 ícones próprios para o produto, em SVG",
      torneo: "O cartão de um torneio publicado no live.rematch.pe",
      asistente: "O assistente que monta um torneio passo a passo",
      precio: "O plano Profissional, em soles",
      liga: "A tabela de uma liga: resultados cruzados, quem sobe e quem desce",
    },
    etiquetaManual: "Peças do manual de marca",
    mandos: { anterior: "Anterior", siguiente: "Próximo" },
    pasosTexto:
      "Começar não exige instalar nada: o clube escolhe o que usa, carrega suas quadras e compartilha seu link. As ilustrações do rematch.pe repetem em loop exatamente isso.",
    celular:
      "Tudo funciona no navegador do celular: o jogador não instala nada para reservar, se inscrever em um torneio ou pagar a mensalidade.",
    puertas: [
      "Duas portas, um mesmo sistema",
      "rematch.pe é a porta do clube: agenda, cobranças, academia, torneios e loja. live.rematch.pe é a do jogador: busca quadras, entra em uma academia, se inscreve em torneios e acompanha cada placar ao vivo.",
    ],
    sistemas:
      "O painel tem seu próprio sistema de design, pensado para quem passa o dia operando o clube; os sites públicos usam o da marca. Os dois compartilham o mesmo código e os mesmos componentes de base.",
    codigo: [
      "Design e código na mesma equipe",
      "A Axium desenhou o produto e o programou com Next.js, tRPC, Prisma e PostgreSQL, com pagamentos do Mercado Pago e placares em tempo real. Quem desenha uma tela é quem a leva à produção e a mantém.",
    ],
    carrusel: "Peças do Rematch: torneio, assistente, preços e liga",
    alt: {
      fachada:
        "Mockup do logotipo do Rematch em relevo na fachada de vidro de um prédio",
      manualLogo:
        "Página do manual de marca: o logotipo principal, o secundário e o ícone sobre lima",
      manualColor:
        "Versões de cor do logotipo: sobre lima, azul-da-prússia, azul-marinho, branco, lima escuro e preto",
      manualTipografia:
        "As tipografias da marca no manual: Loos Condensed para títulos e Halyard Display para textos",
      manualPaleta:
        "A paleta do Rematch: lima, azul-da-prússia, azul-marinho, branco e lima escuro, com seus códigos HEX, RGB e CMYK",
      glosario:
        "O glossário do manual de marca: que palavras o Rematch usa, quais evita e por quê",
      redes:
        "Três posts de Instagram da linha gráfica do Rematch, com atletas e a marca em lima",
      taza: "Mockup de uma caneca com o logotipo secundário do Rematch",
      credencial:
        "Mockup do crachá de um gestor de reservas com a fita lima do Rematch",
      papeleria:
        "Mockup da papelaria do Rematch: papel timbrado, cartões, pasta e um tablet com o site",
      iconos:
        "Os 29 ícones próprios do Rematch, sobre fundo claro e sobre a tinta",
      jugadores:
        "No live.rematch.pe o placar de uma mesa é carregado set a set, com a chave, o grupo e a liga ao redor",
      pasos:
        "Os três passos do rematch.pe, animados: escolher os módulos, carregar as quadras e receber a primeira reserva paga",
      web: "rematch.pe em um navegador: a página inicial e o painel com as abas de agenda, cobranças, academia, torneios e loja",
      recepcion:
        "Um notebook na recepção de um clube de padel com o calendário de reservas do painel do Rematch",
      banca:
        "Um celular em pé sobre uma mesa do café do clube com a página de academias do rematch.pe",
      entrenadora:
        "Uma treinadora olha o celular; ao lado, a lista de alunos da academia com o plano em dia",
      movil:
        "rematch.pe no celular, percorrendo a agenda do dia, o painel e os três passos para começar",
      torneo: "O cartão de um torneio publicado no live.rematch.pe",
      asistente:
        "O assistente do painel: que tipo de torneio você vai organizar?",
      precio: "O plano Profissional do rematch.pe: S/ 58 por mês",
      liga: "A tabela da Divisão 1 de uma liga, com os resultados cruzados e quem sobe e quem desce",
      moviles:
        "Três telas móveis: torneios e ligas no rematch.pe, como você quer jogar no live.rematch.pe e os preços em soles",
      duenio:
        "O dono de um clube ao telefone; ao lado, a cobrança da academia: catorze alunos em dia e a dívida pendente",
      componentes:
        "Componentes reais do Rematch: busca, pílula de novidades, botões, reservas pagas e novas, horários e esportes",
      agenda:
        "O jogador escolhe um horário e paga no celular, e a reserva aparece na agenda do clube como nova",
    },
    cita: {
      ...CITA,
      texto:
        "“Levávamos horários, presenças e pagamentos entre cadernos e chats. Agora cada professor vê suas aulas, os alunos pagam online e a loja da academia está no mesmo lugar.”",
      cargo: "Diretor · Academia César Acosta",
    },
    cta: {
      titulo: "Tem um produto em mente?",
      texto:
        "Nós o desenhamos e o construímos com você, da primeira tela à produção, como fizemos com o Rematch.",
      boton: "Vamos conversar",
      href: "#contacto",
    },
    resultado: {
      titulo: "O resultado",
      texto:
        "O Rematch está em produção em rematch.pe e live.rematch.pe. Clubes, academias e organizadores reservam, cobram e conduzem seus torneios em um só painel, e os jogadores acompanham cada partida pelo celular.",
      cifras: [
        {
          valor: "8",
          texto: "formatos de torneio, da fase de grupos ao sistema suíço",
        },
        {
          valor: "5",
          texto:
            "esportes com placar próprio: tênis de mesa, tênis, futebol, vôlei e basquete",
        },
        {
          valor: "1",
          texto: "calendário para reservas, aulas, partidas de liga e torneios",
        },
      ],
    },
    nextTagline: "A plataforma de cursos para academias e instituições",
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

function bloques(c: Copy): BloqueProducto[] {
  const pie = (k: PieClave, medio: Medio, ratio?: number) => ({
    medio,
    ratio,
    pie: c.pies[k],
  });
  return [
    { kind: "texto", lado: "izq", title: c.contexto[0], body: c.contexto[1] },
    {
      kind: "ancho",
      medio: vid("rm-web", c.alt.web),
      ratio: 16 / 9,
      inset: true,
    },
    // Segunda vuelta (2026-10-06): dos tiras en toda la ficha (manual y pantallas); el
    // resto, rejillas y vídeos a todo el ancho, con aire («haz un intermedio»).
    { kind: "texto", lado: "der", title: c.reto[0], body: c.reto[1] },
    {
      kind: "trio",
      medios: [
        img("rm-recepcion-v3.jpg", c.alt.recepcion),
        img("rm-mesa-v2.jpg", c.alt.banca),
        img("rm-entrenadora.jpg", c.alt.entrenadora),
      ],
    },
    // ── La marca: del brief del repo y del MANUAL DE MARCA entregado (nada dibujado aquí) ──
    { kind: "texto", lado: "izq", title: c.marca[0], body: c.marca[1] },
    { kind: "valores", items: c.valores },
    {
      kind: "capitulo",
      body: c.identidadTexto,
      etiqueta: c.etiquetaManual,
      piezas: [
        pie("manualLogo", img("rm-manual-logo.jpg", c.alt.manualLogo)),
        pie("manualColor", img("rm-manual-color.jpg", c.alt.manualColor)),
        pie(
          "manualTipografia",
          img("rm-manual-tipografia.jpg", c.alt.manualTipografia)
        ),
        pie("manualPaleta", img("rm-manual-paleta.jpg", c.alt.manualPaleta)),
        pie("glosario", img("rm-manual-glosario.jpg", c.alt.glosario), 16 / 9),
        pie("iconos", img("rm-marca-iconos.jpg", c.alt.iconos), 1.75),
      ],
    },
    { kind: "texto", lado: "der", body: c.lineaTexto },
    {
      kind: "ancho",
      medio: img("rm-apl-fachada.jpg", c.alt.fachada),
      ratio: 1.75,
    },
    {
      kind: "trio",
      medios: [
        img("rm-apl-taza.jpg", c.alt.taza),
        img("rm-apl-credencial.jpg", c.alt.credencial),
        img("rm-apl-papeleria.jpg", c.alt.papeleria),
      ],
    },
    {
      kind: "ancho",
      medio: img("rm-manual-redes.jpg", c.alt.redes),
      ratio: 2,
    },
    // ── El producto ──
    { kind: "texto", lado: "izq", body: c.enfoque },
    { kind: "ancho", medio: vid("rm-movil", c.alt.movil), ratio: 2240 / 1612 },
    {
      kind: "capitulo",
      body: c.celular,
      etiqueta: c.carrusel,
      piezas: [
        pie("torneo", img("rm-c-torneo-v2.jpg", c.alt.torneo)),
        pie("asistente", img("rm-c-asistente-v2.jpg", c.alt.asistente)),
        pie("precio", img("rm-c-precio-v2.jpg", c.alt.precio)),
        pie("liga", img("rm-c-liga-v2.jpg", c.alt.liga)),
      ],
    },
    { kind: "texto", lado: "izq", title: c.puertas[0], body: c.puertas[1] },
    {
      kind: "ancho",
      medio: vid("rm-jugadores", c.alt.jugadores),
      ratio: 2240 / 1612,
    },
    {
      kind: "ancho",
      medio: img("rm-moviles.jpg", c.alt.moviles, "rm-moviles-movil.jpg"),
      ratio: 2688 / 1934,
      ratioMovil: 4 / 5,
    },
    { kind: "texto", lado: "der", body: c.sistemas },
    {
      kind: "par",
      medios: [
        img("rm-duenio.jpg", c.alt.duenio),
        img("rm-componentes-v2.jpg", c.alt.componentes),
      ],
    },
    { kind: "texto", lado: "der-estrecho", body: c.pasosTexto },
    { kind: "ancho", medio: vid("rm-pasos", c.alt.pasos), ratio: 2240 / 1040 },
    { kind: "texto", lado: "izq", title: c.codigo[0], body: c.codigo[1] },
    {
      kind: "ancho",
      medio: vid("rm-agenda", c.alt.agenda),
      ratio: 2240 / 1612,
    },
  ];
}

export default function RematchContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseProducto
        // La tinta de Rematch (#001D30) hundida: las piezas sobre tinta se separan del lienzo
        fondo="#000E17"
        mandos={c.mandos}
        titulo={c.titulo}
        logo={{
          src: "/images/highlights/logos/rematch.png",
          width: 939,
          height: 160,
          alt: "Rematch",
        }}
        heroe={{
          src: `${IMG}/rm-heroe-cancha.jpg`,
          srcMovil: `${IMG}/rm-heroe-cancha-movil.jpg`,
          alt: c.heroeAlt,
        }}
        meta={c.meta}
        bloques={bloques(c)}
        cita={c.cita}
        cta={c.cta}
        resultado={c.resultado}
      />
      <CaseMasProyectos
        accent={{ base: "#5C7000", dark: "#B4DF00", deep: "#001D30" }}
        next={{
          name: "LumioLearn",
          tagline: c.nextTagline,
          href: "/casos-de-exito/lumiolearn",
          image: "/images/proyects/lumiolearn/lumiolearn-portada-v8.jpg",
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
