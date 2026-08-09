import { links } from './site';

const gh = (slug: string) => `${links.github}/${slug}`;

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
    result: 'Decode roofline R^2 = 0.994',
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
  award: string;
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
    award: 'Runner-up, Best Hardware Hack',
    event: 'HackUMass IX',
    blurb:
      'RFID and distance sensors on dining-hall booths, surfaced as a live seat-availability map. First real 3D-printing and Raspberry Pi build.',
    stack: ['Raspberry Pi', 'Python', 'Flask', 'SQL'],
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
