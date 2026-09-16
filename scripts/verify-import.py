#!/usr/bin/env python3
"""Verify import-garments.py without touching the real assets.

The importer deletes public/garments/*.webp as part of a rebuild, so it is
exercised in throwaway directories only. Covers the two behaviours that matter:

  * --only-existing refreshes the catalog's own variants and ignores extras
  * a failing import must NOT delete the existing .webp files

Usage:
    python scripts/verify-import.py
"""

from __future__ import annotations

import importlib.util
import json
import sys
import tempfile
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
SCRIPT = HERE / "import-garments.py"

failures: list[str] = []


def check(label: str, ok: bool, detail: str = "") -> None:
    print(f"  {'PASS' if ok else 'FAIL'}  {label}" + (f"   <- {detail}" if detail and not ok else ""))
    if not ok:
        failures.append(label)


spec = importlib.util.spec_from_file_location("import_garments", SCRIPT)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)


def png(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.new("RGBA", (64, 64), (10, 10, 10, 255)).save(path, "PNG")


def make_source(root: Path, camisetas: list[str], sudaderas: list[str]) -> None:
    for color in camisetas:
        png(root / "Camisas" / f"unisex-basic-softstyle-t-shirt-{color}-front-0000000000abc.png")
    for color in sudaderas:
        png(root / "Sudaderas" / f"unisex-premium-pullover-hoodie-{color}-front-0000000000abc.png")


def make_project(root: Path, variants: list[tuple[str, str]]) -> None:
    garments = root / "public" / "garments"
    garments.mkdir(parents=True, exist_ok=True)
    (garments / "catalog.json").write_text(
        json.dumps({"version": 1, "garments": [{"type": t, "colorKey": c} for t, c in variants]}),
        encoding="utf-8",
    )
    for kind, color in variants:
        (garments / f"{kind}-{color}.webp").write_bytes(b"OLD-IMAGE")
        (garments / f"{kind}-{color}-thumb.webp").write_bytes(b"OLD-THUMB")
    (root / "src" / "data").mkdir(parents=True, exist_ok=True)


def verify() -> None:
    with tempfile.TemporaryDirectory(prefix="hermes-verify-import-") as tmp:
        root = Path(tmp)
        project, source = root / "project", root / "source"

        print("1. --only-existing keeps the catalog's variants and ignores extra colours")
        make_project(project, [("camiseta", "black"), ("sudadera", "black")])
        make_source(source, ["black", "sand", "white"], ["black", "maroon"])

        catalog = module.build_catalog(source, project, only_existing=True)
        ids = sorted(item["id"] for item in catalog)
        check("only the existing variants are produced", ids == ["camiseta-black", "sudadera-black"], str(ids))
        check("photos were regenerated",
              (project / "public" / "garments" / "camiseta-black.webp").read_bytes() != b"OLD-IMAGE")
        check("catalog.json holds exactly those variants",
              len(json.loads((project / "public" / "garments" / "catalog.json").read_text(encoding="utf-8"))["garments"]) == 2)
        check("labels and prices are preserved", all(item["label"] in {"Camiseta", "Sudadera"} and item["price"] > 0 for item in catalog))

        print("2. a failing import must not delete the existing .webp files")
        baseline = sorted(p.name for p in (project / "public" / "garments").glob("*.webp"))
        check("baseline has the generated images", len(baseline) == 4, str(baseline))

        bad = root / "bad-source"
        make_source(bad, ["color-inventado"], [])
        try:
            module.build_catalog(bad, project)
            check("unknown colour is rejected", False, "no exception raised")
        except ValueError as error:
            check("unknown colour is rejected", "color-inventado" in str(error), str(error))
        check("images survive an unknown colour",
              sorted(p.name for p in (project / "public" / "garments").glob("*.webp")) == baseline)

        try:
            module.build_catalog(root / "missing-source", project)
            check("missing source is rejected", False, "no exception raised")
        except FileNotFoundError:
            check("missing source is rejected", True)
        check("images survive a missing source",
              sorted(p.name for p in (project / "public" / "garments").glob("*.webp")) == baseline)

        empty = root / "empty-source"
        (empty / "Camisas").mkdir(parents=True)
        (empty / "Sudaderas").mkdir(parents=True)
        try:
            module.build_catalog(empty, project)
            check("empty source is rejected", False, "no exception raised")
        except ValueError as error:
            check("empty source is rejected", "No garment images" in str(error), str(error))


def main() -> int:
    print(f"importing under test: {SCRIPT.name}\n")
    verify()
    print()
    if failures:
        print(f"VERIFY_FAILED  {len(failures)} check(s) failed")
        for name in failures:
            print(f"  - {name}")
        return 1
    print("VERIFY_OK  import-garments.py behaviour verified")
    return 0


if __name__ == "__main__":
    sys.exit(main())