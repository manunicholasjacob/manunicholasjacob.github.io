/**
 * Carry the previous deploy's hashed assets into this one.
 *
 * GitHub Pages serves everything, including HTML, with max-age=600. Astro
 * renames /_astro/* on every content change, so for up to ten minutes after
 * a deploy, a browser holding the previous HTML requests a stylesheet that
 * the new deploy just deleted, and the page renders as bare HTML on a blank
 * background. That has now been reported twice as "the site is broken".
 *
 * Fix: before uploading, read the live site's pages, collect every /_astro/
 * URL they reference, and download any that this build does not already
 * ship. Stale HTML then still finds its assets for the cache window. Only
 * one generation is carried, which is exactly as long as the window lasts.
 *
 * Every failure here is non-fatal by design: a fresh deploy with no carry
 * is strictly better than no deploy.
 */
import fs from 'node:fs';
import path from 'node:path';

const LIVE = 'https://manunicholasjacob.com';
const PAGES = [
  '/',
  '/research/',
  '/service/',
  '/projects/',
  '/writing/',
  '/lab/',
  '/about/',
  '/now/',
  '/cv/',
  '/archive/',
];
const DIST = 'dist';

const get = async (url) => {
  const r = await fetch(url, { redirect: 'follow' });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r;
};

const refs = new Set();
for (const p of PAGES) {
  try {
    const html = await (await get(LIVE + p)).text();
    for (const m of html.matchAll(/(?:href|src)="(\/_astro\/[^"]+)"/g)) refs.add(m[1]);
  } catch (e) {
    console.log(`skip ${p}: ${e.message}`);
  }
}

let carried = 0;
for (const ref of refs) {
  const dest = path.join(DIST, ref);
  if (fs.existsSync(dest)) continue;
  try {
    const buf = Buffer.from(await (await get(LIVE + ref)).arrayBuffer());
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buf);
    carried++;
    console.log(`carried ${ref} (${buf.length} bytes)`);
  } catch (e) {
    console.log(`skip ${ref}: ${e.message}`);
  }
}
console.log(`${carried} previous-generation asset(s) carried, ${refs.size} referenced live`);
