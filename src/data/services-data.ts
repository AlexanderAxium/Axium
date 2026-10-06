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
  heroImage: string;
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
  "design-branding": {
    slug: "design-branding",
    title: "Design & Branding",
    shortTitle: "Design & Branding",
    description:
      "Construimos marcas que comunican, productos que enamoran y materiales que convierten. Desde la identidad visual hasta el diseño de producto — todo lo que necesitas para destacar en el mercado.",
    heroImage: "/abs6.png",
    heroGradient:
      "linear-gradient(135deg, #060C20 0%, #0a1628 60%, #001a3a 100%)",
    accentColor: "#0072CF",
    heroIcon: "Palette",
    featuresTitle: "Qué incluye",
    featuresSubtitle:
      "De la estrategia visual al activo final — todo el espectro del diseño para marcas que quieren destacar.",
    features: [
      {
        icon: "Palette",
        title: "Identidad visual y logo",
        description:
          "Diseñamos marcas con propósito: logo, paleta de colores, tipografía y sistema visual que comunica quién eres.",
      },
      {
        icon: "Layers",
        title: "Brand guidelines",
        description:
          "Manual completo de marca para que tu identidad sea consistente en cada punto de contacto, canal y equipo.",
      },
      {
        icon: "FileText",
        title: "Materiales de marketing",
        description:
          "Brochures, presentaciones, flyers, social media kits y cualquier material impreso o digital que necesites.",
      },
      {
        icon: "Eye",
        title: "UI/UX & Diseño de producto",
        description:
          "Diseño de interfaces centradas en el usuario: wireframes, prototipos y diseños de alta fidelidad en Figma.",
      },
      {
        icon: "Monitor",
        title: "Diseño web y landing pages",
        description:
          "Páginas web y landing pages con diseño editorial que convierten visitantes en clientes.",
      },
      {
        icon: "Image",
        title: "Motion & presentaciones",
        description:
          "Animaciones de marca, pitch decks y presentaciones ejecutivas que hacen que tu historia se cuente sola.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Descubrimiento",
        description:
          "Entendemos tu marca, audiencia, competidores y objetivos. Definimos el brief creativo y la estrategia visual.",
      },
      {
        step: 2,
        title: "Estrategia",
        description:
          "Desarrollamos el concepto de marca, moodboard, dirección creativa y arquitectura visual antes de diseñar.",
      },
      {
        step: 3,
        title: "Diseño",
        description:
          "Creamos los activos visuales: logo, sistema de marca, materiales y entregables en Figma listos para uso.",
      },
      {
        step: 4,
        title: "Entrega",
        description:
          "Entregamos archivos finales en todos los formatos, brand guidelines completo y soporte post-entrega.",
      },
    ],
    technologies: [
      "Figma",
      "Adobe Illustrator",
      "Adobe Photoshop",
      "After Effects",
      "Framer",
    ],
    benefits: [
      "Marca profesional lista para lanzar",
      "Archivos editables en todos los formatos",
      "Brand guidelines incluido siempre",
    ],
    whatsappMessage:
      "Hola, me interesa el servicio de Design & Branding. ¿Podemos agendar una llamada?",
    metaTitle: "Design & Branding | Axium",
    metaDescription:
      "Diseñamos identidades visuales, materiales de marketing y experiencias de producto que comunican, convierten y construyen marcas memorables.",
  },

  "software-development": {
    slug: "software-development",
    title: "Software Development",
    shortTitle: "Software Dev",
    description:
      "Construimos software de alto rendimiento, escalable y seguro usando un stack tecnológico moderno y estándar en la industria. Full-stack JavaScript con TypeScript, Next.js, React, React Native y Node.js — desde la idea hasta producción.",
    heroImage: "/abs13.png",
    heroGradient:
      "linear-gradient(135deg, #060C20 0%, #001020 60%, #002040 100%)",
    accentColor: "#0072CF",
    heroIcon: "Code2",
    featuresTitle: "Nuestras capacidades de desarrollo",
    featuresSubtitle:
      "Desarrollo de software de extremo a extremo para web, móvil y backend — construido para escalar desde el primer día.",
    features: [
      {
        icon: "Globe",
        title: "Desarrollo web",
        description:
          "Aplicaciones web rápidas, accesibles y optimizadas para SEO construidas con Next.js y React. Desde landing pages hasta plataformas SaaS complejas.",
      },
      {
        icon: "Smartphone",
        title: "Desarrollo móvil",
        description:
          "Apps multiplataforma para iOS y Android con React Native. Rendimiento nativo, un solo codebase, menor tiempo al mercado.",
      },
      {
        icon: "Code2",
        title: "TypeScript y stack moderno",
        description:
          "Codebases con tipado seguro, más fáciles de mantener, refactorizar y escalar a medida que crecen tu equipo y producto.",
      },
      {
        icon: "Layers",
        title: "APIs y backend engineering",
        description:
          "Backends escalables en Node.js, APIs RESTful y GraphQL, y arquitecturas de servicios limpias que aguantan la carga.",
      },
      {
        icon: "Shield",
        title: "Seguridad y rendimiento",
        description:
          "Autenticación, autorización, cifrado de datos y optimización de rendimiento integrados desde el inicio — no agregados después.",
      },
      {
        icon: "Headphones",
        title: "Soporte y mantenimiento continuo",
        description:
          "No desaparecemos después del lanzamiento. Monitoreo, corrección de bugs, mejoras de rendimiento y desarrollo iterativo de funcionalidades.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Arquitectura",
        description:
          "Definimos el stack tecnológico, la arquitectura del sistema y el roadmap de desarrollo alineados con tus objetivos de producto.",
      },
      {
        step: 2,
        title: "Desarrollo",
        description:
          "Sprints ágiles con demos regulares. Ves progreso real cada dos semanas, no solo actualizaciones de estado.",
      },
      {
        step: 3,
        title: "Testing y QA",
        description:
          "Pruebas automatizadas, QA manual, benchmarks de rendimiento y revisiones de seguridad antes de cada release.",
      },
      {
        step: 4,
        title: "Deploy y monitoreo",
        description:
          "Pipelines CI/CD, despliegue en la nube y monitoreo en tiempo real para que tu producto funcione de manera confiable a escala.",
      },
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "React Native",
      "PostgreSQL",
    ],
    benefits: [
      "Código listo para producción desde el sprint 1",
      "Comunicación clara en cada etapa del proceso",
      "Construido para escalar sin reescribir",
    ],
    whatsappMessage:
      "Hola, me interesa el servicio de Software Development. ¿Podemos hablar sobre mi proyecto?",
    metaTitle: "Software Development | Axium",
    metaDescription:
      "Desarrollo full-stack web y móvil con TypeScript, Next.js, React Native y Node.js. Escalable, seguro y listo para producción.",
  },

  "ai-agentic-systems": {
    slug: "ai-agentic-systems",
    title: "AI & Agentic Systems",
    shortTitle: "AI & Agents",
    description:
      "Desarrollamos sistemas potenciados por IA que automatizan flujos de trabajo, integran silos de datos y habilitan la toma de decisiones en tiempo real. LLMs, RAG, orquestación de IA — sistemas autónomos que generan valor de negocio medible.",
    heroImage: "/abs14.png",
    heroGradient:
      "linear-gradient(135deg, #060C20 0%, #0a0a20 60%, #001030 100%)",
    accentColor: "#7ECFC3",
    heroIcon: "Brain",
    featuresTitle: "Nuestras capacidades de IA",
    featuresSubtitle:
      "Desde la definición del problema hasta el despliegue en producción — sistemas de IA construidos para resultados reales de negocio.",
    features: [
      {
        icon: "Search",
        title: "Definición del espacio del problema",
        description:
          "Trabajamos contigo para identificar dónde la IA puede tener el mayor impacto de negocio, y dónde no vale la pena la inversión.",
      },
      {
        icon: "Database",
        title: "Evaluación de madurez de datos",
        description:
          "Auditamos tus datos existentes, identificamos brechas y definimos la arquitectura de datos necesaria para potenciar tus sistemas de IA.",
      },
      {
        icon: "LayoutDashboard",
        title: "Desarrollo de casos de uso",
        description:
          "Desde procesamiento inteligente de documentos hasta chatbots de cara al cliente — diseñamos y definimos los casos de uso correctos para tu contexto.",
      },
      {
        icon: "Bot",
        title: "Framework de orquestación",
        description:
          "Arquitecturas multi-agente, pipelines LLM y automatización de flujos con LangChain, CrewAI y orquestación personalizada.",
      },
      {
        icon: "RefreshCw",
        title: "Prototipado y escalamiento",
        description:
          "Pasamos rápido de prueba de concepto a producción, con la infraestructura para escalar cargas de trabajo de IA de manera confiable.",
      },
      {
        icon: "Brain",
        title: "Ingeniería de LLMs y RAG",
        description:
          "Sistemas RAG personalizados, modelos fine-tuned y agentes de IA construidos sobre GPT-4, Claude, Gemini y LLMs open-source.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Definición del problema",
        description:
          "Identificamos las oportunidades de IA de mayor valor en tu negocio y definimos métricas de éxito claras.",
      },
      {
        step: 2,
        title: "Datos y arquitectura",
        description:
          "Revisión de madurez de datos, diseño de arquitectura y selección de los modelos y frameworks adecuados.",
      },
      {
        step: 3,
        title: "Construcción e integración",
        description:
          "Prototipado rápido, integración de modelos, desarrollo de agentes y conexión con tus sistemas existentes.",
      },
      {
        step: 4,
        title: "Deploy y optimización",
        description:
          "Despliegue en producción con monitoreo, bucles de retroalimentación y mejora continua del modelo.",
      },
    ],
    technologies: [
      "Python",
      "LangChain",
      "OpenAI",
      "Claude",
      "PostgreSQL",
      "Docker",
    ],
    benefits: [
      "Soluciones de IA ancladas en resultados reales de negocio",
      "De prototipo a producción en semanas",
      "Experiencia en LLMs, RAG y orquestación de agentes",
    ],
    whatsappMessage:
      "Hola, me interesa el servicio de AI & Agentic Systems. ¿Podemos hablar sobre lo que necesito?",
    metaTitle: "AI & Agentic Systems | Axium",
    metaDescription:
      "Construimos sistemas potenciados por IA con LLMs, RAG y orquestación multi-agente. Automatiza flujos de trabajo e incorpora inteligencia en tiempo real.",
  },
};

export const SERVICE_IMAGES: Record<string, string> = {
  "design-branding": "/images/services/design-branding-hero.jpg",
  "software-development": "/images/services/software-dev-hero.jpg",
  "ai-agentic-systems": "/images/services/ai-systems-hero.jpg",
};
