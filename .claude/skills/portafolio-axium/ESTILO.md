# Estilo — qué hace llamativa una web, medido

Alexander pidió el 2026-09-01: *"añade a tu skill algunos patrones de qué hacen
esa web llamativa: la combinación de colores, fuentes y combinación de fuentes
usadas, etc., así tal vez podrías darme ideas de cómo rediseñar un hero
section, un call to action de la web"*.

Este archivo es la **tabla comparativa de estilo** de las 13 referencias, en
las mismas columnas, para leerse en vertical: "¿qué hacen todas con el CTA?",
"¿cuántas usan dos familias?". Los datos salen de `extraer.js` corrido sobre la
página real (colores computados, tamaños en px), no de la impresión visual. Las
fichas en `referencias/` tienen el detalle; acá está la comparación.

Alcance: **inspira el hero y el CTA de toda la web de Axium**, no solo el
portafolio. Pero la regla de `SKILL.md` sigue: hasta que Alexander lo pida, se
proponen ideas en `.md`, no se toca código.

---

## Paleta — cuántos colores y para qué

| Referencia | Lienzo | Texto | Acento(s) | Nº | Dónde va el acento |
|---|---|---|---|---|---|
| brandvm | blanco `#FFF` | negro | rojo (botón, palabra "Work"), celeste (palabra del hero) | 4 | una palabra del titular + el botón principal |
| fitdesign | **gris cálido `#EEECEB`** + dot-grid | negro `#1B1B1B` | **lima `#C8FF00`**, negro sólido | 3 | **solo en lo clicable** |
| magnetic | **carbón `#232323`** | humo `#F2F2F2`, gris cálido `#BAB8AC` | oro `#B59756` (etiquetas), naranja `#D53703` (un punto) | 5 | micro-etiqueta sobre el título |
| locomotive | blanco `#FFF` | negro `#000` | **ninguno** | 2 | — |
| uncommon | **negro `#121212`** | blanco 100/70/60 % | **ninguno** | 2 | — |
| undersight | gris `#F8F8F8` + dot-grid | `#141414` | rojo puro `#FF0000` (detalle) | 3 | un detalle |
| heartbeat | gris `#F6F6F6` | `#333`, `#888` | **ninguno** | 3 | — |
| fiddle | **lavanda `#C8C2CF`** (índice) / casi negro `#101214` (hero, ficha) | `#101214`, lavanda oscuro `#A399A8` | ninguno fuera del matiz: lavanda claro `#E6DFE4` para tarjetas | 4 en un matiz + negro | **el lienzo es el color de la agencia** |
| adelt | blanco + panel hueso `#F5F4F0`; barra lateral `#27262B` | `#27262B` | **naranja `#FF661A`** | 3 + acento | badge del premio + texto del CTA; nada más |
| isadora | **crema `#FCF1E6`**; bloques violeta oscuro `#250841` | `#210B39` | **violeta `#8C20F8`** (todos los botones) | 3 + acento | solo botones y el círculo del "Let's Talk" |
| pentagram | blanco | `#1A1A1A`, gris `#767676`, gris 56 % | **ninguno** | 3 | — (jerarquía por gris) |
| raggededge | blanco | verde-negro `#181F1F` | menta translúcida `rgba(220,242,235,.6)` en píldoras | 3 | nav; la activa en verde-negro |
| koto | **casi negro `#141414`** | blanco, gris `#989898`, `#595959` | **ninguno** | 3 | — |

**Lo que se repite:** el acento es **uno o ninguno** y aparece en **≤ 2
lugares**. 4 de 7 no tienen acento propio: el color lo traen las imágenes de
los clientes. Nadie usa dos acentos con el mismo peso.

**Tercer camino (fiddle):** ni policroma ni neutra — **un color de agencia
como lienzo** (lavanda en 4 tonos) y las imágenes encima. Con el navy de Axium
sería exactamente esto.

**Lo que se repite (2):** **8 de 13 no usan blanco puro** (las cinco blancas:
brandvm, locomotive, adelt —con panel hueso—, pentagram, raggededge). Las
comerciales que Alexander aprobó van al blanco *con* un neutro cálido al lado
(adelt: hueso; isadora: crema). Gris cálido, gris
frío, carbón, negro. Las dos que Alexander llamó "buen estilo" y "buena
referencia" (magnetic, fitdesign) están en ese grupo.

