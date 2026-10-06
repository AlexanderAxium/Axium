#!/usr/bin/env python3
"""Portada del arquetipo «dispositivo en escena real»: compone por capas.

QUÉ HACE
  Monta una portada de ficha al modo de brandvm (Aequitas, Readymode): un
  dispositivo de verdad, dentro de una escena de verdad con su luz y su sombra
  de contacto, con el sitio real del cliente en la pantalla. Lo ÚNICO generado
  por el modelo es la escena, y con la pantalla APAGADA. Todo lo demás se
  compone aquí, que es donde la posición es exacta y medible.

  El orden importa, y es de abajo arriba:
    1 escena generada (pantalla negra, lisa, vacía)   ← lo único que cuesta tokens
    2 la captura real, llevada al cuadrilátero por homografía
    3 la LUZ de la pantalla sobre el teclado y la superficie de alrededor
    4 el reflejo del entorno sobre el vidrio, al 6–12 %
    5 (opcional, rara vez) tarjetas de UI flotando
    6 la marca: archivo real, estampado sobre un plano medido de la escena
    7 una sola gradación que unifica todas las capas
  Sin la 3 y la 4 la pantalla parece pegada con cola. Es la prueba: tapa la
  pantalla y pregunta si la escena se sostiene; destápala y pregunta si la
  pantalla PERTENECE.

ENTRA
  --escena    el render con la pantalla apagada (3072×2304 va bien)
  --captura   la captura real del sitio, al aspecto REAL de la pantalla (16:10
              para un portátil). Se mapea entera: NADA de recortarla al aspecto
              del hueco, que por escorzo es más estrecho y le come los costados
  --semilla   x,y de un píxel dentro de la pantalla negra
  opcionales: --recorte, --final, --marca*, --teclado, --brillo, --reflejo, --luz

SALE
  El JPG final, y por pantalla las medidas de cada capa: esquinas y residuos,
  aspecto aparente, % de reflejo, color de la luz, escalas del plano de la marca.

USO (el caso real de Rematch, reproducible tal cual)
  python3 componer-mockup.py \
    --escena escena.png --captura cap1280/h.png --semilla 1695,1020 \
    --teclado 985,1382,2272,1346,2294,1534,998,1566 \
    --marca ~/Documents/SAAS/REMATCH/public/logos/LOGO_PRINCIPAL_2.webp \
    --marca-caja 1860,1760,2340,1990 --marca-semilla 2090,1870 \
    --recorte 200,68,2940,2123 --final 3072x2304 --salida rematch.jpg

OJO
  · En esta máquina NO hay OpenCV ni scipy: solo PIL y numpy.
  · El modelo DIBUJA GLIFOS INVENTADOS EN LAS TECLAS aunque el prompt prohíba el
    texto tres veces. Para eso está `--teclado`: desenfoca ese polígono, que
    además es lo físicamente cierto (las teclas están más cerca de la cámara que
    la pantalla). No se queda ni una letra falsa legible.
  · A tamaño de tarjeta el texto de la app NO se va a leer nunca. Lo que manda
    es que se reconozcan los elementos GRANDES: el titular, el color de marca,
    la forma de la cabecera. Ver COMPOSITOR.md.
"""
import argparse
import importlib.util
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

_aqui = os.path.dirname(os.path.abspath(__file__))


def _cargar(nombre, modulo):
    s = importlib.util.spec_from_file_location(modulo, os.path.join(_aqui, nombre))
    m = importlib.util.module_from_spec(s)
    s.loader.exec_module(m)
    return m


pantalla = _cargar("pantalla-esquinas.py", "pantalla_esquinas")
plano = _cargar("plano-perspectiva.py", "plano_perspectiva")


def f(im):
    return np.asarray(im).astype(np.float32)


def img(a):
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def poligono(size, quad, fill=255):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).polygon([tuple(p) for p in quad], fill=fill)
    return m


