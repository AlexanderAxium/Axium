#!/usr/bin/env python3
"""El cuadrilátero de un objeto PLANO visto en perspectiva, y su homografía.

QUÉ HACE
  Mide las cuatro esquinas de una superficie plana de una foto —una tarjeta
  sobre un banco, una hoja en una mesa, la tapa de un dossier, un cartel— para
  poder estamparle encima un archivo real (el logotipo del cliente, una página
  diseñada) sin deformarlo. Y da la homografía del cuadrado unidad a ese
  cuadrilátero, con sus escalas locales, que es lo que permite pedir el tamaño
  en proporción del objeto y no «a ver si con 170 px queda bien».

LA REGLA QUE JUSTIFICA ESTE ARCHIVO
  Un plano en perspectiva se proyecta como un TRAPECIO, no como un rectángulo.
  Por eso NO vale el rectángulo de área mínima (rotating calipers): devuelve la
  caja que envuelve al trapecio, que sobresale por dos lados — se probó con la
  tarjeta de Rematch y se comía 40 px de madera por arriba y por abajo.
  Tampoco vale ajustar cuatro rectas por filas como en `pantalla-esquinas.py`:
  si el objeto está girado en diamante, «el primer píxel oscuro de cada fila»
  recorre DOS aristas distintas y el ajuste no significa nada.
  Lo que sí vale: casco convexo y REDUCIRLO A 4 VÉRTICES quitando siempre el
  vértice que menos área aporta. Converge en las cuatro esquinas verdaderas,
  y los puntos casi colineales de cada arista caen solos.

ENTRA
  Una máscara booleana del objeto (numpy), o desde la línea de órdenes una
  imagen + caja + semilla + umbral de brillo.

SALE
  · `cuadrilatero(m)` → 4 vértices del trapecio
  · `ordenar(q)` → los mismos empezando por el vértice más a la izquierda y en
    el sentido de las agujas del reloj
  · `homografia(quad)` → matriz 3×3 del cuadrado unidad a ese cuadrilátero
  · `escalas(H)` → píxeles por unidad en u y en v, en el centro del plano. Con
    esas dos cifras se calcula el alto que NO deforma un archivo de aspecto
    conocido:  alto_v = (ancho_u · su / aspecto) / sv
  · desde la línea de órdenes, `control-plano.png` con el cuadrilátero dibujado
    en magenta sobre el objeto. MIRARLA antes de estampar nada

USO
  python3 plano-perspectiva.py escena.png 1860,1760,2340,1990 2090,1870 150
                                 imagen   caja x0,y0,x1,y1    semilla  umbral

  (la caja acota dónde buscar; la semilla es un píxel dentro del objeto; el
   umbral es de luminancia, y > umbral para un objeto claro)

OJO
  En esta máquina NO hay OpenCV ni scipy: solo PIL y numpy. El casco convexo es
  una cadena monótona propia y la componente conexa viene de
  `pantalla-esquinas.py`, no de `cv2` ni de `scipy.ndimage`.
"""
import importlib.util
import os
import sys

import numpy as np
from PIL import Image, ImageDraw

_h = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pantalla-esquinas.py")
_s = importlib.util.spec_from_file_location("pantalla_esquinas", _h)
pantalla = importlib.util.module_from_spec(_s)
_s.loader.exec_module(pantalla)          # el guion del nombre impide un import normal


def contorno(m, paso=1):
    """Puntos del borde de la mancha: primero y último de cada fila y columna."""
    pts = []
    for y in range(0, m.shape[0], paso):
        f = np.where(m[y])[0]
        if len(f):
            pts.append((f[0], y)); pts.append((f[-1], y))
    for x in range(0, m.shape[1], paso):
        c = np.where(m[:, x])[0]
        if len(c):
            pts.append((x, c[0])); pts.append((x, c[-1]))
    return sorted(set(pts))


def envolvente(pts):
    """Casco convexo por cadena monótona de Andrew."""
    def cruz(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    baja, alta = [], []
    for p in pts:
        while len(baja) >= 2 and cruz(baja[-2], baja[-1], p) <= 0:
            baja.pop()
        baja.append(p)
    for p in reversed(pts):
        while len(alta) >= 2 and cruz(alta[-2], alta[-1], p) <= 0:
            alta.pop()
        alta.append(p)
    return baja[:-1] + alta[:-1]


def reducir(poly, n=4):
    """Reduce un polígono convexo a n vértices quitando siempre el que menos
    área aporta. Esto, y no el rectángulo de área mínima, es lo que da las
    esquinas de un plano en perspectiva."""
    p = [tuple(map(float, q)) for q in poly]
    while len(p) > n:
        def area(i):
            a, b, c = p[i - 1], p[i], p[(i + 1) % len(p)]
            return abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) / 2
        p.pop(min(range(len(p)), key=area))
    return p


