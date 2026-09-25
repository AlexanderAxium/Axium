# Caso LumioLearn — ficha dentro de Axium (SaaS propio)

> Encargo, 2026-09-11 (mismo que Rematch). Plantilla: **SaaS propio → modelo
> Fiddle**, narrativa alternada, titular = párrafo, sin redundancia, navbar
> legible, cierre liviano.
>
> ⚠ **LumioLearn ≠ MainTech.** Alexander: *"lumio learn no es maintech,
> maintech es una empresa que tiene soporte de lumio, es distinto"*. La ficha
> usa **solo UI y sitio de lumiolearn.com**. Tampoco InduTech ni ninguna
> academia inquilina.

---

## 1. La historia real (repo `~/Documents/SAAS/LumioLearn`, `CLAUDE.md`, `docs/`)

- **LMS marca blanca multi-tenant** con dos modos: *plataforma*
  (`escuela.lumiolearn.com`) y *marca blanca* (dominio propio con SSL
  automático, sin ninguna mención de Lumio: textos, SEO, correos, favicons).
- **Cuatro portales + editor**: sistema, panel del tenant, profesor, alumno, y
  `/builder` para el sitio.
- **Cursos → capítulos** con video, adjuntos, marcadores, notas y comentarios.
- **Quizzes** con nota mínima e intentos; el aprobado desbloquea el progreso.
- **Certificados** con plantillas diseñables, PDF y **verificación pública por
  código**.
- **Tutor IA** (Gemini) que responde con el contexto de la clase: subtítulos,
  notas y quiz *sin respuestas*; la API key del tenant va cifrada
  (AES-256-GCM). Además, generación con IA de cursos, quizzes y sitios.
- **Constructor de sitios** drag & drop con widgets (acordeón, testimonios,
  precios, formulario de leads…), motor único para web y API.
- **Pagos** Mercado Pago y PayPal, recurrentes; cupones; gamificación (puntos
  y rachas); API REST pública con claves con alcance; tres canales de correo;
  interfaz en español, inglés y portugués.

**El nombre** (guía de marca): *"Lumio viene del latín lumen (luz). La idea:
iluminar el aprendizaje."*

**No publicar** cifras de negocio del documento operativo (clientes, ingresos,
commits): es material para un comprador, no para el portafolio.

Stack verificado: Next.js 15 · React 19 · TypeScript · tRPC 11 · Prisma +
PostgreSQL 16 · better-auth · Tailwind 4 + shadcn/ui · Gemini (Vercel AI SDK) ·
Bunny Stream · Cloudflare R2 · SendGrid · Docker + GitHub Actions.

## 2. Los instrumentos del oficio

El temario · el capítulo · la barra de progreso · el marcador en el video · la
nota del alumno · el quiz con nota mínima · el certificado con su código · el
tutor que cita la clase · el widget del constructor · el dominio propio.

## 3. Tres direcciones (una por generador, escritas aisladas)

### A · Instrumentos del oficio — "La ficha es un curso"
Arriba, un **temario** con los capítulos y sus minutos de lectura; una **barra
de progreso** fina que avanza con el scroll; cada capítulo termina con **una
pregunta de repaso** (la respuesta aparece al pasar el cursor) y el cierre es
un **certificado de recorrido** con la ficha técnica.
- Gana: la estructura *es* el producto.
- Pierde: si se exagera, parece un curso de verdad y no un caso de estudio.

### B · Restricción forzada — "Una sola fuente de luz"
Índigo casi negro y nada más que luz: cada pieza de UI aparece bajo un haz
(lumen) que se desplaza con el scroll; tipografía enorme y mínima.
- Gana: atmósfera, eco directo del nombre.
- Pierde: repetiría el lenguaje oscuro de Rematch y del home; firma de ambiente,
  no de estructura.

### C · Fuera del sector — "El libro con notas al margen"
Fuente nombrada: **las notas al margen de los libros de Edward Tufte** y las
ediciones de **Stripe Press**. Página clara tipo papel, una columna de lectura
y un **margen** donde viven las notas: ahí aparece Lumen, el tutor, con las
piezas reales de su interfaz, como "nota al margen" de cada capítulo (refleja
lo que hace el producto: responder citando la clase). Las imágenes van como
**láminas numeradas** ("Lám. 3 — Constructor de cursos").
- Gana: firma estructural, contraste total con Rematch, verdad del producto.
- Pierde: exige disciplina tipográfica (Gilroy + GuarujaTitle con rango).

