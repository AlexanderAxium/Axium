# brandvm · First Horizon Bank (FHN Financial) — «Institutional financial services website»

<https://www.brandvm.com/case-studies/institutional-financial-services-website>

- **Analizada:** 2026-10-01 (recaptura; la versión del 2026-09-12 medía 11.177 px)
- **Cómo llegó:** Alexander pasó este enlace y el de `industrial-manufacturing-website`
  con la pregunta *«porque aun no podemos hacer portafolios como esos? que nos falta»*
- **Capturas:** `capturas/brandvm-financial/` — `caso-…-d00..d12.jpg` (tramos de 900 px a
  1440), `-m00..m10.jpg` (390), `-full.jpg`, `caso-….json` (esqueleto + `extraer.js`).
  Las 10 losas a resolución original se descargaron y se miraron una a una
- **Arquetipo de índice:** no recapturado — ver `brandvm.md § 2`
- **Tratamiento de imagen:** **una sola ranura, 4000×2000, servida a 1354×677**, con la
  esquina redondeada y las calles internas **horneadas como transparencia** en el PNG
- **Piezas del caso:** 1 hero + **9 losas** = 12 paneles visibles (3 losas van partidas)

## Veredicto de Alexander
> «https://www.brandvm.com/case-studies/institutional-financial-services-website ·
> https://www.brandvm.com/case-studies/industrial-manufacturing-website — porque aun no
> podemos hacer portafolios como esos? que nos falta. retroalimentate»

**Lectura:** no es un «me gusta», es una pregunta de brecha. Y la brecha medida **no es de
cantidad de piezas** (9 losas contra nuestras 7 en Aurore): es de **reparto vertical**. El
73 % del cuerpo de esta ficha es imagen; en Aurore y Feniz es el 50 %. Ver el análisis
completo en el informe de brecha; acá queda lo observado.

---

## 1. Promesa y audiencia
Sin cambios sobre `brandvm.md § 1`. Lo nuevo: el hero declara **`INDUSTRY(S): B2B`** y
**`PLATFORM(S): Custom Development`**, y los `DELIVERABLES` incluyen **Branding** — pero
First Horizon es un banco nacional estadounidense con identidad propia anterior al
encargo. Lo que las losas llaman «branding» son **aplicaciones del logotipo del cliente
sobre maquetas genéricas**, no una identidad creada. Dato de primera clase para Axium: la
palabra *Branding* en la meta no obliga a que la marca sea tuya.

## 2. Arquitectura del índice
No recapturado. Ver `brandvm.md § 2`.

## 3. Ritmo y curaduría
Medido a 1440. El caso **empieza en y=883** (fin del hero) y **termina en y=9231**
(tarjeta «UP NEXT»): **cuerpo de 8.348 px**.

| | valor |
|---|---|
| Alto total de la página | **11.237 px** (móvil: 8.691 px) |
| Hero | y 86 → 883 (797 px de alto, tarjeta de 1406 px con gutter de 17) |
| Losas de contenido | **9**, todas 2:1 |
| Píxeles de imagen en el cuerpo | **6.093 px = 73 % del cuerpo** |
| Paso entre losas | **719 px** (677 de losa + **42 de calle**) |
| Mayor tramo sin imagen | **630 px** (y 3042→3672: Challenges + Approach) |
| Tira de imagen seguida más larga | **4.268 px · 6 losas** (y 4699 → 8967) |
| Palabras en el cuerpo | **309** en el esqueleto · **349** contando el pie |
| Palabras *visibles* sin desplegar nada | **≈155** |

**El 60 % final del caso no tiene una sola palabra.** Desde el último párrafo (Outcomes,
y≈4669) hasta «UP NEXT» (y=9231) hay 4.562 px de imagen muda.

## 4. Anatomía de la tarjeta
No recapturado. Ver `brandvm.md § 4`.

## 5. Tratamiento de imagen

### El inventario, losa por losa
*(numeración `ImageN` tal cual la sirve el CDN; «partida» = la losa trae dos mitades
separadas por una calle transparente de 44 px sobre 4000, ≈15 px servidos)*

