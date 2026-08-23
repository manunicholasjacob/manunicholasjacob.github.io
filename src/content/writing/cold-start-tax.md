---
title: The first prediction after a device wakes up costs twenty of the others
description: Almost every benchmark for edge machine learning reports the speed a model reaches once it is warm. A lot of real devices never get warm. Here is what the first inference after a wake actually costs, and where the time goes.
date: 2026-09-01
kind: Measurement
topics: ['Duty cycling', 'Storage', 'Raspberry Pi 5', 'Cache policy']
readingTime: 7
draft: true
---

A camera on a fence post wakes up because something moved, looks at one frame,
decides whether it cares, and goes back to sleep. It might do that forty times a
day. It is never warm.

Nearly every published number about running machine learning on small devices
describes the opposite situation: a model that has been loaded, run a few hundred
times to settle down, and then measured. That number is real and it is useful for
a device that runs continuously. For the camera on the fence post it describes a
state the device is almost never in.

So I measured the other one. Twelve models on a Raspberry Pi 5, waking the way a
duty-cycled device wakes, with the page cache dropped so the wake is genuinely
cold.

The first inference after a wake costs between 5 and 23 times what a warm one
costs.

<figure>
<!--FIG:fig-coldstart-->
<svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="t-cold d-cold" style="width:100%;height:auto;display:block;overflow:visible">
<title id="t-cold">Breakdown of the wake transient on a duty-cycled edge device</title>
<desc id="d-cold">Breakdown of the wake transient on a duty-cycled edge device</desc>
<g font-family="ui-monospace, JetBrains Mono Variable, monospace" font-size="11">
<rect x="40.0" y="96" width="473.7" height="54" fill="var(--accent)" stroke="var(--accent)" stroke-width="1"/>
<text x="276.8" y="127.0" fill="var(--on-accent)" text-anchor="middle" font-size="11.5">reading the weights off flash</text>
<text x="276.8" y="86.0" fill="var(--fg-faint)" text-anchor="middle" font-size="10">74%</text>
<rect x="513.7" y="96" width="109.4" height="54" fill="none" stroke="var(--hairline)" stroke-width="1"/>
<text x="568.4" y="164.0" fill="var(--fg-muted)" text-anchor="middle" font-size="10">building the graph</text>
<line x1="568.4" y1="150" x2="568.4" y2="154.0" stroke="var(--hairline)"/>
<text x="568.4" y="86.0" fill="var(--fg-faint)" text-anchor="middle" font-size="10">17%</text>
<rect x="623.1" y="96" width="56.9" height="54" fill="none" stroke="var(--hairline)" stroke-width="1"/>
<text x="651.5" y="180.0" fill="var(--fg-muted)" text-anchor="middle" font-size="10">first inference</text>
<line x1="651.5" y1="150" x2="651.5" y2="170.0" stroke="var(--hairline)"/>
<text x="651.5" y="86.0" fill="var(--fg-faint)" text-anchor="middle" font-size="10">9%</text>
<text x="40" y="64" fill="var(--fg)" font-size="11.5">one wake, broken into what it spent the time on</text>
<text x="40" y="198" fill="var(--fg-muted)" font-size="10.5">the first inference itself runs at full speed, so there is nothing to warm up</text>
</g>
</svg>
<!--/FIG-->
<figcaption>
Where a cold wake spends its time, as a median share across twelve models on a
Raspberry Pi 5 with the page cache dropped. Across the individual models, weight
loading ranges from 55 to 81 percent of the wake.
Data: <a href="/research#cold-start">The Cold-Start Tax</a>.
</figcaption>
</figure>

## It is almost all reading the file

The thing I expected to find was some kind of warm-up. Caches filling, branch
predictors settling, the first pass through a code path being slower than the
second. Something the device could amortise if it stayed awake a little longer.

There is none. The first inference runs at essentially the same speed as the
hundredth. Whatever the processor needed to learn, it learned in well under a
millisecond.

The wake is dominated by getting the weights off flash and into memory. That is
between 55 and 81 percent of it depending on the model, with a median near three
quarters. Building the computation graph and allocating memory takes most of the
rest. The actual arithmetic of the first prediction is a rounding error.

Which is oddly good news, because a cost that is proportional to file size is a
cost you can predict. Model size alone predicts the wake to a fit so tight it
stops being interesting to quote.

## The energy bill

The board's power-management chip lets you integrate the current draw over the
whole wake, so the energy question has a direct answer rather than an estimate.

A single cold wake costs the energy of 4 to 19 steady-state inferences. For a
Vision Transformer it reaches about 35 joules.

Put that next to the camera on the fence post. If the device wakes forty times a
day and runs one inference each time, it is paying between four and nineteen
times its apparent inference budget, and every benchmark it was specified against
reported the other number.

## The cliff

Here is the part that changes how you design the thing.

If the device has room to keep the model resident between wakes, it pays this
once and then behaves like a warm device. On a board with two gigabytes of
memory, whether it has room depends on what else happens during the idle
interval. If anything else on the device generates enough memory pressure, the
operating system evicts the model's pages, and the next wake pays the full cost
again.

That is a cliff rather than a slope. Either the pages are there or they are not,
and past the boundary the wake cost goes up by more than eighty times relative to
staying resident. Nothing in between.

## Two things that did not help

The clock governor, which ramps the processor up when work appears, does almost
nothing here. The wake is waiting on storage, and a faster processor waits at the
same speed.

Quantizing to eight-bit integers shrinks the file, so the absolute wake cost drops
with it. The ratio does not move. A smaller model still pays roughly the same
multiple of its own warm speed.

I should also record something I got wrong on the way. An earlier version of this
work claimed the storage device was already saturated during the wake, leaving no
headroom for a software fix. Measured properly, the wake runs at 76 to 82 percent
of what the card can do, and the card plateaus around 88 to 90 megabytes per
second. There is headroom. The claim came off.

## A policy that uses this

If a device holds several models and cannot keep all of them resident, the usual
answer is to evict whichever was used least recently. That decision ignores the
thing this measurement makes visible, which is that models cost wildly different
amounts to bring back.

So the last part of the work is a cache that keeps warm whichever sessions would
be most expensive to lose, rather than whichever were touched most recently. On
measured constants over realistic request traces it matches or beats both of the
usual policies, and implemented on the device itself it cut energy per request by
up to 14 percent.

## Reproducing it

The measurements, the analysis and the policy implementation are in
[edge-cold-start-tax](https://github.com/manunicholasjacob/edge-cold-start-tax),
archived at
[10.5281/zenodo.21844857](https://doi.org/10.5281/zenodo.21844857).

```bash
git clone https://github.com/manunicholasjacob/edge-cold-start-tax
cd edge-cold-start-tax
sudo python scripts/e1_decomposition.py   # root, because it drops the page cache
python scripts/compute_stats.py           # the numbers above, out of results/
python scripts/fig_gen.py                 # and the figures
```

Each experiment in the paper is its own script, `e1` through `e8`, and each one
writes its raw records into `results/` before anything is aggregated.

The manuscript is with a journal, so this is measurement rather than a refereed
result.

If you build something that duty-cycles, the number you want is not the one on the
datasheet. It is the cost of the first inference after a wake, and how often your
device is going to pay it. I would be curious whether the ratio holds on hardware
with faster storage than an SD card, because that is the one variable I could not
change.
