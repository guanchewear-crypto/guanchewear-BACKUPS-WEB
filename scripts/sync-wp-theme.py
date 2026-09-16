#!/usr/bin/env python3
"""Sync the Vite build into the WordPress child theme mount.

Three things this has to get right, all learned the hard way:

1. Vite copies `public/` to the ROOT of `dist/`, so assets are at
   `dist/garments/...`, NOT `dist/assets/garments/...`.

2. Asset references are rewritten to the theme's real URL prefix. We must NOT
   use a `<base href>` tag for this: a `<base>` also re-targets fragment links
   (`#crear-diseno`) so every in-page anchor turns into a full page navigation.
   Absolute theme paths keep the anchors working.

3. WordPress filters must never touch the bundle, so the entry keeps a stable
   name (`index-wp.js`) instead of Vite's content hash.
"""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

ASSET_DIRS = ("colecciones", "galeria", "garments", "mockups")
QUOTES = (chr(39), chr(34), chr(96))  # ' " `


def sync(source_dist: Path, theme_dir: Path, url_prefix: str) -> tuple[str, int, int]:
    if not source_dist.is_dir():
        raise FileNotFoundError(f"Missing Vite build: {source_dist}")
    if not theme_dir.is_dir():
        raise FileNotFoundError(f"Missing theme directory: {theme_dir}")

    prefix = "/" + url_prefix.strip("/") + "/"
    target_dist = theme_dir / "dist"
    if target_dist.exists():
        shutil.rmtree(target_dist)
    shutil.copytree(source_dist, target_dist)

    js_files = sorted((target_dist / "assets").glob("*.js"))
    if len(js_files) != 1:
        raise RuntimeError(f"Expected exactly one JS chunk, found {[p.name for p in js_files]}")

    source_js = js_files[0]
    text = source_js.read_text(encoding="utf-8")

    rewritten = 0
    for asset_dir in ASSET_DIRS:
        for quote in QUOTES:
            from_ref = f"{quote}/{asset_dir}/"
            to_ref = f"{quote}{prefix}{asset_dir}/"
            rewritten += text.count(from_ref)
            text = text.replace(from_ref, to_ref)

    entry = target_dist / "assets" / "index-wp.js"
    entry.write_text(text, encoding="utf-8")
    source_js.unlink()

    # After rewriting, no quoted reference may still start at the site root.
    leftovers = sum(text.count(f"{q}/{d}/") for d in ASSET_DIRS for q in QUOTES)
    if leftovers:
        raise RuntimeError(f"{leftovers} asset references still point at the site root")

    files = sum(1 for p in target_dist.rglob("*") if p.is_file())
    garments = len(list((target_dist / "garments").glob("*.webp")))
    return source_js.name, files, garments, rewritten


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dist", type=Path, required=True)
    parser.add_argument("--theme", type=Path, required=True)
    parser.add_argument(
        "--url-prefix",
        default=None,
        help="URL path serving the theme dist dir (default: /wp-content/themes/<theme name>/dist)",
    )
    args = parser.parse_args()

    prefix = args.url_prefix or f"/wp-content/themes/{args.theme.name}/dist"
    source_js, files, garments, rewritten = sync(args.dist, args.theme, prefix)
    print(f"SYNC_OK source_js={source_js} entry=index-wp.js dist_files={files} garments={garments} rewritten={rewritten}")
    print(f"  asset prefix: /{prefix.strip('/')}/")


if __name__ == "__main__":
    main()