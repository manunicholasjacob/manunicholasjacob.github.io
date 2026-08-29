"""
Generates the inline SVG figures used by the case studies in
src/content/writing/.

Every figure is drawn from a data file in one of the research repositories,
never from a number typed in here. The one exception is FIG 6, which plots
published claims against their corrections; its inputs are quoted strings and
they are cited in the post itself.

Output goes to scripts/figs-out/*.svg. Paste the file straight into the
markdown: the SVG uses the site's own CSS variables, so it follows the theme
toggle instead of being baked light or dark.

    python scripts/figs.py

Paths are relative to the Claudecode workspace root, two levels up from here.
"""

from __future__ import annotations

import json
import math
import os
import pathlib

HERE = pathlib.Path(__file__).resolve().parent
SITE = HERE.parent
ROOT = SITE.parent
OUT = HERE / "figs-out"
OUT.mkdir(exist_ok=True)

W, H = 720, 400
PAD_L, PAD_R, PAD_T, PAD_B = 62, 22, 30, 46

FG = "var(--fg)"
MUTED = "var(--fg-muted)"
FAINT = "var(--fg-faint)"
HAIR = "var(--hairline)"
ACCENT = "var(--accent)"


def head(title: str, desc: str) -> list[str]:
    return [
        f'<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" '
        f'role="img" aria-labelledby="t-{title} d-{title}" '
        'style="width:100%;height:auto;display:block;overflow:visible">',
        f'<title id="t-{title}">{desc}</title>',
        f'<desc id="d-{title}">{desc}</desc>',
        '<g font-family="ui-monospace, JetBrains Mono Variable, monospace" font-size="11">',
    ]


def tail() -> list[str]:
    return ["</g>", "</svg>"]


def axes(s: list[str], xlab: str, ylab: str) -> None:
    s.append(
        f'<line x1="{PAD_L}" y1="{H-PAD_B}" x2="{W-PAD_R}" y2="{H-PAD_B}" '
        f'stroke="{HAIR}" stroke-width="1"/>'
    )
    s.append(
        f'<line x1="{PAD_L}" y1="{PAD_T}" x2="{PAD_L}" y2="{H-PAD_B}" '
        f'stroke="{HAIR}" stroke-width="1"/>'
    )
    s.append(
        f'<text x="{(PAD_L+W-PAD_R)/2}" y="{H-8}" fill="{FAINT}" '
        f'text-anchor="middle" letter-spacing="0.08em">{xlab}</text>'
    )
    s.append(
        f'<text transform="translate(14,{(PAD_T+H-PAD_B)/2}) rotate(-90)" '
        f'fill="{FAINT}" text-anchor="middle" letter-spacing="0.08em">{ylab}</text>'
    )


def ticks(s, lo, hi, n, horiz, fmt=lambda v: f"{v:g}"):
    """Draw n+1 gridlines/labels between lo and hi on one axis."""
    for i in range(n + 1):
        v = lo + (hi - lo) * i / n
        if horiz:
            x = sx(v, lo, hi)
            s.append(
                f'<line x1="{x:.1f}" y1="{H-PAD_B}" x2="{x:.1f}" y2="{H-PAD_B+4}" stroke="{HAIR}"/>'
            )
            s.append(
                f'<text x="{x:.1f}" y="{H-PAD_B+18}" fill="{FAINT}" text-anchor="middle">{fmt(v)}</text>'
            )
        else:
            y = sy(v, lo, hi)
            s.append(
                f'<line x1="{PAD_L}" y1="{y:.1f}" x2="{W-PAD_R}" y2="{y:.1f}" '
                f'stroke="{HAIR}" stroke-dasharray="2 4"/>'
            )
            s.append(
                f'<text x="{PAD_L-8}" y="{y+3.5:.1f}" fill="{FAINT}" text-anchor="end">{fmt(v)}</text>'
            )


def sx(v, lo, hi):
    return PAD_L + (v - lo) / (hi - lo) * (W - PAD_R - PAD_L)


def sy(v, lo, hi):
    return (H - PAD_B) - (v - lo) / (hi - lo) * (H - PAD_B - PAD_T)


def write(name: str, lines: list[str]) -> None:
    p = OUT / f"{name}.svg"
    p.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"  wrote {p.relative_to(SITE)}  ({p.stat().st_size} bytes)")


# ---------------------------------------------------------------------------
# FIG 1  format tax: file size does not predict decode speed on the A76
# ---------------------------------------------------------------------------
LABELS = {                      # tag -> (dx, dy, text-anchor)
    "Q2_K":   (-12, 16, "end"),
    "IQ4_XS": (-46, -2, "end"),
    "Q4_0":   (-10, -14, "end"),
    "IQ4_NL": (14, -10, "start"),
    "Q3_K_M": (34, 16, "middle"),
    "Q4_K_M": (0, 18, "middle"),
    "Q6_K":   (0, 18, "middle"),
    "Q8_0":   (0, -13, "middle"),
}


