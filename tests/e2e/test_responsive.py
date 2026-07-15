"""No page may scroll horizontally at the two binding mobile/tablet sizes.

375x812  (iPhone-class phone portrait)
768x1024 (iPad-class tablet portrait)

A horizontal scrollbar on a content page is the classic "something is wider
than the viewport" bug; this catches it structurally.
"""
import pytest

from conftest import PAGES

VIEWPORTS = [(375, 812), (768, 1024)]


@pytest.mark.parametrize("path", PAGES)
@pytest.mark.parametrize("width,height", VIEWPORTS)
def test_no_horizontal_overflow(page, site_url, path, width, height):
    page.set_viewport_size({"width": width, "height": height})
    page.goto(site_url + path, wait_until="networkidle")
    scroll_w = page.evaluate("document.documentElement.scrollWidth")
    # 1px tolerance for sub-pixel rounding.
    assert scroll_w <= width + 1, (
        f"{path} @ {width}x{height}: horizontal overflow "
        f"(scrollWidth={scroll_w} > viewport={width})"
    )
