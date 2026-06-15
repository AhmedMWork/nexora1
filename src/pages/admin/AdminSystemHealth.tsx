import { useMemo } from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, Server, Database, HardDrive, SearchCheck, Globe2 } from 'lucide-react';
import { SITE_URL } from '@/lib/constants';
import { supabaseKey, supabaseUrl } from '@/lib/supabase/client';

function StatusCard({ title, ok, helper, icon: Icon }: { title: string; ok: boolean; helper: string; icon: React.ElementType }) {
  return (
    <div className="studio-card p-5">
      <div className="mb-3 flex items-start justify-between gap-4">
        <Icon className="h-5 w-5 text-[#D2B48C]" />
        {ok ? <CheckCircle2 className="h-5 w-5 text-emerald-300" /> : <AlertTriangle className="h-5 w-5 text-amber-300" />}
      </div>
      <h2 className="text-sm font-semibold text-[#FFF0E1]">{title}</h2>
      <p className="mt-2 text-xs leading-6 text-[#BCAEA0]">{helper}</p>
    </div>
  );
}

export default function AdminSystemHealth() {
  const checks = useMemo(() => [
    { title: 'Supabase URL', ok: Boolean(supabaseUrl && supabaseUrl.includes('supabase.co')), helper: `Connected to: ${supabaseUrl}`, icon: Database },
    { title: 'Publishable Key', ok: Boolean(supabaseKey && !supabaseKey.includes('missing')), helper: 'Frontend uses public publishable/anon key only. Service role must stay inside Supabase Secrets.', icon: ShieldCheck },
    { title: 'Storage Bucket', ok: true, helper: 'Expected public product image bucket: products. Upload and delete operations are routed through Studio Edge Functions.', icon: HardDrive },
    { title: 'Edge Functions', ok: true, helper: 'Deploy all functions with scripts/deploy-supabase-functions.ps1 after any server-side change.', icon: Server },
    { title: 'Vercel Routing', ok: true, helper: 'vercel.json rewrites all SPA routes to index.html to prevent blank/404 pages on direct refresh.', icon: Globe2 },
    { title: 'Google Files', ok: true, helper: 'robots.txt, sitemap.xml, manifest, and Google verification placeholder are included. Replace verification file with the real Search Console file.', icon: SearchCheck },
  ], []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#FFF0E1]">System Health</h1>
        <p className="mt-1 text-sm text-[#BCAEA0]">Launch-readiness checklist for Supabase, Vercel, SEO files, storage, and Studio operations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {checks.map((check) => <StatusCard key={check.title} {...check} />)}
      </div>

      <div className="studio-card p-6">
        <h2 className="text-sm font-semibold text-[#FFF0E1]">Production deployment order</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-[#BCAEA0]">
          <li>Run <span className="text-[#FFF0E1]">SUPABASE_FINAL_SCHEMA.sql</span> then <span className="text-[#FFF0E1]">SUPABASE_FINAL_RLS.sql</span> in Supabase SQL Editor.</li>
          <li>Confirm Supabase Secrets: SUPABASE_SERVICE_ROLE_KEY, STUDIO_SESSION_SECRET, and optional REQUIRE_STUDIO_PIN/STUDIO_ACCESS_PIN.</li>
          <li>Deploy every Edge Function with <span className="text-[#FFF0E1]">scripts/deploy-supabase-functions.ps1</span>.</li>
          <li>Add Vercel env vars: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_STORE_WHATSAPP, VITE_SUPPORT_EMAIL.</li>
          <li>Redeploy Vercel and test {SITE_URL}/nexora-admin, checkout, images, coupons, and mobile routes.</li>
        </ol>
      </div>
    </div>
  );
}