def fig_format_tax():
    src = (
        ROOT
        / "edge-inference-research-portfolio/paper16-format-tax/data/pi5_canonical.jsonl"
    )
    rows = [json.loads(l) for l in src.read_text(encoding="utf-8").splitlines() if l.strip()]
    # Everything at two threads. Fixing the thread count is what makes the
    # comparison a format comparison; it is also where this board is fastest
    # for seven of the eight. Q4_K_M is the exception and does slightly better
    # at three, which is reported alongside rather than quietly used here.
    best = {r["tag"]: r for r in rows if r["threads"] == 2}
    anybest: dict[str, dict] = {}
    for r in rows:
        t = r["tag"]
        if t not in anybest or r["tok_s"] > anybest[t]["tok_s"]:
            anybest[t] = r
    pts = sorted(best.values(), key=lambda r: r["bytes"])

    xlo, xhi = 380, 700          # MB
    ylo, yhi = 15, 42            # tok/s
    s = head("fmt", "Decode throughput against file size for eight quantization "
                    "formats of the same model on a Raspberry Pi 5")
    axes(s, "GGUF FILE SIZE (MB)", "DECODE (TOKENS/S)")
    ticks(s, ylo, yhi, 5, False)
    ticks(s, xlo, xhi, 4, True)

    # what pure byte-streaming would predict, anchored on the fastest point
    ref = max(pts, key=lambda r: r["tok_s"])
    bw = ref["tok_s"] * ref["bytes"]
    d = []
    for i in range(61):
        mb = xlo + (xhi - xlo) * i / 60
        d.append(f"{sx(mb,xlo,xhi):.1f},{sy(bw/(mb*1e6),ylo,yhi):.1f}")
    s.append(
        f'<polyline points="{" ".join(d)}" fill="none" stroke="{MUTED}" '
        'stroke-width="1.25" stroke-dasharray="5 4"/>'
    )
    s.append(
        f'<text x="{sx(628,xlo,xhi):.0f}" y="{sy(24.6,ylo,yhi):.0f}" fill="{MUTED}">'
        "if only bytes mattered</text>"
    )

    for r in pts:
        mb = r["bytes"] / 1e6
        x, y = sx(mb, xlo, xhi), sy(r["tok_s"], ylo, yhi)
        hot = r["tag"] in ("Q4_K_M", "IQ4_XS")
        col = ACCENT if hot else FG
        s.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{5 if hot else 3.5}" fill="{col}"/>')
        # The four 4-bit formats land within 4 MB of each other, so the labels
        # are placed by hand with a leader line rather than nudged and hoped.
        dx, dy, anchor = LABELS.get(r["tag"], (0, -12, "middle"))
        s.append(
            f'<text x="{x+dx:.1f}" y="{y+dy:.1f}" fill="{col}" text-anchor="{anchor}" '
            f'font-size="10.5">{r["tag"]}</text>'
        )
        if abs(dx) > 12 or abs(dy) > 16:
            s.append(
                f'<line x1="{x:.1f}" y1="{y:.1f}" x2="{x+dx*0.82:.1f}" '
                f'y2="{y+dy*0.72:.1f}" stroke="{col}" stroke-width="0.75" opacity="0.45"/>'
            )

    a = best["Q4_K_M"]
    b = best["IQ4_XS"]
    s.append(
        f'<line x1="{sx(a["bytes"]/1e6,xlo,xhi):.1f}" y1="{sy(a["tok_s"],ylo,yhi):.1f}" '
        f'x2="{sx(b["bytes"]/1e6,xlo,xhi):.1f}" y2="{sy(b["tok_s"],ylo,yhi):.1f}" '
        f'stroke="{ACCENT}" stroke-width="1" stroke-dasharray="3 3" opacity="0.8"/>'
    )
    # Two directions, and they are not interchangeable in a caption.
    #
    #   faster_pct  how much quicker IQ4_XS is, against Q4_K_M as the base
    #   slower_pct  how far Q4_K_M falls short, against IQ4_XS as the base
    #
    # The sentence is "the default is X% slower", so X is slower_pct. The post
    # settled this explicitly: the two are the same gap counted from opposite
    # ends, and the smaller one is the honest thing to put next to a 44 percent
    # energy figure. This used to emit faster_pct into a caption that said
    # "slower", which overwrote the corrected figure every time anyone re-ran
    # inject_figs.py. Do not swap these back.
    faster = (b["tok_s"] / a["tok_s"] - 1) * 100
    slower = (1 - a["tok_s"] / b["tok_s"]) * 100
    en = (a["mJ_per_tok"] / b["mJ_per_tok"] - 1) * 100
    s.append(
        f'<text x="{PAD_L+10}" y="{PAD_T+4}" fill="{ACCENT}" font-size="11.5">'
        f"the default is {slower:.0f}% slower and uses {en:.0f}% more energy per token"
        "</text>"
    )
    s += tail()
    write("fig-format-tax", s)
    fair = (1 - anybest["Q4_K_M"]["tok_s"] / anybest["IQ4_XS"]["tok_s"]) * 100
    return {"gap_pct": slower, "faster_pct": faster, "energy_pct": en, "points": len(pts),
            "gap_at_own_best_pct": fair,
            "q4km_best_threads": anybest["Q4_K_M"]["threads"]}


