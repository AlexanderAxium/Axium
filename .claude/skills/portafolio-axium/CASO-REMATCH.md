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

## 11. Una escena nueva que no pasó: el celular contra la red (2026-09-26)

Alexander, mirando la portada del carrusel: *«cambia esa imagen a otra cosa»*. Escena nueva, no
retoque. **Resultado: se generó, se compuso, se enseñó y se descartó.** Queda escrita porque la mitad
del experimento funcionó muy bien y la otra mitad enseña dónde está el límite de generar canchas.

### La escena y el prompt

`gpt_image_2_5`, `quality: high`, `resolution: 2k`, `aspect_ratio: 3:2` = **2,75 créditos**
(preflight con `get_cost: true`, que no envía trabajo). Saldo **5,02 → 2,27**, que ya no daba para un
segundo tiro, así que el prompt se escribió entero antes de disparar. Escena:
`escenas/rematch-portada-red.png`.

Pedido: el celular de pie sobre el césped azul, apoyado contra la base de la red, **cámara a ras de
suelo** mirando ligeramente hacia arriba, malla y poste detrás, paredes de vidrio y reflectores en
bokeh al fondo, **cero atrezo suelto**.

**Lo que salió perfecto** (y hay que reutilizar):
1. **La pantalla verde pedida como el bloque más importante del prompt**, en mayúsculas y con la lista
   larga de negaciones (sin interfaz, iconos, reflejos, brillo, degradado ni derrame de luz verde).
   Salió #00FF00 liso y mate, y el compositor midió el cuadrilátero a la primera.
2. **Prohibir el lima en la escena**: *"the ONLY green anywhere in the image is the phone screen"*.
   Por primera vez en esta portada **no hizo falta `--caja`**: el bbox de la máscara era exactamente
   el celular (825,248,1178,984), cero verde parásito. Es el arreglo definitivo del problema del filo
   lima que arrastraba el cuadrilátero.
3. **La lista de prohibiciones de atrezo** (sin pelotas, palas, bolsas, botellas, personas, manos):
   el error del 2026-09-25 convertido en instrucción. No apareció ni un objeto de más.
4. **Celular casi de frente y grande**: la pantalla pasó de 249×597 a 322×732 px (+29 % de ancho,
   +59 % de área). El producto dejaba de ser un detalle.

**Lo que falló, y es lo que la tumbó.** Alexander: *«no se ve el header y además no parece una cancha
realista»*. Mirando la escena a 1:1 —no en miniatura, donde parecía bien— tenía razón:
- **La red no es una red de pádel**: es una **malla de cuerda gruesa trenzada**, con cuadros de casi
  medio celular de ancho. Una red de pádel es de hilo fino y cuadro pequeño. La **escala está rota**:
  al lado de un objeto de 15 cm, esos cuadros dicen «red de carga» o «jaula de bateo».
- **La geometría del fondo no cierra**: un riel superior que se arquea (los rieles no se arquean),
  paneles de vidrio con montantes que no coinciden con nada y luces flotando dentro del cristal sin
  lógica de reflejo.
- La profundidad de campo muy corta que pedí convirtió la cancha en una mancha: el modelo rellenó lo
  desenfocado con formas plausibles pero incoherentes.

**La lección**: en una escena generada, **lo que está desenfocado también hay que juzgarlo a 1:1**.
En miniatura el bokeh tapa la incoherencia y uno da por buena una geometría imposible. Y una cancha
en primer plano es de lo más difícil de generar: falla por geometría y por escala, las dos cosas que
menos perdona un ojo que conoce el deporte.

La escena queda en `escenas/rematch-portada-red.png` como registro; no se usa.

## 12. La cabecera que faltaba, y la vuelta a la pala (2026-09-26)

De los dos peros de Alexander, el primero **no costaba un crédito** y valía para cualquier portada:

### «No se ve el header» — era la captura, no la escena

