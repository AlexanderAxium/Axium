#!/usr/bin/env python3
"""Genera (o edita con máscara) una escena con la API de imágenes de OpenAI y
APUNTA EL GASTO en un registro, porque la clave no puede leer el consumo.

QUÉ HACE
  · generations: una escena desde un prompt, a la medida exacta que se pida
    (múltiplos de 16, hasta 3840 por lado), con `n` variantes en una sola
    llamada — cuesta lo mismo que n llamadas sueltas y obliga a elegir mirando.
  · edits: lo mismo, pero partiendo de una imagen nuestra (y opcionalmente una
    máscara cuyo alfa 0 marca lo que el modelo PUEDE repintar). Con máscara, el
    prompt describe la imagen ENTERA resultante, no solo la zona que se edita.

ENTRA
  --modelo     gpt-image-2.5-flare (escenas y campos) o gpt-image-2.5-sunburst
               (edición precisa con máscara). Ver IMAGENES.md.
  --prompt     archivo de texto con el prompt
  --tam        WxH, p. ej. 3072x2048
  --n          variantes (1 por defecto)
  --salida     ruta base: salida.png → salida-1.png, salida-2.png… si n > 1
  --imagen / --mascara   solo para edits
  --motivo     una línea: para qué es (va al registro)
  --calidad    high (por defecto) · medium · low
  --fondo      auto (por defecto) · transparent · opaque — transparent para recortes de
               objeto (sale PNG con alfa)

SALE
  Los PNG, y una línea por llamada en `scripts/gastos-openai.jsonl` con fecha,
  modelo, tamaño, n, tokens de entrada/salida y archivos. El saldo NO se calcula
  restando: se mira en el panel. Esto es solo el conteo.

USO
  set -a; . ~/Documents/AXIUM-TI/credenciales.env; set +a
  python3 openai-imagen.py --modelo gpt-image-2.5-flare --prompt hero.txt \
     --tam 3072x2048 --n 2 --salida taller/hero.png --motivo "Rematch · héroe"

OJO
  · La clave sale del entorno y NO se imprime nunca.
  · La interfaz jamás se genera: el modelo pone materia, luz y espacio, y la
    pantalla va APAGADA (negra) para componer encima la captura real.
"""
import argparse
import base64
import datetime as dt
import json
import mimetypes
import os
import sys
import time
import urllib.error
import urllib.request
import uuid

AQUI = os.path.dirname(os.path.abspath(__file__))
REGISTRO = os.path.join(AQUI, "gastos-openai.jsonl")


def multipart(campos, archivos):
    limite = uuid.uuid4().hex
    partes = []
    for k, v in campos.items():
        partes.append(
            f'--{limite}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode()
        )
    for k, ruta in archivos:
        tipo = mimetypes.guess_type(ruta)[0] or "application/octet-stream"
        nombre = os.path.basename(ruta)
        partes.append(
            f'--{limite}\r\nContent-Disposition: form-data; name="{k}"; filename="{nombre}"\r\n'
            f"Content-Type: {tipo}\r\n\r\n".encode()
            + open(ruta, "rb").read()
            + b"\r\n"
        )
    partes.append(f"--{limite}--\r\n".encode())
    return b"".join(partes), f"multipart/form-data; boundary={limite}"


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--modelo", default="gpt-image-2.5-flare")
    p.add_argument("--prompt", required=True)
    # Sin --tam: 3072×2048 al generar; al EDITAR, el tamaño de la propia imagen. Una edición a
    # 3072×2048 de una escena 2:1 o 1:1 sale REENCUADRADA (Aurore, 2026-10-07: diferencia media
    # 30–45 fuera de la máscara, contra 4–9 a su tamaño) y la clave magenta no casa con nada.
    p.add_argument("--tam", default=None)
    p.add_argument("--n", type=int, default=1)
    p.add_argument("--salida", required=True)
    p.add_argument("--imagen")
    p.add_argument("--mascara")
    p.add_argument("--motivo", default="")
    p.add_argument("--calidad", default="high")
    p.add_argument("--fondo", default="auto", choices=["auto", "transparent", "opaque"])
    a = p.parse_args()

    clave = os.environ.get("OPENAI_API_KEY")
    if not clave:
        sys.exit("falta OPENAI_API_KEY: set -a; . ~/Documents/AXIUM-TI/credenciales.env; set +a")
    prompt = open(a.prompt).read().strip()
    if not a.tam:
        if a.imagen:
            from PIL import Image as _I
            w, h = _I.open(a.imagen).size
            a.tam = f"{w}x{h}"
        else:
            a.tam = "3072x2048"

    if a.imagen:
        url = "https://api.openai.com/v1/images/edits"
        campos = {
            "model": a.modelo,
            "prompt": prompt,
            "size": a.tam,
            "n": str(a.n),
            "quality": a.calidad,
            "output_format": "png",
        }
        archivos = [("image", a.imagen)]
        if a.mascara:
            archivos.append(("mask", a.mascara))
        cuerpo, tipo = multipart(campos, archivos)
    else:
        url = "https://api.openai.com/v1/images/generations"
        cuerpo = json.dumps(
            {
                "model": a.modelo,
                "prompt": prompt,
                "size": a.tam,
                "n": a.n,
                "quality": a.calidad,
                "output_format": "png",
                **({"background": a.fondo} if a.fondo != "auto" else {}),
            }
        ).encode()
        tipo = "application/json"

    req = urllib.request.Request(
        url, data=cuerpo, headers={"Authorization": f"Bearer {clave}", "Content-Type": tipo}
    )
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=600) as r:
            d = json.load(r)
    except urllib.error.HTTPError as e:
        print("ERROR", e.code, e.read().decode()[:600])
        sys.exit(1)
    seg = round(time.time() - t0, 1)

    base, ext = os.path.splitext(a.salida)
    os.makedirs(os.path.dirname(os.path.abspath(a.salida)), exist_ok=True)
    salidas = []
    for i, item in enumerate(d["data"], 1):
        ruta = a.salida if len(d["data"]) == 1 else f"{base}-{i}{ext}"
        open(ruta, "wb").write(base64.b64decode(item["b64_json"]))
        salidas.append(ruta)

    uso = d.get("usage") or {}
    linea = {
        "fecha": dt.datetime.now().isoformat(timespec="seconds"),
        "endpoint": "edits" if a.imagen else "generations",
        "modelo": a.modelo,
        "tam": a.tam,
        "calidad": a.calidad,
        "n": len(salidas),
        "tokens_entrada": uso.get("input_tokens"),
        "tokens_salida": uso.get("output_tokens"),
        "tokens_total": uso.get("total_tokens"),
        "segundos": seg,
        "motivo": a.motivo,
        "archivos": salidas,
    }
    with open(REGISTRO, "a") as f:
        f.write(json.dumps(linea, ensure_ascii=False) + "\n")
    for s in salidas:
        print(f"✓ {s}  {os.path.getsize(s)//1024} KB")
    print(f"  {a.modelo} {a.tam} n={len(salidas)} · {seg}s · tokens {uso}")


if __name__ == "__main__":
    main()
