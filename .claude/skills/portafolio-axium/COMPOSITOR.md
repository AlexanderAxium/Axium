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
