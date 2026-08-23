---
title: I had five benchmark harnesses and they did not agree with each other
description: Every paper grew its own set of scripts, and by the fifth one I could no longer tell whether a difference between two results was the hardware or the harness. Rebuilding them as one framework was the only way to find out.
date: 2026-09-05
kind: Method
topics: ['Reproducibility', 'Tooling', 'Benchmarking', 'Method']
readingTime: 7
draft: true
---

Every measurement project I started grew its own scripts. That is how these
things go. You need one number, you write forty lines to get it, the forty lines
work, and eight months later there are five separate piles of them and each pile
knows a slightly different set of tricks.

The moment it became a problem was mundane. Two results disagreed by a few
percent and I could not tell whether that was the machine or the code that
measured the machine. Both piles were mine. Neither recorded enough about the
run to settle it.

That is the failure I want to describe, because it is quiet and it does not throw
an error. A harness that measures the wrong thing consistently looks exactly like
a harness that measures the right thing.

## What went wrong in the piles

**Nothing recorded the state of the machine.** A benchmark result is a number
about a piece of hardware in a particular physical condition: a temperature, a
clock frequency, a throttle state, whatever else was running. Four of the five
piles recorded the number and threw the condition away.

**A parser bug meant re-running the experiment.** The scripts parsed the tool's
output inline and kept only the result. So a mistake in the parsing meant hours of
measurement had to happen again, on hardware I had to physically go and use.

**A failure left no trace.** A run that crashed simply produced no row. Later,
looking at a results directory, there is no way to tell a configuration that was
never attempted from one that was attempted and died.

**Adding a machine meant writing code.** Each pile knew about the machines it grew
up on. Getting a fifth pile onto the Raspberry Pi meant porting it.

## Rebuilding it as one thing

So I rewrote all five as one framework. One configuration file names the
machines, the models and the sweep. One command runs it.

The design decisions that actually earned their keep:

**Every run writes a self-describing record.** Hardware, kernel, compiler,
backend version, model, quantization, the metrics, and the physical state of the
machine while they were measured: power, temperature, clocks, throttle flags,
processor utilisation. Anything the platform cannot measure is recorded as absent
rather than as zero, which sounds pedantic until you try to average a column of
zeroes that meant "no sensor".

**Raw output is kept.** Parsing happens on the host afterwards, so a parser bug is
a re-parse rather than a re-run.

**Failures are records too.** A crashed configuration writes a record saying it
crashed.

**A new machine is a config block.** A hostname, an SSH key and the paths to its
models. The agent that runs on the device under test uses nothing but the
standard library, and nothing crosses the network inside a measurement window.

## The test that mattered

A framework that produces different numbers from the scripts it replaced is
worthless, however tidy it is. So the first thing I did was backfill the previous
campaign's raw measurements into the new record format and check that the
analysis layer reproduced its published fits.

It did, exactly. Then I ran the whole campaign again, natively, weeks later, on
the same board.