`pantalla-celular-rematch.html` metía `rematch/rediseno-2026-09/web-m-full.jpg`, un **fullPage**. La
cabecera de rematch.pe es `position: fixed` (medida: `top: 8`, `height: 56`, con el logo
`LOGO_PRINCIPAL_2.webp`), y **un fullPage la pierde**: en su lugar queda un hueco gris. Está en
COMPOSITOR.md desde el 2026-09-25 por lo mismo en live.rematch.pe, y volvió a morder.

Arreglo: capturar el **viewport real** de rematch.pe a **390×794 @3x = 1170×2382** —justo el alto de
`.pagina`— con `isMobile`, `locale: es-PE`, aceptando el banner de cookies, recorriendo la página para
disparar las animaciones, volviendo arriba y esperando a que la agenda llegue a «5 reservas».
Resultado versionado en `capturas-saas/rematch/rediseno-2026-09/web-m-vp0.png`.

**Lo mejor: no cuesta nada de contenido.** El hueco gris que dejaba el fullPage es exactamente el que
ocupa la cabecera fija, así que el logo y el menú entran sin empujar nada: la píldora, el titular, los
dos botones y la agenda quedan donde estaban. Se comprobó que el logo se lee a 2048 y en la tarjeta de
`/portafolio` a 504 px; a 360 px es una marca lima reconocible, no una palabra legible —a ese tamaño
el celular entero mide ~56 px y eso es física, no un defecto.

### «No parece una cancha realista» — se volvió a la pala, sin gastar

Con **2,27 créditos** ya no había `high`/2k (2,75). Las alternativas preflighteadas eran
`medium`/2k (1) y `high`/1k (1,5). **Se decidió no gastar**, por tres razones:

1. El fallo era de **renderizado y escala** (la malla de cuerda, el riel arqueado), no de encuadre.
   Recortar no lo arregla, y **bajar calidad empeora justo la geometría**: habría sido gastar para
   quedar peor, sin crédito para rehacerlo.
2. La escena de la pala (`escenas/rematch-portada-raqueta-v2.png`) **sí es creíble a 1:1**: postes
   verticales, riel superior recto, paneles de vidrio coherentes, y la pala con trama de carbono,
   perforaciones y protector de verdad. Comparadas a 1:1 no hay discusión.
3. Alexander ya la había dado por buena, y sus pelotas se corrigieron ese mismo día.

Así que la portada vuelve a la pala **con la cabecera puesta**: es la versión que él aprobó, mejorada.

```
python3 scripts/componer_pantalla.py \
  capturas-saas/escenas/rematch-portada-raqueta-v2.png pantalla.png salida.jpg \
  --bordes --caja 800,420,1210,1090 --ancla arriba --brillo 0.9 --sin-recorte
```

`--caja` vuelve a hacer falta: el filo lima de la pala sí engaña a la máscara (el script avisa
«verde fuerte fuera de la caja (118,253,1557,801)» y lo ignora, que es lo correcto).

### Verificación

- **0 píxeles** de verde residual **dentro** del celular, con umbral 120 y con 60. Los 914 de fuera
  son el filo de la pala y las pelotas: contenido de la escena, no fallo de composición.
- Cuadrilátero (949,459) (1192,448) (1098,1056) (837,1041), aspecto 0,42 — a ±1 px del de la v3, así
  que la caja y el encuadre se reutilizaron tal cual.
- Cabecera con logo Rematch y menú visible; UI sin achatar (pantalla HTML a 1170×2532 + `--sin-recorte`).
- En el sitio real (:3111): `/portafolio` a 1440 y a 360, y el home a 1440 y a 360. Sin desbordes,
  gutters iguales, ninguna imagen rota.

### Archivos y referencias

| Antes | Ahora |
|---|---|
| `proyects/rematch/rematch-portada-v3.jpg` | **`rematch-portada-v5.jpg`** (2048×1360, 485 KB) |
| `highlights/rematch-v8.jpg` | **`rematch-v10.jpg`** (16:10 desde y=52, 456 KB) |
| `escenas/mock-rematch-portada-v3.jpg` | `escenas/mock-rematch-portada-v5.jpg` |

