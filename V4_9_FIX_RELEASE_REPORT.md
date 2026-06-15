# NEXORA V4.9 Fix — Production Polish & Stability

## Main fixes
- Hardened SPA routing with Vercel rewrite and `_redirects` fallback.
- Added safer runtime fallback to prevent unrecoverable blank screens.
- Product page now requires color + size selection before adding to cart.
- Cart, checkout, orders, and analytics now carry selected color details.
- Product gallery layout improved: thumbnails beside main image on desktop, stacked on mobile.
- Studio product form supports palette colors, custom HEX colors, and optional CSS pattern/gradient.
- Product reviews can be linked to specific products from Studio Reviews and from Product action links.
- SEO and System Health remain available by direct route but are hidden from the daily admin sidebar.
- Analytics now shows color selections, size selections, coupon attempts, funnel and drop-off metrics.
- Limited Drops admin rebuilt with clear explanations, status guide, and helper text.
- TikTok footer icon replaced with a real TikTok-like SVG instead of a music icon.
- Studio admin palette changed from brown to a darker, more professional dashboard palette.

## Validation
- `npm run lint` passed.
- `npm run build` passed.

## Supabase
Run:
1. `SUPABASE_V4_9_FIX_SCHEMA.sql`
2. `SUPABASE_V4_9_FIX_RLS.sql`
3. Optional: `SUPABASE_V4_9_FIX_SEED.sql`
4. Deploy Edge Functions using `scripts/deploy-supabase-functions.ps1`.
