# El estándar de una ficha — la vara de aceptación

Las recetas de **cómo** se produce una imagen están en `COMPOSITOR.md` e `IMAGENES.md`.
Este archivo es otra cosa: **qué tiene que cumplir una ficha para darse por buena**.

Existe porque durante la sesión del 2026-09-29/30 cada ficha necesitó dos o tres
vueltas de corrección de Alexander, y casi siempre por lo mismo: el agente que la
construía no conocía la vara, así que la aprendía a base de que él la rechazara.
**Cada regla de abajo nace de una corrección suya concreta, y la corrección está
citada.** No son opiniones de diseño: son cosas que ya se rechazaron una vez.

Quien construya o rehaga una ficha **lee esto antes de empezar**, no al entregar.

---

## 0 bis · Para quién es esto (Alexander, 2026-10-02)

> «por gusto pones una imagen con código, **todo debe ser corporativo, intencionado
> para que lo vean gerentes de empresas**»

**El lector del portafolio es un gerente que decide una compra, no un
desarrollador.** Esto precede a todo lo demás y descalifica cosas que por criterio
técnico parecían buenas:

- **Nada de código, terminales, esquemas de base de datos ni diagramas técnicos en
  una PORTADA.** En una pieza de galería pueden valer si explican el encargo —la
  lámina del EA de Feniz es de las mejores que hemos hecho—, pero la portada es lo
  primero que ve alguien que no es técnico, y ahí no dicen nada.
- **Lo que sí lee un gerente**: el producto funcionando, la marca, el resultado, el
  orden. Dinero, control, escala, confianza.
- **«Corporativo e intencionado» significa sobrio y seguro**, no recargado: pocas
  piezas, grandes, bien colocadas, con aire.

**Y la medida lo confirma.** La portada de referencia que pasó Alexander
(`brandvm.com/case-studies/electric-scooter-branding-storefront`, 4000×2000) mide
**detalle 540** — y las nuestras de ese día iban de 1.200 a 2.800. Estábamos
metiendo demasiado dentro del cuadro. Para una portada, **la banda es 500–900 de
detalle**: menos elementos, más grandes, con más aire. El ≥1.200 del §12 es para
piezas de galería, no para la portada.

---

## 0 · Qué merece ser una pieza

> «el libro de reclamaciones estaba mandando caps de esto, que se ve feo» ·
> «no hagas por hacer o por rellenar» · «refina tu algoritmo para los portafolios»
> — Alexander, 2026-09-30

Esta sección va **antes que todas las demás**, porque el error más caro no es
encuadrar mal una pieza: es haber decidido que esa pantalla fuera una pieza. En
Feniz se publicó un par con el **formulario de alta** y el **libro de
reclamaciones**. Las dos capturas estaban limpias y pasaban todas las medidas. Y
las dos sobraban.

### El filtro, en este orden

1. **¿Esto lo tiene todo producto del mundo?** Alta, acceso, recuperar
   contraseña, confirmar correo, contacto, **libro de reclamaciones**, términos,
   cookies, 404, un buscador corriente, una tabla de ajustes. Si la respuesta es
   sí, **no es una pieza**: no prueba nada de lo que hicimos. Que exista en el
   producto no le da derecho a salir. Única excepción: que ahí hiciéramos algo
   realmente fuera de lo común y la pieza enseñe **exactamente eso**, no el
   formulario alrededor.
2. **¿Es prueba de trabajo?** Una ficha de portafolio es un expediente de
   pruebas. Un formulario no prueba nada.
3. **¿Se entiende a 648 px servidos?** Si para entenderse necesita la pantalla
   entera, entonces la pieza es **un recorte de detalle**, no la pantalla.
4. **¿Dice algo que ninguna otra pieza diga?**

Cuatro síes, o fuera. **Es preferible una ficha de nueve piezas que una de
catorce con cinco de relleno** — `undersight` se descartó precisamente por eso
(«negativo por costo», 12 medias por ficha), y `brandvm-ordering` quedó anotada
como «la vara de la poda».

### El orden en que se busca material

De las referencias que Alexander aprobó. **La captura plana es el último
recurso, no el primero** — y sin embargo es por donde se empieza siempre:

1. **Lo que solo este producto hace.** El EA en MQL5 que Feniz genera para cada
   trader; el ticket NFT verificable de VitalChain; el modelo de reglas de las
   propfirms. Es lo único irrepetible que hay.
2. **El material físico y fotográfico del cliente** — impresos fotografiados
   como objeto (`pentagram`), branding aplicado (`magnetic`), el equipo, el
   taller, el producto.
3. **El dispositivo en escenografía de marca** (`uncommon`, `adelt`: *«buenos
   mockups, úsalo para los rediseños»*). **Aquí entra Higgsfield**: se genera la
   escena **vacía, sin una letra ni un píxel de interfaz**, y encima se compone
   la captura real con `componer_pantalla.py`.
4. **La sección a sangre o enmarcada** (`fiddle` R20, `heartbeat` R19).
5. **El diagrama o la pieza anotada**: una composición que extrae un elemento y
   lo explica. Suele ser lo mejor de una ficha, porque dice lo que ninguna
   captura puede decir.
6. **La captura plana**, solo cuando las cinco anteriores no aplican.

### Y cada pieza necesita una idea, no sólo un sujeto

Elegir bien el sujeto (lo de arriba) es la mitad. La otra es **que la composición tenga
una idea**, y es donde Alexander nos sitúa por detrás de las referencias: *«en temas de
calidad de imágenes, creatividad sí, eso nos falta»* (2026-10-01).

