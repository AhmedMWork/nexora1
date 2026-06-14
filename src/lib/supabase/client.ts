// ============================================================
// NEXORA V4_Fix — Supabase Client
// Public anon client only. Service-role operations live in
// Supabase Edge Functions and must never be exposed to the browser.
// ============================================================

import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://ccmuazjkgzjqzybxwrfd.supabase.co') as string;
export const supabaseKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'missing-supabase-publishable-key') as string;

if (!import.meta.env.VITE_SUPABASE_URL || !(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn('Missing Supabase environment variables. Public data will use local seed fallback where available.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

const STUDIO_TOKEN_KEY = 'nexora-studio-token-v4';
const STUDIO_ACCESS_KEY = 'nexora-studio-access-v4';

export function getStudioToken(): string | null {
  return sessionStorage.getItem(STUDIO_TOKEN_KEY);
}

export function setStudioToken(token: string): void {
  sessionStorage.setItem(STUDIO_TOKEN_KEY, token);
  sessionStorage.setItem(STUDIO_ACCESS_KEY, 'true');
}

export function clearStudioToken(): void {
  sessionStorage.removeItem(STUDIO_TOKEN_KEY);
  sessionStorage.removeItem(STUDIO_ACCESS_KEY);
}

export async function createStudioSession(pin = ''): Promise<string> {
  const { data, error } = await supabase.functions.invoke<{ token: string; expiresAt: string }>('verify-studio-access', {
    body: { pin },
  });

  if (error || !data?.token) {
    throw new Error(error?.message || 'Could not open Studio session.');
  }

  setStudioToken(data.token);
  return data.token;
}

export async function ensureStudioToken(): Promise<string> {
  const existing = getStudioToken();
  if (existing) return existing;
  return createStudioSession();
}

export async function invokeStudioFunction<TPayload extends Record<string, unknown>, TResult>(
  name: string,
  payload: TPayload,
): Promise<TResult> {
  let token = await ensureStudioToken();

  let { data, error } = await supabase.functions.invoke<TResult>(name, {
    body: payload,
    headers: { 'x-studio-token': token },
  });

  const maybeExpired = error && /unauthorized|jwt|token|401/i.test(error.message || '');
  if (maybeExpired) {
    clearStudioToken();
    token = await createStudioSession();
    const retry = await supabase.functions.invoke<TResult>(name, {
      body: payload,
      headers: { 'x-studio-token': token },
    });
    data = retry.data;
    error = retry.error;
  }

  if (error) throw new Error(error.message || 'Studio request failed.');
  return data as TResult;
}
