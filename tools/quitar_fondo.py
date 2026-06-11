"""Quita el fondo blanco/cuadriculado falso de las ilustraciones decorativas.

Hace un flood fill desde los bordes: todo pixel claro y sin color (el fondo
blanco o los cuadraditos grises del checkerboard) conectado al borde se vuelve
transparente. El interior del muñeco queda protegido por el contorno a lápiz.
"""

from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

DECOR_DIR = Path(__file__).resolve().parent.parent / "images" / "decor"

# Umbrales: el fondo es claro (blanco ~254 o gris ~239) y casi sin saturación
BRIGHT_MIN = 226
CHROMA_MAX = 14


def es_fondo(px):
    r, g, b = px[0], px[1], px[2]
    return min(r, g, b) >= BRIGHT_MIN and (max(r, g, b) - min(r, g, b)) <= CHROMA_MAX


def procesar(path: Path) -> None:
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    px = img.load()

    visitado = bytearray(w * h)
    cola = deque()

    for x in range(w):
        for y in (0, h - 1):
            if not visitado[y * w + x] and es_fondo(px[x, y]):
                visitado[y * w + x] = 1
                cola.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not visitado[y * w + x] and es_fondo(px[x, y]):
                visitado[y * w + x] = 1
                cola.append((x, y))

    while cola:
        x, y = cola.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not visitado[ny * w + nx]:
                if es_fondo(px[nx, ny]):
                    visitado[ny * w + nx] = 1
                    cola.append((nx, ny))

    for y in range(h):
        base = y * w
        for x in range(w):
            if visitado[base + x]:
                r, g, b, _ = px[x, y]
                px[x, y] = (r, g, b, 0)

    # Suavizar levemente el borde del recorte para evitar halos duros
    alpha = img.getchannel("A").filter(ImageFilter.GaussianBlur(0.8))
    img.putalpha(alpha)

    # Recortar al contenido con un pequeño margen
    bbox = img.getbbox()
    if bbox:
        margen = 6
        bbox = (
            max(0, bbox[0] - margen),
            max(0, bbox[1] - margen),
            min(w, bbox[2] + margen),
            min(h, bbox[3] + margen),
        )
        img = img.crop(bbox)

    img.save(path)
    print(f"{path.name}: ok -> {img.size[0]}x{img.size[1]}")


if __name__ == "__main__":
    for archivo in sorted(DECOR_DIR.glob("vintage-*.png")):
        procesar(archivo)
