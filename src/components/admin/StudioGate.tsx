// ============================================================
// NEXORA V4_Fix — Link-only Studio Gate
// No password is required by default. Opening the hidden Studio route
// creates a short-lived Edge Function token used for private operations.
// Optional PIN mode can be enabled later from Supabase with REQUIRE_STUDIO_PIN=true.
// ============================================================

import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { Shield, Unlock, RefreshCw } from 'lucide-react';
import { createStudioSession, getStudioToken, setStudioToken } from '@/lib/supabase/client';

const SESSION_KEY = 'nexora-studio-access-v4';
const LOCAL_FALLBACK_TOKEN = 'nexora-v4-fix-local-studio-token';

export default function StudioGate({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true' && !!getStudioToken());
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showManualPin, setShowManualPin] = useState(false);

  const unlock = async (pin = '') => {
    setError('');
    setIsSubmitting(true);
    try {
      await createStudioSession(pin);
      sessionStorage.setItem(SESSION_KEY, 'true');
      setIsUnlocked(true);
    } catch (err) {
      const localCode = import.meta.env.VITE_STUDIO_ACCESS_CODE || 'NEXORA-STUDIO';
      const localFallback = import.meta.env.DEV || (pin && pin === localCode);
      if (localFallback) {
        setStudioToken(`${LOCAL_FALLBACK_TOKEN}-${Date.now()}`);
        sessionStorage.setItem(SESSION_KEY, 'true');
        setIsUnlocked(true);
      } else {
        setShowManualPin(true);
        setError(err instanceof Error ? err.message : 'Could not open Studio. Check Supabase function deployment.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isUnlocked) void unlock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await unlock(value.trim());
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
        <p className="mt-3 text-sm leading-7 text-[var(--v33-muted)]">
          Link-only operations portal for products, orders, limited drops, reviews, coupons, and settings.
        </p>

        {isSubmitting && (
          <div className="mt-7 flex items-center justify-center gap-2 rounded-2xl border border-[var(--v33-border)] bg-[var(--v33-elevated)] px-4 py-3 text-xs text-[var(--v33-muted)]">
            <RefreshCw className="h-4 w-4 animate-spin" /> Opening Studio...
          </div>
        )}

        {showManualPin && (
          <>
            <label className="mt-7 block text-left text-[10px] font-black uppercase tracking-[0.22em] text-[var(--v33-muted)]">Optional Access Code</label>
            <input
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(''); }}
              type="password"
              className="nexora-input mt-2 text-center tracking-[0.18em]"
              placeholder="Only needed if PIN mode is enabled"
            />
          </>
        )}

        {error && <p className="mt-3 text-xs leading-6 text-amber-300">{error}</p>}

        <button className="nexora-button-primary mt-6 w-full" type={showManualPin ? 'submit' : 'button'} disabled={isSubmitting} onClick={showManualPin ? undefined : () => unlock()}>
          {showManualPin ? <Shield className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          {isSubmitting ? 'Opening...' : 'Enter Studio'}
        </button>
        <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-[var(--v33-subtle)]">Hidden route. Not visible on the storefront.</p>
      </form>
    </main>
  );
}
