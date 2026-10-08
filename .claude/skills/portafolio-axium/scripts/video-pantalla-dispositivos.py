#!/usr/bin/env python3
"""Una ventana y un celular con dos GRABACIONES EN TIEMPO REAL de la web (grabar-pantalla.cjs),
sobre un lienzo oscuro cuyo brillo toma el color de lo que está en pantalla (2026-10-07, ANJ
Sports: el carrusel del héroe pasa del cian de XIOM al magenta de Butterfly, y el fondo con él).

  python3 video-pantalla-dispositivos.py --escritorio dir --desde-e 7.1 --celular dir --desde-c 6.95
      --dura 21.15 [--dura-c 20.4] --salida salida/anj-web [--dominio anjsports.com]
      [--lienzo 2240x1260] [--fondo "#08080B"] [--fps 30]

`--dura`: el tramo del escritorio (un ciclo entero, para que el bucle empalme en la misma
fase); `--dura-c`: el del celular, que se estira o encoge a `--dura` (los dos carruseles no
tienen el mismo periodo exacto). Cada instante toma el último cuadro pintado.
"""
import argparse
import json
import os
import shutil
import subprocess
import tempfile

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ap = argparse.ArgumentParser()
ap.add_argument("--escritorio", required=True)
ap.add_argument("--desde-e", type=float, required=True)
ap.add_argument("--celular", required=True)
ap.add_argument("--desde-c", type=float, required=True)
ap.add_argument("--dura", type=float, required=True)
ap.add_argument("--dura-c", type=float, default=None)
ap.add_argument("--salida", required=True)
ap.add_argument("--dominio", default="")
ap.add_argument("--lienzo", default="2240x1260")
ap.add_argument("--fondo", default="#08080B")
ap.add_argument("--fps", type=int, default=30)
ap.add_argument("--solo-celular", action="store_true",
                help="versión móvil: solo el teléfono, grande y centrado (el plano ancho no se lee a 390 px)")
a = ap.parse_args()

W, H = [int(v) for v in a.lienzo.split("x")]
k = W / 2240
FUENTE = "/System/Library/Fonts/Helvetica.ttc"
fondo = np.array([int(a.fondo[i : i + 2], 16) for i in (1, 3, 5)], np.float32)


def serie(d):
    c = json.load(open(os.path.join(d, "cuadros.json")))
    return [x["t"] for x in c], [os.path.join(d, x["f"]) for x in c]


te, fe = serie(a.escritorio)
tc, fc = serie(a.celular)


def en(ts, fs, t):
    i = max(0, np.searchsorted(ts, t, side="right") - 1)
    return fs[i]


# ── geometría ──
vx, vy, vw = round(170 * k), round(176 * k), round(1500 * k)
barra = round(46 * k)
vh = round(vw * 810 / 1440)
rv = round(18 * k)
if a.solo_celular:
    ch = round(H * 0.9)
    cw = round(ch * 390 / 844)
    cx, cy = (W - cw) // 2, (H - ch) // 2
    marco = round(cw * 0.03)
    rc = round(cw * 0.12)
else:
    cw = round(372 * k)
    ch = round(cw * 844 / 390)
    cx, cy = round(1640 * k), (H - ch) // 2 + round(14 * k)
    marco = round(11 * k)
    rc = round(46 * k)


def caja_sombra(img, caja, r, blur, op, dy):
    m = Image.new("L", (W, H), 0)
    x0, y0, x1, y1 = caja
    ImageDraw.Draw(m).rounded_rectangle((x0, y0 + dy, x1, y1 + dy), radius=r, fill=int(255 * op))
    s = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s.putalpha(m.filter(ImageFilter.GaussianBlur(blur)))
    return Image.alpha_composite(img, s)


