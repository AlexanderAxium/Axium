#!/usr/bin/env python3
"""Láminas de MARCA y SISTEMA para las fichas de los productos propios (2026-10-06).

⚠️ SUPERADO EN PARTE (Alexander, 2026-10-06: «no inventes taaanto… ¿qué representan esos 3
puntos?»). L3 (anatomía con callouts), L7 (anatomía del vidrio) y L8 (vocabulario) NO se usan:
eran forma de Kavak sin dato detrás. Si la marca tiene manual, el capítulo sale del manual
(`manual-rematch.py`); si no, solo L1/L4/L5 con lo que diga el código. Ver ESTANDAR-FICHA.md,
«La marca sale del manual, o casi no sale».

Alexander: «recuerda que rematch, lumio, vendiq y bookit son productos propios, se les hizo
todo, branding, logo, paleta de colores, diseño web, etc.». Las láminas siguen tres
referencias (ver referencias/): Significa Dia (capítulo de marca), Paisanos Kavak (láminas de
sistema CON especificación: tokens, escala con medidas, anatomía con callouts, vocabulario del
producto como tipografía) y el par tipografía+paleta de la ficha de Vendiq que Alexander marcó
como bueno.

Todo sale del repo del producto: logotipos reales, tokens de globals.css, tipografías servidas
por el propio sitio e íconos renderizados desde su código. NADA se genera. Las láminas no
llevan palabras que haya que traducir (hex, px, nombres de fuente, números): lo que se explica
va en el HTML de la ficha, en los tres idiomas.

  python3 laminas-marca.py <producto.json> <dir-salida>

El JSON describe la marca (ver capturas-saas/<slug>/pixelmatters-2026-10/marca/producto.json).
Se renderiza con render-html.cjs (Playwright) a deviceScaleFactor 2.
"""
import html
import json
import os
import subprocess
import sys

P = json.load(open(sys.argv[1]))
OUT = sys.argv[2]
os.makedirs(OUT, exist_ok=True)
AQUI = os.path.dirname(os.path.abspath(__file__))
PWCORE = os.environ.get("PWCORE", "")
PWEXE = os.environ.get("PWEXE", "")

F = P["fuentes"]  # {display:{familia, css}, texto:{familia, css}, mono:{familia, css}}
T = P["tokens"]  # {fondo, tinta, texto, acento, acento_oscuro, papel, linea, ...}


def base_css(fondo, rejilla=True, rejilla_color="rgba(255,255,255,.045)"):
    r = (
        f"background-image:linear-gradient({rejilla_color} 1px,transparent 1px),"
        f"linear-gradient(90deg,{rejilla_color} 1px,transparent 1px);background-size:56px 56px;"
        if rejilla
        else ""
    )
    return f"""<style>
{F['display']['css']}
{F['texto']['css']}
{F['mono']['css']}
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:100%;height:100%}}
body{{background:{fondo};{r}font-family:'{F['texto']['familia']}',sans-serif;color:#fff;overflow:hidden;position:relative}}
.mono{{font-family:'{F['mono']['familia']}',ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase}}
.disp{{font-family:'{F['display']['familia']}',sans-serif}}
</style>"""


def escribir(nombre, ancho, alto, cuerpo, fondo, **kw):
    ruta = os.path.join(OUT, f"{nombre}.html")
    open(ruta, "w").write(
        f"<!doctype html><html><head><meta charset='utf-8'>{base_css(fondo, **kw)}</head>"
        f"<body style='width:{ancho}px;height:{alto}px'>{cuerpo}</body></html>"
    )
    png = os.path.join(OUT, f"{nombre}.png")
    subprocess.run(
        ["node", os.path.join(AQUI, "render-html.cjs"), ruta, png, str(ancho), str(alto), "2"],
        check=True,
        env={**os.environ, "PWCORE": PWCORE, "PWEXE": PWEXE},
    )
    return png


def img(ruta, estilo):
    return f"<img src='file://{ruta}' style='{estilo}'>"


# ── L1 · El logotipo, enorme, con el ícono de fantasma (S7) ────────────────────────
L = P["logos"]
escribir(
    "marca-logo",
    1400,
    800,
    f"""
{img(L['icono_claro'], 'position:absolute;right:-120px;top:50%;transform:translateY(-50%);height:980px;opacity:.06')}
{img(L['principal_oscuro'], 'position:absolute;left:50%;top:50%;transform:translate(-50%,-52%);width:820px')}
<div class='mono' style='position:absolute;left:64px;bottom:56px;font-size:15px;color:rgba(255,255,255,.55)'>{html.escape(P['nombre'])} · {P['anio']}</div>
<div class='mono' style='position:absolute;right:64px;bottom:56px;font-size:15px;color:rgba(255,255,255,.55)'>{html.escape(P.get('dominio',''))}</div>
""",
    T["tinta"],
)

