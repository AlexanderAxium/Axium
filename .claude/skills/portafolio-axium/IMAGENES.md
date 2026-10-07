# Imágenes — la doctrina, las recetas y la anatomía del prompt

El encargo pide imágenes profesionales para los 33 proyectos. **No pide
necesariamente imágenes generadas con IA.** Alexander lo dijo explícito el
2026-09-01: *"no necesariamente quiero prompts generados con IA, pueden ser
ediciones simples como un degradado y una captura de pantalla bordeada, etc.,
pero por lo general sí querré ediciones bien hechas"*. Y aceptó pipelines de dos
pasos: *"primero generamos el fondo con un prompt y sobre eso luego metemos otro
prompt para completar la edición"*.

Eso cambia el entregable. No es una lista de prompts: es una **librería de
recetas de composición**, donde cada receta dice qué capas tiene, cuáles se
editan a mano, cuáles se generan, y en qué orden. El prompt es un ingrediente,
no el plato.

---

## Regla fundacional: la UI no se inventa, se compone

Un modelo de imagen que "genera la web de Clefast" produce una web que no existe:
texto ilegible, un logotipo inventado, productos que Clefast no vende. Eso es una
mentira sobre trabajo que Axium sí hizo de verdad — y además se nota, porque la
interfaz generada por IA tiene una textura inconfundible.

**Entonces toda portada tiene capas, y la interfaz siempre es real:**

| Capa | Qué es | De dónde sale |
|---|---|---|
| **Fondo** | Campo de color, degradado, textura, foto con velo, marca fantasma | Edición (Figma/Photoshop/CSS) **o** IA — es la capa donde la IA sí rinde |
| **Soporte** | El dispositivo o la tarjeta redondeada que sostiene la UI | Mockup real (plantilla) **o** IA con hueco plano |
| **Interfaz** | La captura del sitio en vivo, a 2x | Playwright sobre `liveUrl`. **Nunca IA** |
| **Acabado** | Sombra, radio de esquina, recorte, sangrado, viñeta | Edición |

La misma lógica que en `creator/REDISENO.md`: el logotipo del cliente no se
rediseña, se usa el real. Acá se extiende: **la interfaz del cliente tampoco.**

**Verificación que no se salta:** abrir la imagen final y leer el texto de la
interfaz. Si alguna palabra no coincide con el sitio real, la imagen se descarta.
Una sola portada con texto alucinado contamina la credibilidad de las 33.

### Antes de componer nada: recapturar

Las portadas actuales son `.jpg` y `.png` de distintas épocas y calidades (ver
`inventario.mjs`: 9 críticas, 30 pesadas). Escenografiar una captura vieja de
baja resolución produce una imagen cara que se ve mal igual. El orden es:

1. Recapturar con Playwright. **El MCP no expone `deviceScaleFactor`**, así que
   la forma de conseguir resolución de composición es **poner el viewport en
   2880×1800** y capturar: se obtienen 2880 px reales de ancho y el layout de
   los sitios modernos aguanta (verificado en anjsports.com). Viewport limpio,
   sin banners de cookies ni estados de carga. Capturar **también secciones
   sueltas** (hero, grilla de productos, un formulario) — las recetas de abajo
   usan recortes, no solo el home completo.
2. Elegir la receta según lo que el proyecto tiene (ver tabla de decisión).
3. Recién ahí, componer.

Si el sitio ya no existe (`feedback-management`, `financial-management`,
`store-saas` no tienen `liveUrl`), la captura vieja es la única evidencia real:
se usa esa y se anota la limitación. No se reconstruye de memoria.

---

## Lo que enseñó la primera referencia (brandvm / Flipp)

Se miraron las 8 imágenes del caso a resolución completa (4000×2000). Lo que
hace que se vean profesionales **no es ningún efecto** — son cinco decisiones
que se repiten en todas:

1. **Un solo formato.** Las 8 miden exactamente 4000×2000 (2:1). Ni una
   excepción. La consistencia empieza por el lienzo, antes que por el estilo.
2. **El fondo es siempre el color de marca del cliente**, en una de cuatro
   variantes: plano saturado / tinte muy claro (~8%) / foto del cliente con velo
   oscuro + logo blanco centrado / plano con **la marca fantasma** (el wordmark
   escalado enorme, un tono más claro que el fondo, recortado por los bordes,
   detrás de los dispositivos).
3. **La interfaz nunca aparece cruda ni completa.** Siempre está: dentro de un
   dispositivo fotorrealista con sombra de contacto, o como **tarjeta con
   esquinas redondeadas y sombra suave**, o **recortada por el borde del
   lienzo** — nada está entero dentro del cuadro. Ese sangrado es lo que la hace
   editorial en vez de "captura pegada".
4. **Esquinas redondeadas en la imagen misma** (~24px a 4000 de ancho), para que
   se asiente como tarjeta sobre el blanco de la página. El radio lo trae la
   imagen, no el CSS.
5. **Se reutiliza el material del cliente**: la foto de la mujer en el
   supermercado aparece en el hero *y* en la composición dividida. Los props
   son del cliente, no de stock.

Y en el índice (77 proyectos), el mecanismo de unificación es otro pero
igualmente simple: **cada imagen tiene la paleta de su cliente** (la grilla es
policroma), y lo que las hermana es que **ninguna es una captura cruda** — todas
son composiciones terminadas con el mismo radio de esquina y el mismo ratio por
ranura. Foto de producto, collage de marca sobre negro, logo sobre textura,
laptop sobre tela roja: conviven porque todas están *terminadas*.

---

## Tipos de proyecto — la taxonomía de entregables

Alexander lo remarcó el 2026-09-01: *"hay varios tipos de proyectos. web, móvil,
web y branding, brochure solo, manual de marca solo, branding completo con web,
solo redes sociales, etc. Muchas combinaciones y tu skill debe poder hacerlo
todo."*

