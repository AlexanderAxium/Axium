# Portfolio Case Blocks - Design System

Sistema modular de componentes para páginas de proyectos del portafolio de Axium. Cada proyecto compone su propia página eligiendo qué bloques mostrar y en qué orden.

---

## Arquitectura

```
src/
├── components/axium/case-blocks/   # Componentes reutilizables
│   ├── index.ts                    # Barrel exports
│   ├── case-hero-split.tsx
│   ├── case-hero-full-image.tsx
│   ├── case-hero-minimal.tsx
│   ├── case-overview.tsx
│   ├── case-project-about.tsx      # Sección flexible "Sobre el proyecto"
│   ├── case-feature-showcase.tsx
│   ├── case-process-timeline.tsx
│   ├── case-scope-list.tsx
│   ├── case-testimonial.tsx
│   ├── case-metrics.tsx
│   ├── case-project-meta.tsx
│   ├── case-info-bar.tsx
│   ├── case-color-palette.tsx
│   ├── case-gallery-grid.tsx
│   ├── case-gallery-full-scroll.tsx
│   ├── case-gallery-mockup.tsx
│   ├── case-video-embed.tsx
│   ├── case-next-project.tsx
│   ├── case-divider.tsx
│   └── README.md                   # Este archivo
├── components/axium/case-contact-cta.tsx  # CTA de contacto (compartido)
├── data/cases/                     # JSONs de datos por proyecto
│   ├── maintech.json
│   ├── vitalchain.json
│   ├── feniz.json
│   ├── innersoulbright.json
│   ├── clefast.json
│   └── redesvip.json
└── app/(public)/casos-de-exito/    # Páginas individuales
    ├── maintech/page.tsx
    ├── vitalchain/page.tsx
    ├── feniz/page.tsx
    ├── innersoulbright/page.tsx
    ├── clefast/page.tsx
    └── redesvip/page.tsx
```

---

## Catálogo de Componentes

### Heroes (elegir 1 por página)

| Componente | Descripción | Ideal para |
|---|---|---|
| `CaseHeroSplit` | Texto a la izquierda, imagen a la derecha. Gradient configurable. | Web apps, SaaS, E-commerce |
| `CaseHeroFullImage` | Imagen full-width con overlay y texto encima. | Landing pages, Branding, proyectos visuales |
| `CaseHeroMinimal` | Solo texto centrado sobre gradient, sin imagen. | Proyectos donde la galería es el protagonista visual |

**Props comunes**: `title`, `description`, `industry?`, `location?`, `badges?`

**Props extra de `CaseHeroSplit`**: `image`, `gradient?`
**Props extra de `CaseHeroFullImage`**: `image`, `overlayOpacity?`
**Props extra de `CaseHeroMinimal`**: `gradient?`

---

### Contenido

| Componente | Descripción | Ideal para |
|---|---|---|
| `CaseOverview` | Descripción del proyecto con chips de metadata (plataforma, duración, cliente) y sidebar de datos clave opcional. [Legacy] | Todos los proyectos |
| `CaseProjectAbout` | Sección "Sobre el proyecto" personalizable. Usa subcomponentes para armar descripción, metadata, texto, listas, sidebar de datos clave. | Todos los proyectos |
| `CaseFeatureShowcase` | Grid de features con icono, título y descripción. Fondo oscuro. | SaaS, Web Apps, plataformas |
| `CaseProcessTimeline` | Timeline horizontal (desktop) / vertical (mobile) de fases del proyecto. | Branding, proyectos complejos, desarrollo a medida |
| `CaseScopeList` | Checklist de entregables en dos columnas con checkmarks animados. | Cualquier tipo de proyecto |
| `CaseTestimonial` | Quote de cliente con nombre, rol y avatar opcional. Fondo oscuro. | Proyectos con testimonial disponible |

#### CaseProjectAbout (composable)

Sección flexible que acepta `children`. Usa subcomponentes para definir el contenido:

