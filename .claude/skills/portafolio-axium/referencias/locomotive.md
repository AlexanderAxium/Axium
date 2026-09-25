# Locomotive (Montréal) — https://locomotive.ca/en/work

- **Analizada:** 2026-09-01
- **Cómo llegó:** Alexander: *"https://locomotive.ca/en/work/lightship-1 me parece decente pero exagera en las animaciones de entrada"*
- **Capturas:** `capturas/locomotive/`
- **Arquetipo de índice:** **lista/tabla** — 45 filas de 41px (nombre · ciudad) con la imagen escondida hasta hover/expansión; filtros por categoría con conteo
- **Tratamiento de imagen:** fotografía/video a sangre, sin radio, sin tarjeta; blanco y negro puros como lienzo
- **Proyectos mostrados:** 45

## Veredicto de Alexander
> "me parece decente pero exagera en las animaciones de entrada"

**Lectura:** **primer veredicto parcial/negativo** — cuenta para la barra. Lo
que rechaza no es el diseño ("decente") sino la **cantidad de movimiento de
entrada**. Locomotive es literalmente la agencia que hizo `locomotive-scroll`:
28 elementos con `data-scroll`, 22 con `opacity: 0` esperando entrar, 11 con
transform. Cada bloque aparece al hacer scroll. Alexander lo siente como
exceso. → **Antipatrón A1**: la entrada escalonada de *todo* elemento. Y ojo:
la tarjeta actual de Axium hace exactamente eso (fade-up con delay por índice).

## 1. Promesa y audiencia
Estudio de autor premiado (Awwwards Site of the Month). Le habla a marcas con
presupuesto de producción y a otros diseñadores. Promesa: la experiencia
misma es la prueba. Lejos del perfil de Axium.

## 2. Arquitectura del índice
**Lista.** Página de solo 3 168 px para 45 proyectos: cada uno es una fila
`<article class="c-work-list_item">` de **41px de alto** con el nombre y la
ciudad; la imagen (208×131) está dentro pero oculta, y aparece al pasar el
cursor o al expandir la fila (hay un "Close"). Encima, un párrafo de 26px como
H1 ("We design, develop and ship digital products…") y los filtros con conteo
(All 45 · Branding 16 · Digital 44 · Experience 33 · E-commerce 08 · Content
12). **Es el arquetipo opuesto a brandvm**: cero imágenes en reposo, todo
texto; la densidad es máxima (45 proyectos sin scroll largo) y la imagen es
una recompensa al hover. El fetch inicial lo había descrito como "grilla" —
otra vez: no clasificar sin render.

## 3. Ritmo y curaduría
45 proyectos. **Al llegar al final de una ficha, la página navega sola a la
siguiente** (de `lightship-1` pasó a `the-drake-hotel` sin clic). Es un
carrete infinito de casos: elegante, pero quita el control.

## 4. Anatomía de la tarjeta
Fila de 41px: **nombre** (Helvetica 15px) · **ciudad, país** · al expandir:
imagen 208×131, categorías, "©2026 · N awards", y dos acciones "Case Study" /
"Visit website". Separador: línea fina entre filas. Sin imagen visible en
reposo — la fila es texto puro.

## 5. Tratamiento de imagen
- Qué se muestra: fotografía y **video** (3 por ficha) a sangre o en bloques de
  2 columnas; ratio dominante **16:9 (1.78) en 15 de 26**, algunos 4:3 y
  verticales 0.80.
- Soporte: ninguno. Radio: **0px en todo**. Sin tarjeta, sin sombra.
- Fondo: blanco puro; negro puro para el banner de cookies y bloques oscuros.
- Consistencia: la ausencia total de ornamento — la imagen es el bloque.
- Recetas: ninguna de las R1–R15 aplica limpiamente; es **fotografía/video
  editorial a sangre** (lo llamaría R16 — imagen sin marco, cortada por la
  retícula). Requiere material de alta producción.
- Entregables: web, branding, video. Nada impreso visible.

## 6. Filtro y navegación
Categorías con conteo, un eje, filtro instantáneo. La navegación entre fichas
es por scroll continuo (ver § 3).

## 7. Tipografía
**LocomotiveNew** (display propia, 110px para el H1 — el nombre del proyecto
ocupa el ancho) + **HelveticaNowDisplay** 400 para todo lo demás en 13–15px y
26px para subtítulos. **Un solo peso (400) en toda la página.** El contraste
lo hace el tamaño (110 → 26 → 15), no el peso.

## 8. Color y fondo
**Blanco `#FFFFFF` y negro `#000000`, nada más.** Ni gris, ni acento. Todo el
color viene de las fotos. Es el extremo del lado B de T1: la agencia no tiene
color propio, tiene ausencia de color.

## 9. Movimiento
`locomotive-scroll` con 28 `data-scroll`; 22 elementos en `opacity: 0`; 11
transformados; 3 videos autoplay. **Es la referencia con más animación de
entrada, y la que Alexander rechazó por eso.**

## 10. Prueba y credibilidad
"©2026 · 2 awards" en la tarjeta; "Visit website" en el índice. La prueba es
el premio y el sitio en vivo.

## 11. Ficha del caso y transición
17 000 px; hero con nombre a 110px + metadata (categoría, año, ciudad,
website) en una fila pequeña arriba; bloques de imagen/video alternando ancho
completo y dos columnas; al final, navegación automática al siguiente.

## 12. Firma y transferencia
- **La firma en una frase:** el nombre del proyecto a 110px en una tipografía
  propia, y nada más que fotos sin marco que entran a medida que bajas.
- **Qué robar (y de qué capa):**
  - *Tarjeta*: la fila de metadata pequeña (categoría · año · ciudad · sitio)
    como una sola línea — barata y elegante. Las dos acciones separadas
    ("Case Study" / "Visit website"), igual que brandvm → **S7 sube a 2
    referencias**.
  - *Tipografía*: contraste por tamaño y no por peso (110 → 15). Con
    GuarujaTitle se puede.
  - *Filtros*: conteo junto a cada categoría (Axium ya lo tiene).
- **Qué NO sirve para Axium y por qué:**
  - La animación de entrada por bloque: rechazada explícitamente.
  - Video: no se produce.
  - Fotografía a sangre sin marco: exige material de producción que las PyMEs
    no tienen; con capturas de web queda pobre.
  - La navegación automática al siguiente caso: quita control y complica el
    SEO/analytics.

## Aplicabilidad a Axium
- ¿Escala a 33? Sí (45).
- ¿Depende de assets que no tenemos? **Sí, totalmente**: foto y video.
- ¿Se apoya en marcas reconocibles? Parcialmente (Scout Motors, Wolverine).
- **Capa transferible:** tarjeta (metadata en una línea, dos acciones),
  tipografía (contraste por tamaño). **Antipatrón** en movimiento.