**Axium hoy:** blanco + navy `#060C20` + azul `#0072CF` + teal `#7ECFC3`. Los
dos acentos aparecen en chips de filtro y hover — en lo *menos* importante.

**Ideas** (no decisiones): (1) lienzo con temperatura — un hueso o gris cálido
en vez de blanco, o el navy como lienzo oscuro; (2) **un solo acento** (azul o
teal) reservado al botón principal y a una palabra del hero; el otro baja a
detalle o se retira; (3) los chips de filtro en negro sólido / navy, no en
color.

---

## Tipografía — familias, parejas y escala

| Referencia | Display | Cuerpo | Cómo contrastan | Escala (px) | Gesto |
|---|---|---|---|---|---|
| brandvm | **Instrument Serif itálica** | Inter Variable | serif itálica vs. grotesca | 68 → 34 → 13.7 | **una palabra en serif itálica** dentro del titular grotesco |
| fitdesign | Aspekta 600 | Aspekta 400/500 | misma familia, peso y tamaño | 68 → 64 → 38 → 32 → 20 → 16 → 14 | **segunda mitad del titular en itálica** |
| magnetic | **Fragment** serif MAYÚSCULAS | Aeonik | serif caja alta vs. grotesca | 59 → 54 → 33 → 20 → 14 | etiqueta oro pequeña encima del título |
| locomotive | LocomotiveNew (propia) | HelveticaNowDisplay | **por tamaño**; todo peso 400 | **110** → 28 → 15 → 13 | el nombre del proyecto a 110px |
| uncommon | Neue Montreal | Neue Montreal | misma familia, **rango 9→120** | 120 → 68 → 45 → 24 → 14 → 11 → 9 | micro-labels 9–11px; `↳` antes de cada acción |
| undersight | SF-like | SF-like | misma familia | 43 → 29 → 20 → 14 | **el título es pequeño** (29px): las imágenes mandan |
| heartbeat | **Azeret Mono 900** MAYÚSCULAS | Azeret Mono 300/400 | **peso extremo 100↔900** en una mono | **161** → 47 → 33 → 16 → 12 | titular-párrafo de tres líneas en mono 900 itálica; "Next case" en 100 |
| fiddle | KH Teka 400 | KH Teka 400 + **KH Teka Mono 11px MAYÚSCULAS** para toda la metadata | grotesca grande vs. su mono diminuta | 84 → 63 → 47 → 36 → 20 → 15 → **11** | **la mono de 11px es la fuente con más texto de la página**; el "19" y el "All" a 84px; japonés como textura |
| **adelt** | **Gilroy 500/600** | **Gilroy 400** | **la misma familia de Axium**, tres pesos | 54 → 35 → 32 → 25 → 22 → 18 → 16 → 14 | ningún gesto: rigor. El H1 de la ficha a 32px; el nombre no manda, las imágenes sí |
| isadora | **Roslindale Display 700** (serif) | Saans 300–600 | serif negrita vs. grotesca | 90 → 60 → 50 → 46 → 30 · 40 → 22 → 20 → 16 → 14 | nombre del cliente a 90px en serif sobre su foto con velo |
| pentagram | Plain 500 | Plain 400 | **por color, no por tamaño**: todo en 16 y 13 px | 52 → 32 → 19 → 16 → 13 | el H1 "Pentagram" a 19px; la marca no grita |
| raggededge | **ABC Diatype Expanded Bold** | Grit 400/500 | **por ancho**: grotesca expandida vs. normal | 78 → 40 → 20 → 12 · 30 → 20 → 16 → 14 | wordmark gigante cortado arriba; el dato de negocio en la expandida |
| koto | gtKotoheim **Condensed** 300 | gtKotoheim 350/400 + **Mono 9–11px** | **por corte** (condensada / normal / mono), todo pequeño | **24** → 16 → 14 → 12 → 9 | la voz sale de la densidad; conteos en mono de 9px |

**Lo que se repite:** dos niveles de tamaño muy separados, sin intermedios
(7/13). **Una itálica, una serif, un peso, un ancho o un corte como acento** —
nunca como sistema (10/13). Nadie usa serif para cuerpo.

**Cuatro formas de contrastar, todas vistas:** por tamaño (locomotive,
uncommon), por peso (heartbeat), **por ancho** (raggededge: expandida vs.
normal), **por corte** (koto: condensada / normal / mono) — y **por color con
todo del mismo tamaño** (pentagram). Axium tiene GuarujaTitle + Gilroy: puede
contrastar por tamaño y por familia; le falta una mono para el tercer corte.

