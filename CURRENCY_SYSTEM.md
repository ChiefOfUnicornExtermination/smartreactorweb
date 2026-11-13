# Currency System Documentation

## Overview

A multi-currency pricing system supporting USD and JPY with static pricing (not based on exchange rates). The system auto-detects user's preferred currency based on browser language and stores the preference in localStorage.

## How It Works

### 1. **Auto-Detection & Storage**
- On first visit, currency is detected from browser language:
  - `ja` → JPY (¥)
  - Everything else → USD ($)
- User preference is stored in `localStorage.preferred_currency`
- Persists across sessions and page reloads

### 2. **Static Pricing Model**
Instead of converting USD to JPY using exchange rates, we use a fixed multiplier:
- **USD Price**: Base price (e.g., $29.99)
- **JPY Price**: `USD × 100` → rounded (e.g., $29.99 × 100 = ¥2,999)
- JPY is intentionally ~10% cheaper than straight conversion to be competitive in Japanese market

### 3. **Payment Currency**
- When user selects JPY, payment is processed in JPY via Stripe
- When user selects USD, payment is processed in USD via Stripe
- Conversion happens server-side via the payment-intent endpoint

## UI Components

### Currency Selector
Located in header on all shop pages:
```html
<select id="currency-select" aria-label="Currency">
  <option value="USD">USD ($)</option>
  <option value="JPY">JPY (¥)</option>
</select>
```

### Price Display
Prices use the `data-price` attribute with USD base value:
```html
<strong data-price="29.99">$29.99</strong>
```
JavaScript automatically formats based on selected currency.

## API Reference

### `window.currency` Object

```javascript
// Get current currency
window.currency.getCurrent() // Returns: 'USD' or 'JPY'

// Set currency preference
window.currency.setCurrency('JPY') // Returns: boolean

// Format price (auto-detects current currency)
window.currency.formatPrice(29.99) // Returns: "$29.99" or "¥2,999"

// Format price with specific currency
window.currency.formatPrice(29.99, 'JPY') // Returns: "¥2,999"

// Get price value in selected currency
window.currency.getPriceInCurrency(29.99) // Returns: 29.99 or 2999

// Get currency symbol
window.currency.getCurrencySymbol() // Returns: '$' or '¥'

// Apply prices to all [data-price] elements
window.currency.applyPrices()

// Detect browser language
window.currency.detect() // Returns: 'USD' or 'JPY'
```

## Hooks

### Currency Change Hook
Listen for currency changes across the app:
```javascript
window.__currencyOnChange = function(currency) {
  console.log('Currency changed to:', currency);
  // Re-render prices, update totals, etc.
};
```

The following pages already implement this:
- `shop.html` → Re-renders product prices
- `product.html` → Re-loads and displays product price
- `cart.html` → Updates all cart item prices
- `checkout.html` → Updates order summary with new currency

## File Structure

```
/public/
├── scripts/
│   ├── currency.js           ← NEW: Currency management system
│   ├── i18n.js              ← Existing: Language system
│   └── header-manager.js    ← Existing: Header/auth logic
├── shop.html                ← Updated: Currency selector + pricing
├── product.html             ← Updated: Currency selector + pricing
├── cart.html                ← Updated: Currency selector + pricing
├── checkout.html            ← Updated: Currency selector + payment handling
└── components/
    └── header.html          ← Updated: Currency selector added
```

## Implementation Details

### Price Conversion
```javascript
const CONVERSION_FACTORS = {
  USD: 1.0,
  JPY: 100  // Fixed multiplier, not exchange rate
};

// USD $29.99 → JPY ¥2,999
const jpy = Math.round(29.99 * 100); // 2999
```

### Storage Keys
- `preferred_currency` → 'USD' or 'JPY'
- Existing keys still work: `ui_lang`, `auth_token`, etc.

### Script Loading Order
```html
<script src="/scripts/currency.js"></script>  <!-- First -->
<script src="/scripts/i18n.js"></script>       <!-- Second -->
<script src="/scripts/header-manager.js"></script> <!-- Third -->
```
This order ensures currency system loads before other scripts can use it.

## Payment Processing

### Checkout Flow
1. User selects currency (USD or JPY)
2. Click "Checkout" button
3. On form submit:
   - Get current currency: `window.currency.getCurrent()`
   - Convert amount: USD in cents OR JPY × 100
   - Create Stripe PaymentIntent with correct currency
   - Confirm payment with Stripe
   - Send order to backend with `currency` field

### Backend Integration
The backend's `/store/payment-intent` endpoint expects:
```json
{
  "amount": 2999,           // JPY: 2999, USD: 2999 (in cents)
  "currency": "jpy",        // "jpy" or "usd"
  "metadata": { "email": "..." }
}
```

## Testing Checklist

- [ ] Load shop.html, currency selector appears
- [ ] Browser language is "ja" → defaults to JPY
- [ ] Switch currency → prices update instantly
- [ ] Add to cart → prices maintain selected currency
- [ ] View cart → all prices in selected currency
- [ ] Go to checkout → summary shows correct currency
- [ ] Complete payment → correct amount charged in Stripe
- [ ] Refresh page → currency preference persists
- [ ] Visit another page → currency persists across navigation

## Browser Compatibility

- Modern browsers with Intl.NumberFormat support (Chrome, Firefox, Safari, Edge)
- localStorage must be enabled
- Gracefully falls back to USD if currency unavailable

## Future Enhancements

1. **Additional Currencies**: Add EUR, GBP, etc. by extending PRICES and CONVERSION_FACTORS
2. **Regional Pricing**: Add country-based pricing tiers
3. **Rate Updates**: For other currencies, fetch live rates from API
4. **Analytics**: Track currency selection patterns
5. **Tax Display**: Show estimated taxes per currency/country
