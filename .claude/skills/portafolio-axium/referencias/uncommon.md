# Uncommon (Melbourne) — https://uncommondesign.group

- **Analizada:** 2026-09-01
- **Cómo llegó:** Alexander: *"https://uncommondesign.group/studio también tiene diseños creativos"*. Ojo: el dominio es `uncommondesign.group`, **no** `uncommonstudio.com.au` (otro estudio; corregido en COLA.md)
- **Capturas:** `capturas/uncommon/studio-desktop.jpg`, `studio-full.jpg`, `indice-*.jpg`
- **Arquetipo de índice:** **carrusel horizontal a pantalla completa** — 8 proyectos ("05 — 08"), uno por pantalla, "SCROLL OR DRAG", tira de miniaturas abajo
- **Tratamiento de imagen:** fotografía a sangre sobre negro; sin radio
- **Proyectos mostrados:** **8**

## Veredicto de Alexander
> "también tiene diseños creativos"

**Lectura:** positivo, y otra vez sobre una página **oscura** de una sola
familia tipográfica. Con magnetic, ya son dos "creativos" oscuros. Lo que
Alexander llama creativo acá no son imágenes: es **sistema tipográfico y
retícula** — labels diminutos en mayúsculas, secciones numeradas `001`,
hairlines, un `↳` como glifo de marca, "Contact us" a 120px como sección.

## 1. Promesa y audiencia
"Design that comes from the heart and mind." Estudio UX/UI de autor; le habla
a clientes con presupuesto y a otros diseñadores (Awwwards en el footer). Nav
con ciudad y hora local ("MEL 10:29") — el detalle de estudio.

## 2. Arquitectura del índice
`/work` mide **900px de alto** — exactamente el viewport. No hay scroll de
documento: es un **carrusel horizontal a pantalla completa**. Cada proyecto
ocupa toda la pantalla con su imagen a sangre (1440px, ratio 1.60), el nombre a
**120px** centrado *detrás* del dispositivo ("Yondr"), contador "05 — 08"
abajo a la derecha, "SCROLL OR DRAG" abajo a la izquierda, y una **tira de
miniaturas** centrada al pie con la actual marcada por una línea vertical.
Rail `/WORK` a la izquierda, "MENU ●" a la derecha. Es el arquetipo más
espectacular y el que **peor escala**: con 33 serían 33 pantallas y una tira
de 33 miniaturas.

## 3. Ritmo y curaduría
Seis. Curaduría extrema: solo lo mejor, uno por pantalla. La promesa es
"cada proyecto merece toda tu atención". Lo opuesto a brandvm (77) y a
locomotive (45 en una lista).

## 4. Anatomía de la tarjeta
No hay tarjeta: la pantalla entera es el proyecto. Imagen a sangre + nombre a
120px + (probable) categoría en micro-label. 10 elementos con opacity 0 para
las transiciones entre pantallas.

## 5. Tratamiento de imagen
- **/work — la evidencia más fuerte de R8 hasta ahora.** Las 8 portadas son
  **renders 3D de dispositivo en escenografía**: móvil flotando en ángulo entre
  píldoras de vidrio degradado azul-magenta sobre gris (Yondr) · móvil apoyado
  contra una pared de concreto con luz lateral dura (Sustainable Salons) ·
  móvil negro de pie sobre una mesa negra con reflejo, otro móvil detrás
  mostrando la parte trasera con luces LED (Dead Diamond Society). En todas:
  la UI real dentro de la pantalla, **la escenografía toma el color de la
  marca** (violeta para Yondr, verde-petróleo para Salons, negro-neón para
  DDS), luz de una sola fuente, sombra de contacto, materiales mate (concreto,
  vidrio, metal). Ratio 1.60 en las 8.
  → Esto es exactamente lo que el pipeline de dos pasos de `IMAGENES.md`
  produciría: fondo/escenografía generado + mockup + captura real. Lo que
  Uncommon hace con Cinema 4D, Axium lo puede aproximar con un prompt de fondo
  + plantilla de mockup.
- /studio: foto de equipo a sangre (1058×644) sin radio sobre negro; imágenes
  cuadradas para el **cursor con imágenes** (42 de 269×281 siguiendo el
  cursor).
- Recetas: **R8** (las 8 portadas), con la variante "escenografía en color de
  marca" que conviene anotar como regla de R8.
- Entregables que muestra: solo apps móviles y web. Nada impreso.

## 6. Filtro y navegación
Menú "MENU ●" como píldora con borde blanco; "WORK WITH US" arriba a la
izquierda con `↳`; rail izquierdo con `/STUDIO` como migas.

## 7. Tipografía
**Una sola familia: Neue Montreal** (grotesca neutra), pesos 400/500.
Escala: **120** ("Contact us") → 68 (H1) → 45 → 24 → 18 → 14 → **11 → 9**
(micro-labels en mayúsculas con tracking). Lo llamativo es el **rango**: del
120 al 9 en la misma familia. Tracking -0.9px en el H1. Sin itálicas, sin
serif — la creatividad está en el tamaño y la posición, no en la fuente.

## 8. Color y fondo
**Negro `#121212` / `#111214`**, texto blanco al 100 / 70 / 60 %. **Sin ningún
acento de color.** Un naranja aparece solo en el sello de reconocimiento del
footer. Es la paleta más austera junto con locomotive, pero **oscura**.

## 9. Movimiento
9 elementos con opacity 0; canvas para el cursor; **cursor personalizado que
arrastra imágenes** — el gesto interactivo de la página. Sin GSAP/Lenis
detectados (Next.js). Moderado.

## 10. Prueba y credibilidad
Sellos de Awwwards y "Working Globally" en el footer. Foto de equipo real.
Nada de métricas.

## 11. Ficha del caso y transición
*(pendiente)*

## 12. Firma y transferencia
- **La firma en una frase:** negro, una sola grotesca del 9 al 120, secciones
  numeradas con hairlines, y un `↳` que precede cada acción.
- **Qué robar (y de qué capa):**
  - *Tipografía*: el rango extremo de una sola familia; micro-labels 9–11px
    en mayúsculas con tracking como "meta" de cada bloque (Axium ya tiene
    `.text-label`, úsalo así).
  - *Retícula*: rail izquierdo con la ruta (`/STUDIO`, `/PORTAFOLIO`) y el
    contenido arrancando en la segunda columna — aire a la izquierda.
  - *CTA*: "Contact us" **como sección tipográfica gigante** con flecha, no
    como botón; y "Book a 15 min call" subrayado — una oferta concreta y
    pequeña (fitdesign hace lo mismo con "Request Homepage Preview").
  - *Listas*: filas numeradas `001…005` con hairline — sirve para la sección
    de proceso de Axium.
  - *Detalle*: ciudad + hora local en el nav ("LIM 10:29").
- **Qué NO sirve para Axium y por qué:**
  - El negro total sin acento: Axium tiene un navy propio y dos acentos; ir a
    negro puro sería borrar la marca.
  - El cursor con imágenes: costoso, y Alexander pidió moderación en
    movimiento.

## Aplicabilidad a Axium
- ¿Escala a 33? **No.** El apilado a pantalla completa funciona con 6; con 33
  es un castigo. Solo serviría para una sección de "6 destacados" encima del
  índice completo — y eso ya sería mezclar dos arquetipos.
- ¿Depende de assets que no tenemos? La /studio depende de una foto de equipo
  buena — Axium tendría que producir una.
- **Capa transferible:** tipografía (rango y micro-labels), retícula (rail),
  CTA (sección gigante + oferta pequeña).
