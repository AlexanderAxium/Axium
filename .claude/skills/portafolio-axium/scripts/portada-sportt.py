#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sportt Perú — ciclorama de estudio + móvil construido. 3072×2304, 4:3 nativo.

El campo NO es un degradado abstracto como los de Fintrace o ANJ: es un
**ciclorama**, el fondo infinito de papel sobre el que Sportt fotografía cada
una de sus categorías (sus propias fichas `cat-*.webp` son producto sobre suelo
de estudio con un halo magenta detrás). La portada pone la tienda entera sobre
ese mismo fondo, con su sombra de contacto y su reflejo en el papel: el aparato
se APOYA, no flota — que era lo que la undécima generación dejó sin resolver.

Y por eso es claro: ANJ Sports, el otro caso de tenis de mesa del índice, es
negro con dos luces (cian de XIOM y magenta de Butterfly). Dos tarjetas oscuras
del mismo rubro en la misma rejilla serían gemelas. Esta es la contraria.
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
W, H = 3072, 2304

# ── 1 · el campo generado, graduado hacia el magenta de Sportt ───────────────
_c = Image.open(f"{SK}/campos/sportt-flare.jpg").convert("RGB")
campo = _c.resize((W, H), Image.LANCZOS)
a = np.asarray(campo, dtype=np.float32)

# el tono y la saturación se ajustan en HSV, nunca multiplicando canales.
# Magenta medido en el logotipo real (#FD4391) = 334,3° / 73,5 %.
a = cc.ajustar_hs(a, 334.3, sat_max=0.74, fuerza_tono=0.65)

# ⚠️ Lo que no funciona: oscurecer el suelo MULTIPLICANDO. El campo del modelo
# arrastra rosa en toda la mitad baja, y un multiplicador lo lleva a malva
# sucio. El suelo y el papel de la izquierda se MEZCLAN hacia un color medido
# —grafito frío y papel frío—, que es la misma lección del § 3 de la undécima
# generación llevada del tono a la luminancia.
yy = np.linspace(0.0, 1.0, H, dtype=np.float32)[:, None, None]
xx = np.linspace(0.0, 1.0, W, dtype=np.float32)[None, :, None]

GRAFITO = np.asarray([104.0, 104.0, 114.0], dtype=np.float32)[None, None, :]
PAPEL = np.asarray([214.0, 214.0, 222.0], dtype=np.float32)[None, None, :]

# el papel de la izquierda vuelve a ser papel, sin tocar el magenta de la derecha
frio = np.clip((0.44 - xx) / 0.44, 0, 1) ** 1.6
a = a * (1.0 - frio * 0.58) + PAPEL * (frio * 0.58)

# el suelo del ciclorama se hunde hacia el grafito: hace falta rango y hace
# falta que el aparato se separe del fondo
suelo = np.clip((yy - 0.48) / 0.52, 0, 1) ** 1.7
a = a * (1.0 - suelo * 0.78) + GRAFITO * (suelo * 0.78)
# la esquina inferior izquierda, la sombra abierta de un plató
rincon = np.clip((0.46 - xx) / 0.46, 0, 1) ** 1.3 * np.clip((yy - 0.34) / 0.66, 0, 1)
a = a * (1.0 - rincon * 0.42) + GRAFITO * 0.80 * (rincon * 0.42)

# el núcleo caliente llega a blanco de verdad
L = a.mean(axis=2, keepdims=True)
calor = np.clip((L - 196.0) / 50.0, 0, 1)
a = a + calor * (255.0 - a) * 0.55

# la micro-textura del modelo se borra y el grano se repone limpio al final
_b = np.asarray(
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3.5)),
    dtype=np.float32,
)
a = _b
a = cc.curva(a, negro=0.0, blanco=255.0, gamma=1.0)

# ── 2 · el móvil: marco construido + captura real del sitio en vivo ──────────
dir_marco = f"{SK}/marcos/movil-v-820-negro"
captura = f"{SK}/capturas-clientes/sportt/2026-10/m-producto-s150-4x.png"
RECORTE = (0, 0, 1560, 3376)  # 0,4621 ≈ el 0,4615 de la pantalla
disp, g = cc.montar_dispositivo(dir_marco, captura, RECORTE)
DW, DH = disp.size
X, Y = 1612, 212

# giro contrario al de Fintrace (−2,2°) para que no sea el mismo gesto, y el
# canto izquierdo escorzado: el aparato está de pie, girado hacia la cámara.
_th = math.radians(1.7)
_cx, _cy = DW / 2.0, DH / 2.0
_base = [(0, DH * 0.009), (DW, 0), (DW, DH), (0, DH * 0.991)]


def _rot(p):
    x, y = p[0] - _cx, p[1] - _cy
    return (
        X + _cx + x * math.cos(_th) - y * math.sin(_th),
        Y + _cy + x * math.sin(_th) + y * math.cos(_th),
    )


_dest = [_rot(p) for p in _base]
disp = cc.deformar(disp, _dest, (W, H))

lienzo = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).convert("RGBA")
sil = disp.split()[3]

