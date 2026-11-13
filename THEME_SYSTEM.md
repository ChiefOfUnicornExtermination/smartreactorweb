# Theme System (Light/Dark Mode) Documentation

## Overview

A light/dark theme system similar to the currency system. Automatically detects the user's system preference and stores their manual override in localStorage. Themes are implemented using CSS variables that switch between `light.css` and `dark.css` files.

## How It Works

### 1. **Auto-Detection**
- Detects system theme preference using `prefers-color-scheme` media query
- Dark mode users → defaults to Dark theme
- Light mode users (or no preference) → defaults to Light theme
- Preference stored in `localStorage.preferred_theme`

### 2. **Theme Switching**
- Theme selector in header allows users to switch between Light (☀️) and Dark (🌙)
- User preference overrides system preference
- Dynamically loads appropriate CSS file without page reload
- Listens for system theme changes and auto-applies if no user preference set

### 3. **CSS Architecture**
```
/styles/style.css        ← Base styles (structure, layout, typography)
/styles/light.css        ← Light theme colors (loaded dynamically)
/styles/dark.css         ← Dark theme colors (loaded dynamically)
```

All color-related styles use CSS custom properties (`--variable-name`) defined in theme files.

## UI Components

### Theme Selector
Located in header (first selector for quick access):
```html
<select id="theme-select" aria-label="Theme">
  <option value="light">☀️ Light</option>
  <option value="dark">🌙 Dark</option>
</select>
```

## CSS Custom Properties

### Light Theme Variables
```css
:root {
  --bg-primary: #f7f6f2;        /* Main background */
  --bg-secondary: #ffffff;       /* Card/panel background */
  --text-primary: #17202a;       /* Main text */
  --text-secondary: #596164;     /* Secondary text */
  --text-muted: #8d7964;         /* Muted/metadata text */
  --border-color: #dfe1df;       /* Standard borders */
  --card-shadow: rgba(0,0,0,0.2);
  /* ... see light.css for full list */
}
```

### Dark Theme Variables
```css
:root {
  --bg-primary: #1a1a1a;        /* Main background */
  --bg-secondary: #2d2d2d;       /* Card/panel background */
  --text-primary: #e8e8e8;       /* Main text */
  --text-secondary: #b0b0b0;     /* Secondary text */
  /* ... see dark.css for full list */
}
```

## API Reference

### `window.theme` Object

```javascript
// Get current theme
window.theme.getCurrent() // Returns: 'light' or 'dark'

// Set theme preference
window.theme.setTheme('dark') // Returns: boolean

// Apply theme immediately
window.theme.apply('light')

// Toggle between light/dark
window.theme.toggle()

// Detect system preference
window.theme.detect() // Returns: 'light' or 'dark'

// Get available themes
window.theme.available // Returns: ['light', 'dark']
```

## Hooks

### Theme Change Hook
Listen for theme changes across the app:
```javascript
window.__themeOnChange = function(theme) {
  console.log('Theme changed to:', theme);
  // Re-render, update charts, etc.
};
```

The following pages already implement this:
- `shop.html` → Re-renders with new theme colors
- `product.html` → Updates product page
- `cart.html` → Updates cart display
- `checkout.html` → Updates checkout form

## File Structure

```
/public/
├── styles/
│   ├── style.css                ← Base styles (kept intact)
│   ├── light.css                ← NEW: Light theme CSS variables
│   └── dark.css                 ← NEW: Dark theme CSS variables
├── scripts/
│   ├── theme.js                 ← NEW: Theme management system
│   ├── currency.js              ← Existing: Currency system
│   ├── i18n.js                  ← Existing: Language system
│   └── header-manager.js        ← Existing: Header/auth logic
├── shop.html                    ← Updated: Theme selector added
├── product.html                 ← Updated: Theme selector added
├── cart.html                    ← Updated: Theme selector added
├── checkout.html                ← Updated: Theme selector added
└── components/
    └── header.html              ← Updated: Theme selector added
```

## Implementation Details

### Script Loading Order
```html
<script src="/scripts/theme.js"></script>     <!-- First: Load theme system -->
<script src="/scripts/currency.js"></script>  <!-- Second: Load currency -->
<script src="/scripts/i18n.js"></script>      <!-- Third: Load i18n -->
<script src="/scripts/header-manager.js"></script> <!-- Last: Load header logic -->
```

### Storage Keys
- `preferred_theme` → 'light' or 'dark'

### System Theme Detection
Uses the standard `prefers-color-scheme` media query:
```javascript
window.matchMedia('(prefers-color-scheme: dark)').matches
```

## Color Palette

### Light Theme
| Element | Color | Use |
|---------|-------|-----|
| Primary Background | `#f7f6f2` | Page background |
| Secondary Background | `#ffffff` | Cards, containers |
| Primary Text | `#17202a` | Main content |
| Secondary Text | `#596164` | Description text |
| Border Color | `#dfe1df` | Dividers, borders |
| Accent | `#667eea` | Buttons, links |

### Dark Theme
| Element | Color | Use |
|---------|-------|-----|
| Primary Background | `#1a1a1a` | Page background |
| Secondary Background | `#2d2d2d` | Cards, containers |
| Primary Text | `#e8e8e8` | Main content |
| Secondary Text | `#b0b0b0` | Description text |
| Border Color | `#404040` | Dividers, borders |
| Accent | `#667eea` | Buttons, links (same) |

## Adding New Color Variables

To add a new color variable:

1. **Define in both theme files** (`light.css` and `dark.css`):
   ```css
   :root {
     --new-color: #yourcolor;
   }
   ```

2. **Use in style.css**:
   ```css
   .element {
     color: var(--new-color);
   }
   ```

3. **It automatically switches** when theme changes!

## Testing Checklist

- [ ] Load shop.html, theme selector appears (first selector in actions)
- [ ] System is in Dark mode → defaults to Dark theme
- [ ] Switch to Light theme → page colors update instantly
- [ ] Switch to Dark theme → page colors update instantly
- [ ] Refresh page → theme preference persists
- [ ] Visit another page → theme persists across navigation
- [ ] Add product to cart → colors maintain in dark/light mode
- [ ] Proceed to checkout → form colors match theme
- [ ] Change system theme preference → auto-applies if no user preference

## Browser Compatibility

- Chrome 76+, Firefox 67+, Safari 12.1+, Edge 79+ (prefers-color-scheme support)
- localStorage must be enabled
- Falls back to system detection if localStorage unavailable
- Gracefully degrades to light theme in older browsers

## Performance Notes

- Theme CSS files are small (~4.5 KB each)
- Only one theme file loaded at a time (not both)
- CSS variable switching is instant (no page reload)
- No JavaScript re-rendering needed for color changes

## Future Enhancements

1. **Custom Themes**: Let users create custom color schemes
2. **Time-based Switching**: Auto-switch to dark at sunset
3. **Per-page Themes**: Different themes for different sections
4. **High Contrast Mode**: Accessibility enhancement
5. **Theme Preview**: Show both before switching
6. **Sync with Settings**: Store theme in user account preferences

## Known Limitations

- Stripe payment form colors don't fully inherit (some CSS restrictions by Stripe)
- Background images styled in HTML (need inline style adjustment for theme)
- System detection only works on browsers supporting `prefers-color-scheme`

## Migration from Light-Only Design

This implementation is backward compatible:
- **No changes needed** to existing styles in `style.css`
- Color hardcodes replaced with CSS variables automatically
- Default light theme matches original design exactly
- Users opt-in to dark mode via selector
