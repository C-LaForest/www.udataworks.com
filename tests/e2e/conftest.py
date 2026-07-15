"""End-to-end Playwright fixtures for the Email Triage subsite.

Run locally (Windows/macOS/Linux):

    python -m pip install -r tests/e2e/requirements.txt
    python -m playwright install chromium
    python -m pytest tests/e2e -q

The suite starts its OWN static server (``python -m http.server``) rooted
at the repo, so nothing external needs to be running. CI does the same on
ubuntu-latest (see ``.github/workflows/e2e.yml``).

Scope: the Email Triage product subsite (uniform ``product.css`` template,
8-link nav). The root landing and the vertical subsites use a different
template and are intentionally out of this suite's scope.
"""
from __future__ import annotations

import socket
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]

# Repo-root-relative URL paths under test.
PAGES = [
    "/email-triage/index.html",
    "/email-triage/features.html",
    "/email-triage/privacy.html",
    "/email-triage/rigor.html",
    "/email-triage/api.html",
    "/email-triage/service.html",
    "/email-triage/use-cases.html",
    "/email-triage/contact.html",
]

# Expected primary-nav link count (v0.2.0 added rigor.html -> 8).
EXPECTED_NAV_LINKS = 8


def _free_port() -> int:
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    return port


@pytest.fixture(scope="session")
def site_url():
    """Start ``python -m http.server`` at the repo root; yield its base URL."""
    port = _free_port()
    proc = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1"],
        cwd=str(REPO_ROOT),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    url = f"http://127.0.0.1:{port}"
    deadline = time.time() + 15
    ready = False
    while time.time() < deadline:
        try:
            urllib.request.urlopen(url + "/email-triage/index.html", timeout=1)
            ready = True
            break
        except Exception:
            time.sleep(0.2)
    if not ready:
        proc.terminate()
        raise RuntimeError("http.server did not become ready in time")
    yield url
    proc.terminate()
    try:
        proc.wait(timeout=5)
    except Exception:
        proc.kill()
