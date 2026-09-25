# Caso de éxito — ANJ Sports · **hecho** (2026-09-01)

**Encargo (Alexander, 2026-09-01):** *"vayamos primero con ANJ, no haremos
rediseño de su web, quedará tal cual la web, pero su caso de éxito dentro de
Axium se mejorará. Cada caso de éxito quiero que tenga su creatividad."*

→ `anjsports.com` **no se toca**. Se rehace `/casos-de-exito/anjsports` dentro
de Axium. Y se establece el principio que rige a los 31: **cada caso hereda la
identidad de su cliente en vez de repetir la plantilla de Axium.**

---

## 1. Lo que encontré, verificado en vivo

### Hallazgo que hay que corregir sí o sí

El JSON dice **`"technologyStack": ["WordPress", "WooCommerce", "PHP"]`**.
Es **falso**. Medido en `anjsports.com` el 2026-09-01:

| Prueba | Resultado |
|---|---|
| `script[src*="/_next/"]` | ✅ 12 chunks de Next.js |
| `wp-content` / `wp-includes` en el HTML | ❌ **cero** |
| Assets | Cloudflare R2 (`pub-…r2.dev`) |
| Rutas | `app/[...slug]/page-*.js` — App Router |
| Optimización de imagen | `/_next/image?url=…&w=1920&q=100` |

**Es Next.js con App Router y R2, no WordPress.** Publicar "WordPress" en el
portafolio subvalúa el trabajo y es un dato incorrecto frente a un cliente
técnico. Se corrige antes de cualquier cosa visual.

### El ADN visual de ANJ (esto es "su creatividad")

Medido en la página real:

| Elemento | Dato |
|---|---|
| **Lienzo** | Negro `#000` en hero y sección de deportistas; blanco en catálogo |
| **Display** | **Druk Wide Bold**, 72px, MAYÚSCULAS, peso 800 — condensada ancha, deportiva |
| **Texto** | AdihausDIN 300–700, 11–20px |
| **Acento** | **Cambia según la marca del slide**: cyan-verde `#2BE8C8` para XIOM · magenta `#E838B0` para Butterfly |
| **Gesto propio** | El **wordmark de la marca en órbita circular** detrás del atleta (texto curvado repetido "XIOM – XIOM –"), con glow |
| **Píldora** | "DESDE 2010" en degradado cyan→magenta |
| **Marquee circular** | "VER DEPORTISTAS •" girando alrededor de una flecha ↗ |
| **Atleta** | Recortado a la derecha, iluminado con el color de la marca |

**El hallazgo creativo:** el sitio **cambia de color según la marca** que
muestra. XIOM es cyan, Butterfly es magenta. Eso es lo que hay que enseñar —
no "tiene un carrusel".

### La historia real (que el caso actual no cuenta)

El texto de hoy dice "tienda online con productos destacados y últimos". Lo que
ANJ es, según su propio sitio:

1. **Distribuidor oficial de 5 marcas**: XIOM, Butterfly, SANWEI, Dr. Neubauer,
   VICTAS. Con sello **"POWERED BY: XIOM"**.
2. **Patrocinador de atletas** — sección DEPORTISTAS con carrusel de fotos de
   competencia (Rodrigo Hidalgo, Keiji Takeda, Nano Fernández). Un e-commerce
   común no patrocina jugadores.
3. **16 años** — "DESDE 2010".
4. Tagline propio: **"Acompañando al Tenis de Mesa."**
5. Catálogo real con stock y precios en soles ("19 unidades disponibles",
   "Últimas 1 unidad", S/227.50).

→ **La tesis del caso:** ANJ no es una tienda, es **la casa del tenis de mesa
en Perú**: distribuye las marcas que los jugadores quieren y patrocina a los
que compiten. La web tenía que verse como una marca deportiva, no como un
catálogo.

---

## 2. Material capturado

En `capturas-clientes/anjsports/`:

| Archivo | Qué es | Tamaño |
|---|---|---|
| `01-hero-2x.png` | Hero XIOM (cyan) a **2880×1800** — resolución de composición | 2880×1800 |
| `01-hero.png` | Hero a 1440 | 1440×900 |
| `02-novedades.png` | 4 productos: packaging de gomas, muy gráfico | 1440×900 |
| `03-coleccion-xiom.png` | Colección de ropa: modelo + 6 jerseys | 1440×900 |
| `04-deportistas.png` | Sección negra: 5 fotos de competencia + "POWERED BY XIOM" + logos de marcas | 1440×900 |
| `05-movil-hero.png` | Hero Butterfly (magenta) en móvil | 390×844 |
| `00-full.jpg` | Página completa | 1425×6027 |

