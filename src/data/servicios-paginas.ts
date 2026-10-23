/**
 * Las páginas de los seis servicios (2026-10-22), sobre un mismo molde (PaginaServicio) al modo
 * de cheesecakelabs.com/services/*. Alexander: «mejora cada servicio, toma de referencia
 * cheesecakelabs.com, es más ordenado que nosotros».
 *
 * Acá van los datos que no se traducen: la ruta, el servicio con el que tiende el puente, los
 * casos (solo los que existen: cada métrica sale de la ficha del caso, src/data/cases) y los
 * metadatos. Los textos están en locales/{es,en,pt}/services.json → paginas.<id>.
 */

export type IdServicio = "diseno" | "web" | "software" | "ia" | "iot" | "cloud";

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
  imagenes?: { src: string; ancho: 1 | 2; estira?: boolean }[];
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
  diseno: {
    slug: "design-branding",
    relacionado: "web",
    medios: [
      { src: "/images/proyects/aurore/aurore-portada-yeso.jpg" },
      { src: "/images/proyects/alyer/al-variantes.jpg" },
      {
        src: "/images/proyects/rematch/rm-web.jpg",
        video: "/images/proyects/rematch/rm-web.mp4",
      },
      {
        src: "/images/proyects/vendiq/bv-tipografia-v3.jpg",
        encuadre: "center 30%",
      },
      { src: "/images/servicios/diseno-prototipos.jpg" },
      { src: "/images/proyects/alyer/al-chaleco-plano.jpg" },
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
        { src: "/images/proyects/alyer/al-camion.jpg", ancho: 2, estira: true },
        { src: "/images/proyects/alyer/al-simbolo-marca.jpg", ancho: 1 },
        { src: "/images/proyects/alyer/al-chaleco-espalda.jpg", ancho: 1 },
        { src: "/images/proyects/alyer/al-manual.jpg", ancho: 2 },
        { src: "/images/proyects/alyer/al-brochure.jpg", ancho: 2 },
      ],
    },
    casos: [
      {
        slug: "maintech",
        cliente: "MainTech",
        portada: "/images/proyects/maintech/mt-portada.jpg",
      },
      {
        slug: "aurore",
        cliente: "Aurore",
        portada: "/images/proyects/aurore/aurore-portada-estandar.jpg",
        video: "/images/proyects/aurore/av-portada-mostrador.mp4",
      },
    ],
    meta: {
      titulo: "Diseño de marca, UX/UI y webs en Lima | Axium",
      descripcion:
        "Identidad visual, manual de marca, diseño de webs y apps y sistemas de diseño, con el mismo criterio de principio a fin.",
    },
  },
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
        src: "/images/proyects/rematch/rm-movil.jpg",
        video: "/images/proyects/rematch/rm-movil.mp4",
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
      titulo: "Páginas web, tiendas online y apps en Lima | Axium",
      descripcion:
        "Webs corporativas, landing pages, tiendas online y apps para iOS y Android, rápidas, fáciles de administrar y listas para vender.",
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
};

export const rutaServicio = (id: IdServicio) =>
  `/servicios/${PAGINAS_SERVICIO[id].slug}`;
