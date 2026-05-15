// Screenshot theme toggle for Email Triage subsite.
// Click sun/moon to swap product screenshots between dark (no suffix) and light (-l) variants.
// State persists via localStorage. Images without an -l variant fall back to the original via onerror.

(function () {
  var STORAGE_KEY = 'et-screenshot-theme';
  // Files without -l variants — keep them as-is regardless of theme.
  var NO_LIGHT_VARIANT = ['Draft.png', 'Openclaw_et_health.png'];

  function getStored() {
    try { return localStorage.getItem(STORAGE_KEY) || 'moon'; }
    catch (e) { return 'moon'; }
  }
  function setStored(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {}
  }

  function isProductScreenshot(src) {
    if (!src) return false;
    // images/<name>.png — relative path inside email-triage subsite
    if (!/^images\/.+\.png$/i.test(src)) return false;
    return !NO_LIGHT_VARIANT.some(function (n) { return src.endsWith(n); });
  }

  function applyTheme(theme) {
    // Toggle icon visibility
    document.querySelectorAll('.theme-sun').forEach(function (el) {
      el.style.display = theme === 'sun' ? '' : 'none';
    });
    document.querySelectorAll('.theme-moon').forEach(function (el) {
      el.style.display = theme === 'moon' ? '' : 'none';
    });
    // Update aria-label
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-label',
        theme === 'sun' ? 'Switch screenshots to light theme' : 'Switch screenshots to dark theme');
      btn.setAttribute('aria-pressed', theme === 'moon' ? 'true' : 'false');
    });

    // Swap product screenshots
    document.querySelectorAll('img').forEach(function (img) {
      // Remember the original (dark) src once
      if (!img.dataset.themeBase) {
        var raw = img.getAttribute('src') || '';
        if (!isProductScreenshot(raw)) return;
        img.dataset.themeBase = raw;
      }
      var base = img.dataset.themeBase;
      var target = theme === 'moon' ? base.replace(/\.png$/, '-l.png') : base;
      if (img.getAttribute('src') === target) return;
      // Fall back to base if the -l variant is missing
      img.onerror = function () {
        this.onerror = null;
        if (this.getAttribute('src') !== base) this.src = base;
      };
      img.src = target;
    });
  }

  function toggle() {
    var current = getStored();
    var next = current === 'sun' ? 'moon' : 'sun';
    setStored(next);
    applyTheme(next);
  }
  window.toggleScreenshotTheme = toggle;

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getStored());
  });
})();
