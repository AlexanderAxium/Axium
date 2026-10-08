#!/usr/bin/env python3
"""Una ventana y un celular bajando por la web REAL sobre el degradado de la marca, con
tarjetas reales flotando alrededor (2026-10-07, Feniz; la mezcla de Paisanos: «mockups con
personas reales, con animaciones y videos, elementos flotantes, degradados»).

Sale de capturas de PÁGINA COMPLETA (no hace falta la app en marcha): cada cuadro recorta la
captura a la altura de la pantalla, con paradas y un movimiento suavizado entre ellas. Las
tarjetas son piezas aisladas con alfa (la UI real, nunca dibujada) que suben y bajan unos px,
cada una con su fase, dentro de un filo de vidrio.

  python3 video-flotantes.py --ventana home-full.png --paradas-ventana 0,1500,3050
      --celular panel-movil-full.png --paradas-celular 0,1500,3000
      --pieza "balance.png,1440,96,420" --pieza "rendimiento.png,1150,820,470"
      --salida salida/fz-sitio-panel [--dominio sistemafeniz.com] [--lienzo 2240x1120]
      [--fondo "#0A0E18,#1B2338,#F5BB32"] [--fps 30]

`--pieza`: archivo, x, y, ancho, en px del lienzo. Las paradas, en px de la captura.
Sale <salida>.mp4 (bucle cerrado) y <salida>.jpg (el primer cuadro, póster).
"""
import argparse
import math
import os
import shutil
import subprocess
import tempfile

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ap = argparse.ArgumentParser()
ap.add_argument("--ventana", default=None)
ap.add_argument("--paradas-ventana", default="0")
ap.add_argument("--solo-celular", action="store_true",
                help="versión móvil: sin ventana, el celular grande y las piezas a su lado (medidas a 1200×1200)")
ap.add_argument("--celular", required=True)
ap.add_argument("--paradas-celular", required=True)
ap.add_argument("--pieza", action="append", default=[])
ap.add_argument("--salida", required=True)
ap.add_argument("--dominio", default="")
ap.add_argument("--lienzo", default="2240x1120")
ap.add_argument("--fondo", default="#0A0E18,#1B2338,#F5BB32", help="borde, centro y brillo del degradado")
ap.add_argument("--fps", type=int, default=30)
ap.add_argument("--quieto", type=int, default=45, help="cuadros detenido en cada parada")
ap.add_argument("--mueve", type=int, default=50, help="cuadros de una parada a la siguiente")
ap.add_argument("--lazo", type=int, default=18)
a = ap.parse_args()

W, H = [int(v) for v in a.lienzo.split("x")]
k = W / (1200 if a.solo_celular else 2240)  # medidas pensadas a 2240×1120 (o 1200×1200 solo celular)
FUENTE = "/System/Library/Fonts/Helvetica.ttc"


def hexrgb(h):
    h = h.lstrip("#")
    return np.array([int(h[i : i + 2], 16) for i in (0, 2, 4)], np.float32)


# ── fondo: degradado radial de la marca y un brillo cálido abajo a la derecha ──
borde, centro, brillo = [hexrgb(c) for c in a.fondo.split(",")]
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
d = np.sqrt(((xx - W * 0.45) / (W * 0.75)) ** 2 + ((yy - H * 0.42) / (H * 0.9)) ** 2)
t = np.clip(d, 0, 1)[..., None] ** 1.2
fondo = centro * (1 - t) + borde * t
g = np.exp(-(((xx - W * 0.78) / (W * 0.28)) ** 2 + ((yy - H * 0.86) / (H * 0.42)) ** 2))[..., None]
fondo = fondo + (brillo - fondo) * g * 0.40
base = Image.fromarray(np.clip(fondo, 0, 255).astype(np.uint8)).convert("RGBA")


def sombra(lienzo, caja, r, blur, op, dy, color=(0, 0, 0)):
    m = Image.new("L", (W, H), 0)
    x0, y0, x1, y1 = caja
    ImageDraw.Draw(m).rounded_rectangle((x0, y0 + dy, x1, y1 + dy), radius=r, fill=int(255 * op))
    s = Image.new("RGBA", (W, H), color + (0,))
    s.putalpha(m.filter(ImageFilter.GaussianBlur(blur)))
    return Image.alpha_composite(lienzo, s)


