#!/usr/bin/env python3
"""Verify the generated origin map against real geography.

Checks the invariants that matter, using the same coordinate space the SVG
renders in, parsed back out of src/data/originMap.ts:

  1. all 8 Canary Islands are present
  2. the route starts from Tenerife - and from Tenerife only
  3. Fuerteventura and Lanzarote lie east of Tenerife
  4. La Palma, La Gomera and El Hierro lie west of Tenerife
  5. La Graciosa sits north of Lanzarote
  6. Tenerife is the largest island (Gran Canaria cannot be mistaken for it)
  7. the route lands inside Europe, not in the sea

Usage:
    python scripts/verify-origin-map.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

from shapely.geometry import Point, Polygon

HERE = Path(__file__).resolve().parent
SOURCE = HERE.parent / "src" / "data" / "originMap.ts"

failures: list[str] = []


def check(label: str, ok: bool, detail: str = "") -> None:
    print(f"  {'PASS' if ok else 'FAIL'}  {label}" + (f"   <- {detail}" if detail and not ok else ""))
    if not ok:
        failures.append(label)


def rings_of(path: str) -> list[Polygon]:
    """Split the compact M/L/Z path into one polygon per ring."""
    out: list[Polygon] = []
    for chunk in path.split("M")[1:]:
        points = [(float(x), float(y)) for x, y in re.findall(r"(-?\d+\.?\d*) (-?\d+\.?\d*)", chunk.replace("L", " ").replace("Z", " "))]
        if len(points) >= 4:
            out.append(Polygon(points))
    return out


def to_polygon(path: str) -> Polygon:
    """First ring only: right for a single-island path."""
    return rings_of(path)[0]


def land_of(path: str):
    """Reassemble land: outer rings merged, minus the rings enclosed by another.

    Without this the sea (an enclosed ring) counts as land and the landing
    check would be meaningless.
    """
    from shapely.ops import unary_union

    # Rounding to one decimal can leave a ring marginally self-intersecting, so
    # repair each one before any set operation, and compare with representative
    # points, which stay reliable on a repaired ring.
    rings = [fixed for r in rings_of(path) if not (fixed := r.buffer(0)).is_empty]
    outer, holes = [], []
    for ring in rings:
        probe = ring.representative_point()
        (holes if any(o is not ring and o.contains(probe) for o in rings) else outer).append(ring)
    return unary_union(outer).difference(unary_union(holes))


def main() -> int:
    if not SOURCE.is_file():
        print(f"VERIFY_FAILED  missing {SOURCE}", file=sys.stderr)
        return 1
    text = SOURCE.read_text(encoding="utf-8")

    blocks = re.findall(r'\{\s*name:\s*"([^"]+)",\s*path:\s*"([^"]+)"\s*\}', text)
    islands = {name: to_polygon(path) for name, path in blocks}
    tenerife = re.search(r"export const TENERIFE = \{ x: ([\d.]+), y: ([\d.]+) \}", text)
    landing = re.search(r"export const EUROPE_LANDING = \{ x: ([\d.]+), y: ([\d.]+) \}", text)
    route = re.search(r'export const ROUTE_PATH = "([^"]+)"', text)
    europe = re.search(r'export const europePath =\s*\n\s*"([^"]+)"', text)
    if not all((tenerife, landing, route, europe)):
        print("VERIFY_FAILED  could not parse originMap.ts", file=sys.stderr)
        return 1

    origin = Point(float(tenerife.group(1)), float(tenerife.group(2)))
    target = Point(float(landing.group(1)), float(landing.group(2)))
    route_start = tuple(float(v) for v in re.match(r"M(-?[\d.]+) (-?[\d.]+)", route.group(1)).groups())

    print("1. all eight islands present")
    expected = {"El Hierro", "La Palma", "La Gomera", "Tenerife", "Gran Canaria", "Fuerteventura", "Lanzarote", "La Graciosa"}
    check("exactly the 8 real islands", set(islands) == expected, f"got {sorted(islands)}")
    if set(islands) != expected:
        return 1

    print("\n2. the route starts from Tenerife, and only from Tenerife")
    check("route start equals the Tenerife point", abs(route_start[0] - origin.x) < 0.15 and abs(route_start[1] - origin.y) < 0.15,
          f"start={route_start} tenerife=({origin.x}, {origin.y})")
    check("route start is inside the Tenerife polygon", islands["Tenerife"].contains(origin))
    others = [name for name, poly in islands.items() if name != "Tenerife" and poly.contains(origin)]
    check("route start is not inside any other island", not others, f"also inside {others}")

    print("\n3. eastern islands are east of Tenerife")
    for name in ("Fuerteventura", "Lanzarote"):
        check(f"{name} is east of Tenerife", islands[name].representative_point().x > origin.x,
              f"x={islands[name].representative_point().x:.1f} vs {origin.x:.1f}")

    print("\n4. western islands are west of Tenerife")
    for name in ("El Hierro", "La Palma", "La Gomera"):
        check(f"{name} is west of Tenerife", islands[name].representative_point().x < origin.x,
              f"x={islands[name].representative_point().x:.1f} vs {origin.x:.1f}")

    print("\n5. La Graciosa sits north of Lanzarote")
    check("La Graciosa is above Lanzarote", islands["La Graciosa"].representative_point().y < islands["Lanzarote"].representative_point().y)

    print("\n6. Tenerife is unmistakably the largest island")
    largest = max(islands, key=lambda n: islands[n].area)
    check("Tenerife has the largest area", largest == "Tenerife", f"largest is {largest}")
    ratio = islands["Tenerife"].area / islands["Gran Canaria"].area
    check("Tenerife is clearly bigger than Gran Canaria (>=1.2x)", ratio >= 1.2, f"ratio {ratio:.2f}")
    check("Tenerife and Gran Canaria do not touch", not islands["Tenerife"].intersects(islands["Gran Canaria"]))

    print("\n7. the route lands inside Europe")
    land = land_of(europe.group(1))
    check("landing point is inside the Europe silhouette", land.contains(target),
          f"landing ({target.x}, {target.y})")

    print("\n8. shapes are real geography, not doodles")
    for name, poly in sorted(islands.items(), key=lambda kv: -kv[1].area):
        check(f"{name}: a real outline (>=8 vertices, closed)", len(poly.exterior.coords) >= 9)
    mainland = max(rings_of(europe.group(1)), key=lambda p: p.area)
    check("Europe has a coastline made of many vertices", len(mainland.exterior.coords) >= 500,
          f"{len(mainland.exterior.coords)} vertices")
    check("Europe bbox is plausible", 300 < mainland.bounds[2] - mainland.bounds[0] < 500,
          f"width {mainland.bounds[2] - mainland.bounds[0]:.0f}")

    print()
    if failures:
        print(f"VERIFY_FAILED  {len(failures)} check(s) failed")
        for name in failures:
            print(f"  - {name}")
        return 1
    print("VERIFY_OK  origin map matches real geography")
    return 0


if __name__ == "__main__":
    sys.exit(main())