La prueba, rápida: **¿esta composición serviría para otro cliente cambiando la captura?**
Si sí, es plantilla, no pieza. Las cinco preguntas de una pieza de pantalla —qué se lee,
sobre qué está apoyada, qué sale de la pantalla, qué manda el color, y esa— están en
`COMPOSITOR.md`, «novena generación», con los recursos de coste cero que salieron de
medir brandvm: la losa partida, los componentes extraídos a tamaño legible, desaturar el
contexto dejando color sólo dentro de la pantalla, y la marca gigante al 8 % detrás.

### Si la interfaz del cliente se ve mal, el arreglo es en el producto (2026-10-06)

> «hay algunas cosas, que en el mismo rematch, se ven mal»

La ficha enseña UI real, así que **una pantalla fea no se retoca: se arregla en el producto
y se recaptura**, o se elige otra. Antes de dar por buena una captura, revisarla buscando:

- **Iconos genéricos** (emojis, lucide suelto) donde la marca tiene iconografía propia.
- **Datos de prueba mal puestos**: imágenes recortadas, textos basura («dvfdbse»), fechas
  vencidas, porcentajes sin formato («5966.279069767442 %»), montos sin separador.
- **Personas reales sin licencia**: deportistas, famosos. En Rematch el hero de live usaba
  fotos de profesionales; reproducirlas en el portafolio extiende el riesgo a Axium.
- **El indicador «N» de Next en modo desarrollo** y avisos de cookies en las capturas locales.

Si el arreglo toca un repo de producto, va en una rama y **no se empuja ni se escribe en la
base de producción sin OK**; mientras, la ficha usa una pantalla que ya esté bien.

### La marca sale del manual, o casi no sale (2026-10-06)

> «usa eso en descargas para el manual de marca, no inventes taaanto… para bookit y vendiq y
> lumio no tenemos manual de marca así que no exageres con la sección de branding… ¿qué
> representan esos 3 puntos? si alguien se pone a analizar no entenderá el propósito»

- **Primero se busca la entrega del diseñador** (`find ~/Downloads -iname '*manual*'`,
  carpetas «ENTREGA FINAL…»). Rematch la tiene completa en
  `~/Downloads/ENTREGA FINAL-REMATCH-ABRIL-2026/`. Con manual, el capítulo son **sus páginas
  recortadas y sus archivos** (paleta, mockups, posts): `scripts/manual-rematch.py`.
- **Sin manual (Vendiq, Bookit, LumioLearn): logo, paleta y tipografía tal como están en el
  código, y nada más.** Un par de láminas, no un capítulo.
- **Prohibido:** anatomías con callouts numerados, capas «explicadas», vocabularios
  tipográficos y especificaciones que nadie definió. Un callout entra solo si su rótulo dice
  qué es, dentro de la imagen, y un documento de la marca lo respalda.
- **El manual manda sobre la web:** si la web usa otra fuente (rematch.pe usa Cal Sans), la
  ficha enseña la del manual (Loos Condensed + Halyard Display).
- Al recortar páginas: solo el panel visual (la columna de texto se queda fuera), márgenes
  parejos con el mismo color de fondo, sin números de página ni ejemplos en *lorem ipsum*.

### Cuándo tirar de Higgsfield

Cuando una pieza merece existir pero su única forma disponible sería una captura
plana y sosa. Entonces la escena se genera y la UI real se compone encima. **Nunca
para generar interfaz**, ni impresos, ni posts: eso es fabricar la prueba. Se
anuncia el gasto y se reportan los créditos.

---

## 1 · El alcance dicta la forma

> «no lo encasilles, cada proyecto que sea un mundo con su propia narrativa, pero
> siguiendo ciertos patrones de diseño. también depende de lo que hicimos por cada
> uno» · «a Alyer le hicimos manual de marca y branding, entonces su portada debe
> ser distinta»

**Antes de diseñar nada hay que saber qué se entregó**, y si no consta, se pregunta.
La forma sale de ahí:

| Alcance | Forma que le tocó |
|---|---|
| Identidad + aplicaciones + web + redes (**Aurore**) | Cuatro actos; **abre por la identidad**, porque la marca no existía antes del encargo |
| Manual + identidad + merch + brochure (**Alyer**) | Cuatro actos y **ni una sola captura de pantalla** |
| Solo la tienda, sobre plataforma propia (**ANJ**, **César Acosta**) | **Un acto largo** + el capítulo de decisiones técnicas con su diagrama |
| Solo la web (**VitalChain**, **Fenalsa**) | La ficha **dura lo que duró el encargo**. No se rellena con actos que no existieron |

**Nunca se inventa un acto.** Si no hicimos la identidad, no hay acto de identidad.

### 1 bis · Dos moldes, y cuál toca (2026-10-06)

> «me gusta. intenta hacer uno así https://www.pixelmatters.com/work/amigo para rematch»

| Molde | Componente | Cuándo |
|---|---|---|
| **brandvm** — lienzo claro, hero-tarjeta, lo que construimos, reto/enfoque/resultados, galería 2:1 y 1:1 | `case-story/case-story.tsx` | Webs, tiendas, marca, impresos: lo que se cuenta con piezas terminadas |
| **Pixelmatters** — lienzo OSCURO, título + logotipo, foto a sangre con el producto en la mano, meta en 4 columnas, texto que alterna de lado, vídeos de la UI, carrusel escalonado, cita + CTA, resultado con cifras | `case-producto/case-producto.tsx` | **Producto digital con panel o app**: los SaaS propios y los clientes con plataforma (Feniz, Fintrace, VitalChain) |

