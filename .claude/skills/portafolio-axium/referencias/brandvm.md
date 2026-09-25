# Brand Vision (brandvm) — https://www.brandvm.com

- **Analizada:** 2026-09-01
- **Cómo llegó:** Alexander pasó la ficha de caso
  https://www.brandvm.com/case-studies/consumer-software-company (Flipp) con la
  pregunta *"¿puedes encontrar los patrones que hacen que las imágenes y el
  diseño sean profesionales?"*. El índice se buscó aparte:
  https://www.brandvm.com/our-work-portfolio
- **Capturas:** `capturas/brandvm/` — `indice-desktop.jpg`, `indice-full.jpg`
  (38 276 px de alto), `indice-tramo-2400.jpg` (un tramo legible de la grilla),
  `indice-mobile.jpg`, `caso-consumer-software-full.jpg`, y las 8 imágenes del
  caso a resolución original (`img-01` … `img-08`)
- **Arquetipo de índice:** grilla con jerarquía (1 ancho + 2 medios, repetido)
- **Tratamiento de imagen:** composiciones terminadas sobre campo de color de
  marca del cliente — T2/T5/T6 mezclados, unificados por acabado, no por estilo
- **Proyectos mostrados:** ~60–77 en el índice (77 enlaces a fichas)

## Veredicto de Alexander
> "mira este proyecto, puedes encontrar los patrones que hacen que las imagenes
> y el diseño sean profesionales?"
> "no necesariamente quiero prompts generados con IA, pueden ser ediciones
> simples como un degradado y una captura de pantalla bordeada etc, pero por lo
> general si querre ediciones bien hechas"

**Lectura:** la pasó como ejemplo positivo de *imágenes*, no necesariamente de
estructura. Lo que le atrae es el acabado profesional de las composiciones —
y él mismo intuye que es edición, no IA. **Pendiente preguntarle** si la grilla
1+2 y la tarjeta también le gustan, o solo las imágenes.

## 1. Promesa y audiencia
"Selected projects built with world's leading brands." — le habla a un
comprador corporativo norteamericano; la promesa es prestigio por asociación
(Safeway, First Horizon Bank, TDSB). Es una agencia de servicios (Webflow,
WordPress, SEO, PPC), no un estudio de autor: **su perfil es el de Axium**, con
clientes veinte veces más grandes.

## 2. Arquitectura del índice
Grilla con jerarquía en un ciclo fijo: **una tarjeta a todo el ancho (imagen
1354×543, ratio 2.49) seguida de dos a medio ancho (667×468, ratio 1.42)**, y
se repite. Gutter 20px. Contenedor de 1354px sobre lienzo blanco; la grilla
tiene márgenes, no sangra. El ritmo es regular y previsible — el ancho no
depende de la importancia del proyecto sino de su posición en el ciclo.
Móvil: una columna, todas las tarjetas iguales, filtros como chips
horizontales con scroll.

## 3. Ritmo y curaduría
Todo el catálogo en una sola página de 38 000 px: **sin paginación, sin "ver
más"**. Orden por fecha (hay "Sort by: Newest / Oldest"). Es un archivo de
volumen, no una vitrina: la promesa es "mirá cuánto hemos hecho". Con 77
proyectos, el scroll es largo pero el ciclo 1+2 evita la monotonía de la grilla
uniforme.

## 4. Anatomía de la tarjeta
`<article class="case-study-card">`, de arriba abajo:
1. **Imagen** con wrapper de radio 17px y fondo `#F5F7FA` (se ve mientras
   carga). La imagen no tiene radio propio en el CSS — el radio lo aplica el
   wrapper con `overflow: hidden`.
2. **Nombre del cliente** — Instrument Serif *itálica*, 34px, peso 400, negro.
   Es el elemento más grande y el único en serif: la voz de la agencia.
3. **Tagline de una línea** — Inter 13.7px: "Reshaping mainstream recognition
   into B2B precision". Siempre una frase de transformación, nunca una
   descripción del sitio.
4. **Chips de servicio** — Inter 13.7px, píldora gris muy clara, 3–5 por
   proyecto.
5. **Botón "Live Website ↗"** — píldora con borde, alineado a la derecha del
   nombre. Enlace al sitio real, separado del enlace a la ficha.
Hover: `no observable` en captura estática.
Separación entre tarjetas: solo espacio, sin líneas.

