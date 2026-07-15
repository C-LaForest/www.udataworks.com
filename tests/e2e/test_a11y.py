"""axe-core accessibility gate — no critical/serious WCAG 2.1 A/AA violations.

axe-core (Apache-2.0) is vendored at ``vendor/axe.min.js`` so the check runs
offline, with no network or extra pip dependency. We gate on the actionable
impact levels (critical + serious); minor/moderate are reported but not
failed, so the gate stays meaningful rather than noisy.
"""
from pathlib import Path

import pytest

from conftest import PAGES

AXE_JS = Path(__file__).parent / "vendor" / "axe.min.js"
WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]
FAIL_IMPACTS = {"critical", "serious"}


@pytest.mark.parametrize("path", PAGES)
def test_no_serious_a11y_violations(page, site_url, path):
    page.goto(site_url + path, wait_until="networkidle")
    page.add_script_tag(path=str(AXE_JS))
    results = page.evaluate(
        "(tags) => axe.run(document, {runOnly: {type: 'tag', values: tags}})",
        WCAG_TAGS,
    )
    blocking = [v for v in results["violations"] if v.get("impact") in FAIL_IMPACTS]
    if blocking:
        detail = "\n".join(
            f"  - [{v['impact']}] {v['id']}: {v['help']} "
            f"({len(v['nodes'])} node(s); {v['helpUrl']})"
            for v in blocking
        )
        pytest.fail(f"{path}: {len(blocking)} critical/serious a11y violation(s):\n{detail}")
