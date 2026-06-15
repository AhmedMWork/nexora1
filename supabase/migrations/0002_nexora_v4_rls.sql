-- ============================================================
-- NEXORA V4_Fix — Row Level Security
-- Public reads only. Writes are performed via Edge Functions using
-- the service role key after Studio token verification.
-- ============================================================

alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.drops enable row level security;
alter table public.reviews enable row level security;
alter table public.site_settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.coupons enable row level security;
alter table public.promotions enable row level security;
alter table public.inventory_logs enable row level security;
alter table public.audit_logs enable row level security;
alter table public.newsletter enable row level security;
alter table public.contact_messages enable row level security;
alter table public.analytics_events enable row level security;

-- Drop older policies before recreating them safely.
drop policy if exists "Public can read active products" on public.products;
drop policy if exists "Public can read product images" on public.product_images;
drop policy if exists "Public can read live drops" on public.drops;
drop policy if exists "Public can read published reviews" on public.reviews;
drop policy if exists "Public can read settings" on public.site_settings;
drop policy if exists "Public can subscribe newsletter" on public.newsletter;
drop policy if exists "Public can create contact messages" on public.contact_messages;
drop policy if exists "Public can insert analytics events" on public.analytics_events;

create policy "Public can read active products" on public.products for select using (status in ('active','sold_out'));
create policy "Public can read product images" on public.product_images for select using (true);
create policy "Public can read live drops" on public.drops for select using (status = 'live');
create policy "Public can read published reviews" on public.reviews for select using (status = 'published');
create policy "Public can read settings" on public.site_settings for select using (id = 'main');
create policy "Public can subscribe newsletter" on public.newsletter for insert with check (true);
create policy "Public can create contact messages" on public.contact_messages for insert with check (true);
create policy "Public can insert analytics events" on public.analytics_events for insert with check (true);

-- No direct public policies for admin writes, order reads, coupons reads, inventory, or audit logs.
-- Edge Functions use SUPABASE_SERVICE_ROLE_KEY and Studio token verification.

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do update set public = true;

-- Remove old permissive browser upload policies if they exist.
drop policy if exists "Studio can upload product images" on storage.objects;
drop policy if exists "Studio can update product images" on storage.objects;
drop policy if exists "Studio can delete product images" on storage.objects;
drop policy if exists "Public can read product image objects" on storage.objects;

-- Product images are publicly readable. Upload/delete happens through Edge Functions.
create policy "Public can read product image objects" on storage.objects for select using (bucket_id = 'products');
