"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Hook para obtener traducciones estáticas
 *
 * Uso:
 * const { t, locale, setLocale } = useTranslation("landing");
 * const title = t("hero.title");
 *
 * @param namespace - Namespace de las traducciones (ej: "landing", "common")
 * @returns Objeto con función `t` para obtener traducciones, locale actual y función para cambiar locale
 */
export function useTranslation(namespace = "landing") {
  // Estado reactivo para el locale
  const [locale, setLocaleState] = useState<string>("es");

  // Inicializar locale desde localStorage o navegador
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("locale");
      if (stored && ["es", "en", "pt"].includes(stored)) {
        setLocaleState(stored);
      } else {
        const browserLang = navigator.language.split("-")[0];
        if (browserLang && ["es", "en", "pt"].includes(browserLang)) {
          setLocaleState(browserLang);
          localStorage.setItem("locale", browserLang);
        }
      }

      // Escuchar cambios de locale desde otros componentes
      const handleLocaleChange = (e: CustomEvent<string>) => {
        setLocaleState(e.detail);
      };

      window.addEventListener(
        "localechange",
        handleLocaleChange as EventListener
      );
      return () => {
        window.removeEventListener(
          "localechange",
          handleLocaleChange as EventListener
        );
      };
    }
  }, []);

  // Función para cambiar el locale
  const setLocale = (newLocale: string) => {
    if (["es", "en", "pt"].includes(newLocale)) {
      setLocaleState(newLocale);
      if (typeof window !== "undefined") {
        localStorage.setItem("locale", newLocale);
      }
      // Disparar evento personalizado para que otros componentes se actualicen
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("localechange", { detail: newLocale })
        );
      }
    }
  };

  /**
   * Función para obtener traducciones
   * Por ahora usa traducciones hardcodeadas hasta que se creen los archivos JSON
   */
  const t = useMemo(() => {
    return (key: string, params?: Record<string, string>): string => {
      // Cargar traducciones del namespace
      const translations = getTranslationsForNamespace(locale, namespace);

      // Obtener valor por path anidado (ej: "hero.title" -> translations.hero.title)
      const keys = key.split(".");
      let value: unknown = translations;

      for (const k of keys) {
        value = (value as Record<string, unknown>)?.[k];
        if (value === undefined) break;
      }

      // Si no se encuentra, intentar con fallback a español
      if (value === undefined && locale !== "es") {
        const fallbackTranslations = getTranslationsForNamespace(
          "es",
          namespace
        );
        let fallbackValue: unknown = fallbackTranslations;
        for (const k of keys) {
          fallbackValue = (fallbackValue as Record<string, unknown>)?.[k];
          if (fallbackValue === undefined) break;
        }
        value = fallbackValue;
      }

      // Si todavía no hay valor, retornar la key
      if (value === undefined || value === null) {
        return key;
      }

      // Convertir a string y reemplazar parámetros
      let result = String(value);
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          result = result.replace(
            new RegExp(`\\{${paramKey}\\}`, "g"),
            paramValue
          );
        });
      }

      return result;
    };
  }, [locale, namespace]);

  return { t, locale, setLocale };
}

/**
 * Cargar traducciones para un namespace específico
 * Por ahora retorna traducciones hardcodeadas básicas
 * TODO: Reemplazar con carga dinámica de archivos JSON
 */