# ── L2 · El sistema del logotipo: versiones sobre sus fondos ───────────────────────
celdas = "".join(
    f"<div style='background:{c['fondo']};border-radius:28px;display:flex;align-items:center;justify-content:center;"
    f"border:1px solid rgba(255,255,255,.08);position:relative'>"
    f"{img(c['logo'], 'max-width:' + str(c.get('ancho', 70)) + '%;max-height:' + str(c.get('alto', 46)) + '%')}"
    f"<span class='mono' style='position:absolute;left:24px;bottom:20px;font-size:13px;color:{c.get('rotulo', 'rgba(255,255,255,.5)')}'>{c['fondo'].upper()}</span></div>"
    for c in P["sistema_logo"]
)
escribir(
    "marca-sistema-logo",
    800,
    800,
    f"<div style='position:absolute;inset:40px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr 1fr;gap:18px'>{celdas}</div>",
    T["tinta"],
)

# ── L3 · Anatomía del ícono, con callouts numerados (Kavak) ────────────────────────
A = P["anatomia_icono"]
puntos = "".join(
    f"<div style='position:absolute;left:{p['x']}px;top:{p['y']}px;width:{p.get('lx', 120)}px;height:2px;"
    f"background:{T['tinta']};transform-origin:0 50%;transform:rotate({p.get('ang', 0)}deg)'></div>"
    f"<div style='position:absolute;left:{p['x'] - 14}px;top:{p['y'] - 14}px;width:28px;height:28px;border-radius:50%;"
    f"background:{T['acento']};border:3px solid {T['tinta']}'></div>"
    f"<div class='mono' style='position:absolute;left:{p['nx']}px;top:{p['ny']}px;font-size:22px;font-weight:700;color:{T['tinta']}'>{p['n']}</div>"
    for p in A["puntos"]
)
escribir(
    "marca-anatomia-icono",
    800,
    800,
    f"""
<div style='position:absolute;inset:0;background-image:linear-gradient(rgba(0,29,48,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(0,29,48,.07) 1px,transparent 1px);background-size:40px 40px'></div>
{img(A['icono'], f"position:absolute;left:{A['x']}px;top:{A['y']}px;height:{A['alto']}px")}
{puntos}
<div class='mono' style='position:absolute;left:40px;top:36px;font-size:14px;color:{T['texto']}'>{html.escape(A.get('rotulo', ''))}</div>
""",
    T["papel"],
    rejilla=False,
)

# ── L4 · Tipografía con especificación (el par que Alexander marcó en Vendiq + Kavak) ──
esc = "".join(
    f"<div style='display:flex;align-items:baseline;gap:22px;padding:16px 0;border-top:1px solid rgba(255,255,255,.12)'>"
    f"<span class='{e.get('clase', 'disp')}' style='font-size:{e['muestra']}px;line-height:1;color:#fff;width:150px;"
    f"font-weight:{e.get('peso', 400)}'>{html.escape(e['texto'])}</span>"
    f"<span class='mono' style='font-size:13px;color:rgba(255,255,255,.6)'>{html.escape(e['spec'])}</span></div>"
    for e in P["escala"]
)
escribir(
    "marca-tipografia",
    800,
    800,
    f"""
<div class='mono' style='position:absolute;left:56px;top:52px;font-size:16px;color:rgba(255,255,255,.6)'>{html.escape(F['display']['familia'])} · {html.escape(F['texto']['familia'])}</div>
<div style='position:absolute;left:44px;top:96px;line-height:.82;white-space:nowrap'>
  <span class='disp' style='font-size:330px;color:#fff;letter-spacing:-.03em'>A</span><span style='font-family:{F['texto']['familia']};font-weight:700;font-size:330px;color:{T['acento']};letter-spacing:-.03em'>a</span>
</div>
<div style='position:absolute;left:56px;right:56px;bottom:44px'>{esc}</div>
""",
    T["tinta"],
)

