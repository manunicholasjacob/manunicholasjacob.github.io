---
title: Running the processor flat out wasted a fifth of the battery
description: Every edge device I have measured runs its clock as high as it will go, on the theory that finishing sooner saves power. Across eight networks on a Raspberry Pi 5 that theory cost about 20 percent of the energy, and the reason is not where I expected to find it.
date: 2026-08-28
kind: Measurement
topics: ['Energy', 'DVFS', 'Raspberry Pi 5', 'Power telemetry']
readingTime: 7
draft: true
---

The received wisdom on small battery-powered devices is called race to halt. Run
the processor as fast as it goes, finish the work, go back to sleep. Time spent
awake is the expensive thing, so minimise it.

I believed this. It is a good heuristic and it is right about a lot of workloads.
I set out to measure how right it was for image recognition on a Raspberry Pi 5,
expecting to confirm it and move on.

The Pi 5 has a power-management chip on the board that will tell you, several
times a second, how much current is going into the processor and how much is
going into the memory, separately. No external meter, no shunt resistor, nothing
to solder. So the measurement is easy to do and easy for somebody else to repeat.

<figure>
<!--FIG:fig-energy-->
<svg viewBox="0 0 720 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="t-energy d-energy" style="width:100%;height:auto;display:block;overflow:visible">
<title id="t-energy">Energy per inference against CPU clock, with the minimum below the maximum clock</title>
<desc id="d-energy">Energy per inference against CPU clock, with the minimum below the maximum clock</desc>
<g font-family="ui-monospace, JetBrains Mono Variable, monospace" font-size="11">
<line x1="62" y1="354" x2="698" y2="354" stroke="var(--hairline)" stroke-width="1"/>
<line x1="62" y1="30" x2="62" y2="354" stroke="var(--hairline)" stroke-width="1"/>
<text x="380.0" y="392" fill="var(--fg-faint)" text-anchor="middle" letter-spacing="0.08em">CPU CLOCK (MHz)</text>
<text transform="translate(14,192.0) rotate(-90)" fill="var(--fg-faint)" text-anchor="middle" letter-spacing="0.08em">ENERGY PER INFERENCE (mJ)</text>
<line x1="62" y1="354.0" x2="698" y2="354.0" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="54" y="357.5" fill="var(--fg-faint)" text-anchor="end">80</text>
<line x1="62" y1="273.0" x2="698" y2="273.0" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="54" y="276.5" fill="var(--fg-faint)" text-anchor="end">86</text>
<line x1="62" y1="192.0" x2="698" y2="192.0" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="54" y="195.5" fill="var(--fg-faint)" text-anchor="end">92</text>
<line x1="62" y1="111.0" x2="698" y2="111.0" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="54" y="114.5" fill="var(--fg-faint)" text-anchor="end">98</text>
<line x1="62" y1="30.0" x2="698" y2="30.0" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="54" y="33.5" fill="var(--fg-faint)" text-anchor="end">103</text>
<line x1="119.8" y1="354" x2="119.8" y2="358" stroke="var(--hairline)"/>
<text x="119.8" y="372" fill="var(--fg-faint)" text-anchor="middle">1500</text>
<line x1="293.3" y1="354" x2="293.3" y2="358" stroke="var(--hairline)"/>
<text x="293.3" y="372" fill="var(--fg-faint)" text-anchor="middle">1800</text>
<line x1="466.7" y1="354" x2="466.7" y2="358" stroke="var(--hairline)"/>
<text x="466.7" y="372" fill="var(--fg-faint)" text-anchor="middle">2100</text>
<line x1="640.2" y1="354" x2="640.2" y2="358" stroke="var(--hairline)"/>
<text x="640.2" y="372" fill="var(--fg-faint)" text-anchor="middle">2400</text>
<polyline points="119.8,246.9 293.3,284.3 466.7,192.4 640.2,84.4" fill="none" stroke="var(--accent)" stroke-width="1.75"/>
<circle cx="119.8" cy="246.9" r="4" fill="var(--fg)"/>
<circle cx="293.3" cy="284.3" r="5.5" fill="var(--accent)"/>
<circle cx="466.7" cy="192.4" r="4" fill="var(--fg)"/>
<circle cx="640.2" cy="84.4" r="4" fill="var(--fg)"/>
<text x="293.3" y="304.3" fill="var(--accent)" text-anchor="middle">cheapest</text>
<text x="634.2" y="74.4" fill="var(--fg-muted)" text-anchor="end">flat out</text>
</g>
</svg>
<!--/FIG-->
<figcaption>
MobileNetV2 on a Raspberry Pi 5, three threads, energy per inference measured on
the board's power-management chip and averaged over repeated runs at each clock.
The cheapest point sits at 1800 MHz. The maximum clock, which is what the device
runs at by default, costs 17 percent more energy for this network. Across the
eight networks measured the average penalty is 20.7 percent.
Data: <a href="/research#energy-optimal">Latency-Optimal Is Not Energy-Optimal</a>.
</figcaption>
</figure>

