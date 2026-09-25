# Caso Rematch — ficha dentro de Axium (SaaS propio)

> Encargo, 2026-09-11. Alexander: *"cada highlight también es parte del
> portfolio, hazle su página a cada uno, empecemos por lumio y rematch, los
> demás no. sé creativo, busca referencias, crea imágenes en higgsfield si
> necesitas"*.
>
> Plantilla que aplica: **SaaS propio → modelo Fiddle** (larga, narrativa,
> "a modo historia"), con las correcciones que ya dejó Alexander: capítulos que
> **alternan texto e imagen** como una historia (no imágenes a un lado y texto al
> otro), titular = párrafo, cero redundancia dentro y entre imágenes, navbar
> legible, cierre liviano. Ver `PATRONES.md`.

---

## 1. La historia real (leída en el repo, no en la landing)

La landing de rematch.pe vende **reserva de canchas**. El repo
(`~/Documents/SAAS/REMATCH`, `CLAUDE.md`, `docs/`) cuenta un producto mucho más
grande, que la landing no enseña:

| Superficie | Qué hace (verificado en código/docs) | Dónde se ve en público |
|---|---|---|
| **Reservas** | Directorio de canchas por deporte y distrito, reserva y pago online; panel del club con horarios, ocupación (`FieldOccupancy` como única fuente de verdad), multi-sede y equipo | rematch.pe, /canchas, ficha de club |
| **Torneos en vivo** | Inscripción, **sorteo** (siembra ITTF, re-sorteo), **6 formatos** (grupos+llave, drops+RR, eliminación directa, todos contra todos, doble eliminación, suizo), grilla de horarios mesa/hora, **árbitro móvil set a set**, y **en vivo por SSE** para espectadores | **live.rematch.pe** |
| **Academias** | Cursos por períodos, horarios → clases concretas, suscripciones con **cobro recurrente** (Mercado Pago), **check-in QR** por DNI, profesores, cobranza | rematch.pe/academias |
| Ligas | Temporadas con **divisiones que suben y bajan** (PROMOTED/RELEGATED), fixture o partidos auto-agendados con disponibilidad | /liga |
| Ranking | Ranking nacional por temporada + snapshots ITTF | rematch.pe/rankings |
| Marcadores | Modelos de marcador propios para **tenis de mesa, tenis, fútbol, vóley y básquet** | — |

**El nombre** (guía de marca del fundador): *"Rematch es la revancha: el
partido que se juega otra vez… habla del juego, que es lo que la gente viene a
hacer; la reserva es sólo el medio. Y le queda cómodo a un producto que hoy es
más que canchas: también torneos y academia."*

**Lo que la marca pide evitar** (misma guía): balones, trofeos, pistas
dibujadas, silbatos; "una app de tecnología que ama el deporte, no un club de
los 90".

**Lo que hizo Axium** (el caso vende el trabajo, no el producto): diseño de
producto y desarrollo de punta a punta — plataforma multi-tenant, tres
superficies, motor de torneos con sus formatos y sorteo, tiempo real, pagos
recurrentes, RBAC por club.

Stack verificado (`package.json`, `docs/SYSTEM_OVERVIEW.md`): Next.js 15 ·
React 19 · TypeScript estricto · tRPC 11 · Prisma + PostgreSQL 16 ·
better-auth · Tailwind 4 + shadcn/ui · SSE · Mercado Pago · Cloudflare R2 ·
Gemini (`@ai-sdk/google`) · next-intl.

## 2. Los instrumentos del oficio (generador a de DIVERGENCIA)

La llave · el sorteo · la tabla de grupos (puntos → sets → cociente) · el
marcador set a set (a 11 con diferencia de 2) · la hoja del árbitro · el punto
rojo EN VIVO · la grilla de horarios por cancha (08:00 … 21:00) · el ticket de
reserva · el QR de acceso · la división que sube y baja · el ranking.

## 3. Tres direcciones (una por generador, escritas aisladas)

### A · Instrumentos del oficio — "La llave"
La ficha entera es un cuadro de torneo. Una línea lima fina baja por el margen
y va juntando los capítulos como cruces de una llave: **Octavos · la reserva →
Cuartos · el club → Semifinal · el torneo en vivo → Final · la plataforma**.
Cada titular de capítulo lleva el "cruce" dibujado. Hero: el nombre enorme
sobre la llave real de un torneo de live.rematch.pe, desenfocada.
- Gana: firma inconfundible, verdad del producto.
- Pierde: la metáfora puede forzar el orden de los capítulos; la línea es
  frágil en móvil.

