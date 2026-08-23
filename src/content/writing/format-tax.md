---
title: Two model files, almost the same size, a third apart in speed
description: The label on a quantized model file is not a promise about what it costs to run. On a Raspberry Pi 5 the most popular format was the slowest thing I measured that week, and it used 44 percent more power to get there.
date: 2026-12-04
kind: Measurement
topics: ['Quantization', 'llama.cpp', 'Raspberry Pi 5', 'Energy']
readingTime: 7
draft: true
---

I was trying to settle an argument with myself about which quantized model to put
on a Raspberry Pi, and I expected the answer to be boring. Smaller file, faster
model. Everybody knows this. When a computer generates text one word at a time,
it has to read the entire model out of memory for every single word it produces,
so the size of the file on disk is more or less the size of the bill.

That is roughly true. It is also not the whole story, and the part it misses is
large enough to change what you should ship.

Eight versions of the same small language model, all quantized down to different
formats, all measured on the same board on the same afternoon. Four of them come
out within four megabytes of each other. They do not run at the same speed.

<figure>
<!--FIG:fig-format-tax-->
<svg viewBox="0 0 720 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="t-fmt d-fmt" style="width:100%;height:auto;display:block;overflow:visible">
<title id="t-fmt">Decode throughput against file size for eight quantization formats of the same model on a Raspberry Pi 5</title>
<desc id="d-fmt">Decode throughput against file size for eight quantization formats of the same model on a Raspberry Pi 5</desc>
<g font-family="ui-monospace, JetBrains Mono Variable, monospace" font-size="11">
<line x1="62" y1="354" x2="698" y2="354" stroke="var(--hairline)" stroke-width="1"/>
<line x1="62" y1="30" x2="62" y2="354" stroke="var(--hairline)" stroke-width="1"/>
<text x="380.0" y="392" fill="var(--fg-faint)" text-anchor="middle" letter-spacing="0.08em">GGUF FILE SIZE (MB)</text>
<text transform="translate(14,192.0) rotate(-90)" fill="var(--fg-faint)" text-anchor="middle" letter-spacing="0.08em">DECODE (TOKENS/S)</text>
<line x1="62" y1="354.0" x2="698" y2="354.0" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="54" y="357.5" fill="var(--fg-faint)" text-anchor="end">15</text>
<line x1="62" y1="289.2" x2="698" y2="289.2" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="54" y="292.7" fill="var(--fg-faint)" text-anchor="end">20.4</text>
<line x1="62" y1="224.4" x2="698" y2="224.4" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="54" y="227.9" fill="var(--fg-faint)" text-anchor="end">25.8</text>
<line x1="62" y1="159.6" x2="698" y2="159.6" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="54" y="163.1" fill="var(--fg-faint)" text-anchor="end">31.2</text>
<line x1="62" y1="94.8" x2="698" y2="94.8" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="54" y="98.3" fill="var(--fg-faint)" text-anchor="end">36.6</text>
<line x1="62" y1="30.0" x2="698" y2="30.0" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="54" y="33.5" fill="var(--fg-faint)" text-anchor="end">42</text>
<line x1="62.0" y1="354" x2="62.0" y2="358" stroke="var(--hairline)"/>
<text x="62.0" y="372" fill="var(--fg-faint)" text-anchor="middle">380</text>
<line x1="221.0" y1="354" x2="221.0" y2="358" stroke="var(--hairline)"/>
<text x="221.0" y="372" fill="var(--fg-faint)" text-anchor="middle">460</text>
<line x1="380.0" y1="354" x2="380.0" y2="358" stroke="var(--hairline)"/>
<text x="380.0" y="372" fill="var(--fg-faint)" text-anchor="middle">540</text>
<line x1="539.0" y1="354" x2="539.0" y2="358" stroke="var(--hairline)"/>
<text x="539.0" y="372" fill="var(--fg-faint)" text-anchor="middle">620</text>
<line x1="698.0" y1="354" x2="698.0" y2="358" stroke="var(--hairline)"/>
<text x="698.0" y="372" fill="var(--fg-faint)" text-anchor="middle">700</text>
<polyline points="62.0,64.7 72.6,71.2 83.2,77.5 93.8,83.7 104.4,89.7 115.0,95.5 125.6,101.2 136.2,106.7 146.8,112.1 157.4,117.4 168.0,122.5 178.6,127.5 189.2,132.4 199.8,137.1 210.4,141.8 221.0,146.3 231.6,150.8 242.2,155.1 252.8,159.4 263.4,163.5 274.0,167.6 284.6,171.6 295.2,175.4 305.8,179.2 316.4,183.0 327.0,186.6 337.6,190.2 348.2,193.7 358.8,197.1 369.4,200.5 380.0,203.8 390.6,207.0 401.2,210.2 411.8,213.3 422.4,216.3 433.0,219.3 443.6,222.2 454.2,225.1 464.8,228.0 475.4,230.7 486.0,233.5 496.6,236.1 507.2,238.8 517.8,241.3 528.4,243.9 539.0,246.4 549.6,248.8 560.2,251.2 570.8,253.6 581.4,255.9 592.0,258.2 602.6,260.5 613.2,262.7 623.8,264.9 634.4,267.0 645.0,269.2 655.6,271.2 666.2,273.3 676.8,275.3 687.4,277.3 698.0,279.3" fill="none" stroke="var(--fg-muted)" stroke-width="1.25" stroke-dasharray="5 4"/>
<text x="555" y="239" fill="var(--fg-muted)">if only bytes mattered</text>
<circle cx="131.9" cy="152.4" r="3.5" fill="var(--fg)"/>
<text x="119.9" y="168.4" fill="var(--fg)" text-anchor="end" font-size="10.5">Q2_K</text>
<circle cx="157.4" cy="123.2" r="5" fill="var(--accent)"/>
<text x="111.4" y="121.2" fill="var(--accent)" text-anchor="end" font-size="10.5">IQ4_XS</text>
<line x1="157.4" y1="123.2" x2="119.7" y2="121.8" stroke="var(--accent)" stroke-width="0.75" opacity="0.45"/>
<circle cx="158.9" cy="118.1" r="3.5" fill="var(--fg)"/>
<text x="148.9" y="104.1" fill="var(--fg)" text-anchor="end" font-size="10.5">Q4_0</text>
<circle cx="163.1" cy="123.2" r="3.5" fill="var(--fg)"/>
<text x="177.1" y="113.2" fill="var(--fg)" text-anchor="start" font-size="10.5">IQ4_NL</text>
<line x1="163.1" y1="123.2" x2="174.6" y2="116.0" stroke="var(--fg)" stroke-width="0.75" opacity="0.45"/>
<circle cx="165.4" cy="133.8" r="3.5" fill="var(--fg)"/>
<text x="199.4" y="149.8" fill="var(--fg)" text-anchor="middle" font-size="10.5">Q3_K_M</text>
<line x1="165.4" y1="133.8" x2="193.3" y2="145.4" stroke="var(--fg)" stroke-width="0.75" opacity="0.45"/>
<circle cx="283.4" cy="225.9" r="5" fill="var(--accent)"/>
<text x="283.4" y="243.9" fill="var(--accent)" text-anchor="middle" font-size="10.5">Q4_K_M</text>
<line x1="283.4" y1="225.9" x2="283.4" y2="238.9" stroke="var(--accent)" stroke-width="0.75" opacity="0.45"/>
<circle cx="599.4" cy="253.3" r="3.5" fill="var(--fg)"/>
<text x="599.4" y="271.3" fill="var(--fg)" text-anchor="middle" font-size="10.5">Q6_K</text>
<line x1="599.4" y1="253.3" x2="599.4" y2="266.2" stroke="var(--fg)" stroke-width="0.75" opacity="0.45"/>
<circle cx="649.7" cy="267.3" r="3.5" fill="var(--fg)"/>
<text x="649.7" y="254.3" fill="var(--fg)" text-anchor="middle" font-size="10.5">Q8_0</text>
<line x1="283.4" y1="225.9" x2="157.4" y2="123.2" stroke="var(--accent)" stroke-width="1" stroke-dasharray="3 3" opacity="0.8"/>
<text x="72" y="34" fill="var(--accent)" font-size="11.5">the default is 33% slower and uses 44% more energy per token</text>
</g>
</svg>
<!--/FIG-->
<figcaption>
Qwen2.5-0.5B on a Raspberry Pi 5, Cortex-A76, two threads, llama.cpp. Every point
is the same model in a different quantization format. The dashed line is what you
would get if the number of bytes were the only thing that mattered. Energy comes
from the board's own power-management chip at 10 Hz.
Data: <a href="https://github.com/manunicholasjacob/edge-format-tax">edge-format-tax</a>.
</figcaption>
</figure>

