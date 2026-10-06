"""Recorte con modelo de matting (rembg / isnet). Sustituye a las heurísticas
de umbral+morfología, que fallaban siempre en los cuerpos BLANCOS sobre fondo
blanco con sombra horneada."""
import sys, os, numpy as np
from PIL import Image
from rembg import remove, new_session
ses = new_session("isnet-general-use")
for src in sys.argv[2:]:
    im = Image.open(src).convert("RGB")
    out = remove(im, session=ses, alpha_matting=True,
                 alpha_matting_foreground_threshold=250,
                 alpha_matting_background_threshold=15,
                 alpha_matting_erode_size=4)
    a = np.asarray(out).astype(float); al = a[...,3]/255
    ys, xs = np.where(al > 0.04)
    if len(xs): out = out.crop((xs.min(), ys.min(), xs.max()+1, ys.max()+1))
    dst = os.path.join(sys.argv[1], os.path.splitext(os.path.basename(src))[0] + ".png")
    out.save(dst)
    b = np.asarray(out).astype(float); bl = b[...,3]/255; op = bl > .5
    rgb = b[...,:3]; L = .2126*rgb[...,0]+.7152*rgb[...,1]+.0722*rgb[...,2]
    sat = rgb.max(axis=-1)-rgb.min(axis=-1)
    gris = op & (L>150) & (L<235) & (sat<22)
    print(f"  {os.path.basename(src):36s} {out.size}  gris residual {gris.sum()*100/max(1,op.sum()):4.1f}%")
