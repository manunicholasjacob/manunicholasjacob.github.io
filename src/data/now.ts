/**
 * The /now page: what is actually in flight, right now.
 *
 * Update `updated` every time this file changes; the page prints it, and a
 * stale date is worse than no page. Keep entries to things genuinely active.
 */

export const updated = '2026-08-23';

export type NowItem = {
  title: string;
  detail: string;
  status: string;
};

export const current: NowItem[] = [
  {
    title: 'Thirteen manuscripts out at once',
    detail:
      'Four at IEEE Embedded Systems Letters, three at ACM TECS, two at IEEE Computer Architecture Letters, one each at IEEE Internet of Things Journal, IEEE Transactions on Computers and IEEE Design & Test, and one at DATE 2027. Not one decision back yet. The next move on each is whatever the reviewers say.',
    status: 'In review',
  },
  {
    title: 'DATE 2027, the one fixed deadline',
    detail:
      'The anytime-inference paper is format-checked and double-blind clean. Abstract registration 13 September, full paper 20 September 2026.',
    status: 'Next up',
  },
  {
    title: 'Two waiting on a portal to open',
    detail:
      'The quantization-format paper is finished and waiting on HotMobile, which does not reopen until roughly October. The GPU profiling methodology paper is waiting on the EuroMLSys call, expected somewhere between November and January, and its own number audit says fix two things first.',
    status: 'Queued',
  },
  {
    title: 'Server-class measurement',
    detail:
      'Bringing the Cisco UCS bench up for NUMA and CPU-inference energy work: the same memory-wall thesis, one scale up, on hardware old enough to be honest about.',
    status: 'Building',
  },
  {
    title: 'Open-source contributions',
    detail:
      'Three pull requests merged into NVIDIA garak, seven still open there, and four open at vLLM, in the same areas the research already touches: inference performance and LLM evaluation.',
    status: 'In motion',
  },
  {
    title: 'Artifact evaluation for USENIX ATC 2026',
    detail:
      'On the Artifact Evaluation Committee. The review window is 22 September to 14 October 2026, which lands directly on top of the DATE deadline, so the calendar is the constraint this autumn.',
    status: 'Committed',
  },
  {
    title: 'JOSS reviewing',
    detail:
      'First review delivered on 19 August: Optiland, an optical design package, 31 checklist items and three issues that the authors resolved. A second review is open now for a library on non-stationary extreme value distributions, and a third assignment is waiting on its editor.',
    status: 'Reviewing',
  },
  {
    title: 'One talk still out',
    detail:
      'A talk submitted to Embedded Vision Summit 2027, a vision-framed treatment of the measurement work. Not accepted yet. The PyTorch Conference poster was declined on capacity in August.',
    status: 'Submitted',
  },
];

export const notDoing: string[] = [
  'Adding a newsletter',
  'Chasing model-of-the-week benchmarks',
  'Writing about tools I have not measured',
];
