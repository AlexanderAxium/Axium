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
 * Ficha de Fintrace: el SaaS contable que empieza donde termina el facturador
 * electrónico y acaba en el asiento que el contador importa en Concar.
 *
 * ── DE DÓNDE SALE CADA COSA (2026-10-03) ───────────────────────────────────────────
 * TODA la interfaz de esta ficha es captura real. Nada se generó con IA.
 *   · Sitio público   DOS capturas de fintrace.app-siclo.online en vivo, Playwright a 2x:
 *                     la portada y el bloque «qué entra y qué sale». La landing es
 *                     sencilla y no da para más; el peso de la ficha está en el panel.
 *   · Panel privado   la app levantada EN LOCAL desde el repo real (~/Documents/Fintrace)
 *                     contra una base LOCAL (docker postgres 5433, `fintrace_dev`) y una
 *                     **siembra de demostración escrita para esta ficha**. En la ficha no
 *                     hay un solo dato de un cliente de Fintrace: la empresa, los seis
 *                     clientes, los seis proveedores, los RUC, las cuentas bancarias, los
 *                     28 comprobantes emitidos, los 24 de compra, los 42 movimientos del
 *                     extracto y la conciliación son inventados. Los pies lo dicen.
 *                     ⚠️ `fintrace.app-siclo.online` es el despliegue de un inquilino: de
 *                     ese dominio **sólo** salen las dos capturas públicas. Ni una de panel.
 *   · Logotipo        el lockup real del repo (public/marca/fintrace-logo.png).
 *   · Paleta          los tokens del propio producto, medidos en su landing
 *                     (src/app/(public)/cuerpo.tsx): AZUL #3040F5, MARINO #0E1442,
 *                     TINTA #0B0B12; el isotipo arranca en #233AFF.
 *   · Lámina          cada caja de «el viaje de un comprobante» está medida contra el
 *                     código: el parser de UBL 2.1 (src/lib/sunat/ubl-parser.ts), los
 *                     lectores de extracto (PDF, XLSX y CSV) y el asiento de cuatro
 *                     líneas que genera la conciliación.
 * Lo ÚNICO generado con OpenAI (gpt-image-2.5-flare, high) son dos campos de materia
 * SIN una letra ni un píxel de interfaz: el papel índigo de la portada y el hormigón
 * del hero. La captura real se compone encima.
 * Taller: .claude/skills/portafolio-axium/capturas-clientes/fintrace/
 *
 * ── LO QUE SUSTITUYE ───────────────────────────────────────────────────────────────
 * Ocupa el puesto de «Financial Management System», que era una ficha genérica sin
 * nombre, sin sitio y sin una sola captura del producto. Lo que había debajo es esto.
 *
 * ── EL STACK, MEDIDO ───────────────────────────────────────────────────────────────
 * package.json del repo + cabeceras del sitio en vivo (x-powered-by: Next.js):
 * Next.js 15.5.9 · React 19 · TypeScript 5.9 · tRPC 11 · Prisma 6.5 sobre PostgreSQL 16 ·
 * Tailwind 4 · Radix/shadcn · Better Auth · next-intl (es/en/pt) · Recharts ·
 * Playwright (PDF) · fast-xml-parser (UBL 2.1) · pdfjs-dist + xlsx + papaparse (extractos) ·
 * SendGrid · Cloudflare R2. Medido en el código: 86 modelos Prisma, 50 enums,
 * 37 routers tRPC con 436 procedimientos, 50 pantallas de panel, 34 recursos de permiso.
 * `results` va VACÍO: no hay métricas de negocio publicables.
 *
 * TRES ACTOS:
 *   01 · El comprobante entra solo    el XML de SUNAT y el documento que arma
 *   02 · El dinero que entra          cuentas por cobrar y cobro por cuotas
 *   03 · El mes cuadra                conciliación, asiento y Concar
 *
 * RITMO: catorce bloques, ocho de imagen — SEIS anchas y DOS pares, DIEZ piezas.
 * Tres de las anchas son losa partida (dos cosas en un archivo), así que cinco de los
 * ocho bloques enseñan dos cosas. Ningún tramo pasa de 700 px sin imagen.
 */

const IMG = "/images/proyects/fintrace";