| # | Qué hay dentro | Paneles | ¿UI real? | De dónde sale el material |
|---|---|---|---|---|
| **1** (hero) | Torre corporativa de First Horizon al atardecer, rotulación en lo alto. Se sirve con velo oscuro, migas, nombre y meta encima | 1 | no | fotografía del cliente / archivo |
| **2** | **Rejilla 2×2 a sangre**: el logotipo sobre rojo, azul marino, crema y hueso. Sin calle entre cuadrantes | 4 celdas | no | logotipo preexistente del banco |
| **3** | **Mosaico inclinado ≈−12°** de ~20 pantallas del sitio sobre gris claro, sangrando por los cuatro bordes. **Una de las tarjetas lleva «Lorem ipsum Dolor»** | 1 | sí, ilegible | capturas reales |
| **4** | **Partida 50/50.** Izq: iPhone en giro sobre degradado azul y cuña de fieltro, con el sitio móvil. Der: campo marino con espécimen **«Abc» en contorno con nodos vectoriales**, ficha «Graphik Regular/Medium/Bold» y **tres deslizadores rotulados Readability · Weight · Professional** | 2 | sí (izq) | maqueta + **diagrama inventado** (los deslizadores no miden nada) |
| **5** | Rótulo luminoso rojo sobre pared de listones de madera | 1 | no | maqueta PSD de objeto inteligente |
| **6** | Portátil sobre sofá de pana azul + **cuatro tarjetas de la UI extraídas y flotando a escala legible** sobre el campo | 1 | **sí, legible** | maqueta + componentes reales |
| **7** | **Partida 44/56.** Izq: tótem de señalética sobre hormigón. Der: foto de archivo de tres ejecutivos caminando + tarjeta celeste **«$2.4B Average Daily Inventory / $4.2B Average Daily Trading Volume»** | 2 | no | maqueta + stock + cifras reales del cliente |
| **8** | Mapamundi de puntos azules con chinchetas rojas sobre hueso. **49 KB a 4000×2000** — la losa más plana del caso | 1 | no | gráfico vectorial |
| **9** | Macro de sudadera blanca con el símbolo impreso, sobre rojo, `www.firsthorizon.com` en la manga | 1 | no | maqueta PSD de merch |
| **10** | **Partida 50/50.** Izq: valla «BANKING BUILT FOR BIG PLANS». Der: iPhone sobre pana azul con «News & Insights» | 2 | sí (der) | maqueta + **campaña real del cliente** |

**Reparto:** de los 12 paneles, **4 enseñan la web** (3, 4-izq, 6, 10-der), **5 son maquetas
de marca** (5, 7-izq, 9, 10-izq, y el 2), **3 son stock, gráfico o dato** (7-der, 8, 1).

- **Qué se muestra:** nunca una captura suelta. Siempre o composición o maqueta.
- **Soporte:** iPhone (×3), portátil (×1), rótulo, tótem, valla, prenda. Sin soporte en
  2, 3, 6-tarjetas, 8.
- **Escenografía:** mitad fondo plano, mitad escena real (madera, hormigón, calle).
- **Fondo:** rojo o marino de marca, hueso, gris claro, y **pana azul tres veces**.
- **Luz:** suave y difusa en las maquetas; dura y direccional en la sudadera; dorada de
  atardecer en el hero. **No hay un unificador de luz.**
- **Óptica:** frontal o tres cuartos; sin profundidad de campo salvo en la sudadera.
- **Color:** policroma dentro de la paleta del banco (rojo, marino, celeste, crema).
- **Consistencia — qué las unifica:** **el contenedor y nada más.** 4000×2000 exactos,
  esquina de 49 px sobre 4000 (≈17 px servidos) y calle de 42 px. No las unifica ni la
  luz, ni el fondo, ni el ángulo, ni el tipo de pieza.
- **Ratio y recorte:** 2.00 en las 9 losas. El hero también es 4000×2000 y se recorta por
  `object-fit: cover` a **1406×797 (1.76) en escritorio y a 361×739 (0.49) en móvil** —
  un solo archivo, dos encuadres radicalmente distintos.
