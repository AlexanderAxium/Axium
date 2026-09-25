# Axium hoy — el estado real antes de tocar nada

Verificado leyendo el repo el 2026-09-01, rama `axium`. Si algo de acá no cuadra
con lo que se ve en el código, **gana el código** y hay que corregir este archivo.

---

## Los archivos que importan

| Qué | Dónde |
|---|---|
| Página del índice | `src/app/(public)/portafolio/page.tsx` |
| El índice completo (grilla, filtros, paginación) | `src/components/axium/portfolio-page-content.tsx` — **863 líneas, `"use client"`** |
| Teaser en el home (carrusel) | `src/components/axium/cases-section.tsx` — 356 líneas |
| Fichas de caso | `src/app/(public)/casos-de-exito/<slug>/` — una carpeta por proyecto |
| Bloques reutilizables de ficha | `src/components/axium/case-blocks/` — **22 bloques** + `README.md` |
| Datos de cada proyecto | `src/data/cases/*.json` — **33 archivos** |
| Tipo y ensamblado | `src/data/cases-data.ts`, `src/lib/case-translations.ts` |
| Traducciones de casos | `src/locales/{es,en,pt}/cases.json` |
| Imágenes | `public/images/proyects/<slug>/` — **33 carpetas** |
| Tokens de marca | `src/app/globals.css` |
| Cursor magnético | `src/components/axium/magnetic-cursor-arrow.tsx` |

Stack: Next.js (App Router, `--turbo`), Tailwind, shadcn/ui, `motion/react`,
Prisma. Trilingüe (es / en / pt) — **cualquier texto nuevo del portafolio necesita
sus tres traducciones**, o sale el string crudo en las otras dos.

## Tokens de marca

```
--font-family-sans:    "Gilroy"         (400/500/600/700, local)
--font-family-heading: "GuarujaTitle"   (local)

#060C20  navy — texto principal y fondos oscuros
#0072CF  azul — acento, hover de títulos, chips de servicio
#7ECFC3  teal — chips de tecnología
```

**Dato de las referencias (2026-09-01):** Adelt — la referencia que Alexander
eligió como modelo para rediseños — usa **Gilroy 400/500/600 y nada más**, en
una escala 54 → 35 → 32 → 25 → 22 → 18 → 16 → 14. La fuente de Axium alcanza;
lo que falta es la escala y la disciplina de pesos. Y los cuatro `@font-face`
son `font-style: normal`: **no hay itálica real**.

**Decisiones de Alexander (2026-09-01):** radio y píldora ("lo comercial");
personalidad por proyecto (el color del cliente entra en la portada);
animaciones sutiles (scroll suave, pocas entradas — modelo Adelt).

Utilidades tipográficas propias en `globals.css`: `.text-heading-1/2/3`
(GuarujaTitle) y una serie de escalas pequeñas con `uppercase` y
`tracking-[0.2em]`.

## La tarjeta de hoy, tal cual está

`PortfolioCard` en `portfolio-page-content.tsx`:

- Contenedor `aspect-[4/3]`, `rounded-xl`, `overflow-hidden`, `bg-gray-100`
- `next/image` con `fill`, `object-cover`, `quality={85}`
- Hover: `scale-[1.03]`, 500ms
- Debajo: chips de industria y servicio (píldora blanca, borde gris, texto gris)
- Título en `.text-heading-2`, navy, hover a `#0072CF`
- Entrada: `opacity 0→1`, `y 16→0`, 0.35s, delay escalonado tope 0.24s
- Todo envuelto en `MagneticCursorArrow` con la etiqueta "Ver proyecto"

## Los filtros de hoy

Tres ejes, definidos a mano como listas de slugs dentro del componente:

- **Industria** — 15 etiquetas para 33 proyectos
- **Servicio** — Tienda Virtual, E-Learning, Branding, Web Informativa, …
- **Tecnología** — Next.js, WooCommerce, TypeScript, Blockchain, …

`ITEMS_PER_PAGE = 20`, ordenamiento `default / az / za`, panel lateral en móvil
con `Sheet`, chips de filtro activo, y `FILTER_VISIBLE = 8` con "ver N más".

## Tipos de proyecto en los datos

