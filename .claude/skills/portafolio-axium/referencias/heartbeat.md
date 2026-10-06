# Heartbeat (Kyiv) — https://heartbeat.ua/work

- **Analizada:** 2026-09-01
- **Cómo llegó:** Alexander: *"https://heartbeat.ua/work/hyros tiene diseños muy geniales, tal vez mucho para nosotros porque no hacemos animaciones con video, pero podríamos apuntar a eso y tratar de seguir la misma creatividad al menos estáticamente"*
- **Capturas:** `capturas/heartbeat/caso-hyros-desktop.jpg`, `hyros-bigger.jpg`, `hyros-bigger-2.jpg`, `hyros-smaller.png`, `indice-*.jpg`
- **Arquetipo de índice:** **lista de filas grandes** — un proyecto por fila (1361px), texto a la izquierda y media a la derecha alternando ancho (1.61) y vertical (0.79); filtros por industria
- **Tratamiento de imagen (ficha):** composiciones de UI en retícula estricta — ancho completo 1.61 alternando con pares verticales 0.79 — sin radio, sobre gris `#F6F6F6`; 2 videos
- **Proyectos mostrados:** 15

## Veredicto de Alexander
> "tiene diseños muy geniales, tal vez mucho para nosotros porque no hacemos
> animaciones con video, pero podríamos apuntar a eso y tratar de seguir la
> misma creatividad al menos estáticamente"

**Lectura:** el veredicto más **aspiracional**: es la referencia que marca el
techo de calidad al que quiere apuntar, con la restricción explícita de que
**Axium no produce video**. La tarea que deja es concreta: *traducir la
creatividad de Heartbeat a piezas estáticas*. Eso convierte cada video de
Heartbeat en una pregunta: "¿qué fotograma de esto sería la imagen fija?"

## 1. Promesa y audiencia
Estudio de identidad + producto para SaaS en etapa de crecimiento (Hyros, Corti).
Le habla a fundadores tech. Promesa: "hacemos todo inhouse — marca, UI, motion".
El H1 es un párrafo entero en mayúsculas: "FULL REBRAND AND WEBSITE LAUNCH FOR
HYROS - GROWTH-STAGE SAAS USED BY PLAYBOY, AGORA, AND WHOP".

## 2. Arquitectura del índice
**Lista de filas grandes**, 15 proyectos, 13 588 px. Cada fila ocupa el ancho
(1361px): a la izquierda el texto (párrafo de 16px peso 300, sin título
grande) y a la derecha el media, que alterna entre **ancho 981×610 (1.61)** y
**vertical 474×600 (0.79)** — los mismos dos formatos de la ficha. **8 videos
autoplay** en el índice. Filtros por industria arriba: AI · Web3 · Fintech ·
Cybersecurity · Other →. Sin radio en ninguna imagen. Es un híbrido entre la
lista de Locomotive (una fila por proyecto) y la grilla de brandvm (media
grande visible) — y el arquetipo que más "revista" se siente.

## 3. Ritmo y curaduría
**Al llegar al final de la ficha navega sola al siguiente caso** (de `hyros`
pasó a `corti` sin clic) — el mismo carrete infinito que Locomotive. Dos
referencias → S10.

