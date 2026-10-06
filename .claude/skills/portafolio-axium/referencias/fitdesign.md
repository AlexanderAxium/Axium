# Fit Design (Londres) — https://www.fitdesignldn.com/project

- **Analizada:** 2026-09-01
- **Cómo llegó:** Alexander: *"tiene bastantes proyectos como me gustaría, es buena referencia"*
- **Capturas:** `capturas/fitdesign/indice-desktop.jpg`, `indice-full.jpg`
- **Arquetipo de índice:** **pestañas por industria** (4 tabs) → dentro de cada una, 1 destacado grande + 3 tarjetas. No es una grilla larga: es una vitrina segmentada
- **Tratamiento de imagen:** captura del hero del sitio sobre campo de color de marca del cliente (lima, violeta, arena), radio 8px, dentro de tarjeta blanca
- **Proyectos mostrados:** 16 enlaces a fichas; 4 visibles por pestaña

## Veredicto de Alexander
> "tiene bastantes proyectos como me gustaría, es buena referencia"

**Lectura:** le gusta la *sensación* de volumen — y ojo, son solo 16 proyectos,
mostrados de a 4 por pestaña. La lección es que **volumen percibido ≠ volumen
mostrado**: segmentar por industria hace que cada pestaña se sienta completa
sin scroll infinito. Con 33 y 15 industrias, Axium podría hacer 5–6 pestañas
de 5–7 proyectos. **Pendiente preguntarle** si le gustó la segmentación o cree
que muestra todos a la vez.

## 1. Promesa y audiencia
"Selected work — *and the results behind it.*" Le habla al dueño de PyME
británica que quiere resultados medibles, no premios. Sub-promesa constante:
"Request Homepage Preview" (te rediseñamos el home gratis antes de contratar).
**Es el perfil más parecido a Axium de todas las referencias hasta ahora**:
agencia Webflow para PyMEs, vende resultados.

## 2. Arquitectura del índice
Pestañas horizontales (píldoras negras, la activa en lima) → **1 tarjeta
destacada** a todo el ancho (imagen 60% + columna de texto con chips, nombre,
párrafo, **2 métricas grandes** y botón) → **3 tarjetas** en fila (métrica
arriba a modo de etiqueta "Qualified leads +34%", imagen en campo de color con
botón flecha, nombre, sector). Después: banner CTA, testimonio, 3 tiles de
métrica, FAQ sobre los proyectos, CTA final con collage de fotos. Página de
5 094 px — corta.

## 3. Ritmo y curaduría
Curaduría fuerte: 4 por pestaña, el mejor primero y grande. Sin paginación, sin
"ver más". La promesa es "selectos y con resultados", no "muchos".

