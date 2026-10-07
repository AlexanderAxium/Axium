#!/usr/bin/env python3
"""Vendiq — cuatro propuestas para el gráfico derecho de la portada (2026-10-06).

Alexander: «la portada de vendiq me gusta su estilo, pero quiero probar otras portadas,
específicamente el gráfico derecho. ¿qué propuestas me podrías hacer? unas 4. revisa
referencias y también referencias de los portafolios de las referencias».

Se mantiene lo que funciona (el grafito con la rejilla técnica de vendiq.pe, el logotipo arriba
a la izquierda, la luz azul abajo a la derecha) y cambia SOLO el gráfico. Cada uno sale de un
gesto visto en los índices de los estudios de referencia, y usa piezas REALES de vendiq.pe
(piezas-portada-vendiq.cjs) o de las tiendas (mockups-tiendas-vendiq.py). Nada generado.

  A · Un solo componente (Paisanos · Pedidos Ya): los cuatro avisos del pedido #1482, en fila,
      unidos por el conector punteado cian de la línea técnica.
  B · La V hecha luz (Paisanos · MODO; la firma de DESIGN.md § 2): las cintas del logotipo con
      su brillo, y el teléfono de la tienda delante.
  C · Bento de módulos (Significa · Bion, Vertbase): seis interfaces de módulo en losas,
      inclinadas en isométrico.
  D · Las tiendas (Paisanos · Claro Pay; Significa · Passaporte): seis celulares en abanico con
      las tiendas de los clientes.

  python3 portada-vendiq-propuestas.py <dir-piezas> <dir-salida>
Salen <letra>-43.jpg (2400×1800, /portafolio) y <letra>-1610.jpg (2400×1500, home).
"""
import os
import subprocess
import sys

from PIL import Image

PZ, OUT = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
os.makedirs(OUT, exist_ok=True)
AQUI = os.path.dirname(os.path.abspath(__file__))
LOGO = "/Users/alexander/Documents/AXIUM-WEB/public/images/highlights/logos/vendiq-v2.png"
V_BRILLO = "/Users/alexander/Documents/SAAS/Vendiq/public/brand/vendiq/vendiq-v-brillo.svg"
F = lambda n: f"file://{PZ}/{n}"  # noqa: E731


