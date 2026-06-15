# NEXORA V4.1 — Setup

## 1. Install Dependencies

```powershell
cd "D:\nexora\NEXORA_V4_1\NEXORA_V4"
npm config set registry https://registry.npmjs.org/
npm install
```

## 2. Create `.env`

```env
VITE_SUPABASE_URL=https://ccmuazjkgzjqzybxwrfd.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_or_anon_key
VITE_STORE_WHATSAPP=01037141322
VITE_SUPPORT_EMAIL=supportnexorastoree@gmail.com
```

## 3. Supabase SQL

For a new database:

1. Open Supabase SQL Editor.
2. Run `SUPABASE_SCHEMA.sql`.
3. Run `SUPABASE_RLS_POLICIES.sql`.

For an existing V4/V4_Fix database:

1. Run `SUPABASE_V4_1_SCHEMA.sql`.
2. Run `SUPABASE_V4_1_RLS.sql`.

## 4. Supabase Storage

Create bucket:

```txt
products
```

Set it as public.

## 5. Supabase Secrets

In Supabase Dashboard → Edge Functions → Secrets, add:

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

For open link-only studio during setup:

```txt
REQUIRE_STUDIO_PIN=false
```

## 6. Deploy Functions

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-supabase-functions.ps1
```

## 7. Run Locally

```powershell
npm run dev
```

Open:

```txt
http://localhost:5173
http://localhost:5173/studio
```

## 8. Build

```powershell
npm run lint
npm run build
```
