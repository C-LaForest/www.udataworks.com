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
  const showMenu = getURLParameter('showMenu') === 'true';
  const industry = getIndustryPreference();

  if (showMenu) {
    showIndustryMenu();
    // Attach event listeners for selection buttons
    document.getElementById('select-healthcare').addEventListener('click', function() {
      setIndustryPreference('healthcare');
      redirectToIndustry('healthcare');
    });
    document.getElementById('select-utility').addEventListener('click', function() {
      setIndustryPreference('utility');
      redirectToIndustry('utility');
    });
    return;
  }

  // If user has a preference (healthcare or utility), redirect to it
  if (industry === 'healthcare' || industry === 'utility') {
    redirectToIndustry(industry);
    return;
  }
  
  // If no cookie is set, default to healthcare
  setIndustryPreference('healthcare');
  redirectToIndustry('healthcare');
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
