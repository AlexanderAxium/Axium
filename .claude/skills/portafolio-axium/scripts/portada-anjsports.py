#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ANJ Sports — campo negro con los DOS acentos de la marca (cian de XIOM a la
izquierda, magenta de Butterfly a la derecha, que es lo que hace su propia web),
móvil CONSTRUIDO con la portada real de la tienda, y un producto real de su
catálogo recortado de su propia foto. 3072×2304, 4:3 nativo."""
import os, sys
import numpy as np
from PIL import Image, ImageFilter

sys.path.insert(0, "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium/scripts")
from importlib import import_module
cc = import_module("componer-campo")

S = "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium/campos"
SK = "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium"
W, H = 3072, 2304
CYAN = (0x2B, 0xE8, 0xC8)      # el acento de XIOM en la web de ANJ
MAGENTA = (0xE8, 0x38, 0xB0)   # el acento de Butterfly en la web de ANJ


def screen(b, add):
    """Suma de luz. Todo en 0..1, de principio a fin."""
    return 1.0 - (1.0 - b) * (1.0 - add)


def rim(alfa, tam, xy, lado, ancho, color, opac, arriba=0.35):
    """Luz de borde sacada de la propia silueta: alfa menos alfa desplazado.
    Lo que delata un montaje es que falte; lo que lo delata más es que sobre."""
    base = Image.new("L", tam, 0); base.paste(alfa, xy)
    dx = -ancho if lado == "izq" else ancho
    desp = Image.new("L", tam, 0); desp.paste(alfa, (xy[0] + dx, xy[1] + int(ancho * arriba)))
    a = np.clip(np.asarray(base, np.float32) - np.asarray(desp, np.float32), 0, 255)
    a = np.asarray(Image.fromarray(a.astype(np.uint8)).filter(ImageFilter.GaussianBlur(ancho * 0.5)), np.float32)
    return (a / 255.0 * opac)[..., None] * (np.asarray(color, np.float32) / 255.0)[None, None, :]


# ── 1 · el campo generado: negro con dos luces de color, nada más ────────────
_c = Image.open(f"{S}/anjsports-flare.jpg").convert("RGB")
campo = _c.crop((110, 40, 110 + 2880, 40 + 2160)).resize((W, H), Image.LANCZOS)
a = cc.curva(np.asarray(campo, np.float32), negro=2.0, blanco=246.0, gamma=0.93)
a = np.asarray(Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
               .filter(ImageFilter.GaussianBlur(3.6)), np.float32)   # fuera la micro-textura del modelo
lienzo = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).convert("RGBA")

# ── 2 · el móvil construido ─────────────────────────────────────────────────
dir_marco = f"{SK}/marcos/movil-v-620-negro"
disp, g = cc.montar_dispositivo(dir_marco, f"{SK}/capturas-clientes/anjsports/2026-09-30/m-portada.png",
                                (0, 0, 1170, 2534))
DW, DH = disp.size
PX, PY = 470, 450
dest = [(PX + 30, PY + 28), (PX + DW, PY - 6), (PX + DW, PY + DH - 34), (PX + 12, PY + DH)]
movil = cc.deformar(disp, dest, (W, H))
sil_movil = movil.split()[3]

# ── 3 · el producto real ────────────────────────────────────────────────────
prod = Image.open(f"{S}/../capturas-clientes/anjsports/assets/_zyre-recortado.png").convert("RGBA")
pa = np.asarray(prod, np.float32)
L = pa[..., :3].mean(axis=2); Sa = pa[..., :3].max(axis=2) - pa[..., :3].min(axis=2)
borra = (L > 168) & (Sa < 26); borra[: int(prod.size[1] * 0.86), :] = False
pa[..., 3] = np.where(borra, 0, pa[..., 3])
prod = Image.fromarray(pa.astype(np.uint8))
PH = 1360
prod = prod.resize((int(prod.size[0] * PH / prod.size[1]), PH), Image.LANCZOS)
# el recorte deja un pelo claro del fondo original: se erosiona el alfa 2 px
_al = prod.split()[3].filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(0.8))
prod.putalpha(_al)
PW = prod.size[0]
QX, QY = 1240, 620      # delante del móvil y pisándolo: eso da profundidad

# el producto venía de una foto de catálogo con luz neutra. Aquí la clave es
# magenta por la derecha y el relleno cian por la izquierda: se reilumina.
q = np.asarray(prod, np.float32)
xx = np.linspace(0, 1, PW)[None, :, None]
k = (1.0 - 0.66 * np.power(1.0 - xx, 1.25)) * np.asarray([1.0, 1.0, 1.0])[None, None, :]
k = k * (1.0 + 0.18 * xx * np.asarray([0.60, -0.28, 0.38])[None, None, :])
# el canto izquierdo venía gris claro de la foto de catálogo: a la sombra y sin color
k[:, : int(PW * 0.055), :] *= np.asarray([0.42, 0.44, 0.50])[None, None, :]
q[..., :3] = np.clip(q[..., :3] * k, 0, 255)
prod = Image.fromarray(q.astype(np.uint8))
sil_prod = prod.split()[3]

# ── 4 · sombras: la clave es la magenta de la derecha, así que todo cae a la
#        izquierda y hacia abajo. La del producto aterriza SOBRE el móvil, que
#        es lo que de verdad los mete en la misma escena.
lienzo = Image.alpha_composite(lienzo, cc.sombra(sil_movil, 60, 0.78, (-40, 56), (W, H)))
lienzo = Image.alpha_composite(lienzo, cc.sombra(sil_movil, 240, 0.42, (-110, 180), (W, H)))
lienzo = Image.alpha_composite(lienzo, movil)
lienzo = Image.alpha_composite(lienzo, cc.sombra(sil_prod, 52, 0.80, (QX - 56, QY + 52), (W, H)))
lienzo = Image.alpha_composite(lienzo, cc.sombra(sil_prod, 250, 0.46, (QX - 180, QY + 190), (W, H)))
lienzo = cc.pegar_rgba(lienzo, prod, (QX, QY))

# ── 5 · las luces de borde, cortas y tacañas ────────────────────────────────
b = np.asarray(lienzo.convert("RGB"), np.float32) / 255.0
b = screen(b, rim(sil_movil, (W, H), (0, 0), "izq", 11, CYAN, 0.42))
b = screen(b, rim(sil_prod, (W, H), (QX, QY), "der", 13, MAGENTA, 0.40))
b = screen(b, rim(sil_prod, (W, H), (QX, QY), "izq", 8, CYAN, 0.16))

# ── 6 · el resplandor de la pantalla sobre el negro de alrededor ────────────
med = np.asarray(disp.convert("RGB"), np.float32).reshape(-1, 3).mean(axis=0) / 255.0
b = screen(b, cc.resplandor(sil_movil, med, 300, 0.26, (0, 0), (W, H))) * 255.0

# ── 7 · grado final y grano común a todo el cuadro ─────────────────────────
out = cc.rematar(b, sigma_grano=5.2, vineta=0.20, semilla=41, negro=0.0, blanco=251.0, gamma=0.99)
dst = "/Users/alexander/Documents/AXIUM-WEB/public/images/portadas-propuesta/v2/anjsports.jpg"
Image.fromarray(out.astype(np.uint8)).save(dst, quality=94, subsampling=0)
cc.medir(dst)
print(f"  producto {PW}×{PH} → {PH*421/W:.0f} px servidos de alto · aro interior ≈ {0.46*PH*421/W:.0f} px")
print(f"  banda: móvil {PY/H*100:.0f}–{(PY+DH)/H*100:.0f} % · producto {QY/H*100:.0f}–{(QY+PH)/H*100:.0f} %")
