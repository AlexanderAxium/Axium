#!/usr/bin/env python3
"""La portada de una ficha de web, ANIMADA: una ventana de navegador y un celular bajando a la
vez por la web real, sobre el campo de la marca (2026-10-07, Aurore).

Es la composición de `av-portada` de Aurore (ventana a la izquierda, celular a la derecha, campo
arena en degradado) con los cuadros de capturar-scroll-cuadros.cjs dentro. Las dos capturas se
hacen con las MISMAS paradas y el mismo número de cuadros, así que van sincronizadas.

  python3 video-portada-dispositivos.py <dir-escritorio> <dir-movil> <salida-sin-ext>
      [--dominio aurore.com.pe] [--esquinas "251,250,246 245,229,203 242,225,199 230,200,172"]
      [--lienzo 2240x1120] [--fps 30] [--lazo 18]

`--esquinas`: el color de las cuatro esquinas del campo (arriba izq, arriba der, abajo izq, abajo
der), medidos de la pieza fija que sustituye. Sale <salida>.mp4 (H.264, sin audio) y <salida>.jpg
(póster: el primer cuadro).
"""
import argparse
import os
import shutil
import subprocess
import tempfile

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ap = argparse.ArgumentParser()
ap.add_argument("escritorio")
ap.add_argument("movil")
ap.add_argument("salida")
ap.add_argument("--dominio", default="aurore.com.pe")
ap.add_argument("--esquinas", default="251,250,246 245,229,203 242,225,199 230,200,172")
ap.add_argument("--lienzo", default="2240x1120")
ap.add_argument("--fps", type=int, default=30)
ap.add_argument("--lazo", type=int, default=18)
a = ap.parse_args()

W, H = [int(v) for v in a.lienzo.split("x")]
k = W / 3200  # las medidas de abajo están en la escala de av-portada (3200×1600)
FUENTE = "/System/Library/Fonts/Helvetica.ttc"


def campo():
    c = [np.array([int(x) for x in e.split(",")], np.float32) for e in a.esquinas.split()]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    u, v = (xx / (W - 1))[..., None], (yy / (H - 1))[..., None]
    arriba = c[0] * (1 - u) + c[1] * u
    abajo = c[2] * (1 - u) + c[3] * u
    return Image.fromarray(np.clip(arriba * (1 - v) + abajo * v, 0, 255).astype(np.uint8)).convert("RGBA")


def sombra(caja, r, desenfoque, opacidad, despl):
    capa = Image.new("L", (W, H), 0)
    x0, y0, x1, y1 = caja
    ImageDraw.Draw(capa).rounded_rectangle((x0 + despl[0], y0 + despl[1], x1 + despl[0], y1 + despl[1]), radius=r, fill=int(255 * opacidad))
    capa = capa.filter(ImageFilter.GaussianBlur(desenfoque))
    s = Image.new("RGBA", (W, H), (96, 64, 30, 0))
    s.putalpha(capa)
    return s


def mascara(size, r, solo_abajo=False):
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=r, fill=255)
    if solo_abajo:
        d.rectangle((0, 0, size[0], r), fill=255)
    return m


# Ventana: x 192–2192, barra de 84 px, contenido 2000×1250 (16:10, como 1440×900)
vx, vy, vw = round(192 * k), round(200 * k), round(2000 * k)
barra = round(84 * k)
vh = round(vw * 900 / 1440)
rv = round(22 * k)
# Celular: pantalla de 1170×2382 (390×794 a 3x) con un filo claro, a la derecha
cel_w = round(470 * k)
cel_h = round(cel_w * 2382 / 1170)
cx = round(2480 * k)
cy = vy + barra + (vh - cel_h) // 2 + round(10 * k)
borde = max(3, round(9 * k))
rc = round(64 * k)

base = campo()
base = Image.alpha_composite(base, sombra((vx, vy, vx + vw, vy + barra + vh), rv, 40 * k * 2, 0.32, (0, round(40 * k))))
base = Image.alpha_composite(base, sombra((cx - borde, cy - borde, cx + cel_w + borde, cy + cel_h + borde), rc, 34 * k * 2, 0.34, (0, round(34 * k))))
d = ImageDraw.Draw(base)
d.rounded_rectangle((vx, vy, vx + vw, vy + barra + vh), radius=rv, fill=(243, 241, 236, 255))
for i in range(3):
    px = vx + round(34 * k) + i * round(30 * k)
    d.ellipse((px - round(8 * k), vy + barra // 2 - round(8 * k), px + round(8 * k), vy + barra // 2 + round(8 * k)), fill=(205, 200, 192, 255))
pw = round(560 * k)
d.rounded_rectangle((vx + (vw - pw) // 2, vy + round(16 * k), vx + (vw + pw) // 2, vy + barra - round(16 * k)), radius=round(14 * k), fill=(255, 255, 255, 255))
f = ImageFont.truetype(FUENTE, max(12, round(26 * k)))
d.text((vx + vw // 2, vy + barra // 2), a.dominio, font=f, fill=(92, 86, 78, 255), anchor="mm")
d.rounded_rectangle((cx - borde, cy - borde, cx + cel_w + borde, cy + cel_h + borde), radius=rc + borde, fill=(250, 248, 244, 255))
base = base.convert("RGB")
m_ventana = mascara((vw, vh), rv, solo_abajo=True)
m_cel = mascara((cel_w, cel_h), rc)

fe = sorted(x for x in os.listdir(a.escritorio) if x.endswith(".jpg"))
fm = sorted(x for x in os.listdir(a.movil) if x.endswith(".jpg"))
n = min(len(fe), len(fm))
tmp = tempfile.mkdtemp()
for i in range(n):
    out = base.copy()
    out.paste(Image.open(os.path.join(a.escritorio, fe[i])).convert("RGB").resize((vw, vh), Image.LANCZOS), (vx, vy + barra), m_ventana)
    out.paste(Image.open(os.path.join(a.movil, fm[i])).convert("RGB").resize((cel_w, cel_h), Image.LANCZOS), (cx, cy), m_cel)
    out.save(os.path.join(tmp, f"f{i:05d}.jpg"), quality=94)
fs = sorted(os.listdir(tmp))
uno = Image.open(os.path.join(tmp, fs[0]))
for j in range(a.lazo):
    p = os.path.join(tmp, fs[len(fs) - a.lazo + j])
    t = (j + 1) / (a.lazo + 1)
    Image.blend(Image.open(p), uno, t * t * (3 - 2 * t)).save(p, quality=94)
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-framerate", str(a.fps), "-i", os.path.join(tmp, "f%05d.jpg"),
     "-c:v", "libx264", "-preset", "slow", "-crf", "28", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
     "-an", a.salida + ".mp4"],
    check=True,
)
uno.save(a.salida + ".jpg", quality=88, optimize=True, progressive=True)
shutil.rmtree(tmp)
print(f"✓ {a.salida}.mp4  {n} cuadros · {n / a.fps:.1f} s · {os.path.getsize(a.salida + '.mp4') // 1024} KB")