(v4 y v9 fueron la escena de la red; existieron unos minutos y se borraron.)

**Tres** referencias en código, no dos — la tercera es la que se olvida:
- `src/data/cases/rematch.json` › `image`
- `src/components/axium/highlights-section.tsx` › `cover`
- `src/app/(public)/casos-de-exito/vendiq/VendiqContent.tsx:424` — **la tarjeta «Siguiente» de la ficha
  de Vendiq apunta a la portada de Rematch**. Grepear el nombre del archivo en todo `src/`, no solo
  los JSON de casos.

Nombres nuevos en cada vuelta y `.next/cache/images` borrado.

**Crédito gastado en total: 2,75. Saldo final: 2,27.**

## 13. La portada deja de ser un dispositivo y pasa a ser un lugar (2026-09-30)

Alexander: *«mejora esto, hazlo más profesional»* y, al precisar, *«me refiero a su portada de
rematch. busca otra, inspírate de nuestras referencias»*.

### El diagnóstico, mirando la v5 a 1:1 y mirándola entre sus vecinas

Dos cosas que en miniatura no se ven:

1. **Las pelotas siguen siendo de tenis, y ahora además llevan un cartel.** El arreglo del
   2026-09-25 les puso «PADEL» impreso en una gruesa sin marca. A 1:1 eso no es una pelota de
   pádel: es **una pelota rotulada para explicar la foto**. Una foto profesional no subtitula su
   atrezo. Y la guía de marca de Rematch pide evitar **pelotas** y trofeos: la v5 la incumplía dos
   veces.
2. **El fondo tiene el mismo defecto que tumbó la escena de la red**, solo que más disimulado:
   de la mitad derecha hacia fuera son manchas de luz flotando dentro del cristal, sin lámpara que
   las sostenga. Lo que salvó a la v5 fue que el primer plano era creíble, no que el fondo lo fuera.

Y el problema mayor, que no se ve mirando la imagen sola sino **la rejilla**: Bookit (laptop sobre
mármol), LumioLearn (tableta cenital), Vendiq (monitor sobre repisa) y Rematch (celular sobre la
pala) son **cuatro escenas oscuras con un dispositivo encima de una superficie**. En una tarjeta de
380 px las cuatro son la misma mancha. Es exactamente la queja que Alexander hizo en el § 8 sobre
Bookit y LumioLearn, nunca resuelta para el carrusel.

### Las tres direcciones (generadas las tres, juzgadas a 1:1)

Con 962 créditos ya **no había que apostar a un solo tiro**, que es lo que hundió las vueltas
anteriores: se generaron las tres y se decidió mirando, no imaginando. 3 × 2,75 = **8,25 créditos**.

| | Dirección | Veredicto |
|---|---|---|
| **A** | **El club como arquitectura**: cuatro pistas acristaladas de noche, vacías, cámara lejana y elevada, f/8 y foco profundo | **Elegida** |
| B | Bodegón de estudio: la pala y el celular sobre piedra, fondo de papel tinta, una sola luz rasante | Correcta pero plana, y **derramaba verde sobre la piedra**; sigue siendo «dispositivo sobre superficie» |
| C | El celular sobre un pretil con el fondo disuelto en pura luz | Técnicamente impecable y **mudo**: es el mockup de cualquier app, no dice deporte |

### Por qué A, y contra qué referencia se defiende

**BAO**, y en su formulación más tajante: *la tarjeta del índice es fotografía del mundo del
cliente y nunca una pantalla; la ficha son solo pantallas y nunca una foto.* La ficha de Rematch ya
tiene 20+ capturas reales: **la división del trabajo ya estaba medio construida y la portada la
rompía.**