**Ritmo del molde Pixelmatters: compacto, pero que respire (2026-10-06).** Tres mensajes
seguidos de Alexander: *«optimiza el espacio, el storytelling, apóyate de scrolls horizontales
para que el usuario no esté bajando y bajando… grids de 3, carruseles en móvil»* → la primera
vuelta puso tiras en casi todo → *«ya estás haciendo demasiados carruseles o scrolls, haz un
intermedio»* · *«que respire todo entre sí»*. Lo que quedó:

- **Como mucho DOS tiras horizontales por ficha** (`capitulo`: texto en un tercio + tira que
  sangra a la derecha, mismo alto para todas las piezas y un pie corto en cada una). Van donde
  hay muchas piezas del mismo tipo: las páginas del manual y las pantallas del producto.
- **Lo demás, rejilla**: `trio` (tres cuadradas; en el celular una grande arriba y dos debajo,
  sin carrusel) y `par` (se apila en el celular).
- **Los vídeos, a todo el ancho**: son lo que más luce y no se meten en tiras.
- **El aire entre bloques no se recorta** para ganar alto: lo que se gana es agrupando.

**Sin adornos mudos, y todo entra (2026-10-06).** *«veo tres puntos seguidos a veces que no
sirven para nada»* · *«tampoco veo animaciones de entrada en nada»*. El «•••» de fin de
capítulo (copiado de Significa Dia) se quitó: el capítulo lo abre su título, con más aire
antes (`mt-24 md:mt-40`). Y en `CaseProducto` cada pieza entra al verse con `Aparece`
(opacidad + 28 px, 0,85 s, curva `[0.22, 1, 0.36, 1]`), en orden dentro de pares, tríos,
tiras, valores y cifras; la cabecera entra al cargar y la foto del héroe se asienta con escala,
sin fundido (LCP). Verificado con `reducedMotion` en los dos modos: 0 errores de hidratación.

Lo que el molde Pixelmatters exige, y sin lo cual no se usa:

- **Material para 10–14 piezas**, al menos **dos vídeos de la UI real** haciendo algo
  (recorrer la web, una animación del producto, un flujo). Sin vídeos es un CaseStory
  a oscuras.
- **Una foto de vida para el héroe**, que es también la portada (la del índice de
  Pixelmatters es la misma foto). Se genera la escena con la pantalla apagada y se compone
  la captura real (COMPOSITOR.md, decimotercera generación).
- **El color de la marca solo dentro de las piezas.** El lienzo es la tinta del cliente
  hundida hacia el negro (Rematch: `#000E17`), y la tipografía va en blanco y blanco al
  75 %. Ni un titular con el acento.
- **El texto alterna**: mitad izquierda, mitad derecha, tercio derecho. Nunca centrado.
  Párrafos de 22–45 palabras; dos textos seguidos solo antes de la última pieza.
- **Las cifras del resultado se miden en el código** (en Rematch: 8 formatos en
  `TournamentFormat`, 5 modelos de marcador). La ficha vieja decía 6 formatos: **mal
  copiado del documento, no medido**. Si no hay cifras de verdad, el bloque no va.
- **La cita es textual** y se toma de donde el cliente ya la publicó, con su nombre y
  cargo tal como aparecen.

---

## 2 · Texto

> «no redunde, no explayes tanto, lo principal ahí es la web» · «muy cargado de
> tanto texto. compacta»

- **Ningún párrafo por encima de 45 palabras**, en **es / en / pt**. El techo real
  medido en las fichas buenas es 43.
- La vara es `referencias/brandvm-ordering.md`: **~380 palabras en toda la ficha**,
  un párrafo de 28–80 por sección.
- **La fuente número uno de grasa** es el bloque de resultados que vuelve a listar
  las viñetas de «lo que hicimos». La segunda, la tercera frase de un párrafo de
  tres, que casi siempre es meta-comentario («cada dato de este párrafo se lee en
  las capturas de arriba»).
- Se podan **palabras, no hechos**: las cifras, los formatos, las integraciones y
  los planes se quedan.

⚠️ Al medir, **el carrusel «Más proyectos» y el CTA no cuentan**: son 280–370
palabras de chapa común a todas las fichas.

---

### Palabras escritas y palabras visibles (brandvm, 2026-10-01)

Las fichas de brandvm tienen párrafos de **58 y 88 palabras**, muy por encima de
nuestro techo de 45, y se leen más ligeras que las nuestras. No es contradicción:
**pliegan todos los párrafos de sección a tres líneas** con degradado y «Learn More»,
y la lista de highlights a dos viñetas de nueve. Lo que se ve son **unas 28 palabras
por sección**. En el cuerpo del caso escriben 309 y 333 palabras y **enseñan ≈155 y
≈160**; Aurore y Feniz escriben **547 y 533, todas visibles**.

- **El techo de 45 es sobre lo que se VE, y ahí se queda.** Lo que cambia es que por
  encima de 45 ya no está prohibido: **está plegado**. Un párrafo de 60–80 palabras es
  legítimo si `Plegable` solo enseña las tres primeras líneas.
- **La medida que manda es palabras por 1.000 px de cuerpo.** brandvm: 37 y 25.
  Aurore y Feniz: 60 las dos. **Techo: ≤45 palabras por 1.000 px.**
- ⚠️ Aurore tiene hoy un párrafo visible de **52 palabras**. El techo está incumplido
  en nuestra mejor ficha.

---

## 3 · Ritmo vertical

> «veo a veces mucho texto seguido»

- **Ningún tramo de más de ~700 px sin una imagen**, medido así: imágenes de más de
  120 px de alto, huecos de más de 360 px entre el final de una y el principio de
  la siguiente.
- **Es un problema de orden, no de cantidad.** Se arregla intercalando, no
  recortando: subir una pieza, partir la lista de viñetas, mover el reto detrás de
  la primera imagen.
