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
 * Ficha de Bookit con la narrativa de Brand Vision (ver case-story), con la marca
 * nueva de la web pública (rediseño del 2026-09-12, ya en bookit.com.pe).
 * Todo lo que se ve de producto es captura real de bookit.com.pe y de las webs de
 * sus clientes (Moviflex, Blendet, Jarumi, Capptura); nada sale del repo local ni
 * de su servidor de desarrollo. El panel no sale: conserva la marca anterior. La
 * foto del hero y la escena de los dispositivos son de Higgsfield (solo ambiente,
 * sin clientes reales), con las capturas compuestas sobre la pantalla en verde.
 * Nada de lo que la web rehecha dejó de prometer: sin recordatorios automáticos,
 * sin cifras de plataforma, sin testimonios.
 */

const IMG = "/images/proyects/bookit";

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
    recorrido: string;
    moviles: string;
    clientes: string;
    funciones: string;
    planes: string;
  };
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    tagline: "Reservas, agenda y cobros en la web de cada negocio",
    meta: [
      ["Estado", "En producción"],
      ["Entregables", "Diseño de producto, web pública, plataforma SaaS"],
      ["Industria", "Salud, belleza y servicios con cita"],
      ["Plataforma", "Web (SaaS) multi-tenant"],
    ],
    statement:
      "Construimos la plataforma con la que un consultorio, un salón o un estudio recibe reservas en su propia web y las ve llegar a la agenda de su equipo.",
    context:
      "Bookit es un producto propio de Axium para negocios que trabajan con cita. Cada negocio publica su web con su marca; sus clientes eligen servicio, profesional y horario, y la cita queda lista en la agenda, sin comisiones por reserva.",
    highlightsTitle: ["Lo que", "construimos"],
    highlights: [
      {
        lead: "Web con su marca",
        text: "editor visual con bloques y plantillas, blog y dirección en bookit.com.pe o dominio propio.",
      },
      {
        lead: "Reservas online",
        text: "servicio, profesional, sede y horario libre; nunca dos citas a la misma hora, y el cliente reprograma o cancela dentro del plazo.",
      },
      {
        lead: "Agenda del equipo",
        text: "horarios por profesional y sede, feriados, vacaciones y bloqueos, y clases grupales con cupo.",
      },
      {
        lead: "Cobros",
        text: "Mercado Pago, PayPal o transferencia, pago al reservar desde el plan Business, cupones y cierre de caja.",
      },
      {
        lead: "Fichas de clientes",
        text: "historial de citas, notas y etiquetas, y notas clínicas desde el plan Business.",
      },
      {
        lead: "WhatsApp",
        text: "al confirmar, el cliente abre WhatsApp con su reserva ya escrita.",
      },
      {
        lead: "Las palabras de cada rubro",
        text: "salud, belleza, bienestar, fitness, profesionales y creativos: el panel habla de pacientes, clientas o alumnos.",
      },
      {
        lead: "Detalles y API",
        text: "libro de reclamaciones virtual, seis monedas, asistente de IA para el equipo y una API pública en Business Pro.",
      },
    ],
    challengeTitle: "Reto",
    challenge:
      "Un consultorio o un salón suele recibir sus citas por WhatsApp y llamadas, anotarlas en un cuaderno y cobrar aparte. Los directorios de reservas traen clientes, pero cobran comisión por cada cita y ponen su marca delante de la del negocio.",
    approachTitle: "Enfoque",
    approach:
      "Diseñamos Bookit para que la reserva nazca en la web del propio negocio: la web, el horario, el pago, el WhatsApp y la agenda son un mismo recorrido. Con la marca nueva, el punto verde del «it» marca lo reservado, y la web pública enseña ese recorrido con la interfaz del producto y las webs reales de sus clientes.",
    outcomesTitle: "Resultados",
    outcomes:
      "Bookit está en producción en bookit.com.pe: negocios de salud, belleza y fotografía reciben reservas en su propia web.",
    outcomeBullets: [
      "Web, reservas, agenda, cobros y clientes en una sola plataforma multi-tenant",
      "Seis rubros, cada uno con el vocabulario de su negocio en el panel",
      "Cobro al reservar con Mercado Pago o PayPal, sin comisión por reserva",
      "Webs de clientes con dominio propio, como moviflex.com.pe y cappturafotografia.com",
    ],
    alt: {
      mosaico:
        "Pantallas de bookit.com.pe: inicio, recorrido de una reserva, funciones, precios y rubros",
      tipografia: "Tipografía de Bookit: Satoshi con Instrument Serif itálica",
      paleta: "Paleta de Bookit: pino, brote y menta",
      landing:
        "bookit.com.pe en una laptop y en el celular, sobre el mostrador de un consultorio",
      recorrido:
        "La sección De tu web a tu agenda: cómo llega una reserva desde la web del negocio",
      moviles:
        "bookit.com.pe en el celular: el recorrido de la reserva, el pago y las webs de clientes",
      clientes:
        "Webs de clientes hechas con Bookit: Moviflex, Blendet, Jarumi y Capptura",
      funciones:
        "Funciones de Bookit: web con marca, cobros, varias sedes, horarios y fichas de clientes",
      planes: "Planes de Bookit: Starter, Business y Business Pro",
    },
    nextTagline:
      "Tienda online, punto de venta, inventario y facturación SUNAT en un solo sistema",
  },
  en: {
    tagline: "Bookings, calendar and payments on each business's own website",
    meta: [
      ["Status", "In production"],
      ["Deliverables", "Product design, public website, SaaS platform"],
      ["Industry", "Health, beauty and appointment-based services"],
      ["Platform", "Multi-tenant web (SaaS)"],
    ],
    statement:
      "We built the platform a clinic, a salon or a studio uses to take bookings on its own website and see them land in its team's calendar.",
    context:
      "Bookit is Axium's own product for appointment-based businesses. Each business publishes its website under its own brand; clients choose the service, professional and time, and the appointment is ready in the calendar, with no commission per booking.",
    highlightsTitle: ["What we", "built"],
    highlights: [
      {
        lead: "Branded website",
        text: "a visual editor with blocks and templates, a blog, and an address on bookit.com.pe or a custom domain.",
      },
      {
        lead: "Online booking",
        text: "service, professional, location and free time slot; never two appointments at the same time, and clients reschedule or cancel within the allowed window.",
      },
      {
        lead: "Team calendar",
        text: "schedules per professional and location, holidays, vacations and blocked time, plus group classes with limited spots.",
      },
      {
        lead: "Payments",
        text: "Mercado Pago, PayPal or bank transfer, payment at booking from the Business plan, coupons and cash closing.",
      },
      {
        lead: "Client records",
        text: "appointment history, notes and tags, plus clinical notes from the Business plan.",
      },
      {
        lead: "WhatsApp",
        text: "after confirming, clients open WhatsApp with their booking already written.",
      },
      {
        lead: "Each vertical's words",
        text: "health, beauty, wellness, fitness, professional and creative services: the dashboard talks about patients, clients or students.",
      },
      {
        lead: "Details and API",
        text: "a virtual complaints book, six currencies, an AI assistant for the team and a public API on Business Pro.",
      },
    ],
    challengeTitle: "Challenge",
    challenge:
      "A clinic or a salon usually takes appointments over WhatsApp and phone calls, writes them down in a notebook and collects payment separately. Booking directories bring clients, but they charge a commission on every appointment and put their brand ahead of the business's.",
    approachTitle: "Approach",
    approach:
      "We designed Bookit so the booking starts on the business's own website: the website, the time slot, the payment, WhatsApp and the calendar are one single flow. With the new brand, the green dot of the “it” marks what's booked, and the public website shows that flow with the product's interface and its clients' real websites.",
    outcomesTitle: "Outcomes",
    outcomes:
      "Bookit is in production at bookit.com.pe: health, beauty and photography businesses take bookings on their own websites.",
    outcomeBullets: [
      "Website, bookings, calendar, payments and clients in one multi-tenant platform",
      "Six verticals, each with its own business vocabulary in the dashboard",
      "Payment at booking with Mercado Pago or PayPal, with no commission per booking",
      "Client websites on their own domains, such as moviflex.com.pe and cappturafotografia.com",
    ],
    alt: {
      mosaico:
        "bookit.com.pe screens: home, a booking's journey, features, pricing and verticals",
      tipografia: "Bookit typography: Satoshi with Instrument Serif italic",
      paleta: "Bookit palette: pine, sprout and mint",
      landing:
        "bookit.com.pe on a laptop and a phone, on a clinic's front desk",
      recorrido:
        "The From your website to your calendar section: how a booking arrives from the business's website",
      moviles:
        "bookit.com.pe on mobile: the booking journey, the payment and client websites",
      clientes:
        "Client websites built with Bookit: Moviflex, Blendet, Jarumi and Capptura",
      funciones:
        "Bookit features: branded website, payments, multiple locations, schedules and client records",
      planes: "Bookit plans: Starter, Business and Business Pro",
    },
    nextTagline:
      "Online store, point of sale, inventory and SUNAT invoicing in one system",
  },
  pt: {
    tagline: "Reservas, agenda e cobranças no site de cada negócio",
    meta: [
      ["Status", "Em produção"],
      ["Entregas", "Design de produto, site público, plataforma SaaS"],
      ["Setor", "Saúde, beleza e serviços com agendamento"],
      ["Plataforma", "Web (SaaS) multi-tenant"],
    ],
    statement:
      "Construímos a plataforma com a qual um consultório, um salão ou um estúdio recebe reservas no seu próprio site e as vê chegar à agenda da sua equipe.",
    context:
      "O Bookit é um produto próprio da Axium para negócios que trabalham com agendamento. Cada negócio publica seu site com sua marca; os clientes escolhem serviço, profissional e horário, e o agendamento fica pronto na agenda, sem comissão por reserva.",
    highlightsTitle: ["O que", "construímos"],
    highlights: [
      {
        lead: "Site com a sua marca",
        text: "editor visual com blocos e modelos, blog e endereço em bookit.com.pe ou domínio próprio.",
      },
      {
        lead: "Reservas online",
        text: "serviço, profissional, unidade e horário livre; nunca dois agendamentos no mesmo horário, e o cliente remarca ou cancela dentro do prazo.",
      },
      {
        lead: "Agenda da equipe",
        text: "horários por profissional e unidade, feriados, férias e bloqueios, e aulas em grupo com vagas.",
      },
      {
        lead: "Cobranças",
        text: "Mercado Pago, PayPal ou transferência, pagamento ao reservar a partir do plano Business, cupons e fechamento de caixa.",
      },
      {
        lead: "Fichas de clientes",
        text: "histórico de agendamentos, notas e etiquetas, e notas clínicas a partir do plano Business.",
      },
      {
        lead: "WhatsApp",
        text: "ao confirmar, o cliente abre o WhatsApp com a reserva já escrita.",
      },
      {
        lead: "As palavras de cada setor",
        text: "saúde, beleza, bem-estar, fitness, profissionais e criativos: o painel fala de pacientes, clientes ou alunos.",
      },
      {
        lead: "Detalhes e API",
        text: "livro de reclamações virtual, seis moedas, assistente de IA para a equipe e uma API pública no Business Pro.",
      },
    ],
    challengeTitle: "Desafio",
    challenge:
      "Um consultório ou um salão costuma receber agendamentos pelo WhatsApp e por telefone, anotá-los num caderno e cobrar à parte. Os diretórios de reservas trazem clientes, mas cobram comissão por agendamento e colocam a sua marca à frente da marca do negócio.",
    approachTitle: "Abordagem",
    approach:
      "Desenhamos o Bookit para que a reserva nasça no site do próprio negócio: o site, o horário, o pagamento, o WhatsApp e a agenda são um único percurso. Com a nova marca, o ponto verde do «it» marca o que está reservado, e o site público mostra esse percurso com a interface do produto e os sites reais dos seus clientes.",
    outcomesTitle: "Resultados",
    outcomes:
      "O Bookit está em produção em bookit.com.pe: negócios de saúde, beleza e fotografia recebem reservas no seu próprio site.",
    outcomeBullets: [
      "Site, reservas, agenda, cobranças e clientes em uma única plataforma multi-tenant",
      "Seis setores, cada um com o vocabulário do seu negócio no painel",
      "Pagamento ao reservar com Mercado Pago ou PayPal, sem comissão por reserva",
      "Sites de clientes com domínio próprio, como moviflex.com.pe e cappturafotografia.com",
    ],
    alt: {
      mosaico:
        "Telas de bookit.com.pe: início, percurso de uma reserva, recursos, preços e setores",
      tipografia: "Tipografia do Bookit: Satoshi com Instrument Serif itálico",
      paleta: "Paleta do Bookit: pinho, broto e menta",
      landing:
        "bookit.com.pe em um notebook e no celular, sobre o balcão de um consultório",
      recorrido:
        "A seção Do seu site à sua agenda: como uma reserva chega a partir do site do negócio",
      moviles:
        "bookit.com.pe no celular: o percurso da reserva, o pagamento e os sites de clientes",
      clientes:
        "Sites de clientes feitos com o Bookit: Moviflex, Blendet, Jarumi e Capptura",
      funciones:
        "Recursos do Bookit: site com marca, cobranças, várias unidades, horários e fichas de clientes",
      planes: "Planos do Bookit: Starter, Business e Business Pro",
    },
    nextTagline:
      "Loja online, ponto de venda, estoque e faturamento SUNAT em um só sistema",
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
        src: `${IMG}/bv-landing.jpg`,
        alt: c.alt.landing,
        mobileSrc: `${IMG}/bv-landing-movil.jpg`,
      },
    },
    {
      kind: "pair",
      images: [
        { src: `${IMG}/bv-recorrido.jpg`, alt: c.alt.recorrido },
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

export default function BookitContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseStory
        name="Bookit"
        tagline={c.tagline}
        heroImage={`${IMG}/bv-hero-v2.jpg`}
        heroPosition="72% 50%"
        logo={{
          src: "/images/highlights/logos/bookit-v2.png",
          width: 1600,
          height: 399,
        }}
        liveUrl="https://bookit.com.pe"
        meta={c.meta}
        statement={c.statement}
        context={c.context}
        blocks={bloques(c)}
        next={{
          name: "Vendiq",
          tagline: c.nextTagline,
          href: "/casos-de-exito/vendiq",
          image: "/images/proyects/vendiq/vendiq-portada-v2.jpg",
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