```tsx
<CaseProjectAbout>
  <CaseProjectAbout.TwoColumn>  {/* Layout de dos columnas */}
    <CaseProjectAbout.Main>     {/* Columna principal */}
      <CaseProjectAbout.Description content={data.projectDescription} />
      <CaseProjectAbout.MetadataChips platform={...} duration={...} client={...} />
      <CaseProjectAbout.PublishedDate date={data.publishedDate} />
      {/* Bloques personalizados por proyecto */}
      <CaseProjectAbout.Text title="Contexto" content="..." />
      <CaseProjectAbout.List title="Objetivos" items={["...", "..."]} />
    </CaseProjectAbout.Main>
    <CaseProjectAbout.QuickFacts title="Datos clave" items={[{ label, value }]} />
  </CaseProjectAbout.TwoColumn>
</CaseProjectAbout>
```

Bloques disponibles: `Description`, `MetadataChips`, `PublishedDate`, `Text`, `List`, `QuickFacts`, `Main`, `TwoColumn`.

#### CaseOverview Props (legacy)

```tsx
interface CaseOverviewProps {
  description: string;        // Descripción detallada del proyecto
  publishedDate?: string;     // Fecha de publicación
  quickFacts?: QuickFact[];   // Sidebar con datos clave
  platform?: string;          // Chip: "Web", "Mobile", "Web & Mobile"
  duration?: string;          // Chip: "Feb '25 – Jun '25"
  client?: string;            // Chip: nombre del cliente
}
```

#### CaseFeatureShowcase Props

```tsx
interface CaseFeatureShowcaseProps {
  title?: string;             // Default: "Funcionalidades Clave"
  subtitle?: string;          // Default: "Lo que construimos"
  features: FeatureItem[];    // Array de features
  columns?: 2 | 3;           // Default: 3
}

interface FeatureItem {
  icon: string | LucideIcon;  // Nombre de icono: "BarChart3", "Layout", etc.
  title: string;
  description: string;
}
```

Iconos disponibles por nombre: `BarChart3`, `Globe`, `Layout`, `Layers`, `Lock`, `Monitor`, `Smartphone`, `Zap`.

#### CaseProcessTimeline Props

```tsx
interface CaseProcessTimelineProps {
  title?: string;             // Default: "Proceso de Desarrollo"
  subtitle?: string;          // Default: "Cómo lo hicimos"
  steps: TimelineStep[];      // Hasta 4 pasos en desktop
}

interface TimelineStep {
  icon: string | LucideIcon;  // "Search", "Lightbulb", "Palette", "Code2", "Rocket"
  title: string;
  description: string;
}
```

#### CaseScopeList Props

```tsx
interface CaseScopeListProps {
  title?: string;             // Default: "Alcance del Proyecto"
  subtitle?: string;          // Default: "Entregables"
  items: string[];            // Array de strings con cada entregable
  columns?: 1 | 2;           // Default: 2
}
```

---

### Métricas

| Componente | Descripción | Ideal para |
|---|---|---|
| `CaseMetrics` (grid) | Cards con icono, número grande y label. Fondo blanco. | Impacto medible detallado |
| `CaseMetrics` (banner) | Strip horizontal con números y labels. Fondo gradient oscuro. | Métricas compactas, impacto rápido |

```tsx
interface CaseMetricsProps {
  title?: string;                    // Default: "Impacto Medible"
  subtitle?: string;                 // Default: "Los Resultados"
  results: MetricItem[];
  variant?: "grid" | "banner";      // Default: "grid"
  accentGradient?: string;           // Solo para banner, custom gradient CSS
}

interface MetricItem {
  icon: string | LucideIcon;  // "Users", "Clock", "TrendingUp", "CheckCircle2"
  metric: string;             // "95%", "200+", "24/7"
  label: string;
}
```

---

### Info / Detalles

| Componente | Descripción | Ideal para |
|---|---|---|
| `CaseProjectMeta` | Grid de metadata cards con iconos (industria, plataforma, duración, cliente, etc.). | Proyectos con metadata rica |
| `CaseInfoBar` | Card unificada con servicios (izq) y tecnologías (der) en pills. | Todos los proyectos |
| `CaseColorPalette` | Swatches de colores + tipografía del proyecto. | Branding, identidad visual |

#### CaseInfoBar Props

```tsx
interface CaseInfoBarProps {
  services?: string[];             // Pills de servicios
  technologies?: string[];         // Pills de tecnologías
  servicesTitle?: string;          // Default: "Servicios"
  techTitle?: string;              // Default: "Stack Tecnológico"
  linkServicesToHome?: boolean;    // Default: true
}
```

#### CaseColorPalette Props

