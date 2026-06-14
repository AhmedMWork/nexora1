-- ============================================================
-- NEXORA V4 — Row Level Security
-- Public reads only. Writes are performed via Edge Functions using
-- service role after Studio token verification.
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

create policy "Public can read active products" on public.products for select using (status in ('active','sold_out'));
create policy "Public can read product images" on public.product_images for select using (true);
create policy "Public can read live drops" on public.drops for select using (status = 'live');
create policy "Public can read published reviews" on public.reviews for select using (status = 'published');
create policy "Public can read settings" on public.site_settings for select using (id = 'main');
create policy "Public can subscribe newsletter" on public.newsletter for insert with check (true);
create policy "Public can create contact messages" on public.contact_messages for insert with check (true);

-- No direct public policies for admin writes, orders reads, coupons reads, inventory, or audit logs.
-- Edge Functions use the service role key and verify the Studio token.

-- Storage bucket setup. Product images are public for storefront performance.
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do update set public = true;

-- Public can read product images.
create policy "Public can read product image objects" on storage.objects for select using (bucket_id = 'products');

-- Studio uploads currently use the browser Supabase client after the hidden Studio PIN gate.
-- For stricter production, replace these INSERT/UPDATE/DELETE policies with an Edge Function service-role upload.
create policy "Studio can upload product images" on storage.objects for insert with check (bucket_id = 'products');
create policy "Studio can update product images" on storage.objects for update using (bucket_id = 'products') with check (bucket_id = 'products');
create policy "Studio can delete product images" on storage.objects for delete using (bucket_id = 'products');