### B · Restricción forzada — "Solo luz de reflector"
Sin blanco, sin tarjetas claras: todo en noche (`#001D30`) y el lima es la
única luz. Cada capítulo "enciende un reflector" — un cono de luz que ilumina
la pieza de UI al entrar en pantalla. Imágenes generadas de canchas de noche
(sin personas) con el dispositivo compuesto encima.
- Gana: atmósfera sostenida, continuidad con la portada del home.
- Pierde: la firma es de atmósfera, no de estructura; podría ser de otra app
  deportiva.

### C · Fuera del sector — "Transmisión en vivo"
Fuente nombrada: **paquetes gráficos de transmisión deportiva** (el *scorebug*
de las transmisiones de ATP Tour / LaLiga TV, los *lower thirds*, las
alineaciones). La ficha se arma como una transmisión: *scorebug* fijo
"REMATCH · EN VIVO ●" que cambia de "set" con el capítulo, capítulos que
entran con un **lower third**, una **alineación** con los módulos numerados
como camisetas, un bloque **estadísticas del partido** con datos reales del
producto (6 formatos, 5 deportes con marcador propio, 3 superficies) y un
cierre **"Repetición"** (rematch = revancha) que lleva al siguiente proyecto.
- Gana: firma estructural + verdad (el producto *es* en vivo) + juego con el
  nombre.
- Pierde: riesgo de verse "tele" si se abusa; hay que dosificar a 4 gestos.

**Recomendación: C**, con la atmósfera nocturna de B en las imágenes.

### ⚠ Decisión de Alexander (2026-09-12) — cambia el eje
No eligió ninguna de las tres tal cual. Respondió: *"Rematch es una plataforma
para centros deportivos con varias features, reservas, academias, ligas,
torneos, etc, muestra todos de igual peso"*.

- **El producto es la plataforma para el centro deportivo**, no los torneos en
  vivo. Las tres direcciones ponían a los torneos como clímax: eso se cae.
- **Igual peso**: cada módulo (reservas, academias, ligas, torneos, y lo que
  sume: tienda, finanzas) con la misma estructura y el mismo tamaño de
  capítulo. Nada de "semifinal/final".
- Crítico de contexto limpio (antes de esta decisión): C > A > B; si el
  marcador de TV muestra datos inventados es disfraz; "repetición" traduce
  *replay*, *rematch* es **revancha**.
- Material: lo público de rematch.pe y live.rematch.pe; **lo interno se captura
  levantando Rematch en local** contra la copia `rematch_dev`, con datos de demo
  sembrados en «Rematch Corp» (tenant propio) — nunca datos de clientes.
  Alexander: *"si quieres caps internas del dashboard lo mejor es que levantes
  rematch en local, lo mismo para lumio, pero uno por uno, si no se me bugea la
  laptop"*.

## 3b. Estructura con igual peso (después de la decisión)

**Firma: la planta del centro deportivo.** El hero es un plano cenital (líneas
lima sobre navy, como el trazado de canchas de un complejo) donde **cada cancha
es un módulo del mismo tamaño**: Reservas · Academias · Ligas · Torneos ·
Operación. Instrumento del oficio (el plano de un complejo) y, por construcción,
igual peso. Cada cancha del plano ancla a su capítulo.

**Capítulos idénticos en anatomía** (aprendido de Blanca Padel): micro-etiqueta
+ número de cancha · titular-párrafo · **par de imágenes** (una vista de
escritorio del panel + una vista móvil o del lado público). Cinco capítulos,
misma altura, mismo ritmo. Las líneas de cancha (Padel Social Club) como
divisores entre capítulos.

| Cancha | Módulo | Par de imágenes (UI real) |
|---|---|---|
| 01 | Reservas | Calendario del club con reservas y clases · reserva móvil pública |
| 02 | Academias | Alumnos (plan, vigencia, progreso) / cobranza · academia en móvil |
| 03 | Ligas | Divisiones con tabla (suben y bajan) · liga en móvil |
| 04 | Torneos | Llave en vivo de live.rematch.pe · asistente "¿Qué tipo de torneo?" |
| 05 | Operación | Tienda / finanzas · documentación de la API |

Cierre: ficha técnica + **"Revancha →"** al siguiente proyecto.

## 4. Material disponible

