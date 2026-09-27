// Load common header and footer components
async function loadCommonComponents() {
  try {
    // Load header
    const headerRes = await fetch('/components/header.html');
    if (headerRes.ok) {
      const headerHTML = await headerRes.text();
      const headerPlaceholder = document.getElementById('header-placeholder');
      if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHTML;
        // Re-apply i18n to newly added header elements
        if (window.__applyTranslations) {
          window.__applyTranslations();
        }
        // Set active link based on current page
        setActiveNavLink();
      }
    }

    // Load footer
    const footerRes = await fetch('/components/footer.html');
    if (footerRes.ok) {
      const footerHTML = await footerRes.text();
      const footerPlaceholder = document.getElementById('footer-placeholder');
      if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
      }
    }
  } catch (error) {
    console.error('Error loading common components:', error);
  }
}

// Set active navigation link based on current page
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.store-nav a');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (currentPath === '/' && href === '/shop.html') {
      link.classList.add('active');
    } else if (href !== '/' && currentPath.includes(href.replace('.html', ''))) {
      link.classList.add('active');
    }
  });
}

// Load components when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCommonComponents);
} else {
  loadCommonComponents();
}
