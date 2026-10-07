#!/usr/bin/env python3
"""Persona real + UI flotando encima (R28, Paisanos/Brubank), 2026-10-07, Aurore.

Sobre una foto de vida, una o varias piezas REALES de la web (aisladas con alfa por
aislar-piezas.cjs) dentro de un vidrio esmerilado: el fondo de debajo se desenfoca, se aclara,
lleva un filo claro de 1 px y una sombra suave. Ninguna pieza se dibuja: todas son capturas.

  python3 componer-flotantes.py --foto escena.png --salida pieza.jpg [--lienzo 3200x1600]
      --pieza "tarjeta.png,x,y,ancho[,relleno[,radio]]" [--pieza …]

x, y y ancho van en fracciones del lienzo (0–1); relleno y radio en px del lienzo. Las piezas
se pintan en el orden dado (la última queda encima).
"""
import argparse

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ap = argparse.ArgumentParser()
ap.add_argument("--foto", required=True)
ap.add_argument("--salida", required=True)
ap.add_argument("--lienzo", default="3200x1600")
ap.add_argument("--pieza", action="append", required=True)
ap.add_argument("--desenfoque", type=float, default=38)
ap.add_argument("--aclarado", type=float, default=0.42)
a = ap.parse_args()

W, H = [int(v) for v in a.lienzo.split("x")]
foto = Image.open(a.foto).convert("RGB")
fw, fh = foto.size
if fw / fh > W / H:
    nw = round(fh * W / H)
    foto = foto.crop(((fw - nw) // 2, 0, (fw - nw) // 2 + nw, fh))
else:
    nh = round(fw * H / W)
    foto = foto.crop((0, (fh - nh) // 2, fw, (fh - nh) // 2 + nh))
base = foto.resize((W, H), Image.LANCZOS).convert("RGBA")
borrosa = base.filter(ImageFilter.GaussianBlur(a.desenfoque))

for spec in a.pieza:
    partes = spec.split(",")
    ruta, fx, fy, fa = partes[0], float(partes[1]), float(partes[2]), float(partes[3])
    relleno = int(partes[4]) if len(partes) > 4 else 28
    radio = int(partes[5]) if len(partes) > 5 else 34
    pz = Image.open(ruta).convert("RGBA")
    pz = pz.crop(pz.getbbox())
    pw = round(W * fa)
    ph = round(pz.height * pw / pz.width)
    pz = pz.resize((pw, ph), Image.LANCZOS)
    x, y = round(W * fx), round(H * fy)
    vx0, vy0, vx1, vy1 = x - relleno, y - relleno, x + pw + relleno, y + ph + relleno
    # sombra suave, caída hacia abajo
    sombra = Image.new("L", (W, H), 0)
    ImageDraw.Draw(sombra).rounded_rectangle((vx0, vy0 + 26, vx1, vy1 + 26), radius=radio, fill=120)
    sombra = sombra.filter(ImageFilter.GaussianBlur(44))
    capa = Image.new("RGBA", (W, H), (60, 40, 20, 0))
    capa.putalpha(sombra)
    base = Image.alpha_composite(base, capa)
    # vidrio: lo de debajo desenfocado y aclarado
    m = Image.new("L", (W, H), 0)
    ImageDraw.Draw(m).rounded_rectangle((vx0, vy0, vx1, vy1), radius=radio, fill=255)
    vidrio = Image.blend(borrosa, Image.new("RGBA", (W, H), (255, 252, 246, 255)), a.aclarado)
    base = Image.composite(vidrio, base, m)
    # filo claro
    filo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(filo).rounded_rectangle((vx0, vy0, vx1, vy1), radius=radio, outline=(255, 255, 255, 150), width=2)
    base = Image.alpha_composite(base, filo)
    base.alpha_composite(pz, (x, y))
    print(f"pieza {ruta.split('/')[-1]}: {pw}×{ph} en ({x}, {y})")

out = np.asarray(base.convert("RGB")).astype(np.float32)
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(a.salida, quality=90, optimize=True, progressive=True)
print("→", a.salida, (W, H))
