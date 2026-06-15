# NEXORA V4.1 — Supabase Functions Deploy

Run from the project root:

```powershell
cd "D:\nexora\NEXORA_V4_1\NEXORA_V4"
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-supabase-functions.ps1
```

The script deploys:

- verify-studio-access
- create-order
- validate-coupon
- studio-dashboard
- studio-products
- studio-orders
- studio-reviews
- studio-drops
- studio-coupons
- studio-settings
- studio-media-upload
- studio-media-delete

Required Supabase Secrets:

```txt
SUPABASE_SERVICE_ROLE_KEY
STUDIO_SESSION_SECRET
ALLOWED_ORIGIN
```

Optional if PIN mode is enabled:

```txt
REQUIRE_STUDIO_PIN=true
STUDIO_ACCESS_PIN=your-pin
```
