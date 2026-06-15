-- ============================================================
-- NEXORA V4.9 FINAL RLS POLICIES PATCH
-- Public storefront reads, Studio writes via Edge Functions only.
-- Safe to re-run where policies do not already exist; duplicate errors can be ignored.
-- ============================================================

alter table if exists analytics_events enable row level security;
alter table if exists products enable row level security;
alter table if exists reviews enable row level security;
alter table if exists drops enable row level security;
alter table if exists orders enable row level security;
alter table if exists order_items enable row level security;
alter table if exists coupons enable row level security;
alter table if exists seo_pages enable row level security;

-- Analytics: allow anonymous inserts only; Studio/service-role reads through functions.
drop policy if exists "Public analytics insert" on analytics_events;
create policy "Public analytics insert" on analytics_events
for insert to anon, authenticated
with check (event_name is not null);

-- Products: public can read visible products only.
drop policy if exists "Public read active products" on products;
create policy "Public read active products" on products
for select to anon, authenticated
using (status in ('active', 'sold_out'));

-- Reviews: public reads published only.
drop policy if exists "Public read published reviews" on reviews;
create policy "Public read published reviews" on reviews
for select to anon, authenticated
using (status = 'published');

-- Drops: public reads live/scheduled non-archived only.
drop policy if exists "Public read visible drops" on drops;
create policy "Public read visible drops" on drops
for select to anon, authenticated
using (status in ('live', 'scheduled'));

-- Coupons: public can read active coupon metadata for validation UX; final validation is through Edge Function.
drop policy if exists "Public read active coupons" on coupons;
create policy "Public read active coupons" on coupons
for select to anon, authenticated
using (status = 'active');

-- SEO pages: public can read indexable page metadata.
drop policy if exists "Public read seo pages" on seo_pages;
create policy "Public read seo pages" on seo_pages
for select to anon, authenticated
using (noindex = false);

-- Orders/order_items remain no-public-read. create-order Edge Function uses service role.
