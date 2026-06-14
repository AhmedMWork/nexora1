import { corsHeaders, json, requireStudio, serviceClient } from '../_shared/studio.ts';
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const blocked = await requireStudio(req); if (blocked) return blocked;
  const supabase = serviceClient();
  const body = await req.json();
  try {
    if (body.action === 'list') { const { data, error } = await supabase.from('reviews').select('*').order('sort_order').order('created_at', { ascending: false }); if (error) throw error; return json({ reviews: data || [] }); }
    if (body.action === 'create') { const r = body.review; const { data, error } = await supabase.from('reviews').insert({ product_id: r.productId || null, product_name: r.productName, customer_name: r.customerName, rating: r.rating, title: r.title, body_en: r.body, featured: r.isFeatured, status: r.isApproved ? 'published' : 'draft' }).select('id').single(); if (error) throw error; return json({ id: data.id }); }
    if (body.action === 'update') { const r = body.review; const patch: Record<string, unknown> = {}; if ('customerName' in r) patch.customer_name = r.customerName; if ('rating' in r) patch.rating = r.rating; if ('title' in r) patch.title = r.title; if ('body' in r) patch.body_en = r.body; if ('isFeatured' in r) patch.featured = r.isFeatured; if ('isApproved' in r) patch.status = r.isApproved ? 'published' : 'draft'; const { error } = await supabase.from('reviews').update(patch).eq('id', body.id); if (error) throw error; return json({ ok: true }); }
    if (body.action === 'delete') { const { error } = await supabase.from('reviews').update({ status: 'archived' }).eq('id', body.id); if (error) throw error; return json({ ok: true }); }
    return json({ error: 'Unknown action.' }, 400);
  } catch (error) { return json({ error: error instanceof Error ? error.message : 'Studio reviews request failed.' }, 500); }
});
