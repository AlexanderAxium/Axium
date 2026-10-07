#!/usr/bin/env python3
"""Compone una captura real dentro de un dispositivo de una escena generada, con el
cuadrilátero dado A MANO (o la tapa + el bisel), cuando la detección automática de
`pantalla-esquinas.py` no sirve.

CUÁNDO
  · La pantalla apagada no es uniforme (el sol la aclara por un lado) o la tapa entera
    es negra y toca un objeto oscuro del fondo: la componente conexa se escapa y el
    ajuste de bordes da residuos de 50–100 px (Rematch, recepción, 2026-10-06).
  · Entonces se miden las cuatro esquinas sobre recortes 1:1 con cuadrícula (ver
    COMPOSITOR.md, decimotercera generación) y se pasan aquí.

ENTRA
  --escena    el render (pantalla apagada)
  --captura   la captura real, al aspecto REAL de la pantalla (se mapea entera)
  --quad      TLx,TLy,TRx,TRy,BRx,BRy,BLx,BLy de la PANTALLA, o de la TAPA si va --bisel
  --bisel     izq,arr,der,aba en fracción de la tapa (portátil: 0.025,0.03,0.025,0.05)
  --radio     radio de las esquinas de la pantalla, en px de la captura (0 = recto)
  --brillo    multiplica la captura (un LCD real no da blanco puro: 0.95–0.98)
  --reflejo   fuerza del reflejo diagonal sobre el vidrio (0.03–0.08)
  --desenfoque  px de desenfoque de la captura ya deformada, para casar con la nitidez
              de la escena (0.4–0.9)
  --salida

SALE
  El JPG y la máscara usada (`<salida>-mascara.png`) para revisar el borde a 1:1.
"""
import argparse
import importlib.util
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

_aqui = os.path.dirname(os.path.abspath(__file__))
_s = importlib.util.spec_from_file_location("plano", os.path.join(_aqui, "plano-perspectiva.py"))
plano = importlib.util.module_from_spec(_s)
_s.loader.exec_module(plano)


def homografia(src, dst):
    """3×3 que lleva src (4 puntos) a dst (4 puntos)."""
    A, b = [], []
    for (x, y), (u, v) in zip(src, dst):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y])
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y])
        b += [u, v]
    h = np.linalg.solve(np.array(A, float), np.array(b, float))
    return np.append(h, 1).reshape(3, 3)


def aplicar(H, x, y):
    p = H @ np.array([x, y, 1.0])
    return p[0] / p[2], p[1] / p[2]



