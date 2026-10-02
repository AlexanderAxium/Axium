# BASIC/DEPT® — https://www.basicagency.com/case-studies

- **Analizada:** 2026-09-29
- **Cómo llegó:** estaba en `COLA.md` desde el 2026-09-01 sin analizar, marcada
  como prioridad por ser la única con **los dos ejes de filtro de Axium**
  (servicio e industria) sobre un catálogo grande. Se ingiere ahora porque su
  catálogo es **mayoritariamente e-commerce**, que es el hueco de Aurore.
- **Capturas:** `capturas/basic/` — índice (`caso-case-studies-*`, 20 142 px
  escritorio / 33 307 px móvil) y dos fichas de e-commerce:
  `caso-murad-ecommerce-website-design-*` (belleza/skincare, 24 tramos) y
  `caso-harrods-luxury-ecommerce-strategy-*` (lujo/moda, 22 tramos), con sus
  `.json`
- **Arquetipo de índice:** **grilla de 2 columnas con panel de filtros fijo a
  la izquierda** (y una franja de video a todo el ancho cada varias filas)
- **Tratamiento de imagen:** fotografía de campaña del cliente en la portada ·
  **pantallas reales sin dispositivo** dentro de la ficha, sobre campos de
  color muestreados de la marca
- **Proyectos mostrados:** **54** (el propio sitio lo dice: `SHOWING (54)`)

## Veredicto de Alexander
> `no observable` — no la ha visto. Entró a la cola por búsqueda propia
> (2026-09-01) con la nota *"54 proyectos, filtros por servicio **e** industria
> (los dos ejes de Axium)"*.

**Lectura:** es la referencia que resuelve dos cosas que ninguna de las 16
anteriores resolvía: **el filtro de dos ejes con conteo** y, sobre todo, **cómo
se cuenta un caso de tienda por capítulos de comercio**. Para Aurore es la
referencia estructural; para el índice de Axium es la respuesta a P4.

## 1. Promesa y audiencia
Titular del índice: **"EASY TO UNDERSTAND. ● IMPOSSIBLE TO IGNORE."** en
grotesca negra de ~120 px, y al lado, en 18 px: *"The work we create lives at
the intersection of clarity and surprise and positions brands in culture
through shared values and ideals."*

Le habla a un **director de marketing de una marca grande** que quiere ver
nombres (Nike, Gucci, Adobe, Harrods, Patagonia, REI, Beats, KFC) y quiere
poder **filtrar por su propio rubro** antes de mirar nada. Es prestigio por
asociación, igual que brandvm, pero con una diferencia de tono: el portafolio
se presenta como **un catálogo operable**, no como un scroll.

## 2. Arquitectura del índice
**Panel fijo a la izquierda + grilla de 2 columnas a la derecha.** 20 142 px de
alto, sin paginación ni "ver más".

- El panel izquierdo ocupa ~430 px y tiene tres pestañas de texto:
  **SERVICES · INDUSTRIES · ALL WORK**, siempre visibles arriba del pliegue.
  Al elegir una, despliega **una lista de radios** (círculo vacío + etiqueta en
  mayúsculas). INDUSTRIES tiene **19 opciones**; abajo del todo, en 14 px:
  **`SHOWING` … `(54)`**.
- La grilla de la derecha: 2 columnas, imagen **vertical ~415×500** (ratio
  0.83), gutter ~20 px, con **línea horizontal fina separando cada fila**.
- Cada varias filas se rompe el ritmo con una **pieza a todo el ancho de la
  grilla**, casi siempre un **video en bucle** de la campaña del cliente.
- Móvil: una columna, 33 307 px. El panel de filtros se pliega arriba.

## 3. Ritmo y curaduría
- **54 proyectos en una sola página.** Archivo, no vitrina — pero el panel de
  filtros lo convierte en archivo **navegable**, que es lo que le faltaba a
  brandvm con 77.
- Orden: no hay "sort by". El primero es Prisoner Wine, luego Gucci Ancora,
  Tony Blair Institute… — parece curado a mano, no cronológico.