**Upstatement contradice a BAO** (sus tarjetas son mosaicos de pantallas) y hay que elegir. La
elección no es «BAO tiene razón»: es que **las dos aplican la misma regla por debajo — la tarjeta
tiene que ser lo que su rejilla no tiene todavía**. BAO prohíbe pantallas porque sus 44 tarjetas
serían 44 capturas iguales; Upstatement puede permitírselas porque su rejilla es cartelería,
señalética e ilustración y el mosaico es el raro. **En la rejilla de Axium lo que falta es un
lugar, no una pantalla.** Por eso, aquí, BAO.

Se descartaron por colisión: el **hero-tarjeta de brandvm** (mundo velado + logotipo enorme) choca
de frente con Alyer, que ya es logotipo sobre acero; y el **antetítulo de entregable de viget** es
maquetación, no imagen — y sus portadas de archivo son justo lo que su propio análisis señala como
su punto flojo.

### Por qué la geometría sí aguantó esta vez

El § 11 dejó escrito que una cancha en primer plano falla por geometría y por escala. **La causa no
era la cancha: era la profundidad de campo corta.** Al pedir bokeh, el modelo rellena lo
desenfocado con formas plausibles e incoherentes. Esta escena pide lo contrario —**35 mm, f/8, foco
profundo de delante a atrás, tilt-shift, «sin desenfoque de fondo»**— y encima **cámara lejana y
ortogonal**, que es la zona segura que ya había demostrado la aérea.

Comprobado a 1:1 en cinco recortes (izquierda, centro, derecha, postes y suelo): mallas metálicas
de cuadro fino en los paños altos —detalle real de pádel—, red con su cinta blanca y su caída,
paños de vidrio con bisagras y herrajes visibles, montantes verticales y rieles horizontales rectos
y paralelos, luminarias con cuerpo físico y su cono de luz, líneas de saque correctas, y el asfalto
mojado devolviendo las luces en vetas alineadas con las lámparas. **Ni un objeto de más, ni una luz
huérfana, ni una letra.**

Al prompt se le añadió, además de lo de siempre: **«toda línea estructural perfectamente recta,
rieles horizontales y paralelos, montantes verticales, ninguna luz que flote sin luminaria visible,
sin destellos ni bolas de bokeh»**, y la lista de prohibiciones de atrezo del § 10 ampliada con
pelotas, palas, marcadores, banderolas y patrocinadores.

**Regla nueva**: cuando la escena es un lugar, **pedir foco profundo y cámara lejana**. El bokeh no
esconde los fallos de una cancha: los fabrica.

### Lo que se gana y lo que se pierde

Gana: **se lee a 180 px** (la banda de pistas encendidas más los reflejos sobrevive a cualquier
recorte, cosa que el celular de 56 px no hacía); es **la única de las cuatro portadas propias que
enseña un lugar**; cumple la guía de marca; y en el home ilustra literalmente la frase del panel
(*«marketplace para encontrar y reservar canchas…»*).

Pierde: **no se ve el producto**. Es una decisión, no un descuido —la ficha lo enseña entero—, pero
es el punto que Alexander puede querer discutir. Si lo quiere de vuelta, la dirección B está
generada y el bodegón se compone con el flujo de siempre.

### Archivos y referencias

| Antes | Ahora |
|---|---|
| `proyects/rematch/rematch-portada-v5.jpg` | **`rematch-portada-v6.jpg`** (2048×1360, 494 KB) |
| `highlights/rematch-v10.jpg` | **`rematch-v11.jpg`** (16:10 desde **y=40**, 467 KB) |
| — | `escenas/rematch-portada-club.png` (la escena cruda) |

`escenas/mock-rematch-portada-v5.jpg` **se conserva**: es la v5 byte a byte y es la red de
seguridad para volver atrás sin generar nada.

