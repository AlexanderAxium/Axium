---
name: portafolio-axium
description: >
  El cerebro que se está entrenando para rediseñar el portafolio de Axium
  (axium.com.pe). Acumula el análisis de portafolios de referencia que Alexander
  va pasando —enlaces, capturas, nombres de estudios— los desarma con una rejilla
  fija, destila los patrones que se repiten, y cuando ya tiene suficiente
  evidencia propone (a) la estructura del índice de portafolio y la anatomía de
  la ficha, y (b) la librería de prompts para generar las imágenes profesionales
  de los 33 proyectos.
  **Usarla siempre que aparezca cualquiera de estas cosas**: Alexander pasa un
  enlace o captura de un portafolio/estudio/agencia "mira este", "analiza este",
  "este me gusta"; se habla del rediseño del portafolio, de la grilla de casos,
  de las tarjetas de proyecto o de la página /portafolio; se pide "proponme la
  estructura" o "dame los prompts de imágenes"; se va a generar, recapturar o
  reemplazar las portadas de los proyectos en public/images/proyects; o se
  pregunta "¿ya estás entrenado?" / "¿cuántas referencias llevas?".
  Piezas: REJILLA.md (cómo se desarma una referencia), PATRONES.md (la síntesis
  viva, lo que se ha aprendido hasta ahora), IMAGENES.md (la doctrina de imagen y
  la anatomía del prompt), AXIUM.md (el estado real de la web hoy),
  referencias/ (un archivo por portafolio analizado), inventario.mjs.
---

# Portafolio Axium — el cerebro en entrenamiento

Esta skill existe para un encargo concreto: **rediseñar la sección de portafolio
de Axium**. No arranca sabiendo cómo debe verse. Arranca sabiendo *cómo mirar*, y
se llena de criterio a medida que Alexander pasa referencias.

Es deliberadamente lo contrario de una plantilla. Una plantilla te da la respuesta
antes de haber mirado nada; acá la respuesta se construye con la evidencia que
entra, y cada referencia deja rastro escrito para que la siguiente sesión no
empiece de cero.

Es complementaria a la skill `creator`: ahí vive el gusto general de Alexander
(`DISENO.md`), la maquinaria para no caer en la primera idea (`DIVERGENCIA.md`) y
los errores ya cometidos (`LECCIONES.md`). **Acá vive solo lo del portafolio.**
Antes de la propuesta final, leer `creator/DISENO.md` § 0 (la firma y las dos
pasadas) y `creator/DIVERGENCIA.md`. No duplicar acá lo que ya está allá.

---

## Las piezas