- **Medias por ficha:** las fichas de e-commerce rondan **18 000–20 500 px** de
  scroll con ~10–16 medias. Conteo exacto: `no observable` (la página
  **auto-avanza al siguiente caso** y el DOM se reemplaza antes de poder
  contarlo desde el final; ver § 9).
- **Palabras por ficha:** ~500–700, todas en bloques de 3–6 líneas. Nunca un
  muro de texto.

## 4. Anatomía de la tarjeta
De arriba abajo, sin marco ni radio:
1. **Imagen vertical a sangre** (0.83), sin radio de esquina, sin sombra. Es
   **fotografía de campaña del cliente** o un fotograma de video.
2. **Nombre del cliente** en grotesca **mayúscula**, ~28 px, peso 700.
3. **Un párrafo de 14 px en mayúsculas que empieza con el dominio**:
   `OCEANSPRAY.COM — CURATING FRESH WAYS TO DISCOVER THE BERRY, THE BRAND, AND
   THE PEOPLE BEHIND BOTH.` · `WHOOP.COM — BUILDING A SOPHISTICATED DIGITAL
   EXPERIENCE FOR A ONE-OF-A-KIND PRODUCT.` · `TEMPO.FIT — TRANSFORMING AN
   AT-HOME FITNESS BRAND'S DIGITAL LINE.`
   **El dominio como primera palabra de la descripción** es el gesto propio:
   dice "esto es una web real, andá a verla" sin necesitar un botón.
4. Nada más. Sin chips, sin año, sin botón.

Hover: `no observable`. Separación entre tarjetas: **una línea horizontal
fina**, no solo espacio.

## 5. Tratamiento de imagen

- **Qué se muestra:**
  - *En el índice*: **nunca una pantalla.** Fotografía de campaña y de producto
    del cliente — plumas azules sobre piel (Adobe), tubos de crema y texturas
    sobre celeste (Murad), desfile con estampados (Harrods), un cuerpo en
    movimiento desenfocado (Tempo).
  - *En la ficha*: **casi solo pantallas**, y casi siempre **sin dispositivo**.
    Cuatro tratamientos:
    1. **Sección enmarcada sobre campo de color de marca (R19)** — la ficha de
       producto de Harrods centrada sobre un verde salvia muestreado de la
       marca, con ~15 % de margen y sombra suave. Se lee todo: `Dior · Saddle
       Bag in Black Calfskin Leather · USD $2,275 · ADD TO CART · FAVOURITE ·
       SEND A HINT · DELIVERY & RETURNS`.
    2. **Par de móviles flotando sobre gris claro**, con marco de dispositivo
       finísimo, uno adelante y otro atrás, **acompañados de una columna de
       texto a la derecha**. Es el bloque que más se repite.
    3. **Tira larga** — la página entera capturada en `fullPage` (847×3492 y
       847×2972 en Murad, de fuentes 1200×4950 y 1200×4212) mostrada como una
       columna altísima. Es el mismo truco de Stormborn.
    4. **Mosaico de páginas sobre campo de marca (R6 frontal)** — 5 miniaturas
       de plantilla sobre rosa Murad.
  - **Espécimen tipográfico con el texto real del producto**: `BESTSELLER /
    Hydro-Dynamic™ Ultimate Moisture / NOE DISPLAY REGULAR`. El nombre de un
    producto real del catálogo, compuesto grande, con el crédito de la fuente
    debajo. **Barato y muy elegante.**
  - **Carrusel arrastrable de las láminas del entregable** (`01 /03`, con un
    disco rosa que dice `DRAG`): 9 slides de la documentación real de diseño —
    "Insight 4 · Meet users where they are", "Product Cards — Double
    Specifications", "Skin Concern — Desktop", "Image Ratio and Sizes",
    "Approachable Science", "Skin Quiz". **Enseña el documento de trabajo como
    prueba.** Ninguna referencia anterior hacía esto.
