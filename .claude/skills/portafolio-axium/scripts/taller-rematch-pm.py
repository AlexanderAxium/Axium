#!/usr/bin/env python3
"""Piezas fijas de la ficha de Rematch al modelo Pixelmatters (Amigo), 2026-10-06.

Todo sale de: escenas generadas (OpenAI, solo materia y luz, pantallas apagadas) +
capturas REALES de rematch.pe, live.rematch.pe y el panel en local con el inquilino
demo. Aquí no se genera nada: se compone. Reproducible tal cual.

  python3 taller-rematch-pm.py <dir-taller> <dir-public>

Lee de <dir-taller>: escenas/, piezas/ (heroe-master, recepcion-v2, banca-v2),
capturas/ y ../panel/. Escribe en <dir-public> los JPG de la ficha.
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

T = sys.argv[1]
P = sys.argv[2]
os.makedirs(P, exist_ok=True)
PANEL = os.path.join(T, "..", "panel")

TINTA = (0, 29, 48)
LIMA = (180, 223, 0)
GRIS = (241, 245, 249)
FONDO_AGENDA = (244, 245, 247)


def abrir(r):
    return Image.open(os.path.join(T, r) if not os.path.isabs(r) else r).convert("RGB")


def guardar(im, nombre, q=86):
    ruta = os.path.join(P, nombre)
    im.convert("RGB").save(ruta, quality=q, optimize=True, progressive=True)
    print("✓", nombre, im.size, f"{os.path.getsize(ruta)//1024} KB")


def redondear(im, r):
    m = Image.new("L", im.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, im.size[0] - 1, im.size[1] - 1), radius=r, fill=255)
    out = im.convert("RGBA")
    out.putalpha(m)
    return out


def sombra(base, pieza, xy, desenfoque=60, opacidad=0.32, despl=(0, 30), color=TINTA):
    """Sombra de la silueta (alfa) de la pieza, desplazada y difusa."""
    a = pieza.split()[-1]
    s = Image.new("RGBA", base.size, color + (0,))
    capa = Image.new("L", base.size, 0)
    capa.paste(a, (xy[0] + despl[0], xy[1] + despl[1]))
    capa = capa.filter(ImageFilter.GaussianBlur(desenfoque))
    capa = capa.point(lambda v: int(v * opacidad))
    s.putalpha(capa)
    return Image.alpha_composite(base.convert("RGBA"), s)


def pegar(base, pieza, xy, **kw):
    base = sombra(base, pieza, xy, **kw)
    base.alpha_composite(pieza, dest=xy)
    return base


def tarjeta(recorte, r=28, borde=2):
    """Un recorte de UI dentro de su tarjeta blanca, con el filo gris del panel."""
    w, h = recorte.size
    t = Image.new("RGB", (w + 2 * borde, h + 2 * borde), (226, 232, 240))
    t.paste(recorte, (borde, borde))
    return redondear(t, r)


def campo(size, centro, borde, foco=(0.3, 0.25), radio=1.1):
    """Campo liso con una luz radial suave (sin bandas: se añade grano fino)."""
    w, h = size
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((xx / w - foco[0]) / radio) ** 2 + ((yy / h - foco[1]) / radio) ** 2)
    d = np.clip(d, 0, 1)[..., None] ** 1.3
    a = np.array(centro, np.float32) * (1 - d) + np.array(borde, np.float32) * d
    a += np.random.default_rng(7).normal(0, 2.2, a.shape)
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def grano(im, s=3.0):
    a = np.asarray(im.convert("RGB")).astype(np.float32)
    a += np.random.default_rng(3).normal(0, s, a.shape[:2])[..., None]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def recorte_panel(nombre, caja):
    return Image.open(os.path.join(PANEL, nombre)).convert("RGB").crop(caja)


# ── 1 · Héroe y portadas (la misma foto, como hace Pixelmatters en su índice) ─────
# v2 (2026-10-06): la portada móvil de live corregida en Rematch y la luz de la escena
# sobre el vidrio (componer-escena.py --caida/--techo/--tinte/--filo)
# v3: la pantalla sigue la forma exacta del cristal (escena editada con clave magenta)
heroe = abrir("piezas/heroe-master-v3.jpg")  # 3072×2048, celular centrado en x=1534, y 317–1397
guardar(heroe.crop((0, 170, 3072, 1877)).resize((2880, 1600), Image.LANCZOS), "rm-heroe-v3.jpg", 85)
guardar(heroe.crop((512, 0, 2560, 2048)).resize((1400, 1400), Image.LANCZOS), "rm-heroe-movil-v3.jpg", 85)
guardar(heroe, "rematch-portada-mano-v3.jpg", 84)
guardar(heroe.crop((0, 64, 3072, 1984)).resize((2048, 1280), Image.LANCZOS), "rematch-v14.jpg", 85)

# ── 2 · Par: el portátil en la recepción y el celular en la banca ────────────────
guardar(abrir("piezas/recepcion-v4.jpg").crop((95, 420, 1415, 1740)).resize((1400, 1400), Image.LANCZOS), "rm-recepcion-v3.jpg")
# La banca (fondo cargado, celular casi de frente) se cambió por la mesa del café del
# club al modo del celular de Amigo: pared crema, tres cuartos, sol bajo y reflejo.
guardar(abrir("piezas/mesa-v3.jpg").crop((200, 120, 1900, 1820)).resize((1400, 1400), Image.LANCZOS), "rm-mesa-v2.jpg")

# ── 3 · La entrenadora con la lista de alumnos de la academia ────────────────────
foto = abrir("escenas/g4-entrenadora.png").convert("RGBA")
alumnos = recorte_panel("22-alumnos-d.png", (540, 410, 1400, 880))  # Alumno · Tipo · Plan, 3 filas
c = tarjeta(alumnos).resize((960, int(960 * (alumnos.size[1] + 4) / (alumnos.size[0] + 4))), Image.LANCZOS)
# A la altura de su cara y por encima de sus manos: ni la tapa ni le corta el gesto
foto = pegar(foto, c, (60, 650), desenfoque=50, opacidad=0.30, despl=(0, 26))
guardar(grano(foto.convert("RGB").resize((1400, 1400), Image.LANCZOS), 1.6), "rm-entrenadora.jpg")

# ── 4 · El dueño al teléfono con la cobranza de la academia ──────────────────────
foto = abrir("escenas/g7-duenio.png").convert("RGBA")
kpi1 = tarjeta(recorte_panel("24-cobranza-d.png", (1116, 306, 1672, 504)), r=24)
kpi2 = tarjeta(recorte_panel("24-cobranza-d.png", (1696, 306, 2250, 504)), r=24)
k1 = kpi1.resize((900, int(900 * kpi1.size[1] / kpi1.size[0])), Image.LANCZOS)
k2 = kpi2.resize((900, int(900 * kpi2.size[1] / kpi2.size[0])), Image.LANCZOS)
foto = pegar(foto, k1, (70, 1150), desenfoque=46, opacidad=0.30, despl=(0, 22))
foto = pegar(foto, k2, (150, 1150 + k1.size[1] + 36), desenfoque=46, opacidad=0.30, despl=(0, 22))
guardar(grano(foto.convert("RGB").resize((1400, 1400), Image.LANCZOS), 1.6), "rm-duenio.jpg")

# ── 5 · Carrusel de cuatro: lo que solo Rematch tiene, sobre campos de su marca ──
L = 1600
ALFA = os.path.join(T, "capturas/componentes-alfa")
LOCAL = os.path.join(T, "capturas/local")
# a · el torneo de demostración con el cartel tipográfico (Rematch local, flyer nulo),
#     sobre el gris de la página de live. Recorte AISLADO, con su fondo transparente.
f = campo((L, L), (250, 251, 252), (228, 233, 239), foco=(0.4, 0.3)).convert("RGBA")
t = Image.open(os.path.join(LOCAL, "torneo-tarjeta.png")).convert("RGBA")
t = t.resize((int(1180 * t.size[0] / t.size[1]), 1180), Image.LANCZOS).rotate(-4, resample=Image.BICUBIC, expand=True)
f = pegar(f, t, ((L - t.size[0]) // 2, (L - t.size[1]) // 2 + 10), desenfoque=50, opacidad=0.22, despl=(8, 30))
guardar(f.convert("RGB"), "rm-c-torneo-v2.jpg")

# b · el asistente «¿Qué tipo de torneo vas a organizar?» con los íconos de vidrio de la
#     marca (antes, emojis), sobre la recepción desenfocada
fondo = abrir("escenas/g2-recepcion.png").resize((L, L), Image.LANCZOS).filter(ImageFilter.GaussianBlur(38))
fondo = Image.blend(fondo, Image.new("RGB", (L, L), (20, 30, 40)), 0.18).convert("RGBA")
# La tarjeta entera del paso 1 (medida en la captura a 2x), un pelo por dentro de su borde
w = Image.open(os.path.join(LOCAL, "asistente-d.png")).convert("RGB").crop((546, 544, 1964, 1352))
w = tarjeta(w, r=30)
w = w.resize((1340, int(1340 * w.size[1] / w.size[0])), Image.LANCZOS)
fondo = pegar(fondo, w, ((L - w.size[0]) // 2, (L - w.size[1]) // 2), desenfoque=60, opacidad=0.35, despl=(0, 36))
guardar(fondo.convert("RGB"), "rm-c-asistente-v2.jpg")

# c · el plan Profesional, sobre la tinta (aislado: la etiqueta «El más elegido» entera)
f = campo((L, L), (14, 58, 86), (0, 18, 31), foco=(0.25, 0.2)).convert("RGBA")
pp = Image.open(os.path.join(ALFA, "precio-profesional.png")).convert("RGBA")
pp = pp.resize((int(1380 * pp.size[0] / pp.size[1]), 1380), Image.LANCZOS).rotate(4, resample=Image.BICUBIC, expand=True)
f = pegar(f, pp, ((L - pp.size[0]) // 2, (L - pp.size[1]) // 2 + 10), desenfoque=70, opacidad=0.5, despl=(0, 40), color=(0, 8, 14))
guardar(f.convert("RGB"), "rm-c-precio-v2.jpg")

# d · la liga con divisiones que suben y bajan, sobre el lima de la marca
f = campo((L, L), (198, 236, 60), (150, 190, 0), foco=(0.35, 0.3)).convert("RGBA")
liga = tarjeta(recorte_panel("31-liga-detalle-tab1-d.png", (536, 884, 1670, 1436)), r=26)
liga = liga.resize((1500, int(1500 * liga.size[1] / liga.size[0])), Image.LANCZOS)
f = pegar(f, liga, ((L - liga.size[0]) // 2, (L - liga.size[1]) // 2), desenfoque=50, opacidad=0.28, despl=(0, 26))
guardar(f.convert("RGB"), "rm-c-liga-v2.jpg")

# ── 6 · Tres celulares planos sobre el gris: las dos puertas ─────────────────────
W, H = 2688, 1934
f = campo((W, H), (248, 250, 252), (233, 238, 243), foco=(0.5, 0.2), radio=1.4).convert("RGBA")
alto = 1520
pant = [f"taller/pantalla-{k}.png" for k in ("web-competicion", "live-como", "web-precios")]
ancho = int(alto * 1170 / 2532)
hueco = 130
x0 = (W - (3 * ancho + 2 * hueco)) // 2
for i, r in enumerate(pant):
    im = Image.open(os.path.join(T, r)).convert("RGB").resize((ancho, alto), Image.LANCZOS)
    im = redondear(im, 86)
    f = pegar(f, im, (x0 + i * (ancho + hueco), (H - alto) // 2 + 40), desenfoque=40, opacidad=0.16, despl=(0, 24))
guardar(f.convert("RGB"), "rm-moviles.jpg")
# móvil: el del centro solo, a 4:5
fm = campo((1400, 1750), (248, 250, 252), (233, 238, 243), foco=(0.5, 0.2)).convert("RGBA")
im = Image.open(os.path.join(T, pant[1])).convert("RGB").resize((700, int(700 * 2532 / 1170)), Image.LANCZOS)
fm = pegar(fm, redondear(im, 80), (350, 120), desenfoque=40, opacidad=0.16, despl=(0, 24))
guardar(fm.convert("RGB"), "rm-moviles-movil.jpg")

# ── 7 · La hoja de componentes reales (recortes AISLADOS: sin el fondo de la página en
#        las esquinas, que en la v1 dejaba negro y gris alrededor de cada pieza)
S = 2048
f = campo((S, S), (248, 250, 252), (230, 236, 242), foco=(0.5, 0.3), radio=1.3).convert("RGBA")
a = lambda n: Image.open(os.path.join(ALFA, n)).convert("RGBA")


def escala(im, ancho):
    return im.resize((ancho, int(ancho * im.size[1] / im.size[0])), Image.LANCZOS)


def poner(base, im, x, y):
    base.alpha_composite(im, dest=(int(x), int(y)))
    return base


m = 160  # los recortes traen 24 px css de margen transparente (72 a 3x)
bus = escala(a("buscador.png"), 1780)
pil = escala(a("pildora.png"), 1000)
dem = escala(a("cta-demo.png"), 560)
ven = escala(a("cta-ventas.png"), 560)
con = escala(a("conmutador.png"), 860)
rp = escala(a("reserva-pagada.png"), 420)
rn = escala(a("reserva-nueva.png"), 420)
hr = escala(a("horarios.png"), 640)
dep = Image.open(os.path.join(T, "capturas/componentes", "deportes.png")).convert("RGB")
dep = escala(redondear(dep.crop((0, 0, int(dep.size[0] * 0.6), dep.size[1])), 30), 1640)
y = 70
f = poner(f, bus, m - 70, y); y += bus.size[1] - 40
f = poner(f, pil, m - 70, y)
f = poner(f, dem, m - 70 + pil.size[0] + 10, y - 16); y += max(pil.size[1], dem.size[1]) - 30
f = poner(f, rp, m - 70, y)
f = poner(f, rn, m - 70 + 380, y)
f = poner(f, hr, S - m - hr.size[0] + 70, y)
y2 = y + max(rp.size[1], hr.size[1]) - 60
f = poner(f, con, m - 70, y2)
f = poner(f, ven, m - 70 + con.size[0] + 10, y2 + 16)
y3 = y2 + con.size[1] + 10
f = pegar(f, dep, (m, y3), desenfoque=30, opacidad=0.14, despl=(0, 14))
print("componentes, alto usado:", y3 + dep.size[1], "de", S)
guardar(f.convert("RGB").resize((1400, 1400), Image.LANCZOS), "rm-componentes-v2.jpg")
