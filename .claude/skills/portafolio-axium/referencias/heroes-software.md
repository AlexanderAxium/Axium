# Heroes de estudios de software — diez con diseño impecable (2026-10-11)

- **Cómo llegó:** Alexander: *«quiero cambiar el hero section inicial, ¿qué propones? dame 4
  propuestas, con imágenes generadas, usa OpenAI, busca referencias de páginas similares, dame una
  lista de 10 páginas a tu criterio que tengan un diseño impecable para desarrollo de software»*.
- **Capturas:** `capturas/heroes-software/<dominio>-{d,m}.jpg` (1440×900 y 390×844) y
  `medidas.json` (titular, tamaño, familia, peso, fondo, vídeos, canvas). Se capturaron 16; quedaron 10.

| # | Sitio | Hero | Titular medido | Qué se le roba |
|---|---|---|---|---|
| 1 | pixelmatters.com | negro, cinta 3D de luz, columna de logos de clientes, «New case study» abajo | 80 px, *platform* 300 | titular LIGERO y grande; el caso nuevo como tarjetita bajo el CTA |
| 2 | significa.co | claro, cinco verbos en negrita, tira de proyectos y bento de premios con celulares | 72 px, Significa Sans 700 | la prueba (proyectos, premios) dentro del primer pantallazo |
| 3 | monterail.com | crema, titular de tres líneas, dos CTA, logos «Trusted by» | 88 px, Söhne 500 | el más limpio para desarrollo: titular + sub con cifra + dos botones |
| 4 | netguru.com | morado oscuro, laptop real inclinada con una tienda de cliente, palabra en verde | 90 px, DM Sans 400 | el producto real en el aparato, a la derecha del titular |
| 5 | infinum.com | gris azulado, «AI-native, end-to-end» enorme, collage de celulares, nota 4,8 | 117 px, Neue Haas 700 | el tamaño como gesto; la nota de reseñas al lado del CTA |
| 6 | basement.studio | escena 3D navegable de su propio estudio | 87 px, Geist 600 | el estudio como lugar (lo que hace la propuesta 4 con Lima) |
| 7 | darkroom.engineering | negro y rojo, monoespaciada, «WHERE THINGS GET DEVELOPED» a 200 px | 200 px, therma | carácter de ingeniería; demasiado brutal para Axium |
| 8 | ramotion.com | claro, titular centrado, bento de UI de producto debajo | 92 px, Graphik 600 | titular centrado + piezas debajo que asoman bajo el pliegue |
| 9 | tonik.com | gris carbón, su marca hecha objeto de metal repujado | 96 px, Neue Montreal 400 | **la marca como objeto físico** (propuesta 1) |
| 10 | cuberto.com | blanco, titular centrado, bento de objetos 3D por servicio | 81 px, Suisse Intl 500 | un objeto por servicio debajo del titular (propuesta 3) |

Descartadas: clay.global (buena, pero de branding/UX), fueled.com (degradado genérico),
thoughtbot.com (recortes de personas), mirego.com (banner de cookies tapa el hero), 10up.com
(collage ruidoso), instrument.com (vídeo y tipografía gigante; agencia de marca).

## Lo que repiten (el suelo)
- Titular de 72–117 px, una sola idea, casi siempre sin adjetivos de relleno.
- Dos CTA: el de contacto relleno y «ver trabajo» con borde.
- Prueba en el primer pantallazo: logos de clientes, caso nuevo, premios o nota de reseñas.
- Si hay imagen, es la marca, el producto real o el estudio; nunca un cubo con `</>`.

## Las cuatro propuestas para axium.com.pe
En `/?hero=1..4` (código en `src/components/axium/hero-propuestas.tsx`, imágenes en
`public/images/hero-propuestas/`, taller en `capturas-clientes/axium-hero/2026-10/`, tablero en
`capturas-clientes/axium-hero/2026-10/tablero-propuestas.jpg`).
1. **Símbolo** (Pixelmatters + Tonik): el isotipo de Axium como objeto de aluminio azul con un filo
   teal, generado con el logo real como referencia (salió fiel: tres piezas y el triángulo).
2. **En producción** (Netguru + Oxide): laptop y celular en oscuro con el panel de reservas de
   Rematch y la web de Vendiq compuestos encima; rótulo «En pantalla: …».
3. **Tres oficios** (Cuberto + Significa): claro, titular centrado y tres bodegones (marca con los
   hex reales impresos, Bookit + LumioLearn, el chat de un agente) que enlazan a cada servicio.
4. **Equipo en Lima** (Pixelmatters «people who care» + Basement): el equipo frente a la Costa Verde
   al atardecer, con 45 / 4 / 3 (proyectos, productos propios, servicios).
Gasto: 6 imágenes, 13 875 tokens de salida (registrado en `scripts/gastos-openai.jsonl`).

## Segunda ronda (mismo día)
Alexander: *«descarta el 2 y 3, y dame 3 propuestas más»*. Fuera el producto en pantalla (2) y el
claro con bodegones (3); se quedan **la marca hecha objeto** (1) y **las personas y el lugar** (4).
Las tres nuevas exploran esos dos ejes:
5. **Monumento** (Tonik + Basement): el isotipo como escultura de aluminio en el Malecón de
   Miraflores al anochecer, con la Costa Verde detrás. En móvil, texto arriba sobre el cielo y la
   foto debajo (el azul del fondo es el del cielo del recorte, `#1654A4`).