Los JSON de hoy **no tienen ese dato limpio**: `services` mezcla entregables
("Manual de Marca", "Brochure digital", "Redes sociales") con funcionalidades
("Checkout", "Contacto WhatsApp"), y `platform` es inconsistente ("Web y
Brochure", "Web + Sistema", "Backend / Pipeline"). Así que la skill define la
taxonomía, y la propuesta de estructura tiene que agregar el campo al JSON
(`deliverables: [...]`) para que la receta de imagen y los filtros salgan del
dato y no de una lista a mano.

| Entregable | Qué es la "interfaz real" | Cómo se captura | Recetas naturales |
|---|---|---|---|
| **web** | Sitio en vivo | Playwright 2x, home + secciones | R2, R3, R5, R6, R8 |
| **app-movil** | Pantallas de la app | Capturas del dispositivo o del emulador | R2 (móviles), R5, R6 vertical |
| **saas / dashboard** | La aplicación autenticada | Captura con datos de demo, nunca datos reales de clientes | R4 (componentes: métricas, tablas), R7, R8 |
| **branding** | Logo, paleta, tipografía, aplicaciones | Export vectorial desde el archivo fuente | R9, R10, R1, R2 (marca fantasma) |
| **manual-de-marca** | Las páginas del manual | Export PDF → PNG por página | **R11** |
| **brochure** | Las páginas / el impreso | Export PDF → PNG, o foto del impreso real | **R11**, **R12** |
| **redes-sociales** | Los posts y stories publicados | Export de las piezas, o captura del perfil | **R13** |
| **e-learning** | La plataforma + el contenido | Playwright + capturas de un curso | R5, R6, R8 |
| **backend / sin UI** | No hay pantalla | No hay nada que capturar | **R14** — es el caso límite |

Un proyecto puede tener varios. `maintech` = branding + manual-de-marca + web +
e-learning + app-movil; `transportesrumi` = web + brochure; `web-scraping-ai` =
backend y nada más. **La portada del índice muestra el entregable principal; la
ficha muestra los demás** — el índice no puede contar cinco cosas en una imagen.

La regla fundacional se extiende sin cambios: **las páginas de un brochure, un
manual de marca o un post de Instagram tampoco se inventan.** Son entregables
reales de Axium con archivo fuente; se exportan, no se generan. Lo que la IA
puede hacer es la superficie donde se apoyan (la mesa, el papel, el móvil).

## Recetas de composición

Cada receta es una pila de capas. Se elige por lo que el proyecto **tiene**, no
por gusto: un proyecto con una sola captura del home no puede usar la R6.

| # | Receta | Capas (de abajo arriba) | ¿Necesita IA? | Vista en |
|---|---|---|---|---|
| **R1** | **Hero con velo** | Foto del cliente → velo oscuro 50–60% → logo blanco centrado | No | brandvm (Flipp hero) |
| **R2** | **Marca fantasma + dispositivos** | Plano color de marca → wordmark gigante al 15% más claro, recortado → 1–2 móviles fotorrealistas en ligero giro, sombra de contacto | Mockup: plantilla o IA con hueco | brandvm (img-02) |
| **R3** | **División UI / foto** | Mitad izquierda: captura del home como tarjeta redondeada sobre plano de marca, sangrando abajo y a la derecha · Mitad derecha: foto del cliente | No | brandvm (img-04) |
| **R4** | **Mosaico de componentes** | Blanco o tinte → 8–10 componentes de la UI recortados (tarjetas, métricas, botones) en grilla regular con radio idéntico | No | brandvm (img-05) |
| **R5** | **Carrusel con foco** | Tinte claro → 3 tarjetas de la UI, la central al 115%, las laterales sangrando por los bordes, sombra suave | No | brandvm (img-06) |
| **R6** | **Mosaico inclinado** | Plano de marca → 8–12 pantallas completas con radio y sombra, rotadas ~-15°, en tres columnas, sangrando por los cuatro bordes | No | brandvm (img-08) |
| **R7** | **Comparación** | Dos tarjetas redondeadas lado a lado (antes/después, desktop/móvil, mapa de calor) | No | brandvm (flipp-wide) |
| **R8** | **Dispositivo en escenografía** | Fondo fotográfico o generado con textura (tela, superficie) → laptop/móvil con la UI, luz coherente con el fondo | Sí, el fondo — es donde un prompt aporta | brandvm índice (Pomp sobre tela roja) |
| **R9** | **Collage de marca sobre negro** | Negro → piezas de identidad (tarjetas, logo, fotos B/N) en pila irregular con sombras | No | brandvm índice (Roncelli) |
| **R10** | **Logo sobre textura** | Textura o degradado generado en colores de marca → logotipo centrado | Sí, la textura | brandvm índice (Safeway) |
| **R11** | **Abanico de páginas** | Plano de marca → 3–5 páginas del PDF (manual o brochure) como tarjetas con radio y sombra, en abanico o escalonadas, sangrando | No | *hipótesis — ninguna referencia aún* |
| **R12** | **Impreso sobre superficie** | Fondo de superficie (papel, madera, mármol) generado o fotografiado → el brochure impreso plegado, luz coherente | Sí, la superficie | *hipótesis* |
| **R13** | **Feed en dispositivo** | Plano de marca → un móvil con el perfil real + 4–6 posts como tarjetas sueltas alrededor, o grilla 3×3 de posts con radio | Mockup | *hipótesis* |
| **R14** | **Diagrama del sistema** | Plano oscuro → esquema de la arquitectura (cajas, flechas, logos de las tecnologías reales) compuesto a mano, o terminal con salida real | No | *hipótesis — para lo que no tiene pantalla* |
| **R15** | **Foto del branding aplicado** | Fotografía real del entregable en el mundo: vehículo, valla, lona, botella, papelería | No — pero hay que tener la foto | magnetic (tráiler, valla) |
| **R16** | **Foto/video editorial a sangre** | Imagen de producción sin marco ni tarjeta, cortada por la retícula | No — material de alta producción | locomotive |
| **R17** | **Ventana de navegador** | Marco de Safari/Chrome realista (barra de URL con el dominio real) → captura dentro → fondo plano oscuro o de marca | No | undersight |
| **R18** | **Recorte macro del dispositivo** | Campo plano de color de marca → móvil tan cerca que solo entra ⅓ de la pantalla, en ángulo, sangrando por 2–3 bordes | Mockup | undersight (índice) — **la más barata con más impacto** |
| **R19** | **Sección enmarcada** | Campo neutro → **una sección real del sitio** exportada a 2x, centrada en una tarjeta con radio grande (~40px a 4000 de ancho) y 15–20 % de margen. Sin dispositivo, sin navegador | No | heartbeat — **la más directa para la ficha** |
| **R20** | **Sección a sangre ("blend")** | La sección real exportada tal cual, a ancho de columna, **sin tarjeta ni marco**: el fondo de la sección se funde con el de la página. Funciona si el fondo de la sección y el de la ficha son del mismo tono | No | fiddle (open-call-ai) — lo que Alexander llamó "aterrizable" |
| **R21** | **Móviles escalonados sobre glow de marca** | Campo oscuro → **glow radial** del color de marca (degradado suave, una sola fuente) → 2–3 capturas móviles verticales escalonadas en diagonal, sin dispositivo o con marco mínimo | El glow: CSS/Figma o un prompt de fondo | fiddle (8_narrow) — R6 en vertical y con luz |
| **R22** | **Hoja de iconos / sistema** | Campo claro → los iconos, componentes o colores del sistema de diseño dispuestos en grilla suelta | No | fiddle (7_narrow); Axium ya tiene `case-color-palette` y `case-feature-showcase` |
| **R23** | **Mosaico de momentos** | Campo del color de marca → grilla regular (4×4, 3×3) de celdas 3:4 con **una pieza distinta cada una**: producto, paisaje, móvil, tipografía, retrato, logo. La síntesis del proyecto en una imagen — el equivalente estático de un video de marca | No | adelt (farm-09) — y **Alexander lo llamó "buenos mockups"** |
| **R24** | **Panel + columna** (layout de ficha, no imagen) | Panel fijo con la metadata a la izquierda; columna de imágenes de ancho fijo con radio a la derecha, alturas libres | — | adelt; parientes: undersight (ancho+radio fijos), fiddle (retícula de metadata) |
| **R25** | **Hero de producto a plena altura** | Patrón o color de la marca ampliado y desenfocado → **el producto real ocupando todo el alto del cuadro**, centrado, con sombra de estudio → dos frases de la propia marca fantasmeadas a izquierda y derecha | El fondo, opcional | brandvm-retail (Beanie Coffee) — **la portada natural de un frasco de perfume** |
| **R26** | **Carrusel arrastrable del entregable** | Campo de color de marca → las láminas reales del documento de diseño como slides con radio, numeradas `01/03`, con cursor `DRAG` | No | BASIC (Murad) — enseña el documento de trabajo como prueba |
| **R27** | **Marquesina de capturas crudas sobre oscuro** | Campo oscuro uniforme → 2–3 hileras de capturas **reales, sin marco ni dispositivo**, todas del mismo tamaño y con radio, desplazándose en direcciones opuestas; la de móvil inclinada ~−15°, la de escritorio frontal | No — Playwright + CSS | BAO (Omorovicza, Haeckels) — **18 pantallas al costo de una tarde; la más rentable de la biblioteca** |

> **Corrección de doctrina (2026-09-29, tanda de e-commerce).** «Ninguna
> captura cruda» es una regla **del índice**, no de la ficha. Dentro del caso,
> By Association Only enseña 18 capturas crudas en marquesina (R27) y se lee
> mejor que cualquier composición, porque **lo que vende una tienda es que se
> lea el botón**. La consecuencia de costo es grande: el techo de 6–9 medias
> por ficha (A2) aplica a imágenes *compuestas*; una marquesina de capturas no
> cuenta contra ese presupuesto.

**R1–R10 salen de una sola referencia; R11–R14 son hipótesis para los
entregables que brandvm no muestra.** Es la lista de partida, no la final: cada
referencia nueva confirma, mata o agrega recetas. Buscar a propósito referencias
que muestren impresos, manuales y redes — sin eso, esas cuatro quedan sin
evidencia. Cuando una
referencia use una composición que no está acá, agregarla con su número.

### Tabla de decisión — qué receta para qué proyecto

Primero el entregable principal (tabla de arriba), después lo que el proyecto
**tiene** como material:

| El proyecto tiene… | Recetas viables |
|---|---|
| Web con una sola captura del home | R2, R3 (si hay foto), R8, R10 (si hay logo limpio) |
| Web con varias pantallas / secciones | R4, R5, R6 — las más ricas |
| Foto propia del cliente | R1, R3, R8 |
| Branding hecho por Axium | R9, R10, R1, R2 con marca fantasma |
| Manual de marca o brochure en PDF | R11; R12 si hay foto del impreso |
| Redes sociales | R13 |
| SaaS / dashboard | R4 con métricas y tablas, R7, R8 |
| Backend sin pantalla | R14 |
| SaaS interno sin `liveUrl` | R2 o R8 con la captura vieja; anotar la limitación |
| Combinación (web + branding, web + brochure…) | Portada: la receta del entregable principal. Ficha: una imagen por entregable |

---

## Anatomía del prompt: nueve slots

Cuando una receta **sí** usa IA (el fondo de R8, la textura de R10, el mockup
con hueco de R2), el prompt no es una frase bonita: es una estructura fija donde
solo cambian algunas variables. Si cada prompt se escribe libre, salen 33 fondos
que no se parecen entre sí — y la grilla vuelve a verse como carpeta de archivos.

| # | Slot | Qué define | ¿Constante o variable? |
|---|---|---|---|
| 1 | **Encuadre** | Plano, distancia, qué entra en cuadro | Constante |
| 2 | **Sujeto y soporte** | Qué sostiene la interfaz (o hueco plano si se compone después) | Variable por tipo de proyecto |
| 3 | **Escenografía y props** | Qué acompaña, del rubro del cliente | Variable por proyecto |
| 4 | **Superficie y fondo** | Sobre qué apoya, qué hay detrás | Constante en forma, variable en color |
| 5 | **Luz** | Dureza, dirección, temperatura, sombras | Constante ← *el unificador más fuerte* |
| 6 | **Materialidad** | Acabados, texturas, reflejos | Constante |
| 7 | **Paleta** | Colores dominantes y de acento | **Variable: el color del cliente**, aprendido de brandvm |
| 8 | **Óptica** | Distancia focal, profundidad de campo, perspectiva | Constante |
| 9 | **Formato y negativos** | Ratio, resolución, lo prohibido | Constante |

**La luz (5) es lo que más unifica.** Dos imágenes con sujetos y colores
distintos pero la misma dirección, dureza y temperatura de luz se leen como la
misma sesión de fotos. Si hay que sacrificar consistencia en algún slot, que no
sea en este.

### El pipeline de dos prompts

Alexander lo propuso y brandvm lo confirma como estructura natural:

```
PASO 1 — FONDO         prompt de fondo (slots 1, 4, 5, 6, 7, 8, 9) → imagen sin sujeto
PASO 2 — SOPORTE       (a) mockup real de plantilla, o
                       (b) prompt de edición sobre el fondo: "add a laptop at 3/4 angle,
                           screen flat green, matching the existing light" (slots 2, 3)
PASO 3 — INTERFAZ      compositar la captura real en el hueco (perspectiva + máscara)
PASO 4 — ACABADO       radio de esquina, sombra, recorte al ratio final, export WebP
```

El paso 3 es el que nunca se le da a la IA. El 2b es opcional: para la mayoría
de los 33, una plantilla de mockup da mejor resultado y cero alucinación.

---

## Bloque maestro — borrador de partida

**Sale de los tokens de Axium y de una sola referencia. Se reescribe en
`PROPUESTA-IMAGENES.md` con lo que enseñen las siguientes.**

Aplica a los prompts de **fondo** (paso 1). Lo que cambió con brandvm: el color
dominante ya no es fijo de Axium — **es el del cliente**; Axium unifica por luz,
óptica, radio y formato, no por paleta.

```
[LUZ] Soft directional key light from the upper left, large diffused source,
gentle falloff, one soft contact shadow zone prepared beneath center, no hard
specular hotspots, neutral daylight temperature (~5200K).

[FONDO] Seamless matte field in {COLOR_MARCA_CLIENTE}, subtle paper-like grain,
very slight vignette toward the edges, no gradient banding, no horizon line.
Optional: the client's wordmark as a ghosted shape 12–15% lighter than the field,
scaled far beyond the frame, cropped by the edges.

[MATERIALIDAD] Matte finishes, fine microtexture, no glossy plastic, no chrome.

[ÓPTICA] 50mm equivalent, eye-level, slight three-quarter angle, shallow but
controlled depth of field — the center plane fully sharp.

[FORMATO] {RATIO_TARJETA}, high resolution, clean commercial product
photography, editorial restraint.
```

**Ojo con el ratio.** `{RATIO_TARJETA}` es hoy 4:3 por `aspect-[4/3]` en
`portfolio-page-content.tsx`, pero las 33 portadas actuales son 3:2 y brandvm
usa 2:1 en la ficha y dos ratios en el índice (2.49 ancho / 1.42 medio). Si la
propuesta de estructura cambia el ratio, **las 33 imágenes cambian**. Por eso la
estructura se entrega antes que las imágenes.

---

## Negativos

Van en todos los prompts de fondo y de soporte. La mitad son de calidad y la
otra mitad son de honestidad.

```
no text, no lettering, no typography, no logos, no brand marks (unless the ghost
wordmark is supplied as an input image), no user interface elements, no buttons,
no icons, no screen content (screen stays flat green / untouched), no watermark,
no signature, no hands, no people, no lens flare, no bokeh light orbs, no generic
purple-blue tech gradient, no floating 3D geometric shapes, no stock-photo
office, no motion blur, no HDR halos, no banding, no oversaturation, no tilted
horizon
```

`no text` y `no screen content` sostienen la regla fundacional. `no generic
purple-blue tech gradient` y `no floating 3D geometric shapes` impiden que las 33
terminen pareciéndose a la portada de cualquier SaaS del mundo — que es hacia
donde se va todo modelo de imagen si nadie lo frena.

---

## Variables por proyecto

Se tabulan para los 33 desde `src/data/cases/*.json`:

| Variable | De dónde sale | Ejemplo |
|---|---|---|
| Receta | tabla de decisión + `inventario.mjs` | huarmis (3 assets, foto de equipo) → R3 |
| Color de marca | **muestreado de la captura real**, no de memoria | — |
| Wordmark | logo real del cliente, en SVG si existe | para la marca fantasma de R2 |
| Sector / props | `industry` | perfumería → frascos, papel de seda (solo R8) |
| Soporte | `platform` | "Web & Mobile" → laptop + móvil |
| Secciones capturables | recorrer el sitio en vivo | hero, catálogo, formulario |

---

## Herramienta de generación: OpenAI (decidido 2026-10-01)

Alexander: *«ya dejaremos de usar higgsfield, no me parece muy bueno... necesito
que tus imágenes generadas con openAI sean súper profesionales, más que nada para
webs, SaaS, etc.»*

Modelos: **`gpt-image-2.5-flare`** para el día a día y **`gpt-image-2.5-sunburst`**
cuando mande la precisión de edición. Calidad hasta `max`. Medidas **a WIDTHxHEIGHT
libre, en múltiplos de 16, hasta 3840 px por lado** — o sea que las piezas se
generan **a su medida final exacta** (2800×1400 las anchas, 1600×1600 las de par)
y no se reencuadra ni se amplía nada. Fondo transparente nativo y endpoint de
edición con máscara.

---

### Las tres limitaciones que OpenAI documenta — y que justifican nuestras reglas

Esto no es criterio nuestro: lo dice su propia documentación. Y cada una
**confirma por separado** una regla que ya teníamos.

| Lo que dicen sus docs | La regla que ya seguíamos |
|---|---|
| *«el modelo todavía puede tener problemas con la colocación y la claridad precisas del texto»* | **La interfaz jamás se genera.** No es una regla de honradez solamente: es que el modelo **no sabe** escribir texto fiable. Nada de rótulos, etiquetas, menús ni cifras generados |
| *«puede tener dificultad para colocar elementos con precisión en composiciones estructuradas o sensibles al layout»* | **Se genera el escenario VACÍO y se compone encima.** Nunca se le pide que coloque la pantalla, el teléfono y el objeto en su sitio: eso lo hace el compositor, donde la posición es exacta y medible |
| *«puede costarle mantener la consistencia visual de personajes o elementos de marca recurrentes entre generaciones»* | **El logotipo del cliente nunca se dibuja.** Se compone el archivo real. Y una serie de piezas no se fía de que el modelo repita el mismo mundo: el campo se fija en CSS |

**Conclusión operativa:** el modelo sirve para **materia, luz y espacio**. Para
nada que lleve significado.

---

### Lo que estos modelos sí hacen bien: especificación estructurada

Su propio recetario muestra que responden mejor a una **especificación por
categorías** que a una frase bonita. El esqueleto que vamos a usar:

```
ESCENA        qué superficie y qué espacio, sin un solo objeto encima
MATERIA       de qué está hecha la superficie: veta, grano, poro, trama, desgaste
LUZ           una sola fuente, de dónde viene, dura o difusa, y la caída
CÁMARA        altura, distancia, lente equivalente, FOCO PROFUNDO
PALETA        los hex reales de la marca del cliente
PROFUNDIDAD   qué hay detrás y a cuánto, fuera de foco por distancia, no por bokeh
VACÍO         «la superficie está completamente vacía; no hay objetos, ni
              dispositivos, ni papeles, ni texto, ni logotipos en ninguna parte»
```

El último slot es el más importante y el que más veces hay que repetir. Un
escenario con un portátil ya dibujado no sirve: encima va **nuestra captura real**.

---

### El cambio de método que permite la edición con máscara

Es la mejora grande frente a lo que hacíamos, y va en la dirección de nuestra
regla fundacional:

**Antes (Higgsfield):** generar una escena con una pantalla verde → enmascarar el
verde → deformar la captura por perspectiva → componer. Cuatro pasos, y el recorte
fallaba (en Clefast costó tres intentos sacar un alfa limpio).

**Ahora:** se le da **nuestra captura real** más una **máscara que la protege**, y
el modelo construye **la habitación alrededor**. La interfaz no se toca por
construcción, no por disciplina.

⚠️ **La regla no obvia, de su documentación:** con máscara, **el prompt describe la
imagen entera resultante, no solo la zona que se edita**. Describir únicamente el
fondo da resultados incoherentes.

Y: **si se pide fondo transparente en el prompt, se activa solo.** Para recortes de
objeto, pedirlo en texto en vez de pelearse con un umbral.

---

### Lo nuestro que sigue valiendo, y está medido

Nada de esto cambia de proveedor:

- **Foco profundo y cámara lejana.** El bokeh no esconde fallos: **los fabrica**.
  Al pedir desenfoque el modelo rellena con formas plausibles e incoherentes. Es lo
  que hundió dos vueltas de la portada de Rematch.
- **Varias variantes y elegir mirándolas a 1:1.** Apostar a un solo tiro ya salió
  mal dos veces.
- **El atrezo pertenece al oficio del cliente.** Pala de pádel → pelotas de pádel.
  Y si hay que rotular el atrezo para que se entienda, la escena no funciona: una
  foto profesional no subtitula sus objetos.
- **Nada puede brillar más que el sujeto**, y el sujeto se compone después: así que
  la escena se genera con **la zona del sujeto más apagada que el resto**.
- **La escena se juzga bajo el velo de la tarjeta** si va a ser portada (§7 bis del
  estándar): lo luminoso arriba, lo oscuro abajo.
- **Las cinco preguntas de la novena generación de `COMPOSITOR.md`** se contestan
  antes de escribir el prompt, no después de ver el resultado.

---

### Disciplina de coste

Su tarifa por imagen es **sensiblemente más alta** que la de Higgsfield, así que:
**consultar el precio antes de cada tanda, registrar lo gastado, y nunca calcular
el saldo restando de un número recordado.** Así se pasó de creer que quedaban 664
créditos a descubrir que quedaban 0,77.

Pocas generaciones y buenas. Y antes de generar nada, la pregunta del §0 del
estándar: **¿esta pieza se puede hacer con HTML y Playwright?** Las tres mejores
del portafolio —la lámina del EA de Feniz, su diagrama y la losa partida de
Clefast— costaron cero.

---

### Al escenario hay que ponerle la CÁMARA (primera tanda con OpenAI, 2026-10-01)

El primer suelo generado para Clefast era bonito y **no servía**, y el motivo no era
la luz: era la cámara. Fotogrametría sobre las lavadoras del fondo (altura conocida
≈1,05 m) dio **cámara a 0,35–0,70 m del suelo y horizonte al 6–11 % del alto**. Con
esa geometría, un bidón de 0,92 m que quepa entero tiene que estar a **≥5,7 m**, y
entonces mide **18–25 % del alto**: imposible llegar al 40–60 % de ocupación que pide
el §9. **La relación es invariante a la escala: ni recortando ni ampliando se
arregla.** Era una plancha de suelo, no un plató de producto.

**Entonces el prompt de escenario lleva siempre tres datos, además de los siete
slots:**
1. **Altura de cámara** en metros, y si está nivelada o inclinada.
2. **Dónde cae el horizonte** dentro del cuadro (p. ej. «en el tercio alto»).
3. **A qué distancia está el fondo**, en metros.

Con esos tres, la escena es componible **y el producto se coloca por geometría en
vez de a ojo**: el horizonte da la línea y la escala del suelo sale de
`S(y) = (y − y_horizonte) / altura_de_cámara` px/m. Cada pieza se escala por su
**altura física real** desde la `y` donde apoya.

**Y la escena se audita ANTES de componer nada.** Un objeto vertical de altura
conocida al fondo da el horizonte y los px/m; de ahí se deduce si la ocupación del
§9 es alcanzable. Son cinco líneas de numpy y ahorran una tanda entera.

**`n: 2` en una sola llamada** cuesta lo mismo que dos llamadas sueltas y cumple la
regla de generar varias variantes y elegirlas mirando. Coste medido de la portada
entera: **6.729 tokens de imagen** (tres variantes a 2.243 cada una, 2400×1600,
calidad `high`).

---

### Las cinco plantillas, para webs y SaaS

Rellenar los corchetes. Todas terminan con el mismo cierre de vacío, que es lo que
impide que el modelo meta una pantalla inventada.

**CIERRE OBLIGATORIO**, al final de los cinco:
> `The surface is completely empty. No devices, no screens, no laptops, no phones,
> no papers, no products, no text, no letters, no numbers, no logos, no signage
> anywhere in the frame. Deep focus, everything sharp from front to back. No bokeh,
> no shallow depth of field.`

---

**1 · Mesa para una captura de escritorio** — la más usada

> `A [walnut / brushed steel / honed concrete] desk surface photographed from
> [30]° above, [waist] height, 50mm equivalent, filling the frame. The material
> shows [visible grain running left to right / a fine brushed grain / a matte
> aggregate speckle]. A single [hard / soft] light from the [upper left], falling
> off toward the [lower right], with a clean shadow gradient. Background: a
> [workshop / office] interior [4] metres behind, unlit, reading as a dark field.
> Palette limited to [#hex, #hex]. Centre of the frame slightly darker than the
> edges.` + CIERRE

*El centro más apagado porque ahí va la captura compuesta: nada puede brillar más
que el sujeto.*

---

**2 · Mano y teléfono** — para enseñar lo responsive de verdad

> `A [left] hand holding a modern smartphone, seen from [above and slightly
> behind], the screen facing the camera and perfectly rectangular with no
> perspective distortion. THE PHONE SCREEN IS A FLAT, UNIFORM [#FF00FF] MAGENTA SHAPE, INSIDE A THIN UNIFORM BLACK BEZEL
> with nothing on it. Natural skin, visible texture, no retouching. Background:
> [a café table / a factory floor], [1] metre below, out of focus by distance
> only. Single [window] light from the [left].` + CIERRE *(adaptado: la pantalla
> verde es lo único que sí va)*

*Con el endpoint de edición y máscara esto mejora: se pasa la captura real y la
máscara, y se pide la mano y el entorno alrededor.*

---

**3 · Superficie del oficio, para un objeto real** — la que le falta a Clefast

> `The floor of an industrial [laundry], photographed from [1] metre height at
> [15]° down. [Sealed concrete with faint drainage channels and water staining].
> Shot from [3] metres back so the far wall falls out of focus by distance.
> [Fluorescent] light from above and [left], hard enough to cast a defined
> contact shadow where an object would stand. Palette [#hex, #hex].` + CIERRE

*Encima se compone el bidón recortado. Esta es la pieza que hoy lee a ciclorama de
estudio y que Alexander señaló.*

---

**4 · Campo de marca para una lámina** — fondo, no escena

> `An abstract field of [deep gold #hex] fading to [bronze #hex] toward the
> bottom, with a soft radial glow in the [upper left]. Subtle [paper / linen]
> grain at low contrast. No gradient banding. Flat, no objects, no horizon.` +
> CIERRE

*Barato, y resuelve el defecto de «degradado de CSS» sin inventar nada.*

---

**5 · Edición con máscara sobre una captura real** — el método nuevo

Se envían: la captura real + una máscara que la protege entera. Y el prompt
**describe la imagen completa resultante**, no solo el fondo:

> `A photograph of a [laptop] standing on a [walnut desk] in a [design studio],
> its screen displaying the interface shown in the provided image, unchanged. The
> desk shows visible grain. A single hard light from the upper left casts a defined
> contact shadow under the [laptop] and a long soft shadow to the right. The room
> behind is [4] metres back and unlit. Palette [#hex, #hex]. Deep focus throughout.`

⚠️ Describir solo el fondo da resultados incoherentes: lo dice su documentación y
es el error fácil.

---

### 🚨 La pantalla se pide en CLAVE MAGENTA, no negra (2026-10-06)

> «me gustó el estilo pero si te das cuenta, no está bien mockeado, no sigue los márgenes del
> celular. fíjate qué podríamos hacer para arreglar ese error en nuestros prompts»

**El fallo, medido a 1:1.** Las escenas se pedían con la pantalla *«completely switched off:
pure matte black»*. El modelo la pinta negra, **igual que el bisel**, así que el borde del
cristal no existe en la imagen: no hay nada que medir. Se adivinó el cuadrilátero a mano, el
radio se puso de oído y encima se dibujó **nuestra propia isla**. Resultado: la interfaz se
quedaba corta arriba, se pasaba en las esquinas y el celular tenía dos islas.

**La regla:** la pantalla se pide en un **color clave plano, `#FF00FF` magenta**, dentro de un
bisel negro fino y parejo. Magenta y no verde: el verde choca con el lima de Rematch, el
césped, las plantas; el magenta no aparece en casi ninguna escena (si la marca del cliente es
magenta, como Sportt, se usa cian `#00FFFF`: **la clave es el color más lejano de la escena**).
Con la clave, `componer-escena.py --clave` saca **la forma exacta del cristal** —radio, esquinas
y el recorte de la cámara como agujero— y las cuatro esquinas por rectas: residuos medidos de
**0,6 a 3 px** en las tres escenas de Rematch, contra 58–97 px del negro.

**El flujo que funciona, en dos pasos** (cuesta una edición más por escena, ~3 600 tokens de
salida, y vale cada uno):

1. **Generar la escena** como siempre (pantalla apagada), con `flare`, y elegirla mirando.
2. **Editar SOLO la pantalla** con `sunburst` + máscara (alfa 0 sobre la cara del aparato, un
   3 % más grande que el cristal), con este cierre en el prompt, que describe la imagen ENTERA:

> `Reproduce the provided photograph exactly: [la escena en una frase]. Same camera, same
> framing, same light, same [phone], same position. Change nothing outside the [phone]
> screen. THE ONLY CHANGE: the screen glass, inside its thin uniform black bezel, now shows
> a perfectly flat, uniform, fully saturated magenta #FF00FF, edge to edge, exactly filling
> the rounded shape of the glass and following its rounded corners precisely. The black
> pill-shaped camera cutout stays at the top of the screen, solid black. The thin black
> bezel remains clearly visible all around the magenta glass, with the same width on all
> sides. The magenta is completely flat: no gradient, no reflection, no glare, no texture,
> no content, no text, no icons. No magenta light spills onto the bezel, the [hand], the
> frame or anything else; magenta appears nowhere else in the image.`

Medido: fuera de la máscara la escena cambia **9 de 765** de media (nada visible); el
compositor usa la escena ORIGINAL y de la editada toma solo la forma del cristal.

**Y en la composición:** la captura va **sin isla** (la isla es la del aparato de la escena) y
sin redondear a mano: la máscara de la clave manda. Plantillas `pantalla-*-sin-isla.html`.

### Medido en la tanda de Rematch (2026-10-06)

- **Tokens de salida por imagen, `flare`, `high`:** 3072×2048 → 3 184 · 2048×2048 → 3 568 ·
  2800×2016 → 3 211. La entrada es el texto del prompt (430–610 tokens con el bloque de serie).
- **Límite de la cuenta: 5 imágenes por minuto.** Lanzar seis en paralelo devuelve 429 en la
  sexta (no cobra); se repite sola un minuto después.
- **Personas: sí, y a la primera.** Cinco escenas con gente o manos (mano con el celular,
  entrenadora, jugador, dueño al teléfono) salieron creíbles sin un solo descarte, con el
  bloque *SERIES LOOK* común al final de cada prompt. Lo que sigue prohibido es lo de siempre:
  texto, logotipos en la ropa e interfaz; el teléfono va de espaldas o con la pantalla apagada.
- `scripts/openai-imagen.py` hace generaciones y ediciones con máscara y apunta cada llamada
  en `scripts/gastos-openai.jsonl`. Detalle de la tanda: `COMPOSITOR.md`, decimotercera generación.

## Herramienta anterior: Higgsfield (2026-09-01 → 2026-10-01, superada)

Alexander: *"tengo cuenta de Higgsfield, para que puedas tú mismo mandar tus
prompts y generar el portafolio para algunas ocasiones"*.

Qué cambia:
- **El modelo es Higgsfield** (higgsfield.ai). Los prompts de fondo y de
  escenografía se redactan para él: **prosa descriptiva**, no sintaxis de
  parámetros tipo Midjourney. Admite imagen de referencia — útil para pasar la
  captura real o el color de marca como guía del fondo. Los detalles de cada
  modelo/preset (Soul, Cinema Studio, image-to-image, relación de aspecto) se
  **verifican en la interfaz la primera vez que se use**, no de memoria.
- **Yo puedo operarlo** vía navegador (Playwright) con su sesión iniciada:
  escribir el prompt, generar, descargar. Cada sesión de generación se
  **anuncia antes** (cuántas imágenes, qué prompts) — consume créditos suyos.
- La regla fundacional no cambia: **Higgsfield genera fondo, superficie,
  escenografía y luz. Nunca la interfaz.** La captura real se compone encima.
- "Para algunas ocasiones": la mayoría de las 33 portadas salen de recetas sin
  IA (R17–R21). Higgsfield entra donde vale: R8 escenografía de rubro, R12
  superficie para impresos, R21 glow si se quiere textura real, R10 textura.

Sigue sin decidir: **con qué se compone** la captura sobre el fondo (Figma /
Photoshop / script con `sharp`). Si es script, el hueco plano en el mockup es
obligatorio.

## Lo que falta preguntarle a Alexander

- [ ] **¿Con qué herramienta compone?** Figma, Photoshop, o un script (`sharp`
      + perspectiva). Si es script, el hueco verde plano en el mockup es
      obligatorio; si es Figma, sirve cualquier plantilla de mockup.
- [x] ~~¿Con qué modelo genera los fondos?~~ → **Higgsfield** (ver arriba).
- [ ] **¿Las 21 portadas de 1536×1024 ya salieron de un generador?** Si ya hay
      un flujo, las recetas deben encajar en él.
- [ ] **¿Grilla policroma (color del cliente, como brandvm) o monocroma (paleta
      Axium)?** Es una decisión de identidad, no de técnica, y cambia el slot 7
      de todos los prompts.

---

## Repertorio de ideas (brandvm, 2026-10-01)

Alexander, mirando dos fichas nuevas de brandvm: *«por acabados me refiero a la
**creatividad** de las imágenes, lo nuestro se ve muy simple y sin alma, lo de
ellos creativo y elegante profesional»*.

El diagnóstico honesto de nuestro portafolio en ese momento: **producto sobre
suelo, pantalla sobre campo, pantalla sobre campo, pantalla sobre campo.**
Piezas correctas y sin concepto. Lo de brandvm es **una idea distinta por
pieza**. Esto es el inventario de esas ideas, descritas por lo que se le ocurrió
a alguien *antes* de abrir el programa — no por la técnica.

### Las 16 losas, una frase cada una

**myHSA · employee benefits** (`referencias/capturas/eb/`)

| # | La idea |
|---|---|
| l01 | El portátil con la web, y la respuesta a «¿para quién es esto?» **recortada de la propia página y sacada fuera de la pantalla** como una pegatina que flota delante |
| l02 | Díptico de fotografía corporativa del cliente, con una tarjeta de la UI flotando **sobre la costura** entre las dos fotos |
| l03 | Una sección entera del sitio **a sangre y sin marco**: el degradado de marca a pantalla completa con su titular |
| l04 | Tres funciones del producto, **cada una dentro de un círculo de color de marca**, en fila como tres planetas; la UI desborda el círculo por arriba y por abajo |
| l05 | Tríptico de los tres atributos de marca: tres fotos verticales a sangre, cada una con su titular en blanco y su icono en un círculo |
| l06 | La escena de uso real: alguien **de espaldas** usando el sitio, con las tarjetas de la UI saliendo de la pantalla hacia el espectador |
| l07 | Mitad y mitad: a la izquierda la UI real sobre un círculo de color, a la derecha **el titular y el botón reales tratados como tipografía editorial** |
| l08 | El móvil flotando sobre **anillos concéntricos** de color de marca, con un fragmento de la UI desprendido a un lado |

**Paquin · entertainment group** (`referencias/capturas/et/`)

| # | La idea |
|---|---|
| l01 | El portátil **sobre un pedestal de piedra negra**, luz teatral: la web como objeto de exposición |
| l02 | El portátil **en escorzo extremo sobre una barra de luz de color**, la pantalla casi en diagonal, el logotipo pequeño arriba y el copyright abajo: un cartel, no una captura |
| l03 | Díptico: dos móviles girados en el aire a la izquierda; a la derecha el isotipo flotando con halo sobre el público desenfocado |
| l04 | Las piezas del catálogo del cliente como **naipes esparcidos en arco sobre negro**, con el nombre encima: el repertorio hecho constelación |
| l05 | Dos mitades: la **tipografía de marca a tamaño descomunal** («Aa») y, al lado, las fichas de color con sus hex, como el manual abierto |
| l06 | La mano con el móvil a la izquierda; a la derecha **la misma retícula de la pantalla ampliada a tamaño mural** |
| l07 | Las páginas del sitio **volcadas en perspectiva isométrica**, como planos extendidos sobre una mesa |
| l08 | Tres móviles **escalonados en el aire** delante de una sección del sitio ampliada al fondo |

### Las dos listas

**Dependen de material que no tenemos** (fotografía corporativa, personas,
catálogo fotográfico del cliente). El §9 nos prohíbe fabricarlo, así que estas
ideas solo se usan cuando el cliente nos da las fotos: **eb/l02, eb/l05, eb/l06,
et/l03, et/l04, et/l06.**

**Puro concepto — se pueden hacer mañana con lo que ya hay** (capturas reales,
fotos de producto del cliente, el logotipo, y una escena generada vacía):

1. **eb/l01 · El fragmento desprendido.** Un trozo de la UI real sale de la
   pantalla y flota delante. Dice *qué* hace la pantalla sin pedir que se lea
   entera.
2. **eb/l03 · La sección a sangre.** El campo de marca a pantalla completa. Es
   nuestra R20, confirmada.
3. **eb/l04 · El círculo de marca.** Contenido dentro de un disco de color
   saturado, desbordándolo. Barato y rompe la cuadrícula de tarjetas.
4. **eb/l07 · Mitad UI, mitad tipografía.** El copy real del cliente tratado
   como titular editorial, no como captura.
5. **eb/l08 · Los anillos concéntricos.** Objeto flotando sobre aros de marca.
6. **et/l01 · El pedestal.** Luz de museo sobre el objeto: la web como pieza.
7. **et/l02 · El escorzo sobre la barra de luz.** La captura girada en 3D sobre
   una franja de color de marca. **La más rentable: una línea de `transform`.**
8. **et/l05 · El espécimen tipográfico.** La tipografía y los hex del cliente a
   tamaño descomunal.
9. **et/l07 · La isometría.** Las pantallas volcadas como planos.
10. **et/l08 · El escalonado en el aire.** Dos o tres piezas en profundidad.

### Lo que la lista enseña, y que es lo que faltaba

- **Ninguna de las dieciséis es «la pantalla X sobre un campo».** En todas pasa
  algo *además* de enseñar la pantalla: se recorta un trozo y se saca fuera, se
  gira, se mete en un círculo, se amplía a mural, se vuelca en isometría.
- **El color de marca va a plena fuerza**, como campo que manda, no como glow
  insinuado detrás de una tarjeta blanca.
- **Nada está entero dentro del cuadro.** El sangrado es la norma, no la
  excepción.
- **Una pieza se defiende con una frase.** Si la frase es «es la captura del
  catálogo», la pieza no tiene idea todavía.

### Aplicado a Clefast (2026-10-02)

Once piezas, once frases. La que manda la ficha entera sale **del propio
argumento**: *«205 presentaciones, de 100 ml a 200 kg»*.

| pieza | la idea | de dónde sale |
|---|---|---|
| portada | La gama entera alineada como un perfil ascendente, del frasco de 100 ml al bidón de 200 kg, con luz dura y sombras paralelas sobre el verde de marca | et/l04 + luz dura |
| hero | El catálogo entero: los 31 envases reales en retícula sobre verde de marca, sangrando por los cuatro cantos | brandvm losa-02 |
| cf-tienda | La portada real **en escorzo sobre una barra de luz verde**: un cartel, no una captura | et/l02 |
| cf-catalogo | La columna de categorías **sale de la pantalla** y flota delante del catálogo | eb/l01 |
| cf-ficha | El selector real de presentaciones arriba y **los cinco envases reales a escala relativa verdadera** debajo: la UI y la materia diciendo la misma frase | eb/l07 |
| cf-distrito | El desplegable cae **dentro de dos anillos de marca** y los desborda | eb/l04 + l08 |
| cf-resumen | Los dos momentos del checkout como **dos naipes escalonados en el aire** | et/l08 |
| cf-celular | Lo mismo a dos escalas: **en la mano y ampliado a mural** detrás | et/l06 |
| cf-chat | La burbuja real del chat **sale de la pantalla** y se lee a tamaño mural | eb/l01 |
| cf-mudanza | Media losa clara con el dato, media losa de color saturado con el producto | eb/l05 (estructura) |
| cf-envio | La tarifa medida, en tarjeta blanca sobre el campo verde | eb/l03 |

**La prueba de que la idea es buena: es verificable.** «De 100 ml a 200 kg» no
es un adorno, es la frase que ya estaba en la ficha y que ahora se ve.

### Rechazada por Alexander (2026-10-02)

**et/l02 — «el escorzo sobre la barra de luz».** Probada en `cf-tienda` y
rechazada: *«las perspectivas no me gustan mucho, a no ser que sea tipo
mockup»*. La regla que queda, y que vale para las 40 fichas:

> **Una captura girada en 3D solo vale si el giro lo justifica un dispositivo
> real** —la pantalla dentro de un portátil, un monitor o un teléfono, con su
> materia y su perspectiva física correcta—. Girar la captura «a secas», aunque
> lleve el marco de un navegador, se lee a efecto. **Si no hay dispositivo, va
> de frente.**

Afecta también a et/l07 (la isometría) y a et/l08 (el escalonado en el aire):
los dos se pueden hacer **sin giro**, con escala y profundidad, y así se
quedan. En esta ficha `cf-resumen` pasó de dos naipes girados a dos tarjetas
alineadas a retícula y mejoró.

### Y el techo de ampliación

**Ningún envase ni captura se amplía por encima de 1,0×.** El origen de las
fotos de producto de Clefast es 1280×1280 (comprobado: el sitio en vivo sirve
exactamente lo mismo desde R2, no hay versión mayor), lo que deja el recorte
del bidón de 200 kg en 692×1076. En `cf-mudanza` estaba puesto a 1,41× y se
veía: *«tiene mala calidad el detergente grande, se ve feo»*. **No se arregla
componiendo.** El orden para resolverlo es: buscar el original en el sitio del
cliente → si no existe, usarlo más pequeño → si tampoco cabe, cambiar la idea
de la pieza. Medir siempre `alto_servido / alto_origen` antes de dar una pieza
por buena; con `deviceScaleFactor 3` el alto en CSS se multiplica por tres.

---

## Ampliación de la regla: qué puede generar el modelo (2026-10-02)

Alexander, viendo dos piezas: *«no hay mala calidad aquí, pero es un diseño muy
pobre. ¿Es limitación del modelo o de nuestro prompt?»*

**Ni una ni otra: era nuestra.** Al modelo le habíamos pedido **dos escenarios
vacíos en toda la ficha**; todo lo demás —disposición, retícula, apoyos,
tipografía, estructura— lo componíamos nosotros. **Un diseño pobre es nuestra
maquetación, no una salida pobre del modelo.**

La causa: teníamos escrita la regla como *«la escena se genera VACÍA»*, y eso
nos encerró en **habitaciones**. La regla de fondo nunca fue esa.

> **El modelo sirve para lo que NO lleva significado: materia, textura, luz y
> campo abstracto. Lo prohibido es lo que SÍ lo lleva: interfaz, texto, marca y
> producto del cliente.** Un escenario vacío es un caso particular, no el límite.

**Lo que sí puede generar, y no estábamos usando:**

| | ejemplos |
|---|---|
| **Materia y textura** | hormigón, microcemento, acero cepillado, papel, lino, tela, agua, espuma |
| **Estudios de luz** | caídas, haces, penumbras, charcos de luz, reflejos sobre superficie |
| **Campos gráficos abstractos** | mucho más ricos que una malla de CSS, y con grano real |
| **Atrezo genérico sin marca** | una paleta de madera, una estantería industrial, una rejilla de desagüe |

**Lo prohibido no se mueve**: interfaz, capturas, texto, cifras, logotipos y los
envases del cliente **jamás** se generan. Se componen reales encima.

### La plancha de materia y luz, que es la pieza que faltaba

El recurso más rentable que salió de esto: **un «cove» de estudio generado
vacío** —un ciclorama sin esquina, de microcemento, con una caída de luz real de
arriba-izquierda a sombra profunda abajo-derecha— que luego se **tiñe al verde
de marca callado conservando su estructura de luz**. Con eso:

- `cf-ficha` dejó de ser cinco objetos sobre un degradado y pasó a ser una fila
  apoyada en un **plano de suelo real**, con sombras dirigidas y un charco de luz;
- `cf-mudanza` dejó de tener media losa vacía.

**Un degradado de CSS no sabe hacer una caída de luz.** La malla sirve para
callar un campo; cuando el campo tiene que tener **cuerpo**, se genera.

### Y pensar en gráfico, no solo en fotográfico

La otra mitad del diagnóstico: *«una fila de objetos centrada sobre un campo es
la composición más neutra que existe»*. Lo que separa a brandvm no es la
fotografía: **sus piezas que parecen diseñadas son composiciones gráficas** —la
rejilla 2×2 del logotipo sobre cuatro colores, el patrón tipográfico con cruces
de registro, las tarjetas de interfaz extraídas y flotadas—.

Lo que se le añadió a `cf-ficha` y que es transferible: **línea de base, guías
verticales bajo cada objeto, una fila de rótulos alineada y contraste de escala
real**. Estructura, retícula y jerarquía encima de la materia. Sin eso, una
plancha buena solo da un bodegón mejor iluminado.