- **Soporte:** ninguno la mayor parte del tiempo. Cuando lo hay, es un móvil
  con marco de 1 px, gris, sin brillos ni sombras fotorrealistas.
- **Escenografía:** **cero.** Nada de mesas, telas ni ambientes. Todo flota
  sobre campo plano.
- **Fondo:** gris papel `#F4F4F4` con grano fino, y **campos de color
  muestreados de la marca del cliente** para las láminas (verde Harrods, rosa
  Murad, lima Murad, sage).
- **Luz:** ninguna — no hay fotografía compuesta. La única luz es la de las
  fotos de campaña del cliente, que vienen dadas.
- **Óptica:** frontal absoluta. Ni un ángulo, ni una rotación, en toda la ficha.
- **Color:** policroma por cliente, pero **encerrada**: el color del cliente
  aparece solo dentro de los campos de las láminas; el marco de la agencia es
  siempre el gris papel.
- **Consistencia — qué las unifica:** el **gris papel con grano** entre bloques
  y la **frontalidad absoluta**. Al no haber ni un ángulo ni una sombra
  fotorrealista, la ficha se lee como una presentación de consultoría — que es
  exactamente el registro que buscan.
- **Ratio y recorte:** índice 0.83 vertical fijo; ficha 16:9 (1280×720) para
  las láminas de ancho completo, vertical 630×945 para las de a dos, y alturas
  libres para las tiras largas. **No hay un ratio único.**
- **Recetas observadas (R#) y si requieren IA:** R19 (enmarcada sobre campo de
  marca) · R6 frontal (mosaico de páginas) · **tira larga** · R22 (hoja de
  sistema) · **NUEVA — R26 «carrusel arrastrable del entregable»**: las láminas
  reales del documento de diseño como slides numeradas `01/03` con affordance
  de arrastre. **Ninguna necesita IA. Ninguna.** Toda la ficha se produce con
  capturas + campos de color + tipografía.
- **Entregables que muestra y cómo trata lo no-pantalla:** web y app,
  estrategia (las láminas), dirección de arte (el espécimen tipográfico),
  campaña (video del cliente). No muestra impresos ni packaging en estas dos
  fichas.

## 6. Filtro y navegación ← **el aporte principal al índice de Axium**
**Dos ejes excluyentes, no combinables**, más un "todo":

| Eje | Cómo se presenta | Cuántas opciones |
|---|---|---|
| SERVICES | lista de radios en el panel fijo | `no observable` (no se capturó abierta) |
| INDUSTRIES | lista de radios en el panel fijo | **19** |
| ALL WORK | vuelve al catálogo completo | — |

Las 19 industrias, textuales: HEALTHCARE · BANKING FINANCE · SOFTWARE +
TECHNOLOGY · ENTERTAINMENT + GAMING · B2B + PROFESSIONAL SERVICES · **RETAIL +
ECOMMERCE** · **ECOMMERCE PLATFORM, STRATEGY, BRANDING** · FOOD + BEVERAGE ·
ENVIRONMENTAL · **BEAUTY + COSMETICS** · HOME FURNISHINGS · WEB3 · FINANCIAL
SERVICES · DESIGN ARCHITECTURE · IMMERSIVE EXPERIENCE · NON-PROFIT ·
ELECTRONICS + HARDWARE · CONSUMER CULTURE · **FASHION + APPAREL**.

Tres cosas para robar:
1. **El conteo vive abajo del panel, no en cada chip**: `SHOWING … (54)`. Un
   solo número que cambia. Resuelve P4 sin ensuciar la lista.
2. **Los ejes son pestañas excluyentes**, no filtros combinables. Con 54
   proyectos nadie necesita cruzar servicio × industria — y Axium con 33
   tampoco.
3. **Las etiquetas se componen sin espacios** en el hero de la ficha
   (`RETAIL+ECOMMERCE`, `BEAUTY+COSMETICS`): es un gesto tipográfico gratis
   que hace que la metadata se lea como sello.