- Portada del home (cancha nocturna + reserva + listado) — `portadas/rematch.png`
- Móvil real: reserva de club (deporte, fecha, horarios) — `club/m-top.png`
- Listado de canchas (desde la 2ª tarjeta; la 1ª tiene imagen rota) — `recorte-listado.jpg`
- **live.rematch.pe**: home, torneos, llaves/grupos/horarios — `live/` (capturando)
- Ranking — `rankings/` (capturando) · Dueños y academias — `publico/` (capturando)
- **Falta**: el panel del club y la hoja del árbitro (detrás de login).
- **No usar**: `celular.webp` de la landing (UI generada con IA, con errores).

## 5. Preguntas para Alexander (al final, con la ficha hecha)

1. ¿Capturas o acceso demo al **panel del club** y a la **hoja del árbitro**?
2. ¿Se pueden nombrar clientes reales (p. ej. Ranking Reto UNI) o datos de uso?

---

## 6. Rehecha con la plantilla brandvm (2026-09-12)

Alexander, sobre la ficha de autor: *"masomenos, mas me gusta la forma en que
brandvm presenta sus trabajos y cuenta su historia"* (ejemplo:
brandvm.com/case-studies/industrial-manufacturing-website). La ficha ahora usa
`src/components/axium/case-story/case-story.tsx`: hero-tarjeta con la foto del
mundo del producto (Higgsfield) + logo + meta → frase de logro → "Lo que
construimos" → Reto / Enfoque / Resultados (sin métricas inventadas) → galería
2:1 + pares 1:1 → Siguiente proyecto → contacto.

Imágenes en `public/images/proyects/<slug>/bv-*.jpg`: mockups fotográficos con la
UI real sobre escenas con pantalla verde (`scripts/componer_pantalla.py`) y
piezas del taller (`capturas-saas/brandvm-casos/taller.html`,
`scripts/render-taller.cjs`). La versión anterior (planta / libro) queda en el
historial de esta sesión; sus imágenes siguen en `public/` sin referenciar.

## 7. Móvil, cierre oscuro y la landing (2026-09-12)

- Plantilla refinada para móvil y cierre oscuro "Más proyectos" con carrusel:
  ver `CASO-LUMIOLEARN.md` § 7 (el componente es el mismo).
- **Fuera bv-planta** (vista aérea de canchas de Higgsfield). Alexander: *"esto
  cambiaría o quitaría, no entiendo por qué está"*. No mostraba producto: era
  atmósfera de la ficha "planta" anterior que sobrevivió al cambio de plantilla.
- **Entra la landing de rematch.pe**. Alexander: *"además no veo muchas capturas de
  la landing page"*. Capturas del sitio en vivo en `capturas-saas/rematch/landing/`
  (1440 a 2x y 390 a 3x, recortes móviles `landing-m-hero/aporta/cta`). Cuatro
  piezas en el taller:
  - `bv-landing` (+ `-movil` 4:3): el hero en ventana sobre azul noche con brillo lima.
  - `bv-landing-moviles`: tres pantallas móviles (buscador, lo que aporta a un club,
    la página para dueños).
  - `bv-duenos`: la página para dueños (`rematch.pe/quiero-ser-parte`, verificada).
  - `bv-landing-secciones` (+ `-movil`): "lo que aporta" y "¿Cómo funciona?" de la
    página para dueños, en dos ventanas.
- **Sin "Clubes destacados"**: la primera tarjeta tiene la imagen rota en el sitio y
  son negocios de terceros.
- **Sin la sección "Descubre lo que Rematch puede hacer"**: su celular es
  `celular.webp`, UI generada con IA con errores ("Multfcancha", "Calendarto",
  "Contrmeda"). Entró en la primera tanda de piezas y se sacó al revisarlas a zoom.
- Orden de la galería: mosaico → lo que construimos → tipografía/paleta → reto →
  enfoque → recepción/pantallas → resultados → **landing → móviles/dueños** →
  oficina → banca/en vivo → **secciones de la landing**.

## 8. Portada nueva y highlight sin mockup (2026-09-13)

Alexander, al ver juntas las portadas de LumioLearn y Bookit: *"ambos están buenos, pero son
muy similares, incluso creo que no habría necesidad de poner mockups para los highlights,
sino otra forma creativa de mostrarlo. Pero sí el mockup para el carrusel, idea algo. Intenta
mejorar el de Rematch también, usa Higgsfield"*.