# ---------------------------------------------------------------------------
# FIG 2  the decode roofline on a laptop
# ---------------------------------------------------------------------------
def fig_roofline():
    src = ROOT / "llama-roofline/examples/x86-i7-12700H/roofline.json"
    d = json.loads(src.read_text(encoding="utf-8"))
    ms = [m for m in d["analysis"]["models"] if m.get("ok") and m.get("decode_ts")]
    pts = [(m["bytes_per_token"] / 1e9, m["decode_ts"], m["quant"], m["name"]) for m in ms]
    pts.sort()

    xlo, xhi = 0, 5.0
    ylo, yhi = 0, 120
    s = head("roof", "Decode throughput falls as one over model size across seven "
                     "models on one laptop")
    axes(s, "BYTES READ PER TOKEN (GB)", "DECODE (TOKENS/S)")
    ticks(s, ylo, yhi, 3, False)
    ticks(s, xlo, xhi, 5, True, lambda v: f"{v:.0f}" if v == int(v) else f"{v:.1f}")

    bw = d["analysis"].get("fit", {}).get("bw_GBs") or d["analysis"].get("roofline_bw_GBs")
    if bw is None:                       # fit it here, same least squares as the tool
        num = sum(t / g for g, t, _, _ in pts if g)
        den = sum(1 / (g * g) for g, _, _, _ in pts if g)
        bw = num / den
    dd = []
    for i in range(1, 401):
        g = xlo + (xhi - xlo) * i / 400
        if bw / g > yhi:
            continue
        dd.append(f"{sx(g,xlo,xhi):.1f},{sy(bw/g,ylo,yhi):.1f}")
    s.append(
        f'<polyline points="{" ".join(dd)}" fill="none" stroke="{ACCENT}" stroke-width="1.5"/>'
    )
    for g, t, q, n in pts:
        x, y = sx(g, xlo, xhi), sy(t, ylo, yhi)
        s.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4" fill="{FG}"/>')
    lab = pts[0]
    s.append(
        f'<text x="{sx(lab[0],xlo,xhi)+8:.0f}" y="{sy(lab[1],ylo,yhi)+4:.0f}" fill="{MUTED}" '
        f'font-size="10.5">{lab[2]}, {lab[0]*1e3:.0f} MB</text>'
    )
    lab = pts[-1]
    s.append(
        f'<text x="{sx(lab[0],xlo,xhi)-8:.0f}" y="{sy(lab[1],ylo,yhi)-8:.0f}" fill="{MUTED}" '
        f'text-anchor="end" font-size="10.5">{lab[2]}, {lab[0]:.1f} GB</text>'
    )
    s.append(
        f'<text x="{W-PAD_R}" y="{PAD_T+4}" fill="{ACCENT}" text-anchor="end" font-size="11.5">'
        f"tokens/s = {bw:.2f} GB/s / model bytes</text>"
    )
    s += tail()
    write("fig-roofline", s)
    return {"bw": bw, "n": len(pts)}


