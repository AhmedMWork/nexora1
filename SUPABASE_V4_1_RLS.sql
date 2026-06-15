-- ============================================================
-- NEXORA V4.1 — RLS Policy Refresh
-- Public can read storefront data and insert analytics/contact only.
-- All admin writes remain through Edge Functions with service role.
-- ============================================================

alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.drops enable row level security;
alter table public.reviews enable row level security;
alter table public.site_settings enable row level security;
alter table public.analytics_events enable row level security;

drop policy if exists "Public can read active products" on public.products;
drop policy if exists "Public can read product images" on public.product_images;
drop policy if exists "Public can read live drops" on public.drops;
drop policy if exists "Public can read published reviews" on public.reviews;
drop policy if exists "Public can read settings" on public.site_settings;
drop policy if exists "Public can insert analytics events" on public.analytics_events;

create policy "Public can read active products" on public.products for select using (status in ('active','sold_out'));
create policy "Public can read product images" on public.product_images for select using (true);
create policy "Public can read live drops" on public.drops for select using (status = 'live');
create policy "Public can read published reviews" on public.reviews for select using (status = 'published');
create policy "Public can read settings" on public.site_settings for select using (id = 'main');
create policy "Public can insert analytics events" on public.analytics_events for insert with check (true);