- **Portada del carrusel y del portafolio** (`proyects/rematch/rematch-portada-v2.jpg`; reemplaza
  a `highlights/rematch.jpg` en `rematch.json` y en el "Siguiente" de Bookit): celular apoyado en
  una pala de pádel sobre césped azul, de noche, con reflectores. Higgsfield
  `escenas/rematch-portada-raqueta.png` (3:2 high 2k, 3 créditos) + inicio móvil real de
  rematch.pe con barra de estado (`brandvm-casos/pantalla-celular-rematch.html`, 1170×2786 = el
  hueco medido, 0.42). Se compone con `--bordes --caja 800,420,1210,1090 --ancla arriba --brillo 0.9`.
  ⚠ Sin `--caja`, el filo lima de la pala se leyó como pantalla y la captura salió cortada a la
  derecha (COMPOSITOR.md § "Un objeto verde en la escena engaña a la máscara").
- **Highlight del home** (`highlights/rematch-v2.jpg`), sin mockup: líneas de cancha lima sobre
  piso navy que se ramifican como llaves de torneo (Higgsfield `escenas/rematch-mundo-lineas.png`,
  16:9 high 2k, 3 créditos). Encima, recortes reales: el buscador «Encuentra tu cancha» de
  rematch.pe, la cancha elegida al reservar («Básquet Indoor · S/ 60.00/hora») y las llaves de un
  torneo demo de Rematch Live (cuartos y semifinal). Ver HIGHLIGHTS-HOME.md § Cuarta vuelta.
- `highlights/rematch.jpg` (la portada anterior) queda sin uso; no se borró porque es anterior a
  estas fichas.

## 9. La web rehecha, y la ficha con ella (2026-09-25)

Alexander: *"vendiq, y rematch tienen nueva UI. sigue el proceso que hicimos con los otros"*. Medido
antes de tocar nada: rematch.pe daba **60,8** de diferencia visual contra mi captura, y en el repo
estaba el rediseño del 2026-09-24 (rama `feat/live-rediseno`, ~25 commits: web y todo live.rematch.pe),
ya publicado.

- **Marca nueva** (`src/app/globals.css`): fondo `#F7F8FA`, tinta `#001D30`, secundario `#3D5A6E`,
  lima `#B4DF00`, gris `#F1F5F9`. **Satoshi + Cal Sans** en los titulares (antes solo Satoshi).
- **rematch.pe (para clubes)**: portada «Tu club deportivo, en orden y al día» con la agenda del día,
  sección oscura «Todo tu club, en un solo panel» con pestañas (agenda, cobros, academia, torneos,
  tienda), «tres pasos», «un espacio para tus jugadores», testimonios reales (Academia TTC, Club de la
  UNI, Jhon Loli), contacto oscuro, preguntas y cierre. Páginas nuevas: `/producto/*`, `/soluciones/*`,
  `/precios` («Precios claros, en soles»: gratis, básico S/29, profesional S/58, empresa).
- **live.rematch.pe (para jugadores)**: portada con foto y buscador, mosaico de deportes, «cómo quieres
  jugar», directorio de clubes y academias, torneos con póster y «mis torneos».
- **La página de dueños ya no existe** → esa pieza pasa a ser los precios (mismo id `bv-duenos`).

Material nuevo: `capturas-saas/rematch/rediseno-2026-09/` (las dos webs a 2x, 8 páginas internas, móvil
a 3x) y `capturas-saas/rematch/piezas-2026-09/` (secciones por elemento, móviles y tarjetas a 4x).

| Pieza | Ahora |
|---|---|
| `bv-mosaico` | 30 baldosas de las dos webs sobre `#F7F8FA` |
| `bv-tipografia` / `bv-paleta` | Satoshi + Cal Sans sobre tinta; tinta, lima, secundario, gris y azul de Live |
| `bv-landing` (+ `-movil`) | La portada nueva en ventana |
| `bv-landing-secciones` (+ `-movil`) | «Todo tu club, en un solo panel» y «tres pasos», en dos ventanas |
| `bv-landing-moviles` | rematch.pe (portada y cobros) y el directorio de Live en tres celulares |
| `bv-duenos` | `/precios` en ventana |
| `bv-envivo` | La portada de Rematch Live + la tarjeta de un torneo |
| `bv-pantallas`, `bv-recepcion`, `bv-oficina` | Sin cambios: son el panel, que conserva su sistema (`docs/DESIGN_SYSTEM.md`) |
| `bv-banca` | Rehecha: mostraba el micrositio verde de la marca vieja y la pantalla estaba torcida. Ahora, el viewport real de live.rematch.pe en «Cómo quieres jugar» (`brandvm-casos/pantalla-celular-rematch-banca.html`) |
| `rematch-portada-v3.jpg` | Portada del carrusel: el mismo celular sobre la pala, con la portada nueva |
| `highlights/rematch-v7.jpg` | Highlight: **la agenda del día entera** de rematch.pe (Pádel 1..4, 5 reservas) sobre una aérea nocturna de cuatro pistas de pádel. Sustituye a `rematch-v6.jpg` —llaves de cancha + tarjetita— que compartía anatomía con Bookit (ver HIGHLIGHTS-HOME.md § octava vuelta) |

