# El compositor — producir imágenes de portafolio sin IA

La técnica con la que se hicieron las 5 imágenes de ANJ Sports, y con la que se
harán las de los 30 casos restantes. **Cero IA, cero Figma, cero Photoshop:**
se compone en HTML/CSS y se fotografía con Playwright.

Sale de lo que pidió Alexander —*"pueden ser ediciones simples como un
degradado y una captura de pantalla bordeada"*— y de lo que enseñaron las
referencias: lo que se ve profesional es **acabado** (radio, sombra, sangrado,
campo de color), no efectos.

---

## Por qué HTML y no un editor

- **Es reproducible**: el HTML queda versionado; si el cliente cambia su web,
  se recaptura y se re-renderiza sin rehacer el diseño.
- **Da control exacto** de lo que las referencias usan: `border-radius`,
  `box-shadow`, `filter: blur()` para los glows, `transform: rotate()` para los
  escalonados, `object-position` para encuadrar.
- **Escala a 31 casos**: cambiar las variables de color y las rutas de imagen
  produce la versión del siguiente cliente.
- No cuesta créditos ni depende de un servicio.

---

## El flujo, paso a paso

### 1 · Capturar el sitio del cliente

Viewport **2880×1800** (el MCP no expone `deviceScaleFactor`; duplicar el
viewport es la forma de tener píxeles de composición). Capturar: hero, 3–4
secciones, y móvil a 390–440 de ancho.

**Bajar también los assets originales** del sitio (banners, fotos de producto)
con `curl` desde su CDN: vienen sin la barra de navegación encima y en mayor
resolución que la captura. En ANJ los banners salieron a 1920×952 desde R2,
contra 1440 de la captura.

### 2 · Montar el taller

```bash
mkdir -p capturas-clientes/<slug>/{assets,out}
# las capturas y los assets descargados van a assets/
cd capturas-clientes/<slug>/assets
(nohup python3 -m http.server 8899 >/dev/null 2>&1 &)
```

**`file://` está bloqueado en el Playwright del MCP.** Sin servidor local, las
imágenes no cargan. `python3 -m http.server` es suficiente.

### 3 · Escribir el HTML

Un archivo por imagen, lienzo fijo **2400×1600** (3:2, el ratio de 29 de las 33
portadas y el que valida Pentagram como formato único).

**Plantilla mínima:**

```html
<meta charset="utf-8">   <!-- OBLIGATORIO: sin esto los acentos salen como CATÃ¡LOGO -->
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:2400px; height:1600px; background:#000; overflow:hidden;
  font-family:"Helvetica Neue",Arial,sans-serif; -webkit-font-smoothing:antialiased; }
.stage { position:relative; width:2400px; height:1600px; overflow:hidden; }
.glow { position:absolute; border-radius:50%; filter:blur(160px); }
</style>
<div class="stage">…</div>
```

### 4 · Renderizar

`browser_resize` a 2400×1600 → `browser_navigate` a
`http://localhost:8899/<archivo>.html` → `browser_take_screenshot` a JPEG.
**Añadir `?v=2` al recargar tras editar**, o el navegador sirve la versión
cacheada.

### 5 · Exportar

```bash
cp out/X.jpg public/images/proyects/<slug>/<slug>-<nombre>.jpg
sips -s format jpeg -s formatOptions 72 <archivo> --out <archivo>
```
Resultado en ANJ: 2400×1600 entre **288 y 484 KB**, contra 1.1–1.4 MB de las
portadas viejas a menor resolución.

---

## Recetas resueltas (código probado en ANJ)

### Glow de marca — la base de casi todas
```css
.glow { position:absolute; border-radius:50%; filter:blur(160px); opacity:.4;
        background:<color del cliente>; }
```
Dos o tres, en esquinas opuestas y con los colores del cliente. Es lo que da la
"personalidad por proyecto" con una línea de CSS.

### R7 · Dos identidades lado a lado
Dos paneles `flex:1` con `height` mayor que el lienzo, escalonados con
`translateY(±34px)`, `border-radius:28px`, `overflow:hidden`. La imagen dentro
va `position:absolute; height:100%; width:auto` y se encuadra con `right:-Npx`.
**Calcular el `right`**: si el sujeto está al X % del ancho original y la imagen
escalada mide W px, la distancia del sujeto al borde derecho es `(1-X)·W`; para
centrarlo en un panel de ancho P, `right = -((1-X)·W - P/2)`.

### R19 · Sección enmarcada con barra de navegador
Tarjeta con `border-radius:22px; overflow:hidden` y sombra
`0 80px 160px rgba(0,0,0,.85)`, más una barra de 56px con tres puntos de color
y el dominio centrado. Dice "esto es una web real" sin dispositivo.

### R21 · Móviles escalonados sobre glow
`padding:11px; background:#15151A; border-radius:52px` para el marco; la
captura dentro con `border-radius:42px`. El del centro más ancho y con
`z-index:3`; los laterales con `rotate(±7deg) translateY(46px)`.

### R4 · Mosaico de producto
Tarjetas blancas con radio, imagen `object-fit:contain` sobre `#fff`, pie con
nombre y marca. **Ojo con el vacío**: si el grid ocupa menos de ~60 % del alto
la imagen se ve flotando — agrandar las celdas, no añadir elementos.

### R23 · Mosaico de momentos
`grid-template-columns:repeat(4,1fr); grid-template-rows:repeat(3,1fr); gap:20px`
con celdas `overflow:hidden; border-radius:14px`. Mezclar fotos
(`object-fit:cover` + `object-position` para encuadrar), productos
(`object-fit:contain` sobre blanco) y **celdas tipográficas con los datos
duros** del proyecto (año, nº de productos, nº de marcas). Las celdas de dato
son las que convierten un collage en un argumento.

---

### R21b · Móviles sobre fondo generado  ⭐ la fórmula híbrida

**La mejor relación esfuerzo/resultado encontrada.** Alexander genera **solo el
fondo** en Higgsfield (una arena vacía con los dos neones del cliente y un
suelo con textura) y encima se componen las capturas reales en HTML:

```css
.bg img { width:100%; height:100%; object-fit:cover; object-position:center 58%; }
.row    { position:absolute; bottom:236px; display:flex; align-items:flex-end;
          justify-content:center; gap:78px; }
.phone  { border-radius:52px; padding:11px; background:#101116;
          box-shadow:0 44px 90px rgba(0,0,0,.85), 0 0 0 1px rgba(255,255,255,.13); }
.shadow { position:absolute; bottom:212px; height:38px; border-radius:50%;
          background:#000; filter:blur(26px); opacity:.62; }   /* contacto con el suelo */
```

Frente al glow puro de CSS gana en profundidad, textura y luz real. **El
prompt del fondo pide explícitamente `completely empty composition`** — así el
modelo no inventa objetos y el lienzo queda libre.

**Quitar los widgets flotantes del cliente.** El botón de WhatsApp aparece en
las tres capturas y se repite tres veces en la composición. Ocultarlo por DOM
no basta: React lo vuelve a montar. La solución que funciona es **recortarlo en
el HTML**:

```css
.win     { overflow:hidden; border-radius:42px; }
.win img { display:block; width:100%; margin-bottom:-16%; }
```

## La regla contra la redundancia

Alexander, 2026-09-02: *"redundas mucho en algunas imágenes, además quiero
highlights, no capturas de la web completa"*.

**Antes de dar por buena una serie, contar en cuántas imágenes aparece el mismo
elemento.** En la v2 de ANJ el hero del cliente salía en **5 de 10** piezas
(marcas, navegador, dato, mosaico y la tira completa). Se ve como relleno.

| Regla | Detalle |
|---|---|
| **Un elemento, máximo 2 apariciones** | El hero puede estar en la pieza principal y en un mockup. Nada más |
| **Nada de capturas de la web entera** | La tira `fullPage` es cómoda pero no es un highlight: es un scroll. Fuera |
| **Cada imagen enseña algo que ninguna otra enseña** | Si dos piezas responden a la misma pregunta, sobra una |
| **Buscar las secciones que aún no se mostraron** | Casi siempre hay páginas internas sin usar: en ANJ, la de deportistas y el catálogo con filtros y badges de stock |

**Qué es un highlight**: una funcionalidad concreta, encuadrada, con un detalle
ampliado y una línea que la nombra. Ejemplo probado (`H-catalogo.html`): la
vista del catálogo enmarcada a la izquierda + un **zoom del badge de stock** a
la derecha + micro-label «STOCK EN VIVO» + una frase. El zoom se hace con la
misma captura, escalada y desplazada dentro de un contenedor con `overflow`:

```css
.zoom     { width:620px; height:440px; overflow:hidden; border-radius:20px; }
.zoom img { position:absolute; width:2560px; max-width:none;
            left:-1250px; top:-800px; }   /* mueve el recorte al detalle */
```

## Errores que ya mordieron

