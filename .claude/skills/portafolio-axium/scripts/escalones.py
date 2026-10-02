#!/usr/bin/env python3
"""Detecta ESCALONES DE CAMPO: saltos rectos que cruzan casi todo el lienzo.

El canto de una tarjeta tambien salta, pero no cruza el 88 % del largo con un
salto uniforme; un rectangulo de velo que termina en alfa != 0, si. Eso es lo
que se ve como «cambio brusco de color». Ver COMPOSITOR.md § «La causa de los
cambios bruscos de color».

    python3 scripts/escalones.py public/images/proyects/clefast/*.jpg
"""
import numpy as np, sys, os
from PIL import Image

for p in sys.argv[1:]:
    im = Image.open(p).convert("RGB")
    a = np.asarray(im.resize((900, max(1, int(im.height * 900 / im.width))), Image.LANCZOS)).astype(np.float32)
    l = 0.299 * a[:, :, 0] + 0.587 * a[:, :, 1] + 0.114 * a[:, :, 2]
    H, W = l.shape
    df, dc = np.abs(np.diff(l, axis=0)), np.abs(np.diff(l, axis=1))
    filas = [(y, (df[y] > 4).mean(), df[y].mean()) for y in range(H - 1) if (df[y] > 4).mean() > 0.88]
    cols  = [(x, (dc[:, x] > 4).mean(), dc[:, x].mean()) for x in range(W - 1) if (dc[:, x] > 4).mean() > 0.88]
    print("%-26s %d filas, %d columnas" % (os.path.basename(p), len(filas), len(cols)))
    for y, f, m in filas[:4]:
        print("    fila  y=%4d  %.0f%% del ancho, salto medio %.1f" % (y, f * 100, m))
    for x, f, m in cols[:4]:
        print("    col   x=%4d  %.0f%% del alto,  salto medio %.1f" % (x, f * 100, m))