## The default is the one that hurts

Look at where Q4_K_M sits.

Q4_K_M is the format almost everybody downloads. It is what the popular model
repositories put at the top of the list, it is what most tutorials tell you to
use, and on this board it was the slowest four-bit option I measured, by a
distance. Against IQ4_XS, a format of near-identical quality on the standard
perplexity check, it ran 33 percent behind and drew 44 percent more energy for
every word it produced.

That last number is the one I did not expect. Energy per word is supposed to
track time per word fairly closely, because the board draws roughly the same
power either way. Here the gap in energy was wider than the gap in speed, which
means the slower format was also drawing more watts while it was slow.

Q4_K_M does slightly better if you give it three threads instead of two. Even at
its own best setting it is still 24 percent behind, so the thread count is not
the explanation.

## Same label, different file

The other half of this is worse, because it undermines the idea that a format
name means anything at all.

Take two files. Same format label, same nominal bit width, same architecture,
same model. Build one of them by quantizing directly from the original
full-precision weights. Build the other by quantizing from an already-compressed
copy, which is what a lot of publicly posted model files actually are, because
somebody downloaded a quantized file and re-quantized it. The two files decode up
to 38 percent apart.

Nothing about the name tells you which one you have. Nothing in the file's
metadata tells you either, in any form a normal user would see. The layout inside
the file changed, some of the tensors ended up in different internal types, and
the runtime hit a different set of hand-written kernels as a result.