def medir_clave(ruta):
    """Forma y esquinas del cristal en una escena con la pantalla en magenta #FF00FF.

    · Máscara: los píxeles magenta (rojo y azul altos, verde bajo), con el recorte de la
      cámara como agujero. Se erosiona 1 px (el canto mezcla magenta con el negro del
      bisel) y se suaviza 0,6 px.
    · Esquinas: cuatro rectas por mínimos cuadrados sobre el tramo RECTO de cada borde
      (fuera del 18 % de cada punta, donde está el radio), con una segunda pasada sin los
      puntos a más de 2 px; las esquinas son sus intersecciones.
    """
    # numpy con Accelerate (macOS) da avisos espurios de división por cero en matmul
    np.seterr(divide="ignore", over="ignore", invalid="ignore")
    k = np.asarray(Image.open(ruta).convert("RGB")).astype(np.int32)
    r, g, b = k[..., 0], k[..., 1], k[..., 2]
    m = (r > 150) & (b > 150) & (g < 0.6 * np.minimum(r, b)) & ((r + b) // 2 - g > 90)
    ys, xs = np.nonzero(m)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    h, w = y1 - y0, x1 - x0

    def recta(us, vs):  # v = a·u + b, robusta
        A = np.vstack([us, np.ones_like(us)]).T
        sol = np.linalg.lstsq(A, vs, rcond=None)[0]
        res = np.abs(A @ sol - vs)
        ok = res < 2.0
        if ok.sum() > 10:
            sol = np.linalg.lstsq(A[ok], vs[ok], rcond=None)[0]
        return sol, float(np.abs(A @ sol - vs)[ok].max()) if ok.any() else 99.0

    filas = np.arange(int(y0 + 0.18 * h), int(y1 - 0.18 * h))
    izq = np.array([np.nonzero(m[y])[0].min() for y in filas], float)
    der = np.array([np.nonzero(m[y])[0].max() for y in filas], float)
    cols = np.arange(int(x0 + 0.18 * w), int(x1 - 0.18 * w))
    arr = np.array([np.nonzero(m[:, x])[0].min() for x in cols], float)
    aba = np.array([np.nonzero(m[:, x])[0].max() for x in cols], float)
    (ai, bi), ri = recta(filas.astype(float), izq)   # x = ai·y + bi
    (ad, bd), rd = recta(filas.astype(float), der)
    (aa, ba), ra = recta(cols.astype(float), arr)    # y = aa·x + ba
    (ab, bb), rb = recta(cols.astype(float), aba)

    def cruce(ax, bx, ay, by):  # x = ax·y + bx  ∩  y = ay·x + by
        y = (ay * bx + by) / (1 - ay * ax)
        return (ax * y + bx, y)

    quad = [cruce(ai, bi, aa, ba), cruce(ad, bd, aa, ba), cruce(ad, bd, ab, bb), cruce(ai, bi, ab, bb)]
    print("clave: residuo por borde (izq/der/arr/aba) %.1f %.1f %.1f %.1f px" % (ri, rd, ra, rb))
    print("clave: esquinas", [(round(x, 1), round(y, 1)) for x, y in quad])
    masc = Image.fromarray((m * 255).astype(np.uint8))
    masc = masc.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6))
    return masc, quad

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--escena", required=True)
    ap.add_argument("--captura", required=True)
    ap.add_argument("--quad", default=None)
    # Modo CLAVE (2026-10-06): la escena se pidió (o se editó) con la pantalla en magenta
    # #FF00FF plano. De ahí salen la forma EXACTA del cristal —esquinas redondeadas y
    # recorte de la cámara incluidos— y las cuatro esquinas, sin adivinar nada.
    ap.add_argument("--clave", default=None,
                    help="la escena con la pantalla en magenta: forma y esquinas del cristal")
    ap.add_argument("--bisel", default=None)
    ap.add_argument("--radio", type=float, default=0)
    ap.add_argument("--brillo", type=float, default=0.97)
    ap.add_argument("--reflejo", type=float, default=0.05)
    ap.add_argument("--desenfoque", type=float, default=0.6)
    # La luz de la escena sobre el vidrio (Alexander, 2026-10-06, sobre el celular de
    # Amigo: «mira la elegancia de estos mockups, las sombras, el hiperrealismo»)
    ap.add_argument("--luz-angulo", type=float, default=0,
                    help="de dónde viene la luz, en el plano de la pantalla: 0 derecha, 180 izquierda, -90 arriba")
    ap.add_argument("--caida", type=float, default=0.0, help="cuánto se apaga el lado en sombra (0.12–0.22)")
    ap.add_argument("--veta", default=None, help="c,ancho,angulo,fuerza de la veta de sol (p. ej. 0.62,0.07,35,0.22)")
    ap.add_argument("--tinte", default="1,1,1", help="multiplica R,G,B (luz cálida: 1,0.985,0.955)")
    ap.add_argument("--techo", type=float, default=255, help="el blanco máximo de la pantalla (232–242)")
    ap.add_argument("--filo", type=float, default=0.0, help="brillo del canto del vidrio del lado iluminado (0.3–0.6)")
    ap.add_argument("--salida", required=True)
    a = ap.parse_args()

    esc = Image.open(a.escena).convert("RGB")
    W, H_ = esc.size
    mascara_clave = None
    if a.clave:
        mascara_clave, quad = medir_clave(a.clave)
    else:
        q = [float(v) for v in a.quad.split(",")]
        quad = [(q[0], q[1]), (q[2], q[3]), (q[4], q[5]), (q[6], q[7])]
    if a.bisel:
        l, t, r, b = [float(v) for v in a.bisel.split(",")]
        Hu = homografia([(0, 0), (1, 0), (1, 1), (0, 1)], quad)
        quad = [aplicar(Hu, *uv) for uv in [(l, t), (1 - r, t), (1 - r, 1 - b), (l, 1 - b)]]
    print("pantalla:", [(round(x, 1), round(y, 1)) for x, y in quad])

    cap = Image.open(a.captura).convert("RGB")
    cw, ch = cap.size
    # Máscara en el espacio de la captura (con radio), deformada igual que la captura
    m = Image.new("L", (cw, ch), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, cw - 1, ch - 1), radius=a.radio, fill=255)
    coef = plano.coeficientes(quad, [(0, 0), (cw, 0), (cw, ch), (0, ch)])
    deformada = cap.transform((W, H_), Image.PERSPECTIVE, coef, Image.BICUBIC)
    mascara = m.transform((W, H_), Image.PERSPECTIVE, coef, Image.BICUBIC)
    if mascara_clave is not None:
        # La forma del cristal manda: la interfaz no puede salirse del vidrio
        mascara = mascara_clave
    if a.desenfoque:
        deformada = deformada.filter(ImageFilter.GaussianBlur(a.desenfoque))

    p = np.asarray(deformada).astype(np.float32) * a.brillo + 6.0

    # Coordenadas de la PANTALLA (u, v en 0..1) para cada píxel de la escena: la luz
    # se modela sobre el vidrio, no sobre el encuadre, y así sigue su perspectiva.
    yy, xx = np.mgrid[0:H_, 0:W].astype(np.float32)
    ca, cb, cc, cd, ce, cf, cg, ch_ = coef
    den = cg * xx + ch_ * yy + 1.0
    U = ((ca * xx + cb * yy + cc) / den) / cw
    V = ((cd * xx + ce * yy + cf) / den) / ch
    alfa2 = np.asarray(mascara).astype(np.float32) / 255.0

    # 1 · Reflejo: barrido suave desde la esquina alta, en el plano del vidrio
    barrido = np.clip(1.0 - (U * 0.6 + V * 0.9), 0, 1) ** 1.8 * 255 * a.reflejo
    p = 255 - (255 - p) * (255 - barrido[..., None]) / 255

    # 2 · Caída de luz: la pantalla se apaga hacia el lado contrario al sol
    #    (el celular de Amigo sobre la mesa: más oscuro a la izquierda, a contraluz).
    th = np.deg2rad(a.luz_angulo)
    hacia = np.clip(0.5 + np.cos(th) * (U - 0.5) + np.sin(th) * (V - 0.5), 0, 1)
    p *= ((1 - a.caida) + a.caida * hacia ** 0.8)[..., None]

    # 3 · Veta de sol que cruza el vidrio (c = posición, ancho y ángulo en el plano)
    if a.veta:
        c0, ancho, ang, fuerza = [float(x) for x in a.veta.split(",")]
        ph = np.deg2rad(ang)
        d = (U * np.cos(ph) + V * np.sin(ph) - c0) / ancho
        s = np.exp(-(d**2)) * fuerza
        sol = np.array([255, 222, 182], np.float32)
        p = 255 - (255 - p) * (1 - s[..., None] * sol / 255)

    # 4 · Ni blanco puro ni color frío: el techo y el tinte de la luz de la escena
    tinte = np.array([float(x) for x in a.tinte.split(",")], np.float32)
    p = (p * a.techo / 255.0) * tinte

    # 5 · Filo de luz en el canto del vidrio, del lado iluminado
    if a.filo:
        borde = alfa2 - np.asarray(
            mascara.filter(ImageFilter.MinFilter(5)), np.float32) / 255.0
        borde = np.clip(borde, 0, 1) * hacia * a.filo
        p = p + (255 - p) * borde[..., None]

    alfa = alfa2[..., None]
    out = np.asarray(esc).astype(np.float32) * (1 - alfa) + np.clip(p, 0, 255) * alfa
    res = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
    res.save(a.salida, quality=93)
    mascara.save(os.path.splitext(a.salida)[0] + "-mascara.png")
    print("->", a.salida, res.size)


if __name__ == "__main__":
    main()