**Adelt usa Gilroy 400/500/600 y nada más, y Alexander lo llamó "buen
estilo".** Es la prueba de que la fuente de Axium alcanza; lo que falta es la
escala (54 → 14 en siete pasos) y la disciplina de tres pesos.

**Lo que se contradice (T6):** una familia con rango (fitdesign, uncommon,
undersight, heartbeat) vs. pareja (brandvm, magnetic, locomotive). Las dos
funcionan; la de una familia es más barata y es la de las referencias que
Alexander llamó "creativas".

**Axium hoy:** Gilroy 400/500/600/700 + GuarujaTitle. Ya tiene pareja; no
tiene **gesto**. Y `globals.css` declara los cuatro Gilroy como `font-style:
normal` → **no hay itálica real**; una sintética se ve mal.

**Ideas:** (1) GuarujaTitle **enorme** (100px+) solo para el nombre del
proyecto o una palabra del hero, y nada intermedio — P3; (2) GuarujaTitle en
MAYÚSCULAS pequeñas como etiqueta de sección, al modo Fragment; (3) titular
como párrafo de 3 líneas en Gilroy 700 mayúsculas (heartbeat) — sin comprar
fuentes; (4) rango de Gilroy hacia abajo: micro-labels de 10–11px con tracking
para metadata (uncommon).

---

## Hero — anatomía

| Referencia | Fondo | Titular | Sub / meta | Acción en el hero | Altura | Qué lo hace llamativo |
|---|---|---|---|---|---|---|
| brandvm (índice) | **tarjeta negra redondeada** con el isotipo enorme al 10% | "Selected projects built with *world's leading brands.*" 68px blanco, acento celeste itálico | — | ninguna | ~600px | el hero es una tarjeta con radio, no una sección a sangre |
| fitdesign | gris cálido + dot-grid, sin imagen | "Selected work — *and the results behind it.*" 68px | párrafo a la derecha | **pestañas de industria** | ~450px | **el hero es el filtro** |
| magnetic (ficha) | **foto/video a sangre con velo**, badge del premio colgando | "REBRANDING THE FUTURE…" serif 59px MAYÚSCULAS | etiqueta oro "VVATER" | — | 100vh | atmósfera + isotipo como marca de agua |
| locomotive (ficha) | blanco | nombre 110px serif abajo a la izquierda | fila 13px arriba: "Case Study · Digital Experience Content"; abajo: "©2025 · Automotive · San Francisco" | — | ~70vh | **retícula tipográfica**: imagen debajo del pliegue |
| uncommon (/studio) | negro | "Design that comes from the heart and mind" 68px, arranca en la col. 2 | rail `/STUDIO` a la izquierda | "MENU ●" píldora | 100vh | aire a la izquierda; foto a sangre debajo |
| undersight (ficha) | gris + dot-grid | **párrafo** de 43px como título ("Great Great Great is a small interactive web experiment…") | breadcrumb en píldoras | toggle de vista | ~600px | el título es un párrafo; sin H1 grande |
| heartbeat (ficha) | gris | **párrafo en mono 900 itálica MAYÚSCULAS**, 46px, 3 líneas | chips con borde + **"client cast / team cast"** | "Read full story ↓" | ~600px | créditos como película; el titular es la frase completa |
| fiddle (índice) | casi negro con **retícula de líneas verticales**, foto vertical chica a la derecha | "An agency focused on high-complexity UI, experienced as simplicity." 27px a la izquierda | marquee "プロジェクト • WORK •" | fila de control: "All ▾ · GRID/LIST · **19**" | ~460px | el hero es un instrumento: retícula, ©, marquee, conteo gigante |
| fiddle (ficha) | casi negro | nombre **centrado a 84px** | **2 filas de 3 columnas**: "© 2024 · USA · Archived" / servicios · descripción · miniatura | `↓` | 100vh | **la retícula de metadata** — todo lo que Axium tiene en el JSON, ordenado |
| adelt (ficha) | blanco | **panel fijo hueso** a la izquierda: nombre 32px, meta, chips, "Process" + párrafo, badge naranja del premio | botón Behance + píldora "Website ↗" | — (panel sticky) | 100vh | **panel + columna de mockups**: la metadata siempre visible mientras bajás |
| isadora (ficha) | **foto del cliente con velo de su color** | nombre en serif 90px centrado, hairline debajo | panel sólido rosa con la descripción; nav **← Upli →** | círculo `↓` | 100vh | el cliente ES el hero: su foto, su color, su nombre |
| pentagram (índice) | blanco | "Work" 52px | "Showing the latest 40 projects" | **filtro-frase** "We design [Everything] for [Everyone]" flotante | ~300px | el filtro es una oración con dos desplegables |
| raggededge (índice) | blanco; **wordmark gigante cortado arriba** | "All our partners have what it takes" 78px expandida | píldoras Featured / Everything | nav de píldoras menta | ~600px | la marca como techo de la página |
| koto (hub) | casi negro | "Our work" **24px** condensada light | dos entradas (Projects / Partnerships) + "Channels" con conteo | — | ~500px | un hub que reparte, no una grilla |

