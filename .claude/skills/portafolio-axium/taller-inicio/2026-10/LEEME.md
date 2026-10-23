# Piezas del inicio con OpenAI (2026-10-23)

## El CTA debajo del proceso

Alexander pidió: «abajo de eso haz un CTA con un fondo corporativo de personas reales, como estos estilos y colores», y pasó las portadas del blog de operaciones y de facturación.

- Prompt: `cta-taller.txt`, con el bloque de estilo del blog (`taller-blog/2026-10/_estilo.txt`). La escena es la fase 1, el taller con el equipo en una sala de vidrio a la hora azul, con las caras suavizadas por el movimiento. El 45 % de la izquierda queda como pared oscura para el titular.
- Tanda: `gpt-image-2.5-flare`, 3072×1536, calidad alta, n=2. Fueron 3 870 tokens de salida, apuntados en `scripts/gastos-openai.jsonl`.
- Se eligió `cta-taller-1.png`: tiene más vida y se lee como taller (uno señala los pliegos de la pared). La 2 es parecida y está más vacía. Pasó a `public/images/inicio/cta-taller.jpg` a 2880×1440 (q84, 255 KB); desde el 2026-10-23, `cta-taller-recorte.jpg` (1782×1536, sin la pared oscura de la izquierda: el 42 % del ancho).
- Se monta en `src/components/axium/cta-proceso.tsx`. En el celular se encuadra con `object-[96%_50%]` para que entren la pared y la mano.
