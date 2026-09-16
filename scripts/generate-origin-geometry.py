#!/usr/bin/env python3
"""Generate real SVG geometry for the "DE CANARIAS PARA TODA EUROPA" section.

Shapes come from Natural Earth vector data, never hand-drawn:
  * the 8 Canary Islands, as their own real polygons
  * a merged, clipped Europe silhouette

Output: src/data/originMap.ts with the path strings plus Tenerife's exact
position, which is the required origin of the animated route.

Run:  python scripts/generate-origin-geometry.py
"""

from __future__ import annotations

import json
import urllib.request
from pathlib import Path

from shapely.geometry import GeometryCollection, MultiPolygon, Point, Polygon, box, shape
from shapely.ops import unary_union

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "src" / "data" / "originMap.ts"
CACHE = Path.home() / ".cache" / "gw-natural-earth"
BASE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson"

VIEWBOX = (760, 600)

# Real centroids, used only to NAME each polygon after extraction. They never
# contribute points to the drawing.
ISLANDS = {
    "El Hierro": (-17.99, 27.74),
    "La Palma": (-17.86, 28.68),
    "La Gomera": (-17.24, 28.11),
    "Tenerife": (-16.58, 28.29),
    "Gran Canaria": (-15.60, 27.96),
    "Fuerteventura": (-14.11, 28.35),
    "Lanzarote": (-13.63, 29.04),
    "La Graciosa": (-13.51, 29.25),
}
CANARY_BBOX = (-18.6, 27.2, -12.9, 29.8)

# Europe without Russia/Turkey: avoids a fake straight cut at the Urals and
# keeps the silhouette unambiguous. The clip removes overseas territories.
EUROPE_COUNTRIES = {
    "Albania", "Andorra", "Austria", "Belarus", "Belgium",
    "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Czechia", "Denmark",
    "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland",
    "Italy", "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg",
    "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia",
    "Norway", "Poland", "Portugal", "Romania", "San Marino", "Serbia",
    "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Ukraine",
    "United Kingdom",
}
EUROPE_CLIP = (-11.5, 34.0, 41.0, 71.5)

# Placement inside the existing 760x600 viewBox, preserving the composition:
# Canarias bottom-left, Europe top-right.
CANARY_BOX = (44.0, 400.0, 376.0, 560.0)
EUROPE_BOX = (348.0, 58.0, 720.0, 360.0)
# Route lands on Vienna: a real coordinate, asserted to fall inside the drawn
# landmass so the arrow can never end in the sea.
EUROPE_ANCHOR = (16.37, 48.21)
CANARY_PAD = 0.05
EUROPE_PAD = 0.02
# Small enough that La Graciosa (the tiniest island) keeps a real outline
# instead of collapsing into a triangle.
ISLAND_SIMPLIFY = 0.0025
EUROPE_SIMPLIFY = 0.08
# Drop islets this small so the silhouette stays readable and the path short.
# Keeps Sicily, Sardinia, Corsica, Crete, Cyprus, Mallorca; drops specks.
EUROPE_MIN_AREA = 0.3


def fetch(name: str) -> dict:
    CACHE.mkdir(parents=True, exist_ok=True)
    target = CACHE / name
    if not target.exists():
        print(f"  downloading {name} ...")
        urllib.request.urlretrieve(f"{BASE}/{name}", target)
    return json.loads(target.read_text(encoding="utf-8"))


def polygons(geometry) -> list[Polygon]:
    if isinstance(geometry, Polygon):
        return [geometry]
    if isinstance(geometry, (MultiPolygon, GeometryCollection)):
        out: list[Polygon] = []
        for part in geometry.geoms:
            out.extend(polygons(part))
        return out
    return []


def projected_path(geometry, project, ndigits: int = 1) -> str:
    """Rings as compact M/L subpaths; interior rings stay for fill-rule evenodd."""
    pieces: list[str] = []
    for poly in polygons(geometry):
        for ring in [poly.exterior, *poly.interiors]:
            coords = [project(lon, lat) for lon, lat in ring.coords]
            if len(coords) < 4:
                continue
            pieces.append(f"M{coords[0][0]:.{ndigits}f} {coords[0][1]:.{ndigits}f}")
            pieces.extend(f"L{x:.{ndigits}f} {y:.{ndigits}f}" for x, y in coords[1:-1])
            pieces.append("Z")
    return "".join(pieces)


