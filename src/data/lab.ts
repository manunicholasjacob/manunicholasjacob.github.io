/**
 * The measurement rig and the rules it runs under.
 *
 * This page exists because "measured on real hardware" is a claim, and a claim
 * should be checkable. Anything listed here should be literally true of the
 * bench; if a machine leaves the bench, delete its row.
 */

export type Machine = {
  name: string;
  role: string;
  spec: string[];
  status: 'Active' | 'Planned' | 'Retired';
  note?: string;
  /** Photo of the machine, in /public/img. */
  image?: string;
  imageAlt?: string;
};

export const machines: Machine[] = [
  {
    name: 'Raspberry Pi 5',
    role: 'Primary edge-inference bench',
    spec: [
      'Broadcom BCM2712, 4x Arm Cortex-A76',
      'LPDDR4X, shared-bandwidth memory subsystem',
      'On-board PMIC power telemetry',
      'Hardware performance counters via perf',
    ],
    status: 'Active',
    note: 'Every published edge-inference number on this site came off this class of machine.',
    image: '/img/pi5.jpg',
    imageAlt:
      'A Raspberry Pi 5 single-board computer on a cutting mat, showing the Broadcom BCM2712 SoC, the LPDDR4X package, the 40-pin header and the PCIe connector',
  },
  {
    name: 'Cisco UCS C220 / C240',
    role: 'Server-class measurement',
    spec: [
      'Rack servers, NUMA topology',
      'CPU inference and memory-hierarchy work',
      'Power measurement at the chassis',
    ],
    status: 'Planned',
    note: 'Framed to the hardware vintage: NUMA, memory wall, CPU-inference energy. Deliberately not a modern-LLM story.',
  },
  {
    name: 'i7-12700H laptop',
    role: 'Cross-architecture check, and the hybrid-core work',
    spec: [
      '6 performance cores, 8 efficiency cores, DDR5',
      'RTX 3050 Laptop, treated as a separate device by the harness',
      'Intel RAPL energy counters',
      'Roughly four times the memory bandwidth of the Pi',
    ],
    status: 'Active',
    note: 'This machine is why the results are not a Raspberry Pi story. The memory-bandwidth law was re-measured here on a completely different architecture and held with the same goodness of fit, and the mixed performance and efficiency cores are the subject of their own paper. The GPU in it used to be listed separately, which flattered the bench: it is one laptop.',
  },
  {
    name: 'iMac G3, 1998',
    role: 'Because it is there',
    spec: ['Bondi blue', 'Boots'],
    status: 'Active',
    note: 'Not part of any experiment. It sits on the bench and it works, which is the point.',
  },
];

export type Rule = { title: string; body: string };

/** The methodology, stated as commitments rather than aspirations. */
export const rules: Rule[] = [
  {
    title: 'Measure the machine, not the toolchain',
    body: 'A benchmark that does not control for its own toolchain is measuring the wrong thing. This rule is here because I broke it: I once reported a fortyfold latency swing and attributed it to the export format, and one arm of that experiment had quietly loaded a model quantized a different way instead of building the one it claimed to build. The swing was real and the cause was wrong. Two later papers exist to correct it.',
  },
  {
    title: 'Record the state of the machine, not just the number',
    body: 'Every run writes down the clock speed, the temperature, the throttle bits and the power draw alongside the result. That caught five measurements taken while something else was running on the board, with a run-to-run spread of 30 to 103 percent against a campaign norm under 2.5 percent. Without the record they would have gone quietly into an average.',
  },
  {
    title: 'Publish the negative result',
    body: 'When a headline number failed to reproduce, the paper was rewritten to whatever the data supported. Two earlier drafts were found to present simulation as measurement and were discarded rather than published.',
  },
  {
    title: 'Ship the harness',
    body: 'Every published result has a public repository with the code and data that produced it, archived on Zenodo with a citable DOI. If a reviewer cannot re-run it, it is an anecdote.',
  },
  {
    title: 'Instrument power, do not model it',
    body: 'Energy claims come from on-board power telemetry sampled during the run, not from a thermal design power figure multiplied by a duration.',
  },
  {
    title: 'State the regime',
    body: 'Most control policies help in some operating regimes and hurt in others. Reporting the boundary is more useful than reporting the win.',
  },
];

/** Concrete numbers pulled from the published work, for the counters row. */
/**
 * Four numbers, each from a released dataset. Two of the previous four had to
 * go. "40x INT8 config latency swing" was the attribution this page's first rule
 * now describes as wrong, and it had no business being a headline. "0.994" was
 * the size sweep alone, which the rest of the record never uses; the fit that
 * appears in the paper, and that holds on two architectures, is 0.98.
 */
export const benchFacts = [
  { value: '9', label: 'CNNs + 1 ViT characterised' },
  { value: '13 h', label: 'Open telemetry dataset' },
  { value: '0.98', label: 'Decode roofline R², Arm and x86' },
  { value: '2 of 9', label: 'INT8 results that reverse sign across ISAs' },
] as const;
