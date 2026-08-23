---
title: INT8 was supposed to be four times faster. The best I ever measured was 2.7
description: Quantizing a network to eight-bit integers is treated as a free optimization. Across nine networks on three processors the best case was 2.7 times, two networks got slower, and which two depends on the instruction set. This started as a correction to my own mistake.
date: 2026-08-30
kind: Measurement
topics: ['Quantization', 'ONNX Runtime', 'Cross-platform', 'Correction']
readingTime: 8
draft: true
---

INT8 quantization has a very appealing story attached to it. You take a network
whose numbers are stored in 32 bits and you store them in 8 instead. A quarter of
the width, a quarter of the data to move, and the processor has instructions that
do four of the small multiplications in the time it takes to do one of the big
ones. The arithmetic suggests something like four times faster.

I have now measured this on nine standard image networks across three different
processor designs, with one runtime version and byte-identical model files
throughout, and the best result anywhere was 2.7 times. Two of the nine ran
slower after quantization. Which two depends on the instruction set.

<figure>
<!--FIG:fig-int8-->
<svg viewBox="0 0 720 348" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="t-int8 d-int8" style="width:100%;height:auto;display:block;overflow:visible">
<title id="t-int8">INT8 speedup over FP32 for nine networks on Arm and on x86, including the ones that get slower</title>
<desc id="d-int8">INT8 speedup over FP32 for nine networks on Arm and on x86, including the ones that get slower</desc>
<g font-family="ui-monospace, JetBrains Mono Variable, monospace" font-size="11">
<line x1="256.7" y1="52" x2="256.7" y2="326" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="256.7" y="46" fill="var(--fg-faint)" text-anchor="middle">0.5x</text>
<line x1="343.3" y1="52" x2="343.3" y2="326" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="343.3" y="46" fill="var(--fg-faint)" text-anchor="middle">1x</text>
<line x1="430.0" y1="52" x2="430.0" y2="326" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="430.0" y="46" fill="var(--fg-faint)" text-anchor="middle">1.5x</text>
<line x1="516.7" y1="52" x2="516.7" y2="326" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="516.7" y="46" fill="var(--fg-faint)" text-anchor="middle">2x</text>
<line x1="603.3" y1="52" x2="603.3" y2="326" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="603.3" y="46" fill="var(--fg-faint)" text-anchor="middle">2.5x</text>
<line x1="690.0" y1="52" x2="690.0" y2="326" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="690.0" y="46" fill="var(--fg-faint)" text-anchor="middle">3x</text>
<line x1="343.3" y1="52" x2="343.3" y2="326" stroke="var(--fg-muted)" stroke-width="1.25"/>
<text x="343.3" y="32" fill="var(--fg-muted)" text-anchor="middle">no change</text>
<text x="160" y="70" fill="var(--fg)" text-anchor="end" font-size="10.5">resnet-18</text>
<line x1="343.3" y1="61" x2="637.7" y2="61" stroke="var(--accent)" stroke-width="4" stroke-linecap="butt"/>
<line x1="343.3" y1="71" x2="409.8" y2="71" stroke="var(--fg-muted)" stroke-width="4" stroke-linecap="butt"/>
<text x="160" y="100" fill="var(--fg)" text-anchor="end" font-size="10.5">googlenet</text>
<line x1="343.3" y1="91" x2="546.6" y2="91" stroke="var(--accent)" stroke-width="4" stroke-linecap="butt"/>
<line x1="343.3" y1="101" x2="396.6" y2="101" stroke="var(--fg-muted)" stroke-width="4" stroke-linecap="butt"/>
<text x="160" y="130" fill="var(--fg)" text-anchor="end" font-size="10.5">mobilenetv2 (v12)</text>
<line x1="343.3" y1="121" x2="525.2" y2="121" stroke="var(--accent)" stroke-width="4" stroke-linecap="butt"/>
<line x1="343.3" y1="131" x2="405.6" y2="131" stroke="var(--fg-muted)" stroke-width="4" stroke-linecap="butt"/>
<text x="160" y="160" fill="var(--fg)" text-anchor="end" font-size="10.5">resnet-50</text>
<line x1="343.3" y1="151" x2="509.8" y2="151" stroke="var(--accent)" stroke-width="4" stroke-linecap="butt"/>
<line x1="343.3" y1="161" x2="374.9" y2="161" stroke="var(--fg-muted)" stroke-width="4" stroke-linecap="butt"/>
<text x="160" y="190" fill="var(--fg)" text-anchor="end" font-size="10.5">efficientnet-lite4</text>
<line x1="343.3" y1="181" x2="503.6" y2="181" stroke="var(--accent)" stroke-width="4" stroke-linecap="butt"/>
<line x1="343.3" y1="191" x2="380.1" y2="191" stroke="var(--fg-muted)" stroke-width="4" stroke-linecap="butt"/>
<text x="160" y="220" fill="var(--fg)" text-anchor="end" font-size="10.5">mobilenetv2 (v10)</text>
<line x1="343.3" y1="211" x2="469.0" y2="211" stroke="var(--accent)" stroke-width="4" stroke-linecap="butt"/>
<line x1="343.3" y1="221" x2="418.2" y2="221" stroke="var(--fg-muted)" stroke-width="4" stroke-linecap="butt"/>
<text x="160" y="250" fill="var(--fg)" text-anchor="end" font-size="10.5">densenet-121</text>
<line x1="343.3" y1="241" x2="455.9" y2="241" stroke="var(--accent)" stroke-width="4" stroke-linecap="butt"/>
<line x1="343.3" y1="251" x2="305.1" y2="251" stroke="var(--fg-muted)" stroke-width="4" stroke-linecap="butt"/>
<text x="690" y="250" fill="var(--accent)" text-anchor="end" font-size="10">changes sign</text>
<text x="160" y="280" fill="var(--fg)" text-anchor="end" font-size="10.5">squeezenet 1.1</text>
<line x1="343.3" y1="271" x2="340.9" y2="271" stroke="var(--accent)" stroke-width="4" stroke-linecap="butt"/>
<line x1="343.3" y1="281" x2="361.1" y2="281" stroke="var(--fg-muted)" stroke-width="4" stroke-linecap="butt"/>
<text x="690" y="280" fill="var(--accent)" text-anchor="end" font-size="10">changes sign</text>
<text x="160" y="310" fill="var(--fg)" text-anchor="end" font-size="10.5">shufflenet-v2</text>
<line x1="343.3" y1="301" x2="317.0" y2="301" stroke="var(--accent)" stroke-width="4" stroke-linecap="butt"/>
<line x1="343.3" y1="311" x2="230.6" y2="311" stroke="var(--fg-muted)" stroke-width="4" stroke-linecap="butt"/>
<text x="24" y="32" fill="var(--accent)" font-size="10.5">Arm Cortex-A76</text>
<text x="24" y="46" fill="var(--fg-muted)" font-size="10.5">x86 Golden Cove</text>
</g>
</svg>
<!--/FIG-->
<figcaption>
Best INT8 speedup over 32-bit floating point for nine ImageNet networks, four
threads, ONNX Runtime 1.24.4, byte-identical model files on both machines. Left of
the line means quantizing made it slower. Arm is a Cortex-A76 in a Raspberry Pi 5;
x86 is the performance cores of an Intel i7-12700H. Data:
<a href="/research#int8-pays">When Does INT8 Actually Pay on an Edge CPU?</a>.
</figcaption>
</figure>