There is a related detail that took me a while to accept. On a model this small,
the output layer alone is over 40 percent of everything read per word. So a
quantizer's decision about how to handle that one layer, which is a decision most
people never see and never make, moves the whole result.

## The ranking is a property of your machine

I ran the same eight formats on an Intel laptop, on both kinds of core it has.

The winner changed. On the fast cores of the laptop, Q4_0 came out on top. On the
slow, power-efficient cores of the same chip, IQ4_NL won by 19 percent and Q4_0
was mid-pack. On the Raspberry Pi the whole four-bit group converged and there
was barely anything to choose between them.

Three processors, three different answers, one set of files. Which means that a
recommendation of the form "use format X, it is the fastest" is incomplete
without naming the processor, and most such recommendations do not.

I think the reason is unglamorous. These formats are decoded by hand-optimised
routines written per instruction set, and the coverage is uneven. Somebody wrote a
fast path for this format on this architecture and nobody has yet written one for
that format on that architecture. The gaps move as the projects evolve. So does
the ranking.

## What I would do with this

If you are picking a quantization for a device you control, measure it on that
device. It takes an afternoon and the answer will not match the leaderboard.

If you are running on battery or on a power budget, measure energy, not just
speed. They did not move together here and I do not think they generally do.

If you publish quantized model files, say what you quantized from. That single
line of provenance would have saved me two days.

The measurements, the raw benchmark output, the quantization logs and the scripts
that produced all of it are in
[edge-format-tax](https://github.com/manunicholasjacob/edge-format-tax), archived
at [10.5281/zenodo.21938812](https://doi.org/10.5281/zenodo.21938812). The Pi run
is one shell script:

```bash
git clone https://github.com/manunicholasjacob/edge-format-tax
cd edge-format-tax
bash code/bitfloor_pi.sh          # llama-bench sweep plus 10 Hz PMIC sampling
python code/gen_fig1.py           # rebuild the figure from data/
```

This is a paper under submission rather than a published result, so treat it as
something I measured and not as something a referee has agreed with yet.

What I would really like is the same eight files on hardware I do not own. Apple
Silicon in particular, where the memory system is different enough that the
ranking might come out somewhere else again. If you run it, I would like to see
the numbers.