# ---------------------------------------------------------------------------
# FIG 3  energy against clock: the minimum is not at the right-hand edge
# ---------------------------------------------------------------------------
def fig_energy(rows):
    """rows: [(clock_MHz, energy_mJ, label)] highest-level summary from paper 10."""
    xs = [r[0] for r in rows]
    ys = [r[1] for r in rows]
    xlo, xhi = min(xs) - 100, max(xs) + 100
    ylo, yhi = min(ys) * 0.94, max(ys) * 1.04
    s = head("energy", "Energy per inference against CPU clock, with the minimum "
                       "below the maximum clock")
    axes(s, "CPU CLOCK (MHz)", "ENERGY PER INFERENCE (mJ)")
    ticks(s, ylo, yhi, 4, False, lambda v: f"{v:.0f}")
    for mhz in xs:
        x = sx(mhz, xlo, xhi)
        s.append(f'<line x1="{x:.1f}" y1="{H-PAD_B}" x2="{x:.1f}" y2="{H-PAD_B+4}" stroke="{HAIR}"/>')
        s.append(f'<text x="{x:.1f}" y="{H-PAD_B+18}" fill="{FAINT}" text-anchor="middle">{mhz}</text>')

    d = " ".join(f"{sx(x,xlo,xhi):.1f},{sy(y,ylo,yhi):.1f}" for x, y in zip(xs, ys))
    s.append(f'<polyline points="{d}" fill="none" stroke="{ACCENT}" stroke-width="1.75"/>')
    lo_i = ys.index(min(ys))
    for i, (x, y) in enumerate(zip(xs, ys)):
        px, py = sx(x, xlo, xhi), sy(y, ylo, yhi)
        s.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{5.5 if i==lo_i else 4}" '
                 f'fill="{ACCENT if i==lo_i else FG}"/>')
    px, py = sx(xs[lo_i], xlo, xhi), sy(ys[lo_i], ylo, yhi)
    s.append(f'<text x="{px:.1f}" y="{py+20:.1f}" fill="{ACCENT}" text-anchor="middle">'
             "cheapest</text>")
    px, py = sx(xs[-1], xlo, xhi), sy(ys[-1], ylo, yhi)
    s.append(f'<text x="{px-6:.1f}" y="{py-10:.1f}" fill="{MUTED}" text-anchor="end">'
             "flat out</text>")
    s += tail()
    write("fig-energy", s)


# ---------------------------------------------------------------------------
# FIG 4  INT8 speedups, Arm against x86, with the sign flips marked
# ---------------------------------------------------------------------------
def fig_int8(models):
    """models: [(name, arm_speedup, x86_speedup)]"""
    s = head("int8", "INT8 speedup over FP32 for nine networks on Arm and on x86, "
                     "including the ones that get slower")
    global H
    n = len(models)
    row = 30
    top = 66
    s[0] = s[0].replace(f'viewBox="0 0 {W} {H}"', f'viewBox="0 0 {W} {top + n*row + 12}"')
    lo, hi = 0.0, 3.0
    x0, x1 = 170, W - 30
    one = x0 + (1.0 - lo) / (hi - lo) * (x1 - x0)

    for v in (0.5, 1.0, 1.5, 2.0, 2.5, 3.0):
        x = x0 + (v - lo) / (hi - lo) * (x1 - x0)
        s.append(f'<line x1="{x:.1f}" y1="{top-14}" x2="{x:.1f}" y2="{top + n*row - 10}" '
                 f'stroke="{HAIR}" stroke-dasharray="2 4"/>')
        s.append(f'<text x="{x:.1f}" y="{top-20}" fill="{FAINT}" text-anchor="middle">'
                 f'{v:g}x</text>')
    s.append(f'<line x1="{one:.1f}" y1="{top-14}" x2="{one:.1f}" y2="{top + n*row - 10}" '
             f'stroke="{MUTED}" stroke-width="1.25"/>')
    s.append(f'<text x="{one:.1f}" y="{top-34}" fill="{MUTED}" text-anchor="middle">'
             "no change</text>")

    for i, (name, arm, x86) in enumerate(models):
        y = top + i * row
        s.append(f'<text x="160" y="{y+4}" fill="{FG}" text-anchor="end" font-size="10.5">'
                 f'{name}</text>')
        for val, col, off in ((arm, ACCENT, -5), (x86, MUTED, 5)):
            xv = x0 + (val - lo) / (hi - lo) * (x1 - x0)
            s.append(f'<line x1="{one:.1f}" y1="{y+off}" x2="{xv:.1f}" y2="{y+off}" '
                     f'stroke="{col}" stroke-width="4" stroke-linecap="butt"/>')
        if (arm - 1) * (x86 - 1) < 0:
            s.append(f'<text x="{x1}" y="{y+4}" fill="{ACCENT}" text-anchor="end" '
                     'font-size="10">changes sign</text>')
    s.append(f'<text x="24" y="{top-34}" fill="{ACCENT}" font-size="10.5">'
             "Arm Cortex-A76</text>")
    s.append(f'<text x="24" y="{top-20}" fill="{MUTED}" font-size="10.5">'
             "x86 Golden Cove</text>")
    s += tail()
    write("fig-int8", s)


