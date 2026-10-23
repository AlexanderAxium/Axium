"""
Estampa un logotipo REAL sobre una escena (2026-10-22), para que se vea impreso y no pegado.

Alexander, sobre el casco de MainTech de las páginas de servicio: «mejora, que parezca real».
El casco anterior llevaba el logo encima con un `rotateY` de CSS: un plano girado sobre una cúpula,
nítido, sin luz y sin brillo, y se notaba. Aquí el logo se trata como tinta:

- sobre una superficie plana (papel, una tapa), se coloca derecho y la tinta toma la luz del papel:
  las sombras de las hojas pasan por encima y la textura se trasluce; un relieve leve, como de
  prensa, en el borde de cada trazo;
- sobre una superficie curva (el casco), se envuelve en un cilindro vertical con el radio medido
  en la silueta, la sonrisa de los aros vistos desde arriba y el radio que se achica hacia la
  copa; la tinta toma el sombreado del casco y los reflejos del plástico le pasan por encima.

Uso:
  python3 estampar-marca.py casco    → mt-casco-banco-v2.jpg (MainTech)
  python3 estampar-marca.py aurore   → diseno-identidad.jpg  (Aurore: caja, tarjetas y paleta)
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

RAIZ = Path(__file__).resolve().parents[1]
WEB = RAIZ.parents[2]


def cargar(p):
    return np.asarray(Image.open(p).convert("RGB")).astype(np.float32) / 255


def alfa_logo(p, ancho):
    """El alfa del logotipo (tinta negra sobre transparente), recortado y llevado a `ancho` px."""
    im = Image.open(p).convert("RGBA")
    im = im.crop(im.getbbox())
    alto = round(im.height * ancho / im.width)
    im = im.resize((ancho, alto), Image.LANCZOS)
    return np.asarray(im.getchannel("A")).astype(np.float32) / 255


def desenfocar(a, r):
    im = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r))).astype(np.float32) / 255


def luminancia(img):
    # (sin `@`: con numpy 2 sobre Accelerate, el matmul en float32 tira avisos falsos)
    return img[..., 0] * 0.299 + img[..., 1] * 0.587 + img[..., 2] * 0.114


def bilineal(src, xs, ys):
    """Muestrea `src` (H×W) en coordenadas fraccionarias; fuera del borde, 0."""
    h, w = src.shape
    x0 = np.floor(xs).astype(int)
    y0 = np.floor(ys).astype(int)
    fx, fy = xs - x0, ys - y0
    out = np.zeros_like(xs, dtype=np.float32)
    for dy in (0, 1):
        for dx in (0, 1):
            xx, yy = x0 + dx, y0 + dy
            ok = (xx >= 0) & (xx < w) & (yy >= 0) & (yy < h)
            peso = (fx if dx else 1 - fx) * (fy if dy else 1 - fy)
            v = np.zeros_like(out)
            v[ok] = src[yy[ok], xx[ok]]
            out += v * peso
    return out


def entintar(base, a, tinta, opacidad=0.94, relieve=0.0, brillo=None):
    """
    Pone tinta de color `tinta` con cobertura `a` (H×W, en el tamaño de `base`).
    - La tinta toma la luz de la superficie: se escala por la luminancia local suavizada respecto
      de la del papel limpio (las sombras de las hojas la oscurecen igual que al papel).
    - `relieve`: la huella de la prensa alrededor del trazo (luz arriba a la izquierda).
    - `brillo`: los reflejos de la superficie, que pasan por encima de la tinta (plástico).
    """
    L = luminancia(base)
    Ls = desenfocar(L, 6)
    ref = np.percentile(Ls[a > 0.5], 90) if (a > 0.5).any() else Ls.max()
    sombra = np.clip(Ls / max(ref, 1e-3), 0, 1.15)[..., None]
    t = np.array(tinta, np.float32)[None, None, :] * sombra
    # la fibra del papel se trasluce un poco en la tinta
    fibra = (L - Ls)[..., None] * 0.35
    a = desenfocar(a, 0.6) * opacidad
    out = base * (1 - a[..., None]) + (t + fibra) * a[..., None]
    if relieve:
        b = desenfocar(a, 1.6)
        arriba = np.roll(np.roll(b, 2, 0), 2, 1)
        abajo = np.roll(np.roll(b, -2, 0), -2, 1)
        canto = (arriba - abajo) * (1 - a)
        out = out * (1 - relieve * canto[..., None])
    if brillo is not None:
        out = out + brillo[..., None] * a[..., None]
    return np.clip(out, 0, 1)


def grano(img, s=0.008, semilla=7):
    r = np.random.default_rng(semilla).normal(0, s, img.shape[:2]).astype(np.float32)
    return np.clip(img + r[..., None], 0, 1)


def guardar(img, p, lado=None, calidad=86):
    im = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8))
    if lado:
        im = im.resize(lado, Image.LANCZOS)
    im.save(p, quality=calidad, optimize=True, progressive=True)
    print("✓", p, im.size)


def plano(base, logo, centro, ancho, tinta, **kw):
    """El logotipo derecho sobre una superficie plana vista de frente (cenital)."""
    al = alfa_logo(logo, ancho)
    a = np.zeros(base.shape[:2], np.float32)
    h, w = al.shape
    x0, y0 = round(centro[0] - w / 2), round(centro[1] - h / 2)
    a[y0 : y0 + h, x0 : x0 + w] = al
    return entintar(base, a, tinta, **kw)


# ── El casco de MainTech ─────────────────────────────────────────────────────────────────────
def casco():
    M = RAIZ / "capturas-clientes/maintech/assets"
    base = cargar(M / "escenas/casco-banco.jpg")  # 2048², el casco blanco liso
    H, W = base.shape[:2]
    # medido en la silueta (umbral 0.2): centro x≈935 y semiancho 572 (y 640) → 634 (y 940);
    # la arista central del frente cae en x≈979: el casco mira un poco a su izquierda
    cx = 935.0

    def radio(y):
        return 572 + (y - 640) * (634 - 572) / 300

    # el logo, centrado entre la silueta y la arista del frente (centrado en la arista se leía
    # corrido a la derecha, porque el lado derecho del casco está en sombra)
    frente = float(np.arcsin((962 - cx) / radio(790)))
    medio_arco = 0.5  # medio ancho del logo, en radianes de la cúpula: ~28 % del cuadro
    y_centro, sen_cam = 792.0, 0.2  # el centro del logo y la cámara un poco por encima

    # el lockup a todo color (logo.svg renderizado a 3168 px con Playwright), al doble del arco
    escala = 2
    im = Image.open(M / "logos/logo-color-3168.png").convert("RGBA")
    im = im.crop(im.getbbox())
    lw = round(2 * medio_arco * radio(y_centro) * escala)
    lh = round(im.height * lw / im.width)
    im = im.resize((lw, lh), Image.LANCZOS)
    rgba = np.asarray(im).astype(np.float32) / 255
    alto = lh / escala

    # rejilla de salida al doble, solo donde cae el logo
    x_ini, x_fin = 600, 1300
    y_ini, y_fin = int(y_centro - alto / 2 - 40), int(y_centro + alto / 2 + 40)
    X, Y = np.meshgrid(
        np.arange(x_ini, x_fin, 1 / escala, dtype=np.float32),
        np.arange(y_ini, y_fin, 1 / escala, dtype=np.float32),
    )
    R = radio(Y)
    ang = np.arcsin(np.clip((X - cx) / R, -0.999, 0.999))
    u = (ang - frente + medio_arco) / (2 * medio_arco)  # 0..1 a lo ancho del logo
    # los aros horizontales, vistos desde arriba, sonríen: los lados suben
    sube = R * sen_cam * (1 - np.cos(ang))
    v = (Y - (y_centro - alto / 2) + sube) / alto  # 0..1 a lo alto
    dentro = (u >= 0) & (u <= 1) & (v >= 0) & (v <= 1)

    def llevar(canal):
        m = bilineal(canal, u * (lw - 1), v * (lh - 1)) * dentro
        m = Image.fromarray((np.clip(m, 0, 1) * 255).astype(np.uint8)).resize(
            (x_fin - x_ini, y_fin - y_ini), Image.LANCZOS
        )
        out = np.zeros((H, W), np.float32)
        out[y_ini:y_fin, x_ini:x_fin] = np.asarray(m).astype(np.float32) / 255
        return out

    a = llevar(rgba[..., 3])
    # color premultiplicado por el alfa y vuelto a dividir: sin halo negro en los bordes
    color = np.stack([llevar(rgba[..., c] * rgba[..., 3]) for c in range(3)], -1)
    color = color / np.maximum(a[..., None], 0.02)

    # la tinta toma el sombreado del casco y los reflejos del plástico le pasan por encima
    L = luminancia(base)
    Ls = desenfocar(L, 10)
    ref = np.percentile(Ls[a > 0.5], 92)
    sombra = np.clip(Ls / ref, 0, 1.1)[..., None]
    brillo = np.clip(L - desenfocar(L, 14) - 0.015, 0, 1) * 1.6
    a2 = desenfocar(a, 0.7) * 0.95
    out = base * (1 - a2[..., None]) + np.clip(color, 0, 1) * sombra * a2[..., None]
    out = np.clip(out + brillo[..., None] * a2[..., None], 0, 1)

    # el velo de siempre: las estanterías del fondo no compiten con el casco
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    yy, xx = yy / H, xx / W
    velo = (
        1
        - 0.45 * np.exp(-(((xx - 0.03) / 0.46) ** 2 + ((yy - 0.03) / 0.3) ** 2))
        - 0.4 * np.exp(-(((xx - 0.97) / 0.46) ** 2 + ((yy - 0.04) / 0.26) ** 2))
    )
    out = grano(out * velo[..., None], 0.006)
    guardar(out, WEB / "public/images/proyects/maintech/mt-casco-banco-v2.jpg", (1600, 1600))


# ── Aurore: caja, tarjetas y paleta ──────────────────────────────────────────────────────────
def aurore():
    T = RAIZ / "taller-servicios/2026-10"
    MA = RAIZ / "capturas-saas/aurore/marca"
    base = cargar(T / "diseno-identidad-1.png")  # 2048×1536, todo en blanco
    negro = (0.106, 0.102, 0.090)  # #1B1A17, el negro de Aurore
    # la tapa: x 420-978, y 237-806 → el logo con su A, centrado, un tercio del ancho
    out = plano(base, MA / "logo-vertical.webp", (699, 515), 205, negro, opacidad=0.93, relieve=0.05)
    # la tarjeta de delante: x 1438-1885, y 935-1200 → la palabra
    out = plano(out, MA / "palabra.png", (1661, 1067), 168, negro, opacidad=0.92, relieve=0.04)
    # la de atrás asoma arriba (x 1320-1768, y 820-935): el monograma arriba al centro, y la de
    # delante lo tapa donde corresponde
    atras = plano(out, MA / "monograma.png", (1544, 872), 58, negro, opacidad=0.92, relieve=0.04)
    tapa = np.zeros(base.shape[:2], bool)
    tapa[930:1205, 1434:1890] = True
    out = np.where(tapa[..., None], out, atras)
    out = grano(out, 0.005)
    guardar(out, WEB / "public/images/servicios/diseno-identidad.jpg", (1600, 1200))


if __name__ == "__main__":
    {"casco": casco, "aurore": aurore}[sys.argv[1]]()
