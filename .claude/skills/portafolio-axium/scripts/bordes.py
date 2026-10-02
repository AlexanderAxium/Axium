#!/usr/bin/env python3
"""Tira de contacto de las bandas de borde de una imagen.

La detección de franjas muertas no ve un fragmento cortado contra el canto
(una mano, una manga, medio objeto): un fragmento no crea una banda plana,
crea lo contrario. Así se coló `fe-limpieza` con un «ok» de la medición.

Este script recorta la banda exterior de cada lado y las monta en una sola
imagen, para MIRARLA con Read. Ver ESTANDAR-FICHA.md § «El borde se mira».

    python3 scripts/bordes.py public/images/proyects/fenalsa/fe-gastro.jpg [...]
"""
import sys, os
from PIL import Image, ImageDraw

BANDA = 0.08   # fracción del lado que se considera «borde»
ANCHO = 1200   # ancho de la tira resultante


def bandas(p):
    im = Image.open(p).convert("RGB")
    w, h = im.size
    bw, bh = max(8, int(w * BANDA)), max(8, int(h * BANDA))
    return im, {
        "izquierda": im.crop((0, 0, bw, h)),
        "derecha":   im.crop((w - bw, 0, w, h)),
        "arriba":    im.crop((0, 0, w, bh)),
        "abajo":     im.crop((0, h - bh, w, h)),
    }


def tira(p, destino):
    im, bs = bandas(p)
    # las verticales se giran para que quepan apiladas
    piezas = []
    for nombre, b in bs.items():
        if nombre in ("izquierda", "derecha"):
            b = b.transpose(Image.ROTATE_90)
        r = ANCHO / b.width
        piezas.append((nombre, b.resize((ANCHO, max(1, int(b.height * r))), Image.LANCZOS)))
    alto = sum(x.height for _, x in piezas) + 26 * len(piezas)
    out = Image.new("RGB", (ANCHO, alto), (245, 245, 245))
    d = ImageDraw.Draw(out)
    y = 0
    for nombre, x in piezas:
        d.text((6, y + 7), f"{nombre}  ({os.path.basename(p)})", fill=(20, 20, 20))
        y += 26
        out.paste(x, (0, y))
        y += x.height
    out.save(destino)
    return im.size, destino


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    salida = os.environ.get("BORDES_OUT", "/tmp")
    for p in sys.argv[1:]:
        dest = os.path.join(salida, "bordes-" + os.path.splitext(os.path.basename(p))[0] + ".png")
        tam, d = tira(p, dest)
        print(f"{os.path.basename(p)} {tam[0]}x{tam[1]} -> {d}")
