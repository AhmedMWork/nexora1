import { corsHeaders, json, requireStudio, serviceClient } from '../_shared/studio.ts';
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const blocked = await requireStudio(req); if (blocked) return blocked;
  const supabase = serviceClient();
  const body = await req.json();
  try {
    if (body.action === 'list') { const { data, error } = await supabase.from('drops').select('*').order('created_at', { ascending: false }); if (error) throw error; return json({ drops: data || [] }); }
    const d = body.drop || {};
    const row = { name_en: d.name, slug: d.slug, description_en: d.description, hero_image: d.heroImage, status: d.status, starts_at: d.launchDate, ends_at: d.endDate, show_countdown: d.showCountdown, seo_title: d.seoTitle, seo_description: d.seoDescription };
    if (body.action === 'create') { const { data, error } = await supabase.from('drops').insert(row).select('id').single(); if (error) throw error; return json({ id: data.id }); }
    if (body.action === 'update') { const { error } = await supabase.from('drops').update(row).eq('id', body.id); if (error) throw error; return json({ ok: true }); }
    if (body.action === 'delete') { const { error } = await supabase.from('drops').update({ status: 'archived' }).eq('id', body.id); if (error) throw error; return json({ ok: true }); }
    return json({ error: 'Unknown action.' }, 400);
  } catch (error) { return json({ error: error instanceof Error ? error.message : 'Studio drops request failed.' }, 500); }
});
