#!/usr/bin/env python3
"""Mide la monotonía de una galería: el defecto que vive ENTRE las piezas.

La hoja de contacto (§4 bis) exige mirar. Esto no la sustituye, pero la respalda
con números y funciona aunque no se puedan leer imágenes: detecta el recurso que
VitalChain repetía catorce veces —«sujeto flotando sobre campo liso»— midiendo
cuántas piezas tienen el marco PLANO y cuántas de esas comparten color de campo.

OJO con lo que NO mide: clasificar solo el marco da falsos positivos en galerías
de composiciones a sangre (ANJ Sports marcaba 100 % «tinta» siendo la más variada
que tenemos, porque sus bordes son oscuros y sus interiores magenta, blancos y
verdes). Por eso se mide también el INTERIOR. Y aun así esto no sustituye a mirar
la hoja de contacto: la respalda.

    python3 scripts/monotonia.py public/images/proyects/<slug>
"""
import sys, os, glob
from PIL import Image
import numpy as np

def campo(p):
    """Color y planitud del marco exterior, y firma de color del interior."""
    im = Image.open(p).convert("RGB")
    a = np.asarray(im).astype(float)
    h, w, _ = a.shape
    b = max(6, int(min(h, w) * 0.04))
    borde = np.concatenate([
        a[:b, :, :].reshape(-1, 3), a[-b:, :, :].reshape(-1, 3),
        a[:, :b, :].reshape(-1, 3), a[:, -b:, :].reshape(-1, 3)])
    med = borde.mean(axis=0)
    plano = float(borde.std(axis=0).mean())          # < 12 ≈ campo liso
    lum = 0.2126 * med[0] + 0.7152 * med[1] + 0.0722 * med[2]
    # firma del interior: rejilla 4x4 de color medio (48 números)
    dentro = a[int(h*.12):int(h*.88), int(w*.12):int(w*.88), :]
    gh, gw = dentro.shape[0] // 4, dentro.shape[1] // 4
    firma = np.array([dentro[y*gh:(y+1)*gh, x*gw:(x+1)*gw, :].mean(axis=(0, 1))
                      for y in range(4) for x in range(4)]).ravel()
    return med, lum, plano, firma


def main(carp):
    ps = [p for p in sorted(glob.glob(os.path.join(carp, "*.jpg")))
          if "-movil" not in p and not p.endswith(("-en.jpg", "-pt.jpg"))]
    if not ps:
        print("sin piezas"); return
    d = []
    for p in ps:
        med, lum, plano, firma = campo(p)
        n = os.path.basename(p)[:-4]
        d.append((n, med, lum, plano, firma))
        print(f"  {n:24s} lum={lum:6.1f} marco={'LISO ' if plano < 12 else 'vivo '}"
              f"(std {plano:5.1f})")

    lisos = [x for x in d if x[3] < 12]
    print()
    print(f"  piezas con marco liso: {len(lisos)}/{len(d)} (dato, no veredicto:"
          f" una composición a sangre oscura también da marco liso)")

    # variedad real: distancia media entre firmas de interior
    print()
    ds = [float(np.linalg.norm(d[i][4] - d[j][4])) / len(d[i][4]) ** .5
          for i in range(len(d)) for j in range(i + 1, len(d))]
    ds.sort()
    print(f"  distancia de interior — mínima {ds[0]:.1f} · mediana {ds[len(ds)//2]:.1f}")
    if ds[0] < 12:
        print("  ⚠ hay al menos un par de piezas casi idénticas por dentro")
    if ds[len(ds)//2] < 60:
        print("  ⚠ MONOTONÍA: mediana de interior baja; la galería repite molde.")
    print("  referencia medida: anjsports 130,6 · feniz 157,7 · aurore 82,6 (las tres variadas)")


if __name__ == "__main__":
    if len(sys.argv) != 2: print(__doc__); sys.exit(1)
    main(sys.argv[1])
