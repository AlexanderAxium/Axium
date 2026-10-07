#!/usr/bin/env python3
"""Rematch — el capítulo de marca sale del MANUAL DE MARCA real (2026-10-06).

Alexander, sobre las láminas de anatomía con callouts 01-02-03 sobre la R: «usa eso en
descargas para el manual de marca, no inventes taaanto… ¿qué representan esos 3 puntos? si
alguien se pone a analizar no entenderá el propósito, a eso me refiero con inventar».

Fuente: ~/Downloads/ENTREGA FINAL-REMATCH-ABRIL-2026/ (la entrega del diseñador: logotipos,
paleta, tipografías, línea gráfica, mockups y el manual en PDF de 20 páginas). Aquí NO se
dibuja nada: se recortan páginas del manual y se encuadran los archivos entregados.

  · Las páginas del manual son 16:9 con una columna de texto a la izquierda (x < 1520 a
    4000 px). Para los pares cuadrados se toma SOLO el panel visual; si el panel tiene marco,
    se completa al cuadrado con su mismo lima (#B5DF01) en vez de cortarlo.
  · La página de tipografías trae un ejemplo en lorem ipsum: se corta por encima. Su columna
    de texto es más ancha (el panel empieza en x 1605, no en 1520).

  python3 manual-rematch.py <dir-salida>
"""
import os
import subprocess
import sys

from PIL import Image, ImageFilter

ENTREGA = os.path.expanduser("~/Downloads/ENTREGA FINAL-REMATCH-ABRIL-2026")
PDF = f"{ENTREGA}/7. MANUAL DE MARCA/MANUAL DE MARCA-REMATCH-ALEX.pdf"
SK = "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium"
HD = f"{SK}/capturas-saas/rematch/pixelmatters-2026-10/marca/manual"
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
LIMA = (181, 223, 1)
TINTA = (0, 29, 48)
CUADRO = 1600


def pagina(n):
    ruta = f"{HD}/hd-{n:02d}.png"
    if not os.path.exists(ruta):
        subprocess.run(["pdftoppm", "-r", "150", "-png", "-f", str(n), "-l", str(n), PDF, f"{HD}/hd"], check=True)
    return Image.open(ruta).convert("RGB")  # 4000×2250


def guardar(im, nombre, q=88):
    ruta = f"{OUT}/{nombre}.jpg"
    im.save(ruta, quality=q, optimize=True, progressive=True, subsampling=0)
    print(f"✓ {nombre}.jpg {im.size[0]}×{im.size[1]} {os.path.getsize(ruta) // 1024} KB")


def al_cuadrado(im, fondo):
    lado = max(im.size)
    c = Image.new("RGB", (lado, lado), fondo)
    c.paste(im, ((lado - im.width) // 2, (lado - im.height) // 2))
    return c.resize((CUADRO, CUADRO), Image.LANCZOS)


def cuadrado_central(im, cx=0.5):
    lado = min(im.size)
    x0 = int(min(max(im.width * cx - lado / 2, 0), im.width - lado))
    y0 = (im.height - lado) // 2
    return im.crop((x0, y0, x0 + lado, y0 + lado)).resize((CUADRO, CUADRO), Image.LANCZOS)


# ── Pares cuadrados: versiones de logo · versiones de color ──────────────────────────
guardar(al_cuadrado(pagina(5).crop((1520, 0, 4000, 2250)), LIMA), "rm-manual-logo")
guardar(pagina(6).crop((1635, 0, 3885, 2250)).resize((CUADRO, CUADRO), Image.LANCZOS), "rm-manual-color")

# ── Tipografías (sin el ejemplo en lorem ipsum) · paleta entregada ───────────────────
guardar(al_cuadrado(pagina(10).crop((1612, 0, 4000, 1560)), LIMA), "rm-manual-tipografia")
paleta = Image.open(f"{ENTREGA}/2. PALETA DE COLORES/PNG/PALETA DE COLOR.png").convert("RGBA")
fondo = Image.new("RGBA", paleta.size, TINTA + (255,))
paleta = Image.alpha_composite(fondo, paleta).convert("RGB").crop((4, 4, paleta.width - 4, paleta.height - 4))
guardar(cuadrado_central(paleta), "rm-manual-paleta")

# ── El glosario de marca: la caja (x 250–3749, y 202–2047) centrada en su lima, sin el
# número de página que queda debajo (y 2103–2145); márgenes parejos en vez de los del pliego ──
caja = pagina(15).crop((210, 162, 3789, 2087))
pliego = Image.new("RGB", (3977, 2237), LIMA)
pliego.paste(caja, ((pliego.width - caja.width) // 2, (pliego.height - caja.height) // 2))
guardar(pliego.resize((2800, 1575), Image.LANCZOS), "rm-manual-glosario")

# ── La línea gráfica en redes: los tres posts entregados, sobre la tinta ─────────────
W, H = 3200, 1600
lienzo = Image.new("RGBA", (W, H), TINTA + (255,))
posts = [Image.open(f"{ENTREGA}/5. LÍNEA GRÁFICA/INSTAGRAM-REMATCH-ALEX-{i}.png").convert("RGB") for i in (1, 2, 3)]
ph = 1180
pw = round(ph * 1080 / 1350)
gap = 56
x = (W - 3 * pw - 2 * gap) // 2
y = (H - ph) // 2
for p in posts:
    sombra = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s = Image.new("RGBA", (pw, ph), (0, 6, 12, 150))
    sombra.paste(s, (x + 10, y + 26))
    lienzo = Image.alpha_composite(lienzo, sombra.filter(ImageFilter.GaussianBlur(34)))
    lienzo.paste(p.resize((pw, ph), Image.LANCZOS), (x, y))
    x += pw + gap
guardar(lienzo.convert("RGB").resize((2800, 1400), Image.LANCZOS), "rm-manual-redes")

# ── Aplicaciones: los mockups entregados ─────────────────────────────────────────────
M = f"{ENTREGA}/6. MOCKUPS"
fachada = Image.open(f"{M}/LOGO SUPERFICIE.png").convert("RGB")  # 4000×3000, letrero en x 1480–3800
guardar(fachada.crop((0, 300, 4000, 2586)).resize((2800, 1600), Image.LANCZOS), "rm-apl-fachada")
for archivo, nombre, cx in [
    ("TAZA", "rm-apl-taza", 0.5),
    ("ID CARD", "rm-apl-credencial", 0.5),
    ("PAPELERIA ESTACIONARIA", "rm-apl-papeleria", 0.5),
    ("CALENDARIO", "rm-apl-calendario", 0.5),
    ("LAPICERO", "rm-apl-lapiceros", 0.5),
]:
    guardar(cuadrado_central(Image.open(f"{M}/{archivo}.png").convert("RGB"), cx), nombre)
