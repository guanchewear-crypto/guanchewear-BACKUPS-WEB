#!/usr/bin/env python3
"""Create the Code Snippets PHP payload for the GuancheWear shortcode."""

from __future__ import annotations

import base64
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "dist" / "index.html"
OUTPUT = ROOT / "dist" / "guanchewear-code-snippet.php"


def asset(path: str) -> Path:
    return INDEX.parent / path.split("?", 1)[0].lstrip("/")


def build() -> str:
    html = INDEX.read_text(encoding="utf-8")
    css_ref = re.search(r'<link\b[^>]*href=["\']([^"\']+\.css)["\']', html, re.I)
    js_ref = re.search(r'<script\b[^>]*src=["\']([^"\']+\.js)["\']', html, re.I)
    if not css_ref or not js_ref:
        raise RuntimeError("Vite CSS/JS assets were not found in dist/index.html")

    css = asset(css_ref.group(1)).read_text(encoding="utf-8")
    js = asset(js_ref.group(1)).read_text(encoding="utf-8")
    for name in ("monaco-riviera.svg", "monaco-lifestyle.svg", "puerto-rico.svg"):
        encoded = base64.b64encode((ROOT / "public" / "garments" / name).read_bytes()).decode("ascii")
        js = js.replace(f"/garments/{name}", f"data:image/svg+xml;base64,{encoded}")
    js = js.replace("</script", "<\\/script")

    # The theme reset and the compiled app CSS belong in wp_head. Keeping them
    # out of shortcode content prevents wpautop/Kadence from relocating them.
    return f'''add_action('wp_head', function() {{
    if (!is_page(116)) return;
    $css = <<<'GW_CSS'
{css}
GW_CSS;
    echo '<style id="guanchewear-head-css">' . $css . '</style>';
}}, 999);

add_shortcode('guanchewear_app', function() {{
    $js = <<<'GW_JS'
{js}
GW_JS;
    return '<div id="guanchewear-app-wrapper" data-no-wpautop="true"><div id="root"></div>'
        . '<script type="module" id="guanchewear-inline-js">' . $js . '</script></div>';
}});
'''


if __name__ == "__main__":
    OUTPUT.write_text(build(), encoding="utf-8")
    print(f"Created Code Snippets payload: {OUTPUT}")
