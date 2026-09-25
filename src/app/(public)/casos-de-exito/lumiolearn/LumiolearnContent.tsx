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
 * Ficha de LumioLearn con la narrativa de Brand Vision (ver case-story).
 * UI real: LumioLearn en local, en su propio tenant (LumioLearn Academy) con una
 * academia de demostración; nada de academias clientes. Las escenas (alumna,
 * estudio, celular, marco) son de Higgsfield con la pantalla en verde y la
 * captura real compuesta encima (scripts/componer_pantalla.py). El certificado
 * es la plantilla de demo con los datos de la alumna de demo.
 */

const IMG = "/images/proyects/lumiolearn";

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
    estudio: string;
    tarjetas: string;
    certificado: string;
    celular: string;
    progreso: string;
    panel: string;
    landing: string;
    landingMoviles: string;
    precios: string;
    operar: string;
    funciones: string;
  };
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    tagline:
      "Academias en línea con marca propia, de la primera clase al certificado",
    meta: [
      ["Estado", "En producción"],
      ["Entregables", "Diseño de producto, desarrollo web, tutor con IA"],
      ["Industria", "Educación en línea"],
      ["Plataforma", "Web (SaaS) marca blanca"],
    ],
    statement:
      "Construimos una plataforma para que cada academia enseñe y venda sus cursos con su propia marca, sin comisiones por venta.",
    context:
      "LumioLearn es un producto propio de Axium: un LMS marca blanca donde cada academia tiene su sitio, sus cursos y sus alumnos, con un tutor con IA que conoce cada clase.",
    highlightsTitle: ["Lo que", "construimos"],
    highlights: [
      {
        lead: "Sitio de la academia",
        text: "constructor por secciones y widgets, con su catálogo de cursos.",
      },
      {
        lead: "Cursos y capítulos",
        text: "video, transcripción, adjuntos y fecha de liberación; grabados, en vivo o híbridos.",
      },
      {
        lead: "Evaluaciones",
        text: "quizzes con puntaje de aprobación y preguntas que se pueden generar con IA.",
      },
      {
        lead: "Reproductor",
        text: "notas personales y marcadores en el video, junto a la clase.",
      },
      {
        lead: "Tutor con IA",
        text: "responde con la transcripción, las notas y las preguntas de práctica del capítulo.",
      },
      {
        lead: "Certificados",
        text: "plantilla diseñable por curso y un código único para verificarlo.",
      },
      {
        lead: "Gamificación",
        text: "puntos, rachas, logros y tabla de líderes.",
      },
      {
        lead: "Cobros y API",
        text: "Mercado Pago y PayPal, cupones y una API REST pública con claves por alcance.",
      },
    ],
    challengeTitle: "Reto",
    challenge:
      "Quien enseña en línea suele depender de marketplaces que cobran comisión por cada venta y muestran su marca antes que la del profesor. Lo demás se arma con herramientas sueltas: una para el video, otra para evaluar, otra para certificar y otra para responder dudas, sin que ninguna sepa lo que pasó en las demás.",
    approachTitle: "Enfoque",
    approach:
      "Diseñamos un LMS marca blanca y multi-tenant: cada academia es un espacio aislado con su sitio, su dominio y sus alumnos. Todo lo que ocurre entre la primera clase y el certificado vive en el mismo lugar, y el tutor con IA trabaja con el contenido real de cada capítulo en lugar de respuestas genéricas.",
    outcomesTitle: "Resultados",
    outcomes:
      "LumioLearn está en producción en lumiolearn.com: las academias publican su sitio, venden sus cursos y emiten sus certificados sin comisiones.",
    outcomeBullets: [
      "Cuatro portales por rol: administración, profesor, alumno y editor del sitio",
      "Certificados con verificación por código",
      "Tutor con IA con la clave de cada academia, guardada cifrada",
      "Interfaz en español, inglés y portugués",
    ],
    alt: {
      mosaico:
        "Pantallas de LumioLearn: sitio, cursos, quiz, reproductor, certificado y progreso",
      tipografia: "Tipografía de LumioLearn: Satoshi",
      paleta: "Paleta de LumioLearn: azul, violeta y papel",
      estudio:
        "El reproductor del alumno con la clase y sus notas, en una laptop sobre un escritorio",
      tarjetas: "Marcadores de la alumna y el tutor con IA de LumioLearn",
      certificado:
        "Certificado de LumioLearn Academy enmarcado sobre un estante",
      celular: "El sitio de la academia en el celular",
      progreso:
        "Inicio de la alumna con puntos, racha, logros y tabla de líderes",
      panel: "Panel del curso con capítulos, metadatos y precios",
      landing:
        "lumiolearn.com en una laptop y en el celular: la página de funciones y el inicio móvil",
      landingMoviles:
        "lumiolearn.com en el celular: el inicio con el asistente de cursos, las herramientas para operar y el plan Business",
      precios:
        "Página de precios de lumiolearn.com: planes Starter, Business y Business Pro",
      operar:
        "Sección de lumiolearn.com con cupones, correos con tu marca, roles, gamificación, productos y API",
      funciones:
        "Página de funciones de lumiolearn.com: el tutor que responde 24/7 y los exámenes en segundos",
    },
    nextTagline: "Reservas, agenda y cobros en la web de cada negocio",
  },
  en: {
    tagline:
      "Online academies under their own brand, from the first lesson to the certificate",
    meta: [
      ["Status", "In production"],
      ["Deliverables", "Product design, web development, AI tutor"],
      ["Industry", "Online education"],
      ["Platform", "White-label web (SaaS)"],
    ],
    statement:
      "We built a platform so every academy can teach and sell its courses under its own brand, with no commission per sale.",
    context:
      "LumioLearn is Axium's own product: a white-label LMS where each academy has its site, its courses and its students, with an AI tutor that knows every lesson.",
    highlightsTitle: ["What we", "built"],
    highlights: [
      {
        lead: "Academy website",
        text: "a builder with sections and widgets, including the course catalog.",
      },
      {
        lead: "Courses and chapters",
        text: "video, transcript, attachments and release dates; recorded, live or hybrid.",
      },
      {
        lead: "Assessments",
        text: "quizzes with a passing score and questions that can be generated with AI.",
      },
      {
        lead: "Player",
        text: "personal notes and video bookmarks right next to the lesson.",
      },
      {
        lead: "AI tutor",
        text: "answers using the chapter's transcript, notes and practice questions.",
      },
      {
        lead: "Certificates",
        text: "a designable template per course and a unique code to verify it.",
      },
      {
        lead: "Gamification",
        text: "points, streaks, achievements and a leaderboard.",
      },
      {
        lead: "Payments and API",
        text: "Mercado Pago and PayPal, coupons and a public REST API with scoped keys.",
      },
    ],
    challengeTitle: "Challenge",
    challenge:
      "People who teach online usually depend on marketplaces that take a commission on every sale and show their own brand before the teacher's. Everything else is patched together with separate tools: one for video, another for assessments, another for certificates and another for questions, none of them aware of what happened in the others.",
    approachTitle: "Approach",
    approach:
      "We designed a white-label, multi-tenant LMS: each academy is an isolated space with its own site, domain and students. Everything between the first lesson and the certificate lives in one place, and the AI tutor works with the real content of each chapter instead of generic answers.",
    outcomesTitle: "Outcomes",
    outcomes:
      "LumioLearn is in production at lumiolearn.com: academies publish their site, sell their courses and issue their certificates with no commissions.",
    outcomeBullets: [
      "Four role-based portals: admin, teacher, student and site editor",
      "Certificates verifiable by code",
      "AI tutor using each academy's own key, stored encrypted",
      "Interface in Spanish, English and Portuguese",
    ],
    alt: {
      mosaico:
        "LumioLearn screens: website, courses, quiz, player, certificate and progress",
      tipografia: "LumioLearn typography: Satoshi",
      paleta: "LumioLearn palette: blue, violet and paper",
      estudio:
        "The student player with the lesson and her notes, on a laptop on a desk",
      tarjetas: "The student's bookmarks and LumioLearn's AI tutor",
      certificado: "A framed LumioLearn Academy certificate on a shelf",
      celular: "The academy website on a phone",
      progreso:
        "Student home with points, streak, achievements and leaderboard",
      panel: "Course dashboard with chapters, metadata and prices",
      landing:
        "lumiolearn.com on a laptop and a phone: the features page and the mobile home page",
      landingMoviles:
        "lumiolearn.com on mobile: the home page with the course assistant, the tools to run an academy and the Business plan",
      precios:
        "The lumiolearn.com pricing page: Starter, Business and Business Pro plans",
      operar:
        "A lumiolearn.com section with coupons, branded emails, roles, gamification, products and API",
      funciones:
        "The lumiolearn.com features page: the AI tutor that answers 24/7 and quizzes in seconds",
    },
    nextTagline:
      "Bookings, calendar and payments on each business's own website",
  },
  pt: {
    tagline:
      "Academias online com marca própria, da primeira aula ao certificado",
    meta: [
      ["Status", "Em produção"],
      ["Entregas", "Design de produto, desenvolvimento web, tutor com IA"],
      ["Setor", "Educação online"],
      ["Plataforma", "Web (SaaS) white label"],
    ],
    statement:
      "Construímos uma plataforma para que cada academia ensine e venda seus cursos com sua própria marca, sem comissão por venda.",
    context:
      "O LumioLearn é um produto próprio da Axium: um LMS white label em que cada academia tem seu site, seus cursos e seus alunos, com um tutor com IA que conhece cada aula.",
    highlightsTitle: ["O que", "construímos"],
    highlights: [
      {
        lead: "Site da academia",
        text: "construtor com seções e widgets, com o catálogo de cursos.",
      },
      {
        lead: "Cursos e capítulos",
        text: "vídeo, transcrição, anexos e data de liberação; gravados, ao vivo ou híbridos.",
      },
      {
        lead: "Avaliações",
        text: "quizzes com nota de aprovação e perguntas que podem ser geradas com IA.",
      },
      {
        lead: "Player",
        text: "notas pessoais e marcadores no vídeo, ao lado da aula.",
      },
      {
        lead: "Tutor com IA",
        text: "responde com a transcrição, as notas e as perguntas de prática do capítulo.",
      },
      {
        lead: "Certificados",
        text: "modelo personalizável por curso e um código único para verificá-lo.",
      },
      {
        lead: "Gamificação",
        text: "pontos, sequências, conquistas e ranking.",
      },
      {
        lead: "Pagamentos e API",
        text: "Mercado Pago e PayPal, cupons e uma API REST pública com chaves por escopo.",
      },
    ],
    challengeTitle: "Desafio",
    challenge:
      "Quem ensina online costuma depender de marketplaces que cobram comissão por cada venda e mostram a própria marca antes da do professor. O resto é montado com ferramentas soltas: uma para o vídeo, outra para avaliar, outra para certificar e outra para tirar dúvidas, sem que nenhuma saiba o que aconteceu nas demais.",
    approachTitle: "Abordagem",
    approach:
      "Desenhamos um LMS white label e multi-tenant: cada academia é um espaço isolado com seu site, seu domínio e seus alunos. Tudo o que acontece entre a primeira aula e o certificado vive no mesmo lugar, e o tutor com IA trabalha com o conteúdo real de cada capítulo em vez de respostas genéricas.",
    outcomesTitle: "Resultados",
    outcomes:
      "O LumioLearn está em produção em lumiolearn.com: as academias publicam seu site, vendem seus cursos e emitem seus certificados sem comissões.",
    outcomeBullets: [
      "Quatro portais por papel: administração, professor, aluno e editor do site",
      "Certificados verificáveis por código",
      "Tutor com IA com a chave de cada academia, guardada criptografada",
      "Interface em espanhol, inglês e português",
    ],
    alt: {
      mosaico:
        "Telas do LumioLearn: site, cursos, quiz, player, certificado e progresso",
      tipografia: "Tipografia do LumioLearn: Satoshi",
      paleta: "Paleta do LumioLearn: azul, violeta e papel",
      estudio:
        "O player do aluno com a aula e suas notas, em um notebook sobre a mesa",
      tarjetas: "Marcadores da aluna e o tutor com IA do LumioLearn",
      certificado:
        "Certificado da LumioLearn Academy emoldurado em uma prateleira",
      celular: "O site da academia no celular",
      progreso: "Início da aluna com pontos, sequência, conquistas e ranking",
      panel: "Painel do curso com capítulos, metadados e preços",
      landing:
        "lumiolearn.com em um notebook e no celular: a página de recursos e o início no celular",
      landingMoviles:
        "lumiolearn.com no celular: a página inicial com o assistente de cursos, as ferramentas para operar e o plano Business",
      precios:
        "Página de preços de lumiolearn.com: planos Starter, Business e Business Pro",
      operar:
        "Seção de lumiolearn.com com cupons, e-mails com sua marca, papéis, gamificação, produtos e API",
      funciones:
        "Página de recursos de lumiolearn.com: o tutor que responde 24/7 e as provas em segundos",
    },
    nextTagline: "Reservas, agenda e cobranças no site de cada negócio",
  },
};

