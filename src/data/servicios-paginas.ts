/**
 * Las páginas de los seis servicios (2026-10-22), sobre un mismo molde (PaginaServicio) al modo
 * de cheesecakelabs.com/services/*. Alexander: «mejora cada servicio, toma de referencia
 * cheesecakelabs.com, es más ordenado que nosotros».
 *
 * Acá van los datos que no se traducen: la ruta, el servicio con el que tiende el puente, los
 * casos (solo los que existen: cada métrica sale de la ficha del caso, src/data/cases) y los
 * metadatos. Los textos están en locales/{es,en,pt}/services.json → paginas.<id>.
 */

import type { AltPorIdioma } from "~/lib/alt";

// 2026-11-17 (Alexander, opción A): seis servicios en el inicio —web, apps, software, ia, cloud y marca—. «diseno» se
// repartió entre «apps» (UX/UI) y «marca» (branding + marketing); IoT pasó a Software a medida en el inicio, pero su
// página sigue publicada.
export type IdServicio =
  | "web"
  | "apps"
  | "software"
  | "ia"
  | "cloud"
  | "marca"
  | "iot";

export type CasoServicio = {
  slug: string;
  cliente: string;
  portada: string;
  /** el vídeo que aparece al pasar el ratón por la tarjeta (de la UI del caso) */
  video?: string;
  /** object-position de la portada, si el recorte por defecto la corta mal */
  encuadre?: string;
};

/**
 * El proyecto contado en detalle. Con caso, sus textos (reto, solución y lo que incluyó) salen de
 * su ficha (locales/<l>/cases.json, copiados a services.json → paginas.<id>.detalle). Sin caso (IoT
 * y cloud), la sección muestra cómo se arma el sistema. «mosaico» enseña piezas reales del
 * trabajo; «flujo» dibuja el recorrido de los datos.
 */
export type DetalleServicio = {
  caso: string | null;
  cliente?: string;
  tipo: "mosaico" | "flujo";
  /** La foto del panel del proyecto: se funde en el navy por la izquierda (oscura, con el tema a la derecha) */
  foto?: { src: string; encuadre?: string };
  /** `alt`: lo que muestra cada pieza (los mismos textos que su caso) */
  imagenes?: {
    src: string;
    ancho: 1 | 2;
    estira?: boolean;
    alt: AltPorIdioma;
  }[];
};

/**
 * Lo que se ve al elegir cada una de las seis cosas de «qué hacemos» (round 5, «más visual, más
 * interactivo»): una pieza real del caso del ejemplo, o, donde no hay caso (IoT, cloud y algunas
 * sueltas), una foto del tema (OpenAI, taller-servicios/2026-10). `{l}` se cambia por el idioma.
 */
export type MedioServicio = { src: string; video?: string; encuadre?: string };

export type PaginaServicioDatos = {
  slug: string;
  relacionado: IdServicio;
  /** uno por cada cosa de «qué hacemos», en el mismo orden */
  medios: MedioServicio[];
  detalle: DetalleServicio;
  casos: CasoServicio[];
  meta: { titulo: string; descripcion: string };
};