def mascara(size, r, arriba=True):
    m = Image.new("L", (size[0] * 2, size[1] * 2), 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle((0, 0, size[0] * 2 - 1, size[1] * 2 - 1), radius=r * 2, fill=255)
    if not arriba:
        d.rectangle((0, 0, size[0] * 2, r * 2), fill=255)
    return m.resize(size, Image.LANCZOS)


# capa fija: sombras, marco de la ventana y del celular (se pega sobre el fondo de cada cuadro)
fija = Image.new("RGBA", (W, H), (0, 0, 0, 0))
if not a.solo_celular:
    fija = caja_sombra(fija, (vx, vy, vx + vw, vy + barra + vh), rv, 44 * k, 0.75, round(34 * k))
fija = caja_sombra(fija, (cx - marco, cy - marco, cx + cw + marco, cy + ch + marco), rc, 40 * k, 0.8, round(30 * k))
d = ImageDraw.Draw(fija)
if not a.solo_celular:
    d.rounded_rectangle((vx, vy, vx + vw, vy + barra + vh), radius=rv, fill=(22, 22, 28, 255), outline=(255, 255, 255, 30), width=max(1, round(1.5 * k)))
for i in range(0 if a.solo_celular else 3):
    px, r_ = vx + round(26 * k) + i * round(22 * k), round(6 * k)
    d.ellipse((px - r_, vy + barra // 2 - r_, px + r_, vy + barra // 2 + r_), fill=(62, 62, 74, 255))
if a.dominio and not a.solo_celular:
    pw = round(380 * k)
    d.rounded_rectangle((vx + (vw - pw) // 2, vy + round(11 * k), vx + (vw + pw) // 2, vy + barra - round(11 * k)), radius=round(9 * k), fill=(36, 36, 46, 255))
    f = ImageFont.truetype(FUENTE, max(11, round(16 * k)))
    d.text((vx + vw // 2, vy + barra // 2), a.dominio, font=f, fill=(190, 192, 204, 255), anchor="mm")
d.rounded_rectangle((cx - marco, cy - marco, cx + cw + marco, cy + ch + marco), radius=rc + marco, fill=(10, 10, 12, 255), outline=(120, 122, 134, 255), width=max(1, round(2 * k)))
m_v = mascara((vw, vh), rv, arriba=False)
m_c = mascara((cw, ch), rc)

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
g = np.exp(-(((xx - W * 0.62) / (W * 0.42)) ** 2 + ((yy - H * 0.58) / (H * 0.62)) ** 2))[..., None]
viñeta = np.clip(1 - 0.35 * (((xx - W / 2) / (W * 0.7)) ** 2 + ((yy - H / 2) / (H * 0.7)) ** 2), 0.55, 1)[..., None]

tmp = tempfile.mkdtemp()
n = round(a.dura * a.fps)
escala_c = (a.dura_c or a.dura) / a.dura
color = None
for i in range(n):
    t = i / a.fps
    e = Image.open(en(te, fe, a.desde_e + t)).convert("RGB")
    c = Image.open(en(tc, fc, a.desde_c + t * escala_c)).convert("RGB")
    # el color de la marca en pantalla: la media de la mitad derecha del héroe, saturada
    muestra = np.asarray(e.resize((48, 27)))[6:, 24:].reshape(-1, 3).astype(np.float32)
    vivo = muestra[(muestra.max(1) - muestra.min(1)) > 40]
    obj = vivo.mean(0) if len(vivo) > 8 else fondo
    color = obj if color is None else color * 0.85 + obj * 0.15  # suaviza el cambio
    base = fondo + (color - fondo) * g * 0.42
    base = (base * viñeta).clip(0, 255).astype(np.uint8)
    out = Image.alpha_composite(Image.fromarray(base).convert("RGBA"), fija)
    if not a.solo_celular:
        out.paste(e.resize((vw, vh), Image.LANCZOS), (vx, vy + barra), m_v)
    out.paste(c.resize((cw, ch), Image.LANCZOS), (cx, cy), m_c)
    out.convert("RGB").save(os.path.join(tmp, f"f{i:05d}.jpg"), quality=92)
    if i % 120 == 0:
        print(f"  cuadro {i}/{n}")

subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-framerate", str(a.fps), "-i", os.path.join(tmp, "f%05d.jpg"),
     "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
     "-an", a.salida + ".mp4"],
    check=True,
)
Image.open(os.path.join(tmp, f"f{min(n - 1, round(4 * a.fps)):05d}.jpg")).save(a.salida + ".jpg", quality=88, optimize=True, progressive=True)
shutil.rmtree(tmp)
print(f"✓ {a.salida}.mp4  {n} cuadros · {n / a.fps:.1f} s · {os.path.getsize(a.salida + '.mp4') // 1024} KB")
