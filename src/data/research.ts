/**
 * The publication record.
 *
 * Adding a paper = adding one object here. Nothing else to touch.
 * `featured: true` promotes it to the three-up block on the homepage.
 *
 * NOTE: the older TechRxiv preprint titles that are still live on the Wix site
 * are deliberately not listed here. The withdrawn work (RobustML@Edge) is
 * excluded on purpose, per the reconciliation in EB1_O1_CRITERIA_MAP.md.
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
  year: string;
  topics: string[];
  artifact?: { repo: string; doi: string };
  featured?: boolean;
};

export const papers: Paper[] = [
  {
    id: 'memory-wall',
    title: 'The Memory Wall Governs Edge DNN Inference',
    claim:
      'Thread scaling, multi-tenant interference and INT8 speedups are not three separate phenomena. All three fall out of a single measured bandwidth ceiling.',
    headline: '20.5% leave-one-model-out prediction error across 9 CNNs and a ViT',
    venue: 'ACM Transactions on Embedded Computing Systems',
    venueTier: 'Journal',
    status: 'Ready for submission',
    year: '2026',
    topics: ['Roofline', 'Memory bandwidth', 'Cortex-A76'],
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
    status: 'Ready for submission',
    year: '2026',
    topics: ['Energy', 'DVFS', 'Power telemetry'],
    featured: true,
  },
  {
    id: 'cold-start',
    title: 'The Cold-Start Tax',
    claim:
      'The first systematic characterisation of the duty-cycled wake transient on an edge SBC. The tax is weight-loading-bound, predictable from model size alone, and falls off an eviction cliff.',
    headline: '5x to 23x wake tax, R^2 = 1.00 loading-bound fit, >80x blow-up past eviction',
    venue: 'IEEE Internet of Things Journal',
    venueTier: 'Journal',
    status: 'Ready for submission',
    year: '2026',
    topics: ['Duty cycling', 'Cache policy', 'GD-Tax'],
    artifact: { repo: 'edge-cold-start-tax', doi: '10.5281/zenodo.21844857' },
    featured: true,
  },
  {
    id: 'edge-llm',
    title: 'The Memory Wall at the Edge of Language',
    claim:
      'The same bandwidth ceiling that governs CNN inference governs on-device LLM decode, and the KV cache turns it into a hard capacity wall.',
    headline: 'Decode roofline fits at R^2 = 0.994',
    venue: 'IEEE Transactions on Computers',
    venueTier: 'Journal',
    status: 'Ready for submission',
    year: '2026',
    topics: ['LLM inference', 'KV cache', 'llama.cpp'],
    artifact: { repo: 'edge-llm-memory-wall', doi: '10.5281/zenodo.21844855' },
  },
  {
    id: 'int8-cliff',
    title: 'The INT8 Configuration Cliff',
    claim:
      'Given identical INT8 weights, the export format and graph-optimisation level, not the weights, drive the latency. Most quantization benchmarks are measuring their toolchain.',
    headline: '~40x latency swing on identical weights, Cortex-A76',
    venue: 'IEEE Embedded Systems Letters',
    venueTier: 'Letters',
    status: 'Under review (revise and resubmit)',
    year: '2026',
    topics: ['Quantization', 'ONNX Runtime', 'Reproducibility'],
    artifact: { repo: 'rpi5-quantization-benchmark', doi: '10.5281/zenodo.21844863' },
  },
  {
    id: 'thermal-proxy',
    title: 'A Software-Only Thermal Proxy for Edge SBCs',
    claim:
      'A cross-validated CPU-temperature coupling law that needs no extra sensors, released with an open 13-hour telemetry dataset so others can re-run it.',
    headline: 'Open 13-hour telemetry dataset',
    venue: 'IEEE Embedded Systems Letters',
    venueTier: 'Letters',
    status: 'Ready for submission',
    year: '2026',
    topics: ['Thermal', 'Telemetry', 'Open dataset'],
    artifact: { repo: 'pi5-thermal-proxy', doi: '10.5281/zenodo.21844859' },
  },
  {
    id: 'thermal-margin',
    title: 'Thermal-Margin Control: When It Helps and When It Hurts',
    claim:
      'An honest operating-regime study of convex thermal allocation for multi-tenant edge inference, including the regimes where the controller is the wrong answer.',
    headline: 'Maps the regime boundary rather than claiming a universal win',
    venue: 'IEEE Embedded Systems Letters',
    venueTier: 'Letters',
    status: 'Ready for submission',
    year: '2026',
    topics: ['Thermal', 'Control', 'Multi-tenant'],
    artifact: { repo: 'edge-thermal-margin-control', doi: '10.5281/zenodo.21844861' },
  },
  {
    id: 'anytime',
    title: 'Thermal-Aware Anytime Inference',
    claim:
      'Anytime inference is widely proposed for thermally constrained edge devices. This characterises the narrow regime in which it actually pays off.',
    headline: 'Identifies where anytime inference stops being worth it',
    venue: 'DATE 2027',
    venueTier: 'Conference',
    status: 'Ready (anonymised for double-blind review)',
    year: '2027',
    topics: ['Anytime inference', 'SLO', 'Thermal'],
  },
  {
    id: 'gpu-repro',
    title: 'Reproducibility of Consumer-GPU Inference Profiling',
    claim:
      'A clock-gated measurement methodology that makes consumer-GPU inference numbers reproducible between runs and between machines.',
    headline: 'Clock-gated protocol for repeatable GPU measurement',
    venue: 'EuroMLSys',
    venueTier: 'Workshop',
    status: 'Staged',
    year: '2027',
    topics: ['GPU', 'Methodology', 'Reproducibility'],
  },
];

export const featuredPapers = papers.filter((p) => p.featured);

/** The through-line, stated once, used on the homepage and the research page. */
export const researchThesis = {
  claim: 'The memory wall, not compute, governs deep-neural-network inference on real hardware.',
  body: `One physical idea carried across scales: from mobile CNNs, to Vision Transformers, to on-device language models, and next to enterprise servers. Every headline number is measured on real silicon using hardware performance counters and on-board power instrumentation. Where a claim failed to reproduce, the paper was rewritten to whatever the data actually supported, negative results included. Two earlier drafts were found to present simulation as measurement and were discarded rather than published.`,
};
