# manunicholasjacob.com

Personal site for Manu Nicholas Jacob. Static, no CMS, and almost no runtime
JavaScript: a theme toggle, a scroll reveal, a mobile menu, and a command
palette (Ctrl/Cmd-K).

**Astro 5 · Tailwind CSS v4 · self-hosted Inter + JetBrains Mono**

Pages: `/` · `/research` · `/projects` · `/lab` · `/writing` (+ posts + RSS) ·
`/about` · `/service` · `/cv` (print-ready) · `/now` · `/archive` · `404`

---

## Run it

```bash
npm install
npm run dev
```

Then open <http://localhost:4321>.

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Dev server with hot reload                    |
| `npm run build`   | Static build into `dist/`                     |
| `npm run preview` | Serve `dist/` exactly as it will be deployed  |
| `npm run check`   | Type-check the `.astro` files                 |

## How to change things

**Almost everything is data, not markup.** Nine times out of ten, the edit you
want is in `src/data/`:

| File                    | Holds                                                        |
| ----------------------- | ------------------------------------------------------------ |
| `src/data/site.ts`      | Name, role, email, links, nav, hero stat strip, keyword band  |
| `src/data/research.ts`  | Every paper. Add an object, the page rebuilds itself          |
| `src/data/projects.ts`  | Repos and hardware builds                                     |
| `src/data/service.ts`   | Judging, speaking, volunteering                               |
| `src/data/archive.ts`   | Podcast, early awards, certifications, interests              |
| `src/data/lab.ts`       | Bench machines, methodology rules, headline bench facts       |
| `src/data/now.ts`       | The /now page (update the `updated` date when you edit it)    |

The CV at `/cv` renders from these same files, so it can never drift out of
date independently. It has a print stylesheet; "Print / save PDF" produces a
clean light-mode PDF regardless of the on-screen theme.

### Write a post

Drop a markdown file in `src/content/writing/` with the frontmatter the
existing posts use (`title`, `description`, `date`, `kind`, `topics`). While
`draft: true` is set, the post is visible in `npm run dev` but excluded from
the production build, the writing index, the homepage strip and the RSS feed.
Four scaffolds for the LinkedIn systems essays are already there as drafts:
paste the published text in and remove `draft: true`.

### Add a paper

Append one object to `papers` in `src/data/research.ts`. Set `featured: true`
to also promote it into the three-up block on the homepage. Nothing else needs
touching: the research page, the homepage and the paper count all read from
this array.

### Change the accent colour

One line, `--accent` in `src/styles/global.css` (plus `--accent-rgb`, which is
the same colour in space-separated form for the glow effects). Every button,
rule, hover state and glow follows. Alternates that already work with this
palette are listed in the comment above it.

Light mode uses a separately-tuned, darker accent so small text still clears
WCAG AA against a white background. If you change one, change both.

## Design system

- **Type:** Inter Variable for everything readable, JetBrains Mono Variable for
  labels, metadata and numbers. Display headings are large, light (350) and very
  tightly tracked (-0.045em). Labels are 11px, uppercase, widely tracked. The
  gap between those two registers is the whole personality of the site.
- **Colour:** near-monochrome, one accent used sparingly.
- **Shape:** square buttons, 3px cards, hairline borders, corner ticks.
- **Texture:** dot and line grids, masked with a radial fade, plus a soft accent
  glow behind each page header.
- **Motion:** one reveal-on-scroll transition, one marquee. Both respect
  `prefers-reduced-motion`, and the reveal is scoped to `html.js` with a 2.5s
  safety net so a scripting failure can never leave a blank page.

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.

1. Create a public repo and push this directory to it.
2. Repo **Settings → Pages → Source → GitHub Actions**.
3. **Custom-domain cutover, when ready:** move `CNAME.hold` (repo root) back to
   `public/CNAME`, push, then point DNS at GitHub: four `A` records for the
   apex (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
   `185.199.111.153`) and a `CNAME` for `www` pointing at
   `manunicholasjacob.github.io`. While the file is held, the site serves at
   the plain github.io URL, which is what the feedback deploy uses.
4. Tick **Enforce HTTPS** once the certificate is issued.

**Do the domain first.** If the domain is currently registered through Wix,
transfer it out (Cloudflare Registrar or Namecheap) *before* cancelling the Wix
plan, then repoint DNS, then cancel. Transfers take a few days.

Cloudflare Pages works just as well: build command `npm run build`, output
directory `dist`.

## Legacy URLs

Old Wix paths are declared in `redirects` in `astro.config.mjs` and are excluded
from the sitemap, so anything already linked or indexed keeps resolving:

```
/projects-3   →  /research      /resume            →  /about
/open-source  →  /projects      /community-service →  /service
/achievements →  /projects      /online-courses    →  /archive
                                /podcasts          →  /archive
                                /interviews        →  /archive
                                /interests         →  /archive
```

## Adding components

The design is deliberately compatible with the shadcn registry protocol, so
anything from [Watermelon UI](https://ui.watermelon.sh) drops straight in:

```bash
npx shadcn@latest add "https://registry.watermelon.sh/<component>.json"
```

React is already wired up via `@astrojs/react`. Import a component into an
`.astro` page and give it a `client:*` directive only if it actually needs to be
interactive; otherwise it renders to static HTML and ships no JavaScript.

## Notes on content

- Employment is described in general terms on purpose. Specific platforms,
  cases and internal identifiers stay off this site.
- The research list is shorter than the public preprint archive because
  withdrawn work is excluded rather than listed.
