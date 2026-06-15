# NEXORA V4.1 — Supabase Setup Guide

## Project

Project ID:

```txt
ccmuazjkgzjqzybxwrfd
```

Frontend URL:

```env
VITE_SUPABASE_URL=https://ccmuazjkgzjqzybxwrfd.supabase.co
```

Use your Supabase publishable/anon key as:

```env
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

## Database

For a fresh database, run:

1. `SUPABASE_SCHEMA.sql`
2. `SUPABASE_RLS_POLICIES.sql`

For an existing V4/V4_Fix database, run:

1. `SUPABASE_V4_1_SCHEMA.sql`
2. `SUPABASE_V4_1_RLS.sql`

V4.1 adds:

- `analytics_events`
- half-star review ratings
- review images
- updated analytics policies

## Storage

Create a public bucket:

```txt
products
```

Studio media upload uses Edge Functions and Supabase Storage.

## Edge Function Secrets

Set in Supabase Dashboard → Edge Functions → Secrets:

```txt
SUPABASE_SERVICE_ROLE_KEY
STUDIO_SESSION_SECRET
ALLOWED_ORIGIN=https://your-domain.com
```

Optional PIN mode:

```txt
REQUIRE_STUDIO_PIN=true
STUDIO_ACCESS_PIN=your-pin
```

For open link-only Studio during setup:

```txt
REQUIRE_STUDIO_PIN=false
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend/Vercel `VITE_` variables.
