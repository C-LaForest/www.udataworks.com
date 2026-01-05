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
    // Fallback: Use a session cookie (expires on browser close)
    document.cookie = `industry=${industry}; path=/`;
  }
}

function getIndustryPreference() {
  if (storageAvailable('localStorage')) {
    return localStorage.getItem('industry');
  } else {
    // Fallback: Read from cookie
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

// Redirect logic
function redirectToIndustry(industry) {
  document.getElementById('loading').classList.remove('hidden');
  setTimeout(() => {
    window.location.assign(`./${industry}/index.html`);
  }, 500); // brief delay for UX
}

// Special function to check if we should show the menu (when cookie is cleared)
function shouldShowMenu() {
  // Check if there's a URL parameter indicating the user wants to change industry
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('showMenu') === 'true';
}

// On page load: implement the new behavior according to requirements
document.addEventListener('DOMContentLoaded', function() {
  const industry = getIndustryPreference();
  
  // Check if user explicitly wants to see the menu (cookie was cleared)
  if (shouldShowMenu()) {
    // Show the menu regardless of cookie state
    attachEventListeners();
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

// Function to attach event listeners (separated for reuse)
function attachEventListeners() {
  document.getElementById('select-healthcare').addEventListener('click', function() {
    setIndustryPreference('healthcare');
    redirectToIndustry('healthcare');
  });
  document.getElementById('select-utility').addEventListener('click', function() {
    setIndustryPreference('utility');
    redirectToIndustry('utility');
  });
}

// Enhanced clearIndustryPreference for "Change Industry" functionality
function clearIndustryPreferenceAndShowMenu() {
  clearIndustryPreference();
  // Redirect to index with a parameter to show the menu
  window.location.href = '../index.html?showMenu=true';
}

// Make functions available globally for onclick handlers
window.clearIndustryPreference = clearIndustryPreference;
window.clearIndustryPreferenceAndShowMenu = clearIndustryPreferenceAndShowMenu;