# ---------------------------------------------------------------------------
# FIG 8  the container costs nothing measurable; the quota costs 64 percent
# ---------------------------------------------------------------------------
def fig_container(arms):
    """arms: [(label, mean_pct, [per-model pct], resolvable_band_pct)]

    Horizontal, because the story is one bar sitting a long way from the others
    and that reads better across than up. The shaded band is the width this
    measurement can actually resolve, so a bar inside it is a bar you are not
    allowed to interpret.
    """
    s = head("container", "Decode throughput in a Kubernetes pod relative to an "
                          "uncontainerised process on the same machine")
    n = len(arms)
    row = 46
    top = 78
    bottom = top + n * row + 26
    s[0] = s[0].replace(f'viewBox="0 0 {W} {H}"', f'viewBox="0 0 {W} {bottom}"')

    lo, hi = -75.0, 15.0
    x0, x1 = 178, W - 34
    zero = x0 + (0.0 - lo) / (hi - lo) * (x1 - x0)
    band = arms[0][3]
    bl = x0 + (-band - lo) / (hi - lo) * (x1 - x0)
    br = x0 + (band - lo) / (hi - lo) * (x1 - x0)

    s.append(f'<rect x="{bl:.1f}" y="{top-18}" width="{br-bl:.1f}" '
             f'height="{n*row - 4}" fill="{MUTED}" opacity="0.09"/>')
    s.append(f'<text x="{(bl+br)/2:.1f}" y="{top-26}" fill="{MUTED}" '
             'text-anchor="middle" font-size="10.5">cannot resolve</text>')

    for v in (-75, -60, -45, -30, -15, 0, 15):
        x = x0 + (v - lo) / (hi - lo) * (x1 - x0)
        s.append(f'<line x1="{x:.1f}" y1="{top-18}" x2="{x:.1f}" '
                 f'y2="{top + n*row - 22}" stroke="{HAIR}" stroke-dasharray="2 4"/>')
        s.append(f'<text x="{x:.1f}" y="{top + n*row - 6}" fill="{FAINT}" '
                 f'text-anchor="middle">{v:+g}%</text>')
    s.append(f'<line x1="{zero:.1f}" y1="{top-18}" x2="{zero:.1f}" '
             f'y2="{top + n*row - 22}" stroke="{MUTED}" stroke-width="1.25"/>')

    for i, (label, mean, points, _b) in enumerate(arms):
        y = top + i * row
        col = ACCENT if abs(mean) > band else FG
        s.append(f'<text x="168" y="{y+4}" fill="{FG}" text-anchor="end" '
                 f'font-size="10.5">{label}</text>')
        xm = x0 + (mean - lo) / (hi - lo) * (x1 - x0)
        s.append(f'<line x1="{zero:.1f}" y1="{y}" x2="{xm:.1f}" y2="{y}" '
                 f'stroke="{col}" stroke-width="7" stroke-linecap="butt" opacity="0.85"/>')
        for pv in points:
            xp = x0 + (pv - lo) / (hi - lo) * (x1 - x0)
            s.append(f'<circle cx="{xp:.1f}" cy="{y+13}" r="2.4" fill="{col}" '
                     'opacity="0.75"/>')
        s.append(f'<text x="{xm + (7 if mean > 0 else -7):.1f}" y="{y+4}" fill="{col}" '
                 f'text-anchor="{"start" if mean > 0 else "end"}" font-size="10.5">'
                 f'{mean:+.1f}%</text>')

    s.append(f'<text x="24" y="{top-26}" fill="{FAINT}" font-size="10.5">'
             "each dot is one model</text>")
    s += tail()
    write("fig-container", s)


# ---------------------------------------------------------------------------
# FIG 5  where the cold-start wake actually goes
# ---------------------------------------------------------------------------
def fig_coldstart(phases):
    """phases: [(label, fraction)] summing to 1."""
    s = head("cold", "Breakdown of the wake transient on a duty-cycled edge device")
    global H
    s[0] = s[0].replace(f'viewBox="0 0 {W} {H}"', f'viewBox="0 0 {W} 240"')
    x0, x1, y, h = 40, W - 40, 96, 54
    acc = 0.0
    for i, (lab, frac) in enumerate(phases):
        w = (x1 - x0) * frac
        x = x0 + (x1 - x0) * acc
        fill = ACCENT if i == 0 else "none"
        s.append(f'<rect x="{x:.1f}" y="{y}" width="{w:.1f}" height="{h}" fill="{fill}" '
                 f'stroke="{HAIR if i else ACCENT}" stroke-width="1"/>')
        if not i:
            s.append(f'<text x="{x+w/2:.1f}" y="{y+h/2+4:.1f}" fill="var(--on-accent)" '
                     f'text-anchor="middle" font-size="11.5">{lab}</text>')
        else:
            s.append(f'<text x="{x+w/2:.1f}" y="{y+h+14+ (i-1)*16:.1f}" fill="{MUTED}" '
                     f'text-anchor="middle" font-size="10">{lab}</text>')
            s.append(f'<line x1="{x+w/2:.1f}" y1="{y+h}" x2="{x+w/2:.1f}" '
                     f'y2="{y+h+4+(i-1)*16:.1f}" stroke="{HAIR}"/>')
        s.append(f'<text x="{x+w/2:.1f}" y="{y-10:.1f}" fill="{FAINT}" text-anchor="middle" '
                 f'font-size="10">{frac*100:.0f}%</text>')
        acc += frac
    s.append(f'<text x="{x0}" y="{y-32}" fill="{FG}" font-size="11.5">'
             "one wake, broken into what it spent the time on</text>")
    s.append(f'<text x="{x0}" y="{y+h+48}" fill="{MUTED}" font-size="10.5">'
             "the first inference itself runs at full speed, so there is nothing to warm up"
             "</text>")
    s += tail()
    write("fig-coldstart", s)


