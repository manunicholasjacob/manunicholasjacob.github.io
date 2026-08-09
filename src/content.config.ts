import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Writing lives in src/content/writing/*.md.
 *
 * `draft: true` keeps a post out of the production build but visible while
 * running `npm run dev`, so half-finished pieces can sit in the repo safely.
 */
const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    /** Short mono label shown on the card, e.g. "Systems". */
    kind: z.string().default('Note'),
    topics: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    /** Minutes. Left manual so it never lies. */
    readingTime: z.number().optional(),
  }),
});

export const collections = { writing };
