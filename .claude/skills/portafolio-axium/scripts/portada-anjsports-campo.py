#!/usr/bin/env python3
"""ANJ Sports — portada sobre campo abstracto, con los dos celulares CONSTRUIDOS (2026-10-21).

Alexander, sobre la laptop en el piso rojo de competencia: «para ese caso prefiero un fondo
ligeramente abstracto y que no todo esté en la misma posición o estilo, varía sin perder el
profesionalismo ni calidad». Rematch y Daesur ya son una laptop en tres cuartos, centrada.

La idea: anjsports.com cambia de color con la marca que enseña (XIOM cian, Butterfly magenta).
El campo `campos/anjsports-flare.jpg` ya tiene esas dos luces entrando por los lados; cada
celular va junto a SU luz y la recoge en el canto. Los aparatos salen de
`marcos/movil-v-820-negro` (anillo de ancho constante), nunca del modelo.

El campo se suaviza antes de usarlo: traía grano de película pesado y la regla de los fondos es
que el grano apenas se note (~2–3/255 de desvío en un recorte liso).

Uso:  python3 portada-anjsports-campo.py <pantalla-xiom.png> <pantalla-butterfly.png> <dir-salida>
      (las pantallas a 1170×2532: barra de estado de 54 pt + la página a 390×790 @3x)
Sale: <dir>/anj-campo-{enteros,cortados}.jpg a 3072×2304.
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
CIAN = (43, 232, 200)
MAGENTA = (232, 56, 176)

# Segunda vuelta (Alexander: «los gradientes son muy básicos y muy fosforescentes, hazlo más
# sutil y fino texturizado»): campo nuevo `campos/anjsports-sutil-1.png` —casi negro, velos de
# teal y ciruela apagados (L máx 51/255), textura de papel mate a ~2/255— que entra SIN
# desenfoque, porque la textura es lo que se quiere; los cantos recogen esos tonos apagados.
SUTIL = "--sutil" in sys.argv
TEAL_APAGADO = (78, 150, 140)
CIRUELA_APAGADA = (150, 78, 132)


def girado(disp, cx, cy, alto, grados, escorzo=0.0):
    """El aparato a `alto` px, centrado en (cx, cy), girado y con un canto escorzado."""
    dw, dh = disp.size
    s = alto / dh
    w, h = dw * s, dh * s
    th = math.radians(grados)
    base = [(-w / 2, -h / 2 + h * escorzo), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2 - h * escorzo)]
    return [(cx + x * math.cos(th) - y * math.sin(th), cy + x * math.sin(th) + y * math.cos(th)) for x, y in base]


def campo():
    if SUTIL:
        return Image.open(f"{SK}/campos/anjsports-sutil-1.png").convert("RGB").resize((W, H), Image.LANCZOS)
    c = Image.open(f"{SK}/campos/anjsports-flare.jpg").convert("RGB").resize((W, H), Image.LANCZOS)
    return c.filter(ImageFilter.GaussianBlur(16))


def poner(lienzo, captura, dest, luz, lado, sombra_sobre=True):
    disp, _ = cc.montar_dispositivo(MARCO, captura)
    d = cc.deformar(disp, dest, lienzo.size)
    sil = d.split()[3]
    if sombra_sobre:
        # la sombra solo se ve sobre el otro celular: sobre el negro no hay dónde caer
        for desenf, op, desp in [(24, 0.55, (18, 30)), (90, 0.45, (60, 100))]:
            lienzo = Image.alpha_composite(lienzo, cc.sombra(sil, desenf, op, desp, lienzo.size))
    # la pantalla encendida echa su luz alrededor
    a = np.asarray(d, dtype=np.float32)
    medio = a[..., :3][a[..., 3] > 200].mean(axis=0)
    base = np.asarray(lienzo.convert("RGB"), dtype=np.float32) / 255.0
    base = cc.suma_luz(base, cc.resplandor(sil, medio / 255.0, 220, 0.03 if SUTIL else 0.05, (0, 0), lienzo.size))
    lienzo = Image.fromarray((base * 255).astype(np.uint8)).convert("RGBA")
    lienzo = Image.alpha_composite(lienzo, d)
    # y el canto recoge la luz de color que tiene al lado. Ojo: `luz_de_borde` resta el alfa
    # desplazado HACIA `lado`, así que ilumina el canto contrario: para el canto izquierdo se
    # le pasa "der" (salió al revés en la primera prueba)
    b = np.asarray(lienzo.convert("RGB"), dtype=np.float32) / 255.0
    contrario = {"izq": "der", "der": "izq"}[lado]
    b = cc.suma_luz(b, cc.luz_de_borde(sil, lienzo.size, (0, 0), contrario, 7, luz, 0.4 if SUTIL else 0.5))
    return Image.fromarray((b * 255).astype(np.uint8)).convert("RGBA")


def componer(xiom, butterfly, frente, atras):
    l = campo().convert("RGBA")
    d0, _ = cc.montar_dispositivo(MARCO, butterfly)
    luz_atras, luz_frente = (CIRUELA_APAGADA, TEAL_APAGADO) if SUTIL else (MAGENTA, CIAN)
    l = poner(l, butterfly, girado(d0, *atras), luz_atras, "der", sombra_sobre=False)  # canto derecho
    l = poner(l, xiom, girado(d0, *frente), luz_frente, "izq")  # canto izquierdo
    # con el campo sutil el grano ya viene en la textura: solo un velo fino para casar los aparatos
    out = cc.rematar(np.asarray(l.convert("RGB"), dtype=np.float32), sigma_grano=1.2 if SUTIL else 2.8,
                     vineta=0.04 if SUTIL else 0.06, semilla=41)
    return Image.fromarray(out.astype(np.uint8))


if __name__ == "__main__":
    xiom, butterfly, salida = sys.argv[1:4]
    os.makedirs(salida, exist_ok=True)
    # cx, cy, alto, grados, escorzo
    formas = {
        "enteros": ((W * 0.40, H * 0.54, H * 0.86, -6, 0.006), (W * 0.66, H * 0.46, H * 0.80, 7, 0.006)),
        "cortados": ((W * 0.37, H * 0.66, H * 1.10, -11, 0.008), (W * 0.70, H * 0.55, H * 1.00, 9, 0.008)),
    }
    for n, (f, a) in formas.items():
        ruta = f"{salida}/anj-campo-{n}{'-sutil' if SUTIL else ''}.jpg"
        componer(xiom, butterfly, f, a).save(ruta, quality=93, subsampling=0)
        cc.medir(ruta)
