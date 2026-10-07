#!/usr/bin/env python3
"""Los tres vídeos en bucle de la ficha de Rematch (modelo Pixelmatters), 2026-10-06.

Pixelmatters enseña la UI EN MOVIMIENTO: 9 de las 14 piezas de su ficha de Amigo son
vídeos cortos sin audio (4–13 s) de la interfaz haciendo algo. Aquí cada vídeo sale de
fotogramas REALES de rematch.pe capturados con Playwright (ver capturar-rematch-pm.cjs);
este script solo los monta sobre su campo o su foto y los codifica.

  python3 videos-rematch-pm.py <dir-taller> <dir-salida> [web] [movil] [movil-portada] [agenda]

Sale por vídeo: <nombre>.mp4 (H.264, yuv420p, faststart, sin audio) y <nombre>.jpg
(el póster: primer cuadro, para prefers-reduced-motion y mientras carga).
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

T, OUT = sys.argv[1], sys.argv[2]
QUE = sys.argv[3:] or ["web", "movil", "agenda"]
os.makedirs(OUT, exist_ok=True)
FPS = 30
TINTA = (0, 29, 48)
FUENTE = "/System/Library/Fonts/Helvetica.ttc"


def redondear_mascara(size, r, solo_abajo=False):
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=r, fill=255)
    if solo_abajo:
        d.rectangle((0, 0, size[0], r), fill=255)
    return m


def sombra_capa(size, caja, r, desenfoque, opacidad, despl, color=(0, 8, 14)):
    s = Image.new("L", size, 0)
    x0, y0, x1, y1 = caja
    ImageDraw.Draw(s).rounded_rectangle(
        (x0 + despl[0], y0 + despl[1], x1 + despl[0], y1 + despl[1]), radius=r, fill=255
    )
    s = s.filter(ImageFilter.GaussianBlur(desenfoque)).point(lambda v: int(v * opacidad))
    capa = Image.new("RGBA", size, color + (0,))
    capa.putalpha(s)
    return capa


def codificar(dir_cuadros, nombre, n_lazo=14):
    """Cuadros f%05d.jpg → mp4. Los últimos n_lazo funden hacia el primero (bucle sin salto)."""
    fs = sorted(f for f in os.listdir(dir_cuadros) if f.endswith(".jpg"))
    primero = Image.open(os.path.join(dir_cuadros, fs[0])).convert("RGB")
    for k in range(n_lazo):
        f = fs[len(fs) - n_lazo + k]
        a = Image.open(os.path.join(dir_cuadros, f)).convert("RGB")
        t = (k + 1) / (n_lazo + 1)
        Image.blend(a, primero, t * t * (3 - 2 * t)).save(os.path.join(dir_cuadros, f), quality=94)
    mp4 = os.path.join(OUT, nombre + ".mp4")
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i",
         os.path.join(dir_cuadros, "f%05d.jpg"), "-c:v", "libx264", "-preset", "slow",
         "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", mp4],
        check=True,
    )
    primero.save(os.path.join(OUT, nombre + ".jpg"), quality=86, optimize=True, progressive=True)
    print(f"✓ {nombre}.mp4  {len(fs)} cuadros · {len(fs)/FPS:.1f} s · "
          f"{os.path.getsize(mp4)//1024} KB · póster {nombre}.jpg")


# ── 1 · rematch.pe en escritorio, en un navegador sobre el campo tinta ───────────
def web():
    W, H = 2240, 1260
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.clip(np.sqrt(((xx / W - 0.2) / 1.1) ** 2 + ((yy / H - 0.15) / 1.1) ** 2), 0, 1)[..., None] ** 1.2
    campo = np.array((12, 54, 82), np.float32) * (1 - d) + np.array((0, 22, 37), np.float32) * d
    fondo = Image.fromarray(np.clip(campo, 0, 255).astype(np.uint8)).convert("RGBA")
    # Dos círculos enormes un tono más claros, como los de Amigo: dan cuerpo al campo
    arcos = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    da = ImageDraw.Draw(arcos)
    da.ellipse((-700, 380, 1100, 2180), fill=(16, 62, 92, 120))
    da.ellipse((1500, -900, 3300, 900), fill=(18, 66, 96, 110))
    fondo = Image.alpha_composite(fondo, arcos.filter(ImageFilter.GaussianBlur(3)))
    # Ventana
    cw, ch, barra = 1600, 1000, 58
    x0, y0 = (W - cw) // 2, (H - ch - barra) // 2 + 6
    fondo = Image.alpha_composite(fondo, sombra_capa((W, H), (x0, y0, x0 + cw, y0 + ch + barra), 22, 46, 0.55, (0, 30)))
    marco = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dm = ImageDraw.Draw(marco)
    dm.rounded_rectangle((x0, y0, x0 + cw, y0 + ch + barra), radius=22, fill=(233, 238, 243, 255))
    for i, col in enumerate([(255, 95, 87), (254, 188, 46), (40, 200, 64)]):
        cx = x0 + 30 + i * 26
        dm.ellipse((cx - 7, y0 + barra // 2 - 7, cx + 7, y0 + barra // 2 + 7), fill=col + (255,))
    pw = 420
    dm.rounded_rectangle((x0 + (cw - pw) // 2, y0 + 14, x0 + (cw + pw) // 2, y0 + barra - 14), radius=15, fill=(255, 255, 255, 255))
    f = ImageFont.truetype(FUENTE, 19)
    dm.text((x0 + cw // 2, y0 + barra // 2), "rematch.pe", font=f, fill=(61, 90, 110, 255), anchor="mm")
    base = Image.alpha_composite(fondo, marco).convert("RGB")
    masc = redondear_mascara((cw, ch), 22, solo_abajo=True)

    src = os.path.join(T, "capturas/web-scroll")
    fs = sorted(x for x in os.listdir(src) if x.endswith(".jpg"))
    tmp = tempfile.mkdtemp()
    for i, fn in enumerate(fs):
        im = Image.open(os.path.join(src, fn)).convert("RGB").resize((cw, ch), Image.LANCZOS)
        out = base.copy()
        out.paste(im, (x0, y0 + barra), masc)
        out.save(os.path.join(tmp, f"f{i:05d}.jpg"), quality=94)
    codificar(tmp, "rm-web")
    shutil.rmtree(tmp)


# ── 2 · rematch.pe en el celular, flotando sobre la foto nocturna ────────────────
def movil(W=2240, H=1612, nombre="rm-movil"):
    """W×H 2240×1612 para la ficha; 2240×1400 (16:10) para la portada del home
    (Alexander, 2026-10-06: «probemos poniendo alguna de tus animaciones de rematch como la
    portada»; recortado de la 1,39 el celular quedaba cortado abajo). La escena se RECORTA a la
    proporción antes de escalar —nunca se estira— y el celular toma el 82,5 % del alto."""
    foto = Image.open(os.path.join(T, "escenas/g5-jugador-noche.png")).convert("RGB")
    fw, fh = foto.size
    if fw / fh < W / H:
        ch = round(fw * H / W)
        foto = foto.crop((0, (fh - ch) // 2, fw, (fh - ch) // 2 + ch))
    else:
        cw = round(fh * W / H)
        foto = foto.crop(((fw - cw) // 2, 0, (fw - cw) // 2 + cw, fh))
    foto = foto.resize((W, H), Image.LANCZOS)
    foto = Image.blend(foto, Image.new("RGB", (W, H), (0, 6, 12)), 0.42)
    estado = Image.open(os.path.join(T, "taller/pantalla-web-inicio.png")).convert("RGB").crop((0, 0, 1170, 150)).resize((780, 100), Image.LANCZOS)
    alto = round(H * 0.825)
    ancho = round(alto * 780 / 1688)
    x0 = (W - ancho) // 2 + round(180 * H / 1612)  # a la derecha del jugador, sin tocarle la pierna
    y0 = (H - alto) // 2
    base = Image.alpha_composite(foto.convert("RGBA"), sombra_capa((W, H), (x0, y0, x0 + ancho, y0 + alto), 70, 60, 0.6, (0, 30))).convert("RGB")
    masc = redondear_mascara((ancho, alto), 76)
    src = os.path.join(T, "capturas/web-movil-scroll")
    fs = sorted(x for x in os.listdir(src) if x.endswith(".jpg"))
    tmp = tempfile.mkdtemp()
    for i, fn in enumerate(fs):
        p = Image.new("RGB", (780, 1688))
        p.paste(estado, (0, 0))
        p.paste(Image.open(os.path.join(src, fn)).convert("RGB"), (0, 100))
        p = p.resize((ancho, alto), Image.LANCZOS)
        out = base.copy()
        out.paste(p, (x0, y0), masc)
        out.save(os.path.join(tmp, f"f{i:05d}.jpg"), quality=94)
    codificar(tmp, nombre)
    shutil.rmtree(tmp)


# ── 3 · La agenda: el jugador reserva en el celular y la reserva cae en el club ──
def agenda():
    W, H = 2240, 1612
    d = os.path.join(T, "capturas/agenda-anim")
    cuadros = json.load(open(os.path.join(d, "cuadros.json")))
    caja = json.load(open(os.path.join(d, "caja.json")))
    p = caja["pad"]
    x0, y0 = int(caja["x"] - p), max(0, int(caja["y"] - p))
    x1, y1 = int(caja["x"] + caja["w"] + p), int(caja["y"] + caja["h"] + p)
    fondo_col = Image.open(os.path.join(d, cuadros[100]["f"])).convert("RGB").getpixel((5, 5))
    ancho = 1900
    alto = round(ancho * (y1 - y0) / (x1 - x0))
    px, py = (W - ancho) // 2, (H - alto) // 2
    t0 = cuadros[0]["t"]
    tiempos = [c["t"] - t0 for c in cuadros]
    inicio, fin = 0.8, tiempos[-1] - 0.05
    tmp = tempfile.mkdtemp()
    n = int((fin - inicio) * FPS)
    j = 0
    for i in range(n):
        t = inicio + i / FPS
        while j + 1 < len(tiempos) and tiempos[j + 1] <= t:
            j += 1
        im = Image.open(os.path.join(d, cuadros[j]["f"])).convert("RGB").crop((x0, y0, x1, y1))
        out = Image.new("RGB", (W, H), fondo_col)
        out.paste(im.resize((ancho, alto), Image.LANCZOS), (px, py))
        out.save(os.path.join(tmp, f"f{i:05d}.jpg"), quality=94)
    codificar(tmp, "rm-agenda", n_lazo=16)
    shutil.rmtree(tmp)


for q in QUE:
    {
        "web": web,
        "movil": movil,
        # la portada del home, a 16:10 (highlights-section.tsx)
        "movil-portada": lambda: movil(2240, 1400, "rm-movil-portada"),
        "agenda": agenda,
    }[q]()
