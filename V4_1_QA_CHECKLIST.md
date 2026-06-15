# NEXORA V4.1 — QA Checklist

## Storefront

- [ ] Homepage opens without blank screen.
- [ ] Logo gate appears and orbit animation works.
- [ ] Logo gate does not appear on admin routes.
- [ ] Newsletter is removed.
- [ ] Trust cards are aligned on desktop and mobile.
- [ ] Reviews show only if there are published/featured reviews.
- [ ] Footer shows Instagram, Facebook, TikTok, WhatsApp.
- [ ] Footer does not show Twitter/X.
- [ ] Size Guide link is removed.
- [ ] FAQ page shows real Q&A.
- [ ] Shipping & Returns shows 3–7 days and 14-day return policy.
- [ ] Arabic mode does not show unexpected English text.
- [ ] English mode reads naturally.
- [ ] Product gallery thumbnails work.
- [ ] Cart add/remove works and does not crash.
- [ ] Checkout works with COD only.
- [ ] Coupon valid/invalid states work.
- [ ] Order success page opens.

## Admin Studio

- [ ] `/studio` opens.
- [ ] `/nexora-admin` opens.
- [ ] Products page loads.
- [ ] Add product with dropdown gender/category.
- [ ] Add color chips.
- [ ] Add custom color.
- [ ] Add stock by size.
- [ ] Upload multiple images.
- [ ] Set primary product image.
- [ ] Save and publish product.
- [ ] Edit product without losing images.
- [ ] Coupons page can add/edit/archive coupons.
- [ ] Limited Drops page works.
- [ ] Reviews page supports image and half-star rating.
- [ ] Analytics page loads after applying V4.1 SQL.
- [ ] No technical/internal text appears to customers.

## Supabase

- [ ] Apply `SUPABASE_V4_1_SCHEMA.sql`.
- [ ] Apply `SUPABASE_V4_1_RLS.sql`.
- [ ] Deploy all Edge Functions.
- [ ] Confirm `analytics_events` receives events.
- [ ] Confirm orders are created server-side.
- [ ] Confirm product image uploads use bucket `products`.

## Vercel

- [ ] Environment variables exist.
- [ ] `vercel.json` exists.
- [ ] Direct route refresh works.
- [ ] `/sitemap.xml` opens.
- [ ] `/robots.txt` opens.