**Recomendación: C**, con el **temario y la barra de progreso** de A.

### ✅ Decisión de Alexander (2026-09-12): C · "Libro con notas al margen"
Con las correcciones del crítico de contexto limpio:
- **Fuera temario largo, barra de progreso y preguntas de repaso** (vuelven la
  ficha un libro escolar y suman texto). Un índice mínimo sí.
- **El certificado verificable como colofón** (función real con código).
- **Riesgo estructural**: una columna de lectura + un margen es, en esencia,
  "texto a un lado e imagen al otro", que Alexander rechazó. Solución: las
  **láminas van a todo el ancho** y la nota vive **sobre** la lámina, anclada a
  su borde; en móvil la nota queda como llamada bajo la lámina.
- **Tinta violeta de marca** para notas, numerales y capitulares — si no, es
  Stripe Press con otro logo.
- **Las notas no inventan salidas del tutor.** Lumen aparece con su interfaz
  real solo donde hay captura real; las notas al margen son anotaciones
  tipográficas firmadas con el destello, no respuestas de IA fabricadas.

## 4. Material disponible (todo de lumiolearn.com)

- Panel de administración real (hero de la landing) — `ventana-lumio-b.png`
- Tutor Lumen, Ingresos, Notas de quizzes, Quiz — `recorte-*.png`
- Tarjetas de operación: cupones, correos, roles, gamificación, productos,
  webhooks — `ui/ui-08…15`
- /features: constructor de cursos, tutor, exámenes · /solutions: sesión en
  vivo · /docs (capturando)
- Portada del home (panel + Lumen + ingresos) — `portadas/lumiolearn.png`
- **Falta**: el constructor de sitios, el diseñador de certificados y el
  reproductor del alumno (detrás de login).

## 4b. Cómo se hizo (2026-09-12) — ficha en `casos-de-exito/lumiolearn/`

**LumioLearn en local, sin tocar producción.** El `.env` del repo apunta a la
base de PRODUCCIÓN: nunca `pnpm dev` (hace `db push`). Receta que funcionó:

1. Base aparte `lumio_capturas` en el Postgres local de Rematch (5435).
   `scratchpad/lumio-env.sh` arma la URL, aborta si no es esa base y anula
   Dokploy, SendGrid, R2, Bunny y Google. Antes de escribir: `prisma migrate
   status` + un `select current_database()` con Prisma Client.
2. `prisma db push --skip-generate` + `tsx prisma/seed.ts` (el seed borra todo:
   solo contra esa base). El repo quedó con 0 cambios (scripts copiados como
   `.tmp.ts` y borrados).
3. `next dev -p 3300` con `SERVER_HOSTNAME=lvh.me` (la cookie de sesión va al
   dominio padre: por `localhost` no se entra) y
   `CMS_SCHEMA_MIGRATE_ONREAD=false` (ver hallazgo abajo). Academia en
   `http://lumio.lvh.me:3300`; Playwright con
   `--host-resolver-rules=MAP *.lvh.me 127.0.0.1`.
4. Datos de demo en el tenant propio (LumioLearn Academy), con
   `scripts/lumio-demo-capturas.ts`, `lumio-demo-home.ts` y
   `lumio-demo-marca.ts`: nombres creíbles, notas y marcadores de la alumna,
   puntos y logros, plantilla de certificado (fondo compuesto en HTML,
   `capturas-saas/lumiolearn/demo/`), home del sitio con widgets reales y el
   video de las clases servido desde un servidor local de medios (WebM VP9:
   Chromium no reproduce H.264). Tutor visible con `aiProvider='GEMINI'` y una
   clave de relleno: su pantalla de bienvenida no llama a Gemini.
5. Capturas con `scripts/lumio-laminas.cjs` → `capturas-saas/lumiolearn/laminas/`.

**Higgsfield**: 1 imagen (`gpt_image_2_5`, 16:9, high, 2k → 3 créditos según el
saldo: 53.5 → 50.5) — el fotograma de la clase dentro del reproductor
(contenido del curso, no UI).

**Láminas de la ficha**: 1 el sitio (+ móvil) · 2 el curso · 3 el capítulo con
su quiz · 4 la clase con las notas, y como nota el panel real de marcadores ·
5 el tutor · 6 el progreso · colofón: el editor del certificado.

