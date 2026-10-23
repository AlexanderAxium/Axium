#!/usr/bin/env python3
"""El reel de Axium (2026-10-21), al modo del showreel de riotters.com: cortes secos de ~1,5 s
entre piezas reales de los proyectos, claro y oscuro alternados, y el logo al final. Sin IA: todo
sale de los vídeos de las fichas y de las portadas que ya están en public/.

  python3 hacer-reel.py            → public/videos/reel-axium.mp4 (+ .jpg, el póster)

Alexander: «qué necesitarías para que puedas hacer un video así como este hero, mostrando mis
proyectos, no tan complejo pero sí decente».
"""
import os
import subprocess
import tempfile

from PIL import Image

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../.."))
PUB = os.path.join(RAIZ, "public")
SALIDA = os.path.join(PUB, "videos", "reel-axium.mp4")
W, H, FPS = 1920, 1080, 30

# (tipo, archivo, segundos, desde, ancla horizontal del recorte: 0 izquierda · 0.5 centro)
PLANOS = [
    ("video", "images/proyects/vendiq/vq-cielo.mp4", 2.0, 0.0, 0.5),
    ("foto", "images/proyects/anjsports/anj-portada-campo-v2.jpg", 1.4, 0, 0.5),
    ("video", "images/proyects/rematch/rm-movil-portada.mp4", 1.8, 1.5, 0.5),
    ("foto", "images/proyects/aurore/aurore-portada-estandar.jpg", 1.4, 0, 0.5),
    ("video", "images/proyects/bookit/bk-recorrido.mp4", 1.8, 1.0, 0.5),
    ("foto", "images/proyects/alyer/al-portada.jpg", 1.3, 0, 0.5),
    ("video", "images/proyects/lumiolearn/lu-experiencia.mp4", 1.8, 6.0, 0.0),
    ("foto", "images/proyects/feniz/fz-portada-estandar.jpg", 1.4, 0, 0.5),
    ("video", "images/proyects/vendiq/vq-como-v3.mp4", 1.8, 9.0, 0.5),
    ("foto", "images/proyects/maintech/mt-portada.jpg", 1.3, 0, 0.5),
    ("video", "images/proyects/rematch/rm-web.mp4", 1.6, 0.5, 0.5),
    ("foto", "images/proyects/clefast/cf-portada-lavanderia.jpg", 1.4, 0, 0.5),
]
CIERRE = 2.6
X264 = ["-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-an"]


def ff(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


def recorte(ancla):
    # cubrir 1920×1080 y recortar con el ancla horizontal pedida
    return (
        f"scale={W}:{H}:force_original_aspect_ratio=increase,"
        f"crop={W}:{H}:(iw-{W})*{ancla}:(ih-{H})/2,setsar=1,fps={FPS}"
    )


with tempfile.TemporaryDirectory() as tmp:
    piezas = []
    for i, (tipo, arch, seg, desde, ancla) in enumerate(PLANOS):
        src = os.path.join(PUB, arch)
        out = os.path.join(tmp, f"p{i:02d}.mp4")
        n = round(seg * FPS)
        if tipo == "video":
            ff("-ss", str(desde), "-t", str(seg), "-i", src, "-vf", recorte(ancla), "-frames:v", str(n), *X264, out)
        else:
            # la foto a 16:9 y al doble de tamaño, con un acercamiento lento del 5 %
            fz = (
                f"scale={W * 2}:{H * 2}:force_original_aspect_ratio=increase,crop={W * 2}:{H * 2},"
                f"zoompan=z='1+0.05*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s={W}x{H}:fps={FPS},setsar=1"
            )
            ff("-loop", "1", "-i", src, "-vf", fz, "-frames:v", str(n), *X264, out)
        piezas.append(out)

    # el cierre: el logo blanco sobre el navy de la marca, que aparece desde negro
    lam = Image.new("RGB", (W, H), (6, 12, 32))
    logo = Image.open(os.path.join(PUB, "logo3.png")).convert("RGBA")
    ancho = 620
    logo = logo.resize((ancho, round(logo.height * ancho / logo.width)), Image.LANCZOS)
    lam.paste(logo, ((W - logo.width) // 2, (H - logo.height) // 2), logo)
    png = os.path.join(tmp, "cierre.png")
    lam.save(png)
    out = os.path.join(tmp, "p99.mp4")
    ff("-loop", "1", "-i", png, "-vf", f"fps={FPS},fade=t=in:st=0:d=0.45,setsar=1", "-frames:v", str(round(CIERRE * FPS)), *X264, out)
    piezas.append(out)

    lista = os.path.join(tmp, "lista.txt")
    with open(lista, "w") as f:
        f.writelines(f"file '{p}'\n" for p in piezas)
    os.makedirs(os.path.dirname(SALIDA), exist_ok=True)
    ff("-f", "concat", "-safe", "0", "-i", lista, "-c:v", "libx264", "-preset", "slow", "-crf", "22",
       "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", SALIDA)
    ff("-i", SALIDA, "-frames:v", "1", "-q:v", "3", SALIDA.replace(".mp4", ".jpg"))

print("✓", SALIDA, os.path.getsize(SALIDA) // 1024, "KB")
