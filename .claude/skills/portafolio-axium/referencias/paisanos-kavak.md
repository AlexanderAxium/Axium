# Paisanos · Kavak (sistema de diseño) — https://www.paisanos.io/projects/kavak-design-system-case-study

- **Analizada:** 2026-10-06
- **Cómo llegó:** Alexander, a mitad de la tanda de Rematch: *«muy buena referencia tbm»*.
- **Capturas:** `capturas/paisanos/caso-kavak-full.jpg` · `medidas-kavak.json`. Ficha de 19 749 px.
- **Qué es:** el sistema de diseño de Kavak (autos, LATAM) — no una web ni una app: el encargo
  es la **infraestructura de diseño**. Paisanos es el estudio latinoamericano de la cola
  (`COLA.md`, tanda «empresas parecidas a Axium»).

## Veredicto de Alexander
> «muy buena referencia tbm»

## Anatomía
- **Lienzo negro.** A la izquierda, un **panel fijo** (sticky) con la ficha técnica — Client,
  Year, Country, Industry, Service, Link — y tres acordeones «Description / The challenge / The
  impact» con «Show», más «Stack and tools used in the project» (Figma, Notion). Es la señal S23
  (adelt, «panel fijo + columna») en un estudio de producto.
- **A la derecha, una columna de piezas** de 982 px (radio 16) con pares cuadrados de 483; el
  texto, en bloques de 441 px de **66–92 palabras**, cada uno con «Go to case details to know
  more» (el detalle largo vive en otra página).
- **22 piezas, y casi todas son ARTEFACTOS del sistema**, no pantallas:
  - la portada: el logotipo en blanco sobre el azul de la marca con un trazado de líneas;
  - **la paleta como hoja de tokens**: Primary / Feedback / Grayscale, cada escala con su nombre;
  - **el espécimen tipográfico**: «Aa» gigante + Title Large / Title Small / Body Large, cada uno
    con *Size 32px · Line-height 40px · Weight Bold · Spacing −1%*;
  - **la rejilla de iconos** (16 iconos de línea) y una de logotipos de marcas de autos;
  - **la anatomía de un componente**: la tarjeta de un auto con **callouts numerados** y la lista
    de sus partes con «Required» / «On-Off»;
  - estados de componentes sueltos (pestañas, etiquetas «En servicio / En venta»), barra de
    progreso, mapa, navegación inferior;
  - **el vocabulario del producto como tipografía**: «Hatchback / Minivan / Pickup / Camioneta /
    Sedan / Suv / Wagon» en una columna gigante, recortada;
  - **la gobernanza**: un diagrama «Processes / Assets / Documentation» y la lámina «Educate ·
    Evolve · Engage» — cómo se adopta el sistema, no solo cómo se ve;
  - la documentación de buenas prácticas en rejilla;
  - y fotos de manos con el celular (una sobre el volante): el producto en uso.

## 12. Firma y transferencia
- **La firma:** *el sistema de diseño contado como sistema —tokens con nombre, escala tipográfica
  con sus medidas, anatomía de componente con callouts, gobernanza— al lado de un panel fijo con
  la ficha técnica.*
- **Qué robar:**
  - **Las láminas de sistema con especificación** (tamaño, interlineado, peso, tracking; tokens
    por nombre): dicen «oficio» mejor que cualquier frase. Axium tiene esos tokens en los repos.
  - **La anatomía con callouts numerados** de un componente propio (en Rematch: la tarjeta de un
    torneo, una reserva de la agenda).
  - **El vocabulario del producto como tipografía gigante** (en Rematch: Pádel / Tenis de mesa /
    Fútbol / Vóley / Básquet; o los 8 formatos de torneo).
  - El panel fijo con la ficha técnica (S23), si la ficha es larga.
- **Qué no sirve:** el «Go to case details» (no tenemos página de detalle aparte).
- ⚠️ **Corrección de Alexander (2026-10-06):** los callouts y las láminas de sistema de Kavak
  funcionan porque **documentan un sistema que existe**. Copiar su forma sin ese documento es
  inventar: la anatomía 01–03 del ícono de Rematch no decía nada. Solo se roban si la marca
  tiene manual (Rematch: sí, y manda el manual) o si cada número nombra algo definido en el
  código; Vendiq, Bookit y LumioLearn no tienen manual → logo, paleta y tipografía, nada más.

## Aplicabilidad a Axium
- Directa para los cuatro SaaS propios: los tokens, las tipografías y los componentes están en
  los repos (`globals.css`, `docs/DESIGN_SYSTEM.md`, `components/iconos`). Se renderizan con
  Playwright en HTML: **cero generación**.
- **Capa transferible:** contenido de las piezas (láminas de sistema) + panel fijo.