**Hallazgos en el repo de LumioLearn (para Alexander, no se tocó nada):**
- El lienzo del builder y todas las páginas CMS dibujan "Sección sin render:
  container": `contenidoAlLeer` migra a v2 (`kind/type: "container"`) y el
  renderer de `site-builder-core` busca `components[section.type]` con la clave
  v1 `CONTAINER`. En producción `FallbackSection` devuelve `null` → páginas en
  blanco si ese código está desplegado. El paquete no tiene drift con Vendiq
  (`sync-builder-package.sh --check`), así que afectaría a los tres repos.
- La ruta de dominio del panel dice que el dominio propio llegará "en el
  futuro"; la ficha habla de subdominio o dominio propio (existe vía soporte).
- El tutor se llama "LumioLearn Copilot" dentro de la app y "Lumen" en
  lumiolearn.com.

## 5. Preguntas para Alexander (al final, con la ficha hecha)

1. ¿Capturas o acceso demo al **constructor de sitios**, al **diseñador de
   certificados** y al **reproductor del alumno**?
2. ¿Se pueden mostrar datos técnicos de escala (páginas, modelos, endpoints)?

---

## 6. Rehecha con la plantilla brandvm (2026-09-12)

Alexander, sobre la ficha de autor: *"masomenos, mas me gusta la forma en que
brandvm presenta sus trabajos y cuenta su historia"* (ejemplo:
brandvm.com/case-studies/industrial-manufacturing-website). La ficha ahora usa
`src/components/axium/case-story/case-story.tsx`: hero-tarjeta con la foto del
mundo del producto (Higgsfield) + logo + meta → frase de logro → "Lo que
construimos" → Reto / Enfoque / Resultados (sin métricas inventadas) → galería
2:1 + pares 1:1 → Siguiente proyecto → contacto.

Imágenes en `public/images/proyects/<slug>/bv-*.jpg`: mockups fotográficos con la
UI real sobre escenas con pantalla verde (`scripts/componer_pantalla.py`) y
piezas del taller (`capturas-saas/brandvm-casos/taller.html`,
`scripts/render-taller.cjs`). La versión anterior (planta / libro) queda en el
historial de esta sesión; sus imágenes siguen en `public/` sin referenciar.

## 7. Refinamiento móvil y variedad (2026-09-12)

Alexander, viendo las fichas en el celular: *"concentrate en la ui ux de la versión
móvil, que se entienda bien absolutamente todo, márgenes paddings tamaños todo bien
cuadrado"*; sobre bv-celular: *"no está bien cuadrada esta imagen"*; sobre el cierre:
*"en siguiente proyecto mejor usa un fondo dark para dar contraste y muestra mejor el
carrusel de portafolio"*; y *"hay forma de variar la imagen y no siempre mostrar la
misma chica?"*.

- **Plantilla (`case-story.tsx`, sirve a Rematch y LumioLearn)**: la tarjeta hero usa
  el mismo gutter que el contenido (antes 12 px contra 16 px). En móvil: sin alto
  mínimo, degradado vertical, sin marca de agua, h1 fluido (a 360 "LumioLearn" se
  salía), botones de 48 px que se reparten la fila o se apilan solos, meta como
  tabla de dos columnas con filetes. Frase alineada a la izquierda. Piezas anchas a
  4:3 con `mobilePosition` o `mobileSrc`; pares apilados. Ritmo: 12 px entre piezas
  y 56 px (96 en desktop) entre todo lo demás. Plegado exacto: 6 líneas enteras o 4
  viñetas con "Ver todo (8)".
- **Cierre oscuro "Más proyectos"**: carrusel alineado al contenido a la izquierda y
  sangrando a la derecha: tarjeta "Siguiente" del otro producto + 10 casos del
  portafolio + "Todos los casos"; flechas y barra de avance. En LumioLearn se oculta
  MainTech (`hideCases`). Primero fue scroll-snap nativo; Alexander: *"antes era mejor
  porque permitía arrastrar, además al arrastrar horizontal se debe bloquear el scroll
  vertical"* → **Embla** (`embla-carousel-react`, el del carrusel anterior): arrastre
  con mouse y dedo, `touch-action: pan-y` en la pista, y Embla decide el eje en el
  primer movimiento (horizontal bloquea la página, vertical la suelta). La alineación
  sale del `padding-left` de la vista; la última tarjeta lleva `margin-right` del
  gutter para terminar alineada a la derecha. Probado con `arrastre.cjs` (mouse en
  desktop; toques CDP en móvil: horizontal con 45 px de desvío no mueve la página,
  vertical sí).