# ---------------------------------------------------------------------------
# FIG 6  claims that did not survive
# ---------------------------------------------------------------------------
def fig_retractions(items):
    """items: [(what, claimed, corrected)]"""
    s = head("retr", "Four published claims and what each one became after it was rechecked")
    global H
    n = len(items)
    row = 62
    top = 42
    s[0] = s[0].replace(f'viewBox="0 0 {W} {H}"', f'viewBox="0 0 {W} {top + n*row + 10}"')
    s.append(f'<text x="24" y="{top-16}" fill="{FAINT}" letter-spacing="0.08em">'
             "FIRST CLAIMED</text>")
    s.append(f'<text x="{W//2+30}" y="{top-16}" fill="{FAINT}" letter-spacing="0.08em">'
             "WHAT IT ACTUALLY WAS</text>")
    for i, (what, claimed, corrected) in enumerate(items):
        y = top + i * row
        s.append(f'<line x1="24" y1="{y-12}" x2="{W-24}" y2="{y-12}" stroke="{HAIR}"/>')
        s.append(f'<text x="24" y="{y+6}" fill="{MUTED}" font-size="10">{what}</text>')
        s.append(f'<text x="24" y="{y+24}" fill="{FG}" font-size="12">{claimed}</text>')
        s.append(f'<text x="{W//2+30}" y="{y+24}" fill="{ACCENT}" font-size="12">'
                 f'{corrected}</text>')
    s += tail()
    write("fig-retractions", s)


# ---------------------------------------------------------------------------
# FIG 7  four campaigns, two devices, one line each
# ---------------------------------------------------------------------------
def fig_agreement(devices):
    """devices: [(label, bw_GBs, r2, [(gb, tok_s, campaign)])]"""
    s = head("agree", "The same Raspberry Pi 5 measured twice, by two different "
                      "harnesses, weeks apart")
    xlo, xhi = 0, 1.1
    ylo, yhi = 0, 40
    axes(s, "BYTES READ PER TOKEN (GB)", "DECODE (TOKENS/S)")
    ticks(s, ylo, yhi, 4, False)
    ticks(s, xlo, xhi, 4, True, lambda v: f"{v:.2f}")
    for j, (lab, bw, r2, pts) in enumerate(devices):
        col = ACCENT if j == 0 else FG
        dd = []
        for i in range(1, 401):
            g = xlo + (xhi - xlo) * i / 400
            if bw / g > yhi:
                continue
            dd.append(f"{sx(g,xlo,xhi):.1f},{sy(bw/g,ylo,yhi):.1f}")
        s.append(f'<polyline points="{" ".join(dd)}" fill="none" stroke="{col}" '
                 'stroke-width="1.4"/>')
        for g, t, camp in pts:
            x, y = sx(g, xlo, xhi), sy(t, ylo, yhi)
            if camp == 1:
                s.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4" fill="{col}"/>')
            else:
                s.append(f'<rect x="{x-3.5:.1f}" y="{y-3.5:.1f}" width="7" height="7" '
                         f'fill="none" stroke="{col}" stroke-width="1.5"/>')
        s.append(f'<text x="{W-PAD_R}" y="{PAD_T+4+j*17}" fill="{col}" text-anchor="end" '
                 f'font-size="11">{lab}: {bw:.2f} GB/s</text>')
    s.append(f'<text x="{W-PAD_R}" y="{PAD_T+8+len(devices)*17}" fill="{MUTED}" '
             'text-anchor="end" font-size="10.5">'
             "the two lines are 1.7% apart, which is why you can barely see two</text>")
    s += tail()
    write("fig-agreement", s)


# ---------------------------------------------------------------------------
# data loaders: every number below is read from a released data file
# ---------------------------------------------------------------------------
def load_energy_rows(model="mobilenetv2-12.onnx", threads=3):
    """Energy per inference against clock, from paper 10's measured grid."""
    import csv
    src = ROOT / "edge-inference-research-portfolio/paper10-energy-optimal/data/energy_grid.csv"
    by_freq: dict[int, list[float]] = {}
    with src.open(encoding="utf-8", newline="") as fh:
        for r in csv.DictReader(fh):
            if r["model"] == model and int(r["threads"]) == threads:
                by_freq.setdefault(int(r["freq"]), []).append(float(r["E_tot_mJ"]))
    return [(f, sum(v) / len(v), "") for f, v in sorted(by_freq.items())]


