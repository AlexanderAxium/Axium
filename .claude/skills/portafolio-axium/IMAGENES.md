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

## Herramienta de generación: Higgsfield (decidido 2026-09-01)

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
