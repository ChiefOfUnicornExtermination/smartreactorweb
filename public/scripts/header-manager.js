// Unified header management - initialize on every page load
function initializeHeader() {
  const isLoggedIn = !!localStorage.getItem('auth_token');
  
  // Show/hide login button
  const loginBtn = document.getElementById('toggle-auth-tab');
  if (loginBtn) {
    loginBtn.style.display = isLoggedIn ? 'none' : 'inline-block';
  }
  
  // Show/hide logout button and welcome
  const logoutBtn = document.getElementById('logout-btn');
  const userWelcome = document.getElementById('user-welcome');
  if (logoutBtn) {
    logoutBtn.style.display = isLoggedIn ? 'inline-block' : 'none';
  }
  if (userWelcome) {
    userWelcome.style.display = isLoggedIn ? 'inline' : 'none';
  }
  
  // Show/hide devices link
  const devicesLink = document.getElementById('devices-nav-link');
  if (devicesLink) {
    devicesLink.style.display = isLoggedIn ? 'block' : 'none';
  }
  
  // Show/hide cart link - update cart count as well
  const cartLink = document.getElementById('cart-nav-link');
  if (cartLink) {
    cartLink.style.display = isLoggedIn ? 'inline-flex' : 'none';
    updateCartCount();
  }
  
  // Logout functionality
  if (logoutBtn) {
    logoutBtn.onclick = function() {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      window.location.href = '/index.html';
    };
  }
  
  // Login button redirects to login page
  if (loginBtn) {
    loginBtn.onclick = function() {
      window.location.href = '/index.html';
    };
  }
}

// Update cart count in header
function updateCartCount() {
  const cartCountEls = document.querySelectorAll('#cart-count');
  if (cartCountEls.length > 0) {
    const cart = JSON.parse(localStorage.getItem('shopping_cart') || '[]');
    const count = cart.reduce((total, item) => total + (item.quantity || 0), 0);
    cartCountEls.forEach(el => {
      el.textContent = count;
    });
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeHeader);
} else {
  initializeHeader();
}

// Re-initialize when i18n changes language and update cart
window.__i18nOnLanguageChange_header = function() {
  initializeHeader();
};

