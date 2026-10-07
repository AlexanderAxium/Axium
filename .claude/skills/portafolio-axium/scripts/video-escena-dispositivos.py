#!/usr/bin/env python3
"""Un vídeo de la web real DENTRO de los aparatos de una escena fotográfica (2026-10-07,
Aurore: «los mockups que usa no están bonitos»).

La escena es una foto generada (laptop + celular sobre un mostrador) y su versión con las
pantallas en clave magenta (IMAGENES.md, «La pantalla se pide en CLAVE MAGENTA»). Cada cuadro de
capturar-scroll-cuadros.cjs se deforma a su pantalla con la misma luz que componer-escena.py
(reflejo, caída hacia la sombra, veta de sol, tinte cálido, techo, filo del canto), pero la luz
se calcula UNA vez y por cuadro solo se deforma la captura.

  python3 video-escena-dispositivos.py --escena s1.png --clave s1-clave.png
      --cajas "700,300,1980,1220;2360,540,2720,1170"
      --cuadros dir-escritorio dir-movil --salida salida/av-portada-escena
      [--lienzo 2240x1120] [--luz-angulo 180] [--caida 0.12] [--tinte 1,0.985,0.955]
      [--techo 236] [--reflejo 0.05] [--filo 0.3] [--veta c,ancho,ang,fuerza]
      [--fps 30] [--lazo 18]

⚠️ Se compone SOBRE LA ESCENA EDITADA (la clave), no sobre la original: la edición en magenta
redibuja el aparato un poco distinto (en Aurore, la tapa de la laptop salió más grande) y la
pantalla de la clave no casa con la tapa de la original; la página sobresalía del aparato. Fuera
de la máscara las dos son casi iguales (diferencia media 4–9). La máscara se ensancha 2 px para
tapar el filo magenta que deja la erosión de medir_clave.

`--cajas`: una caja por aparato (en píxeles de la escena) que encierra SOLO su pantalla
magenta; el orden es el de `--cuadros`. Sale <salida>.mp4 y <salida>.jpg (el primer cuadro).

⚠️⚠️ Y si la edición DEFORMÓ el aparato, no se compone sobre ella: en Aurore la tapa de la
laptop volvió de la edición como un rectángulo de frente sobre una base en tres cuartos, y
Alexander lo vio de un vistazo: «qué fea laptop, ¿qué pasó? está deformada». Entonces va
`--quads` en vez de `--clave/--cajas`: las esquinas de cada TAPA medidas a mano sobre la escena
ORIGINAL (cuadrícula + perfil de luminancia en la bisagra), `--biseles` en fracción de la tapa
y `--radios` en px de la captura; la forma sale del cuadrilátero, no de la clave.

  python3 video-escena-dispositivos.py --escena s1.png
      --quads "713.6,340.7,1826,323,1959,1108.7,834.5,1209.9;2373.7,579.6,2638,568.6,2710.5,1125.6,2443.8,1136.7"
      --biseles "0.016,0.03,0.016,0.085;0.035,0.016,0.035,0.016" --radios "8;150"
      --cuadros dir-escritorio dir-movil-con-barra --salida salida/av-portada-escena
"""
import argparse
import importlib.util
import os
import shutil
import subprocess
import tempfile

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

AQUI = os.path.dirname(os.path.abspath(__file__))


def modulo(nombre, archivo):
    s = importlib.util.spec_from_file_location(nombre, os.path.join(AQUI, archivo))
    m = importlib.util.module_from_spec(s)
    s.loader.exec_module(m)
    return m


ce = modulo("componer_escena", "componer-escena.py")
plano = modulo("plano", "plano-perspectiva.py")