<figure>
<!--FIG:fig-agreement-->
<svg viewBox="0 0 720 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="t-agree d-agree" style="width:100%;height:auto;display:block;overflow:visible">
<title id="t-agree">The same Raspberry Pi 5 measured twice, by two different harnesses, weeks apart</title>
<desc id="d-agree">The same Raspberry Pi 5 measured twice, by two different harnesses, weeks apart</desc>
<g font-family="ui-monospace, JetBrains Mono Variable, monospace" font-size="11">
<line x1="62" y1="354" x2="698" y2="354" stroke="var(--hairline)" stroke-width="1"/>
<line x1="62" y1="30" x2="62" y2="354" stroke="var(--hairline)" stroke-width="1"/>
<text x="380.0" y="392" fill="var(--fg-faint)" text-anchor="middle" letter-spacing="0.08em">BYTES READ PER TOKEN (GB)</text>
<text transform="translate(14,192.0) rotate(-90)" fill="var(--fg-faint)" text-anchor="middle" letter-spacing="0.08em">DECODE (TOKENS/S)</text>
<line x1="62" y1="354.0" x2="698" y2="354.0" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="54" y="357.5" fill="var(--fg-faint)" text-anchor="end">0</text>
<line x1="62" y1="273.0" x2="698" y2="273.0" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="54" y="276.5" fill="var(--fg-faint)" text-anchor="end">10</text>
<line x1="62" y1="192.0" x2="698" y2="192.0" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="54" y="195.5" fill="var(--fg-faint)" text-anchor="end">20</text>
<line x1="62" y1="111.0" x2="698" y2="111.0" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="54" y="114.5" fill="var(--fg-faint)" text-anchor="end">30</text>
<line x1="62" y1="30.0" x2="698" y2="30.0" stroke="var(--hairline)" stroke-dasharray="2 4"/>
<text x="54" y="33.5" fill="var(--fg-faint)" text-anchor="end">40</text>
<line x1="62.0" y1="354" x2="62.0" y2="358" stroke="var(--hairline)"/>
<text x="62.0" y="372" fill="var(--fg-faint)" text-anchor="middle">0.00</text>
<line x1="221.0" y1="354" x2="221.0" y2="358" stroke="var(--hairline)"/>
<text x="221.0" y="372" fill="var(--fg-faint)" text-anchor="middle">0.28</text>
<line x1="380.0" y1="354" x2="380.0" y2="358" stroke="var(--hairline)"/>
<text x="380.0" y="372" fill="var(--fg-faint)" text-anchor="middle">0.55</text>
<line x1="539.0" y1="354" x2="539.0" y2="358" stroke="var(--hairline)"/>
<text x="539.0" y="372" fill="var(--fg-faint)" text-anchor="middle">0.83</text>
<line x1="698.0" y1="354" x2="698.0" y2="358" stroke="var(--hairline)"/>
<text x="698.0" y="372" fill="var(--fg-faint)" text-anchor="middle">1.10</text>
<polyline points="217.8,32.4 219.4,35.7 221.0,38.8 222.6,42.0 224.2,45.0 225.8,48.0 227.4,51.0 229.0,53.8 230.5,56.7 232.1,59.5 233.7,62.2 235.3,64.9 236.9,67.5 238.5,70.1 240.1,72.6 241.7,75.1 243.3,77.5 244.8,79.9 246.4,82.3 248.0,84.6 249.6,86.9 251.2,89.2 252.8,91.4 254.4,93.5 256.0,95.7 257.6,97.8 259.2,99.8 260.8,101.9 262.3,103.9 263.9,105.8 265.5,107.8 267.1,109.7 268.7,111.6 270.3,113.4 271.9,115.2 273.5,117.0 275.1,118.8 276.6,120.5 278.2,122.3 279.8,124.0 281.4,125.6 283.0,127.3 284.6,128.9 286.2,130.5 287.8,132.1 289.4,133.6 291.0,135.1 292.5,136.6 294.1,138.1 295.7,139.6 297.3,141.1 298.9,142.5 300.5,143.9 302.1,145.3 303.7,146.7 305.3,148.0 306.9,149.3 308.5,150.7 310.0,152.0 311.6,153.3 313.2,154.5 314.8,155.8 316.4,157.0 318.0,158.2 319.6,159.5 321.2,160.6 322.8,161.8 324.4,163.0 325.9,164.1 327.5,165.3 329.1,166.4 330.7,167.5 332.3,168.6 333.9,169.7 335.5,170.8 337.1,171.8 338.7,172.9 340.2,173.9 341.8,174.9 343.4,175.9 345.0,176.9 346.6,177.9 348.2,178.9 349.8,179.9 351.4,180.8 353.0,181.8 354.6,182.7 356.2,183.6 357.7,184.6 359.3,185.5 360.9,186.4 362.5,187.2 364.1,188.1 365.7,189.0 367.3,189.9 368.9,190.7 370.5,191.5 372.1,192.4 373.6,193.2 375.2,194.0 376.8,194.8 378.4,195.6 380.0,196.4 381.6,197.2 383.2,198.0 384.8,198.7 386.4,199.5 388.0,200.3 389.5,201.0 391.1,201.7 392.7,202.5 394.3,203.2 395.9,203.9 397.5,204.6 399.1,205.3 400.7,206.0 402.3,206.7 403.8,207.4 405.4,208.1 407.0,208.8 408.6,209.4 410.2,210.1 411.8,210.7 413.4,211.4 415.0,212.0 416.6,212.7 418.2,213.3 419.8,213.9 421.3,214.5 422.9,215.2 424.5,215.8 426.1,216.4 427.7,217.0 429.3,217.6 430.9,218.2 432.5,218.7 434.1,219.3 435.6,219.9 437.2,220.5 438.8,221.0 440.4,221.6 442.0,222.1 443.6,222.7 445.2,223.2 446.8,223.8 448.4,224.3 450.0,224.8 451.5,225.4 453.1,225.9 454.7,226.4 456.3,226.9 457.9,227.4 459.5,227.9 461.1,228.4 462.7,228.9 464.3,229.4 465.9,229.9 467.4,230.4 469.0,230.9 470.6,231.4 472.2,231.8 473.8,232.3 475.4,232.8 477.0,233.2 478.6,233.7 480.2,234.2 481.8,234.6 483.3,235.1 484.9,235.5 486.5,236.0 488.1,236.4 489.7,236.8 491.3,237.3 492.9,237.7 494.5,238.1 496.1,238.6 497.7,239.0 499.2,239.4 500.8,239.8 502.4,240.2 504.0,240.6 505.6,241.0 507.2,241.4 508.8,241.8 510.4,242.2 512.0,242.6 513.6,243.0 515.1,243.4 516.7,243.8 518.3,244.2 519.9,244.6 521.5,244.9 523.1,245.3 524.7,245.7 526.3,246.1 527.9,246.4 529.5,246.8 531.0,247.2 532.6,247.5 534.2,247.9 535.8,248.2 537.4,248.6 539.0,248.9 540.6,249.3 542.2,249.6 543.8,250.0 545.4,250.3 547.0,250.7 548.5,251.0 550.1,251.3 551.7,251.7 553.3,252.0 554.9,252.3 556.5,252.7 558.1,253.0 559.7,253.3 561.3,253.6 562.8,253.9 564.4,254.3 566.0,254.6 567.6,254.9 569.2,255.2 570.8,255.5 572.4,255.8 574.0,256.1 575.6,256.4 577.2,256.7 578.8,257.0 580.3,257.3 581.9,257.6 583.5,257.9 585.1,258.2 586.7,258.5 588.3,258.8 589.9,259.1 591.5,259.4 593.1,259.6 594.6,259.9 596.2,260.2 597.8,260.5 599.4,260.8 601.0,261.0 602.6,261.3 604.2,261.6 605.8,261.8 607.4,262.1 609.0,262.4 610.6,262.6 612.1,262.9 613.7,263.2 615.3,263.4 616.9,263.7 618.5,264.0 620.1,264.2 621.7,264.5 623.3,264.7 624.9,265.0 626.5,265.2 628.0,265.5 629.6,265.7 631.2,266.0 632.8,266.2 634.4,266.5 636.0,266.7 637.6,266.9 639.2,267.2 640.8,267.4 642.4,267.7 643.9,267.9 645.5,268.1 647.1,268.4 648.7,268.6 650.3,268.8 651.9,269.1 653.5,269.3 655.1,269.5 656.7,269.7 658.3,270.0 659.8,270.2 661.4,270.4 663.0,270.6 664.6,270.8 666.2,271.1 667.8,271.3 669.4,271.5 671.0,271.7 672.6,271.9 674.1,272.1 675.7,272.4 677.3,272.6 678.9,272.8 680.5,273.0 682.1,273.2 683.7,273.4 685.3,273.6 686.9,273.8 688.5,274.0 690.1,274.2 691.6,274.4 693.2,274.6 694.8,274.8 696.4,275.0 698.0,275.2" fill="none" stroke="var(--accent)" stroke-width="1.4"/>
<circle cx="257.8" cy="101.8" r="4" fill="var(--accent)"/>
<circle cx="267.5" cy="118.1" r="4" fill="var(--accent)"/>
<circle cx="292.0" cy="126.8" r="4" fill="var(--accent)"/>
<circle cx="304.9" cy="147.1" r="4" fill="var(--accent)"/>
<circle cx="369.1" cy="199.4" r="4" fill="var(--accent)"/>
<circle cx="529.0" cy="237.3" r="4" fill="var(--accent)"/>
<circle cx="632.1" cy="255.2" r="4" fill="var(--accent)"/>
<text x="698" y="34" fill="var(--accent)" text-anchor="end" font-size="11">Paper 12, hand-rolled scripts: 10.70 GB/s</text>
<polyline points="214.6,31.2 216.2,34.6 217.8,37.8 219.4,41.0 221.0,44.1 222.6,47.2 224.2,50.2 225.8,53.2 227.4,56.1 229.0,58.9 230.5,61.7 232.1,64.4 233.7,67.1 235.3,69.7 236.9,72.3 238.5,74.8 240.1,77.3 241.7,79.8 243.3,82.2 244.8,84.6 246.4,86.9 248.0,89.2 249.6,91.4 251.2,93.6 252.8,95.8 254.4,97.9 256.0,100.0 257.6,102.1 259.2,104.1 260.8,106.1 262.3,108.1 263.9,110.0 265.5,111.9 267.1,113.8 268.7,115.6 270.3,117.5 271.9,119.3 273.5,121.0 275.1,122.8 276.6,124.5 278.2,126.2 279.8,127.8 281.4,129.5 283.0,131.1 284.6,132.7 286.2,134.2 287.8,135.8 289.4,137.3 291.0,138.8 292.5,140.3 294.1,141.8 295.7,143.2 297.3,144.6 298.9,146.0 300.5,147.4 302.1,148.8 303.7,150.1 305.3,151.5 306.9,152.8 308.5,154.1 310.0,155.4 311.6,156.6 313.2,157.9 314.8,159.1 316.4,160.3 318.0,161.5 319.6,162.7 321.2,163.9 322.8,165.1 324.4,166.2 325.9,167.3 327.5,168.5 329.1,169.6 330.7,170.6 332.3,171.7 333.9,172.8 335.5,173.8 337.1,174.9 338.7,175.9 340.2,176.9 341.8,177.9 343.4,178.9 345.0,179.9 346.6,180.9 348.2,181.9 349.8,182.8 351.4,183.7 353.0,184.7 354.6,185.6 356.2,186.5 357.7,187.4 359.3,188.3 360.9,189.2 362.5,190.1 364.1,190.9 365.7,191.8 367.3,192.6 368.9,193.4 370.5,194.3 372.1,195.1 373.6,195.9 375.2,196.7 376.8,197.5 378.4,198.3 380.0,199.1 381.6,199.8 383.2,200.6 384.8,201.4 386.4,202.1 388.0,202.8 389.5,203.6 391.1,204.3 392.7,205.0 394.3,205.7 395.9,206.4 397.5,207.1 399.1,207.8 400.7,208.5 402.3,209.2 403.8,209.9 405.4,210.5 407.0,211.2 408.6,211.9 410.2,212.5 411.8,213.2 413.4,213.8 415.0,214.4 416.6,215.0 418.2,215.7 419.8,216.3 421.3,216.9 422.9,217.5 424.5,218.1 426.1,218.7 427.7,219.3 429.3,219.9 430.9,220.4 432.5,221.0 434.1,221.6 435.6,222.1 437.2,222.7 438.8,223.3 440.4,223.8 442.0,224.4 443.6,224.9 445.2,225.4 446.8,226.0 448.4,226.5 450.0,227.0 451.5,227.5 453.1,228.0 454.7,228.5 456.3,229.1 457.9,229.6 459.5,230.1 461.1,230.5 462.7,231.0 464.3,231.5 465.9,232.0 467.4,232.5 469.0,233.0 470.6,233.4 472.2,233.9 473.8,234.4 475.4,234.8 477.0,235.3 478.6,235.7 480.2,236.2 481.8,236.6 483.3,237.1 484.9,237.5 486.5,237.9 488.1,238.4 489.7,238.8 491.3,239.2 492.9,239.7 494.5,240.1 496.1,240.5 497.7,240.9 499.2,241.3 500.8,241.7 502.4,242.1 504.0,242.5 505.6,242.9 507.2,243.3 508.8,243.7 510.4,244.1 512.0,244.5 513.6,244.9 515.1,245.3 516.7,245.7 518.3,246.0 519.9,246.4 521.5,246.8 523.1,247.2 524.7,247.5 526.3,247.9 527.9,248.2 529.5,248.6 531.0,249.0 532.6,249.3 534.2,249.7 535.8,250.0 537.4,250.4 539.0,250.7 540.6,251.1 542.2,251.4 543.8,251.7 545.4,252.1 547.0,252.4 548.5,252.7 550.1,253.1 551.7,253.4 553.3,253.7 554.9,254.0 556.5,254.4 558.1,254.7 559.7,255.0 561.3,255.3 562.8,255.6 564.4,255.9 566.0,256.3 567.6,256.6 569.2,256.9 570.8,257.2 572.4,257.5 574.0,257.8 575.6,258.1 577.2,258.4 578.8,258.7 580.3,259.0 581.9,259.2 583.5,259.5 585.1,259.8 586.7,260.1 588.3,260.4 589.9,260.7 591.5,260.9 593.1,261.2 594.6,261.5 596.2,261.8 597.8,262.1 599.4,262.3 601.0,262.6 602.6,262.9 604.2,263.1 605.8,263.4 607.4,263.7 609.0,263.9 610.6,264.2 612.1,264.4 613.7,264.7 615.3,265.0 616.9,265.2 618.5,265.5 620.1,265.7 621.7,266.0 623.3,266.2 624.9,266.5 626.5,266.7 628.0,267.0 629.6,267.2 631.2,267.4 632.8,267.7 634.4,267.9 636.0,268.2 637.6,268.4 639.2,268.6 640.8,268.9 642.4,269.1 643.9,269.3 645.5,269.6 647.1,269.8 648.7,270.0 650.3,270.3 651.9,270.5 653.5,270.7 655.1,270.9 656.7,271.1 658.3,271.4 659.8,271.6 661.4,271.8 663.0,272.0 664.6,272.2 666.2,272.5 667.8,272.7 669.4,272.9 671.0,273.1 672.6,273.3 674.1,273.5 675.7,273.7 677.3,273.9 678.9,274.1 680.5,274.3 682.1,274.5 683.7,274.8 685.3,275.0 686.9,275.2 688.5,275.4 690.1,275.6 691.6,275.8 693.2,275.9 694.8,276.1 696.4,276.3 698.0,276.5" fill="none" stroke="var(--fg)" stroke-width="1.4"/>
<rect x="250.9" y="99.2" width="7" height="7" fill="none" stroke="var(--fg)" stroke-width="1.5"/>
<rect x="260.6" y="112.5" width="7" height="7" fill="none" stroke="var(--fg)" stroke-width="1.5"/>
<rect x="285.1" y="133.2" width="7" height="7" fill="none" stroke="var(--fg)" stroke-width="1.5"/>
<rect x="297.9" y="143.9" width="7" height="7" fill="none" stroke="var(--fg)" stroke-width="1.5"/>
<rect x="362.1" y="185.8" width="7" height="7" fill="none" stroke="var(--fg)" stroke-width="1.5"/>
<rect x="521.0" y="232.6" width="7" height="7" fill="none" stroke="var(--fg)" stroke-width="1.5"/>
<rect x="625.2" y="253.9" width="7" height="7" fill="none" stroke="var(--fg)" stroke-width="1.5"/>
<text x="698" y="51" fill="var(--fg)" text-anchor="end" font-size="11">ml-systems-lab, weeks later: 10.52 GB/s</text>
<text x="698" y="72" fill="var(--fg-muted)" text-anchor="end" font-size="10.5">the two lines are 1.7% apart, which is why you can barely see two</text>
</g>
</svg>
<!--/FIG-->
<figcaption>
The same Raspberry Pi 5, measured twice. Filled circles are the original campaign's
hand-rolled scripts; hollow squares are the framework running the same experiment
weeks later over SSH with its own telemetry. The two fitted effective bandwidths
are 10.70 and 10.52 gigabytes per second.
Data: <a href="https://github.com/manunicholasjacob/ml-systems-lab">ml-systems-lab</a>.
</figcaption>
</figure>

