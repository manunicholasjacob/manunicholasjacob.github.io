/* Regenerates src/data/img-dims.ts from the files in public/img. Run after
   adding or replacing any image: node scripts/img-dims.mjs */
import fs from 'node:fs';
import sharp from 'sharp';

const out = {};
for (const f of fs.readdirSync('public/img').sort()) {
  const m = await sharp('public/img/' + f).metadata();
  out['/img/' + f] = [m.width, m.height];
}
const body = Object.entries(out)
  .map(([k, v]) => '  ' + JSON.stringify(k) + ': [' + v[0] + ', ' + v[1] + '],')
  .join('\n');

fs.writeFileSync(
  'src/data/img-dims.ts',
  `/**
 * Intrinsic pixel dimensions for everything in /public/img.
 *
 * Every <img> needs width and height or the page reflows as photos arrive,
 * which is both a visible jolt and a Core Web Vitals penalty. Most images here
 * come from data files, so the size cannot be written inline at the call site.
 *
 * Regenerate after adding or replacing an image:
 *   node scripts/img-dims.mjs
 */
export const imgDims: Record<string, readonly [number, number]> = {
${body}
};

/** Spread onto an <img>: {...dim(src)}. Unknown paths contribute nothing. */
export const dim = (src?: string) => {
  const d = src ? imgDims[src] : undefined;
  return d ? { width: d[0], height: d[1] } : {};
};
`,
);
console.log('wrote src/data/img-dims.ts with', Object.keys(out).length, 'entries');
