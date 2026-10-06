#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Recorta un producto fotografiado sobre fondo claro: el fondo es la componente
conexa de píxeles claros que toca el borde. Sin OpenCV ni scipy."""
import sys
import numpy as np
from PIL import Image, ImageFilter


def recortar(path, salida, umbral=232, suave=1.2, iteraciones=400):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im, dtype=np.float32)
    L = a.mean(axis=2)
    S = a.max(axis=2) - a.min(axis=2)
    claro = (L > umbral) & (S < 26)          # candidatos a fondo

    # reconstrucción morfológica desde el borde, sobre una copia submuestreada
    k = 4
    c = claro[::k, ::k]
    m = np.zeros_like(c)
    m[0, :] = c[0, :]; m[-1, :] = c[-1, :]; m[:, 0] = c[:, 0]; m[:, -1] = c[:, -1]
    for _ in range(iteraciones):
        n = m.copy()
        n[1:, :] |= m[:-1, :]; n[:-1, :] |= m[1:, :]
        n[:, 1:] |= m[:, :-1]; n[:, :-1] |= m[:, 1:]
        n &= c
        if n.sum() == m.sum():
            break
        m = n
    fondo = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).resize(
        (claro.shape[1], claro.shape[0]), Image.NEAREST), dtype=np.uint8) > 127
    fondo &= claro

    alfa = Image.fromarray(((~fondo) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(suave))
    out = im.convert("RGBA")
    out.putalpha(alfa)
    bb = out.getbbox()
    out = out.crop(bb)
    out.save(salida)
    print(f"✓ {salida}  {out.size}  fondo={fondo.mean()*100:.1f} %")
    return out


if __name__ == "__main__":
    recortar(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 232)
