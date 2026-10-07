# Caso Vendiq — ficha dentro de Axium (SaaS propio, marca nueva)

> Encargo, 2026-09-13. Alexander: *"en 40 min haré un push de un nuevo diseño de vendiq, si no
> lo ves, espera 40 min más, si lo llegas a ver, rediseña todo como hemos hecho con los otros 3
> en su portafolio"*. Un vigía comparó vendiq.pe contra una base (titular, fuentes, fondo y
> diferencia visual del hero) y detectó el diseño nuevo en la primera revisión (titular «Todo tu
> comercio en un solo sistema», Geist Mono, diferencia visual 23 contra ruido 0,01). Plantilla
> brandvm (`src/components/axium/case-story/`), igual que Rematch, LumioLearn y Bookit. Ficha en
> `src/app/(public)/casos-de-exito/vendiq/`.

## 1. Qué es y dónde está el rediseño

- **Vendiq**: SaaS de comercio del Perú. Tienda online con marca propia, punto de venta,
  inventario con kardex, facturación SUNAT, cobros y envíos por distrito sobre un mismo catálogo.
- **El rediseño** vive en `SAAS/Vendiq-web-publica` (worktree, rama `feat/web-publica-rediseno`,
  commit `38499eb5` «rediseño oscuro de la portada y las páginas públicas») y ya está en
  vendiq.pe. Documentación: `docs/web-publica/DESIGN.md`.
- **Marca**: negro `#000000`, banda `#0A0B0E`, tarjeta `#141519`, texto `#F5F5F7`, botón
  `#1F5BFF`, luz `#14ADFD → #078EFC → #0058FD` (degradado del logo). Satoshi 500 en titulares y
  Geist Mono en rótulos. Firma: **«la V hecha luz»** (barras de luz diagonales). El logo es la V
  + «Vendiq» escrito en Satoshi; se sacó del header en vivo sobre negro puro y se desmultiplicó
  a alfa (`public/images/highlights/logos/vendiq-v2.png`, 694×160).
- **El panel conserva la paleta anterior** (`#002742`, `#835BD6`) → no sale en la ficha.

## 2. Hechos verificados y lo que la ficha no promete

Ficha de hechos hecha por un agente de solo lectura sobre el repo y la web (2026-09-14):
- Punto de venta, SUNAT, envíos, IA, fidelidad: **desde Business**. Varios almacenes, dominio
  propio, cinco idiomas y API: **solo Business Pro**. La ficha lo dice con el plan.
- Cobros reales: Mercado Pago, Culqi, PayPal, transferencia y contra entrega; 0 % de comisión.
  Yape, Plin, Izipay, Niubiz y Stripe tienen código pero están apagados: no se nombran.
- Envíos = tarifas por distrito (sin courier). WhatsApp = enlace wa.me con el pedido (no API).
- La IA arma secciones o páginas del editor con la clave de Gemini del comercio; no «arma la tienda».
- **Happy Art no es Vendiq** (WordPress + WooCommerce) aunque vendiq.pe la muestre: fuera de la ficha.
- No enlazar vendiq.pe/blog (muestra artículos de todas las tiendas).
- Planes: Starter $19, Business $59, Business Pro $149 al mes (los soles del código no se citan).
- La descripción del highlight del home se corrigió (decía «un asistente con IA arma la tienda»).

## 3. Material

- `capturas-saas/vendiq/rediseno/`: vendiq.pe en vivo a 2x (inicio en 11 tramos + completo,
  features, solutions, prices, ia, comparar, security, about, contact, docs) y móvil a 3x.
- `capturas-saas/vendiq/piezas/`: piezas por elemento (módulos, cómo funciona, incluido, IA,
  precios, índice de /features, ficha técnica de /about, «Venta registrada» a 4x) y tramos móviles.
- `capturas-saas/vendiq/clientes/`: aurore.com.pe, anjsports.com, sporttperu.com,
  daesurmotors.com, clefast.com.pe (escritorio 2x y móvil 3x). Las URLs salen de los enlaces
  «Visitar …» de la web (todos están en el DOM a la vez: no sirve leer el «visible» tras un clic).