function bloques(c: Copy): StoryBlock[] {
  return [
    {
      kind: "wide",
      // v2: sin la instructora; la clase ya se ve en bv-estudio
      image: { src: `${IMG}/bv-mosaico-v2.jpg`, alt: c.alt.mosaico },
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
        { src: `${IMG}/bv-estudio.jpg`, alt: c.alt.estudio },
        { src: `${IMG}/bv-tarjetas.jpg`, alt: c.alt.tarjetas },
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
        // v2: mockup de Higgsfield (laptop + celular) en lugar de ventana sobre degradado
        src: `${IMG}/bv-landing-v2.jpg`,
        alt: c.alt.landing,
        mobileSrc: `${IMG}/bv-landing-v2-movil.jpg`,
      },
    },
    {
      kind: "pair",
      images: [
        { src: `${IMG}/bv-landing-moviles.jpg`, alt: c.alt.landingMoviles },
        { src: `${IMG}/bv-precios.jpg`, alt: c.alt.precios },
      ],
    },
    {
      kind: "wide",
      image: {
        src: `${IMG}/bv-certificado.jpg`,
        alt: c.alt.certificado,
        mobilePosition: "48% 50%",
      },
    },
    {
      kind: "pair",
      images: [
        { src: `${IMG}/bv-operar.jpg`, alt: c.alt.operar },
        { src: `${IMG}/bv-funciones.jpg`, alt: c.alt.funciones },
      ],
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
        // v2: pantalla bien encajada (esquinas y barra de estado) y en "Cursos destacados"
        { src: `${IMG}/bv-celular-v2.jpg`, alt: c.alt.celular },
        { src: `${IMG}/bv-progreso.jpg`, alt: c.alt.progreso },
      ],
    },
  ];
}

export default function LumiolearnContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseStory
        name="LumioLearn"
        tagline={c.tagline}
        heroImage={`${IMG}/bv-hero.jpg`}
        heroPosition="66% 50%"
        logo={{
          src: "/images/highlights/logos/lumiolearn.png",
          width: 757,
          height: 160,
        }}
        liveUrl="https://lumiolearn.com"
        meta={c.meta}
        statement={c.statement}
        context={c.context}
        blocks={bloques(c)}
        next={{
          name: "Bookit",
          tagline: c.nextTagline,
          href: "/casos-de-exito/bookit",
          image: "/images/proyects/bookit/bookit-portada-v2.jpg",
        }}
        // MainTech es cliente con soporte de Lumio, no LumioLearn: no se muestra al lado
        hideCases={["maintech"]}
        labels={STORY_LABELS[lang]}
      />
      {/* Sección clara para que el navbar se lea sobre la tarjeta oscura del formulario */}
      <div data-nav-theme="light" className="bg-white">
        <CaseContactCTA />
      </div>
    </>
  );
}
