#!/usr/bin/env python3
"""Import Printify garment fronts into the Vite public directory."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

from PIL import Image

COLOR_META: dict[str, tuple[str, str, str]] = {
    "black": ("Negro", "#111214", "#F5F5F2"),
    "charcoal": ("Carbón", "#36454F", "#F5F5F2"),
    "cornsilk": ("Maíz", "#FFF8DC", "#111214"),
    "daisy": ("Daisy", "#F4D03F", "#111214"),
    "dark-chocolate": ("Chocolate", "#3B241C", "#F5F5F2"),
    "forest-green": ("Verde bosque", "#1E4D2B", "#F5F5F2"),
    "ice-grey": ("Gris hielo", "#D8DEE4", "#111214"),
    "kelly-green": ("Verde Kelly", "#4CBB17", "#111214"),
    "light-blue": ("Azul claro", "#87CEEB", "#111214"),
    "maroon": ("Granate", "#800000", "#F5F5F2"),
    "military-green": ("Verde militar", "#4B5320", "#F5F5F2"),
    "natural": ("Natural", "#E8DDC4", "#111214"),
    "navy": ("Azul marino", "#14253D", "#F5F5F2"),
    "orange": ("Naranja", "#F97316", "#111214"),
    "purple": ("Morado", "#7C3AED", "#F5F5F2"),
    "sand": ("Arena", "#C2B280", "#111214"),
    "tropical-blue": ("Azul tropical", "#00A6D6", "#111214"),
    "white": ("Blanco", "#F5F5F2", "#111214"),
    "adobe": ("Adobe", "#B66A50", "#F5F5F2"),
    "bone": ("Hueso", "#E3D7C6", "#111214"),
    "carbon-grey": ("Gris carbono", "#55595C", "#F5F5F2"),
    "carolina-blue": ("Azul Carolina", "#56A9E3", "#111214"),
    "charcoal-heather": ("Carbón jaspeado", "#666666", "#F5F5F2"),
    "dusty-rose": ("Rosa empolvado", "#C98F8F", "#111214"),
    "khaki": ("Caqui", "#B7A77A", "#111214"),
    "latte": ("Latte", "#C6A580", "#111214"),
    "lavender": ("Lavanda", "#B9A7D9", "#111214"),
    "light-pink": ("Rosa claro", "#F4C2C2", "#111214"),
    "navy-blazer": ("Azul blazer", "#1F2A44", "#F5F5F2"),
    "oatmeal-heather": ("Avena jaspeada", "#D8C6A8", "#111214"),
    "sky-blue": ("Azul cielo", "#86C5E8", "#111214"),
    "team-gold": ("Dorado", "#D4A853", "#111214"),
    "team-red": ("Rojo", "#C94444", "#F5F5F2"),
    "team-royal": ("Azul royal", "#4169E1", "#F5F5F2"),
    "vintage-black": ("Negro vintage", "#282828", "#F5F5F2"),
}

SOURCE_CONFIG = {
    "Camisas": {
        "type": "camiseta",
        "prefix": "unisex-basic-softstyle-t-shirt-",
        "label": "Camiseta",
        "price": 25,
    },
    "Sudaderas": {
        "type": "sudadera",
        "prefix": "unisex-premium-pullover-hoodie-",
        "label": "Sudadera",
        "price": 35,
    },
}


def parse_color(filename: str, prefix: str) -> str:
    stem = Path(filename).stem
    without_prefix = stem.removeprefix(prefix)
    color, separator, _hash = without_prefix.rpartition("-front-")
    if not separator or not color:
        raise ValueError(f"Cannot parse garment color from {filename}")
    return color


def save_webp(source: Path, target: Path, max_size: int, quality: int) -> None:
    with Image.open(source) as image:
        image = image.convert("RGBA")
        image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        image.save(target, "WEBP", quality=quality, method=6)


def build_catalog(
    source_root: Path,
    project_root: Path,
    only_existing: bool = False,
) -> list[dict[str, Any]]:
    """Rebuild the garment catalog from Printify fronts.

    `only_existing` refreshes the photos of the garments already in the catalog
    and ignores any extra colour in the source folder, so the studio keeps the
    exact same variants, ids and Spanish names.
    """
    output_dir = project_root / "public" / "garments"
    output_dir.mkdir(parents=True, exist_ok=True)

    allowed: set[tuple[str, str]] | None = None
    if only_existing:
        catalog_path = output_dir / "catalog.json"
        if not catalog_path.is_file():
            raise FileNotFoundError(f"--only-existing needs an existing {catalog_path}")
        previous = json.loads(catalog_path.read_text(encoding="utf-8"))
        allowed = {(item["type"], item["colorKey"]) for item in previous["garments"]}

    # Collect and validate every source before touching anything on disk: a bad
    # path used to wipe the existing .webp files and then abort, leaving the
    # catalog pointing at images that no longer existed.
    jobs: list[tuple[dict[str, Any], str, Path]] = []
    for source_dir_name, config in SOURCE_CONFIG.items():
        source_dir = source_root / source_dir_name
        if not source_dir.is_dir():
            raise FileNotFoundError(source_dir)
        for source in sorted(source_dir.glob("*.png")):
            color_key = parse_color(source.name, config["prefix"])
            if allowed is not None and (config["type"], color_key) not in allowed:
                continue
            if color_key not in COLOR_META:
                raise ValueError(f"Missing color metadata for {color_key}")
            jobs.append((config, color_key, source))
    if not jobs:
        raise ValueError(f"No garment images found under {source_root}")

    for old_file in output_dir.glob("*.webp"):
        old_file.unlink()

    catalog: list[dict[str, Any]] = []
    for config, color_key, source in jobs:
        label, swatch, contrast = COLOR_META[color_key]
        garment_type = config["type"]
        garment_id = f"{garment_type}-{color_key}"
        image_name = f"{garment_id}.webp"
        thumbnail_name = f"{garment_id}-thumb.webp"
        save_webp(source, output_dir / image_name, 1200, 86)
        save_webp(source, output_dir / thumbnail_name, 320, 78)
        catalog.append(
            {
                "id": garment_id,
                "type": garment_type,
                "label": config["label"],
                "price": config["price"],
                "colorKey": color_key,
                "color": label,
                "swatch": swatch,
                "contrast": contrast,
                "image": f"/garments/{image_name}",
                "thumbnail": f"/garments/{thumbnail_name}",
            }
        )

    catalog.sort(key=lambda item: (item["type"], item["color"]))
    catalog_json = {"version": 1, "source": "Printify garment fronts", "garments": catalog}
    (output_dir / "catalog.json").write_text(
        json.dumps(catalog_json, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n"
    )

    ts_lines = [
        "export type GarmentType = 'camiseta' | 'sudadera'",
        "",
        "export interface Garment {",
        "  id: string",
        "  type: GarmentType",
        "  label: string",
        "  price: number",
        "  colorKey: string",
        "  color: string",
        "  swatch: string",
        "  contrast: string",
        "  image: string",
        "  thumbnail: string",
        "}",
        "",
        "export const garmentCatalog: Garment[] = ",
        json.dumps(catalog, ensure_ascii=False, indent=2),
        ";\n",
    ]
    (project_root / "src" / "data" / "garments.ts").write_text("\n".join(ts_lines), encoding="utf-8", newline="\n")
    return catalog


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--project", type=Path, required=True)
    parser.add_argument(
        "--only-existing",
        action="store_true",
        help="refresh the photos of the garments already in the catalog and ignore extra colours",
    )
    args = parser.parse_args()
    catalog = build_catalog(args.source, args.project, only_existing=args.only_existing)
    counts = {garment_type: sum(item["type"] == garment_type for item in catalog) for garment_type in ("camiseta", "sudadera")}
    print(f"IMPORTED garments={len(catalog)} camisetas={counts['camiseta']} sudaderas={counts['sudadera']}")


if __name__ == "__main__":
    main()
