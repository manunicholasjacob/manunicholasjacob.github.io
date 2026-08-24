import { links } from './site';

const gh = (slug: string) => `${links.github}/${slug}`;

/**
 * The flagship platform: gets a full-width feature on /projects and a card on
 * the homepage. Everything here is quoted from the repo README; keep in sync.
 */
export const flagship = {
  name: 'ML Systems Lab',
  slug: 'ml-systems-lab',
  url: gh('ml-systems-lab'),
  doi: '10.5281/zenodo.21867055',
  tagline: 'One config file, one command, every machine on the bench.',
  description:
    'A reproducible benchmarking framework for ML inference across heterogeneous hardware. One YAML config drives llama.cpp and ONNX Runtime sweeps on laptops, Raspberry Pi over SSH, and GPUs; every run produces a self-describing record carrying the hardware, backend versions, measured metrics, and the physical state of the machine while they were measured: power, temperature, clocks, throttle flags, utilization. The analysis layer turns a directory of records into publication-quality tables and figures.',
  architecture: [
    { step: 'config.yaml', detail: 'machines, models, and the sweep matrix, declared once' },
    { step: 'RunSpecs', detail: 'deterministic run ids; interrupted campaigns resume by skipping what is on disk' },
    { step: 'Device', detail: 'local subprocess or agent pushed over SSH; a new machine is a config block, not code' },
    { step: 'Agent', detail: 'pure standard library, runs on the device under test; nothing crosses the network inside a measurement window' },
    { step: 'RunRecord', detail: 'raw output parsed on the host, so a parser bug is a re-parse, not a re-run; failures are records too' },
    { step: 'Analysis', detail: 'text, Markdown and LaTeX tables; roofline and scaling figures' },
  ],
  hardware: [
    'Raspberry Pi 5, Cortex-A76: SSH agent, PMIC per-rail power, throttle bits, DVFS control',
    'i7-12700H laptop, Windows: local agent, 20-thread sweeps, models up to 7B',
    'RTX 3050 via ONNX Runtime DirectML: modeled as its own device',
  ],
  result:
    'Reproduces the IEEE Transactions on Computers submission’s roofline fits exactly (Pi 5: 10.7 GB/s effective, R² = 0.980; i7-12700H: 35.7 GB/s, R² = 0.980), and two campaigns run natively by the framework re-measured the same quantities independently and agreed within 1.6%. Same config shows the GPU losing at batch 1 (dispatch overhead) and winning 29x at batch 64.',
  related: [
    { title: 'The Memory Wall at the Edge of Language', href: '/research#edge-llm' },
    { title: 'The Memory Wall Governs Edge DNN Inference', href: '/research#memory-wall' },
    { title: 'The Cold-Start Tax', href: '/research#cold-start' },
  ],
  stack: ['Python', 'llama.cpp', 'ONNX Runtime', 'SSH agents', 'PMIC / RAPL telemetry'],
} as const;

export type Repo = {
  slug: string;
  name: string;
  blurb: string;
  /** The measured result, if there is one. Renders in mono. */
  result?: string;
  stack: string[];
  url: string;
  doi?: string;
  kind: 'artifact' | 'tool' | 'lab';
};

