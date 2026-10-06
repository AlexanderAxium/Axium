#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
componer-campo.py — portadas de CAMPO ABSTRACTO + DISPOSITIVO CONSTRUIDO.

La doctrina que implementa (undécima generación):

  · el CAMPO lo genera el modelo, y solo el campo: luz, color y grano. Sin un
    solo objeto, sin una sola letra, sin escena fotográfica de ningún lugar.
  · el DISPOSITIVO no lo genera nadie: sale de `marco-dispositivo.cjs`, que lo
    dibuja en SVG con el anillo de ancho constante y lo rinde con Playwright
    con la pantalla transparente.
  · la PANTALLA es una captura real, recortada a una vista de pocos elementos
    y tipografía grande, y medida: el elemento mayor tiene que pasar de 12 px
    servido a 421 px de ancho de tarjeta.
  · lo que pega las capas no es el recorte: es la SOMBRA DE CONTACTO, el
    RESPLANDOR de la pantalla sobre el campo, el REFLEJO del cristal y un
    GRANO FINAL común a todo el cuadro.

Solo PIL y numpy (en esta máquina no hay OpenCV ni scipy).
"""

import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

Image.MAX_IMAGE_PIXELS = None


# ── utilidades ───────────────────────────────────────────────────────────────

def coef_perspectiva(destino, origen):
    """Coeficientes de Image.PERSPECTIVE que llevan `origen` (4 esquinas de la
    imagen fuente) a `destino` (4 esquinas en el lienzo). Orden TL,TR,BR,BL."""
    A, B = [], []
    for (xd, yd), (xo, yo) in zip(destino, origen):
        A.append([xd, yd, 1, 0, 0, 0, -xo * xd, -xo * yd])
        A.append([0, 0, 0, xd, yd, 1, -yo * xd, -yo * yd])
        B += [xo, yo]
    return np.linalg.solve(np.asarray(A, dtype=np.float64), np.asarray(B, dtype=np.float64))


def pegar_rgba(base, capa, xy):
    """Pega RGBA sobre RGBA respetando el alfa de ambos."""
    tmp = Image.new("RGBA", base.size, (0, 0, 0, 0))
    tmp.paste(capa, xy)
    return Image.alpha_composite(base, tmp)


def sombra(silueta, desenfoque, opacidad, desplaz, tam, color=(0, 0, 0)):
    """Sombra proyectada a partir de la silueta alfa de un objeto."""
    s = Image.new("L", tam, 0)
    s.paste(silueta, desplaz)
    s = s.filter(ImageFilter.GaussianBlur(desenfoque))
    out = Image.new("RGBA", tam, color + (0,))
    out.putalpha(s.point(lambda v: int(v * opacidad)))
    return out


def resplandor(silueta, color, desenfoque, opacidad, desplaz, tam):
    """El halo de luz que una pantalla encendida echa sobre lo que la rodea.
    Se suma en `screen`, que es como se comporta la luz."""
    s = Image.new("L", tam, 0)
    s.paste(silueta, desplaz)
    s = s.filter(ImageFilter.GaussianBlur(desenfoque))
    a = np.asarray(s, dtype=np.float32) / 255.0 * opacidad
    return a[..., None] * np.asarray(color, dtype=np.float32)[None, None, :]


def grano(tam, sigma, semilla=7):
    """Grano fotográfico: ruido gaussiano, isotrópico, igual en todo el cuadro."""
    rng = np.random.default_rng(semilla)
    g = rng.normal(0.0, sigma, (tam[1], tam[0], 1)).astype(np.float32)
    g = g + rng.normal(0.0, sigma * 0.55, (tam[1], tam[0], 3)).astype(np.float32)
    return g


def curva(a, negro=0.0, blanco=255.0, gamma=1.0):
    x = np.clip((a - negro) / max(1e-6, (blanco - negro)), 0, 1)
    return np.power(x, gamma) * 255.0


def suma_luz(b01, add):
    """Mezcla `screen`. Todo en 0..1 de principio a fin: mezclar escalas es lo
    que convierte una luz de borde en un pegote blanco."""
    return 1.0 - (1.0 - b01) * (1.0 - add)


def luz_de_borde(alfa, tam, xy, lado, ancho, color, opac, sesgo=0.35):
    """La luz que el entorno deja en el canto de un objeto: el alfa menos el
    alfa desplazado hacia dentro. Lo que delata un montaje es que falte; lo que
    lo delata más es que sobre."""
    base = Image.new("L", tam, 0); base.paste(alfa, xy)
    dx = -ancho if lado in ("izq", "arriba") else ancho
    dy = int(ancho * sesgo)
    if lado in ("arriba", "abajo"):
        dx, dy = int(ancho * sesgo), (-ancho if lado == "abajo" else ancho)
    desp = Image.new("L", tam, 0); desp.paste(alfa, (xy[0] + dx, xy[1] + dy))
    a = np.clip(np.asarray(base, np.float32) - np.asarray(desp, np.float32), 0, 255)
    a = np.asarray(Image.fromarray(a.astype(np.uint8)).filter(ImageFilter.GaussianBlur(ancho * 0.5)), np.float32)
    return (a / 255.0 * opac)[..., None] * (np.asarray(color, np.float32) / 255.0)[None, None, :]


def hsv(a):
    """RGB 0..255 → (H en grados, S 0..1, V 0..1). Sin dependencias."""
    x = a / 255.0
    mx = x.max(axis=2); mn = x.min(axis=2); d = mx - mn
    r, g, b = x[..., 0], x[..., 1], x[..., 2]
    H = np.zeros_like(mx); m = d > 1e-6
    i = (mx == r) & m; H[i] = (60.0 * ((g - b) / np.maximum(d, 1e-6)))[i] % 360.0
    i = (mx == g) & m; H[i] = (60.0 * (2.0 + (b - r) / np.maximum(d, 1e-6)))[i]
    i = (mx == b) & m; H[i] = (60.0 * (4.0 + (r - g) / np.maximum(d, 1e-6)))[i]
    S = np.where(mx > 0, d / np.maximum(mx, 1e-6), 0.0)
    return H, S, mx


def desde_hsv(H, S, V):
    H = np.mod(H, 360.0)
    c = V * S; x = c * (1.0 - np.abs(np.mod(H / 60.0, 2.0) - 1.0)); m = V - c
    z = np.zeros_like(H)
    seg = (H / 60.0).astype(np.int32) % 6
    r = np.select([seg == 0, seg == 1, seg == 2, seg == 3, seg == 4, seg == 5], [c, x, z, z, x, c])
    g = np.select([seg == 0, seg == 1, seg == 2, seg == 3, seg == 4, seg == 5], [x, c, c, x, z, z])
    b = np.select([seg == 0, seg == 1, seg == 2, seg == 3, seg == 4, seg == 5], [z, z, x, c, c, x])
    return np.clip(np.dstack([r + m, g + m, b + m]) * 255.0, 0, 255)


def ajustar_hs(a, tono_objetivo, sat_max=None, fuerza_tono=1.0):
    """Lleva el TONO del campo al de la marca y le pone techo a la saturación.
    Se corrige en HSV y no multiplicando canales: multiplicar el rojo un 63 %
    para «acercar» un azul fue lo que lo volvió lila en Fintrace."""
    H, S, V = hsv(a)
    dH = ((tono_objetivo - H + 180.0) % 360.0) - 180.0
    H = H + dH * fuerza_tono
    if sat_max is not None:
        S = np.minimum(S, sat_max)
    return desde_hsv(H, S, V)


def mezcla_color(a, origen_hex, destino_hex, fuerza=1.0):
    """Empuja el color dominante del campo hacia el hex de la marca."""
    o = np.asarray([int(origen_hex[i:i + 2], 16) for i in (1, 3, 5)], dtype=np.float32)
    d = np.asarray([int(destino_hex[i:i + 2], 16) for i in (1, 3, 5)], dtype=np.float32)
    k = np.where(o > 1, d / np.maximum(o, 1.0), 1.0)
    k = 1.0 + (k - 1.0) * fuerza
    return np.clip(a * k[None, None, :], 0, 255)


# ── el dispositivo: marco construido + captura real + cristal ────────────────

def montar_dispositivo(dir_marco, captura, recorte=None):
    """Devuelve un RGBA con el aparato entero: marco + pantalla + reflejo.
    `recorte` es (izq, arr, der, aba) sobre la captura; su aspecto DEBE coincidir
    con el de la pantalla del marco (se comprueba y se avisa)."""
    g = json.load(open(os.path.join(dir_marco, "geom.json")))
    marco = Image.open(os.path.join(dir_marco, "marco.png")).convert("RGBA")
    vidrio = Image.open(os.path.join(dir_marco, "vidrio.png")).convert("RGBA")
    mascara = Image.open(os.path.join(dir_marco, "mascara.png")).convert("RGBA")
    P = g["pantalla"]

    cap = Image.open(captura).convert("RGB")
    if recorte:
        cap = cap.crop(recorte)
    asp_cap = cap.size[0] / cap.size[1]
    asp_pan = P["w"] / P["h"]
    if abs(asp_cap - asp_pan) > 0.01:
        print(f"  ! aspecto captura {asp_cap:.4f} ≠ pantalla {asp_pan:.4f} — se deformaría")
    cap = cap.resize((P["w"], P["h"]), Image.LANCZOS)

    # un LCD real no da ni blanco puro ni negro puro, y va un punto más frío
    a = np.asarray(cap, dtype=np.float32)
    a = 6.0 + a * (249.0 / 255.0)
    a *= np.asarray([0.993, 0.998, 1.012], dtype=np.float32)[None, None, :]
    cap = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

    pantalla = Image.new("RGBA", marco.size, (0, 0, 0, 0))
    pantalla.paste(cap, (P["x"], P["y"]))
    pantalla.putalpha(mascara.split()[3])

    disp = Image.alpha_composite(pantalla, marco)
    disp = Image.alpha_composite(disp, vidrio)
    return disp, g


def deformar(disp, destino, lienzo):
    """Lleva el aparato a un cuadrilátero (TL,TR,BR,BL) del lienzo."""
    W, H = disp.size
    origen = [(0, 0), (W, 0), (W, H), (0, H)]
    c = coef_perspectiva(destino, origen)
    return disp.transform(lienzo, Image.PERSPECTIVE, c, Image.BICUBIC)


def pared_lateral(destino, grosor, dirv, color_claro, color_oscuro):
    """El canto del aparato cuando está girado: el polígono que va del borde
    cercano de la cara hasta donde cae la cara trasera. Es la pieza que un
    modelo de difusión nunca cierra bien, y aquí es un cuadrilátero exacto."""
    (x0, y0), (x1, y1), (x2, y2), (x3, y3) = destino
    dx, dy = dirv
    if grosor <= 0:
        return None
    # canto izquierdo: TL→BL desplazado
    quad = [(x0 + dx * grosor, y0 + dy * grosor), (x0, y0), (x3, y3), (x3 + dx * grosor, y3 + dy * grosor)]
    return quad, color_claro, color_oscuro


# ── grado final: lo que hace que las capas pertenezcan al mismo cuadro ───────

def rematar(arr, sigma_grano=4.2, vineta=0.0, semilla=11, negro=0.0, blanco=255.0, gamma=1.0):
    a = curva(arr, negro, blanco, gamma)
    if vineta > 0:
        h, w = a.shape[:2]
        yy, xx = np.mgrid[0:h, 0:w]
        r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
        a *= (1.0 - vineta * np.clip((r - 0.55) / 0.85, 0, 1))[..., None]
    a = a + grano((a.shape[1], a.shape[0]), sigma_grano, semilla)
    return np.clip(a, 0, 255)


def medir(path, ancho_servido=421):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im.convert("L"), dtype=np.float32)
    lo = np.asarray(im.convert("L").filter(ImageFilter.GaussianBlur(3)), dtype=np.float32)
    nit = float(((a - lo) ** 2).mean())
    print(f"  {os.path.basename(path)}  {im.size[0]}×{im.size[1]}  rango={int(a.max()-a.min())}"
          f"  nitidez={nit:.0f}  <5={float((a<5).mean())*100:.2f}%  >250={float((a>250).mean())*100:.2f}%"
          f"  factor_servido={ancho_servido/im.size[0]:.4f}")
