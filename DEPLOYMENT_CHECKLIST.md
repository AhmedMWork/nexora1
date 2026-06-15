# NEXORA V4.1 — Deployment Checklist

## Before Deploy

- [ ] `.env` is created locally.
- [ ] Vercel environment variables are set.
- [ ] Supabase schema is applied.
- [ ] V4.1 migration SQL is applied if upgrading from V4/V4_Fix.
- [ ] Supabase Storage bucket `products` exists and is public.
- [ ] Supabase Edge Function secrets are set.
- [ ] Supabase Edge Functions are deployed.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.

## Vercel Variables

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_STORE_WHATSAPP
VITE_SUPPORT_EMAIL
```

Do not add service role key to Vercel frontend variables.

## Supabase Secrets

```txt
SUPABASE_SERVICE_ROLE_KEY
STUDIO_SESSION_SECRET
ALLOWED_ORIGIN
```

Optional:

```txt
REQUIRE_STUDIO_PIN
STUDIO_ACCESS_PIN
```

## After Deploy

- [ ] Homepage opens.
- [ ] No blank page on route changes.
- [ ] `/studio` opens.
- [ ] `/nexora-admin` opens.
- [ ] Product creation works.
- [ ] Product image upload works.
- [ ] Coupon creation works.
- [ ] Checkout creates an order.
- [ ] Analytics page receives events.
- [ ] Arabic/English switch works.
- [ ] `/sitemap.xml` opens.
- [ ] `/robots.txt` opens.

## Google

- [ ] Replace Google verification placeholder.
- [ ] Submit sitemap in Google Search Console.
- [ ] Inspect homepage URL.
- [ ] Inspect product URLs after adding real products.