**Patrones:** hero **tipográfico sin imagen sobre el pliegue** en 9/13 (P9).
Nuevo: **el hero de la ficha con la metadata del JSON ordenada** (fiddle en
retícula, adelt en panel fijo, isadora en panel sólido) — tres formas de lo
mismo, y Axium tiene todos los campos. El
titular **con un acento** (itálica, palabra, peso) en 5/7. Metadata pequeña
alrededor del titular (rail, fila, créditos) en 4/7.

**Ideas para el hero de Axium:**
1. **Un acento tipográfico en el titular** — una palabra en GuarujaTitle
   dentro de una frase en Gilroy, o la segunda mitad en otro peso.
2. **El hero como tarjeta con radio** (brandvm): coherente con el `rounded-xl`
   que Axium ya usa en todo.
3. **El hero que ya es el filtro** (fitdesign): en `/portafolio`, titular +
   pestañas de industria sin scroll.
4. **Marca fantasma** del isotipo de Axium detrás del titular al 8–10%.
5. **Titular como párrafo** (undersight, heartbeat): "Construimos la marca, la
   web y la academia digital de Maintech" como H1, no "Maintech".
6. **Créditos**: "cliente · año · Lima · equipo" en micro-labels — Axium tiene
   los datos.

---

## CTA — anatomía del botón principal

| Referencia | Texto | Fondo | Texto | Radio | Padding | Fuente | Detalle |
|---|---|---|---|---|---|---|---|
| brandvm | "Start a Project" | rojo | blanco | píldora | — | Inter | único rojo de la página |
| fitdesign | "→ Request Homepage Preview" | **lima `#C8FF00`** | negro | 8px | 16×24 | Aspekta 500 16px | **oferta concreta** + flecha |
| magnetic | "START A PROJECT →" | carbón | blanco | **1px** | **22×58** | Aeonik 700 20px MAYÚSC. | bloque casi cuadrado |
| locomotive | "Let's talk" (nav) / "Case Study" | transparente | negro | 0 | — | Helvetica 15 | texto, sin botón |
| uncommon | "↳ Contact us" **120px** / "Book a 15 min call" subrayado | ninguno | blanco | — | — | Neue Montreal | **el CTA es una sección tipográfica**, no un botón |
| undersight | — (breadcrumb píldoras) | gris translúcido | negro | píldora | 0×24 | SF 20 | sin CTA comercial |
| heartbeat | "Let's talk" (nav) / "MENU" píldora borde | transparente | negro | píldora | — | Azeret Mono | sin botón sólido |
| fiddle | "Let's talk ⁺" (nav) / "Time to connect" + píldora con `↩` | lavanda claro | negro | píldora / 6px | 12×36 | KH Teka | CTA de cierre como sección con título + objeto 3D + píldora con glifo |
| adelt | "Discuss a project ↗" / "Schedule a call ↗" | negro `#27262B` | **naranja** (texto) o blanco | píldora 99px | 13×24–55 | Gilroy 16 | cierre: "Let's make something *engaging*" (palabra en naranja) + **dos** píldoras |
| isadora | "Partner With Us" / "All Case Studies" / "Let's Talk" | **violeta `#8C20F8`** | blanco | píldora 38px | 18×24 | Saans 20 | único violeta de la página; cierre en serif 50px "Let's collaborate, win new customers…" |
| pentagram | — (no hay CTA comercial) | — | — | — | — | — | el archivo es el CTA |
| raggededge | nav en píldoras; "See everything" | menta translúcida / verde-negro | negro / blanco | píldora 64px | 12×16 | Grit 16 | la activa sólida, las demás translúcidas |
| koto | "Projects" / "Partnerships" como entradas | — | blanco / gris | — | — | gtKotoheim 16 | sin botón: la navegación es el CTA |

