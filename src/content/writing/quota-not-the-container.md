---
title: Kubernetes did not slow my benchmark down. One line of YAML took 64 percent.
description: I moved an inference benchmark into a pod expecting to pay for the container. Across fifty runs I could not find a cost at all. What did cost me was a CPU limit set below the thread count, which is a thing you can write by accident and never notice.
date: 2026-08-29
kind: Measurement
topics: ['Kubernetes', 'Containers', 'cgroups', 'Benchmarking', 'llama.cpp']
readingTime: 7
draft: false
---
<!-- Published 29 Aug 2026, out of queue order and on the day the measurement
     was taken. The gate was that ml-systems-lab v0.2.0 had to be public first,
     since this links to results/containerization/ and the snippet clones the
     repo; that cleared when v0.2.0 was released and Zenodo minted
     10.5281/zenodo.22162103. The original slot was 28 Oct, between the energy
     post and format tax. Moving it forward puts it ahead of eight other drafts,
     one of which was already due, so the rest of the schedule needs a look. -->

A lot of language model benchmarking now happens inside Kubernetes, because that
is where the GPUs are and that is what the platform team hands you. I could not
find anyone who had measured what the pod does to the numbers that come out.

I had assumed there was a tax. Some percentage you pay for the namespaces, the
overlay filesystem, the container network, the extra layer of scheduler. Small,
probably, but there. I moved my benchmark harness into a pod partly to find out
what it was.

I could not find it.

## What I actually ran

Five arms, one laptop, an Intel i7-12700H. A plain process on the Linux host, and
then the same work in a Kubernetes pod four times over: with no CPU limit at all,
with a limit of eight cores, with four, and with two. The benchmark asked for four
threads in every single one.

Three things had to be true or none of the rest would mean anything.

The **same binary** in every arm. llama.cpp is built once, inside the container
image, and the copy the host arm runs is pulled back out of that same image
afterwards. If each side had compiled its own, I would have been measuring a
compiler.

The **same file on disk**. The pods mount the model directory off the node,
read only, so every arm reads the same inode. No copy of the weights sits inside
an overlay filesystem where it could quietly change the storage path.

**One arm at a time.** This is the one I nearly got wrong. Those five arms are
five entries in a config file but they are one CPU, and if the scheduler runs
them together it is not measuring containers, it is measuring them fighting each
other. They share a resource group and take turns. When I first wrote the turn
taking it was first come first served, which in practice means whichever worker
grabbed the lock after finishing, so one arm ran its entire queue before any other
arm started and each arm sat in a different part of the afternoon's thermal
history. Round robin fixed it.

Then the whole matrix twice, on separate passes, so drift over the sweep is
visible rather than assumed away.

