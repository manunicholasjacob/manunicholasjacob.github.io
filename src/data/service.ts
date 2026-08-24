export type ServiceEntry = {
  role: string;
  org: string;
  detail: string;
  period: string;
  /** Venue tier, where there is a real one. Same vocabulary as the research page. */
  tag?: string;
  /** Public proof, where a public URL exists. Never a page that is not up yet. */
  link?: { label: string; href: string };
  /**
   * The venue, where the heading names a single submission instead. Only the
   * "Review venues" count on /service reads this, so that three reviews at one
   * journal do not read as three journals.
   */
  venue?: string;
};

/**
 * Peer review and artifact evaluation at research venues. Kept separate from
 * competition judging below because they are not the same credential.
 *
 * Wording rule, and it has three steps that are not interchangeable: being in
 * the reviewer database, being assigned a submission, and having delivered a
 * review. Say which one, every time. A delivered review is also not an
 * accepted paper; the recommendation goes to an editor, who decides.
 */
export const peerReview: ServiceEntry[] = [
  {
    role: 'Artifact Evaluation Committee',
    org: 'USENIX ATC 2026',
    venue: 'USENIX ATC',
    detail:
      'Invited by the committee chair, serving as an independent researcher. The work is assessing submitted research artifacts for availability, functionality and reproducibility, in a review window running 22 September to 14 October 2026. The roster is not published yet, so there is no page worth linking here until it is.',
    period: '2026',
    tag: 'CORE A',
  },
  {
    role: 'Reviewer, review delivered',
    org: 'JOSS: Optiland',
    venue: 'Journal of Open Source Software',
    detail:
      'An open-source optical design package. All 31 checklist items worked and the recommendation sent to the editor on 19 August 2026. Three issues went to the authors and all three were resolved: a benchmark script behind a published table that was not in the repository, a paper example that could not run as a script, and a throughput collapse on a 4 GB card that shows up well before the memory actually runs out. The last of those came from building the package and running its own GPU benchmark rather than reading the number in the paper, and the maintainer reproduced it on a different card. The recommendation is not the decision; the paper sits with its editor.',
    period: '2026',
    link: {
      label: 'The review, in the open',
      href: 'https://github.com/openjournals/joss-reviews/issues/11170',
    },
  },
  {
    role: 'Reviewer, in progress',
    org: 'JOSS: nsEVDx',
    venue: 'Journal of Open Source Software',
    detail:
      'A Python library for non-stationary extreme value distributions, assigned 21 August 2026. Most of the checklist work here is whether the samplers do what the paper says they do.',
    period: '2026',
    link: {
      label: 'The review, in the open',
      href: 'https://github.com/openjournals/joss-reviews/issues/11187',
    },
  },
  {
    role: 'Reviewer, in progress',
    org: 'JOSS: PySlyde',
    venue: 'Journal of Open Source Software',
    detail:
      'A toolkit for preprocessing digital pathology whole-slide images, review opened 24 August 2026. One of three reviewers on it. The interesting part of this one is that the claims are about throughput and memory on slides too large to hold at once, which is the same question as everything else here in a different domain.',
    period: '2026',
    link: {
      label: 'The review, in the open',
      href: 'https://github.com/openjournals/joss-reviews/issues/11196',
    },
  },
  {
    role: 'Reviewer, assigned at pre-review',
    org: 'JOSS: Battflow',
    venue: 'Journal of Open Source Software',
    detail:
      'An automated workflow for predicting battery properties. Sole listed reviewer, assigned at the pre-review stage, which means the review itself has not opened yet. Listed here at exactly that stage and no further.',
    period: '2026',
    link: {
      label: 'The pre-review thread',
      href: 'https://github.com/openjournals/joss-reviews/issues/10661',
    },
  },
  {
    role: 'Listed reviewer',
    org: 'JOSS reviewer database',
    venue: 'Journal of Open Source Software',
    detail:
      'In the database since 17 August 2026, listed under performance engineering, benchmarking and embedded systems. Four assignments have come through it, and the four entries above are all of them.',
    period: '2026',
    link: {
      label: 'reviewers.joss.theoj.org',
      href: 'https://reviewers.joss.theoj.org/',
    },
  },
];

/** Competition and hackathon judging. */
export const judging: ServiceEntry[] = [
  {
    role: 'Judge',
    org: 'HackTX, UT Austin',
    detail: "Judging panel at UT Austin's flagship hackathon, 700+ hackers.",
    period: '2025',
  },
  {
    role: 'Judge and Judge Advisor',
    org: 'VEX Robotics',
    detail:
      'Repeat judge and judge advisor across V5 competition events, including guiding first-time judging panels.',
    period: 'Ongoing',
  },
  {
    role: 'Mentor and judge',
    org: 'University hackathons',
    detail:
      'Mentoring hardware and embedded teams, with a standing interest in judging at events nationally.',
    period: 'Ongoing',
  },
];

/**
 * Only things still live or actually delivered. The PyTorch Conference NA 2026
 * poster ("What actually governs edge inference on a Raspberry Pi 5") was
 * declined on 17 August 2026 for capacity, so it came off rather than sitting
 * here reading as pending.
 */
export const speaking: ServiceEntry[] = [
  {
    role: 'Talk, submitted',
    org: 'Embedded Vision Summit 2027',
    detail: 'A vision-framed treatment of the same measurement work.',
    period: '2027',
  },
];

export type Volunteer = {
  org: string;
  role: string;
  blurb: string;
  /** Photo in /public/img. */
  image?: string;
  imageAlt?: string;
};

export const volunteering: Volunteer[] = [
  {
    org: 'Lovedale Foundation',
    role: 'Teaching maths and science',
    blurb:
      'Taught grades 7 to 10 at the Banyan School, which serves children from marginalised backgrounds including children of bonded labourers and orphans, and coached the tenth-grade cohort through board exams.',
    image: '/img/lovedale.jpg',
    imageAlt:
      'Manu with the student cohort he taught at the Banyan School, gathered in a school corridor',
  },
  {
    org: 'Diya Foundation',
    role: 'Training adults with learning disabilities',
    blurb:
      'Trained an adult trainee in video production end to end, and produced promotional material for the foundation’s digitisation and multimedia department. Also worked on fundraising for the TCS 10K run.',
  },
  {
    org: 'Yuvalok Foundation',
    role: 'Video production',
    blurb:
      'Produced a film about daily life at a school serving street children, children from slums, and rescued child labourers.',
  },
];