## The two that change sign

DenseNet-121 gets 1.6 times faster on the Arm chip and 1.3 times *slower* on the
Intel one. SqueezeNet goes the other way, slightly slower on Arm and slightly
faster on Intel.

I want to be precise about what that means for anybody deciding whether to
quantize. It means you cannot screen this decision on a machine that is not the
one you are shipping on. If you test on your laptop and deploy to an Arm board,
two networks out of nine will give you the wrong answer, and you will not know
which two.

The good news, and it is genuinely useful, is that the boundary is the
instruction set and not the exact chip. I measured both kinds of core inside the
same Intel processor, the fast ones and the efficient ones, and no network
changed sign between them. So one x86 machine can stand in for another. It cannot
stand in for Arm.

## What actually decides it

The deciding factor turned out not to be the arithmetic at all.

When you quantize a network, the runtime inserts conversion steps that turn
floating-point values into integers and back. Ideally the optimizer swallows most
of them into the neighbouring operations and they cost nothing. In practice the
number that survives varies a lot by network, and what matters is how many
survive relative to how much real convolution work they are wrapped around.

A network built out of many small cheap layers ends up with conversion steps
that are a large fraction of its total work. ShuffleNet is the extreme case: it
ran three times slower quantized on the Intel machine, and slower on Arm too.

There is a competing explanation I had to rule out, and this is where the story
gets uncomfortable.

## The part where I was wrong

An earlier version of this work claimed the deciding factor was the export
format, meaning the choice between the two standard ways of writing a quantized
network into a file. I measured a very large gap between them and wrote it up as
a 40-fold configuration swing.

That number was an artifact. One arm of the experiment never produced the file it
said it did. It loaded an existing model that had been quantized a completely
different way, dynamically rather than statically, and the enormous gap I was
measuring was between dynamic and static quantization rather than between the two
file formats.

When I re-quantized the same weights properly into both formats and measured them
on matched runtimes, the choice of format was worth about 18 percent at its
widest, and across twenty-seven matched pairs the median difference was 1.5
percent. The lever I had written about was worth almost nothing. The lever that
mattered, dynamic against static, was worth more than four times, and I had not
been looking at it.

Two later papers exist mostly to correct this one. The repository carrying the
original measurements now opens with a notice saying the attribution was
superseded, which is the least it can do.

I would rather this had not happened. Having it happen did teach me to check that
an experiment produced the artifact it claims to have produced, rather than
checking only that it ran.

## Speed is not the only question

If a network is going to be three times slower, it had better at least be
accurate. So I measured how often the quantized network gives the same answer as
the original on the same inputs.

ShuffleNet agrees with its 32-bit self on 92 percent of inputs while running
three times slower, which is a bad trade in both directions at once. DenseNet-121
was both slower and the least faithful thing I measured, agreeing 29 percent of
the time. Finer-grained scaling of the weights, which is the usual first
suggestion, did not repair it.

I also hit two quantization interfaces that fail quietly. One costs about four
times in speed and gives no indication that anything is wrong. The other produces
no usable model at all while still reporting success. Both are documented in the
paper because I lost time to them and would rather nobody else did.

## Reproducing it

Everything runs from the framework:

```bash
pip install ml-systems-lab
mlsys run configs/int8-imagenet.yaml
mlsys report runs/int8-imagenet --full
```

The manuscript is under review at a letters venue, so this is measured work and
not yet a refereed result.

If you are about to quantize something, the honest summary is that it is worth
trying and not worth assuming. Measure it on the instruction set you ship on,
check the answers as well as the clock, and be suspicious of any speedup that
matches the bit width too neatly. Mine did not, and when one of my numbers did
look that clean it turned out to be measuring the wrong thing.
