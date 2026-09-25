# Highlights del home — productos propios (2026-09-11)

## El encargo

Alexander: *"deshaz todos todos los cambios en el portafolio de ANJ, vamos a
hacer algo distinto, en la pestaña de inicio vamos a hacer un portafolio con
highlights. mismo idea que koto… los highlights serán Vendiq, Rematch,
LumioLearn y Bookit por el momento… estilo Dark pero solo a esa sección porque
home es light… hagámoslo paso por paso, primero los highlights del home"*.

ANJ quedó revertido por completo (ficha, JSON, locales, navbar e imágenes
nuevas). `CASO-ANJSPORTS.md` sigue como aprendizaje, no como estado de la web.

Paso siguiente pedido: una página tipo **koto.com/work** (panel de texto fijo a
la izquierda + media grande a la derecha).

---

## Qué se tomó de Koto (medido en koto.com a 1440×900)

- **Panel izquierdo sticky** (~517 px de ancho, 100vh): *"Our work / Amazon"*,
  descripción larga y tarjeta de cliente (logo, tipo de proyecto, año · sector).
- **Columna derecha**: portadas 16:9 apiladas con ~12 px de separación. La que
  cruza el centro va a pleno; las demás, atenuadas.
- **Cierre**: tarjeta corta `[ VIEW ALL PROJECTS ]`.
- En la captura `fullPage` el panel izquierdo sale vacío: es sticky. **Siempre
  mirar en viewport a varias alturas** antes de describir un layout con scroll.

## Cómo quedó en Axium

| Pieza | Decisión |
|---|---|
| Componente | `src/components/axium/highlights-section.tsx`; reemplaza a `CasesSection` **solo en el home** (las fichas siguen usando `CasesSection`) |
| Fondo | `#060C20` (navy de Axium, no negro puro) + `data-nav-theme="dark"` |
| Navbar | `GlobalNavbar` detecta cualquier sección con `data-nav-theme="dark"` bajo sus primeros 32 px y usa la versión blanca. Genérico: sirve para futuras secciones oscuras |
| Desktop | Grid 5fr / 7fr. Panel sticky: overline *Productos propios*, *Nuestro trabajo* + nombre animado, descripción, logotipo + resumen + `dominio · categoría`, 4 segmentos de progreso clicables |
| Activo | `IntersectionObserver` con banda central `rootMargin: "-45% 0px -55% 0px"`; inactivas con velo `#060C20` al 50 % |
| Móvil | Sin sticky: encabezado arriba y nombre + dominio + descripción bajo cada portada |
| Enlace | Cada portada abre el sitio en vivo (aún no hay fichas de los SaaS). Cursor magnético *VISITAR SITIO* (`MagneticCursorArrow` ganó `labelColor`) |
| Textos | `landing.json` › `highlights` en es / en / pt |
| Assets | `public/images/highlights/{slug}.jpg` (2400×1500, 134–339 KB) y `logos/{slug}.png` (alto 160, versión para fondo oscuro) |

**Por qué logotipo y no isotipo en el panel**: Rematch no tiene isotipo cuadrado
y los cuatro sitios comparten el mismo favicon. Recortar un "Re" o dibujar una
inicial sería inventar marca.

---

## Portadas: la fórmula

**Fondo generado** (Higgsfield `gpt_image_2_5`, 3:2, `quality: high`,
`resolution: 2k`, 5.5 créditos c/u) **+ UI real aislada + logotipo real** arriba
a la izquierda (72 / 62 px). Una idea por portada, sin texto añadido. HTML en
`capturas-saas/portadas/`, render con `scripts/render-portadas.cjs`.

