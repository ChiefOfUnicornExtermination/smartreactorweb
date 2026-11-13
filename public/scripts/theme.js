// Theme management system - handles Light/Dark mode
(function() {
  const THEMES = {
    light: {
      name: 'Light',
      cssFile: '/styles/light.css',
      icon: '☀️'
    },
    dark: {
      name: 'Dark',
      cssFile: '/styles/dark.css',
      icon: '🌙'
    }
  };

  function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function getCurrentTheme() {
    const saved = localStorage.getItem('preferred_theme');
    if (saved && THEMES[saved]) return saved;
    return detectSystemTheme();
  }

  function setTheme(theme) {
    if (!THEMES[theme]) return false;

    localStorage.setItem('preferred_theme', theme);
    applyTheme(theme);
    
    if (window.__themeOnChange) {
      window.__themeOnChange(theme);
    }

    return true;
  }

  function applyTheme(theme = getCurrentTheme()) {
    if (!THEMES[theme]) theme = 'light';

    // Remove existing theme stylesheet
    const existingThemeLink = document.getElementById('theme-stylesheet');
    if (existingThemeLink) {
      existingThemeLink.remove();
    }

    // Create and inject new theme stylesheet
    const link = document.createElement('link');
    link.id = 'theme-stylesheet';
    link.rel = 'stylesheet';
    link.href = THEMES[theme].cssFile;
    document.head.appendChild(link);

    // Update HTML attribute for semantic purposes
    document.documentElement.setAttribute('data-theme', theme);
  }

  function initTheme() {
    const select = document.getElementById('theme-select');
    const theme = getCurrentTheme();

    if (select) {
      select.value = theme;
      select.addEventListener('change', function() {
        setTheme(this.value);
      });
    }

    // Apply theme immediately
    applyTheme(theme);

    // Listen for system theme changes
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        const saved = localStorage.getItem('preferred_theme');
        if (!saved) {
          const newTheme = e.matches ? 'dark' : 'light';
          setTheme(newTheme);
        }
      });
    }

    if (window.__themeOnChange) {
      window.__themeOnChange(theme);
    }
  }

  function toggleTheme() {
    const current = getCurrentTheme();
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
  }

  // Expose API
  window.theme = {
    getCurrent: getCurrentTheme,
    setTheme: setTheme,
    apply: applyTheme,
    toggle: toggleTheme,
    init: initTheme,
    detect: detectSystemTheme,
    available: Object.keys(THEMES)
  };

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();