- **Recetas observadas:** R6 (mosaico inclinado, losa 3) · R15 (branding aplicado, losas
  5, 9, 10-izq) · R22 (hoja de sistema, losa 4-der) · R2 sin marca fantasma (losa 2).
  **Ninguna necesita IA**: son maquetas de objeto inteligente + capturas.
  **Dos recetas nuevas, candidatas para `IMAGENES.md`:**
  - **R28 · Losa partida** — dos medias piezas dentro de un único archivo 2:1, separadas
    por una calle **transparente** de 44/4000 y con las cuatro esquinas redondeadas
    también en transparencia. La página solo sabe colocar 2:1; el par vive en el archivo.
  - **R29 · Dispositivo con componentes extraídos** — maqueta con la captura dentro +
    3-4 tarjetas reales de esa misma pantalla, recortadas y flotando sobre el campo **a
    tamaño legible**. Resuelve el problema de que a 677 px de alto no se lee una página.
- **Entregables que muestra y cómo trata lo no-pantalla:** rotulación de edificio, rótulo
  interior, tótem, valla, merch, papelería implícita, mapa. Lo no-pantalla es **el 60 %
  del caso de una web**, y se resuelve siempre igual: maqueta genérica + logotipo del
  cliente.

## 6. Filtro y navegación
No recapturado. Ver `brandvm.md § 6`.

## 7. Tipografía
Inter Variable (34 · 15,4 · 13,7 · 12 px, pesos 400/500/700) + Instrument Serif itálica
(62 px el nombre del cliente en el hero, 69 px los títulos de sección). **Novedad medible
sobre `brandvm.md`:** el `<h1>` real de la página **no es el nombre del cliente** sino la
línea de transformación, compuesta a **15,4 px**; el nombre grande no es encabezado.

## 8. Color y fondo
Lienzo `#FFFFFF`. Tarjeta oscura del hero y del contacto en `#0D172A`. Acento rojo
`#CB351A`. Gris de carga `#F5F7FA`. Velo del hero `rgba(13,23,42,.24)` sobre la foto.

## 9. Movimiento
`extraer.js`: GSAP + SplitText (Webflow), **0 elementos con `opacity:0`** al capturar, 0
vídeos, 0 canvas, sin cursor propio. El resto, `no observable` en captura estática.

## 10. Prueba y credibilidad
Cuatro viñetas de resultado **con cifra**: «Navigation efficiency up +42 %», «Accessibility
compliance achieved WCAG AA across all pages», «Page load time reduced to 1.8 s mobile
(p75 LCP)», «Average session duration up +27 %». **Tres de las cuatro no citan fuente**
(el caso industrial sí la cita). En el hero, «Live Website ↗» apunta a `fhnfinancial.com`.
**Cero pies de foto en todo el caso.**

## 11. Ficha del caso y transición
Hero (tarjeta oscura 1406×797, migas · nombre en serif itálica · línea de transformación ·
«See the Result» rojo + «Live Website ↗» con borde · meta en 4 columnas TIMELINE 18 Weeks /
DELIVERABLES / INDUSTRY(S) / PLATFORM(S)) → frase de 26 palabras a 34 px centrada →
contexto de 17 palabras → píldora «Discover Live Website ↗» → losa 2 → **«Project
*Highlights*»** (9 viñetas **recortadas a ~2 con degradado + «Learn More ↗»**) → losa 3 →
**«*Challenges*»** (49 palabras, **recortadas a 3 líneas**) → **«*Approach*»** (58
palabras, igual) → losa 4 → **«*Outcomes*»** (20 palabras + 4 viñetas con cifra) → losas
5 a 10 seguidas → «UP NEXT · *Next Project*» (tarjeta 643×321) → «Want to discuss a
project?» → tarjeta oscura de contacto.

- **Medida del texto: 617 px de 1440 (43 %).** La mitad derecha queda vacía a propósito.
  ⚠️ **Contradice `brandvm-ordering.md`**, que midió 390 px / 27 % el 2026-09-29.
- **El mecanismo de brevedad es el recorte, no la escritura corta.** El párrafo de
  *Approach* tiene 58 palabras en el DOM y **enseña 3 líneas (~28)**. Comparar «45 nuestro
  contra 58 suyo» es comparar mal: lo que se ve son 28.
