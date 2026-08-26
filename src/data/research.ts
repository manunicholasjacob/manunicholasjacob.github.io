/**
 * The publication record.
 *
 * Source of truth: the private edge-inference-research-portfolio repo
 * (PAPERS_STATUS.md). Ordered submitted-first, in submission order, then the
 * submission-ready set in queue order. Statuses are kept current by hand.
 *
 * Deliberately excluded: the 2025 TechRxiv preprints (pending cleanup) and the
 * two discarded drafts that presented simulation as measurement.
 *
 * Also excluded, and this one was on the page until 23 August 2026: "The INT8
 * Configuration Cliff" (IEEE-ESL-Jul-26-0553). Its headline attributed a ~40x
 * latency swing to the ONNX export format. That attribution is wrong: one arm of
 * the experiment loaded a dynamically-quantized model rather than building the
 * static one it claimed to build, so the swing was dynamic against static, which
 * is a different and well-known effect. Papers 3 and 14 were written to correct
 * it, and `int8-pays` below carries the corrected result. The manuscript is
 * technically still open at the venue but its revise-and-resubmit window has
 * lapsed, so it is not being pursued. A paper nobody is pursuing, whose headline
 * two later papers retract, is not a publication record; it is a liability.
 * The artifact repository stays public on /projects and opens with a correction
 * notice, which is the honest place for it.
 */

export type Paper = {
  id: string;
  title: string;
  /** The one-line claim. Say what was found, not what was studied. */
  claim: string;
  /** The number a reviewer would remember. */
  headline: string;
  venue: string;
  venueTier: 'Journal' | 'Letters' | 'Conference' | 'Workshop';
  status: string;
  /** Submission date or target, shown in the meta column. */
  dateline: string;
  /**
   * ISO submission date, used only to place the paper on the cadence axis.
   * `dateline` above stays the human-readable source of truth. Where the
   * record only preserves the month, this is the 15th, and the axis is
   * labelled by month so the approximation is never shown as a precise day.
   */
  submitted?: string;
  /** A future fixed deadline, drawn on the axis as an open mark. */
  deadline?: string;
  /**
   * Spec-table rows for the anchor slot on the home page. Only numbers that
   * already appear elsewhere on the site; this is presentation, not new claims.
   */
  facts?: readonly (readonly [string, string])[];
  year: string;
  topics: string[];
  artifact?: { repo: string; doi: string };
  featured?: boolean;
};