**Cuatro** referencias en código, no tres — la cuarta apareció en esta vuelta:
- `src/data/cases/rematch.json` › `image`
- `src/components/axium/highlights-section.tsx` › `cover`
- `src/app/(public)/casos-de-exito/vendiq/VendiqContent.tsx` › `next.image`
- **`src/app/(public)/casos-de-exito/cesaracosta/CesaracostaContent.tsx` › `next.image`** — la ficha
  de César Acosta también encadena con Rematch. **Grepear el nombre del archivo en todo `src/`
  siempre**, porque la lista crece cada vez que se añade una ficha.

### Verificación

- `npx tsc --noEmit` y `npx biome check` limpios.
- En :3111, código HTTP **200** en `/`, `/portafolio`, `/casos-de-exito/rematch`, `/casos-de-exito/vendiq`
  y `/casos-de-exito/cesaracosta`; **404** en las dos rutas viejas; `/_next/image` sirve las dos nuevas.
- A 1440 y a 360: **cero desborde** (`scrollWidth == clientWidth`), **cero imágenes rotas** en las
  cinco páginas, gutters de **16 px iguales** a 360 y tarjeta de 328 px.
- `.next/cache/images` borrado, y nombres nuevos, para que el optimizador no sirva la vieja.

**Crédito gastado: 8,25. Saldo: 962,27 → 954,02.**

## 14. La ficha entera al modelo Pixelmatters, y portadas nuevas (2026-10-06)

Alexander: *«intenta hacer uno así https://www.pixelmatters.com/work/amigo para rematch.
analiza con detalle, afina tu algoritmo para próximos portafolios. actualiza las portadas
larga y cuadrada y todo el use case»*. Referencia analizada en `referencias/pixelmatters.md`.

**Qué cambió.** La ficha deja `CaseStory` (brandvm, lienzo claro) y pasa a un componente
nuevo, `src/components/axium/case-producto/case-producto.tsx` — lienzo `#000E17` (la tinta de
Rematch hundida), título + logotipo, foto a sangre, meta en cinco columnas, texto que alterna
de lado, piezas, cita + CTA, «El resultado» con cifras y el mismo cierre «Más proyectos»
(exportado de case-story como `CaseMasProyectos`).

**Las piezas** (taller `capturas-saas/rematch/pixelmatters-2026-10/`, todo reproducible con
`scripts/taller-rematch-pm.py` y `scripts/videos-rematch-pm.py`):

| Pieza | Qué es | De dónde sale |
|---|---|---|
| `rm-heroe` (+`-movil`) | Mano de un jugador sentado en la pista con live.rematch.pe en el celular | Escena g1 (OpenAI) + viewport real de live a 3x |
| `rm-web.mp4` | rematch.pe recorriéndose en un navegador sobre el campo tinta | 246 capturas por posición de scroll |
| `rm-recepcion` · `rm-banca` | Portátil en la recepción con el calendario del panel · celular en la banca con los torneos de live | Escenas g2/g3 + captura real, esquinas medidas a mano |
| `rm-entrenadora` | Entrenadora con la lista de alumnos de la academia flotando | Escena g4 + recorte del panel |
| `rm-movil.mp4` | rematch.pe en el celular sobre el jugador de noche | 309 capturas de scroll móvil |
| carrusel `rm-c-*` | Torneo publicado (lima) · asistente de torneos (recepción desenfocada) · plan Profesional (tinta) · tabla de liga (gris) | Componentes reales a 3x y recortes del panel |
| `rm-moviles` (+`-movil`) | Tres pantallas: competición, cómo quieres jugar, precios | Viewports reales a 3x |
| `rm-duenio` · `rm-componentes` | Dueño al teléfono con la cobranza · hoja de componentes reales | Escena g7 + KPI del panel · componentes a 3x y trozos de la agenda |
| `rm-agenda.mp4` | El jugador reserva en el celular y la reserva cae en la agenda del club | Screencast con `zoom: 3` |

**Los datos se midieron otra vez y uno estaba mal.** La ficha anterior decía «6 formatos de
torneo»: `prisma/schema.prisma` › `TournamentFormat` tiene **8**. Los **5 deportes con
marcador propio** sí se confirman (`TableTennisScore`, `TennisScore`, `FootballScore`,
`VolleyballScore`, `BasketballScore`). El repo arranca el **2026-01-19**: año 2026.

