"""
Drops the generated SVGs into the case-study markdown.

Each post marks its figure like this, and the marker survives, so running this
again just replaces the body:

    <!--FIG:fig-format-tax-->
    <!--/FIG-->

Run `python scripts/figs.py` first, then this. Both are idempotent.

    python scripts/inject_figs.py
"""

from __future__ import annotations

import pathlib
import re

HERE = pathlib.Path(__file__).resolve().parent
FIGS = HERE / "figs-out"
POSTS = HERE.parent / "src/content/writing"

MARK = re.compile(r"(<!--FIG:([a-z0-9\-]+)-->)(.*?)(<!--/FIG-->)", re.S)


def main() -> None:
    total = 0
    for md in sorted(POSTS.glob("*.md")):
        text = md.read_text(encoding="utf-8")
        if "<!--FIG:" not in text:
            continue

        def sub(m: re.Match) -> str:
            name = m.group(2)
            svg = FIGS / f"{name}.svg"
            if not svg.exists():
                raise SystemExit(f"{md.name}: no figure called {name}")
            return m.group(1) + "\n" + svg.read_text(encoding="utf-8").strip() + "\n" + m.group(4)

        new, n = MARK.subn(sub, text)
        if new != text:
            md.write_text(new, encoding="utf-8")
        total += n
        print(f"  {md.name}: {n} figure(s)")
    print(f"{total} figure(s) injected")


if __name__ == "__main__":
    main()
