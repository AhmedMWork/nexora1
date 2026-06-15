# NEXORA V4.1 — Global Launch Polish Release Report

## Release Goal

V4.1 upgrades NEXORA from a fast Supabase/Fix build into a more complete launch-ready commerce experience with improved storefront content, safer page behavior, richer admin tools, analytics, multi-image products, and SEO preparation.

## Major Storefront Changes

- Rebuilt Home trust section so content stays inside proper visual cards.
- Removed newsletter subscription section completely.
- Removed hardcoded/fake customer reviews.
- Homepage now shows reviews only when published and featured reviews exist.
- Logo entry gate now includes a subtle animated orbit ring and localized tap message.
- Footer now uses Instagram, Facebook, TikTok, and WhatsApp only.
- Removed Twitter/X from footer.
- Removed Size Guide from navigation and content routing.
- FAQ and Shipping & Returns pages rewritten with real customer-friendly content.
- Shipping policy updated to 3–7 business days.
- Returns policy updated to 14 days, original condition, return shipping paid by customer unless NEXORA is responsible.
- Added ErrorBoundary to prevent white blank pages.
- Added loading/empty/error-state improvements in key pages.
- Product page now supports multiple product images and thumbnails.

## Language Improvements

- Expanded Arabic and English dictionaries.
- Improved customer-facing Arabic copy.
- Reduced hardcoded English on Arabic experience.
- Added localized splash prompt and homepage text.

## Admin Studio Improvements

- Removed Promotions from main navigation.
- Removed Settings from main navigation.
- Replaced Audit Logs entry with Analytics.
- Added Analytics dashboard for events/orders funnel.
- Product form rebuilt with clearer sections, helper text, dropdowns, color chips, size stock inputs, and multi-image management.
- Reviews manager now supports half-star ratings and review images.
- Improved admin contrast and form readability.

## Supabase Changes

- Added `analytics_events` table.
- Updated review rating to support 0.5 increments.
- Added review image support via JSON field.
- Added public insert policy for analytics events.
- Added Edge Function analytics action in `studio-dashboard`.

## SEO / Google Readiness

- Added Google Search setup guide.
- Added SEO checklist.
- Updated `robots.txt`.
- Updated `sitemap.xml`.
- Added manifest and browser config.
- Added placeholder Google verification file.
- Added structured metadata improvements.

## Verified

- `npm run lint` passes.
- `npm run build` passes.

## Required After Deployment

Apply:

```txt
SUPABASE_V4_1_SCHEMA.sql
SUPABASE_V4_1_RLS.sql
```

Deploy Supabase functions:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-supabase-functions.ps1
```

Redeploy Vercel after environment changes.