def capa_pantalla(escena, mascara, quad, captura, brillo, reflejo):
    """Capas 2 y 4: la captura por homografía, y el reflejo del entorno."""
    W, H = escena.size
    cap = Image.open(captura).convert("RGB")
    cw, ch = cap.size
    print("captura %dx%d (aspecto %.3f) · se mapea ENTERA, sin recortar al hueco"
          % (cw, ch, cw / ch))
    coef = plano.coeficientes(quad, [(0, 0), (cw, 0), (cw, ch), (0, ch)])
    cruda = cap.transform((W, H), Image.PERSPECTIVE, coef, Image.BICUBIC)

    p = f(cruda) * brillo + 7.0        # un LCD real no da ni blanco puro ni negro puro
    p[:, :, 0] *= 0.988                # y va un pelo más frío que la luz cálida de la escena
    p[:, :, 2] *= 1.022

    # Capa 4 · reflejo: la banda alta del PROPIO render, espejada y muy difusa.
    banda = escena.crop((0, 0, W, int(H * 0.45))).resize((64, 48), Image.LANCZOS)
    banda = banda.transpose(Image.FLIP_LEFT_RIGHT).resize((W, H), Image.BICUBIC) \
                 .filter(ImageFilter.GaussianBlur(90))
    peso = np.linspace(1.0, 0.18, H, dtype=np.float32)[:, None, None] ** 1.6
    r = f(banda) * peso * reflejo
    p = 255 - (255 - p) * (255 - r) / 255          # screen
    print("reflejo sobre el vidrio: %.1f %% de media (6–12 %% de pico arriba)"
          % (r[mascara].mean() / 2.55))
    return cruda, p


