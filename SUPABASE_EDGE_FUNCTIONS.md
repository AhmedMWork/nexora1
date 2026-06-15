# NEXORA V4.1 — Supabase Edge Functions

Deploy active functions after setting secrets:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-supabase-functions.ps1
```

## Required Secrets

```txt
SUPABASE_SERVICE_ROLE_KEY
STUDIO_SESSION_SECRET
ALLOWED_ORIGIN
```

Optional PIN mode:

```txt
REQUIRE_STUDIO_PIN=true
STUDIO_ACCESS_PIN=your-pin
```

## Active Functions

- `verify-studio-access` — creates a Studio session token.
- `create-order` — creates COD orders from server-side product prices and stock.
- `validate-coupon` — validates coupon rules from the database.
- `studio-dashboard` — dashboard and analytics data.
- `studio-products` — product CRUD.
- `studio-orders` — order management.
- `studio-reviews` — reviews with images and half-star ratings.
- `studio-drops` — limited drop management.
- `studio-coupons` — coupon management.
- `studio-media-upload` — product/review media upload.
- `studio-media-delete` — media deletion.

All Studio operations are protected by the Studio session token header.