6. **Símbolo hecho luz** (Paisanos · MODO + Pixelmatters): el isotipo proyectado por un haz sobre
   concreto encofrado; titular de dos tiempos («Ideas claras. / Software que funciona.») y los tres
   servicios como enlaces.
7. **Oficio** (Pixelmatters + thoughtbot + brandvm): manos bocetando Inicio → Reserva → Pago junto a
   una laptop, sin caras, en una tarjeta con radio al lado del texto.
Gasto de la ronda: 3 imágenes, 6 993 tokens. Activas: `/?hero=1|4|5|6|7`.

## Tercera ronda
Alexander: *«ninguno, pero deja el 5 por si acaso, prueba 3 más»*. Las siete anteriores compartían
recurso —una foto a sangre con el texto encima—, así que esta ronda cambia de lenguaje:
8. **La mezcla** (Paisanos · Brubank, Ualá): persona en recorte (PNG transparente de verdad),
   la cita de Bookit y la venta de Vendiq como tarjetas REALES flotando, el isotipo 3D y un
   degradado azul a teal. ⚠️ El isotipo pedido con `--fondo transparent` llegó en RGB con un
   **tablero de ajedrez pintado**: se recortó por saturación (el objeto es azul, el tablero gris).
9. **Cinta de luz** (Pixelmatters): cinta de vidrio esmerilado sobre negro, titular ligero y la
   columna de productos y clientes a la derecha (como su columna de logos).
10. **Titular gigante y una fila de proyectos** (Infinum + Darkroom + «una sola columna de
   proyectos, degradados», que pidió para Vendiq): titular de 128 px sobre un campo oscuro con
   aurora y UNA fila de 12 portadas reales que corre por CSS (se detiene al pasar el ratón).
Gasto: 5 imágenes, 11 872 tokens. Activas: `/?hero=5|8|9|10`.

## Cuarta ronda
Alexander: *«más o menos, no me convencen, sigue probando»*. Diagnóstico: las diez repetían el
mismo esqueleto (rótulo + titular a la izquierda + UNA imagen), y ninguna seguía la receta de los
heroes que SÍ aprobó en su familia SaaS (vendiq.pe, rematch.pe, bookit.com.pe, lumiolearn.com:
aviso «Nuevo», titular grande con una frase marcada, microcopia, y debajo o al lado una
composición rica con personas reales y tarjetas reales). Tres estructuras nuevas, una por
generador de `creator/DIVERGENCIA.md`:
11. **Portada de revista** (fuera del sector): cabecera «AXIUM» a todo el ancho, filete con
   «Nº 45 · Octubre 2026 · Lima», titular principal y cuatro titulares de casos reales numerados,
   sobre la foto de la 5.
12. **Bento vivo** (lo que ya aprobó): aviso «Nuevo: Feniz», titular centrado con «usan todos los
   días» marcado en azul, microcopia en mono, y un bento: vídeo real de Feniz, foto de Rematch con
   la agenda real encima, y la cifra 45 en una losa azul.
13. **Persona real** (receta de Vendiq): foto de stock REAL (Omar Lopez, Unsplash, licencia
   verificada, crédito en `capturas-clientes/axium-hero/2026-10/stock/CREDITOS.md`) en marco con
   radio, isotipo en un círculo, la cita de Bookit y la venta de Vendiq flotando, líneas
   concéntricas finas detrás. Sin gasto de OpenAI en esta ronda.

## Quinta ronda: la dirección del bento
La 12 refinada y cuatro composiciones, sin Feniz y con UN solo vídeo por propuesta:
- **12 refinada**: aviso «Nuevo · Agentes de IA para tu negocio», «Software que tus clientes *usan
  todos los días*» con la marca como franja (se parte bien en el celular con
  `box-decoration-break: clone`), bento: vídeo de la web de Aurore en laptop y celular, Rematch con
  su agenda real encima, la cifra 45.
- **14 servicios**: una losa por servicio con su caso (Aurore / ANJ en vídeo / Copilot de Lumio) y la cifra.
- **15 personas**: la foto real de Unsplash con la cita de Bookit y la venta de Vendiq encima, la web
  de Rematch en vídeo, la cifra.
- **16 dividida**: titular a la izquierda y bento 2×2 a la derecha (Aurore en vídeo, Rematch, ANJ, 45).
- **17 escalonada**: cinco losas de alturas distintas a todo el ancho; la alta es el vídeo de Rematch
  con un jugador y la app.
⚠️ El vídeo del asistente de Vendiq arranca con el editor vacío: en una losa del hero se ve negro.
Para el hero, vídeos con contenido desde el primer cuadro (`av-portada-mostrador`, `rm-movil`).
Marca corta (2–3 palabras) con `whitespace-nowrap`: «se / usa» partido en dos líneas se veía roto.

## Veredicto de Alexander
- Ronda 1: descarta 2 (producto en laptop y celular) y 3 (claro con bodegones). Se queda con 1 y 4.
- Ronda 2: «ninguno», deja la 5 (monumento) por si acaso.
- Ronda 3: «más o menos, no me convencen, sigue probando».
- Ronda 4: **«el 12 puede ser, pero mejóralo o refínalo, no uses Feniz de portada. Arregla y dame
  4 opciones más»**. Primera dirección que le sirve: la receta de SUS heroes aprobados.
- Ronda 5: (pendiente)
