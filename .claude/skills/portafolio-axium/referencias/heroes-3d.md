# Heroes con 3D real (WebGL) en software houses y consultoras (2026-10-12)

Para la ronda 9 del hero de axium.com.pe (propuestas 29–32 en three.js).
- **Sondeo:** ~440 software houses y consultoras, una carga cada una con 7 s de espera y la GPU real
  en headless (`--use-angle=metal --ignore-gpu-blocklist`).
- **Capturadas:** 19, en `capturas/heroes-3d/` (`-d`, `-m` y `-t1/-t2/-t3` a 1,5 s, 4 s y 8 s).
- **Medidas:** en `capturas/heroes-3d/medidas.json`:
  - canvas y contexto;
  - revisión de three;
  - movimiento: % de píxeles que cambian entre 8 s y 9 s, y entre 12 s y 12,5 s;
  - reacción al puntero.
- **El sondeo crudo:** `probe.json`, en el scratchpad de la sesión.

**3D real en el hero hay en muy pocas: ~13 de ~440.**
- Se concentran en los nórdicos y Francia: Bekk, Knowit, Vincit, Theodo, Takima.
- Las grandes integradoras y casi todas las polacas y ucranianas no tienen.
- **Se asientan solo FPT, dreipol y Takima** (esta casi quieta). Todas las demás quedan en bucle.
  Vincit lo compensa con un botón visible de pausa.
- **En móvil casi siempre es el mismo 3D,** no un vídeo ni una imagen de reemplazo. FPT es la
  excepción: a los 8 s el móvil sigue en un degradado vacío.

| Sitio | Qué es | Motivo 3D | ¿Se asienta? | Puntero | Librería | Qué se le roba (técnica) |
|---|---|---|---|---|---|---|
| fptsoftware.com | Grupo de software (Vietnam) | Baldosas con su logo extruido que se voltean en ola sobre un «planeta» naranja | **Sí: 0 % de cambio desde los 8 s** | Sí | three r157 + glTF | Una entrada y quietud, el puntero como único movimiento después. Es la regla de «animación sutil» |
| bekk.no | Consultora (Noruega) | Cajas de solo aristas, negras sobre lima, que crecen en una torre que se balancea | No (3–4 %) | No claro | three r186 | Dibujar solo aristas en un color de marca: el 3D se lee como ilustración, sin luces |
| cubos.io | Software house (Brasil) | Su logo, un anillo redondeado, con **vídeo de proyectos dentro del trazo**, sobre curvas de nivel | No | Sí | WebGL2 | El isotipo como máscara o geometría que lleva vídeo real (textura de vídeo) |
| vincit.com | Consultora (Finlandia) | Un tubo grueso en degradado que serpentea detrás del titular | No (bucle) | Sí | three r160 | Tubo sobre una curva animada y **botón de pausa visible** |
| knowit.se | Consultora (nórdica) | Aurora en shader dentro de una tarjeta, **movida por el clima en vivo** de una ciudad con oficina; el pie dice temperatura, viento y hora | No | Sí | WebGL sin three | Alimentar el shader con un dato real (el clima y la hora de Lima) y decir de dónde sale |
| dreipol.ch | Producto digital (Suiza) | Un anillo de luz que se vuelve una mancha brillante; el titular cambia de frase encima | Casi (0,18 % a los 12 s) | **Fuerte** | three r175 | Una sola luz que sigue al puntero |
| theodo.com | Consultora (Francia) | Campo de cientos de líneas que ondulan despacio | No (1–2 %) | No | Unicorn Studio en Webflow | 3D sin escribir three.js |
| weevolveit.com | Consultora de IA (México) | Globo de puntos con arcos y un pin con **la ciudad del visitante** («ONLINE · TACNA»: detectó la IP) | No | No | three r184 | Arco desde la ciudad del visitante hasta Lima (ojo: es tratar un dato personal) |
| takima.fr | Consultora (Francia) | Campo tenue de íconos 3D de arcilla (nubes, monitores con «<DevSecOps>», «<AI Natives>») detrás de una tarjeta de vidrio | Casi quieto (0,1 %) | Paralaje leve | three r169 | Los nombres de los servicios escritos sobre los objetos |
| hypersolid.com | **En el límite:** «empresa de tecnología y experiencia de marca» | Su logo, una X de cuatro piezas de metal que se separan y se juntan; en móvil, otro objeto de vidrio | No | — | three r175 + logo.glb con Draco | El logo partido en piezas que se arman |

Más flojas o fuera del rubro:
- **scandiweb:** seda genérica.
- **inthepocket:** degradado con grano, no 3D.
- **faculty.ai:** «persianas» quietas que solo se mueven con el puntero; buena idea.
- **bitfalk:** halcón fotorrealista, quieto.
- **Estudios creativos:** activetheory, ohzi, monogrid, utsubo y phantom.land.

**Lo más transferible es atar el 3D a un dato real:** el clima de Knowit, la ciudad del visitante
de WeEvolveIT, los vídeos de proyectos dentro del logo de Cubos.

## Cómo se emparejaron con las propuestas

Las referencias se buscaron **después** de construir las propuestas: son las que más se parecen, no
de donde salieron.

| Propuesta | Referencia |
|---|---|
| 29 · las tres piezas | hypersolid.com (logo en piezas) |
| 30 · sin cajas negras | cubos.io (logo como objeto) |
| 31 · bases sólidas | fptsoftware.com (bloques en ola, una vez) |
| 32 · capa por capa | bekk.no (cajas apiladas) |

Tablero: `capturas-clientes/axium-hero/2026-10/tablero-ronda9-referencias.jpg`.

## Veredicto de Alexander

(pendiente)
