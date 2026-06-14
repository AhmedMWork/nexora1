import { corsHeaders, json, requireStudio, serviceClient } from '../_shared/studio.ts';
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const blocked = await requireStudio(req); if (blocked) return blocked;
  const supabase = serviceClient();
  const body = await req.json();
  try {
    if (body.action === 'update') { const s = body.settings || {}; const patch = { brand_name: s.storeName, logo: s.logo, favicon: s.favicon, shipping_fee: s.shippingFee, free_shipping_threshold: s.freeShippingThreshold, whatsapp_number: s.whatsappNumber, support_email: s.supportEmail, currency: s.currency, cod_enabled: s.codEnabled, maintenance_mode: s.maintenanceMode, default_language: s.defaultLanguage, default_theme: s.defaultTheme, social_links: s.socialLinks, seo: s.seo }; Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]); const { error } = await supabase.from('site_settings').update(patch).eq('id', 'main'); if (error) throw error; return json({ ok: true }); }
    if (body.action === 'audit-logs') { const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(300); if (error) throw error; return json({ logs: data || [] }); }
    if (body.action === 'newsletter') { const { data, error } = await supabase.from('newsletter').select('*').order('subscribed_at', { ascending: false }); if (error) throw error; return json({ subscribers: data || [] }); }
    if (body.action === 'contact-messages') { const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }); if (error) throw error; return json({ messages: data || [] }); }
    if (body.action === 'audit-log') { const { data, error } = await supabase.from('audit_logs').insert(body.log).select('id').single(); if (error) throw error; return json({ id: data.id }); }
    return json({ error: 'Unknown action.' }, 400);
  } catch (error) { return json({ error: error instanceof Error ? error.message : 'Studio settings request failed.' }, 500); }
});
