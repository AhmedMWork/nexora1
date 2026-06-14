-- ============================================================
-- NEXORA V4 — Supabase Luxury Commerce Schema
-- Apply in Supabase SQL editor or via `supabase db push`.
-- ============================================================

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.drops (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ar text,
  slug text unique not null,
  description_en text,
  description_ar text,
  hero_image text,
  status text check (status in ('draft','scheduled','live','ended','archived')) default 'draft',
  starts_at timestamptz,
  ends_at timestamptz,
  show_on_home boolean default false,
  show_countdown boolean default false,
  seo_title text,
  seo_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ar text,
  slug text unique not null,
  sku text unique,
  description_en text,
  description_ar text,
  short_description_en text,
  short_description_ar text,
  gender text check (gender in ('men','women','unisex')) default 'unisex',
  category text,
  price numeric not null check (price >= 0),
  compare_at_price numeric,
  cost_price numeric,
  stock_total integer default 0,
  stock_by_size jsonb default '{}'::jsonb,
  sizes jsonb default '[]'::jsonb,
  colors jsonb default '[]'::jsonb,
  images jsonb default '[]'::jsonb,
  status text check (status in ('draft','active','hidden','archived','sold_out')) default 'draft',
  visibility text check (visibility in ('public','private','scheduled')) default 'public',
  is_limited boolean default false,
  drop_id uuid references public.drops(id) on delete set null,
  featured boolean default false,
  best_seller boolean default false,
  new_arrival boolean default false,
  material_en text,
  material_ar text,
  fit_en text,
  fit_ar text,
  care_en text,
  care_ar text,
  rating numeric default 0,
  review_count integer default 0,
  tags jsonb default '[]'::jsonb,
  badges jsonb default '[]'::jsonb,
  seo_title text,
  seo_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  bucket text default 'products',
  path text not null,
  public_url text not null,
  alt_en text,
  alt_ar text,
  is_primary boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  governorate text,
  city text,
  address text not null,
  notes text,
  subtotal numeric not null default 0,
  discount_total numeric default 0,
  shipping_fee numeric default 0,
  total numeric not null default 0,
  payment_method text check (payment_method = 'cod') default 'cod',
  payment_status text check (payment_status in ('pending','collected','failed','refunded')) default 'pending',
  order_status text check (order_status in ('pending','confirmed','preparing','packed','shipped','out_for_delivery','delivered','cancelled','returned','failed')) default 'pending',
  coupon_code text,
  admin_notes text,
  status_history jsonb default '[]'::jsonb,
  source text default 'web',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  product_name text not null,
  slug text,
  size text,
  color text,
  quantity integer not null check (quantity > 0),
  unit_price numeric not null,
  total numeric not null,
  image text,
  created_at timestamptz default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title text,
  description text,
  type text check (type in ('percentage','fixed','free_shipping')) default 'percentage',
  value numeric default 0,
  min_order_amount numeric default 0,
  max_discount_amount numeric,
  usage_limit integer default 0,
  used_count integer default 0,
  per_customer_limit integer,
  start_date timestamptz default now(),
  end_date timestamptz default now() + interval '30 days',
  status text check (status in ('draft','scheduled','active','paused','expired','ended','archived')) default 'draft',
  allowed_product_ids jsonb default '[]'::jsonb,
  excluded_product_ids jsonb default '[]'::jsonb,
  allowed_categories jsonb default '[]'::jsonb,
  excluded_categories jsonb default '[]'::jsonb,
  first_order_only boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  type text default 'storewide',
  discount_type text default 'percentage',
  discount_value numeric default 0,
  target_ids jsonb default '[]'::jsonb,
  status text default 'draft',
  start_date timestamptz default now(),
  end_date timestamptz default now() + interval '7 days',
  banner_text text,
  show_on_home boolean default false,
  show_on_product boolean default false,
  show_on_cart boolean default false,
  show_countdown boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  product_name text,
  customer_name text not null,
  rating integer check (rating between 1 and 5) default 5,
  title text,
  body_en text not null,
  body_ar text,
  images jsonb default '[]'::jsonb,
  featured boolean default false,
  status text check (status in ('draft','published','hidden','archived')) default 'published',
  helpful_count integer default 0,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_settings (
  id text primary key default 'main',
  brand_name text default 'NEXORA',
  logo text default '/assets/nexora-logo.png',
  favicon text default '/assets/nexora-logo.png',
  whatsapp_number text default '01037141322',
  support_email text default 'supportnexorastoree@gmail.com',
  shipping_fee numeric default 0,
  free_shipping_threshold numeric default 0,
  currency text default 'EGP',
  cod_enabled boolean default true,
  default_language text default 'en',
  default_theme text default 'light',
  announcement_en text,
  announcement_ar text,
  maintenance_mode boolean default false,
  social_links jsonb default '{}'::jsonb,
  seo jsonb default '{"title":"NEXORA — Limited Fashion Essentials","description":"Premium essentials, limited releases, and refined everyday pieces by NEXORA.","keywords":"NEXORA,fashion,limited,essentials"}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.inventory_logs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  sku text,
  size text,
  change integer not null,
  reason text default 'manual_adjustment',
  previous_stock integer default 0,
  new_stock integer default 0,
  order_id uuid references public.orders(id) on delete set null,
  admin_id text,
  note text,
  created_at timestamptz default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id text,
  admin_email text,
  action text not null,
  entity_type text not null,
  entity_id text,
  before jsonb,
  after jsonb,
  created_at timestamptz default now()
);

create table if not exists public.newsletter (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  is_active boolean default true,
  subscribed_at timestamptz default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

insert into public.site_settings (id) values ('main') on conflict (id) do nothing;

create trigger set_products_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger set_drops_updated_at before update on public.drops for each row execute function public.set_updated_at();
create trigger set_orders_updated_at before update on public.orders for each row execute function public.set_updated_at();
create trigger set_coupons_updated_at before update on public.coupons for each row execute function public.set_updated_at();
create trigger set_reviews_updated_at before update on public.reviews for each row execute function public.set_updated_at();

create index if not exists idx_products_status_gender on public.products(status, gender);
create index if not exists idx_products_limited on public.products(is_limited, status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_reviews_status_featured on public.reviews(status, featured);
create index if not exists idx_drops_status on public.drops(status);
