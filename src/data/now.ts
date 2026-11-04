/**
 * The /now page: what is actually in flight, right now.
 *
 * Update `updated` every time this file changes; the page prints it, and a
 * stale date is worse than no page. Keep entries to things genuinely active.
 */

export const updated = '2026-11-03';

export type NowItem = {
  title: string;
  detail: string;
  status: string;
};

export const current: NowItem[] = [
  {
    title: 'Thirteen manuscripts in review',
    detail:
      'Most of what was rebuilt after the September rejections has gone back in: the thread-scaling paper extended for IEEE TPDS, the decode-roofline paper rebuilt for IEEE IoT-J, and the energy paper re-homed to an Elsevier special issue on energy-aware AI. Now in review: nine at IEEE journals, two at ACM TECS, one at Elsevier SUSCOM, and one at HotMobile 2027. The thermal-margin study, returned on scope by IEEE TSUSC, went to IEEE Transactions on Mobile Computing on 16 October, and the rebuilt anytime-inference paper went to IEEE Transactions on Emerging Topics in Computing on 18 October.',
    status: 'In review',
  },
  {
    title: 'A first study in a second field',
    detail:
      'A weekend research sprint on multi-agent AI safety: what anti-collusion levers actually cost in a simulated LLM seller market. Submitted 24 October with the code and report public and every reported number recomputed from the raw runs by a claim checker; sprint results in mid-November. A larger follow-up replication then moved the baseline and withdrew two of the report\u2019s supported levers, in public, and the workshop version in preparation is being rebuilt around that non-replication.',
    status: 'Submitted',
  },
  {
    title: 'Embedded Vision Summit 2027: talk accepted',
    detail:
      'Accepted in September. The next slide draft is due 4 November, the final on 2 December; the deck is built, checked by a 95-assertion gate against the measured data.',
    status: 'Preparing',
  },
  {
    title: 'A first journal manuscript to review',
    detail:
      'Invited by an IEEE Internet of Things Journal associate editor on 2 November and accepted: one manuscript to review, due mid-November. The first journal assignment after seven at JOSS.',
    status: 'Reviewing',
  },
  {
    title: 'JOSS reviewing, seven assignments deep',
    detail:
      'Four reviews completed: nsEVDx, published 6 September as doi:10.21105/joss.11187; Optiland, with the recommendation at the editor; and spherical (VLT/SPHERE high-contrast imaging) and graph-pes (graph-based potential-energy models), each with the full checklist complete. Two are in progress: PySlyde, a pathology preprocessing toolkit, and Battflow, a battery-electrolyte workflow. The seventh, NN-Lite (benchmarking PyTorch models on Android devices), was assigned on 16 October. Seven assignments, seven different editors.',
    status: 'Reviewing',
  },
  {
    title: 'Open-source contributions',
    detail:
      "Twenty-seven pull requests merged into other people's projects, across twelve repositories: six into ai-dynamo AIPerf, three into NVIDIA garak, three into Arm Learning Paths, six into nsEVDx during its JOSS review, two into pyslyde, and one each into NVIDIA go-nvml, google/benchmark, mozilla-ai llamafile, raspberrypi/utils, k3d and more. ML Systems Lab shipped 0.2.3. llama-roofline is on PyPI, and the quantized-GEMV kernel study is public: twelve CUDA kernels plus Triton, each measured against its own bandwidth roof on five NVIDIA GPUs.",
    status: 'In motion',
  },
  {
    title: 'Server-class measurement',
    detail:
      'Bringing the Cisco UCS bench up for NUMA and CPU-inference energy work: the same memory-wall thesis, one scale up, on hardware old enough to be honest about.',
    status: 'Building',
  },
];

export const notDoing: string[] = [
  'Adding a newsletter',
  'Chasing model-of-the-week benchmarks',
  'Writing about tools I have not measured',
];