def mascara(size, r, arriba=True):
    m = Image.new("L", (size[0] * 2, size[1] * 2), 0)
    dr = ImageDraw.Draw(m)
    dr.rounded_rectangle((0, 0, size[0] * 2 - 1, size[1] * 2 - 1), radius=r * 2, fill=255)
    if not arriba:
        dr.rectangle((0, 0, size[0] * 2, r * 2), fill=255)
    return m.resize(size, Image.LANCZOS)


# ── ventana: barra oscura con el dominio, contenido 16:10 ──
vx, vy, vw = round(170 * k), round(116 * k), round(1340 * k)
barra = round(50 * k)
vh = round(vw * 10 / 16)
rv = round(18 * k)
# ── celular: pantalla al aspecto de la captura, marco negro con filo claro ──
cap_cel = Image.open(a.celular).convert("RGB")
cel_ratio = 2532 / 1170
if a.solo_celular:
    ch = round(H * 0.82)
    cw = round(ch / cel_ratio)
    cx, cy = round(W * 0.62 - cw / 2), (H - ch) // 2
else:
    cw = round(360 * k)
    ch = round(cw * cel_ratio)
    cx, cy = round(1640 * k), (H - ch) // 2
marco = round(11 * k)
rc = round(52 * k)

if not a.solo_celular:
    base = sombra(base, (vx, vy, vx + vw, vy + barra + vh), rv, 40 * k, 0.55, round(30 * k))
base = sombra(base, (cx - marco, cy - marco, cx + cw + marco, cy + ch + marco), rc, 36 * k, 0.6, round(28 * k))
dr = ImageDraw.Draw(base)
if not a.solo_celular:
    dr.rounded_rectangle((vx, vy, vx + vw, vy + barra + vh), radius=rv, fill=(26, 32, 48, 255))
    dr.rounded_rectangle((vx, vy, vx + vw, vy + barra + vh), radius=rv, outline=(255, 255, 255, 34), width=max(1, round(1.5 * k)))
