/**
 * The /now page: what is actually in flight, right now.
 *
 * Update `updated` every time this file changes; the page prints it, and a
 * stale date is worse than no page. Keep entries to things genuinely active.
 */

export const updated = '2026-10-03';

export type NowItem = {
  title: string;
  detail: string;
  status: string;
};

export const current: NowItem[] = [
  {
    title: 'Twelve manuscripts in review, the deepest the queue has been',
    detail:
      'Everything that was rebuilt after the September rejections has gone back in: the thread-scaling paper extended for IEEE TPDS, the decode-roofline paper rebuilt for IEEE IoT-J, the thermal-margin study at IEEE TSUSC, and the energy paper re-homed to an Elsevier special issue on energy-aware AI. Now in review: eight at IEEE journals, two at ACM TECS, one at Elsevier SUSCOM, and one at HotMobile 2027.',
    status: 'In review',
  },
  {
    title: "Artifact evaluation for ATC '26: both reviews delivered",
    detail:
      'Both assigned artifact reviews went in inside the window, on 27 September and 2 October. The committee phase runs to mid-October; the badge decisions are the committee\u2019s to make.',
    status: 'Delivered',
  },
  {
    title: 'Embedded Vision Summit 2027: talk accepted',
    detail:
      'Accepted in September. First draft slides are due 7 October; the deck is built, checked by a 95-assertion gate against the measured data.',
    status: 'Preparing',
  },
  {
    title: 'JOSS reviewing, six assignments deep',
    detail:
      'Two reviews delivered: Optiland (recommendation with the editor) and nsEVDx, published 6 September as doi:10.21105/joss.11187. Four more reviews are open: a pathology imaging toolkit, a battery-electrolyte workflow, a high-contrast-imaging pipeline, and graph-based potential-energy models. Six assignments, six different editors.',
    status: 'Reviewing',
  },
  {
    title: 'Open-source contributions',
    detail:
      'Five pull requests merged upstream: three into NVIDIA garak and two into ai-dynamo AIPerf, with seven more open at garak, nine at AIPerf and three at vLLM. llama-roofline went live on PyPI, and the quantized-GEMV kernel study is public: thirteen kernels measured against their own bandwidth roof on five NVIDIA GPUs.',
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
