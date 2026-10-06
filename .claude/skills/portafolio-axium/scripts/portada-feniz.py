#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Feniz — campo de oro que SUBE desde el borde inferior (el ave que se levanta,
que es su propio nombre), tableta CONSTRUIDA con el panel real de una cuenta de
demostración, y el logotipo real arriba a la derecha. 3072×2304, 4:3 nativo.

No se parece a sus vecinas a propósito: Fintrace es un barrido diagonal azul y
ANJ es negro con dos luces laterales; aquí la luz es una sola y viene de abajo.
"""
import os, sys
import numpy as np
from PIL import Image, ImageFilter

SK = "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium"
sys.path.insert(0, f"{SK}/scripts")
from importlib import import_module
cc = import_module("componer-campo")

S = f"{SK}/campos"
W, H = 3072, 2304
ORO = (0xF5, 0xBB, 0x32)          # muestreado de su <h1>: H 42,2° · S 79,6 %

# ── 1 · el campo generado, con el tono MEDIDO, no estimado ──────────────────
_c = Image.open(f"{S}/feniz-flare.jpg").convert("RGB")
campo = _c.crop((90, 0, 90 + 2890, 2168)).resize((W, H), Image.LANCZOS).transpose(Image.FLIP_LEFT_RIGHT)
a = np.asarray(campo, np.float32)
# medido en el campo generado: la banda alta sale a H 44,8° S 80,9 % (el objetivo
# es 42,2 / 79,6) y los medios a H 35° S 96 %, que es oro pero tirando a naranja.
# Se corrige en HSV —tono al 55 % hacia los 42° y techo de saturación en 0,90—
# porque multiplicar canales para «acercar» un color fue lo que puso lila a
# Fintrace. Ni beige ni naranja chillón: se comprueba al final con hsv().
a = cc.ajustar_hs(a, 42.0, sat_max=0.90, fuerza_tono=0.55)
a = cc.curva(a, negro=2.0, blanco=253.0, gamma=0.97)
# fuera la micro-textura del modelo. En el tercio alto, casi negro, los grumos
# se ven más que en ninguna parte, así que ahí el desenfoque es mayor.
_im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
_b1 = np.asarray(_im.filter(ImageFilter.GaussianBlur(3.5)), np.float32)
_b2 = np.asarray(_im.filter(ImageFilter.GaussianBlur(14.0)), np.float32)
_L = a.mean(axis=2, keepdims=True)
_osc = np.clip((70.0 - _L) / 55.0, 0, 1)                      # el negro de arriba
_cla = np.clip((_L - 115.0) / 60.0, 0, 1) * 0.92              # y el oro encendido
_w = np.clip(_osc + _cla, 0, 1)
a = _b1 * (1.0 - _w) + _b2 * _w
lienzo = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).convert("RGBA")

# ── 2 · la tableta construida, con el panel real ────────────────────────────
dir_marco = f"{SK}/marcos/tableta-v-1020-grafito"
captura = f"{SK}/capturas-clientes/feniz/assets/trm-panel.png"
RECORTE = (0, 0, 1170, 1560)      # 1170×1560 → aspecto 0,7500 = el de la pantalla
disp, g = cc.montar_dispositivo(dir_marco, captura, RECORTE)
DW, DH = disp.size

# gira al otro lado que la de Fintrace (+1,7°) y el canto DERECHO escorza: la
# luz sube por la izquierda, así que ese es el lado que mira a cámara.
import math
_th = math.radians(-1.7)
X, Y = 1356, 452
_cx, _cy = DW / 2.0, DH / 2.0
_base = [(0, 0), (DW, DH * 0.009), (DW, DH * 0.991), (0, DH)]
def _rot(p):
    x, y = p[0] - _cx, p[1] - _cy
    return (X + _cx + x * math.cos(_th) - y * math.sin(_th),
            Y + _cy + x * math.sin(_th) + y * math.cos(_th))
_dest = [_rot(p) for p in _base]
disp = cc.deformar(disp, _dest, (W, H))
sil = disp.split()[3]

# ── 3 · la sombra. La clave viene de ABAJO a la izquierda, así que la sombra
#        sube y va a la derecha. Es lo que hace creíble una luz de forja.
lienzo = Image.alpha_composite(lienzo, cc.sombra(sil, 40, 0.66, (32, -26), (W, H)))
lienzo = Image.alpha_composite(lienzo, cc.sombra(sil, 210, 0.44, (165, -120), (W, H)))

# ── 4 · el resplandor de la pantalla sobre el campo, entibiado para que
#        pertenezca al mismo cuadro y no abra un agujero frío en el oro
_a = np.asarray(disp, np.float32); _m = _a[..., 3] > 200
medio = _a[..., :3][_m].mean(axis=0)
medio = medio * np.asarray([1.06, 1.00, 0.84])        # el oro del entorno tiñe la luz
medio = np.clip(medio, 0, 255) / 255.0
base = np.asarray(lienzo.convert("RGB"), np.float32)
for rad, op in ((300, 0.11), (780, 0.10)):
    base = 255.0 - (255.0 - base) * (1.0 - cc.resplandor(sil, medio, rad, op, (0, 0), (W, H)))
lienzo = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).convert("RGBA")

# ── 5 · el aparato, y el canto encendido por la luz de abajo ────────────────
lienzo = Image.alpha_composite(lienzo, disp)
b = np.asarray(lienzo.convert("RGB"), np.float32) / 255.0
b = cc.suma_luz(b, cc.luz_de_borde(sil, (W, H), (0, 0), "abajo", 13, ORO, 0.40))
b = cc.suma_luz(b, cc.luz_de_borde(sil, (W, H), (0, 0), "izq", 10, ORO, 0.30))
lienzo = Image.fromarray(np.clip(b * 255.0, 0, 255).astype(np.uint8)).convert("RGBA")

# ── 6 · el reflejo del propio campo sobre el cristal, al 5 % ────────────────
ref = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).transpose(Image.FLIP_TOP_BOTTOM)
ref = ref.filter(ImageFilter.GaussianBlur(28)).convert("RGBA")
_msk = cc.deformar(Image.open(f"{dir_marco}/mascara.png").convert("RGBA"), _dest, (W, H)).split()[3]
ref.putalpha(_msk.point(lambda v: int(v * 0.05)))
lienzo = Image.alpha_composite(lienzo, ref)

# ── 7 · la marca real, arriba a la IZQUIERDA: a 1 100 px de la cabecera «Feniz»
#        que ya lleva la propia pantalla, y sobre el negro del tercio alto.
marca = Image.open("/Users/alexander/Documents/AXIUM-WEB/public/images/proyects/feniz/fz-logo.png").convert("RGBA")
MW = 560
marca = marca.resize((MW, int(marca.size[1] * MW / marca.size[0])), Image.LANCZOS)
MH = marca.size[1]
MX, MY = 250, 300
lienzo = Image.alpha_composite(lienzo, cc.sombra(marca.split()[3], 26, 0.40, (MX + 6, MY + 12), (W, H)))
lienzo = cc.pegar_rgba(lienzo, marca, (MX, MY))

# ── 8 · grado final y grano común a todo el cuadro ─────────────────────────
out = cc.rematar(np.asarray(lienzo.convert("RGB"), np.float32),
                 sigma_grano=4.8, vineta=0.16, semilla=57, negro=0.0, blanco=253.0, gamma=0.99)
dst = "/Users/alexander/Documents/AXIUM-WEB/public/images/portadas-propuesta/v2/feniz.jpg"
Image.fromarray(out.astype(np.uint8)).save(dst, quality=94, subsampling=0)
cc.medir(dst)

alto_titular = 139.0              # medido: la caja de «Dashboard» en la captura
servido = (alto_titular / (RECORTE[3] - RECORTE[1])) * g["pantalla"]["h"] * (421.0 / W)
print(f"  regla C · «Dashboard» servido a 421 px de tarjeta = {servido:.1f} px  (umbral 12)")
print(f"  cifras de KPI ({85.0/1560*g['pantalla']['h']*421/W:.1f} px) · pantalla {g['pantalla']['w']/W*100:.1f} % del ancho")
print(f"  aparato y {Y/H*100:.1f}–{(Y+DH)/H*100:.1f} % · marca {MW}×{MH} en y {MY/H*100:.1f}–{(MY+MH)/H*100:.1f} % (83 % central = 8,3–91,7)")
# la comprobación del oro se hace SOLO sobre campo —a la derecha del aparato y
# bajo la marca—, nunca sobre la pantalla blanca, que falsearía el tono.
_f = np.asarray(Image.open(dst).convert("RGB"), np.float32)[1300:2080, 160:940]
_H, _S, _V = cc.hsv(_f)
for _lo, _hi in ((0.45, 0.70), (0.70, 0.88), (0.88, 1.01)):
    _k = (_V >= _lo) & (_V < _hi)
    if _k.sum() > 3000:
        print(f"  oro medido  V {_lo:.2f}-{_hi:.2f}  H={_H[_k].mean():5.1f}°  S={_S[_k].mean()*100:5.1f} %"
              f"  RGB={_f[_k].mean(axis=0).round(0)}   (marca #F5BB32 = 42,2° / 79,6 %)")
