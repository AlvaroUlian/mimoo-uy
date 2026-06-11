"""Limpia restos de checkerboard en zonas encerradas (ej: entre las piernas).

Busca componentes conexos de pixeles claros que NO tocan el borde y que
contienen cuadraditos gris neutro (firma del checkerboard falso) y los vuelve
transparentes. Las zonas blancas propias del muñeco (pompones, panza) no
tienen ese gris neutro, así que no se tocan.
"""

from collections import deque
from pathlib import Path

from PIL import Image

DECOR_DIR = Path(__file__).resolve().parent.parent / "images" / "decor"

BRIGHT_MIN = 228
CHROMA_MAX = 6  # estricto: el checker es gris/blanco neutro puro


def es_claro(px):
    r, g, b = px[0], px[1], px[2]
    return min(r, g, b) >= BRIGHT_MIN and (max(r, g, b) - min(r, g, b)) <= CHROMA_MAX


def es_gris_checker(px):
    """Cuadradito gris del checkerboard (~239)."""
    r, g, b = px[0], px[1], px[2]
    return (max(r, g, b) - min(r, g, b)) <= 5 and 232 <= max(r, g, b) <= 246


def es_blanco_checker(px):
    """Cuadradito blanco del checkerboard (~254)."""
    r, g, b = px[0], px[1], px[2]
    return (max(r, g, b) - min(r, g, b)) <= 5 and min(r, g, b) >= 250


def procesar(path: Path) -> None:
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    px = img.load()

    visitado = bytearray(w * h)
    limpiados = 0

    for sy in range(h):
        for sx in range(w):
            idx = sy * w + sx
            if visitado[idx]:
                continue
            p = px[sx, sy]
            if p[3] == 0 or not es_claro(p):
                visitado[idx] = 1
                continue

            # BFS del componente claro
            componente = []
            grises = 0
            blancos = 0
            toca_borde = False
            visitado[idx] = 1
            cola = deque([(sx, sy)])
            while cola:
                x, y = cola.popleft()
                componente.append((x, y))
                p_act = px[x, y]
                if es_gris_checker(p_act):
                    grises += 1
                elif es_blanco_checker(p_act):
                    blancos += 1
                if x == 0 or y == 0 or x == w - 1 or y == h - 1:
                    toca_borde = True
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < w and 0 <= ny < h:
                        nidx = ny * w + nx
                        if not visitado[nidx]:
                            np_ = px[nx, ny]
                            if np_[3] > 0 and es_claro(np_):
                                visitado[nidx] = 1
                                cola.append((nx, ny))

            # Solo limpiar componentes encerrados con la firma del checkerboard:
            # mezcla de cuadraditos grises Y blancos neutros
            n = len(componente)
            if (not toca_borde and n >= 150
                    and grises / n > 0.2 and blancos / n > 0.2):
                for x, y in componente:
                    r, g, b, _ = px[x, y]
                    px[x, y] = (r, g, b, 0)
                limpiados += 1

    img.save(path)
    print(f"{path.name}: {limpiados} hueco(s) limpiado(s)")


if __name__ == "__main__":
    for archivo in sorted(DECOR_DIR.glob("vintage-*.png")):
        procesar(archivo)
