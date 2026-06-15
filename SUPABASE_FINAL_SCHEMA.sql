-- ============================================================
-- NEXORA V4.9 FINAL SUPABASE SCHEMA PATCH
-- Run after the base V4/V4.1 schema. Safe to re-run.
-- ============================================================

create extension if not exists pgcrypto;

-- Analytics events for conversion funnel, cart abandonment, and product interest.
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
create index if not exists analytics_events_created_idx on analytics_events(created_at desc);

-- Product improvements for admin completeness.
alter table if exists products add column if not exists name_ar text;
alter table if exists products add column if not exists description_ar text;
alter table if exists products add column if not exists short_description_ar text;
alter table if exists products add column if not exists cost_price numeric;
alter table if exists products add column if not exists tags jsonb default '[]'::jsonb;
alter table if exists products add column if not exists badges jsonb default '[]'::jsonb;
alter table if exists products add column if not exists rating numeric default 0;
alter table if exists products add column if not exists review_count integer default 0;
alter table if exists products add column if not exists visibility text default 'public';
alter table if exists products add column if not exists collection text default 'core';

-- Reviews support half-star ratings and images.
alter table if exists reviews alter column rating type numeric(2,1) using rating::numeric;
alter table if exists reviews add column if not exists title text;
alter table if exists reviews add column if not exists images jsonb default '[]'::jsonb;
alter table if exists reviews add column if not exists avatar_url text;
alter table if exists reviews add column if not exists review_image_url text;
alter table if exists reviews add column if not exists source text default 'studio';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'reviews_rating_half_step_check'
  ) then
    alter table reviews add constraint reviews_rating_half_step_check
    check (rating >= 0.5 and rating <= 5 and mod((rating * 10)::int, 5) = 0);
  end if;
end $$;

-- Customer intelligence view/table helper. Orders remain the source of truth.
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

-- SEO content registry for future dynamic SEO management.
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
  ('/', 'NEXORA | Quiet Luxury Fashion Essentials', 'NEXORA | أساسيات فاخرة بهدوء', 'Refined fashion essentials with cash on delivery, clear returns, and a luxury Arabic/English shopping experience.', 'أساسيات أزياء هادئة بتجربة شراء واضحة ودفع عند الاستلام واسترجاع خلال 14 يومًا.', false),
  ('/shop', 'Shop NEXORA', 'متجر NEXORA', 'Browse NEXORA products, colors, sizes, and limited essentials.', 'تصفح منتجات NEXORA والألوان والمقاسات والإصدارات المحدودة.', false),
  ('/nexora-admin', 'NEXORA Studio', 'استوديو NEXORA', 'Private operations portal.', 'لوحة تشغيل خاصة.', true)
on conflict (path) do nothing;

-- Helpful indexes.
create index if not exists products_status_idx on products(status);
create index if not exists products_gender_idx on products(gender);
create index if not exists products_featured_idx on products(featured);
create index if not exists orders_status_idx on orders(order_status);
create index if not exists orders_customer_phone_idx on orders(customer_phone);
create index if not exists orders_created_idx on orders(created_at desc);
create index if not exists coupons_code_idx on coupons(code);


-- V4.9 Fix: selected product color metadata for customer orders.
alter table if exists order_items add column if not exists color text;
alter table if exists order_items add column if not exists color_hex text;
alter table if exists order_items add column if not exists color_pattern text;