export const repos: Repo[] = [
  {
    slug: 'rpi5-quantization-benchmark',
    name: 'rpi5-quantization-benchmark',
    blurb:
      'Controlled evaluation of INT8 quantized models on Raspberry Pi 5, isolating export format and graph optimisation from the weights themselves.',
    result: '3.8x to 11.7x speedups, up to 43x better energy-delay product',
    stack: ['Python', 'ONNX Runtime', 'perf'],
    url: gh('rpi5-quantization-benchmark'),
    doi: '10.5281/zenodo.21844863',
    kind: 'artifact',
  },
  {
    slug: 'edge-llm-memory-wall',
    name: 'edge-llm-memory-wall',
    blurb:
      'Decode-side roofline for on-device language models, plus the KV-cache capacity wall and an energy-aware serving policy.',
    result: 'Decode roofline R^2 = 0.98, on Arm and on x86',
    stack: ['llama.cpp', 'C++', 'Python'],
    url: gh('edge-llm-memory-wall'),
    doi: '10.5281/zenodo.21844855',
    kind: 'artifact',
  },
  {
    slug: 'edge-cold-start-tax',
    name: 'edge-cold-start-tax',
    blurb:
      'Wake-transient characterisation for duty-cycled edge inference, including GD-Tax, a tax-aware cache policy that beats LRU and LFU.',
    result: '5x to 23x cold-start tax, >80x past the eviction cliff',
    stack: ['Python', 'Linux', 'PMIC telemetry'],
    url: gh('edge-cold-start-tax'),
    doi: '10.5281/zenodo.21844857',
    kind: 'artifact',
  },
  {
    slug: 'pi5-thermal-proxy',
    name: 'pi5-thermal-proxy',
    blurb:
      'Software-only thermal proxy for commodity SBCs, released with an open 13-hour telemetry dataset intended for reuse.',
    result: 'Cross-validated coupling law, no added sensors',
    stack: ['Python', 'Telemetry', 'Open data'],
    url: gh('pi5-thermal-proxy'),
    doi: '10.5281/zenodo.21844859',
    kind: 'artifact',
  },
  {
    slug: 'edge-thermal-margin-control',
    name: 'edge-thermal-margin-control',
    blurb:
      'Convex thermal-margin allocation for multi-tenant edge inference, with the operating regimes where it fails reported alongside the ones where it wins.',
    stack: ['Python', 'Convex optimisation'],
    url: gh('edge-thermal-margin-control'),
    doi: '10.5281/zenodo.21844861',
    kind: 'artifact',
  },
  {
    slug: 'latency-elastic-edge-inference',
    name: 'latency-elastic-edge-inference',
    blurb:
      'Model-predictive thread allocation that holds a latency service objective while the platform is under thermal and contention pressure.',
    result: '~3.4x reduction in p99 latency under load',
    stack: ['Python', 'MPC', 'ONNX Runtime'],
    url: gh('latency-elastic-edge-inference'),
    doi: '10.5281/zenodo.21844865',
    kind: 'artifact',
  },
  {
    slug: 'edge-format-tax',
    name: 'edge-format-tax',
    blurb:
      'Matched-byte comparison of GGUF quantization formats on three CPU microarchitectures, with per-token energy from the Pi 5 PMIC. The label on the file turns out to be a poor predictor of what it costs to run.',
    result: 'Same label, same bit width, up to 38% apart in decode speed',
    stack: ['llama.cpp', 'Python', 'PMIC telemetry'],
    url: gh('edge-format-tax'),
    doi: '10.5281/zenodo.21938812',
    kind: 'artifact',
  },
  {
    slug: 'edge-breakeven-speedup',
    name: 'edge-breakeven-speedup',
    blurb:
      'The energy identity behind multithreaded edge inference, measured rather than assumed: 831 runs across nine architectures, four clock frequencies and one to four threads, with power integrated from the on-board PMIC.',
    result: 'Break-even speedup near 1.8x, sign predicted in 64 of 64 configurations',
    stack: ['Python', 'ONNX Runtime', 'PMIC telemetry'],
    url: gh('edge-breakeven-speedup'),
    doi: '10.5281/zenodo.21987261',
    kind: 'artifact',
  },
  {
    slug: 'llama-roofline',
    name: 'llama-roofline',
    blurb:
      'A command-line tool that measures where a local LLM actually sits against the memory-bandwidth roofline on your own machine. Built out of the edge-LLM work and released standalone.',
    stack: ['Python', 'CLI', 'llama.cpp'],
    url: gh('llama-roofline'),
    doi: '10.5281/zenodo.21842493',
    kind: 'tool',
  },
  {
    slug: 'edge-sbc-reliability-lab',
    name: 'Edge-sbc-reliability-lab',
    blurb:
      'Cross-runtime characterisation harness for machine-learning workloads on single-board computers.',
    stack: ['Python', 'Bash', 'Linux'],
    url: gh('Edge-sbc-reliability-lab'),
    kind: 'lab',
  },
  {
    slug: 'edge-ai-colab-to-pi-pipeline',
    name: 'edge-ai-colab-to-pi-pipeline',
    blurb:
      'End-to-end path from training a model in Colab to running and measuring it on a Raspberry Pi, built so a result can be re-derived from scratch.',
    stack: ['Colab', 'ONNX', 'Raspberry Pi'],
    url: gh('edge-ai-colab-to-pi-pipeline'),
    kind: 'lab',
  },
  {
    slug: 'spectral-geometry-instability',
    name: 'spectral-geometry-instability',
    blurb:
      'Research pipeline treating covariance eigenspace rotation as an early risk signal.',
    stack: ['Python', 'NumPy'],
    url: gh('spectral-geometry-instability'),
    kind: 'lab',
  },
];

