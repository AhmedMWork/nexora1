# NEXORA V4.9 Deployment Steps

## 1. Supabase SQL
Run in SQL Editor:

```txt
SUPABASE_SCHEMA.sql
SUPABASE_RLS_POLICIES.sql
SUPABASE_V4_1_SCHEMA.sql
SUPABASE_V4_1_RLS.sql
SUPABASE_FINAL_SCHEMA.sql
SUPABASE_FINAL_RLS.sql
```

If a policy already exists, use the FINAL files as the latest reference.

## 2. Supabase Secrets
Add in Supabase Edge Functions Secrets:

```txt
SUPABASE_SERVICE_ROLE_KEY=server-only-secret
STUDIO_SESSION_SECRET=long-random-secret
REQUIRE_STUDIO_PIN=false
```

Optional:

```txt
REQUIRE_STUDIO_PIN=true
STUDIO_ACCESS_PIN=your-pin
```

## 3. Deploy Edge Functions

```powershell
cd "D:\nexora\NEXORA_V4\NEXORA_V4"
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-supabase-functions.ps1
```

## 4. Vercel Environment Variables

```txt
VITE_SUPABASE_URL=https://ccmuazjkgzjqzybxwrfd.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_STORE_WHATSAPP=01037141322
VITE_SUPPORT_EMAIL=supportnexorastoree@gmail.com
```

## 5. Build

```powershell
npm config set registry https://registry.npmjs.org/
npm install
npm run build
```

## 6. Google
Replace `public/google-site-verification.html` with the real file from Google Search Console and submit:

```txt
https://nexora1-one.vercel.app/sitemap.xml
```