- **Coste vertical medido de cada bloque** (`CaseStory`, a 1440):
  `text` ≈ 300 px · `act` ≈ 600 · `highlights` ≈ 650 · `tags` ≈ 640 ·
  `wide` = 656 · `pair` = 648.
  **Dos bloques sin imagen seguidos siempre pasan de 700**, así que cada texto va
  entre dos imágenes.
- El tramo de cierre de ~1.500 px (carrusel + CTA) es estructural y no se toca.

---

### El reparto vertical — la brecha real (brandvm, 2026-10-01)

§3 impide que haya mucho texto seguido. **No dice nada de lo contrario**, y por eso
acabamos poniendo texto entre todas las imágenes: en Aurore y en Feniz la tira de
imagen seguida más larga es **una sola pieza**. Medido en el cuerpo del caso, a 1440:

| | brandvm financiera | brandvm industrial | Aurore | Feniz |
|---|---|---|---|---|
| cuerpo del caso | 8.348 px | 13.499 px | 9.148 px | 8.941 px |
| paneles visibles | 12 | 21 | 10 | 9 |
| **% del cuerpo en imagen** | **73 %** | **80 %** | **50 %** | **51 %** |
| tira seguida más larga | 4.268 px · 6 piezas | 9.297 px · 13 | **656 px · 1** | **656 px · 1** |
| palabras por 1.000 px | 37 | 25 | 60 | 60 |
| banda muerta lateral | 4 % | 2 % | 11 % | 9 % |

- **Objetivo: ≥60 % del cuerpo en imagen.** Con siete piezas y 9.000 px sale **sin
  producir una pieza más**: podando texto y juntando piezas.
- **Regla nueva, simétrica a la de los 700 px: después del bloque de resultados no va
  más texto.** Las piezas que queden van seguidas hasta el carrusel. En las dos fichas
  de brandvm, el 58–60 % final del caso no tiene una sola palabra.
- **Dos imágenes seguidas no son un defecto**: son el recurso que nos faltaba. §3
  prohíbe texto sin imagen, no imagen sin texto.
- **El marco se llena**: ninguna pieza con más del 8 % del ancho en banda muerta
  lateral.

---

## 4 · Variedad de formato

> «veo que todo lo has puesto imagen columna entera, puedes usar 2 columnas también
> para variar»

- Alternar `wide` y `pair`. **Mínimo 2 o 3 `pair` por ficha.**
- Convertir **no es retiquetar**: una `wide` es 2:1 y una del par es cuadrada
  (1600×1600 de origen, 648 servidos). Un 2:1 recortado a cuadrado pierde la mitad;
  hay que recomponer desde las capturas.
- **Convertir no alarga el texto** (648 contra 656 de alto), y de paso se pierde el
  `lead` de la ancha, lo que *acorta* el tramo anterior.
- **Va bien en par**: dos estados del mismo componente, escritorio y móvil, antes y
  después, detalle y contexto. **Va bien en ancha**: una tira larga, un diagrama,
  una composición que necesita el ancho.
- **La prueba**: escribe la frase de cada mitad. Si las dos dicen lo mismo, no se
  parte.

### La variedad es de panel, no de bloque (brandvm, 2026-10-01)

Las dos fichas que pasó Alexander **no alternan nada**: usan una sola ranura 2:1,
repetida 9 y 16 veces. Y no se leen monótonas porque **una de cada tres losas viene
partida por dentro**: dos medias piezas en un único archivo, separadas por una calle
transparente y con las esquinas redondeadas horneadas en el propio PNG. Verificado
midiendo las losas descargadas: la calle cae **exactamente en el centro** y mide
≈32–44 px sobre 4000 (unos 11–15 servidos) — **3 de 10 en la financiera (30 %) y
5 de 17 en la industrial (29 %)**.

- **La regla no cambia; cambia dónde se cumple.** Hay que garantizar que **un tercio
  de las piezas enseñe dos cosas**, no que un tercio de los bloques sea `pair`.
- **Un `pair` y una `wide` partida cuestan lo mismo y dicen lo mismo.** El `pair` da
  dos cuadrados de 648×648; una `wide` de 2400×1200 partida por una calle de 15 px da
  dos mitades de ≈648×656. Gana la `wide` partida cuando las dos mitades son escena,
  objeto o fotografía; gana el `pair` cuando una mitad es un móvil vertical.
- **La calle y el radio se hornean en el archivo**, no en el CSS: la maquetación tiene
  un solo tipo de bloque y la variedad vive en el canal de imagen.


---

## 4 bis · Sin defectos no es lo mismo que diseñada

> «se ve muy apretado, no hay buen margen. diseña bien» · «diseño pobre. no hagas
> por hacer o por rellenar, todo lo que hagas debe estar hecho bien»
> — Alexander, 2026-09-30, sobre la galería de VitalChain

Las secciones anteriores quitan defectos: que nada se corte, que los márgenes
casen, que no haya franjas muertas. Eso lleva a **«no está mal»**, no a «está
bien». Una galería puede pasar todas las medidas y seguir siendo relleno.

En VitalChain, **once de catorce piezas eran el mismo recurso**: captura
rectangular flotando sobre campo rosa pálido, esquina redondeada, sombra suave.
Cada tile pasaba la vara por separado; el conjunto era un molde repetido.

- **Ningún recurso es el recurso por defecto.** «Captura sobre campo pálido en
  caja blanca» puede aparecer dos veces en una galería, no catorce. Si se repite,
  es porque es la mejor opción esa vez, no la cómoda.