export type Build = {
  name: string;
  subtitle: string;
  /**
   * Only where a placing was actually confirmed. The Booth Beacon
   * "runner-up" was carried here for a while and could never be
   * corroborated against anything HackUMass published, so it came off.
   */
  award?: string;
  event: string;
  blurb: string;
  stack: string[];
  url?: string;
  /** Photo in /public/img. */
  image?: string;
  imageAlt?: string;
  /** Demo / writeup links beyond the repo. */
  media?: { label: string; href: string }[];
};

export const builds: Build[] = [
  {
    name: 'WorldWide Rover',
    subtitle: 'Internet-controlled autonomous rover',
    award: 'Best Embedded System',
    event: 'HackUMass XII',
    blurb:
      'A rover anyone could drive from anywhere over the internet, with onboard obstacle avoidance and maze solving when nobody was steering.',
    stack: ['Python', 'Flask', 'React', 'AWS', 'Raspberry Pi'],
    url: gh('worldwide-rover'),
    image: '/img/rover.jpg',
    imageAlt: 'The WorldWide Rover: a 3D-printed chassis with yellow wheels and ultrasonic sensors',
    media: [
      { label: 'Watch it drive', href: 'https://www.youtube.com/watch?v=sQPTRrqMgYs' },
      { label: 'Devpost', href: 'https://devpost.com/software/worldwide-rover' },
    ],
  },
  {
    name: '4Sight',
    subtitle: 'Navigation aid for visually impaired users',
    award: 'Best Hardware Hack + Best Circuit Hack',
    event: 'HackUMass X',
    blurb:
      'A wearable that turns ultrasonic distance readings into haptic feedback, so obstacles are felt rather than heard.',
    stack: ['Raspberry Pi Pico', 'Ultrasonic sensing', 'Haptics'],
    url: gh('4sight'),
    image: '/img/4sight.jpg',
    imageAlt: 'The 4Sight device: a handheld 3D-printed unit with an array of ultrasonic sensors',
    media: [{ label: 'Devpost', href: 'https://devpost.com/software/the-spidey-sense' }],
  },
  {
    name: 'Booth Beacon',
    subtitle: 'Live dining-hall seating',
    event: 'HackUMass IX',
    blurb:
      'RFID and distance sensors on dining-hall booths, surfaced as a live seat-availability map. First real 3D-printing and Raspberry Pi build.',
    stack: ['Raspberry Pi', 'Python', 'Flask', 'SQL'],
    image: '/img/booth-beacon.jpg',
    imageAlt:
      'The Booth Beacon prototype: a 3D-printed enclosure holding a Raspberry Pi and breadboard, with an ultrasonic range finder and an RFID-RC522 reader on the front',
  },
];

/** Larger engineering projects that were not hackathons. */
export const engineering = [
  {
    name: 'Pothole Detection System',
    org: 'ECE senior design · UMass Amherst · Sep 2024 to May 2025',
    blurb:
      'Potholes cause billions of dollars in damage a year, and drivers swerving or braking to avoid them is its own hazard. This year-long capstone detects them in real time instead: stereo cameras build a depth point cloud of the road, a CNN detects potholes from the visual and depth data on Raspberry Pi hardware, and an in-vehicle display gives the driver an immediate visual alert. The prototype hit 80 to 90% detection accuracy at speeds up to 35 to 45 mph, with ultrasonic sensors for multi-modal sensing and a custom PCB handling power, sensor interfacing and Pi connectivity. Self-contained, installable in most vehicles, and built to stay affordable.',
    result: '80-90% detection accuracy, operational at 35-45 mph',
    stack: ['Stereo vision', 'CNN', 'Raspberry Pi', 'Ultrasonic sensors', 'Custom PCB'],
    images: [
      {
        src: '/img/senior-design-1.jpg',
        alt: 'Concept illustration: windshield stereo camera and dash display alerting the driver to potholes ahead',
      },
      {
        src: '/img/senior-design-2.jpg',
        alt: 'Exploded hardware view: Raspberry Pi with M.2 HAT, custom PCB and power module',
      },
    ],
  },
] as const;

