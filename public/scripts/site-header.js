// Injects the shared header synchronously at the script's position so that
// theme/currency/i18n/header-manager (loaded afterwards) find its elements.
(function () {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/components/header.html', false);
    xhr.send();
    if (xhr.status !== 200) throw new Error('HTTP ' + xhr.status);
    document.write(xhr.responseText);
  } catch (e) {
    console.error('Failed to load header:', e);
    return;
  }

  function markActive() {
    const path = window.location.pathname;
    document.querySelectorAll('.store-nav a').forEach(function (link) {
      const href = link.getAttribute('href');
      const isHome = path === '/' || path === '/index.html' || path === '/product.html';
      const active = path === href || (isHome && href === '/shop.html' && path !== '/index.html');
      link.classList.toggle('active', active);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markActive);
  } else {
    markActive();
  }
})();