- **Cada pieza se defiende en una frase**: qué enseña que ninguna otra enseña, y
  por qué está tratada así. Si la frase es «es la pantalla X», no está diseñada.
- **Mostrarlo todo es no mostrar nada.** Una pantalla densa metida entera en los
  648 px de un par deja el texto en ~6 px: ilegible. Donde el contenido es denso,
  **se amplía un detalle**. Dos filas legibles valen más que ocho en miniatura.
- **El campo da jerarquía.** Si la portada, los actos y las piezas de apoyo usan
  todos el mismo fondo, todo pesa igual y nada manda.
- **Agota el material físico antes que el de pantalla**: objetos, fotografía del
  cliente, impresos. Una ficha de solo capturas casi siempre es una ficha que no
  miró lo que había.
- **Menos piezas bien hechas que muchas de relleno.** Bajar de 14 a 9 porque cinco
  no se sostenían es una mejora, no una pérdida.

**La prueba que faltaba — la hoja de contacto.** Antes de entregar, montar las
piezas de la ficha en una sola rejilla de miniaturas y **mirarla de una vez**. Es
la única que detecta la monotonía, porque el defecto no está en ninguna pieza:
está entre ellas. Revisar tile por tile nunca lo encuentra — así se me pasó.

---

## 5 · Ninguna pieza repite sujeto

> «veo muchas caps redundantes, o que podrían estar en una sola imagen» · «mucha
> foto mockup de lo mismo»

- Dos tomas del mismo objeto es una de más. Dos ventanas de navegador seguidas del
  mismo molde se leen como dos capturas, no como una ficha.
- **Se mide, no se opina**: firma perceptual de 16×16 en gris, 256 bits contra la
  media, distancia de Hamming dentro de cada ficha. Por debajo de ~40 hay que
  mirarlo.
- Dos excepciones legítimas: **la misma pieza en sus dos encuadres** (`mobileSrc`,
  que nunca se ven a la vez) y **un díptico deliberado** (dos láminas del mismo
  manual con el mismo montaje y contenido distinto).
- La otra mitad del arreglo es **componer en una sola pieza lo que eran varias** —
  pero con una idea, no un collage: dos vistas que se explican entre sí.

---

## 6 · Color

> «los colores azul deberían cambiar de acuerdo a la marca, en aurore no combina»

- El acento es **de la marca del cliente**, no de Axium. `CaseStory` acepta
  `accent={{ base, dark, deep }}`.
- `base` va sobre fondo claro y `dark` sobre la tinta: **los dos tienen que pasar
  4.5:1** contra su fondo, y por eso casi nunca son el mismo color de la paleta.
  Un cian de marca puede dar 2,1:1 sobre blanco: se oscurece para `base` y el cian
  real se reserva para `dark`.
- **El área importa tanto como el valor.** Un rojo saturado necesita menos
  superficie que un bronce para pesar lo mismo: diez píldoras de contorno en rojo
  son una alarma.

---

## 7 · La portada

- **Nunca se ve en su proporción original.** La tarjeta de `/portafolio` la recorta
  a **4:3** y la tarjeta «Siguiente» de otra ficha a **16:10**. Hay que **simular
  los dos recortes** antes de publicarla.
- Tiene que **leerse a 380 px**, que es su ancho real en la rejilla.
- Tiene que **decir de quién es**: si el logotipo solo vive dentro de una captura,
  a ese tamaño mide 4 px y la tarjeta no nombra a nadie.
- **Cada producto propio cambia de género, no solo de dispositivo.** Cuatro escenas
  oscuras con un dispositivo sobre una superficie son la misma mancha en la rejilla.
- Una portada vive en **tres o cuatro sitios**: el JSON del caso, la sección de
  destacados del home, y las tarjetas «Siguiente» de otras fichas. **La de otra
  ficha es la que siempre se olvida.** Búscalas con `grep -rn "<nombre>" src/`.

---

## 7 bis · La portada se juzga como tarjeta, no como imagen

La portada **nunca se mira suelta**: se mira como se ve de verdad, que es la
tarjeta de `/portafolio`. Dos cosas que solo aparecen ahí (Feniz, 2026-10-01):

⚠️ **Rectificado el 2026-10-01: una portada se ve en DOS sitios distintos, y no
son iguales.** Lo que estaba escrito aquí describía mal el principal.

- **En `/portafolio` la portada va DESNUDA.** Recorte 4:3, **sin velo y sin título
  encima**: el nombre es un `<h2>` oscuro **debajo** de la imagen, sobre blanco
  (`portfolio-page-content.tsx`). O sea que ahí la pieza **se sostiene sola** y no
  hay ningún tercio que se oscurezca.
- **En el carrusel «Más proyectos» del pie de cada ficha** sí hay velo y título
  encima — pero el velo vivo es el de la variante **light**: `from-black/50
  via-black/20 to-transparent`, no el `/80` que figuraba aquí. La variante oscura
  **no está montada en ninguna página** (`case-next-project.tsx` pasa siempre
  `variant="light"`).
- **El nombre del caso sí se imprime ahí**, como `<h3>` blanco abajo a la
  izquierda, más un badge de industria arriba a la izquierda. **Así que un rótulo
  con el nombre horneado en la imagen sale dos veces** en ese carrusel. El
  logotipo del cliente puede estar; **el nombre escrito, no**. Y si el producto ya
  lleva la marca en su propia etiqueta, mejor aún: ahí no hay nada que duplicar.
- **Consecuencia práctica**: «lo luminoso arriba, lo oscuro abajo» sigue valiendo,
  pero con un velo del 50 %, no del 80 %, y **las dos esquinas inferiores y las
  dos superiores tienen que funcionar también sin velo**, porque en el portafolio
  no lo hay.