| Producto | Fondo | UI real encima |
|---|---|---|
| Vendiq | Vacío negro con retícula azul eléctrico hacia el horizonte (el lenguaje de su propio sitio) | Ventana del dashboard del hero, en español, `rotateX(9deg)` |
| Rematch | Cancha de futsal de noche, reflectores, luz lima | Dos teléfonos: reserva de un club (deporte, fecha, horarios) y listado de canchas |
| LumioLearn | Aurora índigo-violeta con destello de cuatro puntas | **v5 (2026-09-12)**: el reproductor del alumno (clase en video + notas personales) de LumioLearn **en local, en su propio tenant** con datos de demo, grande y saliendo del marco por derecha y abajo + tarjeta Lumen de lumiolearn.com delante + el certificado del curso (lienzo del editor) asomando arriba a la derecha, girado 2°. **v4 descartada**: su "panel real de lumiolearn.com" venía del hero del propio sitio y mostraba *"Prueba gratuita… en InduTech Academy"* y un curso de InduTech — UI de un inquilino, el mismo error que MainTech, escondido dentro del sitio del SaaS. (v3, panel en perspectiva desvaneciéndose, se descartó sin mostrar) |

> **Corrección de Alexander (2026-09-11)**: la v2 usó la academia de MainTech
> y él la rechazó — *"lumio learn no es maintech, maintech es una empresa que
> tiene soporte de lumio, es distinto"*. Aunque lumiolearn.com muestre a
> MainTech como caso de éxito, **la portada de un SaaS usa solo la UI del
> propio SaaS**. También se quitó a MainTech de la descripción.
> Antes (v1): tres tarjetas sueltas (Lumen, notas de quizzes, ingresos) —
> *"mejora lumio"*: no contaban nada juntas.
| Bookit | Casillas 3D navy, algunas encendidas en verde (horarios reservados) | Widget de reserva con horarios + toast *Cita confirmada* |

### Prompts usados (reutilizables cambiando colores y escena)