<figure>
<!--FIG:fig-container-->
<svg viewBox="0 0 720 288" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="t-container d-container" style="width:100%;height:auto;display:block;overflow:visible">
<title id="t-container">Decode throughput in a Kubernetes pod relative to an uncontainerised process on the same machine</title>
<desc id="d-container">Decode throughput in a Kubernetes pod relative to an uncontainerised process on the same machine</desc>
<g font-family="ui-monospace, JetBrains Mono Variable, monospace" font-size="11">
<rect x="543.2" y="60" width="116.3" height="180" fill="var(--fg-muted)" opacity="0.09"/>
<text x="601.3" y="52" fill="var(--fg-muted)" text-anchor="middle" font-size="10.5">cannot resolve</text>
<line x1="178.0" y1="60" x2="178.0" y2="240" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="178.0" y="256" fill="var(--fg-faint)" text-anchor="middle">-75%</text>
<line x1="262.7" y1="60" x2="262.7" y2="240" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="262.7" y="256" fill="var(--fg-faint)" text-anchor="middle">-60%</text>
<line x1="347.3" y1="60" x2="347.3" y2="240" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="347.3" y="256" fill="var(--fg-faint)" text-anchor="middle">-45%</text>
<line x1="432.0" y1="60" x2="432.0" y2="240" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="432.0" y="256" fill="var(--fg-faint)" text-anchor="middle">-30%</text>
<line x1="516.7" y1="60" x2="516.7" y2="240" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="516.7" y="256" fill="var(--fg-faint)" text-anchor="middle">-15%</text>
<line x1="601.3" y1="60" x2="601.3" y2="240" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="601.3" y="256" fill="var(--fg-faint)" text-anchor="middle">+0%</text>
<line x1="686.0" y1="60" x2="686.0" y2="240" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="686.0" y="256" fill="var(--fg-faint)" text-anchor="middle">+15%</text>
<line x1="601.3" y1="60" x2="601.3" y2="240" stroke="var(--fg-muted)" stroke-width="1.25"/>
<text x="168" y="82" fill="var(--fg)" text-anchor="end" font-size="10.5">pod, no CPU quota</text>
<line x1="601.3" y1="78" x2="614.3" y2="78" stroke="var(--fg)" stroke-width="7" stroke-linecap="butt" opacity="0.85"/>
<circle cx="608.0" cy="91" r="2.4" fill="var(--fg)" opacity="0.75"/>
<circle cx="617.6" cy="91" r="2.4" fill="var(--fg)" opacity="0.75"/>
<circle cx="603.5" cy="91" r="2.4" fill="var(--fg)" opacity="0.75"/>
<circle cx="635.2" cy="91" r="2.4" fill="var(--fg)" opacity="0.75"/>
<circle cx="607.3" cy="91" r="2.4" fill="var(--fg)" opacity="0.75"/>
<text x="621.3" y="82" fill="var(--fg)" text-anchor="start" font-size="10.5">+2.3%</text>
<text x="168" y="128" fill="var(--fg)" text-anchor="end" font-size="10.5">pod, quota 8 cores</text>
<line x1="601.3" y1="124" x2="613.6" y2="124" stroke="var(--fg)" stroke-width="7" stroke-linecap="butt" opacity="0.85"/>
<circle cx="602.1" cy="137" r="2.4" fill="var(--fg)" opacity="0.75"/>
<circle cx="616.8" cy="137" r="2.4" fill="var(--fg)" opacity="0.75"/>
<circle cx="605.1" cy="137" r="2.4" fill="var(--fg)" opacity="0.75"/>
<circle cx="636.1" cy="137" r="2.4" fill="var(--fg)" opacity="0.75"/>
<circle cx="607.7" cy="137" r="2.4" fill="var(--fg)" opacity="0.75"/>
<text x="620.6" y="128" fill="var(--fg)" text-anchor="start" font-size="10.5">+2.2%</text>
<text x="168" y="174" fill="var(--fg)" text-anchor="end" font-size="10.5">pod, quota 4 cores</text>
<line x1="601.3" y1="170" x2="618.9" y2="170" stroke="var(--fg)" stroke-width="7" stroke-linecap="butt" opacity="0.85"/>
<circle cx="597.8" cy="183" r="2.4" fill="var(--fg)" opacity="0.75"/>
<circle cx="656.5" cy="183" r="2.4" fill="var(--fg)" opacity="0.75"/>
<circle cx="605.3" cy="183" r="2.4" fill="var(--fg)" opacity="0.75"/>
<circle cx="633.5" cy="183" r="2.4" fill="var(--fg)" opacity="0.75"/>
<circle cx="601.3" cy="183" r="2.4" fill="var(--fg)" opacity="0.75"/>
<text x="625.9" y="174" fill="var(--fg)" text-anchor="start" font-size="10.5">+3.1%</text>
<text x="168" y="220" fill="var(--fg)" text-anchor="end" font-size="10.5">pod, quota 2 cores</text>
<line x1="601.3" y1="216" x2="239.3" y2="216" stroke="var(--accent)" stroke-width="7" stroke-linecap="butt" opacity="0.85"/>
<circle cx="239.9" cy="229" r="2.4" fill="var(--accent)" opacity="0.75"/>
<circle cx="251.5" cy="229" r="2.4" fill="var(--accent)" opacity="0.75"/>
<circle cx="238.1" cy="229" r="2.4" fill="var(--accent)" opacity="0.75"/>
<circle cx="247.8" cy="229" r="2.4" fill="var(--accent)" opacity="0.75"/>
<circle cx="219.3" cy="229" r="2.4" fill="var(--accent)" opacity="0.75"/>
<text x="232.3" y="220" fill="var(--accent)" text-anchor="end" font-size="10.5">-64.1%</text>
<text x="24" y="52" fill="var(--fg-faint)" font-size="10.5">each dot is one model</text>
</g>
</svg>
<!--/FIG-->
<figcaption>
Decode throughput in a pod, relative to an ordinary process on the same machine.
Fifty runs, two independent passes, five model and quantization combinations, four
threads throughout. Each dot is one model. The shaded band is the width this
measurement can actually resolve, so a bar inside it is a bar you are not entitled
to read anything into.
Data: <a href="https://github.com/manunicholasjacob/ml-systems-lab">ml-systems-lab</a>.
</figcaption>
</figure>

## Three bars sit inside the noise