## 4. Anatomía de la tarjeta
Fila: **párrafo descriptivo de 16px/300** a la izquierda ("A growing startup
raised investment, outgrew its…") — sin nombre grande, el nombre va en mono
pequeño — y el media a la derecha. La descripción es la protagonista textual,
no el nombre: lo contrario de brandvm (nombre serif 34px) y de Locomotive
(nombre 110px). Con clientes desconocidos, la descripción dice más que el
nombre — **eso le aplica a Axium**.

## 5. Tratamiento de imagen
- Qué se muestra: **composiciones de UI y marca a doble página**. Las imágenes
  fuente son enormes (4950×3080 las anchas, 2434×3080 las verticales — **la
  misma altura**, para que un ancho y dos verticales compongan una fila
  perfecta). 9 medias por caso, 2 videos.
- Retícula: ancho completo (1382×860, ratio 1.61) alternando con **pares
  verticales** (676×855, ratio 0.79). El par vertical suma el ancho del bloque
  completo. Es una retícula editorial de revista, rígida y limpia.
- Soporte: **la sección de la web como objeto**. Las imágenes anchas
  (`bigger-section.jpg`) no son capturas de navegador: son **una sección real
  del sitio** (el bloque "Recognize / Learn / Reach out / Interact", la tabla
  "White label…") exportada a 4950×3080 y puesta **dentro de una tarjeta blanca
  con radio grande (~40px) y márgenes generosos (~20%)** sobre el gris. Sin
  dispositivo, sin barra de navegador, sin sombra: la sección flota como una
  lámina. Las verticales (`smaller-section.png`) son el **key visual de la
  marca** (arte degradado desenfocado + titular "Give your business a pay
  raise…") en 2434×3080.
- Fondo: gris `#F6F6F6`; **sin radio** en ninguna imagen; sin sombra.
- Consistencia: la retícula. Todas las imágenes tienen exactamente uno de dos
  tamaños. Es el mecanismo de consistencia más estricto de todas las
  referencias — y el más fácil de reproducir: **dos formatos, punto.**
- Recetas:
  - **R19 — sección enmarcada** *(nueva)*: una sección real del sitio,
    exportada a 2x, centrada en una tarjeta con radio grande y ~15–20% de
    margen, sobre campo neutro. Cero escenografía, cero dispositivo; el "marco"
    es el aire. **Es la receta más directa para Axium**: cada web tiene 4–6
    secciones buenas → 4–6 imágenes de ficha, todas del mismo formato, sin
    inventar nada. Requiere que la sección se vea bien aislada (las de Axium
    con `rounded-xl` sí).
  - **Key visual vertical**: la pieza de marca del cliente (o su hero con
    titular) en formato 0.79. Para clientes sin key visual, la alternativa es
    el hero del móvil (captura vertical real) — mismo formato, mismo efecto.
  - Los videos son composiciones de UI en movimiento → su fotograma clave es
    una R4/R5.
- Entregables: branding + web + motion. SaaS — el tipo que Axium tiene en
  `siclo`, `feniz`, `store-saas`.

## 6. Filtro y navegación
Cursor personalizado; "Next case ↓" al pie en peso 100.

## 7. Tipografía
**Una sola familia, y es una monoespaciada: Azeret Mono variable**, en pesos
**100, 300, 400 y 900**. Escala: **161 → 152 → 47 → 33 → 16 → 12**. El H1 en
900 MAYÚSCULAS con tracking **-1.86px** (una mono apretada es un gesto raro y
reconocible); "Next case" en 100 (ultrafino) al 33px. El contraste es de
**peso extremo dentro de la misma mono**: 900 contra 100. Es la decisión
tipográfica más arriesgada de las siete referencias y la que más "creativa" se
siente — con una sola fuente.

## 8. Color y fondo
Gris `#F6F6F6` + negro + gris medio `#888` para lo secundario + un gris oscuro
`#383838` de bloque. **Sin acento de color.** Todo el color lo trae la UI de los
clientes. Lado B de T1, versión clara.

## 9. Movimiento
**56 elementos con opacity 0**, cursor propio, 2 videos (1 autoplay). Muy
animada. Alexander lo sabe ("no hacemos video") y lo acepta como aspiración,
no como plan.

## 10. Prueba y credibilidad
Los nombres de los clientes del cliente en el H1 ("used by Playboy, Agora, and
Whop"): prueba prestada. Axium podría hacer lo mismo con "usado por N
estudiantes" o "N pedidos al mes" cuando exista el dato.

## 11. Ficha del caso y transición
16 500 px. **El hero de la ficha** (captura `caso-hyros-desktop.jpg`): fondo
gris `#F6F6F6`, logo `hb` manuscrito arriba a la izquierda, "MENU" en píldora
con borde; **H1-párrafo en mono 900 itálica MAYÚSCULAS** a 46px, tres líneas;
debajo, intro en mono 400 16px; **chips con borde (píldora, mono itálica)**:
"brand identity · illustrations · website creation · motion design · product
design"; a la derecha, **dos columnas de créditos como una película**: "client
cast" / "team cast" con nombres. Abajo, "Read full story ↓" en gris. Después,
la retícula de medias (ancho / par vertical / ancho…) → "Next case ↓" →
navegación automática al siguiente.

**Patrón de hero para robar**: titular-párrafo + chips de servicio + créditos
en dos columnas. Los créditos convierten un proyecto de PyME en una producción
con equipo — y Axium sí tiene ese dato (quién hizo qué).

## 12. Firma y transferencia
- **La firma en una frase:** una monoespaciada del 100 al 900, un párrafo
  entero en mayúsculas como titular, y una retícula de dos formatos donde un
  ancho y dos verticales siempre suman lo mismo.
- **Qué robar (y de qué capa):**
  - *Imagen*: **la retícula de dos formatos** (ancho 1.61 + vertical 0.79 ×2)
    para la ficha. Con 4–6 imágenes por proyecto (techo de Undersight) da
    exactamente: 2 anchas + 2 pares = 6, o 1 ancha + 1 par + 1 ancha = 4.
    Resuelve la ficha de Axium con dos tamaños de exportación.
  - *Tipografía*: peso extremo dentro de una familia (Gilroy 400 vs 700 no
    llega; habría que ver si GuarujaTitle tiene pesos). El H1-párrafo en
    mayúsculas como alternativa al titular corto.
  - *Prueba*: nombrar a los clientes del cliente.
  - *Estático de lo animado*: cada video de Heartbeat es una composición de
    UI en movimiento; su fotograma clave es una R4/R5/R6 de `IMAGENES.md`.
- **Qué NO sirve para Axium y por qué:**
  - Video y 56 entradas animadas: fuera de alcance por producción y por gusto.
  - Imágenes fuente de 4950×3080: producibles solo si se componen desde
    capturas 2x; las capturas actuales de 1536px no llegan.
  - Navegación automática al siguiente caso (S10): quita control.

## Aplicabilidad a Axium
- ¿Escala a 33? La lista de filas grandes con 33 serían ~30 000 px — demasiado.
  Escalaría con filtros por industria que reduzcan a 5–8 por vista, o como
  arquetipo solo para "destacados".
- ¿Depende de assets que no tenemos? La *forma* no; el *nivel* de composición
  sí exige trabajo por proyecto.
- ¿Se apoya en marcas reconocibles? Sí, prestadas (Playboy, Agora).
- **Capa transferible:** imagen (retícula de dos formatos), tipografía (peso
  extremo), prueba prestada.