export const PAGINAS_SERVICIO: Record<IdServicio, PaginaServicioDatos> = {
  web: {
    slug: "web-and-apps",
    relacionado: "software",
    medios: [
      { src: "/images/proyects/toliveagain/tla-captura-web.jpg" },
      { src: "/images/proyects/bookit/bk-captura-landing.jpg" },
      {
        src: "/images/proyects/anjsports/anj-web.jpg",
        video: "/images/proyects/anjsports/anj-web.mp4",
      },
      {
        src: "/images/proyects/anjsports/anj-moviles.jpg",
      },
      {
        src: "/images/proyects/clefast/cf-catalogo.jpg",
        encuadre: "center 40%",
      },
      {
        src: "/images/proyects/vendiq/vq-como-v3.jpg",
        video: "/images/proyects/vendiq/vq-como-v3.mp4",
      },
    ],
    detalle: {
      caso: "anjsports",
      cliente: "ANJ Sports",
      tipo: "flujo",
      foto: {
        src: "/images/proyects/anjsports/anj-portada-campo-v2.jpg",
        encuadre: "80% center",
      },
    },
    casos: [
      {
        slug: "clefast",
        cliente: "Clefast",
        portada: "/images/proyects/clefast/cf-portada-lavanderia.jpg",
      },
      {
        slug: "aurore",
        cliente: "Aurore",
        portada: "/images/proyects/aurore/aurore-portada-estandar.jpg",
        video: "/images/proyects/aurore/av-portada-mostrador.mp4",
      },
    ],
    meta: {
      titulo: "Páginas web y tiendas online en Lima | Axium",
      descripcion:
        "Webs corporativas, landing pages y tiendas online rápidas, fáciles de administrar, con pagos en línea y listas para vender.",
    },
  },
  // Apps y diseño de producto: las apps (antes en Webs) y el UX/UI y los sistemas de diseño (antes en Diseño)
  apps: {
    slug: "apps-and-product-design",
    relacionado: "software",
    medios: [
      {
        src: "/images/proyects/rematch/rm-movil.jpg",
        video: "/images/proyects/rematch/rm-movil.mp4",
      },
      {
        src: "/images/proyects/rematch/rm-web.jpg",
        video: "/images/proyects/rematch/rm-web.mp4",
      },
      { src: "/images/servicios/diseno-prototipos.jpg" },
      {
        src: "/images/proyects/vendiq/bv-tipografia-v3.jpg",
        encuadre: "center 30%",
      },
      { src: "/images/proyects/rematch/rm-moviles.jpg" },
      { src: "/images/proyects/bookit/bk-heroe-movil.jpg" },
    ],
    detalle: {
      caso: "rematch",
      cliente: "Rematch",
      foto: { src: "/images/proyects/rematch/rematch-portada-noche-v2.jpg" },
      tipo: "mosaico",
      imagenes: [
        {
          src: "/images/proyects/rematch/rm-pasos.jpg",
          ancho: 2,
          estira: true,
          alt: {
            es: "Los tres pasos para empezar en Rematch: elegir los módulos, cargar las canchas y compartir el enlace",
            en: "The three steps to start on Rematch: choose the modules, add the courts and share the link",
            pt: "Os três passos para começar no Rematch: escolher os módulos, cadastrar as quadras e compartilhar o link",
          },
        },
        {
          src: "/images/proyects/rematch/rm-componentes-v2.jpg",
          ancho: 1,
          alt: {
            es: "Componentes de la interfaz de Rematch: buscador, horarios, planes y tarjetas por deporte",
            en: "Rematch interface components: search, time slots, plans and sport cards",
            pt: "Componentes da interface do Rematch: busca, horários, planos e cartões por esporte",
          },
        },
        {
          src: "/images/proyects/rematch/rm-c-torneo-v2.jpg",
          ancho: 1,
          alt: {
            es: "La tarjeta de un torneo de tenis de mesa en Rematch",
            en: "A table tennis tournament card on Rematch",
            pt: "O cartão de um torneio de tênis de mesa no Rematch",
          },
        },
        {
          src: "/images/proyects/rematch/rm-web.jpg",
          ancho: 2,
          alt: {
            es: "La portada de rematch.pe en el navegador, con la agenda del día en el celular",
            en: "The rematch.pe home page in a browser, with the day's schedule on a phone",
            pt: "A página inicial do rematch.pe no navegador, com a agenda do dia no celular",
          },
        },
        {
          src: "/images/proyects/rematch/rm-marca-iconos.jpg",
          ancho: 2,
          alt: {
            es: "El set de íconos de Rematch, en versión clara y oscura",
            en: "The Rematch icon set, in light and dark versions",
            pt: "O conjunto de ícones do Rematch, nas versões clara e escura",
          },
        },
      ],
    },
    casos: [
      {
        slug: "bookit",
        cliente: "Bookit",
        portada: "/images/proyects/bookit/bookit-portada-v2.jpg",
      },
      {
        slug: "lumiolearn",
        cliente: "LumioLearn",
        portada: "/images/proyects/lumiolearn/lumiolearn-portada-v7.jpg",
      },
    ],
    meta: {
      titulo: "Desarrollo de apps y diseño UX/UI en Lima | Axium",
      descripcion:
        "Apps para iOS y Android con un mismo código, diseño UX/UI, prototipos y sistemas de diseño: del primer boceto a la tienda de apps.",
    },
  },
  software: {
    slug: "software-development",
    relacionado: "cloud",
    medios: [
      { src: "/images/proyects/siclo/siclo-hero.jpg" },
      { src: "/images/proyects/bookit/bk-funcion-fichas.jpg" },
      { src: "/images/proyects/feniz/fz-conexion-v2.jpg" },
      {
        src: "/images/proyects/fintrace/ft-detraccion.jpg",
        encuadre: "center 35%",
      },
      {
        src: "/images/proyects/rematch/rm-agenda.jpg",
        video: "/images/proyects/rematch/rm-agenda.mp4",
      },
      {
        src: "/images/proyects/clefast/cf-mudanza-{l}.jpg",
        encuadre: "left center",
      },
    ],
    detalle: {
      caso: "fintrace",
      cliente: "Fintrace",
      tipo: "flujo",
      foto: {
        src: "/images/proyects/fintrace/ft-portada.jpg",
        encuadre: "22% center",
      },
    },
    casos: [
      {
        slug: "rematch",
        cliente: "Rematch",
        portada: "/images/proyects/rematch/rematch-portada-noche-v2.jpg",
        video: "/images/proyects/rematch/rm-pasos.mp4",
      },
      {
        slug: "feniz",
        cliente: "Feniz",
        portada: "/images/proyects/feniz/fz-portada-monitor.jpg",
        video: "/images/proyects/feniz/fz-sitio-panel.mp4",
      },
    ],
    meta: {
      titulo: "Desarrollo de software a medida en Lima | Axium",
      descripcion:
        "Sistemas internos, paneles, ERP, CRM, integraciones y modernización de sistemas, con el código a tu nombre desde el primer día.",
    },
  },
  ia: {
    slug: "ai-agentic-systems",
    relacionado: "iot",
    medios: [
      { src: "/images/proyects/feniz/fz-ea-{l}.jpg", encuadre: "left center" },
      {
        src: "/images/proyects/lumiolearn/lu-experiencia.jpg",
        video: "/images/proyects/lumiolearn/lu-experiencia.mp4",
      },
      { src: "/images/servicios/ia-whatsapp.jpg" },
      {
        src: "/images/proyects/fintrace/ft-documentos.jpg",
        encuadre: "center 30%",
      },
      { src: "/images/proyects/fintrace/ft-cxc.jpg", encuadre: "left center" },
      {
        src: "/images/proyects/vendiq/vq-asistente-v3.jpg",
        video: "/images/proyects/vendiq/vq-asistente-v3.mp4",
      },
    ],
    detalle: {
      caso: "lumiolearn",
      cliente: "LumioLearn",
      tipo: "flujo",
      foto: {
        src: "/images/highlights/lumiolearn-v12.jpg",
        encuadre: "55% center",
      },
    },
    casos: [
      {
        slug: "feniz",
        cliente: "Feniz",
        portada: "/images/proyects/feniz/fz-portada-monitor.jpg",
        video: "/images/proyects/feniz/fz-sitio-panel.mp4",
      },
      {
        slug: "vendiq",
        cliente: "Vendiq",
        portada: "/images/proyects/vendiq/vq-cielo.jpg",
        video: "/images/proyects/vendiq/vq-cielo.mp4",
      },
    ],
    meta: {
      titulo: "Inteligencia artificial para empresas en Perú | Axium",
      descripcion:
        "Agentes, asistentes con los datos de tu empresa, automatizaciones y tableros, conectados a tus sistemas y medidos en producción.",
    },
  },
  // Sin casos: todavía no hay un proyecto de IoT que mostrar, y no se inventa uno
  iot: {
    slug: "iot",
    relacionado: "ia",
    medios: [
      { src: "/images/servicios/iot-monitoreo.jpg" },
      { src: "/images/servicios/iot-alertas.jpg" },
      { src: "/images/servicios/iot-integracion.jpg" },
      { src: "/images/servicios/iot-plataforma.jpg" },
      { src: "/images/servicios/iot-flotas.jpg" },
      { src: "/images/servicios/iot-predictivo.jpg" },
    ],
    detalle: { caso: null, tipo: "flujo" },
    casos: [],
    meta: {
      titulo: "Soluciones IoT para empresas en Perú | Axium",
      descripcion:
        "Sensores, equipos y máquinas conectados a tu sistema: monitoreo en tiempo real, alertas y tableros para tu planta, flota o almacén.",
    },
  },
  cloud: {
    slug: "cloud-and-support",
    relacionado: "software",
    medios: [
      { src: "/images/servicios/cloud-alojamiento.jpg" },
      { src: "/images/servicios/cloud-despliegues.jpg" },
      { src: "/images/servicios/cloud-respaldos.jpg" },
      { src: "/images/servicios/cloud-monitoreo.jpg" },
      { src: "/images/servicios/cloud-seguridad.jpg" },
      { src: "/images/servicios/cloud-soporte.jpg" },
    ],
    detalle: { caso: null, tipo: "flujo" },
    casos: [],
    meta: {
      titulo: "Cloud, seguridad y soporte técnico en Perú | Axium",
      descripcion:
        "Alojamiento, despliegues automáticos, respaldos, monitoreo, seguridad y soporte para que tu web o tu sistema sigan funcionando.",
    },
  },
  // Marca y crecimiento: el branding de la antigua página de diseño (Alyer, MainTech, Aurore) más el marketing mensual
  marca: {
    slug: "brand-and-growth",
    relacionado: "web",
    medios: [
      { src: "/images/proyects/aurore/aurore-portada-yeso.jpg" },
      { src: "/images/proyects/alyer/al-chaleco-plano.jpg" },
      // redes, publicidad y medición: fotos del tema (OpenAI, taller-servicios/2026-11), sin caso propio todavía
      { src: "/images/servicios/marca-redes.jpg" },
      { src: "/images/servicios/marca-publicidad.jpg" },
      { src: "/images/servicios/marca-medicion.jpg" },
      {
        src: "/images/proyects/rematch/rm-web.jpg",
        video: "/images/proyects/rematch/rm-web.mp4",
      },
    ],
    detalle: {
      caso: "alyer",
      cliente: "Alyer",
      foto: {
        src: "/images/proyects/alyer/al-hero.jpg",
        encuadre: "70% center",
      },
      tipo: "mosaico",
      // retícula de cuatro columnas: las de 2:1 ocupan dos, las cuadradas una (alturas iguales)
      imagenes: [
        // comparte fila con dos cuadradas: se estira a su altura (con aspect 2:1 medía 6 px más, el medio hueco)
        {
          src: "/images/proyects/alyer/al-camion.jpg",
          ancho: 2,
          estira: true,
          alt: {
            es: "Tractocamión y semirremolque con la rotulación de Alyer Transportes",
            en: "Tractor unit and semi-trailer with Alyer Transportes livery",
            pt: "Cavalo mecânico e semirreboque com a plotagem da Alyer Transportes",
          },
        },
        {
          src: "/images/proyects/alyer/al-simbolo-marca.jpg",
          ancho: 1,
          alt: {
            es: "El símbolo de Alyer en blanco y rojo: la «A» fragmentada y orientada a la derecha",
            en: "Alyer's symbol in white and red: the fragmented A, facing right",
            pt: "O símbolo da Alyer em branco e vermelho: o «A» fragmentado e orientado à direita",
          },
        },
        {
          src: "/images/proyects/alyer/al-chaleco-espalda.jpg",
          ancho: 1,
          alt: {
            es: "Un trabajador de espaldas con el chaleco reflectivo de Alyer y la dirección web bajo el logotipo",
            en: "A worker seen from behind in the Alyer hi-vis vest, with the web address under the logotype",
            pt: "Um trabalhador de costas com o colete refletivo da Alyer e o endereço web sob o logotipo",
          },
        },
        {
          src: "/images/proyects/alyer/al-manual.jpg",
          ancho: 2,
          alt: {
            es: "Quince láminas del manual de marca de Alyer Transportes",
            en: "Fifteen pages of the Alyer Transportes brand manual",
            pt: "Quinze lâminas do manual de marca da Alyer Transportes",
          },
        },
        {
          src: "/images/proyects/alyer/al-brochure.jpg",
          ancho: 2,
          alt: {
            es: "Páginas del brochure comercial de Alyer Producción",
            en: "Pages of the Alyer Producción commercial brochure",
            pt: "Páginas do brochure comercial da Alyer Producción",
          },
        },
      ],
    },
    casos: [
      {
        slug: "maintech",
        cliente: "MainTech",
        portada: "/images/proyects/maintech/mt-portada-panel-v2.jpg",
      },
      {
        slug: "aurore",
        cliente: "Aurore",
        portada: "/images/proyects/aurore/aurore-portada-estandar.jpg",
        video: "/images/proyects/aurore/av-portada-mostrador.mp4",
      },
    ],
    meta: {
      titulo: "Branding y marketing digital en Lima | Axium",
      descripcion:
        "Identidad visual y manual de marca por proyecto, y marketing digital mensual: redes, publicidad en Meta y Google y SEO, medidos con los datos de tu web.",
    },
  },
};

export const rutaServicio = (id: IdServicio) =>
  `/servicios/${PAGINAS_SERVICIO[id].slug}`;