```tsx
interface CaseColorPaletteProps {
  title?: string;
  subtitle?: string;
  colors: ColorSwatch[];          // Array de colores con hex y nombre
  typography?: {                  // Opcional: tipografía del proyecto
    heading: string;              // Nombre de la fuente de encabezados
    body: string;                 // Nombre de la fuente de cuerpo
  };
}
```

---

### Galerías (elegir 1 o más)

| Componente | Descripción | Ideal para |
|---|---|---|
| `CaseGalleryGrid` | Grid de imágenes con hover 3D. Modo cinematic para 1 sola imagen. | General, múltiples screenshots |
| `CaseGalleryFullScroll` | Screenshot largo en container decorado con gradients. | Landing pages, screenshots full-page |
| `CaseGalleryMockup` | Mockups de dispositivos (logo + hero + laptop + mobile). | Web apps con múltiples vistas |
| `CaseVideoEmbed` | Video embed (YouTube/Vimeo/local) con overlay de play. | Demos, walkthroughs |

#### CaseGalleryGrid Props

```tsx
interface CaseGalleryGridProps {
  images: GalleryImage[];          // Array de imágenes
  columns?: 2 | 3;                // Default: 3
  sectionTitle?: string;
  background?: "dark" | "light";  // Default: "dark"
  aspect?: "wide" | "tall" | "auto"; // Default: "auto"
}

interface GalleryImage {
  src: string;
  alt: string;
  span?: 1 | 2;                  // 2 = ocupa 2 columnas
}
```

Si se pasa solo 1 imagen, se renderiza en modo cinematic (full-width con hover 3D).

---

### Navegación / Layout

| Componente | Descripción |
|---|---|
| `CaseNextProject` | Card de "Siguiente proyecto" con imagen, título y flecha. |
| `CaseDivider` | Separador visual entre secciones del mismo fondo. |
| `CaseContactCTA` | Formulario de contacto con datos del CEO. Componente compartido. |

#### CaseDivider Props

```tsx
interface CaseDividerProps {
  variant?: "line" | "wave" | "gradient";  // Default: "gradient"
  background?: "light" | "dark" | "white"; // Default: "light"
}
```

---

## Cómo agregar un nuevo proyecto

### Paso 1: Crear el archivo JSON de datos

Crear `src/data/cases/<slug>.json`:

```json
{
  "title": "Nombre del Proyecto",
  "industry": "Industria",
  "image": "/images/proyects/<slug>/<slug>-home.png",
  "location": "País/Ciudad",
  "platform": "Web",
  "duration": "Mes '25 – Mes '26",
  "client": "Nombre del Cliente",
  "technologyStack": ["Next.js", "TypeScript", "Tailwind CSS"],
  "secondaryIndustry": "Sub-industria",
  "forWhom": "Audiencia objetivo",
  "services": ["Servicio 1", "Servicio 2"],
  "description": "Descripción corta para el carousel de la home.",
  "problem": "Descripción del desafío (opcional, para referencia).",
  "solution": "Descripción de la solución (opcional).",
  "results": [
    { "icon": "Users", "metric": "100+", "label": "usuarios activos" },
    { "icon": "TrendingUp", "metric": "50%", "label": "mejora en conversión" }
  ],
  "projectDescription": "Descripción detallada del proyecto para la sección Overview.",
  "skillsAndDeliverables": ["Next.js", "UI/UX Design"],
  "publishedDate": "Feb 18, 2026"
}
```

### Paso 2: Agregar imágenes

Colocar imágenes en `public/images/proyects/<slug>/`:

| Tipo | Tamaño recomendado | Nombre sugerido |
|---|---|---|
| Hero / Home | 1400x720 px | `<slug>-home.png` |
| Laptop mockup | 900x620 px | `<slug>-lap.jpg` |
| Mobile mockup | 900x620 px | `<slug>-cel.jpg` |
| Logo / Isotipo | 72x72 px (SVG o PNG) | `iconotipo.png` |
| Full page screenshot | 1920px ancho | `<slug>-fullpage.png` |
| Galería extra | 600x400 px | `<slug>-<nombre>.png` |

### Paso 3: Registrar en cases-data.ts

En `src/data/cases-data.ts`, agregar import y entrada:

```ts
import nuevoData from "./cases/nuevo.json";

const cases: CaseItem[] = [
  // ... proyectos existentes
  convertCaseFromJSON(nuevoData as CaseItemJSON),
];
```