| Síntoma | Causa | Regla |
|---|---|---|
| Los acentos salen `CATÃ¡LOGO` | Falta `<meta charset="utf-8">` | Va como primera línea, siempre |
| Las imágenes no cargan | `file://` bloqueado en el MCP | Servidor local en 8899 |
| El cambio no se ve al recargar | Caché del navegador | `?v=2`, `?v=3`… |
| El sujeto queda cortado | `right` mal calculado | Usar la fórmula de arriba, o probar y medir |
| La composición se ve vacía | El contenido ocupa poco del lienzo | Agrandar los elementos; no rellenar con adornos |
| Capturar la ficha y salen secciones en blanco | `whileInView` de motion nunca dispara en una captura `fullPage` | Hacer scroll por toda la página con pausas **antes** de capturar |
| El widget flotante del cliente (WhatsApp) sale en las tres capturas | Ocultarlo por DOM no basta: el framework lo re-monta | Recortarlo con `overflow:hidden` + `margin-bottom` negativo en la composición |
| El dashboard del cliente salió en inglés | Contexto de navegador sin `locale` | `locale: "es-PE"` + `Accept-Language` en el contexto |
| "Buscar por texto" capturó la página entera | El primer nodo que coincidía estaba oculto y su ancestro ancho era `<main>` | Filtrar nodos visibles y acotar ancho **y** alto del ancestro buscado |
| El logo salió con una caja translúcida | El header flota sobre el hero (otra sección) y el vidrio vive en `::before` | Aislar con `visibility` (ver abajo) y comprobar que el alfa mínimo sea 0 |
| El logo salió **cortado** (al destello de LumioLearn le faltaban las puntas; Alexander lo vio en la web) | La caja del `<a>` mide 20 px y el ícono desborda; recortar por la caja del ancla + un margen fijo no alcanza | Clip = **unión de los rects del ancla y de todos sus descendientes** + margen, y **verificar 0 píxeles opacos en los cuatro bordes** antes de exportar |
| La portada de un SaaS mostró la web de **un cliente suyo** (MainTech en LumioLearn) y Alexander la rechazó | El SaaS lo exhibe como caso de éxito y parecía "producto real" | La portada de un SaaS usa **solo la UI y el sitio del propio SaaS**. Un cliente del SaaS es otra marca |
| La misma foto aparece 2–3 veces en una portada | La web y el móvil del cliente reusan el banner (ficha, catálogo y primera tarjeta) | Antes de componer, comparar las pantallas elegidas entre sí; si comparten imagen, cambiar una por otra funcionalidad |
| Franja clara vertical sobre un teléfono rotado | Chromium al transformar un contenedor con `border-radius + overflow:hidden` y una captura grande | Renderizar el teléfono plano a PNG y rotar el `<img>` |
| Higgsfield descontó más de lo generado | La cuenta se usa también desde otras sesiones | `get_cost` antes y conciliar con `transactions` después |
| La portada "solo del SaaS" mostraba igual a un inquilino (*InduTech Academy* en la ventana del hero de lumiolearn.com) | El propio sitio del SaaS arma su marketing con capturas de academias cliente | **Leer cada ventana buscando nombres de inquilinos** antes de usarla. Lo seguro: la app en local, en el tenant del propio SaaS, con datos de demo |
| La captura del navegador MCP apareció en la raíz del repo de Axium | `browser_take_screenshot` guarda relativo a su raíz permitida (el repo) y rechaza el scratchpad | Nombre dentro de `.playwright-mcp/`, borrar al terminar; las capturas de producción, con scripts de Node |
| El reproductor del SaaS salió negro ("Cargando video…") | Los videos del seed eran de YouTube (bloqueado a propósito) y Chromium headless no reproduce H.264 | Fotograma → WebM VP9 con `ffmpeg`, servido en local con CORS y rangos |
| La imagen corregida se seguía viendo vieja en el dev server | `/_next/image` guarda en caché la versión anterior del mismo path | Renombrar el archivo, o borrar `.next/cache/images` con el servidor detenido |

---

## Segunda generación — portadas de producto (highlights del home, 2026-09-11)

Probado con Vendiq, Rematch, LumioLearn y Bookit. Detalle del caso en
[HIGHLIGHTS-HOME.md](HIGHLIGHTS-HOME.md); scripts en [scripts/](scripts/).

### Capturar a 2x / 3x de verdad
El MCP no expone `deviceScaleFactor`; un script de Node sí. Usar el
`playwright-core` del caché de npx (`~/.npm/_npx/*/node_modules/playwright-core`)
y, si pide un Chromium que no está, `executablePath` al que ya existe en
`~/Library/Caches/ms-playwright/chromium_headless_shell-*/`. Desktop 1440×900
@2x; móvil 390×844 @3x con `isMobile`. Fuera del MCP `file://` funciona: no hace
falta el servidor en 8899.

### Aislar una pieza de UI con transparencia real
Para que una tarjeta del cliente flote sobre un fondo generado, conservando su
sombra y sus esquinas:

```js
await page.addStyleTag({ content:
  'html,body{background:transparent!important}' +
  'body *{visibility:hidden!important}' +
  '[data-cap="1"],[data-cap="1"] *{visibility:visible!important}' });
// marcar la pieza con data-cap="1" y luego:
await page.screenshot({ path, omitBackground: true,
  clip: { x: r.x - 70, y: r.y - 70, width: r.w + 140, height: r.h + 140 } });
```

`visibility` (no `display`) mantiene el layout. Recortar después con umbral de
alfa bajo (> 2) para no comerse la sombra.

### Logos
- Del header o footer del propio sitio, con `omitBackground` + el aislamiento de
  arriba. Versión negativa: la del footer oscuro o la del **modo oscuro del
  sitio**.
- **No inventar isotipos.** Si no hay uno cuadrado, usar el logotipo completo.
  Los favicons pueden ser el default compartido de un código multi-tenant:
  comparar md5 antes de usarlos.

### No confiar en los assets del cliente
El `celular.webp` de rematch.pe era UI **generada con IA** ("Multfcancha",
"Calendarto"). **Leer el texto de toda imagen de UI antes de usarla.** Y
preferir las **páginas reales del producto** (la reserva de un club) a los
mockups de la landing.

### Recetas nuevas
- **Ventana que emerge del horizonte** (Vendiq):
  `transform: perspective(3200px) rotateX(9deg); transform-origin: 50% 100%`.
  A 14° el texto del dashboard ya no se lee.
- **Constelación de tarjetas** (LumioLearn): tres piezas reales **sin encimarse**.
  Muchos sitios les ponen un anillo blanco translúcido que se ve sucio sobre otra
  tarjeta.
- **Teléfonos rotados** (Rematch): `portadas/telefono.html?src=…&bg=…` →
  `scripts/render-telefonos.cjs` (PNG transparente @3x) → `<img>` con
  `transform: rotate()` y `filter: drop-shadow()`.
- **Lienzo** 1440×900 @2x → exportar 2400×1500 JPEG q84 progresivo.

---

## Tercera generación — fichas estilo brandvm (2026-09-12)

Alexander eligió la ficha de brandvm (ver `referencias/brandvm.md` § Fichas de
caso). Sus piezas se producen así, todas con UI real:

### R24 · Pantalla verde en escena generada ⭐ mockup fotográfico
1. **Higgsfield** genera la escena con el dispositivo y la pantalla
   *"perfectly uniform flat pure green (#00FF00), matte, no reflections, no
   interface, no text"* (tablet en la recepción de un club, laptop en un
   escritorio, celular en una banca o en la mano, un marco en un estante).
   `gpt_image_2_5`, high, 2k = **3 créditos** (16:9 o 1:1).
2. **`scripts/componer_pantalla.py escena captura salida`**: detecta el verde,
   saca las 4 esquinas (extremos de x±y), expande un 1–2 %, recorta la captura
   al aspecto de la pantalla, la deforma en perspectiva (PIL PERSPECTIVE, sin
   numpy) y usa **el propio verde como máscara** — respeta muescas y esquinas
   redondeadas. `--brillo 0.82–0.9` en escenas nocturnas, `--ancla arriba` para
   móviles.
   **Celulares y toda pantalla muy redondeada: `--bordes --expandir 0.004`.**
   Los extremos de x±y caen dentro de la curva de la esquina: la captura queda
   chica y se ve con esquinas rectas y un marco negro de más (bv-celular v1,
   Alexander: *"no está bien cuadrada esta imagen"*). `--bordes` ajusta los
   cuatro bordes rectos por mínimos cuadrados y descarta la muesca. Revisar las
   cuatro esquinas a zoom antes de publicar.
   **Barra de estado**: la pantalla de un celular se arma en HTML con la hora en
   la oreja izquierda y los íconos en la derecha (la muesca tapa el centro) y
   la página real debajo, al tamaño exacto del hueco verde
   (`brandvm-casos/pantalla-celular-lumio.html`). Sin barra, el encabezado del
   sitio choca con la muesca.
   **Dos pantallas verdes en una escena** (laptop + celular, `bv-landing-v2` de
   LumioLearn): el compositor detecta un solo hueco. Separar por columnas con
   verde (hay un tramo vacío entre los dispositivos), pintar de oscuro el verde
   del segundo, componer el primero, devolver la zona del segundo desde la escena
   original y componer el segundo. Si el celular está girado, **la pantalla HTML se
   arma al aspecto REAL del dispositivo** (un celular, 1170×2532 = 0,462), no al del
   cuadrilátero: ese número es el escorzo y la homografía ya lo aplica. Armarla al
   aspecto del hueco estira la UI. Y `--sin-recorte`, o `recortar_a` le come los costados
   (ver «Pantalla girada» más abajo).
   **Recolorear una escena para otra marca** (portada de Bookit desde la escena
   oscura de LumioLearn): componer **primero** y recolorear después, con la
   pantalla (verde dilatado) fuera de la máscara. Al revés, el brillo pasado a
   verde se lee como pantalla verde y el cuadrilátero sale torcido.
   **Segundo dispositivo:** después de componer el primero, neutralizar cualquier
   resto verdoso de su lado (G → max(R, B)) antes de detectar el segundo; el borde
   de la laptop compuesta arrastró el cuadrilátero del celular en `bookit bv-landing`.
   **Nada de ventana sobre degradado simple** cuando la pieza es la cara del
   producto: Alexander, 2026-09-12, *"no le des un simple degradado, dale un
   mockup con higgsfield"*.
3. **Marcos / huecos de otro aspecto** que la pieza: no rellenar el sobrante
   (queda una caja con bordes oscuros). Medir el interior del marco en varias
   filas/columnas, tomar el color del paspartú lejos de la sombra, redibujar el
   paspartú entero con la ventana del tamaño de la pieza + bisel + sombra suave
   del marco.

Errores que ya mordieron: el timeout de `generate_image` **sí cobra** — antes de
reintentar, `balance` y `show_generations` para recuperar la imagen.

### Taller de piezas sin foto (`capturas-saas/brandvm-casos/taller.html`)
Un HTML con un `.lienzo` por pieza y `scripts/render-taller.cjs` que las
renderiza a 2x directo a `public/images/proyects/<slug>/bv-*.jpg`:
- **Mosaico inclinado 2:1**: 6 columnas × 5 filas de pantallas de escritorio a
  -12°, tarjetas de ~460 px con radio 12. **Solo escritorio**: una tarjeta móvil
  de doble alto se agranda y domina. Nada de pantallas con datos reales de
  terceros (torneos públicos) ni placeholders del seed ("123 Business Street").