export const papers: Paper[] = [
  /* ── Submitted, in submission order ─────────────────────────────── */
  {
    id: 'thermal-proxy',
    title: 'CPU Utilization as a Software-Only Thermal Proxy',
    claim:
      'A cross-validated CPU-temperature coupling law that needs no extra sensors, released with an open 13-hour telemetry dataset so others can re-run it.',
    headline: 'Open 13-hour telemetry dataset, no added hardware',
    venue: 'IEEE Embedded Systems Letters',
    venueTier: 'Letters',
    status: 'Under review',
    dateline: 'Submitted 27 Jul 2026',
    year: '2026',
    topics: ['Thermal', 'Telemetry', 'Open dataset'],
    submitted: '2026-07-27',
    artifact: { repo: 'pi5-thermal-proxy', doi: '10.5281/zenodo.21844859' },
  },
  {
    id: 'memory-wall',
    title: 'The Memory Wall Governs Edge DNN Inference',
    claim:
      'Thread scaling, multi-tenant interference and INT8 speedups are not three separate phenomena. All three fall out of a single measured bandwidth ceiling.',
    headline: '20.5% leave-one-model-out prediction error across 9 CNNs and a ViT',
    facts: [
      ['Models', '9 CNNs + 1 ViT'],
      ['Silicon', 'Arm Cortex-A76, revalidated on x86'],
      ['Instrumentation', 'perf counters + PMIC power'],
    ],
    venue: 'ACM Transactions on Embedded Computing Systems',
    venueTier: 'Journal',
    status: 'Under review',
    dateline: 'Submitted 28 Jul 2026',
    year: '2026',
    topics: ['Roofline', 'Memory bandwidth', 'Cortex-A76'],
    submitted: '2026-07-28',
    featured: true,
  },
  {
    id: 'energy-optimal',
    title: 'Latency-Optimal Is Not Energy-Optimal',
    claim:
      'Running an edge SBC at maximum clock wastes roughly a fifth of the energy per inference, and the waste is core-stall energy rather than DRAM energy. That reverses the usual intuition.',
    headline: '~20% energy wasted at max clock, with a deployable clock-selection policy',
    venue: 'ACM Transactions on Embedded Computing Systems',
    venueTier: 'Journal',
    status: 'Under review',
    dateline: 'Submitted 6 Aug 2026',
    year: '2026',
    topics: ['Energy', 'DVFS', 'Power telemetry'],
    submitted: '2026-08-06',
    featured: true,
  },
  {
    id: 'thermal-margin',
    title: 'When Thermal-Margin Control Helps and When It Hurts',
    claim:
      'An honest operating-regime study of convex thermal allocation for multi-tenant edge inference, including the regimes where the controller is the wrong answer.',
    headline: 'Maps the regime boundary rather than claiming a universal win',
    venue: 'IEEE Embedded Systems Letters',
    venueTier: 'Letters',
    status: 'Under review',
    dateline: 'Submitted 6 Aug 2026',
    year: '2026',
    topics: ['Thermal', 'Control', 'Multi-tenant'],
    submitted: '2026-08-06',
    artifact: { repo: 'edge-thermal-margin-control', doi: '10.5281/zenodo.21844861' },
  },
  {
    id: 'cold-start',
    title: 'The Cold-Start Tax',
    claim:
      'The first systematic characterisation of the duty-cycled wake transient on an edge SBC. The tax is weight-loading-bound, predictable from model size alone, and falls off an eviction cliff. Includes GD-Tax, a tax-aware cache that beats LRU and LFU.',
    headline: '5x to 23x wake tax, R^2 = 1.00 loading-bound fit, >80x blow-up past eviction',
    venue: 'IEEE Internet of Things Journal',
    venueTier: 'Journal',
    status: 'Under review',
    dateline: 'Submitted 6 Aug 2026',
    year: '2026',
    topics: ['Duty cycling', 'Cache policy', 'GD-Tax'],
    submitted: '2026-08-06',
    artifact: { repo: 'edge-cold-start-tax', doi: '10.5281/zenodo.21844857' },
    featured: true,
  },
  {
    id: 'edge-llm',
    title: 'The Memory Wall at the Edge of Language',
    claim:
      'The bandwidth ceiling that governs CNN inference governs on-device LLM decode too, and the KV cache turns it into a hard capacity wall. The same law holds on x86 at three times the bandwidth, so the roofline is the platform-independent part.',
    headline: 'Decode roofline R^2 = 0.98, unchanged on x86 at three times the bandwidth',
    venue: 'IEEE Transactions on Computers',
    venueTier: 'Journal',
    status: 'Under review',
    dateline: 'Submitted 7 Aug 2026',
    year: '2026',
    topics: ['LLM inference', 'KV cache', 'llama.cpp'],
    submitted: '2026-08-07',
    artifact: { repo: 'edge-llm-memory-wall', doi: '10.5281/zenodo.21844855' },
  },

  {
    // CAL-2026-08-0286, submitted 17 Aug 2026.
    id: 'hybrid-core',
    title: 'The Hybrid-Core Decode Cliff',
    claim:
      'On CPUs that mix performance and efficiency cores, LLM decode throughput does not scale smoothly with thread count. It collapses once the scheduler starts placing decode work on the efficiency cores, and the fastest configuration is not the widest one.',
    headline: 'Decode throughput collapses on performance-plus-efficiency CPUs',
    venue: 'IEEE Computer Architecture Letters',
    venueTier: 'Letters',
    status: 'Under review',
    dateline: 'Submitted 17 Aug 2026',
    year: '2026',
    topics: ['LLM inference', 'Hybrid cores', 'Scheduling'],
    submitted: '2026-08-17',
  },
  {
    // DTSI-2026-08-0079, submitted 17 Aug 2026, invited special issue.
    id: 'four-walls',
    title: 'Four Walls Before Hello: Deploying LLMs at the Edge',
    claim:
      'A deployment guide rather than a new measurement: the four limits that decide whether an on-device language model is viable at all, drawn together from the bandwidth, cold-start, quantization and energy results and written for people shipping hardware.',
    headline: 'Synthesises four measurement papers into one deployment guide',
    venue: 'IEEE Design & Test',
    venueTier: 'Journal',
    status: 'Under review',
    dateline: 'Submitted 17 Aug 2026',
    year: '2026',
    topics: ['LLM inference', 'Edge deployment', 'Invited special issue'],
    submitted: '2026-08-17',
  },

  /* ── Submission-ready, in queue order ───────────────────────────── */
  {
    id: 'anytime',
    title: 'The Narrow Regime of Thermal-Aware Anytime Inference',
    claim:
      'Anytime inference is widely proposed for thermally constrained edge devices. This maps the narrow regime where it actually pays, and shows quantization compresses the exit ladder enough to shrink the controller’s authority.',
    headline: 'Quantization compresses the exit ladder from 20.6x to 6.9x',
    venue: 'IEEE Embedded Systems Letters',
    venueTier: 'Letters',
    /* Withdrawn from DATE 2027 on 24 Aug 2026 (submission 38X-B8H4G8E6D7, received
       15 Aug 2026). DATE is in-person only, forbids non-author presenters, and pulls
       a paper from the proceedings if no author attends; a single-author portfolio
       has no substitute presenter. Recut from 6pp to a 4pp ESL letter, which is
       rolling, free and needs no travel. NOT yet submitted, so this is deliberately
       not 'Under review' and the site's under-review count is 11 while that holds.
       Move it back to 'Under review' with the date on the day it goes in. */
    status: 'Ready to submit',
    dateline: 'Withdrawn from DATE, recut for IEEE ESL',
    year: '2027',
    topics: ['Anytime inference', 'SLO', 'Thermal'],
    submitted: '2026-08-15',
  },
  {
    id: 'llm-cold-start',
    title: 'The Cold-Start Tax at the Edge of Language',
    claim:
      'The wake transient for on-device LLMs, where the model is 50 to 100x larger than a CNN. A phase-level decomposition shows about a fifth of the tax is the loader rather than the storage device, and a purpose-built loader recovers it.',
    headline: 'A fifth of the LLM wake tax is software, and a better loader wins it back',
    // TECS-2026-0241, submitted 17 Aug 2026. Venue moved from IEEE IoT-J.
    venue: 'ACM Transactions on Embedded Computing Systems',
    venueTier: 'Journal',
    status: 'Under review',
    dateline: 'Submitted 17 Aug 2026',
    submitted: '2026-08-17',
    year: '2026',
    topics: ['LLM inference', 'Duty cycling', 'Storage'],
  },
  {
    id: 'int8-pays',
    title: 'When Does INT8 Actually Pay on an Edge CPU?',
    claim:
      'Post-training INT8 measured across three microarchitectures on Arm and x86. The dominant effect is dynamic versus static quantization, worth more than 4x; the export representation everyone argues about is worth about 18%. Grew out of correcting our own earlier misattribution.',
    headline: 'Dynamic vs static is worth >4x; the representation, ~18%',
    // IEEE-ESL-Aug-26-0653, submitted 17 Aug 2026.
    venue: 'IEEE Embedded Systems Letters',
    venueTier: 'Letters',
    status: 'Under review',
    dateline: 'Submitted 17 Aug 2026',
    submitted: '2026-08-17',
    year: '2026',
    topics: ['Quantization', 'Cross-platform', 'Correction'],
  },
  {
    id: 'break-even',
    title: 'The Break-Even Parallel Speedup',
    claim:
      'For early-exit inference, the latency-optimal configuration costs about twice the energy of the energy-optimal one at shallow exits, and the first-order lever is thread count, not clock. A closed-form break-even rule predicts the right choice.',
    headline: 'Rule validated on 64 of 64 measured configurations',
    // CAL-2026-08-0285, submitted 17 Aug 2026.
    venue: 'IEEE Computer Architecture Letters',
    venueTier: 'Letters',
    status: 'Under review',
    dateline: 'Submitted 17 Aug 2026',
    submitted: '2026-08-17',
    year: '2026',
    topics: ['Energy', 'Early exit', 'Parallelism'],
    // Artifact went public after submission, so the manuscript does not cite it.
    artifact: { repo: 'edge-breakeven-speedup', doi: '10.5281/zenodo.21987261' },
  },
  {
    id: 'gpu-repro',
    title: 'Profiling Inference on a Consumer Laptop GPU',
    claim:
      'A clock-gated methodology that makes consumer-GPU inference numbers reproducible between runs, kept honest by a drift artifact we caught in our own background jobs and left in as the counterexample.',
    headline: 'Clock-gated protocol for repeatable GPU measurement',
    venue: 'EuroMLSys (EuroSys workshop)',
    venueTier: 'Workshop',
    status: 'Ready, awaiting CFP',
    dateline: 'CFP expected Nov 2026',
    year: '2027',
    topics: ['GPU', 'Methodology', 'Reproducibility'],
  },
];

