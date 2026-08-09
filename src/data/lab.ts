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
    name: 'Consumer GPU host',
    role: 'Reproducibility methodology',
    spec: ['Clock-gated measurement protocol', 'Run-to-run and host-to-host variance'],
    status: 'Active',
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
    body: 'The INT8 work exists because a 40x latency swing turned out to be export format and graph optimisation rather than the weights. A benchmark that does not control for its own toolchain is measuring the wrong thing.',
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
export const benchFacts = [
  { value: '9', label: 'CNNs + 1 ViT characterised' },
  { value: '13 h', label: 'Open telemetry dataset' },
  { value: '0.994', label: 'Decode roofline R²' },
  { value: '40x', label: 'INT8 config latency swing' },
] as const;
