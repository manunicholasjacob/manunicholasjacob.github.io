# The CV PDF at /manu-nicholas-jacob-cv.pdf

**Since 31 Aug 2026 the download is the curated LaTeX one-pager**, built from
`../resume/cv.tex` (`cv-general-1p.pdf`), not a print of the /cv page. The
/cv page remains the long-form HTML record; the download is the document a
recruiter actually keeps.

To update it: edit `resume/cv.tex`, then

```bash
cd ../resume
pdflatex -interaction=nonstopmode -jobname="cv-general-1p" "\def\cvlevel{1}\def\cvlane{general}\input{cv.tex}"
cp cv-general-1p.pdf ../manu-site/public/manu-nicholas-jacob-cv.pdf
```

The counts in cv.tex (manuscripts, under review, ATC naming) must match the
live site; they have drifted twice. Check them against /research before
building.

## The old print path, and why it was retired

The PDF used to be a headless-Chrome print of /cv. On 28 Aug 2026 that print
silently produced a ONE-page file (the page had not finished rendering) and
it shipped broken for three days because the page count was only checked on
the previous run. If you ever print /cv again, verify afterwards:

```bash
node -e "const s=require('fs').readFileSync('public/manu-nicholas-jacob-cv.pdf').toString('latin1');console.log('pages:',(s.match(/\/Type\s*\/Page[^s]/g)||[]).length)"
```

and refuse to ship anything that does not report the expected count.
