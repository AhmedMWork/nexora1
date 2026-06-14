import { corsHeaders, json, requireStudio, serviceClient } from '../_shared/studio.ts';

function toIso(value: unknown) {
  if (!value) return undefined;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function couponToRow(coupon: Record<string, unknown>) {
  const row: Record<string, unknown> = {
    code: coupon.code ? String(coupon.code).trim().toUpperCase() : undefined,
    title: coupon.title,
    description: coupon.description,
    type: coupon.type,
    value: coupon.value,
    min_order_amount: coupon.min_order_amount ?? coupon.minOrderAmount,
    max_discount_amount: coupon.max_discount_amount ?? coupon.maxDiscountAmount,
    usage_limit: coupon.usage_limit ?? coupon.usageLimit,
    used_count: coupon.used_count ?? coupon.usedCount,
    per_customer_limit: coupon.per_customer_limit ?? coupon.perCustomerLimit,
    start_date: toIso(coupon.start_date ?? coupon.startDate),
    end_date: toIso(coupon.end_date ?? coupon.endDate),
    status: coupon.status ?? ((coupon.isActive as boolean | undefined) === false ? 'paused' : (coupon.isActive as boolean | undefined) === true ? 'active' : undefined),
    allowed_product_ids: coupon.allowed_product_ids ?? coupon.allowedProductIds ?? [],
    excluded_product_ids: coupon.excluded_product_ids ?? coupon.excludedProductIds ?? [],
    allowed_categories: coupon.allowed_categories ?? coupon.allowedCategories ?? [],
    excluded_categories: coupon.excluded_categories ?? coupon.excludedCategories ?? [],
    first_order_only: coupon.first_order_only ?? coupon.firstOrderOnly ?? false,
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
      const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return json({ coupons: data || [] });
    }

    if (body.action === 'create') {
      const { data, error } = await supabase.from('coupons').insert(couponToRow(body.coupon || {})).select('id').single();
      if (error) throw error;
      return json({ id: data.id });
    }

    if (body.action === 'update') {
      const { error } = await supabase.from('coupons').update(couponToRow(body.coupon || {})).eq('id', body.id);
      if (error) throw error;
      return json({ ok: true });
    }

    if (body.action === 'delete') {
      const { error } = await supabase.from('coupons').update({ status: 'archived' }).eq('id', body.id);
      if (error) throw error;
      return json({ ok: true });
    }

    return json({ error: 'Unknown action.' }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Studio coupons request failed.' }, 500);
  }
});