**Lo que se repite:** **una sola acción primaria por vista**; el color del botón
**no aparece en ningún otro lado**; flecha en 4/7. **El texto nombra la oferta**
("Start a Project", "Request Homepage Preview", "Book a 15 min call"), nunca es
"Contáctanos" ni "Saber más". Y 4 de 7 **no usan un botón sólido**: el CTA es
texto grande, subrayado o píldora con borde.

**T8 resuelta por decisión:** Alexander eligió "lo comercial" → **píldora**
(brandvm, fitdesign, adelt, isadora, raggededge: las cinco comerciales usan
píldora). El cuadrado (magnetic) y el sin-botón (uncommon, koto) son de los
estudios de autor.

**Ideas para el CTA de Axium:**
1. **Oferta concreta en el texto**: "Te mostramos tu home rediseñado en 48h" /
   "Agenda 15 min" en vez de "Contáctanos".
2. **Un solo color de botón en toda la web**, que no se use en nada más.
3. **El CTA de cierre como sección tipográfica** ("↳ Hablemos" a 100px+ en
   GuarujaTitle) con un link pequeño y concreto debajo — uncommon.
4. Flecha `→` o `↳` como glifo de marca en toda acción.

---

## Movimiento — cuánto es demasiado

| Referencia | Entradas (opacity 0) | Librería | Video | Veredicto |
|---|---|---|---|---|
| brandvm | `no observable` | Webflow | 0 en índice | — |
| fitdesign | 2 | GSAP + SplitText | **14** miniaturas | positivo |
| magnetic | **71** | three.js, cursor | 2 | positivo ("buen estilo") |
| locomotive | 22 (+28 data-scroll) | locomotive-scroll | 3 | **"exagera en las animaciones de entrada"** |
| uncommon | 9–10 | propio (Next), cursor con imágenes | 0 | positivo ("creativos") |
| undersight | 3 | propio, cursor | 2 | negativo por volumen, no por movimiento |
| heartbeat | **56** | propio, cursor | **8 autoplay** en índice | positivo aspiracional |
| fiddle | 4 (índice) / **51** (ficha) | propio, cursor, marquee | 1 (índice) / **11 autoplay** (ficha) | "mucho nivel" (índice) / "aterrizable" (ficha) — sin mención al movimiento |
| adelt | **0** (ficha) / 28 (índice) | GSAP + **Lenis** (scroll suave) | 1–2 | "buen estilo" — **el modelo de sutil**: scroll suave + panel fijo, sin entradas en la ficha |
| isadora | 8 (ficha) / 140 (índice, contenedor propio) | GSAP | 2 autoplay | "buenos diseños" |
| pentagram | 46 | propio | 1 | "buen estilo" |
| raggededge | 48 | propio | **12** (pósters) | "buen estilo" |
| koto | **109** | propio | 0 en el hub | "presenta bien" |

Magnetic (71) y heartbeat (56) tienen **más** entradas que locomotive (22) y
Alexander no se quejó. **Hipótesis: el problema no es la cantidad sino que se
vea el mecanismo** — sobre blanco, con bloques que aparecen uno a uno al hacer
scroll, se nota como truco; en una atmósfera oscura o con imágenes que ya son
protagonistas, no. A confirmar preguntándole directamente.

**Corrección de Alexander (2026-09-01):** *"no recuerdo haber rechazado nada,
podríamos incluir animaciones sutiles"*. "Exagera" era grado, no veto. **Para
Axium:** animación sutil — entradas suaves, hover con intención, transición al
abrir la ficha — y evitar el bloque-a-bloque visible de Locomotive. El fade-up
actual de la tarjeta puede quedarse si se acorta el delay escalonado.

---

## Cómo se actualiza este archivo

Cada referencia nueva agrega **una fila a cada tabla** con los datos de
`extraer.js` (no a ojo). Cada 3–4 referencias se reescriben los párrafos de
"lo que se repite / se contradice" y las ideas. Las ideas se marcan como ideas
hasta que Alexander las vea.