def base(W, H, cuerpo, luz=True):
    u = H / 100
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{width:{W}px;height:{H}px;overflow:hidden;background:#0B0D12;position:relative}}
.rejilla{{position:absolute;inset:0;background-image:radial-gradient(circle at 0 0,rgba(143,180,255,.42) {2*u/10:.1f}px,transparent {2.8*u/10:.1f}px),linear-gradient(to right,rgba(255,255,255,.055) 1.5px,transparent 1.5px),linear-gradient(to bottom,rgba(255,255,255,.055) 1.5px,transparent 1.5px);background-size:{6*u:.0f}px {6*u:.0f}px;-webkit-mask-image:radial-gradient(80% 75% at 64% 50%,#000 30%,transparent 88%)}}
.luz{{position:absolute;right:-12%;bottom:-30%;width:72%;height:85%;background:radial-gradient(closest-side,rgba(31,91,255,.42),transparent);filter:blur({4*u:.0f}px)}}
.logo{{position:absolute;left:{7*u:.0f}px;top:{8*u:.0f}px;height:{7.4*u:.0f}px}}
.g{{position:absolute;inset:0}}
img{{display:block}}
</style></head><body>
<div class="rejilla"></div>{'<div class="luz"></div>' if luz else ''}
<img class="logo" src="file://{LOGO}">
<div class="g">{cuerpo(W, H, u)}</div>
</body></html>"""


def A(W, H, u):
    # cuatro avisos en el orden del pedido, unidos por el conector punteado cian (línea técnica),
    # en el plano inclinado de la portada de vendiq.pe
    avisos = [("aviso-venta.png", 996), ("aviso-stock.png", 948), ("aviso-boleta.png", 1168), ("aviso-envio.png", 1200)]
    alto = 12.6 * u
    paso = 17.5 * u
    dx = 3.8 * u
    ancho_max = 1200 * alto / 236
    gw = 3 * dx + ancho_max + 4 * u
    gh = 3 * paso + alto
    x0 = W - 8 * u - gw + 4 * u
    y0 = (H - gh) / 2 + 2 * u
    filas, puntos = "", []
    for i, (n, w) in enumerate(avisos):
        x = x0 + i * dx
        y = y0 + i * paso
        filas += (f"<img src='{F(n)}' style='position:absolute;left:{x:.0f}px;top:{y:.0f}px;height:{alto:.0f}px;"
                  f"filter:drop-shadow(0 {1.6*u:.0f}px {3*u:.0f}px rgba(0,0,0,.55))'>")
        puntos.append((x - 3.4 * u, y + alto / 2))
    linea = " ".join(f"{px:.0f},{py:.0f}" for px, py in puntos)
    svg = (f"<svg width='{W}' height='{H}' style='position:absolute;left:0;top:0;overflow:visible'>"
           f"<polyline points='{linea}' fill='none' stroke='rgba(20,173,253,.8)' stroke-width='{0.24*u:.1f}' stroke-dasharray='{0.9*u:.1f} {0.7*u:.1f}'/>"
           + "".join(f"<line x1='{px:.0f}' y1='{py:.0f}' x2='{px + 3.4*u:.0f}' y2='{py:.0f}' stroke='rgba(20,173,253,.8)' stroke-width='{0.24*u:.1f}' stroke-dasharray='{0.9*u:.1f} {0.7*u:.1f}'/>"
                     f"<circle cx='{px:.0f}' cy='{py:.0f}' r='{0.62*u:.1f}' fill='#14ADFD' style='filter:drop-shadow(0 0 {1.2*u:.0f}px #14ADFD)'/>" for px, py in puntos)
           + "</svg>")
    brillo = (f"<div style='position:absolute;left:{x0:.0f}px;top:{y0:.0f}px;width:{gw:.0f}px;height:{gh:.0f}px;"
              f"background:radial-gradient(closest-side,rgba(20,173,253,.15),transparent);filter:blur({3*u:.0f}px)'></div>")
    return f"<div style='position:absolute;inset:0;transform:perspective({260*u:.0f}px) rotateX(6deg) rotateY(-12deg);transform-origin:72% 50%'>{brillo}{svg}{filas}</div>"


def B(W, H, u):
    v_alto = 118 * u
    v_ancho = v_alto * 1507 / 1189
    vx = W - v_ancho * 0.80
    vy = -14 * u
    tel_alto = 70 * u
    tel_ancho = tel_alto * 756 / 1580
    tx = W - v_ancho * 0.80 + v_ancho * 0.47 - tel_ancho / 2
    ty = (H - tel_alto) / 2 + 3 * u
    aviso_alto = 8.4 * u
    return (f"<img src='file://{V_BRILLO}' style='position:absolute;left:{vx:.0f}px;top:{vy:.0f}px;height:{v_alto:.0f}px;opacity:.95'>"
            f"<img src='{F('flujo-telefono.png')}' style='position:absolute;left:{tx:.0f}px;top:{ty:.0f}px;height:{tel_alto:.0f}px;"
            f"transform:rotate(-7deg);filter:drop-shadow(0 {3*u:.0f}px {5*u:.0f}px rgba(0,0,20,.6))'>"
            f"<img src='{F('aviso-venta.png')}' style='position:absolute;left:{tx - 38*u:.0f}px;top:{ty + 24*u:.0f}px;height:{aviso_alto:.0f}px;"
            f"filter:drop-shadow(0 {1.4*u:.0f}px {2.6*u:.0f}px rgba(0,0,0,.6))'>")


def C(W, H, u):
    lw = 31 * u
    lh = lw * 704 / 1008
    gap = 2.2 * u
    losas = ""
    for i in range(6):
        c, f = i % 3, i // 3
        losas += (f"<img src='{F(f'modulo-ui-{i+1}.png')}' style='position:absolute;left:{c*(lw+gap):.0f}px;top:{f*(lh+gap):.0f}px;width:{lw:.0f}px;"
                  f"border:1.5px solid rgba(255,255,255,.10);border-radius:{0.6*u:.0f}px;box-shadow:0 {2.4*u:.0f}px {5*u:.0f}px rgba(0,0,0,.55)'>")
    gw, gh = 3 * lw + 2 * gap, 2 * lh + gap
    cx, cy = W - 58 * u, H * 0.55  # el bento girado mide ~108u: entra entero en 4:3 y en 16:10
    return (f"<div style='position:absolute;left:{cx - gw/2:.0f}px;top:{cy - gh/2:.0f}px;width:{gw:.0f}px;height:{gh:.0f}px;"
            f"transform:perspective({300*u:.0f}px) rotateX(36deg) rotateZ(-22deg)'>{losas}</div>")


def D(W, H, u):
    orden = ["daesur-motors", "anj-sports", "aurore", "sportt", "clefast", "happy-art"]
    giros = [-27, -16, -5.5, 5.5, 16, 27]
    alto = 58 * u
    ancho = alto * 905 / 1862
    cx = W - 56 * u
    top = (H - alto) / 2 - 3 * u
    tels = ""
    for i, (s, g) in enumerate(zip(orden, giros)):
        tels += (f"<img src='{F(f'telefono-{s}.png')}' style='position:absolute;left:{cx - ancho/2:.0f}px;top:{top:.0f}px;height:{alto:.0f}px;"
                 f"transform-origin:50% 135%;transform:rotate({g}deg);z-index:{i};"
                 f"filter:drop-shadow(0 {2.2*u:.0f}px {4*u:.0f}px rgba(0,0,0,.6))'>")
    return tels


for letra, f in [("a", A), ("b", B), ("c", C), ("d", D)]:
    for tag, W, H in [("43", 2400, 1800), ("1610", 2400, 1500)]:
        html = os.path.join(OUT, f"{letra}-{tag}.html")
        png = os.path.join(OUT, f"{letra}-{tag}.png")
        open(html, "w").write(base(W, H, f))
        subprocess.run(["node", os.path.join(AQUI, "render-html.cjs"), html, png, str(W), str(H), "1"], check=True,
                       stdout=subprocess.DEVNULL)
        jpg = png[:-4] + ".jpg"
        Image.open(png).convert("RGB").save(jpg, quality=90, optimize=True, progressive=True, subsampling=0)
        os.remove(png)
        print("✓", os.path.basename(jpg))
