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
 * Ficha de Bookit al molde de producto (Pixelmatters), 2026-10-07, como las de Rematch y
 * Vendiq. Alexander: «también actualiza el portafolio de bookit y lumio según tus nuevos
 * diseños». Antes era una ficha de Brand Vision (CaseStory).
 *
 * ── DE DÓNDE SALE CADA COSA ────────────────────────────────────────────────────────
 *  · Todo lo de producto es de bookit.com.pe EN VIVO y de las webs de sus clientes; nada del
 *    repo local ni del panel, que conserva la marca anterior (Alexander: «bookit ya está
 *    desplegado… solo entrar a su web y sacar las caps»).
 *  · Animaciones: bookit.com.pe casi no se mueve sola, así que se graba lo que se mueve con el
 *    usuario: «De tu web a tu agenda» bajando paso a paso (scripts/grabar-scroll.cjs) y los
 *    rubros pasando el ratón por cada uno (scripts/grabar-hover.cjs).
 *  · Funciones: cuatro tarjetas de la rejilla de bookit.com.pe aisladas con alfa
 *    (scripts/aislar-piezas.cjs). Las dos con foto quedan fuera: sus fotos (el fotógrafo, la
 *    mesa redonda) salen también en el vídeo de los rubros, y no se repite a nadie.
 *  · Clientes: Moviflex, Blendet, Jarumi y Capptura en un monitor y un celular construidos,
 *    con el pino de Bookit de fondo (scripts/mockups-tiendas-vendiq.py, MOCK_*).
 *  · La foto del hero y la escena de la laptop son las de la ficha anterior (solo ambiente).
 *  · Lo que la web dejó de prometer no se promete aquí: sin recordatorios automáticos, sin
 *    cifras de plataforma, sin testimonios. Lo que depende del plan, con su plan.
 *    Taller: capturas-saas/bookit/producto-2026-10/ (CASO-BOOKIT.md § 7).
 */

const IMG = "/images/proyects/bookit";

