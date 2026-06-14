import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

export const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') || '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-studio-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

export function serviceClient() {
  const url = Deno.env.get('SUPABASE_URL')!;
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function hmacSHA256(message: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function createStudioToken() {
  const secret = Deno.env.get('STUDIO_SESSION_SECRET') || Deno.env.get('STUDIO_ACCESS_PIN') || 'dev-secret';
  const expiresAt = Date.now() + 1000 * 60 * 60 * 8;
  const payload = btoa(JSON.stringify({ scope: 'studio', exp: expiresAt })).replace(/=+$/, '');
  const signature = await hmacSHA256(payload, secret);
  return { token: `${payload}.${signature}`, expiresAt: new Date(expiresAt).toISOString() };
}

export async function verifyStudioToken(req: Request) {
  const token = req.headers.get('x-studio-token') || '';
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const secret = Deno.env.get('STUDIO_SESSION_SECRET') || Deno.env.get('STUDIO_ACCESS_PIN') || 'dev-secret';
  const expected = await hmacSHA256(payload, secret);
  if (expected !== signature) return false;
  try {
    const data = JSON.parse(atob(payload));
    return data.scope === 'studio' && Date.now() < Number(data.exp || 0);
  } catch {
    return false;
  }
}

export async function requireStudio(req: Request) {
  if (!(await verifyStudioToken(req))) return json({ error: 'Unauthorized studio request.' }, 401);
  return null;
}