The pod with no limit, the pod limited to eight cores and the pod limited to four
all land within about three percent of the bare process, and every one of those
three percents is smaller than the run to run spread of the measurement that
produced it. Fourteen of the fifteen individual comparisons cannot be separated
from noise at all.

I want to be careful about what that sentence says. It does not say
containerisation is free. It says that on this machine, with this workload, at
this precision, I could not find the cost. Those are different claims and the
second one is the only one I measured. If the tax is one percent it is under my
floor and it will stay there until somebody runs this on quieter hardware.

The direction is mildly funny, though. All three came out marginally on the pod's
side rather than the host's. I have no story for that and I do not think there is
one to tell at that size.

## The fourth bar is not about containers

Two cores against four threads costs 64 percent of throughput, and unlike
everything above, that one is resolved on every single point. There is no
ambiguity in it at all.

The container has nothing to do with it. You are asking for more parallelism than
the control group will let you have, and Linux enforces a CPU limit by handing the cgroup
a budget of runtime every hundred milliseconds and stopping it when the budget is
gone, so four threads against a two core quota spend a chunk of every period
frozen, waiting for the next one. The container is incidental. You would get the
same behaviour from a bare cgroup, and the same from `docker run --cpus=2`.

What makes it worth writing down is how easy it is to arrive at by accident. The
thread count usually comes from a default deep inside the inference library, or
from whatever `nproc` reported on the machine where somebody wrote the manifest.
The CPU limit comes from a completely separate conversation about capacity
planning, held by different people, months earlier. Nothing in Kubernetes connects
the two or warns you when they disagree. The pod runs. It just runs at a third of
the speed, and the number lands in a spreadsheet next to numbers taken on other
hardware.

There is a smaller sting in the tail. A pod squeezed that hard is also hard to
`kubectl exec` into, because the control path shares the quota with the workload.
Three attempts on that arm failed outright mid sweep and the harness had to open a
circuit breaker on it and come back later. So the arm that is misconfigured is also
the arm that is awkward to go and inspect.

## The ranking survived, which is the useful part

I ran five different model and quantization combinations through all of this. In
every arm, including the one losing two thirds of its throughput, they came out in
the same order.

That is the answer most people actually need. If you are benchmarking inside a pod
to decide between two quantization formats, or two model sizes, the pod does not
change your winner. The cost, where there is one, is close enough to multiplicative
that the comparison rides through it.

I did not expect to write that sentence, because my first pass at the analysis said
the opposite. It reported that four of four arms reordered the models, and I nearly
believed it. The reorderings were all swaps between models a few percent apart, in
data whose worst run to run spreads were over twenty percent. It was noise wearing
a conclusion. The analysis now refuses to call any difference real unless it
clears two standard errors, which is why the chart has a shaded band on it and why
three of the four bars are drawn as not-a-finding.

That correction is the reason I trust the rest of it.

## What I would do with this

Check that your CPU limit is at least your thread count. It is one line in a
manifest against one setting in a config file, they are usually written by
different people, and the failure is silent.

If you are comparing options rather than quoting absolute numbers, a pod is fine.
The ranking held here through a 64 percent penalty.

If you are quoting absolute throughput from inside a pod, put the quota next to it.
A number with no quota beside it cannot be compared with anything.

## The honest limits

The host arm is a process on a WSL2 Linux host, which is itself a virtual machine.
That layer is in all five arms so it cancels out of every comparison here, but
these are not bare metal numbers and I am not going to call them that.

One machine, one CPU architecture, one inference engine, one model family. This is
throughput, not tail latency, and tail latency under a CFS quota is a nastier
question, because throttling lands on individual requests rather than on an average.
And a home lab is not a fleet.

The framework, the fifty records, the report and the figure are in
[ml-systems-lab](https://github.com/manunicholasjacob/ml-systems-lab), archived at
[10.5281/zenodo.22162103](https://doi.org/10.5281/zenodo.22162103). The whole
thing is one config file:

```bash
git clone https://github.com/manunicholasjacob/ml-systems-lab
cd ml-systems-lab && pip install -e .
# docker/README.md is the setup: build the image, load it into k3s, pull the
# host arm's binaries back out of that same image, stage the models on the node
mlsys run configs/containerization.yaml --concurrent
python tools/containerization_report.py runs/containerization-tax --out /tmp/ct
```

What I would like is this on a machine that is not mine. A server chip with more
cores, where a quota is a likelier thing to be running under, or Arm, where the
memory system behaves differently enough that the answer might not be the same one.
If you run it, send me the numbers.
