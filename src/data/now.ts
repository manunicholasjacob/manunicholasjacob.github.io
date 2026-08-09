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
    title: 'Getting the flagship papers through review',
    detail:
      'The two ACM TECS submissions (the memory-wall model and the energy companion) are the priority: peer-reviewed acceptances matter more than anything else on the list.',
    status: 'In motion',
  },
  {
    title: 'The INT8 configuration cliff, revise and resubmit',
    detail:
      'IEEE Embedded Systems Letters came back with a revise-and-resubmit. Working the reviews.',
    status: 'R&R',
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
    title: 'Speaking',
    detail:
      'Poster submitted to PyTorch Conference NA 2026, a talk to Embedded Vision Summit 2027, and Austin meetup pitches out.',
    status: 'Submitted',
  },
];

export const notDoing: string[] = [
  'Adding a newsletter',
  'Chasing model-of-the-week benchmarks',
  'Writing about tools I have not measured',
];