- **Móvil (390):** 8.691 px. El hero pasa a tarjeta vertical de 361×739 con la meta en
  2×2. **Las losas NO se reordenan: siguen siendo 361×181 (2:1).** Una losa con UI dentro
  queda con tipografía de 4-6 px — ilegible y asumido. Las losas partidas se leen como dos
  cuadrados de ~173×181.

## 11b. Estilo (fila para ESTILO.md)
- **Paleta:** lienzo `#FFFFFF` · texto `#000000` · tarjeta `#0D172A` · acento `#CB351A` ·
  gris `#F5F7FA`.
- **Tipografía:** Instrument Serif itálica 400 (62 / 69 px) / Inter Variable 400-500-700
  (34 · 15,4 · 13,7 · 12). Gesto: **una sola palabra del título en serif itálica roja**.
- **Hero:** tarjeta oscura radio ~24, 1406×797 con gutter de 17; foto del cliente con velo;
  nombre en serif itálica 62 px blanco; transformación en 2 líneas a 15,4; **dos acciones**
  («See the Result» rojo + «Live Website ↗» con borde); meta en 4 columnas.
- **CTA:** «Start a Project» · `#CB351A` · píldora completa · ~14×24.
- **Movimiento:** `opacity:0` = 0 · GSAP + SplitText (Webflow) · 0 vídeos.

## 12. Firma y transferencia
- **La firma en una frase:** **una sola ranura 2:1 repetida nueve veces, y toda la
  variedad metida dentro del archivo** — la calle, el radio y la partición en dos mitades
  viajan como transparencia en el PNG, así que la página no tiene más que un bloque.
- **Qué robar (y de qué capa):**
  - *Imagen* — **R28, la losa partida.** Resuelve la tensión del §4 de `ESTANDAR-FICHA.md`
    sin tocar el ritmo: se alterna `wide` y `pair` **dentro** del mismo contenedor.
  - *Imagen* — **R29, componentes extraídos a escala legible** (losa 6). Es la respuesta
    correcta a «mostrarlo todo es no mostrar nada»: la pantalla entera como textura y
    cuatro tarjetas reales a tamaño que se lee.
  - *Arquitectura* — **el bloque de cierre sin texto.** Después de «Outcomes» no vuelve a
    haber una palabra. Nosotros intercalamos texto hasta el final por regla (§3), y eso
    nos cuesta la mitad del área.
  - *Texto* — **el recorte a 3 líneas con degradado + «Learn More».** Ya tenemos
    `Plegable`; lo que no aplicamos es plegar **todo** párrafo de sección.
- **Qué NO sirve para Axium y por qué:**
  - **Las maquetas de objeto inteligente con el logotipo encima.** Cinco de doce paneles
    son sudadera, rótulo, tótem y valla que **el banco no encargó a brandvm**. Para Axium
    eso es fabricar entregables: prohibido por `ESTANDAR-FICHA.md § 9`.
  - **La pana azul tres veces** (losas 4-izq, 6, 10-der) y **dos iPhone sobre el mismo
    fieltro**: es exactamente el «recurso por defecto» que Alexander rechazó en VitalChain.
    Su coherencia se paga con repetición de sujeto.
  - **Cero pies de foto.** Nuestro pie con la URL real es lo que hace verificable la ficha;
    es ventaja nuestra, no carencia.
  - **El lorem ipsum dentro de la losa 3** y los **tres deslizadores inventados** de la
    losa 4: dos piezas que no resisten una mirada de cerca. No es un estándar a imitar.
  - **Las losas sin versión móvil.** Nosotros servimos `-movil` recortado para cada pieza;
    ellos sirven la misma 2:1 a 181 px de alto.

## Aplicabilidad a Axium
- ¿Escala a 33 proyectos? **Sí** — una sola ranura escala mejor que dos.
- ¿Depende de assets que no tenemos? **Sí, en 5 de 12 paneles**: fotografía corporativa,
  campaña publicitaria real y maquetas de objeto con la marca del cliente. **Pero los 4
  paneles de UI y el mosaico no dependen de nada que no tengamos.**
- ¿Se apoya en marcas reconocibles? **Sí** — «First Horizon Bank» pesa solo.
- **Capa transferible:** imagen (R28, R29) y arquitectura del cuerpo (la tira final sin
  texto + el plegado de todos los párrafos). **No** la producción de material de marca.