**Pendiente de capturar** cuando se produzcan las imágenes: el slide Butterfly
en desktop a 2880 (para la comparación de dos marcas), una ficha de producto, y
el carrito/checkout.

### Lo que ya existe y sirve

Las dos imágenes actuales (`anjsports-hero.jpg`, `anjsports-desc.jpg`, ambas
1536×1024) **ya son buenos mockups** — laptop con glow azul, y tablet+móvil con
glow magenta. Son R8/R21 bien hechas. **Se conservan** y se suman a la galería
nueva; no hay que rehacerlas.

---

## 3. Las imágenes a producir

Seis piezas. Formato fijo **3:2** (el ratio de 29 de las 33 portadas de Axium),
excepto donde se indica.

| # | Receta | Qué es | Cómo se hace |
|---|---|---|---|
| **A** | **R7 — dos marcas, dos colores** ⭐ | El hero XIOM (cyan) y el hero Butterfly (magenta) **lado a lado**, cortados por el centro. La imagen que cuenta el hallazgo: la misma web, dos identidades | Dos capturas 2x + composición. **Sin IA.** Es la pieza principal del caso |
| **B** | **R19 — sección enmarcada** | El hero completo sobre campo negro con margen 15%, radio grande | Captura 2880 + Figma. Sin IA |
| **C** | **R21 — móviles sobre glow** | 3 capturas móviles (hero Butterfly, catálogo, ficha de producto) escalonadas en diagonal sobre glow magenta | Capturas móvil + degradado radial. Sin IA |
| **D** | **R4 — mosaico de producto** | Las gomas recortadas (Omega VIII, Zyre-03, Trouble Maker) sobre negro. **El packaging de tenis de mesa es gráficamente brutal**: círculos concéntricos de color puro | Recortes del catálogo. Sin IA |
| **E** | **R23 — mosaico de momentos** | Grilla 3×3: goma · atleta en competencia · jersey XIOM · mesa Sanwei · logo ANJ · captura de catálogo · precio en soles · marquee · glow | Composición de material existente. Sin IA |
| **F** | **R8 — escenografía del rubro** | Laptop con el sitio **sobre una mesa de ping-pong real**, luz cenital dura, pelota naranja fuera de foco, fondo negro de gimnasio | **Higgsfield** genera el fondo (mesa + luz + pelota); mockup encima; captura real compositada |

**Cinco de seis sin IA.** Higgsfield entra solo en la F, que es donde aporta:
la escenografía del rubro que Adelt hace con la laptop en el pasto.

### El prompt de la F (para Higgsfield)

```
Close-up product photography of a modern laptop resting on the dark blue
surface of a professional table tennis table, seen from a low three-quarter
angle. The laptop screen is a flat pure green rectangle, completely blank, no
content. Hard directional key light from above left, like a sports arena
spotlight, creating a sharp contact shadow under the laptop. Deep black
gymnasium background, out of focus, with faint teal rim light. A single orange
table tennis ball rests on the table in the foreground, slightly out of focus.
Matte surfaces, fine grain, no reflections on the screen. Photographic,
editorial, commercial product photography. 3:2 aspect ratio.
```
Negativos: `no text, no logos, no screen content, no people, no hands, no lens
flare, no watermark, no motion blur, no oversaturation`.

**La pantalla sale verde plana** y encima se compone la captura real del sitio
con transformación de perspectiva. La interfaz nunca la genera el modelo.

---

## 4. La ficha, sección por sección

Lo que hay hoy: hero split genérico → párrafo largo → 2 imágenes en grilla → 6
tarjetitas con iconos de Lucide → siguiente proyecto. **Es la misma plantilla
que los otros 32.**

Lo propuesto — **hereda el negro y el neón de ANJ**:

