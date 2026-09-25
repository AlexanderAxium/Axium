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
 * Ficha de Rematch con la narrativa de Brand Vision (ver case-story).
 * UI real: panel del club en local con datos de demo del tenant propio, el
 * torneo de demo de live.rematch.pe y la landing pública de rematch.pe. Las
 * escenas (recepción, oficina, banca, hero) son de Higgsfield con la pantalla en
 * verde y la captura real compuesta encima con scripts/componer_pantalla.py de
 * la skill portafolio-axium.
 */

const IMG = "/images/proyects/rematch";

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
    recepcion: string;
    pantallas: string;
    oficina: string;
    banca: string;
    envivo: string;
    landing: string;
    landingMoviles: string;
    duenos: string;
    landingSecciones: string;
  };
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    tagline: "Una sola plataforma para todo lo que pasa en un centro deportivo",
    meta: [
      ["Estado", "En producción"],
      ["Entregables", "Diseño de producto, desarrollo web, plataforma SaaS"],
      ["Industria", "Deportes"],
      ["Plataforma", "Web (SaaS) y móvil"],
    ],
    statement:
      "Construimos la plataforma con la que un centro deportivo gestiona sus reservas, academias, ligas y torneos desde un solo lugar.",
    context:
      "Rematch es un producto propio de Axium para complejos deportivos, clubes y academias. Los deportistas reservan y pagan desde el celular, y los torneos se siguen en vivo en live.rematch.pe.",
    highlightsTitle: ["Lo que", "construimos"],
    highlights: [
      {
        lead: "Reservas",
        text: "calendario por cancha y sede, pagos online y reservas pendientes que vencen solas.",
      },
      {
        lead: "Academias",
        text: "clases que bloquean su cancha, planes con cobro recurrente y asistencia con QR.",
      },
      {
        lead: "Ligas",
        text: "divisiones que suben y bajan cada ronda, con resultados confirmados por el rival.",
      },
      {
        lead: "Torneos",
        text: "sorteo con siembra, seis formatos de competencia y marcador set a set.",
      },
      {
        lead: "En vivo",
        text: "llaves y tablas públicas que se actualizan al instante en live.rematch.pe.",
      },
      {
        lead: "Tienda y finanzas",
        text: "productos, stock, pedidos, ingresos y caja por sede.",
      },
      {
        lead: "Plataforma",
        text: "cada club con su equipo, roles y permisos, en español, inglés y portugués.",
      },
      {
        lead: "Pagos y API",
        text: "Mercado Pago con cobros recurrentes, facturación electrónica con NextFact y una API documentada.",
      },
    ],
    challengeTitle: "Reto",
    challenge:
      "Un centro deportivo suele trabajar con varias herramientas a la vez: reservas por WhatsApp, clases en hojas de cálculo, ligas en grupos de chat y torneos en papel. Ninguna comparte las mismas canchas, los mismos clientes ni los mismos cobros, así que las dobles reservas, las mensualidades sin cobrar y las horas cruzando datos se vuelven parte de la rutina.",
    approachTitle: "Enfoque",
    approach:
      "Diseñamos la plataforma alrededor de la cancha: su ocupación es la única fuente de verdad, así una reserva, una clase o un partido de liga nunca se cruzan. Sobre esa agenda construimos cuatro módulos con la misma anatomía, que comparten clientes y cobros, y una capa en vivo para que jugadores y público sigan cada torneo desde el celular. Con la web rehecha, el club entra por rematch.pe y ve la agenda del día en la portada, y los jugadores entran por Rematch Live: canchas, academias y torneos en un mismo directorio.",
    outcomesTitle: "Resultados",
    outcomes:
      "Rematch está en producción: los clubes reservan, cobran y organizan sus competencias en rematch.pe, y los torneos se transmiten en live.rematch.pe.",
    outcomeBullets: [
      "Cuatro módulos sobre una sola agenda de canchas: reservas, academias, ligas y torneos",
      "Seis formatos de torneo con resultados en tiempo real (SSE)",
      "Marcadores propios para tenis de mesa, tenis, fútbol, vóley y básquet",
      "Interfaz en español, inglés y portugués",
    ],
    alt: {
      mosaico:
        "Pantallas de Rematch: reservas, academias, ligas, torneos, tienda y finanzas",
      tipografia:
        "Tipografía de Rematch: Satoshi con Cal Sans en los titulares",
      paleta: "Paleta de Rematch: tinta azul, lima y gris claro",
      recepcion:
        "Calendario de reservas de Rematch en la recepción de un club, con canchas de fondo",
      pantallas:
        "Rematch en el celular: reserva de cancha, alumnos de la academia y liga",
      oficina:
        "Panel de alumnos de la academia en una laptop, frente a las canchas iluminadas",
      banca:
        "Rematch Live en el celular, en la banca junto a la cancha: reservar una cancha o entrenar en una academia",
      envivo: "Rematch Live: la portada del jugador y la tarjeta de un torneo",
      landing:
        "rematch.pe: el sistema para administrar el club, con la agenda del día",
      landingMoviles:
        "rematch.pe y Rematch Live en el celular: el club, los cobros y el directorio de canchas",
      duenos:
        "Precios de Rematch en soles: gratis, básico, profesional y empresa",
      landingSecciones:
        "Secciones de rematch.pe: todo el club en un panel y el centro funcionando en tres pasos",
    },
    nextTagline:
      "Academias en línea con marca propia, de la primera clase al certificado",
  },
  en: {
    tagline: "One platform for everything that happens at a sports center",
    meta: [
      ["Status", "In production"],
      ["Deliverables", "Product design, web development, SaaS platform"],
      ["Industry", "Sports"],
      ["Platform", "Web (SaaS) and mobile"],
    ],
    statement:
      "We built the platform a sports center uses to run its bookings, academies, leagues and tournaments from one place.",
    context:
      "Rematch is Axium's own product for sports complexes, clubs and academies. Players book and pay from their phones, and tournaments are followed live on live.rematch.pe.",
    highlightsTitle: ["What we", "built"],
    highlights: [
      {
        lead: "Bookings",
        text: "a calendar per court and venue, online payments and pending bookings that expire on their own.",
      },
      {
        lead: "Academies",
        text: "classes that block their court, plans with recurring billing and QR attendance.",
      },
      {
        lead: "Leagues",
        text: "divisions where players move up and down every round, with results confirmed by the opponent.",
      },
      {
        lead: "Tournaments",
        text: "seeded draws, six competition formats and set-by-set scoring.",
      },
      {
        lead: "Live",
        text: "public brackets and tables that update instantly on live.rematch.pe.",
      },
      {
        lead: "Store and finance",
        text: "products, stock, orders, income and cash per venue.",
      },
      {
        lead: "Platform",
        text: "every club with its own team, roles and permissions, in Spanish, English and Portuguese.",
      },
      {
        lead: "Payments and API",
        text: "Mercado Pago with recurring billing, e-invoicing with NextFact and a documented API.",
      },
    ],
    challengeTitle: "Challenge",
    challenge:
      "A sports center usually runs on several tools at once: bookings over WhatsApp, classes in spreadsheets, leagues in group chats and tournaments on paper. None of them share the same courts, customers or payments, so double bookings, unpaid fees and hours spent reconciling data become routine.",
    approachTitle: "Approach",
    approach:
      "We designed the platform around the court: its occupancy is the single source of truth, so a booking, a class or a league match never overlap. On top of that schedule we built four modules with the same anatomy that share customers and payments, plus a live layer so players and spectators can follow every tournament from their phones. With the redesigned website, clubs come in through rematch.pe and see the day's schedule on the homepage, while players come in through Rematch Live: courts, academies and tournaments in one directory.",
    outcomesTitle: "Outcomes",
    outcomes:
      "Rematch is in production: clubs book, collect payments and organize their competitions on rematch.pe, and tournaments are broadcast on live.rematch.pe.",
    outcomeBullets: [
      "Four modules on a single court schedule: bookings, academies, leagues and tournaments",
      "Six tournament formats with real-time results (SSE)",
      "Dedicated scoreboards for table tennis, tennis, football, volleyball and basketball",
      "Interface in Spanish, English and Portuguese",
    ],
    alt: {
      mosaico:
        "Rematch screens: bookings, academies, leagues, tournaments, store and finance",
      tipografia: "Rematch typography: Satoshi with Cal Sans for headlines",
      paleta: "Rematch palette: ink blue, lime and light grey",
      recepcion:
        "Rematch booking calendar at a club's front desk, with courts in the background",
      pantallas:
        "Rematch on mobile: court booking, academy students and league",
      oficina:
        "Academy students dashboard on a laptop, facing the floodlit courts",
      banca:
        "Rematch Live on a phone, on the bench beside the court: book a court or train at an academy",
      envivo: "Rematch Live: the player's home and a tournament card",
      landing:
        "rematch.pe: the system to run the club, with the day's schedule",
      landingMoviles:
        "rematch.pe and Rematch Live on mobile: the club, the payments and the court directory",
      duenos:
        "Rematch pricing in soles: free, basic, professional and enterprise",
      landingSecciones:
        "rematch.pe sections: the whole club in one dashboard and the center running in three steps",
    },
    nextTagline:
      "Online academies under their own brand, from the first lesson to the certificate",
  },
  pt: {
    tagline:
      "Uma só plataforma para tudo o que acontece em um centro esportivo",
    meta: [
      ["Status", "Em produção"],
      ["Entregas", "Design de produto, desenvolvimento web, plataforma SaaS"],
      ["Setor", "Esportes"],
      ["Plataforma", "Web (SaaS) e mobile"],
    ],
    statement:
      "Construímos a plataforma com a qual um centro esportivo gerencia reservas, academias, ligas e torneios em um só lugar.",
    context:
      "O Rematch é um produto próprio da Axium para complexos esportivos, clubes e academias. Os atletas reservam e pagam pelo celular, e os torneios são acompanhados ao vivo em live.rematch.pe.",
    highlightsTitle: ["O que", "construímos"],
    highlights: [
      {
        lead: "Reservas",
        text: "calendário por quadra e unidade, pagamentos online e reservas pendentes que expiram sozinhas.",
      },
      {
        lead: "Academias",
        text: "aulas que bloqueiam sua quadra, planos com cobrança recorrente e presença com QR.",
      },
      {
        lead: "Ligas",
        text: "divisões em que os jogadores sobem e descem a cada rodada, com resultados confirmados pelo adversário.",
      },
      {
        lead: "Torneios",
        text: "sorteio com cabeças de chave, seis formatos de competição e placar set a set.",
      },
      {
        lead: "Ao vivo",
        text: "chaves e tabelas públicas que se atualizam na hora em live.rematch.pe.",
      },
      {
        lead: "Loja e finanças",
        text: "produtos, estoque, pedidos, receitas e caixa por unidade.",
      },
      {
        lead: "Plataforma",
        text: "cada clube com sua equipe, papéis e permissões, em espanhol, inglês e português.",
      },
      {
        lead: "Pagamentos e API",
        text: "Mercado Pago com cobrança recorrente, faturamento eletrônico com NextFact e uma API documentada.",
      },
    ],
    challengeTitle: "Desafio",
    challenge:
      "Um centro esportivo costuma trabalhar com várias ferramentas ao mesmo tempo: reservas pelo WhatsApp, aulas em planilhas, ligas em grupos de conversa e torneios no papel. Nenhuma compartilha as mesmas quadras, clientes ou pagamentos, e reservas duplicadas, mensalidades em aberto e horas cruzando dados viram rotina.",
    approachTitle: "Abordagem",
    approach:
      "Desenhamos a plataforma em torno da quadra: sua ocupação é a única fonte de verdade, então uma reserva, uma aula ou um jogo de liga nunca se sobrepõem. Sobre essa agenda construímos quatro módulos com a mesma anatomia, que compartilham clientes e pagamentos, e uma camada ao vivo para que jogadores e público acompanhem cada torneio pelo celular. Com o site refeito, o clube entra por rematch.pe e vê a agenda do dia na página inicial, e os jogadores entram pelo Rematch Live: quadras, academias e torneios em um só diretório.",
    outcomesTitle: "Resultados",
    outcomes:
      "O Rematch está em produção: os clubes reservam, cobram e organizam suas competições em rematch.pe, e os torneios são transmitidos em live.rematch.pe.",
    outcomeBullets: [
      "Quatro módulos sobre uma única agenda de quadras: reservas, academias, ligas e torneios",
      "Seis formatos de torneio com resultados em tempo real (SSE)",
      "Placares próprios para tênis de mesa, tênis, futebol, vôlei e basquete",
      "Interface em espanhol, inglês e português",
    ],
    alt: {
      mosaico:
        "Telas do Rematch: reservas, academias, ligas, torneios, loja e finanças",
      tipografia: "Tipografia do Rematch: Satoshi com Cal Sans nos títulos",
      paleta: "Paleta do Rematch: azul tinta, lima e cinza claro",
      recepcion:
        "Calendário de reservas do Rematch na recepção de um clube, com quadras ao fundo",
      pantallas:
        "Rematch no celular: reserva de quadra, alunos da academia e liga",
      oficina:
        "Painel de alunos da academia em um notebook, de frente para as quadras iluminadas",
      banca:
        "Rematch Live no celular, no banco ao lado da quadra: reservar uma quadra ou treinar numa academia",
      envivo: "Rematch Live: a página do jogador e o card de um torneio",
      landing:
        "rematch.pe: o sistema para administrar o clube, com a agenda do dia",
      landingMoviles:
        "rematch.pe e Rematch Live no celular: o clube, as cobranças e o diretório de quadras",
      duenos:
        "Preços do Rematch em soles: grátis, básico, profissional e empresa",
      landingSecciones:
        "Seções de rematch.pe: todo o clube em um painel e o centro funcionando em três passos",
    },
    nextTagline:
      "Academias online com marca própria, da primeira aula ao certificado",
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
      kind: "pair",
      images: [
        { src: `${IMG}/bv-recepcion.jpg`, alt: c.alt.recepcion },
        { src: `${IMG}/bv-pantallas.jpg`, alt: c.alt.pantallas },
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
        src: `${IMG}/bv-landing.jpg`,
        alt: c.alt.landing,
        mobileSrc: `${IMG}/bv-landing-movil.jpg`,
      },
    },
    {
      kind: "pair",
      images: [
        { src: `${IMG}/bv-landing-moviles.jpg`, alt: c.alt.landingMoviles },
        { src: `${IMG}/bv-duenos.jpg`, alt: c.alt.duenos },
      ],
    },
    {
      kind: "wide",
      image: {
        src: `${IMG}/bv-oficina.jpg`,
        alt: c.alt.oficina,
        mobilePosition: "45% 50%",
      },
    },
    {
      kind: "pair",
      images: [
        { src: `${IMG}/bv-banca.jpg`, alt: c.alt.banca },
        { src: `${IMG}/bv-envivo.jpg`, alt: c.alt.envivo },
      ],
    },
    {
      kind: "wide",
      image: {
        src: `${IMG}/bv-landing-secciones.jpg`,
        alt: c.alt.landingSecciones,
        mobileSrc: `${IMG}/bv-landing-secciones-movil.jpg`,
      },
    },
  ];
}

export default function RematchContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseStory
        name="Rematch"
        tagline={c.tagline}
        heroImage={`${IMG}/bv-hero.jpg`}
        heroPosition="74% 50%"
        logo={{
          src: "/images/highlights/logos/rematch.png",
          width: 939,
          height: 160,
        }}
        liveUrl="https://rematch.pe"
        meta={c.meta}
        statement={c.statement}
        context={c.context}
        blocks={bloques(c)}
        next={{
          name: "LumioLearn",
          tagline: c.nextTagline,
          href: "/casos-de-exito/lumiolearn",
          // Portada del carrusel: tableta con lumiolearn.com sobre un escritorio violeta
          image: "/images/proyects/lumiolearn/lumiolearn-portada-v7.jpg",
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