`platform` en los 33 JSON: Web 25 · Web (SaaS) 3 · Web App 1 · Web & Mobile 1 ·
Web y Brochure 1 · Web + Sistema 1 · Backend / Pipeline 1.

`services` mezcla **entregables** ("Manual de Marca" ×2, "Brochure digital",
"Redes sociales", "Branding completo", "Identidad de Marca", "Diseño de Marca",
"Plataforma E-Learning" ×2, "App de Escritorio") con **funcionalidades**
("Checkout", "Contacto WhatsApp" ×3, "Libro de Reclamaciones" ×3, "Pasarela de
pagos" ×3…). No hay un campo que diga *qué tipo de proyecto es*.

Combinaciones reales hoy:
- Solo web informativa / tienda: la mayoría.
- Web + branding (+ manual): `maintech` (+ e-learning + móvil), `happyart`,
  `villacer`.
- Web + brochure: `transportesrumi` (la portada actual **es** el brochure).
- Web + redes sociales + sistema: `ambientalpe`.
- SaaS / web app: `feedback-management`, `financial-management`, `store-saas`,
  `siclo`, `feniz`.
- E-learning: `maintech`, `vitalchain`.
- Backend sin pantalla: `web-scraping-ai`.

→ La propuesta tiene que agregar `deliverables: string[]` al JSON con la
taxonomía de `IMAGENES.md` § Tipos de proyecto, y derivar de ahí tanto la
receta de imagen como el filtro de "Servicio" (que hoy es una lista a mano).

## Inconsistencias verificadas

Datos, no opiniones. Se arreglan de paso o se anotan como fuera de alcance.

1. **`fenalsa` y `web-scraping-ai` no aparecen en ninguna lista de filtros** de
   `portfolio-page-content.tsx`. Existen en `src/data/cases/`, tienen carpeta de
   imágenes y ficha de caso, pero cualquier filtro activo los desaparece.
   `fenalsa` tampoco está en el `slugMap` (funciona de casualidad porque el
   fallback `title.toLowerCase()` da "fenalsa").
2. **El `slugMap` está duplicado** literalmente en `portfolio-page-content.tsx` y
   en `cases-section.tsx`. Dos copias que ya divergieron.
3. **Las listas de filtros son slugs a mano dentro del componente**, no campos
   del JSON. Agregar un proyecto obliga a editar el componente en 3 lugares — que
   es exactamente por qué (1) pasó.
4. `public/images/proyects/fenalsa/fenalsa-desc-1.jpg` figura como borrado en el
   estado de git.

## Los assets: por qué la grilla se ve desordenada

Correr `node .claude/skills/portafolio-axium/inventario.mjs` para el detalle
actualizado. Lo que dijo el 2026-09-01:

- **29 de 33 portadas están en ratio 3:2 (1.50), y la tarjeta las muestra en
  4:3.** `object-cover` recorta ~11% del ancho de casi todas — laterales de la
  UI que desaparecen en la grilla sin que nadie lo haya decidido. Dos están en
  1.56, una en 1.37 y una en 1.72 (`web-scraping-ai`, la peor recortada).
  → **Decidir el ratio de la tarjeta es la primera decisión de la propuesta**:
  o la tarjeta pasa a 3:2 y las 33 portadas dejan de recortarse, o se queda en
  4:3 y las 33 se regeneran en 4:3. No hay tercera opción sin recorte.
- **21 portadas miden exactamente 1536×1024** — el tamaño de salida estándar de
  generadores de imagen. Es probable que buena parte ya sea producción con IA o
  mockups exportados a ese tamaño. Preguntarle a Alexander cuáles y con qué
  herramienta: si ya hay un flujo, los prompts nuevos deben encajar en él.
- **9 portadas hay que producir de nuevo sí o sí:** 5 por baja resolución
  (`huarmis` 819×599, `maintech` 1179×786, `podologiemtk` 1270×847,
  `toliveagain` 655×437, `villacer` 1302×868), 1 por ratio (`web-scraping-ai`),
  y 3 porque **no tienen `liveUrl`** y no se pueden recapturar
  (`feedback-management`, `financial-management`, `store-saas` — los tres son
  SaaS internos; su única evidencia es la portada que ya existe).
- **30 de 33 pesan más de 400 KB**, varias por encima de 1.5 MB. Una grilla que
  carga 33 de esas es un problema de rendimiento antes que de diseño. Al
  producir las nuevas, exportar en WebP/AVIF y en el tamaño que la tarjeta pide.
- Los assets van de **1 a 7 imágenes** por proyecto; 10 proyectos tienen la
  portada y nada más. Mezcla de `.jpg` y `.png`; los nombres mezclan
  `<slug>-hero`, `<slug>-home`, `amb1`, `iconotipo`.
- **Y lo que más se nota: mezcla de tratamientos.** Capturas crudas del home,
  mockups en dispositivo, recortes de sección y un brochure (`transportesrumi`),
  todas en la misma grilla con el mismo recorte. Se lee como una carpeta de
  archivos, no como el trabajo de un estudio.

## Debilidades del diseño actual

**Hipótesis mías, para que Alexander confirme o tumbe** — no son hechos como los
de arriba, y ninguna debería sobrevivir a la propuesta sin que él la haya visto.

1. **La tarjeta es la de la plantilla.** Rectángulo redondeado + chip gris +
   título es literalmente el patrón por defecto de cualquier tema de agencia. No
   hay un solo gesto que sea de Axium.
2. **La grilla se lee ruidosa** por lo de los tratamientos mezclados. Es el
   problema que más rinde arreglar, y el que justifica todo el trabajo de
   imágenes.
3. **33 proyectos planos, todos con el mismo peso.** No hay destacados ni
   jerarquía: el mejor trabajo compite en igualdad con el más chico.
4. **El recorte 3:2→4:3 es sistemático** (ya probado arriba); lo que sigue
   siendo hipótesis es *cuánto* se nota y si conviene cambiar la tarjeta o las
   imágenes.
5. **15 industrias para 33 proyectos** no es un filtro útil; varias tienen un
   solo proyecto adentro.
6. **La animación de entrada es el fade-up genérico** (opacity + 16px + delay
   escalonado). Funciona, pero no dice nada.
7. **El componente de 863 líneas mezcla datos, filtros, tarjeta y layout.**
   Cualquier rediseño serio pasa por separar los datos de filtro hacia los JSON.

## Los SaaS propios van al final (Alexander, 2026-09-01)

*"mis SaaS propios son Rematch, Lumio, NextFact, Vendiq, Bookit, déjalas para el
final, concentrémonos en lo que ya tenemos."*

Aclaración suya sobre los 4 JSON tipo SaaS:

| JSON | Qué es | Fase |
|---|---|---|
| `financial-management` | **Suyo. Se renombra a Fintrace**: sistema de tesorería y finanzas para empresas pequeñas. Aún no está subido con ese nombre — **anotado para cuando entre** | Fase 2 (productos propios) |
| `store-saas` | "E-commerce & Inventory SaaS" — no lo mencionó; por el rubro es probablemente **Vendiq**. **Confirmar** | Fase 2 (si es Vendiq) |
| `feedback-management` | **No es suyo** → proyecto de cliente | Fase 1 |
| `siclo` | Sistema de instructores **para Síclo** (cliente) | Fase 1 |

**NextFact** es su sistema de facturación; no está en el repo todavía. Con
Fintrace, Vendiq, Bookit, Rematch y Lumio forman la fase 2 ("Productos
propios", separados del trabajo para clientes como hace Koto con Projects /
Partnerships).

→ **Fase 1: 31 proyectos** (33 − `financial-management` − `store-saas`), todos
trabajo para clientes. Si `store-saas` resulta no ser Vendiq, son 32.

## Alcance del rediseño — a confirmar con Alexander

- [ ] ¿Solo el índice `/portafolio`, o también el carrusel del home
      (`cases-section.tsx`) y las fichas de caso?
- [ ] ¿Se regeneran las portadas de los 33 o solo las 9 críticas?
- [ ] ¿Las 21 portadas de 1536×1024 ya salieron de un generador? ¿Cuál?
- [ ] ¿Entra el arreglo de los filtros (mover a los JSON) o queda fuera?
- [ ] ¿`fenalsa` y `web-scraping-ai` entran al portafolio o estaban fuera a
      propósito?