Sin buscador, sin ordenamiento, sin estado en la URL (`no observable` si el
filtro cambia la URL).

## 7. Tipografía
**Una sola familia: SctoGroteskA** (Schick Toikka), pesos 300/400/700.
Escala medida: **120 · 42 · 38 · 32 · 28 · 22 · 18 · 14**.

- 120 px, 700, **mayúsculas, tracking −6 px, sin espacio entre palabras**
  (`AMERICANEXPRESS`, `HEATHCERAMICS`, `HISTORYCHANNEL`) → el nombre del
  cliente en el hero de la ficha.
- 42 px, 700, mayúsculas → los títulos de capítulo (`EXPERIENCE DESIGN`,
  `USER ENGAGEMENT`).
- 38 px, 400 → **la tesis de cada capítulo**, precedida de un **bolo negro ●**.
- 22–18 px → subtítulos y listas.
- 14 px, 700, mayúsculas → las micro-etiquetas (`PRODUCT DISCOVERY`, `PURCHASE
  FLOW`, `ART DIRECTION`, `/ UX STRATEGY`).

**Confirma P7** (una familia con rango vale tanto como una pareja) y **P3**
(dos niveles muy separados: 120 → 14, con 38 como nivel narrativo).

## 8. Color y fondo
Lienzo **gris papel `#F4F4F4` con grano**, no blanco puro — **confirma P5**.
Texto `#252422`. El color de acento de la agencia **no existe**; el único color
saturado de toda la página es el de cada cliente, y aparece **solo** en dos
sitios: el campo del hero de su ficha (lima Murad `#D8F27A`ish, verde Harrods
`#3C4A3C`ish) y los campos de las láminas. **Confirma P12** llevado al extremo:
cero acentos propios.

## 9. Movimiento
- **0 videos `<video>` en las fichas**; los videos están en el índice.
- **La ficha auto-avanza al siguiente caso al llegar al final** — verificado:
  la URL cambió de `murad-…` a `heath-ceramics-…` en el tramo 24, y de
  `harrods-…` a `history-channel-…` en el tramo 22. **Antipatrón A4 de
  `PATRONES.md`, confirmado por tercera vez** (locomotive, heartbeat, BASIC).
  Y encima rompe la captura: obliga a parar el scroll al detectar el cambio.
- El carrusel de láminas es **arrastrable** con un cursor personalizado
  (`DRAG` en un disco rosa).
- Las micro-etiquetas y los titulares tienen un fade de entrada suave
  (visible a medio opacar en varios tramos).

## 10. Prueba y credibilidad
- En el índice: **los nombres** (Nike, Gucci, Adobe, Patagonia, REI, Harrods,
  Beats, Snapchat, Riot Games) y **el dominio** en cada descripción.
- En la ficha: **ninguna métrica**. Ni en Murad ni en Harrods hay un porcentaje
  ni una cifra de conversión. La prueba es la **lista de disciplinas** apilada
  bajo el titular (`DIGITAL STRATEGY / EXPERIENCE STRATEGY / CONTENT STRATEGY /
  CREATIVE DIRECTION / UI/UX DESIGN / ART DIRECTION`) y **el botón
  `VIEW LIVE SITE ↗`** en píldora con borde.
- Harrods se declara explícitamente **conceptual**: *"harrods.com — A conceptual
  vision for the future of online luxury retail"*. Publican trabajo especulativo
  y lo dicen. Honestidad útil.

## 11. Ficha del caso y transición ← **la plantilla que importa para Aurore**

Estructura medida (Murad 20 400 px, Harrods 18 600 px):

