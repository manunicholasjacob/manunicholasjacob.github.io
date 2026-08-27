/**
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
  "/img/4sight.jpg": [806, 470],
  "/img/bench-work.jpg": [1000, 1000],
  "/img/booth-beacon.jpg": [716, 652],
  "/img/dell.jpg": [226, 214],
  "/img/lovedale.jpg": [594, 1185],
  "/img/manu.jpg": [900, 900],
  "/img/og.png": [1200, 630],
  "/img/pi5.jpg": [1200, 675],
  "/img/rover.jpg": [764, 573],
  "/img/senior-design-1.jpg": [1280, 964],
  "/img/senior-design-2.jpg": [760, 800],
  "/img/server-work.jpg": [243, 246],
  "/img/vex-field-1.jpg": [644, 372],
  "/img/vex-field-2.jpg": [806, 446],
};

/** Spread onto an <img>: {...dim(src)}. Unknown paths contribute nothing. */
export const dim = (src?: string) => {
  const d = src ? imgDims[src] : undefined;
  return d ? { width: d[0], height: d[1] } : {};
};
