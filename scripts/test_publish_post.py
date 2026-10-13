"""
Tests for the embargo in publish_post.py.

    python -m unittest scripts/test_publish_post.py -v

The format-tax post carries numbers from a paper under review, so it must be
refused before 17 Dec 2026 whatever the flags say, and must not be touched on
disk when it is refused.
"""

from __future__ import annotations

import contextlib
import datetime as dt
import io
import pathlib
import sys
import tempfile
import unittest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import publish_post as pp  # noqa: E402

DRAFT = "---\ntitle: test\ndate: 2026-12-04\ndraft: true\n---\n\nbody\n"


class EmbargoTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.posts = pathlib.Path(self.tmp.name)
        for slug in ("format-tax", "some-other-post"):
            (self.posts / f"{slug}.md").write_text(DRAFT, encoding="utf-8")

    def tearDown(self) -> None:
        self.tmp.cleanup()

    def run_publish(self, slug: str, today: dt.date, use_today=False, force=False) -> int:
        with contextlib.redirect_stdout(io.StringIO()):
            return pp.publish(slug, use_today, force, today=today, posts=self.posts)

    def text(self, slug: str) -> str:
        return (self.posts / f"{slug}.md").read_text(encoding="utf-8")

    def test_embargo_date(self) -> None:
        self.assertEqual(pp.EMBARGO["format-tax"], dt.date(2026, 12, 17))

    def test_refused_before_17_dec_with_every_flag(self) -> None:
        for today in (dt.date(2026, 10, 13), dt.date(2026, 12, 4), dt.date(2026, 12, 16)):
            for use_today, force in ((False, False), (True, False), (False, True), (True, True)):
                with self.subTest(today=today, use_today=use_today, force=force):
                    self.assertEqual(self.run_publish("format-tax", today, use_today, force), 2)
                    self.assertIn("draft: true", self.text("format-tax"))

    def test_refused_even_when_the_file_is_absent(self) -> None:
        (self.posts / "format-tax.md").unlink()
        self.assertEqual(self.run_publish("format-tax", dt.date(2026, 12, 16), force=True), 2)

    def test_allowed_from_17_dec(self) -> None:
        self.assertEqual(self.run_publish("format-tax", dt.date(2026, 12, 17)), 0)
        self.assertIn("draft: false", self.text("format-tax"))

    def test_other_posts_keep_the_ordinary_schedule(self) -> None:
        # scheduled 4 Dec: refused early without a flag, allowed with --force
        self.assertEqual(self.run_publish("some-other-post", dt.date(2026, 12, 1)), 1)
        self.assertEqual(self.run_publish("some-other-post", dt.date(2026, 12, 1), force=True), 0)

    def test_listing_shows_the_embargo_date_not_the_schedule(self) -> None:
        old = pp.POSTS
        pp.POSTS = self.posts
        try:
            buf = io.StringIO()
            with contextlib.redirect_stdout(buf):
                pp.listing()
        finally:
            pp.POSTS = old
        out = buf.getvalue()
        if dt.date.today() < dt.date(2026, 12, 17):
            self.assertIn("2026-12-17", out)


if __name__ == "__main__":
    unittest.main()
