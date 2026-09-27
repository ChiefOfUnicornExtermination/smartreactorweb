# Common Header/Footer Components

## Overview
I've created a reusable header and footer component system to reduce code duplication across pages. You now have two options:

### Option 1: Use Individual Headers (Current Setup)
Each HTML page has its own header/footer markup. This is already set up in all pages.
- **Pros:** Simple, each page is self-contained
- **Cons:** Need to update navigation in multiple places when making changes

### Option 2: Use Common Components (Available Now)
Use shared header/footer files that are injected dynamically via JavaScript.

## Files Available

### `/public/components/header.html`
Common header component with:
- SMART DEVICE logo
- Navigation links (Shop, My Devices, About, Contact)
- Language selector
- Account link
- Automatically highlights active page link

### `/public/components/footer.html`
Common footer with:
- Copyright notice
- Quick links to main pages

### `/public/scripts/components.js`
JavaScript that:
- Fetches and injects header/footer components
- Handles language translations on injected content
- Sets active navigation link based on current page

## How to Use Common Components

To use common components on any page, replace the hardcoded header/footer with placeholders:

### Example: Convert shop.html to use common components

**1. In the `<body>` tag, replace your hardcoded header with:**
```html
<body class="store-page">
  <div id="header-placeholder"></div>
  <!-- rest of page content -->
  <div id="footer-placeholder"></div>
```

**2. Add the components.js script before your other scripts:**
```html
<script src="/scripts/components.js"></script>
<script src="/scripts/i18n.js"></script>
```

That's it! The JavaScript will automatically:
- Load and inject the header and footer
- Set the active navigation link
- Apply translations to new elements

## Current Status

### Pages with Updated Navigation Links
All pages now correctly link to `/about.html` and `/contact.html`:
- ✅ shop.html
- ✅ product.html
- ✅ about.html (already created with correct links)
- ✅ contact.html (already created with correct links)
- ✅ index.html
- ✅ devices.html

### Pages Ready for Common Components
These pages have identical header structures and would benefit most from common components:
- shop.html
- product.html
- about.html
- contact.html
- cart.html
- checkout.html
- purchase-success.html

### Pages with Custom Headers
These should keep individual headers:
- index.html (centered layout, no navbar)
- devices.html (custom navbar with user email/logout)

## Recommendation

I suggest using common components for the store pages (shop, product, about, contact, cart, checkout, purchase-success) since they all share the same header design. This makes it much easier to update the navigation or styling in one place.

Devices and index pages can keep their individual headers since they have significantly different layouts.

Let me know if you'd like me to convert specific pages to use the common components!
