---
title: How this site is built
description: A static site with no CMS, no build-time magic, and a deliberate rule that the content is data rather than markup.
date: 2026-08-09
kind: Colophon
topics: ['Astro', 'Tailwind', 'Design systems']
readingTime: 4
---

This site replaced a Wix build. Not because Wix is bad at what it does, but
because what it does was not what this site needed. There is no store here, no
booking flow, no database. There are documents: a publication record, a list of
repositories, a bio. A page builder is a heavy instrument for a set of
documents, and it charges rent.

## The stack

**Astro 5** for the framework, **Tailwind CSS v4** for the styling, **Inter
Variable** and **JetBrains Mono Variable** self-hosted rather than pulled from a
font CDN. The whole thing compiles to static HTML and ships almost no
JavaScript: a theme toggle, a scroll reveal, and a mobile menu. That is the
entire runtime.

React is wired up through `@astrojs/react`, but nothing on the site currently
uses it. It is there so that a component from a registry can be dropped in later
without a migration.

## Content is data, not markup

The rule that shapes the whole repository: **if a human will edit it more than
once, it belongs in `src/data/`, not in a template.**

Adding a paper to the publication record means appending one object to an array
in `src/data/research.ts`. The research page, the count on the homepage, the
three-up highlight block and the sitemap all derive from that array. There is no
second place to remember. The failure mode where a site slowly goes stale
because updating it means touching four files is a design problem, and it is
solvable by not having four files.

The same applies to projects, service, and the archive. Five data files carry
essentially all of the content.

## The look

The design borrows its grammar from technical documentation rather than from
personal-portfolio convention.

- Display type is **large, light, and very tightly tracked**. Weight 350 at
  -0.045em letter-spacing. Light weight at large size reads as considered;
  bold at large size reads as shouting.
- Labels are the opposite register: **11px monospace, uppercase, widely
  tracked**. The distance between those two treatments is doing most of the
  aesthetic work.
- Colour is near-monochrome with **one accent**, used sparingly enough that it
  still means something when it appears. Amber, because the research is about
  heat and power, and because every other engineering portfolio is blue.
- Borders are hairlines. Cards get **corner ticks**, which is the smallest
  possible gesture that makes a rectangle look like an instrument rather than a
  div.

Dark is the default. Light exists, is genuinely tuned rather than inverted, and
uses a separately chosen darker accent so that small text still clears WCAG AA
against white. Inverting a palette and calling it a light theme produces amber
text at 3:1 contrast, which is a nice way to make a site unreadable for a
portion of the people visiting it.

## Motion, carefully

There is exactly one entrance animation and one marquee.

The reveal-on-scroll is scoped to `html.js`, a class added by an inline script
in the head. If scripting fails, is blocked, or throws before the observer is
attached, the CSS that sets `opacity: 0` never applies and the page renders
fully visible. There is also a 2.5 second timeout that reveals everything
regardless of what the observer thinks.

This matters more than it sounds. The standard implementation of scroll reveal
sets `opacity: 0` unconditionally in CSS and removes it with JavaScript. When
that JavaScript does not run, the visitor gets a blank page, and the site
appears to be broken rather than un-animated. Decoration should never be load
bearing.

Both effects respect `prefers-reduced-motion`.

## What it costs

Nothing. The build is static, it deploys to GitHub Pages from a GitHub Action on
every push to `main`, and the only recurring cost is the domain registration.

The build takes about eight seconds.