type Copy = {
  titulo: string;
  heroeAlt: string;
  meta: CaseProductoProps["meta"];
  contexto: [string, string];
  reto: [string, string];
  enfoque: [string, string];
  funciones: string;
  etiquetaFunciones: string;
  pies: [string, string, string, string];
  rubros: [string, string];
  clientes: [string, string];
  piesClientes: [string, string, string, string];
  marca: [string, string];
  mandos: { anterior: string; siguiente: string };
  alt: Record<
    "recorrido" | "landing" | "rubros" | "tipografia" | "paleta",
    string
  > & {
    funciones: [string, string, string, string];
    clientes: [string, string, string, string];
  };
  cta: CaseProductoProps["cta"];
  resultado: CaseProductoProps["resultado"];
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    titulo:
      "Una plataforma para que cada negocio reciba reservas en su propia web",
    heroeAlt:
      "En la recepción de un consultorio, un profesional mira una reserva en el celular",
    meta: {
      tipologia: ["Tipología", ["Web app", "Reservas online", "Agenda"]],
      industria: [
        "Industria",
        "Salud, belleza y servicios con cita · SaaS propio",
      ],
      anio: ["Año", "2025–2026"],
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
          "bookit.com.pe",
          "Webs de los negocios",
          "Reservas y cobros",
          "Agenda del equipo",
          "Fichas de clientes",
        ],
      ],
      vivo: ["En vivo", "bookit.com.pe", "https://bookit.com.pe"],
    },
    contexto: [
      "Contexto",
      "Bookit es un producto propio de Axium para negocios que trabajan con cita. Cada negocio publica su web con su marca; sus clientes eligen servicio, profesional y horario, y la cita queda en la agenda del equipo.",
    ],
    reto: [
      "El reto",
      "Un consultorio o un salón recibe sus citas por WhatsApp, las anota en un cuaderno y cobra aparte. Los directorios de reservas traen clientes, pero cobran comisión por cita y ponen su marca delante de la del negocio.",
    ],
    enfoque: [
      "De tu web a tu agenda",
      "La reserva nace en la web del propio negocio: la web, el horario, el pago, el WhatsApp y la agenda son un mismo recorrido. bookit.com.pe lo cuenta en cinco pasos, con una evaluación de fisioterapia.",
    ],
    funciones:
      "Lo que necesita un negocio con cita, en una sola plataforma en lugar de herramientas sueltas. En bookit.com.pe cada función se cuenta con un trozo de su interfaz.",
    etiquetaFunciones: "Las funciones de Bookit",
    pies: [
      "Cobro al reservar con Mercado Pago o PayPal, desde Business",
      "Varias sedes en una sola cuenta, desde Business",
      "Horarios por profesional y por sede, con feriados y tiempo entre citas",
      "Fichas de clientes con su historial, notas y etiquetas",
    ],
    rubros: [
      "Habla como tu negocio",
      "Seis rubros, y en cada uno el panel usa sus palabras: pacientes y consultas en una clínica, clientas y citas en un salón, alumnos y clases en un estudio de pilates.",
    ],
    clientes: [
      "Negocios reales, webs reales",
      "Cuatro negocios ya reciben reservas en su propia web hecha con Bookit: una clínica de terapia física, dos estudios de belleza y un estudio de fotografía, con dominio propio o en su dirección de Bookit.",
    ],
    piesClientes: [
      "Moviflex · Terapia física · moviflex.com.pe",
      "Blendet · Estudio de belleza · blendet.bookit.com.pe",
      "Jarumi Enríquez · Belleza · jarumi.bookit.com.pe",
      "Capptura · Fotografía · cappturafotografia.com",
    ],
    marca: [
      "El punto del «it»",
      "El logotipo nuevo marca lo reservado con el punto verde del «it». Alrededor, un sistema tranquilo: pino y brote, Satoshi para el texto e Instrument Serif itálica para el acento.",
    ],
    mandos: { anterior: "Anterior", siguiente: "Siguiente" },
    alt: {
      recorrido:
        "«De tu web a tu agenda» en bookit.com.pe, animado: la web del consultorio, el horario, el pago con Mercado Pago, la confirmación por WhatsApp y la cita en la agenda del equipo",
      landing:
        "bookit.com.pe en una laptop y en el celular, sobre el mostrador de un consultorio",
      rubros:
        "«Bookit habla como tu negocio» en bookit.com.pe, animado: salud, belleza, bienestar, fitness, profesionales y creativos, cada uno con su foto y sus palabras",
      tipografia: "Tipografía de Bookit: Satoshi con Instrument Serif itálica",
      paleta: "Paleta de Bookit: pino, brote y menta",
      funciones: [
        "Tarjeta de cobros sin comisión: transferencia, PayPal y Mercado Pago",
        "Tarjeta de varias sedes: la sede Centro y la sede Norte en un globo",
        "Tarjeta de horarios por profesional y por sede",
        "Tarjeta de fichas de clientes: prefiere turnos por la mañana, frecuente con 12 citas",
      ],
      clientes: [
        "La web de Moviflex en un monitor y en el celular: terapia física y rehabilitación",
        "La web de Blendet en un monitor y en el celular: un estudio de belleza en Lima",
        "La web de Jarumi Enríquez en un monitor y en el celular: belleza a tu tiempo",
        "La web de Capptura en un monitor y en el celular: un estudio de fotografía",
      ],
    },
    cta: {
      titulo: "¿Tienes un producto en mente?",
      texto:
        "Lo diseñamos y lo construimos contigo, de la primera pantalla a producción, como hicimos con Bookit.",
      boton: "Hablemos",
      href: "#contacto",
    },
    resultado: {
      titulo: "El resultado",
      texto:
        "Bookit está en producción en bookit.com.pe: negocios de salud, belleza y fotografía reciben reservas en su propia web, con tres planes de precio fijo al mes.",
      cifras: [
        {
          valor: "0",
          texto: "comisión por reserva, en todos los planes",
        },
        {
          valor: "6",
          texto: "rubros, cada uno con las palabras de su negocio en el panel",
        },
        {
          valor: "4",
          texto: "webs de clientes en producción, dos con dominio propio",
        },
      ],
    },
    nextTagline:
      "Tienda online, punto de venta, inventario y facturación SUNAT en un solo sistema",
  },
  en: {
    titulo: "A platform for every business to take bookings on its own website",
    heroeAlt:
      "At a clinic's front desk, a professional checks a booking on their phone",
    meta: {
      tipologia: ["Typology", ["Web app", "Online booking", "Calendar"]],
      industria: [
        "Industry",
        "Health, beauty and appointment-based services · Own SaaS",
      ],
      anio: ["Year", "2025–2026"],
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
          "bookit.com.pe",
          "Business websites",
          "Bookings and payments",
          "Team calendar",
          "Client records",
        ],
      ],
      vivo: ["Live", "bookit.com.pe", "https://bookit.com.pe"],
    },
    contexto: [
      "Context",
      "Bookit is Axium's own product for appointment-based businesses. Each business publishes its website under its own brand; clients choose the service, professional and time, and the appointment lands in the team's calendar.",
    ],
    reto: [
      "The challenge",
      "A clinic or a salon takes appointments over WhatsApp, writes them in a notebook and collects payment separately. Booking directories bring clients, but they charge a commission per appointment and put their brand ahead of the business's.",
    ],
    enfoque: [
      "From your website to your calendar",
      "The booking starts on the business's own website: the website, the time slot, the payment, WhatsApp and the calendar are one single flow. bookit.com.pe tells it in five steps, with a physiotherapy assessment.",
    ],
    funciones:
      "What an appointment-based business needs, in one platform instead of separate tools. On bookit.com.pe each feature is told with a piece of its own interface.",
    etiquetaFunciones: "Bookit's features",
    pies: [
      "Payment at booking with Mercado Pago or PayPal, from Business",
      "Several locations in one account, from Business",
      "Schedules per professional and location, with holidays and time between appointments",
      "Client records with their history, notes and tags",
    ],
    rubros: [
      "It speaks like your business",
      "Six verticals, and in each one the dashboard uses its words: patients and consultations at a clinic, clients and appointments at a salon, students and classes at a pilates studio.",
    ],
    clientes: [
      "Real businesses, real websites",
      "Four businesses already take bookings on their own website built with Bookit: a physical therapy clinic, two beauty studios and a photography studio, on their own domain or on their Bookit address.",
    ],
    piesClientes: [
      "Moviflex · Physical therapy · moviflex.com.pe",
      "Blendet · Beauty studio · blendet.bookit.com.pe",
      "Jarumi Enríquez · Beauty · jarumi.bookit.com.pe",
      "Capptura · Photography · cappturafotografia.com",
    ],
    marca: [
      "The dot of the “it”",
      "The new logo marks what's booked with the green dot of the “it”. Around it, a calm system: pine and sprout, Satoshi for text and Instrument Serif italic for accents.",
    ],
    mandos: { anterior: "Previous", siguiente: "Next" },
    alt: {
      recorrido:
        "“From your website to your calendar” on bookit.com.pe, animated: the clinic's website, the time slot, payment with Mercado Pago, the WhatsApp confirmation and the appointment in the team's calendar",
      landing:
        "bookit.com.pe on a laptop and a phone, on a clinic's front desk",
      rubros:
        "“Bookit speaks like your business” on bookit.com.pe, animated: health, beauty, wellness, fitness, professionals and creatives, each with its photo and its words",
      tipografia: "Bookit typography: Satoshi with Instrument Serif italic",
      paleta: "Bookit palette: pine, sprout and mint",
      funciones: [
        "Commission-free payments card: bank transfer, PayPal and Mercado Pago",
        "Several locations card: the Centro and Norte locations on a globe",
        "Schedules per professional and location card",
        "Client records card: prefers morning slots, frequent with 12 appointments",
      ],
      clientes: [
        "Moviflex's website on a monitor and a phone: physical therapy and rehabilitation",
        "Blendet's website on a monitor and a phone: a beauty studio in Lima",
        "Jarumi Enríquez's website on a monitor and a phone: beauty on your time",
        "Capptura's website on a monitor and a phone: a photography studio",
      ],
    },
    cta: {
      titulo: "Have a product in mind?",
      texto:
        "We design it and build it with you, from the first screen to production, as we did with Bookit.",
      boton: "Let's talk",
      href: "#contacto",
    },
    resultado: {
      titulo: "The result",
      texto:
        "Bookit is in production at bookit.com.pe: health, beauty and photography businesses take bookings on their own website, with three flat monthly plans.",
      cifras: [
        { valor: "0", texto: "commission per booking, on every plan" },
        {
          valor: "6",
          texto: "verticals, each with its own words in the dashboard",
        },
        {
          valor: "4",
          texto: "client websites in production, two on their own domain",
        },
      ],
    },
    nextTagline:
      "Online store, point of sale, inventory and SUNAT invoicing in one system",
  },
  pt: {
    titulo:
      "Uma plataforma para que cada negócio receba reservas no seu próprio site",
    heroeAlt:
      "Na recepção de um consultório, um profissional confere uma reserva no celular",
    meta: {
      tipologia: ["Tipologia", ["Web app", "Reservas online", "Agenda"]],
      industria: [
        "Indústria",
        "Saúde, beleza e serviços com agendamento · SaaS próprio",
      ],
      anio: ["Ano", "2025–2026"],
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
          "bookit.com.pe",
          "Sites dos negócios",
          "Reservas e cobranças",
          "Agenda da equipe",
          "Fichas de clientes",
        ],
      ],
      vivo: ["Ao vivo", "bookit.com.pe", "https://bookit.com.pe"],
    },
    contexto: [
      "Contexto",
      "O Bookit é um produto próprio da Axium para negócios que trabalham com agendamento. Cada negócio publica seu site com sua marca; os clientes escolhem serviço, profissional e horário, e o agendamento fica na agenda da equipe.",
    ],
    reto: [
      "O desafio",
      "Um consultório ou um salão recebe agendamentos pelo WhatsApp, anota-os num caderno e cobra à parte. Os diretórios de reservas trazem clientes, mas cobram comissão por agendamento e põem a sua marca à frente da do negócio.",
    ],
    enfoque: [
      "Do seu site à sua agenda",
      "A reserva nasce no site do próprio negócio: o site, o horário, o pagamento, o WhatsApp e a agenda são um único percurso. O bookit.com.pe conta isso em cinco passos, com uma avaliação de fisioterapia.",
    ],
    funciones:
      "O que um negócio com agendamento precisa, em uma só plataforma em vez de ferramentas soltas. No bookit.com.pe cada função é contada com um pedaço da sua interface.",
    etiquetaFunciones: "As funções do Bookit",
    pies: [
      "Cobrança ao reservar com Mercado Pago ou PayPal, a partir do Business",
      "Várias unidades em uma só conta, a partir do Business",
      "Horários por profissional e por unidade, com feriados e tempo entre atendimentos",
      "Fichas de clientes com histórico, notas e etiquetas",
    ],
    rubros: [
      "Fala como o seu negócio",
      "Seis setores, e em cada um o painel usa as suas palavras: pacientes e consultas numa clínica, clientes e horários num salão, alunos e aulas num estúdio de pilates.",
    ],
    clientes: [
      "Negócios reais, sites reais",
      "Quatro negócios já recebem reservas no seu próprio site feito com o Bookit: uma clínica de fisioterapia, dois estúdios de beleza e um estúdio de fotografia, com domínio próprio ou no seu endereço do Bookit.",
    ],
    piesClientes: [
      "Moviflex · Fisioterapia · moviflex.com.pe",
      "Blendet · Estúdio de beleza · blendet.bookit.com.pe",
      "Jarumi Enríquez · Beleza · jarumi.bookit.com.pe",
      "Capptura · Fotografia · cappturafotografia.com",
    ],
    marca: [
      "O ponto do «it»",
      "O logotipo novo marca o que está reservado com o ponto verde do «it». Ao redor, um sistema tranquilo: pinho e broto, Satoshi para o texto e Instrument Serif itálica para o destaque.",
    ],
    mandos: { anterior: "Anterior", siguiente: "Próximo" },
    alt: {
      recorrido:
        "«Do seu site à sua agenda» no bookit.com.pe, animado: o site do consultório, o horário, o pagamento com Mercado Pago, a confirmação pelo WhatsApp e o agendamento na agenda da equipe",
      landing:
        "bookit.com.pe em um laptop e no celular, sobre o balcão de um consultório",
      rubros:
        "«O Bookit fala como o seu negócio» no bookit.com.pe, animado: saúde, beleza, bem-estar, fitness, profissionais e criativos, cada um com sua foto e suas palavras",
      tipografia: "Tipografia do Bookit: Satoshi com Instrument Serif itálica",
      paleta: "Paleta do Bookit: pinho, broto e menta",
      funciones: [
        "Cartão de cobranças sem comissão: transferência, PayPal e Mercado Pago",
        "Cartão de várias unidades: a unidade Centro e a unidade Norte em um globo",
        "Cartão de horários por profissional e por unidade",
        "Cartão de fichas de clientes: prefere horários pela manhã, frequente com 12 agendamentos",
      ],
      clientes: [
        "O site da Moviflex em um monitor e no celular: fisioterapia e reabilitação",
        "O site da Blendet em um monitor e no celular: um estúdio de beleza em Lima",
        "O site de Jarumi Enríquez em um monitor e no celular: beleza no seu tempo",
        "O site da Capptura em um monitor e no celular: um estúdio de fotografia",
      ],
    },
    cta: {
      titulo: "Tem um produto em mente?",
      texto:
        "Nós o desenhamos e construímos com você, da primeira tela à produção, como fizemos com o Bookit.",
      boton: "Vamos conversar",
      href: "#contacto",
    },
    resultado: {
      titulo: "O resultado",
      texto:
        "O Bookit está em produção em bookit.com.pe: negócios de saúde, beleza e fotografia recebem reservas no seu próprio site, com três planos de preço fixo por mês.",
      cifras: [
        { valor: "0", texto: "comissão por reserva, em todos os planos" },
        {
          valor: "6",
          texto: "setores, cada um com as palavras do seu negócio no painel",
        },
        {
          valor: "4",
          texto: "sites de clientes em produção, dois com domínio próprio",
        },
      ],
    },
    nextTagline:
      "Loja online, ponto de venda, estoque e faturamento SUNAT em um só sistema",
  },
};