# ── 3 · el papel devuelve al aparato: el reflejo que lo apoya ───────────────
# Un ciclorama de papel es semi-mate. El reflejo es corto, muy desvaído y se
# apaga a los pocos cientos de píxeles. Es lo que convierte el campo en suelo
# — y es lo que la undécima generación dejó anotado como pendiente («las piezas
# flotan sobre nada»).
# ⚠️ La cuenta del espejo, que es donde se falla: un punto en `y` acaba en
# `Hc−1−y` al voltear el lienzo entero, y se quiere que el pie (`_pie`) caiga
# sobre sí mismo. El desplazamiento es `2·_pie − Hc + 1`, no `_pie − Hc`.
_pie = int(max(p[1] for p in _dest))
refl = disp.transpose(Image.FLIP_TOP_BOTTOM).filter(ImageFilter.GaussianBlur(11))
_ra = np.asarray(refl, dtype=np.float32)
_dy = 2 * _pie - H + 1
# el desvanecido se mide desde la línea del espejo, no desde el borde del lienzo
_fila = np.arange(H, dtype=np.float32) + _dy - _pie
_fade = np.clip(1.0 - np.clip(_fila, 0, None) / 300.0, 0, 1)[:, None] ** 1.7
_ra[..., 3] *= _fade * 0.30
refl = Image.fromarray(np.clip(_ra, 0, 255).astype(np.uint8))
_cap = Image.new("RGBA", (W, H), (0, 0, 0, 0))
_cap.paste(refl, (0, _dy), refl)
lienzo = Image.alpha_composite(lienzo, _cap)

# ── 4 · las sombras de contacto. La luz entra por el extremo superior
#        derecho, así que caen hacia abajo a la izquierda.
lienzo = Image.alpha_composite(lienzo, cc.sombra(sil, 14, 0.86, (-10, 13), (W, H)))
lienzo = Image.alpha_composite(lienzo, cc.sombra(sil, 56, 0.58, (-34, 42), (W, H)))
lienzo = Image.alpha_composite(lienzo, cc.sombra(sil, 180, 0.42, (-122, 132), (W, H)))

# ── 5 · el resplandor de la pantalla sobre el papel ──────────────────────────
_a = np.asarray(disp, dtype=np.float32)
_m = _a[..., 3] > 200
medio = _a[..., :3][_m].mean(axis=0)
base = np.asarray(lienzo.convert("RGB"), dtype=np.float32)
halo = cc.resplandor(sil, medio / 255.0, 300, 0.060, (0, 0), (W, H))
base = 255.0 - (255.0 - base) * (1.0 - halo)
lienzo = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).convert("RGBA")

# ── 6 · el aparato ──────────────────────────────────────────────────────────
lienzo = Image.alpha_composite(lienzo, disp)

# ── 7 · el reflejo del propio campo sobre el cristal, al 5 % ────────────────
ref = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).transpose(Image.FLIP_LEFT_RIGHT)
ref = ref.filter(ImageFilter.GaussianBlur(26)).convert("RGBA")
_msk = cc.deformar(
    Image.open(f"{dir_marco}/mascara.png").convert("RGBA"), _dest, (W, H)
).split()[3]
ref.putalpha(_msk.point(lambda v: int(v * 0.05)))
lienzo = Image.alpha_composite(lienzo, ref)

# ── 8 · la marca real. Sale del icono de 512 de su propio sitio (el único
#        fichero donde el lockup mide más de 160 px), des-matado contra el
#        blanco por sus dos tintas. Ni redibujada ni recoloreada. Va a la
#        izquierda, a 1.300 px de la cabecera del sitio — que además aquí no
#        sale, porque la pantalla va desplazada por debajo de ella.
marca = Image.open(f"{SK}/marcas/sportt-lockup.png").convert("RGBA")
MW = 960
marca = marca.resize((MW, int(marca.size[1] * MW / marca.size[0])), Image.LANCZOS)
MH = marca.size[1]
MX, MY = 292, 966
lienzo = Image.alpha_composite(
    lienzo, cc.sombra(marca.split()[3], 26, 0.16, (MX + 6, MY + 12), (W, H))
)
lienzo = cc.pegar_rgba(lienzo, marca, (MX, MY))

# ── 9 · grado final y grano común a todo el cuadro ──────────────────────────
out = cc.rematar(
    np.asarray(lienzo.convert("RGB"), dtype=np.float32),
    sigma_grano=4.8,
    vineta=0.10,
    semilla=29,
    negro=0.0,
    blanco=255.0,
    gamma=0.99,
)
dst = "/Users/alexander/Documents/AXIUM-WEB/public/images/proyects/sportt/sp-portada.jpg"
os.makedirs(os.path.dirname(dst), exist_ok=True)
Image.fromarray(out.astype(np.uint8)).save(dst, quality=94, subsampling=0)
cc.medir(dst)

# ── la comprobación de la regla C (12 px servidos) ───────────────────────────
alto_elemento = 1300.0  # medido en la captura: la lámina del producto
alto_recorte = RECORTE[3] - RECORTE[1]
servido = (alto_elemento / alto_recorte) * g["pantalla"]["h"] * (421.0 / W)
print(f"  regla C · lámina del producto servida a 421 px = {servido:.1f} px  (umbral 12)")
print(
    f"  aparato de y {Y / H * 100:.1f} % a {(Y + DH) / H * 100:.1f} % · "
    f"x {X / W * 100:.1f} % a {(X + DW) / W * 100:.1f} %"
)
print(
    f"  marca {MW}×{MH} en ({MX},{MY}) → banda {MY / H * 100:.1f}–{(MY + MH) / H * 100:.1f} % "
    f"(83 % central = 8,3–91,7) · servida {MW * 421 / W:.0f} px de ancho"
)