def capa_luz(out, cruda, mascara, quad, m, fuerza):
    """Capa 3: la luz que la pantalla echa sobre el teclado y la superficie.

    Sin esto la pantalla parece pegada. El color sale de la propia captura; el
    gradiente vertical modela que la tapa tapa la luz hacia atrás y la deja
    salir hacia delante y hacia abajo.
    """
    H, W = m.shape
    tl, tr, br, bl = quad
    color = f(cruda)[mascara].mean(axis=0)
    color = color / color.max()
    print("luz de la pantalla: color medio", [round(float(v), 3) for v in color])
    halo = np.asarray(poligono((W, H), quad).resize((W // 4, H // 4), Image.BILINEAR)
                      .filter(ImageFilter.GaussianBlur(44))
                      .resize((W, H), Image.BICUBIC)).astype(np.float32) / 255
    yy = np.arange(H, dtype=np.float32)[:, None]
    ybajo, yalto = max(bl[1], br[1]), min(tl[1], tr[1])
    hacia = np.repeat(np.clip((yy - yalto) / (ybajo - yalto), 0, 1) ** 1.6 * 0.88 + 0.12, W, axis=1)
    luz = halo * hacia * (1 - m)
    return out + (luz[..., None] * color[None, None, :] * fuerza) * (1 - out / 300)


def suavizar_teclado(a, poli, radio=2.8):
    """Los glifos inventados de las teclas, a manchas sin lectura posible."""
    im = img(a)
    k = np.asarray(poligono(im.size, poli).filter(ImageFilter.GaussianBlur(16))
                   ).astype(np.float32)[..., None] / 255
    return f(im) * (1 - k) + f(im.filter(ImageFilter.GaussianBlur(radio))) * k


def capa_marca(out, escena, archivo, caja, semilla, esquina, ancho, opacidad, desenf):
    """Capa 6: el archivo REAL de la marca, estampado sobre un plano medido.

    El alto se calcula con las escalas locales de la homografía para que el
    logotipo NO se deforme, y se mezcla en `multiply` (R25 tinta-impresa), que
    es lo que deja pasar la luz y la materia del soporte.
    """
    W, H = escena.size
    _, mt, qt = plano.medir_desde(escena, caja, semilla)
    dest = [qt[(esquina - k) % 4] for k in range(4)]     # TL, TR, BR, BL del impreso
    Hm = plano.homografia(dest)
    su, sv = plano.escalas(Hm)
    logo = Image.open(archivo).convert("RGBA")
    asp = logo.width / logo.height
    u0, u1 = (1 - ancho) / 2, (1 + ancho) / 2
    hv = ((u1 - u0) * su / asp) / sv                      # alto en v que NO deforma
    print("plano de la marca:", [(round(x), round(y)) for x, y in qt])
    print("  escalas %.0f px/u y %.0f px/v -> logotipo de %.0f × %.0f px"
          % (su, sv, (u1 - u0) * su, (u1 - u0) * su / asp))
    N = 1600
    lienzo = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    lienzo.paste(logo.resize((int((u1 - u0) * N), max(1, int(hv * N))), Image.LANCZOS),
                 (int(u0 * N), int((0.5 - hv / 2) * N)))
    marca = lienzo.transform((W, H), Image.PERSPECTIVE,
                             plano.coeficientes(dest, [(0, 0), (N, 0), (N, N), (0, N)]),
                             Image.BICUBIC).filter(ImageFilter.GaussianBlur(desenf))
    ml = f(marca)
    al = (ml[:, :, 3:4] / 255) * opacidad
    return out * (1 - al) + out * (ml[:, :, :3] / 255) * al


def gradacion(im, recorte, final, nitidez=62):
    """Capa 7: recorte, tamaño de entrega y UNA sola curva para todas las capas."""
    if recorte:
        im = im.crop(recorte)
    if final:
        im = im.resize(final, Image.LANCZOS)
    a = np.clip(f(im) / 255, 0, 1)
    a = a + 0.11 * np.sin(np.pi * a) * (a - 0.5) * 2      # S suave
    a[:, :, 0] += 0.012 * a[:, :, 0]                      # calor en las luces
    a[:, :, 2] += 0.016 * (1 - a[:, :, 2])                # frío en las sombras
    return img(np.clip(a, 0, 1) * 255).filter(
        ImageFilter.UnsharpMask(radius=1.6, percent=nitidez, threshold=3))


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--escena", required=True)
    ap.add_argument("--captura", required=True)
    ap.add_argument("--semilla", required=True, help="x,y dentro de la pantalla negra")
    ap.add_argument("--umbral", type=int, default=15)
    ap.add_argument("--salida", default="portada.jpg")
    ap.add_argument("--brillo", type=float, default=0.955)
    ap.add_argument("--reflejo", type=float, default=0.11)
    ap.add_argument("--luz", type=float, default=175.0)
    ap.add_argument("--teclado", default=None, help="x0,y0,x1,y1,... polígono de las teclas")
    ap.add_argument("--teclado-radio", type=float, default=2.8)
    ap.add_argument("--marca", default=None, help="archivo real del logotipo")
    ap.add_argument("--marca-caja", default=None, help="x0,y0,x1,y1 donde buscar el plano")
    ap.add_argument("--marca-semilla", default=None, help="x,y dentro del plano")
    ap.add_argument("--marca-esquina", type=int, default=0,
                    help="cuál de los 4 vértices es el arriba-izquierda del impreso")
    ap.add_argument("--marca-ancho", type=float, default=0.66, help="fracción del plano")
    ap.add_argument("--marca-opacidad", type=float, default=0.95)
    ap.add_argument("--marca-desenfoque", type=float, default=1.5)
    ap.add_argument("--recorte", default=None, help="x0,y0,x1,y1")
    ap.add_argument("--final", default=None, help="ANCHOxALTO")
    a = ap.parse_args()

    # ---- capa 1 · la escena, y la pantalla MEDIDA ----
    escena, mascara, quad = pantalla.medir(
        a.escena, tuple(int(v) for v in a.semilla.split(",")), a.umbral)
    W, H = escena.size
    d = pantalla.d
    tl, tr, br, bl = quad
    print("pantalla:", [(round(x), round(y)) for x, y in quad])
    print("  lados arriba %.0f abajo %.0f izq %.0f der %.0f · aspecto aparente %.3f"
          % (d(tl, tr), d(bl, br), d(tl, bl), d(tr, br),
             ((d(tl, tr) + d(bl, br)) / 2) / ((d(tl, bl) + d(tr, br)) / 2)))
    pantalla.tira_de_control(escena, quad)

    # ---- capas 2 y 4 ----
    cruda, p = capa_pantalla(escena, mascara, quad, a.captura, a.brillo, a.reflejo)
    m = np.asarray(Image.fromarray((mascara * 255).astype(np.uint8))
                   .filter(ImageFilter.MinFilter(3))
                   .filter(ImageFilter.GaussianBlur(0.8))).astype(np.float32) / 255
    out = f(escena) * (1 - m[..., None]) + p * m[..., None]

    # ---- capa 3 ----
    out = capa_luz(out, cruda, mascara, quad, m, a.luz)

    if a.teclado:
        v = [int(x) for x in a.teclado.split(",")]
        out = suavizar_teclado(out, list(zip(v[::2], v[1::2])), a.teclado_radio)

    # ---- capa 6 ----
    if a.marca:
        out = capa_marca(out, escena, os.path.expanduser(a.marca),
                         tuple(int(v) for v in a.marca_caja.split(",")),
                         tuple(int(v) for v in a.marca_semilla.split(",")),
                         a.marca_esquina, a.marca_ancho, a.marca_opacidad,
                         a.marca_desenfoque)

    # ---- capa 7 ----
    rec = tuple(int(v) for v in a.recorte.split(",")) if a.recorte else None
    fin = tuple(int(v) for v in a.final.split("x")) if a.final else None
    salida = gradacion(img(out), rec, fin)
    salida.save(a.salida, quality=92, optimize=True, progressive=True)
    print("-> %s  %dx%d" % (a.salida, *salida.size))
    print("Ahora MIRARLA: simulada a 421×316 y 358×269, y bajo el recorte del carrusel.")


if __name__ == "__main__":
    main()
