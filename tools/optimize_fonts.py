"""Maintainer-only encoding of the bundled, OFL-licensed fonts (fontTools + Brotli).

Deployment uses checked-in WOFF2 files; it does not install or run this tool.
"""
import hashlib
import io
import json
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

asset_map = Path("tools/asset-map.json")
assets = json.loads(asset_map.read_text(encoding="utf-8"))
for name in ("dm-sans", "instrument-serif"):
    font = TTFont(f"site/assets/fonts/{name}.ttf", recalcTimestamp=False)
    options = subset.Options()
    options.layout_features = ["*"]
    options.recalc_timestamp = False
    glyphs = subset.Subsetter(options=options)
    glyphs.populate(unicodes=list(range(0x250)) + list(range(0x2000, 0x2070))
                    + list(range(0x20A0, 0x20D0)) + list(range(0x2190, 0x2300))
                    + [0xFEFF, 0xFFFD])
    glyphs.subset(font)
    font.flavor = "woff2"
    stream = io.BytesIO()
    font.save(stream)
    data = stream.getvalue()
    path = f"assets/fonts/{name}.{hashlib.sha256(data).hexdigest()[:12]}.woff2"
    Path("site", path).write_bytes(data)
    assets["fonts"][name] = path
    print(name, len(data), "bytes")
asset_map.write_text(json.dumps(assets, indent=2) + "\n", encoding="utf-8")