## The shape of the curve is the finding

There is a minimum, and it is not at either end.

Drop the clock too far and the work takes so long that the board's idle power,
about two watts that it burns just being switched on, dominates the bill. Push
the clock too high and you pay a steeply rising power cost for a shrinking amount
of extra speed. Somewhere in between is the cheapest place to run, and on this
board it sits well below the top.

The penalty for ignoring this was remarkably consistent. Across seven
convolutional networks it ranged from 16 to 24 percent, averaging 20.7. I then
tried a Vision Transformer, expecting a different answer because it is a
structurally different kind of network, and got 20.8 percent. At that point I
stopped expecting the model to matter.

## The intuition I had was wrong

Here is the hypothesis I went in with, and I want to state it plainly because it
was wrong and the way it was wrong is the interesting part.

Some of these networks are limited by memory rather than by arithmetic. A
memory-limited network spends most of its time waiting, so raising the clock buys
it almost nothing while still costing power. So, I reasoned, memory-limited
networks should show a much larger penalty for running flat out.

They do not. The penalty is essentially the same for all of them, and the
arithmetic profile of the network does not predict it.

What the arithmetic profile does predict is something else: how much speed you
give up to take the saving. For the memory-limited networks, dropping to the
cheapest clock costs 17 to 26 percent more time. For the arithmetic-heavy ones it
costs 34 to 37 percent. Which makes sense once you say it out loud. A core that
was mostly waiting does not slow down much when you slow it down.

So the saving is available to everyone, and it is nearly free precisely for the
mobile-optimised networks that most edge devices actually run.

## Where the wasted energy goes

I assumed the energy cost of being memory-limited was the memory. Moving data is
expensive, everyone says so, and the whole point of the network being
memory-limited is that it moves a lot of data.

The board disagreed. Splitting the measurement by rail, the memory itself
accounts for about 2 percent of the total. Roughly 68 percent is the processor
core, sitting there powered up and stalled, waiting for data it has already
asked for.

The energy of memory-boundedness is mostly not in the memory. It is in the core
that has nothing to do while the memory works.

## One more thing about threads

Adding cores looks like it helps, and in one sense it does. More cores finish
sooner, and finishing sooner means less time paying that two-watt idle floor, so
total energy goes down.

Split out the active part, though, and adding cores raised it by up to 66 percent
for the memory-limited networks. Those extra cores are mostly queueing for memory
while burning power.

Which means the right answer depends on what the device does between inferences.
If it runs continuously, the idle floor is being paid anyway and more cores win.
If it wakes up, does one thing and sleeps, the idle floor mostly is not paid and
the extra cores are just waste. Race to halt is not one heuristic. It is two, and
which one applies depends on the duty cycle.

## Turning it into something you can ship

Nobody is going to run a sweep like this per model per device. So the last part
of the work was a small policy that does not need one: give it a latency budget,
and it picks the clock. Evaluated against an exhaustive search over the measured
grid, it recovers 94 percent of the available saving, which came to 14.8 percent
of energy at a budget allowing 25 percent extra latency, and it met the latency
target for every network.

The manuscript is under review, so this is measurement rather than an accepted
result. The framework that produced the measurements is
[ml-systems-lab](https://github.com/manunicholasjacob/ml-systems-lab), on PyPI and
archived at
[10.5281/zenodo.21867055](https://doi.org/10.5281/zenodo.21867055):

```bash
pip install ml-systems-lab
mlsys run configs/pi-overnight.yaml   # clock and thread sweep with PMIC power
mlsys report runs/pi-overnight --full
```

If you have a battery-powered device running inference at its maximum clock, and
most of them do because that is the default, there is very likely a fifth of your
energy budget sitting on the floor. I would be interested to know whether the
number lands near 20 percent on hardware that is not a Pi.