**Descartados al elegir pantallas:** el dashboard (sus porcentajes salen sin formato,
«5966.279069767442 %»), la llave vacía del torneo («Llave no disponible aún»), las capturas
de torneo en vivo de septiembre (anteriores al rediseño de live), y el directorio de clubes
de live (inquilinos). El asistente de torneos se recortó para dejar fuera el indicador «N» de
Next.js en modo desarrollo que asomaba en la esquina de la captura.

**Portadas** — la misma foto, como hace Pixelmatters en su índice:

| Antes | Ahora |
|---|---|
| `proyects/rematch/rematch-portada-agenda.jpg` (portátil en el banco) | **`rematch-portada-mano.jpg`** (3072×2048; la tarjeta la recorta a 4:3) |
| `highlights/rematch-v11.jpg` (pistas vacías de noche) | **`highlights/rematch-v12.jpg`** (16:10 desde y=64) |

Cinco referencias en código: `src/data/cases/rematch.json`, `highlights-section.tsx`,
`software-development-page.tsx`, y las tarjetas «Siguiente» de **Vendiq** y **César
Acosta**. Las imágenes viejas sin uso (`bv-*`, las cuatro portadas anteriores y la v11) se
borraron; siguen en git.

**Verificado:** `tsc` y Biome limpios; 200 en la ficha, `/portafolio`, el home, Vendiq, César
Acosta y Software a medida; a 1440, 390 y 360 sin desborde, gutter de 16 px en el celular,
cero imágenes rotas, los tres vídeos cargan; es / en / pt. Medido contra el estándar:
**66 %** del cuerpo en imagen, **32** palabras por 1.000 px, párrafo máximo de **38**
palabras.

**Coste:** 7 imágenes OpenAI, 27 428 tokens (23 851 de salida). El resto, 0.

## 15. Lo que se veía mal era de Rematch, y se arregla en Rematch (2026-10-06, misma tarde)

Alexander, revisando la ficha: *«me gusta. pero hay algunas cosas que en el mismo rematch se
ven mal»* — el asistente de torneos con emojis (🏆 🔄 🎯) en vez de la iconografía de la marca,
*«su data de prueba tiene foto cortada»* (el torneo de demostración en live) y *«la portada
está mal diseñada»* (la portada móvil de live: media pantalla negra arriba, el texto sobre la
cara del jugador y una franja blanca abajo). Y dos sobre la ficha misma: la hoja de
componentes (*«parece más problema de recortes tuyos que de la web»*) y el celular de Amigo
como vara (*«mira la elegancia de estos mockups, las sombras, el hiperrealismo»*).

**En Rematch** — rama `fix/iconos-y-detalles-panel` desde `origin/main`, commit `3df64d07`,
**sin empujar** (`main` despliega solo y Gonzalo trabaja ahí):
- Plantillas del asistente: `emoji` → `icono` del motor de vidrio (`trofeo`, `jugadores`,
  `medalla`, `ubicacion`) en el verde de competición.
- Cartel tipográfico de `live/torneos`: el trofeo de vidrio en vez del de lucide.
- Portada móvil de live: `100svh`, el título arriba (en la zona negra de la foto), el buscador
  abajo (`mt-auto`); un `min-w-0` evitó que la fila de chips ensanchara la columna.
- Siembras de demostración sin `flyerUrl` (usaban las fotos del hero, apaisadas, recortadas a
  4:3). En **producción** hace falta el mismo cambio en los datos:
  `scratchpad/rematch-prod-flyers.sql` — **pendiente de OK**, no se ejecutó.
- Verificado en local (3020, base `rematch_dev`, también corregida): asistente con los íconos,
  portada sin desborde a 390 y 360 y alta = pantalla, tarjeta con el cartel tipográfico.

