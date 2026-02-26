export interface ServiceFeature {
  icon: string;
  title: string;
  description: string;
}

export interface ServiceProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface ServicePageData {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  heroGradient: string;
  accentColor: string;
  heroIcon: string;
  featuresTitle: string;
  featuresSubtitle: string;
  features: ServiceFeature[];
  process: ServiceProcessStep[];
  technologies: string[];
  benefits: string[];
  whatsappMessage: string;
  metaTitle: string;
  metaDescription: string;
}

export const SERVICES: Record<string, ServicePageData> = {
  "software-a-medida": {
    slug: "software-a-medida",
    title: "Software a Medida",
    shortTitle: "Software a Medida",
    description:
      "Tu negocio tiene procesos únicos, y merece herramientas que se adapten a ellos. Diseñamos sistemas que encajan con tu operación real, se integran con lo que ya usas y crecen contigo sin fricciones.",
    heroGradient:
      "linear-gradient(135deg, #060C20 0%, #001a3a 70%, #002a50 100%)",
    accentColor: "#0072CF",
    heroIcon: "Code2",
    featuresTitle: "Todo lo que incluye",
    featuresSubtitle:
      "Un proceso completo de extremo a extremo para entregar software que funciona y evoluciona con tu negocio.",
    features: [
      {
        icon: "ClipboardList",
        title: "Análisis de Requerimientos",
        description:
          "Mapeamos tus procesos, identificamos cuellos de botella y definimos exactamente qué necesita tu sistema para funcionar.",
      },
      {
        icon: "Layers",
        title: "Arquitectura Escalable",
        description:
          "Diseñamos la base técnica para que tu software crezca con tu negocio, sin necesidad de reescribirlo desde cero.",
      },
      {
        icon: "RefreshCw",
        title: "Desarrollo Iterativo",
        description:
          "Entregas cada sprint para que puedas validar, ajustar y ver avances concretos desde el primer mes.",
      },
      {
        icon: "Plug",
        title: "Integración de APIs",
        description:
          "Conectamos tu nuevo sistema con los servicios que ya usas: ERP, CRM, plataformas de pago y más.",
      },
      {
        icon: "CheckSquare",
        title: "Testing & QA",
        description:
          "Pruebas exhaustivas antes del lanzamiento para garantizar cero sorpresas en producción.",
      },
      {
        icon: "Headphones",
        title: "Soporte Post-lanzamiento",
        description:
          "No te dejamos solo después del go-live. Monitoreo, correcciones y mejoras continuas.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Descubrimiento",
        description:
          "Entendemos tu negocio, mapeamos flujos y definimos los requisitos exactos del sistema.",
      },
      {
        step: 2,
        title: "Diseño Técnico",
        description:
          "Arquitectura, flujo de datos, selección de stack tecnológico y wireframes funcionales.",
      },
      {
        step: 3,
        title: "Desarrollo",
        description:
          "Construcción incremental con sprints de 2 semanas y entregas para validación continua.",
      },
      {
        step: 4,
        title: "Lanzamiento",
        description:
          "Deploy, pruebas de carga, capacitación del equipo y acompañamiento post-entrega.",
      },
    ],
    technologies: [
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "Docker",
      "AWS",
    ],
    benefits: [
      "Diseñado para tus procesos, no al revés",
      "Integración directa con tus herramientas actuales",
      "Crece al ritmo de tu negocio",
    ],
    whatsappMessage:
      "Hola, me interesa desarrollar un software a medida para mi negocio. ¿Podemos agendar una llamada?",
    metaTitle: "Software a Medida | AXIUM",
    metaDescription:
      "Desarrollamos software personalizado que se adapta a tus procesos únicos. Sistemas escalables, integrados y listos para crecer con tu negocio.",
  },

  "aplicaciones-web": {
    slug: "aplicaciones-web",
    title: "Aplicaciones Web",
    shortTitle: "Aplicaciones Web",
    description:
      "Desde plataformas internas hasta productos digitales completos. Construimos aplicaciones web rápidas, seguras y preparadas para escalar, sin importar cuántos usuarios las utilicen al mismo tiempo.",
    heroGradient:
      "linear-gradient(135deg, #060C20 0%, #001833 65%, #002244 100%)",
    accentColor: "#0072CF",
    heroIcon: "Globe",
    featuresTitle: "Aplicaciones que escalan",
    featuresSubtitle:
      "Cada decisión técnica apunta al mismo objetivo: una aplicación que funciona hoy y soporta el crecimiento de mañana.",
    features: [
      {
        icon: "Monitor",
        title: "Diseño Responsivo",
        description:
          "Experiencia perfecta en desktop, tablet y móvil sin comprometer funcionalidad ni diseño.",
      },
      {
        icon: "Zap",
        title: "Rendimiento Optimizado",
        description:
          "Tiempos de carga menores a 2 segundos, Core Web Vitals en verde y experiencia de usuario fluida.",
      },
      {
        icon: "Shield",
        title: "Seguridad Avanzada",
        description:
          "Autenticación robusta, encriptación de datos y protección contra los ataques más comunes.",
      },
      {
        icon: "Search",
        title: "SEO Técnico",
        description:
          "Estructura semántica, metadatos optimizados y rendimiento que posiciona tu app en buscadores.",
      },
      {
        icon: "TrendingUp",
        title: "Escalabilidad",
        description:
          "Arquitectura preparada para crecer de 100 a 1 millón de usuarios sin reconstruir desde cero.",
      },
      {
        icon: "Smartphone",
        title: "PWA Ready",
        description:
          "Instalable como app nativa, funciona offline y envía notificaciones push al usuario.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Descubrimiento",
        description:
          "Analizamos tus objetivos, audiencia y requerimientos técnicos del proyecto.",
      },
      {
        step: 2,
        title: "Diseño UI/UX",
        description:
          "Wireframes, prototipo interactivo y sistema de diseño antes de escribir una línea de código.",
      },
      {
        step: 3,
        title: "Desarrollo",
        description:
          "Implementación con mejores prácticas, revisiones de código y pruebas automatizadas.",
      },
      {
        step: 4,
        title: "Lanzamiento",
        description:
          "Deploy en infraestructura segura, monitoreo de performance y soporte técnico continuo.",
      },
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma",
      "Vercel",
      "AWS",
    ],
    benefits: [
      "Carga rápida y experiencia fluida",
      "Protección de datos de extremo a extremo",
      "Lista para crecer sin reconstruir",
    ],
    whatsappMessage:
      "Hola, necesito desarrollar una aplicación web para mi proyecto. ¿Podemos conversar sobre los detalles?",
    metaTitle: "Aplicaciones Web | AXIUM",
    metaDescription:
      "Construimos aplicaciones web rápidas, seguras y escalables. Desde plataformas internas hasta productos digitales completos con tecnología de vanguardia.",
  },

  "aplicaciones-moviles": {
    slug: "aplicaciones-moviles",
    title: "Aplicaciones Móviles",
    shortTitle: "Apps Móviles",
    description:
      "Creamos aplicaciones para iOS y Android que se sienten nativas, responden al instante y funcionan incluso sin conexión. Tu marca, siempre en el bolsillo de tus usuarios.",
    heroGradient:
      "linear-gradient(135deg, #060C20 0%, #001428 60%, #00284a 100%)",
    accentColor: "#7ECFC3",
    heroIcon: "Smartphone",
    featuresTitle: "Experiencia nativa en todo",
    featuresSubtitle:
      "Aplicaciones que los usuarios adoptan de inmediato porque se sienten rápidas, intuitivas y confiables.",
    features: [
      {
        icon: "Tablet",
        title: "iOS y Android",
        description:
          "Un solo desarrollo, dos plataformas. Experiencia nativa en ambos sistemas sin duplicar el costo.",
      },
      {
        icon: "Layout",
        title: "Diseño Intuitivo",
        description:
          "Interfaces pensadas para el usuario final, siguiendo las guías de diseño de Apple y Google.",
      },
      {
        icon: "WifiOff",
        title: "Offline First",
        description:
          "Funcionalidad completa sin conexión a internet, con sincronización automática al reconectar.",
      },
      {
        icon: "Bell",
        title: "Notificaciones Push",
        description:
          "Mensajes relevantes en el momento correcto para aumentar la retención y el engagement.",
      },
      {
        icon: "Zap",
        title: "Alto Rendimiento",
        description:
          "60fps garantizados, respuesta inmediata y consumo de batería optimizado.",
      },
      {
        icon: "BarChart2",
        title: "Analytics Integrado",
        description:
          "Métricas de uso, comportamiento del usuario y conversión integradas desde el día uno.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Discovery",
        description:
          "Definimos flujos de usuario, funcionalidades clave y el MVP con el menor tiempo al mercado.",
      },
      {
        step: 2,
        title: "Diseño UX",
        description:
          "Prototipo interactivo validado con usuarios reales antes de comenzar el desarrollo.",
      },
      {
        step: 3,
        title: "Desarrollo",
        description:
          "Código limpio, arquitectura modular y pruebas en dispositivos reales durante todo el ciclo.",
      },
      {
        step: 4,
        title: "Publicación",
        description:
          "Gestión del proceso de publicación en App Store y Google Play, con ASO incluido.",
      },
    ],
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "Redux Toolkit",
      "Firebase",
      "iOS",
      "Android",
      "Node.js",
    ],
    benefits: [
      "Disponible en iOS y Android desde un solo desarrollo",
      "Interfaz intuitiva pensada para el usuario final",
      "Funciona sin conexión y sincroniza al reconectar",
    ],
    whatsappMessage:
      "Hola, quiero crear una aplicación móvil. ¿Podemos hablar sobre lo que necesito?",
    metaTitle: "Aplicaciones Móviles iOS y Android | AXIUM",
    metaDescription:
      "Desarrollamos apps móviles nativas para iOS y Android con React Native. Experiencia fluida, offline first y publicación en tiendas incluida.",
  },

  "automatizacion-de-procesos": {
    slug: "automatizacion-de-procesos",
    title: "Automatización de Procesos",
    shortTitle: "Automatización",
    description:
      "Liberamos a tu equipo de tareas repetitivas para que se enfoque en lo que realmente importa. Diseñamos flujos inteligentes que reducen errores, ahorran tiempo y hacen que tu operación funcione como reloj.",
    heroGradient:
      "linear-gradient(135deg, #060C20 0%, #0a1a10 65%, #0d2a18 100%)",
    accentColor: "#7ECFC3",
    heroIcon: "Cog",
    featuresTitle: "Operación sin fricción",
    featuresSubtitle:
      "Automatizamos los procesos que consumen tiempo de tu equipo para que puedan enfocarse en tareas de mayor valor.",
    features: [
      {
        icon: "GitBranch",
        title: "Mapeo de Procesos",
        description:
          "Identificamos y documentamos cada paso de tus flujos para encontrar qué automatizar primero y con mayor ROI.",
      },
      {
        icon: "Repeat",
        title: "Flujos Inteligentes",
        description:
          "Workflows que toman decisiones basadas en condiciones, datos y eventos en tiempo real.",
      },
      {
        icon: "Bot",
        title: "Automatización RPA",
        description:
          "Automatización de tareas que involucran interfaces gráficas y sistemas legacy sin APIs.",
      },
      {
        icon: "Activity",
        title: "Monitoreo 24/7",
        description:
          "Dashboards de estado, alertas automáticas y logs detallados de cada ejecución.",
      },
      {
        icon: "CheckSquare",
        title: "Reducción de Errores",
        description:
          "Eliminamos el error humano en procesos críticos con validaciones y checkpoints automáticos.",
      },
      {
        icon: "FileText",
        title: "Reportes Automáticos",
        description:
          "Generación y envío automático de reportes según horarios o eventos definidos.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Auditoría",
        description:
          "Mapeamos tus procesos actuales y medimos el tiempo y costo de cada tarea manual.",
      },
      {
        step: 2,
        title: "Diseño",
        description:
          "Definimos qué automatizar, en qué orden y con qué tecnología para el mayor retorno.",
      },
      {
        step: 3,
        title: "Implementación",
        description:
          "Desarrollo e integración de flujos automatizados con pruebas en ambiente controlado.",
      },
      {
        step: 4,
        title: "Operación",
        description:
          "Monitoreo continuo, ajustes y mejoras iterativas conforme evoluciona tu negocio.",
      },
    ],
    technologies: [
      "n8n",
      "Python",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Zapier",
      "APIs REST",
    ],
    benefits: [
      "Tu equipo enfocado en lo estratégico",
      "Menos errores, más consistencia",
      "Procesos que corren solos, 24/7",
    ],
    whatsappMessage:
      "Hola, me interesa automatizar procesos en mi empresa. ¿Podemos evaluar juntos qué áreas optimizar?",
    metaTitle: "Automatización de Procesos | AXIUM",
    metaDescription:
      "Automatizamos procesos repetitivos con flujos inteligentes, RPA e integraciones. Reduce errores, ahorra tiempo y libera a tu equipo para tareas estratégicas.",
  },

  "analitica-e-ia": {
    slug: "analitica-e-ia",
    title: "Analítica e Inteligencia Artificial",
    shortTitle: "Analítica e IA",
    description:
      "Convertimos los datos que ya generas en información accionable. Con modelos de machine learning, identificamos patrones ocultos, anticipamos tendencias y te damos las herramientas para tomar decisiones con mayor certeza.",
    heroGradient:
      "linear-gradient(135deg, #060C20 0%, #001a2e 65%, #002840 100%)",
    accentColor: "#7ECFC3",
    heroIcon: "Brain",
    featuresTitle: "Datos que generan valor",
    featuresSubtitle:
      "Del dato crudo a la decisión estratégica: infraestructura de datos, modelos de IA y dashboards que se entienden a primera vista.",
    features: [
      {
        icon: "Brain",
        title: "Modelos de Machine Learning",
        description:
          "Algoritmos entrenados con tus datos para predicción, clasificación y detección de anomalías.",
      },
      {
        icon: "LayoutDashboard",
        title: "Dashboards Interactivos",
        description:
          "Visualizaciones claras que transforman datos complejos en insights accionables para tu equipo.",
      },
      {
        icon: "TrendingUp",
        title: "Predicción y Forecasting",
        description:
          "Anticipa la demanda, detecta tendencias y reduce la incertidumbre en decisiones estratégicas.",
      },
      {
        icon: "Database",
        title: "Procesamiento de Datos",
        description:
          "Pipelines que limpian, transforman y consolidan datos de múltiples fuentes en tiempo real.",
      },
      {
        icon: "Eye",
        title: "Visión por Computadora",
        description:
          "Análisis de imágenes y videos para control de calidad, seguridad y reconocimiento automatizado.",
      },
      {
        icon: "MessageSquare",
        title: "NLP y Chatbots IA",
        description:
          "Asistentes conversacionales que entienden el contexto y automatizan la atención al cliente.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Data Audit",
        description:
          "Evaluamos la calidad, cantidad y fuentes de tus datos para definir lo que es posible construir.",
      },
      {
        step: 2,
        title: "Modelado",
        description:
          "Diseño, entrenamiento y evaluación de modelos con tus datos reales.",
      },
      {
        step: 3,
        title: "Integración",
        description:
          "Despliegue de modelos en tu infraestructura con APIs de consumo para tus sistemas.",
      },
      {
        step: 4,
        title: "Mejora Continua",
        description:
          "Re-entrenamiento con nuevos datos y optimización basada en feedback del negocio.",
      },
    ],
    technologies: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "LangChain",
      "OpenAI API",
      "Pandas",
      "FastAPI",
      "AWS SageMaker",
    ],
    benefits: [
      "Decisiones respaldadas por datos reales",
      "Detección temprana de oportunidades y riesgos",
      "Dashboards claros y accionables",
    ],
    whatsappMessage:
      "Hola, quiero aprovechar mejor los datos de mi empresa con analítica e IA. ¿Podemos agendar una reunión?",
    metaTitle: "Analítica e Inteligencia Artificial | AXIUM",
    metaDescription:
      "Transformamos tus datos en decisiones estratégicas con machine learning, dashboards interactivos y modelos de IA a medida para tu negocio.",
  },

  "branding-ui": {
    slug: "branding-ui",
    title: "Identidad de Marca y UI",
    shortTitle: "Branding & UI",
    description:
      "Construimos la identidad visual que diferencia a tu negocio: desde el logo y paleta de colores hasta sistemas de diseño completos y UI para tus productos digitales, todo con coherencia y propósito.",
    heroGradient:
      "linear-gradient(135deg, #060C20 0%, #120a28 65%, #1a0a30 100%)",
    accentColor: "#7ECFC3",
    heroIcon: "Palette",
    featuresTitle: "Diseño con propósito",
    featuresSubtitle:
      "Cada elemento visual tiene una razón de ser: comunicar tu esencia, generar confianza y guiar al usuario hacia la acción.",
    features: [
      {
        icon: "Star",
        title: "Identidad Visual",
        description:
          "Logotipo, paleta de colores, tipografías y sistema visual que comunica la esencia de tu marca.",
      },
      {
        icon: "BookOpen",
        title: "Manual de Marca",
        description:
          "Documento completo con reglas de uso que garantizan consistencia en todos los canales y piezas.",
      },
      {
        icon: "Layers",
        title: "Sistema de Diseño",
        description:
          "Librería de componentes reutilizables que acelera el desarrollo y mantiene la coherencia visual.",
      },
      {
        icon: "Layout",
        title: "UI para Productos",
        description:
          "Interfaces pensadas para la experiencia del usuario: intuitivas, elegantes y funcionales.",
      },
      {
        icon: "Users",
        title: "UX Research",
        description:
          "Investigación con usuarios reales para validar decisiones de diseño antes de implementar.",
      },
      {
        icon: "Image",
        title: "Assets Digitales",
        description:
          "Todos los recursos visuales listos para web, app, redes sociales y material impreso.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Investigación",
        description:
          "Análisis de tu industria, competidores y audiencia para definir el posicionamiento de marca.",
      },
      {
        step: 2,
        title: "Concepto",
        description:
          "Exploración creativa, moodboards y presentación de direcciones de diseño para elegir.",
      },
      {
        step: 3,
        title: "Desarrollo",
        description:
          "Refinamiento del concepto seleccionado y construcción del sistema visual completo.",
      },
      {
        step: 4,
        title: "Entrega",
        description:
          "Archivos en todos los formatos, guía de implementación y sesión de traspaso con tu equipo.",
      },
    ],
    technologies: [
      "Figma",
      "Adobe Illustrator",
      "Adobe Photoshop",
      "Framer",
      "Storybook",
      "Tailwind CSS",
      "After Effects",
    ],
    benefits: [
      "Marca memorable y diferenciada",
      "Sistema de diseño escalable y consistente",
      "UI pensada para la experiencia del usuario",
    ],
    whatsappMessage:
      "Hola, me interesa desarrollar la identidad de marca y UI de mi empresa. ¿Podemos conversar?",
    metaTitle: "Identidad de Marca y UI Design | AXIUM",
    metaDescription:
      "Creamos identidades visuales únicas: logo, manual de marca, sistema de diseño y UI para productos digitales. Diseño con estrategia y propósito.",
  },
};

export const SERVICE_SLUGS = Object.keys(SERVICES) as (keyof typeof SERVICES)[];

export const SERVICE_IMAGES: Record<string, string> = {
  "software-a-medida": "/service1.png",
  "aplicaciones-web": "/service2.png",
  "aplicaciones-moviles": "/service3.png",
  "automatizacion-de-procesos": "/service4.png",
  "analitica-e-ia": "/service5.png",
  "branding-ui": "/service6.png",
};