for i in range(3 if not a.solo_celular else 0):
    px = vx + round(28 * k) + i * round(24 * k)
    r_ = round(6 * k)
    dr.ellipse((px - r_, vy + barra // 2 - r_, px + r_, vy + barra // 2 + r_), fill=(70, 78, 98, 255))
if a.dominio and not a.solo_celular:
    pw = round(400 * k)
    dr.rounded_rectangle((vx + (vw - pw) // 2, vy + round(12 * k), vx + (vw + pw) // 2, vy + barra - round(12 * k)), radius=round(10 * k), fill=(40, 47, 66, 255))
    f = ImageFont.truetype(FUENTE, max(11, round(17 * k)))
    dr.text((vx + vw // 2, vy + barra // 2), a.dominio, font=f, fill=(196, 202, 214, 255), anchor="mm")
dr.rounded_rectangle((cx - marco, cy - marco, cx + cw + marco, cy + ch + marco), radius=rc + marco, fill=(12, 14, 20, 255))
dr.rounded_rectangle((cx - marco, cy - marco, cx + cw + marco, cy + ch + marco), radius=rc + marco, outline=(150, 158, 176, 255), width=max(1, round(2 * k)))
m_ventana = mascara((vw, vh), rv, arriba=False)
m_cel = mascara((cw, ch), rc)

# ── piezas flotantes: filo de vidrio + sombra, cada una con su fase ──
borrosa = base.filter(ImageFilter.GaussianBlur(26 * k))
piezas = []
for i, spec in enumerate(a.pieza):
    ruta, x, y, ancho = spec.split(",")
    pz = Image.open(ruta).convert("RGBA")
    pz = pz.crop(pz.getbbox())
    pw = round(float(ancho) * k)
    pz = pz.resize((pw, round(pz.height * pw / pz.width)), Image.LANCZOS)
    piezas.append(dict(img=pz, x=round(float(x) * k), y=round(float(y) * k), fase=i * 2.1))


# Cada pieza se precalcula UNA vez como capa pequeña (sombra + vidrio + filo + tarjeta) y por
# cuadro solo se pega desplazada: difuminar el lienzo entero en cada cuadro tardaba minutos.
for p in piezas:
    pw, ph = p["img"].size
    rel, r, mg = round(10 * k), round(30 * k), round(90 * k)
    x0, y0 = p["x"] - rel - mg, p["y"] - rel - mg
    sw, sh = pw + 2 * (rel + mg), ph + 2 * (rel + mg)
    caja = (mg, mg, mg + pw + 2 * rel, mg + ph + 2 * rel)
    capa = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    m = Image.new("L", (sw, sh), 0)
    ImageDraw.Draw(m).rounded_rectangle((caja[0], caja[1] + round(22 * k), caja[2], caja[3] + round(22 * k)), radius=r, fill=140)
    sombra_ = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    sombra_.putalpha(m.filter(ImageFilter.GaussianBlur(30 * k)))
    capa = Image.alpha_composite(capa, sombra_)
    vidrio = Image.blend(borrosa.crop((x0, y0, x0 + sw, y0 + sh)), Image.new("RGBA", (sw, sh), (255, 255, 255, 255)), 0.10)
    mv = Image.new("L", (sw, sh), 0)
    ImageDraw.Draw(mv).rounded_rectangle(caja, radius=r, fill=255)
    capa.paste(vidrio, (0, 0), mv)
    ImageDraw.Draw(capa).rounded_rectangle(caja, radius=r, outline=(255, 255, 255, 120), width=max(1, round(2 * k)))
    capa.alpha_composite(p["img"], (mg + rel, mg + rel))
    p.update(capa=capa, x0=x0, y0=y0)


def pintar_piezas(lienzo, tt):
    for p in piezas:
        dy = round(math.sin(tt * 2 * math.pi + p["fase"]) * 9 * k)
        lienzo.alpha_composite(p["capa"], (p["x0"], p["y0"] + dy))
    return lienzo


# ── la línea de tiempo: quieto, mueve, quieto, mueve, … quieto ──
def recorrido(paradas):
    pos = []
    for i, p in enumerate(paradas):
        pos += [p] * (a.quieto + (15 if i == len(paradas) - 1 else 0))
        if i < len(paradas) - 1:
            q = paradas[i + 1]
            for j in range(a.mueve):
                s = (j + 1) / a.mueve
                s = s * s * (3 - 2 * s)  # suave al salir y al llegar
                pos.append(p + (q - p) * s)
    return pos


cap_ven = Image.open(a.ventana).convert("RGB") if a.ventana else None
esc_v = vw / cap_ven.width if cap_ven else 1
alto_v = vh / esc_v  # px de captura que caben en la ventana
esc_c = cw / cap_cel.width
alto_c = ch / esc_c
rv_ = recorrido([float(v) for v in a.paradas_ventana.split(",")])
rc_ = recorrido([float(v) for v in a.paradas_celular.split(",")])
n = max(len(rv_), len(rc_))
rv_ += [rv_[-1]] * (n - len(rv_))
rc_ += [rc_[-1]] * (n - len(rc_))

tmp = tempfile.mkdtemp()
for i in range(n):
    out = base.copy()
    if cap_ven:
        yv = min(rv_[i], cap_ven.height - alto_v)
        trozo = cap_ven.crop((0, round(yv), cap_ven.width, round(yv + alto_v))).resize((vw, vh), Image.LANCZOS)
        out.paste(trozo, (vx, vy + barra), m_ventana)
    yc = min(rc_[i], cap_cel.height - alto_c)
    trozo = cap_cel.crop((0, round(yc), cap_cel.width, round(yc + alto_c))).resize((cw, ch), Image.LANCZOS)
    out.paste(trozo, (cx, cy), m_cel)
    out = pintar_piezas(out, i / n)
    out.convert("RGB").save(os.path.join(tmp, f"f{i:05d}.jpg"), quality=93)
    if i % 60 == 0:
        print(f"  cuadro {i}/{n}")

fs = sorted(os.listdir(tmp))
uno = Image.open(os.path.join(tmp, fs[0]))
for j in range(a.lazo):
    p = os.path.join(tmp, fs[len(fs) - a.lazo + j])
    s = (j + 1) / (a.lazo + 1)
    Image.blend(Image.open(p), uno, s * s * (3 - 2 * s)).save(p, quality=93)
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-framerate", str(a.fps), "-i", os.path.join(tmp, "f%05d.jpg"),
     "-c:v", "libx264", "-preset", "slow", "-crf", "25", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
     "-an", a.salida + ".mp4"],
    check=True,
)
uno.save(a.salida + ".jpg", quality=88, optimize=True, progressive=True)
shutil.rmtree(tmp)
print(f"✓ {a.salida}.mp4  {n} cuadros · {n / a.fps:.1f} s · {os.path.getsize(a.salida + '.mp4') // 1024} KB")