# ── L5 · La paleta como hoja de tokens, con el contraste MEDIDO ────────────────────
fichas = "".join(
    f"<div style='grid-column:{c.get('col', 'auto')};grid-row:{c.get('fila', 'auto')};background:{c['hex']};border-radius:22px;"
    f"border:1px solid rgba(255,255,255,.1);position:relative;padding:22px'>"
    f"<div class='mono' style='position:absolute;left:22px;bottom:46px;font-size:20px;font-weight:700;letter-spacing:.04em;color:{c['tx']}'>{c['hex'].upper()}</div>"
    f"<div class='mono' style='position:absolute;left:22px;bottom:20px;font-size:12px;letter-spacing:.06em;color:{c['tx']};opacity:.72'>{html.escape(c['cr'])}</div></div>"
    for c in P["paleta"]
)
escribir(
    "marca-paleta",
    800,
    800,
    f"<div style='position:absolute;inset:44px;display:grid;grid-template-columns:1.15fr 1fr 1fr;grid-template-rows:1fr 1fr 1fr;gap:16px'>{fichas}</div>",
    T["fondo"],  # el fondo de la ficha, no la tinta: si no, la ficha de la tinta desaparece
)

# ── L6 · Iconografía: el set completo, sobre claro y sobre oscuro ──────────────────
I = json.load(open(P["iconos"]["archivo"]))
orden = P["iconos"]["orden"]


def tam(svg, px):
    return svg.replace("<svg", '<svg width="%d" height="%d"' % (px, px), 1)


def rejilla_iconos(tono_por_icono, fondo, cols=6):
    cel = "".join(
        f"<div style='display:flex;align-items:center;justify-content:center'><div style='width:84px;height:84px'>"
        f"{tam(I[n][tono_por_icono(n)], 84)}</div></div>"
        for n in orden
    )
    return f"<div style='background:{fondo};border-radius:28px;display:grid;grid-template-columns:repeat({cols},1fr);gap:26px 8px;padding:52px 36px;align-content:center'>{cel}</div>"


tono = P["iconos"]["tono"]
grupo = lambda n: tono.get(n, P["iconos"]["tono_defecto"])  # noqa: E731
escribir(
    "marca-iconos",
    1400,
    800,
    f"<div style='position:absolute;inset:40px;display:grid;grid-template-columns:1fr 1fr;gap:20px'>"
    f"{rejilla_iconos(grupo, T['papel'])}{rejilla_iconos(grupo, T['tinta_clara'])}</div>",
    T["fondo"],
    rejilla=False,
)

# ── L7 · Anatomía del vidrio: las tres capas, separadas en perspectiva ─────────────
C = json.load(open(P["capas"]["archivo"]))[P["capas"]["icono"]]
capa = lambda svg, z, op=1: (  # noqa: E731
    f"<div style='position:absolute;left:0;top:0;width:420px;height:420px;transform:translateZ({z}px);opacity:{op}'>"
    f"{tam(svg, 420)}</div>"
)
marco = (
    f"<div style='position:absolute;left:0;top:0;width:420px;height:420px;transform:translateZ({{z}}px);"
    f"border:2px dashed rgba(255,255,255,.22);border-radius:6px'></div>"
)
escribir(
    "marca-anatomia-vidrio",
    800,
    800,
    f"""
<div style='position:absolute;left:190px;top:230px;width:420px;height:420px;transform-style:preserve-3d;transform:perspective(2400px) rotateX(58deg) rotateZ(-38deg)'>
  {marco.replace('{z}', '0')}{capa(C['silueta'], 0)}
  {marco.replace('{z}', '170')}{capa(C['placa'], 170)}
  {marco.replace('{z}', '340')}{capa(C['glifo'], 340)}
</div>
<div class='mono' style='position:absolute;left:600px;top:452px;font-size:20px;font-weight:700;color:{T['acento']}'>01</div>
<div class='mono' style='position:absolute;left:600px;top:318px;font-size:20px;font-weight:700;color:{T['acento']}'>02</div>
<div class='mono' style='position:absolute;left:600px;top:184px;font-size:20px;font-weight:700;color:{T['acento']}'>03</div>
<div class='mono' style='position:absolute;left:56px;bottom:52px;font-size:14px;color:rgba(255,255,255,.55)'>48 × 48</div>
""",
    T["tinta"],
)

# ── L8 · El vocabulario del producto como tipografía (Kavak) ───────────────────────
V = P["vocabulario"]
lineas = "".join(
    "<div class='disp' style='font-size:%dpx;line-height:.98;letter-spacing:-.035em;white-space:nowrap;color:%s'>%s</div>"
    % (V["tam"], V["color"] if i != V.get("destacado") else V["color_destacado"], html.escape(w))
    for i, w in enumerate(V["palabras"])
)
escribir(
    "marca-vocabulario",
    800,
    800,
    f"<div style='position:absolute;left:52px;top:{V.get('top', 30)}px'>{lineas}</div>",
    V["fondo"],
    rejilla=False,
)
print("✓ láminas en", OUT)