| # | Sección | Contenido | De dónde sale |
|---|---|---|---|
| 1 | **Hero negro** | Fondo `#000` con glow cyan sutil. "ANJ Sports" en display grande. Debajo, su propio tagline: *"Acompañando al Tenis de Mesa."* Retícula de metadata en micro-labels: `PERÚ · 2026 · TIENDA ONLINE · DESDE 2010`. Chips de servicio. Píldora **"Ver sitio ↗"** | Isadora (hero con el color del cliente) + Fiddle (retícula de metadata) |
| 2 | **Imagen A a sangre** | La comparación XIOM / Butterfly, ancho completo | La pieza que cuenta el hallazgo |
| 3 | **El encargo** | 3–4 líneas, no el párrafo de 9 que hay hoy. *"ANJ distribuye las marcas que los jugadores de tenis de mesa quieren y patrocina a los que compiten. Necesitaba verse como una marca deportiva, no como un catálogo."* | P8 (frase de transformación) |
| 4 | **Las 5 marcas** | Fila con los logos reales: XIOM · Butterfly · SANWEI · Dr. Neubauer · VICTAS, sobre negro, con el sello "POWERED BY XIOM" | Dato real y diferenciador; hoy no aparece |
| 5 | **Imagen C** — móviles sobre glow | | |
| 6 | **Lo que construimos** | 4 bloques, no 6: **Catálogo con stock real** (precios en soles, "últimas 1 unidad") · **Colección de ropa** · **Deportistas patrocinados** · **Cuenta y ofertas**. Con texto concreto, sin iconos genéricos | Reduce de 6 a 4 y cada uno dice algo específico |
| 7 | **Imagen D** — mosaico de producto | | |
| 8 | **Deportistas** | Bloque negro con las fotos de competencia y los nombres. Es lo que distingue a ANJ de cualquier tienda | Sección propia del cliente |
| 9 | **Stack real** | Next.js · App Router · Cloudflare R2 · Tailwind — **corregido** | Hallazgo § 1 |
| 10 | **Imagen F** — laptop en la mesa de ping-pong | Cierre | Higgsfield |
| 11 | Siguiente proyecto + CTA | Como está | — |

**Ritmo:** texto → imagen → texto → imagen, nunca dos imágenes seguidas
(Isadora, S26). Total: **6 imágenes**, dentro del techo.

---

## 5. Lo que se hizo

**Respuestas de Alexander:** Next.js confirmado · hay permiso para las marcas ·
**no hay métricas** · **sin Higgsfield en este caso**. → 5 imágenes, todas de
composición pura.

### Correcciones de datos falsos
- `technologyStack` pasó de `["WordPress","WooCommerce","PHP"]` a
  `["Next.js","App Router","Tailwind CSS","Cloudflare R2"]`.
- Los textos decían *"Desarrollamos su e-commerce con WordPress y WooCommerce"*
  en **4 archivos**: `src/data/cases/anjsports.json` y los tres locales
  (`es`, `en`, `pt`). Reescritos en los tres idiomas con el stack real y con la
  frase de transformación (P8).

### Las 5 imágenes (`public/images/proyects/anjsports/`)
Todas 2400×1600, entre 288 y 484 KB — contra 1.1–1.4 MB de las dos viejas, que
**se conservan** porque ya eran buenos mockups.

| Archivo | Qué es | Receta |
|---|---|---|
| `anjsports-marcas.jpg` | XIOM (cian) y Butterfly (magenta) lado a lado, escalonados | R7 — la pieza que cuenta el hallazgo |
| `anjsports-web.jpg` | La portada en marco de navegador con `anjsports.com` | R19 |
| `anjsports-movil.jpg` | Catálogo · portada · ficha sobre **arena generada en Higgsfield** | R21b — fórmula híbrida |
| `anjsports-productos.jpg` | Tres gomas en tarjetas blancas, «220 productos en catálogo» | R4 |
| `anjsports-mosaico.jpg` | Grilla 4×3: atletas, productos y los datos duros 2010 / 220 / 5 | R23 |

Hechas con `COMPOSITOR.md` (HTML/CSS + Playwright). Los HTML quedan en
`capturas-clientes/anjsports/assets/` para re-renderizar si el sitio cambia.

### La ficha (`AnjsportsContent.tsx`, reescrita)
10 secciones que **heredan el negro y los dos neones de ANJ** en vez de la
plantilla clara de Axium:
hero oscuro con glows y metadata en retícula → imagen de las dos marcas →
el encargo → las 5 marcas en tipografía → móviles → 4 bloques de «lo que
construimos» (numerados, sin iconos genéricos) → productos → **deportistas**
(lo que ninguna tienda tiene) → el sitio enmarcado → mosaico → siguiente
proyecto + CTA.

