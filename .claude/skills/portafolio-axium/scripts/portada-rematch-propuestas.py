#!/usr/bin/env python3
"""Rematch — tres propuestas de portada (2026-10-06), todas con el aparato CONSTRUIDO.

Alexander, sobre la mano con el celular: «esto está mal diseñado el mockup, los bordes están
feos, y además la portada no me convence. dame propuestas». Diagnóstico a 1:1: el celular lo
había dibujado el modelo —bisel desparejo, sin bisel arriba, esquinas con «hombro»— y la
pantalla oscura se fundía con el cuerpo negro. Es la regla de la undécima generación
(«el dispositivo no lo genera nadie: se dibuja en SVG y se mide») que en esa escena no se
aplicó. Aquí el aparato sale de marcos/movil-v-820-negro (anillo de ancho constante) y la
pantalla es una página CLARA de rematch.pe, para que el borde se lea.

  A · Sobre la cancha: vista cenital, el celular apoyado en el césped azul con la sombra de la
      reja (la idea de la foto de la mano, hecha con un aparato de verdad).
  B · Campo de marca: dos celulares sobre la tinta con la luz lima (Significa Dia, Kavak).
  C · La mesa: la escena cuyo estilo le gustó, ya con la pantalla en clave (encaje exacto).

Salen en 3072×2304 (4:3 nativo, la tarjeta de /portafolio) a <dir>/propuesta-{a,b,c}.jpg.
"""
import math
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from importlib import import_module

cc = import_module("componer-campo")

SK = "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium"
T = f"{SK}/capturas-saas/rematch/pixelmatters-2026-10"
OUT = sys.argv[1] if len(sys.argv) > 1 else f"{T}/propuestas"
os.makedirs(OUT, exist_ok=True)
W, H = 3072, 2304
MARCO = f"{SK}/marcos/movil-v-820-negro"
INICIO = f"{T}/taller/pantalla-web-inicio-sin-isla.png"
ACADEMIA = f"{T}/taller/pantalla-web-academia-sin-isla.png"


def girado(disp, cx, cy, alto, grados, escorzo=0.0):
    """El aparato a `alto` px, centrado en (cx, cy), girado y con un canto escorzado."""
    dw, dh = disp.size
    s = alto / dh
    w, h = dw * s, dh * s
    th = math.radians(grados)
    base = [(-w / 2, -h / 2 + h * escorzo), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2 - h * escorzo)]
    return [(cx + x * math.cos(th) - y * math.sin(th), cy + x * math.sin(th) + y * math.cos(th)) for x, y in base]


def apoyar(lienzo, disp, dest, sombras, reflejo_campo=None, resplandor=0.05):
    d = cc.deformar(disp, dest, lienzo.size)
    sil = d.split()[3]
    for desenf, op, desp in sombras:
        lienzo = Image.alpha_composite(lienzo, cc.sombra(sil, desenf, op, desp, lienzo.size))
    if resplandor:
        a = np.asarray(d, dtype=np.float32)
        medio = a[..., :3][a[..., 3] > 200].mean(axis=0)
        base = np.asarray(lienzo.convert("RGB"), dtype=np.float32)
        halo = cc.resplandor(sil, medio / 255.0, 260, resplandor, (0, 0), lienzo.size)
        base = 255.0 - (255.0 - base) * (1.0 - halo)
        lienzo = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).convert("RGBA")
    lienzo = Image.alpha_composite(lienzo, d)
    if reflejo_campo is not None:
        msk = cc.deformar(Image.open(f"{MARCO}/mascara.png").convert("RGBA"), dest, lienzo.size).split()[3]
        ref = reflejo_campo.transpose(Image.FLIP_LEFT_RIGHT).filter(ImageFilter.GaussianBlur(30)).convert("RGBA")
        ref.putalpha(msk.point(lambda v: int(v * 0.06)))
        lienzo = Image.alpha_composite(lienzo, ref)
    return lienzo


def guardar(lienzo, nombre, grano=4.2, vineta=0.08):
    out = cc.rematar(np.asarray(lienzo.convert("RGB"), dtype=np.float32), sigma_grano=grano, vineta=vineta, semilla=31)
    ruta = f"{OUT}/{nombre}.jpg"
    Image.fromarray(out.astype(np.uint8)).save(ruta, quality=93, subsampling=0)
    cc.medir(ruta)
    return ruta


