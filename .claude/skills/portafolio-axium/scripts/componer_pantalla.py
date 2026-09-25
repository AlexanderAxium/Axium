#!/usr/bin/env python3
"""Compone una captura REAL sobre la pantalla verde (#00FF00) de una escena generada.

La escena la genera Higgsfield con el dispositivo y la pantalla en verde liso;
acá se detecta el verde, se calculan las cuatro esquinas, se deforma la captura
en perspectiva y se usa el propio verde como máscara (respeta muescas y
esquinas redondeadas). Solo PIL, sin numpy.

Uso:
  python3 componer_pantalla.py escena.png captura.png salida.jpg
      [--ancla izquierda|centro|arriba] [--brillo 0.92] [--expandir 0.012]
      [--reflejo 0.05] [--marco "#EFEFEF"] [--margen 0.06]

--marco COLOR  en vez de deformar la captura a la pantalla, la centra dentro
               del hueco sobre ese color (paspartú de un cuadro).
"""
import argparse

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter


def mascara_verde(img):
    r, g, b = img.convert("RGB").split()
    verde = ImageChops.subtract(g, ImageChops.lighter(r, b))
    return verde.point(lambda v: 0 if v < 45 else 255 if v > 120 else int((v - 45) * 255 / 75))


def esquinas(mask, paso=2):
    w, h = mask.size
    small = mask.resize((w // paso, h // paso))
    px = small.load()
    sw, sh = small.size
    tl = tr = br = bl = None
    for y in range(sh):
        for x in range(sw):
            if px[x, y] < 160:
                continue
            s, d = x + y, x - y
            if tl is None or s < tl[0]:
                tl = (s, x, y)
            if br is None or s > br[0]:
                br = (s, x, y)
            if tr is None or d > tr[0]:
                tr = (d, x, y)
            if bl is None or d < bl[0]:
                bl = (d, x, y)
    return [(p[1] * paso, p[2] * paso) for p in (tl, tr, br, bl)]


def esquinas_por_bordes(mask, margen=0.12, umbral=160):
    """Esquinas como intersección de los cuatro bordes rectos ajustados.

    `esquinas()` toma los puntos extremos en diagonal: con esquinas redondeadas
    caen DENTRO de la curva, el cuadrilátero queda chico y la captura aparece con
    esquinas rectas y un marco negro de más (le pasó a bv-celular). Acá cada borde
    se ajusta por mínimos cuadrados en su tramo recto (lejos de las esquinas) y la
    muesca del celular se descarta como atípica.
    """
    x0, y0, x1, y1 = mask.point(lambda v: 255 if v >= umbral else 0).getbbox()
    px = mask.load()
    bw, bh = x1 - x0, y1 - y0

    def recta(pares):
        n = len(pares)
        st = sum(t for t, _ in pares)
        sv = sum(v for _, v in pares)
        stt = sum(t * t for t, _ in pares)
        stv = sum(t * v for t, v in pares)
        b = (n * stv - st * sv) / (n * stt - st * st)
        return (sv - b * st) / n, b

    izq, der, arr, aba = [], [], [], []
    for y in range(int(y0 + bh * margen), int(y1 - bh * margen), 3):
        fila = [x for x in range(x0, x1) if px[x, y] >= umbral]
        if fila:
            izq.append((y, fila[0]))
            der.append((y, fila[-1] + 1))
    for x in range(int(x0 + bw * margen), int(x1 - bw * margen), 3):
        col = [y for y in range(y0, y1) if px[x, y] >= umbral]
        if col:
            arr.append((x, col[0]))
            aba.append((x, col[-1] + 1))
    tope = min(v for _, v in arr)
    arr = [(t, v) for t, v in arr if v <= tope + 12]  # fuera la muesca
    fondo = max(v for _, v in aba)
    aba = [(t, v) for t, v in aba if v >= fondo - 12]

    (al, bl), (ar, br_) = recta(izq), recta(der)  # x = a + b·y
    (at, bt), (ab, bb) = recta(arr), recta(aba)  # y = a + b·x

    def cruce(av, bv, ah, bh_):
        x = (av + bv * ah) / (1 - bv * bh_)
        return (x, ah + bh_ * x)

    return [cruce(al, bl, at, bt), cruce(ar, br_, at, bt), cruce(ar, br_, ab, bb), cruce(al, bl, ab, bb)]


def expandir(quad, factor):
    cx = sum(p[0] for p in quad) / 4
    cy = sum(p[1] for p in quad) / 4
    return [(cx + (x - cx) * (1 + factor), cy + (y - cy) * (1 + factor)) for x, y in quad]


def resolver(destino, origen):
    """Coeficientes de PIL PERSPECTIVE que llevan cada punto destino a su origen."""
    filas = []
    for (x, y), (u, v) in zip(destino, origen):
        filas.append([x, y, 1, 0, 0, 0, -u * x, -u * y, u])
        filas.append([0, 0, 0, x, y, 1, -v * x, -v * y, v])
    n = 8
    for i in range(n):
        p = max(range(i, n), key=lambda r: abs(filas[r][i]))
        filas[i], filas[p] = filas[p], filas[i]
        piv = filas[i][i]
        filas[i] = [v / piv for v in filas[i]]
        for r in range(n):
            if r != i:
                f = filas[r][i]
                filas[r] = [a - f * b for a, b in zip(filas[r], filas[i])]
    return [filas[i][n] for i in range(n)]


def dist(a, b):
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5


def recortar_a(img, aspecto, ancla):
    w, h = img.size
    if w / h > aspecto:  # sobra ancho
        nw = round(h * aspecto)
        x0 = 0 if ancla == "izquierda" else (w - nw) // 2
        return img.crop((x0, 0, x0 + nw, h))
    nh = round(w / aspecto)  # sobra alto
    y0 = 0 if ancla in ("arriba", "izquierda") else (h - nh) // 2
    return img.crop((0, y0, w, y0 + nh))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("escena")
    ap.add_argument("captura")
    ap.add_argument("salida")
    ap.add_argument("--ancla", default="izquierda")
    ap.add_argument("--brillo", type=float, default=0.94)
    ap.add_argument("--expandir", type=float, default=0.012)
    ap.add_argument("--reflejo", type=float, default=0.05)
    ap.add_argument("--marco", default=None)
    ap.add_argument("--margen", type=float, default=0.06)
    ap.add_argument("--bordes", action="store_true", help="esquinas por ajuste de bordes (pantallas redondeadas: celulares)")
    ap.add_argument("--caja", default=None, help="x0,y0,x1,y1: el verde solo cuenta dentro de esta caja (escenas con objetos lima o verdes)")
    ap.add_argument("--sin-recorte", action="store_true", help="no recortar la captura al aspecto del hueco: para pantallas giradas, cuyo hueco se ve más angosto por el escorzo")
    a = ap.parse_args()

    escena = Image.open(a.escena).convert("RGB")
    mask = mascara_verde(escena)
    if a.caja:
        x0, y0, x1, y1 = (int(v) for v in a.caja.split(","))
        caja = Image.new("L", escena.size, 0)
        ImageDraw.Draw(caja).rectangle((x0, y0, x1, y1), fill=255)
        fuera = ImageChops.subtract(mask, caja).point(lambda v: 255 if v >= 160 else 0).getbbox()
        if fuera:
            print(f"aviso: verde fuerte fuera de la caja en {fuera} (se ignora)")
        mask = ImageChops.multiply(mask, caja)
    quad = expandir(esquinas_por_bordes(mask) if a.bordes else esquinas(mask), a.expandir)
    tl, tr, br, bl = quad
    ancho = (dist(tl, tr) + dist(bl, br)) / 2
    alto = (dist(tl, bl) + dist(tr, br)) / 2
    aspecto = ancho / alto

    cap = Image.open(a.captura).convert("RGB")
    if a.marco:
        # Paspartú: lienzo del aspecto del hueco, captura centrada con margen.
        W = 2400
        H = round(W / aspecto)
        lienzo = Image.new("RGB", (W, H), a.marco)
        caja_w, caja_h = W * (1 - 2 * a.margen), H * (1 - 2 * a.margen)
        esc = min(caja_w / cap.width, caja_h / cap.height)
        c2 = cap.resize((round(cap.width * esc), round(cap.height * esc)), Image.LANCZOS)
        lienzo.paste(c2, ((W - c2.width) // 2, (H - c2.height) // 2))
        cap = lienzo
    else:
        # En una pantalla girada el hueco se ve más angosto de lo que es: recortar a ese aspecto corta los lados
        if not a.sin_recorte:
            cap = recortar_a(cap, aspecto, a.ancla)
        objetivo = max(ancho, alto) * 1.6
        esc = objetivo / max(cap.size)
        if esc < 1:
            cap = cap.resize((round(cap.width * esc), round(cap.height * esc)), Image.LANCZOS)

    W, H = cap.size
    coef = resolver(quad, [(0, 0), (W, 0), (W, H), (0, H)])
    deformada = cap.transform(escena.size, Image.PERSPECTIVE, coef, Image.BICUBIC)
    deformada = ImageEnhance.Brightness(deformada).enhance(a.brillo)

    if a.reflejo > 0:
        # Brillo suave de vidrio desde la esquina superior izquierda de la pantalla.
        capa = Image.new("L", escena.size, 0)
        d = ImageDraw.Draw(capa)
        d.polygon([tl, tr, (bl[0] + (br[0] - bl[0]) * 0.15, bl[1] + (br[1] - bl[1]) * 0.15), bl], fill=int(255 * a.reflejo))
        capa = capa.filter(ImageFilter.GaussianBlur(60))
        deformada = Image.composite(Image.new("RGB", escena.size, "white"), deformada, capa)

    m = mask.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(0.9))
    salida = Image.composite(deformada, escena, m)
    salida.save(a.salida, quality=90, optimize=True, progressive=True)
    print(f"{a.salida}: esquinas {[tuple(round(v) for v in p) for p in quad]} · aspecto {aspecto:.2f}")


if __name__ == "__main__":
    main()
