# La rejilla — cómo se desarma un portafolio de referencia

Doce dimensiones. Se recorren todas, en orden, cada vez. El orden importa: va de
lo estratégico a lo formal a lo transferible, y las últimas tres no se pueden
contestar bien sin haber pasado por las nueve anteriores.

La disciplina de la rejilla existe por una razón concreta: sin ella, mirar
portafolios degenera en "qué lindo" y "qué feo". Diez referencias miradas así no
suman — se cancelan. Diez referencias desarmadas con la misma rejilla se pueden
comparar columna contra columna, y ahí sí aparece qué se repite y qué no.

**Regla de render:** una referencia **no se clasifica desde el HTML ni desde un
fetch de texto**. Magnetic salió "lista numerada" del fetch y era un masonry
fotográfico; Locomotive salió "grilla" y era una tabla de texto. El arquetipo
se decide mirando la captura renderizada, siempre.

**Regla de honestidad:** lo que no se ve, se escribe `no observable`. Es
información útil (dice que la captura no alcanzó) y es infinitamente mejor que un
dato inventado que después se cuenta como patrón.

---

## 1. Promesa y audiencia

Qué mirar: el titular del índice, el subtítulo si hay, el orden de los primeros
tres proyectos, y a quién le está hablando la página. ¿A un director de marketing
que compara agencias? ¿A un jurado de diseño? ¿A otro diseñador?

Por qué importa: la estructura de un portafolio es consecuencia de a quién quiere
convencer. Un portafolio hecho para impresionar a diseñadores esconde la
información de negocio; uno hecho para vender la pone adelante. Axium vende a
PyMEs peruanas que están decidiendo a quién contratarle su web — copiar la
estructura de un portafolio hecho para ganar premios es copiar la respuesta a otra
pregunta.

Registrar: la promesa en una frase + a quién le habla + qué evidencia lo indica.

## 2. Arquitectura del índice

Qué mirar: la forma en que se disponen los proyectos. Los arquetipos frecuentes:

- **Grilla uniforme** — n columnas, todas las tarjetas iguales.
- **Grilla con jerarquía** — algunos proyectos ocupan más, hay destacados.
- **Lista / tabla** — filas de texto, imagen solo al hacer hover.
- **Scroll horizontal** — carrusel o desplazamiento lateral.
- **Apilado a pantalla completa** — un proyecto por viewport.
- **Mosaico irregular / masonry** — alturas distintas, ritmo asimétrico.
- **Mapa o eje** — dispuestos por tiempo, sector o alguna otra variable.

Anotar además: cuántas columnas en desktop y en móvil, el gutter, si hay margen
lateral o sangra a bordes, y si el ritmo es regular o roto a propósito.

Por qué importa: es la decisión de la que cuelga todo lo demás, y la que define
si 33 proyectos se sienten como abundancia o como saturación.

## 3. Ritmo y curaduría

Qué mirar: **cuántos proyectos muestra en total**, cuántos antes del primer
scroll, si hay paginación / "ver más" / scroll infinito, en qué orden están y si
ese orden es explícito (fecha, destacados, aleatorio).

Por qué importa: acá se decide si el portafolio es una vitrina curada o un
archivo. Los dos son válidos, pero prometen cosas distintas: la vitrina dice
"somos selectivos", el archivo dice "tenemos volumen y experiencia". Axium con 33
proyectos de PyMEs probablemente esté más cerca del segundo, y eso hay que
diseñarlo a propósito en vez de sufrirlo.

Registrar: **el número total** de proyectos, y también **el número de medias
por ficha** (imágenes + videos). Alexander rechazó Undersight por 12 medias
por caso — "no me dará tiempo" —, así que el presupuesto de producción por
proyecto es un dato de primera clase: ≤ 6 es su techo.

## 4. Anatomía de la tarjeta

Qué mirar, campo por campo: imagen (ratio, recorte, si sangra), nombre del
cliente, categoría/servicio, año, ubicación, una línea de descripción, métrica,
etiquetas, flecha o indicador de enlace. Cuáles están, cuáles no, y en qué orden
de jerarquía visual (tamaño, peso, color, posición).

Anotar también: qué pasa al hacer hover (¿zoom? ¿se revela texto? ¿cambia el
color? ¿aparece un cursor personalizado?) y qué separa una tarjeta de la
siguiente (¿espacio? ¿línea? ¿nada?).

Por qué importa: es el átomo del portafolio, repetido decenas de veces. Un
detalle bueno se multiplica por 33; uno genérico también. La tarjeta de hoy en
Axium —rectángulo redondeado + chip gris + título— es exactamente la que trae por
defecto cualquier plantilla de agencia, y por eso la página no se distingue.

## 5. Tratamiento de imagen ← **la dimensión crítica**

La mitad de la entrega son prompts de imagen, así que esta dimensión se registra
con más detalle que las demás. Sub-ejes:

- **Qué se muestra**: ¿captura plana del sitio? ¿recorte de una sección? ¿la UI
  en un dispositivo? ¿fotografía del producto o del contexto del cliente? ¿el
  logotipo? ¿una pieza gráfica abstracta con la paleta del cliente?