Two independent campaigns, different code, weeks apart, landing within about 1.7
percent of each other on the quantity the whole research programme rests on. The
laptop half came out at 35.7 gigabytes per second both times.

That agreement is the only reason I trust either number.

## The one that caught a real problem

The framework flags any run whose repetitions spread more than a threshold, and
during the first Pi campaign five points in the power block tripped it. Their
spread was between 30 and 103 percent against a campaign norm under 2.5 percent.

Something else had been running on the machine. Under the old scripts those five
points would have gone quietly into an average and shifted a published number by
a few percent, and nothing would ever have flagged them. They were deleted and
re-measured on an idle board.

There is nothing clever about the flag. A standard deviation and a threshold,
which is a first-year exercise. It works only because the record carries enough
about the run to compute it at all, and that was the part the old scripts were
missing.

## Two facts that fell out for free

Once every machine speaks the same configuration file, comparisons that used to be
projects become one run.

The same config shows a laptop's graphics card losing to its own processor at one
request at a time, 12.3 milliseconds against 3.0, because the cost of dispatching
work to the card dominates. At sixty-four requests at once the same card wins by
29 times, 9,885 inferences a second against 338. Both numbers come out of one
file, which is the point.

And eight-bit quantization is about eleven times faster than 32-bit on the
Raspberry Pi's processor while being roughly three and a half times *slower* on
the laptop's. Same models, same runtime. Two lines in the same report.

## Using it

```bash
pip install ml-systems-lab
mlsys run configs/example-smoke.yaml
mlsys report runs/smoke-test --full
```

Code on [GitHub](https://github.com/manunicholasjacob/ml-systems-lab), archived at
[10.5281/zenodo.21867055](https://doi.org/10.5281/zenodo.21867055). The committed
result sets under `results/` are complete datasets, records and generated report
together, not summaries.

If you keep a bench of machines and a pile of scripts, the question worth asking
is whether any of your results could be re-derived from what your scripts wrote
down. Mine could not, for four out of five. That was the whole problem.