ap = argparse.ArgumentParser()
ap.add_argument("--escena", required=True)
ap.add_argument("--clave", default=None)
ap.add_argument("--cajas", default=None)
ap.add_argument("--quads", default=None, help="TLx,TLy,TRx,TRy,BRx,BRy,BLx,BLy por aparato, separados por ;")
ap.add_argument("--biseles", default=None, help="izq,arr,der,aba en fracción de la tapa, por aparato (; y - = sin bisel)")
ap.add_argument("--radios", default=None, help="radio de la pantalla en px de la captura, por aparato")
ap.add_argument("--cuadros", nargs="+", required=True)
ap.add_argument("--salida", required=True)
ap.add_argument("--lienzo", default="2240x1120")
ap.add_argument("--brillo", type=float, default=0.97)
ap.add_argument("--reflejo", type=float, default=0.05)
ap.add_argument("--luz-angulo", type=float, default=180)
ap.add_argument("--caida", type=float, default=0.12)
ap.add_argument("--veta", default=None)
ap.add_argument("--tinte", default="1,0.985,0.955")
ap.add_argument("--techo", type=float, default=236)
ap.add_argument("--filo", type=float, default=0.3)
ap.add_argument("--desenfoque", type=float, default=0.35)
ap.add_argument("--fps", type=int, default=30)
ap.add_argument("--lazo", type=int, default=18)
ap.add_argument("--solo-poster", action="store_true", help="solo el primer cuadro, para revisar el encaje")
a = ap.parse_args()

esc_full = Image.open(a.escena).convert("RGB")
FW, FH = esc_full.size
W, H = [int(v) for v in a.lienzo.split("x")]
k = W / FW
base = Image.open(a.clave if a.clave and not a.quads else a.escena).convert("RGB")
esc = np.asarray(base.resize((W, H), Image.LANCZOS)).astype(np.float32)
tmp = tempfile.mkdtemp()

aparatos = []
n_ap = len((a.quads or a.cajas).split(";"))
for i in range(n_ap):
    dir_c = a.cuadros[i]
    fs = sorted(f for f in os.listdir(dir_c) if f.endswith(".jpg"))
    cw, ch = Image.open(os.path.join(dir_c, fs[0])).size
    if a.quads:
        q = [float(v) for v in a.quads.split(";")[i].split(",")]
        quad_full = [(q[0], q[1]), (q[2], q[3]), (q[4], q[5]), (q[6], q[7])]
        bis = a.biseles.split(";")[i] if a.biseles else "-"
        if bis != "-":
            l, t, r, b = [float(v) for v in bis.split(",")]
            Hu = ce.homografia([(0, 0), (1, 0), (1, 1), (0, 1)], quad_full)
            quad_full = [ce.aplicar(Hu, *uv) for uv in [(l, t), (1 - r, t), (1 - r, 1 - b), (l, 1 - b)]]
        quad = [(x * k, y * k) for x, y in quad_full]
        radio = float(a.radios.split(";")[i]) if a.radios else 0
        coef = plano.coeficientes(quad, [(0, 0), (cw, 0), (cw, ch), (0, ch)])
        # la forma de la pantalla: el rectángulo de la captura (con su radio) deformado igual
        # que la captura, a 2x para que el canto no salga dentado
        m = Image.new("L", (cw * 2, ch * 2), 0)
        ImageDraw.Draw(m).rounded_rectangle((0, 0, cw * 2 - 1, ch * 2 - 1), radius=radio * 2, fill=255)
        masc = m.resize((cw, ch), Image.LANCZOS).transform((W, H), Image.PERSPECTIVE, coef, Image.BICUBIC)
    else:
        x0, y0, x1, y1 = [int(v) for v in a.cajas.split(";")[i].split(",")]
        sola = Image.new("RGB", base.size, (0, 0, 0))
        sola.paste(base.crop((x0, y0, x1, y1)), (x0, y0))
        ruta = os.path.join(tmp, f"clave-{i}.png")
        sola.save(ruta)
        masc_full, quad_full = ce.medir_clave(ruta)
        quad = [(x * k, y * k) for x, y in quad_full]
        masc = masc_full.filter(ImageFilter.MaxFilter(5)).resize((W, H), Image.LANCZOS)
        coef = plano.coeficientes(quad, [(0, 0), (cw, 0), (cw, ch), (0, ch)])
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    ca, cb, cc, cd, cf_, cg_, ch_, ci = coef[0], coef[1], coef[2], coef[3], coef[4], coef[5], coef[6], coef[7]
    den = ch_ * xx + ci * yy + 1.0
    U = ((ca * xx + cb * yy + cc) / den) / cw
    V = ((cd * xx + cf_ * yy + cg_) / den) / ch
    alfa = np.asarray(masc).astype(np.float32) / 255.0
    barrido = (np.clip(1.0 - (U * 0.6 + V * 0.9), 0, 1) ** 1.8 * 255 * a.reflejo)[..., None]
    th = np.deg2rad(a.luz_angulo)
    hacia = np.clip(0.5 + np.cos(th) * (U - 0.5) + np.sin(th) * (V - 0.5), 0, 1)
    caida = ((1 - a.caida) + a.caida * hacia ** 0.8)[..., None]
    veta = None
    if a.veta:
        c0, ancho, ang, fuerza = [float(x) for x in a.veta.split(",")]
        ph = np.deg2rad(ang)
        d = (U * np.cos(ph) + V * np.sin(ph) - c0) / ancho
        veta = (np.exp(-(d ** 2)) * fuerza)[..., None] * np.array([255, 222, 182], np.float32) / 255
    borde = None
    if a.filo:
        b = alfa - np.asarray(masc.filter(ImageFilter.MinFilter(5)), np.float32) / 255.0
        borde = (np.clip(b, 0, 1) * hacia * a.filo)[..., None]
    aparatos.append(dict(dir=dir_c, fs=fs, coef=coef, alfa=alfa[..., None], barrido=barrido,
                         caida=caida, veta=veta, borde=borde))
    print(f"aparato {i}: pantalla", [(round(x), round(y)) for x, y in quad], f"captura {cw}×{ch}")