## 4. Piezas (`public/images/proyects/vendiq/`)

| Pieza | Qué es | Cómo |
|---|---|---|
| `bv-hero.jpg` | Dueño de una tienda empacando un pedido tras un mostrador de concreto, luz azul, pared libre a la izquierda | **Higgsfield** `escenas/vendiq-hero-empaque.png` (16:9 high 2k, 3 créditos). Hombre: varía frente al jugador (Rematch), la alumna (Lumio) y la fisioterapeuta (Bookit) |
| `bv-mosaico.jpg` | 30 baldosas oscuras de vendiq.pe a −12° | Taller (sin los tramos con las pestañas de clientes, que incluyen Happy Art) |
| `bv-tipografia.jpg` / `bv-paleta.jpg` | Satoshi + Geist Mono; negro, azul, luz, tarjeta, texto | Taller |
| `bv-landing.jpg` (+ `-movil`) | Laptop con el inicio y celular con el inicio móvil sobre un mostrador de concreto | **Higgsfield** `escenas/vendiq-mostrador-dispositivos.png` (3 créditos) + dos pantallas verdes: laptop con `--caja 0,0,1250,1520`, celular con `--bordes --caja 1250,0,2688,1520` (pantalla HTML 1170×2769, aspecto 0,423). **Derrame verde** sobre el mostrador y el teclado: G ≤ (R+B)/2 + 8 fuera de las pantallas |
| `bv-modulos.jpg` / `bv-moviles.jpg` | La sección de módulos (objetos del mostrador) en ventana oscura; tres pantallas móviles | Taller |
| `bv-clientes.jpg` (+ `-movil`) | Aurore en escritorio + ANJ Sports, Sportt y Daesur Motors en el celular | Taller |
| `bv-funciones.jpg` / `bv-planes.jpg` | Índice de /features; precios | Taller |
| `vendiq-portada.jpg` | Portada del carrusel y del portafolio: monitor sobre mostrador de concreto con el inicio de vendiq.pe | **Higgsfield** `escenas/vendiq-portada-monitor.png` (3:2, 3 créditos). Dispositivo distinto de los otros tres (celular, tableta, laptop) |