- **El velo oscurece el tercio inferior.** Nada importante se pone ahí abajo.

**El paso obligatorio**, y es el que faltó: simular el recorte 4:3 a **421×316**
(escritorio) y a **328×246** (móvil), **con el velo y el `h3` encima**, y mirarlo.

**El velo manda sobre el degradado.** La tarjeta oscurece el tercio inferior, así
que **lo luminoso va arriba y lo oscuro abajo**. La portada de Feniz tenía su
esquina más brillante (L 253) justo donde el velo pone su 80 % de negro: el velo
apagaba el punto más luminoso de la pieza y el bajo quedaba barro. Medir las
cuatro esquinas antes de dar una portada por buena.

**El sujeto tiene que separarse del campo.** Una ventana clara sobre campo claro
(ΔL ≈ 11-28) flota como un fantasma por mucho que esté bien compuesta. Un campo
oscuro abajo sube ese ΔL por encima de 100 y de paso arregla lo del velo.

Y una segunda prueba, de la lección 2 de `referencias/portadas-2026-09-13.md`
(*«la variedad está entre portadas, no dentro de una»*): **montar la portada
nueva en una rejilla con las de los casos vecinos y mirarla**. La de velas de
Feniz salió gemela de la de MainTech —las dos marino oscuro con logotipo
centrado— y eso solo se ve poniéndolas juntas.

⚠️ **El color medio NO detecta gemelas.** `maintech` y `anjsports` dan la
distancia más corta del índice (17,0 sobre RGB medio) y **no se parecen en nada**:
una es vacía, simétrica y tipográfica; la otra, cargada y pesada a la derecha, con
una figura y el único naranja del índice. La media sobre el marco entero colapsa
«campo oscuro + marca centrada» y «campo oscuro + foto» en el mismo promedio
porque es ciega a la distribución. **El detector de gemelas es la silueta y dónde
cae el ojo** — se ve entornando los ojos ante la rejilla de tarjetas, no en una
tabla de números. Lo mismo vale para `scripts/monotonia.py`: es apoyo, nunca
veredicto.

### Y el material tiene que ser el material

La familia *«material del mundo del producto en macro con el sello»* (el Wimbledon
de further) **funciona por contraste, no por parentesco**: el escudo es duro,
saturado y metálico sobre un campo blando y desenfocado. Si el sello está hecho
del mismo trazo, el mismo color y las mismas formas que la textura, **se disuelve
en ella**. «El logotipo ya está hecho de este material» es un argumento en contra,
no a favor.

Y el material tiene que ser real de verdad: siete velas sobre un degradado no son
un macro, son una dispersión. Si son velas, **el paso entre ellas es constante**
(en la pieza rechazada iba de 146 a 1340 px) y **las esquinas son vivas** (tenían
radio del 17 % del ancho, que es una tarjeta de UI).

---

## 8 · Los datos se miden, no se copian

En una sola sesión aparecieron **dos fichas publicadas con el stack equivocado**
(ANJ declaraba WordPress y era Next.js; MainTech declaraba NestJS y PostgreSQL, que
no se pueden medir desde fuera) y **tres «proyectos» que eran carteles de «sitio en
construcción»** contados como sitios porque devolvían HTTP 200.

- **200 no es un sitio.** Mide el texto que sirve: 140 caracteres y una inicial es
  un cartel.
- El stack se comprueba contra el sitio (`/_next/`, `wp-content`, cabeceras,
  `meta[generator]`), no contra el JSON.
- **Comprueba si el sitio sigue siendo el que enseña la ficha.** Le pasó a Sportt y
  a To Live Again: el sitio se rehizo y la ficha quedó mostrando el diseño viejo.
  Eso obliga a recapturar, no a parchear.
- `results` vacío si no hay métricas publicables. **Ninguna de las referencias de
  e-commerce analizadas (brandvm, BASIC, By Association Only) publica una sola
  cifra** en sus casos de tienda: la prueba es el inventario de lo construido.

---

## 9 · Lo que nunca se hace

- **La UI de un cliente no se inventa.** Ni sus impresos, ni sus posts. En esta
  sesión se borraron **cinco imágenes publicadas** que eran interfaz generada por
  IA con texto alucinado dentro del navegador («Nustro Soluciones»).
- **Un entregable que no existe no se fabrica.** Si no está guardado el manual, se
  recupera lo real —el logotipo, la tipografía y la paleta suelen estar vivos en el
  sitio del cliente— y se genera **solo la escena**. Un logo inventado presentado
  como trabajo nuestro es fabricar la prueba.
- **Los mockups se rotulan como mockups**, con esas palabras en el pie, y el cuerpo
  aclara que lo probado es el diseño y no la producción.
- **Vacío es mejor que falso**, pero *vacío y bien compuesto*: una credencial con
  solo un logotipo encima no es honesta, es básica.
- **La prueba del objeto honrado**, que resuelve la tensión anterior: *si en el
  mundo real ese objeto lleva datos que no diseñamos —nombre, cargo, número, QR—,
  el objeto no vale*. Un carné sin nombre no es un carné vacío, es un rectángulo.
  La regla de «vacío antes que falso» era correcta; el error estaba en **elegir el
  objeto**. Se cambia el sujeto por uno que en la vida real lleve la marca y nada
  más: una tapa de manual, una caja de herramientas, un rótulo.

### Y «mal cuadrado» también se mide

- **Ocupación del sujeto: 40–60 % del marco.** La credencial rechazada estaba al
  7,6 %; el casco, al 15 %.
