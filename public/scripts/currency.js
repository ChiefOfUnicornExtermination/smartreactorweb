// Currency management system - handles USD/JPY pricing
(function() {
  // Currency exchange configuration
  const PRICES = {
    USD: {
      symbol: '$',
      locale: 'en-US',
      code: 'USD',
      minorUnit: 2
    },
    JPY: {
      symbol: '¥',
      locale: 'ja-JP',
      code: 'JPY',
      minorUnit: 0
    }
  };

  // Price conversion matrix: multiply base USD price by factor to get JPY price
  // USD $29.99 → JPY ¥2,980 (intentionally cheaper than straight conversion)
  const CONVERSION_FACTORS = {
    USD: 1.0,
    JPY: 100  // Approximate: $29.99 * 100 ≈ ¥2,999, but we use static ¥2,980 per product
  };

  function detectBrowserCurrency() {
    const lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    if (lang.startsWith('ja')) return 'JPY';
    return 'USD';
  }

  function getCurrentCurrency() {
    const saved = localStorage.getItem('preferred_currency');
    if (saved && PRICES[saved]) return saved;
    return detectBrowserCurrency();
  }

  function setCurrency(currency) {
    if (PRICES[currency]) {
      localStorage.setItem('preferred_currency', currency);
      return true;
    }
    return false;
  }

  function formatPrice(priceInUsd, currency = getCurrentCurrency()) {
    if (!PRICES[currency]) currency = 'USD';

    const currencyConfig = PRICES[currency];
    let amount = priceInUsd;

    if (currency === 'JPY') {
      // For JPY: multiply by conversion factor and round
      amount = Math.round(priceInUsd * CONVERSION_FACTORS.JPY);
    }

    // Format with proper locale
    const formatter = new Intl.NumberFormat(currencyConfig.locale, {
      style: 'currency',
      currency: currencyConfig.code,
      minimumFractionDigits: currencyConfig.minorUnit,
      maximumFractionDigits: currencyConfig.minorUnit
    });

    return formatter.format(amount);
  }

  function getPriceInCurrency(priceInUsd, currency = getCurrentCurrency()) {
    if (!PRICES[currency]) currency = 'USD';
    if (currency === 'JPY') {
      return Math.round(priceInUsd * CONVERSION_FACTORS.JPY);
    }
    return priceInUsd;
  }

  function getCurrencySymbol(currency = getCurrentCurrency()) {
    return (PRICES[currency] || PRICES.USD).symbol;
  }

  function initCurrency() {
    const select = document.getElementById('currency-select');
    const currency = getCurrentCurrency();

    if (select) {
      select.value = currency;
      select.addEventListener('change', function() {
        if (setCurrency(this.value)) {
          applyPrices(this.value);
          if (window.__currencyOnChange) {
            window.__currencyOnChange(this.value);
          }
        }
      });
    }

    if (window.__currencyOnChange) {
      window.__currencyOnChange(currency);
    }
  }

  function applyPrices(currency = getCurrentCurrency()) {
    // Update all price elements with data-price attribute
    const priceElements = document.querySelectorAll('[data-price]');
    priceElements.forEach(el => {
      const priceInUsd = parseFloat(el.dataset.price);
      if (!isNaN(priceInUsd)) {
        el.textContent = formatPrice(priceInUsd, currency);
      }
    });
  }

  // Expose API
  window.currency = {
    getCurrent: getCurrentCurrency,
    setCurrency: setCurrency,
    formatPrice: formatPrice,
    getPriceInCurrency: getPriceInCurrency,
    getCurrencySymbol: getCurrencySymbol,
    applyPrices: applyPrices,
    init: initCurrency,
    detect: detectBrowserCurrency
  };

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCurrency);
  } else {
    initCurrency();
  }
})();
