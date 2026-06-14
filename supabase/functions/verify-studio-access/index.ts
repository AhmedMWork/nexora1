import { corsHeaders, createStudioToken, json } from '../_shared/studio.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const pin = String(body?.pin || '').trim();

    const expected = String(Deno.env.get('STUDIO_ACCESS_PIN') || '').trim();

    if (!expected || pin !== expected) {
      return json(
        {
          error: 'Invalid access code.',
        },
        401,
      );
    }

    return json(await createStudioToken());
  } catch {
    return json(
      {
        error: 'Could not verify access.',
      },
      400,
    );
  }
});
