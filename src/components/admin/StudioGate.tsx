// ============================================================
// NEXORA V4 — Supabase Studio Access Gate
// Link-only studio entrance protected by an access code. The code is
// verified by a Supabase Edge Function when deployed, with a safe local
// fallback for development.
// ============================================================

import { type FormEvent, type ReactNode, useState } from 'react';
import { Shield } from 'lucide-react';
import { supabase, setStudioToken } from '@/lib/supabase/client';

const SESSION_KEY = 'nexora-studio-access-v4';

export default function StudioGate({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke<{ token: string; expiresAt: string }>('verify-studio-access', {
        body: { pin: value.trim() },
      });

      if (error || !data?.token) {
        const localFallback = import.meta.env.DEV && value.trim() === (import.meta.env.VITE_STUDIO_ACCESS_CODE || 'NEXORA-STUDIO');
        if (!localFallback) throw new Error('Access code is not valid.');
        setStudioToken(`local-dev-${Date.now()}`);
      } else {
        setStudioToken(data.token);
      }

      sessionStorage.setItem(SESSION_KEY, 'true');
      setIsUnlocked(true);
    } catch (err) {
      const localFallback = import.meta.env.DEV && value.trim() === (import.meta.env.VITE_STUDIO_ACCESS_CODE || 'NEXORA-STUDIO');
      if (localFallback) {
        setStudioToken(`local-dev-${Date.now()}`);
        sessionStorage.setItem(SESSION_KEY, 'true');
        setIsUnlocked(true);
      } else {
        setError(err instanceof Error ? err.message : 'Access code is not valid.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUnlocked) return <>{children}</>;

  return (
    <main className="min-h-screen bg-[var(--v33-bg)] text-[var(--v33-text)] flex items-center justify-center px-5">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--v33-accent) 26%, transparent), transparent 28rem), linear-gradient(135deg, var(--v33-card), var(--v33-bg))' }} />
      <form onSubmit={submit} className="relative w-full max-w-md v34-admin-panel p-6 sm:p-8 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full v34-logo-plate">
          <picture>
            <source srcSet="/assets/nexora-logo-ivory.png" media="(prefers-color-scheme: dark)" />
            <img src="/assets/nexora-logo-dark.png" alt="NEXORA" className="h-16 w-16 object-contain" />
          </picture>
        </div>
        <p className="v3-kicker mb-3">NEXORA Studio</p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em]">Private operations portal</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--v33-muted)]">Enter the studio access code to manage products, orders, drops, reviews, and settings.</p>
        <label className="mt-7 block text-left text-[10px] font-black uppercase tracking-[0.22em] text-[var(--v33-muted)]">Access Code</label>
        <input
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(''); }}
          autoFocus
          type="password"
          className="nexora-input mt-2 text-center tracking-[0.18em]"
          placeholder="••••••••"
        />
        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
        <button className="nexora-button-primary mt-6 w-full" type="submit" disabled={isSubmitting}><Shield className="h-4 w-4" /> {isSubmitting ? 'Verifying...' : 'Enter Studio'}</button>
        <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-[var(--v33-subtle)]">Link-only access. Not visible on the storefront.</p>
      </form>
    </main>
  );
}
