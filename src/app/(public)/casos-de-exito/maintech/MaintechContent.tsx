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
 * Ficha larga de MainTech: identidad, marca aplicada y sitio web.
 *
 * ── DE DÓNDE SALE CADA COSA (2026-09-30) ────────────────────────────────────────────
 * De este encargo NO se conserva el archivo fuente de la identidad. Alexander: «se les
 * hizo todo, logo, branding etc, pero en este caso no lo tengo guardado». La regla de
 * IMAGENES.md no cambia por eso: **no se inventa el entregable**. Así que la identidad
 * NO se reconstruye de memoria — se RECUPERA de su sitio en vivo, que la sirve entera:
 *   · Logotipo   maintech.com.pe/logo 1.png (528×108) y logofooter.png. El PNG se
 *                vectorizó con potrace a partir de ese mismo archivo (IoU de alfa
 *                0,985 contra el original) para que aguante tamaño de lámina. Es su
 *                marca, no un redibujo.
 *   · Tipografía los .woff2 que sirve el propio sitio: Orbitron (titulares) y Poppins
 *                Light/Regular/Medium/SemiBold/Bold (texto).
 *   · Paleta     medida del logotipo (#1C116A, #00C3F5, #FF416A) y del CSS en vivo
 *                (#00D1FF, #0F0B3D, y el degradado #4A1B7F → #F1536D).
 *   · Pantallas  capturas con Playwright a 2x del sitio en vivo, 2026-09-30.
 * Lo ÚNICO generado (Higgsfield, gpt_image_2_5 high/2k) son las tres escenas vacías del
 * acto 02 —panel de vidrio, tapa de tela ciega y casco blanco— y el taller del hero.
 * Ninguna trae una letra ni un logotipo: la marca que se ve encima siempre es la real, y
 * los tres mockups lo dicen con esas palabras en el acto y en el pie.
 * Taller: .claude/skills/portafolio-axium/capturas-clientes/maintech/taller.html
 *
 * ── LO QUE LA FICHA VIEJA PUBLICABA MAL ─────────────────────────────────────────────
 *   · Sus cinco imágenes eran UI generada por IA, con texto alucinado dentro del
 *     navegador («Nustro Soluciones», «Melestros Cusioros», «diversprggramas»). Fuera.
 *   · Decía «tres productos web: maintech.com.pe, Maintech Academy y Maintech
 *     Solutions». Medido hoy: es UN solo Next.js. Academy y Solutions son las dos
 *     líneas DENTRO de ese sitio, y la pantalla de entrada te hace elegir una.
 *   · Declaraba NestJS y PostgreSQL, que no se pueden medir desde fuera. Se queda lo
 *     que sí: Next.js (x-nextjs-cache, robots.ts y sitemap.ts), Tailwind, Cloudflare y
 *     Cloudflare R2 para los medios.
 *   · maintech.lumiolearn.com —su inquilino de LumioLearn— existe y responde 200, pero
 *     hoy solo muestra «Sitio en construcción». No entra en la ficha: no hay pantalla
 *     que enseñar y no se cuenta un entregable por su URL.
 *
 * TRES ACTOS, porque tres cosas se entregaron:
 *   01 · La identidad       logotipo, sistema tipográfico, paleta y las dos líneas
 *   02 · La marca aplicada  rótulo, manual y casco — MOCKUPS, y la ficha lo dice
 *   03 · El sitio           maintech.com.pe, todo captura real con su URL al pie
 *
 * RITMO: quince bloques, ocho de imagen — CINCO anchas y TRES pares de cuadradas, once
 * piezas. Ningún tramo pasa de 700 px sin imagen (medido a 1440) y ningún párrafo pasa
 * de 45 palabras en es/en/pt. `results` va vacío: no tenemos su analítica y no se
 * inventan cifras.
 */

const IMG = "/images/proyects/maintech";

type Acto = { index: string; title: [string, string]; body: string };

/** Las once piezas del relato: cinco anchas y tres pares de cuadradas. */
type Pieza =
  | "identidad"
  | "paleta"
  | "tipografia"
  | "lineas"
  | "rotulo"
  | "manual"
  | "casco"
  | "web"
  | "cursos"
  | "cursoMovil"
  | "solutions";

type Copy = {
  tagline: string;
  meta: [string, string][];
  statement: string;
  context: string;
  highlightsTitle: [string, string];
  highlights: { lead: string; text: string }[];
  challengeTitle: string;
  challenge: string;
  actos: Record<"identidad" | "aplicaciones" | "sitio", Acto>;
  outcomesTitle: string;
  outcomes: string;
  stackTitle: string;
  stack: string[];
  /** Solo las piezas anchas llevan frase: un bloque `pair` no admite `lead`. */
  leads: {
    identidad: string;
    lineas: string;
    rotulo: string;
    web: string;
    solutions: string;
  };
  pies: Record<Pieza, string>;
  alt: Record<Pieza, string>;
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    tagline:
      "La marca y el sitio de una escuela de confiabilidad para minería e industria",
    meta: [
      ["Estado", "En línea"],
      ["Entregables", "Identidad, marca aplicada, sitio web"],
      ["Industria", "Formación técnica y consultoría industrial"],
      ["Líneas", "MainTech Academy y MainTech Solutions"],
    ],
    statement:
      "A MainTech le hicimos la marca entera y el sitio donde vive: un símbolo modular, un sistema tipográfico y una web que separa la academia de la consultoría sin partir la marca en dos.",
    context:
      "MainTech forma ingenieros de mantenimiento y confiabilidad desde Arequipa: cursos en vivo y grabados para minería e industria, programas de especialización y certificados verificables, más una línea de consultoría para planta y flota. Llegaron sin marca y sin sitio.",
    highlightsTitle: ["Lo que", "hicimos"],
    highlights: [
      {
        lead: "Símbolo y logotipo",
        text: "una retícula de bloques en índigo, cian y rosa, en lockup con la palabra y el descriptor.",
      },
      {
        lead: "Sistema tipográfico",
        text: "Orbitron en los titulares y Poppins en cinco pesos para todo lo demás.",
      },
      {
        lead: "Paleta",
        text: "índigo, cian y rosa sobre tinta, con un degradado de violeta a coral para las cabeceras.",
      },
      {
        lead: "Dos líneas, una marca",
        text: "Academy y Solutions comparten logotipo y se separan solo por el descriptor de al lado.",
      },
      {
        lead: "Sitio en Next.js",
        text: "nueve páginas, catálogo con filtros por especialidad, ficha de curso y verificación de certificados.",
      },
      {
        lead: "Marca aplicada",
        text: "rótulo de sala, manual del curso y equipo de protección, sobre las superficies del oficio.",
      },
    ],
    challengeTitle: "Reto",
    challenge:
      "Una escuela técnica vende confianza antes que contenido: quien paga un programa de confiabilidad quiere saber que el certificado valdrá. La marca tenía que sostener las dos caras del negocio, la formación y la consultoría, sin que una pareciera sucursal de la otra.",
    actos: {
      identidad: {
        index: "Acto 01",
        title: ["El símbolo", "y su sistema"],
        body: "El símbolo es una retícula de bloques en índigo, cian y rosa: la misma pieza sirve de favicon a 32 píxeles y de rótulo a un metro. Debajo del logotipo va siempre el descriptor, «El futuro del mantenimiento tecnológico».",
      },
      aplicaciones: {
        index: "Acto 02",
        title: ["La marca", "en el taller"],
        body: "La identidad baja al mundo donde se ve: la entrada de la sala, el manual que se llevan y el casco con el que entran al taller. Las tres imágenes son mockups —escenas generadas con el logotipo real compuesto encima—, no fotografías de piezas producidas.",
      },
      sitio: {
        index: "Acto 03",
        title: ["Un dominio,", "dos puertas"],
        body: "maintech.com.pe es un Next.js de nueve páginas. La entrada pregunta a qué vienes, el catálogo filtra por especialidad, la ficha de curso da fechas, capítulos y precio, y una página verifica un certificado por su código.",
      },
    },
    outcomesTitle: "Lo entregado",
    outcomes:
      "MainTech se quedó con el logotipo, el sistema tipográfico, la paleta y el sitio publicado, con dieciséis cursos en el sitemap. No publicamos cifras: su analítica no es nuestra.",
    stackTitle: "Disciplinas y tecnología",
    stack: [
      "Identidad de marca",
      "Diseño de logotipo",
      "Sistema tipográfico",
      "Paleta cromática",
      "Arquitectura de marca",
      "Aplicaciones de marca",
      "Diseño y desarrollo web",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Cloudflare R2",
      "SEO técnico",
    ],
    leads: {
      identidad:
        "Un símbolo de bloques, la palabra y una promesa debajo: el futuro del mantenimiento tecnológico.",
      lineas:
        "Una marca y dos puertas: el sitio pregunta si vienes a formarte o a contratar.",
      rotulo:
        "El logotipo a escala de pared, a la entrada de la sala de clase.",
      web: "La portada de Academy: para quién es el programa y qué te llevas de vuelta.",
      solutions:
        "La otra línea: seis servicios de confiabilidad, flota y transformación digital.",
    },
    pies: {
      identidad:
        "Logotipo MainTech · el archivo del cliente, de su sitio en vivo",
      paleta: "Paleta medida del logotipo y del CSS de maintech.com.pe",
      tipografia:
        "Orbitron en titulares y Poppins en texto · las fuentes que sirve el sitio",
      lineas: "maintech.com.pe · la pantalla de entrada, con las dos líneas",
      rotulo:
        "Rótulo de sala, mockup · escena generada; el logotipo compuesto encima es el real",
      manual:
        "Manual del curso, mockup · escena generada; el logotipo compuesto encima es el real",
      casco:
        "Casco de seguridad, mockup · escena generada; el logotipo compuesto encima es el real",
      web: "maintech.com.pe · la portada de MainTech Academy",
      cursos:
        "maintech.com.pe/courses · filtros por especialidad y ficha de cada curso",
      cursoMovil:
        "maintech.com.pe/courses/… · el programa de especialización, en móvil",
      solutions:
        "maintech.com.pe/solutions · las seis soluciones de MainTech Solutions",
    },
    alt: {
      identidad:
        "El logotipo de MainTech en blanco sobre un campo índigo, con el símbolo de bloques al lado",
      paleta:
        "Lámina con las fichas de color de MainTech y sus valores hexadecimales",
      tipografia:
        "Espécimen tipográfico con la «Aa» en Orbitron y una línea en Poppins",
      lineas:
        "La pantalla de entrada de maintech.com.pe, con las tarjetas de Solutions y Academy",
      rotulo:
        "Un panel de vidrio con el logotipo de MainTech, a la entrada de una sala de formación",
      manual:
        "Un manual de tapa dura en tela índigo con el logotipo de MainTech estampado en blanco, sobre un banco de taller",
      casco:
        "Un casco de seguridad blanco con el logotipo de MainTech impreso al frente, sobre un banco de acero",
      web: "La portada de MainTech Academy con el titular «Confiabilidad & Datos aplicados»",
      cursos:
        "El catálogo de cursos de MainTech con los filtros de especialidad y tres tarjetas",
      cursoMovil:
        "La ficha del programa de especialización en mantenimiento y confiabilidad, en un móvil",
      solutions:
        "La página de soluciones de MainTech con la lista de seis servicios",
    },
    nextTagline:
      "La plataforma de cursos en línea de Axium: marca, sitio y panel de un SaaS propio",
  },
  en: {
    tagline:
      "The brand and the site of a reliability school for mining and industry",
    meta: [
      ["Status", "Live"],
      ["Deliverables", "Identity, applied brand, website"],
      ["Industry", "Technical training and industrial consulting"],
      ["Lines", "MainTech Academy and MainTech Solutions"],
    ],
    statement:
      "We built MainTech's whole brand and the site it lives in: a modular symbol, a type system and a website that separates the academy from the consultancy without splitting the brand in two.",
    context:
      "MainTech trains maintenance and reliability engineers out of Arequipa: live and recorded courses for mining and industry, specialisation programmes and verifiable certificates, plus a consulting line for plant and fleet. They arrived with no brand and no site.",
    highlightsTitle: ["What we", "did"],
    highlights: [
      {
        lead: "Symbol and logotype",
        text: "a grid of blocks in indigo, cyan and pink, locked up with the wordmark and the descriptor.",
      },
      {
        lead: "Type system",
        text: "Orbitron for headlines and Poppins in five weights for everything else.",
      },
      {
        lead: "Palette",
        text: "indigo, cyan and pink over ink, with a violet-to-coral gradient for the headers.",
      },
      {
        lead: "Two lines, one brand",
        text: "Academy and Solutions share the logotype and are told apart only by the descriptor beside it.",
      },
      {
        lead: "A Next.js site",
        text: "nine pages, a catalogue filtered by speciality, a course page and certificate verification.",
      },
      {
        lead: "Applied brand",
        text: "room signage, the course manual and protective gear, on the surfaces of the trade.",
      },
    ],
    challengeTitle: "Challenge",
    challenge:
      "A technical school sells trust before it sells content: whoever pays for a reliability programme wants to know the certificate will hold. The brand had to carry both sides of the business, training and consulting, without either looking like a branch of the other.",
    actos: {
      identidad: {
        index: "Act 01",
        title: ["The symbol", "and its system"],
        body: "The symbol is a grid of blocks in indigo, cyan and pink: the same piece works as a 32-pixel favicon and as a one-metre sign. The descriptor always sits under the logotype, «El futuro del mantenimiento tecnológico».",
      },
      aplicaciones: {
        index: "Act 02",
        title: ["The brand", "in the workshop"],
        body: "The identity comes down to where it is really seen: the room entrance, the manual students take home and the hard hat they wear into the workshop. All three images are mockups —generated scenes with the real logotype composited on top—, not photographs of produced items.",
      },
      sitio: {
        index: "Act 03",
        title: ["One domain,", "two doors"],
        body: "maintech.com.pe is a nine-page Next.js site. The entrance asks what you came for, the catalogue filters by speciality, the course page gives dates, chapters and price, and one page verifies a certificate by its code.",
      },
    },
    outcomesTitle: "What was delivered",
    outcomes:
      "MainTech kept the logotype, the type system, the palette and the published site, with sixteen courses in the sitemap. We publish no figures: their analytics are not ours.",
    stackTitle: "Disciplines and technology",
    stack: [
      "Brand identity",
      "Logotype design",
      "Type system",
      "Colour palette",
      "Brand architecture",
      "Brand applications",
      "Web design and build",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Cloudflare R2",
      "Technical SEO",
    ],
    leads: {
      identidad:
        "A symbol of blocks, the wordmark and a promise underneath: the future of technological maintenance.",
      lineas:
        "One brand, two doors: the site asks whether you came to train or to hire.",
      rotulo: "The logotype at wall scale, at the entrance to the classroom.",
      web: "The Academy home: who the programme is for and what you take back.",
      solutions:
        "The other line: six services across reliability, fleet and digital transformation.",
    },
    pies: {
      identidad:
        "MainTech logotype · the client's own file, taken from their live site",
      paleta:
        "Palette measured from the logotype and from maintech.com.pe's CSS",
      tipografia:
        "Orbitron for headlines and Poppins for text · the fonts the site serves",
      lineas: "maintech.com.pe · the entry screen, with both lines",
      rotulo:
        "Room sign, mockup · generated scene; the logotype composited on top is the real one",
      manual:
        "Course manual, mockup · generated scene; the logotype composited on top is the real one",
      casco:
        "Safety helmet, mockup · generated scene; the logotype composited on top is the real one",
      web: "maintech.com.pe · the MainTech Academy home",
      cursos:
        "maintech.com.pe/courses · speciality filters and a card per course",
      cursoMovil:
        "maintech.com.pe/courses/… · the specialisation programme, on mobile",
      solutions: "maintech.com.pe/solutions · MainTech Solutions' six services",
    },
    alt: {
      identidad:
        "MainTech's logotype in white on an indigo field, with the block symbol beside it",
      paleta: "Board with MainTech's colour swatches and their hex values",
      tipografia:
        "Type specimen with «Aa» set in Orbitron and a line set in Poppins",
      lineas:
        "The entry screen of maintech.com.pe, with the Solutions and Academy cards",
      rotulo:
        "A glass panel carrying MainTech's logotype at the entrance to a training room",
      manual:
        "An indigo cloth hardcover manual with MainTech's logotype stamped in white, on a workshop bench",
      casco:
        "A white safety helmet with MainTech's logotype printed on the front, on a steel bench",
      web: "The MainTech Academy home with the headline «Confiabilidad & Datos aplicados»",
      cursos:
        "MainTech's course catalogue with the speciality filters and three cards",
      cursoMovil:
        "The maintenance and reliability specialisation programme page, on a phone",
      solutions: "MainTech's solutions page with the list of six services",
    },
    nextTagline:
      "Axium's own online course platform: brand, site and dashboard of an in-house SaaS",
  },
  pt: {
    tagline:
      "A marca e o site de uma escola de confiabilidade para mineração e indústria",
    meta: [
      ["Estado", "No ar"],
      ["Entregáveis", "Identidade, marca aplicada, site"],
      ["Indústria", "Formação técnica e consultoria industrial"],
      ["Linhas", "MainTech Academy e MainTech Solutions"],
    ],
    statement:
      "Fizemos para a MainTech a marca inteira e o site onde ela vive: um símbolo modular, um sistema tipográfico e uma web que separa a academia da consultoria sem partir a marca em duas.",
    context:
      "A MainTech forma engenheiros de manutenção e confiabilidade a partir de Arequipa: cursos ao vivo e gravados para mineração e indústria, programas de especialização e certificados verificáveis, mais uma linha de consultoria para planta e frota. Chegaram sem marca e sem site.",
    highlightsTitle: ["O que", "fizemos"],
    highlights: [
      {
        lead: "Símbolo e logotipo",
        text: "uma retícula de blocos em índigo, ciano e rosa, em lockup com a palavra e o descritor.",
      },
      {
        lead: "Sistema tipográfico",
        text: "Orbitron nos títulos e Poppins em cinco pesos para todo o resto.",
      },
      {
        lead: "Paleta",
        text: "índigo, ciano e rosa sobre tinta, com um degradê de violeta a coral para os cabeçalhos.",
      },
      {
        lead: "Duas linhas, uma marca",
        text: "Academy e Solutions partilham o logotipo e separam-se só pelo descritor ao lado.",
      },
      {
        lead: "Site em Next.js",
        text: "nove páginas, catálogo com filtros por especialidade, ficha de curso e verificação de certificados.",
      },
      {
        lead: "Marca aplicada",
        text: "placa de sala, manual do curso e equipamento de proteção, sobre as superfícies do ofício.",
      },
    ],
    challengeTitle: "Desafio",
    challenge:
      "Uma escola técnica vende confiança antes de vender conteúdo: quem paga um programa de confiabilidade quer saber que o certificado vai valer. A marca tinha de sustentar as duas caras do negócio, a formação e a consultoria, sem que uma parecesse filial da outra.",
    actos: {
      identidad: {
        index: "Ato 01",
        title: ["O símbolo", "e o seu sistema"],
        body: "O símbolo é uma retícula de blocos em índigo, ciano e rosa: a mesma peça serve de favicon a 32 píxeis e de placa a um metro. Por baixo do logotipo vai sempre o descritor, «El futuro del mantenimiento tecnológico».",
      },
      aplicaciones: {
        index: "Ato 02",
        title: ["A marca", "na oficina"],
        body: "A identidade desce até onde de facto se vê: a entrada da sala, o manual que levam consigo e o capacete com que entram na oficina. As três imagens são mockups —cenas geradas com o logotipo real composto por cima—, não fotografias de peças produzidas.",
      },
      sitio: {
        index: "Ato 03",
        title: ["Um domínio,", "duas portas"],
        body: "maintech.com.pe é um Next.js de nove páginas. A entrada pergunta ao que vens, o catálogo filtra por especialidade, a ficha de curso dá datas, capítulos e preço, e uma página verifica um certificado pelo código.",
      },
    },
    outcomesTitle: "O que foi entregue",
    outcomes:
      "A MainTech ficou com o logotipo, o sistema tipográfico, a paleta e o site publicado, com dezasseis cursos no sitemap. Não publicamos números: a analítica deles não é nossa.",
    stackTitle: "Disciplinas e tecnologia",
    stack: [
      "Identidade de marca",
      "Design de logotipo",
      "Sistema tipográfico",
      "Paleta cromática",
      "Arquitetura de marca",
      "Aplicações de marca",
      "Design e desenvolvimento web",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Cloudflare R2",
      "SEO técnico",
    ],
    leads: {
      identidad:
        "Um símbolo de blocos, a palavra e uma promessa por baixo: o futuro da manutenção tecnológica.",
      lineas:
        "Uma marca e duas portas: o site pergunta se vens formar-te ou contratar.",
      rotulo: "O logotipo à escala de parede, à entrada da sala de aula.",
      web: "A capa da Academy: para quem é o programa e o que levas de volta.",
      solutions:
        "A outra linha: seis serviços de confiabilidade, frota e transformação digital.",
    },
    pies: {
      identidad: "Logotipo MainTech · o arquivo do cliente, do seu site no ar",
      paleta: "Paleta medida do logotipo e do CSS de maintech.com.pe",
      tipografia:
        "Orbitron nos títulos e Poppins no texto · as fontes que o site serve",
      lineas: "maintech.com.pe · o ecrã de entrada, com as duas linhas",
      rotulo:
        "Placa de sala, mockup · cena gerada; o logotipo composto por cima é o real",
      manual:
        "Manual do curso, mockup · cena gerada; o logotipo composto por cima é o real",
      casco:
        "Capacete de segurança, mockup · cena gerada; o logotipo composto por cima é o real",
      web: "maintech.com.pe · a capa da MainTech Academy",
      cursos:
        "maintech.com.pe/courses · filtros por especialidade e ficha de cada curso",
      cursoMovil:
        "maintech.com.pe/courses/… · o programa de especialização, em telemóvel",
      solutions:
        "maintech.com.pe/solutions · as seis soluções da MainTech Solutions",
    },
    alt: {
      identidad:
        "O logotipo da MainTech a branco sobre um campo índigo, com o símbolo de blocos ao lado",
      paleta:
        "Lâmina com as fichas de cor da MainTech e os seus valores hexadecimais",
      tipografia:
        "Espécime tipográfico com o «Aa» em Orbitron e uma linha em Poppins",
      lineas:
        "O ecrã de entrada de maintech.com.pe, com os cartões de Solutions e Academy",
      rotulo:
        "Um painel de vidro com o logotipo da MainTech à entrada de uma sala de formação",
      manual:
        "Um manual de capa dura em tela índigo com o logotipo da MainTech estampado a branco, sobre uma bancada",
      casco:
        "Um capacete de segurança branco com o logotipo da MainTech impresso à frente, sobre uma bancada de aço",
      web: "A capa da MainTech Academy com o título «Confiabilidad & Datos aplicados»",
      cursos:
        "O catálogo de cursos da MainTech com os filtros de especialidade e três cartões",
      cursoMovil:
        "A ficha do programa de especialização em manutenção e confiabilidade, num telemóvel",
      solutions:
        "A página de soluções da MainTech com a lista de seis serviços",
    },
    nextTagline:
      "A plataforma de cursos online da Axium: marca, site e painel de um SaaS próprio",
  },
};

/**
 * Quince bloques, ocho de imagen: CINCO anchas y TRES pares de cuadradas, once piezas.
 *
 * El orden sale de la vara de `referencias/brandvm-ordering.md` y de las dos
 * correcciones de hoy (ritmo y dos columnas):
 *   · La lámina del logotipo ABRE la ficha, delante de todo texto: la frase de arriba
 *     habla de «un símbolo modular» y aquí está, sin dos pantallas de prosa antes.
 *   · La paleta y la tipografía suben detrás de las viñetas, que las nombran («índigo,
 *     cian y rosa», «Orbitron y Poppins»), y parten el tramo de texto de la apertura.
 *   · El reto baja al acto 02, entre el rótulo y el par de manual y casco: habla de
 *     vender confianza, y ahí tiene al lado las piezas que la venden en el mundo físico.
 *   · «Lo entregado» se mete delante de la última ancha, para que el cierre no sean dos
 *     textos pegados antes del carrusel.
 * Tramos de texto sin imagen a 1440: el mayor es 690 px (acto 03 + frase de `web`).
 */
function bloques(c: Copy): StoryBlock[] {
  return [
    // El logotipo abre la ficha: la marca antes que el argumento.
    {
      kind: "wide",
      lead: c.leads.identidad,
      image: {
        src: `${IMG}/mt-identidad.jpg`,
        alt: c.alt.identidad,
        caption: c.pies.identidad,
        mobileSrc: `${IMG}/mt-identidad-movil.jpg`,
      },
    },
    {
      kind: "highlights",
      title: c.highlightsTitle,
      items: c.highlights,
    },
    // Las dos láminas que las viñetas acaban de nombrar, partiendo el texto de apertura.
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/mt-paleta.jpg`,
          alt: c.alt.paleta,
          caption: c.pies.paleta,
        },
        {
          src: `${IMG}/mt-tipografia.jpg`,
          alt: c.alt.tipografia,
          caption: c.pies.tipografia,
        },
      ],
    },

    // ── ACTO 01 · EL SÍMBOLO Y SU SISTEMA ──
    {
      kind: "act",
      index: c.actos.identidad.index,
      title: c.actos.identidad.title,
      body: c.actos.identidad.body,
    },
    {
      kind: "wide",
      lead: c.leads.lineas,
      image: {
        src: `${IMG}/mt-lineas.jpg`,
        alt: c.alt.lineas,
        caption: c.pies.lineas,
        mobileSrc: `${IMG}/mt-lineas-movil.jpg`,
      },
    },

    // ── ACTO 02 · LA MARCA APLICADA (mockups, y la ficha lo dice) ──
    {
      kind: "act",
      index: c.actos.aplicaciones.index,
      title: c.actos.aplicaciones.title,
      body: c.actos.aplicaciones.body,
    },
    {
      kind: "wide",
      lead: c.leads.rotulo,
      image: {
        src: `${IMG}/mt-rotulo.jpg`,
        alt: c.alt.rotulo,
        caption: c.pies.rotulo,
        mobileSrc: `${IMG}/mt-rotulo-movil.jpg`,
      },
    },
    // El reto, entre las piezas que lo responden: el rótulo, el manual y el casco.
    { kind: "text", title: c.challengeTitle, body: c.challenge },
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/mt-manual.jpg`,
          alt: c.alt.manual,
          caption: c.pies.manual,
        },
        {
          src: `${IMG}/mt-casco-banco.jpg`,
          alt: c.alt.casco,
          caption: c.pies.casco,
        },
      ],
    },

    // ── ACTO 03 · EL SITIO (todo captura real, cada pieza con su URL al pie) ──
    {
      kind: "act",
      index: c.actos.sitio.index,
      title: c.actos.sitio.title,
      body: c.actos.sitio.body,
    },
    {
      kind: "wide",
      lead: c.leads.web,
      image: {
        src: `${IMG}/mt-web.jpg`,
        alt: c.alt.web,
        caption: c.pies.web,
        mobileSrc: `${IMG}/mt-web-movil.jpg`,
      },
    },
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/mt-cursos.jpg`,
          alt: c.alt.cursos,
          caption: c.pies.cursos,
        },
        {
          src: `${IMG}/mt-curso-movil.jpg`,
          alt: c.alt.cursoMovil,
          caption: c.pies.cursoMovil,
        },
      ],
    },
    // «Lo entregado» delante de la última pieza: el cierre no son dos textos pegados.
    { kind: "text", id: "resultado", title: c.outcomesTitle, body: c.outcomes },
    {
      kind: "wide",
      lead: c.leads.solutions,
      image: {
        src: `${IMG}/mt-solutions.jpg`,
        alt: c.alt.solutions,
        caption: c.pies.solutions,
        mobileSrc: `${IMG}/mt-solutions-movil.jpg`,
      },
    },
    { kind: "tags", title: c.stackTitle, items: c.stack },
  ];
}

export default function MaintechContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseStory
        /*
         * El acento es de MainTech, no de Axium. Los tres colores salen medidos de su
         * logotipo: índigo #1C116A, cian #00C3F5 y rosa #FF416A. El cian tal cual da
         * 2,1:1 sobre blanco, así que `base` es ese mismo cian oscurecido hasta 4,95:1
         * (#007A99); `dark` sí puede ser el cian de la marca, que sobre la tinta #060C20
         * da 9,4:1. `deep` es el índigo del logotipo, y cierra el degradado del hero.
         */
        accent={{ base: "#007A99", dark: "#00C3F5", deep: "#1C116A" }}
        name="MainTech"
        tagline={c.tagline}
        heroImage={`${IMG}/mt-hero.jpg`}
        heroPosition="62% 52%"
        logo={{ src: `${IMG}/mt-logo.png`, width: 1584, height: 324 }}
        liveUrl="https://maintech.com.pe"
        meta={c.meta}
        statement={c.statement}
        context={c.context}
        blocks={bloques(c)}
        next={{
          name: "LumioLearn",
          tagline: c.nextTagline,
          href: "/casos-de-exito/lumiolearn",
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
