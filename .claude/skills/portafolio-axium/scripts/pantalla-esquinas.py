#!/usr/bin/env python3
"""Las CUATRO esquinas de una pantalla APAGADA en una escena generada.

QUÉ HACE
  Mide el cuadrilátero de la pantalla negra de un render para poder componerle
  encima la captura real por homografía. Las esquinas NO se miran a ojo: se
  umbraliza el negro, se aísla la componente conexa de la pantalla, se ajustan
  los cuatro bordes por mínimos cuadrados sobre su tramo recto, y las esquinas
  son las INTERSECCIONES de esas cuatro rectas — así las curvas del bisel no
  encogen el cuadrilátero (que es lo que le pasaba a `esquinas()` de
  `componer_pantalla.py`, que tomaba los extremos de x±y).

  Es la versión «pantalla apagada» de `componer_pantalla.py`, que trabaja con
  pantalla verde. Se usa el negro cuando la escena tiene verdes o limas propios
  —una pista de pádel, una pelota, un filo de pala— porque ahí la máscara verde
  se engaña (ver COMPOSITOR.md § «Un objeto verde en la escena engaña a la
  máscara»). El prompt pide la pantalla «completely switched off: pure matte
  black, perfectly uniform», y el bisel iluminado la rodea de brillo, así que el
  umbral separa limpio: medido en Rematch, pantalla 3–5 de luminancia y bisel
  26–30.

ENTRA
  escena.png   el render, con la pantalla negra y lisa
  x,y          una semilla: cualquier píxel DENTRO de la pantalla negra
  [umbral]     luminancia por debajo de la cual se considera negro (15 por
               defecto: entre el 5 de la pantalla y el 26 del bisel)

SALE  (por pantalla, y como valores de retorno si se importa)
  · las 4 esquinas en orden  arriba-izq, arriba-der, abajo-der, abajo-izq
  · la máscara exacta de la pantalla, con sus esquinas redondeadas, lista para
    `Image.composite` — respeta radios y muescas
  · el RESIDUO máximo del ajuste de cada borde: es el control de calidad. Por
    debajo de ~8 px el borde es recto y la medida vale; por encima, el umbral o
    la semilla están cogiendo algo que no es la pantalla (en Rematch quedó en
    2,2 / 7,3 / 1,8 / 1,0)
  · `control-esquinas.png`: las cuatro esquinas recortadas a 1:1 con una cruz
    magenta encima. MIRARLA antes de componer

  Importado:  `medir(ruta, (x, y), umbral) -> (imagen, mascara, [4 esquinas])`

USO
  python3 pantalla-esquinas.py escena.png 1695,1020 15

OJO
  En esta máquina NO hay OpenCV ni scipy: solo PIL y numpy. Por eso la
  componente conexa va por reconstrucción morfológica sobre una copia
  submuestreada, y no por `cv2.connectedComponents` ni `scipy.ndimage.label`.
  `PIL.ImageDraw.floodfill` tampoco sirve: sobre una imagen creada con
  `Image.fromarray` no llega a pintar.
"""
import sys

import numpy as np
from PIL import Image, ImageDraw


def luminancia(im):
    a = np.asarray(im.convert("RGB")).astype(np.float32)
    return .299 * a[:, :, 0] + .587 * a[:, :, 1] + .114 * a[:, :, 2]


def _bloques(m, k):
    """Submuestreo por bloques con AND: sobrevive solo lo macizo. Mata los
    puentes finos de un píxel que unirían la pantalla con las teclas oscuras."""
    h, w = m.shape
    h2, w2 = h // k, w // k
    return m[:h2 * k, :w2 * k].reshape(h2, k, w2, k).all(axis=(1, 3))


def componente(m, semilla, k=8):
    """Región conexa de la máscara booleana `m` que contiene `semilla`.

    Reconstrucción morfológica sobre la copia submuestreada (sin scipy): se
    dilata la semilla dentro de la máscara hasta que deja de crecer. Al final se
    devuelve la selección a tamaño real y se dilata k+4 px para recuperar el
    borde fino que el AND del submuestreo se comió.
    """
    s = _bloques(m, k)
    sx, sy = semilla[0] // k, semilla[1] // k
    if not s[sy, sx]:
        raise SystemExit("la semilla no cae en zona maciza: revisa el punto o el umbral")
    c = np.zeros_like(s)
    c[sy, sx] = True
    while True:
        d = c.copy()
        d[1:] |= c[:-1]; d[:-1] |= c[1:]
        d[:, 1:] |= c[:, :-1]; d[:, :-1] |= c[:, 1:]
        d &= s
        if d.sum() == c.sum():
            break
        c = d
    grande = np.repeat(np.repeat(c, k, axis=0), k, axis=1)
    sel = np.zeros_like(m)
    sel[:grande.shape[0], :grande.shape[1]] = grande
    for _ in range(k + 4):
        d = sel.copy()
        d[1:] |= sel[:-1]; d[:-1] |= sel[1:]
        d[:, 1:] |= sel[:, :-1]; d[:, :-1] |= sel[:, 1:]
        sel = d
    return m & sel


