#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fintrace — campo de tinta + tableta construida. 3072×2304, 4:3 nativo."""
import os, sys
import numpy as np
from PIL import Image, ImageFilter

sys.path.insert(0, "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium/scripts")
from importlib import import_module
cc = import_module("componer-campo")

S = "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium/campos"
SK = "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium"
W, H = 3072, 2304

# ── 1 · el campo generado, graduado hacia la marca ───────────────────────────
_c = Image.open(f"{S}/fintrace-flare.jpg").convert("RGB")
# reencuadre del campo: una ventana 4:3 dentro del propio campo, sin inventar
# bordes. Acerca el haz y deja el negro abajo a la izquierda.
_vw, _vh = 2780, 2085
_vx, _vy = 170, 150
campo = _c.crop((_vx, _vy, _vx + _vw, _vy + _vh)).resize((W, H), Image.LANCZOS)
a = np.asarray(campo, dtype=np.float32)
# medido en el propio campo: la banda media ya salió en (33,57,228), que está
# a un paso del ultramarino #3040F5 de Fintrace. Empujarlo más lo volvía lila.
a = cc.mezcla_color(a, "#2139E4", "#3040F5", 0.30)
# el núcleo caliente llega a blanco de verdad (el campo venía con 0 % sobre 250)
L = a.mean(axis=2, keepdims=True)
calor = np.clip((L - 170.0) / 60.0, 0, 1)
a = a + calor * (255.0 - a) * 0.72
# el núcleo caliente se iba a lila; se enfría al blanco azulado de la marca
a[..., 0] -= calor[..., 0] * 10.0
a[..., 1] -= calor[..., 0] * 3.0
# los negros se quedan negros
a = cc.curva(a, negro=3.0, blanco=255.0, gamma=0.98)
# el modelo deja una micro-textura que en las zonas oscuras parece tela arrugada:
# se borra con un desenfoque corto y el grano se vuelve a poner limpio al final.
_b1 = np.asarray(Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
                 .filter(ImageFilter.GaussianBlur(3.4)), dtype=np.float32)
_b2 = np.asarray(Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
                 .filter(ImageFilter.GaussianBlur(12.0)), dtype=np.float32)
# donde el campo está más caliente es donde más se le ven los grumos del modelo
_w = np.clip(calor * 0.80, 0, 1)
a = _b1 * (1.0 - _w) + _b2 * _w

# ── 2 · la tableta: marco construido + captura real ──────────────────────────
dir_marco = f"{SK}/marcos/tableta-v-1080-grafito"
captura = f"{SK}/capturas-clientes/fintrace/landing/movil-hero-3x.png"
RECORTE = (0, 0, 1170, 1560)           # 1170×1560 → aspecto 0,7500 = el de la pantalla
disp, g = cc.montar_dispositivo(dir_marco, captura, RECORTE)
DW, DH = disp.size
X, Y = 800, 368                        # a la izquierda del haz: el aparato ocupa la sombra

# un aparato fotografiado no está nunca perfectamente a escuadra: 2,2 grados de
# giro y un escorzo suave del canto derecho. El cuadrilátero se calcula, no se
# tantea, y la sombra sale de la silueta ya deformada.
import math
_th = math.radians(-2.2)
_cx, _cy = DW / 2.0, DH / 2.0
_base = [(0, 0), (DW, DH * 0.012), (DW, DH * 0.988), (0, DH)]
def _rot(p):
    x, y = p[0] - _cx, p[1] - _cy
    return (X + _cx + x * math.cos(_th) - y * math.sin(_th),
            Y + _cy + x * math.sin(_th) + y * math.cos(_th))
_dest = [_rot(p) for p in _base]
disp = cc.deformar(disp, _dest, (W, H))

lienzo = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).convert("RGBA")
sil = disp.split()[3]