- **Soporte**: sin soporte / laptop / móvil / tablet / varios a la vez / papel /
  impreso / render 3D.
- **Escenografía**: ¿la imagen vive en un escenario (escritorio, mesa, ambiente)
  o flota en un fondo plano?
- **Fondo**: color plano, degradado, textura, fotografía, transparente sobre el
  fondo de la página.
- **Luz**: dura o suave, dirección, si hay sombra proyectada y de qué dureza.
- **Óptica**: frontal / en ángulo / isométrico / picado; profundidad de campo,
  distorsión de gran angular.
- **Color**: ¿cada imagen trae la paleta de su cliente (grilla policroma) o todas
  están unificadas por la paleta del estudio (grilla monocroma)?
- **Consistencia**: ¿las N imágenes se ven hechas por la misma mano? ¿Qué es
  exactamente lo que las unifica — el fondo, la luz, el ángulo, el ratio?
- **Ratio y recorte**: 4:3, 3:2, 16:9, 1:1, vertical; y cómo tratan las capturas
  de página larga (que recortadas a 4:3 se convierten en una franja sin sentido).
- **Receta de composición**: a cuál de las recetas de `IMAGENES.md` (R1–R14)
  corresponde cada imagen, o si es una nueva. **¿Requiere IA o es edición?** —
  la mayoría de lo que se ve profesional es edición.
- **Qué entregables muestra y cómo trata lo que no es pantalla**: ¿hay
  branding, impresos, manuales, redes sociales, apps? ¿Cómo los compone? Axium
  tiene las combinaciones de `IMAGENES.md` § Tipos de proyecto, y la mayoría de
  las referencias solo enseñan a mostrar webs. Anotar explícitamente cuando una
  referencia resuelve bien un impreso o un feed de redes: son las más escasas.

Por qué importa doble: primero porque la imagen es el 80% del área de un
portafolio, y segundo porque **el eje de consistencia es el problema real de
Axium hoy** — hay portadas que son capturas crudas de home y otras que son
mockups, mezcladas en la misma grilla. Cuál es el mecanismo concreto que usan las
referencias para unificar es el hallazgo más accionable que puede salir de todo
este ejercicio.

Ver `IMAGENES.md` para la taxonomía de tratamientos y para traducir lo observado
a prompt.

## 6. Filtro y navegación

Qué mirar: si hay filtros, cuántos ejes, cuántas opciones por eje, si están
siempre visibles o escondidos, si se combinan, si muestran el conteo, si la URL
refleja el filtro, y qué pasa cuando un filtro deja cero resultados. También:
¿hay buscador? ¿ordenamiento?

Por qué importa: Axium hoy tiene tres ejes (industria, servicio, tecnología) con
15 industrias para 33 proyectos — casi una industria por cada dos proyectos. Un
filtro con esa granularidad no filtra, fragmenta. Ver qué hacen los que tienen
catálogos grandes de verdad es el aprendizaje directo.

## 7. Tipografía

Qué mirar: cuántas familias, cuál para títulos y cuál para texto, el salto de
escala entre el título de proyecto y la metadata, el peso, si hay mayúsculas y
tracking abierto, la altura de línea, y si el nombre del cliente es el elemento
más grande de la tarjeta o no.

Por qué importa: en una grilla donde la imagen manda, la tipografía es lo único
que le da voz al estudio. Axium tiene Gilroy + GuarujaTitle — una decisión ya
tomada, así que lo transferible acá es la *escala y el contraste*, no la familia.

## 8. Color y fondo

Qué mirar: el color del lienzo del índice (blanco, hueso, negro, color), si el
fondo cambia al hacer scroll o hover, cómo conviven los colores de las marcas de
los clientes con la paleta del estudio, y dónde aparece el color de acento (¿solo
en hover? ¿en las etiquetas? ¿en nada?).

Por qué importa: el conflicto entre "cada cliente tiene su color" y "el
portafolio tiene que verse como un solo estudio" es el conflicto central de
cualquier grilla de casos, y cada referencia lo resuelve de una manera concreta y
copiable.

## 9. Movimiento

Qué mirar: la entrada de las tarjetas al hacer scroll (¿aparecen? ¿en cascada?
¿con qué retardo?), el hover, el cursor, el parallax si lo hay, y sobre todo la
**transición al hacer clic** hacia la ficha del caso.

Por qué importa: Axium ya tiene `motion/react` y un cursor magnético; el
movimiento es una capa donde hay margen de firma barato. Pero es también donde más
fácil se cae en lo genérico (el fade-up de 16px con delay escalonado es el
`animate-fade-in` de toda plantilla — de hecho es literalmente lo que hay hoy).

Si la referencia se ve solo en captura estática, escribir `no observable` y no
suponer. Con `extraer.js` sí se puede contar: elementos con `opacity: 0`
(entradas pendientes), `data-scroll`, videos autoplay, librerías (GSAP, Lenis,
locomotive-scroll, three.js). Anotar los números — y anotar **si el mecanismo
se ve**: locomotive (22 entradas) le pareció exagerado a Alexander; magnetic
(71) no. La diferencia no está en la cantidad.