**Highlight del home** (`public/images/highlights/vendiq-v2.jpg`), receta de la séptima vuelta
(HIGHLIGHTS-HOME.md): escena del mundo de la marca (`escenas/vendiq-mundo-peldanos.png`,
peldaños de concreto con estelas de luz azul, 3 créditos) + una sola pieza real («Venta
registrada · Pedido #1482 · S/ 189,90») sobre el peldaño más alto + logo arriba a la izquierda.
Composición **diagonal**, distinta de la simétrica (Rematch), la partida (LumioLearn) y la retícula (Bookit).

## 5. Cableado en Axium

- `src/data/cases/vendiq.json` + `vendiq` en `src/locales/{es,en,pt}/cases.json` (después de
  bookit, formateado con biome) + import, base y `CASE_ORDER` en `src/lib/case-translations.ts`.
- Home: `highlights-section.tsx` → `caseHref`, portada y logo nuevos; el arreglo pasó a tipo
  explícito `readonly [Highlight, ...Highlight[]]` (con los cuatro con ficha, la rama «sin ficha»
  quedaba como `never`). Textos del highlight corregidos en `landing.json`.
- Ciclo de «Siguiente»: Rematch → LumioLearn → Bookit → **Vendiq** → Rematch.
- `hideCases={["store-saas"]}` en la ficha: el caso anónimo «E-commerce & Inventory SaaS»
  describe el mismo producto. **No se borró**: queda a decisión de Alexander.

## 6. Errores que mordieron

- El vigía de 40 min tardó 4 h 30 en su primera revisión: `sleep` en segundo plano se detiene si
  la máquina se suspende. Para esperas largas, no confiar en el reloj de pared.
- `omitBackground` no dio alfa en el logo del header (algún ancestro pinta negro): capturar sobre
  negro puro y desmultiplicar (alfa = canal máximo) funciona limpio.
- Buscar el enlace «visible» después de clicar una pestaña devolvió siempre el primero: los
  paneles ocultos siguen en el DOM. Leer todos los enlaces y emparejarlos por orden.
- La escena con dos pantallas verdes: sin `--caja`, las esquinas diagonales mezclaron laptop y
  celular en un solo cuadrilátero.

## 7. Segunda vuelta: la «línea técnica» (2026-09-14)

Alexander, al rato: *"vendiq sufrió un rediseño de su landing, cambia el highlights y su vista de
detalle"*. En vivo seguía el mismo titular, pero el hero había cambiado (diferencia visual 39,9) y en
`Vendiq-web-publica` había un commit nuevo, `45ae893e` «línea técnica en la portada y segunda revisión
móvil» (DESIGN.md § 15), ya en `origin/main`:
- **Por qué:** *«en realidad esto no es un producto físico, es uno digital pero debe tener una línea
  gráfica más acorde»*. Referencias elegidas: Oxide y Daytona (imagen), la portada de Rye y el detalle de Saleor.
- **El sistema** (`linea.ts`, `Rejilla.tsx`): grafito `#0B0D12`, celdas `#10131A`, filetes blancos al
  9 %, rejilla de 1 px cada 64 px con un punto azul en cada cruce, esquinas de 3–4 px, señal cian
  `#14ADFD` (texto `#6CCBFF`), azul `#1F5BFF` solo en la acción principal.
- **La imagen es la interfaz dibujada en HTML**, siempre con el mismo pedido #1482 de «Repuestos
  Lima» (guantes de cuero S/ 120,00 + envío S/ 10,00, boleta B001-000284). Fuera los pedestales,
  las fotos de objetos y las estelas.

**Qué cambió en Axium** (capturas nuevas en `vendiq/rediseno-v2/` y `vendiq/piezas-v2/`):

| Pieza | Antes | Ahora |
|---|---|---|
| Highlight del home | `vendiq-v2.jpg`: peldaños de concreto + «Venta registrada» | `vendiq-v3.jpg`: la rejilla técnica con el **flujo dibujado de la venta** de su portada (tienda en el celular → inventario 18 → 17 en web y local → boleta aceptada por SUNAT, con las etiquetas punteadas numeradas), capturado de vendiq.pe a 3x ocultando (visibility) header, anuncio, titular y botones, + logo. Sin escena de Higgsfield: el mundo de la marca **ya es** esa rejilla |
| Portada del carrusel | monitor con la portada de pedestales | `vendiq-portada-v2.jpg`: la misma escena con la portada nueva |
| `bv-landing` | laptop + celular con la portada anterior | `bv-landing-v2.jpg` (+ `-movil`): la portada nueva (celular con barra de estado sobre `rediseno-v2/home-m-full.jpg`) y el mismo arreglo del derrame verde |
| Taller (mosaico, tipografía, paleta, módulos, móviles, clientes, funciones, planes) | fondo negro con luz azul, píldora redondeada, esquinas de 18 px, objetos | `.vq-fondo` = la rejilla de `Rejilla.tsx` en CSS (vignette arriba como máscara, luz azul abajo); etiqueta punteada cian en vez de píldora; esquinas de 4–6 px; paleta grafito/acción/señal/celda/texto; módulos y precios nuevos; **funciones** pasa a «Vendes una vez. Vendiq hace el resto.» (la venta, el stock, la boleta y el envío dibujados) |
| Textos | «la V se vuelve luz y cada módulo aparece como un objeto del mostrador» | «la interfaz dibujada sobre una rejilla técnica y un solo pedido: el cliente compra, Vendiq descuenta el stock en web y local, y sale la boleta aceptada por SUNAT» (es/en/pt) y alts de paleta, módulos y funciones |

Se conservan el hero de la ficha (dueño empacando un pedido: es el mundo del cliente, no foto de
objeto del producto) y la escena del monitor y de la laptop + celular (portadas de mockup, como las
de los otros tres). Borradas las versiones superadas: `highlights/vendiq-v2.jpg`,
`vendiq-portada.jpg`, `bv-landing.jpg` y `bv-landing-movil.jpg`. Como el taller reusa nombres
(`bv-*.jpg`), se vació `.next/cache/images` antes de verificar.

**Lección:** una web recién rediseñada puede volver a cambiar el mismo día. Antes de dar por
cerrada la ficha de un SaaS en rediseño, comparar la captura contra la web en vivo **y** mirar el
`git log` de la rama del rediseño.

## 8. El producto por dentro: panel y tienda demo del repo local (2026-09-14)

Alexander: *"vendiq no es solo la landing page, levanta el repo local y toma algunas caps ahí también"*.
Corrige el criterio de las fichas de Bookit y Vendiq, donde el panel se había dejado fuera por
conservar la paleta anterior: **en un SaaS la ficha muestra el producto por dentro aunque su
paleta sea la vieja**.

- **Entorno:** el dev server de `SAAS/Vendiq` ya corría en `:3000`, con la base local `vendiq-db`
  (docker, `:5434`). `pnpm dev` pasa por `scripts/assert-local-db.ts`, que no deja arrancar contra
  otra base. Login por API (`POST http://lvh.me:3000/api/auth/sign-in/email`) con el usuario del
  **inquilino demo** que documenta el `CLAUDE.md` del repo, y navegación en `demo.lvh.me:3000`. Notas
  del repo que se cumplieron: `domcontentloaded` + espera (nunca `networkidle`), reintentos por
  reinicio del servidor, y buscar «no tenés acceso» antes de creerle a una captura.
- **Solo lectura:** se navegó y se abrió un producto y un pedido con clic; sin carrito, sin cobros,
  sin crear nada. Se quitó el indicador «N» de Next (`nextjs-portal`) antes de cada captura.
- **Qué sirvió** (`vendiq/panel/v2-*`, `vendiq/tienda-demo/v2-*`): catálogo de productos (aceites
  Castrol, bujías NGK, filtros), detalle de pedido (productos, cliente, envío, pago), zonas y
  métodos de envío (Lima, provincias, retiro en tienda, delivery 24 h), ficha de producto, y la
  tienda DEMO·MOTORS en el celular (portada y ficha del Castrol Magnatec).
- **Qué no:** facturación (bloqueada por plan en el demo), reportes y pagos en cero, inventario e
  inicio con productos de prueba («Producto Smoke»), el editor visual (`/builder`, secciones «sin
  render») y `/productos` de la tienda (404). Las filas de prueba del catálogo quedan fuera del alto
  de la pantalla en la pieza.
- **Datos:** «Dueña de la tienda», `owner@demo.dev`, «Av. Arequipa 1234» son del sembrado demo, no
  personas reales.

| Pieza | Qué es |
|---|---|
| `bv-panel.jpg` (+ `-movil`) | Dos ventanas sobre la rejilla técnica: el catálogo detrás y el detalle del pedido #336956AF delante (móvil: solo el pedido) |
| `bv-envios.jpg` | Zonas y métodos de envío del panel |
| `bv-tienda.jpg` | La tienda demo en dos celulares: portada y ficha de producto |

En la ficha van después de «Resultados», antes de las tiendas de clientes, con sus alts en es/en/pt.
**Pendiente sugerido:** si la data del demo se ve pobre en otras pantallas (ventas en cero,
«Producto Smoke»), sembrar un catálogo y pedidos de demostración en la base local; pedir permiso
antes, porque escribe en la base.

### 8b. La tienda demo en el celular, fuera (2026-09-14)

Alexander, sobre `bv-tienda.jpg`: *"cambia eso"*. La cabecera móvil de la tienda demo se apilaba (logo,
menú y carrito en tres filas con aire muerto) y el texto venía en voseo («Recuperá»). La reemplaza
`bv-celular.jpg`: **el panel en el celular**, la lista de pedidos y el detalle del pedido #336956AF
(`vendiq/panel/m-pedidos.png`, `m-pedido.png`, 390×844 a 3x, inquilino demo, sin la «N» de Next).
Descartados del panel móvil: punto de venta (vacío y con «Escaneá o escribí»), productos (todo «Sin
stock»). Alt en es/en/pt: «El panel de Vendiq en el celular: la lista de pedidos y el detalle de un pedido».

### 8c. «Más proyectos» sobre el Carousel de shadcn (2026-09-14)

*"Más proyectos tiene pésima UX, usa carrusel de shadcn si es que no lo estás usando. y fíjate los
carruseles que usamos en aurore o sportt o anj, que son más smooth"*. Afecta a las cuatro fichas
(`case-story.tsx`):
- Se usaba `useEmblaCarousel` directo con `dragFree: false` (saltaba tarjeta por tarjeta) y anchos por
  variables CSS. Ahora: `Carousel`/`CarouselContent`/`CarouselItem` de `src/components/ui/carousel.tsx`
  con `align: "start"`, `dragFree: true`, `containScroll: "trimSnaps"` (las opciones del carrusel de
  colección de ANJ), el plugin de rueda y `touch-pan-y`.
- `carousel.tsx` ganó, sin quitar nada (+58 líneas), `CarouselProgress` (la barra de «cuánto has visto» de
  Sportt, que viene de aurore.com.pe) y la exportación de `useCarousel` para las flechas propias.
- Sangra hasta el borde derecho con `margin-right: calc((100% - 100vw) / 2)` y un espaciador final.
- **Medido:** arrastre de 400 px → 391 px al soltar y 1039 px tras la inercia, sin navegar; flecha
  siguiente avanza; rueda horizontal mueve el carrusel y no la página; rueda vertical mueve la página y
  no el carrusel; en el celular el gesto horizontal mueve el carrusel con la página quieta y el vertical
  desplaza la página. 0 errores de JS y 0 desborde a 1440 y 390.
- **Error propio al probar:** nombrar `const URL = …` en el script de Playwright rompe `page.goto`
  (`URL.canParse is not a function`): tapa el global que usa Playwright.

## 9. Lo que cambió el 2026-09-25: las tiendas de sus clientes

Al revisar «Vendiq tiene nueva UI» medí las tres capas: la web pública **no cambió** (0,5 de diferencia
visual), el panel **casi tampoco** (0,2 a 5,8, solo detalles en pedidos y envíos), y sí cambiaron las
**tiendas de sus clientes**: Aurore 48,2 · Daesur Motors 31,1 · Clefast 24,1 (ANJ y Sportt, idénticas).
Coincide con los commits de esa semana en `SAAS/Vendiq` (hero con diapositivas de Aurore, catálogo,
decants, refrigerantes de Daesur). Se recapturaron las cinco tiendas y se rehízo `bv-clientes` (+ `-movil`).
El resto de la ficha queda igual.

## 10. La ficha al molde de producto (Pixelmatters), como Rematch (2026-10-06)

Alexander: *«rematch, lumio, vendiq y bookit son productos propios… vendiq tiene algunos buenos
diseños pero puedes mejorarlo… me gusta mucho que hagas animaciones de la web»*, y durante la
tanda: *«para bookit y vendiq y lumio no tenemos manual de marca así que no exageres con la
sección de branding»* · *«haz un intermedio [de carruseles]… que respire todo entre sí»*.

- **Molde:** `CaseProducto` sobre el grafito `#0B0D12`. Hero: la escena de la laptop y el
  celular (`bv-landing-v2`; en el celular, `vq-escena-cuadrada`, recorte 1:1 de la misma).
  El flujo de la portada NO va de hero: repetiría el vídeo del flujo.
- **Tres animaciones reales de vendiq.pe** (`grabar-micro.cjs` + `video-micro.py`, taller en
  `capturas-saas/vendiq/pixelmatters-2026-10/`):
  - `vq-flujo`: la ENTRADA del flujo de la portada. Ya terminó cuando se aísla el componente →
    opción nueva `reiniciar` (cancela y vuelve a reproducir todas sus animaciones CSS). El
    screencast deja de mandar cuadros cuando nada cambia → opción `--sostener 4.2` (alarga el
    último) y `--poster-fin` (póster = estado final).
  - `vq-como`: «Cómo funciona», 4 pasos × 5 s; bucle de 20 s exactos (0,3 → 20,3).
  - `vq-asistente`: el asistente con IA, ciclo de 14 s; bucle tomado desde el estado completo
    (8 → 22 s) para que el póster sea la vista previa lista. Caja escrita a mano: un hijo
    invisible ensanchaba la caja medida a 2.669 px.
- **Módulos:** las 7 tarjetas del carrusel de vendiq.pe, cada una aislada a 3x
  (`capturar-vendiq-pm.cjs modulos`), en la ÚNICA tira de la ficha, con el plan en el pie
  (tienda y 0 % en todos; POS, SUNAT, envíos e IA desde Business; varios almacenes en Pro).
- **Marca, corta:** texto + par tipografía/paleta (`bv-tipografia`, `bv-paleta`, las que
  Alexander marcó como buenas). Sin anatomías ni callouts.
- **Sin cita:** no hay testimonio de un comercio; el molde ahora la acepta opcional.
- **Fuera** (borradas, quedan en git): `bv-mosaico`, `bv-modulos` (la tira las sustituye),
  `bv-funciones` (lo cuenta el vídeo), `bv-moviles`, `bv-planes`, `bv-landing-v2-movil` y las
  portadas viejas sin uso (`vendiq-portada-{v2,mostrador,marca-v1-chillon}`).
- Medido: 0 desborde a 1440/390/360, 0 imágenes rotas, 3 vídeos; «0 %» pasó a «0%» porque en
  la columna de cifras del celular (88 px) se partía en dos líneas.

## 11. Las tiendas, con prioridad y en mockups (2026-10-06, noche)

Alexander: *«me gusta vendiq pero siento que le falta unos mockdata y tal vez dar un poco más de
prioridad a sus tiendas creadas, añade happyart.com.pe»*. Aclarado con él: «mockdata» = mockups
de las tiendas; **Happy Art entra «como las demás»** aunque happyart.com.pe sigue en WordPress
7.1.3 + Elementor + WooCommerce (medido ese día; vendiq.pe también la muestra como caso).

- **Captura en vivo** (`scripts/capturar-tiendas-vendiq.cjs`): escritorio 1600×900 a 1,5x
  (= la pantalla de 2400×1350 del monitor) y celular 390×794 a 3x (= la pantalla del
  movil-v-820 menos la barra de estado). Fuera cookies, popups y flotantes; la cabecera se
  queda. El WhatsApp de Happy Art vive en un contenedor fijo de tamaño 0: se mide la unión
  de lo que pinta.
- **Mockups** (`scripts/mockups-tiendas-vendiq.py`): monitor grafito SIN pie + celular,
  construidos, sobre el grafito con la rejilla de Vendiq y una luz del color dominante de cada
  tienda (histograma de tono de su portada). Barra de estado dibujada con el color de la franja
  de arriba de la tienda; la isla la pone el marco.
- **En la ficha:** capítulo «Tiendas que ya venden con Vendiq» justo después de «Vendes una
  vez», con dos tríos y un pie por tienda (nombre · rubro · dominio, los rubros de vendiq.pe).
  Sustituye a `bv-clientes` (borrada). Resultado: 6 tiendas.
- Ojo: la portada de Happy Art anuncia el «21 de Marzo, Día de las Flores Amarillas» (promoción
  vieja de su propia web) y así sale en el mockup.
- **Clefast, segunda diapositiva** (Alexander: *«en clefast usa caps de la imagen, o sea el segundo
  slide, no del video»*): su portada abre con un vídeo; la captura salta a «Ir a la diapositiva 2»
  y pulsa «Pausar» antes de la foto. La luz del mockup se fija en su verde (`LUZ_FIJA`): con esa
  diapositiva el tono más pintado era la piel de la foto. Nombre nuevo, `vq-tienda-clefast-v2.jpg`.

## 12. Cuatro propuestas para el gráfico derecho del HERO DE VENDIQ.PE (2026-10-06)

> ⚠️ Primero las hice como portadas del portafolio de Axium (4:3 y 16:10) y Alexander aclaró:
> *«me refería portadas hero section de vendiq en sí, no del portafolio de axium. vendiq está en
> SAAS para que lo puedas levantar»*. La página de comparación se borró; las propuestas viven en
> el repo de Vendiq, rama `propuesta/hero-graficos` (worktree `SAAS/Vendiq-hero-propuestas`,
> commit `2387f369`, SIN push), y se ven con `/?hero=a|b|c|d` en el dev server local (puerto
> 3601; el 3000 lo usa otro proyecto). Código: `src/components/landing/portada/GraficosHero.tsx`.
> Lo de abajo (gestos y piezas) sigue valiendo: es el mismo análisis, aplicado al hero.

Alexander: *«la portada de vendiq me gusta su estilo, pero quiero probar otras portadas,
específicamente el gráfico derecho… unas 4. revisa referencias y también referencias de los
portafolios de las referencias»*. Se mantiene grafito + rejilla + logo arriba a la izquierda;
cambia el gráfico. Índices revisados: pixelmatters.com/work (lista con miniaturas de foto),
significa.co/projects y paisanos.io/projects (`referencias/capturas/indices-2026-10/`).

| | Gesto | De dónde | Piezas reales |
|---|---|---|---|
| A | Un solo componente | Paisanos · Pedidos Ya, Brubank | los 4 avisos de «Cómo funciona» (#1482) + conector punteado cian |
| B | La V hecha luz | Paisanos · MODO; DESIGN.md § 2 de vendiq.pe | `vendiq-v-brillo.svg` + teléfono del flujo + aviso de venta |
| C | Bento de módulos | Significa · Bion, Vertbase | interfaz dibujada de 6 tarjetas de módulo, en isométrico |
| D | Las tiendas | Paisanos · Claro Pay; Significa · Passaporte | 6 celulares construidos con las tiendas, en abanico |

Scripts: `piezas-portada-vendiq.cjs` (avisos y pantallas del flujo con alfa: se ocultan los no
ancestros, los ancestros pierden fondo, `omitBackground`) y `portada-vendiq-propuestas.py` (HTML
por propuesta que se adapta al formato; sale en 4:3 y 16:10). La comparación temporal en AXIUM-WEB ya se borró.
Errores de la primera pasada: el conector de A dibujado con `skewX` no pasaba por los puntos
(se rehízo en SVG por los centros), el aviso de B tapaba el precio, el bento de C y el abanico
de D se salían por la derecha (se midió el ancho girado: ~108u y ~96u).

## 13. Lo que se publicó en vendiq.pe (2026-10-06)

De las propuestas salió la portada completa con personas reales (E2 refinada, guiada por
shopify.com/pe) y Alexander la mandó publicar: *«dale otro enfoque, no me gusta lo de
motocicletas… que se vea mucho más realista, mejora el prompt… elimina esas letras verticales…
publícalo, trayendo los últimos cambios de vendiq, pero el portafolio aún no lo cambies»*.

- **Publicado:** commit `65c22d45` (y luego el cambio a Pulso) directo en `main` de `AlexanderAxium/Vendiq` (un solo commit sobre
  `origin/main`; Dokploy de VPS3 despliega solo con el push). Detalle en el `DESIGN.md` de Vendiq,
  § 16. La rama se rehízo desde `origin/main` porque el `main` LOCAL de `SAAS/Vendiq` tenía 3
  commits ajenos sin publicar (hover del builder y dos de Clefast) que no debían colarse.
- **La tienda de ejemplo ya no es Repuestos Lima:** es **Pulso**, running y ropa deportiva (la
  alpaca de Killa Tejidos duró unas horas: «no lo peruanices, mejor algo relacionado al deporte pero
  sutilmente»). Cualquier pieza de Vendiq que muestre el pedido #1482 tiene que usarla: zapatillas
  S/ 349 + envío S/ 10 = S/ 359.
- **Módulos:** la fila no pasa de los rieles. Salía hasta el borde de la pantalla: «no me convence
  que se vaya hacia los extremos, capaz otro efecto puede caer mejor», y luego «sigo viendo que
  ocupa el ancho completo». Luego, encerrada sin asomo: «no es intuitivo que hay scroll horizontal,
  usa cards más cortos como antes pero que no se salgan fuera del contenedor, un efecto degradado
  tal vez sirva». Quedó un carrusel de tarjetas angostas con la siguiente asomando dentro de la
  caja y desvanecida con una máscara, y solo las flechas debajo («borra el slider, solo deja el arrow»). Los productos van como
  miniaturas dentro de la interfaz. Al recapturar para la ficha, aislar cada tarjeta del DOM.
- **Imágenes:** `hero-pulso/` (prompts y PNG originales); las tandas de motos (`hero/`) y de alpaca
  (`hero-alpaca/`) quedaron descartadas. La lección de realismo está en creator `IMAGENES.md`.
- **El portafolio de Axium se puso al día el 2026-10-07** (§ 14), cuando Alexander dio la señal.

## 14. El portafolio, al día con la portada de Pulso (2026-10-07)

Alexander, con vendiq.pe ya publicado: *«por el momento está bien, pushea y actualiza el
portafolio»*. Todo lo que mostraba la web anterior (la tienda de motos: guantes, casco, kit de
cadena) se rehízo desde vendiq.pe EN VIVO; taller en `capturas-saas/vendiq/pulso-2026-10/`.

| Pieza | Antes | Ahora | Cómo |
|---|---|---|---|
| Hero de la ficha | `bv-landing-v2` + `vq-escena-cuadrada` | `bv-landing-v3` + `vq-escena-cuadrada-v2` | `capturar-vendiq-pm.cjs portada` (primera pantalla con movimiento reducido: la escena pinta su estado final) → `componer_pantalla.py` sobre `escenas/vendiq-mostrador-dispositivos.png`, la laptop con `--caja 0,0,1250,1520` y el celular con `--bordes --caja 1250,0,2688,1520` y la barra de estado de `pantalla-celular.html`; derrame verde fuera; cuadrada = recorte (150,0,1507,1357) |
| La idea en una animación | `vq-flujo` (el flujo dibujado) | `vq-escena` (16:10) | `grabar-micro.cjs` con `reiniciar`, zoom 3, `margen: 90` y ventana 2700×2600; caja = unión del anillo exterior y el contenedor; 0,60 → 11,2 s, póster al final (la venta del #1482 a la vista) |
| «Cómo funciona» | `vq-como` | `vq-como-v2` | `subir: 2`: el texto vive en la capa `absolute inset-0` de las tarjetas, que al fijarla medía todo el alto y dejaba fuera la foto del empaque; bucle 4,65 → 24,73 s (pasos de 5,03 s) |
| Asistente | `vq-asistente` | `vq-asistente-v2` | caja = la propia (un hijo invisible infla la unión a 2.609 px); 8 → 22 s, con la vista previa completa en las dos puntas |
| Módulos | `vq-modulo-N` (336×448) | `vq-modulo-N-v2` (336×480) | las tarjetas son los hijos de la primera lista de la sección, sin la máscara del carrusel y sin la cabecera fija, que tapaba el borde de arriba |
| Portada de la tarjeta (y «siguiente» de Bookit, Aurore y ANJ) | `vendiq-portada-marca` | `vendiq-portada-pulso` (3072×2048) | `portada-marca-vendiq.cjs`: el mismo arreglo con piezas reales a 5x y transparencia (logotipo de la cabecera con el texto en tinta, caja, factura, stock) |
| Highlight del home | `vendiq-v5` (imagen) | `vq-escena.mp4`, póster de `cover` | como el de Rematch |

- **Se conservan** `bv-hero` (el dueño empacando: otra persona, no la de vendiq.pe), las tiendas de
  los clientes, la marca y el panel.
- **La misma persona sale dos veces en la ficha**, chica en la laptop del hero y grande en el vídeo,
  como pasaba con el flujo de la portada anterior. Si Alexander lo marca, el vídeo de la idea puede
  pasar a otra animación.
- Medido: ficha a 1440/390/360 sin desborde ni imágenes rotas y los tres vídeos con
  `readyState` 4; el home sirve `vq-escena.mp4` y el portafolio `vendiq-portada-pulso.jpg`.
- Las piezas viejas se borraron (las rastreadas siguen en git; las otras tienen su original en
  `pixelmatters-2026-10/`).
