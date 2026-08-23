"""
Flips one case study from draft to published, and tells you what happens next.

    python scripts/publish_post.py                     # what is drafted, and when each is due
    python scripts/publish_post.py decode-is-memory-bound
    python scripts/publish_post.py decode-is-memory-bound --today

Each post already carries the date it is scheduled to go out, so publishing is
one flag. `--today` overrides that date, for when a schedule slips and you would
rather the page not claim it was written last week.

It refuses to publish anything ahead of its scheduled date without `--force`,
because the whole point of the schedule is that the posts do not arrive as a
dump. Nothing here pushes. After it runs: `npm run build`, look at the page,
then commit and push.
"""

from __future__ import annotations

import datetime as dt
import io
import pathlib
import re
import sys

POSTS = pathlib.Path(__file__).resolve().parent.parent / "src/content/writing"

# Which LinkedIn post each one is paired with, so a slip is visible.
PAIRS = {
    "decode-is-memory-bound": "P2, decode cliff, 1 Sep",
    "claims-that-did-not-survive": "no LinkedIn post. Decided: blog only",
    "five-harnesses": "P5, ml-systems-lab, 22 Sep",
    "int8-does-not-pay": "P7, INT8 both ways, 29 Sep",
    "energy-optimal-clock": "P8, energy, 13 Oct",
    "cold-start-tax": "P9, cold start, 10 Nov",
    "format-tax": "P11, format tax, 8 Dec. Held until after HotMobile on 9 Oct",
}

FRONT = re.compile(r"\A---\n(.*?)\n---\n", re.S)


def read(p: pathlib.Path) -> tuple[str, dict]:
    text = io.open(p, encoding="utf-8").read()
    fm = FRONT.search(text)
    meta = {}
    for line in fm.group(1).splitlines():
        if ":" in line and not line.startswith(" "):
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    return text, meta


def listing() -> None:
    today = dt.date.today()
    rows = []
    for p in sorted(POSTS.glob("*.md")):
        _, m = read(p)
        if m.get("draft") != "true":
            continue
        slug = p.stem
        due = dt.date.fromisoformat(m["date"])
        rows.append((due, slug, m.get("title", "").strip("'\"")))
    rows.sort()
    if not rows:
        print("Nothing left in draft. All seven are out.")
        return
    print(f"{len(rows)} still drafted, in publishing order. Today is {today}.\n")
    for due, slug, title in rows:
        days = (due - today).days
        when = "DUE NOW" if days <= 0 else f"in {days} days"
        print(f"  {due}  {when:>11s}   {slug}")
        print(f"              {title[:66]}")
        print(f"              pairs with: {PAIRS.get(slug, 'nothing recorded')}\n")
    nxt = rows[0]
    print(f"Next: python scripts/publish_post.py {nxt[1]}")


def publish(slug: str, use_today: bool, force: bool) -> int:
    p = POSTS / f"{slug}.md"
    if not p.exists():
        print(f"No post called {slug}. Run with no arguments to see the list.")
        return 1
    text, meta = read(p)
    if meta.get("draft") != "true":
        print(f"{slug} is already published. Nothing to do.")
        return 0

    today = dt.date.today()
    due = dt.date.fromisoformat(meta["date"])
    if due > today and not (force or use_today):
        print(f"{slug} is scheduled for {due}, which is {(due - today).days} days away.")
        print("The schedule exists so these do not land as a dump.")
        print("Publish anyway with --force, or move it to today with --today.")
        return 1

    new = text.replace("draft: true", "draft: false", 1)
    if use_today:
        new = re.sub(r"^date: \S+$", f"date: {today.isoformat()}", new, count=1, flags=re.M)
    io.open(p, "w", encoding="utf-8", newline="\n").write(new)

    print(f"Published {slug}, dated {today if use_today else due}.")
    print(f"Pairs with: {PAIRS.get(slug, 'nothing recorded')}")
    print("\nNow:")
    print("  npm run build")
    print(f"  open http://localhost:4321/writing/{slug} and read it once")
    print("  git commit and push")
    print("\nLeave a day or two before the LinkedIn post that links it. A link post")
    print("to a page that went up an hour ago looks like the page exists for the post.")
    return 0


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        listing()
        return
    sys.exit(publish(args[0], "--today" in sys.argv, "--force" in sys.argv))


if __name__ == "__main__":
    main()