tinte = np.array([float(x) for x in a.tinte.split(",")], np.float32)
n = 1 if a.solo_poster else min(len(ap_["fs"]) for ap_ in aparatos)
dir_out = os.path.join(tmp, "cuadros")
os.makedirs(dir_out)
for j in range(n):
    out = esc.copy()
    for ap_ in aparatos:
        cap = Image.open(os.path.join(ap_["dir"], ap_["fs"][j])).convert("RGB")
        def_ = cap.transform((W, H), Image.PERSPECTIVE, ap_["coef"], Image.BICUBIC)
        if a.desenfoque:
            def_ = def_.filter(ImageFilter.GaussianBlur(a.desenfoque))
        p = np.asarray(def_).astype(np.float32) * a.brillo + 6.0
        p = 255 - (255 - p) * (255 - ap_["barrido"]) / 255
        p *= ap_["caida"]
        if ap_["veta"] is not None:
            p = 255 - (255 - p) * (1 - ap_["veta"])
        p = (p * a.techo / 255.0) * tinte
        if ap_["borde"] is not None:
            p = p + (255 - p) * ap_["borde"]
        out = out * (1 - ap_["alfa"]) + np.clip(p, 0, 255) * ap_["alfa"]
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(os.path.join(dir_out, f"f{j:05d}.jpg"), quality=93)
    if j % 60 == 0:
        print(f"  cuadro {j}/{n}")

fs = sorted(os.listdir(dir_out))
uno = Image.open(os.path.join(dir_out, fs[0]))
if a.solo_poster:
    uno.save(a.salida + ".jpg", quality=92)
    shutil.rmtree(tmp)
    print("✓ póster", a.salida + ".jpg")
    raise SystemExit
for t_ in range(a.lazo):
    p_ = os.path.join(dir_out, fs[len(fs) - a.lazo + t_])
    t = (t_ + 1) / (a.lazo + 1)
    Image.blend(Image.open(p_), uno, t * t * (3 - 2 * t)).save(p_, quality=93)
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-framerate", str(a.fps), "-i", os.path.join(dir_out, "f%05d.jpg"),
     "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
     "-an", a.salida + ".mp4"],
    check=True,
)
uno.save(a.salida + ".jpg", quality=88, optimize=True, progressive=True)
shutil.rmtree(tmp)
print(f"✓ {a.salida}.mp4  {n} cuadros · {n / a.fps:.1f} s · {os.path.getsize(a.salida + '.mp4') // 1024} KB")