| # | Bloque | Qué es |
|---|---|---|
| 1 | **Hero** | Nombre del cliente a 120 px mayúsculas **sobre un campo del color de la marca** (lima para Murad, verde inglés para Harrods) + `PROJECT FOCUS` + las etiquetas de industria pegadas (`BEAUTY+COSMETICS, RETAIL+ECOMMERCE`) |
| 2 | **Foto de apertura a sangre** | Macro de producto (tubos y texturas de Murad) o editorial de moda (Harrods). **Es del cliente, no del estudio.** |
| 3 | **Intro** | Titular que empieza por **el dominio**: *"harrods.com — A conceptual vision for the future of online luxury retail."* + la lista de disciplinas apilada + `VIEW LIVE SITE ↗` · a la derecha, **CHALLENGE** y **APPROACH** como micro-etiquetas con 2 párrafos cada una |
| 4 | **EXPERIENCE DESIGN** `/ UX STRATEGY` | Título 42 px a la izquierda, tesis de 38 px con bolo ● a la derecha. *"We helped Murad craft an experience strategy built around three key objectives: facilitating product discovery, improving product and brand education, and enriching the customer journey."* |
| 5– | **Los capítulos de comercio** | Cada uno: micro-etiqueta 14 px + titular 32 px + 1–2 párrafos de 18 px en columna estrecha a la izquierda, y **las pantallas de ese momento** a la derecha |
| n | **Carrusel de láminas** | El entregable real, arrastrable, numerado `01/03` |
| n+1 | **Cierre** | **Auto-avance al siguiente caso** — no hay "next project" clicable ni CTA de contacto |

**Los capítulos de comercio, textuales (Murad):**

| Micro-etiqueta | Titular | Qué enseña |
|---|---|---|
| `NAVIGATION & CATEGORIZATION` | *Guiding navigation and facilitating product discovery.* | **La tira larga de la página de categoría.** El texto dice: *"Through research, we determined three categories of user intent: visiting the site to replenish a product they already own, visiting the site to address a current skin issue, or just browsing."* |
| `PRODUCT DISCOVERY` | *A customer experience based on browsing behavior and intent.* | El **panel de filtros "Refine"** (Sort By, Skin Concern, Skin Type, Ingredients) al lado de la página de categoría |
| `PRODUCT EDUCATION` | *Encouraging product consideration and providing guidance to users.* | El quiz de tipo de piel |
| `PURCHASE FLOW` | *Driving conversion through utility and education.* | **La ficha de producto** con sus pestañas (Details / Ingredients / Tips / Results) y el bloque "Combinations to Achieve the Best" con precios |
| `USER ENGAGEMENT` `/ CONTENT STRATEGY` | *Baseline design principles are essential to any user experience, but stories, perspectives, and content give it meaning.* | El mosaico de plantillas sobre rosa |
| `CONTENT & COMMERCE` | *Leveraging promotions as part of the brand narrative.* | Los módulos de promoción (`REVITALIXER SALE · 25 % Off Your New Nightime Routine`) |
| `BRAND STORYTELLING` | *Telling the brand story by revisiting Murad's origins.* | Las páginas editoriales |
| `ART DIRECTION` | *Humanizing the brand by refreshing its art direction.* | **El espécimen tipográfico** + la fotografía nueva |

