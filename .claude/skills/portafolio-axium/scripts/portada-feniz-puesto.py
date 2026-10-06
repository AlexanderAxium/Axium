#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""FENIZ · «El puesto» — la misma plataforma en los dos sitios donde se usa.

La segunda dirección. Cambia el TIPO de maqueta, no el contenido: cámara en tres
cuartos desde la izquierda, dos aparatos sobre la misma mesa y con la misma luz,
y profundidad de verdad entre ellos. El monitor lleva el panel de escritorio
—donde el trader configura la conexión propfirm→bróker— y el móvil, de pie
delante, lleva el panel móvil: lo que mira cuando el Expert Advisor ya está
trabajando solo. Eso es «Trading sin esfuerzo» contado con objetos.

Referencia: Ramotion, ficha «Puzzle» (https://www.ramotion.com/work/) — pantalla
dentro de un entorno con luz rasante y el aparato cortado por el canto; y
Behance/«Lendora» para el escorzo bajo. El campo y el grano los pone el modelo;
los marcos se construyen; la interfaz y la marca son ficheros reales.

uso: python3 puesto.py <campo.jpg> <salida.jpg>
"""
import os, sys, math
import numpy as np
from PIL import Image, ImageFilter

SK = "/Users/alexander/Documents/AXIUM-WEB/.claude/skills/portafolio-axium"
SP = os.environ.get("FZ_TMP", "/tmp/feniz-portada")
sys.path.insert(0, f"{SK}/scripts")
from importlib import import_module
cc = import_module("componer-campo")
os.makedirs(f"{SP}/ui", exist_ok=True)

W, H = 3072, 2304
CAMPO = sys.argv[1] if len(sys.argv) > 1 else f"{SK}/campos/feniz-claro-flare.jpg"
SALIDA = sys.argv[2] if len(sys.argv) > 2 else f"{SP}/puesto.jpg"
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
A = f"{SK}/capturas-clientes/feniz/assets"


def graduar(arr, techo=243.0, piso=7.0, calido=(1.000, 0.995, 0.986), caida=0.055):
    """Exposición de pantalla, no redibujo: ni blanco papel ni negro absoluto."""
    a = piso + arr.astype(np.float32) * (techo / 255.0)
    a *= np.asarray(calido, np.float32)[None, None, :]
    gx = np.mgrid[0 : a.shape[0], 0 : a.shape[1]][1].astype(np.float32)
    return a * (1.0 - caida * (gx / a.shape[1]) ** 1.6)[..., None]


# ── 0 · las dos pantallas, limpias de datos personales ───────────────────────
os.makedirs(f"{SP}/ui", exist_ok=True)
_d = np.asarray(Image.open(f"{A}/tr-panel-full.png").convert("RGB")).copy()
_d[0:128, 2500:2880] = (19, 27, 47)                 # fuera el nombre de persona
PANT_D = f"{SP}/ui/panel-puesto.png"
Image.fromarray(np.clip(graduar(_d[0:1620, 0:2880]), 0, 255).astype(np.uint8)).save(PANT_D)

_m = np.asarray(Image.open(f"{A}/" + os.environ.get("FZ_FCAP", "trm-cuentas.png")).convert("RGB")).copy()
_mh = round(1170 * 19.5 / 9)                        # 2535 — el aspecto del móvil
_m = _m[0:_mh, 0:1170] if _m.shape[0] >= _mh else np.pad(_m, ((0, _mh - _m.shape[0]), (0, 0), (0, 0)), mode="edge")
PANT_M = f"{SP}/ui/movil-puesto.png"
Image.fromarray(np.clip(graduar(_m, caida=0.03), 0, 255).astype(np.uint8)).save(PANT_M)

# ── 1 · el campo ─────────────────────────────────────────────────────────────
_c = Image.open(CAMPO).convert("RGB")
cw, ch = _c.size
if cw / ch > W / H:
    nw = int(ch * W / H); _c = _c.crop(((cw - nw) // 2, 0, (cw - nw) // 2 + nw, ch))
else:
    nh = int(cw * H / W); _c = _c.crop((0, (ch - nh) // 2, cw, (ch - nh) // 2 + nh))
campo = np.asarray(Image.fromarray(np.asarray(_c.resize((W, H), Image.LANCZOS)))
                   .filter(ImageFilter.GaussianBlur(3.4)), np.float32)

# ── 2 · la mesa, más presente que en «La mesa»: aquí hay profundidad ─────────
YH = 1636.0
t = np.clip((yy - YH) / float(H - YH), 0, 1)
en_mesa = np.clip((yy - YH) / 30.0, 0, 1)[..., None]
mesa = campo * (0.945 - 0.115 * t[..., None])
mesa += (t[..., None] ** 1.1) * np.asarray([9.0, 3.0, -7.0], np.float32)[None, None, :]
rng = np.random.default_rng(31)
v = rng.normal(0, 1, (H // 8, max(8, W // 80))).astype(np.float32)
v = np.asarray(Image.fromarray(((v - v.min()) / (np.ptp(v) + 1e-6) * 255).astype(np.uint8))
               .resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(2.4)), np.float32)
mesa += ((v - 128.0) * 0.034)[..., None]
lienzo = np.clip(campo * (1 - en_mesa) + mesa * en_mesa, 0, 255)
base = Image.fromarray(lienzo.astype(np.uint8)).convert("RGBA")


def colocar(disp, alto, cx, top, escorzo, grados):
    """Lleva un aparato al lienzo: escala por ALTO, escorza el canto derecho y gira."""
    DW, DH = disp.size
    e = alto / DH
    dw, dh = DW * e, DH * e
    x0, y0 = cx - dw / 2, top
    q = [(x0, y0), (x0 + dw, y0 + dh * (1 - escorzo) / 2),
         (x0 + dw, y0 + dh * (1 + escorzo) / 2), (x0, y0 + dh)]
    th = math.radians(grados); cxr, cyr = cx, top + dh / 2
    q = [(cxr + (x - cxr) * math.cos(th) - (y - cyr) * math.sin(th),
          cyr + (x - cxr) * math.sin(th) + (y - cyr) * math.cos(th)) for (x, y) in q]
    return cc.deformar(disp, q, (W, H)), e


# ── 3 · el monitor, girado: lo vemos desde la izquierda ──────────────────────
mon_d, g_d = cc.montar_dispositivo(f"{SK}/marcos/monitor-2400-grafito", PANT_D, (0, 0, 2880, 1620))
MON, e_mon = colocar(mon_d, float(os.environ.get("FZ_MA", "1480")),
                     float(os.environ.get("FZ_MX", "1120")), float(os.environ.get("FZ_MY", "215")),
                     float(os.environ.get("FZ_ME", "0.930")), float(os.environ.get("FZ_MT", "-2.2")))
a_mon = MON.split()[3]

# ── 4 · el móvil, de pie delante y a la derecha ──────────────────────────────
mov_d, g_m = cc.montar_dispositivo(f"{SK}/marcos/movil-v-620-negro", PANT_M, (0, 0, 1170, _mh))
MOV, e_mov = colocar(mov_d, float(os.environ.get("FZ_FA", "880")),
                     float(os.environ.get("FZ_FX", "2126")), float(os.environ.get("FZ_FY", "1170")),
                     float(os.environ.get("FZ_FE", "0.965")), float(os.environ.get("FZ_FT", "3.6")))
a_mov = MOV.split()[3]

for nombre, al in (("monitor", a_mon), ("móvil", a_mov)):
    ys, xs = np.where(np.asarray(al) > 8)
    print(f"  {nombre}: x {xs.min()}–{xs.max()}  y {ys.min()}–{ys.max()}")

# ── 5 · sombras y reflejos, por orden de profundidad ─────────────────────────
def pie_de(alfa, margen=110):
    ys = np.where(np.asarray(alfa) > 8)[0]
    pa = np.asarray(alfa, np.float32).copy(); pa[: int(ys.max()) - margen] = 0
    return Image.fromarray(pa.astype(np.uint8)), int(ys.max())


def reflejo(capa, y_pie, aplast, opac, desenf):
    src = np.asarray(capa, np.float32)
    rr = np.zeros((H, W, 4), np.float32)
    for k in range(min(H - y_pie, int(y_pie * aplast))):
        sy = y_pie - int(k / aplast)
        if sy < 0: break
        rr[y_pie + k] = src[sy]
    rr = np.asarray(Image.fromarray(np.clip(rr, 0, 255).astype(np.uint8))
                    .filter(ImageFilter.GaussianBlur(desenf)), np.float32)
    f = (np.clip(1.0 - (yy - y_pie) / 230.0, 0, 1) ** 2.3) * (yy >= y_pie)
    rr[..., 3] *= f * opac
    return Image.fromarray(np.clip(rr, 0, 255).astype(np.uint8))


pie_mon, Y_MON = pie_de(a_mon)
pie_mov, Y_MOV = pie_de(a_mov, 60)

base = Image.alpha_composite(base, reflejo(MON, Y_MON, 0.26, 0.19, 19.0))
base = Image.alpha_composite(base, cc.sombra(pie_mon, 17.0, 0.44, (0, 8), (W, H), (58, 50, 66)))
base = Image.alpha_composite(base, cc.sombra(pie_mon, 92.0, 0.25, (36, 26), (W, H), (74, 66, 86)))
base = Image.alpha_composite(base, cc.sombra(a_mon, 240.0, 0.12, (92, 46), (W, H), (96, 88, 112)))
base = Image.alpha_composite(base, MON)

base = Image.alpha_composite(base, reflejo(MOV, Y_MOV, 0.30, 0.24, 11.0))
base = Image.alpha_composite(base, cc.sombra(pie_mov, 7.0, 0.66, (0, 4), (W, H), (48, 41, 56)))
base = Image.alpha_composite(base, cc.sombra(pie_mov, 34.0, 0.38, (14, 12), (W, H), (66, 58, 78)))
base = Image.alpha_composite(base, cc.sombra(a_mov, 72.0, 0.26, (30, 20), (W, H), (78, 70, 92)))
base = Image.alpha_composite(base, MOV)

b = np.asarray(base.convert("RGB"), np.float32) / 255.0

# ── 6 · las pantallas devuelven algo de luz; es de día, muy poco ─────────────
for alfa, disp, geo, e in ((a_mon, mon_d, g_d, e_mon), (a_mov, mov_d, g_m, e_mov)):
    b = cc.suma_luz(b, cc.resplandor(alfa, (255, 247, 234), 150.0, 0.045, (0, 0), (W, H)) / 255.0)

# ── 7 · luz de borde ─────────────────────────────────────────────────────────
b = cc.suma_luz(b, cc.luz_de_borde(a_mon, (W, H), (0, 0), "izq", 7, (236, 226, 252), 0.40))
b = cc.suma_luz(b, cc.luz_de_borde(a_mon, (W, H), (0, 0), "arriba", 6, (252, 244, 232), 0.28))
b = cc.suma_luz(b, cc.luz_de_borde(a_mov, (W, H), (0, 0), "izq", 5, (238, 228, 252), 0.44))

# ── 8 · la marca: el fichero real de tinta, en el aire limpio ────────────────
_lg = Image.open(f"{A}/feniz-logo-tinta.png").convert("RGBA")
_LW = int(os.environ.get("FZ_LW", "430"))
_lg = _lg.resize((_LW, round(_LW * _lg.size[1] / _lg.size[0])), Image.LANCZOS)
_LX, _LY = int(os.environ.get("FZ_LX", "330")), int(os.environ.get("FZ_LY", "1900"))
_cap = Image.new("RGBA", (W, H), (0, 0, 0, 0)); _cap.paste(_lg, (_LX, _LY))
_la = np.asarray(_cap, np.float32) / 255.0
b = np.clip(b, 0, 1) * (1 - _la[..., 3:4]) + _la[..., :3] * _la[..., 3:4]
print(f"  marca: x {_LX}–{_LX+_LW}  y {_LY}–{_LY+_lg.size[1]}")

# ── 9 · grado y grano comunes ────────────────────────────────────────────────
a = cc.rematar(np.clip(b, 0, 1) * 255.0, sigma_grano=4.4, vineta=0.11, semilla=17,
               negro=0.0, blanco=253.0, gamma=1.00)
Image.fromarray(a.astype(np.uint8)).save(SALIDA, quality=95, subsampling=0)
cc.medir(SALIDA)

alto_p = g_d["pantalla"]["h"] * e_mon * float(os.environ.get("FZ_ME", "0.930"))
print(f"  pantalla del monitor en el cuadro: {g_d['pantalla']['w']*e_mon:.0f}×{alto_p:.0f}")
print(f"  tarjeta de KPI servida a 421 px: {(247.0/1620.0)*alto_p*(421.0/W):.1f} px (umbral 12)")
Image.open(SALIDA).resize((1280, 960)).save(SALIDA.replace(".jpg", "-prev.jpg"), quality=92)
