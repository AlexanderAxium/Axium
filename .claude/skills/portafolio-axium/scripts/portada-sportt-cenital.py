#!/usr/bin/env python3
"""Sportt Perú — portada cenital (2026-10-21): el celular CONSTRUIDO, apoyado sobre una superficie
clara, con una sola pelota.

Alexander: «mejora lo de sportt». La anterior (`sp-portada-sobria.jpg`) era la laptop entera a
media distancia con una paleta: la interfaz no se leía a 421 px. Ahora, en la familia de las
portadas nuevas (UI grande y real) pero en CLARO, porque Rematch, ANJ, Feniz y Daesur son
oscuras: vista cenital como Oura o Constellation, el celular con la portada móvil de
sporttperu.com (la madera Viscaria) y UNA pelota generada en la escena («un objeto que diga el
rubro, no la colección entera», la regla de la sobria). La paleta ya está en la pantalla.

La luz entra por arriba a la izquierda (la sombra de la pelota cae abajo-derecha) y la del
celular cae igual.

Uso:  python3 portada-sportt-cenital.py <pantalla.png> <campo.png> <salida.jpg>
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
MARCO = f"{SK}/marcos/movil-v-820-negro"
W, H = 3072, 2304


def girado(disp, cx, cy, alto, grados):
    dw, dh = disp.size
    s = alto / dh
    w, h = dw * s, dh * s
    th = math.radians(grados)
    base = [(-w / 2, -h / 2), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2)]
    return [(cx + x * math.cos(th) - y * math.sin(th), cy + x * math.sin(th) + y * math.cos(th)) for x, y in base]


def main(pantalla, ruta_campo, salida):
    campo = Image.open(ruta_campo).convert("RGB").resize((W, H), Image.LANCZOS)
    lienzo = campo.convert("RGBA")
    disp, _ = cc.montar_dispositivo(MARCO, pantalla)
    dest = girado(disp, W * 0.40, H * 0.50, H * 0.86, -14)
    d = cc.deformar(disp, dest, lienzo.size)
    sil = d.split()[3]
    # apoyado a pocos milímetros: contacto corto y duro, y una penumbra larga hacia abajo-derecha
    for desenf, op, desp in [(8, 0.55, (6, 10)), (30, 0.32, (28, 42)), (110, 0.20, (90, 130))]:
        lienzo = Image.alpha_composite(lienzo, cc.sombra(sil, desenf, op, desp, lienzo.size, color=(60, 40, 45)))
    lienzo = Image.alpha_composite(lienzo, d)
    # el vidrio recoge la luz de la ventana: un barrido suave desde arriba a la izquierda
    msk = cc.deformar(Image.open(f"{MARCO}/mascara.png").convert("RGBA"), dest, lienzo.size).split()[3]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    barrido = np.clip(1.0 - (xx / W * 0.9 + yy / H * 1.1), 0, 1) ** 2.2 * 0.10
    b = np.asarray(lienzo.convert("RGB"), dtype=np.float32) / 255.0
    a = (np.asarray(msk, np.float32) / 255.0 * barrido)[..., None]
    b = cc.suma_luz(b, a * np.asarray([1.0, 0.96, 0.97], np.float32))
    out = cc.rematar(b * 255.0, sigma_grano=1.8, vineta=0.0, semilla=23)
    Image.fromarray(out.astype(np.uint8)).save(salida, quality=93, subsampling=0)
    cc.medir(salida)


if __name__ == "__main__":
    main(*sys.argv[1:4])