def projector(geo_bbox, target_box, pad):
    lon0, lat0, lon1, lat1 = geo_bbox
    x0, y0, x1, y1 = target_box
    span_lon, span_lat = lon1 - lon0, lat1 - lat0
    scale = min(((x1 - x0) * (1 - 2 * pad)) / span_lon, ((y1 - y0) * (1 - 2 * pad)) / span_lat)
    off_x = x0 + ((x1 - x0) - span_lon * scale) / 2
    off_y = y0 + ((y1 - y0) - span_lat * scale) / 2
    return lambda lon, lat: (off_x + (lon - lon0) * scale, off_y + (lat1 - lat) * scale)


def main() -> int:
    print("1. Canary Islands")
    countries = fetch("ne_10m_admin_0_countries.geojson")
    spain = next(f for f in countries["features"] if f["properties"]["ADMIN"] == "Spain")
    region = box(*CANARY_BBOX)

    candidates = [p for p in polygons(shape(spain["geometry"])) if p.intersects(region)]
    for feature in fetch("ne_10m_minor_islands.geojson")["features"]:
        candidates.extend(p for p in polygons(shape(feature["geometry"])) if p.intersects(region))
    print(f"  candidate polygons: {len(candidates)}")

    islands: dict[str, Polygon] = {}
    for poly in candidates:
        centre = poly.representative_point()
        name = min(ISLANDS, key=lambda n: (ISLANDS[n][0] - centre.x) ** 2 + (ISLANDS[n][1] - centre.y) ** 2)
        if name not in islands or poly.area > islands[name].area:
            islands[name] = poly

    for name in ISLANDS:
        poly = islands.get(name)
        if poly is None:
            print(f"  MISSING  {name}")
        else:
            c = poly.representative_point()
            print(f"  {name:14} area={poly.area:.5f}  lon={c.x:8.3f}  lat={c.y:6.3f}")
    if len(islands) != len(ISLANDS):
        print("  ABORT: not every island was found")
        return 1

    print("\n2. Europe")
    parts = []
    for feature in countries["features"]:
        if feature["properties"]["ADMIN"] in EUROPE_COUNTRIES:
            parts.extend(polygons(shape(feature["geometry"])))
    europe = unary_union(parts).intersection(box(*EUROPE_CLIP))
    before = polygons(europe)
    europe = MultiPolygon([p for p in before if p.area >= EUROPE_MIN_AREA])
    print(f"  polygons after merge+clip: {len(before)} -> {len(polygons(europe))} after dropping islets")
    anchor = Point(*EUROPE_ANCHOR)
    if not europe.contains(anchor):
        print("  ABORT: the Europe anchor is not inside the drawn landmass")
        return 1
    print("  anchor is inside the landmass: ok")

    print("\n3. Projecting into the 760x600 viewBox")
    lons = [c[0] for p in islands.values() for c in p.exterior.coords]
    lats = [c[1] for p in islands.values() for c in p.exterior.coords]
    project_canary = projector((min(lons), min(lats), max(lons), max(lats)), CANARY_BOX, CANARY_PAD)
    project_europe = projector(EUROPE_CLIP, EUROPE_BOX, EUROPE_PAD)

    rendered = []
    for name, poly in islands.items():
        simplified = poly.simplify(ISLAND_SIMPLIFY, preserve_topology=True)
        cx, cy = project_canary(*poly.representative_point().coords[0])
        rendered.append({"name": name, "path": projected_path(simplified, project_canary), "x": round(cx, 1), "y": round(cy, 1)})

    tenerife = next(e for e in rendered if e["name"] == "Tenerife")
    print(f"  Tenerife origin: x={tenerife['x']} y={tenerife['y']}")
    for entry in sorted(rendered, key=lambda e: -e["y"]):
        print(f"    {entry['name']:14} at ({entry['x']}, {entry['y']})  path={len(entry['path'])} chars")

    europe_path = projected_path(europe.simplify(EUROPE_SIMPLIFY, preserve_topology=True), project_europe)
    print(f"  europe path: {len(europe_path)} chars")

    landing = tuple(round(v, 1) for v in project_europe(*EUROPE_ANCHOR))
    print(f"  Europe landing point: {landing}")
    ox, oy = tenerife["x"], tenerife["y"]
    lx, ly = landing
    route = (
        f"M{ox} {oy} "
        f"C{round(ox + 92, 1)} {round(oy - 152, 1)}, "
        f"{round(lx - 84, 1)} {round(ly + 132, 1)}, "
        f"{lx} {ly}"
    )

    body = ",\n".join(
        f'  {{ name: "{e["name"]}", path: "{e["path"]}" }}'
        for e in sorted(rendered, key=lambda e: -e["y"])
    )
    OUT.write_text(
        "/**\n"
        " * Real geography for the origin map.\n"
        " * Generated by scripts/generate-origin-geometry.py from Natural Earth\n"
        " * vector data. Do not hand-edit: regenerate instead.\n"
        " */\n\n"
        "export interface OriginIsland {\n  name: string\n  path: string\n}\n\n"
        f"export const ORIGIN_VIEWBOX = '0 0 {VIEWBOX[0]} {VIEWBOX[1]}'\n\n"
        "/** Centre of Tenerife: the exact origin of the route to Europe. */\n"
        f"export const TENERIFE = {{ x: {tenerife['x']}, y: {tenerife['y']} }}\n\n"
        "/** Where the route lands in Europe (Vienna), verified inside the landmass. */\n"
        f"export const EUROPE_LANDING = {{ x: {landing[0]}, y: {landing[1]} }}\n\n"
        "/** Route from Tenerife to Europe, generated from both endpoints. */\n"
        f'export const ROUTE_PATH = "{route}"\n\n'
        "export const canaryIslands: OriginIsland[] = [\n" + body + ",\n]\n\n"
        f'export const europePath =\n  "{europe_path}"\n',
        encoding="utf-8",
        newline="\n",
    )
    print(f"\nWROTE {OUT.name} ({OUT.stat().st_size} bytes)")

    # Dev aid: render the bare geometry so it can be eyeballed before wiring it
    # into the section. Never shipped.
    preview = Path.home() / "AppData" / "Local" / "Temp" / "gw-origin-preview.html"
    preview.parent.mkdir(parents=True, exist_ok=True)
    islands_svg = "".join(f'<path d="{e["path"]}"/>' for e in rendered)
    preview.write_text(
        "<!doctype html><meta charset=utf-8><body style='margin:0;background:#0e0e0e'>"
        f'<svg viewBox="0 0 {VIEWBOX[0]} {VIEWBOX[1]}" width="{VIEWBOX[0]}" height="{VIEWBOX[1]}" xmlns="http://www.w3.org/2000/svg">'
        '<rect width="760" height="600" fill="#0e0e0e"/>'
        f'<g fill="#d9e6ee" fill-opacity=".17" stroke="#a9dfff" stroke-opacity=".2" fill-rule="evenodd">'
        f'<path d="{europe_path}"/></g>'
        f'<g fill="#8dd8ff">{islands_svg}</g>'
        f'<path d="{route}" fill="none" stroke="#D4A853" stroke-width="2.5" stroke-linecap="round"/>'
        f'<circle cx="{landing[0]}" cy="{landing[1]}" r="5" fill="#fff"/>'
        f'<circle cx="{tenerife["x"]}" cy="{tenerife["y"]}" r="5" fill="#D4A853"/>'
        '<g fill="#fff" font-family="system-ui" font-size="12" font-weight="700" letter-spacing="2">'
        '<text x="44" y="586">CANARIAS</text><text x="640" y="120">EUROPA</text></g>'
        "</svg></body>",
        encoding="utf-8",
        newline="\n",
    )
    print(f"PREVIEW {preview}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())