- **Ningún margen mayor que el doble del menor**, salvo que lleve contenido.
- **Franjas muertas**: bandas de 100 px con desviación de luminancia por debajo de
  16. La credencial tenía el 65 % de la tarjeta en blanco liso; el casco, una
  franja de 333 px.
- **Nada puede brillar más que el sujeto.** Una ventana quemada a 255 roba el ojo.
- **La marca se dimensiona en el móvil**: ≥100 px a 360, o sea ≥30 % del ancho del
  marco. Al 21 % es ilegible.
- **Si el sujeto está a menos del 8 % de un borde, esa escena ya no se puede
  encuadrar**: se tira y se genera otra.

### El borde se mira, no solo se mide

Regla que costó una entrega (Alexander, 2026-09-30, sobre el par de Fenalsa):

- **Ningún fragmento de persona ni de objeto toca el borde sin que se entienda qué
  es.** Una mano, una manga, un hombro o medio bote cortados contra el canto son
  basura visual: o el sujeto entra entero y se lee, o se recorta fuera del marco
  por completo. No hay término medio. `fe-gastro` dejaba asomando la manga del
  chef y `fe-limpieza`, una mano flotante con un bote — el mismo delito en lados
  espejo, en las dos mitades de un mismo par.
- **Un sangrado solo vale si lo que sangra es un plano grande y reconocible**
  (una ventana de navegador, una tarjeta), nunca un trozo de cuerpo. Y el lado
  opuesto tiene que anclar: margen visible a un lado + corte duro al otro se lee
  como error, no como recurso. Así cayeron `fe-equipo` y `fe-formulario`, esta
  última partiendo el párrafo a media palabra («…el siguiente formul»).
- **Las dos mitades de un `pair` se cortan a la misma altura de contenido y con el
  mismo margen de campo**, o no se leen como pareja sino como dos recortes sueltos.

**Por qué esto no estaba antes:** la detección de franjas muertas (desviación de
luminancia < 16) **no ve esto**, porque un fragmento en el borde no crea una banda
plana: crea lo contrario. `fe-limpieza` pasó la medición con «ok» y el defecto se
veía a simple vista. Así que el paso es obligatorio y es visual:

> Recorta la banda exterior del 8 % de cada lado, míralas con `Read`, y pregúntate
> si lo que asoma se entiende. Si no se entiende, reencuadra.

`scripts/bordes.py <imagen…>` arma esa tira de contacto. **Medir no exime de
mirar**: los dos pasos, siempre.

---

### Y conviene saber que las referencias sí lo hacen

En las dos fichas de brandvm que pasó Alexander, **5 de 12 y 8 de 21 paneles** son
maquetas PSD con el logotipo del cliente encima —sudadera, valla, tótem, camión,
casco, cartel de obra— y **seis más** son fotografía corporativa del propio cliente
(los anillos olímpicos de París, la Torre Eiffel, una mina a cielo abierto). **Más de
la mitad de su volumen es material que ellos no produjeron.** Una losa llega a enseñar
el sitio de la matriz, cuando el propio texto del caso dice que el encargo era
*distinto* del corporativo de la matriz.

**Nuestra honestidad es ventaja, no carencia**: pie con la URL real, «mockup» rotulado
cuando lo es, y recorte móvil propio por pieza —ellos sirven la misma losa 2:1 a
361×181 en el teléfono, con tipografía de 4–6 px—. La brecha que sí hay que cerrar es
**el reparto vertical**, no el inventario de maquetas.

---

## 9 bis · Capturar un área privada

Una ficha gana mucho cuando enseña el producto por dentro, y para eso hay que
levantar la app en local contra una copia de la base. El riesgo es evidente, así
que el procedimiento es fijo (Feniz, 2026-09-30):

1. **Se anonimiza la base ANTES de abrir el navegador**, nunca se retoca la
   captura después.
2. **Si el valor describe a un cliente concreto, se sustituye** — aporte o no
   aporte. No vale la frontera «¿es un dato personal?», porque deja fuera cosas
   que sí hay que cambiar. En Feniz se colaron en primera vuelta, y todas
   pasaban esa frontera: los **UUID** de cuenta y conexión, los **saldos
   iniciales** reales, los **números de cuenta** y las **fechas de alta**.
3. **Lo que es catálogo público se queda.** El escalón «25K» de una propfirm, el
   precio de un plan, el nombre de un bróker o de un símbolo no describen a
   nadie: son producto publicado. Sustituirlos rompe la coherencia de la pieza
   (si la cuenta se llama «Challenge 25K», su importe tiene que ser 25.000).
   La prueba no es «¿sale en el volcado?» sino **«¿esto describe a un cliente
   concreto o describe el producto?»**.
4. **Se verifica contra el volcado**, no de memoria: restaurar con `pg_restore`
   y comprobar que cada valor publicado **no** aparece. Lo que sí aparezca tiene
   que ser catálogo, y hay que poder decir por qué.
5. Al terminar: **borrar la base de demostración y apagar el servidor local.**

Lo que viene del sitio público en vivo no pasa por aquí: las cifras del hero de
un cliente son su propia comunicación.

---

## 10 · Antes de entregar

Verificación mínima, y **todo medido, no mirado por encima**:

- [ ] `npx tsc --noEmit` y `npx biome check --write` limpios.
- [ ] La ficha y `/portafolio` a **1440 y 360**, en **es / en / pt**.
- [ ] **El código HTTP**, además de imágenes rotas y desborde horizontal. Una página
      puede devolver **500 y parecer bien**: ya pasó, y el barrido la dio por buena
      porque solo miraba las imágenes.
- [ ] **El reparto vertical**: ≥60 % del cuerpo en imagen y ≤45 palabras por 1.000 px.
      Y después del bloque de resultados, ninguna palabra más.
