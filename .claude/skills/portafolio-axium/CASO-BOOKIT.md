# Caso Bookit — ficha dentro de Axium (SaaS propio, marca nueva)

> Encargo, 2026-09-13. Alexander: *"sigue con bookit, hice un rediseño y cambió todo
> completamente"*. Plantilla brandvm (`src/components/axium/case-story/`), igual que
> Rematch y LumioLearn. Ficha en `src/app/(public)/casos-de-exito/bookit/`.

## 1. Qué es y dónde está el rediseño

- **Bookit**: plataforma multi-tenant de citas (web del negocio + reservas online +
  agenda del equipo + cobros + fichas de clientes) para salud, belleza, bienestar,
  fitness, profesionales y creativos. Base de código compartida con LumioLearn,
  Vendiq y Rematch.
- **El rediseño** vive en `SAAS/Bookit-web-publica` (worktree, rama
  `feat/web-publica-rediseno`, commit *"rediseño de la web pública con la marca
  nueva"*) y **ya está en bookit.com.pe**. Documentación del propio rediseño:
  `docs/web-publica/DESIGN.md`, `HALLAZGOS.md`, `IMAGENES.md`.
- **Marca**: pino `#012B21`, pino-900 `#001A14`, brote `#01C85C` (nunca texto sobre
  claro), brote-hondo `#067A45`, menta `#E6F6EC`, niebla `#F5F8F6`. Satoshi + Instrument
  Serif itálica en las palabras de acento. Firma: el punto verde del «it» = reservado.
  Logos en `public/brand/bookit/*.svg` (rasterizados a `bookit/rediseno/logo-*.png`).
- **El panel conserva el azul y el ícono anteriores** → no sale en la ficha.
- **Base local**: los dos repos apuntan a `localhost:5436/bookit_prod` (copia con datos
  reales). No se usó para capturas ni se escribió nada en ella.

## 2. Lo que la ficha no promete (según `HALLAZGOS.md`)

Recordatorios automáticos (apagados en producción), Stripe/Culqi, Zoom/Zapier, marca
blanca «sin rastro», cifras de plataforma y testimonios. Lo que depende del plan se
dice con el plan (pago al reservar y notas clínicas desde Business, dominio propio y
API en Business Pro). La descripción del highlight del home se corrigió en el mismo
sentido (decía «recordatorios por WhatsApp» y «reduce las inasistencias»).

## 3. Material

> Alexander, 2026-09-13: *"bookit ya está desplegado, no tiene que tocarlo, solo entrar a
> su web y sacar las caps"*. Todo sale de bookit.com.pe en vivo. Verificado: los dos repos
> quedaron sin cambios míos y el logo de la web es el mismo archivo (md5 igual). La foto
> de recepción del hero venía de `material/generadas/` del repo (no está publicada: 404)
> y se reemplaza.

- `capturas-saas/bookit/rediseno/`: bookit.com.pe en vivo (inicio, /features, /prices,
  /solutions a 2x; inicio móvil a 3x; cookies descartadas), baldosas 16:10 para el
  mosaico (`tiles/`), recortes móviles (`m-recorrido`, `m-paga`, `m-clientes`).
- `capturas-saas/bookit/clientes/`: webs reales de clientes (moviflex.com.pe,
  blendet.bookit.com.pe, jarumi.bookit.com.pe, cappturafotografia.com), escritorio y
  móvil. Son las mismas que la web de Bookit muestra como clientes.
- Hero: `material/generadas/heroe-recepcion.png` del repo de Bookit (escena generada
  para su propia web, solo ambiente, sin cliente real).

## 4. Piezas (`public/images/proyects/bookit/`)

| Pieza | Qué es | Cómo |
|---|---|---|
| `bv-hero-v2.jpg` | Fisioterapeuta con polo pino en la recepción de su clínica, pared a la izquierda para el texto | **Higgsfield** (`escenas/bookit-hero-fisioterapeuta.png`, 16:9 high 2k, 3 créditos; después la cuenta mostraba 978 tras una recarga). Reemplaza a `bv-hero.jpg`, que venía de `material/generadas/` del repo |
| `bv-mosaico.jpg` | 30 baldosas de bookit.com.pe a −12° sobre niebla | Taller |
| `bv-tipografia.jpg` / `bv-paleta.jpg` | Satoshi + Instrument Serif; paleta medida del logo | Taller |
| `bv-landing.jpg` (+ `-movil`) | Laptop con el inicio y celular con el inicio móvil sobre el mostrador de una clínica clara | **Higgsfield nueva** (`escenas/bookit-recepcion-dispositivos.png`, 16:9 high 2k, 3 créditos: 6.5 → 3.5) + dos pantallas verdes compuestas |
| `bv-recorrido.jpg` / `bv-moviles.jpg` | "De tu web a tu agenda" en ventana; tres pantallas móviles (recorrido, pago, clientes) | Taller |
| `bv-clientes.jpg` (+ `-movil`) | Moviflex en escritorio + Blendet, Jarumi y Capptura en el celular | Taller |
| `bv-funciones.jpg` / `bv-planes.jpg` | Bento de funciones; precios | Taller |
| `bookit-portada-v2.jpg` | Portada del carrusel y del portafolio: laptop a tres cuartos sobre mármol verde oscuro, con planta y taza | **Higgsfield** (`escenas/bookit-portada-laptop-34.png`, 3:2 high 2k, 3 créditos) + inicio de bookit.com.pe. Reemplaza a la escena oscura de LumioLearn recoloreada. Alexander: *"haz un mockup distinto y que concuerden con el carrusel de proyectos"* |

`logos/bookit-v2.png` (logo blanco) reemplaza al de la marca anterior.

**Highlight del home (`highlights/bookit-v4.jpg`), sin mockup.** Alexander, 2026-09-13, al
ver juntas las portadas de LumioLearn y Bookit (dos laptops a tres cuartos): *"ambos están
buenos, pero son muy similares, incluso creo que no habría necesidad de poner mockups para
los highlights, sino otra forma creativa de mostrarlo. Pero sí el mockup para el
carrusel"*. Fondo de Higgsfield (`escenas/bookit-mundo-casillas.png`, 16:9 high 2k,
3 créditos): casillas de agenda pino, algunas encendidas en brote y una con el punto del
«it». Encima, recortes reales de bookit.com.pe (`capturas-saas/highlights/bookit-*.png`):
la dirección `tuconsultorio.bookit.com.pe`, la web del negocio («Fisioterapia y
nutrición» con sus servicios) y «Confirma y paga» con «Pago recibido». Se arma en
`brandvm-casos/highlights.html` y se renderiza con `scripts/render-highlights.cjs`.
La portada del carrusel sigue siendo la laptop sobre mármol: cada producto tiene su
dispositivo y su escena (Rematch celular sobre la pala, LumioLearn tableta en el escritorio).