## 10. Prueba y credibilidad

Qué mirar: métricas de resultado, testimonios, logotipos de clientes, premios,
años de trabajo, cantidad de proyectos, links al sitio en vivo. ¿Están en el
índice o recién en la ficha del caso?

Por qué importa: Axium le vende a PyMEs que están comparando presupuestos. La
prueba pesa más que la belleza en esa decisión, pero mal puesta ensucia la
grilla. Ver dónde la meten los que lo hacen bien.

## 11. La ficha del caso y la transición hacia ella

Qué mirar: qué recibe al que hace clic — el encabezado, si repite la portada del
índice o abre con algo distinto, cómo está estructurada la narrativa, y si hay
"siguiente proyecto" al final.

Anotar también si la ficha **navega sola al siguiente caso** al llegar al
final (locomotive, heartbeat lo hacen) — el extractor lo detecta porque la URL
cambia durante el scroll.

Por qué importa: el índice y la ficha son una sola experiencia. Axium ya tiene
una librería de 22 bloques de caso (`case-blocks/`), así que lo que se decida en
el índice tiene que conectar con eso — cambiar el ratio de la portada del índice,
por ejemplo, obliga a mirar qué hace la portada dentro de la ficha.

## 11b. Estilo: paleta, tipografía, hero y CTA

Qué mirar: lo que pide `ESTILO.md` — colores computados del lienzo, texto y
acentos (con hex); familias tipográficas con pesos y escala en px; anatomía del
hero (fondo, titular, meta, acción, altura); anatomía del CTA principal (texto,
fondo, radio, padding). Todo sale de `extraer.js`, no a ojo.

Por qué importa: Alexander pidió explícitamente que la skill le dé ideas para
el hero y el CTA de toda la web, no solo del portafolio. Cada referencia agrega
**una fila a cada tabla** de `ESTILO.md`.

## 12. La firma, y qué robar

Tres preguntas, y son las que justifican todo lo anterior:

**a) ¿Qué hace que esta página no sea intercambiable?** Nombrar *un* gesto
concreto: no "es minimalista y elegante" sino "el nombre del cliente se compone
en un tamaño absurdo que sangra fuera del contenedor" o "la imagen solo aparece
al hacer hover, el índice en reposo es texto puro". Si no se puede nombrar así,
la respuesta honesta es **"nada — es intercambiable"**, y esa también es una
observación valiosa que hay que escribir.

**b) ¿Qué le robo a Axium, y de qué capa?** Ser específico sobre la capa:
arquitectura, tarjeta, imagen, tipografía, color, movimiento. Casi nunca se roba
la página entera; se roba una capa.

**c) ¿Qué NO le sirve a Axium y por qué?** Acá entra el test de aplicabilidad de
`SKILL.md`: si escala a 33, si depende de assets que no existen, si asume
narrativas largas, si se apoya en marcas reconocibles.

---

## Plantilla de la ficha de referencia

Copiar tal cual a `referencias/<slug>.md`.

```markdown
# <Nombre> — <url>

- **Analizada:** <fecha>
- **Cómo llegó:** <URL que pasó Alexander / captura / nombre>
- **Capturas:** `capturas/<slug>/`
- **Arquetipo de índice:** <de la dimensión 2>
- **Tratamiento de imagen:** <de IMAGENES.md>
- **Proyectos mostrados:** <número>

## Veredicto de Alexander
> <sus palabras textuales>

**Lectura:** <qué significa eso para la propuesta — una o dos líneas>

## 1. Promesa y audiencia
## 2. Arquitectura del índice
## 3. Ritmo y curaduría
## 4. Anatomía de la tarjeta
## 5. Tratamiento de imagen
- Qué se muestra:
- Soporte:
- Escenografía:
- Fondo:
- Luz:
- Óptica:
- Color:
- Consistencia — qué las unifica:
- Ratio y recorte:
- Recetas observadas (R#) y si requieren IA:
- Entregables que muestra y cómo trata lo no-pantalla:
## 6. Filtro y navegación
## 7. Tipografía
## 8. Color y fondo
## 9. Movimiento
## 10. Prueba y credibilidad
## 11. Ficha del caso y transición
## 11b. Estilo (fila para ESTILO.md)
- Paleta (lienzo / texto / acentos, hex):
- Tipografía (display / cuerpo / escala px / gesto):
- Hero (fondo / titular / meta / acción / altura):
- CTA (texto / fondo / radio / padding):
- Movimiento (opacity-0 / librería / videos):
## 12. Firma y transferencia
- **La firma en una frase:**
- **Qué robar (y de qué capa):**
- **Qué NO sirve para Axium y por qué:**

## Aplicabilidad a Axium
- ¿Escala a 33 proyectos? <sí/no/con qué cambio>
- ¿Depende de assets que no tenemos? <cuáles>
- ¿Se apoya en marcas reconocibles? <sí/no>
- **Capa transferible:** <arquitectura | tarjeta | imagen | tipografía | color | movimiento | ninguna>
```