def load_container_arms():
    """What a pod costs against a host process, from the containerisation study.

    Read from the 50 shipped records rather than the generated summary, so this
    figure and the repo's own report have to agree by construction instead of by
    somebody remembering to copy a number across.
    """
    import statistics

    src = ROOT / "ml-systems-lab/results/containerization"
    rows = []
    for pas in ("pass1", "pass2"):
        for rec in sorted((src / pas).rglob("*.json")):
            d = json.loads(rec.read_text(encoding="utf-8"))
            if d.get("status") != "ok":
                continue
            rows.append({
                "device": d["device"]["device_id"],
                "model": d["workload"]["model"],
                "decode": d["metrics"]["decode_tps"],
                "spread": d["metrics"].get("stdev_pct"),
                "reps": d["knobs"].get("repetitions") or 1,
            })

    def mean_of(device, model, key="decode"):
        vals = [r[key] for r in rows if r["device"] == device and r["model"] == model
                and r[key] is not None]
        return statistics.mean(vals) if vals else None

    def sem(device, model):
        """Standard error of the mean, which is what a difference is judged against."""
        m, sp = mean_of(device, model), mean_of(device, model, "spread")
        reps = statistics.mean([r["reps"] for r in rows if r["device"] == device
                                and r["model"] == model])
        if m is None or sp is None:
            return None
        return (sp / 100.0) * m / (reps ** 0.5)

    models = sorted({r["model"] for r in rows})
    labels = [("k8s-unlimited", "pod, no CPU quota"),
              ("k8s-cpu8", "pod, quota 8 cores"),
              ("k8s-cpu4", "pod, quota 4 cores"),
              ("k8s-cpu2", "pod, quota 2 cores")]

    out, widths = [], []
    for device, label in labels:
        deltas = []
        for model in models:
            base, val = mean_of("wsl-host", model), mean_of(device, model)
            if not base or not val:
                continue
            deltas.append(100.0 * (val / base - 1.0))
            sa, sb = sem("wsl-host", model), sem(device, model)
            if sa and sb:
                widths.append(200.0 * ((sa ** 2 + sb ** 2) ** 0.5) / base)
        out.append([label, statistics.mean(deltas), deltas, 0.0])

    # One band for the whole chart: the median of the per-point two-sigma widths.
    band = statistics.median(widths)
    for entry in out:
        entry[3] = band
    return [tuple(e) for e in out], band, len(rows), models


def load_int8_rows():
    """Best INT8 speedup per model on each instruction set, from paper 14."""
    def best(fname):
        d = json.loads((P14 / fname).read_text(encoding="utf-8"))
        out: dict[str, float] = {}
        for r in d["rows"]:
            m, v = r.get("model"), r.get("variant")
            if not m or m.endswith("-int8s") or not v or not v.startswith("int8"):
                continue
            sp = r.get("speedup_vs_fp32")
            if sp and r.get("ok", True):
                out[m] = max(out.get(m, 0.0), sp)
        return out

    arm, x86 = best("data/arm_zoo9_t4.json"), best("data/zoo9_x86_t4.json")
    rows = [(m, arm[m], x86[m]) for m in sorted(set(arm) & set(x86))]
    rows.sort(key=lambda r: -r[1])
    short = {
        "densenet-12": "densenet-121",
        "efficientnet-lite4-11": "efficientnet-lite4",
        "googlenet-12": "googlenet",
        "mobilenetv2-10": "mobilenetv2 (v10)",
        "mobilenetv2-12": "mobilenetv2 (v12)",
        "resnet18-v1-7": "resnet-18",
        "resnet50-v1-7": "resnet-50",
        "shufflenet-v2-10": "shufflenet-v2",
        "squeezenet1.1-7": "squeezenet 1.1",
    }
    return [(short.get(m, m), a, x) for m, a, x in rows]


