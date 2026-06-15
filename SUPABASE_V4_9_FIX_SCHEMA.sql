-- ============================================================
-- NEXORA V4.9 Fix — Production Polish Supabase Patch
-- Safe to run after V4/V4.1/V4.9 schema. Does not drop data.
-- ============================================================

create extension if not exists pgcrypto;

-- Product color metadata can now be stored as JSON objects:
-- [{ id, name, nameEn, nameAr, hex, pattern, available }]
alter table if exists products add column if not exists colors jsonb default '[]'::jsonb;
alter table if exists products add column if not exists images jsonb default '[]'::jsonb;
alter table if exists products add column if not exists stock_by_size jsonb default '{}'::jsonb;
alter table if exists products add column if not exists sizes jsonb default '[]'::jsonb;
alter table if exists products add column if not exists tags jsonb default '[]'::jsonb;
alter table if exists products add column if not exists visibility text default 'public';
alter table if exists products add column if not exists rating numeric default 0;
alter table if exists products add column if not exists review_count integer default 0;

-- Orders now preserve selected color details.
alter table if exists order_items add column if not exists color text;
alter table if exists order_items add column if not exists color_hex text;
alter table if exists order_items add column if not exists color_pattern text;

-- Reviews are controlled from Studio and can be attached to products.
alter table if exists reviews add column if not exists title text;
alter table if exists reviews add column if not exists images jsonb default '[]'::jsonb;
alter table if exists reviews add column if not exists avatar_url text;
alter table if exists reviews add column if not exists review_image_url text;
alter table if exists reviews add column if not exists source text default 'studio';
alter table if exists reviews add column if not exists sort_order integer default 0;

-- Half-star rating support. Safely replaces older integer-only expectations.
do $$
begin
  if exists (select 1 from information_schema.columns where table_name='reviews' and column_name='rating') then
    alter table reviews alter column rating type numeric(2,1) using rating::numeric;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'reviews_rating_half_step_check') then
    alter table reviews add constraint reviews_rating_half_step_check
    check (rating >= 0.5 and rating <= 5 and mod((rating * 10)::int, 5) = 0);
  end if;
end $$;

-- Real analytics for funnel, colors, sizes, carts, checkout, coupons, orders.
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  session_id text,
  path text,
  referrer text,
  language text,
  device text,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index if not exists analytics_events_event_name_idx on analytics_events(event_name);
create index if not exists analytics_events_session_idx on analytics_events(session_id);
create index if not exists analytics_events_path_idx on analytics_events(path);
create index if not exists analytics_events_created_idx on analytics_events(created_at desc);

-- Customer intelligence view based on orders; no duplicated customer table required.
create or replace view customer_intelligence as
select
  coalesce(customer_phone, customer_email, customer_name) as customer_key,
  max(customer_name) as customer_name,
  max(customer_phone) as customer_phone,
  max(customer_email) as customer_email,
  max(governorate) as governorate,
  max(city) as city,
  count(*) as order_count,
  sum(total) as total_spent,
  max(created_at) as last_order_at
from orders
group by coalesce(customer_phone, customer_email, customer_name);

-- SEO/System Health pages remain available by direct route but are hidden from daily Studio navigation.
create table if not exists seo_pages (
  id uuid primary key default gen_random_uuid(),
  path text unique not null,
  title_en text,
  title_ar text,
  description_en text,
  description_ar text,
  noindex boolean default false,
  structured_data jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

insert into seo_pages(path, title_en, title_ar, description_en, description_ar, noindex)
values
  ('/', 'NEXORA | Quiet Luxury Fashion Essentials', 'NEXORA | أساسيات فاخرة بهدوء', 'Refined fashion essentials with COD, clear returns, and Arabic/English shopping.', 'أساسيات أزياء فاخرة بهدوء مع دفع عند الاستلام وتجربة عربية/إنجليزية واضحة.', false),
  ('/shop', 'Shop NEXORA', 'تسوق NEXORA', 'Browse products, colors, sizes, and limited essentials.', 'تصفح المنتجات والألوان والمقاسات والإصدارات المحدودة.', false),
  ('/nexora-admin', 'NEXORA Studio', 'استوديو NEXORA', 'Private operations portal.', 'لوحة تشغيل خاصة.', true)
on conflict (path) do nothing;