def cuadrilatero(m):
    return reducir(envolvente(contorno(m)), 4)


def ordenar(q):
    """Desde el vértice más a la izquierda, en el sentido de las agujas."""
    c = np.mean(q, axis=0)
    orden = sorted(range(4), key=lambda i: np.arctan2(q[i][1] - c[1], q[i][0] - c[0]))
    q = [q[i] for i in orden]
    i0 = min(range(4), key=lambda i: q[i][0])
    return [q[(i0 - k) % 4] for k in range(4)]


def encoger(q, k):
    """Mete el cuadrilátero k hacia su centro: para dejar margen, o para quitar
    el canto grueso de un objeto con espesor (una tarjeta, un libro)."""
    c = np.mean(q, axis=0)
    return [tuple(c + (np.array(p) - c) * (1 - k)) for p in q]


def homografia(quad):
    """Matriz 3×3 del cuadrado unidad al cuadrilátero, dado en TL, TR, BR, BL."""
    R = [(0, 0), (1, 0), (1, 1), (0, 1)]
    A, b = [], []
    for (u, v), (x, y) in zip(R, quad):
        A.append([u, v, 1, 0, 0, 0, -u * x, -v * x]); b.append(x)
        A.append([0, 0, 0, u, v, 1, -u * y, -v * y]); b.append(y)
    h = np.linalg.solve(np.array(A), np.array(b))
    return np.array([[h[0], h[1], h[2]], [h[3], h[4], h[5]], [h[6], h[7], 1.0]])


def proyecta(H, u, v):
    p = H @ np.array([u, v, 1.0])
    return p[0] / p[2], p[1] / p[2]


def escalas(H):
    """Píxeles por unidad en u y en v, medidos en el centro del plano."""
    d = pantalla.d
    su = d(proyecta(H, .4, .5), proyecta(H, .6, .5)) / .2
    sv = d(proyecta(H, .5, .4), proyecta(H, .5, .6)) / .2
    return su, sv


def coeficientes(destino, origen):
    """Los 8 de `Image.transform(..., Image.PERSPECTIVE, ...)`, que mapean cada
    punto de `destino` a su `origen` (PIL va al revés de lo que uno piensa)."""
    A, b = [], []
    for (x, y), (u, v) in zip(destino, origen):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); b.append(v)
    return list(np.linalg.solve(np.array(A), np.array(b)))


def medir_desde(im, caja, semilla, umbral=150, claro=True):
    """El cuadrilátero de un objeto plano dentro de `caja`, ordenado.

    `claro=True` para un objeto más claro que su fondo (una tarjeta blanca sobre
    madera); `False` para uno más oscuro.
    """
    L = pantalla.luminancia(im)
    dentro = np.zeros_like(L, bool)
    x0, y0, x1, y1 = caja
    dentro[y0:y1, x0:x1] = True
    bruta = (L > umbral) if claro else (L < umbral)
    m = pantalla.componente(bruta & dentro, semilla, k=4)
    return im, m, ordenar(cuadrilatero(m))


def medir(ruta, caja, semilla, umbral=150, claro=True):
    return medir_desde(Image.open(ruta).convert("RGB"), caja, semilla, umbral, claro)


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(1)
    ruta = sys.argv[1]
    caja = tuple(int(v) for v in sys.argv[2].split(","))
    semilla = tuple(int(v) for v in sys.argv[3].split(","))
    umbral = int(sys.argv[4]) if len(sys.argv) > 4 else 150
    im, m, q = medir(ruta, caja, semilla, umbral)
    d = pantalla.d
    print("objeto: %d px" % m.sum())
    print("cuadrilátero:", [(round(x, 1), round(y, 1)) for x, y in q])
    print("lados: %.0f  %.0f  %.0f  %.0f" % (d(q[0], q[1]), d(q[1], q[2]), d(q[2], q[3]), d(q[3], q[0])))
    su, sv = escalas(homografia([q[0], q[3], q[2], q[1]]))
    print("escalas locales: %.0f px/unidad en u, %.0f en v" % (su, sv))
    c = im.crop(caja).copy()
    dr = ImageDraw.Draw(c)
    dr.polygon([(x - caja[0], y - caja[1]) for x, y in q], outline=(255, 0, 255), width=2)
    for i, (x, y) in enumerate(q):
        dr.text((x - caja[0] + 6, y - caja[1] + 6), str(i), fill=(255, 0, 255))
    c.save("control-plano.png")
    print("-> control-plano.png")
