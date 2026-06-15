-- ============================================================
-- NEXORA V4.1 — Incremental Supabase Upgrade
-- Run this after the original V4 schema if your project is already live.
-- Safe to run multiple times.
-- ============================================================

create extension if not exists pgcrypto;

alter table if exists public.reviews
  alter column rating type numeric(2,1) using rating::numeric(2,1),
  alter column rating set default 5;

alter table if exists public.reviews
  drop constraint if exists reviews_rating_check;

alter table if exists public.reviews
  add constraint reviews_rating_check check (rating >= 0.5 and rating <= 5);

alter table if exists public.reviews
  add column if not exists images jsonb default '[]'::jsonb,
  add column if not exists helpful_count integer default 0,
  add column if not exists sort_order integer default 0;

create table if not exists public.analytics_events (
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

create index if not exists idx_analytics_events_created on public.analytics_events(created_at desc);
create index if not exists idx_analytics_events_name on public.analytics_events(event_name);
create index if not exists idx_analytics_events_session on public.analytics_events(session_id);

alter table public.analytics_events enable row level security;
drop policy if exists "Public can insert analytics events" on public.analytics_events;
create policy "Public can insert analytics events" on public.analytics_events for insert with check (true);