# ── A · Sobre la cancha (cenital) ─────────────────────────────────────────────────────
campo = Image.open(f"{SK}/campos/rematch-cesped-1.png").convert("RGB").resize((W, H), Image.LANCZOS)
lienzo = campo.convert("RGBA")
disp, _ = cc.montar_dispositivo(MARCO, INICIO)
dest = girado(disp, W * 0.53, H * 0.50, H * 0.80, -9)
# el sol entra por la derecha, bajo: la sombra cae a la izquierda y un poco hacia abajo,
# corta y dura en el contacto (el aparato está APOYADO, a 8 mm del césped)
lienzo = apoyar(lienzo, disp, dest, [(10, 0.70, (-12, 6)), (34, 0.45, (-46, 18)), (120, 0.30, (-120, 50))], campo, 0.04)
guardar(lienzo, "propuesta-a")

# ── A en sus formatos (Alexander, 2026-10-06: «el A está bien») ─────────────────────
# Cada formato se COMPONE, no se recorta de la 4:3: el celular girado mide ~1.960 px de
# alto y un recorte 16:10 de 3072 deja 1.920. El césped se recorta al aspecto (misma
# escala de la trama de la reja) y el aparato se dimensiona a cada alto.
def cancha(ancho, alto, frac_alto, cx=0.5, grados=-9):
    base = Image.open(f"{SK}/campos/rematch-cesped-1.png").convert("RGB")
    bw, bh = base.size
    if ancho / alto > bw / bh:
        ch = int(bw * alto / ancho); y0 = (bh - ch) // 2
        base = base.crop((0, y0, bw, y0 + ch))
    else:
        cw = int(bh * ancho / alto); x0 = (bw - cw) // 2
        base = base.crop((x0, 0, x0 + cw, bh))
    campo = base.resize((ancho, alto), Image.LANCZOS)
    k = alto / 2304
    d, _ = cc.montar_dispositivo(MARCO, INICIO)
    dest = girado(d, ancho * cx, alto * 0.5, alto * frac_alto, grados)
    l = apoyar(campo.convert("RGBA"), d, dest,
               [(10 * k, 0.70, (round(-12 * k), round(6 * k))), (34 * k, 0.45, (round(-46 * k), round(18 * k))),
                (120 * k, 0.30, (round(-120 * k), round(50 * k)))],
               campo, 0.04)
    return l


if "--formatos" in sys.argv:
    guardar(cancha(3072, 2304, 0.80, 0.53), "rematch-portada-cancha")         # /portafolio 4:3
    guardar(cancha(2048, 1280, 0.80, 0.52), "rematch-v15")                    # destacado del home 16:10
    guardar(cancha(2880, 1600, 0.84, 0.55), "rm-heroe-cancha")                # héroe de la ficha 1,8:1
    guardar(cancha(1400, 1400, 0.82, 0.50), "rm-heroe-cancha-movil")          # héroe en el celular
    print("✓ formatos de A en", OUT)
    sys.exit(0)

# ── B · Campo de marca: dos celulares sobre la tinta ──────────────────────────────────
campo = Image.open(f"{SK}/campos/rematch-tinta.png").convert("RGB").resize((W, H), Image.LANCZOS)
lienzo = campo.convert("RGBA")
atras, _ = cc.montar_dispositivo(MARCO, ACADEMIA)
frente, _ = cc.montar_dispositivo(MARCO, INICIO)
lienzo = apoyar(lienzo, atras, girado(atras, W * 0.64, H * 0.47, H * 0.74, 7, 0.006),
                [(20, 0.55, (-18, 26)), (90, 0.45, (-70, 90))], campo, 0.03)
lienzo = apoyar(lienzo, frente, girado(frente, W * 0.44, H * 0.53, H * 0.80, -5, 0.006),
                [(20, 0.60, (-18, 26)), (110, 0.50, (-80, 110))], campo, 0.04)
guardar(lienzo, "propuesta-b", grano=4.6, vineta=0.06)

# ── C · La mesa (la escena con la pantalla en clave, recortada a 4:3) ────────────────
mesa = Image.open(f"{T}/piezas/mesa-v3.jpg").convert("RGB")  # 2048², celular en y 317–1710
c = mesa.crop((0, 230, 2048, 1766)).resize((W, H), Image.LANCZOS)
c.save(f"{OUT}/propuesta-c.jpg", quality=93, subsampling=0)
cc.medir(f"{OUT}/propuesta-c.jpg")
print("✓ tres propuestas en", OUT)
