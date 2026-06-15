# NEXORA V4.9 Fix — Supabase Data Upload Guide

## Safe order
1. Open Supabase Dashboard → SQL Editor.
2. Run `SUPABASE_V4_9_FIX_SCHEMA.sql`.
3. Run `SUPABASE_V4_9_FIX_RLS.sql`.
4. Run `SUPABASE_V4_9_FIX_SEED.sql` only if you want optional starter settings/coupon.
5. Deploy functions:

```powershell
cd "D:\nexora\NEXORA_V4_9_FIX"
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-supabase-functions.ps1
```

## Required Edge Function secrets
- `SUPABASE_SERVICE_ROLE_KEY`
- `STUDIO_SESSION_SECRET`
- Optional: `REQUIRE_STUDIO_PIN=true`
- Optional: `STUDIO_ACCESS_PIN=your-pin`

## Vercel environment variables
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_STORE_WHATSAPP=01037141322`
- `VITE_SUPPORT_EMAIL=supportnexorastoree@gmail.com`

Do not add service role key to Vercel frontend variables.