- **Espécimen tipográfico 1:1** (la fuente del producto sobre su degradado +
  píldora girada) y **paleta 1:1** (tarjetas con hex).
- **Pantallas móviles sueltas** sobre gris, escalonadas.
- **Tarjetas recortadas** de la UI (crop con `object-position` dentro de un
  contenedor con `overflow:hidden`).
- **Ventana de navegador (R19)** sobre el degradado del producto, sangrando.

La ficha alterna: 2:1 → pares 1:1 → 2:1, mismo radio (18 px), gutter 12–16 px.

### Un objeto verde en la escena engaña a la máscara (2026-09-13)

En `escenas/rematch-portada-raqueta.png` el filo lima de la pala de pádel pasa el umbral de
verde. `esquinas_por_bordes` toma el último píxel verde de cada fila, así que el borde derecho se
ajustó hacia ese brillo: el hueco salió 0.525 en vez de 0.42, la captura quedó cortada a la
derecha y el filo de la pala se habría pintado de negro. Síntoma: una esquina detectada cae
60–70 px afuera del verde que se ve. Arreglo: `--caja x0,y0,x1,y1` alrededor del dispositivo
(la máscara se multiplica por esa caja antes de medir y de componer; el script avisa si queda
verde fuerte fuera de ella). Regla: en escenas con pelotas, filos o luces lima/verdes, mirar
ese aviso antes de dar la composición por buena, y armar la pantalla HTML al aspecto medido
con la caja, no al primero.

### Pantalla girada: no recortar la captura al aspecto del hueco (2026-09-14)

La portada de LumioLearn (tableta a tres cuartos) salió «mal» por dos cosas:
1. **La web capturada a un ancho que la rompe.** A 1180 px la barra de lumiolearn.com parte
   «Iniciar sesión» y «Empieza gratis» en dos líneas. Capturar a un ancho de escritorio con la
   proporción del dispositivo (1440×1000 para una tableta, 1,44) y mirar la cabecera antes de componer.
2. **`recortar_a` corta los lados en una pantalla girada.** El hueco de la foto medía 1,31 porque
   la tableta está de costado (escorzo); la pantalla real es 1,44. Recortar la captura a 1,31 dejó
   «Empieza gr…» cortado en el borde. Para dispositivos girados: `--sin-recorte` (la captura entera
   va al cuadrilátero y la perspectiva hace el escorzo). El recorte sigue siendo correcto cuando el
   dispositivo está de frente y el hueco tiene su proporción real.

### Dispositivo girado por IA: mejor cenital (2026-09-14)

