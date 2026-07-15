"""Structural invariants every Email Triage page must hold.

Notably the nav-link count: v0.2.0 added rigor.html, so the primary nav is
now 8 links. If a page drops a nav link (or the rigor page is removed),
this fails.
"""
import pytest

from conftest import PAGES, EXPECTED_NAV_LINKS


@pytest.mark.parametrize("path", PAGES)
def test_required_elements(page, site_url, path):
    page.goto(site_url + path, wait_until="domcontentloaded")

    # Exactly one <h1>.
    assert page.locator("h1").count() == 1, f"{path}: expected exactly one <h1>"

    # Non-empty <title>.
    assert page.title().strip(), f"{path}: empty <title>"

    # Primary (header) nav has the expected link count and includes rigor.
    header_links = page.locator("header nav a")
    assert header_links.count() == EXPECTED_NAV_LINKS, (
        f"{path}: header nav has {header_links.count()} links, "
        f"expected {EXPECTED_NAV_LINKS}"
    )
    assert page.locator('header nav a[href="rigor.html"]').count() == 1, (
        f"{path}: header nav is missing the rigor.html link"
    )

    # Footer nav mirrors the primary nav.
    footer_links = page.locator("footer nav a")
    assert footer_links.count() == EXPECTED_NAV_LINKS, (
        f"{path}: footer nav has {footer_links.count()} links, "
        f"expected {EXPECTED_NAV_LINKS}"
    )

    # product.css is linked (shared design system).
    assert page.locator('link[href="product.css"]').count() == 1, (
        f"{path}: product.css stylesheet not linked"
    )