| Archivo | Qué es | Cuándo leerlo |
|---|---|---|
| **[REJILLA.md](REJILLA.md)** | Las 12 dimensiones con las que se desarma una referencia, y por qué cada una importa | Cada vez que entra una referencia nueva |
| **[PATRONES.md](PATRONES.md)** | La síntesis viva: 16 patrones confirmados, señales, tensiones (y cuáles cerró Alexander), veredictos textuales y **la dirección que la propuesta va a defender**. **Es el archivo que se escribe, no solo se lee** | Al ingerir (para actualizar) y al proponer (para decidir) |
| **[IMAGENES.md](IMAGENES.md)** | La doctrina de imagen —por qué la UI nunca se inventa— y la anatomía de los 9 slots del prompt | Al analizar el tratamiento de imagen de una referencia, y al escribir prompts |
| **[AXIUM.md](AXIUM.md)** | El estado real de la web hoy: archivos, tokens, los 33 proyectos, el inventario de assets y las debilidades detectadas | Antes de proponer cualquier cosa, y al juzgar si una referencia le aplica a Axium |
| **[referencias/](referencias/)** | Un `.md` por portafolio analizado + `capturas/<slug>/` con las capturas | Al sintetizar y al proponer |
| **[ESTILO.md](ESTILO.md)** | La tabla comparativa de estilo: paleta, tipografía, hero, CTA y movimiento de todas las referencias en las mismas columnas, con ideas para el hero y el CTA de Axium | Al ingerir (agregar la fila) y al proponer el hero/CTA |
| **[PROMPTS-ANJSPORTS.md](PROMPTS-ANJSPORTS.md)** | Los 5 prompts de Higgsfield para ANJ, con dónde va cada imagen. Modelo para escribir los de los demás casos | Cuando Alexander vaya a generar |
| **[COMPOSITOR.md](COMPOSITOR.md)** | Cómo se producen las imágenes **sin IA**: HTML/CSS + Playwright. El flujo, la plantilla, las recetas con código probado y los errores que ya mordieron | Al producir las imágenes de cualquier caso |
| **[CASO-ANJSPORTS.md](CASO-ANJSPORTS.md)** | El primer caso trabajado de punta a punta: hallazgos, ADN visual, las 5 imágenes y la ficha. **Revertido en la web el 2026-09-11**; queda como aprendizaje | Como modelo para el siguiente caso |
| **[HIGHLIGHTS-HOME.md](HIGHLIGHTS-HOME.md)** | La sección oscura de highlights del home (modelo Koto) con Vendiq, Rematch, LumioLearn y Bookit: estructura, portadas, prompts de fondo, assets y hallazgos en esos sitios | Al tocar el home, al hacer la página tipo koto.com/work, o al producir portadas de un SaaS |
| **[scripts/](scripts/)** | Scripts de Node probados: captura a 2x/3x, aislamiento de UI y logos con transparencia, render de portadas y teléfonos | Al producir imágenes (ver COMPOSITOR.md § Segunda generación) |
| **[extraer.js](extraer.js)** | La función que se pega en `browser_evaluate` para sacar colores computados, fuentes, escala, CTAs, imágenes, señales de animación y conteo de proyectos de una página real | En cada ingesta, sobre el índice **y** sobre una ficha |
| **[COLA.md](COLA.md)** | Candidatas encontradas pero no analizadas, con por qué están ahí y las descartadas | Cuando Alexander pide más referencias o cuando se agota lo que pasó él |
| **[inventario.mjs](inventario.mjs)** | Audita los 33 proyectos: qué portada tiene cada uno, sus dimensiones, ratio, peso y cuántos assets. Dice cuáles hay que rehacer | Antes de escribir prompts, y para dimensionar el trabajo de imágenes |

---

## Los tres modos

En cada turno, primero decidir en cuál de los tres se está. Casi siempre es obvio
por lo que dijo Alexander.

### Modo 1 — INGESTAR (llega una referencia)

