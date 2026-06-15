-- ============================================================
-- NEXORA V4.9 Fix — RLS Patch
-- Keeps public storefront reads safe and all writes behind Edge Functions.
-- ============================================================

alter table if exists products enable row level security;
alter table if exists product_images enable row level security;
alter table if exists reviews enable row level security;
alter table if exists drops enable row level security;
alter table if exists coupons enable row level security;
alter table if exists orders enable row level security;
alter table if exists order_items enable row level security;
alter table if exists analytics_events enable row level security;

-- Public product reads only for active products.
drop policy if exists "Public read active products" on products;
create policy "Public read active products" on products
for select to anon, authenticated
using (status = 'active');

-- Public reviews only published.
drop policy if exists "Public read published reviews" on reviews;
create policy "Public read published reviews" on reviews
for select to anon, authenticated
using (status = 'published');

-- Public live drops only.
drop policy if exists "Public read live drops" on drops;
create policy "Public read live drops" on drops
for select to anon, authenticated
using (status = 'live');

-- Analytics inserts are allowed from browser; analytics reads stay Studio/function only.
drop policy if exists "Public insert analytics events" on analytics_events;
create policy "Public insert analytics events" on analytics_events
for insert to anon, authenticated
with check (true);

-- Orders/order_items/products writes are handled by Edge Functions using the server secret.