/* The systems essays now live as markdown in src/content/writing/. */

/**
 * Open pull requests to upstream projects. Public and verifiable; update
 * states as they land. Merged ones graduate to a "merged" note.
 */
export type Upstream = {
  project: string;
  org: string;
  why: string;
  /** Merged ones lead the list. Verified against the GitHub API before listing. */
  prs: { number: number; title: string; url: string; merged?: boolean }[];
};

export const upstream: Upstream[] = [
  {
    project: 'vLLM',
    org: 'vllm-project',
    why: 'The serving engine much of production LLM inference runs on. Fixes and docs from reproducing real failures: tokenizer edge cases, FlashInfer JIT preflight, MoE tuning robustness, WSL2 gotchas.',
    prs: [
      {
        number: 50752,
        title: 'Encode special tokens in HF processors for transformers-native mistral-common tokenizers',
        url: 'https://github.com/vllm-project/vllm/pull/50752',
      },
      {
        number: 50711,
        title: 'benchmark_moe: do not abort tuning when a candidate config fails Triton compilation',
        url: 'https://github.com/vllm-project/vllm/pull/50711',
      },
      {
        number: 50751,
        title: 'Troubleshooting: FlashInfer JIT failure on a GPU newer than the local CUDA toolkit',
        url: 'https://github.com/vllm-project/vllm/pull/50751',
      },
      {
        number: 50784,
        title: 'Troubleshooting: add a WSL2 section (pinned memory gates, lingering workers)',
        url: 'https://github.com/vllm-project/vllm/pull/50784',
      },
    ],
  },
  {
    project: 'garak',
    org: 'NVIDIA',
    why: 'NVIDIA’s LLM vulnerability scanner. Correctness fixes found by reading the code the way a root-cause engineer reads a failing system.',
    prs: [
      {
        number: 2014,
        title: 'fix(detectors): honour config_root in goodside.RileyIsnt',
        url: 'https://github.com/NVIDIA/garak/pull/2014',
        merged: true,
      },
      {
        number: 2011,
        title: 'fix: restore unreachable no-default-class error in load_plugin',
        url: 'https://github.com/NVIDIA/garak/pull/2011',
        merged: true,
      },
      {
        number: 2012,
        title: 'fix(probes): guard badchars ASCII selection against max_ascii bounds',
        url: 'https://github.com/NVIDIA/garak/pull/2012',
        merged: true,
      },
      {
        number: 2013,
        title: 'fix(detectors): pass response text to the Refusal judge',
        url: 'https://github.com/NVIDIA/garak/pull/2013',
      },
      {
        number: 2015,
        title: 'probes: add HouYi prompt injection probe and detector',
        url: 'https://github.com/NVIDIA/garak/pull/2015',
      },
      {
        number: 2008,
        title: 'probes: add email leak via virtualization latent injection',
        url: 'https://github.com/NVIDIA/garak/pull/2008',
      },
      {
        number: 2009,
        title: 'buffs: add FormatSpread prompt-format-sensitivity buff',
        url: 'https://github.com/NVIDIA/garak/pull/2009',
      },
      {
        number: 2030,
        title: 'harnesses: skip falsy intents instead of registering them',
        url: 'https://github.com/NVIDIA/garak/pull/2030',
      },
      {
        number: 2031,
        title: 'analyze: count prompt characters, not dict length, in count_tokens',
        url: 'https://github.com/NVIDIA/garak/pull/2031',
      },
      {
        number: 2032,
        title: 'fix the lite-config hint guard and its masked AttributeError',
        url: 'https://github.com/NVIDIA/garak/pull/2032',
      },
    ],
  },
];
