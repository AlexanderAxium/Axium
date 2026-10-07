#!/usr/bin/env python3
"""Mockups de las tiendas que venden con Vendiq (2026-10-06).

Alexander: «me gusta vendiq pero siento que le faltan unos mockups y tal vez dar un poco más de
prioridad a sus tiendas creadas, añade happyart.com.pe» (Happy Art entra «como las demás»).

Cada pieza: la web REAL de la tienda (capturar-tiendas-vendiq.cjs) en un monitor y un celular
CONSTRUIDOS (marcos/, nada generado), flotando sobre el grafito de Vendiq con su rejilla de 64 px
y una luz del color dominante de la tienda: la serie se lee como una sola (Vendiq) y cada tienda
conserva su color. El monitor va sin pie: es una pieza de interfaz, no una foto de escritorio.

  python3 mockups-tiendas-vendiq.py <dir-capturas> <dir-salida>

Salen <slug>.jpg en 2000×2000 (los tríos de la ficha son cuadrados).
"""
import colorsys
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from importlib import import_module

cc = import_module("componer-campo")

SK = "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium"
CAP, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
TALLER = os.path.join(OUT, "taller")
os.makedirs(TALLER, exist_ok=True)
L = 2000
GRAFITO = (11, 13, 18)
TIENDAS = ["aurore", "anj-sports", "sportt", "daesur-motors", "clefast", "happy-art"]
# Cuando el tono más pintado de la portada no es el de la marca: en la segunda diapositiva de
# Clefast ganaba la piel de la foto (durazno) y su marca es verde.
LUZ_FIJA = {"clefast": (34, 170, 84)}
AQUI = os.path.dirname(os.path.abspath(__file__))

ESTADO = """<!doctype html><html><head><meta charset="utf-8"><style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{width:1170px;height:2532px;overflow:hidden;background:{bg};font-family:-apple-system,"SF Pro Text",system-ui,sans-serif}}
.estado{{position:relative;height:150px;background:{bg}}}
.hora{{position:absolute;left:60px;top:52px;width:300px;text-align:center;font-size:50px;line-height:60px;font-weight:600;color:{tx}}}
.iconos{{position:absolute;right:96px;top:66px;display:flex;gap:12px;align-items:center}}
.pagina img{{display:block;width:1170px}}
</style></head><body>
<div class="estado"><span class="hora">9:41</span><div class="iconos">
<svg width="45" height="30" viewBox="0 0 45 30"><rect x="0" y="20" width="9" height="10" rx="2" fill="{tx}"/><rect x="12" y="14" width="9" height="16" rx="2" fill="{tx}"/><rect x="24" y="8" width="9" height="22" rx="2" fill="{tx}"/><rect x="36" y="1" width="9" height="29" rx="2" fill="{tx}"/></svg>
<svg width="40" height="30" viewBox="0 0 40 30"><path d="M20 28.5 13.4 21.4a9.4 9.4 0 0 1 13.2 0Z" fill="{tx}"/><path d="M7.9 15.4a17.1 17.1 0 0 1 24.2 0" stroke="{tx}" stroke-width="4.2" fill="none" stroke-linecap="round"/><path d="M2.4 9.4a24.9 24.9 0 0 1 35.2 0" stroke="{tx}" stroke-width="4.2" fill="none" stroke-linecap="round"/></svg>
<svg width="66" height="31" viewBox="0 0 66 31"><rect x="1.5" y="1.5" width="56" height="28" rx="8.5" fill="none" stroke="{tx}" stroke-opacity="0.38" stroke-width="3"/><rect x="6" y="6" width="47" height="19" rx="4.5" fill="{tx}"/><path d="M61 10.5v10c2.2-.8 3.6-2.8 3.6-5s-1.4-4.2-3.6-5Z" fill="{tx}" fill-opacity="0.45"/></svg>
</div></div>
<div class="pagina"><img src="{img}" alt=""></div>
</body></html>"""


def pantalla_movil(slug):
    """La captura del celular con su barra de estado del color de la franja de arriba."""
    cap = Image.open(os.path.join(CAP, f"{slug}-m.png")).convert("RGB")
    fila = np.asarray(cap.crop((0, 2, cap.width, 8)), dtype=np.float32).reshape(-1, 3)
    bg = tuple(int(v) for v in np.median(fila, axis=0))
    lum = 0.2126 * bg[0] + 0.7152 * bg[1] + 0.0722 * bg[2]
    tx = "#0B0B0F" if lum > 140 else "#FFFFFF"
    html = os.path.join(TALLER, f"{slug}-movil.html")
    png = os.path.join(TALLER, f"{slug}-movil.png")
    open(html, "w").write(ESTADO.format(bg="#%02X%02X%02X" % bg, tx=tx, img=os.path.abspath(os.path.join(CAP, f"{slug}-m.png"))))
    subprocess.run(["node", os.path.join(AQUI, "render-html.cjs"), html, png, "1170", "2532", "1"], check=True,
                   env={**os.environ}, stdout=subprocess.DEVNULL)
    return png