- [ ] **La hoja de contacto de la galería, mirada de una vez** (§4 bis). Si las
      piezas juntas se leen como el mismo molde repetido, la ficha no está lista
      por mucho que cada pieza pase sola.
- [ ] **Las tiras de borde** con `scripts/bordes.py`, miradas (§9). La medición de
      franjas muertas **no ve** un fragmento cortado contra el canto.
- [ ] Ningún párrafo > 45 palabras · ningún tramo > 700 px · ≥2 `pair` · ninguna
      pieza repitiendo sujeto.
- [ ] La portada simulada a 4:3 y a 16:10, y legible a 380 px.
- [ ] **Mirar cada pieza con Read**, a 1:1 y montada en la página. Una escena
      aprobada en miniatura puede tener la geometría rota a tamaño real: pasó con la
      red de pádel, cuya malla no era de pádel y cuyo riel se arqueaba.
- [ ] **Nombres de archivo nuevos** al rehacer una pieza: la caché de `/_next/image`
      sirve la versión vieja si se reutiliza el nombre. Ha mordido cuatro veces.
- [ ] Borrar las piezas que quedan sin uso.

---

## 11 · Al generar (Higgsfield hasta el 2026-10-01; desde entonces OpenAI)

> Lo que sigue se aprendió con Higgsfield y **vale igual con OpenAI**, salvo la parte de
> créditos: con OpenAI no hay saldo consultable (la clave no lee el gasto), así que cada
> llamada se apunta en `scripts/gastos-openai.jsonl` con `scripts/openai-imagen.py`, y el
> límite de la cuenta es de **5 imágenes por minuto** (la sexta devuelve 429 y no cobra).

- **Preflight con `get_cost` SIEMPRE, y nunca dar por sabido el precio.** El coste
  varía con los parámetros mucho más de lo que parece: en el historial de un solo
  día hay cargos de **0,25 · 1,5 · 2,75 · 15** créditos por generación, más 2 por
  reescalado. La cifra de «2,75 por `high`/2k» que estuvo escrita aquí **era falsa
  como regla**, y por confiar en ella se reportaron saldos inflados durante toda
  una sesión.
- **El saldo se CONSULTA con `balance`, no se calcula restando** de un número
  recordado. Así se pasó de creer que quedaban 664 créditos a descubrir que
  quedaban 0,77. Consultarlo antes de prometer una tanda y al cerrarla.
- **Generar varias variantes y elegir mirándolas a 1:1.** Apostar a un solo tiro es
  lo que hundió dos vueltas seguidas de la portada de Rematch.
- **El bokeh fabrica fallos, no los esconde**: al pedir desenfoque el modelo rellena
  con formas plausibles e incoherentes. Si la escena necesita nitidez, **foco
  profundo y cámara lejana**.
- **Editar en vez de regenerar** cuando solo falla un detalle: pasando la escena
  como referencia se conserva el encuadre y el cuadrilátero de la pantalla queda a
  un par de píxeles del original.
- **Coherencia del atrezo**: pala de pádel → pelotas de pádel. Y si hay que rotular
  el atrezo para que se entienda, la escena no está funcionando: una foto
  profesional no subtitula sus objetos.
- El estilo que pide Alexander es **sutil y profesional**. Escenas vacías, sin una
  letra, y la marca real compuesta encima.

---

## 12 · El acabado se mide (brandvm, 2026-10-01)

> «el portafolio no se compara con los acabados de las imágenes que hace brandvm»
> — Alexander

Tenía razón, y «acabado» no es una impresión: son tres cifras. Medidas con todas
las piezas **remuestreadas a 600 px de ancho**, para que la comparación sea a
igualdad de visionado y no esté sesgada por el peso del archivo.

| | original | rango dinámico | **nitidez local** | %negro puro |
|---|---|---|---|---|
| brandvm · employee-benefits | **8000×4000** | 243 | **1.286–1.419** | 0,2–2,0 |
| brandvm · talent-group | 4000×2000 | **255** | **1.157–1.999** | **35–58** |
| aurore (nuestra mejor) | 2400×1600 | 195 | 644 | 0,0 |
| feniz | 2400×1600 | 231 | 815 | 0,0 |
| clefast (rechazada por «sin vida») | 2400×1600 | 186 | **485** | 1,0 |

**1 · Resolución.** Sirven a **8000×4000**; nosotros a 2400×1600. Factor 3,3
lineal. La API de OpenAI admite **3840 px por lado**, así que las piezas se
producen a **3840×2560** (anchas) y **2560×2560** (de par), no a lo de antes. Y los
talleres de composición se renderizan a **`deviceScaleFactor` 3 o 4**: ahí el
detalle lo pone Playwright y **no cuesta ni un token**.

**2 · Detalle local: de 2 a 4 veces más que nosotros, a igualdad de visionado.**
Esa es la definición operativa de acabado. No se arregla con menos compresión: no
hay detalle que comprimir. Se arregla produciendo más grande y con materia real.

**3 · Usan el rango completo y se comprometen con un grado.** Una sola losa suya
tiene **11,7 % de blanco puro y 57,8 % de negro puro en el mismo cuadro**.
Nosotros nunca pasamos de 231 de rango y **nunca tocamos el negro real**:
entregamos neutro, que es lo mismo que entregar tibio.

**Umbrales a partir de ahora:** rango dinámico **≥230**, nitidez local **≥800** a
600 px de ancho, y **píxeles por debajo de 5 de luminancia presentes** en toda
pieza con grado oscuro. Claridad media alta y negros reales **no se excluyen**: se
tienen las dos.