### Paso 4: Agregar slug al carousel

En `src/components/axium/cases-section.tsx`, agregar al `slugMap`:

```ts
const slugMap: Record<string, string> = {
  // ... existentes
  "Nombre del Proyecto": "nuevo-slug",
};
```

### Paso 5: Crear la página

Crear `src/app/(public)/casos-de-exito/<slug>/page.tsx`. Copiar esta plantilla y elegir los bloques apropiados:

```tsx
import {
  CaseHeroSplit,
  CaseOverview,
  CaseInfoBar,
  CaseGalleryGrid,
  CaseNextProject,
} from "~/components/axium/case-blocks";
import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import data from "~/data/cases/<slug>.json";

export const metadata = {
  title: `${data.title} | Axium`,
  description: data.description,
};

export default function NuevoProyectoPage() {
  return (
    <div className="min-h-screen">
      <CaseHeroSplit
        title={data.title}
        description={data.description}
        image={data.image}
        industry={data.industry}
        location={data.location}
      />

      <CaseOverview
        description={data.projectDescription}
        publishedDate={data.publishedDate}
        platform={data.platform}
        duration={data.duration}
        client={data.client}
      />

      {/* Agregar más bloques según el tipo de proyecto */}

      <CaseInfoBar
        services={data.services}
        technologies={data.technologyStack}
      />

      <CaseGalleryGrid
        sectionTitle="Vista del Proyecto"
        images={[{ src: data.image, alt: data.title }]}
      />

      <CaseNextProject
        title="Siguiente Proyecto"
        description="Descripción corta del siguiente."
        image="/images/proyects/next/next-home.png"
        href="/casos-de-exito/next"
        industry="Industria"
      />

      <CaseContactCTA />
    </div>
  );
}
```

---

## Recetas por tipo de proyecto

### Web App / SaaS

```
HeroSplit -> ProjectAbout -> FeatureShowcase
-> Metrics (grid) -> InfoBar -> GalleryMockup -> NextProject -> CTA
```

### Landing Page / Sitio Corporativo

```
HeroSplit -> Overview -> Metrics (banner) -> ScopeList -> InfoBar
-> GalleryGrid -> NextProject -> CTA
```

### E-Commerce

```
HeroSplit -> ProjectAbout (con quickFacts) -> InfoBar
-> GalleryGrid -> NextProject -> CTA
```

### Branding / Identidad Visual

```
HeroFullImage -> Overview -> ColorPalette -> ProcessTimeline -> ScopeList
-> InfoBar -> GalleryGrid -> NextProject -> CTA
```

### Plataforma / Marketplace

```
HeroSplit -> ProjectAbout -> FeatureShowcase -> Metrics (grid)
-> ScopeList -> InfoBar -> GalleryFullScroll -> NextProject -> CTA
```

### App Móvil

```
HeroSplit -> Overview -> FeatureShowcase -> Metrics (banner)
-> InfoBar -> GalleryMockup -> NextProject -> CTA
```

### Dashboard / Data

```
HeroMinimal -> Overview -> FeatureShowcase -> Metrics (grid)
-> InfoBar -> GalleryGrid -> NextProject -> CTA
```

---

## Ritmo visual recomendado

Para evitar monotonía, alternar fondos entre secciones:

| Fondo | Componentes |
|---|---|
| **Gradient oscuro** | Heroes, FeatureShowcase, Metrics (banner), VideoEmbed, GalleryMockup, Testimonial |
| **Blanco** (`#fff`) | Metrics (grid), ProcessTimeline, ScopeList, ColorPalette, NextProject |
| **Gris claro** (`#f8fafb`) | Overview, ProjectMeta, InfoBar |

Si dos secciones consecutivas tienen el mismo fondo, insertar `<CaseDivider />` entre ellas.

---

## Notas de desarrollo

- Todos los componentes usan `"use client"` y `motion/react` para animaciones.
- La easing estándar es `smoothEase = [0.4, 0, 0.2, 1]`.
- Los colores principales del brand son: Primary `#060C20`, Secondary `#0072CF`, Accent `#7ECFC3`.
- Las clases tipográficas (`text-display`, `text-heading-1`, `text-body`, etc.) están definidas en `globals.css`.
- Los iconos se resuelven por string (ej: `"BarChart3"`) o como componente `LucideIcon` directo.