export const featuredPapers = papers.filter((p) => p.featured);
export const submittedCount = papers.filter((p) =>
  /review|revision/i.test(p.status),
).length;

/**
 * The through-line. The claim is deliberately repeated on both pages, but the
 * supporting paragraph is not: the home page says what the finding is, the
 * research page says what standard it was held to. An earlier version printed
 * the same four sentences in both places, which read as padding.
 */
export const researchThesis = {
  claim: 'The memory wall, not compute, governs deep-neural-network inference on real hardware.',
  /** Home page: what the result is. */
  intro: `The same bottleneck turns up in mobile CNNs, in Vision Transformers and in on-device language models. The machine spends its time moving weights, not multiplying them, so bandwidth predicts what a network will do and FLOPs do not. Every paper below follows that one idea from a Raspberry Pi to an x86 laptop, and next to enterprise servers.`,
  /** Research page: what standard it was held to. */
  body: `One physical idea carried across scales: from mobile CNNs, to Vision Transformers, to on-device language models, measured on Arm and revalidated on x86, and next headed for enterprise servers. Every headline number comes from real silicon, using hardware performance counters and on-board power instrumentation. Where a claim failed to reproduce, the paper was rewritten to whatever the data actually supported, negative results included, and two early drafts that presented simulation as measurement were discarded outright. That standard keeps costing claims, which is the point.`,
};