- **bv-celular → bv-celular-v2**: `esquinas()` toma extremos en diagonal, que en un
  hueco redondeado caen dentro de la curva: la captura quedaba chica, con esquinas
  rectas y marco negro de más. Nuevo `--bordes` en `componer_pantalla.py` (ajusta
  los cuatro bordes rectos y descarta la muesca). La pantalla lleva barra de estado
  y la página real desplazada a "Cursos destacados"
  (`brandvm-casos/pantalla-celular-lumio.html`).
- **La misma chica**: la instructora (fotograma de la clase) salía en bv-estudio,
  bv-celular y 5 veces en el mosaico. Ahora solo en bv-estudio: bv-mosaico-v2 sin
  reproductor, notas, marcadores, tutor ni hero del sitio (y con "Cursos
  destacados" una sola vez), y el celular muestra los cursos. Si hace falta más
  variedad: un segundo instructor (fotograma nuevo en Higgsfield, 3 créditos, +
  recapturar el reproductor con Lumio local).
- **bv-panel-movil**: la ventana del panel a 4:3 para móvil, sangrando a la derecha
  en vez de encogerse.

## 8. La landing de lumiolearn.com (2026-09-12)

Tras hacerlo en Rematch (*"además no veo muchas capturas de la landing page"*),
Alexander: *"lo mismo con lumio learn"*. Capturas del sitio en vivo en
`capturas-saas/lumiolearn/landing/` (home, `/features` y `/prices` a 2x; móvil a
3x), con las cookies en "Solo esenciales" y el botón flotante de WhatsApp oculto en
la pantalla móvil. Cinco piezas nuevas en el taller:

- `bv-landing` (+ `-movil`): la parte alta del hero (titular y botones) en ventana
  sobre el degradado azul-violeta. **Cortada antes del mock**: el mock del hero dice
  *"Prueba gratuita: te quedan 14 días en InduTech Academy"* (UI de un inquilino).
- `bv-landing-moviles`: inicio en el celular (asistente de cursos, ingresos, Lumen),
  roles y gamificación, y el plan Business.
- `bv-precios`: `lumiolearn.com/prices`.
- `bv-operar`: "Todo para operar a gran escala" (cupones, correos, roles,
  gamificación, productos, API).
- `bv-funciones`: `lumiolearn.com/features` (hero y constructor de cursos).

**Portada de portafolio** (`public/images/proyects/lumiolearn/lumiolearn-portada.jpg`):
Alexander, sobre el carrusel "Más proyectos": *"cambia la portada de lumio learn, que
concuerde con el resto"*. El resto de las portadas son una laptop de frente sobre fondo
oscuro con brillo de marca (ANJ, MainTech, VitalChain). Escena de Higgsfield con la
pantalla en verde (`escenas/lumio-portada-laptop.png`, `gpt_image_2_5` 3:2 high 2k,
**3 créditos**: 12.5 → 9.5) + `lumiolearn.com/features` a 2x sin el botón de WhatsApp,
compuesta con `componer_pantalla.py --bordes`. Se usa en la tarjeta "Siguiente" de la
ficha de Rematch y en `src/data/cases/lumiolearn.json` (tarjeta del portafolio).
**v2 (`lumiolearn-portada-v2.jpg`)**: Alexander pidió *"la imagen de la portada de
inicio, no la de features"*. La laptop muestra ahora el inicio de lumiolearn.com
(`landing/home-d-viewport.png`, misma escena, sin créditos nuevos). Ojo: ese primer
pantallazo incluye el mock del panel con *"Prueba gratuita… en InduTech Academy"* y un
curso de InduTech (pequeño, pero legible con zoom); se le avisó.
**v3 (`lumiolearn-portada-v3.jpg`, y `highlights/lumiolearn-v7.jpg` a 16:10 para el
home)**: tras la portada nueva de Bookit (laptop a tres cuartos sobre mármol verde),
Alexander: *"me gusta, similar para lumio"*. Escena propia de Higgsfield
(`escenas/lumio-portada-laptop-34.png`, 3:2 high 2k, 3 créditos): laptop a tres cuartos
girada hacia el otro lado, escritorio de piedra índigo, brillo violeta, libros y taza.
Misma captura del inicio de lumiolearn.com. El home y el carrusel usan la misma
portada; las versiones v1 y v2 se borraron.

**Fuera de la galería**: la sección de MainTech, y las que traen fotos de personas
("Hecho para tu forma de enseñar", la alumna del quiz, la CTA final) para no sumar
caras (ver memoria de variar personas). Orden: … resultados → **landing →
móviles/precios** → certificado → **operar/funciones** → panel → celular/progreso.

## 9. Hero a sangre y la landing como mockup (2026-09-12)

- Alexander: *"preferiría que las portadas sean ancho completo estilo dark"*, y al
  preguntarle a qué portadas se refería: **el hero de cada ficha**. El hero de
  `case-story.tsx` dejó de ser una tarjeta con margen y esquinas: es una sección
  oscura de borde a borde que empieza detrás del navbar (que toma su tono), con el
  texto y la meta alineados al contenido (16 px en móvil, 64 px en desktop). Vale
  para Rematch y LumioLearn.
- Sobre `bv-landing` (ventana del inicio sobre degradado violeta): *"esta imagen
  mejorada, no le des un simple degradado, dale un mockup con higgsfield"*. Nueva
  escena `escenas/lumio-landing-dispositivos.png` (laptop + celular en verde, fondo
  noche con brillo índigo-violeta, `gpt_image_2_5` 16:9 high 2k, **3 créditos**: 9.5 →
  6.5). Laptop: `lumiolearn.com/features` (el inicio de escritorio no se puede, su
  mock dice InduTech). Celular: el inicio móvil real (sin inquilinos) con barra de
  estado (`brandvm-casos/pantalla-celular-landing-lumio.html`). Piezas
  `bv-landing-v2.jpg` (2:1) y `bv-landing-v2-movil.jpg` (4:3).
- Para no repetir el hero de `/features`, `bv-funciones` ahora muestra el tutor con
  IA y los exámenes de esa página.

## 10. Portada en tableta y highlight sin mockup (2026-09-13)

La v3 (laptop a tres cuartos sobre piedra índigo) quedó *"muy similar"* a la de Bookit (laptop a
tres cuartos sobre mármol verde). Cita completa en CASO-REMATCH.md § 8.

- **Portada del carrusel y del portafolio** (`lumiolearn-portada-v4.jpg`; reemplaza a la v3 en
  `lumiolearn.json` y en el "Siguiente" de Rematch): tableta horizontal en su funda sobre un
  escritorio de nogal, pared índigo, lámpara violeta, audífonos y cuaderno en blanco. Higgsfield
  `escenas/lumio-portada-tableta.png` (3:2 high 2k, 3 créditos) + inicio de lumiolearn.com
  capturado a 1180×820 @2x (`lumiolearn/landing/home-tablet.png`), compuesto con
  `--bordes --ancla arriba --brillo 0.9`. El mock del hero de la web lleva en chico el aviso de
  prueba de InduTech Academy, igual que la v3 (Alexander pidió el inicio).
- **Highlight del home** (`highlights/lumiolearn-v8.jpg`), sin mockup: un haz de luz violeta que
  cae sobre una superficie índigo y termina en un destello de cuatro puntas, la estrella de Lumio
  (Higgsfield `escenas/lumio-mundo-haz.png`, 16:9 high 2k, 3 créditos). Encima, piezas reales de
  lumiolearn.com: Lumen, el certificado de finalización (plantilla con «Nombre Estudiante») y
  «Notas de quizzes». La pieza del quiz con la foto de una alumna quedó fuera (no repetir la misma
  persona).
- Borradas: `lumiolearn-portada-v3.jpg` y `highlights/lumiolearn-v7.jpg`.

## 11. Portada del carrusel cenital (2026-09-14)

La tableta a tres cuartos (`v4`) se veía mal: a 1180 px la barra de lumiolearn.com partía «Iniciar
sesión» y «Empieza gratis» en dos líneas, el recorte al aspecto del hueco cortaba el botón y la
perspectiva de la IA torcía la web. Tras dos intentos (`v5` captura a 1440×1000; `v6` sin recorte),
Alexander: *"sigue raro, capaz es la perspectiva, haz otro mockup"*. `lumiolearn-portada-v7.jpg`: toma
cenital de la tableta sobre un tapete índigo con cuaderno cerrado, lápiz, té y eucalipto (Higgsfield
`escenas/lumio-portada-cenital-b.png`, 3:2 high 2k) + el inicio de lumiolearn.com a 1440×1000 con
`--bordes`. Repuntada en `lumiolearn.json` y en el «Siguiente» de Rematch; borradas v4, v5 y v6.
