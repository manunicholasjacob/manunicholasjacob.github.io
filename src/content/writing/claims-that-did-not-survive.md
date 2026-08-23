---
title: Four numbers I published that turned out to be wrong
description: Four headline claims from my own measurement work did not survive being rechecked. What each one was, how it broke, and the thing three of the four have in common.
date: 2026-09-03
kind: Method
topics: ['Reproducibility', 'Negative results', 'Method']
readingTime: 8
draft: true
---

The rule I put on the lab page is that a negative result gets published. It is
easy to write that down. It is less comfortable when the negative result is about
something you already wrote down as positive.

Four claims came out of this programme, went into drafts, and then failed a
recheck. One of them had already reached a public repository, which now carries a
notice at the top of its README saying so. All four came off. Three of the papers
that carried them were rewritten around whatever the data actually supported. The
fourth was not worth rewriting and is not being pursued.

<figure>
<!--FIG:fig-retractions-->
<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="t-retr d-retr" style="width:100%;height:auto;display:block;overflow:visible">
<title id="t-retr">Four published claims and what each one became after it was rechecked</title>
<desc id="d-retr">Four published claims and what each one became after it was rechecked</desc>
<g font-family="ui-monospace, JetBrains Mono Variable, monospace" font-size="11">
<text x="24" y="26" fill="var(--fg-faint)" letter-spacing="0.08em">FIRST CLAIMED</text>
<text x="390" y="26" fill="var(--fg-faint)" letter-spacing="0.08em">WHAT IT ACTUALLY WAS</text>
<line x1="24" y1="30" x2="696" y2="30" stroke="var(--hairline)"/>
<text x="24" y="48" fill="var(--fg-muted)" font-size="10">ONNX export format, INT8 on Cortex-A76</text>
<text x="24" y="66" fill="var(--fg)" font-size="12">40x latency swing</text>
<text x="390" y="66" fill="var(--accent)" font-size="12">the format is worth about 18%</text>
<line x1="24" y1="92" x2="696" y2="92" stroke="var(--hairline)"/>
<text x="24" y="110" fill="var(--fg-muted)" font-size="10">what makes INT8 fast on an edge CPU</text>
<text x="24" y="128" fill="var(--fg)" font-size="12">the export representation</text>
<text x="390" y="128" fill="var(--accent)" font-size="12">dynamic against static, worth over 4x</text>
<line x1="24" y1="154" x2="696" y2="154" stroke="var(--hairline)"/>
<text x="24" y="172" fill="var(--fg-muted)" font-size="10">variance floor on a consumer laptop GPU</text>
<text x="24" y="190" fill="var(--fg)" font-size="12">irreducible</text>
<text x="390" y="190" fill="var(--accent)" font-size="12">explained by SM clock state</text>
<line x1="24" y1="216" x2="696" y2="216" stroke="var(--hairline)"/>
<text x="24" y="234" fill="var(--fg-muted)" font-size="10">storage during a cold wake</text>
<text x="24" y="252" fill="var(--fg)" font-size="12">no software headroom left</text>
<text x="390" y="252" fill="var(--accent)" font-size="12">the wake runs at 76 to 82%</text>
</g>
</svg>
<!--/FIG-->
<figcaption>
Four headline claims from this measurement programme and what each one turned out
to be after it was checked against its own data. Each is described below.
</figcaption>
</figure>

## One. The forty-fold swing that was measuring the wrong thing

I had a result saying the choice of file format for a quantized network drove a
roughly fortyfold spread in how fast it ran. It was a striking number and it was
the whole point of the paper.

One arm of that experiment never built the file it claimed to build. It loaded a
model that had been quantized a different way entirely, dynamically rather than
statically. So the enormous gap was real, but it was the gap between dynamic and
static quantization, which is a different and much better known thing, and I had
attached it to the wrong cause.

The correct version: the file format is worth about 18 percent at its widest, and
across twenty-seven matched pairs the median difference is 1.5 percent. Dynamic
against static is worth more than four times. Two later papers exist mostly to
say this properly.

