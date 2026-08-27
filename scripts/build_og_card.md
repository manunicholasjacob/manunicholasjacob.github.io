# Regenerating the og card

`public/img/og.png` is a 1200x630 social-preview card in the site's own type
and palette. Regenerate it when the headline, role, or palette changes; it
deliberately carries no live counts, so the publication record does not stale
it.

1. Stage the template and fonts where the dev server can reach them:
   copy the og.html template (see git history of this file's commit) into
   `public/_og/og.html`, and the two woff2 files from
   `node_modules/@fontsource-variable/{instrument-sans,jetbrains-mono}/files/`
   (latin, wght-normal) beside it as `is.woff2` / `jm.woff2`.
2. With `npm run dev` running:

```bash
"C:/Program Files/Google/Chrome/Application/chrome.exe" \
  --headless=new --disable-gpu --hide-scrollbars \
  --user-data-dir="$TEMP/chrome-og" --window-size=1200,630 \
  --virtual-time-budget=4000 \
  --screenshot="$TEMP/og.png" "http://localhost:4321/_og/og.html"
```

3. Compress into place and clean up:

```bash
node -e "require('sharp')(process.env.TEMP+'/og.png').png({compressionLevel:9}).toFile('public/img/og.png')"
rm -rf public/_og
```

Fonts must load over HTTP; a file:// page cannot load file:// woff2 in
headless Chrome even with --allow-file-access-from-files.