type Acto = { index: string; title: [string, string]; body: string };

/** Las diez piezas del relato: seis anchas (tres partidas) y dos pares. */
type Pieza =
  | "sitio"
  | "documentos"
  | "detraccion"
  | "viaje"
  | "cxc"
  | "cobranza"
  | "conciliacion"
  | "extracto"
  | "movil"
  | "contable";

type Copy = {
  tagline: string;
  meta: [string, string][];
  statement: string;
  context: string;
  highlightsTitle: [string, string];
  highlights: { lead: string; text: string }[];
  actos: Record<"entra" | "cobra" | "cuadra", Acto>;
  outcomesTitle: string;
  outcomes: string;
  stackTitle: string;
  stack: string[];
  /** Solo las piezas anchas llevan frase: un bloque `pair` no admite `lead`. */
  leads: {
    sitio: string;
    viaje: string;
    cxc: string;
    cobranza: string;
    conciliacion: string;
    contable: string;
  };
  pies: Record<Pieza, string>;
  alt: Record<Pieza, string>;
  nextTagline: string;
};

const COPY: Record<StoryLang, Copy> = {
  es: {
    tagline:
      "El SaaS contable que empieza donde termina el facturador electrónico",
    meta: [
      ["Estado", "En línea"],
      [
        "Entregables",
        "Sitio público, autenticación, panel multiempresa y exportación contable",
      ],
      ["Industria", "Cobranzas y contabilidad"],
      ["Dominio", "86 modelos, 50 pantallas, 37 routers tRPC"],
    ],
    statement:
      "A Fintrace le construimos el producto entero: el sitio que lo vende, el acceso, el panel multiempresa y la exportación que el contador importa. Empieza donde termina el facturador electrónico y acaba en el asiento.",
    context:
      "Entre el facturador y el software del contador no hay nada: un Excel compartido, el extracto sin cruzar y la detracción en un PDF del banco. Fintrace ocupa ese hueco.",
    highlightsTitle: ["Lo que", "construimos"],
    highlights: [
      {
        lead: "Comprobantes",
        text: "lectura del XML UBL 2.1 firmado y de los recibos por honorarios, con sus líneas, su IGV y su detracción.",
      },
      {
        lead: "Cuentas por cobrar",
        text: "facturas, notas de crédito, cotizaciones y planes de cobro con sus cuotas, su fecha y su estado.",
      },
      {
        lead: "Cuentas por pagar",
        text: "documentos de compra, proveedores, detracciones y pagos, con el centro de costo de cada obra.",
      },
      {
        lead: "Conciliación bancaria",
        text: "el extracto en PDF, XLSX y CSV, cruzado por número de operación contra los documentos del periodo.",
      },
      {
        lead: "Contabilidad",
        text: "plan de cuentas, plantillas de asiento, asientos generados desde la conciliación y exportación a Concar.",
      },
      {
        lead: "Multiempresa",
        text: "varias empresas en una instancia, con roles propios sobre 34 recursos y auditoría de cada cambio.",
      },
    ],
    actos: {
      entra: {
        index: "01",
        title: ["El comprobante", "entra solo"],
        body: "Fintrace no emite: lee. Toma el XML UBL 2.1 que la empresa ya emitió y arma el documento con su proveedor, su IGV, su detracción y el centro de costo de la obra que lo pidió.",
      },
      cobra: {
        index: "02",
        title: ["El dinero", "que entra"],
        body: "Veintiocho comprobantes del mes en una pantalla: lo cobrado, lo vencido y lo que vence esta semana. Y el cobro pactado cuota por cuota, con fecha, no prometido en un correo.",
      },
      cuadra: {
        index: "03",
        title: ["El mes cuadra,", "y el contador lo recibe"],
        body: "El extracto del banco entra en PDF, XLSX o CSV. De la glosa sale el código del documento, la conciliación se cierra con la diferencia en cero y lo que queda es el asiento.",
      },
    },
    outcomesTitle: "Lo entregado",
    outcomes:
      "Cincuenta pantallas de panel en producción, de los comprobantes a Concar, sobre una base multiempresa con permisos por recurso. El sitio público, el acceso y el panel se construyeron enteros, y el producto sigue creciendo mes a mes.",
    stackTitle: "Stack y disciplinas",
    stack: [
      "Producto SaaS a medida",
      "Next.js 15",
      "React 19",
      "TypeScript",
      "tRPC 11",
      "Prisma 6",
      "PostgreSQL 16",
      "Tailwind 4",
      "Radix · shadcn",
      "Better Auth",
      "next-intl · es/en/pt",
      "Recharts",
      "Playwright · PDF",
      "UBL 2.1 · SUNAT",
      "Concar",
      "Cloudflare R2",
      "SendGrid",
      "Multiempresa y RBAC",
    ],
    leads: {
      sitio:
        "El sitio no vende un software: vende un formato. Dice qué entra y qué sale, y empieza por ahí.",
      viaje:
        "Un comprobante entra como XML y sale como asiento. Entre medio no hay nadie retipeando.",
      cxc: "Veintiocho comprobantes del mes, y el estado de cada sol en seis cifras.",
      cobranza:
        "Lo emitido y lo pactado, en la misma vista: cada cuota con su fecha y su importe.",
      conciliacion:
        "El extracto del banco contra los documentos del periodo, y la diferencia en cero.",
      contable:
        "El plan de cuentas del cliente y el archivo que su contador ya sabe importar.",
    },
    pies: {
      sitio: "fintrace.app-siclo.online · portada y contrato de formatos",
      documentos:
        "Documentos de compra · panel en local, datos de demostración",
      detraccion:
        "Ficha de un documento: detracción pendiente y centro de costo · datos de demostración",
      viaje:
        "Del XML UBL 2.1 al asiento contable, medido contra el parser y los lectores de extracto",
      cxc: "Dashboard de cuentas por cobrar · datos de demostración",
      cobranza:
        "Facturas emitidas y planes de cobro por cuotas · datos de demostración",
      conciliacion:
        "Conciliación de setiembre: 42 movimientos del extracto · datos de demostración",
      extracto:
        "Movimientos bancarios: el código de documento extraído de la glosa · datos de demostración",
      movil: "El panel a 390 px · datos de demostración",
      contable:
        "Plan de cuentas y exportación a Concar · datos de demostración",
    },
    alt: {
      sitio:
        "Portada de Fintrace con el titular «Cobra lo que facturaste, sin perseguirlo» y el bloque de formatos que entran y salen",
      documentos:
        "Lista de documentos de compra de Fintrace con proveedor, emisión, vencimiento y neto a pagar",
      detraccion:
        "Ficha de un documento de compra con sus totales, la detracción pendiente y el centro de costo",
      viaje:
        "Diagrama del camino de un comprobante en Fintrace: del XML UBL 2.1 al asiento y al archivo de Concar",
      cxc: "Dashboard de cuentas por cobrar de Fintrace con por cobrar, facturado neto, vencido y por vencer",
      cobranza:
        "Facturas emitidas y planes de cobro por cuotas en el panel de Fintrace",
      conciliacion:
        "Pantalla de conciliación bancaria de Fintrace con movimientos sin conciliar, items conciliados y documentos pendientes",
      extracto:
        "Tabla de movimientos bancarios de Fintrace con el código de documento extraído de la glosa del banco",
      movil: "El panel de Fintrace en un teléfono",
      contable:
        "Plan de cuentas, exportador a Concar y asiento contable en el panel de Fintrace",
    },
    nextTagline: "El producto entero de una plataforma para traders de fondeo",
  },

  en: {
    tagline:
      "The accounting SaaS that starts where the e-invoicing system ends",
    meta: [
      ["Status", "Live"],
      [
        "Deliverables",
        "Public site, authentication, multi-tenant panel and accounting export",
      ],
      ["Industry", "Collections and accounting"],
      ["Domain", "86 models, 50 screens, 37 tRPC routers"],
    ],
    statement:
      "We built Fintrace whole: the site that sells it, sign-in, the multi-tenant panel and the export the accountant imports. It starts where the e-invoicing system ends and finishes at the journal entry.",
    context:
      "Between the invoicing system and the accountant's software there is nothing: a shared spreadsheet, an unreconciled statement and the withholding in a bank PDF. Fintrace fills that gap.",
    highlightsTitle: ["What we", "built"],
    highlights: [
      {
        lead: "Documents",
        text: "reading of the signed UBL 2.1 XML and of professional fee receipts, with their lines, VAT and withholding.",
      },
      {
        lead: "Receivables",
        text: "invoices, credit notes, quotes and collection plans with their instalments, dates and status.",
      },
      {
        lead: "Payables",
        text: "purchase documents, suppliers, withholdings and payments, each with the cost centre of its site.",
      },
      {
        lead: "Bank reconciliation",
        text: "the statement in PDF, XLSX and CSV, matched by operation number against the period's documents.",
      },
      {
        lead: "Accounting",
        text: "chart of accounts, entry templates, entries generated from the reconciliation and Concar export.",
      },
      {
        lead: "Multi-tenant",
        text: "several companies on one instance, with their own roles over 34 resources and an audit of every change.",
      },
    ],
    actos: {
      entra: {
        index: "01",
        title: ["The document", "comes in by itself"],
        body: "Fintrace does not issue: it reads. It takes the UBL 2.1 XML the company already issued and builds the record with its supplier, its VAT, its withholding and the cost centre that asked for it.",
      },
      cobra: {
        index: "02",
        title: ["The money", "coming in"],
        body: "Twenty-eight documents of the month on one screen: collected, overdue and due this week. And the collection agreed instalment by instalment, with a date, not promised in an email.",
      },
      cuadra: {
        index: "03",
        title: ["The month balances,", "and the accountant gets it"],
        body: "The bank statement comes in as PDF, XLSX or CSV. The document code is pulled from the memo, the reconciliation closes with the difference at zero, and what is left is the journal entry.",
      },
    },
    outcomesTitle: "What was delivered",
    outcomes:
      "Fifty panel screens in production, from documents to Concar, on a multi-tenant base with per-resource permissions. The public site, sign-in and the panel were built whole, and the product keeps growing month by month.",
    stackTitle: "Stack and disciplines",
    stack: [
      "Custom SaaS product",
      "Next.js 15",
      "React 19",
      "TypeScript",
      "tRPC 11",
      "Prisma 6",
      "PostgreSQL 16",
      "Tailwind 4",
      "Radix · shadcn",
      "Better Auth",
      "next-intl · es/en/pt",
      "Recharts",
      "Playwright · PDF",
      "UBL 2.1 · SUNAT",
      "Concar",
      "Cloudflare R2",
      "SendGrid",
      "Multi-tenant and RBAC",
    ],
    leads: {
      sitio:
        "The site does not sell software: it sells a format. It says what comes in and what goes out.",
      viaje:
        "A document comes in as XML and leaves as a journal entry. In between, nobody retypes a thing.",
      cxc: "Twenty-eight documents of the month, and the state of every sol in six figures.",
      cobranza:
        "What was issued and what was agreed, in one view: every instalment with its date and amount.",
      conciliacion:
        "The bank statement against the period's documents, and the difference at zero.",
      contable:
        "The client's chart of accounts and the file their accountant already knows how to import.",
    },
    pies: {
      sitio: "fintrace.app-siclo.online · home page and format contract",
      documentos: "Purchase documents · local panel, demo data",
      detraccion:
        "A purchase document: pending withholding and cost centre · demo data",
      viaje:
        "From the UBL 2.1 XML to the journal entry, measured against the parser and the statement readers",
      cxc: "Receivables dashboard · demo data",
      cobranza: "Issued invoices and instalment collection plans · demo data",
      conciliacion:
        "September reconciliation: 42 statement movements · demo data",
      extracto:
        "Bank movements: the document code pulled from the bank memo · demo data",
      movil: "The panel at 390 px · demo data",
      contable:
        "Chart of accounts, Concar exporter and the reconciliation journal entry · demo data",
    },
    alt: {
      sitio:
        "Fintrace home page with the headline «Cobra lo que facturaste, sin perseguirlo» and the block of formats in and out",
      documentos:
        "Fintrace purchase document list with supplier, issue date, due date and net payable",
      detraccion:
        "A Fintrace purchase document with its totals, the pending withholding and the cost centre",
      viaje:
        "Diagram of a document's path through Fintrace: from the UBL 2.1 XML to the journal entry and the Concar file",
      cxc: "Fintrace receivables dashboard with outstanding, net invoiced, overdue and due soon",
      cobranza:
        "Issued invoices and instalment collection plans in the Fintrace panel",
      conciliacion:
        "Fintrace bank reconciliation screen with unmatched movements, matched items and pending documents",
      extracto:
        "Fintrace bank movements table with the document code pulled from the bank memo",
      movil: "The Fintrace panel on a phone",
      contable:
        "Chart of accounts, Concar exporter and journal entry in the Fintrace panel",
    },
    nextTagline: "The whole product of a platform for funded-account traders",
  },

  pt: {
    tagline: "O SaaS contábil que começa onde o emissor eletrônico termina",
    meta: [
      ["Estado", "No ar"],
      [
        "Entregas",
        "Site público, autenticação, painel multiempresa e exportação contábil",
      ],
      ["Setor", "Cobranças e contabilidade"],
      ["Domínio", "86 modelos, 50 telas, 37 routers tRPC"],
    ],
    statement:
      "Construímos a Fintrace inteira: o site que a vende, o acesso, o painel multiempresa e a exportação que o contador importa. Começa onde o emissor eletrônico termina e acaba no lançamento.",
    context:
      "Entre o emissor e o software do contador não há nada: uma planilha compartilhada, o extrato sem conciliar e a retenção num PDF do banco. A Fintrace ocupa esse vazio.",
    highlightsTitle: ["O que", "construímos"],
    highlights: [
      {
        lead: "Comprovantes",
        text: "leitura do XML UBL 2.1 assinado e dos recibos de honorários, com suas linhas, seu imposto e sua retenção.",
      },
      {
        lead: "Contas a receber",
        text: "notas, notas de crédito, orçamentos e planos de cobrança com suas parcelas, sua data e seu estado.",
      },
      {
        lead: "Contas a pagar",
        text: "documentos de compra, fornecedores, retenções e pagamentos, com o centro de custo de cada obra.",
      },
      {
        lead: "Conciliação bancária",
        text: "o extrato em PDF, XLSX e CSV, cruzado por número de operação com os documentos do período.",
      },
      {
        lead: "Contabilidade",
        text: "plano de contas, modelos de lançamento, lançamentos gerados da conciliação e exportação para Concar.",
      },
      {
        lead: "Multiempresa",
        text: "várias empresas numa instância, com perfis próprios sobre 34 recursos e auditoria de cada mudança.",
      },
    ],
    actos: {
      entra: {
        index: "01",
        title: ["O comprovante", "entra sozinho"],
        body: "A Fintrace não emite: lê. Pega o XML UBL 2.1 que a empresa já emitiu e monta o documento com seu fornecedor, seu imposto, sua retenção e o centro de custo da obra que o pediu.",
      },
      cobra: {
        index: "02",
        title: ["O dinheiro", "que entra"],
        body: "Vinte e oito comprovantes do mês numa tela: o recebido, o vencido e o que vence nesta semana. E a cobrança acordada parcela a parcela, com data, não prometida num e-mail.",
      },
      cuadra: {
        index: "03",
        title: ["O mês fecha,", "e o contador recebe"],
        body: "O extrato do banco entra em PDF, XLSX ou CSV. Do histórico sai o código do documento, a conciliação fecha com a diferença em zero e o que sobra é o lançamento.",
      },
    },
    outcomesTitle: "O que foi entregue",
    outcomes:
      "Cinquenta telas de painel em produção, dos comprovantes ao Concar, sobre uma base multiempresa com permissões por recurso. O site público, o acesso e o painel foram construídos inteiros, e o produto segue crescendo mês a mês.",
    stackTitle: "Stack e disciplinas",
    stack: [
      "Produto SaaS sob medida",
      "Next.js 15",
      "React 19",
      "TypeScript",
      "tRPC 11",
      "Prisma 6",
      "PostgreSQL 16",
      "Tailwind 4",
      "Radix · shadcn",
      "Better Auth",
      "next-intl · es/en/pt",
      "Recharts",
      "Playwright · PDF",
      "UBL 2.1 · SUNAT",
      "Concar",
      "Cloudflare R2",
      "SendGrid",
      "Multiempresa e RBAC",
    ],
    leads: {
      sitio:
        "O site não vende um software: vende um formato. Diz o que entra e o que sai, e começa por aí.",
      viaje:
        "Um comprovante entra como XML e sai como lançamento. No meio, ninguém redigita nada.",
      cxc: "Vinte e oito comprovantes do mês, e o estado de cada sol em seis números.",
      cobranza:
        "O emitido e o acordado, na mesma vista: cada parcela com sua data e seu valor.",
      conciliacion:
        "O extrato do banco contra os documentos do período, e a diferença em zero.",
      contable:
        "O plano de contas do cliente e o arquivo que o contador dele já sabe importar.",
    },
    pies: {
      sitio: "fintrace.app-siclo.online · capa e contrato de formatos",
      documentos: "Documentos de compra · painel local, dados de demonstração",
      detraccion:
        "Ficha de um documento: retenção pendente e centro de custo · dados de demonstração",
      viaje:
        "Do XML UBL 2.1 ao lançamento contábil, medido contra o parser e os leitores de extrato",
      cxc: "Painel de contas a receber · dados de demonstração",
      cobranza:
        "Notas emitidas e planos de cobrança por parcelas · dados de demonstração",
      conciliacion:
        "Conciliação de setembro: 42 movimentos do extrato · dados de demonstração",
      extracto:
        "Movimentos bancários: o código do documento extraído do histórico · dados de demonstração",
      movil: "O painel a 390 px · dados de demonstração",
      contable:
        "Plano de contas, exportador para Concar e o lançamento da conciliação · dados de demonstração",
    },
    alt: {
      sitio:
        "Capa da Fintrace com o título «Cobra lo que facturaste, sin perseguirlo» e o bloco de formatos que entram e saem",
      documentos:
        "Lista de documentos de compra da Fintrace com fornecedor, emissão, vencimento e líquido a pagar",
      detraccion:
        "Ficha de um documento de compra com seus totais, a retenção pendente e o centro de custo",
      viaje:
        "Diagrama do caminho de um comprovante na Fintrace: do XML UBL 2.1 ao lançamento e ao arquivo do Concar",
      cxc: "Painel de contas a receber da Fintrace com a receber, faturado líquido, vencido e a vencer",
      cobranza:
        "Notas emitidas e planos de cobrança por parcelas no painel da Fintrace",
      conciliacion:
        "Tela de conciliação bancária da Fintrace com movimentos sem conciliar, itens conciliados e documentos pendentes",
      extracto:
        "Tabela de movimentos bancários da Fintrace com o código do documento extraído do histórico do banco",
      movil: "O painel da Fintrace num telefone",
      contable:
        "Plano de contas, exportador para Concar e lançamento no painel da Fintrace",
    },
    nextTagline: "O produto inteiro de uma plataforma para traders de fondeo",
  },
};

