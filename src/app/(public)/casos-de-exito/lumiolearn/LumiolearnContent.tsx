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
 * Ficha de LumioLearn al molde de producto (Pixelmatters), 2026-10-07, como las de Rematch,
 * Vendiq y Bookit. Alexander: «también actualiza el portafolio de bookit y lumio según tus
 * nuevos diseños». Antes era una ficha de Brand Vision (CaseStory).
 *
 * ── DE DÓNDE SALE CADA COSA ────────────────────────────────────────────────────────
 *  · Animaciones: las REALES de lumiolearn.com (scripts/grabar-micro.cjs): «Más que cursos»
 *    (clases en vivo, comunidad y evaluaciones, una pestaña cada 9 s) y «Todo para operar a
 *    gran escala».
 *  · ⚠️ El hero de lumiolearn.com NO sale: su ventana trae «Prueba gratuita: te quedan 14 días
 *    en InduTech Academy» y un curso de mantenimiento industrial, de un inquilino. Por eso
 *    tampoco la escena de la laptop ni las portadas viejas (v7 y el highlight v12), que lo
 *    llevaban (CASO-LUMIOLEARN.md § 12).
 *  · Panel y portal del alumno: capturas de LumioLearn en local, en su propio tenant
 *    (LumioLearn Academy) con una academia de demostración; nada de academias clientes.
 *  · La foto del hero (la alumna estudiando de noche) es de Higgsfield, solo ambiente: la
 *    pantalla da la espalda.
 *  · Lo que depende del plan, con su plan (lumiolearn.com/precios).
 *    Taller: capturas-saas/lumiolearn/producto-2026-10/.
 */

const IMG = "/images/proyects/lumiolearn";

