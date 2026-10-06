# Ragged Edge (Londres) — https://raggededge.com/partnerships

- **Analizada:** 2026-09-01 (índice)
- **Cómo llegó:** propuesta en COLA.md por la métrica en la tarjeta; Alexander: *"me gustó bastante su estilo de Pentagram, Ragged Edge"*
- **Capturas:** `capturas/raggededge/indice-desktop.jpg`, `indice-full.jpg`
- **Arquetipo de índice:** **lista de filas grandes** (texto a la izquierda, media 16:9 a la derecha), 10 destacados + "See everything"; tabs Featured / Everything
- **Tratamiento de imagen:** **video con póster** en 16:9, sin radio (12 videos en 22 medias)
- **Proyectos mostrados:** 10 destacados (+ archivo completo en "Everything")

## Veredicto de Alexander
> "me gustó bastante su estilo de Pentagram, Ragged Edge"

**Lectura:** positivo sobre el estilo. Lo que hace a Ragged Edge distinto de
todo lo visto: **cada fila lleva un resultado de negocio con número grande**
("$1.25 billion — Valuation within three months of the rebrand", "58% — Share
price increase…", "2,500 Target stores"). Es fitdesign (métrica en la tarjeta)
llevado a agencia de marca premium.

## 1. Promesa y audiencia
"All our partners have what it takes" (H1 78px). Agencia de branding para
marcas de consumo y tech en crecimiento (Granola, Wise, Papier, Palmetto).
Habla a fundadores y CMOs; **vende resultado, no estética** — cada proyecto se
presenta como "X committed to [propósito]. With a [rebrand] rolled out in…".
Llama a los proyectos **"partnerships"**, no "work".

## 2. Arquitectura del índice
**Hero** (captura `indice-desktop.jpg`): el wordmark **"RAGGED EDGE" en la
expandida, gigante y cortado por el borde superior** (S7 marca fantasma, pero
en negro sólido y sangrando arriba — la marca como techo de la página); debajo
la nav en píldoras menta con "Partnerships" activa en verde-negro; el H1 "All
our partners have what it takes" a 78px en dos líneas; las dos píldoras
**Featured / Everything**; una hairline; y arranca la primera fila con
"Granola" a la izquierda y el póster lima a la derecha.

**Lista de filas grandes**: cada proyecto una fila de 1361px × ~526px; a la
izquierda el bloque de texto, a la derecha el **video/póster 903×508 (16:9)**
sin radio. 10 filas en 9 760 px. Arriba, **dos pestañas: "Featured" /
"Everything"** — la vitrina y el archivo en la misma página, resuelto con un
toggle (S22). Nav de píldoras con fondo menta translúcido `rgba(220,242,235,.6)`
y la activa en verde-negro `#181F1F`.

## 3. Ritmo y curaduría
10 destacados en Featured; el resto detrás de "Everything / See everything".
**Es la respuesta a T7 (vitrina vs. archivo): las dos, con un toggle.** Ritmo
uniforme (todas las filas iguales); el color lo ponen los pósters.

## 4. Anatomía de la tarjeta (fila)
1. **Nombre 40px** en ABC Diatype **Expanded** Bold (una grotesca ancha —
   el gesto tipográfico).
2. **Frase de misión + qué se hizo**, 20px, misma fuente: "Granola committed
   to human progress. With a viral rebrand and campaign…".
3. **Métrica grande** en la expanded ("$1.25 billion") + **explicación** en
   Grit 20px ("Valuation within three months of the rebrand.").
4. Video/póster 16:9 a la derecha.
**Cuatro niveles y uno es un número.** Sin chips, sin país, sin año: solo lo
que importa al que compra.

## 5. Tratamiento de imagen
- **20 de 22 medias en 16:9**; 12 son **video** (con póster). Sin radio.
- Qué se muestra: el key visual/motion de cada marca (piezas de identidad en
  movimiento).
- Consistencia: ratio único + video en todas.
- Recetas: R16 (editorial a sangre dentro del 16:9) en video. **No
  transferible en medio** (Alexander no hace video) pero sí en **forma**: un
  16:9 por fila.
- Entregables: branding, campañas. Impresos dentro de los videos.

## 6. Filtro y navegación
Tabs Featured / Everything (S22). Nav de píldoras. Sin filtros por sector en
Featured.

## 7. Tipografía
**ABC Diatype Expanded Bold** para todo lo que pesa (78 → 40 → 20 → 12 → 10) +
**Grit** (grotesca normal) para explicaciones (30 → 20 → 16 → 14 → 12). El
gesto: **una grotesca *expandida* en bold como display** — ancha, sólida,
"con lo que hay que tener". Dos familias de la misma clase (grotesca) que se
distinguen por **ancho**, no por serif/sans. Camino nuevo en T6.

## 8. Color y fondo
Blanco de página · **verde-negro `#181F1F`** para texto, nav activa y bloques ·
**menta translúcida `rgba(220,242,235,.6)`** para píldoras de nav · negro para
video. Un neutro con matiz (verde) y un acento pálido: paleta de 3, muy
contenida. El color viene de los pósters.

## 9. Movimiento
48 elementos con `opacity: 0`; 12 videos con póster (no todos autoplay).
Moderado; los videos son el movimiento.

## 10. Prueba y credibilidad
**Es toda la tarjeta**: la métrica de negocio en cada fila. Axium tiene
`results: []` vacío en casi todos los JSON — para copiar esto hay que
**producir el dato con el cliente** (pedidos/mes, leads, tiempo de carga,
posiciones en Google). Sin el dato, la forma no se copia.

## 11. Ficha del caso y transición
*(pendiente)*

## 12. Firma y transferencia
- **La firma en una frase:** cada proyecto es una frase de misión, un
  resultado en número grande y un video 16:9, en una grotesca expandida.
- **Qué robar (y de qué capa):**
  - *Arquitectura*: **Featured / Everything** — vitrina de 6–8 destacados
    arriba y los 33 detrás de un toggle. Resuelve T7 para Axium.
  - *Tarjeta*: la **fórmula de texto** — "[Cliente] se propuso [misión]. Con
    [lo que hicimos]…" + **un dato con su explicación**. Aplicable a los 33 con
    la `description` reescrita; el dato solo donde exista.
  - *Tipografía*: contraste por **ancho** (expandida vs. normal) como
    alternativa a serif/sans y a peso — Gilroy no tiene versión expandida;
    GuarujaTitle podría hacer ese papel si es ancha.
  - *Nav*: píldoras con fondo translúcido del color de marca y la activa
    sólida.
- **Qué NO sirve para Axium y por qué:**
  - Video en cada fila.
  - La métrica sin el dato real: nunca inventarla ni rellenarla con
    "Lighthouse 93" si no se midió.
  - Marcas reconocibles (Wise, Papier): la fórmula funciona igual con Clefast
    si la misión está bien escrita.

## Aplicabilidad a Axium
- ¿Escala a 33? **Sí, con el toggle**: Featured (6–8) + Everything (33 en
  grilla más densa).
- ¿Depende de assets que no tenemos? Video sí; el texto y el dato son
  producibles.
- **Capa transferible:** arquitectura (Featured/Everything), tarjeta (fórmula
  misión + dato), tipografía (contraste por ancho), nav (píldoras).