Textos: alts de tipografía, paleta, portada, secciones, móviles, precios y Live reescritos, y el
«Enfoque» ahora cuenta las dos puertas (rematch.pe para el club, Rematch Live para el jugador), en es/en/pt.

## 10. Pelotas de tenis en una escena de pádel (2026-09-25)

Alexander, sobre la portada: *«si es paleta de pádel, las bolas deben ser de pádel; si es de
tenis, pelotas de tenis»*.

**La incoherencia**: en `escenas/rematch-portada-raqueta.png` todo era pádel —pala maciza
perforada de carbono, pista con paredes de vidrio, césped azul, y en la propia pantalla «Tu club ·
Pádel» con las columnas Pádel 1/2/3— menos las dos pelotas, que eran **de tenis**: pelusa larga y
desordenada con halo de hilos sueltos (pelota gastada de tenis), costura gruesa y blanquecina de
tenis, y de hecho mal dibujada (en la de delante la costura era una raya que no cerraba).

**El arreglo, en un solo tiro**: en vez de rehacer la escena se **editó** la escena verde original
pasándola como `image_references` a `gpt_image_2_5` (high, 2k, 3:2) y pidiendo **solo** el cambio
de las pelotas: pelusa corta y densa sin hilos sueltos, costura fina y de poco contraste, un poco
más blandas, y la palabra **PADEL** impresa en la de delante. El prompt repite «reproduce la
referencia exactamente» y marca como CRÍTICO que la pantalla siga siendo verde liso #00FF00, mate
y vacía. Salió a la primera: el cuadrilátero verde quedó a ±2 px del original
((950,462) (1190,452) (1097,1052) (839,1038) contra (948,463) (1190,452) (1097,1052) (838,1038)),
así que la caja y el encuadre se reutilizaron tal cual. Escena nueva:
`escenas/rematch-portada-raqueta-v2.png`. **Coste: 2,75 créditos** (no 3: el preflight `get_cost`
de `gpt_image_2_5` high 2k da 2,75). Saldo 7,77 → 5,02. El segundo tiro del presupuesto no se gastó.

**La pantalla, rehecha al aspecto real del celular.** De paso se aplicó la lección del mismo día
(COMPOSITOR.md § «Celular en una escena»): `pantalla-celular-rematch.html` estaba a 1170×2786, el
aspecto del **hueco medido** (0,42). El celular está girado sobre su eje vertical y ese 0,42 es el
escorzo, que la homografía ya aplica; armarla así achataba la tipografía un 9 % y metía 879 px CSS
de página, más de lo que cabe en un iPhone real. Ahora va a **1170×2532** (0,462, el aspecto real)
y se compone con `--sin-recorte`: 794 px CSS de página, que es justo lo que muestra el viewport de
un iPhone 15 Pro. Se ve menos agenda (cabecera + 17:00 y 18:00) pero la tipografía es la correcta.

Comando final:

```
python3 scripts/componer_pantalla.py \
  capturas-saas/escenas/rematch-portada-raqueta-v2.png pantalla.png salida.jpg \
  --bordes --caja 800,420,1210,1090 --ancla arriba --brillo 0.9 --sin-recorte
```

Verificado: 0 píxeles de verde residual dentro de la caja, las cuatro esquinas redondeadas limpias
y sin inclinación, y la pieza funciona a 2048 y a 360 (a 360 «PADEL» aún se lee). Sustituidos los
tres archivos —`proyects/rematch/rematch-portada-v3.jpg`, `highlights/rematch-v8.jpg` (recorte
16:10 desde y=52) y la copia `escenas/mock-rematch-portada-v3.jpg`— sin cambiar rutas, así que hubo
que borrar `.next/cache/images` para que el dev server dejara de servir la versión vieja.

**Regla que queda**: una escena generada tiene que ser coherente en *todo* el atrezo, no solo en el
objeto principal. Antes de dar por buena una escena deportiva, mirar a zoom pelota, superficie,
cancha del fondo y raqueta, y comprobar que sean del mismo deporte.
