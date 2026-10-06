#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""FENIZ · «La mesa» — el monitor de escritorio, que es donde vive de verdad.

Por qué esta y no otra: Feniz es, por debajo, un Expert Advisor de MetaTrader 5,
que es software de ESCRITORIO. Las seis portadas anteriores lo contaron con
tableta, móvil o tarjetas sueltas; ninguna con el aparato en el que el producto
se usa. Y las seis eran ORO OSCURO, que es el cliché del rubro y no la marca:
sistemafeniz.com es casi blanco, con un lavado lavanda → crema y el oro como un
solo acento. Esta portada devuelve la ficha a la identidad del cliente.

Referencia: Lazarev, ficha «VTnews.ai» (https://www.lazarev.agency/cases) —
dispositivo de escritorio en perspectiva baja, muy grande, luz difusa de estudio,
la interfaz real densa leyéndose como textura y un solo bloque legible dentro.

El marco se CONSTRUYE (scripts/marco-monitor.cjs): cuerpo, cuello y peana, con el
anillo de ancho constante por Rcuerpo = Rpantalla + bisel + pared + chaflán.
El modelo sólo puso campo, luz y grano. La interfaz, el texto y la marca son
ficheros reales de una cuenta de demostración.

uso: python3 mesa.py <campo.jpg> <salida.jpg>
"""
import os, sys, math
import numpy as np
from PIL import Image, ImageFilter

SK = "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium"
SP = os.environ.get("FZ_TMP", "/tmp/feniz-portada")
sys.path.insert(0, f"{SK}/scripts")
from importlib import import_module
cc = import_module("componer-campo")
os.makedirs(f"{SP}/ui", exist_ok=True)

W, H = 3072, 2304
CAMPO = sys.argv[1] if len(sys.argv) > 1 else f"{SK}/campos/feniz-claro-flare.jpg"
SALIDA = sys.argv[2] if len(sys.argv) > 2 else f"{SP}/mesa.jpg"
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

# ── 0 · la pantalla, graduada como pantalla y no como papel ──────────────────
# Exposición, no redibujo: una pantalla encendida bajo luz de día no llega a 255
# y su negro no llega a 0. Y se le quita el nombre de persona de la cabecera
# rellenando con el navy EXACTO medido, (19,27,47) — eso borra un dato, no
# inventa interfaz.
_src = Image.open(f"{SK}/capturas-clientes/feniz/assets/tr-panel-full.png").convert("RGB")
_a = np.asarray(_src).copy()
_a[0:128, 2500:2880] = (19, 27, 47)
_p = _a[0:1620, 0:2880].astype(np.float32)
_p = 7.0 + _p * (243.0 / 255.0)
_p *= np.asarray([1.000, 0.995, 0.986], np.float32)[None, None, :]
_gy, _gx = np.mgrid[0:1620, 0:2880].astype(np.float32)
_p *= (1.0 - 0.055 * (_gx / 2880.0) ** 1.6)[..., None]      # el canto derecho se aleja
PANT = f"{SP}/ui/panel-mesa.png"
os.makedirs(f"{SP}/ui", exist_ok=True)
Image.fromarray(np.clip(_p, 0, 255).astype(np.uint8)).save(PANT)

# ── 1 · el campo del cliente ─────────────────────────────────────────────────
_c = Image.open(CAMPO).convert("RGB")
cw, ch = _c.size
if cw / ch > W / H:
    nw = int(ch * W / H); _c = _c.crop(((cw - nw) // 2, 0, (cw - nw) // 2 + nw, ch))
else:
    nh = int(cw * H / W); _c = _c.crop((0, (ch - nh) // 2, cw, (ch - nh) // 2 + nh))
campo = np.asarray(_c.resize((W, H), Image.LANCZOS), np.float32)
# la micro-textura del modelo se borra y el grano se repone limpio al final
_im = Image.fromarray(np.clip(campo, 0, 255).astype(np.uint8))
campo = np.asarray(_im.filter(ImageFilter.GaussianBlur(3.4)), np.float32)

# ── 2 · la mesa ──────────────────────────────────────────────────────────────
# Una superficie clara, apenas más oscura y más cálida que el aire. No es la
# fotografía de un lugar: es un plano. Lo que lo convierte en mesa es que el
# monitor la toca, la ensombrece y se refleja en ella.
YH = float(__import__("os").environ.get("FZ_YH", "1900"))
t = np.clip((yy - YH) / float(H - YH), 0, 1)
en_mesa = np.clip((yy - YH) / 34.0, 0, 1)[..., None]
mesa = campo * (0.955 - 0.085 * t[..., None])
mesa += (t[..., None] ** 1.2) * np.asarray([6.0, 2.0, -5.0], np.float32)[None, None, :]
rng = np.random.default_rng(23)
v = rng.normal(0, 1, (H // 8, max(8, W // 80))).astype(np.float32)
v = np.asarray(Image.fromarray(((v - v.min()) / (np.ptp(v) + 1e-6) * 255).astype(np.uint8))
               .resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(2.4)), np.float32)
mesa += ((v - 128.0) * 0.030)[..., None]
lienzo = np.clip(campo * (1 - en_mesa) + mesa * en_mesa, 0, 255)

# ── 3 · el monitor ───────────────────────────────────────────────────────────
DIR = f"{SK}/marcos/monitor-2400-grafito"
disp, g = cc.montar_dispositivo(DIR, PANT, (0, 0, 2880, 1620))
DW, DH = disp.size
P = g["pantalla"]

import os as _os
ALTO = float(_os.environ.get("FZ_ALTO", "1700"))
ESC = ALTO / DH
dw, dh = DW * ESC, DH * ESC
CX = float(_os.environ.get("FZ_CX", "1230"))
TOP = float(_os.environ.get("FZ_TOP", "205"))
ESCORZO = float(_os.environ.get("FZ_ESC", "0.975"))
th = math.radians(float(_os.environ.get("FZ_TH", "-1.3")))

x0, y0 = CX - dw / 2, TOP
base_q = [(x0, y0), (x0 + dw, y0 + dh * (1 - ESCORZO) / 2),
          (x0 + dw, y0 + dh * (1 + ESCORZO) / 2), (x0, y0 + dh)]
cxr, cyr = CX, TOP + dh / 2
DEST = [(cxr + (x - cxr) * math.cos(th) - (y - cyr) * math.sin(th),
         cyr + (x - cxr) * math.sin(th) + (y - cyr) * math.cos(th)) for (x, y) in base_q]

mon = cc.deformar(disp, DEST, (W, H))
alfa = mon.split()[3]
sil = Image.new("L", (DW, DH), 0)
sil.paste(255, (P["x"], P["y"], P["x"] + P["w"], P["y"] + P["h"]))
sil_pant = cc.deformar(Image.merge("RGBA", [sil] * 4), DEST, (W, H)).split()[3]

aa = np.asarray(alfa); ys, xs = np.where(aa > 8)
Y_PIE, X0, X1 = int(ys.max()), int(xs.min()), int(xs.max())
print(f"  monitor: x {X0}–{X1}  y {ys.min()}–{Y_PIE}   mesa en y={YH:.0f}")

# ── 4 · el reflejo ───────────────────────────────────────────────────────────
# Corto, pálido y muy desenfocado. En una mesa mate y clara el reflejo no es un
# espejo: es una sombra con el color del objeto. Aporta peso, no parecido.
src = np.asarray(mon, np.float32)
APL = 0.26
rr = np.zeros((H, W, 4), np.float32)
for k in range(min(H - Y_PIE, int(Y_PIE * APL))):
    sy = Y_PIE - int(k / APL)
    if sy < 0: break
    rr[Y_PIE + k] = src[sy]
rr = np.asarray(Image.fromarray(np.clip(rr, 0, 255).astype(np.uint8))
                .filter(ImageFilter.GaussianBlur(19.0)), np.float32)
fade = (np.clip(1.0 - (yy - Y_PIE) / 250.0, 0, 1) ** 2.3) * (yy >= Y_PIE)
rr[..., 3] *= fade * 0.20
base = Image.alpha_composite(Image.fromarray(lienzo.astype(np.uint8)).convert("RGBA"),
                             Image.fromarray(np.clip(rr, 0, 255).astype(np.uint8)))

# ── 5 · sombras: sólo la peana toca ──────────────────────────────────────────
pa = np.asarray(alfa, np.float32).copy(); pa[: Y_PIE - 120] = 0
pie = Image.fromarray(pa.astype(np.uint8))
base = Image.alpha_composite(base, cc.sombra(pie, 17.0, 0.46, (0, 8), (W, H), (58, 50, 66)))
base = Image.alpha_composite(base, cc.sombra(pie, 90.0, 0.26, (34, 26), (W, H), (74, 66, 86)))
base = Image.alpha_composite(base, cc.sombra(alfa, 230.0, 0.13, (86, 44), (W, H), (96, 88, 112)))

# ── 6 · el monitor encima ────────────────────────────────────────────────────
base = Image.alpha_composite(base, mon)
b = np.asarray(base.convert("RGB"), np.float32) / 255.0

# ── 7 · la pantalla devuelve su luz al aire, muy poco: es de día ─────────────
b = cc.suma_luz(b, cc.resplandor(sil_pant, (255, 246, 232), 170.0, 0.055, (0, 0), (W, H)) / 255.0)
charco = (np.exp(-((xx - CX) ** 2) / (2 * 1180.0 ** 2))
          * np.clip(1.0 - (yy - YH) / 330.0, 0, 1) ** 2.0 * (yy >= YH))
b = cc.suma_luz(b, (charco * 0.045)[..., None] * (np.asarray([255, 248, 236], np.float32) / 255.0)[None, None, :])

# ── 8 · luz de borde: el aire claro se posa en el canto del chasis ───────────
b = cc.suma_luz(b, cc.luz_de_borde(alfa, (W, H), (0, 0), "izq", 7, (236, 226, 252), 0.40))
b = cc.suma_luz(b, cc.luz_de_borde(alfa, (W, H), (0, 0), "arriba", 6, (252, 244, 232), 0.30))


# ── 8.5 · la marca: el fichero real, nunca redibujado ni recoloreado ─────────
# El lockup de tinta de Feniz (emblema oro + «Feniz» en tinta) sobre el aire
# claro de arriba a la derecha. Lejos de la cabecera que ya sale en la pantalla
# (más de 1 900 px) y dentro del 83 % central. Fintrace lleva la suya abajo a la
# derecha: ésta va arriba, para que el par se lea como sistema y no como calco.
_lg = Image.open(f"{SK}/capturas-clientes/feniz/assets/feniz-logo-tinta.png").convert("RGBA")
_LW = int(_os.environ.get("FZ_LW", "440"))
_lg = _lg.resize((_LW, round(_LW * _lg.size[1] / _lg.size[0])), Image.LANCZOS)
_LX, _LY = int(_os.environ.get("FZ_LX", "2336")), int(_os.environ.get("FZ_LY", "1806"))
_cap = Image.new("RGBA", (W, H), (0, 0, 0, 0)); _cap.paste(_lg, (_LX, _LY))
_la = np.asarray(_cap, np.float32) / 255.0
_bb = np.clip(b, 0, 1)
b = _bb * (1 - _la[..., 3:4]) + _la[..., :3] * _la[..., 3:4]
print(f"  marca: x {_LX}–{_LX+_LW}  y {_LY}–{_LY+_lg.size[1]}"
      f"  → banda vertical {100*_LY/H:.1f}–{100*(_LY+_lg.size[1])/H:.1f} %")

# ── 9 · grado y grano comunes ────────────────────────────────────────────────
a = cc.rematar(np.clip(b, 0, 1) * 255.0, sigma_grano=4.4, vineta=0.10, semilla=11,
               negro=0.0, blanco=253.0, gamma=1.00)
Image.fromarray(a.astype(np.uint8)).save(SALIDA, quality=95, subsampling=0)
cc.medir(SALIDA)

alto_p = P["h"] * ESC * ESCORZO
print(f"  pantalla en el cuadro: {P['w']*ESC:.0f}×{alto_p:.0f}")
print(f"  tarjeta de KPI servida a 421 px: {(247.0/1620.0)*alto_p*(421.0/W):.1f} px (umbral 12)")
print(f"  83 % central: x {W*0.085:.0f}–{W*0.915:.0f}  y {H*0.085:.0f}–{H*0.915:.0f}"
      f"   · el monitor cae en x {X0}–{X1} y {ys.min()}–{Y_PIE}")
Image.open(SALIDA).resize((1280, 960)).save(SALIDA.replace(".jpg", "-prev.jpg"), quality=92)
Image.open(SALIDA).resize((421, 316)).save(SALIDA.replace(".jpg", "-421.png"))