const img = (src: string, alt: string): Medio => ({
  tipo: "imagen",
  src: `${IMG}/${src}`,
  alt,
});
const vid = (nombre: string, alt: string): Medio => ({
  tipo: "video",
  src: `${IMG}/${nombre}.mp4`,
  poster: `${IMG}/${nombre}.jpg`,
  alt,
});

/** Las cuatro tarjetas de funciones sin foto, con su proporción (ancho / alto). */
const FUNCIONES = [
  ["cobros", 1161 / 1419],
  ["sedes", 861 / 1203],
  ["horarios", 1464 / 1203],
  ["fichas", 1161 / 987],
] as const;
const CLIENTES = ["moviflex", "blendet", "jarumi", "capptura"] as const;
const cliente = (c: Copy, i: number) =>
  img(`bk-cliente-${CLIENTES[i]}.jpg`, c.alt.clientes[i] ?? CLIENTES[i] ?? "");

function bloques(c: Copy): BloqueProducto[] {
  return [
    { kind: "texto", lado: "izq", title: c.contexto[0], body: c.contexto[1] },
    // La idea entera en una animación: la reserva bajando por bookit.com.pe paso a paso
    {
      kind: "ancho",
      medio: vid("bk-recorrido", c.alt.recorrido),
      ratio: 2240 / 1400,
    },
    { kind: "texto", lado: "der", title: c.reto[0], body: c.reto[1] },
    {
      kind: "ancho",
      medio: {
        tipo: "imagen",
        src: `${IMG}/bv-landing.jpg`,
        srcMovil: `${IMG}/bv-landing-movil.jpg`,
        alt: c.alt.landing,
      },
      ratio: 2,
      ratioMovil: 4 / 3,
    },
    { kind: "texto", lado: "izq", title: c.enfoque[0], body: c.enfoque[1] },
    // ── Las funciones: la única tira de la ficha ──
    {
      kind: "capitulo",
      body: c.funciones,
      etiqueta: c.etiquetaFunciones,
      piezas: FUNCIONES.map(([nombre, ratio], i) => ({
        medio: img(`bk-funcion-${nombre}.jpg`, c.alt.funciones[i] ?? nombre),
        ratio,
        pie: c.pies[i],
      })),
    },
    { kind: "texto", lado: "der", title: c.rubros[0], body: c.rubros[1] },
    {
      kind: "ancho",
      medio: vid("bk-rubros", c.alt.rubros),
      ratio: 2240 / 1500,
    },
    // ── Los negocios que ya reservan con Bookit ──
    { kind: "texto", lado: "izq", title: c.clientes[0], body: c.clientes[1] },
    {
      kind: "par",
      medios: [cliente(c, 0), cliente(c, 1)],
      pies: c.piesClientes.slice(0, 2),
    },
    {
      kind: "par",
      medios: [cliente(c, 2), cliente(c, 3)],
      pies: c.piesClientes.slice(2, 4),
    },
    // ── La marca, corta: Bookit no tiene manual ──
    { kind: "texto", lado: "izq", title: c.marca[0], body: c.marca[1] },
    {
      kind: "par",
      medios: [
        img("bv-tipografia.jpg", c.alt.tipografia),
        img("bv-paleta.jpg", c.alt.paleta),
      ],
    },
  ];
}

export default function BookitContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseProducto
        // El pino oscuro de los paneles de bookit.com.pe: el vídeo del recorrido se funde con él
        fondo="#001B14"
        mandos={c.mandos}
        titulo={c.titulo}
        logo={{
          src: "/images/highlights/logos/bookit-v2.png",
          width: 1600,
          height: 399,
          alt: "Bookit",
        }}
        heroe={{
          src: `${IMG}/bv-hero-v2.jpg`,
          srcMovil: `${IMG}/bk-heroe-movil.jpg`,
          alt: c.heroeAlt,
        }}
        meta={c.meta}
        bloques={bloques(c)}
        cta={c.cta}
        resultado={c.resultado}
      />
      <CaseMasProyectos
        // verde oscuro sobre claro · brote sobre el pino · pino oscuro (los dos pasan 4,5:1)
        accent={{ base: "#017A3A", dark: "#01C85C", deep: "#001B14" }}
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
