#!/usr/bin/env python3
"""Build a single-file GuancheWear payload and optionally publish it via WP REST."""

from __future__ import annotations

import argparse
import base64
import getpass
import json
import re
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parent.parent
DEFAULT_INDEX = ROOT / "dist" / "index.html"
DEFAULT_OUTPUT = ROOT / "dist" / "guanchewear-wordpress.html"


def inline_build(index_path: Path) -> str:
    html = index_path.read_text(encoding="utf-8")
    asset_dir = index_path.parent

    css_refs = re.findall(r'<link\b[^>]*href=["\']([^"\']+\.css)["\'][^>]*>', html, re.I)
    js_refs = re.findall(r'<script\b[^>]*src=["\']([^"\']+\.js)["\'][^>]*>\s*</script>', html, re.I)
    if not css_refs or not js_refs:
        raise RuntimeError("Could not find the built CSS and JavaScript references in index.html")

    def asset_path(ref: str) -> Path:
        return asset_dir / ref.split("?", 1)[0].lstrip("/")

    css = "\n".join(asset_path(ref).read_text(encoding="utf-8") for ref in css_refs)
    js = "\n".join(asset_path(ref).read_text(encoding="utf-8") for ref in js_refs)

    # Public assets are not part of Vite's JavaScript bundle. Inline the small
    # garment placeholders so the shortcode remains genuinely single-file and
    # does not depend on files being uploaded to the WordPress document root.
    for garment in ("monaco-riviera.svg", "monaco-lifestyle.svg", "puerto-rico.svg"):
        garment_path = ROOT / "public" / "garments" / garment
        encoded = base64.b64encode(garment_path.read_bytes()).decode("ascii")
        js = js.replace(f"/garments/{garment}", f"data:image/svg+xml;base64,{encoded}")

    js = js.replace("</script", "<\\/script")

    return (
        '<div id="guanchewear-app-wrapper" data-no-wpautop="true">\n'
        '  <div id="root"></div>\n'
        f'  <style id="guanchewear-inline-css">{css}</style>\n'
        f'  <script type="module" id="guanchewear-inline-js">{js}</script>\n'
        '</div>\n'
    )


def publish(site: str, username: str, password: str, title: str, content: str,
            slug: str, status: str, template: str) -> dict:
    endpoint = site.rstrip("/") + "/wp-json/wp/v2/pages"
    payload = {
        "title": title,
        "slug": slug,
        "status": status,
        "content": content,
    }
    if template:
        payload["template"] = template
    token = base64.b64encode(f"{username}:{password}".encode()).decode()
    request = Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": f"Basic {token}", "Content-Type": "application/json"},
        method="POST",
    )
    with urlopen(request, timeout=60) as response:
        return json.loads(response.read().decode("utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--index", type=Path, default=DEFAULT_INDEX)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--site", help="WordPress base URL, e.g. https://example.com")
    parser.add_argument("--username", help="WordPress username")
    parser.add_argument("--app-password", help="WP Application Password (prompted if omitted)")
    parser.add_argument("--title", default="GuancheWear Landing")
    parser.add_argument("--slug", default="guanchewear")
    parser.add_argument("--status", choices=("draft", "publish", "private"), default="draft")
    parser.add_argument("--template", default="", help="Template filename, e.g. wp-template.php")
    parser.add_argument("--upload", action="store_true", help="Create the page through WP REST")
    args = parser.parse_args()

    try:
        content = inline_build(args.index.resolve())
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(content, encoding="utf-8")
    except (OSError, RuntimeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    print(f"Created single-file WordPress payload: {args.output.resolve()}")
    print("Theme-template deployment:")
    print("  1. Copy src/wp-template.php into the active theme as wp-template.php.")
    print("  2. Copy dist/ into the active theme as dist/.")
    print("  3. Create/edit a page and select the 'GuancheWear Landing' template.")
    print("REST/content deployment (requires an administrator with unfiltered_html):")
    print("  python src/deploy_wp.py --upload --site https://YOUR-SITE --username USER")

    if not args.upload:
        print("Dry run only; no remote changes were made. Add --upload to publish a draft.")
        return 0
    if not args.site or not args.username:
        parser.error("--upload requires --site and --username")
    password = args.app_password or getpass.getpass("WordPress Application Password: ")
    try:
        page = publish(args.site, args.username, password, args.title, content,
                       args.slug, args.status, args.template)
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        print(f"WordPress API error {exc.code}: {detail}", file=sys.stderr)
        return 2
    except URLError as exc:
        print(f"Connection error: {exc.reason}", file=sys.stderr)
        return 2
    print(f"Created WordPress page #{page.get('id')}: {page.get('link', '(no link returned)')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