Con la tableta a tres cuartos Alexander insistió: *"sigue raro, capaz es la perspectiva, haz otro
mockup"*. Aun sin recortar, la web se veía torcida: la IA no dibuja la pantalla de un dispositivo
girado como el plano en perspectiva de un rectángulo, así que ninguna homografía la calza del todo.
**Solución: escena cenital** (cámara paralela al escritorio, prompt con *"camera perfectly overhead so
the tablet is an undistorted rectangle… edges parallel to the frame"*). Medido antes de componer: giro
0,0°, lados opuestos iguales (750/750 y 539/539). Dos variantes (6 créditos): la B, tapete índigo con
cuaderno cerrado, té y eucalipto, quedó como `lumiolearn-portada-v7.jpg`; la A (escritorio de nogal con
cuaderno abierto y audífonos) recargaba el cuadro.
**Regla:** si la UI tiene que leerse, pedir el dispositivo de frente o cenital; los ángulos a tres
cuartos solo para escenas donde la pantalla es chica o secundaria.

### Celular en una escena: viewport real, no recorte del fullPage (2026-09-25)

`bv-banca` de Rematch se rehízo porque salía el micrositio verde de la marca vieja y, además,
la pantalla estaba torcida respecto al bisel. Tres cosas que valen para cualquier celular:

1. **`--bordes` siempre.** La versión mala se compuso con `esquinas()` (extremos de x±y): el
   cuadrilátero sale chico y girado respecto al marco. Con `--bordes` las cuatro esquinas
   dieron (776,1170) (1088,1148) (1392,1673) (999,1697) y la pantalla calzó exacta.
   Verificar después: recortar las cuatro esquinas a 1:1 y comprobar que
   `mascara_verde(salida)` no deje ni un píxel.
2. **La pantalla se arma al aspecto real del celular** (1170×2532), no al del hueco (0,60 acá:
   el celular está tumbado y se acorta), y se compone con `--sin-recorte`.
3. **Capturar el viewport desplazado, no recortar el fullPage.** Si la cabecera del sitio es
   fija —la de Rematch Live lo es— el viewport trae el logo aunque la página esté a mitad de
   scroll; un recorte del fullPage a esa altura lo pierde. Con `playwright-core`: 390×827 @3x,
   `isMobile`, `locale: "es-PE"`, **aceptar el banner de cookies**, recorrer la página para
   disparar las animaciones, volver arriba, y recién entonces `scrollTo(y)` + `screenshot()`.
   El resultado (1170×2481) se versiona en `capturas-saas/<slug>/<rediseño>/live-m-vp<y>.png`.

**Y antes de elegir el tramo, mirar la pieza de al lado en la galería.** El primer intento usó
el hero de live.rematch.pe: se veía muy bien, pero `bv-envivo` —su pareja en el par de la ficha—
ya mostraba ese mismo hero, con el mismo titular y el mismo jugador. Se cambió por «Cómo quieres
jugar» (Reserva una cancha / Entrena en una academia), que no estaba en ninguna otra pieza.
Regla: el tramo se elige con la galería delante, no solo por lo bonito que se ve solo.
Descartar también los tramos con un bloque vacío: el hero de Live tiene ~1000 px casi negros
arriba y, a 460 px de pantalla en la pieza final, el celular se leía apagado.

### Coherencia del atrezo: el deporte tiene que ser uno solo (2026-09-25)

La portada de Rematch pasó dos revisiones con **pelotas de tenis junto a una pala de pádel**.
Alexander: *«si es paleta de pádel, las bolas deben ser de pádel; si es de tenis, pelotas de
tenis»*. El modelo, al pedirle "padel racket on a court", pone pelotas de stock de tenis: pelusa
larga con halo de hilos sueltos y costura gruesa blanquecina.

**Antes de dar por buena una escena, mirar a zoom cada objeto del atrezo** —pelota, superficie,
cancha del fondo, raqueta— y comprobar que sean del mismo deporte. Vale igual para cualquier
escena con utilería: si la marca es de un oficio, las herramientas tienen que ser de ese oficio.

**Corregir editando, no regenerando.** Si la escena está bien salvo un objeto, se pasa **la escena
verde original** como `medias` con rol `image_references` a `gpt_image_2_5` y se pide solo ese
cambio, con la instrucción de reproducir la referencia exactamente y un bloque CRÍTICO que exija
que la pantalla siga siendo verde liso #00FF00, mate y vacía. En Rematch salió a la primera y el
cuadrilátero verde quedó a **±2 px** del original, así que `--caja`, `--brillo` y el encuadre se
reutilizan tal cual y lo único que cambia en la imagen final es el objeto pedido.

Dos detalles de coste: **`gpt_image_2_5` high 2k cuesta 2,75, no 3** (comprobado con
`get_cost: true`, que no envía trabajo), y la referencia se sube con `media_upload` → `curl -X PUT`
→ `media_confirm`; en `medias[].value` va el `media_id`, nunca la URL.

### Lo desenfocado también se juzga a 1:1 (2026-09-26)

Una escena generada para la portada de Rematch (celular contra la red de la pista, a ras de suelo)
pasó todas mis revisiones **en miniatura** y Alexander la tumbó de un vistazo: *«no parece una cancha
realista»*. Mirada a 1:1 era evidente y yo no la había mirado así:

- La red era una **malla de cuerda gruesa trenzada**, con cuadros de casi medio celular de ancho. Una
  red de pádel es de hilo fino y cuadro pequeño: la **escala estaba rota** contra un objeto de 15 cm.
- El fondo no cerraba: un riel superior **arqueado** (los rieles no se arquean), montantes de vidrio
  que no coincidían con nada y luces flotando dentro del cristal sin lógica de reflejo.
- Pedir **profundidad de campo muy corta** fue parte del problema: el modelo rellena lo desenfocado
  con formas plausibles pero incoherentes, y el bokeh las disimula hasta que se amplía.

**Reglas que quedan:**
1. Antes de componer, mirar la escena **a 1:1 por zonas**, incluidas las desenfocadas. Si una miniatura
   es lo único que se ha visto, no se ha revisado nada.
2. **Comprobar la escala contra el dispositivo**: el celular mide 15 cm y es la regla de la foto. Si
   un elemento de textura (cuadro de red, junta, baldosa) mide media pantalla, está mal.
3. **Una cancha en primer plano es lo más difícil de generar** (geometría + escala a la vez). Lo que
   sí ha funcionado: la **aérea** (`rematch-aerea-a`) o un **objeto del oficio** en primer plano con la
   cancha lejos y desenfocada (`rematch-portada-raqueta-v2`). Pedir el mundo en primer plano es pedir
   el fallo.
4. Si el fallo es de **renderizado o escala**, no se arregla recortando **ni** regenerando a menos
   calidad: `medium`/`1k` degradan justo la geometría. O se paga la calidad completa, o se vuelve a
   una escena que ya funcionaba.

### Prohibir el color de marca en el prompt sustituye a `--caja` (2026-09-26)

El filo lima de la pala obligaba a `--caja` en todas las composiciones de esa portada. En la escena
nueva se añadió al prompt: *"no lime green, acid green or yellow-green object, light, edge, trim or
reflection anywhere in the scene — the ONLY green anywhere in the image is the phone screen"*.
Resultado: el bbox de la máscara fue **exactamente** el celular y se compuso **sin `--caja`**.

**Regla:** cuando la marca es verde o lima, prohibirla explícitamente en la escena y dejar que el color
lo aporte la UI compuesta. Se gana una máscara limpia y se pierde poco: el fondo con la tinta de la
marca ya dice la marca.

Y el bloque de la pantalla verde funciona mejor si se le dice al modelo que es lo más importante del
prompt ("this is the most important instruction in the whole prompt"), en mayúsculas y con la lista
larga de negaciones (sin interfaz, iconos, texto, reflejos, brillo, degradado ni **derrame de luz verde
sobre el cuerpo del dispositivo o el suelo**).

### La cabecera fija se pierde en el fullPage — otra vez (2026-09-26)

Alexander: *«no se ve el header»*. La pantalla de la portada de Rematch venía de
`rematch/rediseno-2026-09/web-m-full.jpg`, un **fullPage**. La cabecera de rematch.pe es
`position: fixed` (`top: 8`, `height: 56`, con el logo): el fullPage la pierde y deja un hueco gris
donde debería estar el logotipo. Ya estaba escrito arriba por live.rematch.pe y volvió a morder.

**Regla sin excepciones: la pantalla de un celular se captura por viewport, nunca recortando un
fullPage.** Viewport al alto exacto de `.pagina` (390×794 @3x = 1170×2382 para el HTML de 1170×2532),
`isMobile`, `locale: es-PE`, aceptar cookies, recorrer la página para disparar animaciones, volver
arriba, esperar el estado que se quiere (aquí, que la agenda llegue a «5 reservas») y recién entonces
disparar. Se versiona como `capturas-saas/<slug>/<rediseño>/<pagina>-m-vp<y>.png`.

**Dato útil:** la cabecera fija ocupa justo el hueco que el fullPage deja en blanco, así que recuperarla
**no empuja el contenido**: se gana el logo sin perder nada de lo que ya se veía.

---

## Cuarta generación — mockups de marca que no parecen pegatinas (Aurore, 2026-09-29)

Las cuatro aplicaciones de la primera pasada de Aurore (decants, papelería, bolsa, caja) las marcó
como lo más flojo el propio agente que las hizo, y tenía razón: **escena plana + logotipo plano
encima**. Dos arreglos, los dos reutilizables, y una regla de cantidad.

### R25 · `tinta-impresa` — la marca se multiplica, no se pega

Un PNG negro sobre transparente pegado en `position:absolute` sale **más negro y más limpio que
cualquier cosa impresa a su lado**, porque no recibe la luz de la escena. El ojo lo caza en medio
segundo aunque no sepa decir por qué.

```css
.tinta-impresa { mix-blend-mode: multiply; opacity: .9; filter: blur(var(--desenf, 0px)); }
```

- **`multiply`** deja pasar la iluminación del soporte: la sombra del papel, el brillo del vidrio y
  el degradado de la etiqueta modulan la tinta igual que modulan todo lo demás.
- **`opacity: .9`** evita el negro absoluto, que en una foto con luz cálida no existe.
- **`--desenf`** iguala el desenfoque de la pieza que sostiene la marca. En una escena con
  profundidad de campo real, cada objeto lleva el suyo: 0 px en el plano nítido, 1,4–2,4 px a media
  distancia, 5–6 px en un primer plano desenfocado. Un logotipo nítido sobre una etiqueta borrosa
  delata el montaje al instante.

### R26 · `en-plano` — la marca vive en el plano del papel

Sobre una hoja en perspectiva no vale `translate`: la marca tiene que deformarse con el papel.
Se miden **tres esquinas** de la pieza sobre el lienzo (la del origen y las dos contiguas), se
normalizan los dos vectores y se meten en un `matrix`:

```css
.en-plano { position: absolute; transform-origin: 0 0; }
/* hoja A5: W(88,353) N(392,232) S(400,700)
   u = (392-88, 232-353)/327 = (0.9297,-0.3700)
   v = (400-88, 700-353)/467 = (0.6685, 0.7435)                    */
transform: matrix(0.9297, -0.3700, 0.6685, 0.7435, 233, 355);
```

El ancho del `div` es entonces el **ancho impreso en el plano del papel**: si el lado corto de una
A5 mide 327 px en la escena, 1 mm = 2,21 px y un lockup de 45 mm son 99 px. Comprobación barata de
que la escena no está deformada: los dos lados tienen que dar la misma escala (327/148 = 2,21 y
467/210 = 2,22 → bien). Si no coinciden, hace falta homografía (`matrix3d`) o, mejor, otra escena.

### Medir sin adivinar

Un HTML desechable con el lienzo, la escena de fondo y una rejilla de 40 px etiquetada cada 160
(`position:absolute; inset:0` con `repeating-linear-gradient` en magenta). Se renderiza, se mira, se
leen las coordenadas de las etiquetas y los bordes, y se borra. Dos minutos y cero iteraciones a
ciegas.

### El prompt de escena que dio el salto

Lo que cambió respecto de la primera pasada, y que vale para cualquier bodegón de aplicaciones:

- **Una sola fuente de luz dura**, de ventana, rasante y lateral, con su sombra larga y blanda, y
  **caída a oscuro sin relleno**. La luz plana y uniforme es lo que hace que un render parezca una
  plantilla de mockup.
- **Materiales con nombre y defecto**: «uncoated cotton paper with visible fibre and a deckled
  edge», «honed travertine with fine pitting», «clear glass with true refraction». No «paper»,
  «stone», «glass».
- **Profundidad de campo declarada**: «100 mm macro at f/2.8, the label plane perfectly sharp,
  everything behind dissolving».
- **La paleta del cliente por hex y lo prohibido por nombre**: en Aurore hubo que escribir
  «no pink, no magenta» porque la primera papelería salió rosada.
- Los objetos **en blanco**: «absolutely blank with no printing, no writing and no marks of any
  kind» + el negativo de siempre. La marca va después.

### Menos piezas y mejores

Alexander, 2026-09-29: *«si con dos aplicaciones bien resueltas se cuenta igual que con cuatro
regulares, quédate con dos»*. Cuatro escenas planas no prueban un sistema de marca; dos con la misma
dirección de luz, la misma materia y la misma paleta se leen como **una sesión de fotos**, que es
justo lo que se quiere probar. Y la pieza que se elige no es la más bonita: es **la más difícil**
—en una perfumería, la etiqueta de 2 ml— porque es la que demuestra que el logotipo aguanta.

---

## Quinta generación — la portada se compone para su recorte (Aurore, 2026-09-30)

### Una portada no se juzga en 3:2: se juzga en 4:3 y en 16:10

Las portadas se producen a 3:2, pero **nadie las ve en 3:2**. En esta web viven recortadas:

| Dónde | Componente | Aspecto |
|---|---|---|
| Tarjeta de `/portafolio` | `portfolio-page-content.tsx` | **4:3** (421×316 a 1440, 328×246 a 360) |
| Tarjeta «Siguiente» de otra ficha | `case-story.tsx` | **16:10** |

Con `object-fit: cover` sobre un original 3:2 eso deja una **zona segura** de
`x 5,5 %–94,5 %` (el 4:3 come los costados) y `y 3 %–97 %` (el 16:10 come arriba y abajo).
Sobre un lienzo de 1200×800: **x 66→1134, y 25→775**.

La primera versión buena de la portada de Aurore tenía la ventana hasta x 1170 y **en la
tarjeta salía cortada por la derecha**. Se descubrió solo al mirar la tarjeta renderizada, no
el archivo. Regla: antes de publicar, recortar el candidato a 4:3 y a 16:10 con Pillow,
escalarlo a 421 px y mirarlos en fila. Dos minutos.

```python
def recorta(im, ratio):
    w, h = im.size
    if w / h > ratio:                      # sobra ancho → corta costados
        nw = int(h * ratio); return im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    nh = int(w / ratio); return im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
```

### Mejorar una portada sin cambiarla: se cambia el soporte, no la idea

Alexander, 2026-09-30: *«mejora la portada de aurore, no tan diferente de como está»*. Lo que
funcionó fue **conservar el sujeto** (la tienda dentro de una ventana de navegador, paleta
arena) y **cambiar todo lo que lo sostenía**:

| Flojo | Arreglo |
|---|---|
| Degradado CSS de fondo: sin dirección de luz ni materia | **Yeso fotografiado** con luz rasante de ventana, marcas de llana y la sombra de una rama de olivo (`gpt_image_2_5` high 2k, 2,75 cr) |
| Crema sobre crema: a 380 px la tarjeta era una mancha beige | El yeso cae a sombra cálida hacia la derecha: la ventana blanca **separa** |
| La ventana flotaba (sombra simétrica y débil) | Sombra desplazada abajo-derecha, **en la dirección de la sombra de la rama** |
| No decía de quién era: el logo dentro de la captura mide 4 px en la tarjeta | El **lockup real en `tinta-impresa`** sobre el yeso iluminado |
| Barra de navegador de 42 px con puntos de 11 | Barra de 30 px y puntos de 8: a tamaño de tarjeta la barra gorda se comía la foto |

**El fondo se elige, no se acepta.** Cuatro escenas a la vez (11 cr): yeso con rama, travertino
con luz de cortina, yeso con la sombra recta de una jamba, microcemento liso. Ganó la rama —
es **la misma luz que ya usa el hero del cliente y su papelería**, así que la portada parece
rodada en la misma habitación que su contenido. El microcemento, el más parecido al degradado
viejo, era justamente el que menos aportaba.

**Y el sangrado no siempre suma.** Sacar la ventana por el borde derecho partía la cabecera del
sitio en «Ing…»: una ventana de navegador lleva UI con significado y cortarla se lee como rota,
no como editorial. Una captura fotográfica sangra; un mockup de navegador, no.

### El widget flotante del cliente, otra vez

El botón de WhatsApp de aurore.com.pe vive abajo a la derecha del viewport. Se quita **eligiendo
el alto de la pantalla**: 820 de los 900 px CSS del viewport (`height = 820 · ancho/1440`).
Más barato que recortar con márgenes negativos y no mueve nada de lo que sí interesa.

### La caché de `/_next/image` muerde aunque el nombre sea nuevo

Está escrito arriba y volvió a pasar: durante la iteración se publicó `aurore-portada-v2.jpg`,
se corrigió la geometría y **el dev server siguió sirviendo la primera**. El nombre nuevo solo
sirve una vez. **Iterar en el scratchpad y escribir en `public/` una sola vez**, al final; si ya
se escribió, el archivo definitivo necesita otro nombre (aquí `aurore-portada-yeso.jpg`).

---

## Sexta generación — el diagrama de arquitectura (ANJ Sports, 2026-09-30)

La pieza que faltaba en todo el portafolio: el **capítulo de decisiones técnicas
con su arquitectura dibujada**, que es lo que Viget hace mejor que nadie
(`referencias/capturas/viget/caso-goodbids-d06..d08`: un bloque «TECHNICAL
DECISIONS», un párrafo, y debajo el diagrama a todo el ancho sobre un campo de
color de la marca). Se estrenó en ANJ porque su alcance tiene dos mitades reales
—la tienda a medida y el motor de comercio— y el diagrama es la única forma de
enseñar la segunda.

Fuente: `capturas-clientes/anjsports/taller/diagrama-anjsports.html` (HTML puro,
renderizado con `scripts/render-anjsports.cjs`). Reglas que quedan:

### El lienzo se dimensiona por cómo se sirve la pieza, no por costumbre

Las piezas `wide` de `CaseStory` son 2:1 y se sirven a **1312 px** en un viewport
de 1440 (`container-section` = `xl:px-16`, o sea 1440 − 128). Un lienzo de 1600
se muestra a 0,82 y las subetiquetas de 13 px caen a 10,7. **A 1400×700 el texto
llega casi a 1:1.** Para una pieza de foto da igual; para una de tipografía, no.

### La versión de celular es el ESPINAZO, no el diagrama entero

La pieza móvil mide **328 px de ancho de verdad** (4:3 → 328×246). Catorce cajas
ahí dentro no se leen ni de lejos. La variante apilada deja solo: los dos paneles
con su titular y **un resumen de una línea**, las dos flechas con lo que viaja, y
el remate. Titular a 32 px sobre el lienzo de 800 (≈ 13 px reales). El detalle
vive en la versión ancha, y no pasa nada: quien lee en el celular no iba a leer
una tabla.

### Se renderiza un archivo por idioma

El texto vive **dentro** de la imagen y el i18n de la ficha no lo alcanza. El
HTML genera `es/en/pt` × (2:1, 4:3) desde un solo objeto `COPY`, y la ficha elige
el archivo con `` `${IMG}/anj-arquitectura-${lang}.jpg` ``. Seis renders de un
solo template: cambiar una palabra no cuesta seis ediciones.

### Anatomía que funcionó

```
cabecera:  kicker izquierda · referencia derecha, ambos en versalitas espaciadas
cuerpo:    panel A ──flechas── panel B
           · cada panel: titular en la display del cliente, subtítulo de una línea,
             rejilla 2×N de cajas «título + subtítulo de 13 px», y un pie con la
             frase técnica que no cabe en una caja
           · el canal: dos flechas opuestas, con lo que viaja arriba y los
             endpoints reales debajo, en monoespaciada
remate:    una frase a todo el ancho, con la mitad que importa en el acento
```

- **Los dos lados llevan el color de cada mitad** (aquí el cian de XIOM para la
  tienda y el magenta de Butterfly para el motor): borde a 55 % de alfa, fondo a
  6 %. Se lee «son dos cosas distintas» sin escribirlo.
- **El canal necesita ancho medido.** La línea monoespaciada va `nowrap`; si no
  cabe, se mete debajo del panel de al lado. Medir: 31 caracteres a 12 px ≈ 223
  px, y el canal solo tenía 180 útiles. Se acortó la etiqueta, no la fuente.
- **Ningún dato de memoria.** Cada caja del diagrama de ANJ está medida contra la
  API pública de la tienda el mismo día (productos, variantes, categorías,
  marcas, monedas, pasarela). Un diagrama con una cifra inventada es peor que no
  tener diagrama.
- Con siete cajas por panel (tres filas de dos más una que ocupa el ancho) el
  panel llena su alto. Con cuatro queda un vacío de 140 px que se nota.

### El coste de cada bloque de `CaseStory`, para ordenar por ritmo

Medido a 1440 en las tres fichas largas:

| Bloque | Alto que ocupa entre dos imágenes |
|---|---|
| `text` | ≈ 300 px |
| `act` | ≈ 600 px |
| `highlights` (6 viñetas) | ≈ 650 px |
| `tags` (al cierre, con el titular de «Más proyectos» detrás) | ≈ 640 px |
| La intro fija (`statement` + `context`) | 530–615 px |

**Dos bloques sin imagen seguidos siempre pasan de 700 px.** La regla de orden
que sale de ahí: cada bloque de texto va SOLO entre dos imágenes, y el único que
puede quedar al final es `tags`. Si sobra un bloque, no se acorta el texto: se
mueve.

Y un corolario de guion: si el último bloque de texto no cabe al final, **conviene
que la última imagen sea la prueba de lo que acaba de decir el texto anterior**.
En ANJ el diagrama termina con «el jugador no cambia de dominio ni una vez» y la
pieza siguiente —la última— es el checkout terminando en `anjsports.com`.

---

## Séptima generación — cuándo una ancha quiere ser un par (ANJ y Alyer, 2026-09-30)

Alexander, viendo ANJ: «veo que todo lo has puesto imagen columna entera, puedes
usar 2 columnas también para variar». El reparto medido en las ocho fichas con
`CaseStory` era `anjsports` 8/0, `alyer` 6/1 y el resto entre 3/3 y 4/5. Las dos
primeras se rehicieron; el resto ya alternaba.

### Un `pair` no es una ancha retiquetada

|  | ancha | cada mitad de un par |
|---|---|---|
| Proporción | 2:1 | 1:1 |
| Servida a 1440 | 1312×656 | 648×648 |
| Lienzo del taller | 1600×800 (o 1200×600) | **800×800** → 1600×1600 a 2x |
| Móvil (360) | 4:3 con pieza propia `-movil` | la misma cuadrada, 328×328 |
| ¿Admite `lead`? | sí | **no** |

Recortar una ancha a cuadrado pierde la mitad del contenido: **hay que volver a
componer la pieza en el taller**. Y como la escala del lienzo al servido es
prácticamente la misma (1312/1600 = 0,82 y 648/800 = 0,81), **un par no agranda
por sí solo**: agranda si dentro de la cuadrada se recorta más cerca. Donde de
verdad se gana es en lo que ya estaba apretado dentro del 2:1.

### Tres casos que sí quieren ser par

- **Dos estados del mismo componente ya metidos en un marco.** `anj-marcas` eran
  dos capturas de la misma portada (XIOM en cian, Butterfly en magenta)
  escalonadas dentro de una ancha. Partidas, cada estado tiene su cuadrada, su
  color de fondo y su pie.
- **Una pantalla con dos argumentos y un tercio de marco muerto.** `anj-variantes`
  era la ficha entera: la foto cortada por arriba, la matriz de doce opciones
  diminuta y medio marco en blanco. Partida en QUÉ se vende (la goma y sus cinco
  colores) y CÓMO se vende (las doce casillas con precio y stock), el texto de la
  matriz pasa de 10,4 px servidos a 14,9. **Este es el mejor negocio de todos: el
  cuadrado permite un recorte más cerrado que el 2:1.**
- **Contenido vertical dentro de un marco horizontal.** Un celular es 390×844.
  Tres teléfonos en una tira de 2:1 caben a 194 px servidos; dos en una cuadrada,
  a 243, y uno solo a 256. **Los celulares y las prendas piden cuadrado.**

### Cuatro que NO, y la prueba para decidirlo

Se queda ancha una pieza cuyo contenido es horizontal por naturaleza: un diagrama
de catorce cajas, una ventana de navegador de 1200 px, un tractocamión con
semirremolque, cinco páginas de un impreso en abanico, una tira de cinco
logotipos, un checkout de dos columnas de 1080 px. **La prueba: escribe la frase
de cada mitad. Si las dos frases dicen lo mismo, no la partas.** `al-chalecos`
falló esa prueba de la peor manera posible: era la misma fotografía dos veces —la
espalda naranja y esa misma foto recoloreada en rojo con otro lockup encima—, así
que se rehízo con los dos mockups reales del encargo (la prenda en plano y la
prenda puesta), que sí son dos cosas.

### El coste de convertir es la frase, no el alto

Un `pair` mide 648 px de alto y una ancha 656: cambiar una por otro **no mueve el
ritmo**. Lo que se pierde es el `lead` de la ancha (≈ 55 px de texto grande), y
eso **acorta** el tramo sin imagen que lo precede en vez de alargarlo. La regla de
los ~700 px no corre peligro al convertir *una* ancha en *un* par; sí corre
peligro si se fusionan *dos* anchas en *un* par, porque entonces desaparece un
bloque de imagen entero. Medido antes y después en las dos fichas, ningún tramo
creció: el peor de ANJ bajó de 947 a 848 y el de la ficha de producto de 506 a 407.

### Y de paso: lo que se parte, se revisa

Al partir `al-simbolo` salió a la luz que la lámina de justificación llevaba
**dentro de la imagen** un párrafo en castellano que repetía casi palabra por
palabra el cuerpo del acto 01 — y que se servía igual en inglés y en portugués.
Se quitó de la imagen y la frase se pasó al pie, que sí está traducido. Regla:
**cuando una pieza se rehace, se comprueba si el texto que lleva dentro puede
vivir fuera.**

---

## Octava generación — qué hace bueno a un mockup (MainTech, 2026-09-30)

Alexander, sobre el par de MainTech: *«básico y mal cuadrado, evita estos errores. Por lo
demás todo bien, pero tienes que mejorar en tu generación de mockups.»* Las dos palabras son
dos defectos distintos y se arreglan por separado. Lo que sigue es la receta, con los números
medidos sobre las piezas que fallaron y sobre las que las sustituyeron.

### Las cinco preguntas, antes de renderizar nada

Un mockup vale cuando la pieza contesta las cinco a la vez. Si falla una, se cambia la escena,
no el filtro:

1. **¿Qué objeto es?** Se tiene que reconocer por su silueta, sin leer el pie.
2. **¿De qué está hecho?** Recorta 200×200 px en cualquier punto del sujeto: si sale un relleno
   plano, la pieza es básica. Tiene que haber trama, grano, veta, un canto biselado, una costura,
   una raya de uso.
3. **¿Dónde está?** Un segundo plano que diga el sitio, con profundidad. Fondo liso = ficha de
   catálogo, no mockup.
4. **¿Cómo llegó la marca ahí?** Impresa, estampada, serigrafiada, vinilo, hueco. El proceso se
   tiene que ver.
5. **¿Por qué esa marca y no otra?** Si el objeto admitiría cualquier logotipo intercambiable,
   la pieza no prueba nada. El objeto tiene que pertenecer al oficio del cliente.

### «Básico» — vacío no es lo mismo que básico

La credencial de MainTech era **una funda de plástico con una cartulina blanca y el logotipo
arriba**: dos tercios de la tarjeta eran blanco liso. El logotipo caía al 25,6 % del alto de la
cartulina y debajo quedaban 348 px (el 65 %) de nada.

La regla de honradez —*«que se vea vacía antes que falsa»*, no inventar el nombre y el cargo que
un carné real llevaría— es **correcta y no se toca**. Lo que estaba mal es la conclusión: se
eligió un objeto **cuya razón de ser es el contenido que no podemos inventar**. Un carné sin
nombre no es un carné vacío: es un rectángulo.

**La prueba del objeto honrado**: pregúntate qué lleva ese objeto en el mundo real. Si la
respuesta incluye datos que no diseñamos (un nombre, un cargo, un número, un QR, un precio),
el objeto **no vale**, por bonito que sea. Si la respuesta es «el logotipo y nada más» —una
tapa de manual, un casco, un rótulo, una caja de herramientas, una plancha de aluminio, una
cinta— entonces sí, y la pieza saldrá llena estando vacía.

En MainTech se cambió la credencial por el **manual del curso**: tapa dura en tela índigo, que
en la vida real lleva exactamente el logotipo y nada más. Cero invención, y la tela trae la
materia que a la cartulina le faltaba.

### «Mal cuadrado» — el encuadre se mide, no se opina

Cuatro números, todos comprobables con veinte líneas de PIL:

| medida | credencial (mal) | casco viejo (mal) | manual (bien) | casco nuevo (bien) |
|---|---|---|---|---|
| sujeto, % del marco | **7,6 %** | **15 %** | 54 % | ~50 % |
| centro del sujeto vs centro del marco | −5,6 % x | ~0 | +1 % x, +5 % y | −4 % x, −8 % y |
| aire izq / der | 33 % / 44 % | 22 % / 33 % | 6,6 % / 3,6 % | 9 % / 21 % |
| franja sin detalle | — | **21 % abajo** | ninguna | ninguna |

- **Ocupación**: en una cuadrada de ficha, el sujeto quiere **40–60 % del área del marco**. Por
  debajo del 25 % la pieza se lee como un objeto perdido en una mesa. Se mide con la caja del
  sujeto, no con la sensación.
- **Márgenes deliberados**: ningún margen puede ser más de ~2× el más pequeño **a menos que lleve
  contenido**. En el manual, el 27 % de arriba no es aire: lleva el calibre, las gafas y el canto
  del banco. En el casco, el 21 % de la derecha es donde cae la sombra —y ahí el desequilibrio es
  correcto, porque se deja sitio en la dirección hacia la que va la luz.
- **Franjas muertas**: recorre el alto en bandas de 100 px y calcula la desviación típica de la
  luminancia. Cualquier banda con `std < 16` es una franja muerta. El casco viejo tenía 333 px
  (21 % del alto) de frente de cajón gris liso debajo del sujeto. Cero bandas muertas en las dos
  nuevas.
- **Nada puede brillar más que el sujeto**: el casco viejo tenía una ventana quemada a 255 en la
  franja de arriba, más brillante que el propio casco. Se comprueba con `max()` del fondo contra
  la media del sujeto. Si el fondo gana, se **quema la esquina** con un radial oscuro en el
  `velo` —es un revelado, no una trampa—: en el casco nuevo el fondo bajó a 175 contra 203 del
  casco.

### El recorte es parte del encuadre

La escena sale a 2048×2048 y la pieza se sirve a 1600×1600: **sobran 448 px de recorte gratis**.
Úsalos. Antes de dar por buena una escena, calcula la caja del sujeto y comprueba si algún
recorte cuadrado mejora los cuatro números. Y al revés: **si el sujeto está a menos del 8 % de un
borde, esa escena ya no se puede encuadrar** —no hay píxeles que añadir— y hay que tirarla por
mucho que guste. Así se descartó la mejor iluminación de los cascos (el sujeto a 105 px del borde
izquierdo, imposible de equilibrar) a favor de otra toma peor iluminada pero encuadrable.

### El tamaño de la marca se decide en el móvil, no a 1:1

La marca se ve preciosa en el JPG de 1600 y desaparece en la ficha. Una cuadrada de un `pair` se
sirve a **328 px** en un móvil de 360. Regla: **el logotipo tiene que medir ≥ 100 px a 360**, o
sea **≥ 30 % del ancho del marco**. La credencial tenía el 21 % (76 px a 360: ilegible). Las dos
nuevas tienen el 33 % (119 y 120 px a 360). Se comprueba midiendo la marca sobre el JPG final y
multiplicando por `360/1600`.

### R27 · `tinta-clara` — sobre soporte oscuro, `multiply` no existe

`R25 tinta-impresa` (multiply) sirve para tinta oscura sobre soporte claro: el logotipo azul
sobre el casco blanco deja pasar el reflejo del ala y la caída a sombra de la derecha, y por eso
pertenece al casco. **Sobre tela índigo no sirve**: multiplicar blanco por azul da azul, la marca
desaparece. Y `screen` o `normal` a opacidad 1 dan un blanco plano que tapa la trama y delata el
montaje.

```css
/* tinta oscura sobre soporte claro */
.tinta-impresa { position:absolute; mix-blend-mode:multiply; opacity:.95; filter:blur(var(--desenf,0px)); }
/* tinta clara sobre soporte oscuro */
.tinta-clara   { mix-blend-mode:normal;   opacity:.88; filter:blur(.35px); }
```

La clave es **el 0,88**: ese 12 % de soporte que atraviesa la tinta es justo lo que hace una
serigrafía blanca sobre tela —nunca cubre del todo— y devuelve la trama dentro de las letras.
Si el soporte tiene una caída de luz fuerte, se le pone encima a la marca un degradado en
`multiply` enmascarado con el propio SVG; si la caída es suave, el 0,88 basta.

### R28 · `en-plano` con perspectiva de verdad: `matrix3d`, no `matrix`

`R26 en-plano` usa una `matrix` afín y sirve para un plano casi paralelo al sensor. **Comprobación
de si basta**: mide los dos lados opuestos del plano. En la hoja A5 de Aurore daban la misma
escala (2,21 y 2,22 px/mm) → afín. En la tapa de MainTech el canto cercano medía **1315 px** y el
lejano **934** (ratio 0,71): hay fuga, y una afín la deforma.

Se miden las **cuatro** esquinas y se resuelve la homografía de un rectángulo al cuadrilátero;
en CSS es `matrix3d`:

```python
# esquinas medidas sobre la escena, pasadas a coordenadas del lienzo
Q = [(91.4,293.8),(449.2,222.7),(778.9,524.2),(291.4,686.3)]   # A B C D, en orden
W,H = 210.0, 260.0                                             # la tapa, EN MILIMETROS
R = [(0,0),(W,0),(W,H),(0,H)]
A=[];b=[]
for (u,v),(x,y) in zip(R,Q):
    A.append([u,v,1,0,0,0,-u*x,-v*x]); b.append(x)
    A.append([0,0,0,u,v,1,-u*y,-v*y]); b.append(y)
h11,h12,h13,h21,h22,h23,h31,h32 = np.linalg.solve(np.array(A), np.array(b))
# CSS es por columnas:
print(f"matrix3d({h11},{h21},0,{h31}, {h12},{h22},0,{h32}, 0,0,1,0, {h13},{h23},0,1)")
```

```css
.tapa { position:absolute; left:0; top:0; width:210px; height:260px; transform-origin:0 0;
        transform:matrix3d(1.953007,-0.215056,0,0.000555, 0.382793,0.599766,0,-0.001326,
                           0,0,1,0, 91.40625,293.75,0,1); }
```

Y entonces —esto es lo que vale— **el div está en milímetros de tapa**, así que el logotipo se
pide en milímetros impresos: `width:132px` son 132 mm sobre una tapa de 210, el 63 %. Nada de
«a ver si con 170 px queda bien».

**Se verifica renderizando**: el cuadrilátero de destino se dibuja sobre la escena con una
rejilla magenta etiquetada cada 128 px (el truco de «Medir sin adivinar», ya en la cuarta
generación) y se comprueba que las cuatro esquinas caen donde se midieron.

### Sobre una superficie curva: girar con el objeto, no arquear

Un casco no tiene plano. Lo que funciona sin arquear la marca:

- Mantener el lockup **por debajo del 50 % del ancho visible del objeto** (en el casco, 533 px de
  los ~1170 del casco): en ese tramo la curvatura es despreciable.
- Girarlo con el objeto: `perspective(760px) rotateY(9deg) rotateX(6deg)` para un casco vuelto
  ~10° y con la frente inclinada hacia atrás. El ángulo se copia de una arista real del objeto
  (la banda del ala), no se inventa.
- `multiply` hace el resto: el degradado del propio casco oscurece la tinta hacia el lado que se
  va, que es exactamente lo que haría la tinta de verdad.

### Del arreglo de Aurore, de Rematch y de las portadas — lo que ya sabíamos y sigue valiendo

- **El bokeh fabrica fallos, no los esconde.** Si la escena necesita nitidez, se pide foco
  profundo y cámara lejana; desenfocar para tapar un defecto añade un defecto nuevo, más visible.
- **Una escena vale cuando el fondo tiene la misma luz que el contenido.** Un degradado CSS
  debajo de una captura fotográfica canta a la primera. O todo es foto, o todo es lámina.
- **Lo desenfocado también se juzga a 1:1**: cada objeto lleva su propio `--desenf` (0 px en el
  plano nítido, 1,4–2,4 px a media distancia, 5–6 px en un primer plano); una marca nítida sobre
  una etiqueta borrosa delata el montaje.
- **Menos piezas y mejores**: dos aplicaciones con la misma dirección de luz, la misma materia y
  la misma paleta se leen como **una sesión de fotos**; cuatro escenas planas no prueban nada.

### El par se juzga junto, no pieza a pieza

Las dos cuadradas de un `pair` se ven a la vez. Antes de darlas por buenas hay que capturar el
bloque montado en la ficha —a 1440 y a 360— y mirar las dos juntas. Lo que tiene que coincidir:
**el mismo soporte** (las dos sobre el mismo banco de acero), **la misma dirección de luz** (dura,
desde la izquierda, sin relleno), **el mismo fondo** (taller oscuro fuera de foco) y **marcas del
mismo tamaño aparente** (33 % y 33 %). Lo que tiene que cambiar: **el valor del sujeto** —uno
oscuro, uno claro— y **la tinta** —el lockup a color sobre el casco blanco, el mismo lockup a una
tinta blanca sobre la tela índigo—, que de paso demuestra que el sistema aguanta en positivo y en
negativo. Eso es lo que separa un par de dos fotos sueltas.

### El prompt de escena que dio el salto, en versión industrial

Sobre la anatomía ya escrita en la cuarta generación, lo que hubo que añadir para un bodegón de
taller —y que sirve para cualquier escena con un objeto claro sobre metal:

- **La orientación, mandada como orden y no como adjetivo.** «Three-quarter front angle» dio
  cuatro cascos de perfil, con la frente —donde va la marca— a 60° de la cámara. Lo que funcionó
  fue: *«IMPORTANT ORIENTATION: the brim points toward the camera; we see the FRONT of the helmet
  almost head-on, the shell rotated only about 20 degrees»*. **Di dónde tiene que estar la cara
  que va a llevar la marca**, en grados, o no la tendrás.
- **Prohibir el brillo del fondo**: *«nothing in the image is brighter than the helmet shell; no
  window, no lamp, no sky, no bright blown highlight anywhere in the background»*. Sin esa frase
  salen ventanas quemadas que roban el ojo.
- **El negativo de la marca, largo y repetido**: *«absolutely blank: no printing, no writing, no
  lettering, no logo, no symbol, no sticker, no label, no numbers, no marks of any kind on the
  shell or anywhere in the frame»*.
- **Atrezo del oficio, no de oficina**: un calibre y unas gafas de seguridad, no un cuaderno y un
  portaminas. La libreta negra y el lápiz de la credencial vieja no decían nada de MainTech.
- **Coste real de esta pasada**: 12 generaciones (`gpt_image_2_5` high/2k, 2,75 cada una) = **33
  créditos** para dos piezas. Cuatro variantes por sujeto es el mínimo; la segunda tanda de
  cuatro cascos —con la orientación mandada en grados— es la que dio la buena.

---

## Novena generación — la pieza de pantalla también necesita una idea (brandvm, 2026-10-01)

Alexander, después de medir las dos fichas de brandvm: *«tal vez no podemos hacer lo mismo
que brandvm, pero en temas de calidad de imágenes, creatividad sí; eso nos falta.»*

Tiene razón, y el análisis anterior se había quedado cómodo: concluir que la brecha era
sólo **el reparto vertical** dejaba fuera la parte difícil. La producción que no tenemos
—fotografía corporativa, anillos olímpicos, campaña viva— es la mitad *excusable* de la
brecha. La otra mitad es nuestra: **la inventiva de cada composición**, que no cuesta un
crédito.

Las cinco preguntas de la octava generación valen para **objetos físicos con la marca
encima**. Pero la mayoría de nuestras piezas son **pantallas**, y ahí nuestro recurso por
defecto es siempre el mismo: captura rectangular sobre campo de color con sombra blanda.
Correcta, y sin una idea dentro.

### Las cinco preguntas de una pieza de pantalla

1. **¿Qué se lee?** Si a 648 px servidos no se lee nada, la pieza no es una pantalla: es un
   **recorte de detalle** que todavía no se ha hecho. (Medido en fichas nuestras: una tabla
   entera en un par deja el cuerpo a **3,6 px**.)
2. **¿Sobre qué está apoyada?** Un degradado no es un sitio. brandvm apoya sobre pana azul,
   fieltro, hormigón, asfalto, una superficie industrial rayada. **La materia bajo el objeto
   cuesta cero** —una textura y una sombra de contacto— y es lo que separa «rodado en algún
   sitio» de «exportado de Figma».
3. **¿Qué sale de la pantalla?** Extraer 3–4 componentes reales de esa misma captura y
   flotarlos al lado **a tamaño legible** convierte un pantallazo en una explicación. Es
   nuestro defecto recurrente resuelto y una idea a la vez.
4. **¿Qué manda el color?** Si todo pesa cromáticamente igual, no manda nada. En la losa 2
   de la industrial **todo está en blanco y negro salvo el interior de la pantalla**: una
   decisión de una línea que vale más que cualquier escenografía.
5. **¿Esta composición serviría para otro cliente cambiando la captura?** Si la respuesta es
   sí, no hay idea: hay plantilla. Es la misma prueba de `creator/DISENO.md` aplicada a una
   pieza en vez de a una página.

### Recursos verificados, todos a coste cero

- **R28 · losa partida** — dos medias piezas en un único archivo 2:1, separadas por una calle
  horneada en el propio archivo. Medido en las losas descargadas: **la calle cae exactamente
  en el centro** y mide ≈32–44 px sobre 4000 (11–15 servidos). Frecuencia: **30 % y 29 %** de
  las losas.
- **R29 · dispositivo con componentes extraídos** — la maqueta con la captura dentro **más**
  tres o cuatro tarjetas reales de esa pantalla recortadas y flotando sobre el campo, con la
  marca al 8 % detrás. Playwright + CSS.
- **Desaturar el contexto** y dejar el color sólo dentro de la pantalla.
- **La marca gigante detrás**, al 6–10 % de opacidad, como fondo del campo.
- **Patrón tipográfico** con cruces de registro, usando la propia tipografía del cliente.

### Lo que NO se copia, aunque sea la mitad de su volumen

Maquetas PSD con el logotipo del cliente encima (sudadera, valla, tótem, camión, casco) y
fotografía corporativa del cliente presentada como prueba de trabajo propio: **5 de 12 y 8 de
21 paneles** en las dos fichas, más seis de banco. Eso es fabricar entregables y lo prohíbe
`ESTANDAR-FICHA.md § 9`. La creatividad que hay que robarles es **la de la composición**, no
la del inventario.


### El orden físico de las capas (Clefast, 2026-10-01)

Al posar un producto recortado sobre una escena, el orden importa y es
contraintuitivo:

**sombra difusa → reflejo especular → pieza.**

Al revés —pintando la sombra sobre el reflejo— el reflejo desaparece, y **el reflejo
es exactamente lo que distingue «producto fotografiado» de «producto pegado»**. El
reflejo es un espejo exacto sobre la línea de contacto (eso da la proyección con
cámara nivelada), con desvanecido y arrastre vertical, y se construye con la
luminancia del cuerpo **sin** la oclusión de canto: si no, solo se refleja lo oscuro
y no se ve nada.

Dos correcciones más de la misma tanda, las dos vistas y no medidas: **nada de
derrame de color del campo sobre el producto** (sobre suelo oscuro no lee como luz
rebotada, lee como bruma), y **el microcontraste global por debajo de 0,15** —a 0,34
el fondo se vuelve crujiente, tipo HDR—, con rampa para el primer plano.

Y el desorlado: los recortes de foto de catálogo conservan píxeles blancos en el
canto que **se ven a tamaño de tarjeta**. MinFilter 5 + 0,9 px de desenfoque.

---

## Receta · Mesh gradient sutil (2026-10-02)

Alexander: *«siempre usamos los mismos gradientes, sería bueno cambiar con algún
**mesh gradient abstracto pero sutil**»*.

El degradado lineal o el radial con `filter:blur()` tienen dos problemas: todas
las piezas de una ficha acaban con el mismo fondo, y a partir de ~2000 px de
ancho **hacen bandeado visible** (escalones de 1 nivel que el JPEG además
acentúa). La malla los arregla los dos.

**Qué es:** varios puntos de color interpolados sobre un color base, más grano
fino. Nada de blur: los `radial-gradient` con parada en `transparent 66%` ya se
funden entre sí.

```js
const GRANO = `<i style="position:absolute;inset:0;pointer-events:none;opacity:.16;
  mix-blend-mode:overlay;background-image:url('data:image/svg+xml;utf8,
  <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
  <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85"
  numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/>
  </filter><rect width="180" height="180" filter="url(%23n)"/></svg>')"></i>`;

function malla(semilla, paleta, base) {
  const r = (n) => { const x = Math.sin(semilla*97.3 + n*41.7)*43758.5453; return x - Math.floor(x); };
  const puntos = paleta.map((c, i) => {
    const x = Math.round(8 + r(i)*84),      y = Math.round(6 + r(i+9)*88);
    const w = Math.round(46 + r(i+17)*38),  h = Math.round(44 + r(i+23)*40);
    return `radial-gradient(${w}% ${h}% at ${x}% ${y}%, ${c} 0%, transparent 66%)`;
  });
  return `<div style="position:absolute;inset:0;background:${puntos.join(",")},${base}"></div>${GRANO}`;
}
```

**Las tres reglas de uso**

1. **Una semilla distinta por pieza.** `malla(3, …)`, `malla(21, …)`,
   `malla(29, …)`. Misma paleta, mismo aire, y la galería deja de repetir
   fondo sin que haya que diseñar nueve fondos a mano.
2. **La paleta es del cliente, de tres a cinco tonos del mismo color**, de más
   claro a más oscuro, más el base. Si se meten dos familias cromáticas, deja de
   ser sutil y se convierte en un fondo de plantilla.
3. **El grano no es opcional.** Sin él hay bandeado; con `opacity:.16` y
   `mix-blend-mode:overlay` no se ve como grano, se ve como materia.

**Comprobación:** mide la desviación de luminancia en una banda de 200 px de
fondo liso. Por debajo de 2,5 vas a tener bandeado en el JPEG; con grano sube a
~6 y desaparece.

### La causa de los «cambios bruscos de color» (2026-10-02)

Alexander lo preguntó dos veces, sobre dos piezas distintas: *«MIRA LOS CAMBIOS
BRUSCOS DE COLORES»* (cf-celular) y *«¿POR QUÉ HAY UN CAMBIO BRUSCO DE COLOR?»*
(cf-ficha). **No era el degradado ni el bandeado ni el recorte del producto.**

> **Era un rectángulo de velo cuyo degradado no terminaba en alfa 0 dentro de su
> propia caja. El canto del `<div>` se ve entonces como un escalón recto que
> cruza el lienzo de lado a lado.**

Los dos casos, idénticos en mecánica:

- **cf-ficha**: una banda de suelo `top:452px; height:252px` con
  `linear-gradient(180deg, …0 0%, …,30 100%)`. A los 704 px el alfa pasa de
  0,30 **a 0 de golpe**, porque ahí se acaba el elemento. Escalón horizontal de
  37 niveles cruzando el 100 % del ancho.
- **cf-celular**: un panel de mural a `right:0` con su velo empezando en
  `rgba(.72)` **en su propio borde izquierdo**, encima de una máscara que ya
  cortaba ahí. Dos cantos superpuestos, y además guillotinaba el texto vivo de
  la captura.

**La regla, que vale para las 40 fichas:**

1. **Un degradado de velo empieza y acaba en alfa 0 dentro de su caja**, o la
   caja **sangra hasta el canto del lienzo**. En el canto del lienzo un
   degradado puede acabar en cualquier valor: no hay nada al otro lado con lo
   que contrastar.
2. **Un campo no se parte con dos planos a tope.** Si la pieza necesita dos
   zonas (dato claro / producto sobre color), se hace con **una sola malla que
   transiciona**, no con dos paneles y una calle. En `cf-mudanza` la losa
   partida daba un salto de 86 niveles en la columna de la junta; con el campo
   fundido el salto desaparece y la pieza no pierde nada.
3. **Si de verdad hace falta un canto, que sea un objeto, no un campo**: una
   tarjeta con radio y sombra proyectada. El ojo lee «hay un objeto encima»,
   no «el color ha cambiado». Los cantos que quedan en `cf-envio` y
   `cf-tienda-movil` son eso y están bien.

**Cómo se comprueba, sin mirar** (`scripts/escalones.py`): se remuestrea a 900
px de ancho y se buscan filas o columnas donde el salto contra la vecina supere
4 niveles **en más del 88 % del largo**. Un canto de tarjeta no llega a ese
porcentaje; un rectángulo de velo mal cerrado da el 100 %. Objetivo: **cero
filas y cero columnas** en toda la ficha, salvo las que sean cantos de tarjeta
con sombra.

### Entre dos vistas válidas, la más bonita (2026-10-02)

Alexander, sobre dos piezas: *«tomaste capturas a partes muy feas de la web»*.
No era composición: era **selección**. Estábamos capturando *la sección que
tocaba* según el guion de la ficha, en vez de **la parte que mejor se ve** del
sitio del cliente.

> **El §0 dice qué merece ser pieza. Esto añade: entre dos vistas que lo
> merecen, va la que mejor se ve. Y si la sección es fea en el sitio real, no
> se salva componiendo — se cambia por otra y se reescribe el pie.**

El método, que cuesta diez minutos y vale para las 40 fichas: **capturar el
sitio entero primero** —portada, catálogo, ficha de producto, categorías,
nosotros, blog, contacto, promociones— a móvil y a escritorio, montarlo en una
hoja de contacto y **elegir mirando**. En Clefast la ficha de producto (banda
verde de marca + el envase sobre blanco + el selector de presentaciones) era con
diferencia la vista más bonita, y no la estábamos usando; estábamos usando
*/nosotros*, que tiene una foto oscura de archivo y una banda gris azulada que
no es de la marca.

Dos trampas que encontramos al recapturar:

- **El aviso de cookies sale en todas las capturas.** No es trabajo nuestro y
  ensucia la pieza: se acepta antes de capturar.
- **Los widgets flotantes del sitio** (el lanzador del chat, el globo de
  «¿Necesitas ayuda?») se cuelan encima del contenido que queremos. Si caen
  sobre el recorte, se cambia el encuadre, no se borran: borrarlos sería
  retocar el sitio del cliente.

### El fondo no se varía: se calla

Alexander: *«veo mucho fondo verde repetido, ¿cómo hace brandvm para no redundar
en sus fondos?»*. Medido sobre sus 16 losas, **la respuesta es la contraria de
la que parece**:

| | dispersión de tono | saturación del campo | luminosidad del campo |
|---|---|---|---|
| brandvm talent-group | 13° | 31–94 | 7–17 (todas oscuras) |
| brandvm employee-benefits | 36° | **0–24** | **38–100** |
| Clefast, antes | 19° | **8–91** | 18–76 |
| **Clefast, ahora** | **4°** | **14–32** | **18–81** |

**No evitan repetir el fondo: lo repiten a propósito y lo mantienen callado.** El
error no era repetir el verde, era **gritarlo**: un campo saturado compite con el
contenido y, repetido, se vuelve papel pintado.

**Las cuatro reglas del campo**

1. **Saturación del campo entre 20 y 35 %.** El verde de marca se sigue
   reconociendo y deja de competir. **El color fuerte vive en el producto y en
   la interfaz**, que es donde brandvm lo pone.
2. **La variedad va en el VALOR, no en el tono ni en la saturación.** Se reparte
   la galería: unas claras (70–85), unas medias (45–60), un par oscuras (15–25).
3. **La textura es el segundo eje, y casi no lo usábamos.** Unas piezas con
   materia (grano al 22–28 %) y otras lisas (6–8 %), alternando. En las losas de
   brandvm la textura de borde va de 0,8 a 73,8.
4. **Un solo tono.** Dispersión por debajo de ~15°. Meter otros colores no
   arregla la redundancia: la empeora.

Se implementa con el mismo `malla(semilla, paleta, base, textura)` de la receta
de arriba, con tres paletas —`PAL_CLARA`, `PAL_MEDIA`, `PAL_HONDA`— derivadas
del mismo verde a saturación baja, y una semilla distinta por pieza.


### El recorte no se hace a mano: se hace con un modelo de matting (2026-10-02)

Alexander: *«mira las sombras y los recortes, siguen saliendo mal, ¿por qué?»*.
**Las sombras malas y los recortes malos eran el mismo fallo.**

> La máscara hecha a mano conservaba parte de la **sombra horneada** de la foto
> de catálogo. Bajo cada envase quedaba un manchón gris plano que **peleaba con
> la sombra compuesta encima**: dos sombras, una fantasma y una sintética. Y
> como la fantasma no se movía con la luz, la pieza entera leía a montaje.

Llevábamos cuatro rondas escribiendo heurísticas —umbral de blanco → núcleo de
saturación con dilatación asimétrica → cierre de cantos y inundación por líneas—
y cada una acertaba en unos envases y fallaba en otros. **Los que fallaban eran
siempre los de cuerpo blanco**, que es el caso imposible para cualquier método
por umbral: blanco sobre blanco con una sombra gris en medio.

**La herramienta correcta es un modelo de matting, no un umbral.**

```
# intérprete aislado, para no tocar el Python del sistema
/…/scratchpad/.venv-mat/bin/python  …/scratchpad/mat/recortar.py  <carpeta_salida> <imagen...>
# rembg, modelo isnet-general-use, alpha_matting activado
```

⚠️ **Hay que ejecutarlo desde `scratchpad/mat/`**, no desde `scratchpad/`: ahí
vive un `copy.py` viejo que tapa el módulo estándar de Python y rompe la
importación de rembg.

**Lo que cambia en el compositor cuando el recorte es bueno**

1. **Fuera el desorlado.** El `MinFilter(5)` que poníamos existía para tapar el
   canto sucio de la heurística. Con un alfa limpio, erosionar **se come el
   canto bueno**.
2. **Baja la oclusión de canto.** La teníamos al 80 % para enterrar el fantasma;
   con el fantasma fuera, al 52 % ya es suficiente y el envase deja de parecer
   pintado por abajo.
3. **Baja la densidad de la sombra proyectada** (de 172 a 150 de alfa): parte de
   lo que creíamos sombra era el manchón.

**Cómo se juzga, y cómo NO**

- **Mirando, a 1:1, sobre fondo oscuro y sobre fondo claro.** Una sombra
  residual **solo se ve sobre oscuro**; un halo blanco **solo sobre claro**. Con
  un solo fondo se escapa la mitad de los defectos.
- **Una métrica de «gris residual» no sirve** en este catálogo: no distingue la
  sombra conservada del **cuerpo blanco del envase**, y la mitad de los formatos
  de Clefast son blancos. El número engaña; el ojo no.

**Si el modelo falla en algún envase**: se usa ese producto más pequeño o se
cambia por otro. **No se vuelve a la heurística manual.** En los seis envases de
Clefast (100 ml, 4, 10, 20, 30 y 200 kg) el modelo acertó en los seis.

### Y una sombra no es una elipse borrosa

El otro defecto de la misma captura: bajo los teléfonos había **una elipse más
ancha que el objeto, centrada y muy desenfocada**. Eso no es una sombra, es un
manchón, y sobre campo claro nubla media pieza.

> Un objeto de pie da sombra **dirigida**: un núcleo de contacto pegado a su
> base y una proyección **en la dirección de la luz**, no un halo centrado. En
> CSS se resuelve con `box-shadow` desplazado (`26px 30px 56px`) más un segundo
> desplazamiento corto y denso para el contacto; en Python, con la silueta
> proyectada por una afín. Y el color de la sombra es **el campo oscurecido y
> teñido**, nunca `#000` plano.
