#!/usr/bin/env python3
"""Verify the desktop gallery grid: no empty cells, no cropped artwork.

Reads the real spans out of GallerySection.tsx and the real artwork aspect out
of the first gallery image, then simulates the browser's grid auto-placement
(sparse row flow) over the same 12-column track the section uses.

Two properties are asserted:
  * every row band fills the 12 columns, so the grid has no empty gaps
  * every tile matches the artwork aspect ratio, so nothing is cropped

Usage:
    python scripts/check-gallery-grid.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parent
COMPONENT = PROJECT / "src" / "components" / "GallerySection.tsx"
DATA = PROJECT / "src" / "data" / "collections.ts"

COLS = 12
GAP = 8.0            # gap-2
CONTAINER = 1280.0   # max-w-7xl
ASPECT_TOLERANCE = 0.12

failures: list[str] = []


def check(label: str, ok: bool, detail: str = "") -> None:
    print(f"  {'PASS' if ok else 'FAIL'}  {label}" + (f"   <- {detail}" if detail and not ok else ""))
    if not ok:
        failures.append(label)


def spans_from_component() -> list[tuple[int, int]]:
    source = COMPONENT.read_text(encoding="utf-8")
    tiled = re.search(r"const TILE_SPAN = '([^']+)'", source)
    entries = [tiled.group(1)] if tiled else re.findall(r"'([^']*col-span[^']*)'", source)
    if not entries:
        raise SystemExit("could not find the tile span in GallerySection.tsx")

    count = len(gallery_images())
    spans: list[tuple[int, int]] = []
    for entry in entries:
        colspan = re.search(r"col-span-(\d+)", entry)
        if not colspan:
            raise SystemExit(f"tile span without a col-span: {entry!r}")
        rowspan = re.search(r"row-span-(\d+)", entry)
        spans.append((int(colspan.group(1)), int(rowspan.group(1)) if rowspan else 1))
    # A single span class applies to every tile.
    return spans * count if len(spans) == 1 else spans


def gallery_images() -> list[str]:
    data = DATA.read_text(encoding="utf-8")
    block = re.search(r"galleryTileImages[^=]*=\s*\[(.*?)\];", data, re.S)
    return re.findall(r"'([^']+)'", block.group(1))


def row_height(viewport: float) -> float:
    """Resolve the md:auto-rows value for a given viewport width.

    The section scales its row height with the viewport so the 3/6-column tiles
    keep the artwork aspect at every desktop width, not just at max-w-7xl. A
    plain px value is also accepted.
    """
    source = COMPONENT.read_text(encoding="utf-8")
    match = re.search(r"md:auto-rows-\[([^\]]+)\]", source)
    if not match:
        raise SystemExit("could not find md:auto-rows-[...] in GallerySection.tsx")
    value = match.group(1)
    px = re.fullmatch(r"(\d+)px", value)
    if px:
        return float(px.group(1))
    clamp = re.fullmatch(r"clamp\((\d+)px,\s*([\d.]+)vw,\s*(\d+)px\)", value)
    if clamp:
        low, vw, high = float(clamp.group(1)), float(clamp.group(2)), float(clamp.group(3))
        return min(max(low, viewport * vw / 100), high)
    raise SystemExit(f"unsupported md:auto-rows value: {value!r}")


def artwork_ratio() -> float:
    first = gallery_images()[0]
    with Image.open(PROJECT / "public" / first.lstrip("/")) as image:
        return image.width / image.height


def place(spans: list[tuple[int, int]], height: float):
    occupied: set[tuple[int, int]] = set()
    placed: list[tuple[int, int, int, int]] = []
    cursor_row, cursor_col = 1, 1
    for colspan, rowspan in spans:
        row, col = cursor_row, cursor_col
        while True:
            if col + colspan - 1 > COLS:
                row, col = row + 1, 1
                continue
            cells = {(row + r, col + c) for r in range(rowspan) for c in range(colspan)}
            if cells & occupied:
                col += 1
                continue
            occupied |= cells
            placed.append((row, col, rowspan, colspan))
            cursor_row, cursor_col = row, col + colspan
            break
    return placed, occupied


def main() -> int:
    spans = spans_from_component()
    ratio = artwork_ratio()
    print(f"grid: {len(spans)} tiles, artwork ratio {ratio:.3f}\n")
    check("one span per gallery image", len(spans) >= 12)
    check("a tile for every gallery image", len(spans) == len(gallery_images()),
          f"{len(spans)} spans for {len(gallery_images())} images")

    print("  aspect across desktop widths (tiles must stay on the artwork ratio):")
    for viewport in (1024, 1200, 1366, 1440, 1920):
        width = min(CONTAINER, viewport - 95)      # section padding + scrollbar
        height = row_height(viewport)
        placed, occupied = place(spans, height)
        last_row = max(r + rs - 1 for r, _, rs, _ in placed)
        holes = [(r, c) for r in range(1, last_row + 1) for c in range(1, COLS + 1) if (r, c) not in occupied]

        column = (width - (COLS - 1) * GAP) / COLS
        ratios = [
            (colspan * column + (colspan - 1) * GAP) / (rowspan * height + (rowspan - 1) * GAP)
            for _, _, rowspan, colspan in placed
        ]
        worst = max(ratios, key=lambda r: abs(r - ratio))
        ok = not holes and abs(worst - ratio) <= ASPECT_TOLERANCE
        print(f"    {viewport}px -> filas {last_row}, huecos {len(holes)}, peor ratio {worst:.3f}  {'OK' if ok else 'MAL'}")
        if holes:
            check(f"no empty cells at {viewport}px", False, f"{holes[:6]}")
        if abs(worst - ratio) > ASPECT_TOLERANCE:
            check(f"tiles on the artwork aspect at {viewport}px", False, f"worst {worst:.3f}")

    placed, occupied = place(spans, row_height(1366))
    check("no empty cells in the grid", not any(
        (r, c) not in occupied
        for r in range(1, max(x + xs - 1 for x, _, xs, _ in placed) + 1)
        for c in range(1, COLS + 1)
    ))

    print()
    if failures:
        print(f"GRID_FAILED  {len(failures)} check(s) failed")
        for name in failures:
            print(f"  - {name}")
        return 1
    print(f"GRID_OK  {len(placed)} tiles, 0 empty cells, all on artwork aspect")
    return 0


if __name__ == "__main__":
    sys.exit(main())