type Copy = {
  titulo: string;
  heroeAlt: string;
  meta: CaseProductoProps["meta"];
  contexto: [string, string];
  reto: [string, string];
  enfoque: [string, string];
  dentro: string;
  etiquetaDentro: string;
  pies: [string, string, string, string, string, string];
  operar: [string, string];
  marca: [string, string];
  mandos: { anterior: string; siguiente: string };
  alt: Record<
    "experiencia" | "panel" | "operar" | "tipografia" | "paleta",
    string
  > & {
    dentro: [string, string, string, string, string, string];
  };
  cta: CaseProductoProps["cta"];
  resultado: CaseProductoProps["resultado"];
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    titulo:
      "Una plataforma para que cada academia enseñe y venda con su propia marca",
    heroeAlt:
      "Una alumna estudia de noche frente a su laptop, con la ciudad detrás",
    meta: {
      tipologia: ["Tipología", ["Web app", "LMS", "Tutor con IA"]],
      industria: ["Industria", "Educación en línea · SaaS propio"],
      anio: ["Año", "2025–2026"],
      servicios: [
        "Servicios",
        [
          "Diseño de producto",
          "Desarrollo web",
          "Plataforma SaaS marca blanca",
          "Tutor con IA",
          "Constructor de sitios",
        ],
      ],
      entregables: [
        "Entregables",
        [
          "lumiolearn.com",
          "Sitios de las academias",
          "Panel del profesor",
          "Portal del alumno",
          "Certificados",
        ],
      ],
      vivo: ["En vivo", "lumiolearn.com", "https://lumiolearn.com"],
    },
    contexto: [
      "Contexto",
      "LumioLearn es un producto propio de Axium: un LMS marca blanca con el que cada academia publica su sitio, vende sus cursos y emite sus certificados, con un tutor con IA que conoce cada clase.",
    ],
    reto: [
      "El reto",
      "Quien enseña en línea depende de marketplaces que cobran comisión por venta y ponen su marca antes que la del profesor. Lo demás se arma con herramientas sueltas: una para el video, otra para evaluar, otra para certificar, otra para las dudas.",
    ],
    enfoque: [
      "Una academia entera en un solo lugar",
      "Diseñamos un LMS marca blanca y multi-tenant: cada academia es un espacio aislado con su sitio, su dominio y sus alumnos. De la primera clase al certificado todo vive en el mismo lugar, y el tutor con IA lee el contenido del capítulo.",
    ],
    dentro:
      "Cuatro portales por rol sobre la misma academia: administración, profesor, alumno y editor del sitio. Aquí, el profesor y el alumno.",
    etiquetaDentro: "LumioLearn por dentro",
    pies: [
      "El mismo capítulo desde los dos lados: el quiz del profesor y las notas de la alumna",
      "El inicio de la alumna: puntos, racha, logros y tabla de líderes",
      "Marcadores en el video y el tutor con IA, desde el plan Business",
      "Certificados con la marca de la academia y un código para verificarlos",
      "El reproductor con la clase y las notas, en la laptop de la alumna",
      "El sitio de la academia en el celular",
    ],
    operar: [
      "Para operar a gran escala",
      "Cupones, plantillas de correo, roles y permisos, gamificación, venta de ebooks y mentorías, y una API con webhooks. Varias dependen del plan: roles desde Business; correos desde el dominio propio y la API de pagos, en Business Pro.",
    ],
    marca: [
      "Una estrella de cuatro puntas",
      "El logotipo es una estrella de cuatro puntas. La paleta va del azul al violeta sobre un papel cálido, y Satoshi lleva todo el texto.",
    ],
    mandos: { anterior: "Anterior", siguiente: "Siguiente" },
    alt: {
      experiencia:
        "«Más que cursos» en lumiolearn.com, animado: una clase en vivo con la agenda de la cohorte, la comunidad con sus discusiones y las evaluaciones con las notas de quizzes",
      panel: "Panel del curso con capítulos, metadatos y precios",
      operar:
        "«Todo para operar a gran escala» en lumiolearn.com, animado: cupones, correos con la marca, roles y permisos, gamificación, productos y pedidos, y webhooks",
      tipografia: "Tipografía de LumioLearn: Satoshi",
      paleta: "Paleta de LumioLearn: azul, violeta y papel",
      dentro: [
        "El mismo capítulo desde los dos lados: el quiz que el profesor configura en el panel y, delante, las notas personales que la alumna escribe mientras ve la clase",
        "Inicio de la alumna con puntos, racha, logros y tabla de líderes",
        "Marcadores de la alumna y el tutor con IA de LumioLearn",
        "Certificado de LumioLearn Academy enmarcado sobre un estante",
        "El reproductor del alumno con la clase y sus notas, en una laptop sobre un escritorio",
        "El sitio de la academia en el celular",
      ],
    },
    cta: {
      titulo: "¿Tienes un producto en mente?",
      texto:
        "Lo diseñamos y lo construimos contigo, de la primera pantalla a producción, como hicimos con LumioLearn.",
      boton: "Hablemos",
      href: "#contacto",
    },
    resultado: {
      titulo: "El resultado",
      texto:
        "LumioLearn está en producción en lumiolearn.com: las academias publican su sitio, venden sus cursos y emiten sus certificados sin comisiones.",
      cifras: [
        { valor: "0%", texto: "de comisión por venta, en todos los planes" },
        {
          valor: "4",
          texto:
            "portales por rol: administración, profesor, alumno y editor del sitio",
        },
        {
          valor: "3",
          texto: "idiomas en la interfaz: español, inglés y portugués",
        },
      ],
    },
    nextTagline: "Reservas, agenda y cobros en la web de cada negocio",
  },
  en: {
    titulo:
      "A platform for every academy to teach and sell under its own brand",
    heroeAlt:
      "A student studies at night in front of her laptop, with the city behind her",
    meta: {
      tipologia: ["Typology", ["Web app", "LMS", "AI tutor"]],
      industria: ["Industry", "Online education · Own SaaS"],
      anio: ["Year", "2025–2026"],
      servicios: [
        "Services",
        [
          "Product design",
          "Web development",
          "White-label SaaS platform",
          "AI tutor",
          "Site builder",
        ],
      ],
      entregables: [
        "Deliverables",
        [
          "lumiolearn.com",
          "Academy sites",
          "Teacher dashboard",
          "Student portal",
          "Certificates",
        ],
      ],
      vivo: ["Live", "lumiolearn.com", "https://lumiolearn.com"],
    },
    contexto: [
      "Context",
      "LumioLearn is Axium's own product: a white-label LMS with which every academy publishes its site, sells its courses and issues its certificates, with an AI tutor that knows every lesson.",
    ],
    reto: [
      "The challenge",
      "People who teach online depend on marketplaces that take a commission on every sale and put their own brand ahead of the teacher's. The rest is patched together from separate tools: one for video, one for assessments, one for certificates, one for questions.",
    ],
    enfoque: [
      "A whole academy in one place",
      "We designed a white-label, multi-tenant LMS: each academy is an isolated space with its own site, domain and students. From the first lesson to the certificate everything lives in one place, and the AI tutor reads the chapter's own content.",
    ],
    dentro:
      "Four role-based portals on the same academy: admin, teacher, student and site editor. Here, the teacher and the student.",
    etiquetaDentro: "Inside LumioLearn",
    pies: [
      "The same chapter from both sides: the teacher's quiz and the student's notes",
      "The student's home: points, streak, badges and leaderboard",
      "Video bookmarks and the AI tutor, from the Business plan",
      "Certificates with the academy's brand and a code to verify them",
      "The player with the lesson and the notes, on the student's laptop",
      "The academy's site on a phone",
    ],
    operar: [
      "To operate at scale",
      "Coupons, email templates, roles and permissions, gamification, ebook and mentoring sales, and an API with webhooks. Several depend on the plan: roles from Business; emails from your own domain and the payments API, on Business Pro.",
    ],
    marca: [
      "A four-pointed star",
      "The logo is a four-pointed star. The palette goes from blue to violet on a warm paper, and Satoshi carries all the text.",
    ],
    mandos: { anterior: "Previous", siguiente: "Next" },
    alt: {
      experiencia:
        "“More than courses” on lumiolearn.com, animated: a live class with the cohort's schedule, the community with its discussions and assessments with quiz grades",
      panel: "Course dashboard with chapters, metadata and pricing",
      operar:
        "“Everything to operate at scale” on lumiolearn.com, animated: coupons, branded emails, roles and permissions, gamification, products and orders, and webhooks",
      tipografia: "LumioLearn typography: Satoshi",
      paleta: "LumioLearn palette: blue, violet and paper",
      dentro: [
        "The same chapter from both sides: the quiz the teacher sets up in the dashboard and, in front, the personal notes the student writes while watching the lesson",
        "Student home with points, streak, badges and leaderboard",
        "The student's bookmarks and LumioLearn's AI tutor",
        "LumioLearn Academy certificate framed on a shelf",
        "The student player with the lesson and its notes, on a laptop on a desk",
        "The academy's site on a phone",
      ],
    },
    cta: {
      titulo: "Have a product in mind?",
      texto:
        "We design it and build it with you, from the first screen to production, as we did with LumioLearn.",
      boton: "Let's talk",
      href: "#contacto",
    },
    resultado: {
      titulo: "The result",
      texto:
        "LumioLearn is in production at lumiolearn.com: academies publish their site, sell their courses and issue their certificates with no commissions.",
      cifras: [
        { valor: "0%", texto: "commission per sale, on every plan" },
        {
          valor: "4",
          texto: "role-based portals: admin, teacher, student and site editor",
        },
        {
          valor: "3",
          texto: "interface languages: Spanish, English and Portuguese",
        },
      ],
    },
    nextTagline:
      "Bookings, calendar and payments on each business's own website",
  },
  pt: {
    titulo:
      "Uma plataforma para que cada academia ensine e venda com sua própria marca",
    heroeAlt:
      "Uma aluna estuda à noite diante do seu laptop, com a cidade ao fundo",
    meta: {
      tipologia: ["Tipologia", ["Web app", "LMS", "Tutor com IA"]],
      industria: ["Indústria", "Educação online · SaaS próprio"],
      anio: ["Ano", "2025–2026"],
      servicios: [
        "Serviços",
        [
          "Design de produto",
          "Desenvolvimento web",
          "Plataforma SaaS white label",
          "Tutor com IA",
          "Construtor de sites",
        ],
      ],
      entregables: [
        "Entregáveis",
        [
          "lumiolearn.com",
          "Sites das academias",
          "Painel do professor",
          "Portal do aluno",
          "Certificados",
        ],
      ],
      vivo: ["Ao vivo", "lumiolearn.com", "https://lumiolearn.com"],
    },
    contexto: [
      "Contexto",
      "O LumioLearn é um produto próprio da Axium: um LMS white label com o qual cada academia publica seu site, vende seus cursos e emite seus certificados, com um tutor com IA que conhece cada aula.",
    ],
    reto: [
      "O desafio",
      "Quem ensina online depende de marketplaces que cobram comissão por venda e põem a própria marca antes da do professor. O resto é montado com ferramentas soltas: uma para o vídeo, outra para avaliar, outra para certificar, outra para as dúvidas.",
    ],
    enfoque: [
      "Uma academia inteira em um só lugar",
      "Desenhamos um LMS white label e multi-tenant: cada academia é um espaço isolado com seu site, seu domínio e seus alunos. Da primeira aula ao certificado tudo vive no mesmo lugar, e o tutor com IA lê o conteúdo do capítulo.",
    ],
    dentro:
      "Quatro portais por papel sobre a mesma academia: administração, professor, aluno e editor do site. Aqui, o professor e o aluno.",
    etiquetaDentro: "O LumioLearn por dentro",
    pies: [
      "O mesmo capítulo dos dois lados: o quiz do professor e as notas da aluna",
      "O início da aluna: pontos, sequência, conquistas e ranking",
      "Marcadores no vídeo e o tutor com IA, a partir do plano Business",
      "Certificados com a marca da academia e um código para verificá-los",
      "O player com a aula e as notas, no laptop da aluna",
      "O site da academia no celular",
    ],
    operar: [
      "Para operar em grande escala",
      "Cupons, modelos de e-mail, papéis e permissões, gamificação, venda de ebooks e mentorias, e uma API com webhooks. Várias dependem do plano: papéis a partir do Business; e-mails do domínio próprio e a API de pagamentos, no Business Pro.",
    ],
    marca: [
      "Uma estrela de quatro pontas",
      "O logotipo é uma estrela de quatro pontas. A paleta vai do azul ao violeta sobre um papel quente, e a Satoshi leva todo o texto.",
    ],
    mandos: { anterior: "Anterior", siguiente: "Próximo" },
    alt: {
      experiencia:
        "«Mais que cursos» no lumiolearn.com, animado: uma aula ao vivo com a agenda da turma, a comunidade com suas discussões e as avaliações com as notas dos quizzes",
      panel: "Painel do curso com capítulos, metadados e preços",
      operar:
        "«Tudo para operar em grande escala» no lumiolearn.com, animado: cupons, e-mails com a marca, papéis e permissões, gamificação, produtos e pedidos, e webhooks",
      tipografia: "Tipografia do LumioLearn: Satoshi",
      paleta: "Paleta do LumioLearn: azul, violeta e papel",
      dentro: [
        "O mesmo capítulo dos dois lados: o quiz que o professor configura no painel e, à frente, as notas pessoais que a aluna escreve enquanto assiste à aula",
        "Início da aluna com pontos, sequência, conquistas e ranking",
        "Marcadores da aluna e o tutor com IA do LumioLearn",
        "Certificado da LumioLearn Academy emoldurado sobre uma estante",
        "O player do aluno com a aula e suas notas, em um laptop sobre uma mesa",
        "O site da academia no celular",
      ],
    },
    cta: {
      titulo: "Tem um produto em mente?",
      texto:
        "Nós o desenhamos e construímos com você, da primeira tela à produção, como fizemos com o LumioLearn.",
      boton: "Vamos conversar",
      href: "#contacto",
    },
    resultado: {
      titulo: "O resultado",
      texto:
        "O LumioLearn está em produção em lumiolearn.com: as academias publicam seu site, vendem seus cursos e emitem seus certificados sem comissões.",
      cifras: [
        { valor: "0%", texto: "de comissão por venda, em todos os planos" },
        {
          valor: "4",
          texto:
            "portais por papel: administração, professor, aluno e editor do site",
        },
        {
          valor: "3",
          texto: "idiomas na interface: espanhol, inglês e português",
        },
      ],
    },
    nextTagline: "Reservas, agenda e cobranças no site de cada negócio",
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

/** La tira «por dentro»: piezas del panel y del portal del alumno, con su proporción. */
const DENTRO = [
  ["bv-clase.jpg", 2],
  ["bv-progreso.jpg", 1],
  ["bv-tarjetas.jpg", 1],
  ["bv-certificado.jpg", 2],
  ["bv-estudio.jpg", 1],
  ["bv-celular-v2.jpg", 1],
] as const;

function bloques(c: Copy): BloqueProducto[] {
  return [
    { kind: "texto", lado: "izq", title: c.contexto[0], body: c.contexto[1] },
    // La idea entera en una animación: clases en vivo, comunidad y evaluaciones
    {
      kind: "ancho",
      medio: vid("lu-experiencia", c.alt.experiencia),
      ratio: 2240 / 1120,
    },
    { kind: "texto", lado: "der", title: c.reto[0], body: c.reto[1] },
    {
      kind: "ancho",
      medio: {
        tipo: "imagen",
        src: `${IMG}/bv-panel.jpg`,
        srcMovil: `${IMG}/bv-panel-movil.jpg`,
        alt: c.alt.panel,
      },
      ratio: 2,
      ratioMovil: 4 / 3,
    },
    { kind: "texto", lado: "izq", title: c.enfoque[0], body: c.enfoque[1] },
    // ── Por dentro: la única tira de la ficha ──
    {
      kind: "capitulo",
      body: c.dentro,
      etiqueta: c.etiquetaDentro,
      piezas: DENTRO.map(([src, ratio], i) => ({
        medio: img(src, c.alt.dentro[i] ?? src),
        ratio,
        pie: c.pies[i],
      })),
    },
    { kind: "texto", lado: "der", title: c.operar[0], body: c.operar[1] },
    {
      kind: "ancho",
      medio: vid("lu-operar", c.alt.operar),
      ratio: 2240 / 1400,
    },
    // ── La marca, corta: LumioLearn no tiene manual ──
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

export default function LumiolearnContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseProducto
        // El azul noche del pie de lumiolearn.com
        fondo="#11132A"
        mandos={c.mandos}
        titulo={c.titulo}
        logo={{
          src: "/images/highlights/logos/lumiolearn.png",
          width: 757,
          height: 160,
          alt: "LumioLearn",
        }}
        heroe={{
          src: `${IMG}/bv-hero.jpg`,
          srcMovil: `${IMG}/lu-heroe-movil.jpg`,
          alt: c.heroeAlt,
        }}
        meta={c.meta}
        bloques={bloques(c)}
        cta={c.cta}
        resultado={c.resultado}
      />
      <CaseMasProyectos
        // violeta sobre claro · violeta claro sobre el azul noche · azul noche
        accent={{ base: "#7A35D6", dark: "#A96BF5", deep: "#11132A" }}
        next={{
          name: "Bookit",
          tagline: c.nextTagline,
          href: "/casos-de-exito/bookit",
          image: "/images/proyects/bookit/bookit-portada-v2.jpg",
        }}
        // MainTech es cliente con soporte de Lumio, no LumioLearn: no se muestra al lado
        hide={["maintech"]}
        labels={STORY_LABELS[lang]}
      />
      {/* Sección clara para que el navbar se lea sobre la tarjeta oscura del formulario */}
      <div data-nav-theme="light" className="bg-white">
        <CaseContactCTA />
      </div>
    </>
  );
}
