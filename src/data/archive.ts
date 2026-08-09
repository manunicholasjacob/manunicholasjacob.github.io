/**
 * Earlier work, kept deliberately.
 *
 * The rule used to split this from the main site: anything that supports the
 * current engineering story lives on /about, /research, /projects or /service.
 * Everything else is real, worth keeping, and belongs here rather than
 * competing for attention on the front page.
 */

export type Episode = {
  guest: string;
  title: string;
  blurb: string;
  youtube: string;
  audio: string;
};

export const podcast = {
  name: 'Path to 99 Percentile',
  blurb:
    'A podcast run as a student, interviewing professionals around the world about productivity, time management, and doing work that matters. Kept here as an archive.',
  episodes: [
    {
      guest: 'Bill Dolan',
      title: 'Emmy-nominated TV and video director',
      blurb:
        'On creativity, discipline, and building a body of work across a career that ran from no television background at all to working with the Beatles, Maroon 5 and President Clinton.',
      youtube: 'https://www.youtube.com/watch?v=Lb8KKnJ638Y',
      audio:
        'https://anchor.fm/pathto99percentile/episodes/Talking-work-ethic-with-Bill-Dolan-Emmy-nominated-TV-director--Episode-2-Path-To-99-Percentile-egcafr',
    },
    {
      guest: 'Amber Vanderburg',
      title: 'Keynote speaker and founder, Ninja Group',
      blurb: 'On leadership, team performance, and building teams that work across cultures.',
      youtube: 'https://www.youtube.com/watch?v=_ynfbK-C76Q',
      audio:
        'https://anchor.fm/pathto99percentile/episodes/Talking-productivity-with-Amber-Vanderburg--Episode-1-Path-To-99-Percentile-ef1b5s',
    },
    {
      guest: 'Carlo Guzzi',
      title: 'Copywriter and marketing strategist',
      blurb: 'On storytelling and the craft of communicating an idea so it lands.',
      youtube: 'https://www.youtube.com/watch?v=82512nU9umQ',
      audio:
        'https://anchor.fm/pathto99percentile/episodes/Talking-efficiency-with-Carlo-Guzzi--Path-To-99-Percentile--Episode-3-ejbkcr',
    },
    {
      guest: 'Maya Sadasivan',
      title: 'Executive coach, leadership development',
      blurb: 'On coaching and helping people grow into what they are capable of at work.',
      youtube: 'https://www.youtube.com/watch?v=WViEY9Hu9mY',
      audio:
        'https://anchor.fm/pathto99percentile/episodes/Talking-leadership-and-productivity-with-Maya-Sadasivan--Episode-4--Path-to-99-Percentile-ejbkk4',
    },
    {
      guest: 'Kevin Kwok',
      title: 'Founder, J29 Creative Group',
      blurb: 'On relationship building, and working back up from bankruptcy to running an agency.',
      youtube: 'https://www.youtube.com/watch?v=5R0Lk9uw72U',
      audio:
        'https://anchor.fm/pathto99percentile/episodes/Talking-mindset-and-relationship-building-with-Kevin-Kwok--Episode-5--Path-To-99-Percentile-ejbkoh',
    },
  ] satisfies Episode[],
};

export type EarlyItem = { title: string; org: string; year: string; detail: string };

export const early: EarlyItem[] = [
  {
    title: 'Head Boy',
    org: 'Elected by a student body of 1,000',
    year: '2018',
    detail: 'Student voice to the school administration for the year.',
  },
  {
    title: 'Founder, school debating society',
    org: 'GEZELLIG',
    year: '2018',
    detail:
      'Founded after the school went out of Verbattle in the third round. Ran the selection process, 20 places from 100+ auditions.',
  },
  {
    title: 'Outstanding Delegate',
    org: 'International MUN, Continuous Crisis Committee',
    year: '2020',
    detail: 'Representing Afghanistan on COVID-19 response, 12+ directives submitted.',
  },
  {
    title: 'School Topper',
    org: "BYJU'S STEM Aptitude Challenge",
    year: '2017',
    detail: 'Top of school in the national aptitude challenge.',
  },
];

export type Course = { title: string; issuer: string; date: string };

/** The professionally relevant ones. Kept short on purpose. */
export const certifications: Course[] = [
  {
    title: 'Oracle Cloud Infrastructure 2025 Certified Generative AI Associate',
    issuer: 'Oracle',
    date: '2025',
  },
  {
    title: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
    issuer: 'Oracle',
    date: 'Oct 2025',
  },
  {
    title: 'Oracle Cloud Infrastructure 2025 Certified Foundations Associate',
    issuer: 'Oracle',
    date: 'Oct 2025',
  },
  { title: 'Data Science: Probability (PH125.3x)', issuer: 'HarvardX', date: 'Jun 2020' },
  { title: 'AI for Everyone: Master the Basics', issuer: 'IBM', date: 'May 2020' },
];

/** Older self-directed coursework, kept for completeness. */
export const earlyCourses: Course[] = [
  { title: 'MBA in a Box: Business Lessons from a CEO', issuer: 'Udemy', date: 'May 2020' },
  { title: 'Practical Leadership Skills', issuer: 'Udemy', date: 'May 2020' },
  { title: 'Complete Public Speaking Masterclass', issuer: 'Udemy', date: 'May 2020' },
  { title: 'Body Language for Entrepreneurs', issuer: 'Udemy', date: 'Apr 2020' },
  { title: 'Instagram Influencer Marketing for Businesses', issuer: 'Udemy', date: 'Mar 2020' },
];

export type Interest = { name: string; blurb: string; image?: string; imageAlt?: string };

export const interests: Interest[] = [
  {
    name: 'Climbing',
    blurb:
      'Bouldering, mostly. A sport that is entirely about reading a problem before touching it, then finding out how much of the read was wrong.',
    image: '/img/climbing.jpg',
    imageAlt: 'Bouldering on an indoor wall',
  },
  {
    name: 'Metalworking',
    blurb:
      'Early Montessori learning left a permanent drive to make things: woodworking, paper engineering, Meccano, papier-mâché at three in the morning. A metalworking workshop in tenth grade produced a dog sculpture out of scrap found on site.',
  },
  {
    name: 'Fractal drawing',
    blurb:
      'A long fascination with symmetry, worked out on paper. It unwinds the mind and, usefully, tends to shake new ideas loose while the hands are busy.',
  },
  {
    name: 'Photography',
    blurb:
      'Fully manual, after a course that made it click. Won a few competitions. Mostly it is an excuse to keep using gadgets that do interesting things with light.',
  },
  {
    name: 'Debating and public speaking',
    blurb:
      'Started by reading stories to classmates and then arguing about what they meant. Several awards since. The research before the debate is the part worth having.',
  },
  {
    name: 'Writing',
    blurb:
      'For the school magazine, for a blog, and for Giant Wheel, India’s first life-values and life-skills comic monthly.',
  },
  {
    name: 'Teaching',
    blurb:
      'Explaining things is the fastest way to find out whether you understand them. Maths and science to grades 7 through 10, and video production to adults with learning difficulties.',
  },
];
