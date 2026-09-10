# Store API specification

This document describes the expected backend contract used by the storefront pages in this project.

## Required data model

### products
- id: string or integer, primary key
- name: string
- description: string
- price: decimal(10,2)
- image_url: string
- is_new: boolean
- featured_order: integer
- stock_quantity: integer
- created_at: timestamp

### orders
- id: string or integer, primary key
- user_id: string or integer, nullable
- customer_email: string
- customer_name: string
- shipping_address: json/text
- order_total: decimal(10,2)
- status: string (`pending`, `paid`, `shipped`, `cancelled`)
- created_at: timestamp

### order_items
- id: string or integer, primary key
- order_id: foreign key to orders.id
- product_id: foreign key to products.id
- quantity: integer
- unit_price: decimal(10,2)

## Endpoints

### GET /store/products
Returns a list of products for the storefront.

Response 200:
```json
{
  "products": [
    {
      "id": "prod_001",
      "name": "Sandstone Candle",
      "description": "A warm, grounding scent to bring calm to your space.",
      "price": 32.00,
      "image_url": "/images/websiteimage.png",
      "is_new": true,
      "featured_order": 1,
      "stock_quantity": 12
    }
  ]
}
```

Errors:
- 500: internal server error

### GET /store/products/:id
Returns one product detail record.

Response 200:
```json
{
  "product": {
    "id": "prod_001",
    "name": "Sandstone Candle",
    "description": "A warm, grounding scent to bring calm to your space.",
    "price": 32.00,
    "image_url": "/images/websiteimage.png",
    "stock_quantity": 12
  }
}
```

Errors:
- 404: product not found
- 500: internal server error

### POST /store/orders
Creates a new order from the checkout form.

Request body:
```json
{
  "customer": {
    "email": "user@example.com",
    "name": "Jane Doe"
  },
  "shipping_address": {
    "address": "1 Main Street",
    "city": "Tokyo",
    "postal_code": "100-0001",
    "country": "Japan"
  },
  "payment": {
    "card_number": "4242424242424242",
    "expiry": "12 / 29",
    "cvc": "123"
  },
  "items": [
    { "product_id": "prod_001", "quantity": 1 }
  ]
}
```

Response 200 or 201:
```json
{
  "order_id": "ord_12345",
  "status": "pending"
}
```

Errors:
- 400: invalid payload / invalid cart
- 401: unauthenticated if protected endpoint
- 409: insufficient stock
- 500: internal server error

## Notes
- The storefront cart is handled in browser `localStorage`; no `/cart` backend endpoint is required.
- Payment details should be processed by a secure payment provider or gateway; this page only sends the data to the checkout API.
- The frontend expects `product.price` to be numeric and `stock_quantity` to be available on detail and list responses.
