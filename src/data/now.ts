/**
 * The /now page: what is actually in flight, right now.
 *
 * Update `updated` every time this file changes; the page prints it, and a
 * stale date is worse than no page. Keep entries to things genuinely active.
 */

export const updated = '2026-08-09';

export type NowItem = {
  title: string;
  detail: string;
  status: string;
};

export const current: NowItem[] = [
  {
    title: 'Seven papers in review at once',
    detail:
      'Two at ACM TECS (the memory-wall model and its energy companion), three at IEEE Embedded Systems Letters, one at IEEE IoT Journal, one at IEEE Transactions on Computers. The next move on each is whatever the reviewers say.',
    status: 'In review',
  },
  {
    title: 'DATE 2027, the one fixed deadline',
    detail:
      'The anytime-inference paper is format-checked and double-blind clean. Abstract registration 13 September, full paper 20 September 2026.',
    status: 'Next up',
  },
  {
    title: 'Three more ready to file',
    detail:
      'The LLM cold-start companion, the cross-platform INT8 study, and the break-even parallel speedup rule are all venue-checked and queued behind DATE.',
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
      'First contributions in flight to llama.cpp and NVIDIA garak, in the same areas the research already touches: inference performance and LLM evaluation.',
    status: 'In motion',
  },
  {
    title: 'Peer review and judging',
    detail:
      'Artifact-evaluation applications out at MLSys, ASPLOS and PACT; a poster submitted to PyTorch Conference NA 2026 and a talk to Embedded Vision Summit 2027; judge and mentor forms in at hackathons nationally.',
    status: 'Applications out',
  },
];

export const notDoing: string[] = [
  'Adding a newsletter',
  'Chasing model-of-the-week benchmarks',
  'Writing about tools I have not measured',
];
