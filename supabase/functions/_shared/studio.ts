import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

// NEXORA V4_Fix — permissive, reliable CORS for browser Edge Function calls.
// No cookies/credentials are used, so '*' avoids domain mismatch issues during Vercel previews.
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-studio-token, x-nexora-client, x-supabase-api-version, accept, origin, prefer',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

export function serviceClient() {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!url) throw new Error('Missing SUPABASE_URL secret.');
  if (!key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY secret.');

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function hmacSHA256(message: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));

  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlEncode(value: unknown) {
  return btoa(JSON.stringify(value))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    '=',
  );

  return JSON.parse(atob(padded));
}

function sessionSecret() {
  return (
    Deno.env.get('STUDIO_SESSION_SECRET') ||
    Deno.env.get('STUDIO_ACCESS_PIN') ||
    'nexora-v4-fix-link-only-session'
  );
}

export async function createStudioToken() {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 12;

  const payload = base64UrlEncode({
    scope: 'studio',
    exp: expiresAt,
    iat: Date.now(),
  });

  const signature = await hmacSHA256(payload, sessionSecret());

  return {
    token: `${payload}.${signature}`,
    expiresAt: new Date(expiresAt).toISOString(),
  };
}

export async function verifyStudioToken(req: Request) {
  const token = req.headers.get('x-studio-token') || '';
  const [payload, signature] = token.split('.');

  if (!payload || !signature) return false;

  const expected = await hmacSHA256(payload, sessionSecret());
  if (expected !== signature) return false;

  try {
    const data = base64UrlDecode(payload);
    return data.scope === 'studio' && Date.now() < Number(data.exp || 0);
  } catch {
    return false;
  }
}

export async function requireStudio(req: Request) {
  if (!(await verifyStudioToken(req))) {
    return json({ error: 'Unauthorized studio request. Reopen Studio and try again.' }, 401);
  }

  return null;
}