Disparadores: pega un enlace, una captura, o dice un nombre ("mira el de
Basic Agency", "este de Awwwards", "el portafolio de X").

1. **Capturar lo real, y medirla.** Si es una URL, verla de verdad — no describirla de
   memoria ni de lo que "suele hacer" ese estudio. Con las herramientas de
   Playwright: `browser_navigate`, `browser_resize` a 1440×900 y a 390×844, y
   `browser_take_screenshot` (con `fullPage` para el índice completo). Guardar en
   `referencias/capturas/<slug>/` como `indice-desktop.png`,
   `indice-full.png`, `indice-mobile.png`, y si el índice lleva a fichas de caso,
   `caso-<algo>.png`. **Si la página es un scroll infinito o con animación de
   entrada, hacer scroll antes de capturar** — si no, se captura el estado vacío
   y el análisis sale falso.
   Correr `extraer.js` (pegar la función en `browser_evaluate`) sobre el índice
   y sobre una ficha: da la paleta en hex, las familias con pesos y escala, el
   hero, los CTAs, los ratios de imagen, cuántos elementos esperan con
   `opacity: 0`, y cuántos proyectos hay. **Ojo:** el extractor hace scroll
   hasta el final; en sitios que navegan solos al siguiente caso (locomotive,
   heartbeat) la URL cambia — eso también es un dato. Descargar 3–6 imágenes a
   resolución original con `curl` y mirarlas con `Read`: el tratamiento de
   imagen se analiza sobre el archivo, no sobre la miniatura.
   Si Alexander pasó una captura en vez de una URL, esa captura es la evidencia:
   guardarla igual en esa carpeta.
2. **Desarmarla con la rejilla.** Leer `REJILLA.md` y recorrer las 12
   dimensiones. No inventar lo que no se ve: si una dimensión no se puede
   observar (p. ej. el movimiento en una captura estática), escribir
   `no observable` en vez de suponer. Un patrón construido sobre suposiciones
   contamina todo lo que venga después.
3. **Escribir `referencias/<slug>.md`** con la plantilla del final de
   `REJILLA.md`.
4. **Pedirle el veredicto a Alexander.** Esta es la señal más valiosa de todas y
   es la única que no se puede sacar mirando la página. Preguntar corto y
   concreto — no "¿qué te parece?" sino algo como: *"¿esta te gusta entera, en
   partes, o la pasaste como contraejemplo? Y si es en partes, ¿qué parte
   exactamente: la grilla, el tratamiento de las imágenes, la tipografía, el
   movimiento?"* Guardarlo textual en la sección **Veredicto de Alexander** de la
   referencia. Sus palabras exactas valen más que la paráfrasis.
5. **Actualizar `PATRONES.md`** (contadores, señales → confirmados al llegar a
   3, tensiones nuevas, veredicto en la tabla) **y `ESTILO.md`** (una fila en
   cada tabla). Si apareció una receta de imagen nueva, va a `IMAGENES.md` con
   su número.
6. **Reportar el avance en 3–5 líneas.** Alexander preguntó explícitamente por el
   momento en que esto esté "bien entrenado", así que después de cada ingesta hay
   que decirle dónde está: cuántas referencias, qué arquetipos ya están cubiertos,
   qué falta para cruzar la barra, y —si apareció— el patrón nuevo que se
   confirmó. Sin esto, el entrenamiento es una caja negra y él no puede decidir
   cuándo parar de buscar ejemplos.

Si Alexander pasa **varias referencias de golpe**, ingerirlas todas antes de
reportar, y reportar una sola vez con el balance completo.

### Modo 2 — SINTETIZAR (releer todo y reordenar)

Disparadores: "¿qué has aprendido?", "resume", cada ~4 referencias nuevas, o
cuando dos referencias se contradicen de frente.

Releer **todas** las `referencias/*.md` juntas y reescribir `PATRONES.md` de
cero. Reescribir, no parchar: los patrones cambian de forma cuando se ven en
conjunto, y un archivo parchado incrementalmente termina siendo una lista de
observaciones sueltas en vez de una tesis.

Lo que hay que buscar al sintetizar, más allá de contar repeticiones:

- **Lo que hacen todos y por eso no distingue a nadie.** Si las 8 referencias
  usan grilla de 2 columnas, la grilla de 2 columnas no es la firma de nadie: es
  el suelo. Anotarlo como suelo, no como hallazgo.
- **Lo que hace uno solo y funciona.** Ahí suele estar la firma. Preguntarse:
  ¿por qué nadie más lo hace? ¿es caro, es riesgoso, o simplemente no se les
  ocurrió?
- **Las tensiones.** Dos referencias buenas que resuelven lo mismo al revés
  (mostrar 6 proyectos vs. mostrar 40; imagen limpia vs. imagen escenografiada)
  son la información más útil que hay: marcan un eje de decisión real, no una
  regla. Registrarlas como eje, con qué gana y qué se pierde en cada extremo.
- **Lo que no le transfiere a Axium.** Ver la sección "Aplicabilidad" abajo.

### Modo 3b — UN CASO A LA VEZ (el flujo real de producción)

Desde 2026-09-01 el trabajo va **caso por caso**, empezando por ANJ Sports. Por
cada uno:

1. **Leer** su JSON (`src/data/cases/<slug>.json`), su ficha
   (`casos-de-exito/<slug>/`) y sus imágenes actuales.
2. **Capturar el sitio en vivo** con Playwright: hero, 3–4 secciones, móvil y
   página completa. **A 2880×1800 de viewport** — el MCP no expone
   `deviceScaleFactor`, y duplicar el viewport da la resolución de composición
   que hace falta (verificado en ANJ: el layout aguanta).
   Guardar en `capturas-clientes/<slug>/`.
3. **Verificar el stack declarado** contra el sitio real: `script[src*="/_next/"]`,
   `wp-content`, `meta[generator]`, dominio de los assets. **En ANJ el JSON
   decía WordPress y era Next.js** — asumir que el dato puede estar mal.
4. **Extraer su ADN visual** con `extraer.js`: lienzo, display, texto, acento,
   y **el gesto propio** (lo que ningún otro cliente tiene).
5. **Encontrar la historia real** leyendo el sitio: qué hace el cliente que un
   competidor no. Casi siempre está y el texto del caso no lo cuenta.
6. **Escribir `CASO-<SLUG>.md`**: hallazgos, ADN, material capturado, las 4–6
   imágenes con su receta, la ficha sección por sección, y lo que falta
   preguntar.
7. **Producir las imágenes** con `COMPOSITOR.md` (HTML/CSS + Playwright, sin
   IA salvo que haga falta un fondo que no exista).
8. **Escribir los prompts** en `PROMPTS-<SLUG>.md` para que Alexander genere en
   Higgsfield — **siempre**, aunque la mayoría de las imágenes salgan de
   composición. Él quiere generarlas él; no dárselos es quitarle una
   herramienta.
9. **Construir la ficha** con el modelo **Stormborn** (ver `PATRONES.md`):
   hero + Overview con bullets + El reto + Enfoque y resultado + **la web
   completa como tira larga**. Techo: ~200 palabras. Si el cliente tiene una identidad fuerte, la ficha
   la hereda con secciones propias en su `<Slug>Content.tsx` — los bloques
   compartidos de `case-blocks/` son todos claros y aplanan la personalidad.
   Reutilizar de ahí solo `CaseNextProject` y `CaseContactCTA`.
10. **Verificar**: `tsc --noEmit`, `biome check`, la página en el dev server
   **con scroll completo antes de capturar**, y móvil a 390 (medir
   `scrollWidth` vs `innerWidth` para descartar desbordes).

### Modo 3 — PROPONER (la entrega)

Disparadores: "proponme la estructura", "dame los prompts", o cuando se cruza la
barra de entrenamiento y Alexander da luz verde.

**No proponer antes de cruzar la barra.** Si la pide antes, decirlo claro y
ofrecer una propuesta preliminar marcada como tal: *"llevo N referencias, la
barra está en X; te puedo dar un borrador ahora pero le va a faltar Y"*. Que él
decida — pero que decida informado, no creyendo que está viendo la propuesta
definitiva.

La entrega son **tres documentos**, en este orden y en este mismo turno:

**A. La estructura** (`PROPUESTA-ESTRUCTURA.md` en la raíz de la skill)
1. La tesis en una frase: qué debe hacerle sentir el portafolio de Axium a quien
   llega, distinta de lo que hace hoy.
2. La firma: el gesto formal que hace que esta página no sea intercambiable con
   la de cualquier otra agencia. Una sola, concreta, describible sin adjetivos.
   Si no se puede nombrar en una frase que ninguna referencia cumpliría igual,
   todavía no hay firma — volver a `creator/DIVERGENCIA.md`.
3. Arquitectura del índice: qué se ve al entrar, cómo se ordenan los 33, si hay
   jerarquía (destacados vs. resto) o todos pesan igual, cómo se pagina o si se
   pagina.
4. Anatomía de la tarjeta: qué campos, en qué jerarquía, el ratio de imagen, el
   hover, el estado de foco.
5. Filtros: qué sobrevive de los tres ejes de hoy (industria / servicio /
   tecnología) y qué se corta. Hoy son 15 industrias para 33 proyectos —
   eso no es un filtro, es un índice.
6. Movimiento: entrada, hover y la transición hacia la ficha del caso.
7. Responsive: qué pasa en móvil, que es donde la mayoría de las grillas de
   agencia se caen.
8. Qué se toca y qué no, en archivos reales (ver `AXIUM.md`).
9. **Las dos pasadas de `creator/DISENO.md`**: escribir el plan, después
   autocriticarlo con contexto limpio preguntando "¿esta página podría ser de
   otro estudio con solo cambiar el logo?". Si la respuesta es sí, no está lista.

**B. Las recetas de imagen** (`PROPUESTA-IMAGENES.md`)
Ver `IMAGENES.md` para la doctrina, las recetas y la anatomía. No son solo
prompts: son recetas de composición donde el prompt es un ingrediente opcional.
La entrega incluye:
- El **bloque maestro de estilo**: el texto constante que va en los 33 prompts y
  es lo que hace que la grilla se lea como un solo sistema y no como 33 imágenes
  sueltas. Esto es lo que arregla el problema real de hoy.
- **La receta asignada a cada uno de los 33**, con su entregable principal y
  las **variables por proyecto** (color de marca muestreado, soporte, secciones
  a capturar), tabuladas.
- **3 recetas completas ya escritas paso a paso** como muestra, de proyectos de
  tipo deliberadamente distinto (p. ej. una tienda, un SaaS sin `liveUrl`, uno
  con branding + brochure), para que Alexander pueda probar antes de producir
  las 33.
- La lista de **negativos**.
- El **procedimiento de compositado**: dónde entra la captura real dentro de la
  imagen generada.

**C. Ideas de hero y CTA para la web** (`PROPUESTA-ESTILO.md`)
Alexander lo pidió aparte del portafolio: *"así tal vez podrías darme ideas de
cómo rediseñar un hero section, un call to action"*. Sale de las tablas de
`ESTILO.md`: 3–5 direcciones para el hero del home y 3–5 para el CTA
principal, cada una con la referencia de la que sale, qué token de Axium usa
(Gilroy / GuarujaTitle / navy / azul / teal) y qué habría que cambiar. Ideas,
no maquetas: el código no se toca hasta que él lo pida.

---

## La barra: cuándo está "bien entrenado"

Alexander pidió explícitamente que la propuesta salga *cuando ya esté bien
entrenado*. Contar referencias no alcanza —seis portafolios parecidos entre sí
enseñan menos que tres que se contradicen— así que la barra es de cobertura y de
capacidad, no de volumen:

1. **≥ 6 referencias analizadas** con su ficha escrita.
2. **≥ 3 arquetipos de índice distintos** cubiertos (p. ej. grilla clásica,
   lista/tabla, scroll horizontal, apilado a pantalla completa). Seis grillas de
   2 columnas cuentan como un arquetipo.
3. **≥ 3 tratamientos de imagen distintos** cubiertos (ver `IMAGENES.md`). Este
   es el eje que más importa para el encargo: la mitad de la entrega son prompts.
4. **≥ 2 referencias con veredicto negativo o parcial** de Alexander. Saber qué
   *no* quiere delimita el espacio tanto como saber qué quiere, y sin
   contraejemplos la propuesta tiende a ser un promedio de todo lo que le
   gustó — que es exactamente cómo se ve una plantilla.
5. **≥ 5 patrones confirmados** (vistos en 3+ referencias) y **≥ 2 tensiones**
   registradas en `PATRONES.md`.
6. **La prueba real**: se puede escribir la firma de Axium en una frase que
   *ninguna* de las referencias analizadas cumpliría igual. Si la frase le
   quedaría bien a cualquiera de ellas, todavía no hay propuesta, hay imitación.

Los puntos 1–5 se verifican solos leyendo los archivos. El 6 es el que hay que
mirar de frente y con honestidad, porque es el único que no se puede tildar por
conteo.

---

## Aplicabilidad: por qué muchas referencias no le sirven a Axium tal cual

Casi todo portafolio admirable en internet es de un estudio con **6 a 12
proyectos curados**, cada uno con fotografía dirigida y presupuesto de
producción. Axium tiene **33 proyectos**, de PyMEs peruanas, con assets
heterogéneos: algunos con siete imágenes, varios con una sola captura de home.

Eso no invalida esas referencias — pero obliga a preguntar en cada una, y a
dejarlo escrito en la ficha:

- ¿Esto **escala a 33** o solo se ve bien con 8? (Un scroll horizontal de
  proyectos gigantes con 33 items es una tortura.)
- ¿Depende de **imágenes que no tenemos** ni podemos producir? Y si sí, ¿la parte
  generable con IA reproduce el efecto o solo su cáscara?
- ¿Asume proyectos con **narrativa larga** cuando varios de los nuestros son una
  web informativa de cinco secciones?
- ¿Funciona con **nombres de cliente que nadie reconoce**? Un portafolio que se
  apoya en el prestigio de las marcas (Nike, Spotify) no transfiere a Clefast o
  JCP Ingenieros: ahí el peso lo tiene que cargar el trabajo mostrado, no el
  logotipo.

Una referencia que no escala igual sirve: se le roba el tratamiento de imagen o
la tipografía, no la arquitectura. Anotar exactamente **qué capa** es la
transferible.

---

## Reglas que no se negocian

- **Todavía no se rediseña nada.** Alexander lo dijo el 2026-09-01: *"tu trabajo
  por ahora es mejorar la skill, aún no rediseñes ningún portafolio mío"*. Hasta
  que él diga lo contrario, esta skill **no toca `src/` ni `public/`**: analiza,
  registra, propone en `.md`. La única excepción son los scripts de la skill.
- **Cada caso de éxito tiene su propia creatividad.** Alexander, 2026-09-01:
  *"cada caso de éxito quiero que tenga su creatividad"*. La ficha de un cliente
  **hereda la identidad de ese cliente** (su lienzo, su acento, su gesto) en
  vez de repetir la plantilla de Axium. Axium aporta la retícula, la tipografía
  y el ritmo; el cliente aporta el color y la atmósfera. Es "personalidad por
  proyecto" llevado de la portada a la ficha entera.
- **Los rediseños de la web del cliente no entran** salvo que lo pida: *"no
  haremos rediseño de su web, quedará tal cual"*. Se mejora **el caso dentro de
  Axium**, no el sitio del cliente.
- **Los SaaS propios de Alexander (Rematch, Lumio, NextFact, Vendiq, Bookit)
  van al final.** La primera fase es solo trabajo para clientes: *"déjalas para
  el final, concentrémonos en lo que ya tenemos"* (2026-09-01). Ver `AXIUM.md`.
- **Higgsfield es la herramienta de generación y puedo operarla yo** con su
  cuenta, vía navegador. Antes de cada tanda se anuncia qué se va a generar y
  cuántas imágenes (gasta sus créditos). Ver `IMAGENES.md`.
- **La skill tiene que cubrir todos los tipos de proyecto**, no solo webs: web,
  app móvil, SaaS, branding, manual de marca, brochure, redes sociales,
  e-learning, backend sin pantalla, y sus combinaciones. La taxonomía está en
  `IMAGENES.md` § Tipos de proyecto. Una referencia que solo enseña a mostrar
  webs es útil pero incompleta — buscar a propósito las que resuelven impresos
  y redes.

- **La UI de los clientes no se inventa — ni sus impresos, ni sus posts.** Ni
  un pixel de entregable generado por IA que pretenda ser trabajo de Axium. Ver
  `IMAGENES.md`; es la regla fundacional de la parte de imágenes. Y la IA no es
  obligatoria: la mayoría de lo que se ve profesional en las referencias es
  edición (radio, sombra, sangrado, campo de color), no generación.
- **Los logotipos de los clientes no se rediseñan ni se regeneran.** Se usan los
  reales. Igual que en `creator/REDISENO.md`.
- **Registrar antes de opinar.** Una referencia se escribe en su archivo antes de
  que se saque ninguna conclusión sobre ella. Las conclusiones sin evidencia
  escrita se contradicen solas tres referencias después.
- **Escribir de vuelta antes de cerrar — en dos lugares.** Lo que aplica al
  portafolio de Axium va a `PATRONES.md`, `ESTILO.md` o la ficha. **Lo que
  aplica a cualquier página** (una regla de paleta, un gesto tipográfico, una
  anatomía de hero o CTA, una restricción de producción, una palabra nueva de
  Alexander) va a **`~/.claude/skills/creator/REFERENCIAS.md`**, que es el
  cuaderno general. Alexander lo pidió explícito el 2026-09-01: *"con esto
  también deberías estar aprendiendo a hacer buenas páginas, para próximos
  rediseños y diseños, anota todo lo que aprendas"*. Esta skill entrena para
  el portafolio; `creator` aprende para todo.
