# Fix: Show Products to Non-Logged-In Users

## Problem
When non-logged-in users visited the shop page, they saw an error: "Missing or invalid authorization header" instead of seeing products.

## Root Cause
The `shop.html` was sending a fetch request with the `authHeaders()` function which was creating:
```javascript
fetch(url, { headers: authHeaders() })  // { headers: {} } when no token
```

This structure could cause the backend API to expect an Authorization header, which was missing for non-authenticated users.

## Solution
Updated `shop.html` to only include the headers object in the fetch request when a user is actually logged in:

### Before (shop.html):
```javascript
function authHeaders() {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: 'Bearer ' + token } : {};
}

async function loadProducts() {
  const response = await fetch(`${API_URL}/store/products`, { headers: authHeaders() });
  // ...
}
```

### After (shop.html):
```javascript
async function loadProducts() {
  const token = localStorage.getItem('auth_token');
  const fetchOptions = token ? { headers: { Authorization: 'Bearer ' + token } } : {};
  const response = await fetch(`${API_URL}/store/products`, fetchOptions);
  // ...
}
```

## Key Changes
- ✅ Only passes `headers` object when user is logged in (has token)
- ✅ Sends plain fetch request (no headers) when user is not logged in
- ✅ Removed the now-unused `authHeaders()` function
- ✅ Matches `product.html` approach which already handled this correctly

## Result
Non-logged-in users can now:
- Browse all products on the shop page
- View individual product details
- Add products to cart
- Proceed through checkout

Logged-in users continue to work as before with optional auth headers sent for their requests.

## Files Modified
- `shop.html` - Updated loadProducts() function to conditionally send auth headers