# ── 3 · la sombra de contacto. La luz viene del extremo superior derecho,
#        así que la sombra cae abajo a la izquierda. Dos: una dura y corta
#        (el contacto) y una larga y abierta (la oclusión).
lienzo = Image.alpha_composite(lienzo, cc.sombra(sil, 34, 0.72, (-22, 26), (W, H)))
lienzo = Image.alpha_composite(lienzo, cc.sombra(sil, 190, 0.52, (-130, 150), (W, H)))

# ── 4 · el resplandor de la pantalla sobre el campo ──────────────────────────
_a = np.asarray(disp, dtype=np.float32)
_m = _a[..., 3] > 200
medio = _a[..., :3][_m].mean(axis=0)
base = np.asarray(lienzo.convert("RGB"), dtype=np.float32)
halo = cc.resplandor(sil, medio / 255.0, 300, 0.115, (0, 0), (W, H))
base = 255.0 - (255.0 - base) * (1.0 - halo)        # screen
halo2 = cc.resplandor(sil, medio / 255.0, 760, 0.105, (0, 0), (W, H))
base = 255.0 - (255.0 - base) * (1.0 - halo2)
lienzo = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).convert("RGBA")

# ── 5 · el aparato ───────────────────────────────────────────────────────────
lienzo = Image.alpha_composite(lienzo, disp)

# ── 6 · el reflejo del propio campo sobre el cristal, al 5 % ────────────────
ref = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).transpose(Image.FLIP_LEFT_RIGHT)
ref = ref.filter(ImageFilter.GaussianBlur(26)).convert("RGBA")
_msk = cc.deformar(Image.open(f"{dir_marco}/mascara.png").convert("RGBA"), _dest, (W, H)).split()[3]
ref.putalpha(_msk.point(lambda v: int(v * 0.055)))
lienzo = Image.alpha_composite(lienzo, ref)

# ── 7 · la marca real, en la esquina libre y lejos de la cabecera del sitio ──
# `ft-logo.png` es la versión OSCURA; sobre azul marino no leería. La clara
# existe y es suya: está en el pie de su propia landing, y de ahí sale —
# des-matada contra el navy medido (10,13,38). Ni redibujada ni recoloreada.
marca = Image.open(f"{SK}/marcas/fintrace-lockup-claro.png").convert("RGBA")
MW = 500
marca = marca.resize((MW, int(marca.size[1] * MW / marca.size[0])), Image.LANCZOS)
MH = marca.size[1]
MX, MY = W - 250 - MW, 1872
lienzo = Image.alpha_composite(lienzo, cc.sombra(marca.split()[3], 22, 0.42, (MX + 4, MY + 10), (W, H)))
lienzo = cc.pegar_rgba(lienzo, marca, (MX, MY))

# ── 8 · grado final y grano común a todo el cuadro ──────────────────────────
out = cc.rematar(np.asarray(lienzo.convert("RGB"), dtype=np.float32),
                 sigma_grano=4.6, vineta=0.17, semilla=23, negro=1.0, blanco=253.0, gamma=0.985)
dst = "/Users/alexander/Documents/AXIUM-WEB/public/images/portadas-propuesta/v2/fintrace.jpg"
Image.fromarray(out.astype(np.uint8)).save(dst, quality=94, subsampling=0)
cc.medir(dst)

# ── la comprobación de la regla C ────────────────────────────────────────────
alto_linea_fuente = 104.0      # medido en la captura: caja del titular
alto_recorte = RECORTE[3] - RECORTE[1]
servido = (alto_linea_fuente / alto_recorte) * g["pantalla"]["h"] * (421.0 / W)
print(f"  regla C · titular servido a 421 px de tarjeta = {servido:.1f} px  (umbral 12)")
print(f"  pantalla = {g['pantalla']['w']/W*100:.1f} % del ancho · aparato de y {Y/H*100:.1f} % a {(Y+DH)/H*100:.1f} %")
print(f"  marca {MW}×{MH} en ({MX},{MY}) → banda {MY/H*100:.1f}–{(MY+MH)/H*100:.1f} % (83 % central = 8,3–91,7) · servida {MW*421/W:.0f} px de ancho")