## 5. Cableado en Axium

- `src/data/cases/bookit.json` + `bookit` en `src/locales/{es,en,pt}/cases.json` +
  import, base y `CASE_ORDER` (después de lumiolearn) en `src/lib/case-translations.ts`.
- Home: `highlights-section.tsx` → `caseHref: "/casos-de-exito/bookit"`, portada y logo
  nuevos; descripción corregida en `landing.json` (es/en/pt).
- Ciclo de "Siguiente": Rematch → LumioLearn → **Bookit** → Rematch.

## 6. Errores que mordieron (ver COMPOSITOR.md)

- Recolorear la escena **antes** de componer: el brillo pasado a verde se leyó como
  pantalla verde. Primero componer, después recolorear fuera de la pantalla.
- En la escena de dos dispositivos, el borde verdoso que queda alrededor de la laptop
  ya compuesta arrastró el cuadrilátero del celular. Neutralizar el verde del lado de
  la laptop antes de componer el segundo.
- El SVG del logo sin `width/height` se rasteriza cuadrado: dar alto explícito.

## 7. La ficha al molde de producto (2026-10-07)

Alexander: *«también actualiza el portafolio de bookit y lumio según tus nuevos diseños»*. La
ficha pasa de CaseStory (brandvm) a `CaseProducto`, como Rematch y Vendiq, sobre el pino oscuro
de los paneles de bookit.com.pe (`#001B14`). Taller: `capturas-saas/bookit/producto-2026-10/`.

- **bookit.com.pe casi no se mueve sola** (la entrada del hero dura un segundo y es JavaScript:
  `reiniciar` no la repite). Lo que se mueve es lo que hace el usuario, y eso se graba:
  - `bk-recorrido`: «De tu web a tu agenda» bajando paso a paso (`grabar-scroll.cjs`), con
    paradas en 0 · 660 · 1540 · 2370 · 3000 px (cada paso se activa en 0 · 350–1000 ·
    1200–1900 · 2050–2700 · 2850+). Con la página ampliada al doble, la columna fija medía
    dos pantallas (`100vh`) y se soltaba a mitad: el script fija los `sticky` a una pantalla.
    Recorte dentro del panel pino (sin la cabecera ni su filete). Es también el highlight
    del home.
  - `bk-rubros`: «Bookit habla como tu negocio», el ratón pasando por los seis rubros
    (`grabar-hover.cjs`), con la ventana a 1440×1040 para que «Creativos» no obligue a
    desplazar la página.
- **Funciones**: cuatro tarjetas aisladas con alfa (`aislar-piezas.cjs`): cobros, sedes,
  horarios y fichas, con el plan en el pie. **Fuera** las dos con foto: bookit.com.pe reusa el
  fotógrafo y la mesa redonda en los rubros, y en la ficha no se repite a nadie.
- **Clientes**: Moviflex, Blendet, Jarumi y Capptura en monitor + celular construidos sobre el
  pino (`capturar-tiendas-vendiq.cjs slug=url…` y `mockups-tiendas-vendiq.py` con `MOCK_*`).
- Se quedan `bv-hero-v2` (y su recorte `bk-heroe-movil`), `bv-landing`, `bv-tipografia` y
  `bv-paleta`; borradas las láminas del molde anterior (mosaico, recorrido, móviles, clientes,
  funciones, planes).
- «Siguiente»: Vendiq (la cadena Rematch → LumioLearn → Bookit → Vendiq → Rematch).

