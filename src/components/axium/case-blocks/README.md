# Bloques de las fichas de caso

Los bloques compartidos que usan las fichas de `src/app/(public)/casos-de-exito/`. Se importan desde la carpeta:

```tsx
import { CaseArticle, CaseHeroSplit, CaseImages, CaseNextProject } from "~/components/axium/case-blocks";
```

| Bloque | Qué es |
|---|---|
| `CaseHeroSplit` | Texto a la izquierda e imagen a la derecha, con degradado configurable |
| `CaseHeroFullImage` | Imagen a todo el ancho con velo y el texto encima |
| `CaseArticle` · `CaseArticleText` · `CaseArticleWide` | El cuerpo editorial de la ficha: columna de texto y piezas a lo ancho |
| `CaseImages` | Imágenes dentro del artículo, solas o en grupo |
| `CaseFeatureShowcase` | Grilla de funciones con ícono, título y descripción, sobre fondo oscuro |
| `CaseScopeList` | Lista de entregables en dos columnas |
| `CaseNextProject` | La tarjeta del siguiente proyecto, al pie de la ficha |

Las fichas con identidad propia del cliente arman sus secciones en su `<Slug>Content.tsx` (ver la skill `portafolio-axium`, `ESTANDAR-FICHA.md`). De aquí reutilizan sobre todo `CaseNextProject`, y de fuera, `CaseContactCTA`.

El 2026-10-23 se borraron los 14 bloques que ya no usaba ninguna ficha: el hero mínimo, overview, «sobre el proyecto», testimonio, línea de tiempo, métricas, meta del proyecto, barra de datos, paleta de colores, las tres galerías, el vídeo y el divisor. Están en el historial de git si alguno vuelve a hacer falta.