The check that caught it was reading the operator list inside the file the script
had supposedly produced, and finding operators that only appear in dynamic
quantization. Nothing errored. The script ran clean the whole time.

## Two. The variance floor that was not irreducible

A methodology paper about profiling a consumer laptop GPU reported a floor on
run-to-run variance that the protocol could not get below, and called it
irreducible.

It was not. The residual variance correlates with the GPU's own clock state at a
slope of minus 0.954, and the clock state was already being recorded in the same
data file. The word was doing work the evidence did not support, and worse, the
figure legend used the word while the surrounding text refused to.

That paper is being fixed before it goes anywhere. Its own number audit says so
in as many words.

## Three. No headroom, except there was

The cold-start work originally said the storage device was already running flat
out during a wake, and quoted a utilisation of 92 to 104 percent of the card's
rated speed.

A utilisation above 100 percent is a message. It means the denominator is wrong,
which in this case meant the rated speed was not the speed the card actually
achieves. Measured properly, the card plateaus around 88 to 90 megabytes per
second and the wake runs at 76 to 82 percent of that.

The consequence mattered more than the number. The original framing said there
was no software headroom left, which would have made a whole line of follow-up
work pointless. There is headroom, and there is now a paper about recovering
about a fifth of the wake cost in software.

## Four. The control that contradicted its own paper

A paper on hybrid processors argued that mixing fast and slow cores causes a
collapse in text-generation throughput, and used a Raspberry Pi with four
identical cores as the control. The abstract said the control showed ordinary
saturation with no collapse.

Its own data showed a decline on all three models, including a 31.7 percent drop
across four identical cores. The body of the paper had this right and stated the
argument correctly. The abstract had been written earlier and never caught up.

The fix made the paper stronger. The control does not show "no effect", it shows
the effect with the ordering inverted: on identical cores the decline grows with
model size, and on mixed cores it shrinks. An inversion is better evidence for a
mechanism than an absence.

## What the four have in common

None of these was a calculation error. Every arithmetic step in all four checked
out. A number audit on one of these papers reproduced every recomputable figure
and still found the paper wrong.

Three of the four are the same failure: a claim about *cause* attached to a
measurement that could not distinguish the cause from something else. The
experiment ran, produced a number, and the number was correctly computed from
whatever it was actually measuring.

The fourth is a claim that had been true of an earlier draft and stopped being
true, in a part of the document that nobody rereads.

So the checks that actually catch things, in my experience:

Confirm the experiment produced the artifact it says it did. Not that it exited
zero. Open the file and look at what is in it.

Distrust a utilisation above 100 percent, and distrust one suspiciously near it.
Both usually mean the ceiling is wrong.

Read your own abstract against your own tables, last, as a stranger would.

Look for a field already in your data that explains the residual you are about to
call irreducible. Mine was sitting in the same file.

## The uncomfortable part

There is no obvious upside to publishing this. A list of times I was wrong,
attached to my name, on a site whose entire argument is that the numbers on it
can be trusted.

I think it goes the other way. More than a dozen manuscripts came out of this
programme, and if none of them had ever been wrong the honest conclusion would be
that nobody was checking. The corrections are what checking looks like when it
works.

Two early drafts were also discarded outright for presenting simulation as
measurement. Those are not on this list because they never made a claim; they
were the wrong thing from the start.

## Checking me

Two of the four are checkable against public data today. The quantization
misattribution is visible in
[rpi5-quantization-benchmark](https://github.com/manunicholasjacob/rpi5-quantization-benchmark),
whose README opens with the correction, and the corrected measurements are the
ones the framework re-runs:

```bash
pip install ml-systems-lab
mlsys run configs/int8-imagenet.yaml
```

The cold-start storage numbers come out of
[edge-cold-start-tax](https://github.com/manunicholasjacob/edge-cold-start-tax),
where `scripts/e7_storage_opt.py` is the experiment that produced the corrected
figure. The other two sit in papers that are not public yet, so for now you have
only my account of them.

If you find a fifth, tell me. I would rather hear it from you than not hear it.