## 4. Anatomía de la tarjeta
**Destacada:** imagen (captura del hero real del sitio, radio 8) · chips negros
[Industria] [Servicio] · nombre 32px Aspekta 600 · párrafo 20px · **2 métricas
64px** ("93 Lighthouse score", "5+ Investment offers") · botón lima "Read the
case study →".
**Secundaria:** encima de la tarjeta, en gris, `label ····· valor` ("Qualified
leads · +34%") · imagen sobre campo de color de marca con botón flecha blanco
redondo arriba a la derecha · nombre 20px · sector 14px.
**La métrica está en la tarjeta**, antes que el nombre. Eso es la firma de la
tarjeta: primero el resultado, después quién.

## 5. Tratamiento de imagen
- Qué se muestra: el **hero del sitio real**, recortado, con la barra de
  navegación visible — se ve que es una web de verdad.
- Soporte: ninguno (tarjeta plana); en la destacada, la captura es la imagen.
- Fondo: **campo de color de marca del cliente** detrás de la captura en las
  secundarias (lima, violeta, arena) — S2 de brandvm otra vez.
- Ratio: **1.50 (3:2) en 29 de 40 imágenes**; cuadradas 1:1 en el collage del
  CTA. El mismo 3:2 que las portadas actuales de Axium.
- Consistencia: radio 8 idéntico, todas capturas de hero, campo de color.
- Recetas: R2 sin dispositivo (captura + campo de color), R3 en la destacada.
- Entregables que muestra: solo web. Nada de impresos ni redes.
- **14 videos** en la página: las miniaturas son frames de video y hay videos
  en hover (marquee popups). Alexander no hace video → ver S-video abajo.

## 6. Filtro y navegación
Un eje: **industria**, como pestañas, 4 opciones amplias ("SaaS & Technology",
"Professional Services", "Health & Care", "Consumer & Creative"). **Cuatro
categorías para 16 proyectos** vs. las 15 de Axium para 33. La amplitud de la
categoría es la decisión: agrupa rubros afines en vez de nombrar cada uno.

## 7. Tipografía
Una sola familia, **Aspekta** (grotesca neutra, variable), en 400/500/600.
Titular 68px con **la segunda mitad en itálica** ("Selected work — *and the
results behind it.*"). Escala: 68 → 64 (métricas) → 38 → 32 → 20 → 16 → 14.
Tracking -1px en display. **Una familia, muchos pesos, itálica como acento** —
la alternativa barata a la pareja serif+grotesca de brandvm.

## 8. Color y fondo
Lienzo **gris cálido `#EEECEB`** con puntitos sutiles (dot grid), no blanco.
Tarjetas blancas encima. Acento **lima `#C8FF00`** en: barra superior, pestaña
activa, botón principal, palabra "yours" en el banner. Negro `#1B1B1B` para
chips y botones secundarios. Un azul `#3D5AFF` casi invisible. **Paleta de 3:
gris cálido + negro + lima.** El lima solo aparece en lo clicable → el ojo
aprende dónde está la acción.

## 9. Movimiento
GSAP + SplitText presentes; 14 videos en miniaturas/hover; 2 elementos con
opacity 0 (entradas). `no observable` en detalle. Webflow.

## 10. Prueba y credibilidad
**Es el eje de toda la página**: métricas en cada tarjeta, 3 tiles de resultados
(38% revenue, +13.6k traffic, +24% add to cart), testimonio con foto, FAQ
("Are these your only projects?", "How are the results measured?"). Axium
tiene `results: []` vacío en la mayoría de los JSON — para copiar esto hay que
**producir el dato**, no el diseño.

## 11. Ficha del caso y transición
`no observable` — no se abrió una ficha. Pendiente.

## 12. Firma y transferencia
- **La firma en una frase:** el resultado numérico va antes que el nombre del
  cliente, y el lima solo aparece donde se puede hacer clic.
- **Qué robar (y de qué capa):**
  - *Arquitectura*: pestañas por industria amplia (4–6) como alternativa a 15
    filtros; destacado + 3 por pestaña.
  - *Tarjeta*: la métrica como etiqueta encima; el botón flecha redondo sobre
    la imagen; chips negros sólidos en vez de grises.
  - *Color*: lienzo gris cálido en vez de blanco + un acento que solo marca
    acción. Axium tiene `#0072CF` y `#7ECFC3` — hoy los usa en chips de
    filtro, no en acción.
  - *Tipografía*: la itálica en la segunda mitad del titular como acento
    barato (Gilroy no tiene itálica real — verificar; GuarujaTitle tampoco).
  - *CTA*: "Request Homepage Preview" — una oferta concreta y sin riesgo en vez
    de "Contáctanos". Directamente aplicable al CTA de Axium.
- **Qué NO sirve para Axium y por qué:**
  - Los videos en miniatura: Alexander no produce video.
  - Las métricas: no existen en los datos de Axium. Copiar la forma sin el dato
    es peor que no copiarla.
  - 4 por pestaña con 33 proyectos deja 27 escondidos — habría que decidir si
    las pestañas muestran todos (5–7 cada una) o si hay un "ver todos".

## Aplicabilidad a Axium
- ¿Escala a 33? **Con cambio**: 5–6 pestañas de 5–7, o pestañas + "todos".
- ¿Depende de assets que no tenemos? **Sí en parte**: métricas de resultado y
  video. Las capturas de hero sobre campo de color sí se pueden producir.
- ¿Se apoya en marcas reconocibles? **No** — Stormborn, Onion Security, LUX
  Rewards son PyMEs desconocidas. Por eso es tan buena referencia.
- **Capa transferible:** arquitectura (pestañas), tarjeta (métrica + flecha),
  color (lienzo cálido + acento de acción), CTA (oferta concreta).