def color_dominante(slug):
    """El tono saturado que más pinta en la portada de escritorio de la tienda."""
    im = Image.open(os.path.join(CAP, f"{slug}-d.png")).convert("RGB").resize((240, 135))
    a = np.asarray(im, dtype=np.float32) / 255.0
    px = a.reshape(-1, 3)
    hsv = np.array([colorsys.rgb_to_hsv(*p) for p in px])
    m = (hsv[:, 1] > 0.35) & (hsv[:, 2] > 0.35)
    if m.sum() < 40:
        return (40, 90, 255)  # sin color propio: la luz azul de Vendiq
    h = hsv[m, 0]
    hist, borde = np.histogram(h, bins=18, range=(0, 1))
    k = int(np.argmax(hist))
    sel = m.copy()
    sel[m] = (h >= borde[k]) & (h < borde[k + 1])
    c = px[sel].mean(axis=0)
    hh, ss, vv = colorsys.rgb_to_hsv(*c)
    r, g, b = colorsys.hsv_to_rgb(hh, min(1.0, ss * 1.1), 0.95)
    return (int(r * 255), int(g * 255), int(b * 255))


def campo(luz):
    """Grafito + rejilla de 64 px con el punto azul en cada cruce (Rejilla.tsx) + la luz de la tienda."""
    base = np.zeros((L, L, 3), dtype=np.float32) + np.array(GRAFITO, dtype=np.float32)
    yy, xx = np.mgrid[0:L, 0:L].astype(np.float32)
    # luz de la tienda detrás del monitor, y un azul Vendiq más débil abajo a la derecha
    for (cx, cy, rad, col, op) in [(0.40, 0.36, 0.70, luz, 0.50), (0.88, 0.90, 0.55, (31, 91, 255), 0.20)]:
        d = np.sqrt((xx / L - cx) ** 2 + (yy / L - cy) ** 2) / rad
        f = np.clip(1 - d, 0, 1) ** 2.2 * op
        base += f[..., None] * (np.array(col, dtype=np.float32) - base) * 0.9
    im = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).convert("RGBA")
    rej = Image.new("RGBA", (L, L), (0, 0, 0, 0))
    d = ImageDraw.Draw(rej)
    paso = 96  # 64 px css a 1,5x
    for x in range(0, L + 1, paso):
        d.line([(x, 0), (x, L)], fill=(255, 255, 255, 15), width=2)
    for y in range(0, L + 1, paso):
        d.line([(0, y), (L, y)], fill=(255, 255, 255, 15), width=2)
    for x in range(0, L + 1, paso):
        for y in range(0, L + 1, paso):
            d.ellipse([x - 3, y - 3, x + 3, y + 3], fill=(143, 180, 255, 95))
    # la rejilla se funde hacia los bordes (la máscara radial de Rejilla.tsx)
    m = np.sqrt(((xx / L - 0.5) / 0.75) ** 2 + ((yy / L - 0.45) / 0.65) ** 2)
    alfa = np.clip(1.25 - m * 1.25, 0, 1)
    ra = np.asarray(rej, dtype=np.float32)
    ra[..., 3] *= alfa
    rej = Image.fromarray(ra.astype(np.uint8))
    return Image.alpha_composite(im, rej)


def poner(lienzo, disp, x, y, ancho, sombras):
    s = ancho / disp.width
    d = disp.resize((round(disp.width * s), round(disp.height * s)), Image.LANCZOS)
    capa = Image.new("RGBA", lienzo.size, (0, 0, 0, 0))
    capa.paste(d, (x, y), d)
    sil = capa.split()[3]
    for desenf, op, desp in sombras:
        lienzo = Image.alpha_composite(lienzo, cc.sombra(sil, desenf, op, desp, lienzo.size, color=(0, 3, 8)))
    return Image.alpha_composite(lienzo, capa)


for slug in TIENDAS:
    if not os.path.exists(os.path.join(CAP, f"{slug}-d.png")):
        continue
    luz = LUZ_FIJA.get(slug) or color_dominante(slug)
    lienzo = campo(luz)
    monitor, g = cc.montar_dispositivo(f"{SK}/marcos/monitor-2400-grafito", os.path.join(CAP, f"{slug}-d.png"))
    c = g["cuerpoRect"]
    monitor = monitor.crop((c["x"], c["y"], c["x"] + c["w"], c["y"] + c["h"]))  # sin cuello ni peana
    movil, _ = cc.montar_dispositivo(f"{SK}/marcos/movil-v-820-negro", pantalla_movil(slug))
    # el conjunto (monitor + celular, y 230–1771) centrado en el alto del cuadro
    lienzo = poner(lienzo, monitor, 80, 230, 1620, [(18, 0.55, (0, 14)), (90, 0.55, (0, 60))])
    lienzo = poner(lienzo, movil, 1372, 660, 540, [(16, 0.6, (-6, 16)), (80, 0.6, (-30, 70))])
    out = cc.rematar(np.asarray(lienzo.convert("RGB"), dtype=np.float32), sigma_grano=3.0, vineta=0.10, semilla=17)
    ruta = os.path.join(OUT, f"{slug}.jpg")
    Image.fromarray(out.astype(np.uint8)).save(ruta, quality=90, optimize=True, progressive=True, subsampling=0)
    print(f"✓ {slug}.jpg  luz {luz}  {os.path.getsize(ruta) // 1024} KB")