def load_coldstart_phases():
    """Median share of the wake spent in each phase, across paper 11's models."""
    src = P11 / "data/e1_decomposition.json"
    d = json.loads(src.read_text(encoding="utf-8"))
    keys = [("reading the weights off flash", "disk_read"),
            ("building the graph", "build_alloc"),
            ("first inference", "first_infer")]
    shares: dict[str, list[float]] = {k: [] for k, _ in keys}
    for m, rec in d.items():
        total = rec["total_wake"]["median"]
        for label, k in keys:
            shares[label].append(rec[k]["median"] / total)
    med = {}
    for label, vals in shares.items():
        vals.sort()
        med[label] = vals[len(vals) // 2]
    tot = sum(med.values())
    return [(label, med[label] / tot) for label, _ in keys]


def load_agreement():
    """
    The two Raspberry Pi 5 campaigns, side by side.

    `pi5-2gb` is paper 12's own measurements backfilled into the framework's
    record schema; `pi5` is the campaign the framework ran itself weeks later,
    over SSH, with its own telemetry. The published effective bandwidths are
    10.70 and 10.52 GB/s (results/README.md and the repository README), and
    those are the numbers drawn, not a fit made here.
    """
    src = ROOT / "ml-systems-lab/results/combined-report/REPORT.md"
    rows, inside = [], False
    for line in src.read_text(encoding="utf-8").splitlines():
        if line.startswith("| device | model | quant | thr | MB |"):
            inside = True
            continue
        if inside and not line.startswith("|"):
            inside = False
        if not inside:
            continue
        c = [x.strip() for x in line.strip().strip("|").split("|")]
        if len(c) < 9 or c[0].startswith("-"):
            continue
        try:
            mb, dec = float(c[4].replace(",", "")), float(c[6])
        except ValueError:
            continue
        rows.append((c[0], c[1], mb, dec))

    campaigns = [
        ("Paper 12, hand-rolled scripts", "pi5-2gb", 10.70, "0.980", 1),
        ("ml-systems-lab, weeks later", "pi5", 10.52, "0.99", 2),
    ]
    out = []
    for label, dev, bw, r2, marker in campaigns:
        best = {}
        for d, model, mb, dec in rows:
            if d != dev:
                continue
            if model not in best or dec > best[model][1]:
                best[model] = (mb / 1000.0, dec)
        out.append((label, bw, r2, [(g, t, marker) for g, t in best.values()]))
    return out


P14 = ROOT / "edge-inference-research-portfolio/paper14-onnx-format"
P11 = ROOT / "edge-inference-research-portfolio/paper11-cold-start-tax"

# The one figure not drawn from a data file. Each pair is a claim this
# programme published and the number that replaced it after a recheck; the
# sources are named in the post that carries the figure.
RETRACTIONS = [
    ("ONNX export format, INT8 on Cortex-A76",
     "40x latency swing", "the format is worth about 18%"),
    ("what makes INT8 fast on an edge CPU",
     "the export representation", "dynamic against static, worth over 4x"),
    ("variance floor on a consumer laptop GPU",
     "irreducible", "explained by SM clock state"),
    ("storage during a cold wake",
     "no software headroom left", "the wake runs at 76 to 82%"),
]


if __name__ == "__main__":
    print("figures:")
    f1 = fig_format_tax()
    f2 = fig_roofline()

    er = load_energy_rows()
    fig_energy(er)
    i8 = load_int8_rows()
    fig_int8(i8)
    cs = load_coldstart_phases()
    fig_coldstart(cs)
    fig_retractions(RETRACTIONS)
    ag = load_agreement()
    fig_agreement(ag)
    ca, band, nrec, cmodels = load_container_arms()
    fig_container(ca)
    print()
    print("numbers, for the prose:")
    print(f"  format tax   at 2 threads the default is {f1['gap_pct']:.1f}% behind and burns "
          f"{f1['energy_pct']:.1f}% more energy per token, over {f1['points']} formats; at its "
          f"own best ({f1['q4km_best_threads']} threads) it is still "
          f"{f1['gap_at_own_best_pct']:.1f}% behind")
    print(f"               the same gap the other way round is {f1['faster_pct']:.1f}% faster "
          "for IQ4_XS. Quote the first one; it is the smaller and the honest one")
    print(f"  roofline     {f2['bw']:.2f} GB/s fitted over {f2['n']} models")
    lo = min(er, key=lambda r: r[1])
    hi = er[-1]
    print(f"  energy       min {lo[1]:.1f} mJ at {lo[0]} MHz against {hi[1]:.1f} mJ at "
          f"{hi[0]} MHz, so flat out wastes {(hi[1]/lo[1]-1)*100:.1f}%")
    flips = [m for m, a, x in i8 if (a - 1) * (x - 1) < 0]
    print(f"  int8         best {max(r[1] for r in i8):.2f}x on Arm, "
          f"worst {min(r[1] for r in i8):.2f}x; {len(flips)} of {len(i8)} change sign "
          f"({', '.join(flips)})")
    print("  cold start   " + ", ".join(f"{l} {v*100:.0f}%" for l, v in cs))
    for lab, bw, r2, pts in ag:
        print(f"  agreement    {lab}: {len(pts)} points on {bw} GB/s, R2 {r2}")
    print(f"  container    {nrec} records over {len(cmodels)} models; this measurement "
          f"resolves differences wider than {band:.1f}%")
    for lab, mean, pts, _b in ca:
        verdict = "outside it" if abs(mean) > band else "inside the noise"
        print(f"               {lab:<20} {mean:+6.2f}%  "
              f"[{min(pts):+.1f} to {max(pts):+.1f}]  {verdict}")
