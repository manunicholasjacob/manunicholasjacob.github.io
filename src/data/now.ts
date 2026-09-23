/**
 * The /now page: what is actually in flight, right now.
 *
 * Update `updated` every time this file changes; the page prints it, and a
 * stale date is worse than no page. Keep entries to things genuinely active.
 */

export const updated = '2026-09-23';

export type NowItem = {
  title: string;
  detail: string;
  status: string;
};

export const current: NowItem[] = [
  {
    title: 'Nine manuscripts in review, after a bruising September',
    detail:
      'The first decisions arrived: five rejections in six days in early September. Three of those papers are already rebuilt, one is back under review at IEEE TC as a regular paper, and the thermal-proxy letter was revised and resubmitted the same week it was declined. Now in review: three at ACM TECS, two at IEEE ESL, and one each at IEEE IoT-J, IEEE TC, IEEE Design & Test and HotMobile 2027.',
    status: 'In review',
  },
  {
    title: 'Artifact evaluation for ATC \'26, in the window',
    detail:
      'The Artifact Evaluation Committee review window opened 22 September and runs to 14 October. This is the fixed point the rest of the autumn works around.',
    status: 'Reviewing now',
  },
  {
    title: 'Embedded Vision Summit 2027: talk accepted',
    detail:
      'Accepted in September. First draft slides are due 7 October; the deck is built, checked by a 95-assertion gate against the measured data, and waiting on the official template.',
    status: 'Preparing',
  },
  {
    title: 'JOSS reviewing',
    detail:
      'Two reviews delivered: Optiland (recommendation with the editor) and nsEVDx, which was accepted and published in September. A third review is open for a pathology imaging toolkit, and a fourth assignment waits at pre-review.',
    status: 'Reviewing',
  },
  {
    title: 'Open-source contributions',
    detail:
      'Three pull requests merged into NVIDIA garak and one into ai-dynamo AIPerf, with seven more open at garak, six at AIPerf and three at vLLM. Plus a new public kernel study: a quantized GEMV ladder measured against its own bandwidth roof on five NVIDIA GPUs.',
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
