// industry-selection.js

// Utility: Check for localStorage support
function storageAvailable(type) {
  try {
    var storage = window[type], x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}

// Utility: Set and get industry preference
function setIndustryPreference(industry) {
  if (storageAvailable('localStorage')) {
    localStorage.setItem('industry', industry);
  } else {
    document.cookie = `industry=${industry}; path=/`;
  }
}
function getIndustryPreference() {
  if (storageAvailable('localStorage')) {
    return localStorage.getItem('industry');
  } else {
    const match = document.cookie.match(/(?:^|; )industry=([^;]*)/);
    return match ? match[1] : null;
  }
}
function clearIndustryPreference() {
  if (storageAvailable('localStorage')) {
    localStorage.removeItem('industry');
  }
  document.cookie = 'industry=; Max-Age=0; path=/';
}

// Helper: Get URL parameter
function getURLParameter(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// Show/hide menu helpers
function showIndustryMenu() {
  document.getElementById('industry-selection').classList.remove('hidden');
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('error-message').classList.add('hidden');
}
function hideIndustryMenu() {
  document.getElementById('industry-selection').classList.add('hidden');
}

// Show error and menu
function showError(message) {
  document.getElementById('error-message').textContent = message;
  document.getElementById('error-message').classList.remove('hidden');
  showIndustryMenu();
}

// Redirect logic
function redirectToIndustry(industry) {
  document.getElementById('loading').classList.remove('hidden');
  hideIndustryMenu();
  setTimeout(() => {
    window.location.assign(`./${industry}/index.html`);
  }, 250); // faster redirect, no menu flash
}

// Main logic
document.addEventListener('DOMContentLoaded', function() {
  // Landing-page-only: the redirect/menu logic touches #industry-selection,
  // #loading, and #error-message, which exist only on the industry-selection
  // landing page. On sub-pages the script is loaded solely for the exported
  // clearIndustryPreferenceAndShowMenu() "Change Industry" handler, so bail out
  // before dereferencing elements that aren't there (was a null-deref console error).
  if (!document.getElementById('industry-selection')) return;

  const showMenu = getURLParameter('showMenu') === 'true';
  const industry = getIndustryPreference();

  if (showMenu) {
    showIndustryMenu();
    // Attach event listeners for selection buttons
    document.getElementById('select-research').addEventListener('click', function() {
      setIndustryPreference('medical-research');
      redirectToIndustry('medical-research');
    });
    document.getElementById('select-regulated').addEventListener('click', function() {
      setIndustryPreference('regulated-industries');
      redirectToIndustry('regulated-industries');
    });
    document.getElementById('select-legal').addEventListener('click', function() {
      setIndustryPreference('legal');
      redirectToIndustry('legal');
    });
    return;
  }

  // Migration: legacy preferences (healthcare, utility) remap to regulated-industries
  if (industry === 'healthcare' || industry === 'utility') {
    setIndustryPreference('regulated-industries');
    redirectToIndustry('regulated-industries');
    return;
  }

  // If user has a current preference, redirect to it
  if (industry === 'medical-research' || industry === 'regulated-industries' || industry === 'legal') {
    redirectToIndustry(industry);
    return;
  }

  // If no preference is set, default to medical-research (primary niche)
  setIndustryPreference('medical-research');
  redirectToIndustry('medical-research');
});

// Enhanced clearIndustryPreference for "Change Industry" functionality
function clearIndustryPreferenceAndShowMenu() {
  clearIndustryPreference();
  // Redirect to index with a parameter to show the menu
  window.location.href = '../index.html?showMenu=true';
}

// Make functions available globally for onclick handlers
window.clearIndustryPreference = clearIndustryPreference;
window.clearIndustryPreferenceAndShowMenu = clearIndustryPreferenceAndShowMenu;
