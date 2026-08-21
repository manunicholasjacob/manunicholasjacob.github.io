/**
 * Everything that appears in more than one place lives here.
 * Edit this file, not the templates.
 */

export const site = {
  name: 'Manu Nicholas Jacob',
  shortName: 'MNJ',
  role: 'Hardware Engineer, Dell Technologies',
  tagline: 'Enterprise AI server platforms by day. Edge-AI and computer-architecture research by night.',
  location: 'Austin, Texas',
  email: 'manunicholasjacob@gmail.com',
  url: 'https://manunicholasjacob.com',
  description:
    'Hardware engineer and independent researcher working on enterprise AI server platforms and the physics of machine-learning inference on constrained hardware.',
} as const;

export const links = {
  github: 'https://github.com/manunicholasjacob',
  linkedin: 'https://www.linkedin.com/in/manu-nicholas-jacob/',
  orcid: 'https://orcid.org/0009-0007-6589-6572',
  scholar: 'https://scholar.google.com/citations?user=inrrUQIAAAAJ&hl=en',
  youtube: 'https://www.youtube.com/@manunicholasjacob',
} as const;

export const nav = [
  { href: '/research', label: 'Research' },
  { href: '/projects', label: 'Projects' },
  { href: '/writing', label: 'Writing' },
  { href: '/lab', label: 'Lab' },
  { href: '/about', label: 'About' },
] as const;

/** Secondary pages: in the footer and the 404, but not the top bar. */
export const navSecondary = [
  { href: '/service', label: 'Service' },
  { href: '/cv', label: 'CV' },
  { href: '/now', label: 'Now' },
  { href: '/archive', label: 'Archive' },
] as const;

/** The strip of numbers under the hero. Keep these honest and current. */
export const stats = [
  { value: '14', label: 'Papers' },
  { value: '13', label: 'Under review' },
  { value: '8', label: 'Artifact DOIs' },
  { value: '1', label: 'Patent authorized' },
] as const;

/** Scrolling keyword band. Pure texture, but it sets the subject matter fast. */
export const keywords = [
  'Edge AI',
  'Computer architecture',
  'PCIe',
  'Memory bandwidth',
  'INT8 quantization',
  'Thermal control',
  'Power telemetry',
  'Root-cause analysis',
  'ARM Cortex-A76',
  'Reproducible benchmarking',
  'GPU platforms',
  'Embedded Linux',
] as const;