## 5. Tratamiento de imagen
- **Qué se muestra:** en el índice, *nunca* una captura cruda. Foto de producto
  (NEO Chassis, TDSB), collage de identidad sobre negro (Roncelli), logo sobre
  textura (Safeway), laptop sobre tela (Pomp), render 3D (2992 Sheppard), hero
  con velo + logo (Flipp). En la ficha de Flipp: 8 composiciones, todas con
  UI real dentro de dispositivo o como tarjeta redondeada.
- **Soporte:** móviles fotorrealistas en ligero giro (img-02), laptop (Pomp),
  tarjetas redondeadas sin dispositivo (img-04, 05, 06, 08).
- **Escenografía:** casi ninguna — fondo plano o tinte. Solo Pomp usa tela.
- **Fondo:** **el color de marca del cliente**, en cuatro variantes: plano
  saturado (`#1C9BEF` Flipp) / tinte ~8% / foto con velo oscuro / plano con
  **marca fantasma** (wordmark enorme un tono más claro, recortado).
- **Luz:** suave, difusa, sin dirección marcada. Sombras de contacto cortas
  bajo los móviles; sombras grandes y difusas bajo las tarjetas.
- **Óptica:** frontal o tres cuartos leve; sin profundidad de campo.
- **Color:** **grilla policroma** — cada imagen trae la paleta de su cliente.
- **Consistencia — qué las unifica:** (1) el radio de esquina idéntico, (2) el
  ratio fijo por ranura, (3) que **todas están terminadas** — ninguna es un
  screenshot pegado, (4) en la ficha, el formato único 4000×2000 en las 8.
- **Ratio y recorte:** ficha 2:1 exacto en todas; índice 2.49 / 1.42 según
  ranura; una imagen ancha de 3:1 para la comparación de mapas de calor.
- **Recetas observadas:** R1 hero con velo · R2 marca fantasma + móviles · R3
  división UI/foto · R4 mosaico de componentes · R5 carrusel con foco · R6
  mosaico inclinado -15° · R7 comparación · R8 dispositivo sobre tela · R9
  collage sobre negro · R10 logo sobre textura. **Solo R8 y R10 necesitan algo
  generado (la tela, la textura); el resto es edición.**
- **Entregables que muestra:** web y branding, un impreso (Roncelli: tarjetas y
  papelería dentro del collage), campaña OOH (TDSB: el tranvía es foto real).
  **No muestra** manuales de marca como páginas, ni brochures, ni redes
  sociales como feed. Para eso hay que buscar otra referencia.

## 6. Filtro y navegación
Un solo eje: **servicio** (All · Web Design · Web Development · Branding ·
UI/UX · SEO · Consultation & Audit · Digital Marketing Strategy · PPC), como
chips horizontales arriba de la grilla, siempre visibles. Más un "Sort by"
Newest/Oldest. **Sin filtro por industria** a pesar de tener 77 proyectos de
rubros muy distintos. `no observable`: conteo por filtro, URL con estado.

