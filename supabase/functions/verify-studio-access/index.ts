import { corsHeaders, createStudioToken, json } from '../_shared/studio.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { pin } = await req.json();
    const expected = Deno.env.get('STUDIO_ACCESS_PIN');
    if (!expected || String(pin || '').trim() !== expected) return json({ error: 'Invalid access code.' }, 401);
    return json(await createStudioToken());
  } catch {
    return json({ error: 'Could not verify access.' }, 400);
  }
});