function bloques(c: Copy, lang: StoryLang): StoryBlock[] {
  return [
    // El sitio público abre: la única cara que cualquiera puede comprobar.
    {
      kind: "wide",
      lead: c.leads.sitio,
      image: {
        src: `${IMG}/ft-sitio.jpg`,
        alt: c.alt.sitio,
        caption: c.pies.sitio,
        mobileSrc: `${IMG}/ft-sitio-movil.jpg`,
      },
    },
    { kind: "highlights", title: c.highlightsTitle, items: c.highlights },
    // El documento por fuera y por dentro, partiendo el texto de apertura.
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/ft-documentos.jpg`,
          alt: c.alt.documentos,
          caption: c.pies.documentos,
          mobileSrc: `${IMG}/ft-documentos-movil.jpg`,
        },
        {
          src: `${IMG}/ft-detraccion.jpg`,
          alt: c.alt.detraccion,
          caption: c.pies.detraccion,
          mobileSrc: `${IMG}/ft-detraccion-movil.jpg`,
        },
      ],
    },

    // ── ACTO 01 · EL COMPROBANTE ENTRA SOLO ──
    {
      kind: "act",
      index: c.actos.entra.index,
      title: c.actos.entra.title,
      body: c.actos.entra.body,
    },
    {
      kind: "wide",
      lead: c.leads.viaje,
      image: {
        src: `${IMG}/ft-viaje-${lang}.jpg`,
        alt: c.alt.viaje,
        caption: c.pies.viaje,
        mobileSrc: `${IMG}/ft-viaje-movil-${lang}.jpg`,
      },
    },

    // ── ACTO 02 · EL DINERO QUE ENTRA ──
    {
      kind: "act",
      index: c.actos.cobra.index,
      title: c.actos.cobra.title,
      body: c.actos.cobra.body,
    },
    {
      kind: "wide",
      lead: c.leads.cxc,
      image: {
        src: `${IMG}/ft-cxc.jpg`,
        alt: c.alt.cxc,
        caption: c.pies.cxc,
        mobileSrc: `${IMG}/ft-cxc-movil.jpg`,
      },
    },
    // Dos anchas seguidas: §3 prohíbe texto sin imagen, no imagen sin texto.
    {
      kind: "wide",
      lead: c.leads.cobranza,
      image: {
        src: `${IMG}/ft-cobranza.jpg`,
        alt: c.alt.cobranza,
        caption: c.pies.cobranza,
        mobileSrc: `${IMG}/ft-cobranza-movil.jpg`,
      },
    },

    // ── ACTO 03 · EL MES CUADRA ──
    {
      kind: "act",
      index: c.actos.cuadra.index,
      title: c.actos.cuadra.title,
      body: c.actos.cuadra.body,
    },
    {
      kind: "wide",
      lead: c.leads.conciliacion,
      image: {
        src: `${IMG}/ft-conciliacion.jpg`,
        alt: c.alt.conciliacion,
        caption: c.pies.conciliacion,
        mobileSrc: `${IMG}/ft-conciliacion-movil.jpg`,
      },
    },
    {
      kind: "pair",
      images: [
        {
          src: `${IMG}/ft-extracto.jpg`,
          alt: c.alt.extracto,
          caption: c.pies.extracto,
          mobileSrc: `${IMG}/ft-extracto-movil.jpg`,
        },
        {
          src: `${IMG}/ft-movil.jpg`,
          alt: c.alt.movil,
          caption: c.pies.movil,
          mobileSrc: `${IMG}/ft-movil-movil.jpg`,
        },
      ],
    },
    // «Lo entregado» delante de la última pieza: después de resultados, imagen.
    { kind: "text", id: "resultado", title: c.outcomesTitle, body: c.outcomes },
    {
      kind: "wide",
      lead: c.leads.contable,
      image: {
        src: `${IMG}/ft-contable.jpg`,
        alt: c.alt.contable,
        caption: c.pies.contable,
        mobileSrc: `${IMG}/ft-contable-movil.jpg`,
      },
    },
    { kind: "tags", title: c.stackTitle, items: c.stack },
  ];
}

export default function FintraceContent() {
  const { locale } = useTranslation("landing");
  const lang: StoryLang = locale === "en" || locale === "pt" ? locale : "es";
  const c = COPY[lang];

  return (
    <>
      <CaseStory
        /*
         * El acento es de Fintrace, no de Axium. El azul sale de su propia landing
         * (src/app/(public)/cuerpo.tsx, AZUL = #3040F5). Ese azul sobre blanco da
         * 4,99:1, así que sirve tal cual para `base`; `dark` es el mismo tono subido
         * a 68 % de luminosidad (#8E97FA, 8,2:1 sobre la tinta #060C20), y `deep` es
         * su marino #0E1442 llevado a #121A46 para que el degradado del hero no se
         * apague (14,9:1 contra el blanco del texto que lleva encima).
         */
        accent={{ base: "#3040F5", dark: "#8E97FA", deep: "#121A46" }}
        name="Fintrace"
        tagline={c.tagline}
        heroImage={`${IMG}/ft-hero.jpg`}
        heroPosition="52% 58%"
        logo={{ src: `${IMG}/ft-logo.png`, width: 1440, height: 1056 }}
        liveUrl="https://fintrace.app-siclo.online"
        meta={c.meta}
        statement={c.statement}
        context={c.context}
        blocks={bloques(c, lang)}
        next={{
          name: "Feniz",
          tagline: c.nextTagline,
          href: "/casos-de-exito/feniz",
          image: "/images/proyects/feniz/fz-portada-cifras-v2.jpg",
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
