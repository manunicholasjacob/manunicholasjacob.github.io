export type ServiceEntry = {
  role: string;
  org: string;
  detail: string;
  period: string;
  /** Venue tier, where there is a real one. Same vocabulary as the research page. */
  tag?: string;
};

/**
 * Peer review and artifact evaluation at research venues. Kept separate from
 * competition judging below because they are not the same credential.
 *
 * Wording rule for JOSS: registration and volunteering are not assignment.
 * Nothing here may imply a review has been delivered. When one is actually
 * assigned, upgrade the entry then, not before.
 */
export const peerReview: ServiceEntry[] = [
  {
    role: 'Artifact Evaluation Committee',
    org: 'USENIX ATC 2026',
    detail:
      'Assessing submitted research artifacts for functionality and reproducibility. Review window 22 September to 14 October 2026.',
    period: '2026',
    tag: 'CORE A',
  },
  {
    role: 'Reviewer',
    org: 'Journal of Open Source Software',
    detail:
      'Completed the review of Optiland, an open-source optical design package, working the full 31-item JOSS checklist. Currently assigned to three submissions.',
    period: '2026',
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