Harrods usa los mismos nombres de capítulo (`EXPERIENCE DESIGN`,
`USER ENGAGEMENT` — *"Building value with a richer experience. Impulse is the
driving force behind extravagant purchases…"*) con las pantallas de su tienda.

**Es una taxonomía reutilizable**: un caso de tienda se cuenta como
**descubrimiento → filtrado → educación → compra → contenido → promoción →
marca**, y cada paso trae su pantalla.

## 11b. Estilo (fila para ESTILO.md)
- **Paleta (lienzo / texto / acentos, hex):** lienzo `#F4F4F4` (gris papel con
  grano); texto `#252422` / `#D5D4D4` sobre oscuro; **sin acento de agencia**;
  campos de marca por caso (lima Murad, `rgb(38,33,27)` y verde inglés Harrods,
  sage `#A3AE93`ish para enmarcar).
- **Tipografía (display / cuerpo / escala px / gesto):** **SctoGroteskA** sola,
  300/400/700 · **120 · 42 · 38 · 32 · 28 · 22 · 18 · 14** · **gesto: el nombre
  del cliente en mayúsculas sin espacios entre palabras y tracking −6 px, y un
  bolo negro ● delante de cada tesis.**
- **Hero (fondo / titular / meta / acción / altura):** campo plano del color de
  la marca · nombre 120 px mayúsculas centrado · `PROJECT FOCUS` + industrias
  pegadas, centradas, 14 px · sin acción (la acción `VIEW LIVE SITE ↗` va en el
  bloque 3) · ~900 px.
- **CTA (texto / fondo / radio / padding):** `VIEW LIVE SITE ↗` · transparente
  con borde 1 px · píldora · ~12×20. El cierre de página **no tiene CTA**.
- **Movimiento (opacity-0 / librería / videos):** fades de entrada suaves ·
  `no observable` la librería · **0 videos en la ficha**, varios en el índice ·
  **auto-avance al siguiente caso**.

## 12. Firma y transferencia
- **La firma en una frase:** el nombre del cliente tapa la pantalla a 120 px
  sin un solo espacio entre palabras, sobre el color exacto de su marca — y a
  partir de ahí la agencia desaparece: gris papel, una sola tipografía, cero
  acento propio, y el trabajo se cuenta capítulo por capítulo con la pantalla
  que lo demuestra al lado.
- **Qué robar (y de qué capa):**
  - *Arquitectura del índice*: **el panel fijo con SERVICIOS / INDUSTRIAS /
    TODO y un único `MOSTRANDO (33)` abajo.** Resuelve de una vez el problema
    de los 3 ejes y las 15 industrias de Axium (P4 + T7).
  - *Tarjeta*: **el dominio como primera palabra de la descripción**
    (`aurore.com.pe — …`). Axium tiene `liveUrl` en 30 de 33 y no lo usa.
  - *Ficha*: **la taxonomía de capítulos de comercio** (descubrimiento →
    filtrado → educación → compra → contenido → promoción → marca). Es la
    aportación concreta para Aurore.
  - *Ficha*: **micro-etiqueta + titular que es la frase + pantalla del momento**
    — encaja exactamente con el componente `Capitulo` que ya existe en
    `AnjsportsContent.tsx`.
  - *Imagen*: **R19 sobre campo de color de marca** con márgenes generosos, y
    **R26**, el carrusel arrastrable de las láminas del entregable.
  - *Tipografía*: el **bolo ● delante de la tesis** y las etiquetas pegadas sin
    espacios.
- **Qué NO sirve para Axium y por qué:**
  - **El auto-avance al siguiente caso** — antipatrón A4 ya decidido; además
    rompe el "← nombre →" que Axium tomó de isadora (S24).
  - **Cerrar sin CTA.** BASIC puede permitírselo porque a ellos los buscan;
    Axium vende.
  - **Fotografía de campaña del cliente como portada del índice.** Murad y
    Harrods tienen banco de imagen de marca. De los 33 de Axium, casi ninguno.
    Para Aurore *hay* material — pero es fotografía de las casas que revende,
    no suya.
  - **19 industrias.** Es el mismo error que Axium ya tiene con 15 para 33
    proyectos; BASIC se lo puede permitir con 54 y marcas famosas. El aprendizaje
    es el **panel y el conteo**, no la granularidad.

## Aplicabilidad a Axium
- ¿Escala a 33 proyectos? **Sí, y mejor que ninguna otra** — el panel de
  filtros hace que 33 se sientan navegables en vez de largos.
- ¿Depende de assets que no tenemos? **Casi nada.** Toda la ficha se compone de
  capturas, campos de color y tipografía. **Cero IA, cero fotografía de
  producción.** Es, con diferencia, la referencia **más barata de producir** de
  las 19 analizadas — y a la vez la más rica en estructura.
- ¿Se apoya en marcas reconocibles? **Sí, mucho** en el índice; **no** en la
  ficha, que funcionaría igual con un cliente desconocido.
- **Capa transferible:** arquitectura (índice **y** ficha), tarjeta,
  tipografía, imagen. **La referencia más transferible hasta ahora.**
