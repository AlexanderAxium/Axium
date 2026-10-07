#!/usr/bin/env python3
"""Arma el vídeo en bucle de una micro-interacción grabada con grabar-micro.cjs.

  python3 video-micro.py <dir-cuadros> <salida-sin-ext> [--lienzo 2240x1612] [--fondo #F7F8FA]
                         [--desde 0.8] [--hasta 99] [--ocupa 0.86] [--fps 30] [--lazo 16]
                         [--sostener 0]

Re-muestrea a fps constantes por marca de tiempo (cada instante toma el último cuadro
pintado), centra el componente en el lienzo ocupando `ocupa` del ancho, y funde los últimos
`lazo` cuadros hacia el primero para que el bucle no salte. `--sostener S` alarga S segundos
el último cuadro: el screencast deja de mandar cuadros cuando nada cambia, así que una
animación de ENTRADA (hero de vendiq.pe) termina en seco sin esto. Sale <salida>.mp4 (H.264,
yuv420p, faststart, sin audio) y <salida>.jpg (póster: el primer cuadro).
"""
import argparse
import json
import os
import shutil
import subprocess
import tempfile

from PIL import Image, ImageDraw

ap = argparse.ArgumentParser()
ap.add_argument("dir")
ap.add_argument("salida")
ap.add_argument("--lienzo", default="2240x1612")
ap.add_argument("--fondo", default=None)
ap.add_argument("--desde", type=float, default=0.8)
ap.add_argument("--hasta", type=float, default=99)
ap.add_argument("--ocupa", type=float, default=0.86)
ap.add_argument("--fps", type=int, default=30)
ap.add_argument("--lazo", type=int, default=16)
ap.add_argument("--sostener", type=float, default=0)
ap.add_argument("--poster-fin", action="store_true", help="póster = el estado final (entradas)")
ap.add_argument("--radio", type=float, default=0, help="redondea el recorte (px del cuadro): una ventana clara sobre un lienzo de color, sin las esquinas de la página")
a = ap.parse_args()

W, H = [int(v) for v in a.lienzo.split("x")]
cuadros = json.load(open(os.path.join(a.dir, "cuadros.json")))
caja = json.load(open(os.path.join(a.dir, "caja.json")))
p = caja.get("pad", 24)
x0, y0 = max(0, int(caja["x"] - p)), max(0, int(caja["y"] - p))
x1, y1 = int(caja["x"] + caja["w"] + p), int(caja["y"] + caja["h"] + p)
primero = Image.open(os.path.join(a.dir, cuadros[0]["f"])).convert("RGB")
x1, y1 = min(x1, primero.width), min(y1, primero.height)
fondo = a.fondo or "#%02X%02X%02X" % primero.getpixel((2, primero.height - 3))
ancho = int(W * a.ocupa)
alto = round(ancho * (y1 - y0) / (x1 - x0))
if alto > H * 0.9:
    alto = int(H * 0.9)
    ancho = round(alto * (x1 - x0) / (y1 - y0))
px, py = (W - ancho) // 2, (H - alto) // 2
t0 = cuadros[0]["t"]
ts = [c["t"] - t0 for c in cuadros]
fin = min(a.hasta, ts[-1] - 0.05 + a.sostener)
n = int((fin - a.desde) * a.fps)
tmp = tempfile.mkdtemp()
j = 0
for i in range(n):
    t = a.desde + i / a.fps
    while j + 1 < len(ts) and ts[j + 1] <= t:
        j += 1
    im = Image.open(os.path.join(a.dir, cuadros[j]["f"])).convert("RGB").crop((x0, y0, x1, y1))
    out = Image.new("RGB", (W, H), fondo)
    pieza = im.resize((ancho, alto), Image.LANCZOS)
    if a.radio:
        r = round(a.radio * ancho / (x1 - x0))
        m = Image.new("L", (ancho * 2, alto * 2), 0)
        ImageDraw.Draw(m).rounded_rectangle((0, 0, ancho * 2 - 1, alto * 2 - 1), radius=r * 2, fill=255)
        out.paste(pieza, (px, py), m.resize((ancho, alto), Image.LANCZOS))
    else:
        out.paste(pieza, (px, py))
    out.save(os.path.join(tmp, f"f{i:05d}.jpg"), quality=94)
fs = sorted(os.listdir(tmp))
uno = Image.open(os.path.join(tmp, fs[0]))
for k in range(a.lazo):
    f = os.path.join(tmp, fs[len(fs) - a.lazo + k])
    t = (k + 1) / (a.lazo + 1)
    Image.blend(Image.open(f), uno, t * t * (3 - 2 * t)).save(f, quality=94)
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-framerate", str(a.fps), "-i", os.path.join(tmp, "f%05d.jpg"),
     "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
     "-an", a.salida + ".mp4"],
    check=True,
)
poster = Image.open(os.path.join(tmp, fs[len(fs) - a.lazo - 1])) if a.poster_fin else uno
poster.save(a.salida + ".jpg", quality=86, optimize=True, progressive=True)
shutil.rmtree(tmp)
print(f"✓ {a.salida}.mp4  {n} cuadros · {n / a.fps:.1f} s · {os.path.getsize(a.salida + '.mp4') // 1024} KB · fondo {fondo}")