🚨 **Hallazgo que decide Alexander:** el hero de live usa **fotos de jugadores profesionales
reales** (Fan Zhendong en el celular; Calderano, Ma Long, Moregard, Xu Xin y Zhang Jike en
escritorio) y las siembras las reutilizaban como flyers. El comentario del propio archivo dice
«nada de jugadores profesionales reales». Es riesgo de derechos de imagen para Rematch y, al
reproducirlo, para la ficha de Axium. Propuesta: atletas generados con OpenAI, en la serie.

**En la ficha** (nombres nuevos por la caché de `/_next/image`):
- `rm-heroe-v2` + portadas `rematch-portada-mano-v2.jpg` y `highlights/rematch-v13.jpg`: la
  portada de live corregida dentro del celular y la luz de la escena sobre el vidrio.
- `rm-mesa` sustituye a `rm-banca`: escena nueva al modo del celular de Amigo (pared crema,
  tres cuartos con los botones a la vista, sol bajo, reflejo en el roble) con la página de
  academias de rematch.pe. La lista de torneos de live vuelve cuando se corrijan los datos de
  producción.
- `rm-recepcion-v2`: el portátil con la misma pasada de luz.
- Carrusel `-v2`: el asistente con los íconos nuevos (desde local), el torneo con el cartel
  tipográfico (aislado, desde local), el plan Profesional y la liga, recortes aislados.
- `rm-componentes-v2`: todos los componentes **aislados con alfa** (COMPOSITOR, decimotercera § 8).

**Coste de la vuelta:** 2 imágenes (la escena de la mesa con `n: 2`), 8 354 tokens.

## 16. La interfaz no seguía los márgenes del celular (2026-10-06)

Alexander, sobre el celular en la mesa: *«me gustó el estilo pero […] no está bien mockeado,
no sigue los márgenes del celular. fíjate qué podríamos hacer para arreglar ese error en
nuestros prompts»*. Causa: la pantalla negra del prompt se fundía con el bisel negro y el
borde del cristal no se podía medir (esquinas a ojo, radio de oído, isla doble). Arreglo: las
tres escenas con pantalla (mesa, mano, portátil) se editaron con `sunburst` y máscara para
poner la pantalla en **clave magenta**; `componer-escena.py --clave` saca la forma exacta.
Piezas nuevas: `rm-heroe-v3`, `rm-heroe-movil-v3`, `rm-mesa-v2`, `rm-recepcion-v3` y las
portadas `rematch-portada-mano-v3.jpg` y `highlights/rematch-v14.jpg` (cinco referencias
en código actualizadas). **Coste:** 3 ediciones, 15 742 tokens.

## 17. Capítulo de marca, más animación y tres propuestas de portada (2026-10-06)

Alexander: *«recuerda que rematch, lumio, vendiq y bookit son productos propios, se les hizo
todo, branding, logo, paleta, diseño web… Me gusta mucho que hagas animaciones de la web»*, con
tres referencias nuevas (Pixelmatters Vodafone, Significa Dia, Paisanos Kavak).

- **Capítulo de marca** en la ficha (entre el reto y el producto, cerrado con «• • •»): naming
  (Reservo → Rematch, de la guía de marca del repo), **valores** con su definición
  (Eficiente · Accesible · Activa, de `docs/MARKETING_AND_BRAND_GUIDE.md`), y ocho láminas de
  `scripts/laminas-marca.py` con datos del repo: logotipo; sistema del logotipo (las versiones
  apiladas salen del historial de git, commit `95ae3743^`); anatomía del ícono con callouts
  01–03; tipografía con la escala **medida en vivo** (Cal Sans 80/48/34, Satoshi 20/17); paleta
  como tokens con el **contraste medido** (el lima da 1,6:1 sobre blanco → lima oscuro
  `#3F6B00` de 6,3:1); los **29 íconos renderizados desde el código** (`tsx` +
  `renderToStaticMarkup` sobre `components/iconos`) en claro y en oscuro; anatomía del vidrio en
  tres capas; y el vocabulario de deportes en Cal Sans sobre lima.
