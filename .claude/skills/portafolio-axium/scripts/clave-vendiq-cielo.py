#!/usr/bin/env python3
"""La imagen clave de Vendiq con la portada «cielo» (2026-10-21): el panel sobre el cielo.

Las dos piezas son reales y de vendiq.pe: la foto del cielo de su hero
(`public/images/portada/hero/cielo-escritorio.webp`, sacada de origin/main) y la ventana del
panel del hero aislada a 3x con transparencia (capturar-vendiq-cielo.cjs panel). Sin titular:
la ficha y las tarjetas ponen el suyo. Nada generado.

  python3 clave-vendiq-cielo.py <cielo.webp> <panel.png> <dir-salida>

Salen:
  · vq-cielo-heroe.jpg     2400×1350  (16:9, el héroe de la ficha)
  · vq-cielo-cuadrada.jpg  1300×1300  (el héroe en el celular)
  · vendiq-portada-cielo.jpg 3072×2048 (4:3, tarjeta de /portafolio y «siguiente proyecto»)
  · vq-cielo.mp4 + .jpg    2400×1500  (16:10, el destacado del home): bucle de 8 s en el que el
    cielo deriva y el panel flota apenas («animación sutil»: un solo objeto, despacio).
"""
import math
import os
import subprocess
import sys
import tempfile

import numpy as np
from PIL import Image, ImageFilter

CIELO, PANEL, OUT = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)
cielo = Image.open(CIELO).convert("RGB")
panel = Image.open(PANEL).convert("RGBA")


def fondo(W, H, zoom=1.0, dx=0.0):
    """El cielo a cubrir el cuadro, con un poco de zoom y deriva horizontal (fracción del ancho)."""
    s = max(W / cielo.width, H / cielo.height) * zoom
    im = cielo.resize((math.ceil(cielo.width * s), math.ceil(cielo.height * s)), Image.LANCZOS)
    x = (im.width - W) / 2 + dx * W
    y = (im.height - H) * 0.35
    return im.crop((round(x), round(y), round(x) + W, round(y) + H))


def sombra(alfa, desenfoque, opacidad, desp, tam):
    capa = Image.new("L", tam, 0)
    capa.paste(alfa, desp)
    capa = capa.filter(ImageFilter.GaussianBlur(desenfoque))
    negro = Image.new("RGBA", tam, (10, 16, 34, 0))
    negro.putalpha(capa.point(lambda v: int(v * opacidad)))
    return negro


def componer(W, H, ancho, arriba, flota=0.0, zoom=1.0, dx=0.0):
    """El panel a `ancho` del cuadro, con su borde de arriba a `arriba` del alto; corta abajo."""
    base = fondo(W, H, zoom, dx).convert("RGBA")
    pw = round(W * ancho)
    p = panel.resize((pw, round(panel.height * pw / panel.width)), Image.LANCZOS)
    x = (W - pw) // 2
    y = round(H * arriba + flota)
    a = p.split()[3]
    for desenf, op, dy in [(int(W * 0.012), 0.22, int(W * 0.006)), (int(W * 0.04), 0.20, int(W * 0.03))]:
        base = Image.alpha_composite(base, sombra(a, desenf, op, (x, y + dy), base.size))
    capa = Image.new("RGBA", base.size, (0, 0, 0, 0))
    capa.paste(p, (x, y), p)
    out = Image.alpha_composite(base, capa).convert("RGB")
    # un grano mínimo, igual para todas, para que el cielo agrandado no se vea plástico
    arr = np.asarray(out, dtype=np.float32)
    arr += np.random.default_rng(7).normal(0, 1.6, arr.shape[:2])[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def guardar(im, nombre, q=90):
    ruta = os.path.join(OUT, nombre)
    im.save(ruta, quality=q, optimize=True, progressive=True, subsampling=0)
    print("✓", nombre, im.size, os.path.getsize(ruta) // 1024, "KB")


guardar(componer(2400, 1350, 0.80, 0.30), "vq-cielo-heroe.jpg")
guardar(componer(1300, 1300, 0.96, 0.36), "vq-cielo-cuadrada.jpg")
guardar(componer(3072, 2048, 0.82, 0.30), "vendiq-portada-cielo.jpg")

# El destacado del home: 8 s en bucle exacto (seno de período 8 s)
W, H, FPS, DUR = 2400, 1500, 30, 8.0
with tempfile.TemporaryDirectory() as tmp:
    n = int(FPS * DUR)
    for i in range(n):
        f = i / n
        flota = math.sin(2 * math.pi * f) * H * 0.006
        dx = math.sin(2 * math.pi * f + 1.1) * 0.006
        componer(W, H, 0.80, 0.30, flota=flota, zoom=1.04, dx=dx).save(os.path.join(tmp, f"c{i:04d}.jpg"), quality=94)
    Image.open(os.path.join(tmp, "c0000.jpg")).save(os.path.join(OUT, "vq-cielo.jpg"), quality=90, optimize=True, progressive=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i", os.path.join(tmp, "c%04d.jpg"),
                    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "slow", "-crf", "23", "-movflags", "+faststart",
                    "-an", os.path.join(OUT, "vq-cielo.mp4")], check=True)
print("✓ vq-cielo.mp4", os.path.getsize(os.path.join(OUT, "vq-cielo.mp4")) // 1024, "KB")
