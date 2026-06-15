# NEXORA V4.9 — Global Luxury Commerce Final

NEXORA V4.9 is the final launch package for the Supabase-powered luxury fashion commerce platform.

## Included
- React + Vite + TypeScript storefront.
- Supabase Database / Storage / Edge Functions.
- Hidden Studio admin at `/nexora-admin`.
- Products, orders, customers, coupons, limited drops, reviews, inventory, analytics, SEO, and system health.
- Arabic/English storefront experience.
- COD-only checkout.
- Google Search files and deployment docs.

## Quick start

```powershell
npm config set registry https://registry.npmjs.org/
npm install
npm run build
npm run dev
```

## Required environment variables

```env
VITE_SUPABASE_URL=https://ccmuazjkgzjqzybxwrfd.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_STORE_WHATSAPP=01037141322
VITE_SUPPORT_EMAIL=supportnexorastoree@gmail.com
```

## Server-only Supabase secrets
Do not put these in Vercel frontend variables:

```txt
SUPABASE_SERVICE_ROLE_KEY
STUDIO_SESSION_SECRET
REQUIRE_STUDIO_PIN
STUDIO_ACCESS_PIN
```

## Deployment
Read `V4_9_DEPLOYMENT_STEPS.md` first.