- **Dos animaciones nuevas** con `scripts/grabar-micro.cjs` + `video-micro.py`: el teléfono de
  live con el marcador set por set (`rm-jugadores`) y los tres pasos vivos (`rm-pasos`).
- Cabecera con **servicios y entregables en lista** (Significa Dia).
- Medido: 68 % del cuerpo en imagen, 29 palabras por 1.000 px, párrafo máximo 42, 5 vídeos.
- **Portada:** la mano con el celular se rechazó (*«los bordes están feos, la portada no me
  convence»*): el aparato era generado. Tres propuestas con el aparato construido en
  `scripts/portada-rematch-propuestas.py` → `public/comparar-portadas-rematch.html`
  (A cenital sobre el césped, B dos celulares sobre tinta y lima, C la mesa). Pendiente de su
  elección; recomendada A. Coste de los dos campos: 3 imágenes, 12 977 tokens.

## 18. Portada elegida: A, sobre la cancha (2026-10-06)

Alexander: *«el A está bien»*. Se compuso en sus cuatro formatos —no se recorta de la 4:3: el
celular girado mide ~1.960 px y un 16:10 de 3072 deja 1.920— con `portada-rematch-propuestas.py
--formatos`: `rematch-portada-cancha.jpg` (4:3, /portafolio y tarjetas «Siguiente» de Vendiq y
César Acosta), `highlights/rematch-v15.jpg` (16:10, home), `rm-heroe-cancha` (1,8:1) y
`rm-heroe-cancha-movil` (1:1). Borradas las v12–v14, la mano y la página de comparación.
Verificado: 200 en las seis páginas, sin desborde a 360.

## 19. El capítulo de marca, rehecho desde el manual real (2026-10-06)

Alexander, con captura de la anatomía del ícono: *«MANUAL DE MARCA-REMATCH-ALEX usa eso en
descargas para el manual de marca, no inventes taaanto… ¿qué representan esos 3 puntos? si
alguien se pone a analizar no entenderá el propósito, a eso me refiero con inventar»*.

- **La fuente:** `~/Downloads/ENTREGA FINAL-REMATCH-ABRIL-2026/` — manual de 20 páginas (PDF y
  AI), logotipos CMYK/RGB, `PALETA DE COLOR`, tipografías **Loos Condensed** (titulares) y
  **Halyard Display** (textos), línea gráfica (2 banners, 3 posts) y 6 mockups. Copia del PDF
  en `~/Downloads/MANUAL DE MARCA-REMATCH-ALEX.pdf`. Texto y miniaturas en
  `capturas-saas/rematch/pixelmatters-2026-10/marca/manual/`.
- **Lo que estaba mal:** la anatomía del ícono (01–03) y la del vidrio eran forma de Kavak sin
  dato detrás; el vocabulario de deportes, inventado; la tipografía decía Cal Sans + Satoshi
  (las de la web) y la paleta, mis tokens (`#B4DF00`) en vez de los del manual (`#B5DF01`,
  `#001D30`, `#003968`, `#F2F2F2`, `#7EB504`). Borradas: `rm-marca-{logo,sistema,icono,
  tipografia,paleta,vidrio,vocabulario}.jpg`.
- **Lo que queda (todo de la entrega, `scripts/manual-rematch.py`):** naming y valores del brief
  del repo · fachada (mockup) · versiones de logo y de color (páginas 5 y 6) · tipografías
  (página 10, sin su ejemplo en lorem ipsum) y la paleta entregada · el glosario (página 15,
  sin el número de página) con la voz citada del manual · los tres posts · carrusel de
  aplicaciones (taza, credencial, papelería, calendario, lapiceros) · y los 29 íconos del
  producto (son del código, no del manual), con un texto sin callouts.
- Entregables de la cabecera: «Manual de marca, Línea gráfica, 29 íconos…».

