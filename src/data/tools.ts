import { links } from './site';

/**
 * The installable tools, for /tools. Only facts that can be checked against
 * PyPI, the repository and Zenodo: the released version, the install line,
 * the commands, the DOIs. No measured results live here on purpose; those
 * belong to the papers and READMEs, which carry their own provenance.
 *
 * When a new release ships: bump `version`, `released` and `versionDoi`
 * from the repository's CITATION.cff, which is updated with every release.
 * The concept DOI never changes; it always resolves to the newest version.
 */
export type Tool = {
  slug: string;
  name: string;
  /** The command the package installs. */
  command: string;
  version: string;
  /** Month of the current release, as shown. */
  released: string;
  oneLiner: string;
  what: string;
  install: readonly string[];
  /** [command, what it does] */
  usage: readonly (readonly [string, string])[];
  repo: string;
  pypi: string;
  conceptDoi: string;
  versionDoi: string;
  license: string;
  python: string;
  writeup?: { title: string; href: string };
  docs?: string;
};

const gh = (slug: string) => `${links.github}/${slug}`;

export const tools: Tool[] = [
  {
    slug: 'llama-roofline',
    name: 'llama-roofline',
    command: 'llama-roofline',
    version: '0.2.2',
    released: 'Oct 2026',
    oneLiner: 'Is your llama.cpp decode memory-bandwidth-bound? Measure it, in one command.',
    what:
      'Generating a token reads every weight of the model from memory, so decode speed on a CPU is set by memory bandwidth divided by the bytes each token has to read. llama-roofline measures both sides of that on your own machine: the read bandwidth your memory actually sustains, and your own GGUF models through llama-bench across a thread sweep. It then tells you, in words, where you sit and which thread count to use. It also opens a GGUF file and reports what it actually contains under its format label.',
    install: ['pip install llama-roofline', 'llama-roofline diagnose'],
    usage: [
      ['llama-roofline diagnose', 'finds your GGUF files and llama-bench, measures, and explains the result'],
      ['llama-roofline diagnose ~/models --quick', 'one model, a directory or a glob; fewer settings, one repetition'],
      ['llama-roofline inspect model.gguf', 'what the file contains under its format label, and the bytes decode reads'],
      ['llama-roofline run --models ~/models/*.gguf', 'the full sweep: every model, the fit, the figure'],
    ],
    repo: gh('llama-roofline'),
    pypi: 'https://pypi.org/project/llama-roofline/',
    conceptDoi: '10.5281/zenodo.21842493',
    versionDoi: '10.5281/zenodo.23329330',
    license: 'MIT',
    python: '3.9+',
    writeup: { title: 'Decode is memory-bound', href: '/writing/decode-is-memory-bound' },
    docs: `${gh('llama-roofline')}/blob/main/docs/METHOD.md`,
  },
  {
    slug: 'ml-systems-lab',
    name: 'ML Systems Lab',
    command: 'mlsys',
    version: '0.2.2',
    released: 'Oct 2026',
    oneLiner: 'Reproducible ML inference benchmarking across laptops, single-board computers and servers.',
    what:
      'One YAML config and one command run an experiment matrix across any mix of machines: locally, over SSH, or inside a Kubernetes pod. Every measurement comes back as a self-describing JSON record that carries the hardware, OS, kernel, backend version and build, the metrics, and the physical state of the machine while they were taken: power, temperature, clocks, throttle flags and the CPU quota that applied. The analysis layer turns a directory of records into tables and figures.',
    install: ['pip install ml-systems-lab', 'mlsys probe', 'mlsys membw'],
    usage: [
      ['mlsys probe', 'what this machine can measure: power, thermals, GPU, clocks'],
      ['mlsys membw', 'its sustained DRAM read ceiling, in about a minute'],
      ['mlsys run configs/example-smoke.yaml', 'your own sweep, from a checkout of the repository'],
      ['mlsys report runs/smoke-test --full', 'tables and figures from a directory of records'],
    ],
    repo: gh('ml-systems-lab'),
    pypi: 'https://pypi.org/project/ml-systems-lab/',
    conceptDoi: '10.5281/zenodo.21867055',
    versionDoi: '10.5281/zenodo.23329333',
    license: 'MIT',
    python: '3.9+',
    writeup: { title: 'Kubernetes did not slow my benchmark down', href: '/writing/quota-not-the-container' },
    docs: `${gh('ml-systems-lab')}/tree/main/docs`,
  },
];
