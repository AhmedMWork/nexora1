import { corsHeaders, json, requireStudio, serviceClient } from '../_shared/studio.ts';
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const blocked = await requireStudio(req); if (blocked) return blocked;
  const supabase = serviceClient();
  const body = await req.json();
  try {
    if (body.action === 'list') { const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false }); if (error) throw error; return json({ coupons: data || [] }); }
    if (body.action === 'create') { const { data, error } = await supabase.from('coupons').insert(body.coupon).select('id').single(); if (error) throw error; return json({ id: data.id }); }
    if (body.action === 'update') { const { error } = await supabase.from('coupons').update(body.coupon).eq('id', body.id); if (error) throw error; return json({ ok: true }); }
    if (body.action === 'delete') { const { error } = await supabase.from('coupons').update({ status: 'archived' }).eq('id', body.id); if (error) throw error; return json({ ok: true }); }
    return json({ error: 'Unknown action.' }, 400);
  } catch (error) { return json({ error: error instanceof Error ? error.message : 'Studio coupons request failed.' }, 500); }
});
