/**
 * The publication record.
 *
 * Source of truth: the private edge-inference-research-portfolio repo
 * (PAPERS_STATUS.md). Ordered submitted-first, in submission order, then the
 * submission-ready set in queue order. Statuses are kept current by hand.
 *
 * Only manuscripts that are submitted or actively being prepared are listed.
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
    // IEEE-ESL-Sep-26-0719. The July manuscript (0569) was desk-declined on
    // 3 Sep for a missing SOTA comparison; the revision added one on the
    // released dataset and went back the same week.
    status: 'Under review',
    dateline: 'Revised and resubmitted 5 Sep 2026',
    year: '2026',
    topics: ['Thermal', 'Telemetry', 'Open dataset'],
    submitted: '2026-09-05',
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
    // Declined at ACM TECS late Sep 2026 (read as a measurement report by
    // the general pool); rebuilt on the referees' concrete list and submitted
    // 27 Sep to SUSCOM's Energy-aware AI special issue (SUSCOM-D-26-03833).
    venue: 'Sustainable Computing: Informatics and Systems',
    venueTier: 'Journal',
    status: 'Under review',
    dateline: 'Declined at ACM TECS, resubmitted 27 Sep 2026',
    year: '2026',
    topics: ['Energy', 'DVFS', 'Power telemetry'],
    submitted: '2026-09-27',
    featured: true,
  },
  {
    id: 'thermal-margin',
    title: 'When Thermal-Margin Control Helps and When It Hurts',
    claim:
      'An honest operating-regime study of convex thermal allocation for multi-tenant edge inference, including the regimes where the controller is the wrong answer.',
    headline: 'Maps the regime boundary rather than claiming a universal win',
    // Declined at IEEE ESL (3 Sep) and IoT-J (7 Sep). Rebuilt in full with
    // matched baselines and open-loop arrivals; the rebuilt result is more
    // honest than the original headline was. IEEE TSUSC desk-rejected it on
    // scope (10 Oct 2026), so it is no longer under review anywhere. No venue is
    // named until a submission is actually in (same rule as 'anytime').
    venue: 'Venue in selection',
    venueTier: 'Journal',
    status: 'Being re-homed',
    dateline: 'Rebuilt with matched baselines; returned on scope 10 Oct 2026',
    year: '2026',
    topics: ['Thermal', 'Control', 'Multi-tenant'],
    submitted: '2026-09-26',
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
    // Retitled from "The Memory Wall at the Edge of Language" when the paper
    // was rebuilt for IoT-J; the artifact repo description matches.
    title: 'One Law, Two Memory Systems',
    claim:
      'The bandwidth ceiling that governs CNN inference governs on-device LLM decode too, and the KV cache turns it into a hard capacity wall. The same law holds on x86 at three times the bandwidth, so the same one-line roofline transfers between the two CPUs measured.',
    headline: 'Decode roofline R^2 = 0.98, unchanged on x86 at three times the bandwidth',
    // TC-2026-08-0905 declined 8 Sep 2026; TC bars modified versions, so the
    // paper is rehomed rather than revised for the same venue.
    venue: 'IEEE Internet of Things Journal',
    venueTier: 'Journal',
    status: 'Under review',
    dateline: 'Rebuilt after the TC decline, submitted 22 Sep 2026',
    year: '2026',
    topics: ['LLM inference', 'KV cache', 'llama.cpp'],
    submitted: '2026-09-22',
    artifact: { repo: 'edge-llm-memory-wall', doi: '10.5281/zenodo.21844855' },
  },

  {
    // CAL-2026-08-0286, submitted 17 Aug 2026.
    id: 'hybrid-core',
    // Retitled from "The Hybrid-Core Decode Cliff" for the extended TPDS
    // version, whose controlled-headroom experiment revised the finding:
    // the cost of oversubscription is predictability, not throughput.
    title: 'Use More Threads, Not Fewer',
    claim:
      'LLM decode thread scaling measured on a hybrid-core i7-12700H and a Raspberry Pi 5. Oversubscription costs predictability rather than speed, and a controlled headroom experiment names the cause. Extends and revises the Letter-length version a reviewer asked to see grown up.',
    headline: 'Oversubscription costs predictability, not throughput',
    venue: 'IEEE Trans. on Parallel and Distributed Systems',
    venueTier: 'Journal',
    status: 'Under review',
    dateline: 'Extended after the CAL decline, submitted 23 Sep 2026',
    year: '2026',
    topics: ['LLM inference', 'Hybrid cores', 'Scheduling'],
    submitted: '2026-09-23',
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
      'Anytime inference is widely proposed for thermally constrained edge devices. This maps the narrow regime in which exit selection affects temperature at all, and shows quantization compresses the exit ladder enough to shrink the authority of the controller.',
    headline: 'Quantization compresses the exit ladder from 20.6x to 6.9x',
    /* No venue is named here on purpose: the obvious next home is barred by
       a prior decision at that venue, and the rule is that a venue claim goes
       up the day a submission is actually in, not before. The rebuild is
       real: the missing state-of-the-art comparison is now a measurement, 45
       interleaved runs on the Pi, and the controller is not dominated by the
       confidence-threshold baseline the early-exit literature leans on. */
    venue: 'Venue in selection',
    venueTier: 'Journal',
    status: 'In rebuild',
    dateline: 'Rebuilt around a measured state-of-the-art baseline',
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
      'Post-training INT8 measured across three microarchitectures on Arm and x86. The dominant effect is dynamic versus static quantization, worth about a factor of four; once both are produced statically, the export representation everyone argues about is worth a median of 1.5% across 27 model and core pairs.',
    // Median-led, as the manuscript states it (median 1.5%, 21 of 27 pairs
    // within 5%). The old "about 18%" was the widest single pair, not the
    // typical one, so it overstated the representation effect.
    headline: 'Dynamic vs static: about 4x. The representation: a median 1.5%',
    // IEEE-ESL-Aug-26-0653, submitted 17 Aug 2026.
    venue: 'IEEE Embedded Systems Letters',
    venueTier: 'Letters',
    status: 'Under review',
    dateline: 'Submitted 17 Aug 2026',
    submitted: '2026-08-17',
    year: '2026',
    topics: ['Quantization', 'Cross-platform', 'ONNX Runtime'],
  },
  {
    id: 'break-even',
    title: 'The Break-Even Parallel Speedup',
    claim:
      'Running inference on every core is the default on edge CPUs. Whether it saves energy turns on the parallel speedup against the power ratio, and on whether the static power of the board is charged to the inference. Measured on a Raspberry Pi 5 with the static floor measured at every operating point.',
    headline: 'Break-even depends on what you charge to the inference',
    // TC-2026-09-1048, received 7 Sep 2026. The CAL Letter (0285) was
    // declined 5 Sep with one strongly positive review; the regular-paper
    // version answers the other two.
    venue: 'IEEE Transactions on Computers',
    venueTier: 'Journal',
    status: 'Under review',
    dateline: 'Resubmitted as a regular paper 6 Sep 2026',
    submitted: '2026-09-06',
    year: '2026',
    topics: ['Energy', 'Multithreading', 'Parallelism'],
    // Artifact went public after submission, so the manuscript does not cite it.
    artifact: { repo: 'edge-breakeven-speedup', doi: '10.5281/zenodo.21987261' },
  },
  {
    // hotmobile27.hotcrp.com submission 13, 22 Sep 2026. Notification 16 Dec.
    id: 'format-tax',
    title: 'Your Quantization Format Is Not Free',
    claim:
      'Controlled measurements of GGUF quantization formats on three CPU microarchitectures. At small model sizes a format label predicts poorly what the file actually contains, and the community-default format pays a measurable cost. Full numbers after the review concludes.',
    headline: 'What a format label does and does not tell you',
    venue: 'HotMobile 2027',
    venueTier: 'Workshop',
    status: 'Under review',
    dateline: 'Submitted 22 Sep 2026',
    year: '2027',
    topics: ['Quantization', 'GGUF', 'Energy'],
    submitted: '2026-09-22',
    artifact: { repo: 'edge-format-tax', doi: '10.5281/zenodo.21938812' },
  },
  /*
   * One manuscript is deliberately withheld from this list for now. Its
   * status lives in the private portfolio tracker; do not add an entry here
   * without checking that tracker first.
   */
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
  body: `One physical idea carried across scales: from mobile CNNs, to Vision Transformers, to on-device language models, measured on Arm and revalidated on x86, and next headed for enterprise servers. Every headline number comes from real silicon, using hardware performance counters and on-board power instrumentation. Each paper reports what the data supports, negative results and the regimes where a method does not help included, and ships the data and harness so any number can be rechecked.`,
};
