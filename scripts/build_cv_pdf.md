# Regenerating the CV PDF

The PDF at `public/manu-nicholas-jacob-cv.pdf` is a print of `/cv`, which renders
from the same data files as the rest of the site. So it goes stale every time the
publication record changes, and it went stale on 21 August: it claimed fourteen
manuscripts with thirteen under review, three days after both numbers moved.

Regenerate it whenever `research.ts`, `projects.ts` or `service.ts` changes.

```bash
npm run dev
```

Then, in another shell:

```bash
"C:/Program Files/Google/Chrome/Application/chrome.exe" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --user-data-dir="$TEMP/chrome-cv" \
  --print-to-pdf="$TEMP/cv-new.pdf" \
  "http://localhost:4321/cv"

cp "$TEMP/cv-new.pdf" public/manu-nicholas-jacob-cv.pdf
npm run build
```

The `--user-data-dir` is not optional on Windows. Without it, `--print-to-pdf`
and `--screenshot` fail with "Access is denied" against a profile that is already
in use.

## Check three things before committing it

```bash
python -c "from pypdf import PdfReader; r=PdfReader('public/manu-nicholas-jacob-cv.pdf'); print(len(r.pages),'pages'); print('\n'.join((p.extract_text() or '')[:120] for p in r.pages))"
```

1. **Three pages**, balanced, with sections starting cleanly rather than a section
   heading stranded at the foot of one page.
2. **No interface text.** "Print" and "Download PDF" are `print:hidden` and must
   not appear in the extracted text.
3. **The counts match the site.** Page 2 should open with the papers heading and
   the derived counts, and the summary on page 1 should agree with the homepage
   stat strip.

## Why the print stylesheet looks the way it does

It used to set `font-size: 11px` on `.cv`. Almost everything on that page is sized
in `rem`, which is relative to the root element rather than to `.cv`, so that rule
moved nothing and the CV printed to five pages. Scaling `:global(html)` is what
actually shrinks a rem-based layout, and that is what the block does now.

`@page { margin: 12mm }` sets the paper margin, `break-inside: avoid` on
`.cv-section` stops a section splitting across a page break, and
`break-after: avoid` on `.cv-h` keeps a heading with the block it introduces.

Three pages is the honest length for a CV listing thirteen papers, ten artifacts
and four reviewing entries. The old two-page version was denser than the content
supports.