## 7. Tipografía
Dos familias: **Inter Variable** para todo y **Instrument Serif itálica** para
el nombre del cliente y para *una palabra acentuada* en cada titular ("Our
Recent *Work*", "world's *leading brands.*"). El salto es 34px (nombre) → 13.7px
(todo lo demás): jerarquía de dos niveles, sin intermedios. El contraste
serif-itálica-vs-grotesca es toda su voz tipográfica.

## 8. Color y fondo
Lienzo blanco puro. El único color de la agencia es un rojo (`Start a Project`
y la palabra acentuada "Work") y un celeste para el acento del hero. Todo el
resto del color lo traen las imágenes de los clientes — y como cada una está
terminada y encerrada en su radio, la grilla policroma no se ve caótica.

## 9. Movimiento
`no observable` — captura estática. Pendiente si Alexander quiere que se
verifique en vivo.

## 10. Prueba y credibilidad
En el índice: solo los nombres (que pesan por sí solos: Safeway, First Horizon).
El botón "Live Website" es la prueba: *andá a verlo*. En la ficha: métricas en
tarjetas de color (2.5x, 4:1, 54%, 83%), mapa de calor antes/después,
logotipos de partners del cliente.

## 11. Ficha del caso y transición
Ficha de 14 000 px: hero con velo + logo → intro → "Project Highlights" →
Challenges → Approach → Outcomes → galería larga de composiciones → "Next
Project" → formulario de contacto. Títulos de sección en Instrument Serif
itálica roja. **La portada del índice no se repite en la ficha**: la ficha abre
con otra imagen. Cada composición ocupa el ancho completo del contenedor, sin
texto encima, con el radio de la imagen misma.

## 12. Firma y transferencia
- **La firma en una frase:** el nombre del cliente en serif itálica grande
  sobre una imagen que siempre está *terminada* — nunca una captura cruda —,
  en un ciclo fijo de una ancha y dos medias.
- **Qué robar (y de qué capa):**
  - *Imagen*: el principio "ninguna captura cruda; todas terminadas con el
    mismo radio y ratio". Las recetas R1–R10. La marca fantasma. El sangrado
    por los bordes.
  - *Tarjeta*: el botón "Live Website ↗" separado del enlace a la ficha — Axium
    tiene `liveUrl` en 30 de 33 y no lo muestra en el índice. La tagline de
    transformación en vez de descripción.
  - *Arquitectura*: el ciclo 1+2 como forma de dar ritmo a un catálogo grande
    sin tener que decidir "cuáles son los destacados".
- **Qué NO sirve para Axium y por qué:**
  - La promesa por prestigio de marca: nadie reconoce a Clefast. El peso tiene
    que cargarlo la imagen.
  - Instrument Serif itálica: Axium ya tiene GuarujaTitle; se roba el *gesto*
    (una familia display solo para el nombre), no la fuente.
  - Un solo eje de filtro sin industria: Axium vende por rubro a PyMEs ("¿han
    hecho clínicas?"); la industria importa más acá que allá.
  - 38 000 px sin paginación: con 33 son ~16 000 px — tolerable, pero medir.

## Aplicabilidad a Axium
- ¿Escala a 33 proyectos? **Sí** — está diseñado para 77.
- ¿Depende de assets que no tenemos? **Parcialmente.** Las fotos de producto
  (NEO Chassis, TDSB) no existen para la mayoría de las PyMEs de Axium; pero
  R2, R4, R5, R6 solo necesitan capturas + color de marca, y eso sí se puede
  producir para los 33.
- ¿Se apoya en marcas reconocibles? **Sí, mucho.** Axium no puede.
- **Capa transferible:** imagen (principal), tarjeta (el botón Live y la
  tagline), arquitectura (el ciclo 1+2 como candidato).

---

## Fichas de caso — cómo cuentan la historia (2026-09-12)

- **Capturas:** `capturas/brandvm/caso-<slug>-dNN.jpg` (tramos de 900 px a
  1440), `-mNN.jpg` (móvil 390), `-full.jpg` y `caso-<slug>.json` (esqueleto de
  textos con tamaño/peso/posición + métricas de `extraer.js`), con
  `scripts/capturar-casos-referencia.cjs`. Analizadas a fondo:
  **industrial-manufacturing-website** (ArcelorMittal, el ejemplo que pasó
  Alexander) y **consumer-software-company** (Flipp).

### Veredicto de Alexander (2026-09-12)
> "masomenos, mas me gusta la forma en que brandvm presenta sus trabajos y
> cuenta su historia. https://www.brandvm.com revisa sus casos de exito. usa
> higssfield si lo necesitas"
> "https://www.brandvm.com/case-studies/industrial-manufacturing-website como
> por ejemplo"

**Lectura:** "más o menos" a las fichas de Rematch (planta con 4 módulos) y
LumioLearn (libro con notas al margen). Elige la **ficha de brandvm como modelo
de narración y presentación**. Es la segunda vez que brandvm llega positiva:
el 2026-09-01 por el acabado de las imágenes, ahora por la estructura. Las
fichas "de autor" con una metáfora propia por caso (planta, libro) le
gustaron menos que una plantilla comercial clara y rica en imágenes.

### La plantilla (idéntica en los dos casos: es un sistema)

| # | Bloque | Cómo es |
|---|---|---|
| 1 | **Hero-tarjeta** | Tarjeta oscura con radio ~24, casi a todo el ancho (1406×797). Migas · **nombre del cliente en serif itálica ~62 px blanco** · una línea de transformación (15 px) · "See the Result" (rojo) + "Live Website ↗" (borde). Fondo: foto del mundo del cliente con velo oscuro + **logo del cliente enorme al centro** (ArcelorMittal: logo + 3 fotos flotantes; Flipp: una persona usando el producto). Abajo, meta en 4 columnas: TIMELINE · DELIVERABLES · INDUSTRY(S) · PLATFORM(S) |
| 2 | **La frase** | Centrada, 34 px, 1–2 líneas con lo que el proyecto logró ("This project established a dedicated, B2B-ready web presence…") + párrafo de contexto de 15 px (qué es el cliente) + píldora "Discover Live Website ↗" |
| 3 | **Primera imagen 2:1** | 1354×677, radio 17: mosaico inclinado de secciones del sitio (ArcelorMittal) o composición de producto (Flipp) |
| 4 | **"Project *Highlights*"** | Grotesca 69 px + la palabra en serif itálica roja. 8–9 viñetas con arranque en negrita ("Stand-alone site strategy: …"), recortadas con degradado + "Learn More ↗" |
| 5 | **Par 1:1 de sistema** | Espécimen tipográfico (Gilroy sobre el degradado de marca) + paleta en tarjetas |
| 6–7 | **"*Challenges*" · "*Approach*"** | Solo la palabra en serif itálica roja; párrafo de 3 líneas visibles, recortado + Learn More |
| 8 | **Par 1:1** | Mockup fotográfico (tablet en una estantería de acero) + carrusel de tarjetas de producto de la propia UI |
| 9 | **"*Outcomes*"** | Párrafo + 3 viñetas medibles **con fuente**: "Website traffic up +185 % (Google Analytics, first 3 months post-launch)" |
| 10 | **Galería** | 2:1 a todo el ancho alternando con pares 1:1 (industrial) o diez 2:1 seguidas (Flipp). Mismo radio, gutter 16 px, sin texto encima |
| 11 | **"UP NEXT · *Next Project*"** | + píldora "All Case Studies" |
| 12 | **Cierre** | "Want to discuss a project? *We'd love to help you.*" + Start a Project + imagen destacada · tarjeta oscura "LET'S TALK · *Contact Us*" con formulario, logos de clientes y sellos |

### Por qué cuenta bien la historia
- **El orden de un comprador:** quién es y qué logró (hero + frase) → qué se
  entregó (highlights) → por qué era difícil (reto) → cómo se resolvió
  (enfoque) → qué cambió, con números y su fuente (resultados) → la prueba
  visual (galería) → siguiente / contacto.
- **Texto corto y plegable:** nunca más de 3 líneas visibles por bloque; quien
  quiere más abre "Learn More". La página es ~80 % imagen (en 11 875 px hay
  unos 1 500 px de texto).
- **Una sola voz para narrar:** grotesca 34 → 15 → 13.7 y la serif itálica solo
  para el nombre y una palabra por título.
- **Imágenes = pruebas terminadas:** mockups fotográficos **en el material del
  cliente** (acero para la acería, pasillo de supermercado para Flipp),
  tarjetas de UI sobre gris claro, fotos de su mundo, sistema de marca.
  Ninguna captura cruda.
- **El marco de la agencia no cambia** (blanco, rojo, radio, tipografía): la
  personalidad del cliente vive dentro de la tarjeta hero y de las imágenes.
  Tensión con "cada caso su creatividad": brandvm la resuelve así, y es la
  forma que Alexander eligió ahora.

**Movimiento:** GSAP + SplitText (Webflow); 0 elementos con opacity 0 al
capturar. **Móvil:** la tarjeta hero se vuelve vertical (meta 2×2), los
títulos en serif siguen grandes, las 2:1 pasan a una columna y los pares se
mantienen de a dos.

### Qué transfiere a los SaaS de Axium
- **La plantilla entera**, con la tipografía de Axium: GuarujaTitle para el
  nombre y la palabra acentuada, Gilroy para narrar.
- **Resultados sin inventar:** donde no hay analítica, hechos verificables del
  producto (módulos, formatos, idiomas, en producción desde…). Preguntar a
  Alexander por datos reales de uso antes de publicar cifras.
- **Mockups fotográficos:** escena generada en Higgsfield con el dispositivo y
  la pantalla lisa, y la UI real compuesta en perspectiva encima.
- **Qué no:** el formulario y los sellos ya los cubre `CaseContactCTA`; los
  logos de clientes famosos no aplican.
