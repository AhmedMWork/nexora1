// ============================================================
// NEXORA V4 — Supabase Client
// Public anon client only. Service-role operations live in
// Supabase Edge Functions and must never be exposed to the browser.
// ============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables. Public data will use local seed fallback where available.');
}

export const supabase = createClient(
  supabaseUrl || 'https://ccmuazjkgzjqzybxwrfd.supabase.co',
  supabaseKey || 'missing-supabase-publishable-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'x-nexora-client': 'v4-supabase-luxury-commerce',
      },
    },
  },
);

export function getStudioToken(): string | null {
  return sessionStorage.getItem('nexora-studio-token-v4');
}

export function setStudioToken(token: string): void {
  sessionStorage.setItem('nexora-studio-token-v4', token);
}

export function clearStudioToken(): void {
  sessionStorage.removeItem('nexora-studio-token-v4');
  sessionStorage.removeItem('nexora-studio-access-v4');
}

export async function invokeStudioFunction<TPayload extends Record<string, unknown>, TResult>(
  name: string,
  payload: TPayload,
): Promise<TResult> {
  const token = getStudioToken();
  const { data, error } = await supabase.functions.invoke<TResult>(name, {
    body: payload,
    headers: token ? { 'x-studio-token': token } : undefined,
  });
  if (error) throw new Error(error.message || 'Studio request failed.');
  return data as TResult;
}
