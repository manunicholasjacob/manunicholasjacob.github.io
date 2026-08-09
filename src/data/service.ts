export type ServiceEntry = {
  role: string;
  org: string;
  detail: string;
  period: string;
};

/** Judging and reviewing. This is a criterion in its own right, so it gets a page. */
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

export const speaking: ServiceEntry[] = [
  {
    role: 'Poster, submitted',
    org: 'PyTorch Conference North America 2026',
    detail: '"What actually governs edge inference on a Raspberry Pi 5."',
    period: '2026',
  },
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
};

export const volunteering: Volunteer[] = [
  {
    org: 'Lovedale Foundation',
    role: 'Teaching maths and science',
    blurb:
      'Taught grades 7 to 10 at the Banyan School, which serves children from marginalised backgrounds including children of bonded labourers and orphans, and coached the tenth-grade cohort through board exams.',
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