def _recta(pares):
    """v = a + b·t por mínimos cuadrados."""
    t = np.array([p[0] for p in pares], float)
    v = np.array([p[1] for p in pares], float)
    b, a = np.polyfit(t, v, 1)
    return a, b


def _cruce(av, bv, ah, bh):
    """Cruce de  x = av + bv·y  con  y = ah + bh·x."""
    x = (av + bv * ah) / (1 - bv * bh)
    return (x, ah + bh * x)


def quad(m, margen=0.16):
    """Cuadrilátero de la mancha `m` por ajuste de sus cuatro bordes.

    `margen` descarta el tramo cercano a las esquinas, que es donde está el
    radio. Devuelve (4 esquinas, 4 residuos máximos).
    """
    ys, xs = np.where(m)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    bw, bh = x1 - x0, y1 - y0
    izq, der, arr, aba = [], [], [], []
    for y in range(int(y0 + bh * margen), int(y1 - bh * margen)):
        f = np.where(m[y])[0]
        if len(f):
            izq.append((y, f[0])); der.append((y, f[-1] + 1))
    for x in range(int(x0 + bw * margen), int(x1 - bw * margen)):
        c = np.where(m[:, x])[0]
        if len(c):
            arr.append((x, c[0])); aba.append((x, c[-1] + 1))
    (al, bl), (ar, br) = _recta(izq), _recta(der)   # x = a + b·y
    (at, bt), (ab, bb) = _recta(arr), _recta(aba)   # y = a + b·x
    esquinas = [_cruce(al, bl, at, bt), _cruce(ar, br, at, bt),
                _cruce(ar, br, ab, bb), _cruce(al, bl, ab, bb)]
    residuos = []
    for pares, (a, b) in ((izq, (al, bl)), (der, (ar, br)), (arr, (at, bt)), (aba, (ab, bb))):
        t = np.array([p[0] for p in pares], float)
        v = np.array([p[1] for p in pares], float)
        residuos.append(float(np.abs(v - (a + b * t)).max()))
    return esquinas, residuos


def medir(path, semilla, t=15, verboso=True):
    im = Image.open(path).convert("RGB")
    m = componente(luminancia(im) < t, semilla)
    q, res = quad(m)
    if verboso:
        print("  residuo máximo por borde (izq/der/arr/aba): "
              + " ".join("%.1f" % v for v in res)
              + ("   ⚠ algún borde no es recto: revisa umbral o semilla"
                 if max(res) > 8 else ""))
    return im, m, q


def d(a, b):
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** .5


def tira_de_control(im, q, destino="control-esquinas.png", lado=300):
    """Las cuatro esquinas a 1:1 con una cruz encima, para MIRARLAS."""
    ctl = Image.new("RGB", (4 * lado, lado), (240, 240, 240))
    dr = ImageDraw.Draw(ctl)
    r = lado // 4
    for i, (x, y) in enumerate(q):
        ctl.paste(im.crop((int(x) - r, int(y) - r, int(x) + r, int(y) + r))
                  .resize((lado, lado), Image.NEAREST), (i * lado, 0))
        dr.line([(i * lado + lado // 2, 0), (i * lado + lado // 2, lado)], fill=(255, 0, 255))
        dr.line([(i * lado, lado // 2), (i * lado + lado, lado // 2)], fill=(255, 0, 255))
    ctl.save(destino)
    return destino


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    ruta = sys.argv[1]
    semilla = tuple(int(v) for v in sys.argv[2].split(","))
    umbral = int(sys.argv[3]) if len(sys.argv) > 3 else 15
    im, m, q = medir(ruta, semilla, umbral)
    ys, xs = np.where(m)
    print("componente: %d px · bbox x %d..%d y %d..%d" % (m.sum(), xs.min(), xs.max(), ys.min(), ys.max()))
    print("esquinas (TL, TR, BR, BL):", [(round(float(x), 1), round(float(y), 1)) for x, y in q])
    print("lados: arriba %.1f  abajo %.1f  izq %.1f  der %.1f"
          % (d(q[0], q[1]), d(q[3], q[2]), d(q[0], q[3]), d(q[1], q[2])))
    anc = (d(q[0], q[1]) + d(q[3], q[2])) / 2
    alt = (d(q[0], q[3]) + d(q[1], q[2])) / 2
    print("aspecto aparente %.3f   ancho de pantalla = %.1f %% del cuadro"
          % (anc / alt, d(q[0], q[1]) / im.width * 100))
    print("->", tira_de_control(im, q))
