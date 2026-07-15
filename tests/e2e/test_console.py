"""Every page must load with zero console errors and no uncaught exceptions.

This is the gate the Phase 5i industry-selection.js fix unblocked: a
DOMContentLoaded null-deref used to throw on every sub-page.
"""
import pytest

from conftest import PAGES


@pytest.mark.parametrize("path", PAGES)
def test_no_console_errors(page, site_url, path):
    errors: list[str] = []
    page.on("console", lambda m: errors.append(f"{m.type}: {m.text}") if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
    page.goto(site_url + path, wait_until="networkidle")
    assert not errors, f"{path} logged console errors:\n" + "\n".join(errors)