function getTranslationsForNamespace(
  locale: string,
  namespace: string
): Record<string, unknown> {
  const translations: Record<string, Record<string, unknown>> = {
    es: {
      // Landing translations
      hero: {
        title: "Plataforma {modern} para tu Negocio",
        modern: "Modern",
        subtitle:
          "La forma más inteligente de gestionar usuarios, contenido y configurar tu plataforma de manera eficiente y escalable.",
        ctaPrimary: "Comenzar Ahora",
        ctaSecondary: "Ver Funcionalidades",
      },
      bento: {
        title: "Todo lo que necesitas para construir tu {platform}",
        platform: "plataforma",
        subtitle:
          "Herramientas poderosas y fáciles de usar para crear experiencias excepcionales",
        cards: {
          ai: {
            title: "Revisión de Código con IA",
            description:
              "Mejora la calidad de tu código con revisiones automáticas impulsadas por IA.",
          },
          realtime: {
            title: "Vistas Previa en Tiempo Real",
            description:
              "Ve tus cambios mientras codificas con actualizaciones instantáneas.",
          },
          integrations: {
            title: "Integraciones de Un Clic",
            description: "Conecta tus herramientas favoritas sin esfuerzo.",
          },
          connectivity: {
            title: "Conectividad MCP",
            description:
              "Integración perfecta con el Protocolo de Contexto del Modelo.",
          },
          automation: {
            title: "Agentes de Codificación Paralela",
            description:
              "Automatiza tareas repetitivas y acelera tu flujo de trabajo.",
          },
          deployment: {
            title: "Despliegue Fácil",
            description:
              "Despliega tu aplicación con un solo clic a cualquier plataforma.",
          },
        },
      },
      cta: {
        title: "¿Listo para transformar",
        titleHighlight: "tu plataforma?",
        subtitle:
          "Únete a profesionales que ya están escalando sus operaciones con MyApp",
        buttonPrimary: "Comenzar ahora",
        buttonSecondary: "Ver planes",
        trust: {
          noCommitment: "Sin compromiso",
          quickSetup: "Configuración en minutos",
          support247: "Soporte 24/7",
        },
      },
      faq: {
        title: "Preguntas",
        titleHighlight: "Frecuentes",
        subtitle: "Todo lo que necesitas saber sobre nuestra plataforma",
        items: [
          {
            q: "¿Cómo funciona la gestión de usuarios?",
            a: "Nuestro sistema permite crear, gestionar y organizar usuarios con diferentes roles y permisos de manera sencilla y eficiente.",
          },
          {
            q: "¿Qué integraciones están disponibles?",
            a: "Soportamos más de 50 integraciones populares incluyendo APIs de terceros, servicios de autenticación, y herramientas de análisis.",
          },
          {
            q: "¿Cuál es el rendimiento de la plataforma?",
            a: "Nuestra plataforma ofrece un rendimiento optimizado con tiempos de respuesta menores a 100ms en planes Básico y menores a 50ms en planes superiores.",
          },
          {
            q: "¿Puedo gestionar permisos de equipo?",
            a: "Sí, nuestro sistema RBAC (Control de Acceso Basado en Roles) permite configurar permisos granulares para miembros del equipo.",
          },
          {
            q: "¿Hay prueba gratuita?",
            a: "Sí, todos los planes incluyen 14 días de prueba gratuita sin tarjeta de crédito. Puedes cancelar cuando quieras.",
          },
          {
            q: "¿Qué opciones de soporte están disponibles?",
            a: "Ofrecemos soporte por email en Básico, soporte prioritario en Profesional, y soporte dedicado 24/7 en planes Empresarial.",
          },
        ],
      },
      pricing: {
        title: "Planes para Cada",
        titleHighlight: "Tipo de Usuario",
        subtitle:
          "Elige el plan que se adapte a tus necesidades, desde usuarios individuales hasta organizaciones profesionales y equipos grandes.",
        annual: "Anual",
        monthly: "Mensual",
        discount: "-20%",
        billedAnnually: "Facturado anualmente",
        perMonth: "/mes",
        mostPopular: "⭐ Más Popular",
        plans: {
          basic: {
            name: "Básico",
            description: "Perfecto para usuarios individuales",
            monthlyPrice: "$29",
            annualPrice: "$19",
            buttonText: "Comenzar",
            features: [
              "Hasta 100 usuarios",
              "2 integraciones básicas",
              "Dashboard estándar",
              "Soporte por email",
              "Almacenamiento 1GB",
              "API básica",
            ],
          },
          professional: {
            name: "Profesional",
            description: "Ideal para equipos pequeños",
            monthlyPrice: "$99",
            annualPrice: "$79",
            buttonText: "Únete Ahora",
            features: [
              "Hasta 1,000 usuarios",
              "10 integraciones",
              "Dashboard avanzado",
              "Soporte prioritario",
              "Almacenamiento 10GB",
              "Sistema RBAC básico",
              "Analytics avanzado",
              "API completa",
            ],
          },
          enterprise: {
            name: "Empresarial",
            description: "Para organizaciones grandes",
            monthlyPrice: "$299",
            annualPrice: "$239",
            buttonText: "Contactar Ventas",
            features: [
              "Usuarios ilimitados",
              "Integraciones ilimitadas",
              "Dashboard personalizado",
              "Soporte 24/7",
              "Almacenamiento ilimitado",
              "RBAC completo",
              "API personalizada",
              "White-label disponible",
              "SLA garantizado",
            ],
          },
        },
        includes: "Incluye:",
        includesMore: "Todo lo anterior +",
      },
      testimonials: {
        title: "Gestión",
        titleHighlight: "sin esfuerzo",
        subtitle:
          "Escucha cómo profesionales escalan sus operaciones más rápido, colaboran sin problemas, y gestionan con confianza usando las poderosas herramientas de MyApp",
      },
      loading: "Cargando...",
    },
    en: {
      hero: {
        title: "Modern {modern} Platform for Your Business",
        modern: "Platform",
        subtitle:
          "The smartest way to manage users, content and configure your platform efficiently and scalably.",
        ctaPrimary: "Get Started",
        ctaSecondary: "View Features",
      },
      bento: {
        title: "Everything you need to build your {platform}",
        platform: "platform",
        subtitle:
          "Powerful and easy-to-use tools to create exceptional experiences",
        cards: {
          ai: {
            title: "AI Code Reviews",
            description:
              "Improve your code quality with AI-powered automatic reviews.",
          },
          realtime: {
            title: "Realtime Previews",
            description: "See your changes as you code with instant updates.",
          },
          integrations: {
            title: "One-Click Integrations",
            description: "Connect your favorite tools effortlessly.",
          },
          connectivity: {
            title: "MCP Connectivity",
            description:
              "Seamless integration with the Model Context Protocol.",
          },
          automation: {
            title: "Parallel Coding Agents",
            description:
              "Automate repetitive tasks and accelerate your workflow.",
          },
          deployment: {
            title: "Easy Deployment",
            description:
              "Deploy your application with one click to any platform.",
          },
        },
      },
      cta: {
        title: "Ready to transform",
        titleHighlight: "your platform?",
        subtitle:
          "Join professionals who are already scaling their operations with MyApp",
        buttonPrimary: "Get started",
        buttonSecondary: "View plans",
        trust: {
          noCommitment: "No commitment",
          quickSetup: "Setup in minutes",
          support247: "24/7 Support",
        },
      },
      faq: {
        title: "Frequently",
        titleHighlight: "Asked Questions",
        subtitle: "Everything you need to know about our platform",
        items: [
          {
            q: "How does user management work?",
            a: "Our system allows you to create, manage and organize users with different roles and permissions easily and efficiently.",
          },
          {
            q: "What integrations are available?",
            a: "We support over 50 popular integrations including third-party APIs, authentication services, and analytics tools.",
          },
          {
            q: "What is the platform performance?",
            a: "Our platform offers optimized performance with response times under 100ms on Basic plans and under 50ms on higher plans.",
          },
          {
            q: "Can I manage team permissions?",
            a: "Yes, our RBAC (Role-Based Access Control) system allows you to configure granular permissions for team members.",
          },
          {
            q: "Is there a free trial?",
            a: "Yes, all plans include a 14-day free trial with no credit card required. You can cancel anytime.",
          },
          {
            q: "What support options are available?",
            a: "We offer email support on Basic, priority support on Professional, and dedicated 24/7 support on Enterprise plans.",
          },
        ],
      },
      pricing: {
        title: "Plans for Every",
        titleHighlight: "Type of User",
        subtitle:
          "Choose the plan that fits your needs, from individual users to professional organizations and large teams.",
        annual: "Annual",
        monthly: "Monthly",
        discount: "-20%",
        billedAnnually: "Billed annually",
        perMonth: "/month",
        mostPopular: "⭐ Most Popular",
        plans: {
          basic: {
            name: "Basic",
            description: "Perfect for individual users",
            monthlyPrice: "$29",
            annualPrice: "$19",
            buttonText: "Get Started",
            features: [
              "Up to 100 users",
              "2 basic integrations",
              "Standard dashboard",
              "Email support",
              "1GB storage",
              "Basic API",
            ],
          },
          professional: {
            name: "Professional",
            description: "Ideal for small teams",
            monthlyPrice: "$99",
            annualPrice: "$79",
            buttonText: "Join Now",
            features: [
              "Up to 1,000 users",
              "10 integrations",
              "Advanced dashboard",
              "Priority support",
              "10GB storage",
              "Basic RBAC system",
              "Advanced analytics",
              "Full API",
            ],
          },
          enterprise: {
            name: "Enterprise",
            description: "For large organizations",
            monthlyPrice: "$299",
            annualPrice: "$239",
            buttonText: "Contact Sales",
            features: [
              "Unlimited users",
              "Unlimited integrations",
              "Custom dashboard",
              "24/7 support",
              "Unlimited storage",
              "Full RBAC",
              "Custom API",
              "White-label available",
              "Guaranteed SLA",
            ],
          },
        },
        includes: "Includes:",
        includesMore: "Everything above +",
      },
      testimonials: {
        title: "Effortless",
        titleHighlight: "Management",
        subtitle:
          "Hear how professionals scale their operations faster, collaborate seamlessly, and manage with confidence using MyApp's powerful tools",
      },
      loading: "Loading...",
    },
    pt: {
      hero: {
        title: "Plataforma {modern} Moderna para seu Negócio",
        modern: "Modern",
        subtitle:
          "A forma mais inteligente de gerenciar usuários, conteúdo e configurar sua plataforma de forma eficiente e escalável.",
        ctaPrimary: "Começar Agora",
        ctaSecondary: "Ver Recursos",
      },
      bento: {
        title: "Tudo que você precisa para construir sua {platform}",
        platform: "plataforma",
        subtitle:
          "Ferramentas poderosas e fáceis de usar para criar experiências excepcionais",
        cards: {
          ai: {
            title: "Revisão de Código com IA",
            description:
              "Melhore a qualidade do seu código com revisões automáticas alimentadas por IA.",
          },
          realtime: {
            title: "Visualizações em Tempo Real",
            description:
              "Veja suas mudanças enquanto codifica com atualizações instantâneas.",
          },
          integrations: {
            title: "Integrações de Um Clique",
            description: "Conecte suas ferramentas favoritas sem esforço.",
          },
          connectivity: {
            title: "Conectividade MCP",
            description:
              "Integração perfeita com o Protocolo de Contexto do Modelo.",
          },
          automation: {
            title: "Agentes de Codificação Paralela",
            description:
              "Automatize tarefas repetitivas e acelere seu fluxo de trabalho.",
          },
          deployment: {
            title: "Implantação Fácil",
            description:
              "Implante sua aplicação com um clique em qualquer plataforma.",
          },
        },
      },
      cta: {
        title: "Pronto para transformar",
        titleHighlight: "sua plataforma?",
        subtitle:
          "Junte-se a profissionais que já estão escalando suas operações com MyApp",
        buttonPrimary: "Começar agora",
        buttonSecondary: "Ver planos",
        trust: {
          noCommitment: "Sem compromisso",
          quickSetup: "Configuração em minutos",
          support247: "Suporte 24/7",
        },
      },
      faq: {
        title: "Perguntas",
        titleHighlight: "Frequentes",
        subtitle: "Tudo o que você precisa saber sobre nossa plataforma",
        items: [
          {
            q: "Como funciona o gerenciamento de usuários?",
            a: "Nosso sistema permite criar, gerenciar e organizar usuários com diferentes funções e permissões de forma simples e eficiente.",
          },
          {
            q: "Quais integrações estão disponíveis?",
            a: "Suportamos mais de 50 integrações populares, incluindo APIs de terceiros, serviços de autenticação e ferramentas de análise.",
          },
          {
            q: "Qual é o desempenho da plataforma?",
            a: "Nossa plataforma oferece desempenho otimizado com tempos de resposta inferiores a 100ms em planos Básicos e inferiores a 50ms em planos superiores.",
          },
          {
            q: "Posso gerenciar permissões da equipe?",
            a: "Sim, nosso sistema RBAC (Controle de Acesso Baseado em Funções) permite configurar permissões granulares para membros da equipe.",
          },
          {
            q: "Há teste gratuito?",
            a: "Sim, todos os planos incluem 14 dias de teste gratuito sem cartão de crédito. Você pode cancelar a qualquer momento.",
          },
          {
            q: "Quais opções de suporte estão disponíveis?",
            a: "Oferecemos suporte por email no Básico, suporte prioritário no Profissional e suporte dedicado 24/7 em planos Empresariais.",
          },
        ],
      },
      pricing: {
        title: "Planos para Cada",
        titleHighlight: "Tipo de Usuário",
        subtitle:
          "Escolha o plano que se adapte às suas necessidades, desde usuários individuais até organizações profissionais e grandes equipes.",
        annual: "Anual",
        monthly: "Mensal",
        discount: "-20%",
        billedAnnually: "Cobrado anualmente",
        perMonth: "/mês",
        mostPopular: "⭐ Mais Popular",
        plans: {
          basic: {
            name: "Básico",
            description: "Perfeito para usuários individuais",
            monthlyPrice: "$29",
            annualPrice: "$19",
            buttonText: "Começar",
            features: [
              "Até 100 usuários",
              "2 integrações básicas",
              "Dashboard padrão",
              "Suporte por email",
              "Armazenamento 1GB",
              "API básica",
            ],
          },
          professional: {
            name: "Profissional",
            description: "Ideal para equipes pequenas",
            monthlyPrice: "$99",
            annualPrice: "$79",
            buttonText: "Juntar-se Agora",
            features: [
              "Até 1.000 usuários",
              "10 integrações",
              "Dashboard avançado",
              "Suporte prioritário",
              "Armazenamento 10GB",
              "Sistema RBAC básico",
              "Análise avançada",
              "API completa",
            ],
          },
          enterprise: {
            name: "Empresarial",
            description: "Para grandes organizações",
            monthlyPrice: "$299",
            annualPrice: "$239",
            buttonText: "Contatar Vendas",
            features: [
              "Usuários ilimitados",
              "Integrações ilimitadas",
              "Dashboard personalizado",
              "Suporte 24/7",
              "Armazenamento ilimitado",
              "RBAC completo",
              "API personalizada",
              "White-label disponível",
              "SLA garantido",
            ],
          },
        },
        includes: "Inclui:",
        includesMore: "Tudo acima +",
      },
      testimonials: {
        title: "Gestão",
        titleHighlight: "sem esforço",
        subtitle:
          "Ouça como profissionais escalam suas operações mais rápido, colaboram perfeitamente e gerenciam com confiança usando as poderosas ferramentas do MyApp",
      },
      loading: "Carregando...",
    },
    // Common translations for navbar
    common: {
      es: {
        signIn: "Iniciar Sesión",
        signUp: "Registrarse",
        dashboard: "Dashboard",
        profile: "Perfil",
        settings: "Configuración",
        signOut: "Cerrar Sesión",
        user: "Usuario",
        mainMenu: "Menú",
        mainPanel: "Panel principal",
        accountSettings: "Ajustes de cuenta",
        personalInfo: "Información personal",
        openMenu: "Abrir menú principal",
      },
      en: {
        signIn: "Sign In",
        signUp: "Sign Up",
        dashboard: "Dashboard",
        profile: "Profile",
        settings: "Settings",
        signOut: "Sign Out",
        user: "User",
        mainMenu: "Menu",
        mainPanel: "Main panel",
        accountSettings: "Account settings",
        personalInfo: "Personal information",
        openMenu: "Open main menu",
      },
      pt: {
        signIn: "Entrar",
        signUp: "Registrar",
        dashboard: "Painel",
        profile: "Perfil",
        settings: "Configurações",
        signOut: "Sair",
        user: "Usuário",
        mainMenu: "Menu",
        mainPanel: "Painel principal",
        accountSettings: "Configurações da conta",
        personalInfo: "Informações pessoais",
        openMenu: "Abrir menu principal",
      },
    },
  };

  if (namespace === "landing") {
    return translations[locale] ?? translations.es ?? {};
  }

  if (namespace === "common") {
    const common = translations.common;
    if (common) {
      return (common[locale] ?? common.es ?? {}) as Record<string, unknown>;
    }
  }

  return {} as Record<string, unknown>;
}
