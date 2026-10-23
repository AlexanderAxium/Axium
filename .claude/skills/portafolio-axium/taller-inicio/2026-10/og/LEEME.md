# Piezas Open Graph del sitio (2026-10-23)

Alexander pidió: «al acabar métele un SEO brutal, quiero que la gente me empiece a encontrar por Google, genera las piezas gráficas para el SEO con OpenAI».

Son las imágenes que aparecen al compartir un enlace en WhatsApp, LinkedIn o Facebook. Están en `public/og/og-<pieza>.jpg`, a 1200×630 y entre 60 y 94 KB.

- **Escenas:** `<pieza>.txt` → `<pieza>.png`, con `gpt-image-2.5-flare` a 2400×1264, calidad alta y n=1. Fueron 9 tanto en escenas como en llamadas, a 1 511 tokens de salida cada una, 13 599 en total, apuntados en `scripts/gastos-openai.jsonl`.
  - Todas llevan el bloque de estilo del blog (`taller-blog/2026-10/_estilo.txt`), con la mitad izquierda oscura para el titular.
  - No llevan texto ni pantallas con contenido.
- **Composición:** `node componer-og.mjs`. Toma la escena, le pone un velo navy a la izquierda y encima el logo blanco (`public/logo3.png`), el titular en GuarujaTitle, una línea en Gilroy Medium y «axium.com.pe».
  - El texto va en código y se cambia en `PIEZAS`.
  - Sin «Servicios · …»: el punto medio entre palabras es rasgo de página hecha por IA.
- **Piezas y dónde se usan:**
  - `inicio`: el inicio, y por defecto en cualquier página que no tenga la suya.
  - `servicio-{diseno,web,software,ia,iot,cloud}`: sus páginas de servicio.
  - `portafolio`: `/portafolio`.
  - `blog`: `/blog`.
  - Los casos y los artículos usan su propia portada (`data.image` y `BLOG_PORTADAS`).
- **Para rehacer una:** se edita su `.txt`, se vuelve a generar solo esa con `openai-imagen.py` (anunciando el gasto) y se corre `componer-og.mjs`.
