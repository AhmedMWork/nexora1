import { corsHeaders, json, requireStudio, serviceClient } from '../_shared/studio.ts';

function toIso(value: unknown) {
  if (!value) return undefined;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function promotionToRow(promotion: Record<string, unknown>) {
  const row: Record<string, unknown> = {
    title: promotion.title,
    subtitle: promotion.subtitle,
    type: promotion.type,
    discount_type: promotion.discount_type ?? promotion.discountType,
    discount_value: promotion.discount_value ?? promotion.discountValue,
    target_ids: promotion.target_ids ?? promotion.targetIds ?? [],
    status: promotion.status,
    start_date: toIso(promotion.start_date ?? promotion.startDate),
    end_date: toIso(promotion.end_date ?? promotion.endDate),
    banner_text: promotion.banner_text ?? promotion.bannerText,
    show_on_home: promotion.show_on_home ?? promotion.showOnHome,
    show_on_product: promotion.show_on_product ?? promotion.showOnProduct,
    show_on_cart: promotion.show_on_cart ?? promotion.showOnCart,
    show_countdown: promotion.show_countdown ?? promotion.showCountdown,
  };
  Object.keys(row).forEach((key) => row[key] === undefined && delete row[key]);
  return row;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const blocked = await requireStudio(req);
  if (blocked) return blocked;

  const supabase = serviceClient();
  const body = await req.json().catch(() => ({}));

  try {
    if (body.action === 'list') {
      const { data, error } = await supabase.from('promotions').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return json({ promotions: data || [] });
    }

    if (body.action === 'create') {
      const { data, error } = await supabase.from('promotions').insert(promotionToRow(body.promotion || {})).select('id').single();
      if (error) throw error;
      return json({ id: data.id });
    }

    if (body.action === 'update') {
      const { error } = await supabase.from('promotions').update(promotionToRow(body.promotion || {})).eq('id', body.id);
      if (error) throw error;
      return json({ ok: true });
    }

    if (body.action === 'delete') {
      const { error } = await supabase.from('promotions').update({ status: 'archived' }).eq('id', body.id);
      if (error) throw error;
      return json({ ok: true });
    }

    return json({ error: 'Unknown action.' }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Studio promotions request failed.' }, 500);
  }
});