Ritmo texto → imagen → texto → imagen (S26). Verificado: `tsc` y `biome`
limpios, sin desborde horizontal en 390px (`scrollWidth` 375 < 390).

### Datos nuevos encontrados en el sitio
**220 productos** en catálogo · **5 marcas** distribuidas · **desde 2010** ·
deportistas patrocinados: Rodrigo Hidalgo, Keiji Takeda, Nano Fernández ·
tagline propio *«Acompañando al Tenis de Mesa»*. Nada de esto estaba en el caso
anterior.

## 5bis. Segunda pasada (2026-09-02)

Alexander sobre la v1: *"me diste a generar ninguna imagen con ningún prompt,
yo lo pude haber hecho para ser más profesional"* y *"pusiste mucho texto, no
es para promocionar ANJ sino para promocionar mi trabajo"*. Las dos, ciertas.

**Medición que lo confirmó:**

| Ficha | Imágenes | px por imagen |
|---|---|---|
| Adelt — Farm Minerals | 11 | 599 |
| Fit Design — Stormborn | 16 | 797 |
| **ANJ v1** | **5** | **1 893** ← peor de las 14 |

**Qué cambió:**
1. **Modelo de ficha → Stormborn** (elegido por Alexander: *"es sutil y
   elegante"*). Hero · Overview con bullets `Label: descripción` · El reto ·
   Enfoque y resultado · **la web completa como tira larga**. Fiddle queda
   reservado para los SaaS propios (*"demasiado extendida"* para clientes).
2. **El foco pasó al trabajo.** Cada frase responde "qué hicimos". El cliente
   se presenta en una línea del Overview.
3. **200 palabras** (v1: 224) y **9 imágenes + la tira** (v1: 5). La tira ocupa
   el 41 % del scroll — Stormborn, 38 %.
4. **Prompts entregados** en `PROMPTS-ANJSPORTS.md`. Alexander generó el fondo
   de arena; descartó el resto (*"mejor estos que ya había creado"*, por los
   mockups suyos que ya existían).
5. **Fórmula híbrida estrenada**: el fondo lo genera él en Higgsfield, las
   capturas reales se componen encima en HTML. Ver `COMPOSITOR.md` § R21b.

**Imágenes finales (10):** las 2 suyas conservadas · marcas · web · **movil
(sobre arena generada)** · productos · mosaico · reto-1 · reto-2 · **tienda
(tira de 1585×6385)**.

## 6. Lo que queda pendiente
- **Métricas de negocio**: no hay. Si algún día ANJ comparte pedidos/mes o
  conversión, la ficha gana la pieza que le falta (S25).
- **Logos de las marcas**: hay permiso, pero se resolvió tipográficamente (los
  5 nombres en grande). Si aparecen los SVG limpios, se puede cambiar.
- **La portada del índice** sigue siendo `anjsports-hero.jpg` (el mockup de
  laptop). Funciona bien en la grilla 4:3; `anjsports-marcas.jpg` es
  demasiado editorial para recortarse ahí.

## 7. Lo que se preguntó antes de construir

1. **¿Confirmas el stack?** Yo medí Next.js + R2. Si la web la hicieron
   ustedes con ese stack, lo corrijo en el JSON; si hubo un WordPress antes que
   migraron, eso es aún mejor historia y hay que contarla.
2. **¿Tienes los logos de las 5 marcas** en SVG/PNG limpio, y permiso para
   mostrarlos? Van en la sección 4.
3. **¿Datos de resultado?** Si ANJ tiene algo medible (pedidos/mes, tiempo de
   carga antes/después, posiciones en Google), la ficha gana muchísimo — es la
   pieza que Ragged Edge y Fit Design ponen delante. Si no hay, se omite; no se
   inventa.
4. **Higgsfield** — para la imagen F necesito entrar con tu cuenta. Dime cuándo
   y la genero (1 imagen, ~2 intentos).
5. **¿Construyo ya la ficha con las 5 imágenes sin IA**, y la F se suma después?
   Es lo que recomiendo: tienes el caso funcionando hoy y la pieza cara llega
   cuando llegue.
