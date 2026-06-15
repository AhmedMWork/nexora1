# NEXORA V4.1 — Studio Admin Guide

## Access

Open one of:

```txt
/studio
/nexora-admin
```

V4.1 keeps the Studio link hidden from the storefront. If you enable PIN mode, configure it in Supabase Secrets.

## Products

The Product Manager is designed so most fields are selected from lists:

- Gender: Men, Women, Unisex, Custom.
- Type: T-Shirts, Hoodies, Sweatshirts, Pants, Shorts, Jackets, Accessories, Custom.
- Fit: Regular, Oversized, Relaxed, Slim, Custom.
- Status: Draft, Active, Hidden, Sold Out.

Use color chips instead of writing colors manually. Use custom color only when needed.

Add multiple images for every product. Set the first/main image and reorder images as needed.

## Reviews

Reviews are admin-only. Customers cannot submit public reviews directly.

V4.1 supports:

- Half-star ratings from 0.5 to 5.
- Optional review images.
- Featured reviews for homepage.
- Published/hidden states.

## Analytics

Analytics replaces the previous Audit Logs page in the main navigation.

It shows:

- Visitors/sessions estimate.
- Product views.
- Add to cart.
- Remove from cart.
- Cart abandonment.
- Checkout starts.
- Orders.
- Revenue estimate.

This requires `analytics_events` table from `SUPABASE_V4_1_SCHEMA.sql`.

## Coupons vs Limited Drops

Coupons are discount codes used during checkout.

Limited Drops are time-limited product releases and are not coupons.

Promotions are hidden from the main admin navigation in V4.1 to avoid confusion. They can return later as Campaigns.