- **Vendiq** — *Cinematic 3D render of a vast dark void. The floor is made of
  thin, precise glowing electric-blue perspective grid lines receding to a far
  horizon. A soft volumetric glow rises from behind the horizon, shifting from
  pale cyan (#63C8FA) to deep royal blue (#0A2ED9), strongest at the upper left
  and fading into near-black (#05060A) toward the right and bottom. Subtle
  atmospheric haze, faint film grain, very clean and premium, like a keynote
  product-launch backdrop. Large calm empty area in the center for placing
  content. No text, no letters, no numbers, no logos, no interface, no screens,
  no devices, no people.*
- **Rematch** — *Night sports photography of an empty synthetic turf futsal
  court seen from a low angle, shot on a 35mm lens with shallow depth of field.
  Tall stadium floodlights in the background cast dramatic light beams through
  light haze. Deep navy blue shadows (#001D30) dominate the frame; acid lime
  green light (#B5E000) glows on the crisp white court lines and on a soft rim
  light across the turf. Moody, energetic, premium sports brand campaign look,
  subtle grain. The center and upper half of the frame are calm and
  uncluttered. No people, no ball, no text, no letters, no numbers, no logos,
  no signage, no scoreboards.*
- **LumioLearn** — *Abstract dark indigo space (#0F1228) with soft luminous
  aurora ribbons of violet (#7C5CFF) and royal blue (#3B5BDB) light flowing
  diagonally from the lower left to the upper right. A gentle, delicate
  four-pointed starburst of light glows off-center in the upper right, like a
  soft optical sparkle. Glassy refractions, smooth gradients, calm and
  intelligent mood, premium education technology brand atmosphere, fine grain.
  Most of the frame is quiet dark negative space, especially the center. No
  text, no letters, no numbers, no logos, no interface, no screens, no people.*
- **Bookit** — *Minimal premium 3D render: a deep royal navy background
  (#0B1A5C) with a loose, slightly tilted grid of soft matte rounded square
  tiles, like blank appointment time slots on a calendar, seen in gentle
  perspective. A few tiles glow with a soft teal-green light (#1FBF8F) as if
  booked, the rest are dark navy with subtle bevels. Soft studio lighting,
  smooth shadows, calm and organized mood for a scheduling brand, shallow depth
  of field toward the edges. Clean empty space in the center of the
  composition. Blank tiles only: no text, no letters, no numbers, no icons, no
  logos, no interface, no people.*

Los cuatro salieron usables a la primera. Lo que funcionó: **hex de la marca en
el prompt**, **escena que dice el rubro** y **"empty center" + la lista de
prohibiciones**.

---

## Hallazgos en los sitios (para corregir allá, no en Axium)

- **rematch.pe** — `celular.webp` de la landing es UI **generada con IA** con
  errores: *Multfcancha, Calendarto, Contrmeda, Juan Perezd, Conpletaga*.
- **rematch.pe/canchas** — la primera tarjeta (Arena Sport Miraflores) tiene la
  imagen rota; el footer muestra datos de relleno (*Av. Principal 123*,
  *+51 123 456 789*).
- **Vendiq, LumioLearn, Bookit** — el botón de WhatsApp apunta a
  `wa.me/51999000000` (número de relleno).
- **Los cuatro** comparten favicon (mismo md5) y Vendiq usa como `og:image` el
  destello de LumioLearn: base de código compartida sin marca propia en metadatos.
- **bookit.com.pe** — su `og:image` (`/images/logo.png`) devuelve HTML.
- **vendiq.pe/ia y lumiolearn.com/ia** — el header muestra *My Application
  Platform* (nombre de plantilla) y el footer *"gestión de usuarios y
  autenticación"*.
- **lumiolearn.com/signin y /onboarding/signup** — *"Bienvenido a My
  Application Platform"* y el mismo nombre de plantilla en el pie: el login y el
  registro reales del producto no tienen la marca Lumio.

## Cuarta vuelta: portadas sin mockup (2026-09-13)

Alexander: *"no habría necesidad de poner mockups para los highlights, sino otra forma creativa
de mostrarlo. Pero sí el mockup para el carrusel"*. Desde acá **el highlight y la tarjeta del
carrusel ya no comparten portada**, y las portadas del carrusel usan un dispositivo y una escena
distintos por producto (dos laptops a tres cuartos sobre piedra oscura se leían iguales).

| Producto | Carrusel y portafolio (mockup) | Highlight del home (sin mockup) |
|---|---|---|
| Rematch | `proyects/rematch/rematch-portada-v2.jpg`: celular sobre la pala de pádel, de noche | `highlights/rematch-v2.jpg`: líneas de cancha que se vuelven llaves + buscador, cancha reservada y llaves reales |
| LumioLearn | `proyects/lumiolearn/lumiolearn-portada-v4.jpg`: tableta en un escritorio violeta | `highlights/lumiolearn-v8.jpg`: haz de luz que cae en la estrella + Lumen, certificado y notas de quizzes |
| Bookit | `proyects/bookit/bookit-portada-v2.jpg`: laptop sobre mármol verde | `highlights/bookit-v4.jpg`: casillas de agenda que se encienden + dirección propia, web del negocio y «Confirma y paga» |
| Vendiq | (sin ficha) | `highlights/vendiq.jpg` sin cambios: su tablero flotando sobre la rejilla azul ya es este formato |

**La fórmula del highlight:** una escena abstracta de Higgsfield que sea la metáfora de la marca
(16:9 high 2k, sin texto ni pantallas, mitad izquierda oscura y vacía) + dos o tres recortes
reales de su UI (`capturas-saas/highlights/`) con giro 3D suave, sombra honda y filo del color de
marca + el logo blanco arriba a la izquierda. HTML en `capturas-saas/brandvm-casos/highlights.html`
(lienzos de 1200×750 con `data-salida`); render con `PRUEBA=<carpeta> node scripts/render-highlights.cjs`
para revisar, y sin `PRUEBA` para escribir en `public/images/highlights/`. Tienen que leerse a
360 px de ancho: pocas piezas y grandes, con aire alrededor del texto del recorte.

Escenas (cambiar solo la metáfora y los hex):
- Rematch: *thin glowing lime green lines (#B5E000) drawn on a deep navy matte floor (#001D30) form the markings of a padel court that branch and merge like a tournament bracket, seen from a low elevated angle…*
- LumioLearn: *a single soft beam of violet light falls diagonally from the upper right through deep darkness onto a matte deep indigo surface… a small soft four-pointed star-shaped glint where the light touches the surface…*
- Bookit: *a loose, slightly tilted grid of soft matte rounded square tiles in deep pine green (#012B21)… a few tiles glow from within with a fresh bright green light (#01C85C) as if booked… one glowing tile carries a small round luminous dot…*
- Cierre común: *large calm dark negative space on the left half. Abstract, elegant, cinematic, fine grain. No people, no text, no logos, no screens.*

## Quinta vuelta: una idea por portada (2026-09-13)

La cuarta vuelta (escena abstracta + tres recortes de UI flotando e inclinados) se rechazó:
*"no me gusta, se ve desordenado y igualitos los 3, inventa algo mejor"*, *"busca referencias
para inspirarte"*, *"el estilo de Rematch sí estaba interesante"*.

**Referencias** (`referencias/portadas-2026-09-13.md`, doce índices de trabajo: Koto, Mouthwash,
Clay, Further, Collins, Porto Rocha, Ramotion, Instrument, Fantasy, Basement, Metalab, Work & Co):
ninguna portada es un collage de UI; cada una es una sola idea grande, y la variedad está
**entre** portadas (símbolo plano · objeto 3D · material del mundo con el sello · tipografía de
campaña), no dentro de una.

| Producto | Tratamiento | Escena (Higgsfield, 16:9 high 2k, 3 créditos c/u) | Archivo |
|---|---|---|---|
| Rematch | El material de su mundo: llaves de torneo simétricas pintadas en lima sobre césped navy, visto desde arriba. En el centro, donde convergen, **el único recorte real**: un partido de Rematch Live (FLORES Ana 3 · CASTRO Lucía 0, torneo demo). Logo centrado arriba | `escenas/rematch-llaves-simetricas.png` | `highlights/rematch-v3.jpg` |
| LumioLearn | Su símbolo hecho objeto: la estrella de cuatro puntas de vidrio esmerilado, encendida en violeta, de pie sobre un libro abierto en blanco. Sin UI | `escenas/lumio-estrella-libro.png` (descartada: `lumio-estrella-flotando.png`, más genérica) | `highlights/lumiolearn-v9.jpg` |
| Bookit | Su firma hecha objeto: una superficie pino con casillas vacías en filas exactas y una sola con la esfera brote (la reservada, el punto del «it»). Velo pino arriba a la izquierda para el logo. Sin UI | `escenas/bookit-punto-reservado.png` | `highlights/bookit-v5.jpg` |
| Vendiq | Sin cambios: un solo producto en una escena limpia | — | `highlights/vendiq.jpg` |

Descartado en esta vuelta: la tipografía de campaña para Bookit («De tu web *a tu agenda*») —
la superficie con la casilla reservada dice lo mismo sin texto y no compite con el panel de
texto de la sección.

### Sexta vuelta: la pasé por el crítico de contexto limpio (2026-09-13)

La quinta vuelta no llegó a Alexander como definitiva: un subagente sin mi razonamiento
(DIVERGENCIA.md § 3) la tumbó con cosas que yo no había visto:
- **LumioLearn y Bookit gemelas**: render oscuro de un color, un objeto brillante a ~70 % del
  ancho, aire a la izquierda y el logo arriba a la izquierda. «Cambiándoles el color son
  intercambiables». Justo el «igualitos» de Alexander, que yo había resuelto solo en el concepto.
- **Sin sistema**: logos en dos posiciones y cuatro tamaños; el de LumioLearn ilegible a 360 px.
- **Nada se entendía sin leer**: la bola distinta entre iguales es metáfora de banco de
  imágenes; el libro con luz mágica, portada de stock; las llaves no decían «reservar cancha».
- Rematch: líneas «peludas» y la tarjeta blanca pegada encima. Vendiq, la más débil de todas
  (suelo Tron, panel recargado) — no se tocó: no estaba en el pedido.

**Receta común desde aquí:** la escena del mundo del producto + **una sola pieza real de UI que
diga la tarea** + el logo siempre arriba a la izquierda con el mismo peso óptico (Rematch 34 px,
LumioLearn 42 px, Bookit 34 px de alto sobre 1200×750). **Composición distinta por producto.**

| Producto | Composición | Escena | Pieza real | Archivo |
|---|---|---|---|---|
| Rematch | Simétrica: llaves lima nítidas sobre cancha acrílica lisa que convergen en la caja central | `escenas/rematch-llaves-cancha.png` (escalada 1.07 y bajada 24 px para centrar en alto) | La cancha elegida al reservar: «Básquet Indoor · S/ 60.00/hora ✓» (`highlights/rematch-cancha.png`) | `highlights/rematch-v4.jpg` |
| LumioLearn | Asimétrica: pieza a la izquierda alineada al logo, objeto a la derecha | `escenas/lumio-estrella-flotando.png` (la estrella de vidrio con su charco de luz; el libro se descartó por stock) | Lumen respondiendo «¿Cuándo termina el módulo 2?» (`highlights/lumio-lumen.png`) | `highlights/lumiolearn-v10.jpg` |
| Bookit | Retícula: la semana L M M J V S D sobre 7 × 4 casillas, la J en brote, la esfera en el jueves | `escenas/bookit-semana-a.png` (ortogonal; `-b` casi igual, descartada) | La cita de «Confirma y paga»: «Evaluación inicial · Jue 16 · 16:30 · Diana» (`highlights/bookit-cita.png`) | `highlights/bookit-v6.jpg` |

Las posiciones se **midieron** sobre las escenas (centroide de la esfera verde, mínimos de sombra
de las casillas corregidos por el desfase de la esfera, bordes lima de la caja, bbox de la
estrella) en vez de a ojo sobre una miniatura. Escenas nuevas: 3 generaciones, 9 créditos.

Descartes con su porqué:
- *Escena + tres recortes inclinados* → desordenado y repetido (Alexander).
- *Una idea sin UI por portada* → dos gemelas y ninguna se entendía sin texto (crítico).
- *Partido de Rematch Live en el centro* → decía torneo, no reserva; y tarjeta plana pegada sobre textura rugosa.
- *Horario de Rematch Live* → son mesas de tenis de mesa, no canchas.
- *Tipografía de campaña para Bookit* → la semana con la cita real dice más sin competir con el panel de texto.

### Séptima vuelta: segunda pasada del crítico (2026-09-13)

La sexta vuelta llegó a la web, pero la segunda pasada del crítico encontró tres problemas:
- **Rematch y Bookit otra vez con la misma plantilla**: fondo liso + un patrón a todo el ancho + una tarjeta blanca chica con la misma anatomía (cuadrado a la izquierda, título, línea gris). Además, «una tarifa por hora dentro de la casilla de la final no tiene sentido».
- **LumioLearn la más genérica**: la estrella de vidrio flotando es «el ícono por defecto de producto con IA»; se leía chatbot, no academia.
- **Bookit** (la mejor, la única que se entiende sin texto): la tarjeta dejaba medio hoyo asomando y parecía un error.

Cambios:

| Producto | Qué cambió | Archivo |
|---|---|---|
| Rematch | En la caja de la final, **la final real** del torneo demo de live.rematch.pe (FLORES Ana 3 · RAMIREZ Paula 0) **en modo oscuro**, capturada a 4x con el botón «Cambiar a modo oscuro» del sitio (no respeta `prefers-color-scheme`): `rematch/torneo-demo/final-se11-oscuro-partido.png`. Encaja en la caja (2.24 vs 2.27) y deja de ser «tarjeta blanca» | `highlights/rematch-v5.jpg` |
| LumioLearn | Fuera la estrella. La clase real del tenant propio de demo (pestañas Video/Transcripción/Quiz, video, «Capítulo 2 de 4 · Gobernanza y cultura organizacional») grande y saliendo por la derecha, y Lumen respondiendo «Tienes 3 lecciones pendientes» a la izquierda; el haz violeta de `lumio-mundo-haz.png` cae desde arriba. Recortes: `highlights/lumio-clase.png`, `highlights/lumio-lumen-respuesta.png` (sin puntos, botones ni la línea de marketing) | `highlights/lumiolearn-v11.jpg` |
| Bookit | La cita a 414×90: tapa entera las casillas de V y S | `highlights/bookit-v7.jpg` |

Composiciones finales, distintas entre sí: **gráfica simétrica** (Rematch), **producto grande a sangre + tutor** (LumioLearn), **retícula con evento** (Bookit). Nombres de archivo nuevos en cada vuelta: la caché de `next/image` sirve la versión vieja si se sobrescribe el mismo nombre.

### Vendiq con marca nueva (2026-09-14)

Vendiq publicó su rediseño y tiene ficha propia (CASO-VENDIQ.md). Su highlight pasa a la receta
de la séptima vuelta: `highlights/vendiq-v2.jpg` = peldaños de concreto con estelas de luz azul
(`escenas/vendiq-mundo-peldanos.png`, corrida a la derecha para dar lugar) + la venta real de
vendiq.pe a 4x («Venta registrada · Pedido #1482 · S/ 189,90») sobre el peldaño más alto + logo
nuevo (`logos/vendiq-v2.png`) arriba a la izquierda. Composición **diagonal**. Con esto las
cuatro portadas comparten receta y tienen composiciones distintas: diagonal (Vendiq), simétrica
(Rematch), partida con producto a sangre (LumioLearn) y retícula (Bookit). El `vendiq.jpg`
anterior (suelo neón tipo Tron + panel recargado, la más débil según el crítico) queda sin uso.

### Vendiq v3: la línea técnica (2026-09-14, horas después)

Vendiq volvió a rediseñar su portada (commit `45ae893e`): dejó los pedestales y las fotos de objetos
por una «línea técnica» (grafito con rejilla, interfaz dibujada, un solo pedido #1482). El highlight
de peldaños (`vendiq-v2.jpg`) quedó contradiciendo a la marca y se reemplazó por `vendiq-v3.jpg`:
**el mundo y la pieza real son lo mismo**, su rejilla técnica con el flujo dibujado de una venta
(celular → inventario → boleta SUNAT, con etiquetas punteadas numeradas), capturado de vendiq.pe
con el texto del hero oculto, + logo arriba a la izquierda. Composición de **diagrama en
perspectiva**, distinta de la simétrica (Rematch), la partida (LumioLearn) y la retícula (Bookit).

### Octava vuelta: Rematch y Bookit dejan de ser la misma portada (2026-09-25)

**El problema.** Puestas las cuatro juntas, Rematch v6 y Bookit v7 eran la misma portada con otro
color: fondo liso de un solo tono + un patrón gráfico a todo el ancho (las llaves / la retícula de
la semana) + una tarjeta blanca chica encima. Además la pieza de UI de Rematch medía 296 px de
ancho sobre 1200: a 360 px era una mancha. LumioLearn y Vendiq, en cambio, traen la UI grande.
Esta vuelta las rehace **sobre escenas fotográficas del mundo de cada producto** y les da
**ideas opuestas**: Rematch habla de **cantidad** (el día entero, cuatro canchas, muchas reservas)
y Bookit de **singularidad** (una sola hora que se aparta).

| Producto | Composición | Escena | Pieza real | Archivo |
|---|---|---|---|---|
| Rematch | Cenital y simétrica: la agenda centrada sobre las cuatro pistas | `escenas/rematch-aerea-a.png` — aérea nocturna de cuatro pistas de pádel de cristal | La **«Agenda de hoy» entera** del hero de rematch.pe: Pádel 1..4 × 17:00–21:00, 5 reservas, las nuevas en lima (`rematch/piezas-2026-09/agenda-completa.png`, 2456×1412) | `highlights/rematch-v7.jpg` |
| Bookit | Macro en diagonal: el selector de hora al costado de la losa encendida | `escenas/bookit-losas-a.png` — fila de losas de pino, una sale adelante encendida en verde | El **selector de reserva** de bookit.com.pe: servicio, profesional, día y horas libres, con el 16:30 elegido (`highlights/bookit-elegir-hora.png`, 1408×980) | `highlights/bookit-v9.jpg` |

#### La pieza de Rematch: cómo se consiguió entera

`agenda-tarjeta.png` (la que había) es un recorte con el **teléfono del jugador encima**, que tapa
la columna Pádel 4 y corta la palabra «Pádel» a media letra. La agenda es un componente real
(`REMATCH/src/components/web/AgendaHero.tsx`) y el propio sitio **esconde ese teléfono por debajo
de 1280 px** (`max-xl:hidden`). Capturando rematch.pe **a 1270 px de ancho y ×4**, y esperando a
que el ciclo de la animación llegue a «5 reservas», sale la tarjeta **completa y sin trucos**:
cabecera con «Agenda de hoy · Tu club · Pádel · 5 reservas», las cuatro canchas y las cinco horas.
No se retocó nada: es lo que sirve el sitio en un portátil.

*Pádel 4 sale vacía* porque el hero está fijado a `variante="celular"`, que filtra las reservas de
esa cancha (estaban debajo del teléfono). Se dejó así: es el estado real del sitio, y una cancha
libre es un mensaje correcto para un producto de reservas. La alternativa —levantar el proyecto en
local para forzar `variante="base"`— habría añadido **una** reserva más; no compensa.

#### Por qué NO se alinearon las columnas con las canchas

La idea «cada cancha es una columna» **no cierra, y la cuenta lo demuestra**: la agenda tiene
**cinco** columnas (horas + 4 canchas) y la escena sólo **cuatro**.

- Escena (recorte `cover` de 2688×1520 → `(128,0,2560,1520)`, factor 0,4934): centros de cancha en
  x = **135 · 449 · 756 · 1070**, paso **312**; superficie de juego y = **215..683**.
- Tarjeta (2456×1412): líneas verticales medidas en x = **233,5 · 789,5 · 1341,5 · 1897,5** →
  paso **555,3**. Para que su paso fuera 312 px hace falta escala 312/555,3 = **0,5619**, o sea
  una tarjeta de **1380 px de ancho** sobre un lienzo de 1200. Imposible sin sacrificar la columna
  de horas (se iría fuera por la izquierda, con «18:00» cortado) o la cancha 4.
- Recortar la tarjeta a 2 o 3 canchas tampoco sirve: cortaría la cabecera («Agenda de hoy» y la
  píldora «5 reservas» cruzan todo el ancho) y volvería a la queja de *«está incompleto»*.

> La estimación previa de «~1010 px de ancho» era optimista; medido sobre la captura real, son
> 1380. La conclusión no cambia, pero el número sí.

**La rima no la da el píxel, la da el punto de vista**: la foto es el plano del club visto a plomo
y la tarjeta es el plano del día. Se leen igual, en la misma dirección, sin que nadie cuente
columnas. Eso es lo que sustituye a la alineación.

#### Medidas finales (sobre 1200×750)

| | Rematch v7 | Bookit v8 |
|---|---|---|
| Escena | `rematch-aerea-a.png`, sin transformar | `bookit-losas-a.png`, sin transformar |
| Pieza | 740 × 425 en **(230, 250)** | 722 × 157 en **(64, 455)** |
| Por qué ahí | centrada (230 de margen a cada lado); el borde inferior cae en 675, justo sobre el filo de las canchas (683), y por arriba asoma la franja de **techos de cristal encendidos**, que la ata a la escena. Con 800 de ancho las canchas 1 y 4 se volvían rodajas | el borde derecho en **786** besa la cara encendida (x 786..869, centroide 827,419) sin taparla —son sólo 83 px de ancho— y crece hacia la izquierda sobre la masa oscura (x 20..600, y 420..730). Su borde izquierdo es **el mismo del logo (64)**: una sola columna |
| Filo | anillo lima `rgba(180,223,0,.35)` 1,5 px | anillo verde `rgba(1,200,92,.30)` 1 px + degradado verde del 14 % en el 20 % derecho: la luz de la losa cayendo sobre la tarjeta |
| Logo | `rematch.png`, 34 px, (64,44); zona segura (0,0,380,187), contraste 19:1. Nunca centrado arriba: ahí hay un halo | `bookit-v2.png`, 34 px, (64,56); zona segura (0,0,480,163), contraste 16,9:1 |

#### Descartes de esta vuelta, con su porqué

- **Agenda a 900 px, casi a sangre** (`pr-a`): la más legible, pero las canchas quedaban en dos
  rodajas y la portada se leía como «captura de pantalla con marco oscuro». La escena no aportaba.
- **Agenda a la derecha, canchas a la izquierda** (`pr-b`): se entendía, pero dejaba el cuadrante
  superior derecho muerto y la composición coja.
- **Escena escalada 1,10** para comer el azul vacío de arriba (`pr-d4`): ganaba poco y cortaba las
  canchas 1 y 4 contra los bordes; con las cuatro enteras la simetría es más limpia.
- **Tarjeta más arriba, tapando los techos** (`pr-d2`): pierde la franja de cristal encendido sobre
  el borde superior, que es lo que evita que la tarjeta flote.
- **Cita de Bookit encima de la losa**: la taparía (83 px de ancho); y **más arriba, en el aire**
  (`pb-c`): sin la masa oscura debajo parecía un globo suelto.
- **Degradado verde al 20 %** sobre la cita: teñía el blanco en vez de parecer luz. Bajado al 14 %.

#### Estado del sistema

Las cuatro se leen ahora como cuatro ideas distintas, comprobadas a 1200 y a 360 px una al lado de
la otra: **diagrama en perspectiva** (Vendiq), **cenital simétrica / cantidad** (Rematch),
**partida con el producto a sangre** (LumioLearn), **macro en diagonal / singularidad** (Bookit).
A 360 px ninguna se lee palabra por palabra —no puede: 12 px de UI son 3,6 px— y no hace falta:
lo que tiene que leerse es la **forma**. Bookit es la más clara de las cuatro (losa encendida +
barra blanca con icono de calendario); Rematch, la más justa (rejilla con manchas lima sobre
canchas), pero ya no es la mancha que era en la v6.

Nombres nuevos en cada vuelta (`rematch-v7.jpg`, `bookit-v9.jpg`): la caché de `next/image` sirve
la versión vieja si se reutiliza el nombre. `rematch-v6.jpg`, `bookit-v7.jpg` y `bookit-v8.jpg` borrados.

#### Corrección de Bookit el mismo día: v8 → v9, «que parezca web de reservas»

Alexander vio la v8: *«no está mal la idea pero dale un ajuste para que en verdad parezca web de
reservas»*. La escena se entendía («apartar una hora»), pero **la tarjeta de la cita es el
resultado de reservar, no la pantalla donde alguien reserva**. Faltaba el producto. Escena,
composición y logo se quedaron como estaban; cambió sólo la pieza de UI.

**Pieza nueva**: el selector real de bookit.com.pe, sección «De tu web a tu agenda», paso 02
(`Bookit-web-publica/src/components/landing/EscenasRecorrido.tsx` → `EscenaHorario`). Capturado a
1440 px × 4 DPI screenshoteando el elemento de la tarjeta blanca, tras bajar hasta la escena y
esperar a que el 16:30 se encienda en brote (`rgb(1,200,92)`, comprobado con `getComputedStyle`)
y entre el cursor. Sale en `capturas-saas/highlights/bookit-elegir-hora.png` (1408×980, relación
1,437). Trae las cuatro cosas de una reserva: **servicio** («Evaluación inicial · Fisioterapia ·
45 min»), **profesional** (Diana, Luis, Mónica), **día** (Lun 13 … Vie 17, con el Jue 16 elegido)
y **horas libres** con una tomada. Es demo propia de Bookit —«Tu consultorio»—, no la web de
ningún inquilino (los de `capturas-saas/bookit/clientes/` quedan fuera por regla).

**El hallazgo que hace la portada**: el chip verde del 16:30 y la losa encendida son **el mismo
gesto** —una hora que se aparta de las demás— y quedan uno al lado del otro. La escena deja de ser
decorado y pasa a rimar con la UI.

**Medidas**: pieza 640×445 en (146,235), borde derecho en 786 besando la cara encendida; centro
vertical 457, a la altura de esa cara (200..636). Se probó también a 722 de ancho pegada al borde
izquierdo del logo (64), como en la v8: más legible a 360, pero tapaba casi toda la fila de losas
oscuras de la izquierda y dejaba sólo 43 px por debajo — se leía «captura sobre un fondo». Con 640
la fila se ve a los dos lados de la encendida y abajo queda la base. A 560 (probada) las horas ya
no se leían a 360.

Descartes de pieza: `bookit/pieza-reserva.png` (es la marca vieja, azul marino); `bookit-paga.png`
(«Confirma y paga» con Mercado Pago y el total) — también es el final del viaje, no el momento de
elegir; `bookit-servicios.png` (la lista de servicios) — dice «catálogo», no «reserva». Las
demos `tuconsultorio.bookit.com.pe` y `demo.bookit.com.pe` no resuelven, así que el selector del
propio bookit.com.pe es la UI de reserva real disponible.
